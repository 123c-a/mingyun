import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface CareerEntry {
  id: string
  title: string
  description: string
  stage: string
  year: string
  milestone: boolean
  createdAt: string
}

const stageOptions = ['起步期', '成长期', '突破期', '稳定期', '转型期', '其他']

export default function EarthMarsJupiterSaturnPage() {
  const config = comboConfigs['earth-mars-jupiter-saturn']
  const [entries, setEntries] = useLocalStorage<CareerEntry[]>('combo-earth-mars-jupiter-saturn', [])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stage, setStage] = useState('成长期')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [milestone, setMilestone] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEntry = () => {
    if (!title.trim()) return
    const newEntry: CareerEntry = {
      id: `${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      stage,
      year,
      milestone,
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
    setShowForm(false)
    setTitle('')
    setDescription('')
    setMilestone(false)
    setSelectedId(newEntry.id)
  }

  const handleExport = () => {
    const items = (entries || []).slice(0, 7).map((e) => ({
      text: e.title.slice(0, 30) + (e.title.length > 30 ? '…' : ''),
      meta: `${e.year} · ${e.stage}`,
    }))
    if (items.length === 0) items.push({ text: '还没有事业记录', meta: '—' })
    exportAsImage(
      '事业年轮 · 记录你的成长轨迹',
      '大地为基，火焰为燃，木星扩张，土星沉淀',
      items,
      '#1a1510',
      '#ffe8c8',
      '#ffd090',
      `shiyenianlun-${Date.now()}.png`
    )
  }

  const sortedEntries = [...(entries || [])].sort((a, b) => b.year.localeCompare(a.year))

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 208, 144, 0.15)',
          border: '1px solid rgba(255, 208, 144, 0.4)',
          color: '#ffe8c8',
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
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(255, 208, 144, 0.25), rgba(240, 192, 112, 0.15))',
              border: '1px solid rgba(255, 208, 144, 0.5)',
              color: '#ffe8c8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🌱 记录一步成长
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 208, 144, 0.06)',
            border: '1px solid rgba(255, 208, 144, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffd090' }}>
              🌱 记录事业的一步成长
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                事件标题
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="这一步是什么……"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 208, 144, 0.25)',
                  color: '#ffe8c8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                  年份
                </div>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255, 208, 144, 0.25)',
                    color: '#ffe8c8',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                  阶段
                </div>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255, 208, 144, 0.25)',
                    color: '#ffe8c8',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  {stageOptions.map((s) => (
                    <option key={s} value={s} style={{ background: '#1a1510' }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={milestone}
                  onChange={(e) => setMilestone(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13, opacity: 0.8 }}>标记为重要里程碑</span>
              </label>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                详细描述（可选）
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="这一步的细节、感受、收获……"
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 208, 144, 0.25)',
                  color: '#ffe8c8',
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
                disabled={!title.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 208, 144, 0.25), rgba(240, 192, 112, 0.15))',
                  border: '1px solid rgba(255, 208, 144, 0.5)',
                  color: '#ffe8c8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: title.trim() ? 'pointer' : 'not-allowed',
                  opacity: title.trim() ? 1 : 0.5,
                }}
              >
                🌟 记录
              </button>
            </div>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 20,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, rgba(255,208,144,0.3) 0%, rgba(255,208,144,0.1) 100%)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sortedEntries.length === 0 && !showForm && (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                opacity: 0.3,
                fontSize: 13,
                letterSpacing: 3,
              }}>
                🌱 还没有事业记录
                <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                  大地为基，火焰为燃<br />
                  记录你事业的每一步生长
                </div>
              </div>
            )}

            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedId(entry.id === selectedId ? null : entry.id)}
                style={{
                  position: 'relative',
                  paddingLeft: 50,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  position: 'absolute',
                  left: 12,
                  top: 20,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: entry.milestone
                    ? 'radial-gradient(circle, #ffd090 0%, #f0c070 100%)'
                    : 'radial-gradient(circle, rgba(255,208,144,0.6) 0%, rgba(255,208,144,0.3) 100%)',
                  boxShadow: entry.milestone
                    ? '0 0 15px rgba(255,208,144,0.6)'
                    : '0 0 8px rgba(255,208,144,0.3)',
                  border: entry.milestone ? '2px solid #ffe8c8' : '2px solid rgba(255,208,144,0.5)',
                }} />

                <div style={{
                  padding: 16,
                  borderRadius: 16,
                  background: selectedId === entry.id
                    ? 'linear-gradient(135deg, rgba(255, 208, 144, 0.12), rgba(240, 192, 112, 0.06))'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedId === entry.id ? 'rgba(255, 208, 144, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#ffe8c8',
                    }}>
                      {entry.milestone && <span style={{ marginRight: 6 }}>⭐</span>}
                      {entry.title}
                    </div>
                    <div style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: 'rgba(255, 208, 144, 0.15)',
                      color: '#ffd090',
                    }}>
                      {entry.stage}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
                    {entry.year}
                  </div>

                  {entry.description && (
                    <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.8 }}>
                      {selectedId === entry.id
                        ? entry.description
                        : entry.description.length > 80 ? entry.description.slice(0, 80) + '…' : entry.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ComboShell>
  )
}
