import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 星星粒子
function Stars({ count = 2000, color = '#ffffff' }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null)

  const [positions] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return [positions]
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} color={color} transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

// 旋转星系
function Galaxy({ color1 = '#6366f1', color2 = '#ec4899' }: { color1?: string; color2?: string }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.05
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.3
    }
  })

  const particles = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const c1 = new THREE.Color(color1)
    const c2 = new THREE.Color(color2)

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 20
      const radius = 5 + Math.random() * 15
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const mix = Math.random()
      const color = c1.clone().lerp(c2, mix)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    return { positions, colors }
  }, [color1, color2])

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={500} array={particles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={500} array={particles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  )
}

// 漂浮光球
function FloatingOrbs({ color = '#6366f1' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const orbRefs = useRef<THREE.Mesh[]>([])

  const orbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 10,
      ],
      scale: 0.3 + Math.random() * 0.7,
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame((state) => {
    orbs.forEach((orb, i) => {
      if (orbRefs.current[i]) {
        orbRefs.current[i].position.y =
          orb.position[1] + Math.sin(state.clock.elapsedTime * orb.speed + orb.offset) * 2
        orbRefs.current[i].scale.setScalar(
          orb.scale * (0.9 + Math.sin(state.clock.elapsedTime * orb.speed * 2 + orb.offset) * 0.1)
        )
      }
    })
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} ref={(el) => { if (el) orbRefs.current[i] = el }}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// 环形能量场
function EnergyRing({ color = '#6366f1' }: { color?: string }) {
  const ref1 = useRef<THREE.Mesh>(null)
  const ref2 = useRef<THREE.Mesh>(null)
  const ref3 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref1.current) {
      ref1.current.rotation.z = t * 0.2
      ref1.current.rotation.x = Math.sin(t * 0.1) * 0.5
    }
    if (ref2.current) {
      ref2.current.rotation.z = -t * 0.15
      ref2.current.rotation.y = Math.cos(t * 0.1) * 0.5
    }
    if (ref3.current) {
      ref3.current.rotation.z = t * 0.1
      ref3.current.rotation.x = Math.cos(t * 0.15) * 0.3
    }
  })

  return (
    <group>
      <mesh ref={ref1}>
        <torusGeometry args={[12, 0.05, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ref2}>
        <torusGeometry args={[15, 0.03, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh ref={ref3}>
        <torusGeometry args={[18, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// 星座连线
function ConstellationLines({ color = '#6366f1' }: { color?: string }) {
  const ref = useRef<THREE.Group>(null)

  const nodes = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 15,
      ],
    }))
  }, [])

  const lines = useMemo(() => {
    const result = []
    for (let i = 0; i < nodes.length - 1; i += 2) {
      result.push([nodes[i].position, nodes[i + 1].position])
    }
    return result
  }, [nodes])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={ref}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position as [number, number, number]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line[0], ...line[1]])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={0.4} />
        </line>
      ))}
    </group>
  )
}

// 主背景组件
export default function Scene3DBackground({
  type = 'stars',
  primaryColor = '#6366f1',
  secondaryColor = '#ec4899',
}: {
  type?: 'stars' | 'galaxy' | 'orbs' | 'rings' | 'constellation'
  primaryColor?: string
  secondaryColor?: string
}) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 30, 80]} />

        {type === 'stars' && (
          <>
            <Stars count={3000} color={primaryColor} />
            <Stars count={1000} color={secondaryColor} />
            <FloatingOrbs color={primaryColor} />
          </>
        )}

        {type === 'galaxy' && (
          <>
            <Galaxy color1={primaryColor} color2={secondaryColor} />
            <Stars count={1000} color="#ffffff" />
            <EnergyRing color={primaryColor} />
          </>
        )}

        {type === 'orbs' && (
          <>
            <FloatingOrbs color={primaryColor} />
            <FloatingOrbs color={secondaryColor} />
            <Stars count={500} color="#ffffff" />
          </>
        )}

        {type === 'rings' && (
          <>
            <EnergyRing color={primaryColor} />
            <EnergyRing color={secondaryColor} />
            <Stars count={2000} color={primaryColor} />
          </>
        )}

        {type === 'constellation' && (
          <>
            <ConstellationLines color={primaryColor} />
            <Stars count={1500} color="#ffffff" />
          </>
        )}
      </Canvas>
    </div>
  )
}
