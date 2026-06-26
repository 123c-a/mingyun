import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { getComboConfig, getComboId } from '../data/comboConfigs'
import { useSound } from '../hooks/useSound'

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
  subtitle: string
  connections: LineConnection[]
  planets: string[]
  interpretation: string
  wisdom: string
  action: string
}

// 定义星座连线规则
const constellations: Constellation[] = [
  {
    id: 'triangle-1',
    name: '天枢三角',
    subtitle: '内省之座',
    connections: [
      { from: 'mercury', to: 'venus' },
      { from: 'venus', to: 'earth' },
      { from: 'earth', to: 'mercury' }
    ],
    planets: ['mercury', 'venus', 'earth'],
    interpretation: '你的内心正在经历一场温柔的整合——思维、感受、落地行动，三者正在找到彼此的节奏。水星的念头在金星的温柔中变得柔软，最终在地球的实相中找到安放之处。',
    wisdom: '不必急于得出结论，让思绪飘一会儿，让感受流过身体，让地球承接一切。答案会在你准备好的时候自己浮现。',
    action: '今天找一个安静的角落，把脑子里的想法都写下来，然后问问心："你真正想要的是什么？"'
  },
  {
    id: 'triangle-2',
    name: '星芒三角',
    subtitle: '行动之座',
    connections: [
      { from: 'mars', to: 'jupiter' },
      { from: 'jupiter', to: 'saturn' },
      { from: 'saturn', to: 'mars' }
    ],
    planets: ['mars', 'jupiter', 'saturn'],
    interpretation: '你正站在一个行动与责任的交汇点上——火星的热情在燃烧，木星的视野在扩展，土星的时间在提醒你什么是最重要的。三者形成的张力，正是你突破的契机。',
    wisdom: '把火星的火焰导向木星的方向，用土星的耐心来打磨每一步。这不是冲刺，而是一场马拉松。快就是慢，慢就是快。',
    action: '选出你生命中最重要的一件事，今天只做这一件事的第一步。'
  },
  {
    id: 'cross-1',
    name: '命运十字',
    subtitle: '抉择之座',
    connections: [
      { from: 'mercury', to: 'jupiter' },
      { from: 'venus', to: 'saturn' }
    ],
    planets: ['mercury', 'jupiter', 'venus', 'saturn'],
    interpretation: '你的生命中正在形成一个关键的结构——思维与扩张的对话，温柔与时间的舞蹈。这两条线索正在编织你的下一步。一个关于"想什么"，一个关于"爱什么"，它们的交点就是你的方向。',
    wisdom: '倾听思维在说什么，观察扩张指向何方，感受温柔允许什么存在，注意时间在提醒什么。答案不在任何一个行星里，而是在它们的对话中。',
    action: '画一个十字，上下左右分别写下你的想法、你的热爱、你的恐惧、你的渴望。中间那个交汇点，就是你的答案。'
  },
  {
    id: 'outer-triangle',
    name: '远域三角',
    subtitle: '蜕变之座',
    connections: [
      { from: 'uranus', to: 'neptune' },
      { from: 'neptune', to: 'pluto' },
      { from: 'pluto', to: 'uranus' }
    ],
    planets: ['uranus', 'neptune', 'pluto'],
    interpretation: '深层的转变正在发生——天王星打破困住你的模式，海王星从潜意识深处升起信息，冥王星在最深处推动重生。这三颗远域行星连成一线，意味着你正在经历一场灵魂级别的蜕变。',
    wisdom: '这是最慢的变化，也是最深的。不要抗拒裂痕，那正是光照进来的地方。让梦境、让突破、让放下一起发生。你不是在失去，你是在蜕壳。',
    action: '今晚睡觉前，对自己说："我愿意放下所有不再服务于我的东西。" 然后留意你做的梦。'
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
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height
  const base = new THREE.Color(data.color)
  const emiss = new THREE.Color(data.emissive)
  const highlight = new THREE.Color(data.highlightColor)
  const shadow = new THREE.Color(data.shadowColor)
  const seed = data.id.length * 1000

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, blendColor(base, highlight, 0.35))
  bg.addColorStop(0.3, data.color)
  bg.addColorStop(0.65, blendColor(base, shadow, 0.15))
  bg.addColorStop(1, blendColor(base, shadow, 0.45))
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const n = fbmFast(x / w * 8, y / h * 5, 5, seed)
      if (n > 0.58) {
        const t = (n - 0.58) / 0.42
        ctx.fillStyle = `rgba(${Math.floor(highlight.r * 255)},${Math.floor(highlight.g * 255)},${Math.floor(highlight.b * 255)},${t * 0.25})`
        ctx.fillRect(x, y, 2, 2)
      } else if (n < 0.38) {
        const t = (0.38 - n) / 0.38
        ctx.fillStyle = `rgba(${Math.floor(shadow.r * 255)},${Math.floor(shadow.g * 255)},${Math.floor(shadow.b * 255)},${t * 0.3})`
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }

  // --- 行星专属外观 ---
  // 地球：蓝色海洋 + 绿色大陆
  if (data.id === 'earth') {
    const ocean = ctx.createLinearGradient(0, 0, 0, h)
    ocean.addColorStop(0, '#1a4880')
    ocean.addColorStop(0.3, '#2868a8')
    ocean.addColorStop(0.5, '#3078c0')
    ocean.addColorStop(0.7, '#2868a8')
    ocean.addColorStop(1, '#153860')
    ctx.fillStyle = ocean
    ctx.fillRect(0, 0, w, h)

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const n = fbmFast(x / w * 10, y / h * 8, 5, 7777)
        if (n > 0.52) {
          const t = (n - 0.52) / 0.48
          ctx.fillStyle = `rgba(100,180,255,${t * 0.15})`
          ctx.fillRect(x, y, 2, 2)
        }
      }
    }

    const continents = [
      { x: 150, y: 140, rx: 110, ry: 80, color: '#4a8a48' },
      { x: 380, y: 110, rx: 150, ry: 100, color: '#6a9a58' },
      { x: 650, y: 170, rx: 130, ry: 90, color: '#5a8a50' },
      { x: 220, y: 320, rx: 90, ry: 70, color: '#4a8a48' },
      { x: 520, y: 340, rx: 170, ry: 110, color: '#6a9a58' },
      { x: 820, y: 300, rx: 70, ry: 60, color: '#5a8a50' },
      { x: 80, y: 400, rx: 60, ry: 45, color: '#4a7a40' },
      { x: 860, y: 110, rx: 55, ry: 40, color: '#6a9a58' },
      { x: 480, y: 60, rx: 40, ry: 30, color: '#e8e8e0' },
      { x: 500, y: 460, rx: 180, ry: 50, color: '#e0e8f0' },
    ]
    continents.forEach((c, i) => {
      const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, Math.max(c.rx, c.ry))
      grad.addColorStop(0, c.color)
      grad.addColorStop(0.6, c.color)
      grad.addColorStop(1, 'rgba(40,100,160,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(c.x, c.y, c.rx, c.ry, Math.sin(i * 0.7) * 0.4, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < w; x += 3) {
        const n = fbmFast(x / w * 15, y / h * 12, 4, 3333)
        if (n > 0.62) {
          const t = (n - 0.62) / 0.38
          const px = x, py = y
          const imgData = ctx.getImageData(px, py, 1, 1).data
          const isLand = imgData[1] > 100 && imgData[2] < 150
          if (isLand) {
            ctx.fillStyle = `rgba(80,140,70,${t * 0.4})`
            ctx.fillRect(x, y, 3, 3)
          }
        }
      }
    }

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * w, y = Math.random() * h
      const size = 12 + Math.random() * 35
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
      const col = Math.random() > 0.5 ? '#5a8a50' : '#7aaa60'
      grad.addColorStop(0, col)
      grad.addColorStop(1, 'rgba(40,100,160,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    for (let i = 0; i < 40; i++) {
      const x = Math.random() * w, y = Math.random() * h
      const rx = 50 + Math.random() * 80, ry = 15 + Math.random() * 30
      const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
      grad.addColorStop(0, 'rgba(255,255,255,0.45)')
      grad.addColorStop(0.5, 'rgba(255,255,255,0.2)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }

    const polarN = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 40, 120)
    polarN.addColorStop(0, 'rgba(240,248,255,0.9)')
    polarN.addColorStop(0.5, 'rgba(220,235,250,0.5)')
    polarN.addColorStop(1, 'rgba(200,220,240,0)')
    ctx.fillStyle = polarN
    ctx.fillRect(0, 0, w, 80)

    const polarS = ctx.createRadialGradient(w / 2, h, 0, w / 2, h - 40, 120)
    polarS.addColorStop(0, 'rgba(230,240,250,0.85)')
    polarS.addColorStop(0.5, 'rgba(210,225,240,0.45)')
    polarS.addColorStop(1, 'rgba(190,210,230,0)')
    ctx.fillStyle = polarS
    ctx.fillRect(0, h - 80, w, 80)
  }

  // 木星：明显的横向条纹 + 大红斑
  if (data.id === 'jupiter') {
    const jupiterBg = ctx.createLinearGradient(0, 0, 0, h)
    jupiterBg.addColorStop(0, '#a87848')
    jupiterBg.addColorStop(0.5, '#c89868')
    jupiterBg.addColorStop(1, '#886038')
    ctx.fillStyle = jupiterBg
    ctx.fillRect(0, 0, w, h)

    const bands = [
      { y: 10, h: 40, c1: '#c89868', c2: '#e8c090', type: 'light' },
      { y: 50, h: 50, c1: '#e8c090', c2: '#fff0d0', type: 'bright' },
      { y: 100, h: 35, c1: '#886038', c2: '#a87848', type: 'dark' },
      { y: 135, h: 55, c1: '#f0d0a0', c2: '#fff8e0', type: 'bright' },
      { y: 190, h: 45, c1: '#705028', c2: '#906838', type: 'dark' },
      { y: 235, h: 60, c1: '#e8c090', c2: '#fff0d0', type: 'bright' },
      { y: 295, h: 40, c1: '#886038', c2: '#a87848', type: 'dark' },
      { y: 335, h: 55, c1: '#f0d0a0', c2: '#fff8e0', type: 'bright' },
      { y: 390, h: 45, c1: '#a87848', c2: '#c89868', type: 'light' },
      { y: 435, h: 77, c1: '#e8c090', c2: '#fff0d0', type: 'bright' },
    ]
    bands.forEach((b, idx) => {
      const grad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h)
      grad.addColorStop(0, b.c1)
      grad.addColorStop(0.3, b.c2)
      grad.addColorStop(0.7, b.c2)
      grad.addColorStop(1, b.c1)
      ctx.fillStyle = grad
      ctx.fillRect(0, b.y, w, b.h)

      for (let x = 0; x < w; x += 4) {
        const wave = Math.sin(x / 60 + idx * 0.8) * 4 + Math.sin(x / 30 + idx * 1.5) * 2
        ctx.fillStyle = b.type === 'dark' ? 'rgba(80,50,20,0.25)' : 'rgba(160,110,60,0.2)'
        ctx.fillRect(x, b.y + wave, 4, 2)
      }
    })

    for (let i = 0; i < 15; i++) {
      const y = 30 + Math.random() * (h - 60)
      const rx = 80 + Math.random() * 150
      const ry = 8 + Math.random() * 20
      const x = Math.random() * w
      const grad = ctx.createRadialGradient(x, y, 0, x, y, rx)
      grad.addColorStop(0, 'rgba(255,240,210,0.25)')
      grad.addColorStop(0.5, 'rgba(255,220,180,0.1)')
      grad.addColorStop(1, 'rgba(255,200,150,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, Math.random() * 0.3, 0, Math.PI * 2)
      ctx.fill()
    }

    const spotX = 720, spotY = 280
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 70)
    spotGrad.addColorStop(0, '#e85030')
    spotGrad.addColorStop(0.3, '#c83020')
    spotGrad.addColorStop(0.6, '#a02010')
    spotGrad.addColorStop(1, 'rgba(120,30,20,0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath()
    ctx.ellipse(spotX, spotY, 70, 38, 0.15, 0, Math.PI * 2)
    ctx.fill()

    const innerSpotGrad = ctx.createRadialGradient(spotX - 10, spotY - 5, 0, spotX, spotY, 45)
    innerSpotGrad.addColorStop(0, 'rgba(255,150,100,0.4)')
    innerSpotGrad.addColorStop(0.5, 'rgba(230,100,60,0.2)')
    innerSpotGrad.addColorStop(1, 'rgba(200,80,40,0)')
    ctx.fillStyle = innerSpotGrad
    ctx.beginPath()
    ctx.ellipse(spotX - 10, spotY - 5, 45, 22, 0.15, 0, Math.PI * 2)
    ctx.fill()
  }

  // 土星：柔和细腻的横向条纹（真实土星外观）
  if (data.id === 'saturn') {
    const saturnBg = ctx.createLinearGradient(0, 0, 0, h)
    saturnBg.addColorStop(0, '#c8b890')
    saturnBg.addColorStop(0.3, '#e0d0a8')
    saturnBg.addColorStop(0.5, '#ede0c0')
    saturnBg.addColorStop(0.7, '#d8c8a0')
    saturnBg.addColorStop(1, '#b8a880')
    ctx.fillStyle = saturnBg
    ctx.fillRect(0, 0, w, h)

    const bands = [
      { y: 5, h: 30, c1: 'rgba(210,195,155,0.5)', c2: 'rgba(240,230,190,0.6)' },
      { y: 35, h: 40, c1: 'rgba(190,175,135,0.45)', c2: 'rgba(215,200,160,0.5)' },
      { y: 75, h: 45, c1: 'rgba(235,220,180,0.55)', c2: 'rgba(250,242,205,0.6)' },
      { y: 120, h: 35, c1: 'rgba(200,185,145,0.4)', c2: 'rgba(225,210,170,0.5)' },
      { y: 155, h: 50, c1: 'rgba(240,228,188,0.52)', c2: 'rgba(255,248,215,0.58)' },
      { y: 205, h: 40, c1: 'rgba(205,190,150,0.45)', c2: 'rgba(230,215,175,0.5)' },
      { y: 245, h: 55, c1: 'rgba(238,225,182,0.5)', c2: 'rgba(252,245,208,0.55)' },
      { y: 300, h: 38, c1: 'rgba(210,195,155,0.45)', c2: 'rgba(232,218,178,0.5)' },
      { y: 338, h: 48, c1: 'rgba(242,230,190,0.5)', c2: 'rgba(255,248,212,0.55)' },
      { y: 386, h: 38, c1: 'rgba(208,192,148,0.42)', c2: 'rgba(228,212,168,0.48)' },
      { y: 424, h: 45, c1: 'rgba(235,222,178,0.48)', c2: 'rgba(250,242,200,0.52)' },
      { y: 469, h: 43, c1: 'rgba(200,185,140,0.4)', c2: 'rgba(220,205,160,0.45)' },
    ]
    bands.forEach((b, idx) => {
      const grad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h)
      grad.addColorStop(0, b.c1)
      grad.addColorStop(0.4, b.c2)
      grad.addColorStop(0.6, b.c2)
      grad.addColorStop(1, b.c1)
      ctx.fillStyle = grad
      ctx.fillRect(0, b.y, w, b.h)

      for (let x = 0; x < w; x += 6) {
        const wave = Math.sin(x / 80 + idx * 0.6) * 3
        ctx.fillStyle = 'rgba(180,160,120,0.15)'
        ctx.fillRect(x, b.y + wave, 6, 1)
      }
    })

    const hexSpotX = 600, hexSpotY = 380
    const hexGrad = ctx.createRadialGradient(hexSpotX, hexSpotY, 0, hexSpotX, hexSpotY, 50)
    hexGrad.addColorStop(0, 'rgba(255,245,210,0.35)')
    hexGrad.addColorStop(0.5, 'rgba(240,225,185,0.15)')
    hexGrad.addColorStop(1, 'rgba(220,200,160,0)')
    ctx.fillStyle = hexGrad
    ctx.beginPath()
    ctx.ellipse(hexSpotX, hexSpotY, 50, 25, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // 火星：红色沙漠效果 + 极冠
  if (data.id === 'mars') {
    const marsBg = ctx.createLinearGradient(0, 0, 0, h)
    marsBg.addColorStop(0, '#c84020')
    marsBg.addColorStop(0.3, '#e05030')
    marsBg.addColorStop(0.5, '#d84828')
    marsBg.addColorStop(0.7, '#b83820')
    marsBg.addColorStop(1, '#902818')
    ctx.fillStyle = marsBg
    ctx.fillRect(0, 0, w, h)

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const n = fbmFast(x / w * 10, y / h * 8, 5, 8888)
        if (n > 0.55) {
          const t = (n - 0.55) / 0.45
          ctx.fillStyle = `rgba(255,140,80,${t * 0.25})`
          ctx.fillRect(x, y, 2, 2)
        } else if (n < 0.4) {
          const t = (0.4 - n) / 0.4
          ctx.fillStyle = `rgba(120,40,20,${t * 0.35})`
          ctx.fillRect(x, y, 2, 2)
        }
      }
    }

    const polarN = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 15, 100)
    polarN.addColorStop(0, 'rgba(255,250,240,0.9)')
    polarN.addColorStop(0.4, 'rgba(255,240,220,0.5)')
    polarN.addColorStop(1, 'rgba(255,230,210,0)')
    ctx.fillStyle = polarN
    ctx.fillRect(0, 0, w, 60)

    const polarS = ctx.createRadialGradient(w / 2, h, 0, w / 2, h - 15, 90)
    polarS.addColorStop(0, 'rgba(250,240,225,0.8)')
    polarS.addColorStop(0.4, 'rgba(240,225,205,0.4)')
    polarS.addColorStop(1, 'rgba(230,215,195,0)')
    ctx.fillStyle = polarS
    ctx.fillRect(0, h - 60, w, 60)

    const darkAreas = [
      { x: 200, y: 180, rx: 80, ry: 40 },
      { x: 500, y: 250, rx: 100, ry: 55 },
      { x: 780, y: 150, rx: 70, ry: 35 },
      { x: 350, y: 380, rx: 90, ry: 45 },
      { x: 650, y: 400, rx: 110, ry: 50 },
      { x: 100, y: 300, rx: 60, ry: 30 },
      { x: 880, y: 350, rx: 75, ry: 40 },
    ]
    darkAreas.forEach((area, i) => {
      const grad = ctx.createRadialGradient(area.x, area.y, 0, area.x, area.y, Math.max(area.rx, area.ry))
      grad.addColorStop(0, 'rgba(100,30,15,0.5)')
      grad.addColorStop(0.6, 'rgba(120,40,20,0.25)')
      grad.addColorStop(1, 'rgba(140,50,25,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(area.x, area.y, area.rx, area.ry, Math.sin(i * 0.5) * 0.3, 0, Math.PI * 2)
      ctx.fill()
    })

    const lightAreas = [
      { x: 300, y: 120, rx: 60, ry: 30 },
      { x: 600, y: 180, rx: 70, ry: 35 },
      { x: 150, y: 250, rx: 50, ry: 25 },
    ]
    lightAreas.forEach((area, i) => {
      const grad = ctx.createRadialGradient(area.x, area.y, 0, area.x, area.y, Math.max(area.rx, area.ry))
      grad.addColorStop(0, 'rgba(255,180,120,0.4)')
      grad.addColorStop(1, 'rgba(255,160,100,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(area.x, area.y, area.rx, area.ry, Math.cos(i * 0.7) * 0.2, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  // 天王星：蓝绿色冰巨星，均匀的淡蓝绿色调
  if (data.id === 'uranus') {
    const uranusBg = ctx.createLinearGradient(0, 0, 0, h)
    uranusBg.addColorStop(0, '#a8e5f0')
    uranusBg.addColorStop(0.3, '#95dce8')
    uranusBg.addColorStop(0.5, '#88d4e0')
    uranusBg.addColorStop(0.7, '#7ac8d8')
    uranusBg.addColorStop(1, '#68b8c8')
    ctx.fillStyle = uranusBg
    ctx.fillRect(0, 0, w, h)

    for (let band = 0; band < 8; band++) {
      const yBase = (band / 8) * h + 20
      const grad = ctx.createLinearGradient(0, yBase, 0, yBase + 35)
      grad.addColorStop(0, 'rgba(180,235,245,0.2)')
      grad.addColorStop(0.5, 'rgba(200,245,255,0.35)')
      grad.addColorStop(1, 'rgba(180,235,245,0.2)')
      ctx.fillStyle = grad
      ctx.fillRect(0, yBase, w, 35)
    }

    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < w; x += 3) {
        const n = fbmFast(x / w * 7, y / h * 5, 4, 6666)
        if (n > 0.6) {
          const t = (n - 0.6) / 0.4
          ctx.fillStyle = `rgba(220,250,255,${t * 0.18})`
          ctx.fillRect(x, y, 3, 3)
        }
      }
    }

    const polarGlowN = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 30, 80)
    polarGlowN.addColorStop(0, 'rgba(200,240,250,0.4)')
    polarGlowN.addColorStop(1, 'rgba(180,230,240,0)')
    ctx.fillStyle = polarGlowN
    ctx.fillRect(0, 0, w, 60)

    const polarGlowS = ctx.createRadialGradient(w / 2, h, 0, w / 2, h - 30, 80)
    polarGlowS.addColorStop(0, 'rgba(200,240,250,0.35)')
    polarGlowS.addColorStop(1, 'rgba(180,230,240,0)')
    ctx.fillStyle = polarGlowS
    ctx.fillRect(0, h - 60, w, 60)
  }

  if (data.id === 'neptune') {
    const neptuneBg = ctx.createLinearGradient(0, 0, 0, h)
    neptuneBg.addColorStop(0, '#4068d8')
    neptuneBg.addColorStop(0.3, '#3058c8')
    neptuneBg.addColorStop(0.5, '#2850b8')
    neptuneBg.addColorStop(0.7, '#2048a8')
    neptuneBg.addColorStop(1, '#183888')
    ctx.fillStyle = neptuneBg
    ctx.fillRect(0, 0, w, h)

    const bands = [
      { y: 10, h: 40, c1: 'rgba(40,70,160,0.4)', c2: 'rgba(60,90,190,0.2)' },
      { y: 60, h: 50, c1: 'rgba(80,120,220,0.3)', c2: 'rgba(100,140,240,0.15)' },
      { y: 130, h: 45, c1: 'rgba(30,55,140,0.45)', c2: 'rgba(50,75,170,0.25)' },
      { y: 200, h: 55, c1: 'rgba(70,110,210,0.35)', c2: 'rgba(90,130,230,0.2)' },
      { y: 280, h: 45, c1: 'rgba(35,60,150,0.4)', c2: 'rgba(55,80,180,0.2)' },
      { y: 350, h: 50, c1: 'rgba(75,115,215,0.3)', c2: 'rgba(95,135,235,0.18)' },
      { y: 420, h: 45, c1: 'rgba(40,65,155,0.4)', c2: 'rgba(60,85,185,0.22)' },
    ]
    bands.forEach((b, idx) => {
      const grad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h)
      grad.addColorStop(0, b.c1)
      grad.addColorStop(0.5, b.c2)
      grad.addColorStop(1, b.c1)
      ctx.fillStyle = grad
      ctx.fillRect(0, b.y, w, b.h)

      for (let x = 0; x < w; x += 5) {
        const wave = Math.sin(x / 70 + idx * 0.9) * 3
        ctx.fillStyle = 'rgba(20,40,120,0.2)'
        ctx.fillRect(x, b.y + wave, 5, 1)
      }
    })

    const darkSpotX = 350, darkSpotY = 250
    const spotGrad = ctx.createRadialGradient(darkSpotX, darkSpotY, 0, darkSpotX, darkSpotY, 55)
    spotGrad.addColorStop(0, 'rgba(10,25,90,0.6)')
    spotGrad.addColorStop(0.4, 'rgba(20,40,120,0.35)')
    spotGrad.addColorStop(1, 'rgba(30,50,140,0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath()
    ctx.ellipse(darkSpotX, darkSpotY, 55, 28, 0.1, 0, Math.PI * 2)
    ctx.fill()

    const lightSpots = [
      { x: 700, y: 180, rx: 45, ry: 15 },
      { x: 200, y: 400, rx: 40, ry: 12 },
      { x: 850, y: 350, rx: 35, ry: 10 },
    ]
    lightSpots.forEach((spot, i) => {
      const grad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, Math.max(spot.rx, spot.ry))
      grad.addColorStop(0, 'rgba(120,160,255,0.35)')
      grad.addColorStop(1, 'rgba(100,140,240,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(spot.x, spot.y, spot.rx, spot.ry, Math.sin(i * 0.5) * 0.2, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < w; x += 3) {
        const n = fbmFast(x / w * 9, y / h * 6, 4, 4444)
        if (n > 0.62) {
          const t = (n - 0.62) / 0.38
          ctx.fillStyle = `rgba(100,140,220,${t * 0.2})`
          ctx.fillRect(x, y, 3, 3)
        }
      }
    }
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
    venusBg.addColorStop(0, '#fff0b8')
    venusBg.addColorStop(0.3, '#f5de98')
    venusBg.addColorStop(0.5, '#f0d888')
    venusBg.addColorStop(0.7, '#e8cc78')
    venusBg.addColorStop(1, '#d8b860')
    ctx.fillStyle = venusBg
    ctx.fillRect(0, 0, w, h)

    for (let band = 0; band < 12; band++) {
      const yBase = (band / 12) * h
      const bandH = 30 + Math.sin(band * 0.8) * 10
      for (let x = 0; x < w; x += 15) {
        const wave = Math.sin(x / 100 + band * 0.7) * 15 + Math.sin(x / 50 + band * 1.3) * 6
        const y = yBase + wave + 20
        const rx = 50 + Math.sin(band + x / 60) * 20
        const ry = 6 + Math.random() * 4
        const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry))
        grad.addColorStop(0, 'rgba(255,250,210,0.4)')
        grad.addColorStop(0.5, 'rgba(255,240,180,0.2)')
        grad.addColorStop(1, 'rgba(255,230,150,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < w; x += 3) {
        const n = fbmFast(x / w * 8, y / h * 6, 4, 5555)
        if (n > 0.6) {
          const t = (n - 0.6) / 0.4
          ctx.fillStyle = `rgba(255,255,220,${t * 0.15})`
          ctx.fillRect(x, y, 3, 3)
        }
      }
    }

    const stormSpots = [
      { x: 250, y: 200, rx: 60, ry: 25 },
      { x: 700, y: 300, rx: 50, ry: 20 },
      { x: 500, y: 100, rx: 45, ry: 18 },
    ]
    stormSpots.forEach((spot, i) => {
      const grad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, Math.max(spot.rx, spot.ry))
      grad.addColorStop(0, 'rgba(220,180,100,0.4)')
      grad.addColorStop(1, 'rgba(200,160,80,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(spot.x, spot.y, spot.rx, spot.ry, Math.sin(i) * 0.3, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  // 水星：灰色岩石，非常多陨石坑
  if (data.id === 'mercury') {
    const mercBg = ctx.createLinearGradient(0, 0, 0, h)
    mercBg.addColorStop(0, '#b0aca0')
    mercBg.addColorStop(0.3, '#a09c90')
    mercBg.addColorStop(0.5, '#908c80')
    mercBg.addColorStop(0.7, '#807c70')
    mercBg.addColorStop(1, '#605c50')
    ctx.fillStyle = mercBg
    ctx.fillRect(0, 0, w, h)

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const n = fbmFast(x / w * 12, y / h * 9, 5, 9999)
        if (n > 0.6) {
          const t = (n - 0.6) / 0.4
          ctx.fillStyle = `rgba(200,195,180,${t * 0.3})`
          ctx.fillRect(x, y, 2, 2)
        } else if (n < 0.35) {
          const t = (0.35 - n) / 0.35
          ctx.fillStyle = `rgba(70,65,55,${t * 0.4})`
          ctx.fillRect(x, y, 2, 2)
        }
      }
    }

    const bigCraters = [
      { x: 150, y: 100, r: 50 },
      { x: 400, y: 180, r: 60 },
      { x: 700, y: 120, r: 45 },
      { x: 250, y: 350, r: 55 },
      { x: 600, y: 400, r: 50 },
      { x: 850, y: 280, r: 40 },
      { x: 500, y: 80, r: 35 },
      { x: 80, y: 280, r: 42 },
    ]
    bigCraters.forEach((c, i) => {
      const og = ctx.createRadialGradient(c.x, c.y, c.r * 0.4, c.x, c.y, c.r)
      og.addColorStop(0, 'rgba(60,55,45,0.55)')
      og.addColorStop(0.6, 'rgba(80,75,65,0.25)')
      og.addColorStop(1, 'rgba(100,95,85,0)')
      ctx.fillStyle = og
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill()

      const ig = ctx.createRadialGradient(c.x - c.r * 0.15, c.y - c.r * 0.15, 0, c.x, c.y, c.r * 0.45)
      ig.addColorStop(0, 'rgba(220,215,200,0.35)')
      ig.addColorStop(1, 'rgba(200,195,180,0)')
      ctx.fillStyle = ig
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 0.45, 0, Math.PI * 2); ctx.fill()

      const rg = ctx.createRadialGradient(c.x, c.y, c.r * 0.85, c.x, c.y, c.r * 1.15)
      rg.addColorStop(0, 'rgba(180,175,160,0.3)')
      rg.addColorStop(1, 'rgba(160,155,140,0)')
      ctx.fillStyle = rg
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 1.15, 0, Math.PI * 2); ctx.fill()
    })

    const midCraters = 30
    for (let i = 0; i < midCraters; i++) {
      const cx = Math.random() * w, cy = Math.random() * h
      const size = 12 + Math.random() * 25
      const og = ctx.createRadialGradient(cx, cy, size * 0.45, cx, cy, size)
      og.addColorStop(0, 'rgba(70,65,55,0.45)')
      og.addColorStop(0.7, 'rgba(90,85,75,0.2)')
      og.addColorStop(1, 'rgba(110,105,95,0)')
      ctx.fillStyle = og
      ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2); ctx.fill()

      const ig = ctx.createRadialGradient(cx - size * 0.1, cy - size * 0.1, 0, cx, cy, size * 0.4)
      ig.addColorStop(0, 'rgba(210,205,190,0.25)')
      ig.addColorStop(1, 'rgba(190,185,170,0)')
      ctx.fillStyle = ig
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2); ctx.fill()
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

function makeSunColorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height

  const baseGrad = ctx.createLinearGradient(0, 0, 0, h)
  baseGrad.addColorStop(0, '#ff9020')
  baseGrad.addColorStop(0.15, '#ffb840')
  baseGrad.addColorStop(0.35, '#ffd870')
  baseGrad.addColorStop(0.5, '#fff0a0')
  baseGrad.addColorStop(0.65, '#ffd870')
  baseGrad.addColorStop(0.85, '#ffb030')
  baseGrad.addColorStop(1, '#ff7010')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, w, h)

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const n = fbmFast(x / w * 12, y / h * 8, 5, 12345)
      if (n > 0.55) {
        const t = (n - 0.55) / 0.45
        ctx.fillStyle = `rgba(255,255,200,${t * 0.35})`
        ctx.fillRect(x, y, 2, 2)
      } else if (n < 0.35) {
        const t = (0.35 - n) / 0.35
        ctx.fillStyle = `rgba(220,80,20,${t * 0.4})`
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }

  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w, y = Math.random() * h
    const r = 15 + Math.random() * 40
    const spotGrad = ctx.createRadialGradient(x, y, 0, x, y, r)
    spotGrad.addColorStop(0, 'rgba(255,255,220,0.5)')
    spotGrad.addColorStop(0.4, 'rgba(255,200,100,0.25)')
    spotGrad.addColorStop(1, 'rgba(255,150,50,0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }

  for (let i = 0; i < 25; i++) {
    const x = Math.random() * w, y = Math.random() * h
    const r = 20 + Math.random() * 50
    const spotGrad = ctx.createRadialGradient(x, y, 0, x, y, r)
    spotGrad.addColorStop(0, 'rgba(180,60,20,0.5)')
    spotGrad.addColorStop(0.5, 'rgba(200,80,30,0.25)')
    spotGrad.addColorStop(1, 'rgba(220,100,40,0)')
    ctx.fillStyle = spotGrad
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * w, y = Math.random() * h
    const lw = 8 + Math.random() * 20, lh = 30 + Math.random() * 80
    const angle = (Math.random() - 0.5) * 0.8
    const lg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(lw, lh))
    lg.addColorStop(0, 'rgba(255,255,220,0.6)')
    lg.addColorStop(0.3, 'rgba(255,200,100,0.3)')
    lg.addColorStop(1, 'rgba(255,140,40,0)')
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillStyle = lg
    ctx.beginPath()
    ctx.ellipse(0, 0, lw, lh, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * w, y = Math.random() * h
    const s = Math.random() * 2 + 0.3
    const t = Math.random()
    const r = 255
    const g = 160 + Math.floor(t * 95)
    const b = 20 + Math.floor(t * 80)
    ctx.fillStyle = `rgba(${r},${g},${b},${0.1 + t * 0.35})`
    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill()
  }

  const edgeGrad = ctx.createLinearGradient(0, 0, 0, h)
  edgeGrad.addColorStop(0, 'rgba(200,50,10,0.3)')
  edgeGrad.addColorStop(0.1, 'rgba(255,150,50,0)')
  edgeGrad.addColorStop(0.9, 'rgba(255,150,50,0)')
  edgeGrad.addColorStop(1, 'rgba(200,50,10,0.3)')
  ctx.fillStyle = edgeGrad
  ctx.fillRect(0, 0, w, h)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 16
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 快速祥云环纹理
function makeRingTexture(outer: string, inner: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const w = canvas.width, h = canvas.height
  const oc = new THREE.Color(outer), ic = new THREE.Color(inner)

  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, `rgba(${Math.floor(oc.r * 255)},${Math.floor(oc.g * 255)},${Math.floor(oc.b * 255)},0.4)`)
  bg.addColorStop(0.3, `rgba(${Math.floor(ic.r * 255)},${Math.floor(ic.g * 255)},${Math.floor(ic.b * 255)},0.65)`)
  bg.addColorStop(0.5, `rgba(${Math.floor(ic.r * 255)},${Math.floor(ic.g * 255)},${Math.floor(ic.b * 255)},0.75)`)
  bg.addColorStop(0.7, `rgba(${Math.floor(ic.r * 255)},${Math.floor(ic.g * 255)},${Math.floor(ic.b * 255)},0.65)`)
  bg.addColorStop(1, `rgba(${Math.floor(oc.r * 255)},${Math.floor(oc.g * 255)},${Math.floor(oc.b * 255)},0.4)`)
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)

  const gaps = [
    { y: 15, h: 3 },
    { y: 40, h: 2 },
    { y: 65, h: 4 },
    { y: 90, h: 2 },
    { y: 110, h: 3 },
  ]
  gaps.forEach(gap => {
    const gapGrad = ctx.createLinearGradient(0, gap.y, 0, gap.y + gap.h)
    gapGrad.addColorStop(0, 'rgba(0,0,0,0)')
    gapGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)')
    gapGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gapGrad
    ctx.fillRect(0, gap.y, w, gap.h)
  })

  for (let i = 0; i < 80; i++) {
    const x = (i / 80) * w + Math.random() * 15
    const y = h / 2 + (Math.random() - 0.5) * 40
    const size = 25 + Math.random() * 50
    const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
    const col = Math.random() > 0.5 ? oc : ic
    grad.addColorStop(0, `rgba(${Math.floor(col.r * 255)},${Math.floor(col.g * 255)},${Math.floor(col.b * 255)},0.9)`)
    grad.addColorStop(0.3, `rgba(${Math.floor(col.r * 255)},${Math.floor(col.g * 255)},${Math.floor(col.b * 255)},0.5)`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill()
  }

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * w, y = h / 2 + (Math.random() - 0.5) * 30
    const gg = ctx.createRadialGradient(x, y, 0, x, y, 6)
    gg.addColorStop(0, 'rgba(255,250,220,0.85)')
    gg.addColorStop(0.4, 'rgba(255,245,200,0.4)')
    gg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill()
  }

  const edgeFade = ctx.createLinearGradient(0, 0, 0, h)
  edgeFade.addColorStop(0, 'rgba(0,0,0,0.3)')
  edgeFade.addColorStop(0.15, 'rgba(0,0,0,0)')
  edgeFade.addColorStop(0.85, 'rgba(0,0,0,0)')
  edgeFade.addColorStop(1, 'rgba(0,0,0,0.3)')
  ctx.fillStyle = edgeFade
  ctx.fillRect(0, 0, w, h)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 16
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
function Sun({ onComposerRingClick, selectedPlanets }: { onComposerRingClick: () => void; selectedPlanets: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null), glow1Ref = useRef<THREE.Mesh>(null)
  const glow2Ref = useRef<THREE.Mesh>(null), glow3Ref = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const composerRingRef = useRef<THREE.Mesh>(null)
  const composerGroupRef = useRef<THREE.Group>(null)
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [composerHovered, setComposerHovered] = useState(false)

  const COMPOSER_RADIUS = 10.0

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1) * 60, t = state.clock.elapsedTime
    if (meshRef.current) meshRef.current.rotation.y += 0.002 * dt
    const baseScale = hovered || composerHovered ? 1.15 : 1.0
    if (glow1Ref.current) { const cur = glow1Ref.current.scale.x; glow1Ref.current.scale.setScalar(cur + (baseScale * 1.18 + Math.sin(t * 1.8) * 0.05 - cur) * 0.1) }
    if (glow2Ref.current) { const cur = glow2Ref.current.scale.x; glow2Ref.current.scale.setScalar(cur + (baseScale * 1.45 + Math.sin(t * 1.2 + 0.5) * 0.08 - cur) * 0.08) }
    if (glow3Ref.current) { const cur = glow3Ref.current.scale.x; glow3Ref.current.scale.setScalar(cur + (baseScale * 1.75 + Math.sin(t * 0.8 + 1) * 0.1 - cur) * 0.06) }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.001 * dt
      const cur = coronaRef.current.scale.x; coronaRef.current.scale.setScalar(cur + (baseScale * 2.1 + Math.sin(t * 0.5 + 2) * 0.08 - cur) * 0.05)
    }
    if (composerGroupRef.current) {
      composerGroupRef.current.rotation.y += 0.0008 * dt
      const target = composerHovered ? 1.12 : 1.0
      const cur = composerGroupRef.current.scale.x
      composerGroupRef.current.scale.setScalar(cur + (target - cur) * 0.15)
    }
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      const targetOpacity = hovered ? 1.0 : 1.0
      mat.opacity += (targetOpacity - mat.opacity) * 0.1
    }
  })

  const handleComposerClick = (e: any) => {
    e.stopPropagation()
    onComposerRingClick()
  }
  const handleComposerOver = (e: any) => { e.stopPropagation(); setComposerHovered(true); document.body.style.cursor = 'pointer' }
  const handleComposerOut = () => { setComposerHovered(false); document.body.style.cursor = 'auto' }

  // 点击太阳：根据是否有连线决定进入组合页面还是太阳页面
  const handleSunClick = (e: any) => {
    e.stopPropagation()
    if (selectedPlanets.length >= 2) {
      onComposerRingClick()
    } else {
      navigate('/sun')
    }
  }

  const nodeAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5]

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={handleSunClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { if (!composerHovered) { setHovered(false); document.body.style.cursor = 'auto' } }}
      >
        <sphereGeometry args={[3.8, 48, 48]} />
        <meshBasicMaterial map={sunTex} />
      </mesh>
      {/* 光晕层 — 禁用点击 */}
      <mesh ref={glow1Ref} scale={1.18}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ffd880" transparent opacity={0.5} depthWrite={false} /></mesh>
      <mesh ref={glow2Ref} scale={1.45}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ffa840" transparent opacity={0.25} depthWrite={false} /></mesh>
      <mesh ref={glow3Ref} scale={1.75}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ff7020" transparent opacity={0.12} depthWrite={false} /></mesh>
      <mesh ref={coronaRef} scale={2.1}><sphereGeometry args={[3.8, 24, 24]} /><meshBasicMaterial color="#ff4010" transparent opacity={0.06} depthWrite={false} side={THREE.BackSide} /></mesh>
      <pointLight color="#ffd880" intensity={3.2} distance={160} decay={1.0} />

      {/* 组合实验室轨道环 — 放在最外层 */}
      <group ref={composerGroupRef}>
        {/* 厚碰撞体（不可见，用于更容易点击） */}
        <mesh
          onClick={handleComposerClick}
          onPointerOver={handleComposerOver}
          onPointerOut={handleComposerOut}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[COMPOSER_RADIUS, 1.0, 8, 120]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* 细光环（视觉效果） */}
        <mesh
          ref={composerRingRef}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[COMPOSER_RADIUS, 0.12, 8, 120]} />
          <meshStandardMaterial
            color="#ffe8a0"
            emissive="#ffc060"
            emissiveIntensity={composerHovered ? 2.5 : 1.0}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* 4个节点小球，更容易点击 */}
        {nodeAngles.map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * COMPOSER_RADIUS, 0, Math.sin(angle) * COMPOSER_RADIUS]}
            onClick={handleComposerClick}
            onPointerOver={handleComposerOver}
            onPointerOut={handleComposerOut}
          >
            <sphereGeometry args={[0.45, 24, 24]} />
            <meshStandardMaterial
              color="#fff0c0"
              emissive="#ffc860"
              emissiveIntensity={composerHovered ? 3.0 : 1.8}
            />
          </mesh>
        ))}
        {/* 4个节点外光晕（装饰用，点击穿透） */}
        {nodeAngles.map((angle, i) => (
          <mesh
            key={'glow' + i}
            position={[Math.cos(angle) * COMPOSER_RADIUS, 0, Math.sin(angle) * COMPOSER_RADIUS]}
            scale={composerHovered ? 1.8 : 1.4}
          >
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshBasicMaterial
              color="#ffd880"
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
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
  isSelected,
  onPositionUpdate,
  onSelect,
}: {
  data: PlanetData
  onHover: (id: string | null) => void
  hoveredId: string | null
  lightTarget: THREE.Vector3 | null
  isSelected: boolean
  onPositionUpdate: (id: string, position: THREE.Vector3) => void
  onSelect: (id: string) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null), groupRef = useRef<THREE.Group>(null)
  const atmo1Ref = useRef<THREE.Mesh>(null), atmo2Ref = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null), cloudRingRef = useRef<THREE.Mesh>(null)
  const navigate = useNavigate()
  const hoverDebounceRef = useRef<number | null>(null)
  const lastClickTimeRef = useRef(0)
  const DOUBLE_CLICK_DELAY = 300

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
      const a = state.clock.elapsedTime * data.orbitSpeed + data.phase
      groupRef.current.position.x = Math.cos(a) * data.orbitRadius
      groupRef.current.position.z = Math.sin(a) * data.orbitRadius
      groupRef.current.position.y = Math.sin(a) * Math.sin(data.orbitTilt) * data.orbitRadius * 0.15

      onPositionUpdate(data.id, groupRef.current.position)

      if (isHovered && lightTarget) {
        lightTarget.x += (groupRef.current.position.x - lightTarget.x) * 0.06
        lightTarget.y += ((groupRef.current.position.y + data.size * 2) - lightTarget.y) * 0.06
        lightTarget.z += (groupRef.current.position.z - lightTarget.z) * 0.06
      }
    }

    const targetScale = isHovered ? 1.4 : (isSelected ? 1.2 : 1.0)
    const lerp = Math.min(dt * 0.12, 0.18)

    if (meshRef.current) {
      const cur = meshRef.current.scale.x
      meshRef.current.scale.setScalar(cur + (targetScale - cur) * lerp)
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      const targetEmissive = isHovered ? 0.75 : (isSelected ? 0.55 : 0.28)
      mat.emissiveIntensity += ((isSelected ? 0.55 : 0.28) - mat.emissiveIntensity) * lerp
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

  // 点击反馈动画
  const [clickScale, setClickScale] = useState(1)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleClick = (e: any) => {
    e.stopPropagation()
    const now = performance.now()
    const timeDiff = now - lastClickTimeRef.current

    // 点击反馈动画
    setClickScale(0.9)
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = setTimeout(() => setClickScale(1), 150)

    if (timeDiff < DOUBLE_CLICK_DELAY) {
      navigate(data.route)
      lastClickTimeRef.current = 0
    } else {
      lastClickTimeRef.current = now
      onSelect(data.id)
    }
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={clickScale}
      >
        <sphereGeometry args={[data.size, 48, 48]} />
        <meshStandardMaterial
          map={tex}
          color={data.color}
          emissive={data.emissive}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.45 : 0.28}
          roughness={data.roughness}
          metalness={data.metalness}
        />
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
        opacity: 0.6
      })
      const line = new THREE.Line(geometry, material)

      // 流动光点几何体
      const flowGeometry = new THREE.BufferGeometry()
      const flowPositions = new Float32Array(15) // 5个光点
      flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3))
      const flowMaterial = new THREE.PointsMaterial({
        color: "#fff8e0",
        size: 0.25,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
      })
      const flowPoints = new THREE.Points(flowGeometry, flowMaterial)

      return { conn, geometry, line, material, isGlowing, flowGeometry, flowPoints, flowMaterial }
    })
  }, [connections, glowingConnections])

  // 实时更新连线位置和发光效果
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime
    const t = timeRef.current

    lineObjects.forEach((item, idx) => {
      const { conn, geometry, isGlowing, flowGeometry } = item
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
      if (isGlowing) {
        const pulse = 0.6 + Math.sin(t * 2) * 0.4
        mat.opacity = pulse
      } else {
        mat.opacity = 0.5 + Math.sin(t * 1.5 + idx) * 0.15
      }

      // 更新流动光点位置
      const flowPos = flowGeometry.attributes.position.array as Float32Array
      const dx = toPos.x - fromPos.x
      const dy = toPos.y - fromPos.y
      const dz = toPos.z - fromPos.z

      for (let i = 0; i < 5; i++) {
        const progress = ((t * 0.3 + i * 0.2) % 1 + 1) % 1
        flowPos[i * 3] = fromPos.x + dx * progress
        flowPos[i * 3 + 1] = fromPos.y + dy * progress
        flowPos[i * 3 + 2] = fromPos.z + dz * progress
      }
      flowGeometry.attributes.position.needsUpdate = true

      // 光点透明度随位置变化
      const flowMat = item.flowMaterial
      const glowPulse = 0.7 + Math.sin(t * 3) * 0.3
      flowMat.opacity = isGlowing ? glowPulse : glowPulse * 0.7
    })
  })

  // 清理几何体
  useEffect(() => {
    return () => {
      lineObjects.forEach(item => {
        item.geometry.dispose();
        (item.material as THREE.Material).dispose()
        item.flowGeometry.dispose();
        (item.flowMaterial as THREE.Material).dispose()
      })
    }
  }, [lineObjects])

  return (
    <group>
      {lineObjects.map((item, idx) => (
        <group key={`${item.conn.from}-${item.conn.to}-${idx}`}>
          <primitive
            object={item.line}
            ref={(el: THREE.Line | null) => { if (el) linesRef.current[idx] = el }}
          />
          <primitive object={item.flowPoints} />
        </group>
      ))}
    </group>
  )
}

// ========== 银河视图缩放监听 ==========
function GalaxyZoomListener({ onZoomOut }: { onZoomOut: () => void }) {
  const triggeredRef = useRef(false)

  useFrame(({ camera }) => {
    const distance = camera.position.length()
    if (distance > 85 && !triggeredRef.current) {
      triggeredRef.current = true
      onZoomOut()
    }
  })

  return null
}

// ========== 选中行星高亮环 ==========
function SelectionRing({
  position,
  color,
}: {
  position: THREE.Vector3
  color?: string
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const primaryColor = color || '#70d8e8'

  const particleCount = 24
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const r = 2.5 + Math.random() * 0.3
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      positions[i * 3 + 2] = Math.sin(angle) * r
    }
    return positions
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef.current && position) {
      ringRef.current.position.set(position.x, position.y, position.z)
      ringRef.current.rotation.z += 0.02
    }
    if (innerRingRef.current && position) {
      innerRingRef.current.position.set(position.x, position.y, position.z)
      innerRingRef.current.rotation.z -= 0.03
    }
    if (glowRef.current && position) {
      glowRef.current.position.set(position.x, position.y, position.z)
      const pulse = 1 + Math.sin(t * 3) * 0.1
      glowRef.current.scale.setScalar(pulse)
    }
    if (particlesRef.current && position) {
      particlesRef.current.position.set(position.x, position.y, position.z)
      particlesRef.current.rotation.y += 0.015
    }
  })

  return (
    <group>
      {/* 外发光环 */}
      <mesh
        ref={glowRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[2.8, 3.2, 48]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 主圆环 */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[2.2, 0.08, 12, 48]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 内环 */}
      <mesh
        ref={innerRingRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.6, 1.9, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 粒子环 */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particleData} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={primaryColor}
          size={0.1}
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

// ========== 组合圆环（连线中点，点击进入组合页面） ==========
function ComboRing({
  position,
  comboId,
  onClick
}: {
  position: THREE.Vector3 | null
  comboId: string | null
  onClick: () => void
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const glowRingRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const [hovered, setHovered] = useState(false)

  const combo = comboId ? getComboConfig(comboId.split('-')) : null
  const primaryColor = combo?.primaryColor || '#ffd700'
  const secondaryColor = combo?.secondaryColor || '#ffd700'
  const level = combo?.level || 2

  const particleCount = level === 2 ? 30 : level === 3 ? 50 : level === 4 ? 80 : 120

  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const r = 1.5 + (level - 2) * 0.5 + Math.random() * 0.4
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      positions[i * 3 + 2] = Math.sin(angle) * r
    }
    return positions
  }, [particleCount, level])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef.current && position) {
      ringRef.current.position.set(position.x, position.y, position.z)
      ringRef.current.rotation.z += level === 2 ? 0.015 : level === 3 ? 0.02 : level === 4 ? 0.025 : 0.03
    }
    if (innerRingRef.current && position) {
      innerRingRef.current.position.set(position.x, position.y, position.z)
      innerRingRef.current.rotation.z -= level === 2 ? 0.025 : level === 3 ? 0.035 : level === 4 ? 0.045 : 0.055
    }
    if (outerRingRef.current && position) {
      outerRingRef.current.position.set(position.x, position.y, position.z)
      outerRingRef.current.rotation.x += 0.01
      outerRingRef.current.rotation.y += 0.008
    }
    if (glowRingRef.current && position) {
      glowRingRef.current.position.set(position.x, position.y, position.z)
      const pulse = 1 + Math.sin(t * 2) * 0.08
      glowRingRef.current.scale.setScalar(pulse)
    }
    if (particlesRef.current && position) {
      particlesRef.current.position.set(position.x, position.y, position.z)
      particlesRef.current.rotation.y += level === 2 ? 0.008 : level === 3 ? 0.012 : level === 4 ? 0.018 : 0.025
    }
  })

  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => { if (hovered) document.body.style.cursor = 'auto' }
  }, [hovered])

  if (!position || !comboId) return null

  const ringSize = level === 2 ? 1.2 : level === 3 ? 1.6 : level === 4 ? 2.0 : 2.5
  const innerRingOuter = level === 2 ? 0.8 : level === 3 ? 1.1 : level === 4 ? 1.4 : 1.8
  const innerRingInner = level === 2 ? 0.6 : level === 3 ? 0.8 : level === 4 ? 1.0 : 1.3

  return (
    <group>
      {/* 外发光环（4星专用） */}
      {level >= 4 && (
        <mesh
          ref={glowRingRef}
          rotation={[Math.PI / 2, 0, 0]}
          position={position}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => { e.stopPropagation(); onClick() }}
        >
          <ringGeometry args={[ringSize + 0.8, ringSize + 1.0, 64]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={hovered ? 0.35 : 0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 外环（3星及以上） */}
      {level >= 3 && (
        <mesh
          ref={outerRingRef}
          position={position}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => { e.stopPropagation(); onClick() }}
        >
          <torusGeometry args={[ringSize + 0.4, 0.08, 12, 48]} />
          <meshBasicMaterial
            color={secondaryColor}
            transparent
            opacity={hovered ? 0.6 : 0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 主圆环 */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick() }}
      >
        <torusGeometry args={[ringSize, level === 5 ? 0.25 : level === 4 ? 0.2 : 0.15, 16, 48]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={hovered ? 0.95 : 0.65}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 内环 */}
      <mesh
        ref={innerRingRef}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick() }}
      >
        <ringGeometry args={[innerRingInner, innerRingOuter, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={hovered ? 0.75 : 0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 粒子环 */}
      <points
        ref={particlesRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick() }}
      >
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particleData} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color={primaryColor}
          size={level === 5 ? 0.15 : level === 4 ? 0.12 : 0.08}
          transparent
          opacity={hovered ? 0.8 : 0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

// ========== 主场景（带状态） ==========
function SceneWithState({
  selectedPlanets,
  allConnections,
  glowingConnections,
  hoveredId,
  setHoveredId,
  onGalaxyZoom,
  onComposerRingClick,
  onPlanetSelect,
  onComboClick,
}: {
  selectedPlanets: string[]
  allConnections: LineConnection[]
  glowingConnections?: LineConnection[]
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
  onGalaxyZoom: () => void
  onComposerRingClick: () => void
  onPlanetSelect: (id: string) => void
  onComboClick: (comboId: string) => void
}) {
  const lightTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const hoverLightRef = useRef<THREE.PointLight>(null)
  const planetPositionRefs = useRef<Record<string, THREE.Vector3>>({})

  useFrame((state) => {
    if (hoverLightRef.current) {
      hoverLightRef.current.position.lerp(lightTargetRef.current, 0.05)
    }
  })

  const onPositionUpdate = useCallback((planetId: string, position: THREE.Vector3) => {
    planetPositionRefs.current[planetId] = position
  }, [])

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
        maxDistance={100}
        autoRotate
        autoRotateSpeed={0.08}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.45}
        zoomSpeed={0.5}
      />
      <GalaxyZoomListener onZoomOut={onGalaxyZoom} />
      <Sun onComposerRingClick={onComposerRingClick} selectedPlanets={selectedPlanets} />
      {planets.map((p, i) => <OrbitRing key={`o-${p.id}`} radius={p.orbitRadius} tilt={p.orbitTilt} index={i} />)}
      {planets.map(p => (
        <Planet
          key={p.id}
          data={p}
          onHover={setHoveredId}
          hoveredId={hoveredId}
          lightTarget={hoveredId ? lightTargetRef.current : null}
          isSelected={selectedPlanets.includes(p.id)}
          onPositionUpdate={onPositionUpdate}
          onSelect={onPlanetSelect}
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
        const position = planetPositionRefs.current[planetId]
        return position ? <SelectionRing key={planetId} position={position} /> : null
      })}

      {/* 组合圆环：当选中2-3颗行星且有对应组合时显示 */}
      {selectedPlanets.length >= 2 && (() => {
        const combo = getComboConfig(selectedPlanets)
        if (!combo) return null

        // 计算所有选中行星的中心位置
        const positions = selectedPlanets
          .map(id => planetPositionRefs.current[id])
          .filter(Boolean)

        if (positions.length < 2) return null

        const centerPos = positions.reduce(
          (acc, pos) => ({
            x: acc.x + pos.x / positions.length,
            y: acc.y + pos.y / positions.length,
            z: acc.z + pos.z / positions.length,
          }),
          { x: 0, y: 0, z: 0 }
        )

        const midPos = new THREE.Vector3(centerPos.x, centerPos.y, centerPos.z)

        return (
          <ComboRing
            position={midPos}
            comboId={combo.id}
            onClick={() => onComboClick(combo.id)}
          />
        )
      })()}

      <ambientLight intensity={0.12} />
      <directionalLight position={[15, 25, 12]} intensity={0.18} color="#fff8e8" />
      <pointLight ref={hoverLightRef} color="#ffe8c0" intensity={hoveredId ? 2.5 : 0} distance={30} decay={2} />
    </>
  )
}

// ========== 主组件 ==========
export default function GameScene() {
  const navigate = useNavigate()
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([])
  const [completedConnections, setCompletedConnections] = useState<LineConnection[]>([])
  const [unlockedConstellations, setUnlockedConstellations] = useState<string[]>([])
  const [glowingConnections, setGlowingConnections] = useState<LineConnection[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showGalaxyHint, setShowGalaxyHint] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { playSound, playComboSound } = useSound(soundEnabled)

  const handleGalaxyZoom = useCallback(() => {
    navigate('/galaxy')
  }, [navigate])

  const handlePlanetSelect = useCallback((planetId: string) => {
    setSelectedPlanets(prev => {
      if (prev.includes(planetId)) {
        playSound('select')
        return prev.filter(id => id !== planetId)
      }
      playSound('connect')
      return [...prev, planetId]
    })
  }, [playSound])

  const handleComboClick = useCallback((comboId: string) => {
    const planets = comboId.split('-')
    const validId = getComboId(planets)
    const finalId = validId || [...planets].sort().join('-')
    const combo = getComboConfig(planets)
    if (combo) {
      playComboSound(combo.level)
    }
    navigate(`/combo/${finalId}`)
  }, [navigate, playComboSound])

  const [panelCollapsed, setPanelCollapsed] = useState(true)

  const [showUnlockPopup, setShowUnlockPopup] = useState(false)
  const [unlockPopupData, setUnlockPopupData] = useState<Constellation | null>(null)

  const resetGame = useCallback(() => {
    setSelectedPlanets([])
    setCompletedConnections([])
    setUnlockedConstellations([])
  }, [])

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
          allConnections={allConnections}
          glowingConnections={glowingConnections}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          onGalaxyZoom={handleGalaxyZoom}
          onComposerRingClick={() => {
            if (selectedPlanets.length >= 2) {
              const comboId = [...selectedPlanets].sort().join('-')
              navigate(`/combo/${comboId}`)
            } else {
              if (panelCollapsed) setPanelCollapsed(false)
            }
          }}
          onPlanetSelect={handlePlanetSelect}
          onComboClick={handleComboClick}
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
                  ✦ 双击进入专属功能 ✦
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
          {[
            { key: 'drag', text: '拖动旋转视角' },
            { key: 'wheel', text: '滚轮缩放远近' },
            { key: 'click', text: '点击选中行星' },
            { key: 'dblclick', text: '双击进入页面' },
          ].map((item, i) => (
            <div key={item.key} className="flex items-center justify-end gap-4 animate-[fadeIn_0.3s_ease-out]" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <span className="text-[10px] text-amber-100/45 tracking-[0.28em] font-light">{item.text}</span>
              <span className="text-amber-200/60 text-base leading-none">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* 连线解谜状态面板（可折叠） */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-auto select-none z-20 flex flex-col gap-3">
        {/* AR星空按钮 */}
        <button
          onClick={() => navigate('/ar-star')}
          className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-purple-200/30 hover:border-purple-200/60 text-purple-200/70 hover:text-purple-200 text-lg flex items-center justify-center transition-all shadow-lg shadow-purple-900/20"
          title="AR星空体验"
        >
          ✨
        </button>
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
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-amber-200/30 hover:border-amber-200/60 text-amber-200/70 hover:text-amber-200 text-lg flex items-center justify-center transition-all shadow-lg shadow-amber-900/20 animate-[fadeIn_0.3s_ease-out]"
            title="展开星座图鉴"
          >
            ★
          </button>
        ) : (
          /* 展开状态：完整面板 */
          <div
            className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-amber-200/20 min-w-[180px] shadow-xl shadow-amber-900/20 relative animate-[slideIn_0.25s_ease-out]"
            style={{
              animation: 'slideIn 0.25s ease-out',
            }}
          >
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
              const comboId = getComboId(constellation.planets)
              const dynamicComboId = [...constellation.planets].sort().join('-')
              return (
                <div
                  key={constellation.id}
                  onClick={() => {
                    if (isUnlocked) {
                      navigate(`/combo/${comboId || dynamicComboId}`)
                    }
                  }}
                  className={`mb-1.5 px-2 py-1 rounded transition-all ${
                    isUnlocked
                      ? 'bg-amber-200/15 text-amber-200 hover:bg-amber-200/25 cursor-pointer'
                      : 'bg-black/30 text-amber-100/40 cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium">{constellation.name}</div>
                    {isUnlocked && <span className="text-[10px]">→</span>}
                  </div>
                  {isUnlocked && (
                    <div className="text-[9px] text-amber-300/60 mt-0.5">{constellation.subtitle}</div>
                  )}
                  {!isUnlocked && (
                    <div className="text-[9px] text-amber-100/30 mt-0.5">
                      ◇ 需{constellation.connections.length}条连线
                    </div>
                  )}
                </div>
              )
            })}

            {/* 当前连线组合入口 */}
            {selectedPlanets.length >= 2 && (
              <div
                onClick={() => {
                  const comboId = [...selectedPlanets].sort().join('-')
                  navigate(`/combo/${comboId}`)
                }}
                className="mt-2 px-2 py-2 rounded transition-all border bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 cursor-pointer border-amber-400/30"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium">查看当前组合</div>
                  <span className="text-[10px]">✦</span>
                </div>
                <div className="text-[9px] mt-0.5" style={{ color: 'rgba(251, 191, 36, 0.7)' }}>
                  {selectedPlanets.length}颗行星连线
                </div>
              </div>
            )}

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
            <span className="text-[8px] tracking-widest">· 点击连线 · 长按进入 ·</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,200,100,0.03) 0%, transparent 40%)' }}></div>

      {/* 太阳圆环上方的组合名称显示 */}
      {selectedPlanets.length >= 2 && (
        <div
          className="absolute left-1/2 pointer-events-none z-10"
          style={{
            top: '18%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}
        >
          <div style={{
            fontSize: 10,
            color: 'rgba(255,232,160,0.5)',
            letterSpacing: 4,
            marginBottom: 4
          }}>
            ✦ 当前组合 ✦
          </div>
          <div style={{
            fontSize: 20,
            color: '#ffe8a0',
            fontWeight: 300,
            letterSpacing: 6,
            textShadow: '0 0 20px rgba(255,200,100,0.5)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            {selectedPlanets.length}星连线
          </div>
          <div style={{
            fontSize: 10,
            color: 'rgba(255,232,160,0.4)',
            letterSpacing: 2,
            marginTop: 6
          }}>
            点击太阳光环进入
          </div>
        </div>
      )}

      {/* 没有连线时的引导提示 */}
      {selectedPlanets.length < 2 && (
        <div
          className="absolute left-1/2 pointer-events-none z-10"
          style={{
            top: '20%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            opacity: 0.4
          }}
        >
          <div style={{
            fontSize: 11,
            color: 'rgba(255,232,160,0.6)',
            letterSpacing: 4,
          }}>
            拖动行星连线 · 解锁组合
          </div>
        </div>
      )}

      {/* 星座解锁：淡金色背景渐变 */}
      {showUnlockPopup && (
        <div className="absolute inset-0 pointer-events-none z-30 animate-[unlockFade_2.5s_ease-out]" style={{ background: 'radial-gradient(ellipse at center, rgba(255,220,150,0.04) 0%, transparent 55%)' }}></div>
      )}

      {/* 星座解锁：右下角极简文字提示 */}
      {showUnlockPopup && unlockPopupData && (
        <div
          onClick={() => {
            const comboId = [...unlockPopupData.planets].sort().join('-')
            navigate(`/combo/${comboId}`)
          }}
          className="absolute bottom-10 right-8 pointer-events-auto cursor-pointer z-40 animate-[unlockSlide_4s_ease-out]"
        >
          <div className="flex items-end gap-3 text-right">
            <div>
              <div className="text-[8px] text-amber-200/40 tracking-[0.4em] mb-1">✦ UNLOCKED</div>
              <div className="text-[14px] text-amber-100/80 tracking-[0.25em] font-light">{unlockPopupData.name}</div>
              <div className="text-[10px] text-amber-200/50 mt-1">{unlockPopupData.subtitle} · 点击进入</div>
            </div>
            <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-amber-300/40 to-transparent"></div>
            <div className="text-amber-200/60 text-xl">✦</div>
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
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <span style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffe8a0',
        letterSpacing: 4,
        fontSize: 11,
        opacity: 0.7,
        pointerEvents: 'none',
        textShadow: '0 0 10px rgba(255,200,100,0.3)'
      }}>
        · 点击行星选中 · 双击进入 ·
      </span>
    </div>
  )
}
