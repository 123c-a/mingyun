import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { create } from 'zustand'
import { useVoxelWorldStore, BLOCK_DEFS, HOTBAR_BLOCKS, type BlockType, getTerrainHeight, getNaturalBlock, getDecoration, getBiome } from '../voxel/voxelWorldStore'
import { useShapeStore, type Piece } from '../healing/healingStore'
import { DestinyPanel } from './DestinyPanel'
import { WaterPhysicsDebugPanel } from './WaterPhysicsDebugPanel'
import * as THREE from 'three'

// ============ 全局状态：玩家、工具、热键 ============
interface GameStore {
  pos: [number, number, number]
  vel: [number, number, number]
  yaw: number
  pitch: number
  tool: 'place' | 'remove' | 'none'
  selectedSlot: number
  hotbar: BlockType[]
  keys: Record<string, boolean>
  spawned: boolean
  setKey: (key: string, down: boolean) => void
  setLook: (yaw: number, pitch: number) => void
  setPos: (pos: [number, number, number]) => void
  setVel: (vel: [number, number, number]) => void
  setTool: (t: 'place' | 'remove' | 'none') => void
  setSlot: (i: number) => void
  setSpawned: (b: boolean) => void
}

export const useGameStore = create<GameStore>((set) => ({
  // FIX: y=100 让玩家起始在高空，首帧 snap-to-ground 落到正确位置
  pos: [0, 100, 0], vel: [0, 0, 0], yaw: 0, pitch: -0.2,
  tool: 'place', selectedSlot: 0, hotbar: HOTBAR_BLOCKS, keys: {}, spawned: false,
  setKey: (k, d) => set((s) => ({ keys: { ...s.keys, [k]: d } })),
  setLook: (yaw, pitch) => set({ yaw, pitch: Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch)) }),
  setPos: (pos) => set({ pos }), setVel: (vel) => set({ vel }),
  setTool: (t) => set({ tool: t }), setSlot: (i) => set({ selectedSlot: i }),
  setSpawned: (b) => set({ spawned: b }),
}))

const RENDER_RADIUS = 8      // 缩小半径，减少 mesh 数量
const RENDER_VERTICAL = 15   // 缩小垂直范围
const CHUNK_SIZE = 8         // 以 8 格为粒度更新地形

// ============ 动态地形：分块更新 + 固定容量 InstancedMesh ============
// FIX: 1) 只在跨越 8-tile chunk 边界时重算地形（useGameStore 用 chunk-key 选择器）
//      2) InstancedMesh 的 args 用固定大容量（不随 positions.length 变）
//         → R3F 永远不会 dispose/重建 mesh → 不会有一帧黑屏
const INSTANCED_CAPACITY = 10000  // 足够容纳 RENDER_RADIUS=8 内所有地形方块

function VoxelTerrain() {
  const voxelStore = useVoxelWorldStore()
  const seed = voxelStore.seed

  // 关键：选择器返回字符串 "chunkX-chunkZ"，只有跨越 chunk 边界才变
  // Zustand 用 Object.is 比较 → 同一 chunk 内字符串相等 → 不会触发重渲染
  const chunkKey = useGameStore(
    (s) => `${Math.floor(s.pos[0] / CHUNK_SIZE)}-${Math.floor(s.pos[2] / CHUNK_SIZE)}`
  )

  // 只在跨越 chunk 或玩家放置/删除方块时才重新计算地形数据
  const terrainData = useMemo(() => {
    const { pos } = useGameStore.getState()
    const px = Math.floor(pos[0]), pz = Math.floor(pos[2]), py = Math.floor(pos[1])
    const blocks: { type: BlockType; x: number; y: number; z: number }[] = []
    const specials: { type: BlockType; x: number; y: number; z: number }[] = []

    for (let x = px - RENDER_RADIUS; x <= px + RENDER_RADIUS; x++) {
      for (let z = pz - RENDER_RADIUS; z <= pz + RENDER_RADIUS; z++) {
        const h = getTerrainHeight(x, z, seed)
        const yMin = Math.max(0, Math.min(py - RENDER_VERTICAL, h - 3))
        const yMax = Math.min(py + RENDER_VERTICAL, h + 8)
        for (let y = yMin; y <= yMax; y++) {
          const key = `${x},${y},${z}`
          const placed = voxelStore.blocks.get(key)
          if (placed) {
            const def = BLOCK_DEFS[placed.type]
            ;(def && def.specialShape ? specials : blocks).push({ type: placed.type, x, y, z })
            continue
          }
          const natural = getNaturalBlock(x, y, z, seed)
          if (natural) {
            const def = BLOCK_DEFS[natural]
            ;(def && def.specialShape ? specials : blocks).push({ type: natural, x, y, z })
            continue
          }
          const decs = getDecoration(x, z, seed)
          for (const d of decs) {
            if (d.y === y) {
              const def = BLOCK_DEFS[d.type]
              ;(def && def.specialShape ? specials : blocks).push({ type: d.type, x, y, z })
            }
          }
        }
      }
    }

    // 按类型分组
    const groups: Record<string, { type: BlockType; x: number; y: number; z: number }[]> = {}
    for (const b of blocks) { if (!groups[b.type]) groups[b.type] = []; groups[b.type].push(b) }
    return { groups, specials }
    // 注意：voxelStore.blocks 引用在每次 setBlock 时改变，能触发重算
  }, [chunkKey, seed, voxelStore.blocks])

  return (
    <group>
      {Object.entries(terrainData.groups).map(([type, positions]) =>
        positions.length > 0 ? (
          <InstancedBlock key={type} type={type as BlockType} positions={positions} />
        ) : null
      )}
      {terrainData.specials.map((s, i) => (
        <SpecialBlock key={`sp-${s.x}-${s.y}-${s.z}-${i}`} type={s.type} x={s.x} y={s.y} z={s.z} />
      ))}
    </group>
  )
}

// InstancedMesh：args 固定大容量，永远不 dispose；useFrame 指令式更新矩阵
function InstancedBlock({ type, positions }: {
  type: BlockType; positions: { x: number; y: number; z: number }[]
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const def = BLOCK_DEFS[type]
  const positionsRef = useRef<{ x: number; y: number; z: number }[]>([])
  const dirtyRef = useRef(true)

  // 同步 positions 引用（即使组件不重渲染也能获取最新值）
  useEffect(() => {
    positionsRef.current = positions
    dirtyRef.current = true
  }, [positions])

  // 新挂载时标记 dirty
  useEffect(() => {
    dirtyRef.current = true
  }, [])

  // 渲染前更新矩阵：使用 try-catch 防止渲染崩溃
  useFrame(() => {
    try {
      const m = ref.current
      if (!m) return
      if (!dirtyRef.current) return

      const currentPositions = positionsRef.current
      if (!currentPositions || currentPositions.length === 0) {
        m.count = 0
        return
      }

      const n = Math.min(currentPositions.length, INSTANCED_CAPACITY)
      const dummy = new THREE.Object3D()
      
      for (let i = 0; i < n; i++) {
        const p = currentPositions[i]
        if (!p || isNaN(p.x) || isNaN(p.y) || isNaN(p.z)) continue
        
        dummy.position.set(p.x + 0.5, p.y + 0.5, p.z + 0.5)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        m.setMatrixAt(i, dummy.matrix)
      }
      
      m.count = n
      if (m.instanceMatrix) {
        m.instanceMatrix.needsUpdate = true
      }
      m.computeBoundingSphere()
      dirtyRef.current = false
    } catch (error) {
      console.error('InstancedBlock update error:', error)
      dirtyRef.current = true  // 保持 dirty，下一帧重试
    }
  })

  if (!def) return null

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, INSTANCED_CAPACITY]}
      castShadow
      receiveShadow
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={def.color}
        emissive={def.emissive ? def.color : '#000000'}
        emissiveIntensity={def.emissive || 0}
        transparent={!!def.transparent}
        opacity={def.transparent ? 0.85 : 1}
        roughness={0.85}
        metalness={0.05}
      />
    </instancedMesh>
  )
}

// ============ 特殊形状方块 ============
function SpecialBlock({ type, x, y, z }: { type: BlockType; x: number; y: number; z: number }) {
  const def = BLOCK_DEFS[type]
  if (!def) return null
  const px = x + 0.5, py = y + 0.5, pz = z + 0.5

  if (type === 'flower_red' || type === 'flower_yellow' || type === 'rose') {
    const color = type === 'flower_yellow' ? '#ffcc00' : type === 'rose' ? '#e84858' : '#e84040'
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.04, 0.05, 0.4, 6]} /><meshStandardMaterial color="#4a7838" /></mesh>
        <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.18, 8, 8]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} /></mesh>
        <mesh position={[0.1, 0.08, 0]}><boxGeometry args={[0.12, 0.05, 0.12]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[-0.1, 0.08, 0]}><boxGeometry args={[0.12, 0.05, 0.12]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.08, 0.1]}><boxGeometry args={[0.12, 0.05, 0.12]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.08, -0.1]}><boxGeometry args={[0.12, 0.05, 0.12]} /><meshStandardMaterial color={color} /></mesh>
      </group>
    )
  }
  if (type === 'mushroom_red' || type === 'mushroom_brown') {
    const color = type === 'mushroom_red' ? '#c82020' : '#6a4828'
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.06, 0.07, 0.3, 6]} /><meshStandardMaterial color="#f0e8d0" /></mesh>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.3, 0.1, 0.3]} /><meshStandardMaterial color={color} /></mesh>
      </group>
    )
  }
  if (type === 'torch') {
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, -0.15, 0]}><cylinderGeometry args={[0.04, 0.05, 0.35, 6]} /><meshStandardMaterial color="#5a3828" /></mesh>
        <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.08, 6, 6]} /><meshStandardMaterial color="#ffcc60" emissive="#ff8830" emissiveIntensity={1.5} /></mesh>
        <pointLight position={[0, 0.05, 0]} color="#ffaa55" intensity={0.8} distance={4} />
      </group>
    )
  }
  if (type === 'candle') {
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.08, 0.1, 0.35, 8]} /><meshStandardMaterial color="#fff3c4" /></mesh>
        <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.06, 6, 6]} /><meshStandardMaterial color="#ffcc80" emissive="#ffaa30" emissiveIntensity={1.2} /></mesh>
        <pointLight position={[0, 0.05, 0]} color="#ffddaa" intensity={0.6} distance={3} />
      </group>
    )
  }
  if (type === 'lantern') {
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.25, 0.25, 0.4, 12]} /><meshStandardMaterial color="#ff8866" emissive="#ff5522" emissiveIntensity={0.6} transparent opacity={0.85} /></mesh>
        <pointLight color="#ff8866" intensity={1.2} distance={5} />
      </group>
    )
  }
  if (type === 'leaves' || type === 'cherry_leaves') {
    const color = type === 'cherry_leaves' ? '#ffb8d8' : '#2d6b2d'
    return <mesh position={[px, py, pz]}><boxGeometry args={[0.95, 0.95, 0.95]} /><meshStandardMaterial color={color} transparent opacity={0.85} roughness={0.9} /></mesh>
  }
  if (type === 'glass') {
    return <mesh position={[px, py, pz]}><boxGeometry args={[0.95, 0.95, 0.95]} /><meshStandardMaterial color="#c0e8ff" transparent opacity={0.4} roughness={0.1} metalness={0.1} /></mesh>
  }
  if (type === 'water') {
    return <mesh position={[px, py, pz]}><boxGeometry args={[1, 0.9, 1]} /><meshStandardMaterial color="#4488cc" transparent opacity={0.65} roughness={0.15} metalness={0.2} /></mesh>
  }
  if (type === 'crystal_ball') {
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.3, 12, 10]} /><meshStandardMaterial color="#b898e8" transparent opacity={0.7} emissive="#8868c8" emissiveIntensity={0.3} metalness={0.4} /></mesh>
        <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.2, 0.25, 0.15, 8]} /><meshStandardMaterial color="#553322" /></mesh>
        <pointLight color="#cc99ff" intensity={0.5} distance={3} />
      </group>
    )
  }
  if (type === 'crystal_pink' || type === 'crystal_blue' || type === 'crystal_violet') {
    const color = type === 'crystal_pink' ? '#ffaacc' : type === 'crystal_blue' ? '#77ccff' : '#cc88ff'
    return (
      <group position={[px, py, pz]}>
        <mesh><octahedronGeometry args={[0.35, 0]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.9} metalness={0.4} /></mesh>
        <pointLight color={color} intensity={0.3} distance={2} />
      </group>
    )
  }
  if (type === 'rune' || type === 'zodiac_fire' || type === 'zodiac_water' || type === 'zodiac_earth' || type === 'zodiac_air' || type === 'fate_line') {
    return <mesh position={[px, py, pz]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.4} metalness={0.2} /></mesh>
  }
  if (type === 'heart_block' || type === 'destiny_core') {
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0.15, 0.15, 0]}><sphereGeometry args={[0.18, 8, 8]} /><meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.4} /></mesh>
        <mesh position={[-0.15, 0.15, 0]}><sphereGeometry args={[0.18, 8, 8]} /><meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.4} /></mesh>
        <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.22, 8, 8]} /><meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.4} /></mesh>
        <pointLight color={def.color} intensity={0.4} distance={3} />
      </group>
    )
  }
  if (type === 'star_dust' || type === 'constellation') {
    return (
      <group position={[px, py, pz]}>
        <mesh position={[0.1, 0.1, 0.1]}><sphereGeometry args={[0.08, 6, 6]} /><meshStandardMaterial color="#fff1a8" emissive="#ffdd66" emissiveIntensity={1} /></mesh>
        <mesh position={[-0.15, 0.15, -0.05]}><sphereGeometry args={[0.06, 6, 6]} /><meshStandardMaterial color="#fff8c8" emissive="#ffee99" emissiveIntensity={1} /></mesh>
        <mesh position={[0.05, -0.1, 0.15]}><sphereGeometry args={[0.07, 6, 6]} /><meshStandardMaterial color="#fff6b8" emissive="#ffdd66" emissiveIntensity={1} /></mesh>
        <pointLight color="#ffeeaa" intensity={0.5} distance={2} />
      </group>
    )
  }
  if (type === 'moon_stone') {
    return <mesh position={[px, py, pz]}><boxGeometry args={[0.95, 0.95, 0.95]} /><meshStandardMaterial color="#e8e4ff" emissive="#b8a8e8" emissiveIntensity={0.3} metalness={0.2} /></mesh>
  }
  return <mesh position={[px, py, pz]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color={def.color} emissive={def.emissive ? def.color : '#000'} emissiveIntensity={def.emissive || 0} transparent={!!def.transparent} opacity={def.transparent ? 0.8 : 1} roughness={0.85} metalness={0.05} /></mesh>
}

// ============ 言出法随几何体 ============
function PieceMeshes() {
  const pieces = useShapeStore((s) => s.pieces)
  return <group>{pieces.map((p) => <SinglePiece key={p.id} piece={p} />)}</group>
}

function SinglePiece({ piece }: { piece: Piece }) {
  const { position, type, scale, color, opacity, rotationY } = piece
  if (type === 'tree') {
    const leafColor = color || '#4a8c4a'
    const s = scale * 0.5
    const trunk = [[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0]]
    const leaf = [
      [-1, 4, -1], [0, 4, -1], [1, 4, -1], [-1, 4, 0], [0, 4, 0], [1, 4, 0], [-1, 4, 1], [0, 4, 1], [1, 4, 1],
      [-1, 5, -1], [0, 5, -1], [1, 5, -1], [-1, 5, 0], [0, 5, 0], [1, 5, 0], [-1, 5, 1], [0, 5, 1], [1, 5, 1],
      [0, 6, -1], [-1, 6, 0], [0, 6, 0], [1, 6, 0], [0, 6, 1], [0, 7, 0]
    ]
    return (
      <group position={position} rotation={[0, (rotationY || 0) * Math.PI / 180, 0]}>
        {trunk.map((b, i) => <mesh key={`t${i}`} position={[b[0] * s, b[1] * s, b[2] * s]}><boxGeometry args={[s, s, s]} /><meshStandardMaterial color="#5a3820" /></mesh>)}
        {leaf.map((b, i) => <mesh key={`l${i}`} position={[b[0] * s, b[1] * s, b[2] * s]}><boxGeometry args={[s, s, s]} /><meshStandardMaterial color={leafColor} transparent opacity={0.85} /></mesh>)}
      </group>
    )
  }
  if (type === 'cloud') {
    const s = scale * 0.6
    const blocks = [[-2, 0, 0], [-1, 0, -1], [-1, 0, 0], [-1, 0, 1], [0, 0, -1], [0, 0, 0], [0, 0, 1], [1, 0, -1], [1, 0, 0], [1, 0, 1], [2, 0, 0], [-1, 1, 0], [0, 1, -1], [0, 1, 0], [0, 1, 1], [1, 1, 0], [0, 2, 0]]
    return <group position={position} rotation={[0, (rotationY || 0) * Math.PI / 180, 0]}>{blocks.map((b, i) => <mesh key={i} position={[b[0] * s, b[1] * s, b[2] * s]}><boxGeometry args={[s, s, s]} /><meshStandardMaterial color={color || '#f0f0f8'} transparent opacity={0.85} /></mesh>)}</group>
  }
  if (type === 'mountain') {
    const s = scale * 0.5
    const blocks: number[][] = []
    for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) blocks.push([dx, 0, dz])
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) blocks.push([dx, 1, dz])
    blocks.push([0, 2, 0])
    return <group position={position} rotation={[0, (rotationY || 0) * Math.PI / 180, 0]}>{blocks.map((b, i) => <mesh key={i} position={[b[0] * s, b[1] * s, b[2] * s]}><boxGeometry args={[s, s, s]} /><meshStandardMaterial color={color || '#7a6a5a'} /></mesh>)}</group>
  }
  const s = scale * 0.5
  return <group position={position} rotation={[0, (rotationY || 0) * Math.PI / 180, 0]}><mesh><boxGeometry args={[s, s, s]} /><meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} /></mesh></group>
}

// ============ 浪漫生物：萤火虫（指令式，仅 chunk 变化时重算） ============
function Fireflies() {
  const groupRef = useRef<THREE.Group>(null)
  // 只在跨 chunk 时重算 biome → 不每帧重渲染
  const chunkKey = useGameStore(
    (s) => `${Math.floor(s.pos[0] / 4)}-${Math.floor(s.pos[2] / 4)}`
  )
  const seed = useVoxelWorldStore((s) => s.seed)
  const { biome, count, lightColor, flies } = useMemo(() => {
    const s = useGameStore.getState()
    const b = getBiome(Math.floor(s.pos[0]), Math.floor(s.pos[2]), seed)
    const c = b === 'mystic' ? 40 : b === 'cherry_grove' ? 25 : b === 'forest' ? 15 : 8
    const fc = b === 'mystic' ? '#cc88ff' : b === 'cherry_grove' ? '#ffccdd' : '#ffdd88'
    const fs = Array.from({ length: c }, () => ({
      baseX: (Math.random() - 0.5) * 20, baseY: 2 + Math.random() * 4, baseZ: (Math.random() - 0.5) * 20,
      speed: 0.5 + Math.random() * 1.0, phase: Math.random() * Math.PI * 2,
    }))
    return { biome: b, count: c, lightColor: fc, flies: fs }
  }, [chunkKey, seed])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const { pos } = useGameStore.getState()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const f = flies[i]
      if (!f) continue
      children[i].position.set(
        pos[0] + f.baseX + Math.sin(t * f.speed + f.phase) * 0.8,
        f.baseY + Math.sin(t * f.speed * 1.3 + f.phase) * 0.4,
        pos[2] + f.baseZ + Math.cos(t * f.speed + f.phase) * 0.8
      )
    }
  })

  return (
    <group ref={groupRef}>
      {flies.map((_, i) => <pointLight key={`pl-${i}`} color={lightColor} intensity={0.6} distance={2.5} decay={2} />)}
      {flies.map((f, i) => <mesh key={`m-${i}`}><sphereGeometry args={[0.08, 6, 6]} /><meshBasicMaterial color={lightColor} /></mesh>)}
    </group>
  )
}

// ============ 浪漫生物：蝴蝶 ============
function Butterflies() {
  const groupRef = useRef<THREE.Group>(null)
  const chunkKey = useGameStore(
    (s) => `${Math.floor(s.pos[0] / 4)}-${Math.floor(s.pos[2] / 4)}`
  )
  const seed = useVoxelWorldStore((s) => s.seed)
  const { butterflies } = useMemo(() => {
    const s = useGameStore.getState()
    const biome = getBiome(Math.floor(s.pos[0]), Math.floor(s.pos[2]), seed)
    const count = biome === 'cherry_grove' ? 12 : biome === 'plains' ? 8 : 4
    const bs = Array.from({ length: count }, (_, i) => ({
      baseX: (Math.random() - 0.5) * 16, baseY: 1 + Math.random() * 3, baseZ: (Math.random() - 0.5) * 16,
      speed: 0.8 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2,
      color: ['#ff88aa', '#88ccff', '#ffaa66', '#cc99ff', '#ffdd88'][i % 5],
    }))
    return { butterflies: bs }
  }, [chunkKey, seed])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const { pos } = useGameStore.getState()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const b = butterflies[i]
      if (!b) continue
      children[i].position.set(
        pos[0] + b.baseX + Math.sin(t * b.speed + b.phase) * 1.2,
        b.baseY + Math.sin(t * b.speed * 2 + b.phase) * 0.5,
        pos[2] + b.baseZ + Math.cos(t * b.speed + b.phase) * 1.2
      )
      children[i].rotation.y = t * b.speed + b.phase
    }
  })

  return (
    <group ref={groupRef}>
      {butterflies.map((b, i) => (
        <group key={i} scale={0.5}>
          <mesh><boxGeometry args={[0.2, 0.15, 0.03]} /><meshStandardMaterial color={b.color} /></mesh>
          <mesh position={[0.15, 0, 0]}><boxGeometry args={[0.2, 0.15, 0.03]} /><meshStandardMaterial color={b.color} /></mesh>
        </group>
      ))}
    </group>
  )
}

// ============ 浪漫生物：漂浮爱心 ============
function FloatingHearts() {
  const groupRef = useRef<THREE.Group>(null)
  const chunkKey = useGameStore(
    (s) => `${Math.floor(s.pos[0] / 4)}-${Math.floor(s.pos[2] / 4)}`
  )
  const seed = useVoxelWorldStore((s) => s.seed)
  const { hearts, color, visible } = useMemo(() => {
    const s = useGameStore.getState()
    const biome = getBiome(Math.floor(s.pos[0]), Math.floor(s.pos[2]), seed)
    if (biome !== 'cherry_grove' && biome !== 'mystic') {
      return { hearts: [], color: '#ff88aa', visible: false }
    }
    const count = biome === 'mystic' ? 15 : 10
    const c = biome === 'mystic' ? '#cc99ff' : '#ff88aa'
    const hs = Array.from({ length: count }, () => ({
      baseX: (Math.random() - 0.5) * 12, baseY: Math.random() * 6, baseZ: (Math.random() - 0.5) * 12,
      speed: 0.2 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2,
    }))
    return { hearts: hs, color: c, visible: true }
  }, [chunkKey, seed])

  useFrame(({ clock }) => {
    if (!visible || !groupRef.current) return
    const t = clock.getElapsedTime()
    const { pos } = useGameStore.getState()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const h = hearts[i]
      if (!h) continue
      children[i].position.set(
        pos[0] + h.baseX + Math.sin(t * h.speed + h.phase) * 0.5,
        h.baseY + (t * h.speed + h.phase) % 6,
        pos[2] + h.baseZ + Math.cos(t * h.speed + h.phase) * 0.5
      )
      children[i].rotation.y = t * h.speed + h.phase
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef}>
      {hearts.map((_, i) => (
        <group key={i} scale={0.2}>
          <mesh position={[0.3, 0.3, 0]}><sphereGeometry args={[0.3, 6, 6]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></mesh>
          <mesh position={[-0.3, 0.3, 0]}><sphereGeometry args={[0.3, 6, 6]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></mesh>
          <mesh position={[0, -0.2, 0]}><sphereGeometry args={[0.35, 6, 6]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} /></mesh>
        </group>
      ))}
    </group>
  )
}

// ============ 浪漫生物：鸽子 ============
function Doves() {
  const groupRef = useRef<THREE.Group>(null)
  const chunkKey = useGameStore(
    (s) => `${Math.floor(s.pos[0] / 4)}-${Math.floor(s.pos[2] / 4)}`
  )
  const seed = useVoxelWorldStore((s) => s.seed)
  const { doves, visible } = useMemo(() => {
    const s = useGameStore.getState()
    const biome = getBiome(Math.floor(s.pos[0]), Math.floor(s.pos[2]), seed)
    if (biome !== 'cherry_grove' && biome !== 'plains') {
      return { doves: [], visible: false }
    }
    const count = 3
    const ds = Array.from({ length: count }, () => ({
      baseX: (Math.random() - 0.5) * 18, baseY: 4 + Math.random() * 3, baseZ: (Math.random() - 0.5) * 18,
      speed: 0.3 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2,
    }))
    return { doves: ds, visible: true }
  }, [chunkKey, seed])

  // FIX: 必须在所有 Hooks 之后再条件返回
  useFrame(({ clock }) => {
    if (!visible || !groupRef.current) return
    const t = clock.getElapsedTime()
    const { pos } = useGameStore.getState()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const d = doves[i]
      if (!d) continue
      children[i].position.set(
        pos[0] + d.baseX + Math.sin(t * d.speed + d.phase) * 3,
        d.baseY + Math.sin(t * d.speed * 2 + d.phase) * 0.5,
        pos[2] + d.baseZ + Math.cos(t * d.speed + d.phase) * 3
      )
      children[i].rotation.y = t * d.speed + d.phase + Math.PI / 2
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef}>
      {doves.map((_, i) => (
        <group key={i} scale={0.4}>
          <mesh><boxGeometry args={[0.6, 0.4, 0.4]} /><meshStandardMaterial color="#f8f0e0" /></mesh>
          <mesh position={[0.4, 0.15, 0]}><sphereGeometry args={[0.15, 6, 6]} /><meshStandardMaterial color="#e8e0d0" /></mesh>
          <mesh position={[0.55, 0.1, 0]}><boxGeometry args={[0.1, 0.05, 0.03]} /><meshStandardMaterial color="#aa6644" /></mesh>
          <mesh position={[0, 0.15, 0.2]}><boxGeometry args={[0.4, 0.05, 0.5]} /><meshStandardMaterial color="#f8f0e0" /></mesh>
          <mesh position={[0, 0.15, -0.2]}><boxGeometry args={[0.4, 0.05, 0.5]} /><meshStandardMaterial color="#f8f0e0" /></mesh>
        </group>
      ))}
    </group>
  )
}

// ============ 全局键盘输入 ============
function KeyboardListener() {
  const setKey = useGameStore((s) => s.setKey)
  const setSlot = useGameStore((s) => s.setSlot)
  const setTool = useGameStore((s) => s.setTool)
  const setSelectedSlot = useVoxelWorldStore((s) => s.setSelectedSlot)

  useEffect(() => {
    const norm = (k: string) => k.length === 1 ? k.toLowerCase() : k.toLowerCase()
    const onDown = (e: KeyboardEvent) => {
      const k = norm(e.key)
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift'].includes(k)) {
        e.preventDefault()
      }
      setKey(k, true)
      // 数字键 1-9 切换热键栏
      if (/^[1-9]$/.test(e.key)) {
        const slot = parseInt(e.key) - 1
        if (slot < HOTBAR_BLOCKS.length) {
          setSlot(slot)
          setSelectedSlot(slot)
        }
      }
      // E 切换放置模式, Q 切换到删除
      if (k === 'e') setTool('place')
      if (k === 'q') setTool('remove')
    }
    const onUp = (e: KeyboardEvent) => {
      const k = norm(e.key)
      setKey(k, false)
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [setKey, setSlot, setTool, setSelectedSlot])
  return null
}

// ============ 相机控制（指针锁定 + 防黑屏保护） ============
function PointerLockControls() {
  const { camera, gl } = useThree()
  const setLook = useGameStore((s) => s.setLook)
  const setLocked = useVoxelWorldStore((s) => s.setLocked)

  useEffect(() => {
    const dom = gl.domElement
    const onClick = () => dom.requestPointerLock()
    const onLock = () => setLocked(document.pointerLockElement === dom)
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== dom) return
      try {
        const s = useGameStore.getState()
        if (!s || isNaN(s.yaw) || isNaN(s.pitch)) return
        setLook(s.yaw - e.movementX * 0.002, s.pitch - e.movementY * 0.002)
      } catch (error) {
        console.error('PointerLockControls mouse move error:', error)
      }
    }
    dom.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLock)
    document.addEventListener('mousemove', onMove)
    return () => {
      dom.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onLock)
      document.removeEventListener('mousemove', onMove)
    }
  }, [gl, setLook, setLocked])

  // 每帧从 store 读取最新位置，确保相机跟随玩家
  useFrame(() => {
    try {
      const { pos, yaw, pitch } = useGameStore.getState()
      
      // 验证状态有效性
      if (!pos || pos.length !== 3 || pos.some(isNaN) || isNaN(yaw) || isNaN(pitch)) {
        console.warn('PointerLockControls: Invalid camera state')
        return
      }

      // 限制角度范围（防止相机翻转）
      const clampedPitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch))
      
      camera.position.set(pos[0], pos[1] + 1.5, pos[2])
      const lookDir = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(clampedPitch), 
        Math.sin(clampedPitch), 
        -Math.cos(yaw) * Math.cos(clampedPitch)
      )
      camera.lookAt(
        camera.position.x + lookDir.x, 
        camera.position.y + lookDir.y, 
        camera.position.z + lookDir.z
      )
    } catch (error) {
      console.error('PointerLockControls frame update error:', error)
    }
  })
  return null
}

// ============ 物理与移动系统（升级：AABB 碰撞 + 水面浮力 + 首帧落地 + 防黑屏保护） ============
function PlayerPhysics() {
  const { setPos, setVel, setSpawned } = useGameStore()
  useFrame((_, dtRaw) => {
    try {
      const dt = Math.min(dtRaw, 0.1)
      const s = useGameStore.getState()
      const voxelStore = useVoxelWorldStore.getState()
      const seed = voxelStore.seed

      // 验证状态有效性
      if (!s.pos || !s.vel || s.pos.length !== 3 || s.vel.length !== 3) {
        console.warn('PlayerPhysics: Invalid state detected')
        return
      }

      const pos = s.pos, vel = s.vel, keys = s.keys, yaw = s.yaw

      // 验证坐标有效性
      if (pos.some(isNaN) || vel.some(isNaN) || isNaN(yaw)) {
        console.warn('PlayerPhysics: NaN value detected, resetting')
        setPos([0, 20, 0])
        setVel([0, 0, 0])
        return
      }

      // FIX: 首帧 snap-to-ground。玩家起始 y=100，立刻落到正确地形高度
      if (!s.spawned) {
        const terrainH = getTerrainHeight(Math.floor(pos[0]), Math.floor(pos[2]), seed)
        // 验证地形高度
        if (!isNaN(terrainH)) {
          setPos([pos[0], terrainH + 2, pos[2]])
          setVel([0, 0, 0])
          setSpawned(true)
        }
        return
      }

      // --- 输入 -> 期望速度 ---
      let ix = 0, iz = 0
      if (keys['w'] || keys['arrowup']) iz -= 1
      if (keys['s'] || keys['arrowdown']) iz += 1
      if (keys['a'] || keys['arrowleft']) ix -= 1
      if (keys['d'] || keys['arrowright']) ix += 1
      const len = Math.sqrt(ix * ix + iz * iz)
      if (len > 0) { ix /= len; iz /= len }
      const forwardX = -Math.sin(yaw), forwardZ = -Math.cos(yaw)
      const rightX = Math.cos(yaw), rightZ = -Math.sin(yaw)
      const moveX = rightX * ix + forwardX * (-iz)
      const moveZ = rightZ * ix + forwardZ * (-iz)
      const speed = keys['shift'] ? 8 : 4.5
      const vx = moveX * speed
      const vz = moveZ * speed

      // --- 水检测：玩家脚部在水中则浮力 ---
      const footBlock = voxelStore.getBlock(Math.floor(pos[0]), Math.floor(pos[1] - 0.2), Math.floor(pos[2]))
      const inWater = footBlock && BLOCK_DEFS[footBlock.type]?.specialShape === 'water'
      const gravity = inWater ? -6 : -22
      const maxFall = inWater ? -3 : -30

      let vy = Math.max(vel[1] + gravity * dt, maxFall)

      // --- 实心方块检测（AABB 碰撞，玩家尺寸 0.6宽 × 1.8高 × 0.6深） ---
      const R = 0.3, H = 1.8
      const checkSolid = (x: number, y: number, z: number): boolean => {
        if (isNaN(x) || isNaN(y) || isNaN(z)) return false
        const b = voxelStore.getBlock(Math.floor(x), Math.floor(y), Math.floor(z))
        if (!b) return false
        const def = BLOCK_DEFS[b.type]
        if (!def) return false
        if (def.specialShape === 'flower' || def.specialShape === 'torch' ||
            def.specialShape === 'mushroom' || def.specialShape === 'water' ||
            def.specialShape === 'rose' || def.specialShape === 'crystal_ball' ||
            def.specialShape === 'leaves') return false
        return true
      }

      const boxSolid = (px: number, py: number, pz: number): boolean => {
        if (isNaN(px) || isNaN(py) || isNaN(pz)) return false
        return checkSolid(px + R, py, pz + R) || checkSolid(px - R, py, pz + R) ||
               checkSolid(px + R, py, pz - R) || checkSolid(px - R, py, pz - R) ||
               checkSolid(px, py, pz) ||
               checkSolid(px + R, py + H - 0.1, pz + R) || checkSolid(px - R, py + H - 0.1, pz - R) ||
               checkSolid(px, py + H - 0.1, pz)
      }

      // --- 地面检测 ---
      let onGround = false
      const groundFoot = pos[1] - 0.01
      for (const dx of [-R, 0, R]) for (const dz of [-R, 0, R]) {
        if (checkSolid(pos[0] + dx, groundFoot, pos[2] + dz)) { onGround = true; break }
      }
      if (!onGround) {
        const terrainH = getTerrainHeight(Math.floor(pos[0]), Math.floor(pos[2]), seed) + 1
        if (!isNaN(terrainH) && pos[1] <= terrainH + 0.1 && pos[1] > terrainH - 1) onGround = true
      }

      if (keys[' '] && onGround) vy = inWater ? 5 : 9

      // --- 逐轴碰撞 ---
      let newX = pos[0] + vx * dt
      if (vx !== 0 && boxSolid(newX, pos[1], pos[2])) newX = pos[0]

      let newZ = pos[2] + vz * dt
      if (vz !== 0 && boxSolid(newX, pos[1], newZ)) newZ = pos[2]

      let newY = pos[1] + vy * dt
      if (vy < 0 && boxSolid(newX, newY, newZ)) {
        newY = Math.floor(pos[1])
        for (let tryY = Math.floor(pos[1]); tryY <= Math.floor(pos[1]) + 2; tryY++) {
          if (!boxSolid(newX, tryY, newZ)) { newY = tryY; break }
        }
        vy = 0
      } else if (vy > 0 && boxSolid(newX, newY + H - 0.1, newZ)) {
        newY = pos[1]; vy = 0
      }

      // --- 防掉出世界（增加更强的保护） ---
      if (newY < -100 || isNaN(newY)) {
        const terrainH = getTerrainHeight(Math.floor(newX), Math.floor(newZ), seed)
        if (!isNaN(terrainH)) {
          newY = terrainH + 2
          vy = 0
        } else {
          // 终极回退：重置到安全位置
          newX = 0
          newY = 20
          newZ = 0
          vy = 0
        }
      }

      // --- 限制移动距离（防止瞬移导致的渲染问题） ---
      const maxMove = 10 // 每帧最大移动距离
      const dx = newX - pos[0]
      const dy = newY - pos[1]
      const dz = newZ - pos[2]
      const moveDist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (moveDist > maxMove) {
        const scale = maxMove / moveDist
        newX = pos[0] + dx * scale
        newY = pos[1] + dy * scale
        newZ = pos[2] + dz * scale
        vy = 0
      }

      // --- 水面限制：在水中漂浮 ---
      if (inWater && newY < Math.floor(pos[1]) + 1) {
        vy = Math.max(vy, 1)
      }

      // 验证最终坐标
      if (newX !== newX || newY !== newY || newZ !== newZ) {
        console.warn('PlayerPhysics: Final position has NaN, resetting')
        setPos([0, 20, 0])
        setVel([0, 0, 0])
        return
      }

      setPos([newX, newY, newZ]); setVel([vx, vy, vz])
    } catch (error) {
      console.error('PlayerPhysics error:', error)
      // 重置到安全位置
      setPos([0, 20, 0])
      setVel([0, 0, 0])
    }
  })
  return null
}

// ============ 准星与放置/删除方块 ============
function Crosshair() {
  const { pos, yaw, pitch } = useGameStore()
  const targetRef = useRef<THREE.Mesh>(null)
  const targetDataRef = useRef<{ blockPos: [number, number, number] | null, prevPos: [number, number, number] | null }>({ blockPos: null, prevPos: null })

  useFrame(() => {
    const voxelStore = useVoxelWorldStore.getState()
    const maxDist = 8, step = 0.2
    const origin: [number, number, number] = [pos[0], pos[1] + 1.5, pos[2]]
    const dir: [number, number, number] = [-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)]
    let lastBlock: [number, number, number] | null = null, found: [number, number, number] | null = null, prev: [number, number, number] | null = null
    for (let d = step; d <= maxDist; d += step) {
      const x = Math.floor(origin[0] + dir[0] * d), y = Math.floor(origin[1] + dir[1] * d), z = Math.floor(origin[2] + dir[2] * d)
      if (lastBlock && (lastBlock[0] !== x || lastBlock[1] !== y || lastBlock[2] !== z)) {
        const block = voxelStore.getBlock(x, y, z)
        if (block) {
          const def = BLOCK_DEFS[block.type]
          if (def && def.solid !== false && def.specialShape !== 'flower' && def.specialShape !== 'torch' && def.specialShape !== 'mushroom' && def.specialShape !== 'water' && def.specialShape !== 'rose' && def.specialShape !== 'crystal_ball') {
            found = [x, y, z]; prev = lastBlock; break
          }
        }
      }
      lastBlock = [x, y, z]
    }
    targetDataRef.current.blockPos = found; targetDataRef.current.prevPos = prev
    if (targetRef.current) {
      if (found) { targetRef.current.visible = true; targetRef.current.position.set(found[0] + 0.5, found[1] + 0.5, found[2] + 0.5) }
      else targetRef.current.visible = false
    }
  })

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!document.pointerLockElement) return
      const voxelStore = useVoxelWorldStore.getState()
      const gs = useGameStore.getState()
      const { blockPos, prevPos } = targetDataRef.current
      if (e.button === 0 && gs.tool === 'place' && prevPos) voxelStore.placeBlock(prevPos[0], prevPos[1], prevPos[2])
      else if ((e.button === 2 || gs.tool === 'remove') && blockPos) {
        const key = `${blockPos[0]},${blockPos[1]},${blockPos[2]}`
        const block = voxelStore.blocks.get(key)
        if (block && block.placed) {
          const newBlocks = new Map(voxelStore.blocks); newBlocks.delete(key)
          useVoxelWorldStore.setState({ blocks: newBlocks })
        }
      }
    }
    const onContext = (e: Event) => e.preventDefault()
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('contextmenu', onContext)
    return () => { document.removeEventListener('mousedown', onMouseDown); document.removeEventListener('contextmenu', onContext) }
  }, [])
  return <mesh ref={targetRef} visible={false}><boxGeometry args={[1.02, 1.02, 1.02]} /><meshBasicMaterial color="#000000" transparent opacity={0.3} /></mesh>
}

// ============ 言出法随：文本生成场景 ============
export function generateFromPrompt(text: string): Piece[] {
  const t = text.toLowerCase()
  const result: Piece[] = []
  const playerPos = useGameStore.getState().pos
  const yaw = useGameStore.getState().yaw
  const seed = useVoxelWorldStore.getState().seed
  const forwardX = -Math.sin(yaw), forwardZ = -Math.cos(yaw)
  const centerX = Math.floor(playerPos[0] + forwardX * 6)
  const centerZ = Math.floor(playerPos[2] + forwardZ * 6)
  const groundY = getTerrainHeight(centerX, centerZ, seed)
  const has = (kws: string[]) => kws.some(k => t.includes(k))

  // 浪漫：爱心/玫瑰
  if (has(['浪漫', 'love', '爱心', '心', '约会', 'rose', '玫瑰', '樱花', 'sakkura', '生日', '愿望', 'wish', 'happy'])) {
    for (let i = 0; i < 5; i++) result.push({
      id: `h-${Date.now()}-${i}`, type: 'heart',
      position: [centerX + (i - 2) * 1.5, groundY + 2, centerZ], rotationY: 0, scale: 1.2, color: '#ff6b9d', opacity: 1, metalness: 0, material: 'glow', label: ''
    })
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2
      result.push({
        id: `c-${Date.now()}-${i}`, type: 'cube',
        position: [centerX + Math.cos(ang) * 3, groundY + 1, centerZ + Math.sin(ang) * 3],
        rotationY: 0, scale: 1, color: '#fff3c4', opacity: 1, metalness: 0.1, material: 'glow', label: ''
      })
    }
    // 樱花树
    for (let i = 0; i < 3; i++) {
      const x = centerX + (i - 1) * 3
      const z = centerZ + (Math.random() - 0.5) * 4
      const gy = getTerrainHeight(Math.floor(x), Math.floor(z), seed)
      result.push({ id: `st-${Date.now()}-${i}`, type: 'tree', position: [x, gy, z], rotationY: 0, scale: 1.2, color: '#ff88bb', opacity: 1, metalness: 0, material: 'standard', label: '' })
    }
    return result
  }

  // 命理/神秘
  if (has(['命理', '星座', '塔罗', '占卜', '神秘', 'magic', 'fortune'])) {
    result.push({
      id: `m-${Date.now()}`, type: 'crystal',
      position: [centerX, groundY + 2, centerZ], rotationY: 0, scale: 2.0, color: '#b898e8', opacity: 1, metalness: 0.4, material: 'glow', label: ''
    })
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2
      const colors = ['#ff6644', '#4488cc', '#6ba84a', '#e8e8ff']
      result.push({
        id: `r-${Date.now()}-${i}`, type: 'cube',
        position: [centerX + Math.cos(ang) * 3, groundY + 1, centerZ + Math.sin(ang) * 3],
        rotationY: 0, scale: 1.0, color: colors[i % 4], opacity: 1, metalness: 0.2, material: 'glow', label: ''
      })
    }
    for (let i = 0; i < 5; i++) result.push({
      id: `s-${Date.now()}-${i}`, type: 'star',
      position: [centerX + (Math.random() - 0.5) * 8, groundY + 5 + Math.random() * 3, centerZ + (Math.random() - 0.5) * 8],
      rotationY: 0, scale: 0.8, color: '#fff1a8', opacity: 1, metalness: 0, material: 'glow', label: ''
    })
    return result
  }

  // 树/森林
  const treeCount = has(['森林', 'tree', '林']) ? 8 : has(['树']) ? 4 : 0
  for (let i = 0; i < treeCount; i++) {
    const x = centerX + (i - treeCount / 2) * 2
    const z = centerZ + (Math.random() - 0.5) * 3
    const gy = getTerrainHeight(Math.floor(x), Math.floor(z), seed)
    result.push({ id: `t-${Date.now()}-${i}`, type: 'tree', position: [x, gy, z], rotationY: 0, scale: 1, color: '#4a8c4a', opacity: 1, metalness: 0, material: 'standard', label: '' })
  }

  // 花
  if (has(['花', 'flower'])) for (let i = 0; i < 8; i++) {
    const x = centerX + (Math.random() - 0.5) * 5, z = centerZ + (Math.random() - 0.5) * 5
    const gy = getTerrainHeight(Math.floor(x), Math.floor(z), seed)
    result.push({ id: `f-${Date.now()}-${i}`, type: 'flower', position: [x, gy + 1, z], rotationY: 0, scale: 0.8, color: '#e84040', opacity: 1, metalness: 0, material: 'standard', label: '' })
  }

  // 山
  if (has(['山', 'mountain'])) result.push({
    id: `mt-${Date.now()}`, type: 'mountain',
    position: [centerX, groundY, centerZ], rotationY: 0, scale: 2, color: '#7a6a5a', opacity: 1, metalness: 0, material: 'standard', label: ''
  })

  // 云
  if (has(['云', 'cloud'])) for (let i = 0; i < 3; i++) result.push({
    id: `cl-${Date.now()}-${i}`, type: 'cloud',
    position: [centerX + i * 3 - 3, groundY + 8, centerZ - 2],
    rotationY: 0, scale: 1.0, color: '#f0f0f8', opacity: 0.85, metalness: 0, material: 'mat', label: ''
  })

  // 彩虹
  if (has(['彩虹', 'rainbow'])) {
    const rainbowColors = ['#ff6b9d', '#ffa06b', '#ffd86b', '#8cff8c', '#6bcaff', '#b488ff']
    for (let row = 0; row < 6; row++) for (let i = -6; i <= 6; i++) result.push({
      id: `rb-${Date.now()}-${row}-${i}`, type: 'cube',
      position: [centerX + i * 0.6, groundY + 5 + row, centerZ],
      rotationY: 0, scale: 0.5, color: rainbowColors[row], opacity: 0.85, metalness: 0, material: 'standard', label: ''
    })
  }

  // 月亮
  if (has(['月', 'moon'])) result.push({
    id: `mo-${Date.now()}`, type: 'moon',
    position: [centerX, groundY + 10, centerZ], rotationY: 0, scale: 1.5, color: '#fff8d8', opacity: 1, metalness: 0, material: 'glow', label: ''
  })

  // 星星
  if (has(['星', 'star'])) for (let i = 0; i < 8; i++) result.push({
    id: `st-${Date.now()}-${i}`, type: 'star',
    position: [centerX + (Math.random() - 0.5) * 10, groundY + 8 + Math.random() * 4, centerZ + (Math.random() - 0.5) * 10],
    rotationY: 0, scale: 0.8, color: '#fff1a8', opacity: 1, metalness: 0, material: 'glow', label: ''
  })

  // 水晶
  if (has(['水晶', 'crystal', 'diamond'])) {
    const crystalColors = ['#ffaacc', '#88ccff', '#cc99ff']
    for (let i = 0; i < 3; i++) result.push({
      id: `cr-${Date.now()}-${i}`, type: 'crystal',
      position: [centerX + (i - 1) * 1.5, groundY + 1, centerZ],
      rotationY: 0, scale: 1.2, color: crystalColors[i], opacity: 1, metalness: 0.5, material: 'glow', label: ''
    })
  }

  // 房子
  if (has(['房', '屋', 'home', 'house', '房子'])) {
    result.push({
      id: `hs-${Date.now()}`, type: 'cube',
      position: [centerX, groundY + 1, centerZ], rotationY: 0, scale: 3, color: '#d4b89a', opacity: 1, metalness: 0, material: 'standard', label: ''
    })
    result.push({
      id: `hs2-${Date.now()}`, type: 'cube',
      position: [centerX, groundY + 4, centerZ], rotationY: 0, scale: 2, color: '#a84828', opacity: 1, metalness: 0, material: 'standard', label: ''
    })
  }

  // 灯笼
  if (has(['灯笼', 'lantern', '灯'])) for (let i = 0; i < 4; i++) result.push({
    id: `lt-${Date.now()}-${i}`, type: 'cube',
    position: [centerX + (i - 1.5) * 2, groundY + 3, centerZ],
    rotationY: 0, scale: 1, color: '#ff8866', opacity: 1, metalness: 0, material: 'glow', label: ''
  })

  // 默认
  if (result.length === 0) for (let i = 0; i < 4; i++) result.push({
    id: `def-${Date.now()}-${i}`, type: 'flower',
    position: [centerX + (i - 2) * 1.5, groundY + 1, centerZ + (Math.random() - 0.5) * 2],
    rotationY: 0, scale: 0.8, color: '#ffcc20', opacity: 1, metalness: 0, material: 'standard', label: ''
  })

  return result
}

// ============ 主场景（添加防黑屏保护） ============
export function CreativeScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contextLost, setContextLost] = React.useState(false)

  // 处理 WebGL 上下文丢失
  React.useEffect(() => {
    const handleContextLost = (e: WebGLContextEvent) => {
      e.preventDefault()
      console.error('WebGL context lost, attempting recovery...')
      setContextLost(true)
      
      // 延迟后尝试恢复
      setTimeout(() => {
        setContextLost(false)
        console.log('Attempting WebGL context recovery...')
      }, 1000)
    }

    const handleContextRestored = () => {
      console.log('WebGL context restored')
      setContextLost(false)
    }

    const canvas = containerRef.current?.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost)
      canvas.addEventListener('webglcontextrestored', handleContextRestored)
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
        canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      }
    }
  }, [])

  // 上下文丢失时显示恢复提示
  if (contextLost) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #1a1430 0%, #2a1e40 100%)',
        color: '#ffd8ea'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div>
        <div style={{ fontSize: 18, marginBottom: 8 }}>渲染环境恢复中...</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>请稍候，正在尝试重新连接</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 500 }} gl={{ antialias: false }}>
        {/* 背景色（作为保底） */}
        <color attach="background" args={['#87ceeb']} />
        {/* 雾效 */}
        <fog attach="fog" args={['#c0d0e0', 30, 150]} />
        {/* Sky 组件（注释：Sky 可能与背景冲突，暂时移除以避免黑屏） */}
        {/* <Sky sunPosition={[100, 20, 100]} /> */}
        {/* 环境光 */}
        <ambientLight intensity={0.6} />
        {/* 主方向光 */}
        <directionalLight 
          castShadow 
          position={[20, 30, 20]} 
          intensity={1.2} 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        {/* 补光（防止某些角度过暗） */}
        <directionalLight 
          position={[-20, 15, -20]} 
          intensity={0.4} 
        />
        {/* 半球光（增强环境光照） */}
        <hemisphereLight 
          color="#87ceeb" 
          groundColor="#4a7a4a" 
          intensity={0.3} 
        />
        
        {/* 场景组件 */}
        <BiomeFog />
        <VoxelTerrain />
        <PieceMeshes />
        <Fireflies />
        <Butterflies />
        <FloatingHearts />
        <Doves />
        <Petals />
        <SnowParticles />
        <DustParticles />
        <Crosshair />
        <KeyboardListener />
        <PointerLockControls />
        <PlayerPhysics />
      </Canvas>
      {/* 命理面板 */}
      <DestinyPanel />
      {/* 水物理调试面板 */}
      <WaterPhysicsDebugPanel />
    </div>
  )
}

// ============ 升级：生物群落色光 / 动态雾效 ============
function BiomeFog() {
  const { scene, gl } = useThree()
  const fogRef = useRef<THREE.Fog>()

  // 初始化雾
  useEffect(() => {
    const fog = new THREE.Fog('#c0d0e0', 30, 120)
    scene.fog = fog
    fogRef.current = fog
    return () => { scene.fog = null }
  }, [scene])

  // 每帧根据玩家位置的生物群落渐变颜色和雾距
  useFrame(() => {
    const s = useGameStore.getState()
    const vxs = useVoxelWorldStore.getState()
    const biome = getBiome(Math.floor(s.pos[0]), Math.floor(s.pos[2]), vxs.seed)
    let color = '#c0d0e0', near = 30, far = 120, bg = '#87ceeb'
    if (biome === 'snow') { color = '#dfeaf5'; near = 20; far = 100; bg = '#b0c8e0' }
    else if (biome === 'desert') { color = '#f5e4c8'; near = 40; far = 180; bg = '#e0b070' }
    else if (biome === 'cherry_grove') { color = '#ffd0e5'; near = 30; far = 130; bg = '#f8c8e0' }
    else if (biome === 'mystic') { color = '#b090d0'; near = 15; far = 80; bg = '#3a2860' }
    else if (biome === 'forest') { color = '#a8c89a'; near = 30; far = 140; bg = '#78b078' }
    else if (biome === 'ocean') { color = '#6890c0'; near = 20; far = 100; bg = '#4068a0' }
    if (fogRef.current) {
      fogRef.current.color.lerp(new THREE.Color(color), 0.05)
      fogRef.current.near += (near - fogRef.current.near) * 0.05
      fogRef.current.far += (far - fogRef.current.far) * 0.05
    }
    const bgCol = new THREE.Color(bg)
    scene.background = scene.background as THREE.Color
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(bgCol, 0.05)
    } else {
      scene.background = bgCol
    }
  })
  return null
}

// ============ 升级：樱花瓣粒子系统 ============
function Petals() {
  const count = 80
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 3))
  const velsRef = useRef<Float32Array>(new Float32Array(count * 3))
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    const { pos } = useGameStore.getState()
    for (let i = 0; i < count; i++) {
      positionsRef.current[i * 3] = pos[0] + (Math.random() - 0.5) * 40
      positionsRef.current[i * 3 + 1] = pos[1] + 5 + Math.random() * 20
      positionsRef.current[i * 3 + 2] = pos[2] + (Math.random() - 0.5) * 40
      velsRef.current[i * 3] = (Math.random() - 0.5) * 0.3
      velsRef.current[i * 3 + 1] = -0.3 - Math.random() * 0.3
      velsRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const { pos } = useGameStore.getState()
    const vxs = useVoxelWorldStore.getState()
    const biome = getBiome(Math.floor(pos[0]), Math.floor(pos[2]), vxs.seed)
    const show = biome === 'cherry_grove'
    const dummy = new THREE.Object3D()
    let visibleCount = 0
    for (let i = 0; i < count; i++) {
      positionsRef.current[i * 3] += velsRef.current[i * 3]
      positionsRef.current[i * 3 + 1] += velsRef.current[i * 3 + 1]
      positionsRef.current[i * 3 + 2] += velsRef.current[i * 3 + 2]
      if (positionsRef.current[i * 3 + 1] < pos[1] - 2 ||
          Math.abs(positionsRef.current[i * 3] - pos[0]) > 25 ||
          Math.abs(positionsRef.current[i * 3 + 2] - pos[2]) > 25) {
        positionsRef.current[i * 3] = pos[0] + (Math.random() - 0.5) * 40
        positionsRef.current[i * 3 + 1] = pos[1] + 10 + Math.random() * 15
        positionsRef.current[i * 3 + 2] = pos[2] + (Math.random() - 0.5) * 40
      }
      dummy.position.set(
        positionsRef.current[i * 3], positionsRef.current[i * 3 + 1], positionsRef.current[i * 3 + 2]
      )
      dummy.rotation.set(Date.now() * 0.001 + i, Date.now() * 0.0015 + i, 0)
      dummy.scale.setScalar(0.25 + (i % 5) * 0.04)
      dummy.updateMatrix()
      mesh.setMatrixAt(visibleCount++, dummy.matrix)
    }
    mesh.count = visibleCount
    mesh.instanceMatrix.needsUpdate = true
    mesh.visible = show
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffc8dd" transparent opacity={0.85} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

// ============ 升级：雪花粒子系统（雪原/高山）
function SnowParticles() {
  const count = 100
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 3))
  const velsRef = useRef<Float32Array>(new Float32Array(count * 3))
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    const { pos } = useGameStore.getState()
    for (let i = 0; i < count; i++) {
      positionsRef.current[i * 3] = pos[0] + (Math.random() - 0.5) * 40
      positionsRef.current[i * 3 + 1] = pos[1] + 5 + Math.random() * 20
      positionsRef.current[i * 3 + 2] = pos[2] + (Math.random() - 0.5) * 40
      velsRef.current[i * 3] = (Math.random() - 0.5) * 0.2
      velsRef.current[i * 3 + 1] = -0.5 - Math.random() * 0.3
      velsRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.2
    }
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const { pos } = useGameStore.getState()
    const vxs = useVoxelWorldStore.getState()
    const biome = getBiome(Math.floor(pos[0]), Math.floor(pos[2]), vxs.seed)
    const show = biome === 'snow'
    const dummy = new THREE.Object3D()
    let visibleCount = 0
    for (let i = 0; i < count; i++) {
      positionsRef.current[i * 3] += velsRef.current[i * 3]
      positionsRef.current[i * 3 + 1] += velsRef.current[i * 3 + 1]
      positionsRef.current[i * 3 + 2] += velsRef.current[i * 3 + 2]
      if (positionsRef.current[i * 3 + 1] < pos[1] - 2 ||
          Math.abs(positionsRef.current[i * 3] - pos[0]) > 25 ||
          Math.abs(positionsRef.current[i * 3 + 2] - pos[2]) > 25) {
        positionsRef.current[i * 3] = pos[0] + (Math.random() - 0.5) * 40
        positionsRef.current[i * 3 + 1] = pos[1] + 10 + Math.random() * 15
        positionsRef.current[i * 3 + 2] = pos[2] + (Math.random() - 0.5) * 40
      }
      dummy.position.set(positionsRef.current[i * 3], positionsRef.current[i * 3 + 1], positionsRef.current[i * 3 + 2])
      dummy.rotation.set(Date.now() * 0.001 + i, Date.now() * 0.0015 + i, 0)
      dummy.scale.setScalar(0.15)
      dummy.updateMatrix()
      mesh.setMatrixAt(visibleCount++, dummy.matrix)
    }
    mesh.count = visibleCount
    mesh.instanceMatrix.needsUpdate = true
    mesh.visible = show
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

// ============ 升级：沙尘粒子系统（沙漠）
function DustParticles() {
  const count = 60
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 3))
  const velsRef = useRef<Float32Array>(new Float32Array(count * 3))
  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    const { pos } = useGameStore.getState()
    for (let i = 0; i < count; i++) {
      positionsRef.current[i * 3] = pos[0] + (Math.random() - 0.5) * 40
      positionsRef.current[i * 3 + 1] = pos[1] + Math.random() * 5
      positionsRef.current[i * 3 + 2] = pos[2] + (Math.random() - 0.5) * 40
      velsRef.current[i * 3] = 0.5 + Math.random() * 0.5
      velsRef.current[i * 3 + 1] = 0.1 + Math.random() * 0.1
      velsRef.current[i * 3 + 2] = 0.2 + Math.random() * 0.2
    }
  }, [])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const { pos } = useGameStore.getState()
    const vxs = useVoxelWorldStore.getState()
    const biome = getBiome(Math.floor(pos[0]), Math.floor(pos[2]), vxs.seed)
    const show = biome === 'desert'
    const dummy = new THREE.Object3D()
    let visibleCount = 0
    for (let i = 0; i < count; i++) {
      positionsRef.current[i * 3] += velsRef.current[i * 3]
      positionsRef.current[i * 3 + 1] += velsRef.current[i * 3 + 1]
      positionsRef.current[i * 3 + 2] += velsRef.current[i * 3 + 2]
      if (Math.abs(positionsRef.current[i * 3] - pos[0]) > 25 ||
          Math.abs(positionsRef.current[i * 3 + 2] - pos[2]) > 25 ||
          positionsRef.current[i * 3 + 1] > pos[1] + 20) {
        positionsRef.current[i * 3] = pos[0] + (Math.random() - 0.5) * 40
        positionsRef.current[i * 3 + 1] = pos[1] + Math.random() * 8
        positionsRef.current[i * 3 + 2] = pos[2] + (Math.random() - 0.5) * 40
      }
      dummy.position.set(positionsRef.current[i * 3], positionsRef.current[i * 3 + 1], positionsRef.current[i * 3 + 2])
      dummy.scale.setScalar(0.3 + (i % 3) * 0.1)
      dummy.updateMatrix()
      mesh.setMatrixAt(visibleCount++, dummy.matrix)
    }
    mesh.count = visibleCount
    mesh.instanceMatrix.needsUpdate = true
    mesh.visible = show
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#e8c888" transparent opacity={0.6} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}
