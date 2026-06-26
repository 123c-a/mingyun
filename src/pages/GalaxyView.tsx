import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

const SPECTRAL_TYPES = [
  { type: 'O', color: '#9bb0ff', temp: '30,000K+', name: '蓝巨星', ratio: 0.00003 },
  { type: 'B', color: '#aabfff', temp: '10,000-30,000K', name: '蓝白星', ratio: 0.13 },
  { type: 'A', color: '#cad7ff', temp: '7,500-10,000K', name: '白星', ratio: 0.6 },
  { type: 'F', color: '#f8f7ff', temp: '6,000-7,500K', name: '黄白星', ratio: 3 },
  { type: 'G', color: '#fff4ea', temp: '5,200-6,000K', name: '黄矮星', ratio: 7.6 },
  { type: 'K', color: '#ffd2a1', temp: '3,700-5,200K', name: '橙矮星', ratio: 12 },
  { type: 'M', color: '#ff6060', temp: '2,400-3,700K', name: '红矮星', ratio: 76 },
]

const ZODIAC_CONSTELLATIONS = [
  { name: '白羊座', latin: 'Aries', symbol: '♈', stars: [[2, 3, 0], [3, 2, 0], [4, 3.5, 0], [5, 2.5, 0]], lines: [[0,1],[1,2],[2,3]] },
  { name: '金牛座', latin: 'Taurus', symbol: '♉', stars: [[-4, 5, 1], [-3, 4, 1], [-2, 5.5, 1], [-1, 4.5, 1], [0, 5, 1]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { name: '双子座', latin: 'Gemini', symbol: '♊', stars: [[-8, -2, 0.5], [-7, -1, 0.5], [-6, -2.5, 0.5], [-5, -1.5, 0.5]], lines: [[0,1],[1,2],[2,3]] },
  { name: '巨蟹座', latin: 'Cancer', symbol: '♋', stars: [[-10, 3, 0], [-9, 2.5, 0], [-8, 3.5, 0], [-7, 3, 0]], lines: [[0,1],[1,2],[2,3]] },
  { name: '狮子座', latin: 'Leo', symbol: '♌', stars: [[3, -4, 0.8], [4, -3, 0.8], [5, -4.5, 0.8], [5.5, -3.5, 0.8], [6, -4, 0.8]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { name: '处女座', latin: 'Virgo', symbol: '♍', stars: [[8, 0, 0.3], [9, 1, 0.3], [10, -0.5, 0.3], [11, 0.5, 0.3]], lines: [[0,1],[1,2],[2,3]] },
  { name: '天秤座', latin: 'Libra', symbol: '♎', stars: [[6, 4, 0.2], [7, 5, 0.2], [8, 4, 0.2], [7, 3, 0.2]], lines: [[0,1],[1,2],[2,3],[3,0]] },
  { name: '天蝎座', latin: 'Scorpius', symbol: '♏', stars: [[-5, -5, 0.7], [-4, -5.5, 0.7], [-3, -4.5, 0.7], [-2, -5.5, 0.7], [-1, -5, 0.7]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { name: '射手座', latin: 'Sagittarius', symbol: '♐', stars: [[-2, -7, 0.9], [-1, -6.5, 0.9], [0, -7.5, 0.9], [1, -6.5, 0.9], [2, -7, 0.9]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { name: '摩羯座', latin: 'Capricornus', symbol: '♑', stars: [[5, -7, 0.4], [6, -6.5, 0.4], [7, -7.5, 0.4], [8, -6.5, 0.4]], lines: [[0,1],[1,2],[2,3]] },
  { name: '水瓶座', latin: 'Aquarius', symbol: '♒', stars: [[10, -4, 0.1], [11, -3.5, 0.1], [12, -4.5, 0.1], [13, -3.5, 0.1]], lines: [[0,1],[1,2],[2,3]] },
  { name: '双鱼座', latin: 'Pisces', symbol: '♓', stars: [[-1, 7, 0.6], [0, 6.5, 0.6], [1, 7.5, 0.6], [2, 6.5, 0.6]], lines: [[0,1],[1,2],[2,3]] },
]

const GALACTIC_VIEWS = {
  top: { position: [0, 200, 0.01] as [number, number, number], name: '俯视', icon: '⬆️' },
  side: { position: [200, 5, 0.01] as [number, number, number], name: '侧视', icon: '➡️' },
  polar: { position: [0, 10, 200] as [number, number, number], name: '极视', icon: '🔭' },
  solar: { position: [110, 2, 30] as [number, number, number], name: '太阳系', icon: '🌞' },
}

const EVOLUTION_STAGES = [
  { name: '原初星云', age: '0', desc: '气体云坍缩中', color: '#8080ff' },
  { name: '银盘形成', age: '20亿年', desc: '初代恒星诞生', color: '#a080ff' },
  { name: '旋臂出现', age: '50亿年', desc: '螺旋结构成型', color: '#c080ff' },
  { name: '壮年银河', age: '80亿年', desc: '恒星形成稳定', color: '#ffc080' },
  { name: '当前时代', age: '136亿年', desc: '太阳系诞生', color: '#ffdd80' },
  { name: '未来演化', age: '150亿年', desc: '与仙女座相遇', color: '#ff8080' },
]

interface GalaxyLayers {
  nebulae: boolean
  dust: boolean
  constellations: boolean
  starClusters: boolean
  grid: boolean
  labels: boolean
  codeStreams: boolean
}

function createStarTexture(size = 64) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.1, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.5)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.1)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createGlowTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.15, 'rgba(255,240,200,0.6)')
  gradient.addColorStop(0.3, 'rgba(255,200,150,0.3)')
  gradient.addColorStop(0.5, 'rgba(200,150,255,0.1)')
  gradient.addColorStop(0.7, 'rgba(150,100,255,0.05)')
  gradient.addColorStop(1, 'rgba(100,80,200,0)')
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
  const spreadFactor = spread * (1 - t * 0.5)
  const r = radius + (Math.random() - 0.5) * spreadFactor
  const theta = spiralAngle + (Math.random() - 0.5) * 0.15
  const y = (Math.random() - 0.5) * (1 + (1 - t) * 6)
  return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, radius: r, angle: theta, t }
}

function GalacticCore() {
  const coreRef = useRef<THREE.Points>(null)
  const glowRef1 = useRef<THREE.Mesh>(null)
  const glowRef2 = useRef<THREE.Mesh>(null)
  const glowRef3 = useRef<THREE.Mesh>(null)
  
  const count = 5000
  const texture = useMemo(() => createStarTexture(32), [])
  const glowTexture = useMemo(() => createGlowTexture(512), [])

  const { positions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const pha = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), 0.4) * 15
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.35
      pos[i * 3 + 2] = r * Math.cos(phi)
      
      const distFromCenter = r / 15
      const brightFactor = 1 - distFromCenter * 0.4
      const colorRoll = Math.random()
      
      if (colorRoll > 0.3) {
        col[i * 3] = (0.95 + Math.random() * 0.05) * brightFactor
        col[i * 3 + 1] = (0.92 + Math.random() * 0.08) * brightFactor
        col[i * 3 + 2] = (0.7 + Math.random() * 0.15) * brightFactor
      } else if (colorRoll > 0.1) {
        col[i * 3] = (1.0) * brightFactor
        col[i * 3 + 1] = (0.98 + Math.random() * 0.02) * brightFactor
        col[i * 3 + 2] = (0.95 + Math.random() * 0.05) * brightFactor
      } else {
        col[i * 3] = (0.9 + Math.random() * 0.1) * brightFactor
        col[i * 3 + 1] = (0.7 + Math.random() * 0.2) * brightFactor
        col[i * 3 + 2] = (0.8 + Math.random() * 0.2) * brightFactor
      }
      
      pha[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, colors: col, phases: pha }
  }, [])

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.001
    }
    
    const time = state.clock.elapsedTime
    if (glowRef1.current) {
      glowRef1.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.03)
    }
    if (glowRef2.current) {
      glowRef2.current.scale.setScalar(1 + Math.sin(time * 0.3) * 0.05)
      glowRef2.current.rotation.y += 0.0005
    }
    if (glowRef3.current) {
      glowRef3.current.scale.setScalar(1 + Math.sin(time * 0.4) * 0.04)
      glowRef3.current.rotation.y -= 0.0003
    }
  })

  return (
    <group>
      <points ref={coreRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.6} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
      </points>
      
      <mesh ref={glowRef1} position={[0, 0, 0]}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshBasicMaterial color="#fff8e0" transparent opacity={0.4} map={glowTexture} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      <mesh ref={glowRef2} position={[0, 0, 0]}>
        <sphereGeometry args={[18, 64, 64]} />
        <meshBasicMaterial color="#ffe0b0" transparent opacity={0.2} map={glowTexture} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      <mesh ref={glowRef3} position={[0, 0, 0]}>
        <sphereGeometry args={[28, 64, 64]} />
        <meshBasicMaterial color="#c0a0ff" transparent opacity={0.1} map={glowTexture} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function SpiralArmsV2() {
  const ref = useRef<THREE.Points>(null)
  const count = 8000
  const arms = 4
  const tightness = 0.035
  const texture = useMemo(() => createStarTexture(64), [])

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.pow(Math.random(), 0.6)
      const { x, y, z } = spiralPos(armIndex, arms, t, 16, tightness, 12, 190)

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const brightness = Math.random()
      const colorRoll = Math.random()
      
      if (colorRoll > 0.5) {
        col[i * 3] = 0.2 + brightness * 0.3
        col[i * 3 + 1] = 0.5 + brightness * 0.4
        col[i * 3 + 2] = 1.0
      } else if (colorRoll > 0.2) {
        col[i * 3] = 0.5 + brightness * 0.4
        col[i * 3 + 1] = 0.3 + brightness * 0.3
        col[i * 3 + 2] = 1.0
      } else if (colorRoll > 0.05) {
        col[i * 3] = 0.8 + brightness * 0.2
        col[i * 3 + 1] = 0.7 + brightness * 0.2
        col[i * 3 + 2] = 0.95
      } else {
        col[i * 3] = 0.9 + brightness * 0.1
        col[i * 3 + 1] = 0.85 + brightness * 0.15
        col[i * 3 + 2] = 0.5 + brightness * 0.3
      }
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.00005
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.5} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function BrightStarsV2() {
  const ref = useRef<THREE.Points>(null)
  const count = 800
  const arms = 4
  const tightness = 0.035
  const texture = useMemo(() => createStarTexture(128), [])

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 10, tightness, 15, 180)

      pos[i * 3] = x
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 3
      pos[i * 3 + 2] = z

      const colorRoll = Math.random()
      if (colorRoll > 0.5) {
        col[i * 3] = 0.4
        col[i * 3 + 1] = 0.7
        col[i * 3 + 2] = 1.0
      } else if (colorRoll > 0.25) {
        col[i * 3] = 0.7
        col[i * 3 + 1] = 0.5
        col[i * 3 + 2] = 1.0
      } else {
        col[i * 3] = 0.95
        col[i * 3 + 1] = 0.9
        col[i * 3 + 2] = 0.7
      }
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.00008
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={2.5} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function CodeDataStreams() {
  const ref = useRef<THREE.Points>(null)
  const count = 5000
  const arms = 4
  const tightness = 0.035
  const texture = useMemo(() => createStarTexture(16), [])

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
      const { x, y, z, radius } = spiralPos(arm, arms, t, 8, tightness, 20, 185)

      pos[i * 3] = x
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 2
      pos[i * 3 + 2] = z

      const isCyan = Math.random() > 0.45
      if (isCyan) {
        col[i * 3] = 0.15 + Math.random() * 0.15
        col[i * 3 + 1] = 0.5 + Math.random() * 0.3
        col[i * 3 + 2] = 1.0
      } else {
        col[i * 3] = 0.55 + Math.random() * 0.25
        col[i * 3 + 1] = 0.25 + Math.random() * 0.15
        col[i * 3 + 2] = 1.0
      }

      armI[i] = arm
      rad[i] = radius
      vel[i] = 0.3 + Math.random() * 0.7
      off[i] = Math.random() * 300
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
        const flowSpeed = data.vel[i] * 0.025
        const spiralAngle = baseAngle + r * tightness + time * flowSpeed + data.off[i]
        const wobble = Math.sin(time * 0.2 + data.wob[i]) * 1.5

        positions[i * 3] = Math.cos(spiralAngle) * (r + wobble)
        positions[i * 3 + 2] = Math.sin(spiralAngle) * (r + wobble)
      }

      posAttr.needsUpdate = true
      ref.current.rotation.y += 0.00005
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={data.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.25} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function NebulaClouds() {
  const ref1 = useRef<THREE.Points>(null)
  const ref2 = useRef<THREE.Points>(null)
  const ref3 = useRef<THREE.Points>(null)
  const count = 4000
  const tightness = 0.035
  const texture = useMemo(() => createGlowTexture(128), [])

  const positions1 = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const arms = 4
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 25, tightness, 18, 180)
      pos[i * 3] = x + (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * 15
    }
    return pos
  }, [])

  const positions2 = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const arms = 4
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 20, tightness, 25, 170)
      pos[i * 3] = x + (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 5
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * 12
    }
    return pos
  }, [])

  const positions3 = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 20 + Math.random() * 170
      const y = (Math.random() - 0.5) * 12
      pos[i * 3] = Math.cos(theta) * r + (Math.random() - 0.5) * 35
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = Math.sin(theta) * r + (Math.random() - 0.5) * 35
    }
    return pos
  }, [])

  useFrame(() => {
    if (ref1.current) ref1.current.rotation.y += 0.00004
    if (ref2.current) ref2.current.rotation.y -= 0.00003
    if (ref3.current) ref3.current.rotation.y += 0.00002
  })

  return (
    <>
      <points ref={ref1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions1} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#3080ff" size={8} transparent opacity={0.08} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} />
      </points>
      <points ref={ref2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions2} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#9040ff" size={7} transparent opacity={0.06} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} />
      </points>
      <points ref={ref3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#5060ff" size={10} transparent opacity={0.03} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} />
      </points>
    </>
  )
}

function DustLane({ visible = true }: { visible?: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = 3000
  const tightness = 0.035
  const texture = useMemo(() => createGlowTexture(64), [])

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const arms = 4
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 30, tightness, 15, 190)
      const offsetAngle = (Math.random() - 0.5) * Math.PI / 3
      const offsetR = 15 + Math.random() * 25
      pos[i * 3] = x + Math.cos(offsetAngle) * offsetR
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 3
      pos[i * 3 + 2] = z + Math.sin(offsetAngle) * offsetR
    }
    return pos
  }, [])

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.00003
  })

  if (!visible) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#1a1530" size={5} transparent opacity={0.12} sizeAttenuation depthWrite={false} blending={THREE.NormalBlending} map={texture} />
    </points>
  )
}

function StarClusters({ visible = true }: { visible?: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = 300
  const texture = useMemo(() => createStarTexture(64), [])

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    
    const clusters = [
      { cx: 80, cy: 15, cz: 40, size: 40 },
      { cx: -60, cy: 20, cz: -50, size: 35 },
      { cx: 40, cy: -12, cz: -70, size: 30 },
      { cx: -70, cy: -15, cz: 50, size: 38 },
      { cx: 90, cy: 8, cz: -30, size: 32 },
      { cx: -50, cy: 25, cz: 30, size: 28 },
      { cx: 30, cy: -20, cz: 60, size: 34 },
      { cx: -80, cy: -8, cz: -40, size: 36 },
      { cx: 60, cy: 18, cz: 70, size: 26 },
      { cx: -40, cy: -22, cz: -60, size: 33 },
      { cx: 70, cy: -10, cz: 20, size: 31 },
      { cx: -90, cy: 12, cz: 10, size: 29 },
    ]

    for (let i = 0; i < count; i++) {
      const cluster = clusters[Math.floor(Math.random() * clusters.length)]
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), 0.5) * cluster.size

      pos[i * 3] = cluster.cx + r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = cluster.cy + r * Math.sin(phi) * Math.sin(theta) * 0.4
      pos[i * 3 + 2] = cluster.cz + r * Math.cos(phi)

      const brightness = Math.random()
      col[i * 3] = 0.6 + brightness * 0.4
      col[i * 3 + 1] = 0.6 + brightness * 0.4
      col[i * 3 + 2] = 0.8 + brightness * 0.2
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.00002
  })

  if (!visible) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.8} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function GalacticGrid({ visible = true }: { visible?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []
    
    for (let r = 40; r <= 180; r += 30) {
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2
        positions.push(Math.cos(theta) * r, 0, Math.sin(theta) * r)
      }
    }
    
    for (let i = 0; i <= 32; i++) {
      const theta = (i / 32) * Math.PI * 2
      positions.push(0, 0, 0)
      positions.push(Math.cos(theta) * 180, 0, Math.sin(theta) * 180)
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.00002
  })

  if (!visible) return null

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#405080" transparent opacity={0.2} linewidth={1} />
      </lineSegments>
    </group>
  )
}

function ConstellationLayer({ visible = true, onSelect }: { visible?: boolean; onSelect?: (name: string) => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const scale = 40
  const yOffset = 60

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.00003
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {ZODIAC_CONSTELLATIONS.map((c, ci) => (
        <group key={ci}>
          {c.stars.map((star, si) => (
            <mesh
              key={si}
              position={[star[0] * scale, star[1] * scale, star[2] * scale]}
              onClick={() => onSelect?.(c.name)}
              onPointerOver={() => setHovered(c.name)}
              onPointerOut={() => setHovered(null)}
            >
              <sphereGeometry args={[hovered === c.name ? 1.8 : 1.2, 16, 16]} />
              <meshBasicMaterial color={hovered === c.name ? '#ffffaa' : '#ffcc88'} transparent opacity={hovered === c.name ? 1 : 0.8} />
            </mesh>
          ))}
          {c.lines.map((line, li) => (
            <lineSegments key={li}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    c.stars[line[0]][0] * scale, c.stars[line[0]][1] * scale, c.stars[line[0]][2] * scale,
                    c.stars[line[1]][0] * scale, c.stars[line[1]][1] * scale, c.stars[line[1]][2] * scale,
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffaa66" transparent opacity={0.5} linewidth={2} />
            </lineSegments>
          ))}
        </group>
      ))}
    </group>
  )
}

function InteractiveStars({ visible = true, onStarClick }: { visible?: boolean; onStarClick?: (star: any) => void }) {
  const ref = useRef<THREE.Points>(null)
  const count = 50
  const arms = 4
  const tightness = 0.035
  const texture = useMemo(() => createStarTexture(256), [])

  const starData = useMemo(() => {
    const stars = []
    for (let i = 0; i < count; i++) {
      const armIndex = Math.floor(Math.random() * arms)
      const t = Math.random()
      const { x, y, z } = spiralPos(armIndex, arms, t, 8, tightness, 20, 170)
      
      const spectralType = SPECTRAL_TYPES[Math.floor(Math.random() * SPECTRAL_TYPES.length)]
      stars.push({
        x, y, z,
        name: `恒星 ${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
        spectral: spectralType.type,
        temp: spectralType.temp,
        dist: `${(100 + Math.random() * 900).toFixed(0)} 光年`,
        luminosity: `${(Math.random() * 1000).toFixed(0)} 太阳光度`,
      })
    }
    return stars
  }, [])

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    starData.forEach((star, i) => {
      pos[i * 3] = star.x
      pos[i * 3 + 1] = star.y
      pos[i * 3 + 2] = star.z
    })
    return pos
  }, [starData])

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3)
    starData.forEach((star, i) => {
      const spectral = SPECTRAL_TYPES.find(s => s.type === star.spectral)!
      const hex = parseInt(spectral.color.replace('#', ''), 16)
      col[i * 3] = ((hex >> 16) & 255) / 255
      col[i * 3 + 1] = ((hex >> 8) & 255) / 255
      col[i * 3 + 2] = (hex & 255) / 255
    })
    return col
  }, [starData])

  if (!visible) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={3} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} map={texture} alphaTest={0.01} />
    </points>
  )
}

function CameraMover({ targetPos, active }: { targetPos: [number, number, number]; active: boolean }) {
  const { camera } = useThree()

  useFrame(() => {
    if (active && camera) {
      camera.position.lerp(new THREE.Vector3(...targetPos), 0.02)
    }
  })

  return null
}

function SolarSystemMarker() {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={[80, 0, 30]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[hovered ? 1.5 : 1, 32, 32]} />
      <meshBasicMaterial color="#ffaa44" transparent opacity={0.9} />
      <pointLight color="#ffaa44" intensity={0.5} distance={30} />
    </mesh>
  )
}

function ZoomListener() {
  return null
}

export default function GalaxyView() {
  const navigate = useNavigate()
  const [showHint, setShowHint] = useState(true)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<string>('default')
  const [rotationSpeed, setRotationSpeed] = useState(0.3)
  const [evolutionStage, setEvolutionStage] = useState(4)
  const [selectedStar, setSelectedStar] = useState<any>(null)
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null)
  const [layers, setLayers] = useState<GalaxyLayers>({
    nebulae: true,
    dust: true,
    constellations: false,
    starClusters: true,
    grid: false,
    labels: false,
    codeStreams: true,
  })

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(t)
  }, [])

  const toggleLayer = useCallback((key: keyof GalaxyLayers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const switchView = useCallback((view: string) => {
    setCurrentView(view)
  }, [])

  const totalStars = 8000 + 5000 + 800 + 500 + 4000 + 3000

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ background: '#0a0520' }}>
      <Canvas
        camera={{ position: [100, 50, 150], fov: 50, near: 0.1, far: 3000 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1]}
      >
        <color attach="background" args={['#0a0520']} />
        <fog attach="fog" args={['#0a0520', 150, 500]} />

        <Stars radius={700} depth={350} count={8000} factor={5} saturation={0.15} fade speed={0.04} />

        <GalacticGrid visible={layers.grid} />
        
        <GalacticCore />
        <SpiralArmsV2 />
        <BrightStarsV2 />
        <NebulaClouds />
        <DustLane visible={layers.dust} />
        {layers.codeStreams && <CodeDataStreams />}
        <StarClusters visible={layers.starClusters} />
        <SolarSystemMarker />
        <ConstellationLayer visible={layers.constellations} onSelect={setSelectedConstellation} />
        <InteractiveStars visible={true} onStarClick={setSelectedStar} />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={true}
          minDistance={55}
          maxDistance={420}
          autoRotate={rotationSpeed > 0}
          autoRotateSpeed={rotationSpeed * 0.1}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.3}
          zoomSpeed={0.4}
        />

        <ZoomListener />
        <CameraMover
          targetPos={currentView === 'default' ? [0, 55, 220] : GALACTIC_VIEWS[currentView as keyof typeof GALACTIC_VIEWS]?.position || [0, 55, 220]}
          active={currentView !== 'default'}
        />

        <ambientLight intensity={0.015} />

        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette offset={0.2} darkness={0.8} />
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
        <div className="flex gap-2 pointer-events-auto">
          {[
            { id: 'layers', icon: '🌌', label: '图层' },
            { id: 'views', icon: '🔭', label: '视角' },
            { id: 'time', icon: '⏳', label: '时空' },
            { id: 'info', icon: '📊', label: '数据' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setActivePanel(activePanel === p.id ? null : p.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                background: activePanel === p.id ? 'rgba(100,120,255,0.25)' : 'rgba(30,20,80,0.5)',
                border: `1px solid ${activePanel === p.id ? 'rgba(140,160,255,0.5)' : 'rgba(100,120,255,0.25)'}`,
                color: '#c0d0ff',
                fontSize: 12,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                letterSpacing: 1,
              }}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {activePanel === 'layers' && (
        <div className="absolute top-20 right-6 z-20 pointer-events-auto">
          <div style={{
            padding: 20,
            borderRadius: 16,
            background: 'rgba(10,8,40,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(100,120,255,0.2)',
            width: 260,
          }}>
            <div style={{ fontSize: 13, color: '#a0b0ff', marginBottom: 14, letterSpacing: 3 }}>🌌 数据图层</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'nebulae' as const, label: '星云云团', icon: '☁️' },
                { key: 'dust' as const, label: '银河尘埃带', icon: '🌫️' },
                { key: 'starClusters' as const, label: '球状星团', icon: '✨' },
                { key: 'codeStreams' as const, label: '数据流线条', icon: '💫' },
                { key: 'constellations' as const, label: '星座连线', icon: '♈' },
                { key: 'grid' as const, label: '坐标网格', icon: '📐' },
                { key: 'labels' as const, label: '天体标注', icon: '🏷️' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => toggleLayer(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: layers[item.key] ? 'rgba(100,120,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${layers[item.key] ? 'rgba(140,160,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    color: layers[item.key] ? '#c0d0ff' : 'rgba(255,255,255,0.5)',
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{item.icon}</span> {item.label}
                  </span>
                  <span style={{ fontSize: 10, color: layers[item.key] ? '#80ff90' : 'rgba(255,255,255,0.3)' }}>
                    {layers[item.key] ? '● ON' : '○ OFF'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activePanel === 'views' && (
        <div className="absolute top-20 right-6 z-20 pointer-events-auto">
          <div style={{
            padding: 20,
            borderRadius: 16,
            background: 'rgba(10,8,40,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(100,120,255,0.2)',
            width: 260,
          }}>
            <div style={{ fontSize: 13, color: '#a0b0ff', marginBottom: 14, letterSpacing: 3 }}>🔭 观测视角</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { id: 'top', label: '俯视', icon: '⬆️' },
                { id: 'side', label: '侧视', icon: '➡️' },
                { id: 'polar', label: '极视', icon: '🔭' },
                { id: 'solar', label: '太阳系', icon: '🌞' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => switchView(currentView === v.id ? 'default' : v.id)}
                  style={{
                    padding: '16px 10px',
                    borderRadius: 12,
                    background: currentView === v.id ? 'rgba(100,120,255,0.25)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${currentView === v.id ? 'rgba(140,160,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                    color: currentView === v.id ? '#e0e8ff' : 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{v.icon}</div>
                  {v.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => switchView('default')}
              style={{
                width: '100%',
                marginTop: 10,
                padding: '10px',
                borderRadius: 10,
                background: currentView === 'default' ? 'rgba(255,200,100,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${currentView === 'default' ? 'rgba(255,200,100,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: currentView === 'default' ? '#ffdd88' : 'rgba(255,255,255,0.5)',
                fontSize: 12,
                cursor: 'pointer',
                letterSpacing: 2,
              }}
            >
              ✨ 默认视角
            </button>
          </div>
        </div>
      )}

      {activePanel === 'time' && (
        <div className="absolute top-20 right-6 z-20 pointer-events-auto">
          <div style={{
            padding: 20,
            borderRadius: 16,
            background: 'rgba(10,8,40,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(100,120,255,0.2)',
            width: 280,
          }}>
            <div style={{ fontSize: 13, color: '#a0b0ff', marginBottom: 14, letterSpacing: 3 }}>⏳ 时空控制</div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>旋转速度</span>
                <span style={{ fontSize: 11, color: '#a0b0ff' }}>
                  {rotationSpeed === 0 ? '停止' : rotationSpeed < 0.5 ? '慢速' : rotationSpeed < 1.5 ? '正常' : '快速'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={0.1}
                value={rotationSpeed}
                onChange={e => setRotationSpeed(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#8090ff' }}
              />
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>演化阶段</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {EVOLUTION_STAGES.map((stage, i) => (
                  <button
                    key={i}
                    onClick={() => setEvolutionStage(i)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: evolutionStage === i ? `${stage.color}20` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${evolutionStage === i ? `${stage.color}50` : 'rgba(255,255,255,0.05)'}`,
                      color: evolutionStage === i ? stage.color : 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontWeight: evolutionStage === i ? 600 : 400 }}>{stage.name}</span>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{stage.age}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activePanel === 'info' && (
        <div className="absolute top-20 right-6 z-20 pointer-events-auto">
          <div style={{
            padding: 20,
            borderRadius: 16,
            background: 'rgba(10,8,40,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(100,120,255,0.2)',
            width: 280,
          }}>
            <div style={{ fontSize: 13, color: '#a0b0ff', marginBottom: 14, letterSpacing: 3 }}>📊 银河数据</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: '恒星总数', value: totalStars.toLocaleString(), color: '#ffdd88' },
                { label: '螺旋臂数', value: '4', color: '#8090ff' },
                { label: '直径', value: '10万光年', color: '#a0ffb0' },
                { label: '银心厚度', value: '1.2万光年', color: '#ff8080' },
                { label: '年龄', value: '136亿年', color: '#ffb080' },
                { label: '暗物质占比', value: '85%', color: '#c080ff' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: 12,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: item.color, marginBottom: 2 }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>恒星光谱分布</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SPECTRAL_TYPES.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}60` }} />
                  <span style={{ fontSize: 10, color: s.color, width: 20 }}>{s.type}</span>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(s.ratio * 1.2, 100)}%`, height: '100%', background: s.color, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 36, textAlign: 'right' }}>{s.ratio}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showHint && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <div className="px-10 py-6 bg-blue-950/60 backdrop-blur-md rounded-2xl border border-blue-400/20 text-center max-w-lg">
            <div className="text-blue-200 text-lg tracking-[0.4em] mb-4">✦ 命运银河 ✦</div>
            <div className="text-blue-200/60 text-xs leading-relaxed tracking-wider space-y-1">
              <p>滚动鼠标滚轮缩放视图</p>
              <p>按住鼠标拖动旋转银河</p>
              <p>右上角切换图层/视角/时空/数据</p>
              <p>点击恒星查看详细信息</p>
            </div>
          </div>
        </div>
      )}

      {selectedStar && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto" onClick={() => setSelectedStar(null)}>
          <div style={{ padding: 28, borderRadius: 20, background: 'rgba(10,8,40,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(140,160,255,0.3)', width: 340, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedStar(null)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer' }}>×</button>
            <div style={{ fontSize: 28, marginBottom: 4, textAlign: 'center' }}>⭐</div>
            <div style={{ fontSize: 18, color: '#fff', textAlign: 'center', marginBottom: 4, letterSpacing: 2 }}>{selectedStar.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 18 }}>恒星 · {selectedStar.spectral}型光谱</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ label: '光谱类型', value: selectedStar.spectral, color: '#a0b0ff' }, { label: '表面温度', value: selectedStar.temp, color: '#ff8080' }, { label: '距地距离', value: selectedStar.dist, color: '#80d0ff' }, { label: '光度', value: selectedStar.luminosity, color: '#ffdd80' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: item.color, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedConstellation && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto" onClick={() => setSelectedConstellation(null)}>
          <div style={{ padding: 28, borderRadius: 20, background: 'rgba(10,8,40,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,200,100,0.3)', width: 320, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedConstellation(null)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer' }}>×</button>
            <div style={{ fontSize: 42, marginBottom: 8 }}>{ZODIAC_CONSTELLATIONS.find(c => c.name === selectedConstellation)?.symbol}</div>
            <div style={{ fontSize: 20, color: '#ffdd88', marginBottom: 2, letterSpacing: 4 }}>{selectedConstellation}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 3 }}>{ZODIAC_CONSTELLATIONS.find(c => c.name === selectedConstellation)?.latin}</div>
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(255,200,100,0.08)', border: '1px solid rgba(255,200,100,0.15)', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              黄道十二星座之一，位于银河盘面之上。<br />古人将其连线想象为具体形象，<br />赋予其神话与占星学的深邃含义。
            </div>
            <button onClick={() => { setSelectedConstellation(null); navigate('/'); }} style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 999, background: 'linear-gradient(135deg, rgba(255,200,100,0.2), rgba(255,150,100,0.1))', border: '1px solid rgba(255,200,100,0.4)', color: '#ffdd88', fontSize: 12, cursor: 'pointer', letterSpacing: 3 }}>✨ 返回星盘探索</button>
          </div>
        </div>
      )}

      <div className="absolute bottom-28 right-8 z-10 pointer-events-none">
        <div className="px-5 py-4 bg-blue-950/40 backdrop-blur-sm rounded-xl border border-blue-400/20 text-right">
          <div className="text-amber-300/80 text-xs tracking-[0.2em] mb-2">⭐ 太阳位置</div>
          <div className="text-blue-200/50 text-xs tracking-wider leading-relaxed">猎户臂 · 内侧边缘<br/>距银心: ~2.6万光年</div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 pointer-events-none">
        <div className="text-blue-200/40 text-xs tracking-[0.25em]">命运星盘 · 银河视图</div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <button onClick={() => navigate('/')} className="pointer-events-auto px-10 py-4 bg-amber-500/15 hover:bg-amber-500/25 backdrop-blur-sm border border-amber-300/40 hover:border-amber-300/60 text-amber-200 rounded-full transition-all text-sm tracking-[0.35em] shadow-lg shadow-amber-500/10">
          🌞 返回命运星盘
        </button>
      </div>
    </div>
  )
}