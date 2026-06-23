import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

interface PlanetData {
  id: string
  name: string
  color: string
  emissive: string
  highlightColor: string
  shadowColor: string
  size: number
  orbitRadius: number
  orbitSpeed: number
  orbitTilt: number
  route: string
  description: string
  rotationSpeed: number
  hasRing: boolean
  ringColor: string
  ringInnerColor: string
  hasAtmosphere: boolean
  atmosphereColor: string
  atmosphereInnerColor: string
  roughness: number
  metalness: number
  phase: number
  hasParticleRing: boolean
  particleColor: string
  particleCount: number
  hasCraters: boolean
  hasStorms: boolean
  stormColor: string
  surfaceType: 'rocky' | 'gaseous' | 'icy'
  // 月球属性
  hasMoon?: boolean
  moonSize?: number
  moonOrbitRadius?: number
  moonOrbitSpeed?: number
}

// 连线接口
interface LineConnection {
  from: string
  to: string
}

// 星座配置
interface Constellation {
  id: string
  name: string
  connections: LineConnection[]
  reward: string
}

// 定义星座连线规则
const constellations: Constellation[] = [
  {
    id: 'triangle-1',
    name: '天枢三角',
    connections: [
      { from: 'mercury', to: 'venus' },
      { from: 'venus', to: 'earth' },
      { from: 'earth', to: 'mercury' }
    ],
    reward: '解锁天枢三角星座'
  },
  {
    id: 'triangle-2',
    name: '星芒三角',
    connections: [
      { from: 'mars', to: 'jupiter' },
      { from: 'jupiter', to: 'saturn' },
      { from: 'saturn', to: 'mars' }
    ],
    reward: '解锁星芒三角星座'
  },
  {
    id: 'cross-1',
    name: '命运十字',
    connections: [
      { from: 'mercury', to: 'jupiter' },
      { from: 'venus', to: 'saturn' }
    ],
    reward: '解锁命运十字星座'
  },
  {
    id: 'outer-triangle',
    name: '远域三角',
    connections: [
      { from: 'uranus', to: 'neptune' },
      { from: 'neptune', to: 'pluto' },
      { from: 'pluto', to: 'uranus' }
    ],
    reward: '解锁远域三角星座'
  }
]

const planets: PlanetData[] = [
  { id: 'mercury', name: '水星', color: '#8a8a82', emissive: '#4a4a42', highlightColor: '#c2c2ba', shadowColor: '#3a3a32', size: 0.4, orbitRadius: 7.5, orbitSpeed: 0.35, orbitTilt: 0.03, route: '/mercury', description: '思维的起点', rotationSpeed: 0.0005, hasRing: false, ringColor: '#c8c4b8', ringInnerColor: '#a8a498', hasAtmosphere: false, atmosphereColor: '#d8d4c8', atmosphereInnerColor: '#b8b4a8', roughness: 0.85, metalness: 0.1, phase: 0, hasParticleRing: false, particleColor: '#a8a298', particleCount: 100, hasCraters: true, hasStorms: false, stormColor: '#8a8478', surfaceType: 'rocky' },
  { id: 'venus', name: '金星', color: '#e8d090', emissive: '#c09838', highlightColor: '#fff8d8', shadowColor: '#886820', size: 0.9, orbitRadius: 11, orbitSpeed: 0.22, orbitTilt: -0.05, route: '/venus', description: '温柔的爱与美', rotationSpeed: 0.0002, hasRing: false, ringColor: '#f0d8a0', ringInnerColor: '#d8b880', hasAtmosphere: true, atmosphereColor: '#ffe8a0', atmosphereInnerColor: '#f0d888', roughness: 0.6, metalness: 0.15, phase: 1.2, hasParticleRing: false, particleColor: '#f0d8a0', particleCount: 150, hasCraters: false, hasStorms: false, stormColor: '#e8c890', surfaceType: 'rocky' },
  { id: 'earth', name: '地球', color: '#4080c0', emissive: '#206090', highlightColor: '#80b8e8', shadowColor: '#1a3858', size: 1.0, orbitRadius: 16, orbitSpeed: 0.17, orbitTilt: 0.08, route: '/earth-online', description: '释怀与落脚之地', rotationSpeed: 0.02, hasRing: false, ringColor: '#a0c8e0', ringInnerColor: '#80a8c0', hasAtmosphere: true, atmosphereColor: '#6ab8e8', atmosphereInnerColor: '#4a98d0', roughness: 0.55, metalness: 0.2, phase: 2.5, hasParticleRing: false, particleColor: '#6ab8e8', particleCount: 120, hasCraters: false, hasStorms: false, stormColor: '#5888b0', surfaceType: 'rocky', hasMoon: true, moonSize: 0.27, moonOrbitRadius: 2.2, moonOrbitSpeed: 2.5 },
  { id: 'mars', name: '火星', color: '#c84828', emissive: '#902818', highlightColor: '#f07848', shadowColor: '#701008', size: 0.55, orbitRadius: 21.5, orbitSpeed: 0.13, orbitTilt: -0.12, route: '/mars', description: '热情与意志的熔炉', rotationSpeed: 0.02, hasRing: false, ringColor: '#e87a5a', ringInnerColor: '#c85a3a', hasAtmosphere: true, atmosphereColor: '#ff8a5a', atmosphereInnerColor: '#e86a4a', roughness: 0.7, metalness: 0.15, phase: 3.8, hasParticleRing: false, particleColor: '#d05a3a', particleCount: 100, hasCraters: true, hasStorms: false, stormColor: '#ff6a4a', surfaceType: 'rocky' },
  { id: 'jupiter', name: '木星', color: '#c89868', emissive: '#886028', highlightColor: '#f8c888', shadowColor: '#583818', size: 3.2, orbitRadius: 33, orbitSpeed: 0.05, orbitTilt: 0.03, route: '/jupiter', description: '生命的扩展与好运', rotationSpeed: 0.05, hasRing: false, ringColor: '#e0b878', ringInnerColor: '#c09858', hasAtmosphere: true, atmosphereColor: '#f8d8a8', atmosphereInnerColor: '#e8c088', roughness: 0.4, metalness: 0.1, phase: 5.1, hasParticleRing: false, particleColor: '#e8b888', particleCount: 200, hasCraters: false, hasStorms: true, stormColor: '#ffc898', surfaceType: 'gaseous' },
  { id: 'saturn', name: '土星', color: '#d4c4a0', emissive: '#8a7a58', highlightColor: '#f0e0c0', shadowColor: '#5a4a38', size: 2.8, orbitRadius: 43, orbitSpeed: 0.03, orbitTilt: 0.45, route: '/saturn', description: '时间的礼物与重量', rotationSpeed: 0.05, hasRing: true, ringColor: '#e0d0a8', ringInnerColor: '#c0b088', hasAtmosphere: true, atmosphereColor: '#f5e5c8', atmosphereInnerColor: '#e0d0a8', roughness: 0.5, metalness: 0.12, phase: 6.4, hasParticleRing: false, particleColor: '#e8d8b0', particleCount: 250, hasCraters: false, hasStorms: false, stormColor: '#f5e5c8', surfaceType: 'gaseous' },
  { id: 'uranus', name: '天王星', color: '#80d8e8', emissive: '#30a0b8', highlightColor: '#b0f0ff', shadowColor: '#208090', size: 1.8, orbitRadius: 54, orbitSpeed: 0.02, orbitTilt: 1.71, route: '/uranus', description: '打破惯性的自由之翼', rotationSpeed: 0.03, hasRing: false, ringColor: '#a0e8f0', ringInnerColor: '#80c8d8', hasAtmosphere: true, atmosphereColor: '#a0e8f0', atmosphereInnerColor: '#80d0e8', roughness: 0.45, metalness: 0.15, phase: 7.5, hasParticleRing: false, particleColor: '#80d8e8', particleCount: 180, hasCraters: false, hasStorms: false, stormColor: '#a0e8f0', surfaceType: 'icy' },
  { id: 'neptune', name: '海王星', color: '#3060d0', emissive: '#1030a0', highlightColor: '#6080f0', shadowColor: '#102080', size: 1.7, orbitRadius: 66, orbitSpeed: 0.015, orbitTilt: 0.49, route: '/neptune', description: '潜意识与灵性的河流', rotationSpeed: 0.03, hasRing: false, ringColor: '#5080e0', ringInnerColor: '#3060c0', hasAtmosphere: true, atmosphereColor: '#5080e8', atmosphereInnerColor: '#3060c8', roughness: 0.45, metalness: 0.18, phase: 8.8, hasParticleRing: false, particleColor: '#4070d8', particleCount: 200, hasCraters: false, hasStorms: true, stormColor: '#7090f8', surfaceType: 'icy' },
  { id: 'pluto', name: '冥王星', color: '#b8a888', emissive: '#786858', highlightColor: '#d8c8a8', shadowColor: '#584838', size: 0.2, orbitRadius: 75, orbitSpeed: 0.01, orbitTilt: 2.14, route: '/master-os', description: '冰封的内核与重生', rotationSpeed: 0.01, hasRing: false, ringColor: '#c8b898', ringInnerColor: '#a89878', hasAtmosphere: false, atmosphereColor: '#d8c8a8', atmosphereInnerColor: '#c8b8a8', roughness: 0.8, metalness: 0.08, phase: 10.2, hasParticleRing: false, particleColor: '#b8a888', particleCount: 80, hasCraters: true, hasStorms: false, stormColor: '#a89878', surfaceType: 'rocky' }
]

// 简化版噪声（快10倍）
function hash(x: number, y: number, seed: number): number {
  return (Math.sin(x * 127.1 + y * 311.7 + seed * 74.3) * 43758.5453) % 1
}

function noise2d(x: number, y: number, seed: number): number {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const ux = xf * xf * (3 - 2 * xf), uy = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed)
  const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed)
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

function fbmFast(x: number, y: number, octaves: number, seed: number): number {
  let v = 0, amp = 0.5, freq = 1, max = 0
  for (let i = 0; i < octaves; i++) {
    v += amp * (noise2d(x * freq, y * freq, seed + i * 100) * 2 - 1)
    max += amp; amp *= 0.5; freq *= 2
  }
  return (v / max + 1) / 2
}

function blendColor(c1: THREE.Color | string, c2: THREE.Color | string, ratio: number): string {
  const a = typeof c1 === 'string' ? new THREE.Color(c1) : c1
  const b = typeof c2 === 'string' ? new THREE.Color(c2) : c2
  return `rgb(${Math.floor((a.r + (b.r - a.r) * ratio) * 255)},${Math.floor((a.g + (b.g - a.g) * ratio) * 255)},${Math.floor((a.b + (b.b - a.b) * ratio) * 255)})`
}

// 快速行星纹理（512x256，仅颜色图）
function makePlanetColorTexture(data: PlanetData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height
  const base = new THREE.Color(data.color)
  const emiss = new THREE.Color(data.emissive)
  const highlight = new THREE.Color(data.highlightColor)
  const shadow = new THREE.Color(data.shadowColor)
  const seed = data.id.length * 1000

  // 基础渐变
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, blendColor(base, highlight, 0.35))
  bg.addColorStop(0.3, data.color)
  bg.addColorStop(0.65, blendColor(base, shadow, 0.15))
  bg.addColorStop(1, blendColor(base, shadow, 0.45))
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // 大尺度噪声色块（低频）
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const n = fbmFast(x / w * 6, y / h * 3, 4, seed)
      if (n > 0.58) {
        const t = (n - 0.58) / 0.42
        ctx.fillStyle = `rgba(${Math.floor(highlight.r * 255)},${Math.floor(highlight.g * 255)},${Math.floor(highlight.b * 255)},${t * 0.3})`
        ctx.fillRect(x, y, 4, 4)
      } else if (n < 0.38) {
        const t = (0.38 - n) / 0.38
        ctx.fillStyle = `rgba(${Math.floor(shadow.r * 255)},${Math.floor(shadow.g * 255)},${Math.floor(shadow.b * 255)},${t * 0.35})`
        ctx.fillRect(x, y, 4, 4)
      }
    }
  }

  // --- 行星专属外观 ---
  // 地球：蓝色海洋 + 绿色大陆
  if (data.id === 'earth') {
    // 海洋底层
    const ocean = ctx.createLinearGradient(0, 0, 0, h)
    ocean.addColorStop(0, '#2a5890')
    ocean.addColorStop(0.5, '#3a7ab8')
    ocean.addColorStop(1, '#1a3868')
    ctx.fillStyle = ocean
    ctx.fillRect(0, 0, w, h)
    // 绘制大陆形状
    const continents = [
      { x: 80, y: 80, rx: 60, ry: 40, color: '#4a8a48' },
      { x: 200, y: 60, rx: 80, ry: 50, color: '#6a9a58' },
      { x: 350, y: 90, rx: 70, ry: 45, color: '#5a8a50' },
      { x: 120, y: 160, rx: 50, ry: 35, color: '#4a8a48' },
      { x: 280, y: 170, rx: 90, ry: 55, color: '#6a9a58' },
      { x: 430, y: 150, rx: 40, ry: 30, color: '#5a8a50' },
      { x: 50, y: 200, rx: 35, ry: 25, color: '#4a8a48' },
      { x: 450, y: 60, rx: 30, ry: 20, color: '#6a9a58' }
    ]
    continents.forEach((c, i) => {
      const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, Math.max(c.rx, c.ry))
      grad.addColorStop(0, c.color)
      grad.addColorStop(0.7, c.color)
      grad.addColorStop(1, 'rgba(58,122,184,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(c.x, c.y, c.rx, c.ry, Math.sin(i) * 0.3, 0, Math.PI * 2)
      ctx.fill()
    })
    // 添加一些小的绿色岛屿
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * w, y = Math.random() * h
      const size = 8 + Math.random() * 20
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
      const col = Math.random() > 0.5 ? '#5a8a50' : '#6a9a58'
      grad.addColorStop(0, col)
      grad.addColorStop(1, 'rgba(58,122,184,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    // 添加白色云层
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * w, y = Math.random() * h
      const rx = 30 + Math.random() * 50, ry = 10 + Math.random() * 20
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      grad.addColorStop(0, 'rgba(255,255,255,0.5)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 木星：明显的横向条纹 + 大红斑
  if (data.id === 'jupiter') {
    // 覆盖条纹
    const bands = [
      { y: 20, h: 25, c1: '#c89868', c2: '#e8b888' },
      { y: 45, h: 30, c1: '#e8b888', c2: '#fff0d0' },
      { y: 75, h: 20, c1: '#a87848', c2: '#c89868' },
      { y: 95, h: 35, c1: '#f0c898', c2: '#fff0d0' },
      { y: 130, h: 25, c1: '#8a6038', c2: '#a87848' },
      { y: 155, h: 35, c1: '#e8b888', c2: '#fff0d0' },
      { y: 190, h: 30, c1: '#a87848', c2: '#c89868' },
      { y: 220, h: 36, c1: '#e8b888', c2: '#fff0d0' }
    ]
    bands.forEach((b, idx) => {
      const grad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h)
      grad.addColorStop(0, b.c1)
      grad.addColorStop(0.5, b.c2)
      grad.addColorStop(1, b.c1)
      ctx.fillStyle = grad
      ctx.fillRect(0, b.y, w, b.h)
      // 添加条纹的波浪效果
      for (let x = 0; x < w; x += 8) {
        const wave = Math.sin(x / 40 + idx) * 3
        ctx.fillStyle = `rgba(138,96,56,0.3)`
        ctx.fillRect(x, b.y + wave, 8, 2)
      }
    })
    // 大红斑
    const spotX = 380, spotY = 140
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 50)
    spotGrad.addColorStop(0, '#d83a2a')
    spotGrad.addColorStop(0.5, '#a82a1a')
    spotGrad.addColorStop(1, 'rgba(138,42,26,0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath()
    ctx.ellipse(spotX, spotY, 50, 25, 0.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // 土星：柔和细腻的横向条纹（真实土星外观）
  if (data.id === 'saturn') {
    // 浅黄褐色基础
    const saturnBg = ctx.createLinearGradient(0, 0, 0, h)
    saturnBg.addColorStop(0, '#d8c8a8')
    saturnBg.addColorStop(0.5, '#e8dcc0')
    saturnBg.addColorStop(1, '#c8b898')
    ctx.fillStyle = saturnBg
    ctx.fillRect(0, 0, w, h)

    // 细腻的横向条纹（使用更浅的颜色）
    const bands = [
      { y: 5, h: 18, c1: 'rgba(220,205,165,0.5)', c2: 'rgba(245,235,195,0.6)' },
      { y: 23, h: 25, c1: 'rgba(195,180,145,0.45)', c2: 'rgba(215,200,160,0.5)' },
      { y: 48, h: 30, c1: 'rgba(235,220,175,0.55)', c2: 'rgba(250,240,200,0.6)' },
      { y: 78, h: 22, c1: 'rgba(200,185,145,0.4)', c2: 'rgba(220,205,165,0.5)' },
      { y: 100, h: 28, c1: 'rgba(240,225,180,0.5)', c2: 'rgba(255,245,205,0.55)' },
      { y: 128, h: 25, c1: 'rgba(205,190,150,0.45)', c2: 'rgba(225,210,170,0.5)' },
      { y: 153, h: 32, c1: 'rgba(235,220,175,0.5)', c2: 'rgba(250,238,195,0.55)' },
      { y: 185, h: 22, c1: 'rgba(210,195,155,0.45)', c2: 'rgba(230,215,175,0.5)' },
      { y: 207, h: 28, c1: 'rgba(240,228,188,0.5)', c2: 'rgba(255,245,210,0.55)' },
      { y: 235, h: 21, c1: 'rgba(200,185,145,0.4)', c2: 'rgba(220,205,165,0.5)' }
    ]
    bands.forEach((b, idx) => {
      const grad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h)
      grad.addColorStop(0, b.c1)
      grad.addColorStop(0.5, b.c2)
      grad.addColorStop(1, b.c1)
      ctx.fillStyle = grad
      ctx.fillRect(0, b.y, w, b.h)
    })
  }

  // 火星：红色沙漠效果 + 极冠
  if (data.id === 'mars') {
    // 红色基础
    const marsBg = ctx.createLinearGradient(0, 0, 0, h)
    marsBg.addColorStop(0, '#d84a2a')
    marsBg.addColorStop(0.3, '#e85a3a')
    marsBg.addColorStop(0.7, '#b83a2a')
    marsBg.addColorStop(1, '#982a1a')
    ctx.fillStyle = marsBg
    ctx.fillRect(0, 0, w, h)
    // 白色北极冠
    const polarN = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 10, 80)
    polarN.addColorStop(0, 'rgba(255,255,255,0.85)')
    polarN.addColorStop(0.5, 'rgba(255,245,235,0.6)')
    polarN.addColorStop(1, 'rgba(255,245,235,0)')
    ctx.fillStyle = polarN
    ctx.fillRect(0, 0, w, 40)
    // 白色南极冠
    const polarS = ctx.createRadialGradient(w / 2, h, 0, w / 2, h - 10, 80)
    polarS.addColorStop(0, 'rgba(255,245,235,0.7)')
    polarS.addColorStop(0.5, 'rgba(255,235,225,0.4)')
    polarS.addColorStop(1, 'rgba(255,235,225,0)')
    ctx.fillStyle = polarS
    ctx.fillRect(0, h - 40, w, 40)
    // 深色暗色区域
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * w, y = 40 + Math.random() * (h - 80)
      const rx = 30 + Math.random() * 60, ry = 15 + Math.random() * 30
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      grad.addColorStop(0, 'rgba(120,40,20,0.4)')
      grad.addColorStop(1, 'rgba(120,40,20,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 天王星：蓝绿色冰巨星，均匀的淡蓝绿色调
  if (data.id === 'uranus') {
    const uranusBg = ctx.createLinearGradient(0, 0, 0, h)
    uranusBg.addColorStop(0, '#90e0f0')
    uranusBg.addColorStop(0.3, '#80d8e8')
    uranusBg.addColorStop(0.7, '#70c8d8')
    uranusBg.addColorStop(1, '#60b8c8')
    ctx.fillStyle = uranusBg
    ctx.fillRect(0, 0, w, h)
    // 均匀的横向云带
    for (let band = 0; band < 6; band++) {
      const yBase = (band / 6) * h + 15
      const grad = ctx.createLinearGradient(0, yBase, 0, yBase + 20)
      grad.addColorStop(0, 'rgba(255,255,255,0.15)')
      grad.addColorStop(0.5, 'rgba(255,255,255,0.25)')
      grad.addColorStop(1, 'rgba(255,255,255,0.15)')
      ctx.fillStyle = grad
      ctx.fillRect(0, yBase, w, 20)
    }
  }

  // 海王星：深蓝色冰巨星，有风暴
  if (data.id === 'neptune') {
    const neptuneBg = ctx.createLinearGradient(0, 0, 0, h)
    neptuneBg.addColorStop(0, '#4060d8')
    neptuneBg.addColorStop(0.3, '#3050c8')
    neptuneBg.addColorStop(0.7, '#2040b0')
    neptuneBg.addColorStop(1, '#103090')
    ctx.fillStyle = neptuneBg
    ctx.fillRect(0, 0, w, h)
    // 深色风暴条纹
    for (let band = 0; band < 5; band++) {
      const yBase = (band / 5) * h + 20
      const grad = ctx.createLinearGradient(0, yBase, 0, yBase + 25)
      grad.addColorStop(0, 'rgba(20,40,120,0.3)')
      grad.addColorStop(0.5, 'rgba(30,50,140,0.4)')
      grad.addColorStop(1, 'rgba(20,40,120,0.3)')
      ctx.fillStyle = grad
      ctx.fillRect(0, yBase, w, 25)
    }
    // 大暗斑
    const spotX = 200, spotY = 100
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 40)
    spotGrad.addColorStop(0, 'rgba(10,20,80,0.5)')
    spotGrad.addColorStop(0.7, 'rgba(20,30,100,0.3)')
    spotGrad.addColorStop(1, 'rgba(30,40,120,0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath()
    ctx.ellipse(spotX, spotY, 40, 20, 0.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // 冥王星：灰褐色冰封矮行星
  if (data.id === 'pluto') {
    const plutoBg = ctx.createLinearGradient(0, 0, 0, h)
    plutoBg.addColorStop(0, '#d8c8a8')
    plutoBg.addColorStop(0.3, '#c8b898')
    plutoBg.addColorStop(0.7, '#b8a888')
    plutoBg.addColorStop(1, '#a89878')
    ctx.fillStyle = plutoBg
    ctx.fillRect(0, 0, w, h)
    // 白色极冠
    const polarN = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 10, 50)
    polarN.addColorStop(0, 'rgba(255,250,240,0.8)')
    polarN.addColorStop(0.5, 'rgba(240,235,225,0.5)')
    polarN.addColorStop(1, 'rgba(220,210,195,0)')
    ctx.fillStyle = polarN
    ctx.fillRect(0, 0, w, 30)
    // 暗色区域
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * w, y = 30 + Math.random() * (h - 60)
      const rx = 15 + Math.random() * 30, ry = 10 + Math.random() * 20
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      grad.addColorStop(0, 'rgba(100,80,60,0.35)')
      grad.addColorStop(1, 'rgba(100,80,60,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 金星：浓密的黄色云层
  if (data.id === 'venus') {
    const venusBg = ctx.createLinearGradient(0, 0, 0, h)
    venusBg.addColorStop(0, '#fff0c0')
    venusBg.addColorStop(0.5, '#f0d890')
    venusBg.addColorStop(1, '#d8b860')
    ctx.fillStyle = venusBg
    ctx.fillRect(0, 0, w, h)
    // 浓密的横向云带
    for (let band = 0; band < 8; band++) {
      const yBase = (band / 8) * h
      for (let x = 0; x < w; x += 20) {
        const wave = Math.sin(x / 80 + band) * 12
        const y = yBase + wave + 15
        const rx = 40 + Math.sin(band + x / 50) * 15
        const ry = 8 + Math.random() * 4
        const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
        grad.addColorStop(0, 'rgba(255,245,200,0.5)')
        grad.addColorStop(1, 'rgba(255,245,200,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // 水星：灰色岩石，非常多陨石坑
  if (data.id === 'mercury') {
    const mercBg = ctx.createLinearGradient(0, 0, 0, h)
    mercBg.addColorStop(0, '#b8b4a8')
    mercBg.addColorStop(0.5, '#a8a498')
    mercBg.addColorStop(1, '#6a6858')
    ctx.fillStyle = mercBg
    ctx.fillRect(0, 0, w, h)
    // 深色阴影区域
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * w, y = Math.random() * h
      const rx = 25 + Math.random() * 40, ry = 15 + Math.random() * 25
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      grad.addColorStop(0, 'rgba(60,58,48,0.45)')
      grad.addColorStop(1, 'rgba(60,58,48,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 气态行星横向条带
  if (data.surfaceType === 'gaseous' && data.id !== 'jupiter' && data.id !== 'saturn') {
    for (let band = 0; band < 10; band++) {
      const yBase = (band / 10) * h
      const bandH = 8 + Math.random() * 20
      const stormCol = new THREE.Color(data.stormColor)
      for (let x = 0; x < w; x++) {
        const wave = Math.sin(x / w * Math.PI * 6 + band) * bandH * 0.4
        const y = yBase + wave
        const grad = ctx.createRadialGradient(x, y, 0, x, y, bandH)
        const mixed = base.clone().lerp(stormCol, 0.4 + Math.random() * 0.3)
        grad.addColorStop(0, `rgba(${Math.floor(mixed.r * 255)},${Math.floor(mixed.g * 255)},${Math.floor(mixed.b * 255)},0.5)`)
        grad.addColorStop(0.5, `rgba(${Math.floor(mixed.r * 255)},${Math.floor(mixed.g * 255)},${Math.floor(mixed.b * 255)},0.2)`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.fillRect(x, y - bandH, 1, bandH * 2)
      }
    }
  }

  // 陨石坑
  if (data.hasCraters) {
    for (let i = 0; i < 35; i++) {
      const cx = Math.random() * w, cy = Math.random() * h
      const size = 5 + Math.random() * 25
      const og = ctx.createRadialGradient(cx, cy, size * 0.5, cx, cy, size)
      og.addColorStop(0, `rgba(${Math.floor(shadow.r * 255)},${Math.floor(shadow.g * 255)},${Math.floor(shadow.b * 255)},0.45)`)
      og.addColorStop(0.7, `rgba(${Math.floor(shadow.r * 255)},${Math.floor(shadow.g * 255)},${Math.floor(shadow.b * 255)},0.15)`)
      og.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = og
      ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.fill()
      const ig = ctx.createRadialGradient(cx - size * 0.1, cy - size * 0.1, 0, cx, cy, size * 0.4)
      ig.addColorStop(0, `rgba(${Math.floor(highlight.r * 255)},${Math.floor(highlight.g * 255)},${Math.floor(highlight.b * 255)},0.3)`)
      ig.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = ig
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2); ctx.fill()
    }
  }

  // 风暴椭圆
  if (data.hasStorms) {
    const sc = new THREE.Color(data.stormColor)
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * w, y = Math.random() * h
      const rx = 40 + Math.random() * 100, ry = 10 + Math.random() * 30
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      grad.addColorStop(0, `rgba(${Math.floor(sc.r * 255)},${Math.floor(sc.g * 255)},${Math.floor(sc.b * 255)},0.4)`)
      grad.addColorStop(0.4, `rgba(${Math.floor(sc.r * 255)},${Math.floor(sc.g * 255)},${Math.floor(sc.b * 255)},0.15)`)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.random() * Math.PI)
      ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    }
  }

  // 细颗粒
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * w, y = Math.random() * h, s = Math.random() * 1.2 + 0.2
    const t = Math.random()
    const col = t > 0.6 ? highlight : (t > 0.3 ? base : emiss)
    ctx.fillStyle = `rgba(${Math.floor(col.r * 255)},${Math.floor(col.g * 255)},${Math.floor(col.b * 255)},0.06 + Math.random() * 0.1)`
    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill()
  }

  // 高光点
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * w, y = Math.random() * h, s = 1 + Math.random() * 2
    const grad = ctx.createRadialGradient(x, y, 0, x, y, s * 4)
    grad.addColorStop(0, `rgba(${Math.floor(highlight.r * 255)},${Math.floor(highlight.g * 255)},${Math.floor(highlight.b * 255)},0.7)`)
    grad.addColorStop(0.4, `rgba(${Math.floor(highlight.r * 255)},${Math.floor(highlight.g * 255)},${Math.floor(highlight.b * 255)},0.2)`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x, y, s * 4, 0, Math.PI * 2); ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 快速太阳纹理
function makeSunColorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height

  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
  g.addColorStop(0, '#fff8e0'); g.addColorStop(0.15, '#ffd060'); g.addColorStop(0.4, '#ffa020'); g.addColorStop(0.7, '#ff6010'); g.addColorStop(1, '#901008')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * w, y = Math.random() * h, s = Math.random() * 3 + 0.5
    const t = Math.random()
    ctx.fillStyle = `rgba(255,${140 + Math.floor(t * 110)},${10 + Math.floor(t * 60)},${0.15 + t * 0.3})`
    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill()
  }

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w, y = Math.random() * h, lw = 10 + Math.random() * 25, lh = 40 + Math.random() * 120
    const lg = ctx.createLinearGradient(x, y - lh / 2, x, y + lh / 2)
    lg.addColorStop(0, 'rgba(255,250,200,0.45)'); lg.addColorStop(0.3, 'rgba(255,180,80,0.25)'); lg.addColorStop(1, 'rgba(200,50,10,0)')
    ctx.save(); ctx.translate(x, y); ctx.rotate((Math.random() - 0.5) * 0.6)
    ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(0, 0, lw, lh, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 快速祥云环纹理
function makeRingTexture(outer: string, inner: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height
  const oc = new THREE.Color(outer), ic = new THREE.Color(inner)

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, `rgba(${Math.floor(oc.r * 255)},${Math.floor(oc.g * 255)},${Math.floor(oc.b * 255)},0.5)`)
  bg.addColorStop(0.5, `rgba(${Math.floor(ic.r * 255)},${Math.floor(ic.g * 255)},${Math.floor(ic.b * 255)},0.7)`)
  bg.addColorStop(1, `rgba(${Math.floor(oc.r * 255)},${Math.floor(oc.g * 255)},${Math.floor(oc.b * 255)},0.5)`)
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 30; i++) {
    const x = (i / 30) * w + Math.random() * 20, y = h / 2 + (Math.random() - 0.5) * 15, size = 20 + Math.random() * 35
    const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
    const col = Math.random() > 0.5 ? oc : ic
    grad.addColorStop(0, `rgba(${Math.floor(col.r * 255)},${Math.floor(col.g * 255)},${Math.floor(col.b * 255)},0.85)`)
    grad.addColorStop(0.4, `rgba(${Math.floor(col.r * 255)},${Math.floor(col.g * 255)},${Math.floor(col.b * 255)},0.4)`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill()
  }

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w, y = h / 2 + (Math.random() - 0.5) * 8
    const gg = ctx.createRadialGradient(x, y, 0, x, y, 5)
    gg.addColorStop(0, 'rgba(255,248,200,0.9)'); gg.addColorStop(0.5, 'rgba(255,240,180,0.4)'); gg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 懒加载纹理缓存
const cache: Record<string, THREE.CanvasTexture> = {}
function getTex(id: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (!cache[id]) cache[id] = factory()
  return cache[id]
}

const sunTex = getTex('_sun', makeSunColorTexture)
for (const p of planets) {
  getTex(p.id, () => makePlanetColorTexture(p))
  getTex(p.id + '_ring', () => makeRingTexture(p.ringColor, p.ringInnerColor))
}

// ========== 太阳 ==========
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null), glow1Ref = useRef<THREE.Mesh>(null)
  const glow2Ref = useRef<THREE.Mesh>(null), glow3Ref = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const composerRingRef = useRef<THREE.Mesh>(null)
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [composerHovered, setComposerHovered] = useState(false)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1) * 60, t = state.clock.elapsedTime
    if (meshRef.current) meshRef.current.rotation.y += 0.002 * dt
    const baseScale = hovered ? 1.15 : 1.0
    if (glow1Ref.current) { const cur = glow1Ref.current.scale.x; glow1Ref.current.scale.setScalar(cur + (baseScale * 1.18 + Math.sin(t * 1.8) * 0.05 - cur) * 0.1) }
    if (glow2Ref.current) { const cur = glow2Ref.current.scale.x; glow2Ref.current.scale.setScalar(cur + (baseScale * 1.45 + Math.sin(t * 1.2 + 0.5) * 0.08 - cur) * 0.08) }
    if (glow3Ref.current) { const cur = glow3Ref.current.scale.x; glow3Ref.current.scale.setScalar(cur + (baseScale * 1.75 + Math.sin(t * 0.8 + 1) * 0.1 - cur) * 0.06) }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.001 * dt
      const cur = coronaRef.current.scale.x; coronaRef.current.scale.setScalar(cur + (baseScale * 2.1 + Math.sin(t * 0.5 + 2) * 0.08 - cur) * 0.05)
    }
    if (composerRingRef.current) {
      composerRingRef.current.rotation.z += 0.0008 * dt
      const target = composerHovered ? 1.15 : 1.0
      const cur = composerRingRef.current.scale.x
      composerRingRef.current.scale.setScalar(cur + (target - cur) * 0.15)
    }
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      const targetOpacity = hovered ? 1.0 : 1.0
      mat.opacity += (targetOpacity - mat.opacity) * 0.1
    }
  })

  return (
    <group
      onClick={(e) => { e.stopPropagation(); navigate('/sun') }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {/* 组合实验室轨道环 */}
      <mesh
        ref={composerRingRef}
        onClick={(e) => { e.stopPropagation(); navigate('/composer') }}
        onPointerOver={(e) => { e.stopPropagation(); setComposerHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setComposerHovered(false); document.body.style.cursor = 'auto' }}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[5.2, 0.15, 8, 80]} />
        <meshStandardMaterial
          color="#ffe8a0"
          emissive="#ffc060"
          emissiveIntensity={composerHovered ? 2.5 : 1.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={meshRef}><sphereGeometry args={[3.8, 48, 48]} /><meshBasicMaterial map={sunTex} /></mesh>
      <mesh ref={glow1Ref} scale={1.18}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ffd880" transparent opacity={0.5} depthWrite={false} /></mesh>
      <mesh ref={glow2Ref} scale={1.45}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ffa840" transparent opacity={0.25} depthWrite={false} /></mesh>
      <mesh ref={glow3Ref} scale={1.75}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ff7020" transparent opacity={0.12} depthWrite={false} /></mesh>
      <mesh ref={coronaRef} scale={2.1}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ff4010" transparent opacity={0.06} depthWrite={false} side={THREE.BackSide} /></mesh>
      <pointLight color="#ffd880" intensity={3.2} distance={160} decay={1.0} />
    </group>
  )
}

// ========== 轨道环 ==========
function OrbitRing({ radius, tilt, index }: { radius: number; tilt: number; index: number }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * Math.sin(tilt) * radius * 0.12, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radius, tilt])

  const line = useMemo(() => new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#f0e0c0', transparent: true, opacity: 0.15 })), [geo])

  const dotsGeo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 + index * 0.4
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * Math.sin(tilt) * radius * 0.12, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radius, tilt, index])

  const dots = useMemo(() => new THREE.Points(dotsGeo, new THREE.PointsMaterial({ color: '#fff8e0', size: 0.2, transparent: true, opacity: 0.85, depthWrite: false })), [dotsGeo])

  useEffect(() => {
    return () => { geo.dispose(); line.geometry.dispose(); ;(line.material as THREE.Material).dispose(); dotsGeo.dispose(); ;(dots.material as THREE.Material).dispose() }
  }, [geo, line, dotsGeo, dots])

  return <group><primitive object={line} /><primitive object={dots} /></group>
}

// ========== 粒子环 ==========
function ParticleRing({ radius, color, count }: { radius: number; color: string; count: number }) {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const p = new Float32Array(count * 3), c = new Float32Array(count * 3)
    const cc = new THREE.Color(color)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.3
      const r = radius + (Math.random() - 0.5) * 1.0
      const y = (Math.random() - 0.5) * 0.5
      p[i * 3] = Math.cos(a) * r; p[i * 3 + 1] = y; p[i * 3 + 2] = Math.sin(a) * r
      const t = 0.6 + Math.random() * 0.4
      c[i * 3] = cc.r * t; c[i * 3 + 1] = cc.g * t; c[i * 3 + 2] = cc.b * t
    }
    return { pos: p, col: c }
  }, [radius, color, count])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002 * Math.min(delta * 60, 6)
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} transparent opacity={0.8} sizeAttenuation vertexColors depthWrite={false} />
    </points>
  )
}

// ========== 行星 ==========
function Planet({
  data,
  onHover,
  hoveredId,
  lightTarget,
  customPosition,
  onDragStart,
  onDrag,
  onDragEnd,
  isDragging,
  isSelected,
  onPositionUpdate
}: {
  data: PlanetData
  onHover: (id: string | null) => void
  hoveredId: string | null
  lightTarget: THREE.Vector3 | null
  customPosition: THREE.Vector3 | null
  onDragStart: (id: string) => void
  onDrag: (id: string, position: THREE.Vector3) => void
  onDragEnd: (id: string, isActualDrag: boolean) => void
  isDragging: boolean
  isSelected: boolean
  onPositionUpdate: (id: string, position: THREE.Vector3) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null), groupRef = useRef<THREE.Group>(null)
  const atmo1Ref = useRef<THREE.Mesh>(null), atmo2Ref = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null), cloudRingRef = useRef<THREE.Mesh>(null)
  const navigate = useNavigate()
  const hoverDebounceRef = useRef<number | null>(null)

  const tex = cache[data.id]
  const ringTex = cache[data.id + '_ring']
  const isHovered = hoveredId === data.id

  const handlePointerEnter = useCallback(() => {
    if (hoverDebounceRef.current) clearTimeout(hoverDebounceRef.current)
    hoverDebounceRef.current = window.setTimeout(() => {
      onHover(data.id)
    }, 30)
  }, [onHover, data.id])

  const handlePointerLeave = useCallback(() => {
    if (hoverDebounceRef.current) clearTimeout(hoverDebounceRef.current)
    hoverDebounceRef.current = window.setTimeout(() => {
      onHover(null)
    }, 80)
  }, [onHover])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1) * 60
    if (meshRef.current) meshRef.current.rotation.y += data.rotationSpeed * dt
    if (cloudRingRef.current) cloudRingRef.current.rotation.y += data.rotationSpeed * 1.8 * dt

    if (groupRef.current) {
      // 拖拽时使用自定义位置，否则使用轨道位置
      if (isDragging && customPosition) {
        groupRef.current.position.x += (customPosition.x - groupRef.current.position.x) * 0.25
        groupRef.current.position.y += (customPosition.y - groupRef.current.position.y) * 0.25
        groupRef.current.position.z += (customPosition.z - groupRef.current.position.z) * 0.25
      } else if (!isDragging) {
        const a = state.clock.elapsedTime * data.orbitSpeed + data.phase
        groupRef.current.position.x = Math.cos(a) * data.orbitRadius
        groupRef.current.position.z = Math.sin(a) * data.orbitRadius
        groupRef.current.position.y = Math.sin(a) * Math.sin(data.orbitTilt) * data.orbitRadius * 0.15
      }

      // 更新位置引用，供连线可视化使用
      onPositionUpdate(data.id, groupRef.current.position)

      // 光照追踪：悬停时将点光源目标设为行星位置
      if (isHovered && lightTarget) {
        lightTarget.x += (groupRef.current.position.x - lightTarget.x) * 0.06
        lightTarget.y += ((groupRef.current.position.y + data.size * 2) - lightTarget.y) * 0.06
        lightTarget.z += (groupRef.current.position.z - lightTarget.z) * 0.06
      }
    }

    // 缩放目标：悬停时1.4，选中时1.2，正常时1.0
    const targetScale = isHovered ? 1.4 : (isSelected ? 1.2 : 1.0)
    const lerp = Math.min(dt * 0.12, 0.18)

    if (meshRef.current) {
      const cur = meshRef.current.scale.x
      meshRef.current.scale.setScalar(cur + (targetScale - cur) * lerp)
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      // 悬停时高亮，选中时次高亮
      const targetEmissive = isHovered ? 0.75 : (isSelected ? 0.55 : 0.28)
      mat.emissiveIntensity += ((isSelected ? 0.55 : 0.28) - mat.emissiveIntensity) * lerp
      // 悬停时轻微偏移光源方向，产生高光移动效果
      if (isHovered) {
        mat.emissiveIntensity += 0.01 * Math.sin(state.clock.elapsedTime * 3)
      }
    }
    if (atmo1Ref.current) {
      const cur = atmo1Ref.current.scale.x; atmo1Ref.current.scale.setScalar(cur + (targetScale * 1.12 - cur) * lerp)
      const mat = atmo1Ref.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((isHovered ? 0.2 : 0.08) - mat.opacity) * lerp
    }
    if (atmo2Ref.current) {
      const cur = atmo2Ref.current.scale.x; atmo2Ref.current.scale.setScalar(cur + (targetScale * 1.25 - cur) * lerp)
      const mat = atmo2Ref.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((isHovered ? 0.14 : 0.05) - mat.opacity) * lerp
    }
    if (ringRef.current && data.hasRing) {
      const cur = ringRef.current.scale.x; ringRef.current.scale.setScalar(cur + (targetScale - cur) * lerp)
      const mat = ringRef.current.material as THREE.MeshStandardMaterial
      mat.opacity += ((isHovered ? 0.72 : 0.55) - mat.opacity) * lerp
      // 土星光环缓慢旋转
      if (data.id === 'saturn') {
        ringRef.current.rotation.z += 0.0008
      }
    }
    if (cloudRingRef.current) {
      const cur = cloudRingRef.current.scale.x; cloudRingRef.current.scale.setScalar(cur + (targetScale * 1.6 - cur) * lerp)
      const mat = cloudRingRef.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((isHovered ? 0.62 : 0.4) - mat.opacity) * lerp
    }
  })

  useEffect(() => {
    if (isHovered || isSelected) document.body.style.cursor = 'pointer'
    return () => { if (isHovered || isSelected) document.body.style.cursor = 'auto' }
  }, [isHovered, isSelected])

  // 拖拽/点击区分：记录按下位置，移动超过阈值则视为拖拽
  const dragStartRef = useRef<THREE.Vector3 | null>(null)
  const dragDistanceRef = useRef(0)
  const DRAG_THRESHOLD = 0.5 // 世界坐标单位：超过此值视为拖拽而非点击

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    // 记录起始位置和初始距离
    if (e.point) {
      dragStartRef.current = new THREE.Vector3(e.point.x, e.point.y, e.point.z)
    }
    dragDistanceRef.current = 0
    onDragStart(data.id)
  }

  const handlePointerMove = (e: any) => {
    if (isDragging && e.point && dragStartRef.current) {
      e.stopPropagation()
      // 累积移动距离（XY平面）
      const dx = e.point.x - dragStartRef.current.x
      const dy = e.point.y - dragStartRef.current.y
      const dz = e.point.z - dragStartRef.current.z
      dragDistanceRef.current = Math.sqrt(dx * dx + dy * dy + dz * dz)
      // 将屏幕坐标转换为3D世界坐标
      onDrag(data.id, e.point)
    }
  }

  const handlePointerUp = (e: any) => {
    if (isDragging) {
      e.stopPropagation()
      const isActualDrag = dragDistanceRef.current > DRAG_THRESHOLD
      onDragEnd(data.id, isActualDrag)
      dragStartRef.current = null
      dragDistanceRef.current = 0
    }
  }

  const handleClick = (e: any) => {
    e.stopPropagation()
    // 只有未拖拽（或拖拽距离小于阈值）的才视为点击，跳转到详情页
    if (dragDistanceRef.current <= DRAG_THRESHOLD) {
      navigate(data.route)
    }
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[data.size, 48, 48]} />
        <meshStandardMaterial map={tex} color={data.color} emissive={data.emissive} emissiveIntensity={0.28} roughness={data.roughness} metalness={data.metalness} />
      </mesh>

      {data.hasAtmosphere && (
        <>
          <mesh ref={atmo1Ref}><sphereGeometry args={[data.size * 1.12, 24, 24]} /><meshBasicMaterial color={data.atmosphereInnerColor} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} /></mesh>
          <mesh ref={atmo2Ref}><sphereGeometry args={[data.size * 1.25, 24, 24]} /><meshBasicMaterial color={data.atmosphereColor} transparent opacity={0.05} side={THREE.BackSide} depthWrite={false} /></mesh>
        </>
      )}

      {data.hasRing && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.15, 0, 0]}>
          <ringGeometry args={[data.size * (data.id === 'saturn' ? 1.8 : 1.5), data.size * (data.id === 'saturn' ? 4.0 : 2.3), 64]} />
          <meshStandardMaterial map={ringTex} color={data.ringColor} transparent opacity={data.id === 'saturn' ? 0.7 : 0.55} side={THREE.DoubleSide} emissive={data.ringColor} emissiveIntensity={data.id === 'saturn' ? 0.4 : 0.3} depthWrite={false} />
        </mesh>
      )}

      {data.hasParticleRing && <ParticleRing radius={data.size * 1.8} color={data.particleColor} count={data.particleCount} />}
    </group>
  )
}

// ========== 月球 ==========
function Moon({ orbitRadius, size, parentPosition }: { orbitRadius: number; size: number; parentPosition: THREE.Vector3 }) {
  const moonRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // 创建月球纹理
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    // 月球灰褐色基础
    const grad = ctx.createLinearGradient(0, 0, 0, 64)
    grad.addColorStop(0, '#b8b8b0')
    grad.addColorStop(0.5, '#c8c8c0')
    grad.addColorStop(1, '#a8a8a0')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 128, 64)

    // 月球陨石坑
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 128, y = Math.random() * 64
      const r = 3 + Math.random() * 8
      const craterGrad = ctx.createRadialGradient(x, y, 0, x, y, r)
      craterGrad.addColorStop(0, 'rgba(100,100,95,0.4)')
      craterGrad.addColorStop(0.7, 'rgba(120,120,115,0.3)')
      craterGrad.addColorStop(1, 'rgba(140,140,135,0)')
      ctx.fillStyle = craterGrad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  useFrame((state, delta) => {
    timeRef.current += delta
    if (moonRef.current) {
      // 月球绕地球（parentPosition）旋转
      moonRef.current.position.x = parentPosition.x + Math.cos(timeRef.current * 2.5) * orbitRadius
      moonRef.current.position.z = parentPosition.z + Math.sin(timeRef.current * 2.5) * orbitRadius
      moonRef.current.position.y = parentPosition.y
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={moonRef}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial map={texture} color="#c0c0b8" roughness={0.85} metalness={0.1} />
      </mesh>
    </group>
  )
}

// ========== 小行星带 ==========
function AsteroidBelt({ innerRadius, outerRadius, count }: { innerRadius: number; outerRadius: number; count: number }) {
  const ref = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const theta = Math.random() * Math.PI * 2
      pos[i * 3] = radius * Math.cos(theta)
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      pos[i * 3 + 2] = radius * Math.sin(theta)

      // 小行星颜色（灰褐色）
      const shade = 0.4 + Math.random() * 0.3
      col[i * 3] = shade * 0.9
      col[i * 3 + 1] = shade * 0.85
      col[i * 3 + 2] = shade * 0.8
    }
    return { positions: pos, colors: col }
  }, [innerRadius, outerRadius, count])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002 * Math.min(delta * 60, 6)
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

// ========== 星尘 ==========
function StarDust() {
  const ref = useRef<THREE.Points>(null)
  const { pos, col } = useMemo(() => {
    const p = new Float32Array(1500 * 3), c = new Float32Array(1500 * 3)
    for (let i = 0; i < 1500; i++) {
      const r = 60 + Math.random() * 120, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta); p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.35; p[i * 3 + 2] = r * Math.cos(phi)
      const t = Math.random()
      if (t > 0.8) { c[i * 3] = 1; c[i * 3 + 1] = 0.95; c[i * 3 + 2] = 0.7 }
      else if (t > 0.5) { c[i * 3] = 0.95; c[i * 3 + 1] = 0.92; c[i * 3 + 2] = 1 }
      else { c[i * 3] = 1; c[i * 3 + 1] = 0.98; c[i * 3 + 2] = 0.88 }
    }
    return { pos: p, col: c }
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.00005 * Math.min(delta * 60, 6)
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1500} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={1500} array={col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.25} transparent opacity={0.65} sizeAttenuation vertexColors depthWrite={false} />
    </points>
  )
}

// ========== 连线可视化组件 ==========
function ConstellationLines({
  connections,
  planetPositions,
  glowingConnections
}: {
  connections: LineConnection[]
  planetPositions: Record<string, THREE.Vector3>
  glowingConnections?: LineConnection[]
}) {
  const linesRef = useRef<THREE.Line[]>([])
  const timeRef = useRef<number>(0)

  // 初始化连线几何体和Line对象
  const lineObjects = useMemo(() => {
    return connections.map((conn) => {
      const isGlowing = glowingConnections?.some(
        gc => (gc.from === conn.from && gc.to === conn.to) ||
              (gc.from === conn.to && gc.to === conn.from)
      )
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(6)
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const material = new THREE.LineBasicMaterial({
        color: isGlowing ? "#ffe8a0" : "#ffd700",
        transparent: true,
        opacity: 0.8
      })
      const line = new THREE.Line(geometry, material)
      return { conn, geometry, line, material, isGlowing }
    })
  }, [connections, glowingConnections])

  // 实时更新连线位置和发光效果
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime
    lineObjects.forEach((item, idx) => {
      const { conn, geometry, line, isGlowing } = item
      const fromPos = planetPositions[conn.from]
      const toPos = planetPositions[conn.to]

      if (!fromPos || !toPos) return

      const positions = geometry.attributes.position.array as Float32Array
      positions[0] = fromPos.x
      positions[1] = fromPos.y
      positions[2] = fromPos.z
      positions[3] = toPos.x
      positions[4] = toPos.y
      positions[5] = toPos.z
      geometry.attributes.position.needsUpdate = true

      // 动态调整发光线条的颜色（脉冲效果）
      const mat = item.material
      if (item.isGlowing) {
        const pulse = 0.7 + Math.sin(timeRef.current * 2) * 0.3
        mat.opacity = pulse
      } else {
        mat.opacity = 0.8
      }
    })
  })

  // 清理几何体
  useEffect(() => {
    return () => {
      lineObjects.forEach(item => {
        item.geometry.dispose();
        (item.material as THREE.Material).dispose()
      })
    }
  }, [lineObjects])

  return (
    <group>
      {lineObjects.map((item, idx) => (
        <primitive
          key={`${item.conn.from}-${item.conn.to}-${idx}`}
          object={item.line}
          ref={(el: THREE.Line | null) => { if (el) linesRef.current[idx] = el }}
        />
      ))}
    </group>
  )
}

// ========== 选中行星高亮环 ==========
function SelectionRing({ position }: { position: THREE.Vector3 | null }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current && position) {
      ringRef.current.position.set(position.x, position.y, position.z)
      ringRef.current.rotation.z += 0.02
      ringRef.current.rotation.x += 0.01
    }
  })

  if (!position) return null

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.8, 2.0, 32]} />
      <meshBasicMaterial color="#ffd700" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

// ========== 主场景（带状态） ==========
function SceneWithState({
  selectedPlanets,
  setSelectedPlanets,
  completedConnections,
  unlockedConstellations,
  customPositions,
  updatePlanetPosition,
  getPlanetPosition,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  allConnections,
  glowingConnections,
  hoveredId,
  setHoveredId
}: {
  selectedPlanets: string[]
  setSelectedPlanets: React.Dispatch<React.SetStateAction<string[]>>
  completedConnections: LineConnection[]
  unlockedConstellations: string[]
  customPositions: Record<string, THREE.Vector3>
  updatePlanetPosition: (id: string, position: THREE.Vector3) => void
  getPlanetPosition: (id: string) => THREE.Vector3 | null
  handleDragStart: (id: string, setDragging: (id: string | null) => void) => void
  handleDrag: (id: string, position: THREE.Vector3) => void
  handleDragEnd: (id: string, setDragging: (id: string | null) => void, isActualDrag: boolean) => void
  allConnections: LineConnection[]
  glowingConnections?: LineConnection[]
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}) {
  const [draggingPlanetId, setDraggingPlanetId] = useState<string | null>(null)
  const lightTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const hoverLightRef = useRef<THREE.PointLight>(null)
  const planetPositionRefs = useRef<Record<string, THREE.Vector3>>({})

  useFrame((state) => {
    if (hoverLightRef.current) {
      hoverLightRef.current.position.lerp(lightTargetRef.current, 0.05)
    }
  })

  // 更新行星位置引用
  const onPositionUpdate = useCallback((planetId: string, position: THREE.Vector3) => {
    planetPositionRefs.current[planetId] = position
    updatePlanetPosition(planetId, position)
  }, [updatePlanetPosition])

  // 包装拖拽处理函数
  const wrappedHandleDragStart = useCallback((planetId: string) => {
    handleDragStart(planetId, setDraggingPlanetId)
  }, [handleDragStart])

  const wrappedHandleDragEnd = useCallback((planetId: string, isActualDrag: boolean) => {
    handleDragEnd(planetId, setDraggingPlanetId, isActualDrag)
  }, [handleDragEnd])

  return (
    <>
      <color attach="background" args={['#080518']} />
      <fog attach="fog" args={['#080518', 55, 240]} />
      <Stars radius={120} depth={60} count={5000} factor={4} saturation={0} fade speed={0.25} />
      <StarDust />

      {/* 连线可视化 */}
      <ConstellationLines
        connections={allConnections}
        planetPositions={planetPositionRefs.current}
        glowingConnections={glowingConnections}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={18}
        maxDistance={90}
        autoRotate
        autoRotateSpeed={0.08}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.45}
        zoomSpeed={0.5}
      />
      <Sun />
      {planets.map((p, i) => <OrbitRing key={`o-${p.id}`} radius={p.orbitRadius} tilt={p.orbitTilt} index={i} />)}
      {planets.map(p => (
        <Planet
          key={p.id}
          data={p}
          onHover={setHoveredId}
          hoveredId={hoveredId}
          lightTarget={hoveredId ? lightTargetRef.current : null}
          customPosition={customPositions[p.id] || null}
          onDragStart={wrappedHandleDragStart}
          onDrag={handleDrag}
          onDragEnd={wrappedHandleDragEnd}
          isDragging={draggingPlanetId === p.id}
          isSelected={selectedPlanets.includes(p.id)}
          onPositionUpdate={onPositionUpdate}
        />
      ))}

      {/* 地球的月球 - 获取地球实时位置 */}
      {planets.filter(p => p.hasMoon).map(p => {
        const earthPosition = planetPositionRefs.current['earth'] || new THREE.Vector3(16, 0, 0)
        return <Moon key={`moon-${p.id}`} orbitRadius={p.moonOrbitRadius!} size={p.moonSize!} parentPosition={earthPosition} />
      })}

      {/* 火星与木星之间的小行星带 */}
      <AsteroidBelt innerRadius={25} outerRadius={30} count={600} />

      {/* 已选中行星高亮环 */}
      {selectedPlanets.map(planetId => {
        const position = planetPositionRefs.current[planetId] || getPlanetPosition(planetId)
        return position ? <SelectionRing key={planetId} position={position} /> : null
      })}

      <ambientLight intensity={0.12} />
      <directionalLight position={[15, 25, 12]} intensity={0.18} color="#fff8e8" />
      <pointLight ref={hoverLightRef} color="#ffe8c0" intensity={hoveredId ? 2.5 : 0} distance={30} decay={2} />
    </>
  )
}

// ========== 主组件 ==========
export default function GameScene() {
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([])
  const [completedConnections, setCompletedConnections] = useState<LineConnection[]>([])
  const [unlockedConstellations, setUnlockedConstellations] = useState<string[]>([])
  const [glowingConnections, setGlowingConnections] = useState<LineConnection[]>([])
  const [customPositions, setCustomPositions] = useState<Record<string, THREE.Vector3>>({})
  const planetPositionRefs = useRef<Record<string, THREE.Vector3>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // 面板折叠状态
  const [panelCollapsed, setPanelCollapsed] = useState(true)
  const navigate = useNavigate()

  // 解锁弹窗状态
  const [showUnlockPopup, setShowUnlockPopup] = useState(false)
  const [unlockPopupData, setUnlockPopupData] = useState<{ name: string; reward: string } | null>(null)

  // 存储行星当前位置引用
  const updatePlanetPosition = useCallback((planetId: string, position: THREE.Vector3) => {
    planetPositionRefs.current[planetId] = position
  }, [])

  // 获取行星当前位置
  const getPlanetPosition = useCallback((planetId: string): THREE.Vector3 | null => {
    if (customPositions[planetId]) {
      return customPositions[planetId]
    }
    return planetPositionRefs.current[planetId] || null
  }, [customPositions])

  // 处理拖拽开始
  const handleDragStart = useCallback((planetId: string, setDraggingPlanetId: (id: string | null) => void) => {
    setDraggingPlanetId(planetId)
    if (!selectedPlanets.includes(planetId)) {
      setSelectedPlanets(prev => [...prev, planetId])
    }
  }, [selectedPlanets])

  // 处理拖拽移动
  const handleDrag = useCallback((planetId: string, position: THREE.Vector3) => {
    setCustomPositions(prev => ({
      ...prev,
      [planetId]: position
    }))
  }, [])

  // 处理拖拽结束
  const handleDragEnd = useCallback((
    planetId: string,
    setDraggingPlanetId: (id: string | null) => void,
    isActualDrag: boolean
  ) => {
    setDraggingPlanetId(null)

    // 只有真正的拖拽（鼠标移动超过阈值）才进行连线检测
    // 轻触/点击不触发连线，留给 navigate 处理
    if (!isActualDrag) return

    const currentPos = customPositions[planetId] || planetPositionRefs.current[planetId]
    if (!currentPos) return

    let snappedTo: string | null = null

    for (const selectedId of selectedPlanets) {
      if (selectedId === planetId) continue

      const targetPos = customPositions[selectedId] || planetPositionRefs.current[selectedId]
      if (!targetPos) continue

      const distance = currentPos.distanceTo(targetPos)

      // 吸附阈值稍微放宽，让拖拽连线更容易
      if (distance < 5) {
        snappedTo = selectedId
        setCustomPositions(prev => ({
          ...prev,
          [planetId]: targetPos.clone()
        }))
        break
      }
    }

    if (snappedTo) {
      const newConnection: LineConnection = {
        from: snappedTo,
        to: planetId
      }

      const connectionExists = completedConnections.some(
        c => (c.from === newConnection.from && c.to === newConnection.to) ||
             (c.from === newConnection.to && c.to === newConnection.from)
      )

      if (!connectionExists) {
        const updatedConnections = [...completedConnections, newConnection]

        // 检查星座完成
        for (const constellation of constellations) {
          if (unlockedConstellations.includes(constellation.id)) continue

          const allConnectionsExist = constellation.connections.every(conn => {
            return updatedConnections.some(
              c => (c.from === conn.from && c.to === conn.to) ||
                   (c.from === conn.to && c.to === conn.from)
            )
          })

          if (allConnectionsExist) {
            setUnlockedConstellations(prev => [...prev, constellation.id])
            // 触发解锁彩蛋：设置发光连线
            setGlowingConnections(constellation.connections)
            // 触发解锁彩蛋弹窗
            setUnlockPopupData({ name: constellation.name, reward: constellation.reward })
            setShowUnlockPopup(true)
            // 2.5秒后自动关闭弹窗并清除发光
            setTimeout(() => {
              setShowUnlockPopup(false)
              setGlowingConnections([])
            }, 2500)
          }
        }

        setCompletedConnections(updatedConnections)
      }
    }
  }, [selectedPlanets, completedConnections, customPositions, unlockedConstellations])

  // 重置游戏
  const resetGame = useCallback(() => {
    setSelectedPlanets([])
    setCompletedConnections([])
    setUnlockedConstellations([])
    setCustomPositions({})
  }, [])

  // 获取活跃连线
  const activeConnections = selectedPlanets.length >= 2
    ? selectedPlanets.slice(0, -1).map((id, idx) => ({
        from: id,
        to: selectedPlanets[idx + 1]
      }))
    : []

  const allConnections = [...completedConnections, ...activeConnections]

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ background: 'radial-gradient(ellipse at 30% 20%, #201840 0%, #0a0520 35%, #050310 70%, #020208 100%)' }}>
      <Canvas camera={{ position: [0, 7, 46], fov: 52, near: 0.1, far: 1000 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} dpr={[1, 1.5]}>
        <SceneWithState
          selectedPlanets={selectedPlanets}
          setSelectedPlanets={setSelectedPlanets}
          completedConnections={completedConnections}
          unlockedConstellations={unlockedConstellations}
          customPositions={customPositions}
          updatePlanetPosition={updatePlanetPosition}
          getPlanetPosition={getPlanetPosition}
          handleDragStart={handleDragStart}
          handleDrag={handleDrag}
          handleDragEnd={handleDragEnd}
          allConnections={allConnections}
          glowingConnections={glowingConnections}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      </Canvas>

      {(() => {
        const planet = planets.find(p => p.id === hoveredId) || null
        return (
          <div
            className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none select-none z-10"
            style={{
              opacity: planet ? 1 : 0,
              transition: 'opacity 200ms ease-out',
              transform: `translateY(-50%) ${planet ? '' : 'translateX(-10px)'}`
            }}
          >
            {planet && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(0,20,40,0.92), rgba(0,40,80,0.85))',
                  border: '1px solid rgba(255,220,140,0.4)',
                  borderRadius: '12px',
                  padding: '20px 28px',
                  minWidth: '280px',
                  color: '#ffe8c8',
                  fontFamily: 'Courier New, monospace',
                  boxShadow: '0 0 40px rgba(255,200,100,0.2), inset 0 0 30px rgba(255,220,140,0.08)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div style={{
                  fontSize: '10px',
                  color: '#ffd78a',
                  marginBottom: '12px',
                  letterSpacing: '4px',
                  borderBottom: '1px solid rgba(255,220,140,0.2)',
                  paddingBottom: '10px'
                }}>
                  // PLANETARY ANALYSIS
                </div>
                <div style={{
                  fontSize: '18px',
                  marginBottom: '16px',
                  color: '#fff8e0',
                  fontWeight: 'bold',
                  letterSpacing: '3px',
                  textShadow: '0 0 20px rgba(255,220,140,0.5)'
                }}>
                  ★ {planet.name}
                </div>
                <div style={{ fontSize: '13px', lineHeight: '2', color: '#d8c8a8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a89878' }}>轨道半径</span>
                    <span style={{ color: '#ffe8c8' }}>{planet.orbitRadius.toFixed(1)} AU</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a89878' }}>行星规模</span>
                    <span style={{ color: '#ffe8c8' }}>{planet.size.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a89878' }}>表面类型</span>
                    <span style={{ color: '#ffe8c8' }}>{planet.surfaceType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a89878' }}>光环状态</span>
                    <span style={{ color: planet.hasRing ? '#ffd78a' : '#888' }}>{planet.hasRing ? '激活' : '无'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a89878' }}>大气层</span>
                    <span style={{ color: planet.hasAtmosphere ? '#a8e8a8' : '#888' }}>{planet.hasAtmosphere ? '存在' : '无'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a89878' }}>公转速度</span>
                    <span style={{ color: '#ffe8c8' }}>{planet.orbitSpeed.toFixed(3)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#a89878' }}>自转速度</span>
                    <span style={{ color: '#ffe8c8' }}>{planet.rotationSpeed.toFixed(4)}</span>
                  </div>
                </div>
                <div style={{
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,220,140,0.15)',
                  fontSize: '11px',
                  color: '#c8b898',
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}>
                  "{planet.description}"
                </div>
                <div style={{
                  marginTop: '12px',
                  fontSize: '10px',
                  color: '#786858',
                  textAlign: 'center',
                  letterSpacing: '3px'
                }}>
                  [ 点击进入 · 详细界面 ]
                </div>
              </div>
            )}
          </div>
        )
      })()}

      <div className="absolute top-6 left-6 pointer-events-none select-none">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-200/50 to-amber-200/70"></div>
          <div className="text-[9px] tracking-[0.5em] text-amber-100/50 uppercase font-extralight">Cosmic Chart</div>
          <div className="w-12 h-[1px] bg-gradient-to-r from-amber-200/70 via-amber-200/50 to-transparent"></div>
        </div>
        <div className="text-[2.5rem] font-extralight text-amber-50/95 tracking-[0.25em] mt-3" style={{ textShadow: '0 0 30px rgba(255,220,140,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}>命 运 星 盘</div>
        <div className="text-[11px] text-amber-100/40 mt-4 tracking-[0.3em] font-light">· 点触星辰 · 探索万宇 ·</div>
      </div>

      <div className="absolute top-6 right-6 pointer-events-none select-none text-right">
        <div className="text-[9px] text-amber-100/30 tracking-[0.35em] uppercase font-extralight">v1.0 · Destiny Navigator</div>
        <div className="text-[9px] text-amber-100/22 tracking-[0.28em] mt-2 font-light">万星归位 · 众环相拱</div>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none select-none text-right">
        <div className="space-y-[6px]">
          {['拖动 · 旋转视角', '滚轮 · 缩放远近', '点击 · 进入星盘'].map((t, i) => (
            <div key={i} className="flex items-center justify-end gap-4">
              <span className="text-[10px] text-amber-100/45 tracking-[0.28em] font-light">{t}</span>
              <span className="text-amber-200/60 text-base leading-none">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* 连线解谜状态面板（可折叠） */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-auto select-none z-20 flex flex-col gap-3">
        {/* 命理星盘按钮 */}
        <button
          onClick={() => navigate('/observatory')}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-cyan-200/30 hover:border-cyan-200/60 text-cyan-200/70 hover:text-cyan-200 text-lg flex items-center justify-center transition-all shadow-lg shadow-cyan-900/20"
          title="打开命理星盘"
        >
          🔮
        </button>
        {panelCollapsed ? (
          /* 折叠状态：小图标按钮 */
          <button
            onClick={() => setPanelCollapsed(false)}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-amber-200/30 hover:border-amber-200/60 text-amber-200/70 hover:text-amber-200 text-lg flex items-center justify-center transition-all shadow-lg shadow-amber-900/20"
            title="展开星座图鉴"
          >
            ★
          </button>
        ) : (
          /* 展开状态：完整面板 */
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-amber-200/20 min-w-[180px] shadow-xl shadow-amber-900/20 relative">
            {/* 折叠按钮 */}
            <button
              onClick={() => setPanelCollapsed(true)}
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-black/60 hover:bg-amber-900/60 border border-amber-200/30 hover:border-amber-200/60 text-amber-200/60 hover:text-amber-200 text-xs flex items-center justify-center transition-all"
              title="折叠"
            >
              ×
            </button>

            <div className="text-[10px] text-amber-200/70 tracking-[0.3em] mb-2 text-center">星 座 图 鉴</div>

            {constellations.map(constellation => {
              const isUnlocked = unlockedConstellations.includes(constellation.id)
              return (
                <div
                  key={constellation.id}
                  className={`mb-1.5 px-2 py-1 rounded ${
                    isUnlocked
                      ? 'bg-amber-200/15 text-amber-200'
                      : 'bg-black/30 text-amber-100/40'
                  }`}
                >
                  <div className="text-xs font-medium">{constellation.name}</div>
                  {isUnlocked && (
                    <div className="text-[9px] text-amber-300/60 mt-0.5">✦ {constellation.reward}</div>
                  )}
                  {!isUnlocked && (
                    <div className="text-[9px] text-amber-100/30 mt-0.5">
                      ◇ 需{constellation.connections.length}条连线
                    </div>
                  )}
                </div>
              )
            })}

            {/* 当前选中的行星 */}
            {selectedPlanets.length > 0 && (
              <div className="mt-2 pt-2 border-t border-amber-200/10">
                <div className="text-[9px] text-amber-200/60 tracking-[0.2em] mb-1.5">已选星辰</div>
                <div className="flex flex-wrap gap-1">
                  {selectedPlanets.map(id => {
                    const planet = planets.find(p => p.id === id)
                    return planet ? (
                      <span
                        key={id}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200/25 text-amber-200"
                      >
                        {planet.name}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {/* 重置按钮 */}
            {(selectedPlanets.length > 0 || completedConnections.length > 0) && (
              <button
                onClick={resetGame}
                className="mt-3 w-full py-1.5 px-3 rounded text-[9px] tracking-[0.2em] bg-amber-200/10 hover:bg-amber-200/20 text-amber-200/70 hover:text-amber-200 border border-amber-200/30 hover:border-amber-200/50 transition-all"
              >
                ◈ 重置连线
              </button>
            )}

            {/* 解锁进度 */}
            <div className="mt-2 pt-2 border-t border-amber-200/10">
              <div className="text-[9px] text-amber-100/50 text-center">
                {unlockedConstellations.length} / {constellations.length} 星座
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-none select-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-amber-100/35">
            <span className="text-base">☯</span>
            <div className="w-10 h-[1px] bg-gradient-to-r from-amber-200/30 to-transparent"></div>
            <span className="text-[10px] tracking-[0.35em] font-light">万宇归一</span>
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-amber-200/30"></div>
            <span className="text-base">☯</span>
          </div>
          {/* 操作提示 */}
          <div className="flex items-center gap-2 text-amber-100/40">
            <span className="text-[8px] tracking-widest">· 点击进入 · 拖动连线 ·</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,200,100,0.03) 0%, transparent 40%)' }}></div>

      {/* 星座解锁：淡金色背景渐变 */}
      {showUnlockPopup && (
        <div className="absolute inset-0 pointer-events-none z-30 animate-[unlockFade_2.5s_ease-out]" style={{ background: 'radial-gradient(ellipse at center, rgba(255,220,150,0.04) 0%, transparent 55%)' }}></div>
      )}

      {/* 星座解锁：右下角极简文字提示 */}
      {showUnlockPopup && unlockPopupData && (
        <div className="absolute bottom-10 right-8 pointer-events-none z-40 animate-[unlockSlide_2.5s_ease-out]">
          <div className="flex items-end gap-3 text-right">
            <div>
              <div className="text-[8px] text-amber-200/40 tracking-[0.4em] mb-1">UNLOCKED</div>
              <div className="text-[13px] text-amber-100/70 tracking-[0.25em] font-light">{unlockPopupData.name}</div>
            </div>
            <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-amber-300/40 to-transparent"></div>
            <div className="text-[9px] text-amber-200/50 tracking-[0.2em] pt-2">{unlockPopupData.reward}</div>
          </div>
        </div>
      )}

      {/* 添加CSS动画 */}
      <style>{`
        @keyframes unlockFade {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes unlockSlide {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }
      `}</style>

      <span style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: '#ffe8a0', letterSpacing: 4, fontSize: 11, opacity: 0.7, pointerEvents: 'none' }}>
        点击行星进入专属功能 · 太阳周围的光环是组合实验室
      </span>
    </div>
  )
}
