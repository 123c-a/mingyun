/**
 * Desktop — 星空桌面
 * - Canvas 粒子星空背景（鼠标交互）
 * - 图标网格（双击打开 App）
 */

import { useEffect, useRef, useState } from 'react'
import { useOSStore, AppId } from '../../store/osStore'

// ============ 图标配置 ============
const DESKTOP_ICONS: { appId: AppId; label: string; icon: string; desc: string }[] = [
  { appId: 'destinysim', label: '命运模拟器', icon: '🌟', desc: '亲手重写你的人生轨迹' },
  { appId: 'fateos', label: '命运编译器', icon: '🔮', desc: '生成你的命运底色与人生节点' },
  { appId: 'universebrowser', label: '宇宙浏览器', icon: '🪐', desc: '探索平行宇宙的无限可能' },
  { appId: 'observerai', label: '观察者 AI', icon: '🤖', desc: '全宇宙最博学的 AI 助手' },
  { appId: 'livedstudio', label: '星际直播台', icon: '📺', desc: '数字人主播实时为你推演' },
  { appId: 'journal', label: '观测日志', icon: '📔', desc: '记录每一次命运的轨迹' },
  { appId: 'system', label: '系统设置', icon: '⚙️', desc: '定制你的 Multiverse OS' },
]

// ============ 星空背景 Canvas ============
function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // 生成星星
    const stars: { x: number; y: number; r: number; speed: number; opacity: number; twinkle: number }[] = []
    for (let i = 0; i < 280; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.12 + 0.02,
        opacity: Math.random() * 0.7 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
      })
    }

    // 流星
    const meteors: { x: number; y: number; len: number; speed: number; opacity: number; active: boolean }[] = []
    for (let i = 0; i < 3; i++) {
      meteors.push({ x: 0, y: 0, len: 0, speed: 0, opacity: 0, active: false })
    }
    let meteorTimer = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 背景渐变
      const bg = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      )
      bg.addColorStop(0, 'rgba(20, 8, 45, 1)')
      bg.addColorStop(0.4, 'rgba(10, 5, 30, 1)')
      bg.addColorStop(1, 'rgba(3, 3, 12, 1)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 星星
      for (const s of stars) {
        s.twinkle += s.speed
        const o = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        ctx.fill()
      }

      // 流星
      meteorTimer++
      if (meteorTimer > 180 && Math.random() < 0.015) {
        const m = meteors.find((x) => !x.active)
        if (m) {
          m.x = Math.random() * canvas.width * 1.2
          m.y = Math.random() * canvas.height * 0.5
          m.len = 60 + Math.random() * 80
          m.speed = 8 + Math.random() * 6
          m.opacity = 0.8 + Math.random() * 0.2
          m.active = true
          meteorTimer = 0
        }
      }

      for (const m of meteors) {
        if (!m.active) continue
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y + m.len * 0.4)
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`)
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.len, m.y + m.len * 0.4)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
        m.x -= m.speed
        m.y += m.speed * 0.4
        m.opacity -= 0.012
        if (m.opacity <= 0) m.active = false
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

// ============ 桌面图标 ============
function DesktopIcons() {
  const openApp = useOSStore((s) => s.openApp)
  const [hovered, setHovered] = useState<AppId | null>(null)

  return (
    <div
      className="relative z-10 p-4"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 48, // 留任务栏空间
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      {DESKTOP_ICONS.map((icon) => {
        const isHover = hovered === icon.appId
        return (
          <div
            key={icon.appId}
            className="flex flex-col items-center cursor-pointer select-none transition-all"
            style={{
              width: 72,
              marginBottom: 16,
            }}
            onDoubleClick={() => openApp(icon.appId as AppId)}
            onMouseEnter={() => setHovered(icon.appId as AppId)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* 图标 */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all mb-1"
              style={{
                background: isHover
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(56,189,248,0.25))'
                  : 'rgba(255,255,255,0.06)',
                border: isHover
                  ? '1.5px solid rgba(168,85,247,0.6)'
                  : '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: isHover
                  ? '0 4px 20px rgba(168,85,247,0.4), 0 0 30px rgba(168,85,247,0.15)'
                  : '0 2px 8px rgba(0,0,0,0.3)',
                transform: isHover ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
              }}
            >
              {icon.icon}
            </div>
            {/* 标签 */}
            <div
              className="text-center text-[11px] leading-tight px-1 py-0.5 rounded-md"
              style={{
                color: isHover ? '#e2e8f0' : '#cbd5e1',
                background: isHover ? 'rgba(30,41,59,0.85)' : 'transparent',
                fontWeight: isHover ? 600 : 400,
                maxWidth: 72,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {icon.label}
            </div>
          </div>
        )
      })}

      {/* 悬停提示 */}
      {hovered && (
        <div
          className="absolute left-24 top-4 px-3 py-2 rounded-xl text-xs max-w-xs z-50"
          style={{
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(168,85,247,0.4)',
            color: '#e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            minWidth: 180,
          }}
        >
          <div className="font-bold mb-1">{DESKTOP_ICONS.find((i) => i.appId === hovered)?.label}</div>
          <div className="text-slate-400">{DESKTOP_ICONS.find((i) => i.appId === hovered)?.desc}</div>
          <div className="text-[10px] text-slate-600 mt-1">双击打开</div>
        </div>
      )}
    </div>
  )
}

// ============ Desktop 导出 ============
export default function Desktop() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <CosmicBackground />
      <DesktopIcons />
    </div>
  )
}
