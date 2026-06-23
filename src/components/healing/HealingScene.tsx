import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useShapeStore, getPieceSize } from './healingStore'
import { ShapeMesh, GhostShape } from './ShapeMesh'
import * as THREE from 'three'

// ============ 交互处理器 ============
function PlacementHandler() {
  const { camera, gl } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const { pieces, activeType, activeColor, mode, hoverPos, setHoverPos, addPiece, selectPiece } = useShapeStore()

  useEffect(() => {
    const dom = gl.domElement
    const getIntersection = (ev: PointerEvent): [number, number, number] | null => {
      const rect = dom.getBoundingClientRect()
      const nx = ((ev.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -((ev.clientY - rect.top) / rect.height) + 1
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera)
      // 先检测 pieces（堆叠）
      let topY = 0
      for (const p of pieces) {
        const size = getPieceSize(p.type, p.scale)
        const half = { w: size.w / 2 + 0.1, h: size.h, d: size.d / 2 + 0.1 }
        const min = new THREE.Vector3(p.position[0] - half.w, p.position[1], p.position[2] - half.d)
        const max = new THREE.Vector3(p.position[0] + half.w, p.position[1] + half.h, p.position[2] + half.d)
        const box = new THREE.Box3(min, max)
        const hit = new THREE.Vector3()
        if (raycaster.ray.intersectBox(box, hit)) {
          if (hit.y > topY) topY = hit.y
        }
      }
      const hit = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, hit)) {
        return [Math.round(hit.x), topY, Math.round(hit.z)]
      }
      return null
    }

    const onMove = (ev: PointerEvent) => {
      if (mode !== 'place') return
      setHoverPos(getIntersection(ev))
    }
    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return
      if (mode === 'place') {
        const snap = getIntersection(ev)
        if (snap) addPiece(snap)
      } else {
        selectPiece(null)
      }
    }
    const onLeave = () => setHoverPos(null)
    dom.addEventListener('pointermove', onMove)
    dom.addEventListener('pointerdown', onDown)
    dom.addEventListener('pointerleave', onLeave)
    return () => {
      dom.removeEventListener('pointermove', onMove)
      dom.removeEventListener('pointerdown', onDown)
      dom.removeEventListener('pointerleave', onLeave)
    }
  }, [gl, camera, pieces, mode, setHoverPos, addPiece, selectPiece, raycaster, plane, activeType, activeColor])
  return null
}

// ============ 地面 ============
function Ground() {
  const { selectPiece } = useShapeStore()
  return (
    <group>
      {/* 主地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]} onClick={() => selectPiece(null)}>
        <planeGeometry args={[80, 80, 16, 16]} />
        <meshStandardMaterial color="#2a3848" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* 网格 */}
      <gridHelper args={[60, 60, '#4a5e6d', '#3a4a58']} position={[0, 0.01, 0]} />
      {/* 细网格叠加 */}
      <gridHelper args={[20, 20, '#5a7080', '#4a5e6d']} position={[0, 0.015, 0]} />
    </group>
  )
}

// ============ 环境光与天空 ============
function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#a8c0e0" />
      <hemisphereLight args={['#d8e8ff', '#2a1e3e', 0.45]} />
      <directionalLight
        position={[15, 22, 15]} intensity={1.15} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-left={-25} shadow-camera-right={25}
        shadow-camera-top={25} shadow-camera-bottom={-25}
      />
      {/* 补光 */}
      <pointLight position={[-8, 6, -8]} intensity={0.6} color="#ffd8a8" distance={30} />
      <pointLight position={[8, 5, 8]} intensity={0.4} color="#a8e0ff" distance={25} />
    </>
  )
}

// ============ 漂浮的云与粒子 ============
function FloatingAtmos() {
  const group = useRef<THREE.Group>(null!)
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.03
  })
  // 粒子
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50
      arr[i * 3 + 1] = Math.random() * 15 + 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return arr
  }, [])
  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={200} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ffe8a0" size={0.15} transparent opacity={0.55} sizeAttenuation />
      </points>
    </group>
  )
}

// ============ 天空圆顶（大球内表面渐变）============
function SkyDome() {
  const shader = useMemo(() => ({
    uniforms: { uTop: { value: new THREE.Color('#1a1630') }, uBottom: { value: new THREE.Color('#2d1a40') } },
    vertexShader: `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vPos; uniform vec3 uTop; uniform vec3 uBottom;
      void main() {
        float h = normalize(vPos).y * 0.5 + 0.5;
        vec3 col = mix(uBottom, uTop, pow(h, 0.8));
        gl_FragColor = vec4(col, 1.0);
      }`,
  }), [])
  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[80, 32, 16]} />
      <shaderMaterial attach="material" {...shader as any} side={THREE.BackSide} />
    </mesh>
  )
}

// ============ 星空粒子 ============
function StarField() {
  const starPositions = useMemo(() => {
    const arr = new Float32Array(400 * 3)
    for (let i = 0; i < 400; i++) {
      const r = 50 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.8 + 8
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={400} array={starPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffd8a0" size={0.5} transparent opacity={0.9} sizeAttenuation />
    </points>
  )
}

// ============ 主场景 ============
function SceneContent() {
  const { pieces, selectedId, mode, hoverPos, activeType, activeColor } = useShapeStore()
  return (
    <>
      <SkyDome />
      <StarField />
      <Lights />
      <Ground />
      <FloatingAtmos />
      {pieces.map((p) => <ShapeMesh key={p.id} piece={p} isSelected={selectedId === p.id} />)}
      {mode === 'place' && hoverPos && <GhostShape type={activeType} position={hoverPos} color={activeColor} />}
      <PlacementHandler />
    </>
  )
}

export function HealingScene({ height = '100%' }: { height?: string }) {
  return (
    <Canvas
      shadows
      camera={{ position: [14, 12, 14], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height, background: 'linear-gradient(180deg, #1a1430 0%, #2a1e40 100%)' }}
    >
      <fog attach="fog" args={['#1a1430', 35, 80]} />
      <SceneContent />
      <OrbitControls
        makeDefault
        enablePan
        enableRotate
        enableZoom
        maxPolarAngle={Math.PI / 2 - 0.02}
        minDistance={3}
        maxDistance={55}
      />
    </Canvas>
  )
}
