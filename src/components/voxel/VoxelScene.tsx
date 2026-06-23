import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useVoxelWorldStore, BLOCK_DEFS, type Block, type BlockType } from './voxelWorldStore'
import { usePhysicsStore } from './physicsStore'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

const RAY_DISTANCE = 6
const MOVE_SPEED = 8
const JUMP_FORCE = 8
const PLAYER_HEIGHT = 1.7

// ============ 键盘状态 ============
const keys: Record<string, boolean> = {}
const onKeyEvent = (e: KeyboardEvent) => { keys[e.code] = e.type === 'keydown' }
window.addEventListener('keydown', onKeyEvent)
window.addEventListener('keyup', onKeyEvent)

// ============ 静态地形渲染（InstancedMesh）============
function VoxelTerrain({ blocks }: { blocks: Map<string, Block> }) {
  // 按类型分组
  const groups = useMemo(() => {
    const g: Record<string, string[]> = {}
    blocks.forEach((b, key) => {
      if (!g[b.type]) g[b.type] = []
      g[b.type].push(key)
    })
    return g
  }, [blocks])

  return (
    <>
      {Object.entries(groups).map(([type, ks]) => (
        <TerrainMesh key={type} type={type as BlockType} keys={ks} />
      ))}
    </>
  )
}

// 单类型InstancedMesh terrain
function TerrainMesh({ type, keys }: { type: BlockType; keys: string[] }) {
  const def = BLOCK_DEFS[type]
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = keys.length

  // 初始化矩阵
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    keys.forEach((key, i) => {
      const [x, y, z] = key.split(',').map(Number)
      dummy.position.set(x + 0.5, y + 0.5, z + 0.5)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [keys, count])

  if (count === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
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
        opacity={def.transparent ? 0.75 : 1}
        roughness={0.85}
        metalness={0.05}
      />
    </instancedMesh>
  )
}

// ============ 十字准星 ============
function CrosshairTarget() {
  const { camera } = useThree()
  const setCrosshairTarget = useVoxelWorldStore((s) => s.setCrosshairTarget)
  const blocks = useVoxelWorldStore((s) => s.blocks)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const targetRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
    const origin = raycaster.ray.origin
    const dir = raycaster.ray.direction

    let hitBlock: [number, number, number] | null = null
    let hitFace: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west' | null = null
    const step = 0.05

    for (let t = 0; t < RAY_DISTANCE; t += step) {
      const bx = Math.floor(origin.x + dir.x * t)
      const by = Math.floor(origin.y + dir.y * t)
      const bz = Math.floor(origin.z + dir.z * t)
      const key = `${bx},${by},${bz}`
      if (blocks.has(key)) {
        hitBlock = [bx, by, bz]
        const fx = origin.x + dir.x * t - bx
        const fy = origin.y + dir.y * t - by
        const fz = origin.z + dir.z * t - bz
        const dx = Math.abs(fx - 0.5)
        const dy = Math.abs(fy - 0.5)
        const dz = Math.abs(fz - 0.5)
        if (dy > dx && dy > dz) hitFace = fy > 0.5 ? 'top' : 'bottom'
        else if (dx > dz) hitFace = fx > 0.5 ? 'east' : 'west'
        else hitFace = fz > 0.5 ? 'south' : 'north'
        break
      }
    }

    if (targetRef.current) {
      if (hitBlock) {
        targetRef.current.visible = true
        let [px, py, pz] = hitBlock
        if (hitFace === 'top') py += 1
        else if (hitFace === 'bottom') py -= 1
        else if (hitFace === 'east') px += 1
        else if (hitFace === 'west') px -= 1
        else if (hitFace === 'south') pz += 1
        else if (hitFace === 'north') pz -= 1
        targetRef.current.position.set(px + 0.5, py + 0.5, pz + 0.5)
      } else {
        targetRef.current.visible = false
      }
    }

    if (hitBlock) {
      let [px, py, pz] = hitBlock
      if (hitFace === 'top') py += 1
      else if (hitFace === 'bottom') py -= 1
      else if (hitFace === 'east') px += 1
      else if (hitFace === 'west') px -= 1
      else if (hitFace === 'south') pz += 1
      else if (hitFace === 'north') pz -= 1
      setCrosshairTarget([px, py, pz], hitFace)
    } else {
      setCrosshairTarget(null, null)
    }
  })

  return (
    <mesh ref={targetRef} visible={false}>
      <boxGeometry args={[1.01, 1.01, 1.01]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.6} />
    </mesh>
  )
}

// ============ 物理世界 ============
interface SpawnData { id: string; type: BlockType; position: [number,number,number]; velocity: [number,number,number]; mass: number }
interface DynamicMeshInfo { id: string; body: CANNON.Body; mesh: THREE.Mesh; bornAt: number }

function PhysicsWorld() {
  const { camera, scene, gl } = useThree()
  const blocks = useVoxelWorldStore((s) => s.blocks)
  const placeBlock = useVoxelWorldStore((s) => s.placeBlock)
  const crosshairTarget = useVoxelWorldStore((s) => s.crosshairTarget)
  const scheduleSpawn = usePhysicsStore((s) => s.scheduleSpawn)
  const consumeSpawns = usePhysicsStore((s) => s.consumeSpawns)
  const consumeRemoves = usePhysicsStore((s) => s.consumeRemoves)
  const setActiveCount = usePhysicsStore((s) => s.setActiveCount)
  const throwMode = usePhysicsStore((s) => s.throwMode)
  const selectedSlot = useVoxelWorldStore((s) => s.selectedSlot)
  const isLockedRef = useRef(false)

  const worldRef = useRef<CANNON.World | null>(null)
  const dynamicMeshesRef = useRef<Map<string, DynamicMeshInfo>>(new Map())
  const terrainBodiesRef = useRef<Map<string, CANNON.Body>>(new Map())
  const physicsGroupRef = useRef<THREE.Group>(null)
  const tempQuat = useMemo(() => new THREE.Quaternion(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])

  // 初始化物理世界
  useEffect(() => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -18, 0) })
    world.broadphase = new CANNON.NaiveBroadphase()
    world.allowSleep = true
    world.defaultContactMaterial.friction = 0.4
    ;(world.solver as any).iterations = 10
    worldRef.current = world
    return () => { world.clearForces() }
  }, [])

  // 同步地形碰撞体（优化：只对玩家放置的方块做碰撞体）
  useEffect(() => {
    const world = worldRef.current
    if (!world) return
    const existingKeys = terrainBodiesRef.current
    const newKeys = new Set<string>()

    // 只处理玩家放置的方块（placed=true），不处理地形方块
    blocks.forEach((b, key) => {
      if (!b.placed) return
      newKeys.add(key)
      if (existingKeys.has(key)) return
      const [x, y, z] = key.split(',').map(Number)
      const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
      const body = new CANNON.Body({ mass: 0, shape, position: new CANNON.Vec3(x + 0.5, y + 0.5, z + 0.5), type: CANNON.Body.STATIC })
      world.addBody(body)
      existingKeys.set(key, body)
    })

    // 移除被删除的玩家方块
    existingKeys.forEach((body, key) => {
      if (!newKeys.has(key)) {
        world.removeBody(body)
        existingKeys.delete(key)
      }
    })
  }, [blocks])

  // 重力
  const gravity = usePhysicsStore((s) => s.gravity)
  useEffect(() => {
    if (worldRef.current) worldRef.current.gravity.set(0, -gravity, 0)
  }, [gravity])

  // 鼠标/键盘事件
  useEffect(() => {
    const canvas = gl.domElement
    const onClick = () => {
      if (!isLockedRef.current) canvas.requestPointerLock()
    }
    const onPointerLockChange = () => {
      isLockedRef.current = document.pointerLockElement === canvas
      useVoxelWorldStore.getState().setLocked(isLockedRef.current)
    }
    const yaw = { current: 0 }
    const pitch = { current: 0 }
    const onMouseMove = (e: MouseEvent) => {
      if (!isLockedRef.current) return
      yaw.current -= e.movementX * 0.002
      pitch.current -= e.movementY * 0.002
      pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch.current))
      camera.rotation.order = 'YXZ'
      camera.rotation.y = yaw.current
      camera.rotation.x = pitch.current
    }
    const onMouseDown = (e: MouseEvent) => {
      if (!isLockedRef.current) return
      if (e.button === 0) {
        if (throwMode) {
          const dir = new THREE.Vector3()
          camera.getWorldDirection(dir)
          const origin = camera.position.clone().add(dir.clone().multiplyScalar(1))
          const selectedType = HOTBAR_TYPES[selectedSlot]
          scheduleSpawn({ id: Math.random().toString(36).slice(2, 10), type: selectedType, position: [origin.x, origin.y, origin.z], velocity: [dir.x * 22, dir.y * 22 + 2, dir.z * 22], mass: 1 })
          return
        }
        if (crosshairTarget) {
          const key = `${crosshairTarget[0]},${crosshairTarget[1]},${crosshairTarget[2]}`
          const block = blocks.get(key)
          if (block?.placed) {
            useVoxelWorldStore.getState().removeBlock(crosshairTarget[0], crosshairTarget[1], crosshairTarget[2])
          }
        }
      } else if (e.button === 2 && !throwMode && crosshairTarget) {
        placeBlock(crosshairTarget[0], crosshairTarget[1], crosshairTarget[2])
      }
    }
    const onContextMenu = (e: Event) => e.preventDefault()
    const onKeyDown = (e: KeyboardEvent) => { if (e.code === 'Escape') document.exitPointerLock() }

    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [gl, camera, blocks, crosshairTarget, placeBlock, scheduleSpawn, throwMode, selectedSlot])

  const velocityRef = useRef(new THREE.Vector3())
  const onGroundRef = useRef(false)

  useFrame((_, delta) => {
    const world = worldRef.current
    if (!world) return
    const fixedDt = Math.min(delta, 1 / 30)
    world.step(1 / 60, fixedDt, 3)

    // 消费生成
    const spawns = consumeSpawns()
    const group = physicsGroupRef.current
    if (group) {
      spawns.forEach((d) => {
        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
        const body = new CANNON.Body({ mass: d.mass, shape, position: new CANNON.Vec3(d.position[0], d.position[1], d.position[2]), linearDamping: 0.05, angularDamping: 0.1 })
        body.velocity.set(d.velocity[0], d.velocity[1], d.velocity[2])
        body.angularVelocity.set((Math.random() - 0.5) * 2, Math.random() * 2, (Math.random() - 0.5) * 2)
        world.addBody(body)
        const def = BLOCK_DEFS[d.type]
        const geo = new THREE.BoxGeometry(1, 1, 1)
        const mat = new THREE.MeshStandardMaterial({ color: def.color, emissive: def.emissive ? def.color : '#000000', emissiveIntensity: def.emissive || 0, transparent: def.transparent || false, opacity: def.transparent ? 0.75 : 1, roughness: 0.6, metalness: 0.1 })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.userData = { physicsId: d.id }
        group.add(mesh)
        dynamicMeshesRef.current.set(d.id, { id: d.id, body, mesh, bornAt: performance.now() })
      })
    }

    // 消费销毁
    const removes = consumeRemoves()
    if (group) {
      removes.forEach((id) => {
        const info = dynamicMeshesRef.current.get(id)
        if (!info) return
        world.removeBody(info.body)
        group.remove(info.mesh)
        info.mesh.geometry.dispose()
        ;(info.mesh.material as THREE.Material).dispose()
        dynamicMeshesRef.current.delete(id)
      })
    }

    // 同步位置
    const toRemove: string[] = []
    dynamicMeshesRef.current.forEach((info) => {
      const m = info.mesh
      if (!m) return
      m.position.set(info.body.position.x, info.body.position.y, info.body.position.z)
      tempPos.copy(m.position)
      m.quaternion.set(info.body.quaternion.x, info.body.quaternion.y, info.body.quaternion.z, info.body.quaternion.w)
      tempQuat.copy(m.quaternion)
      if (info.body.position.y < -30) toRemove.push(info.id)
    })

    const MAX_DYNAMIC = 120
    if (dynamicMeshesRef.current.size > MAX_DYNAMIC) {
      const sorted = [...dynamicMeshesRef.current.values()].sort((a, b) => a.bornAt - b.bornAt)
      const over = sorted.slice(0, sorted.length - MAX_DYNAMIC)
      over.forEach((x) => toRemove.push(x.id))
    }

    if (toRemove.length) {
      toRemove.forEach((id) => {
        const info = dynamicMeshesRef.current.get(id)
        if (!info || !group) return
        world.removeBody(info.body)
        group.remove(info.mesh)
        info.mesh.geometry.dispose()
        ;(info.mesh.material as THREE.Material).dispose()
        dynamicMeshesRef.current.delete(id)
      })
    }

    setActiveCount(dynamicMeshesRef.current.size)

    // 玩家移动
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    if (forward.lengthSq() > 0) forward.normalize()
    const right = new THREE.Vector3()
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()
    const moveDir = new THREE.Vector3()
    if (keys['KeyW'] || keys['ArrowUp']) moveDir.add(forward)
    if (keys['KeyS'] || keys['ArrowDown']) moveDir.sub(forward)
    if (keys['KeyA'] || keys['ArrowLeft']) moveDir.sub(right)
    if (keys['KeyD'] || keys['ArrowRight']) moveDir.add(right)
    if (moveDir.lengthSq() > 0) { moveDir.normalize(); velocityRef.current.x = moveDir.x * MOVE_SPEED; velocityRef.current.z = moveDir.z * MOVE_SPEED }
    else { velocityRef.current.x *= 0.8; velocityRef.current.z *= 0.8 }
    if (keys['Space'] && onGroundRef.current) { velocityRef.current.y = JUMP_FORCE; onGroundRef.current = false }
    velocityRef.current.y -= 22 * delta
    camera.position.x += velocityRef.current.x * delta
    camera.position.y += velocityRef.current.y * delta
    camera.position.z += velocityRef.current.z * delta
    const groundY = 2 + PLAYER_HEIGHT / 2
    if (camera.position.y < groundY) { camera.position.y = groundY; velocityRef.current.y = 0; onGroundRef.current = true }
    camera.position.x = Math.max(0.5, Math.min(63.5, camera.position.x))
    camera.position.z = Math.max(0.5, Math.min(63.5, camera.position.z))
  })

  return <group ref={physicsGroupRef} />
}

const HOTBAR_TYPES: BlockType[] = ['grass', 'dirt', 'stone', 'wood', 'planks', 'cobblestone', 'brick', 'sand', 'glass', 'water', 'leaves', 'flower_red', 'flower_yellow', 'torch', 'wool_pink', 'snow', 'iron', 'gold', 'diamond', 'obsidian']

// ============ 光照 ============
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#8899bb" />
      <directionalLight position={[30, 50, 20]} intensity={1.2} color="#fff5e0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-far={200} shadow-camera-left={-80} shadow-camera-right={80} shadow-camera-top={80} shadow-camera-bottom={-80} />
      <hemisphereLight args={['#87ceeb', '#4a7a4a', 0.3]} />
    </>
  )
}

// ============ 天空 ============
function Sky() {
  return (
    <mesh scale={[200, 200, 200]}>
      <sphereGeometry args={[1, 16, 8]} />
      <meshBasicMaterial color="#87ceeb" side={THREE.BackSide} />
    </mesh>
  )
}

// ============ 主场景 ============
export function VoxelScene() {
  const blocks = useVoxelWorldStore((s) => s.blocks)

  return (
    <Canvas
      shadows
      camera={{ position: [32, 20, 32], fov: 60, near: 0.1, far: 500 }}
      gl={{ antialias: true, powerPreference: 'default' }}
      style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
    >
      <fog attach="fog" args={['#b8d8f8', 80, 200]} />
      <Lighting />
      <Sky />
      <VoxelTerrain blocks={blocks} />
      <PhysicsWorld />
      <CrosshairTarget />
    </Canvas>
  )
}
