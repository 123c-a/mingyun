import { useRef, useState, useMemo, useEffect } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { useLegoStore, Piece, PieceType, getPieceSize } from './legoStore'
import * as THREE from 'three'

function makeGeometry(type: PieceType, size: { w: number; h: number; d: number }): THREE.BufferGeometry {
  switch (type) {
    case 'brick-1x1':
    case 'brick-2x2':
    case 'brick-2x4':
    case 'plate-2x2':
    case 'plate-2x4':
    case 'roof':
      return new THREE.BoxGeometry(size.w, size.h, size.d)
    case 'cylinder':
      return new THREE.CylinderGeometry(size.w / 2, size.w / 2, size.h, 16)
    case 'sphere':
      return new THREE.SphereGeometry(size.w / 2, 20, 16)
    case 'cone':
      return new THREE.ConeGeometry(size.w / 2, size.h, 16)
    default:
      return new THREE.BoxGeometry(size.w, size.h, size.d)
  }
}

interface PieceMeshProps {
  piece: Piece
  isSelected: boolean
}

export function PieceMesh({ piece, isSelected }: PieceMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const dragState = useRef<{
    dragging: boolean
    lastSnapX: number
    lastSnapZ: number
    startX: number
    startY: number
    moved: boolean
  }>({
    dragging: false,
    lastSnapX: 0,
    lastSnapZ: 0,
    startX: 0,
    startY: 0,
    moved: false,
  })

  const size = getPieceSize(piece.type, piece.scale)
  const geometry = useMemo(() => makeGeometry(piece.type, size), [piece.type, size.w, size.h, size.d])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])
  const yCenter = piece.position[1] + size.h / 2

  const { selectPiece, movePiece, mode } = useLegoStore()

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (dragState.current.moved) return
    selectPiece(piece.id)
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPiece(piece.id)
    if (e.button !== 0) return
    // Only enable drag in select mode; in place mode, clicking places a new piece on top.
    if (mode !== 'select') return
    dragState.current.dragging = true
    dragState.current.moved = false
    dragState.current.lastSnapX = piece.position[0]
    dragState.current.lastSnapZ = piece.position[2]
    dragState.current.startX = e.clientX
    dragState.current.startY = e.clientY

    const onWindowMove = (we: PointerEvent) => {
      if (!dragState.current.dragging) return
      const dxPx = we.clientX - dragState.current.startX
      const dyPx = we.clientY - dragState.current.startY
      if (Math.abs(dxPx) > 4 || Math.abs(dyPx) > 4) {
        dragState.current.moved = true
      }
      const worldDx = dxPx / 50
      const worldDz = -dyPx / 50
      const accumX = dragState.current.lastSnapX + Math.round(worldDx)
      const accumZ = dragState.current.lastSnapZ + Math.round(worldDz)
      if (accumX !== dragState.current.lastSnapX || accumZ !== dragState.current.lastSnapZ) {
        movePiece(piece.id, [accumX, piece.position[1], accumZ])
        dragState.current.lastSnapX = accumX
        dragState.current.lastSnapZ = accumZ
        dragState.current.startX = we.clientX
        dragState.current.startY = we.clientY
      }
    }
    const onWindowUp = () => {
      dragState.current.dragging = false
      window.removeEventListener('pointermove', onWindowMove)
      window.removeEventListener('pointerup', onWindowUp)
      window.removeEventListener('pointercancel', onWindowUp)
    }
    window.addEventListener('pointermove', onWindowMove)
    window.addEventListener('pointerup', onWindowUp)
    window.addEventListener('pointercancel', onWindowUp)
  }

  return (
    <group
      ref={groupRef}
      position={[piece.position[0], yCenter, piece.position[2]]}
      rotation={[0, (piece.rotationY * Math.PI) / 180, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
        }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
      >
        <meshStandardMaterial color={piece.color} roughness={0.5} metalness={0.05} />
      </mesh>

      {(isSelected || hovered) && (
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial
            color={isSelected ? '#00e5ff' : '#ffffff'}
            transparent
            opacity={isSelected ? 1 : 0.5}
          />
        </lineSegments>
      )}

      {(piece.type === 'brick-1x1' || piece.type === 'brick-2x2' || piece.type === 'brick-2x4' ||
        piece.type === 'plate-2x2' || piece.type === 'plate-2x4') && (
        <Studs width={size.w} depth={size.d} topY={size.h / 2} color={piece.color} />
      )}
    </group>
  )
}

function Studs({ width, depth, topY, color }: { width: number; depth: number; topY: number; color: string }) {
  const cols = Math.max(1, Math.round(width))
  const rows = Math.max(1, Math.round(depth))
  const items: JSX.Element[] = []
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = -width / 2 + width / cols + (i * width) / cols
      const z = -depth / 2 + depth / rows + (j * depth) / rows
      items.push(
        <mesh key={`${i}-${j}`} position={[x, topY + 0.08, z]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.16, 12]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      )
    }
  }
  return <>{items}</>
}

// Ghost (placement preview) piece — shown at cursor position in place mode
export function GhostPiece({ type, position, color }: { type: PieceType; position: [number, number, number]; color: string }) {
  const size = getPieceSize(type, 1)
  const geometry = useMemo(() => makeGeometry(type, size), [type, size.w, size.h, size.d])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])
  const yCenter = position[1] + size.h / 2

  return (
    <group position={[position[0], yCenter, position[2]]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.25} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#00e5ff" transparent opacity={0.85} />
      </lineSegments>
    </group>
  )
}
