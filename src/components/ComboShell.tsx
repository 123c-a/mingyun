import { ReactNode, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComboConfig, planetNames } from '../data/comboConfigs'
import ComboRelationsPanel from './ComboRelationsPanel'
import StarWanderWidget from './StarWanderWidget'

export function ComboShell({
  config,
  children,
  accent,
  showRelations = true,
}: {
  config: ComboConfig
  children: ReactNode
  accent?: ReactNode
  showRelations?: boolean
}) {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
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

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: i % 2 === 0 ? config.primaryColor : config.secondaryColor,
      })
    }

    let t = 0
    const render = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)

      const cx = w / 2, cy = h / 2
      for (let i = 0; i < 3; i++) {
        const r = Math.min(w, h) * (0.25 + i * 0.12) + Math.sin(t * 0.5 + i) * 20
        const grd = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r)
        grd.addColorStop(0, 'transparent')
        grd.addColorStop(0.7, config.glowColor)
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        const flicker = Math.sin(t * 3 + p.x * 0.01) * 0.15 + 0.85
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.floor(p.alpha * flicker * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [config])

  const levelStars = '⭐'.repeat(config.level)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'auto',
      background: config.bgGradient,
      color: config.accentText,
      fontFamily: 'ui-serif, Georgia, "Songti SC", "Noto Serif CJK SC", serif',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        padding: '24px 40px',
        backdropFilter: 'blur(10px)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: `1px solid ${config.primaryColor}44`,
            color: config.accentText,
            padding: '10px 18px',
            borderRadius: 999,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.25s',
            opacity: 0.75,
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '0.75')}
        >
          ← 星图
        </button>

        <div style={{ marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 14, opacity: 0.75, letterSpacing: 4 }}>
            {config.planets.map(p => planetNames[p]).join(' × ')}
          </span>
          <span style={{ fontSize: 11, opacity: 0.45, letterSpacing: 2, marginTop: 2 }}>
            {config.subtitle}
          </span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>
            {levelStars} {config.level}星联动
          </span>
          {accent && <div style={{ fontSize: 13, opacity: 0.65 }}>{accent}</div>}
        </div>
      </div>

      <div style={{ padding: '8vh 60px 4vh', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: 64,
          fontWeight: 300,
          letterSpacing: 12,
          color: config.primaryColor,
          textShadow: `0 0 40px ${config.glowColor}`,
        }}>
          {config.name}
        </div>
        <div style={{ fontSize: 15, opacity: 0.55, marginTop: 16, letterSpacing: 3, maxWidth: 600, margin: '16px auto 0' }}>
          {config.description}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginTop: 30,
        }}>
          {config.planets.map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${planetNames[p] ? '' : ''}${config.planets.indexOf(p) === 0 ? config.primaryColor : config.secondaryColor}, transparent 70%)`,
                boxShadow: `0 0 20px ${config.glowColor}`,
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}>
                {planetNames[p]?.charAt(0)}
              </div>
              <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: 2 }}>{planetNames[p]}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '20px 60px 80px', maxWidth: 1200, margin: '0 auto' }}>
        {children}

        {showRelations && (
          <>
            <StarWanderWidget
              currentComboId={config.id}
              primaryColor={config.primaryColor}
              secondaryColor={config.secondaryColor}
              accentText={config.accentText}
              glowColor={config.glowColor}
            />
            <ComboRelationsPanel
              comboId={config.id}
              primaryColor={config.primaryColor}
              secondaryColor={config.secondaryColor}
              accentText={config.accentText}
              glowColor={config.glowColor}
            />
          </>
        )}
      </div>
    </div>
  )
}
