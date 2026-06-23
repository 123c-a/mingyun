import { useState, useEffect } from 'react'

interface Thought {
  id: string
  text: string
  kind: 'thought' | 'emotion' | 'idea' | 'gratitude' | 'wish'
  color: string
  at: number
}

const LS_KEY = 'earth-world-thoughts-v1'

const KIND_META: Record<Thought['kind'], { label: string; color: string; emoji: string }> = {
  thought: { label: '念头', color: '#9ec6ff', emoji: '💭' },
  emotion: { label: '情绪', color: '#ff9ec6', emoji: '🌊' },
  idea: { label: '灵感', color: '#ffd98f', emoji: '✨' },
  gratitude: { label: '感恩', color: '#a8e6c8', emoji: '🌿' },
  wish: { label: '愿望', color: '#d9b8ff', emoji: '🌟' },
}

function EarthWorld() {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [text, setText] = useState('')
  const [kind, setKind] = useState<Thought['kind']>('thought')
  const [filter, setFilter] = useState<Thought['kind'] | 'all'>('all')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setThoughts(JSON.parse(raw))
    } catch {}
  }, [])

  const save = (list: Thought[]) => {
    setThoughts(list)
    localStorage.setItem(LS_KEY, JSON.stringify(list))
  }

  const addThought = () => {
    const t = text.trim()
    if (!t) return
    const meta = KIND_META[kind]
    save([
      { id: Math.random().toString(36).slice(2, 10), text: t, kind, color: meta.color, at: Date.now() },
      ...thoughts,
    ])
    setText('')
  }

  const deleteThought = (id: string) => {
    if (!window.confirm('确认删除？')) return
    save(thoughts.filter((t) => t.id !== id))
  }

  const filtered = filter === 'all' ? thoughts : thoughts.filter((t) => t.kind === filter)

  const containerStyle: React.CSSProperties = {
    padding: '18px 16px',
    color: '#f0e6f4',
    overflowY: 'auto',
    maxHeight: '100vh',
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#ffd8ea', letterSpacing: 2 }}>
          🌍 我的世界
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
          记录所有念头、情绪、灵感、感恩、愿望
        </div>
      </div>

      {/* 输入区 */}
      <div style={{
        padding: 14, borderRadius: 12, marginBottom: 14,
        background: 'linear-gradient(135deg, rgba(126,180,230,0.15), rgba(168,230,200,0.12))',
        border: '1px solid rgba(126,180,230,0.3)',
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              addThought()
            }
          }}
          placeholder="此刻在想什么？可以是一个念头、一个情绪、一个灵感..."
          style={{
            width: '100%', minHeight: 70, padding: '10px 12px',
            borderRadius: 8, fontSize: 13, outline: 'none', resize: 'vertical',
            background: 'rgba(20,16,30,0.7)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#f0e6f4', fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {(Object.keys(KIND_META) as Thought['kind'][]).map((k) => {
            const m = KIND_META[k]
            return (
              <button key={k} onClick={() => setKind(k)}
                style={{
                  padding: '5px 10px', borderRadius: 99, fontSize: 11, cursor: 'pointer',
                  background: kind === k ? `${m.color}33` : 'rgba(255,255,255,0.04)',
                  color: kind === k ? m.color : '#a898c0',
                  border: `1px solid ${kind === k ? `${m.color}55` : 'rgba(255,255,255,0.08)'}`,
                  letterSpacing: 1,
                }}>
                {m.emoji} {m.label}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button onClick={addThought} disabled={!text.trim()}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: text.trim() ? 'linear-gradient(135deg,#7eb4e6,#a8e6c8)' : 'rgba(255,255,255,0.1)',
              color: text.trim() ? '#1a1030' : '#a898c0',
              border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed', letterSpacing: 2,
            }}>
            ✨ 放进世界
          </button>
        </div>
      </div>

      {/* 筛选 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {(['all', ...Object.keys(KIND_META)] as (Thought['kind'] | 'all')[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '5px 12px', borderRadius: 99, fontSize: 10, cursor: 'pointer',
              background: filter === f ? 'rgba(255,179,217,0.22)' : 'rgba(255,255,255,0.03)',
              color: filter === f ? '#ffd6ea' : '#a898c0',
              border: `1px solid ${filter === f ? 'rgba(255,179,217,0.45)' : 'rgba(255,255,255,0.06)'}`,
              letterSpacing: 1,
            }}>
            {f === 'all' ? `全部 · ${thoughts.length}` : `${KIND_META[f].emoji} ${KIND_META[f].label}`}
          </button>
        ))}
      </div>

      {/* 统计 */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5,
        padding: '10px 6px', marginBottom: 12,
        borderRadius: 10, background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {(Object.keys(KIND_META) as Thought['kind'][]).map((k) => {
          const m = KIND_META[k]
          const count = thoughts.filter((t) => t.kind === k).length
          return (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: m.color, fontWeight: 600 }}>{count}</div>
              <div style={{ fontSize: 9, opacity: 0.55 }}>{m.label}</div>
            </div>
          )
        })}
      </div>

      {/* 列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 30, opacity: 0.5, fontSize: 12 }}>
            这里空空如也，试试写第一句
          </div>
        )}
        {filtered.map((t) => {
          const m = KIND_META[t.kind]
          return (
            <div key={t.id} style={{
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${t.color}22`,
              position: 'relative',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: m.color, letterSpacing: 1 }}>
                  {m.emoji} {m.label}
                </span>
                <span style={{ fontSize: 9, opacity: 0.4 }}>
                  {new Date(t.at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: '#e8d8f0' }}>{t.text}</div>
              <button onClick={() => deleteThought(t.id)}
                style={{
                  position: 'absolute', top: 8, right: 8, background: 'transparent',
                  border: 'none', color: '#a87878', fontSize: 11, cursor: 'pointer', opacity: 0.4,
                }}>✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { EarthWorld }
export default EarthWorld
