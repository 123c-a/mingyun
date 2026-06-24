import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface GuardianItem {
  id: string
  name: string
  type: string
  reason: string
  createdAt: string
}

const typeOptions = ['人', '事物', '信念', '习惯', '地方', '其他']

export default function VenusEarthPage() {
  const config = comboConfigs['venus-earth']
  const [items, setItems] = useLocalStorage<GuardianItem[]>('combo-venus-earth', [])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('人')
  const [reason, setReason] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addItem = () => {
    if (!name.trim()) return
    const newItem: GuardianItem = {
      id: `${Date.now()}`,
      name: name.trim(),
      type,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    }
    setItems([newItem, ...items])
    setShowForm(false)
    setName('')
    setReason('')
    setSelectedId(newItem.id)
  }

  const handleExport = () => {
    const exportItems = (items || []).slice(0, 7).map((item) => ({
      text: item.name,
      meta: `${typeOptions.includes(item.type) ? item.type : '其他'} · ${item.reason.slice(0, 15)}${item.reason.length > 15 ? '…' : ''}`,
    }))
    if (exportItems.length === 0) exportItems.push({ text: '还没有守护清单', meta: '—' })
    exportAsImage(
      '温柔之锚 · 守护所爱',
      '用温柔的力量，守护你珍视的一切',
      exportItems,
      '#1a1518',
      '#ffe8f0',
      '#ffd0e8',
      `wenrouzhimao-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 180, 220, 0.15)',
          border: '1px solid rgba(255, 180, 220, 0.4)',
          color: '#ffe8f0',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(255, 180, 220, 0.25), rgba(255, 200, 230, 0.15))',
              border: '1px solid rgba(255, 180, 220, 0.5)',
              color: '#ffe8f0',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ⚓ 记录守护对象
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 180, 220, 0.06)',
            border: '1px solid rgba(255, 180, 220, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffd0e8' }}>
              ⚓ 记录想要守护的一切
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                名称
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="想要守护的是什么……"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 180, 220, 0.25)',
                  color: '#ffe8f0',
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
                {typeOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: type === t ? 'rgba(255, 180, 220, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${type === t ? 'rgba(255, 180, 220, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: type === t ? '#ffd0e8' : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                为什么要守护它
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="它对你意味着什么……"
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 180, 220, 0.25)',
                  color: '#ffe8f0',
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
                onClick={addItem}
                disabled={!name.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 180, 220, 0.25), rgba(255, 200, 230, 0.15))',
                  border: '1px solid rgba(255, 180, 220, 0.5)',
                  color: '#ffe8f0',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  opacity: name.trim() ? 1 : 0.5,
                }}
              >
                ⚓ 记录
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(items || []).length === 0 && !showForm && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              ⚓ 还没有守护清单
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                用温柔的力量<br />
                守护你珍视的一切
              </div>
            </div>
          )}

          {(items || []).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === item.id
                  ? 'linear-gradient(135deg, rgba(255, 180, 220, 0.1), rgba(255, 200, 230, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === item.id ? 'rgba(255, 180, 220, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#ffe8f0' }}>
                  ⚓ {item.name}
                </div>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(255, 180, 220, 0.15)',
                  color: '#ffd0e8',
                }}>
                  {item.type}
                </div>
              </div>

              {item.reason && (
                <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.8 }}>
                  {selectedId === item.id
                    ? item.reason
                    : item.reason.length > 80 ? item.reason.slice(0, 80) + '…' : item.reason}
                </div>
              )}

              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 10 }}>
                {new Date(item.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}