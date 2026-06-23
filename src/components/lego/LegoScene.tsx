import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useLegoStore, getPieceSize } from './legoStore'
import { PieceMesh, GhostPiece } from './PieceMesh'
import * as THREE from 'three'

// Ground placement helper: raycasts from mouse, finds grid position on ground
// or top of existing pieces for stacking.
function PlacementHandler() {
  const { camera, gl } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useRef(new THREE.Vector2())
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const temp = useRef(new THREE.Vector3())
  const piecesRef = useRef<{ pos: [number, number, number]; type: string }[]>([])

  const { pieces, activeType, activeColor, mode, hoverPos, setHoverPos, addPiece, selectPiece } = useLegoStore()

  // Keep piecesRef in sync for raycasting
  useEffect(() => {
    piecesRef.current = pieces.map((p) => ({ pos: p.position, type: p.type }))
  }, [pieces])

  useFrame(() => {
    if (mode !== 'place') return
    if (hoverPos === null) return
  })

  // attach pointer handlers
  useEffect(() => {
    const dom = gl.domElement

    const getIntersection = (ev: PointerEvent): [number, number, number] | null => {
      const rect = dom.getBoundingClientRect()
      const nx = ((ev.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -((ev.clientY - rect.top) / rect.height) * 2 + 1
      mouse.current.set(nx, ny)
      raycaster.setFromCamera(mouse.current, camera)
      // Test against all pieces first (for stacking)
      const hitPieces: { y: number; x: number; z: number }[] = []
      for (const p of pieces) {
        const size = getPieceSize(p.type, p.scale)
        const half = { w: size.w / 2 + 0.1, h: size.h / 2, d: size.d / 2 + 0.1 }
        const boxMin = new THREE.Vector3(
          p.position[0] - half.w,
          p.position[1],
          p.position[2] - half.d
        )
        const boxMax = new THREE.Vector3(
          p.position[0] + half.w,
          p.position[1] + size.h,
          p.position[2] + half.d
        )
        const box = new THREE.Box3(boxMin, boxMax)
        if (raycaster.ray.intersectBox(box, temp.current)) {
          hitPieces.push({ y: boxMax.y, x: temp.current.x, z: temp.current.z })
        }
      }
      if (raycaster.ray.intersectPlane(plane, temp.current)) {
        let y = 0
        if (hitPieces.length > 0) {
          const top = hitPieces.reduce((max, cur) => (cur.y > max.y ? cur : max), hitPieces[0])
          y = top.y
        }
        const snapped: [number, number, number] = [
          Math.round(temp.current.x),
          y,
          Math.round(temp.current.z),
        ]
        return snapped
      }
      return null
    }

    const onMove = (ev: PointerEvent) => {
      if (mode !== 'place') return
      const snap = getIntersection(ev)
      setHoverPos(snap)
    }
    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return
      if (mode !== 'place') return
      const snap = getIntersection(ev)
      if (snap) {
        addPiece(snap)
      } else {
        selectPiece(null)
      }
    }
    const onLeave = () => {
      setHoverPos(null)
    }
    dom.addEventListener('pointermove', onMove)
    dom.addEventListener('pointerdown', onDown)
    dom.addEventListener('pointerleave', onLeave)
    return () => {
      dom.removeEventListener('pointermove', onMove)
      dom.removeEventListener('pointerdown', onDown)
      dom.removeEventListener('pointerleave', onLeave)
    }
  }, [gl, camera, pieces, mode, setHoverPos, addPiece, selectPiece, raycaster, plane])

  return null
}

function GroundPlane() {
  const { selectPiece } = useLegoStore()
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onPointerMissed={() => selectPiece(null)}
    >
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial color="#2a2e3a" roughness={1} metalness={0} />
    </mesh>
  )
}

function Grid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  // two-line color grid
  return (
    <group>
      <gridHelper ref={gridRef} args={[120, 120, '#4a5060', '#343846']} />
      {/* highlight main axes */}
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#aac8ff" />
    </>
  )
}

function SceneContent() {
  const { pieces, selectedId, mode, hoverPos, activeType, activeColor } = useLegoStore()

  return (
    <>
      <Lights />
      <Grid />
      <GroundPlane />
      {pieces.map((p) => (
        <PieceMesh key={p.id} piece={p} isSelected={selectedId === p.id} />
      ))}
      {mode === 'place' && hoverPos && (
        <GhostPiece type={activeType} position={hoverPos} color={activeColor} />
      )}
      <PlacementHandler />
    </>
  )
}

export function LegoScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [12, 12, 12], fov: 50 }}
      style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #1a1d29 0%, #2a2e3a 100%)' }}
    >
      <SceneContent />
      <OrbitControls
        makeDefault
        enablePan
        enableRotate
        enableZoom
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={60}
      />
    </Canvas>
  )
}
