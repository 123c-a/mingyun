import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw) as T
    } catch {}
    return initial
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state])

  const set = (v: T | ((p: T) => T)) => {
    setState((prev) => typeof v === 'function' ? (v as (p: T) => T)(prev) : v)
  }

  const clear = () => {
    try { localStorage.removeItem(key) } catch {}
    setState(initial)
  }

  return [state, set, clear]
}

// 简易文本加密（非安全级，只做"锁起来"的仪式感）
export function encryptText(text: string, pass: string): string {
  const out: number[] = []
  for (let i = 0; i < text.length; i++) {
    out.push(text.charCodeAt(i) ^ pass.charCodeAt(i % pass.length))
  }
  return btoa(String.fromCharCode(...out))
}

export function decryptText(enc: string, pass: string): string {
  try {
    const raw = atob(enc)
    const out: number[] = []
    for (let i = 0; i < raw.length; i++) {
      out.push(raw.charCodeAt(i) ^ pass.charCodeAt(i % pass.length))
    }
    return String.fromCharCode(...out)
  } catch {
    return ''
  }
}

// 导出为图片：canvas 原生实现，不需要 html-to-image
export function exportAsImage(title: string, subtitle: string, items: { text: string; meta?: string }[], bgColor = '#0a0a12', fgColor = '#c0c8e0', accentColor = '#ffd880', filename = `export-${Date.now()}.png`) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = 900
  const H = 1100
  const dpr = window.devicePixelRatio || 2
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  ctx.scale(dpr, dpr)

  // 背景
  const grad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, Math.max(W, H) / 1.2)
  grad.addColorStop(0, bgColor)
  grad.addColorStop(1, '#050508')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // 星星
  for (let i = 0; i < 60; i++) {
    const x = (i * 137 + 41) % W
    const y = (i * 79 + 23) % H
    const r = 0.5 + (i % 3) * 0.5
    ctx.fillStyle = `rgba(255,255,255,${0.05 + (i % 5) * 0.04})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // 标题
  ctx.fillStyle = accentColor
  ctx.font = '400 44px Georgia, "Songti SC", serif'
  ctx.textAlign = 'center'
  ctx.fillText(title, W / 2, 150)

  // 副标题
  ctx.fillStyle = fgColor
  ctx.font = '400 16px Georgia, "Songti SC", serif'
  const words = subtitle.split('')
  ctx.fillText(words.join('  '), W / 2, 200)

  // 分割线
  ctx.strokeStyle = accentColor + '40'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W * 0.3, 240)
  ctx.lineTo(W * 0.7, 240)
  ctx.stroke()

  // 日期
  const today = new Date()
  const dateStr = today.getFullYear() + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + String(today.getDate()).padStart(2, '0')
  ctx.fillStyle = fgColor + '60'
  ctx.font = '400 12px Georgia, "Songti SC", serif'
  ctx.fillText(dateStr, W / 2, 280)

  // 内容项
  ctx.textAlign = 'left'
  const startY = 340
  const lineHeight = 95
  let y = startY

  items.slice(0, 7).forEach((item, i) => {
    // 小圆点
    ctx.fillStyle = accentColor
    ctx.beginPath()
    ctx.arc(120, y - 8, 4, 0, Math.PI * 2)
    ctx.fill()

    // 文字
    ctx.fillStyle = fgColor
    ctx.font = '400 20px Georgia, "Songti SC", serif'
    const maxWidth = 640
    const text = item.text
    const chars = text.split('')
    let line = ''
    let lineY = y
    for (const ch of chars) {
      const test = line + ch
      if (ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, 150, lineY)
        line = ch
        lineY += 32
      } else {
        line = test
      }
    }
    ctx.fillText(line, 150, lineY)

    // meta
    if (item.meta) {
      ctx.fillStyle = fgColor + '50'
      ctx.font = '400 12px Georgia, "Songti SC", serif'
      ctx.fillText('· ' + item.meta, 150, lineY + 28)
    }

    y = lineY + lineHeight
  })

  if (items.length > 7) {
    ctx.fillStyle = fgColor + '40'
    ctx.textAlign = 'center'
    ctx.font = '400 12px Georgia, "Songti SC", serif'
    ctx.fillText(`还有 ${items.length - 7} 条……`, W / 2, H - 80)
  }

  // 底部署名
  ctx.fillStyle = accentColor + '50'
  ctx.textAlign = 'center'
  ctx.font = '400 11px Georgia, "Songti SC", serif'
  ctx.fillText('—— 平行宇宙天文台 · 治愈系 ——', W / 2, H - 40)

  // 导出
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}

// ============================================================
// 太阳 · 愿望长图生成
// ============================================================
export function generateSunImage(data: { refined: string; why: string; deeper: string; mantra: string }) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = 900
  const H = 1300
  const dpr = window.devicePixelRatio || 2
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  ctx.scale(dpr, dpr)

  // 1. 背景 - 从暖金到深棕的渐变光晕
  const bgGrad = ctx.createRadialGradient(W / 2, 300, 80, W / 2, H / 2, Math.max(W, H))
  bgGrad.addColorStop(0, '#3a1f08')
  bgGrad.addColorStop(0.6, '#1a0d05')
  bgGrad.addColorStop(1, '#0a0502')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // 2. 金色光斑
  const glowGrad = ctx.createRadialGradient(W / 2, 280, 50, W / 2, 280, 500)
  glowGrad.addColorStop(0, 'rgba(255,220,140,0.4)')
  glowGrad.addColorStop(0.3, 'rgba(255,190,100,0.1)')
  glowGrad.addColorStop(1, 'rgba(255,180,80,0)')
  ctx.fillStyle = glowGrad
  ctx.fillRect(0, 0, W, 800)

  // 3. 星星
  for (let i = 0; i < 80; i++) {
    const x = (i * 137 + 41) % W
    const y = (i * 79 + 17) % H
    const r = 0.4 + (i % 4) * 0.4
    ctx.fillStyle = `rgba(255,230,180,${0.06 + (i % 6) * 0.05})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // 4. 发光太阳圈（顶部）
  ctx.save()
  ctx.translate(W / 2, 260)
  for (let r = 180; r > 40; r -= 10) {
    const alpha = 0.05
    ctx.strokeStyle = `rgba(255,210,130,${alpha})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  const sunGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 80)
  sunGrad.addColorStop(0, '#fff0c0')
  sunGrad.addColorStop(0.5, '#ffd880')
  sunGrad.addColorStop(1, 'rgba(255,180,80,0)')
  ctx.fillStyle = sunGrad
  ctx.beginPath()
  ctx.arc(0, 0, 80, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 5. 标题
  ctx.fillStyle = '#ffd880'
  ctx.textAlign = 'center'
  ctx.font = '400 14px Georgia, "Songti SC", serif'
  ctx.fillText('核 心 之 光', W / 2, 460)
  ctx.fillStyle = '#ffe8a0'
  ctx.font = '400 10px Georgia, "Songti SC", serif'
  ctx.fillStyle = 'rgba(255,210,130,0.5)'
  ctx.fillText('— C O R E   L I G H T —', W / 2, 490)

  // 6. 核心愿望 - 居中大段
  const drawWrapped = (text: string, x: number, y: number, maxWidth: number, fontSize: number, color: string, align: CanvasTextAlign = 'left') => {
    ctx.fillStyle = color
    ctx.font = `400 ${fontSize}px Georgia, "Songti SC", serif`
    ctx.textAlign = align
    const chars = text.split('')
    const lines: string[] = []
    let line = ''
    for (const ch of chars) {
      const test = line + ch
      if (ctx.measureText(test).width > maxWidth) {
        lines.push(line)
        line = ch
      } else {
        line = test
      }
    }
    lines.push(line)
    const lineH = fontSize * 1.8
    lines.forEach((ln, idx) => ctx.fillText(ln, x, y + idx * lineH))
    return lines.length
  }

  // 7. 精炼愿望（大段）
  const refinedY = 550
  const refinedLines = (() => {
    const t = data.refined
    ctx.font = '400 24px Georgia, "Songti SC", serif'
    const chars = t.split('')
    const lines: string[] = []
    let line = ''
    for (const ch of chars) {
      const test = line + ch
      if (ctx.measureText(test).width > 620) { lines.push(line); line = ch } else line = test
    }
    lines.push(line)
    ctx.fillStyle = '#ffe8a0'
    ctx.textAlign = 'center'
    const lineH = 48
    lines.forEach((ln, i) => ctx.fillText(ln, W / 2, refinedY + i * lineH))
    return lines.length
  })()

  // 8. 分隔线
  const sepY = refinedY + 80 + refinedLines * 48
  ctx.strokeStyle = 'rgba(255,200,110,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W * 0.35, sepY); ctx.lineTo(W * 0.65, sepY)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,200,110,0.6)'
  ctx.font = '400 14px Georgia, "Songti SC", serif'
  ctx.textAlign = 'center'
  ctx.fillText('·', W / 2, sepY + 4)

  // 9. Why
  const whyY = sepY + 50
  drawWrapped(data.why, W / 2, whyY, 560, 15, '#ffd8a0', 'center')

  // 10. Deeper - 居中，换背景卡
  // 简单背景卡
  const deeperCard = (() => {
    // 计算 why 的高度
    ctx.font = '400 15px Georgia, "Songti SC", serif'
    const lines: string[] = []
    let line = ''
    for (const ch of data.deeper.split('')) {
      const test = line + ch
      if (ctx.measureText(test).width > 560) { lines.push(line); line = ch } else line = test
    }
    lines.push(line)
    return lines
  })()
  const deeperY = whyY + 160
  const cardH = 60 + deeperCard.length * 30
  const cardW = 620
  // 卡片背景
  const cardGrad = ctx.createLinearGradient(0, deeperY, 0, deeperY + cardH)
  cardGrad.addColorStop(0, 'rgba(255,200,120,0.12)')
  cardGrad.addColorStop(1, 'rgba(255,180,80,0.05)')
  ctx.fillStyle = cardGrad
  roundRect(ctx, (W - cardW) / 2, deeperY, cardW, cardH, 14)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,200,110,0.25)'
  ctx.lineWidth = 1
  roundRect(ctx, (W - cardW) / 2, deeperY, cardW, cardH, 14)
  ctx.stroke()
  // 标题
  ctx.fillStyle = '#ffb870'
  ctx.font = '400 12px Georgia, "Songti SC", serif'
  ctx.textAlign = 'center'
  ctx.fillText('更 深 的 含 义', W / 2, deeperY + 35)
  // 内容
  deeperCard.forEach((ln, i) => ctx.fillText(ln, W / 2, deeperY + 70 + i * 30))

  // 11. Mantra - 底部真言卡片
  const mantraY = deeperY + cardH + 40
  // Mantra 圆
  const mantraCardH = 120
  const mantraCardW = 560
  const mantraGrad = ctx.createLinearGradient(0, mantraY, 0, mantraY + mantraCardH)
  mantraGrad.addColorStop(0, 'rgba(255,230,150,0.2)')
  mantraGrad.addColorStop(1, 'rgba(255,200,110,0.08)')
  ctx.fillStyle = mantraGrad
  roundRect(ctx, (W - mantraCardW) / 2, mantraY, mantraCardW, mantraCardH, 16)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,210,130,0.4)'
  roundRect(ctx, (W - mantraCardW) / 2, mantraY, mantraCardW, mantraCardH, 16)
  ctx.stroke()

  ctx.fillStyle = '#ffe8a0'
  ctx.font = '400 11px Georgia, "Songti SC", serif'
  ctx.textAlign = 'center'
  ctx.fillText('真  言', W / 2, mantraY + 40)

  ctx.font = '400 22px Georgia, "Songti SC", serif'
  ctx.fillStyle = '#fff0c0'
  const mantraChars = data.mantra.split('')
  const mantraLine = mantraChars.join('  ')
  ctx.fillText(mantraLine, W / 2, mantraY + 80)

  // 12. 底部签名 & 日期
  const today = new Date()
  const dateStr = today.getFullYear() + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + String(today.getDate()).padStart(2, '0')

  // 小分割线
  ctx.strokeStyle = 'rgba(255,200,110,0.2)'
  ctx.beginPath()
  ctx.moveTo(W * 0.25, H - 110)
  ctx.lineTo(W * 0.75, H - 110)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,210,130,0.6)'
  ctx.font = '400 11px Georgia, "Songti SC", serif'
  ctx.fillText(dateStr, W / 2, H - 75)
  ctx.fillText('—— 平行宇宙天文台 · 核心之光 ——', W / 2, H - 50)

  // 13. 导出
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wish-${Date.now()}.png`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}

// 辅助：圆角矩形路径
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// helper for exportAsImage的兼容
