import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Milestone {
  id: string
  title: string
  date: string
  type: 'quote' | 'node' | 'path'
  description: string
  reflection: string
  createdAt: string
}

export default function MercuryJupiterSaturnPage() {
  const config = comboConfigs['mercury-jupiter-saturn']
  const [milestones, setMilestones] = useLocalStorage<Milestone[]>('combo-mercury-jupiter-saturn', [])
  const [showAdd, setShowAdd] = useState(false)
  const [type, setType] = useState<'quote' | 'node' | 'path'>('quote')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [reflection, setReflection] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const typeLabels = {
    quote: '✨ 贵人语录',
    node: '🌳 生命节点',
    path: '🛤️ 成长轨迹',
  }

  const addMilestone = () => {
    if (!title.trim()) return
    const newItem: Milestone = {
      id: `${Date.now()}`,
      title: title.trim(),
      date: date.trim(),
      type,
      description: description.trim(),
      reflection: reflection.trim(),
      createdAt: new Date().toISOString(),
    }
    setMilestones([newItem, ...milestones])
    setShowAdd(false)
    setTitle('')
    setDate('')
    setDescription('')
    setReflection('')
    setSelectedId(newItem.id)
  }

  const handleExport = () => {
    const items = (milestones || []).slice(0, 7).map((m) => ({
      text: m.title,
      meta: `${typeLabels[m.type]} · ${m.date || '时间未知'}`,
    }))
    if (items.length === 0) items.push({ text: '还没有成长记录', meta: '—' })
    exportAsImage(
      '成长之路 · 记录你的成长轨迹',
      '那些照亮过你的话，那些塑造你的节点',
      items,
      '#1a1810',
      '#fff8e8',
      '#f0e0c0',
      `chengchangzhilu-${Date.now()}.png`
    )
  }

  const selectedItem = milestones?.find((m) => m.id === selectedId)

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(240, 224, 192, 0.15)',
          border: '1px solid rgba(240, 224, 192, 0.4)',
          color: '#fff8e8',
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
            onClick={() => setShowAdd(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(240, 224, 192, 0.25), rgba(255, 216, 160, 0.15))',
              border: '1px solid rgba(240, 224, 192, 0.5)',
              color: '#fff8e8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🌱 记录一个成长
          </button>
        </div>

        {showAdd && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(240, 224, 192, 0.06)',
            border: '1px solid rgba(240, 224, 192, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#f0e0c0' }}>
              🌱 这是成长的一部分
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                这是什么类型的成长？
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['quote', 'node', 'path'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      background: type === t ? 'rgba(240, 224, 192, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${type === t ? 'rgba(240, 224, 192, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: type === t ? '#f0e0c0' : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="标题"
                style={{
                  flex: 2,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(240, 224, 192, 0.25)',
                  color: '#fff8e8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="时间（如：2024年3月）"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(240, 224, 192, 0.25)',
                  color: '#fff8e8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="发生了什么……"
              style={{
                width: '100%',
                minHeight: 80,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 224, 192, 0.25)',
                color: '#fff8e8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 10,
              }}
            />

            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="回头看，这段经历教会了你什么？"
              style={{
                width: '100%',
                minHeight: 60,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 224, 192, 0.25)',
                color: '#fff8e8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            />

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
                onClick={addMilestone}
                disabled={!title.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(240, 224, 192, 0.25), rgba(255, 216, 160, 0.15))',
                  border: '1px solid rgba(240, 224, 192, 0.5)',
                  color: '#fff8e8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: title.trim() ? 'pointer' : 'not-allowed',
                  opacity: title.trim() ? 1 : 0.5,
                }}
              >
                🌱 记录
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(milestones || []).length === 0 && !showAdd && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              🌱 还没有成长记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                那些照亮过你的话<br />
                那些塑造你的节点<br />
                那些你走过的路
              </div>
            </div>
          )}

          {(milestones || []).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === item.id
                  ? 'linear-gradient(135deg, rgba(240, 224, 192, 0.1), rgba(255, 216, 160, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === item.id ? 'rgba(240, 224, 192, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{item.title}</div>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(240, 224, 192, 0.12)',
                  color: '#f0e0c0',
                }}>
                  {typeLabels[item.type]}
                </div>
              </div>
              {item.date && (
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8 }}>{item.date}</div>
              )}
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.8 }}>
                {item.description.slice(0, 60)}{item.description.length > 60 ? '…' : ''}
              </div>
              {selectedId === item.id && item.reflection && (
                <div style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 13,
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  color: '#f0e0c0',
                }}>
                  💭 {item.reflection}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
