import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

function createSoftStarTexture(size = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.15)')
  gradient.addColorStop(0.75, 'rgba(255,255,255,0.03)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createSoftGlowTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(0.2, 'rgba(200,200,255,0.4)')
  gradient.addColorStop(0.4, 'rgba(150,150,255,0.15)')
  gradient.addColorStop(0.7, 'rgba(100,100,255,0.05)')
  gradient.addColorStop(1, 'rgba(80,80,200,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function spiralPos(armIndex: number, arms: number, t: number, spread: number, tightness: number, innerR: number, outerR: number) {
  const armAngle = (armIndex / arms) * Math.PI * 2
  const radius = innerR + t * (outerR - innerR)
  const spiralAngle = armAngle + radius * tightness
  const spreadFactor = spread * (1 - t * 0.6)
  const r = radius + (Math.random() - 0.5) * spreadFactor
  const theta = spiralAngle + (Math.random() - 0.5) * 0.2
  const y = (Math.random() - 0.5) * (2 + (1 - t) * 8)
  return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, radius: r, angle: theta, t }
}

function InnerCoreStars() {
  const ref = useRef<THREE.Points>(null)
  const count = 5000
  const texture = useMemo(() => createSoftStarTexture(64), [])

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const pha = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), 0.35) * 18
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
      pos[i * 3 + 2] = r * Math.cos(phi)
      pha[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: pha }
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015
      const colors = (ref.current.geometry.attributes.color as THREE.BufferAttribute)?.array as Float32Array
      if (colors) {
        const time = state.clock.elapsedTime
        for (let i = 0; i < count; i++) {
          const flicker = 0.7 + 0.3 * Math.sin(time * 0.6 + phases[i])
          colors[i * 3] = 0.9 * flicker
          colors[i * 3 + 1] = 0.85 * flicker
          colors[i * 3 + 2] = 1.0 * flicker
        }
        ;(ref.current.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true
      }
    }
  })

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      col[i * 3] = 0.9
      col[i * 3 + 1] = 0.85
      col[i * 3 + 2] = 1.0
    }
    return col
  }, [])

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.8} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function MainSpiralArms() {
  const ref = useRef<THREE.Points>(null)
  const count = 20000
  const arms = 4
  const texture = useMemo(() => createSoftStarTexture(64), [])

  const { positions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const pha = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.pow(Math.random(), 0.55)
      const { x, y, z } = spiralPos(armIndex, arms, t, 14, 0.028, 15, 180)

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const brightness = Math.random()
      const colorRoll = Math.random()
      if (colorRoll > 0.55) {
        col[i * 3] = 0.35 + brightness * 0.25
        col[i * 3 + 1] = 0.6 + brightness * 0.3
        col[i * 3 + 2] = 1.0
      } else if (colorRoll > 0.25) {
        col[i * 3] = 0.6 + brightness * 0.2
        col[i * 3 + 1] = 0.45 + brightness * 0.2
        col[i * 3 + 2] = 1.0
      } else {
        col[i * 3] = 0.85 + brightness * 0.15
        col[i * 3 + 1] = 0.75 + brightness * 0.15
        col[i * 3 + 2] = 1.0
      }

      pha[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, colors: col, phases: pha }
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.00012
      const colorAttr = ref.current.geometry.attributes.color as THREE.BufferAttribute
      const colors = colorAttr.array as Float32Array
      const time = state.clock.elapsedTime
      for (let i = 0; i < count; i++) {
        const flicker = 0.72 + 0.28 * Math.sin(time * 0.35 + phases[i])
        colors[i * 3] *= flicker
        colors[i * 3 + 1] *= flicker
        colors[i * 3 + 2] *= flicker
      }
      colorAttr.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.6} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function BrightStarField() {
  const ref = useRef<THREE.Points>(null)
  const count = 1200
  const arms = 4
  const texture = useMemo(() => createSoftStarTexture(128), [])

  const { positions, colors, phases, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const pha = new Float32Array(count)
    const siz = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 12, 0.028, 18, 170)

      pos[i * 3] = x
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 2
      pos[i * 3 + 2] = z

      const isBlue = Math.random() > 0.4
      if (isBlue) {
        col[i * 3] = 0.5
        col[i * 3 + 1] = 0.75
        col[i * 3 + 2] = 1.0
      } else {
        col[i * 3] = 0.85
        col[i * 3 + 1] = 0.65
        col[i * 3 + 2] = 1.0
      }

      siz[i] = 1.2 + Math.random() * 2.5
      pha[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, colors: col, phases: pha, sizes: siz }
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.00012
      const colorAttr = ref.current.geometry.attributes.color as THREE.BufferAttribute
      const colors = colorAttr.array as Float32Array
      const time = state.clock.elapsedTime
      for (let i = 0; i < count; i++) {
        const flicker = 0.5 + 0.5 * Math.sin(time * 0.7 + phases[i])
        colors[i * 3] *= flicker
        colors[i * 3 + 1] *= flicker
        colors[i * 3 + 2] *= flicker
      }
      colorAttr.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1.8} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function FlowingCodeParticles() {
  const ref = useRef<THREE.Points>(null)
  const count = 10000
  const arms = 4
  const texture = useMemo(() => createSoftStarTexture(32), [])

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const armI = new Float32Array(count)
    const rad = new Float32Array(count)
    const vel = new Float32Array(count)
    const off = new Float32Array(count)
    const wob = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z, radius } = spiralPos(arm, arms, t, 6, 0.028, 22, 165)

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const isBlue = Math.random() > 0.5
      if (isBlue) {
        col[i * 3] = 0.25
        col[i * 3 + 1] = 0.55
        col[i * 3 + 2] = 1.0
      } else {
        col[i * 3] = 0.55
        col[i * 3 + 1] = 0.35
        col[i * 3 + 2] = 1.0
      }

      armI[i] = arm
      rad[i] = radius
      vel[i] = 0.4 + Math.random() * 0.8
      off[i] = Math.random() * 200
      wob[i] = Math.random() * Math.PI * 2
    }
    return { pos, col, armI, rad, vel, off, wob }
  }, [])

  useFrame((state) => {
    if (ref.current) {
      const geom = ref.current.geometry
      const posAttr = geom.attributes.position as THREE.BufferAttribute
      const positions = posAttr.array as Float32Array
      const time = state.clock.elapsedTime

      for (let i = 0; i < count; i++) {
        const baseAngle = (data.armI[i] / arms) * Math.PI * 2
        const r = data.rad[i]
        const flowSpeed = data.vel[i] * 0.04
        const spiralAngle = baseAngle + r * 0.028 + time * flowSpeed + data.off[i]
        const wobble = Math.sin(time * 0.4 + data.wob[i]) * 1.5
        const actualR = r + wobble

        positions[i * 3] = Math.cos(spiralAngle) * actualR
        positions[i * 3 + 2] = Math.sin(spiralAngle) * actualR
        positions[i * 3 + 1] += Math.sin(time * 0.15 + i * 0.1) * 0.008
      }

      posAttr.needsUpdate = true
      ref.current.rotation.y += 0.00008
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={data.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.35} vertexColors transparent opacity={0.75} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function SpiralNebula() {
  const ref1 = useRef<THREE.Points>(null)
  const ref2 = useRef<THREE.Points>(null)
  const ref3 = useRef<THREE.Points>(null)
  const count = 10000
  const texture = useMemo(() => createSoftGlowTexture(128), [])

  const positions1 = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const arms = 4
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 20, 0.028, 20, 170)
      pos[i * 3] = x + (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 4
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  const positions2 = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const arms = 4
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 16, 0.028, 28, 160)
      pos[i * 3] = x + (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 3
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  const positions3 = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 15 + Math.random() * 160
      const y = (Math.random() - 0.5) * 10
      pos[i * 3] = Math.cos(theta) * r + (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = Math.sin(theta) * r + (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  useFrame(() => {
    if (ref1.current) ref1.current.rotation.y += 0.00006
    if (ref2.current) ref2.current.rotation.y -= 0.00004
    if (ref3.current) ref3.current.rotation.y += 0.00002
  })

  return (
    <>
      <points ref={ref1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions1} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#4060ff" size={6} transparent opacity={0.07} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} />
      </points>
      <points ref={ref2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions2} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#8040ff" size={5} transparent opacity={0.055} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} />
      </points>
      <points ref={ref3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#5070ff" size={8} transparent opacity={0.025} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} />
      </points>
    </>
  )
}

function GlowingCore() {
  const groupRef = useRef<THREE.Group>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const glowTexture = useMemo(() => createSoftGlowTexture(256), [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0006
    }
    if (pulseRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.08
      pulseRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshBasicMaterial color="#6040ff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[28, 64]} />
        <meshBasicMaterial color="#4060ff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[20, 48, 48]} />
        <meshBasicMaterial color="#5050ff" transparent opacity={0.08} />
      </mesh>
      <mesh>
        <sphereGeometry args={[14, 48, 48]} />
        <meshBasicMaterial color="#6070ff" transparent opacity={0.12} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[8, 48, 48]} />
        <meshBasicMaterial color="#90a0ff" transparent opacity={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#d0d8ff" transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <sprite scale={[60, 60, 1]}>
        <spriteMaterial map={glowTexture} color="#7060ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      <InnerCoreStars />

      <pointLight color="#8090ff" intensity={6} distance={150} />
      <pointLight color="#a080ff" intensity={4} distance={100} />
    </group>
  )
}

function SpiralRings() {
  const groupRef = useRef<THREE.Group>(null)
  const ringCount = 25

  const rings = useMemo(() => {
    const data: { r: number; y: number; color: string; opacity: number; speed: number }[] = []
    for (let i = 0; i < ringCount; i++) {
      const t = i / ringCount
      data.push({
        r: 22 + t * 150,
        y: (Math.random() - 0.5) * 6,
        color: t > 0.5 ? '#4080ff' : '#7060ff',
        opacity: 0.05 + Math.random() * 0.07,
        speed: 0.0002 + Math.random() * 0.0004
      })
    }
    return data
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((ring, i) => {
        ring.rotation.z += rings[i].speed * (i % 2 === 0 ? 1 : -1)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, ring.y, 0]}>
          <torusGeometry args={[ring.r, 0.06, 4, 256]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  )
}

function SolarSystemMarker() {
  const groupRef = useRef<THREE.Group>(null)
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      const target = hovered ? 1.8 : 1.0
      groupRef.current.scale.x += (target - groupRef.current.scale.x) * 0.08
      groupRef.current.scale.y += (target - groupRef.current.scale.y) * 0.08
      groupRef.current.scale.z += (target - groupRef.current.scale.z) * 0.08
      groupRef.current.rotation.y += 0.008
    }
  })

  return (
    <group
      ref={groupRef}
      position={[110, 2, 30]}
      onClick={(e) => { e.stopPropagation(); navigate('/') }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      <mesh>
        <sphereGeometry args={[2.2, 24, 24]} />
        <meshBasicMaterial color="#ffeecc" />
      </mesh>
      <mesh>
        <sphereGeometry args={[4.5, 24, 24]} />
        <meshBasicMaterial color="#ffdd88" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[7, 24, 24]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.15} />
      </mesh>
      <pointLight color="#ffdd88" intensity={hovered ? 5 : 2.5} distance={30} />
    </group>
  )
}

function ZoomListener() {
  const navigate = useNavigate()
  const triggeredRef = useRef(false)

  useFrame(({ camera }) => {
    const dist = camera.position.length()
    if (dist < 48 && !triggeredRef.current) {
      triggeredRef.current = true
      navigate('/')
    }
  })

  return null
}

export default function GalaxyView() {
  const navigate = useNavigate()
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ background: '#020018' }}>
      <Canvas
        camera={{ position: [0, 38, 190], fov: 55, near: 0.1, far: 3000 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#020018']} />
        <fog attach="fog" args={['#020018', 180, 550]} />

        <Stars radius={700} depth={350} count={18000} factor={5} saturation={0.15} fade speed={0.04} />

        <SpiralNebula />
        <SpiralRings />
        <MainSpiralArms />
        <FlowingCodeParticles />
        <BrightStarField />
        <GlowingCore />
        <SolarSystemMarker />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={55}
          maxDistance={420}
          autoRotate
          autoRotateSpeed={0.05}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.3}
          zoomSpeed={0.4}
        />

        <ZoomListener />

        <ambientLight intensity={0.015} />

        <EffectComposer>
          <Bloom intensity={2.4} luminanceThreshold={0.04} luminanceSmoothing={0.82} mipmapBlur />
          <Vignette offset={0.22} darkness={0.75} />
        </EffectComposer>
      </Canvas>

      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto px-6 py-3 bg-blue-950/50 hover:bg-blue-900/60 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/60 text-blue-200 rounded-full transition-all text-sm tracking-widest"
        >
          ← 返回命运星盘
        </button>
        <div className="text-blue-200/60 text-sm tracking-[0.5em] pointer-events-none">
          GALAXY · 命运银河
        </div>
        <div className="w-28"></div>
      </div>

      {showHint && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <div className="px-10 py-6 bg-blue-950/60 backdrop-blur-md rounded-2xl border border-blue-400/20 text-center max-w-lg">
            <div className="text-blue-200 text-lg tracking-[0.4em] mb-4">✦ 命运银河 ✦</div>
            <div className="text-blue-200/60 text-xs leading-relaxed tracking-wider space-y-1">
              <p>滚动鼠标滚轮缩放视图</p>
              <p>按住鼠标拖动旋转银河</p>
              <p>点击金色光点返回命运星盘</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto px-10 py-4 bg-amber-500/15 hover:bg-amber-500/25 backdrop-blur-sm border border-amber-300/40 hover:border-amber-300/60 text-amber-200 rounded-full transition-all text-sm tracking-[0.35em] shadow-lg shadow-amber-500/10"
        >
          🌞 返回命运星盘
        </button>
      </div>

      <div className="absolute bottom-28 right-8 z-10 pointer-events-none">
        <div className="px-5 py-4 bg-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-400/20 text-right">
          <div className="text-amber-300/80 text-xs tracking-[0.2em] mb-2">⭐ 太阳位置</div>
          <div className="text-blue-200/50 text-xs tracking-wider leading-relaxed">
            猎户臂 · 内侧边缘<br/>
            距银心: ~2.6万光年
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 pointer-events-none">
        <div className="text-blue-200/40 text-xs tracking-[0.25em]">
          命运星盘 · 银河视图
        </div>
      </div>
    </div>
  )
}
