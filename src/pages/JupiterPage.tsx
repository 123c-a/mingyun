import { useState } from 'react'
import { PlanetShell } from '../components/planets/PlanetShell'
import { useLocalStorage, exportAsImage } from '../utils/planetExport'
import { ai } from '../utils/aiService'

interface Star {
  id: string
  name: string
  story: string
  radius: number
  angle: number
  time?: string
}

export default function JupiterPage() {
  const [stars, setStars] = useLocalStorage<Star[]>('jupiter-people', [])
  const [name, setName] = useState('')
  const [story, setStory] = useState('')
  const [radius, setRadius] = useState(40)
  const [activeStar, setActiveStar] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<{ types: { type: string; count: number; items: string[] }[]; insight: string; ritual: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const addStar = () => {
    if (!name.trim()) return
    setStars((prev) => [...(prev || []), {
      id: `${Date.now()}`,
      name: name.trim(),
      story: story.trim() || '给过我一束光',
      radius,
      angle: ((prev || []).length * 37) % 360,
      time: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }])
    setName('')
    setStory('')
    setRadius(40)
  }

  const deleteStar = (id: string) => {
    if (window.confirm('确定要让这颗星离开你的星图吗？')) {
      setStars((prev) => (prev || []).filter((s) => s.id !== id))
      setActiveStar(null)
    }
  }

  const handleExport = () => {
    const items = (stars || []).slice(0, 7).map((s) => ({ text: `${s.name} · ${s.story}`, meta: s.time || `距离中心 ${s.radius}` }))
    if (items.length === 0) items.push({ text: '星图还空着', meta: '—' })
    exportAsImage(
      '贵人图 · 你曾被多少光照亮',
      '你并不孤单',
      items,
      '#1a1208',
      '#ffd89a',
      '#ffb870',
      `jupiter-${Date.now()}.png`
    )
  }

  const btnExport: React.CSSProperties = {
    padding: '8px 22px', borderRadius: 999,
    background: 'rgba(255, 216, 154, 0.18)',
    border: '1px solid rgba(255, 216, 154, 0.4)',
    color: '#ffe8ba', fontSize: 12, letterSpacing: 4, cursor: 'pointer',
    backdropFilter: 'blur(6px)',
  }

  return (
    <PlanetShell themeId="jupiter" title="贵人图" subtitle="JUPITER · 你曾被多少光照亮" description="有时候我们忘了，自己不是一个人在走。把那些给过你善意、机会、温柔的人，都画成星。">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={handleExport} style={btnExport}>导出为图</button>
        <button onClick={async () => {
          if ((stars || []).length === 0) return
          setLoading(true)
          try {
            const r = await ai.jupiter.map(stars!.map((s) => `${s.name} · ${s.story}`))
            setAiResult(r)
          } finally { setLoading(false) }
        }} disabled={loading || (stars || []).length === 0} style={{ ...btnExport, marginLeft: 10, borderColor: 'rgba(255,180,100,0.4)', color: '#ffd8a0' }}>
          {loading ? '回忆中…' : 'AI · 看看这些人'}
        </button>
      </div>

      {aiResult && (
        <div style={{ maxWidth: 620, margin: '0 auto 30px', padding: 24, borderRadius: 16, background: 'rgba(55,35,15,0.55)', border: '1px solid rgba(255,216,154,0.25)', position: 'relative' }}>
          <button onClick={() => setAiResult(null)} style={{
            position: 'absolute', top: 12, right: 12, background: 'transparent', border: '1px solid rgba(255,216,154,0.3)',
            color: '#ffd8a0', cursor: 'pointer', borderRadius: 999, padding: '4px 12px', fontSize: 11, letterSpacing: 2,
          }}>关闭</button>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#ffd8a0', letterSpacing: 4, marginBottom: 16, opacity: 0.85 }}>· AI 看到的你 ·</div>
          {aiResult.types.map((t, i) => (
            <div key={i} style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,216,154,0.06)', border: '1px solid rgba(255,216,154,0.12)' }}>
              <div style={{ fontSize: 12, color: '#ffd8a0', letterSpacing: 3, marginBottom: 8, opacity: 0.9 }}>{t.type} · {t.count} 人</div>
              <div style={{ fontSize: 12, color: '#ffe8ba', lineHeight: 1.9, letterSpacing: 2, opacity: 0.85 }}>
                {t.items.join('；')}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '16px 18px', borderRadius: 10, background: 'rgba(255,180,100,0.1)', border: '1px solid rgba(255,180,100,0.2)' }}>
            <div style={{ fontSize: 11, color: '#ffb870', letterSpacing: 3, marginBottom: 8, opacity: 0.7 }}>洞察</div>
            <div style={{ fontSize: 13, color: '#ffe8ba', lineHeight: 2.1, letterSpacing: 2 }}>{aiResult.insight}</div>
          </div>
          <div style={{ marginTop: 12, padding: '14px 18px', borderRadius: 10, background: 'rgba(255,216,154,0.08)', border: '1px solid rgba(255,216,154,0.18)' }}>
            <div style={{ fontSize: 11, color: '#ffd8a0', letterSpacing: 3, marginBottom: 8, opacity: 0.7 }}>一个小仪式</div>
            <div style={{ fontSize: 13, color: '#ffe8ba', lineHeight: 2.1, letterSpacing: 2 }}>{aiResult.ritual}</div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', width: 500, height: 500, margin: '0 auto 40px' }}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 50, height: 50, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 216, 154, 0.9), rgba(255, 180, 100, 0.3))',
          boxShadow: '0 0 60px rgba(255, 216, 154, 0.5)',
        }} />

        {[0.3, 0.55, 0.8].map((r) => (
          <div key={r} style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            width: 500 * r, height: 500 * r, borderRadius: '50%',
            border: '1px dashed rgba(255, 216, 154, 0.12)',
          }} />
        ))}

        {(stars || []).map((s) => {
          const x = 50 + (s.radius / 2) * Math.cos((s.angle * Math.PI) / 180)
          const y = 50 + (s.radius / 2) * Math.sin((s.angle * Math.PI) / 180)
          return (
            <div key={s.id} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              animation: 'starIn 1.4s ease',
              zIndex: activeStar === s.id ? 10 : 2,
            }}>
              <div
                onClick={() => setActiveStar(activeStar === s.id ? null : s.id)}
                style={{
                  width: activeStar === s.id ? 22 : 14,
                  height: activeStar === s.id ? 22 : 14,
                  borderRadius: '50%',
                  background: activeStar === s.id ? 'rgba(255, 240, 200, 1)' : 'rgba(255, 230, 180, 0.95)',
                  boxShadow: `0 0 ${activeStar === s.id ? 50 : 30}px rgba(255, 216, 154, ${activeStar === s.id ? 0.9 : 0.7})`,
                  margin: '0 auto 8px',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                }}
              />
              <div style={{ fontSize: 12, color: '#ffe8ba', letterSpacing: 2, whiteSpace: 'nowrap', opacity: activeStar === s.id ? 1 : 0.9, transition: 'opacity 0.4s' }}>{s.name}</div>
              {activeStar === s.id && (
                <div style={{
                  marginTop: 10, padding: '14px 18px',
                  background: 'rgba(50, 35, 20, 0.85)',
                  border: '1px solid rgba(255, 216, 154, 0.3)',
                  borderRadius: 12,
                  fontSize: 12, color: '#ffd89a',
                  letterSpacing: 2, lineHeight: 2,
                  maxWidth: 260, whiteSpace: 'normal',
                  boxShadow: '0 0 30px rgba(255, 200, 120, 0.25)',
                  animation: 'fadeIn 0.4s ease',
                }}>
                  <div style={{ fontSize: 13, marginBottom: 6, color: '#ffe8ba', letterSpacing: 3 }}>{s.story}</div>
                  {s.time && <div style={{ fontSize: 10, opacity: 0.55, marginBottom: 10 }}>{s.time}</div>}
                  <div style={{ fontSize: 10, opacity: 0.55, marginBottom: 10, letterSpacing: 2 }}>距离中心 · {s.radius}</div>
                  <button onClick={(e) => { e.stopPropagation(); deleteStar(s.id) }} style={{
                    fontSize: 11, padding: '6px 14px', borderRadius: 999,
                    background: 'rgba(255, 160, 120, 0.15)',
                    border: '1px solid rgba(255, 160, 120, 0.35)',
                    color: '#ffb890', cursor: 'pointer', letterSpacing: 2,
                  }}>让这颗星悄悄离开</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: 24, borderRadius: 16, background: 'rgba(50, 35, 20, 0.55)', border: '1px solid rgba(255, 216, 154, 0.15)' }}>
        <div style={{ fontSize: 12, opacity: 0.55, letterSpacing: 2, marginBottom: 14, textAlign: 'center' }}>
          新增一颗星
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="对方的称呼（可以是一个代号）"
          style={{
            width: '100%', padding: '12px 16px', marginBottom: 10,
            background: 'rgba(30, 22, 12, 0.6)', border: '1px solid rgba(255, 216, 154, 0.2)',
            color: '#ffe8ba', fontSize: 13, letterSpacing: 2,
            borderRadius: 10, outline: 'none', boxSizing: 'border-box',
          }}
        />
        <input
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="他/她给过你什么？（可以写一句话）"
          style={{
            width: '100%', padding: '12px 16px', marginBottom: 10,
            background: 'rgba(30, 22, 12, 0.6)', border: '1px solid rgba(255, 216, 154, 0.2)',
            color: '#ffe8ba', fontSize: 13, letterSpacing: 2,
            borderRadius: 10, outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: 11, opacity: 0.45, margin: '4px 0 6px', letterSpacing: 1 }}>
          距离中心（越近代表影响越大 / 越近）· {radius}
        </div>
        <input
          type="range" min={10} max={90} value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#ffd89a', marginBottom: 16 }}
        />
        <button onClick={addStar} style={{
          padding: '12px 24px', borderRadius: 999,
          background: 'rgba(255, 216, 154, 0.2)',
          border: '1px solid rgba(255, 216, 154, 0.4)',
          color: '#ffe8ba', fontSize: 13, letterSpacing: 3, cursor: 'pointer',
          width: '100%',
        }}>让它出现在星图上</button>
      </div>

      {(stars || []).length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 40, fontSize: 15, color: '#ffe8ba', letterSpacing: 4, lineHeight: 2.2, opacity: 0.85 }}>
          你并不孤单。<br />
          这 {(stars || []).length} 颗星，都是你走过路上的灯。
        </div>
      )}

      <style>{`
        @keyframes starIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </PlanetShell>
  )
}
