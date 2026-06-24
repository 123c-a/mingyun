import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Quote {
  id: string
  text: string
  author: string
  context?: string
  category: 'teacher' | 'friend' | 'family' | 'stranger' | 'book' | 'other'
  createdAt: string
  stars: number
}

const categoryConfig = {
  teacher: { label: '师长', emoji: '📚', color: '#ffd89a' },
  friend: { label: '朋友', emoji: '🤝', color: '#a0d8ff' },
  family: { label: '家人', emoji: '🏠', color: '#ffb8a0' },
  stranger: { label: '陌生人', emoji: '✨', color: '#c8a0ff' },
  book: { label: '书中', emoji: '📖', color: '#a0ffc8' },
  other: { label: '其他', emoji: '🌟', color: '#ffd89a' },
}

export default function MercuryJupiterPage() {
  const config = comboConfigs['mercury-jupiter']
  const [quotes, setQuotes] = useLocalStorage<Quote[]>('combo-mercury-jupiter', [])
  const [showAdd, setShowAdd] = useState(false)
  const [newText, setNewText] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newContext, setNewContext] = useState('')
  const [newCategory, setNewCategory] = useState<Quote['category']>('friend')
  const [filter, setFilter] = useState<Quote['category'] | 'all'>('all')
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null)

  const addQuote = () => {
    if (!newText.trim() || !newAuthor.trim()) return
    const newItem: Quote = {
      id: `${Date.now()}`,
      text: newText.trim(),
      author: newAuthor.trim(),
      context: newContext.trim() || undefined,
      category: newCategory,
      createdAt: new Date().toLocaleDateString('zh-CN'),
      stars: 1,
    }
    setQuotes([newItem, ...quotes])
    setShowAdd(false)
    setNewText('')
    setNewAuthor('')
    setNewContext('')
  }

  const addStar = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, stars: Math.min(q.stars + 1, 5) } : q))
    )
  }

  const drawRandom = () => {
    if (quotes.length === 0) return
    const idx = Math.floor(Math.random() * quotes.length)
    setRandomQuote(quotes[idx])
  }

  const filteredQuotes = filter === 'all'
    ? quotes
    : (quotes || []).filter((q) => q.category === filter)

  const handleExport = () => {
    const items = (filteredQuotes || []).slice(0, 7).map((q) => ({
      text: q.text,
      meta: `— ${q.author}`,
    }))
    if (items.length === 0) items.push({ text: '还没有语录记录', meta: '—' })
    exportAsImage(
      '贵人语录 · 那些照亮过你的话',
      '有些话，像星星一样照亮过你',
      items,
      '#1a150a',
      '#fff0d8',
      '#ffd89a',
      `guirenylu-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 216, 154, 0.15)',
          border: '1px solid rgba(255, 216, 154, 0.4)',
          color: '#fff0d8',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 650, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={drawRandom}
            disabled={(quotes || []).length === 0}
            style={{
              padding: '14px 36px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(255, 216, 154, 0.25), rgba(255, 200, 120, 0.15))',
              border: '1px solid rgba(255, 216, 154, 0.5)',
              color: '#fff0d8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: (quotes || []).length > 0 ? 'pointer' : 'not-allowed',
              backdropFilter: 'blur(6px)',
              opacity: (quotes || []).length > 0 ? 1 : 0.5,
              marginRight: 12,
            }}
          >
            ✨ 抽一句
          </button>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: '14px 36px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff0d8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            + 添加语录
          </button>
        </div>

        {randomQuote && (
          <div style={{
            padding: 30,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(255, 216, 154, 0.12), rgba(255, 200, 120, 0.08))',
            border: '1px solid rgba(255, 216, 154, 0.3)',
            backdropFilter: 'blur(10px)',
            marginBottom: 30,
            textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.5 }}>"</div>
            <div style={{ fontSize: 17, lineHeight: 1.9, marginBottom: 16, fontStyle: 'italic' }}>
              {randomQuote.text}
            </div>
            <div style={{ fontSize: 13, color: '#ffd89a', letterSpacing: 1 }}>
              — {randomQuote.author}
              {randomQuote.context && <span style={{ opacity: 0.6, marginLeft: 8 }}>{randomQuote.context}</span>}
            </div>
            <button
              onClick={() => setRandomQuote(null)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        )}

        {showAdd && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 216, 154, 0.06)',
            border: '1px solid rgba(255, 216, 154, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 30,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffd89a' }}>
              ✨ 记录一句照亮过你的话
            </div>

            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="那句话是……"
              style={{
                width: '100%',
                minHeight: 80,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 216, 154, 0.25)',
                color: '#fff0d8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            />

            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="是谁说的？"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 216, 154, 0.25)',
                  color: '#fff0d8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="text"
                value={newContext}
                onChange={(e) => setNewContext(e.target.value)}
                placeholder="什么场景下？（选填）"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 216, 154, 0.25)',
                  color: '#fff0d8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((key) => (
                <button
                  key={key}
                  onClick={() => setNewCategory(key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: newCategory === key
                      ? `${categoryConfig[key].color}20`
                      : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${newCategory === key ? categoryConfig[key].color + '80' : 'rgba(255,255,255,0.1)'}`,
                    color: newCategory === key ? categoryConfig[key].color : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {categoryConfig[key].emoji} {categoryConfig[key].label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  letterSpacing: 2,
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={addQuote}
                disabled={!newText.trim() || !newAuthor.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 216, 154, 0.25), rgba(255, 200, 120, 0.15))',
                  border: '1px solid rgba(255, 216, 154, 0.5)',
                  color: '#fff0d8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: newText.trim() && newAuthor.trim() ? 'pointer' : 'not-allowed',
                  opacity: newText.trim() && newAuthor.trim() ? 1 : 0.5,
                }}
              >
                ✨ 收藏
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              background: filter === 'all' ? 'rgba(255, 216, 154, 0.2)' : 'rgba(0,0,0,0.15)',
              border: `1px solid ${filter === 'all' ? 'rgba(255, 216, 154, 0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: filter === 'all' ? '#ffd89a' : 'rgba(255,255,255,0.5)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            全部 ({(quotes || []).length})
          </button>
          {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((key) => {
            const count = (quotes || []).filter((q) => q.category === key).length
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: filter === key ? `${categoryConfig[key].color}20` : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${filter === key ? categoryConfig[key].color + '60' : 'rgba(255,255,255,0.08)'}`,
                  color: filter === key ? categoryConfig[key].color : 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {categoryConfig[key].emoji} {count}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(filteredQuotes || []).length === 0 && !showAdd && (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              ✨ 还没有语录
              <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
                点击上方按钮，记录那些照亮过你的话
              </div>
            </div>
          )}

          {(filteredQuotes || []).map((quote) => (
            <div
              key={quote.id}
              style={{
                padding: 18,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 10 }}>
                {quote.text}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: categoryConfig[quote.category].color, letterSpacing: 1 }}>
                  {categoryConfig[quote.category].emoji} — {quote.author}
                  {quote.context && <span style={{ opacity: 0.6, marginLeft: 8 }}>{quote.context}</span>}
                  <span style={{ opacity: 0.4, marginLeft: 12 }}>{quote.createdAt}</span>
                </div>
                <button
                  onClick={() => addStar(quote.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    letterSpacing: 1,
                    color: '#ffd89a',
                    opacity: 0.7,
                  }}
                >
                  {'⭐'.repeat(quote.stars)}{'☆'.repeat(5 - quote.stars)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
