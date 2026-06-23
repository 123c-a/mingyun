import { useState, useRef } from 'react'
import { PlanetShell } from '../components/planets/PlanetShell'
import { useLocalStorage, exportAsImage } from '../utils/planetExport'
import { ai } from '../utils/aiService'

const bgColor = '#1a0a08'
const fgColor = '#f5c8a0'
const accentColor = '#ff9860'

type FlameState = 'burning' | 'flowing' | 'rising' | 'settled'

interface Flame {
  id: string
  text: string
  state: FlameState
  hue: number
  createdAt: number
}

export default function MarsPage() {
  const [input, setInput] = useState('')
  const [flames, setFlames] = useLocalStorage<Flame[]>('mars-emotions', [])
  const [dragPos, setDragPos] = useState(0)
  const [selected, setSelected] = useState<Flame | null>(null)
  const [aiResult, setAiResult] = useState<{ emotion: string; intensity: number; analysis: string; steps: string[]; mantra: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const draggingRef = useRef(false)

  const addFlame = () => {
    const text = input.trim()
    if (!text) return
    setFlames((prev) => [...prev, {
      id: `${Date.now()}`,
      text,
      state: 'burning',
      hue: 10,
      createdAt: Date.now(),
    }])
    setInput('')
  }

  const startDrag = () => { draggingRef.current = true; setDragPos(0) }
  const onDrag = (e: React.MouseEvent) => {
    if (!draggingRef.current) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setDragPos(p)
    const idx = Math.floor(p * 4)
    const map: FlameState[] = ['burning', 'flowing', 'rising', 'settled']
    const hue = 10 + idx * 40
    setFlames((prev) => prev.map((f, i) => i === prev.length - 1 ? { ...f, state: map[idx], hue } : f))
  }
  const endDrag = () => { draggingRef.current = false }

  const handleDelete = (id: string) => {
    if (window.confirm('确认要让这团火消失吗？')) {
      setFlames((prev) => prev.filter((f) => f.id !== id))
      setSelected(null)
    }
  }

  const handleExport = () => {
    exportAsImage(
      '心火炼',
      'MARS · 把强烈化为能量',
      flames.map((f) => ({
        text: f.text,
        meta: stateLabel(f.state),
      })),
      bgColor, fgColor, accentColor, `mars-${Date.now()}.png`
    )
  }

  return (
    <PlanetShell themeId="mars" title="心火炼" subtitle="MARS · 把强烈化为能量" description="当你心里有一团火——愤怒、不甘、热情、冲动——把它写下来，然后引导它，看看它会变成什么。"
      accent={
        <button onClick={handleExport} style={{
          padding: '10px 20px',
          borderRadius: 999,
          background: `${accentColor}20`,
          border: `1px solid ${accentColor}60`,
          color: fgColor,
          fontSize: 12,
          letterSpacing: 4,
          cursor: 'pointer',
        }}>导出为图片</button>
      }
    >
      {/* AI 情绪转化按钮 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button onClick={async () => {
          const all = (flames || []).map((f) => f.text).join(' ')
          if (!all) return
          setLoading(true)
          try {
            const r = await ai.mars.transform(all)
            setAiResult(r)
          } finally { setLoading(false) }
        }} disabled={loading || (flames || []).length === 0} style={{ ...btnOrange, background: 'rgba(255,160,80,0.2)', borderColor: 'rgba(255,160,80,0.5)' }}>
          {loading ? '感受中…' : `AI · 感受这团火（${(flames || []).length}）`}
        </button>
      </div>

      {/* AI 情绪转化结果 */}
      {aiResult && (
        <div style={{
          background: 'rgba(50,20,12,0.6)',
          border: '1px solid rgba(255,160,80,0.25)',
          borderRadius: 16,
          maxWidth: 600,
          margin: '0 auto 30px',
          padding: 24,
          color: '#ffb880',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, letterSpacing: 3, opacity: 0.8 }}>火的回声</div>
            <button onClick={() => setAiResult(null)} style={{
              background: 'transparent',
              border: '1px solid rgba(255,160,80,0.4)',
              color: '#ffb880',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 11,
              letterSpacing: 2,
              cursor: 'pointer',
            }}>关闭</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(255,160,80,0.15)' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.55, marginBottom: 4 }}>情绪</div>
              <div style={{ fontSize: 16, letterSpacing: 2 }}>{aiResult.emotion}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.55, marginBottom: 4 }}>强度</div>
              <div style={{ fontSize: 20, letterSpacing: 2 }}>{aiResult.intensity}<span style={{ fontSize: 12, opacity: 0.5 }}> / 10</span></div>
            </div>
          </div>

          <div style={{ fontSize: 13, lineHeight: 2, marginBottom: 20, opacity: 0.9, letterSpacing: 1 }}>
            {aiResult.analysis}
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.6, marginBottom: 12 }}>三步 · 引导</div>
            {aiResult.steps.map((s, i) => (
              <div key={i} style={{ fontSize: 13, lineHeight: 2, marginBottom: 8, letterSpacing: 1, opacity: 0.92 }}>
                <span style={{ marginRight: 8 }}>{['①', '②', '③'][i]}</span>
                {s}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '20px 10px 4px', borderTop: '1px solid rgba(255,160,80,0.15)' }}>
            <div style={{ fontSize: 18, letterSpacing: 4, color: '#ffb880', textShadow: '0 0 10px rgba(255,184,128,0.6), 0 0 22px rgba(255,160,80,0.35), 0 0 2px rgba(255,220,160,0.8)' }}>
              {aiResult.mantra}
            </div>
          </div>
        </div>
      )}

      {/* 火焰展示区 - 时间轴 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 30 }}>
        {flames.map((f, i) => (
          <div key={f.id} onClick={() => setSelected(f)} style={{
            position: 'relative',
            width: 160, height: 160,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
            color: fgColor,
            letterSpacing: 2,
            textAlign: 'center',
            padding: 20,
            cursor: 'pointer',
            animation: f.state === 'settled' ? 'none' : `flameIn 0.8s ease ${i * 0.15}s backwards, flicker 2s ease-in-out ${i * 0.15 + 0.8}s infinite`,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(circle, hsla(${f.hue}, 80%, 60%, 0.4), transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(10px)',
            }} />
            <div style={{
              position: 'absolute', inset: 20,
              background: `hsla(${f.hue}, 70%, 50%, 0.25)`,
              borderRadius: '50%',
              border: `1px solid hsla(${f.hue}, 70%, 60%, 0.4)`,
            }} />
            <div style={{ position: 'relative', zIndex: 2, fontSize: 13, opacity: 0.85, lineHeight: 2 }}>
              {stateLabel(f.state)}
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 6, letterSpacing: 1 }}>"{f.text.slice(0, 16)}"</div>
            </div>
          </div>
        ))}
      </div>

      {/* 选中详情模态 */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: `${bgColor}ee`,
            padding: 60,
            borderRadius: 16,
            border: `1px solid ${accentColor}40`,
            maxWidth: 500,
            textAlign: 'center',
            color: fgColor,
          }}>
            <div style={{ fontSize: 32, marginBottom: 20 }}>{stateLabel(selected.state)}</div>
            <div style={{ fontSize: 16, letterSpacing: 3, lineHeight: 2.2, marginBottom: 30 }}>"{selected.text}"</div>
            <div style={{ fontSize: 12, opacity: 0.5, letterSpacing: 2, marginBottom: 30 }}>
              {new Date(selected.createdAt).toLocaleString('zh-CN')}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setSelected(null)} style={btnOrange}>关闭</button>
              <button onClick={() => handleDelete(selected.id)} style={{ ...btnOrange, background: `${accentColor}10`, borderColor: `${accentColor}40` }}>让它消失</button>
            </div>
          </div>
        </div>
      )}

      {/* 输入 */}
      <div style={{ display: 'flex', gap: 12, maxWidth: 620, margin: '0 auto 20px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addFlame()}
          placeholder="此刻心里最烈的那一团是……"
          style={{
            flex: 1, padding: '14px 20px',
            background: `${accentColor}10`,
            border: `1px solid ${accentColor}30`,
            color: fgColor, fontSize: 14, letterSpacing: 2,
            borderRadius: 12, outline: 'none',
          }}
        />
        <button onClick={addFlame} style={btnOrange}>点燃它</button>
      </div>

      {/* 引导条 */}
      <div style={{ maxWidth: 620, margin: '0 auto 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, opacity: 0.5, letterSpacing: 3, marginBottom: 10 }}>从左到右，拖动这团火 — 让它变形</div>
        <div
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          style={{
            position: 'relative',
            height: 40,
            background: 'linear-gradient(90deg, rgba(255,80,60,0.3), rgba(255,200,120,0.3), rgba(200,255,200,0.25), rgba(200,220,255,0.3))',
            border: `1px solid ${accentColor}30`,
            borderRadius: 999,
            cursor: 'grab',
          }}
        >
          <div style={{
            position: 'absolute', top: -4, left: `${dragPos * 100}%`,
            width: 48, height: 48,
            background: 'radial-gradient(circle, rgba(255, 180, 120, 0.8), transparent 70%)',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            transition: 'none',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginTop: 12, fontSize: 11, opacity: 0.45, letterSpacing: 2, color: fgColor }}>
            <span>燃烧</span><span>流动</span><span>上升</span><span>安顿</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.35, marginTop: 30, letterSpacing: 3, color: fgColor }}>
        没有被允许的愤怒，最终也会成为没有被允许的爱。
      </div>

      <style>{`
        @keyframes flicker { 0%,100% { opacity: 0.9; } 50% { opacity: 0.6; } }
        @keyframes flameIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </PlanetShell>
  )
}

function stateLabel(s: FlameState) {
  return { burning: '🔥 燃烧', flowing: '💧 流动', rising: '🕊 上升', settled: '🪵 安顿' }[s]
}

const btnOrange: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: 999,
  background: `${accentColor}30`,
  border: `1px solid ${accentColor}60`,
  color: fgColor,
  fontSize: 13,
  letterSpacing: 4,
  cursor: 'pointer',
}
