import { useState, useEffect, useRef } from 'react'
import { PlanetShell } from '../components/planets/PlanetShell'
import { useLocalStorage, exportAsImage } from '../utils/planetExport'
import { ai } from '../utils/aiService'

interface Thought {
  id: string
  text: string
  x: number
  y: number
  vx: number
  vy: number
  fading: boolean
}

export default function MercuryPage() {
  const [input, setInput] = useState('')
  const [thoughts, setThoughts] = useLocalStorage<Thought[]>('mercury-thoughts', [])
  const [coreThought, setCoreThought] = useLocalStorage<string | null>('mercury-core', null)
  const [aiResult, setAiResult] = useState<{ core: string; groups: { label: string; items: string[] }[]; suggestion: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = () => {
      setThoughts((prev) =>
        (prev || [])
          .map((t) => ({
            ...t,
            x: t.x + t.vx,
            y: t.y + t.vy,
            vx: t.vx * 0.995,
            vy: t.vy * 0.995 + (Math.random() - 0.5) * 0.03,
          }))
          .filter((t) => !t.fading || Math.random() > 0.02)
      )
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const addThought = () => {
    const text = input.trim()
    if (!text) return
    setThoughts((prev) => [
      ...(prev || []),
      {
        id: `${Date.now()}${Math.random()}`,
        text,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        fading: false,
      },
    ])
    setInput('')
  }

  const release = (id: string) => {
    setThoughts((prev) => (prev || []).map((t) => (t.id === id ? { ...t, fading: true } : t)))
    setTimeout(() => {
      setThoughts((prev) => (prev || []).filter((t) => t.id !== id))
    }, 1200)
  }

  const setAsCore = (id: string) => {
    const t = (thoughts || []).find((x) => x.id === id)
    if (t) setCoreThought(t.text)
  }

  const handleExport = () => {
    const items: { text: string; meta: string }[] = []
    if (coreThought) items.push({ text: coreThought, meta: '核心' })
    ;(thoughts || []).forEach((t) => items.push({ text: t.text, meta: '思绪' }))
    if (items.length === 0) items.push({ text: '此刻还没有思绪', meta: '—' })
    exportAsImage(
      '思绪清',
      '让思想自由来去',
      items,
      '#0a0d18',
      '#c0d8ff',
      '#ffd880',
      `mercury-${Date.now()}.png`
    )
  }

  const handleClear = () => {
    if (window.confirm('确定要清空所有思绪和核心吗？这个动作不可恢复。')) {
      setThoughts([])
      setCoreThought(null)
    }
  }

  const btnStyle: React.CSSProperties = {
    padding: '8px 22px',
    borderRadius: 999,
    background: 'rgba(184, 198, 255, 0.12)',
    border: '1px solid rgba(184, 198, 255, 0.35)',
    color: '#c0d8ff',
    fontSize: 12,
    letterSpacing: 4,
    cursor: 'pointer',
    backdropFilter: 'blur(6px)',
  }

  return (
    <PlanetShell
      themeId="mercury"
      title="思绪清"
      subtitle="MERCURIUS · 让思想自由来去"
      description="把脑子里盘旋的想法一一写下来，让它们成为漂浮的字符泡泡，愿意放下的就让它消散，愿意留下的，就把它收为核心。"
      accent={`${(thoughts || []).length} 个念头漂浮中`}
    >
      {/* 顶部操作栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 700,
        margin: '0 auto 20px',
        padding: '0 20px',
      }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: '#c0d8ff', opacity: 0.7 }}>
          思绪 {(thoughts || []).length} · 核心 {coreThought ? 1 : 0}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleExport} style={btnStyle}>导出为图</button>
          <button onClick={async () => {
            if ((thoughts || []).length === 0) return
            setLoading(true)
            try {
              const r = await ai.mercury.distill(thoughts!.map((t: any) => t.text))
              setAiResult(r)
            } finally { setLoading(false) }
          }} disabled={loading || (thoughts || []).length === 0} style={{ ...btnStyle, borderColor: 'rgba(200,180,255,0.4)', color: '#d8c8ff' }}>
            {loading ? '倾听中…' : 'AI 帮我看看'}
          </button>
          <button onClick={handleClear} style={{ ...btnStyle, borderColor: 'rgba(255, 160, 160, 0.35)', color: '#ffb8b8' }}>一键清空</button>
        </div>
      </div>

      {aiResult && (
        <div style={{
          maxWidth: 700,
          margin: '0 auto 24px',
          padding: 28,
          borderRadius: 16,
          background: 'rgba(30,25,55,0.55)',
          border: '1px solid rgba(180,198,255,0.2)',
          backdropFilter: 'blur(6px)',
          position: 'relative',
          animation: 'fadeIn 1s ease forwards',
          opacity: 0,
        }}>
          <button
            onClick={() => setAiResult(null)}
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              background: 'transparent',
              border: 'none',
              color: '#b8c8ff',
              fontSize: 12,
              letterSpacing: 3,
              cursor: 'pointer',
              opacity: 0.6,
            }}
          >
            关闭
          </button>

          <div style={{
            fontSize: 19,
            letterSpacing: 4,
            color: '#e4dcff',
            textShadow: '0 0 20px rgba(184,198,255,0.55)',
            textAlign: 'center',
            lineHeight: 1.9,
            marginBottom: 22,
            fontFamily: 'serif',
          }}>
            {aiResult.core}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            marginBottom: 20,
          }}>
            {aiResult.groups.map((g, i) => (
              <div key={i} style={{
                padding: 14,
                borderRadius: 12,
                background: 'rgba(184,198,255,0.07)',
                border: '1px solid rgba(180,198,255,0.18)',
              }}>
                <div style={{
                  fontSize: 11,
                  letterSpacing: 3,
                  color: '#c8c0ff',
                  opacity: 0.85,
                  marginBottom: 10,
                  fontFamily: 'serif',
                }}>
                  {g.label}
                </div>
                {g.items.map((it, j) => (
                  <div key={j} style={{
                    fontSize: 12,
                    letterSpacing: 3,
                    color: '#c0d0ff',
                    opacity: 0.75,
                    lineHeight: 1.9,
                    fontFamily: 'serif',
                  }}>
                    · {it}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            fontSize: 12,
            letterSpacing: 3,
            color: '#d8ccff',
            textAlign: 'center',
            lineHeight: 2,
            fontFamily: 'serif',
            padding: '12px 10px 2px',
            borderTop: '1px dashed rgba(180,198,255,0.2)',
            opacity: 0.9,
          }}>
            {aiResult.suggestion}
          </div>
        </div>
      )}

      <div ref={containerRef} style={{ position: 'relative', minHeight: 520 }}>
        {(thoughts || []).map((t) => (
          <div
            key={t.id}
            onClick={() => release(t.id)}
            onDoubleClick={() => setAsCore(t.id)}
            style={{
              position: 'fixed',
              left: t.x,
              top: t.y,
              transform: 'translate(-50%, -50%)',
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(184, 198, 255, 0.12)',
              border: '1px solid rgba(184, 198, 255, 0.3)',
              color: '#d0d8ff',
              fontSize: 15,
              letterSpacing: 2,
              cursor: 'pointer',
              opacity: t.fading ? 0 : 0.9,
              transition: 'opacity 1s ease',
              backdropFilter: 'blur(6px)',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 30px rgba(184, 198, 255, 0.15)',
              zIndex: 5,
            }}
          >
            {t.text}
          </div>
        ))}

        {coreThought && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            fontSize: 24,
            letterSpacing: 6,
            color: '#e0e8ff',
            textShadow: '0 0 30px rgba(184,198,255,0.6)',
            opacity: 0,
            animation: 'fadeIn 2s ease forwards',
            lineHeight: 2,
          }}>
            ——
            <br />
            {coreThought}
            <br />
            <span style={{ fontSize: 13, opacity: 0.5, letterSpacing: 3 }}>这是此刻留下的核心</span>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: 12,
          maxWidth: 620,
          margin: '0 auto',
          padding: 24,
          borderRadius: 16,
          background: 'rgba(20, 25, 45, 0.55)',
          border: '1px solid rgba(184, 198, 255, 0.15)',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addThought()}
            placeholder="此刻盘旋的是哪一句话？"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#d0d8ff',
              fontSize: 15,
              letterSpacing: 2,
              padding: '8px 12px',
            }}
          />
          <button
            onClick={addThought}
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              background: 'rgba(184, 198, 255, 0.15)',
              border: '1px solid rgba(184, 198, 255, 0.4)',
              color: '#e0e8ff',
              fontSize: 13,
              cursor: 'pointer',
              letterSpacing: 3,
            }}
          >
            让它飘起来
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.4, marginTop: 18, letterSpacing: 2 }}>
          单击一个泡泡 = 让它消散 · 双击 = 把它收为此刻的核心
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 0.9; transform: translateY(0); } }
      `}</style>
    </PlanetShell>
  )
}
