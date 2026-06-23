import { useState } from 'react'
import { PlanetShell } from '../components/planets/PlanetShell'
import { useLocalStorage, exportAsImage } from '../utils/planetExport'
import { ai } from '../utils/aiService'

const bgColor = '#081018'
const fgColor = '#b8d8e8'
const accentColor = '#70b8d8'

interface Shell {
  id: string
  text: string
  method: 'peel' | 'break' | 'crack'
  createdAt: number
}

const methodNames = {
  peel: { name: '温柔剥掉', emoji: '🌱', hint: '慢慢来，一层一层' },
  break: { name: '直接粉碎', emoji: '💥', hint: '这次我愿意让它彻底消失' },
  crack: { name: '让它自己裂开', emoji: '🥚', hint: '给它一点时间，让它从内部改变' },
}

export default function UranusPage() {
  const [input, setInput] = useState('')
  const [method, setMethod] = useState<'peel' | 'break' | 'crack'>('peel')
  const [shells, setShells] = useLocalStorage<Shell[]>('uranus-shells', [])
  const [opening, setOpening] = useState<Shell | null>(null)
  const [selected, setSelected] = useState<Shell | null>(null)
  const [aiResult, setAiResult] = useState<{ pattern: string; why: string; suggestions: string[]; mantra: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const addShell = () => {
    if (!input.trim()) return
    const s: Shell = { id: `${Date.now()}`, text: input.trim(), method, createdAt: Date.now() }
    setOpening(s)
    setShells((prev) => [...prev, s])
    setInput('')
    const duration = method === 'peel' ? 1200 : method === 'break' ? 400 : 2000
    setTimeout(() => setOpening(null), Math.max(duration, 2000))
  }

  const handleDelete = (id: string) => {
    if (window.confirm('确认要删除这个壳吗？')) {
      setShells((prev) => prev.filter((s) => s.id !== id))
      setSelected(null)
    }
  }

  const handleExport = () => {
    exportAsImage(
      '脱壳门',
      'URANUS · 打破惯性的自由练习',
      shells.map((s) => ({
        text: s.text,
        meta: `${methodNames[s.method].emoji} ${methodNames[s.method].name}`,
      })),
      bgColor, fgColor, accentColor, `uranus-${Date.now()}.png`
    )
  }

  const getOpeningAnimation = (m: 'peel' | 'break' | 'crack') => {
    if (m === 'peel') return { animation: 'peelOut 1.2s ease forwards' }
    if (m === 'break') return { animation: 'breakOut 0.4s ease forwards' }
    return { animation: 'crackOut 2s ease forwards' }
  }

  return (
    <PlanetShell themeId="uranus" title="脱壳门" subtitle="URANUS · 打破惯性的自由练习" description="每个人都有一些'壳'——曾经保护过我们、但现在限制着我们的东西。让我们来练习：如何温柔地，从壳里走出来。"
      accent={
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
          <button onClick={async () => {
            const combined = [input.trim(), ...shells.map((s) => s.text)].filter(Boolean)
            if (combined.length === 0) return
            setLoading(true)
            try {
              const r = await ai.uranus.break(combined)
              setAiResult(r)
            } finally { setLoading(false) }
          }} disabled={loading} style={{
            padding: '10px 20px',
            borderRadius: 999,
            background: `${accentColor}25`,
            border: `1px solid ${accentColor}80`,
            color: accentColor,
            fontSize: 12,
            letterSpacing: 4,
            cursor: 'pointer',
          }}>{loading ? '倾听中…' : 'AI · 这个壳在说什么'}</button>
        </div>
      }
    >
      {/* 正在脱出的动画 */}
      {opening && (
        <div style={{
          textAlign: 'center', marginBottom: 40, padding: 60,
          fontSize: 36, letterSpacing: 8,
          color: fgColor,
          ...getOpeningAnimation(opening.method),
        }}>
          {methodNames[opening.method].emoji} {methodNames[opening.method].name}
          <div style={{ fontSize: 14, opacity: 0.6, marginTop: 20, letterSpacing: 3, lineHeight: 2 }}>
            "{opening.text}"
            <br />
            ——我愿意让自己自由。
          </div>
        </div>
      )}

      {/* 输入 */}
      <div style={{ maxWidth: 620, margin: '0 auto 40px', padding: 24, borderRadius: 16, background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="这是一个什么样的壳？\n例如：'总是要让所有人都满意'\n或者：'一直不敢承认自己其实讨厌这份工作'"
          rows={3}
          style={{
            width: '100%', padding: 16,
            background: `${bgColor}aa`,
            border: `1px solid ${accentColor}30`,
            color: fgColor, fontSize: 14, letterSpacing: 2,
            borderRadius: 10, outline: 'none', resize: 'none',
            fontFamily: 'inherit', lineHeight: 2,
            boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: 12, opacity: 0.55, marginTop: 20, marginBottom: 12, letterSpacing: 2, textAlign: 'center', color: fgColor }}>
          这次，你想怎么把它打开？
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {(Object.keys(methodNames) as Array<keyof typeof methodNames>).map((m) => (
            <button key={m} onClick={() => setMethod(m as 'peel' | 'break' | 'crack')}
              style={{
                padding: 16, borderRadius: 12, cursor: 'pointer',
                background: method === m ? `${accentColor}25` : `${accentColor}08`,
                border: `1px solid ${accentColor}${method === m ? '55' : '20'}`,
                color: fgColor, fontSize: 13, letterSpacing: 2,
                textAlign: 'center', lineHeight: 1.7,
              }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{methodNames[m].emoji}</div>
              <div>{methodNames[m].name}</div>
              <div style={{ fontSize: 10, opacity: 0.55, marginTop: 4, letterSpacing: 1 }}>{methodNames[m].hint}</div>
            </button>
          ))}
        </div>
        <button onClick={addShell} style={{ ...btnMint, width: '100%' }}>让这扇门打开</button>
      </div>

      {aiResult && (
        <div style={{ maxWidth: 620, margin: '0 auto 40px', padding: 28, borderRadius: 16, background: 'rgba(12,30,45,0.6)', border: `1px solid ${accentColor}35`, position: 'relative' }}>
          <button onClick={() => setAiResult(null)} style={{
            position: 'absolute', top: 12, right: 12, background: 'transparent', border: `1px solid ${accentColor}30`,
            color: accentColor, cursor: 'pointer', borderRadius: 999, padding: '4px 12px', fontSize: 11, letterSpacing: 2,
          }}>关闭</button>
          <div style={{ textAlign: 'center', fontSize: 12, color: accentColor, letterSpacing: 4, marginBottom: 18, opacity: 0.7 }}>· AI 看到的壳 ·</div>
          <div style={{ textAlign: 'center', fontSize: 22, color: accentColor, letterSpacing: 6, marginBottom: 18, fontWeight: 300 }}>{aiResult.pattern}</div>
          <div style={{ padding: '14px 18px', borderRadius: 10, background: `${accentColor}08`, border: `1px solid ${accentColor}20`, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: accentColor, letterSpacing: 3, marginBottom: 8, opacity: 0.6 }}>它在说什么</div>
            <div style={{ fontSize: 13, color: fgColor, lineHeight: 2.2, letterSpacing: 2 }}>{aiResult.why}</div>
          </div>
          <div style={{ padding: '14px 18px', borderRadius: 10, background: `${accentColor}05`, border: `1px solid ${accentColor}15`, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: accentColor, letterSpacing: 3, marginBottom: 10, opacity: 0.6 }}>三条温柔的建议</div>
            {aiResult.suggestions.map((s, i) => (
              <div key={i} style={{ fontSize: 13, color: fgColor, lineHeight: 2, letterSpacing: 2, marginBottom: i < aiResult.suggestions.length - 1 ? 6 : 0 }}>
                · {s}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: '18px', borderRadius: 10, background: `${accentColor}12`, border: `1px solid ${accentColor}30` }}>
            <div style={{ fontSize: 11, color: accentColor, letterSpacing: 3, marginBottom: 8, opacity: 0.55 }}>真言</div>
            <div style={{ fontSize: 16, color: fgColor, lineHeight: 2, letterSpacing: 3 }}>{aiResult.mantra}</div>
          </div>
        </div>
      )}

      {/* 历史壳 */}
      {shells.length > 0 && (
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, opacity: 0.5, letterSpacing: 3, marginBottom: 20, color: fgColor }}>— 已经打开过的壳 —</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', minHeight: 80 }}>
            {shells.map((s) => (
              <div key={s.id} onClick={() => setSelected(s)} style={{
                padding: '14px 24px', borderRadius: 12,
                background: `${accentColor}10`,
                border: `1px solid ${accentColor}35`,
                color: fgColor, fontSize: 13, letterSpacing: 2,
                textAlign: 'center', opacity: 0.85,
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{methodNames[s.method].emoji}</div>
                <div style={{ opacity: 0.85, lineHeight: 1.8 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 选中详情 */}
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
            <div style={{ fontSize: 48, marginBottom: 20 }}>{methodNames[selected.method].emoji}</div>
            <div style={{ fontSize: 18, letterSpacing: 3, marginBottom: 12, color: accentColor }}>{methodNames[selected.method].name}</div>
            <div style={{ fontSize: 16, letterSpacing: 3, lineHeight: 2.2, marginBottom: 30 }}>"{selected.text}"</div>
            <div style={{ fontSize: 12, opacity: 0.5, letterSpacing: 2, marginBottom: 30 }}>
              {new Date(selected.createdAt).toLocaleString('zh-CN')}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setSelected(null)} style={btnMint}>关闭</button>
              <button onClick={() => handleDelete(selected.id)} style={{ ...btnMint, background: `${accentColor}10`, borderColor: `${accentColor}40` }}>删除</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.35, marginTop: 30, letterSpacing: 3, color: fgColor }}>
        真正的自由，不是没有壳。
        <br />而是你知道，你随时可以从里面走出来。
      </div>
      <style>{`
        @keyframes peelOut {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes breakOut {
          0% { opacity: 1; transform: scale(1) translate(0,0); }
          20% { opacity: 1; transform: scale(1) translate(-8px, 4px); }
          40% { opacity: 0.8; transform: scale(1) translate(6px, -6px); }
          60% { opacity: 0.5; transform: scale(1.2) translate(-4px, 2px); }
          100% { opacity: 0; transform: scale(2) translate(0,0); box-shadow: 0 0 80px ${accentColor}00; }
        }
        @keyframes crackOut {
          0% { opacity: 0.4; transform: scale(0.7); }
          30% { opacity: 1; transform: scale(1.02); }
          60% { opacity: 0.95; transform: scale(1); }
          85% { opacity: 0.5; transform: scale(1.08); }
          100% { opacity: 0; transform: scale(1.3); }
        }
        @keyframes hatchOut {
          0% { opacity: 0; transform: translateY(40px) scale(0.6); letter-spacing: 0; }
          40% { opacity: 0.9; transform: translateY(0) scale(1); letter-spacing: 8; }
          100% { opacity: 0; transform: translateY(-30px) scale(1.1); }
        }
      `}</style>
    </PlanetShell>
  )
}

const btnMint: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: 999,
  background: `${accentColor}30`,
  border: `1px solid ${accentColor}60`,
  color: fgColor,
  fontSize: 13,
  letterSpacing: 4,
  cursor: 'pointer',
}
