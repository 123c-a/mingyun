import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface EmotionEntry {
  id: string
  content: string
  emotion: string
  toWhom: string
  words: string
  createdAt: string
}

const emotionOptions = ['爱', '感激', '遗憾', '愤怒', '思念', '愧疚', '欣赏', '其他']

export default function MercuryVenusMarsPage() {
  const config = comboConfigs['mercury-venus-mars']
  const [entries, setEntries] = useLocalStorage<EmotionEntry[]>('combo-mercury-venus-mars', [])
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [emotion, setEmotion] = useState('爱')
  const [toWhom, setToWhom] = useState('')
  const [words, setWords] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEntry = () => {
    if (!content.trim()) return
    const newEntry: EmotionEntry = {
      id: `${Date.now()}`,
      content: content.trim(),
      emotion,
      toWhom: toWhom.trim(),
      words: words.trim(),
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
    setShowForm(false)
    setContent('')
    setToWhom('')
    setWords('')
    setSelectedId(newEntry.id)
  }

  const handleExport = () => {
    const items = (entries || []).slice(0, 7).map((e) => ({
      text: e.content.slice(0, 40) + (e.content.length > 40 ? '…' : ''),
      meta: `${e.emotion} · ${e.toWhom || '自己'}`,
    }))
    if (items.length === 0) items.push({ text: '还没有情感记录', meta: '—' })
    exportAsImage(
      '情感炼金术 · 说出心底的话',
      '有些话，说不出口，让它炼化',
      items,
      '#2a1520',
      '#ffd8e8',
      '#ffb8d0',
      `qingganlianjin-${Date.now()}.png`
    )
  }

  const selectedEntry = entries?.find((e) => e.id === selectedId)

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 184, 208, 0.15)',
          border: '1px solid rgba(255, 184, 208, 0.4)',
          color: '#ffd8e8',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(255, 184, 208, 0.25), rgba(255, 184, 144, 0.15))',
              border: '1px solid rgba(255, 184, 208, 0.5)',
              color: '#ffd8e8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ✨ 炼化一份情感
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 184, 208, 0.06)',
            border: '1px solid rgba(255, 184, 208, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffb8d0' }}>
              ✨ 炼化心底的话
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                想对谁说？
              </div>
              <input
                type="text"
                value={toWhom}
                onChange={(e) => setToWhom(e.target.value)}
                placeholder="那个人是谁……（可以是自己）"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 184, 208, 0.25)',
                  color: '#ffd8e8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                这份情感是什么？
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {emotionOptions.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmotion(e)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      background: emotion === e ? 'rgba(255, 184, 208, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${emotion === e ? 'rgba(255, 184, 208, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: emotion === e ? '#ffb8d0' : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                想说的话
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="那些说不出口的话……"
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 184, 208, 0.25)',
                  color: '#ffd8e8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.7,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                炼化后的词（可选）
              </div>
              <input
                type="text"
                value={words}
                onChange={(e) => setWords(e.target.value)}
                placeholder="经过炼化，它变成了什么词？"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 184, 208, 0.25)',
                  color: '#ffd8e8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowForm(false)}
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
                onClick={addEntry}
                disabled={!content.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 184, 208, 0.25), rgba(255, 184, 144, 0.15))',
                  border: '1px solid rgba(255, 184, 208, 0.5)',
                  color: '#ffd8e8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: content.trim() ? 'pointer' : 'not-allowed',
                  opacity: content.trim() ? 1 : 0.5,
                }}
              >
                🔥 炼化
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(entries || []).length === 0 && !showForm && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              🔥 还没有炼化的情感
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                有些话，说不出口<br />
                那就让它们在这里炼化
              </div>
            </div>
          )}

          {(entries || []).map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedId(entry.id === selectedId ? null : entry.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === entry.id
                  ? 'linear-gradient(135deg, rgba(255, 184, 208, 0.1), rgba(255, 184, 144, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === entry.id ? 'rgba(255, 184, 208, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  fontSize: 12,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'rgba(255, 184, 208, 0.15)',
                  color: '#ffb8d0',
                }}>
                  {entry.emotion}
                </div>
                {entry.toWhom && (
                  <div style={{ fontSize: 11, opacity: 0.5 }}>
                    → {entry.toWhom}
                  </div>
                )}
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>
                {entry.content.length > 80 ? entry.content.slice(0, 80) + '…' : entry.content}
              </div>

              {entry.words && (
                <div style={{
                  fontSize: 12,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255, 184, 144, 0.1)',
                  color: '#ffb890',
                  fontStyle: 'italic',
                }}>
                  🔥 炼化后：{entry.words}
                </div>
              )}

              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 10 }}>
                {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
