import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage, exportAsImage, generateSunImage } from '../utils/planetExport'
import { ai } from '../utils/aiService'
import { analyzeDestiny, DestinyAnalysis } from '../lib/astrologyApi'
import { calculateBazi, analyzeFiveElements, FiveElementKey } from '../lib/astrologyEngine'
import { useMingliProfile, elementColors as cacheElementColors, elementEmojis as cacheElementEmojis } from '../lib/mingliCache'

interface Wish {
  id: string
  text: string
  time: string
  angle: number
  radius: number
  color: string
  size: number
  element?: FiveElementKey  // 愿望对应的五行
  zodiac?: string            // 生肖
}

const COLORS = ['#fff0c0', '#ffd880', '#ffb060', '#ffe0a0', '#ffa850', '#ffecb0']

// 太阳专属 3D 贴图背景：日冕粒子 + 辐射光线 + 金色漂浮光斑
function SunBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0, cx = 0, cy = 0
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2
      cy = h / 2
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const render = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)

      // 1. 大背景的金色辐射光晕 - 多层叠加形成 3D 发光
      for (let layer = 0; layer < 3; layer++) {
        const size = Math.min(w, h) * (0.3 + layer * 0.15) + Math.sin(t * 0.01 + layer) * 15
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, size)
        const colors = ['rgba(255, 200, 120, 0.18)', 'rgba(255, 160, 80, 0.08)', 'rgba(255, 120, 40, 0.03)']
        grd.addColorStop(0, colors[layer])
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
      }

      // 2. 日冕辐射光线 - 从中心向外辐射的金色光线
      ctx.save()
      ctx.translate(cx, cy)
      for (let i = 0; i < 32; i++) {
        const angle = (i * 11.25 + t * 0.05) * Math.PI / 180
        const len = Math.min(w, h) * (0.25 + (i % 3) * 0.05) + Math.sin(t * 0.02 + i) * 20
        const alpha = 0.04 + (i % 5) * 0.015

        ctx.save()
        ctx.rotate(angle)
        const rayGrad = ctx.createLinearGradient(0, 0, len, 0)
        rayGrad.addColorStop(0, `rgba(255, 220, 140, ${alpha})`)
        rayGrad.addColorStop(0.3, `rgba(255, 180, 80, ${alpha * 0.6})`)
        rayGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = rayGrad
        ctx.beginPath()
        ctx.moveTo(0, -1)
        ctx.lineTo(len, -0.5)
        ctx.lineTo(len, 0.5)
        ctx.lineTo(0, 1)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()

      // 3. 日冕粒子 - 围绕中心旋转的小光点
      for (let i = 0; i < 100; i++) {
        const baseAngle = i * 3.6 + t * (0.1 + (i % 7) * 0.01)
        const radius = 120 + (i * 17) % 500 + Math.sin(t * 0.01 + i) * 20
        const x = cx + Math.cos(baseAngle * Math.PI / 180) * radius
        const y = cy + Math.sin(baseAngle * Math.PI / 180) * radius * 0.65
        const size = 1 + (i % 4) * 0.6
        const twinkle = 0.3 + 0.7 * Math.sin(t * 0.03 + i * 0.7)
        const fromCenter = radius / Math.min(w, h)
        const alpha = Math.max(0, 1 - fromCenter) * twinkle * 0.6

        const palette = i % 3
        let color = '#ffd880'
        if (palette === 1) color = '#fff0c0'
        if (palette === 2) color = '#ffb060'

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 4. 漂浮的金色光斑 - 大的柔和光斑
      for (let i = 0; i < 6; i++) {
        const x = w * (0.15 + i * 0.14) + Math.sin(t * 0.008 + i * 1.3) * 60
        const y = h * (0.2 + (i % 3) * 0.25) + Math.cos(t * 0.006 + i * 0.9) * 40
        const size = 120 + (i % 3) * 30
        const alpha = 0.08 + (i % 3) * 0.02

        const grd = ctx.createRadialGradient(x, y, 0, x, y, size)
        grd.addColorStop(0, `rgba(255, 220, 140, ${alpha})`)
        grd.addColorStop(0.5, `rgba(255, 180, 80, ${alpha * 0.5})`)
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 5. 能量环 - 中心周围缓慢旋转的同心环
      ctx.save()
      ctx.translate(cx, cy)
      for (let ring = 0; ring < 3; ring++) {
        const r = 250 + ring * 120 + Math.sin(t * 0.008 + ring) * 10
        const rotSpeed = t * 0.0008 * (ring % 2 === 0 ? 1 : -1)
        ctx.save()
        ctx.rotate(rotSpeed)
        ctx.globalAlpha = 0.06 - ring * 0.01
        ctx.strokeStyle = '#ffd880'
        ctx.lineWidth = 1.5
        ctx.setLineDash([3, 30])
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      }
      ctx.restore()

      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
}

export default function SunPage() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [wishes, setWishes] = useLocalStorage<Wish[]>('sun-wishes', [])
  const [breath, setBreath] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<{ refined: string; why: string; deeper: string; mantra: string; element?: FiveElementKey } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedElement, setSelectedElement] = useState<FiveElementKey | null>(null)

  // 使用缓存的命理信息
  const { profile } = useMingliProfile()
  const destiny = profile?.destiny || null

  // 五行颜色映射（使用缓存中的定义）
  const elementColors: Record<FiveElementKey, string> = {
    '金': cacheElementColors['金'],
    '木': cacheElementColors['木'],
    '水': cacheElementColors['水'],
    '火': cacheElementColors['火'],
    '土': cacheElementColors['土']
  }

  // 五行元素图标（使用缓存中的定义）
  const elementEmojis: Record<FiveElementKey, string> = {
    '金': cacheElementEmojis['金'],
    '木': cacheElementEmojis['木'],
    '水': cacheElementEmojis['水'],
    '火': cacheElementEmojis['火'],
    '土': cacheElementEmojis['土']
  }

  // 五行属性描述
  const getElementDescription = (element: FiveElementKey): string => {
    const descriptions: Record<FiveElementKey, string> = {
      '金': '坚韧果断，适合事业目标',
      '木': '生长创造，适合学习成长',
      '水': '流动智慧，适合人际关系',
      '火': '热情能量，适合情感表达',
      '土': '稳定承载，适合基础建设'
    }
    return descriptions[element]
  }

  useEffect(() => {
    let raf: number
    const tick = () => {
      setBreath((b) => b + 0.008)
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  const submit = () => {
    const t = text.trim()
    if (!t) return
    const element = selectedElement || destiny?.element || null
    const newWish: Wish = {
      id: Date.now().toString(),
      text: t,
      time: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      angle: Math.random() * 360,
      radius: 200 + Math.random() * 220,
      color: element ? elementColors[element] : COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 11 + Math.random() * 6,
      element: element,
      zodiac: destiny?.zodiac,
    }
    setWishes((prev) => [...(prev || []), newWish])
    setText('')
    setShowResult(true)
    setTimeout(() => setShowResult(false), 5000)
  }

  const deleteWish = (id: string) => {
    if (window.confirm('确定要让这个愿望悄悄归还给时光吗？')) {
      setWishes((prev) => (prev || []).filter((w) => w.id !== id))
    }
  }

  const handleExport = () => {
    const items = (wishes || []).slice(0, 7).map((w) => ({ text: w.text, meta: w.time }))
    if (items.length === 0) items.push({ text: '还没有许过的愿望', meta: '—' })
    exportAsImage(
      '核心之光 · 你最深的愿望',
      '愿你被温柔地对待',
      items,
      '#1a0a04',
      '#ffe0a0',
      '#ffb860',
      `sun-${Date.now()}.png`
    )
  }

  const btnExport: React.CSSProperties = {
    padding: '8px 22px', borderRadius: 999,
    background: 'rgba(255, 216, 128, 0.15)',
    border: '1px solid rgba(255, 216, 128, 0.35)',
    color: '#ffd880', fontSize: 12, letterSpacing: 4, cursor: 'pointer',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #2a1a0c 0%, #150806 60%, #080404 100%)',
      color: '#ffe0a0',
      fontFamily: 'ui-serif, Georgia, "Songti SC", serif',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <SunBackground />
      <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
        <button onClick={() => navigate('/')} style={{
          background: 'transparent',
          border: '1px solid rgba(255, 216, 128, 0.3)',
          color: '#ffd880',
          padding: '10px 20px',
          borderRadius: 999,
          fontSize: 13,
          letterSpacing: 2,
          cursor: 'pointer',
        }}>← 星图</button>
        <div style={{ fontSize: 13, letterSpacing: 4, opacity: 0.6 }}>SOL · 太阳</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 13, letterSpacing: 2, opacity: 0.55 }}>{(wishes || []).length} 个愿望</div>
          <button onClick={handleExport} style={btnExport}>导出</button>
        </div>
      </div>

      {/* 命理信息显示（从缓存读取） */}
      {destiny ? (
        <div style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 20px',
            background: 'rgba(40, 25, 10, 0.8)',
            borderRadius: 999,
            border: '1px solid rgba(255, 216, 128, 0.3)',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: elementColors[destiny.element],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              boxShadow: `0 0 10px ${elementColors[destiny.element]}88`,
            }}>
              {elementEmojis[destiny.element]}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#ffe8a0', letterSpacing: 1 }}>
              {destiny.zodiac}生肖 · {destiny.element}行
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/observatory')}
          style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 24px',
            background: 'rgba(40, 25, 10, 0.8)',
            borderRadius: 999,
            border: '1px solid rgba(255, 180, 80, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 0 20px rgba(255, 180, 80, 0.15)',
          }}
        >
          <span style={{ fontSize: 18 }}>🔮</span>
          <span style={{ fontSize: 12, color: '#ffc880', letterSpacing: 2 }}>
            去观测站输入生辰，解锁命理指引 →
          </span>
        </button>
      )}

      <div style={{ textAlign: 'center', padding: '100px 40px 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: 48, letterSpacing: 16, color: '#ffe8a0', textShadow: '0 0 50px rgba(255, 180, 80, 0.4)' }}>核心之光</div>
        <div style={{ fontSize: 13, letterSpacing: 4, opacity: 0.55, marginTop: 16, maxWidth: 500, margin: '16px auto 0', lineHeight: 2 }}>
          闭上眼睛，缓慢呼吸。写下一个愿望 —— 不是对世界的，而是给自己的。
          <br />让它化为一颗星，永远绕着你转。
        </div>
      </div>

      <div style={{
        position: 'relative',
        height: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
        <div style={{
          width: 180 + Math.sin(breath) * 10,
          height: 180 + Math.sin(breath) * 10,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, #fff8e0, #ffd880 30%, #ffa040 60%, #ff6020 100%)',
          boxShadow: `0 0 ${80 + Math.sin(breath) * 20}px rgba(255, 180, 80, 0.55), 0 0 ${160 + Math.sin(breath) * 30}px rgba(255, 120, 40, 0.25)`,
          animation: 'none',
          filter: 'blur(0.5px)',
        }} />
        <div style={{
          position: 'absolute',
          width: 400 + Math.sin(breath) * 20,
          height: 400 + Math.sin(breath) * 20,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 200, 120, 0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {(wishes || []).map((w, i) => {
          const a = (w.angle + breath * 8 + i * 5) * Math.PI / 180
          const x = Math.cos(a) * w.radius
          const y = Math.sin(a) * w.radius * 0.55
          const dist = Math.sqrt(x * x + y * y)
          const opacity = Math.max(0.3, 1 - dist / 800)
          const isHover = hoverId === w.id
          return (
            <div
              key={w.id}
              onMouseEnter={() => setHoverId(w.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                opacity: isHover ? 1 : opacity,
                transition: 'opacity 0.4s',
                zIndex: isHover ? 15 : 5,
              }}
            >
              {/* 星星外层流光特效 */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* 五行流光光环 */}
                {w.element && (
                  <>
                    <div
                      className="star-glow-ring"
                      style={{
                        position: 'absolute',
                        width: (w.size + 8) * 3,
                        height: (w.size + 8) * 3,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${elementColors[w.element]}44 0%, ${elementColors[w.element]}11 50%, transparent 70%)`,
                        animation: 'ringPulse 3s ease-in-out infinite',
                        opacity: 0.6,
                      }}
                    />
                    <div
                      className="star-glow-ring"
                      style={{
                        position: 'absolute',
                        width: (w.size + 4) * 4,
                        height: (w.size + 4) * 4,
                        borderRadius: '50%',
                        border: `2px solid ${elementColors[w.element]}66`,
                        animation: 'ringPulse 4s ease-in-out infinite 0.5s',
                        opacity: 0.4,
                      }}
                    />
                  </>
                )}
                
                {/* 星星主体 */}
                <div style={{
                  width: isHover ? (w.size + 4) * 2 : w.size * 2,
                  height: isHover ? (w.size + 4) * 2 : w.size * 2,
                  borderRadius: '50%',
                  background: w.element ? elementColors[w.element] : w.color,
                  boxShadow: w.element
                    ? `0 0 ${isHover ? w.size * 6 : w.size * 4}px ${elementColors[w.element]}cc, 0 0 ${isHover ? w.size * 10 : w.size * 6}px ${elementColors[w.element]}66`
                    : `0 0 ${isHover ? w.size * 5 : w.size * 3}px ${w.color}`,
                  margin: '0 auto',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
                  onClick={() => deleteWish(w.id)}
                >
                  {/* 星星中心图标 */}
                  {w.element && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: w.size * 0.8,
                    }}>
                      {elementEmojis[w.element]}
                    </div>
                  )}
                </div>
              </div>
              {isHover && (
                <div style={{
                  marginTop: 10,
                  padding: '10px 16px',
                  background: 'rgba(40, 20, 8, 0.85)',
                  border: '1px solid rgba(255, 200, 120, 0.3)',
                  borderRadius: 12,
                  animation: 'fadeIn 0.3s ease',
                  boxShadow: '0 0 20px rgba(255, 180, 80, 0.2)',
                }}>
                  <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.9, color: w.color, maxWidth: 220, lineHeight: 2, marginBottom: 6 }}>
                    {w.text}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.45, letterSpacing: 2, marginBottom: 8 }}>{w.time}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteWish(w.id) }}
                    style={{
                      fontSize: 11, padding: '5px 14px', borderRadius: 999,
                      background: 'rgba(255, 160, 100, 0.15)',
                      border: '1px solid rgba(255, 160, 100, 0.35)',
                      color: '#ffb890', cursor: 'pointer', letterSpacing: 2,
                    }}
                  >让它归还给时光</button>
                </div>
              )}
              {!isHover && (
                <>
                  <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, marginTop: 8, color: w.color, maxWidth: 220 }}>
                    {w.text}
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.35, marginTop: 4, letterSpacing: 1.5 }}>
                    {w.time}
                  </div>
                </>
              )}
            </div>
          )
        })}

        {showResult && (
          <div style={{
            position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)',
            fontSize: 13, letterSpacing: 4, color: '#fff0c0',
            animation: 'fadeInOut 5s ease',
            textShadow: '0 0 20px rgba(255, 200, 120, 0.6)',
          }}>
            它已化为一颗星，环绕着你 ·
          </div>
        )}
      </div>

      <div style={{ maxWidth: 560, margin: '60px auto 0', padding: '0 40px 100px', position: 'relative', zIndex: 10 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder="此刻，你最深的愿望是……"
          rows={3}
          style={{
            width: '100%',
            padding: 20,
            borderRadius: 16,
            background: 'rgba(40, 25, 10, 0.6)',
            border: '1px solid rgba(255, 216, 128, 0.25)',
            color: '#ffe8a0',
            fontSize: 16,
            letterSpacing: 3,
            lineHeight: 2,
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
        {/* 五行选择器 */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#ffd8a0', opacity: 0.6, letterSpacing: 2 }}>选择五行属性：</div>
          {(['金', '木', '水', '火', '土'] as FiveElementKey[]).map((el) => (
            <button
              key={el}
              onClick={() => setSelectedElement(selectedElement === el ? null : el)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: selectedElement === el ? elementColors[el] : 'rgba(40, 25, 10, 0.6)',
                border: selectedElement === el 
                  ? `1px solid ${elementColors[el]}` 
                  : '1px solid rgba(255, 216, 128, 0.25)',
                color: selectedElement === el ? '#000' : elementColors[el],
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: selectedElement === el ? `0 0 15px ${elementColors[el]}66` : 'none',
              }}
              title={`${el}行 - ${getElementDescription(el)}`}
            >
              {elementEmojis[el]}
            </button>
          ))}
          {destiny && (
            <div style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(40, 25, 10, 0.6)', border: '1px solid rgba(255, 216, 128, 0.25)' }}>
              <span style={{ fontSize: 11, color: '#ffd8a0', opacity: 0.7, letterSpacing: 1 }}>命定: {elementEmojis[destiny.element]}</span>
            </div>
          )}
        </div>
        <button onClick={submit} style={{
          width: '100%',
          marginTop: 16,
          padding: '16px 0',
          borderRadius: 999,
          background: 'linear-gradient(135deg, rgba(255, 216, 128, 0.3), rgba(255, 160, 80, 0.15))',
          border: '1px solid rgba(255, 216, 128, 0.4)',
          color: '#ffe8a0',
          fontSize: 14,
          letterSpacing: 6,
          cursor: 'pointer',
          transition: 'all 0.3s',
          boxShadow: '0 4px 30px rgba(255, 180, 80, 0.15)',
        }}>
          让它成为星 ·
        </button>
        <button onClick={async () => {
          if (!text.trim() && (wishes || []).length === 0) return
          setAiLoading(true)
          try {
            const src = text.trim() || (wishes!.slice(-3).map((w: any) => w.text).join(' '))
            const r = await ai.sun.refine(src)
            // 结合命理信息增强分析
            if (destiny) {
              r.element = destiny.element as FiveElementKey
            }
            setAiResult(r as any)
          } finally { setAiLoading(false) }
        }} disabled={aiLoading} style={{
          width: '100%', marginTop: 12, padding: '14px 0', borderRadius: 999,
          background: 'rgba(255,220,160,0.18)',
          border: '1px solid rgba(255,216,128,0.4)',
          color: '#ffe8a0', fontSize: 13, letterSpacing: 5, cursor: 'pointer',
        }}>{aiLoading ? '倾听中…' : 'AI · 让愿望更清晰'}</button>
        {aiResult && (
          <div style={{ maxWidth: 560, margin: '20px auto 0', padding: 24, borderRadius: 16, background: 'rgba(55,35,15,0.55)', border: '1px solid rgba(255,216,154,0.25)', position: 'relative' }}>
            <button onClick={() => setAiResult(null)} style={{
              position: 'absolute', top: 12, right: 12, background: 'transparent', border: '1px solid rgba(255,216,154,0.3)',
              color: '#ffd8a0', cursor: 'pointer', borderRadius: 999, padding: '4px 12px', fontSize: 11, letterSpacing: 2,
            }}>关闭</button>
            {/* 命理元素标签 */}
            {aiResult.element && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <div style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  background: `${elementColors[aiResult.element]}22`,
                  border: `1px solid ${elementColors[aiResult.element]}66`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>{elementEmojis[aiResult.element]}</span>
                  <span style={{ fontSize: 12, color: elementColors[aiResult.element], letterSpacing: 2 }}>
                    {aiResult.element}行命理指引
                  </span>
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center', fontSize: 12, color: '#ffd8a0', letterSpacing: 4, marginBottom: 18, opacity: 0.7 }}>· AI 听到的愿望 ·</div>
            <div style={{ textAlign: 'center', fontSize: 17, color: '#ffe8a0', lineHeight: 2.2, letterSpacing: 3, padding: '12px 8px', marginBottom: 14, background: 'rgba(255,216,128,0.08)', borderRadius: 10, border: '1px solid rgba(255,216,128,0.18)' }}>
              {aiResult.refined}
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,216,128,0.05)', border: '1px solid rgba(255,216,128,0.12)', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#ffb870', letterSpacing: 3, marginBottom: 8, opacity: 0.7 }}>为什么这样说</div>
              <div style={{ fontSize: 13, color: '#ffe8ba', lineHeight: 2.1, letterSpacing: 2 }}>{aiResult.why}</div>
            </div>
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,180,100,0.08)', border: '1px solid rgba(255,180,100,0.18)', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#ffb870', letterSpacing: 3, marginBottom: 8, opacity: 0.7 }}>更深的含义</div>
              <div style={{ fontSize: 13, color: '#ffe8ba', lineHeight: 2.1, letterSpacing: 2 }}>{aiResult.deeper}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '14px 16px', borderRadius: 10, background: 'rgba(255,216,128,0.12)', border: '1px solid rgba(255,216,128,0.25)' }}>
              <div style={{ fontSize: 11, color: '#ffd8a0', letterSpacing: 3, marginBottom: 8, opacity: 0.55 }}>真言</div>
              <div style={{ fontSize: 15, color: '#ffe8a0', lineHeight: 2, letterSpacing: 3 }}>{aiResult.mantra}</div>
            </div>
            {/* 命理建议 */}
            {destiny && (
              <div style={{
                marginTop: 16,
                padding: '14px 16px',
                borderRadius: 10,
                background: 'rgba(200,200,216,0.08)',
                border: '1px solid rgba(200,200,216,0.2)',
              }}>
                <div style={{ fontSize: 11, color: '#c8c8d8', letterSpacing: 3, marginBottom: 8, opacity: 0.8, textAlign: 'center' }}>
                  💫 基于{destiny.zodiac}生肖·{destiny.element}行的建议
                </div>
                <div style={{ fontSize: 12, color: '#e8e8f8', lineHeight: 1.8, letterSpacing: 1 }}>
                  {destiny.element === '金' && '金代表收敛与坚韧。你的愿望需要以果断行动来实现，秋季是愿望实现的关键时期。'}
                  {destiny.element === '木' && '木代表生长与创造。你的愿望需要耐心培育，如同种子慢慢发芽，春季会迎来突破。'}
                  {destiny.element === '水' && '水代表流动与智慧。你的愿望需要顺其自然，水到渠成，冬季是沉淀与准备的时节。'}
                  {destiny.element === '火' && '火代表热情与能量。你的愿望需要燃烧的热情来驱动，夏季是能量最强的时节。'}
                  {destiny.element === '土' && '土代表稳定与滋养。你的愿望需要坚实的基础，长夏（夏秋之交）是收获的时节。'}
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button onClick={() => generateSunImage(aiResult!)} style={{
                padding: '12px 32px', borderRadius: 999,
                background: 'rgba(255,216,128,0.2)',
                border: '1px solid rgba(255,216,128,0.5)',
                color: '#ffe8a0', fontSize: 12, letterSpacing: 5, cursor: 'pointer',
              }}>✨ 生成分享图</button>
            </div>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 30, fontSize: 11, opacity: 0.35, letterSpacing: 3 }}>
          Enter 提交 · 悬停在星上可查看并归还给时光
        </div>
      </div>

      <style>{`
        @keyframes fadeInOut { 0% { opacity: 0; transform: translateX(-50%) translateY(10px); } 20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ringPulse { 0%, 100% { transform: scale(0.8); opacity: 0.6; } 50% { transform: scale(1.2); opacity: 0.3; } }
        .star-glow-ring { pointer-events: none; }
      `}</style>
    </div>
  )
}
