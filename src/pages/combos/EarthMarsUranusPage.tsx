import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Breakthrough {
  id: string
  stuck: string
  breakthrough: string
  action: string
  createdAt: string
}

export default function EarthMarsUranusPage() {
  const config = comboConfigs['earth-mars-uranus']
  const [breakthroughs, setBreakthroughs] = useLocalStorage<Breakthrough[]>('combo-earth-mars-uranus', [])
  const [showForm, setShowForm] = useState(false)
  const [stuck, setStuck] = useState('')
  const [breakthrough, setBreakthrough] = useState('')
  const [action, setAction] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addBreakthrough = () => {
    if (!stuck.trim()) return
    const newItem: Breakthrough = {
      id: `${Date.now()}`,
      stuck: stuck.trim(),
      breakthrough: breakthrough.trim(),
      action: action.trim(),
      createdAt: new Date().toISOString(),
    }
    setBreakthroughs([newItem, ...breakthroughs])
    setShowForm(false)
    setStuck('')
    setBreakthrough('')
    setAction('')
    setSelectedId(newItem.id)
  }

  const handleExport = () => {
    const items = (breakthroughs || []).slice(0, 7).map((b) => ({
      text: b.stuck.slice(0, 35) + (b.stuck.length > 35 ? '…' : ''),
      meta: b.action || '已突破',
    }))
    if (items.length === 0) items.push({ text: '还没有突破记录', meta: '—' })
    exportAsImage(
      '突破行动 · 打破困局',
      '地球是根基，火星是燃料，天王星是那一下顿悟',
      items,
      '#1a1520',
      '#ffd8c0',
      '#ffb090',
      `tuopoxingdong-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 176, 144, 0.15)',
          border: '1px solid rgba(255, 176, 144, 0.4)',
          color: '#ffd8c0',
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
              background: 'linear-gradient(135deg, rgba(255, 176, 144, 0.25), rgba(168, 224, 232, 0.15))',
              border: '1px solid rgba(255, 176, 144, 0.5)',
              color: '#ffd8c0',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ⚡ 记录一个突破
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 176, 144, 0.06)',
            border: '1px solid rgba(255, 176, 144, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffb090' }}>
              ⚡ 这是你的突破三部曲
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                🌍 我被困在哪里？
              </div>
              <textarea
                value={stuck}
                onChange={(e) => setStuck(e.target.value)}
                placeholder="描述那个困住你的模式或局面……"
                style={{
                  width: '100%',
                  minHeight: 80,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 176, 144, 0.25)',
                  color: '#ffd8c0',
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
                💥 突然想通了什么？
              </div>
              <textarea
                value={breakthrough}
                onChange={(e) => setBreakthrough(e.target.value)}
                placeholder="那个顿悟是什么？"
                style={{
                  width: '100%',
                  minHeight: 60,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(168, 224, 232, 0.25)',
                  color: '#ffd8c0',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                🔥 我要做什么？
              </div>
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="从今天开始，第一步行动是什么？"
                style={{
                  width: '100%',
                  minHeight: 60,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 176, 144, 0.25)',
                  color: '#ffd8c0',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
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
                onClick={addBreakthrough}
                disabled={!stuck.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 176, 144, 0.25), rgba(168, 224, 232, 0.15))',
                  border: '1px solid rgba(255, 176, 144, 0.5)',
                  color: '#ffd8c0',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: stuck.trim() ? 'pointer' : 'not-allowed',
                  opacity: stuck.trim() ? 1 : 0.5,
                }}
              >
                ⚡ 记录突破
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(breakthroughs || []).length === 0 && !showForm && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              ⚡ 还没有突破记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                地球是根基<br />
                火星是燃料<br />
                天王星是那一下顿悟
              </div>
            </div>
          )}

          {(breakthroughs || []).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === item.id
                  ? 'linear-gradient(135deg, rgba(255, 176, 144, 0.1), rgba(168, 224, 232, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === item.id ? 'rgba(255, 176, 144, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>🌍</span>
                <div style={{ fontSize: 13, opacity: 0.7 }}>困局</div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: selectedId === item.id ? 14 : 0 }}>
                {item.stuck.length > 60 ? item.stuck.slice(0, 60) + '…' : item.stuck}
              </div>

              {selectedId === item.id && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>💥</span>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>顿悟</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#a8e0e8', marginBottom: 12 }}>
                    {item.breakthrough}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>🔥</span>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>行动</div>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: '#ffb090' }}>
                    {item.action}
                  </div>
                </>
              )}

              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 12 }}>
                {new Date(item.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
