import { useEffect, useRef } from 'react'
import { getTheme } from './planetThemes'

// === 每个星球独特的 3D 贴图背景 ===
// 用 Canvas 绘制伪 3D 纹理：水波纹 / 熔岩粒子 / 花瓣飘落 / 星尘轨道 / 沙尘年轮 / 蛋壳裂纹 / 结晶粒子
// 每个主题都有独特的贴图图案和动效

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// ============ 水星：冰蓝色结晶粒子 ============
function renderMercury(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  // 背景暗纹 - 冰蓝色结晶网格
  const gridStep = 80
  const offset = (t * 0.2) % gridStep
  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = particleColor
  ctx.lineWidth = 1
  for (let x = -gridStep + offset; x < w + gridStep; x += gridStep) {
    for (let y = -gridStep; y < h + gridStep; y += gridStep) {
      const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2) / Math.max(w, h)
      ctx.globalAlpha = 0.06 * (1 - dist)
      ctx.beginPath()
      const s = 20 + Math.sin(t * 0.01 + x * 0.02 + y * 0.01) * 6
      ctx.moveTo(x - s, y); ctx.lineTo(x + s, y)
      ctx.moveTo(x, y - s); ctx.lineTo(x, y + s)
      ctx.stroke()
    }
  }
  ctx.restore()

  // 漂浮的结晶粒子 - 旋转上升
  for (let i = 0; i < 60; i++) {
    const angle = (i * 37 + t * 0.3) * Math.PI / 180
    const radius = 150 + (i * 13) % 400
    const cx = w / 2 + Math.cos(angle) * radius
    const cy = h / 2 + Math.sin(angle) * radius * 0.7 - (t * 0.3) % 100
    const size = 2 + (i % 4)
    const tw = 0.5 + 0.5 * Math.sin(t * 0.02 + i)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 0.002 + i)
    ctx.globalAlpha = tw * 0.6
    ctx.fillStyle = particleColor
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 12
    // 菱形结晶
    ctx.beginPath()
    ctx.moveTo(0, -size); ctx.lineTo(size * 0.7, 0); ctx.lineTo(0, size); ctx.lineTo(-size * 0.7, 0)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // 中心冰蓝色发光
  const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.4)
  grd.addColorStop(0, hexToRgba(particleColor, 0.18))
  grd.addColorStop(1, 'transparent')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)
}

// ============ 金星：玫瑰花瓣飘落 ============
function renderVenus(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  // 背景温柔光斑
  for (let i = 0; i < 5; i++) {
    const grd = ctx.createRadialGradient(
      w * (0.2 + i * 0.15) + Math.sin(t * 0.003 + i) * 40,
      h * (0.3 + (i % 3) * 0.2) + Math.cos(t * 0.002 + i) * 30,
      0, w * (0.2 + i * 0.15), h * (0.3 + (i % 3) * 0.2), 300
    )
    grd.addColorStop(0, hexToRgba('#ffb4c4', 0.08))
    grd.addColorStop(1, 'transparent')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, w, h)
  }

  // 飘落的花瓣 - 伪3D椭圆花瓣
  for (let i = 0; i < 35; i++) {
    const seed = i * 137
    const x = (seed + t * 0.3 + Math.sin(t * 0.01 + i) * 40) % (w + 100) - 50
    const y = ((seed * 0.7) + t * 0.5 + i * 50) % (h + 100) - 50
    const rot = (t * 0.01 + i) % (Math.PI * 2)
    const scale = 0.6 + ((i * 7) % 100) / 200
    const sz = 18 * scale
    const depthAlpha = 0.25 + ((i * 11) % 100) / 200

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot - Math.PI / 4)
    ctx.globalAlpha = depthAlpha

    // 花瓣渐变
    const petalGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, sz)
    petalGrd.addColorStop(0, hexToRgba('#ffe0e8', 0.9))
    petalGrd.addColorStop(0.5, hexToRgba('#ffb4c4', 0.7))
    petalGrd.addColorStop(1, hexToRgba('#e89aa8', 0.1))
    ctx.fillStyle = petalGrd
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 8 * scale
    // 椭圆花瓣形状
    ctx.beginPath()
    ctx.ellipse(0, 0, sz * 0.5, sz, 0, 0, Math.PI * 2)
    ctx.fill()
    // 花瓣中央细线
    ctx.strokeStyle = hexToRgba('#ff88a0', 0.3 * depthAlpha)
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(0, sz); ctx.stroke()
    ctx.restore()
  }
}

// ============ 火星：熔岩粒子 ============
function renderMars(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  // 熔岩网格 - 底部暗红色裂缝纹理
  for (let i = 0; i < 3; i++) {
    const y = h * (0.3 + i * 0.25) + Math.sin(t * 0.008 + i) * 20
    ctx.save()
    ctx.globalAlpha = 0.15
    ctx.strokeStyle = '#ff6840'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= w; x += 20) {
      ctx.lineTo(x, y + Math.sin(x * 0.01 + t * 0.02 + i) * 15 + Math.sin(x * 0.03 + i) * 5)
    }
    ctx.stroke()
    ctx.restore()
  }

  // 上升的熔岩粒子 - 从底部向上漂浮的火球
  for (let i = 0; i < 80; i++) {
    const seed = (i * 97 + t * 0.5) % (w + 200)
    const x = seed - 100
    const yOffset = (t * (0.5 + (i % 20) * 0.02) + i * 30) % (h + 100)
    const y = h - yOffset
    const size = 2 + (i % 5)
    const alpha = Math.max(0, Math.min(1, yOffset / (h + 100))) * 0.7

    ctx.save()
    ctx.globalAlpha = alpha
    // 外层光晕
    const grd = ctx.createRadialGradient(x, y, 0, x, y, size * 4)
    if (i % 3 === 0) {
      grd.addColorStop(0, 'rgba(255, 220, 120, 0.9)')
      grd.addColorStop(0.4, 'rgba(255, 140, 60, 0.4)')
    } else {
      grd.addColorStop(0, 'rgba(255, 140, 80, 0.8)')
      grd.addColorStop(0.4, 'rgba(200, 60, 30, 0.3)')
    }
    grd.addColorStop(1, 'transparent')
    ctx.fillStyle = grd
    ctx.beginPath(); ctx.arc(x, y, size * 4, 0, Math.PI * 2); ctx.fill()
    // 核心
    ctx.fillStyle = i % 3 === 0 ? '#fff0c0' : '#ffa060'
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 15
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }

  // 顶部微弱红光
  const topGrd = ctx.createLinearGradient(0, 0, 0, h * 0.3)
  topGrd.addColorStop(0, 'rgba(80, 20, 10, 0.4)')
  topGrd.addColorStop(1, 'transparent')
  ctx.fillStyle = topGrd
  ctx.fillRect(0, 0, w, h * 0.3)
}

// ============ 木星：金色星尘轨道 ============
function renderJupiter(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  // 多层同心轨道 - 贵族感金色
  const cx = w / 2, cy = h / 2
  for (let i = 0; i < 8; i++) {
    const radius = Math.min(w, h) * (0.12 + i * 0.09)
    const rotSpeed = t * (0.001 + i * 0.0002) * (i % 2 === 0 ? 1 : -1)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rotSpeed)
    // 虚线轨道
    ctx.setLineDash([8, 20])
    ctx.lineDashOffset = -t * (0.2 + i * 0.05)
    ctx.globalAlpha = 0.1 + i * 0.015
    ctx.strokeStyle = particleColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // 轨道上的星
    for (let j = 0; j < 4; j++) {
      const a = rotSpeed + (j * Math.PI / 2) + i * 0.3
      const sx = cx + Math.cos(a) * radius
      const sy = cy + Math.sin(a) * radius
      const size = 1.5 + (i % 3)
      ctx.save()
      ctx.globalAlpha = 0.4 + i * 0.05
      ctx.fillStyle = particleColor
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 20
      ctx.beginPath(); ctx.arc(sx, sy, size, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }
  }

  // 中心金色光晕
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.3)
  grd.addColorStop(0, hexToRgba(particleColor, 0.22))
  grd.addColorStop(1, 'transparent')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)
}

// ============ 土星：年轮沙尘纹理 ============
function renderSaturn(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  const cx = w / 2, cy = h / 2

  // 土星环 - 倾斜的多层圆环
  for (let ring = 0; ring < 6; ring++) {
    const radius = Math.min(w, h) * (0.15 + ring * 0.07)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.transform(1, 0, 0.35, 1, 0, 0) // 倾斜

    ctx.lineWidth = 3
    ctx.globalAlpha = 0.15 - ring * 0.02
    ctx.strokeStyle = particleColor
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()

    // 环上的颗粒
    ctx.globalAlpha = 0.3
    for (let k = 0; k < 20; k++) {
      const a = (k * 18 + ring * 13 + t * 0.05) * Math.PI / 180
      const rx = Math.cos(a) * radius
      const ry = Math.sin(a) * radius
      ctx.fillStyle = particleColor
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 6
      ctx.beginPath(); ctx.arc(rx, ry, 1.5, 0, Math.PI * 2); ctx.fill()
    }
    ctx.restore()
  }

  // 飘散的沙尘 - 缓慢下降的米色颗粒
  for (let i = 0; i < 60; i++) {
    const x = (i * 173 + t * 0.2 + Math.sin(t * 0.01 + i) * 50) % w
    const y = (i * 89 + t * 0.3) % h
    const size = 0.8 + (i % 3) * 0.5
    ctx.save()
    ctx.globalAlpha = 0.25 + ((i * 7) % 100) / 400
    ctx.fillStyle = particleColor
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 5
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }

  // 中心光晕
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.25)
  grd.addColorStop(0, hexToRgba(particleColor, 0.18))
  grd.addColorStop(1, 'transparent')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)
}

// ============ 天王星：冰蓝色蛋壳裂纹 ============
function renderUranus(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  // 裂纹网格 - 从中心向外辐射的不规则裂纹
  const cx = w / 2, cy = h / 2
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.strokeStyle = particleColor
  ctx.lineWidth = 1

  for (let i = 0; i < 30; i++) {
    const startAngle = (i * 12 + Math.sin(t * 0.003 + i) * 5) * Math.PI / 180
    const length = 100 + (i * 37) % 300
    const startR = 50 + (i * 13) % 150

    ctx.beginPath()
    const sx = cx + Math.cos(startAngle) * startR
    const sy = cy + Math.sin(startAngle) * startR
    ctx.moveTo(sx, sy)

    let px = sx, py = sy, pa = startAngle
    for (let step = 0; step < 8; step++) {
      pa += (Math.sin(t * 0.01 + i + step) * 0.3)
      px += Math.cos(pa) * length / 8
      py += Math.sin(pa) * length / 8
      ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // 横向裂纹
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    const y = h * (0.15 + i * 0.1) + Math.sin(t * 0.008 + i) * 30
    ctx.moveTo(0, y)
    for (let x = 0; x < w; x += 40) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + t * 0.01 + i) * 20 + ((i * 11) % 20 - 10))
    }
    ctx.globalAlpha = 0.05
    ctx.stroke()
  }
  ctx.restore()

  // 漂浮的冰碎片 - 小三角形
  for (let i = 0; i < 40; i++) {
    const x = (i * 211 + t * 0.4 + Math.sin(t * 0.008 + i) * 60) % w
    const y = (i * 137 + t * 0.25 + Math.cos(t * 0.01 + i) * 40) % h
    const rot = (t * 0.005 + i) % (Math.PI * 2)
    const size = 4 + (i % 5)
    const alpha = 0.15 + ((i * 13) % 100) / 400

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.globalAlpha = alpha
    ctx.fillStyle = particleColor
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.lineTo(size * 0.87, size * 0.5)
    ctx.lineTo(-size * 0.87, size * 0.5)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // 中心冰蓝光晕
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35)
  grd.addColorStop(0, hexToRgba(particleColor, 0.15))
  grd.addColorStop(1, 'transparent')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)
}

// ============ 海王星：深蓝海洋流动波纹 ============
function renderNeptune(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  // 多层波浪 - 从浅到深
  for (let layer = 0; layer < 5; layer++) {
    const baseY = h * (0.25 + layer * 0.15)
    const amp = 20 + layer * 8
    const freq = 0.008 - layer * 0.0005
    const speed = 0.5 + layer * 0.15
    const alpha = 0.12 - layer * 0.015

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = particleColor
    ctx.lineWidth = 1.5

    ctx.beginPath()
    ctx.moveTo(0, baseY)
    for (let x = 0; x <= w; x += 4) {
      const y = baseY + Math.sin(x * freq + t * speed * 0.02 + layer) * amp
        + Math.sin(x * freq * 2.3 + t * speed * 0.015 - layer * 0.5) * amp * 0.4
      ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 波面闪光
    ctx.globalAlpha = alpha * 1.2
    for (let k = 0; k < 30; k++) {
      const xf = (k * 53 + t * speed) % w
      const yf = baseY + Math.sin(xf * freq + t * speed * 0.02 + layer) * amp
      ctx.fillStyle = particleColor
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(xf, yf, 1, 0, Math.PI * 2); ctx.fill()
    }
    ctx.restore()
  }

  // 上升的气泡 - 从水底到水面
  for (let i = 0; i < 45; i++) {
    const x = (i * 179 + Math.sin(t * 0.01 + i) * 80 + t * 0.3) % (w + 100) - 50
    const yProgress = ((i * 47 + t * 0.6) % (h + 200)) / (h + 200)
    const y = h - yProgress * h
    const size = 1 + (i % 4) * (0.5 + yProgress * 1.5)
    const alpha = Math.sin(yProgress * Math.PI) * 0.5

    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = particleColor
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 10
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.stroke()
    ctx.restore()
  }

  // 海洋底部深蓝光晕
  const bottomGrd = ctx.createLinearGradient(0, h * 0.5, 0, h)
  bottomGrd.addColorStop(0, 'transparent')
  bottomGrd.addColorStop(1, hexToRgba(particleColor, 0.15))
  ctx.fillStyle = bottomGrd
  ctx.fillRect(0, h * 0.5, w, h * 0.5)
}

// ============ 通用：星尘粒子（备用/补充） ============
function renderStardust(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particleColor: string, glowColor: string) {
  // 标准缓慢闪烁的星尘
  for (let i = 0; i < 100; i++) {
    const x = (i * 211 + Math.sin(t * 0.005 + i) * 30) % w
    const y = (i * 137 + Math.cos(t * 0.004 + i) * 25) % h
    const tw = 0.4 + 0.6 * Math.sin(t * 0.02 + i * 0.7)
    const size = 0.8 + (i % 3) * 0.5
    ctx.save()
    ctx.globalAlpha = tw * 0.5
    ctx.fillStyle = particleColor
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 8
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }
}

export function PlanetCanvas({ themeId, density = 1 }: { themeId: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const theme = getTheme(themeId)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const render = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)

      const color = theme.particleColor
      const glow = theme.glowColor

      switch (themeId) {
        case 'mercury':
          renderMercury(ctx, w, h, t, color, glow)
          break
        case 'venus':
          renderVenus(ctx, w, h, t, color, glow)
          break
        case 'mars':
          renderMars(ctx, w, h, t, color, glow)
          break
        case 'jupiter':
          renderJupiter(ctx, w, h, t, color, glow)
          break
        case 'saturn':
          renderSaturn(ctx, w, h, t, color, glow)
          break
        case 'uranus':
          renderUranus(ctx, w, h, t, color, glow)
          break
        case 'neptune':
          renderNeptune(ctx, w, h, t, color, glow)
          break
        default:
          renderStardust(ctx, w, h, t, color, glow)
      }

      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [themeId, density])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}
