import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface TransformationEntry {
  id: string
  title: string
  before: string
  after: string
  insight: string
  category: string
  createdAt: string
}

const categoryOptions = ['认知突破', '情感蜕变', '关系觉醒', '事业转型', '灵性成长', '其他']

export default function MercuryUranusNeptunePlutoPage() {
  const config = comboConfigs['mercury-uranus-neptune-pluto']
  const [entries, setEntries] = useLocalStorage<TransformationEntry[]>('combo-mercury-uranus-neptune-pluto', [])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [insight, setInsight] = useState('')
  const [category, setCategory] = useState('认知突破')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEntry = () => {
    if (!title.trim() && !before.trim() && !after.trim()) return
    const newEntry: TransformationEntry = {
      id: `${Date.now()}`,
      title: title.trim() || '一次蜕变',
      before: before.trim(),
      after: after.trim(),
      insight: insight.trim(),
      category,
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
    setShowForm(false)
    setTitle('')
    setBefore('')
    setAfter('')
    setInsight('')
    setSelectedId(newEntry.id)
  }

  const handleExport = () => {
    const items = (entries || []).slice(0, 7).map((e) => ({
      text: e.title.slice(0, 30) + (e.title.length > 30 ? '…' : ''),
      meta: `${e.category}`,
    }))
    if (items.length === 0) items.push({ text: '还没有蜕变记录', meta: '—' })
    exportAsImage(
      '灵魂蜕变史 · 记录每一次重生',
      '打破、消融、重生、表达',
      items,
      '#0a0f1a',
      '#d8e0f8',
      '#b8c8f0',
      `linghuntuibian-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(184, 200, 240, 0.15)',
          border: '1px solid rgba(184, 200, 240, 0.4)',
          color: '#d8e0f8',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(184, 200, 240, 0.25), rgba(160, 184, 232, 0.15))',
              border: '1px solid rgba(184, 200, 240, 0.5)',
              color: '#d8e0f8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🔮 记录一次蜕变
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(184, 200, 240, 0.06)',
            border: '1px solid rgba(184, 200, 240, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#b8c8f0' }}>
              🔮 记录灵魂的一次蜕变
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                蜕变标题
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="这次蜕变叫什么名字……"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(184, 200, 240, 0.25)',
                  color: '#d8e0f8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                类型
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {categoryOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: category === c ? 'rgba(184, 200, 240, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${category === c ? 'rgba(184, 200, 240, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: category === c ? '#b8c8f0' : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                蜕变之前
              </div>
              <textarea
                value={before}
                onChange={(e) => setBefore(e.target.value)}
                placeholder="那时候的我是什么样的……"
                style={{
                  width: '100%',
                  minHeight: 80,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(184, 200, 240, 0.25)',
                  color: '#d8e0f8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.7,
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                蜕变之后
              </div>
              <textarea
                value={after}
                onChange={(e) => setAfter(e.target.value)}
                placeholder="现在的我变成了什么样……"
                style={{
                  width: '100%',
                  minHeight: 80,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(184, 200, 240, 0.25)',
                  color: '#d8e0f8',
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
                洞见（可选）
              </div>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                placeholder="这次蜕变教会了我什么……"
                style={{
                  width: '100%',
                  minHeight: 70,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(184, 200, 240, 0.25)',
                  color: '#d8e0f8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.7,
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
                disabled={!title.trim() && !before.trim() && !after.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(184, 200, 240, 0.25), rgba(160, 184, 232, 0.15))',
                  border: '1px solid rgba(184, 200, 240, 0.5)',
                  color: '#d8e0f8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: (title.trim() || before.trim() || after.trim()) ? 'pointer' : 'not-allowed',
                  opacity: (title.trim() || before.trim() || after.trim()) ? 1 : 0.5,
                }}
              >
                ✨ 记录
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(entries || []).length === 0 && !showForm && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              🔮 还没有蜕变记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                每一次打破都是重生<br />
                记录你灵魂深处的每一次蜕变
              </div>
            </div>
          )}

          {(entries || []).map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedId(entry.id === selectedId ? null : entry.id)}
              style={{
                padding: 20,
                borderRadius: 16,
                background: selectedId === entry.id
                  ? 'linear-gradient(135deg, rgba(184, 200, 240, 0.1), rgba(160, 184, 232, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === entry.id ? 'rgba(184, 200, 240, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: '#d8e0f8',
                }}>
                  {entry.title}
                </div>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(184, 200, 240, 0.15)',
                  color: '#b8c8f0',
                }}>
                  {entry.category}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.15)',
                  fontSize: 12,
                  opacity: 0.7,
                  lineHeight: 1.6,
                }}>
                  {entry.before || '—'}
                </div>
                <div style={{ fontSize: 18, opacity: 0.6 }}>→</div>
                <div style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(184, 200, 240, 0.1)',
                  fontSize: 12,
                  lineHeight: 1.6,
                }}>
                  {entry.after || '—'}
                </div>
              </div>

              {entry.insight && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(184, 200, 240, 0.08)',
                  borderLeft: '3px solid #b8c8f0',
                  fontSize: 12,
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  opacity: 0.9,
                }}>
                  💫 {entry.insight}
                </div>
              )}

              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 12 }}>
                {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
