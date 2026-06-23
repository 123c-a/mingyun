import { useState } from 'react'
import { PlanetShell } from '../components/planets/PlanetShell'
import { useLocalStorage, exportAsImage } from '../utils/planetExport'
import { ai } from '../utils/aiService'

interface Ring {
  id: string
  year: string
  label: string
  story: string
  time?: string
}

export default function SaturnPage() {
  const [rings, setRings] = useLocalStorage<Ring[]>('saturn-rings', [])
  const [year, setYear] = useState('')
  const [label, setLabel] = useState('')
  const [story, setStory] = useState('')
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [aiResult, setAiResult] = useState<{ phases: { name: string; items: any[]; insight: string }[]; overall: string; nextRitual: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const add = () => {
    if (!year.trim()) return
    setRings((prev) => [...(prev || []), {
      id: `${Date.now()}`,
      year: year.trim(),
      label: label.trim() || '—',
      story: story.trim(),
      time: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }])
    setYear(''); setLabel(''); setStory('')
  }

  const handleExport = () => {
    const items = (rings || []).slice(0, 7).map((r) => ({ text: `${r.year} · ${r.label}${r.story ? ` — ${r.story}` : ''}`, meta: r.time || '' }))
    if (items.length === 0) items.push({ text: '年轮还没有刻下痕迹', meta: '—' })
    exportAsImage(
      '年轮庭 · 时间给你的礼物',
      '树就是这样长的',
      items,
      '#1a1208',
      '#e8d8b8',
      '#c8a878',
      `saturn-${Date.now()}.png`
    )
  }

  const btnExport: React.CSSProperties = {
    padding: '8px 22px', borderRadius: 999,
    background: 'rgba(232, 216, 184, 0.18)',
    border: '1px solid rgba(232, 216, 184, 0.4)',
    color: '#e8d8b8', fontSize: 12, letterSpacing: 4, cursor: 'pointer',
    backdropFilter: 'blur(6px)',
  }

  return (
    <PlanetShell themeId="saturn" title="年轮庭" subtitle="SATURN · 时间给你的礼物" description="土星教我们：时间是有重量的。把你生命里那些'之后不一样了'的时刻记下来 —— 它们会成为树的年轮，从里到外一层一层地长。">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={handleExport} style={btnExport}>导出为图</button>
        <button onClick={async () => {
          if ((rings || []).length === 0) return
          setLoading(true)
          try {
            const r = await ai.saturn.ring(rings!.map((r) => ({ text: `${r.label}${r.story ? ' — ' + r.story : ''}`, year: r.year, note: r.story })))
            setAiResult(r)
          } finally { setLoading(false) }
        }} disabled={loading || (rings || []).length === 0} style={{ ...btnExport, marginLeft: 10, borderColor: 'rgba(232,216,184,0.4)', color: '#e8d8b8' }}>
          {loading ? '回忆中…' : 'AI · 时间在对你说什么'}
        </button>
      </div>

      {aiResult && (
        <div style={{ maxWidth: 620, margin: '0 auto 30px', padding: 24, borderRadius: 16, background: 'rgba(45,35,20,0.6)', border: '1px solid rgba(232,216,184,0.25)', position: 'relative' }}>
          <button onClick={() => setAiResult(null)} style={{
            position: 'absolute', top: 12, right: 12, background: 'transparent', border: '1px solid rgba(232,216,184,0.3)',
            color: '#e8d8b8', cursor: 'pointer', borderRadius: 999, padding: '4px 12px', fontSize: 11, letterSpacing: 2,
          }}>关闭</button>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#e8d8b8', letterSpacing: 4, marginBottom: 18, opacity: 0.85 }}>· AI 看到的时间 ·</div>
          <div style={{ padding: '16px 18px', borderRadius: 10, background: 'rgba(232,216,184,0.08)', border: '1px solid rgba(232,216,184,0.2)', marginBottom: 18 }}>
            <div style={{ fontSize: 14, color: '#e8d8b8', lineHeight: 2.2, letterSpacing: 2 }}>{aiResult.overall}</div>
          </div>
          {aiResult.phases.map((p, i) => (
            <div key={i} style={{ marginBottom: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(232,216,184,0.05)', border: '1px solid rgba(232,216,184,0.12)' }}>
              <div style={{ fontSize: 12, color: '#e8d8b8', letterSpacing: 3, marginBottom: 6, opacity: 0.9 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#d8c8a8', lineHeight: 2, letterSpacing: 2, opacity: 0.85 }}>
                {p.items.map((it: any, j: number) => <div key={j} style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>· {typeof it === 'string' ? it : (it.text || it.label || '')}</div>)}
              </div>
              <div style={{ fontSize: 12, color: '#e8d8b8', lineHeight: 2, letterSpacing: 2, marginTop: 8, opacity: 0.9 }}>{p.insight}</div>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '14px 18px', borderRadius: 10, background: 'rgba(200,170,130,0.12)', border: '1px solid rgba(200,170,130,0.25)' }}>
            <div style={{ fontSize: 11, color: '#d8b890', letterSpacing: 3, marginBottom: 8, opacity: 0.7 }}>下一个小仪式</div>
            <div style={{ fontSize: 13, color: '#e8d8b8', lineHeight: 2.1, letterSpacing: 2 }}>{aiResult.nextRitual}</div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', width: 520, height: 520, margin: '0 auto 40px' }}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 60, height: 60, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 216, 184, 0.55), rgba(180, 160, 120, 0.15))',
          border: '1px solid rgba(232, 216, 184, 0.4)',
          boxShadow: '0 0 40px rgba(232, 216, 184, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: '#e8d8b8', letterSpacing: 2, opacity: 0.9,
        }}>出生</div>

        {(rings || []).map((r, i) => (
          <div
            key={r.id}
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: expandedIdx === i ? 110 + i * 80 + 30 : 110 + i * 80,
              height: expandedIdx === i ? 110 + i * 80 + 30 : 110 + i * 80,
              borderRadius: '50%',
              border: `1px solid rgba(232, 216, 184, ${expandedIdx === i ? 0.7 : 0.3})`,
              boxShadow: expandedIdx === i ? '0 0 40px rgba(232, 216, 184, 0.35)' : 'none',
              animation: `growIn 1.2s ease ${i * 0.15}s backwards`,
              cursor: 'pointer',
              transition: 'all 0.5s ease',
            }}
          >
            <span style={{
              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(25, 22, 18, 0.95)',
              padding: '2px 14px', fontSize: 13, color: '#e8d8b8', letterSpacing: 3,
              whiteSpace: 'nowrap',
            }}>{r.year} · {r.label}</span>
            {(r.story || r.time) && expandedIdx === i && (
              <div style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                fontSize: 12, color: '#e8d8b8', letterSpacing: 2,
                maxWidth: 280, textAlign: 'center', lineHeight: 2,
                background: 'rgba(25, 22, 18, 0.75)',
                padding: '12px 18px',
                borderRadius: 10,
                border: '1px solid rgba(232, 216, 184, 0.25)',
                animation: 'fadeIn 0.5s ease',
              }}>
                {r.story && <div style={{ marginBottom: 6 }}>{r.story}</div>}
                {r.time && <div style={{ fontSize: 10, opacity: 0.5 }}>{r.time}</div>}
              </div>
            )}
            {(!r.story && !r.time) && expandedIdx === i && (
              <div style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                fontSize: 11, color: '#c8b898', letterSpacing: 2, opacity: 0.6,
              }}>· 这一刻被记得 ·</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: 24, borderRadius: 16, background: 'rgba(45, 35, 25, 0.55)', border: '1px solid rgba(232, 216, 184, 0.15)' }}>
        <div style={{ fontSize: 12, opacity: 0.55, letterSpacing: 2, marginBottom: 14, textAlign: 'center' }}>加一圈年轮</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="年份" style={inputStyle(100)} />
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="一个词描述它" style={inputStyle(0)} />
        </div>
        <input value={story} onChange={(e) => setStory(e.target.value)} placeholder="发生了什么？（可留空）" style={{ ...inputStyle(0), width: '100%', marginTop: 10 }} />
        <button onClick={add} style={{
          padding: '12px 24px', borderRadius: 999,
          background: 'rgba(232, 216, 184, 0.2)',
          border: '1px solid rgba(232, 216, 184, 0.4)',
          color: '#e8d8b8', fontSize: 13, letterSpacing: 3, cursor: 'pointer',
          width: '100%', marginTop: 16,
        }}>让它成为一圈</button>
      </div>

      {(rings || []).length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#e8d8b8', letterSpacing: 4, lineHeight: 2.4, opacity: 0.85 }}>
          {(rings || []).length >= 3 && '你已经走了这么远。'}
          {(rings || []).length >= 5 && <div>每一圈都是当时以为走不过去的那一步。</div>}
          {(rings || []).length >= 7 && <div>—— 树就是这样长的。</div>}
        </div>
      )}

      <style>{`
        @keyframes growIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </PlanetShell>
  )
}

function inputStyle(fixedWidth: number): React.CSSProperties {
  return {
    padding: '12px 16px',
    background: 'rgba(30, 22, 12, 0.6)',
    border: '1px solid rgba(232, 216, 184, 0.2)',
    color: '#e8d8b8', fontSize: 13, letterSpacing: 2,
    borderRadius: 10, outline: 'none',
    ...(fixedWidth > 0 ? { width: fixedWidth, flexShrink: 0 } : { flex: 1, minWidth: 0 }),
    boxSizing: 'border-box',
  }
}
