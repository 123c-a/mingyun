import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface ConsciousnessEntry {
  id: string
  title: string
  experience: string
  insight: string
  dimension: string
  createdAt: string
}

const dimensionOptions = ['扩张意识', '沉淀意识', '觉醒意识', '消融意识', '重生意识', '宇宙合一']

export default function JupiterSaturnUranusNeptunePlutoPage() {
  const config = comboConfigs['jupiter-saturn-uranus-neptune-pluto']
  const [entries, setEntries] = useLocalStorage<ConsciousnessEntry[]>('combo-jupiter-saturn-uranus-neptune-pluto', [])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [experience, setExperience] = useState('')
  const [insight, setInsight] = useState('')
  const [dimension, setDimension] = useState('宇宙合一')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEntry = () => {
    if (!experience.trim()) return
    const newEntry: ConsciousnessEntry = {
      id: `${Date.now()}`,
      title: title.trim() || '意识旅程',
      experience: experience.trim(),
      insight: insight.trim(),
      dimension,
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
    setShowForm(false)
    setTitle('')
    setExperience('')
    setInsight('')
    setSelectedId(newEntry.id)
  }

  const handleExport = () => {
    const items = (entries || []).slice(0, 7).map((e) => ({
      text: e.title.slice(0, 30) + (e.title.length > 30 ? '…' : ''),
      meta: `${e.dimension}`,
    }))
    if (items.length === 0) items.push({ text: '还没有意识记录', meta: '—' })
    exportAsImage(
      '宇宙意识 · 超越自我的旅程',
      '扩张、沉淀、觉醒、消融、重生',
      items,
      '#0a0f20',
      '#e0e8ff',
      '#c8d8f8',
      `yuzhouyishi-${Date.now()}.png`
    )
  }

  const dimensionColors: Record<string, string> = {
    '扩张意识': '#f8c888',
    '沉淀意识': '#f0e0c0',
    '觉醒意识': '#b0f0ff',
    '消融意识': '#6080f0',
    '重生意识': '#d8c8a8',
    '宇宙合一': '#c8d8f8',
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(200, 216, 248, 0.15)',
          border: '1px solid rgba(200, 216, 248, 0.4)',
          color: '#e0e8ff',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* 五维意识图示 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 30,
          padding: '20px 0',
        }}>
          {dimensionOptions.slice(0, 5).map((d) => (
            <div key={d} style={{ textAlign: 'center' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${dimensionColors[d]}, rgba(0,0,0,0.3))`,
                boxShadow: `0 0 15px ${dimensionColors[d]}40`,
                margin: '0 auto 6px',
              }} />
              <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 1 }}>
                {d.replace('意识', '')}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(200, 216, 248, 0.25), rgba(168, 192, 232, 0.15))',
              border: '1px solid rgba(200, 216, 248, 0.5)',
              color: '#e0e8ff',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🌌 记录意识旅程
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(200, 216, 248, 0.06)',
            border: '1px solid rgba(200, 216, 248, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#c8d8f8' }}>
              🌌 记录你的意识旅程
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                旅程标题
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="这次意识旅程叫什么……"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(200, 216, 248, 0.25)',
                  color: '#e0e8ff',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                意识维度
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {dimensionOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDimension(d)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: dimension === d ? `${dimensionColors[d]}25` : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${dimension === d ? `${dimensionColors[d]}50` : 'rgba(255,255,255,0.1)'}`,
                      color: dimension === d ? dimensionColors[d] : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                意识体验
              </div>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="那一刻，你的意识发生了什么变化……"
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(200, 216, 248, 0.25)',
                  color: '#e0e8ff',
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
                意识洞见（可选）
              </div>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                placeholder="这次旅程给你带来了什么领悟……"
                style={{
                  width: '100%',
                  minHeight: 70,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(200, 216, 248, 0.25)',
                  color: '#e0e8ff',
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
                disabled={!experience.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(200, 216, 248, 0.25), rgba(168, 192, 232, 0.15))',
                  border: '1px solid rgba(200, 216, 248, 0.5)',
                  color: '#e0e8ff',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: experience.trim() ? 'pointer' : 'not-allowed',
                  opacity: experience.trim() ? 1 : 0.5,
                }}
              >
                🌌 记录
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(entries || []).length === 0 && !showForm && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              🌌 还没有意识旅程记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                扩张、沉淀、觉醒、消融、重生<br />
                五颗远域行星，带你走向超越自我的宇宙意识之旅
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
                  ? 'linear-gradient(135deg, rgba(200, 216, 248, 0.1), rgba(168, 192, 232, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === entry.id ? 'rgba(200, 216, 248, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#e0e8ff',
                }}>
                  {entry.title}
                </div>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: `${dimensionColors[entry.dimension]}20`,
                  color: dimensionColors[entry.dimension],
                }}>
                  {entry.dimension}
                </div>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 10, opacity: 0.8 }}>
                {selectedId === entry.id
                  ? entry.experience
                  : entry.experience.length > 100 ? entry.experience.slice(0, 100) + '…' : entry.experience}
              </div>

              {entry.insight && selectedId === entry.id && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(200, 216, 248, 0.08)',
                  borderLeft: '3px solid #c8d8f8',
                  fontSize: 12,
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  opacity: 0.9,
                }}>
                  💫 {entry.insight}
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