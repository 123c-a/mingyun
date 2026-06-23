import { useRef, useState, useMemo, useEffect } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useShapeStore, Piece, PieceType, getPieceSize } from './healingStore'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

// ============ 生成自定义几何体 ============

// 心形
function makeHeartGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  const x = 0, y = 0
  shape.moveTo(x, y + size.h * 0.15)
  shape.bezierCurveTo(x, y + size.h * 0.4, -size.w * 0.35, y + size.h * 0.5, -size.w * 0.5, y + size.h * 0.2)
  shape.bezierCurveTo(-size.w * 0.7, y - size.h * 0.15, -size.w * 0.3, y - size.h * 0.3, x, y - size.h * 0.1)
  shape.bezierCurveTo(x + size.w * 0.3, y - size.h * 0.3, x + size.w * 0.7, y - size.h * 0.15, x + size.w * 0.5, y + size.h * 0.2)
  shape.bezierCurveTo(x + size.w * 0.35, y + size.h * 0.5, x, y + size.h * 0.4, x, y + size.h * 0.15)
  const geo = new THREE.ExtrudeGeometry(shape, { depth: size.d, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 2, steps: 2 })
  geo.center()
  return geo
}

// 五角星
function makeStarGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const outer = size.w / 2
  const inner = outer * 0.45
  const shape = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? outer : inner
    const px = Math.cos(angle) * r
    const py = Math.sin(angle) * r
    if (i === 0) shape.moveTo(px, py)
    else shape.lineTo(px, py)
  }
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: size.d, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 2 })
  geo.center()
  return geo
}

// 云朵（多个球体拼在一起） - 用 BufferGeometryUtils 合并
function makeCloudGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const parts: THREE.SphereGeometry[] = []
  const positions: [number, number, number][] = [
    [0, 0, 0], [-size.w * 0.25, size.h * 0.1, 0], [size.w * 0.25, size.h * 0.08, 0],
    [-size.w * 0.1, -size.h * 0.1, 0], [size.w * 0.15, -size.h * 0.1, 0], [-size.w * 0.35, -size.h * 0.02, 0], [size.w * 0.38, 0, 0],
  ]
  positions.forEach((p, i) => {
    const r = (i === 0 ? size.h * 0.5 : size.h * 0.35 + Math.random() * 0.1)
    const g = new THREE.SphereGeometry(r, 12, 10)
    g.translate(p[0], p[1], p[2])
    parts.push(g)
  })
  // 用 mergeBufferGeometries
  const merged = mergeGeos(parts as any)
  return merged
}

function mergeGeos(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // 手动合并
  let posTotal = 0, normTotal = 0, idxTotal = 0
  geos.forEach((g) => {
    posTotal += g.attributes.position.count * 3
    normTotal += g.attributes.normal ? g.attributes.normal.count * 3 : 0
    if (g.index) idxTotal += g.index.count
  })
  const positions = new Float32Array(posTotal)
  const normals = new Float32Array(normTotal)
  // 简单方式：直接 non-index 合并
  const nonIdxPositions: number[] = []
  geos.forEach((g) => {
    const gClone = g.index ? g.toNonIndexed() : g
    const posAttr = gClone.attributes.position
    for (let i = 0; i < posAttr.count; i++) {
      nonIdxPositions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
    }
  })
  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(nonIdxPositions, 3))
  geom.computeVertexNormals()
  return geom
}

// 水晶：六棱柱 + 两端尖
function makeCrystalGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const r = size.w / 2
  const halfH = size.h / 2
  const bodyGeo = new THREE.CylinderGeometry(r * 0.85, r, halfH * 1.4, 6)
  const topGeo = new THREE.ConeGeometry(r * 0.75, halfH * 0.6, 6)
  topGeo.translate(0, halfH * 1.1, 0)
  return mergeGeos([bodyGeo, topGeo])
}

// 树：球体叶 + 圆柱杆
function makeTreeGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(size.w * 0.1, size.w * 0.15, size.h * 0.5, 8)
  trunk.translate(0, -size.h * 0.25, 0)
  const leaf1 = new THREE.SphereGeometry(size.w * 0.45, 12, 10)
  leaf1.translate(0, size.h * 0.3, 0)
  const leaf2 = new THREE.SphereGeometry(size.w * 0.35, 12, 10)
  leaf2.translate(-size.w * 0.25, size.h * 0.5, 0)
  const leaf3 = new THREE.SphereGeometry(size.w * 0.35, 12, 10)
  leaf3.translate(size.w * 0.25, size.h * 0.5, 0)
  const leaf4 = new THREE.SphereGeometry(size.w * 0.3, 12, 10)
  leaf4.translate(0, size.h * 0.7, 0)
  return mergeGeos([trunk, leaf1, leaf2, leaf3, leaf4])
}

// 花：中心球体 + 5个花瓣球
function makeFlowerGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const stem = new THREE.CylinderGeometry(0.04, 0.05, size.h * 0.8, 6)
  stem.translate(0, -size.h * 0.1, 0)
  const center = new THREE.SphereGeometry(size.w * 0.2, 12, 10)
  center.translate(0, size.h * 0.35, 0)
  const petals: THREE.SphereGeometry[] = []
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const p = new THREE.SphereGeometry(size.w * 0.18, 10, 8)
    p.translate(Math.cos(a) * size.w * 0.35, size.h * 0.35, Math.sin(a) * size.w * 0.35)
    petals.push(p)
  }
  return mergeGeos([stem, center, ...petals])
}

// 草：圆柱簇
function makeGrassGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const blades: THREE.CylinderGeometry[] = []
  for (let i = 0; i < 20; i++) {
    const b = new THREE.CylinderGeometry(0.03, 0.02, size.h * (0.6 + Math.random() * 0.6), 4)
    const a = Math.random() * Math.PI * 2
    const r = Math.random() * size.w * 0.4
    b.translate(Math.cos(a) * r, size.h * 0.3, Math.sin(a) * r)
    blades.push(b)
  }
  return mergeGeos(blades)
}

// 月亮（月牙）：大球减去小球
function makeMoonGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  // 简化：扁球 + 偏移的另一个位置提示（用单一球体即可，后面材质发光）
  const g = new THREE.SphereGeometry(size.w / 2, 18, 14)
  g.scale(1, 1, 0.6)
  return g
}

// 塔：圆柱 + 圆锥
function makeTowerGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const base = new THREE.CylinderGeometry(size.w * 0.5, size.w * 0.55, size.h * 0.2, 12)
  base.translate(0, -size.h * 0.4, 0)
  const body = new THREE.CylinderGeometry(size.w * 0.38, size.w * 0.45, size.h * 0.55, 12)
  body.translate(0, -size.h * 0.025, 0)
  const mid = new THREE.CylinderGeometry(size.w * 0.45, size.w * 0.4, size.h * 0.08, 12)
  mid.translate(0, size.h * 0.3, 0)
  const roof = new THREE.ConeGeometry(size.w * 0.45, size.h * 0.2, 12)
  roof.translate(0, size.h * 0.45, 0)
  const top = new THREE.SphereGeometry(size.w * 0.1, 8, 6)
  top.translate(0, size.h * 0.58, 0)
  return mergeGeos([base, body, mid, roof, top])
}

// 桥：一个弯曲的板
function makeBridgeGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const arch = new THREE.TorusGeometry(size.w * 0.35, size.h * 0.12, 6, 24, Math.PI)
  arch.rotateX(Math.PI / 2)
  arch.translate(0, size.h * 0.4, 0)
  const deck = new THREE.BoxGeometry(size.w * 0.9, size.h * 0.1, size.d * 0.8)
  deck.translate(0, size.h * 0.3, 0)
  const p1 = new THREE.BoxGeometry(size.d * 0.15, size.h * 0.4, size.d * 0.7)
  p1.translate(-size.w * 0.35, size.h * 0.15, 0)
  const p2 = new THREE.BoxGeometry(size.d * 0.15, size.h * 0.4, size.d * 0.7)
  p2.translate(size.w * 0.35, size.h * 0.15, 0)
  return mergeGeos([arch, deck, p1, p2])
}

// 河：弯曲的薄板
function makeRiverGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const main = new THREE.BoxGeometry(size.w, size.h, size.d)
  main.translate(0, size.h / 2, 0)
  return main
}

// 彩虹：7 个同心圆环
function makeRainbowGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry[] {
  // 返回多个圆环（一个一个上色）
  const out: THREE.BufferGeometry[] = []
  const colors = ['#ff6b6b', '#ffa94d', '#ffe066', '#9ce37d', '#4ecdc4', '#5fa8e2', '#b084cc']
  for (let i = 0; i < 7; i++) {
    const r = (size.w / 2) * (1 - i * 0.08)
    const tube = 0.08
    const t = new THREE.TorusGeometry(r, tube, 6, 32, Math.PI)
    t.rotateZ(Math.PI) // 向上半圆
    // 向上提一点，让开口在下方
    t.translate(0, 0, 0)
    out.push(t)
  }
  // 把颜色信息存在一个数组里
  return out
}

const RAINBOW_COLORS = ['#ff6b6b', '#ffa94d', '#ffd93d', '#9ce37d', '#6ec5c2', '#5fa8e2', '#b084cc']

// 贝壳：扁平半球 + 线
function makeShellGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const shell = new THREE.SphereGeometry(size.w / 2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.2)
  shell.translate(0, 0, 0)
  shell.rotateX(-Math.PI / 2)
  return shell
}

// 羽毛：细长形
function makeFeatherGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const feather = new THREE.SphereGeometry(size.w / 2, 12, 8)
  feather.scale(0.1, 1, 1)
  return feather
}

// 山峰：圆锥
function makeMountainGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const m = new THREE.ConeGeometry(size.w / 2, size.h, 5)
  m.translate(0, size.h / 2, 0)
  return m
}

// 花瓣（斜扁球）
function makePetalGeometry(size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(size.w / 2, 16, 10)
  g.scale(1, 0.25, 1)
  g.translate(0, size.h / 2, 0)
  return g
}

// ============ 主组件：单个 piece 渲染 ============

interface ShapeMeshProps {
  piece: Piece
  isSelected: boolean
}

export function ShapeMesh({ piece, isSelected }: ShapeMeshProps) {
  const [hovered, setHovered] = useState(false)
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; lastSnapX: number; lastSnapZ: number }>({
    dragging: false, startX: 0, startY: 0, lastSnapX: 0, lastSnapZ: 0,
  })

  const size = getPieceSize(piece.type, piece.scale)

  // 计算几何
  const { mainMeshes, edgesGeometry } = useMemo(() => {
    const sz = size
    let geos: THREE.BufferGeometry[] = []
    let hasEdges = true
    switch (piece.type) {
      case 'cube':
      case 'slab':
      case 'pillar':
        geos = [new THREE.BoxGeometry(sz.w, sz.h, sz.d)]; break
      case 'sphere':
        geos = [new THREE.SphereGeometry(sz.w / 2, 24, 18)]; break
      case 'cloud':
        geos = [makeCloudGeometry(sz)]; break
      case 'star':
        geos = [makeStarGeometry({ w: sz.w, h: sz.h, d: sz.d })]; break
      case 'heart':
        geos = [makeHeartGeometry({ w: sz.w, h: sz.h, d: sz.d })]; break
      case 'petal':
        geos = [makePetalGeometry({ w: sz.w, h: sz.h, d: sz.d })]; break
      case 'crystal':
        geos = [makeCrystalGeometry(sz)]; break
      case 'feather':
        geos = [makeFeatherGeometry(sz)]; break
      case 'shell':
        geos = [makeShellGeometry(sz)]; break
      case 'mountain':
        geos = [makeMountainGeometry(sz)]; break
      case 'tree':
        geos = [makeTreeGeometry(sz)]; break
      case 'rainbow':
        geos = makeRainbowGeometry(sz); break  // 多个
      case 'grass':
        geos = [makeGrassGeometry(sz)]; break
      case 'flower':
        geos = [makeFlowerGeometry(sz)]; break
      case 'moon':
        geos = [makeMoonGeometry(sz)]; break
      case 'tower':
        geos = [makeTowerGeometry(sz)]; break
      case 'bridge':
        geos = [makeBridgeGeometry(sz)]; break
      case 'river':
        geos = [makeRiverGeometry(sz)]; break
      case 'text-label':
        hasEdges = false; geos = []; break
      default:
        geos = [new THREE.BoxGeometry(sz.w, sz.h, sz.d)]
    }

    const edges = hasEdges && geos[0] ? new THREE.EdgesGeometry(geos[0], 15) : null
    return { mainMeshes: geos, edgesGeometry: edges }
  }, [piece.type, size.w, size.h, size.d])

  // 计算中心 Y（底部对齐到 position.y）
  const yCenter = piece.position[1] + size.h / 2

  // 材质参数
  const effectiveMetal = piece.metalness || 0
  const useGlow = piece.material === 'glow'
  const useMat = piece.material === 'mat'
  const materialProps = useMemo(() => ({
    roughness: useGlow ? 0.3 : useMat ? 1.0 : 0.65,
    metalness: useGlow ? 0.1 : effectiveMetal,
    emissiveIntensity: useGlow ? 1.2 : (isSelected ? 0.4 : hovered ? 0.15 : 0),
  }), [useGlow, useMat, effectiveMetal, isSelected, hovered])

  // 交互
  const { selectPiece, mode, updatePiece } = useShapeStore()

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (dragState.current.dragging) return
    selectPiece(piece.id)
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPiece(piece.id)
    if (mode !== 'select') return
    dragState.current.dragging = true
    dragState.current.startX = e.clientX
    dragState.current.startY = e.clientY
    dragState.current.lastSnapX = piece.position[0]
    dragState.current.lastSnapZ = piece.position[2]

    const onMove = (we: PointerEvent) => {
      if (!dragState.current.dragging) return
      const dx = (we.clientX - dragState.current.startX) / 40
      const dz = -(we.clientY - dragState.current.startY) / 40
      const accumX = dragState.current.lastSnapX + Math.round(dx)
      const accumZ = dragState.current.lastSnapZ + Math.round(dz)
      if (accumX !== dragState.current.lastSnapX || accumZ !== dragState.current.lastSnapZ) {
        updatePiece(piece.id, { position: [accumX, piece.position[1], accumZ] })
        dragState.current.lastSnapX = accumX
        dragState.current.lastSnapZ = accumZ
        dragState.current.startX = we.clientX
        dragState.current.startY = we.clientY
      }
    }
    const onUp = () => {
      dragState.current.dragging = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // 彩虹：分开渲染不同颜色
  if (piece.type === 'rainbow') {
    return (
      <group position={[piece.position[0], piece.position[1] + size.h * 0.1, piece.position[2]]}>
        {mainMeshes.map((g, i) => (
          <mesh key={i} geometry={g}
            onClick={handleClick} onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }} onPointerOut={() => setHovered(false)}>
            <meshStandardMaterial color={RAINBOW_COLORS[i]} transparent opacity={Math.min(1, piece.opacity + 0.15)} roughness={0.4} side={THREE.DoubleSide} emissive={RAINBOW_COLORS[i]} emissiveIntensity={isSelected ? 0.8 : 0.3} />
          </mesh>
        ))}
      </group>
    )
  }

  // 文字标签
  if (piece.type === 'text-label') {
    return (
      <group position={[piece.position[0], piece.position[1] + size.h / 2, piece.position[2]]}>
        <mesh onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <boxGeometry args={[size.w, size.h, 0.05]} />
          <meshStandardMaterial color={piece.color} transparent opacity={0.15 * piece.opacity} />
        </mesh>
        <Html position={[0, 0, 0.01]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div style={{
            color: piece.color,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: 2,
            textShadow: `0 0 8px ${piece.color}80`,
            whiteSpace: 'nowrap',
            padding: '4px 8px',
            background: 'rgba(0,0,0,0.15)',
            borderRadius: 8,
          }}>{piece.label || '✨'}</div>
        </Html>
      </group>
    )
  }

  // 通用 mesh（大多数 piece）
  const geom = mainMeshes[0]
  return (
    <group position={[piece.position[0], yCenter, piece.position[2]]} rotation={[0, (piece.rotationY * Math.PI) / 180, 0]}>
      <mesh geometry={geom} castShadow receiveShadow
        onClick={handleClick} onPointerDown={handlePointerDown}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}>
        <meshStandardMaterial color={piece.color}
          transparent={piece.opacity < 1 || piece.type === 'cloud'} opacity={piece.opacity}
          roughness={materialProps.roughness} metalness={materialProps.metalness}
          emissive={piece.color} emissiveIntensity={materialProps.emissiveIntensity}
          side={piece.type === 'shell' || piece.type === 'cloud' ? THREE.DoubleSide : THREE.FrontSide} />
      </mesh>
      {(isSelected || hovered) && edgesGeometry && (
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color={isSelected ? '#ffb3d9' : '#ffffff'} transparent opacity={isSelected ? 0.9 : 0.5} />
        </lineSegments>
      )}
      {isSelected && (
        <mesh geometry={geom} scale={1.1}>
          <meshBasicMaterial color={piece.color} transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  )
}

// ============== 悬停预览 ghost ==============
export function GhostShape({ type, position, color }: { type: PieceType; position: [number, number, number]; color: string }) {
  const size = getPieceSize(type, 1)
  const { geometry } = useMemo(() => {
    if (type === 'rainbow') return { geometry: null }
    if (type === 'text-label') return { geometry: new THREE.BoxGeometry(size.w, size.h, 0.05) }
    let g: THREE.BufferGeometry = new THREE.BoxGeometry(size.w, size.h, size.d)
    switch (type) {
      case 'cube': case 'slab': case 'pillar': g = new THREE.BoxGeometry(size.w, size.h, size.d); break
      case 'sphere': case 'cloud': case 'moon': g = new THREE.SphereGeometry(size.w / 2, 18, 14); break
      case 'star': g = makeStarGeometry(size); break
      case 'heart': g = makeHeartGeometry(size); break
      case 'petal': g = makePetalGeometry(size); break
      case 'crystal': g = makeCrystalGeometry(size); break
      case 'feather': g = makeFeatherGeometry(size); break
      case 'shell': g = makeShellGeometry(size); break
      case 'mountain': g = makeMountainGeometry(size); break
      case 'tree': g = makeTreeGeometry(size); break
      case 'grass': g = makeGrassGeometry(size); break
      case 'flower': g = makeFlowerGeometry(size); break
      case 'tower': g = makeTowerGeometry(size); break
      case 'bridge': g = makeBridgeGeometry(size); break
      case 'river': g = makeRiverGeometry(size); break
    }
    return { geometry: g }
  }, [type, size.w, size.h, size.d])
  const yCenter = position[1] + size.h / 2
  return (
    <group position={[position[0], yCenter, position[2]]}>
      {type === 'rainbow' ? (
        RAINBOW_COLORS.map((c, i) => {
          const r = (size.w / 2) * (1 - i * 0.08)
          const g = new THREE.TorusGeometry(r, 0.08, 6, 32, Math.PI)
          g.rotateZ(Math.PI)
          return <mesh key={i} geometry={g}><meshStandardMaterial color={c} transparent opacity={0.25} emissive={c} emissiveIntensity={0.6} /></mesh>
        })
      ) : (
        <mesh geometry={geometry}><meshStandardMaterial color={color} transparent opacity={0.25} emissive={color} emissiveIntensity={0.3} /></mesh>
      )}
    </group>
  )
}
