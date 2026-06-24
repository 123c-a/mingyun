import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface AwakeningEntry {
  id: string
  title: string
  content: string
  category: string
  planetFocus: string
  createdAt: string
}

const categoryOptions = ['思维觉醒', '情感觉醒', '根基觉醒', '行动觉醒', '扩张觉醒', '综合觉醒']
const planetOptions = ['mercury', 'venus', 'earth', 'mars', 'jupiter']
const planetNamesLocal: Record<string, string> = {
  mercury: '水星（思维）',
  venus: '金星（情感）',
  earth: '地球（根基）',
  mars: '火星（行动）',
  jupiter: '木星（扩张）',
}

export default function MercuryVenusEarthMarsJupiterPage() {
  const config = comboConfigs['mercury-venus-earth-mars-jupiter']
  const [entries, setEntries] = useLocalStorage<AwakeningEntry[]>('combo-mercury-venus-earth-mars-jupiter', [])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('综合觉醒')
  const [planetFocus, setPlanetFocus] = useState('jupiter')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEntry = () => {
    if (!content.trim()) return
    const newEntry: AwakeningEntry = {
      id: `${Date.now()}`,
      title: title.trim() || '觉醒时刻',
      content: content.trim(),
      category,
      planetFocus,
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
    setShowForm(false)
    setTitle('')
    setContent('')
    setSelectedId(newEntry.id)
  }

  const handleExport = () => {
    const items = (entries || []).slice(0, 7).map((e) => ({
      text: e.title.slice(0, 30) + (e.title.length > 30 ? '…' : ''),
      meta: `${e.category}`,
    }))
    if (items.length === 0) items.push({ text: '还没有觉醒记录', meta: '—' })
    exportAsImage(
      '全星觉醒 · 你的完整宇宙',
      '思维、情感、根基、行动、扩张',
      items,
      '#1a1815',
      '#fff8e8',
      '#fff0d8',
      `quanxingjuexing-${Date.now()}.png`
    )
  }

  const planetColorsLocal: Record<string, string> = {
    mercury: '#c2c2ba',
    venus: '#fff8d8',
    earth: '#80b8e8',
    mars: '#f07848',
    jupiter: '#f8c888',
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 240, 216, 0.15)',
          border: '1px solid rgba(255, 240, 216, 0.4)',
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
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* 五星图示 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 30,
          padding: '20px 0',
        }}>
          {planetOptions.map((p) => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${planetColorsLocal[p]}, rgba(0,0,0,0.3))`,
                boxShadow: `0 0 20px ${planetColorsLocal[p]}40`,
                margin: '0 auto 8px',
              }} />
              <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 1 }}>
                {planetNamesLocal[p].split('（')[0]}
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
              background: 'linear-gradient(135deg, rgba(255, 240, 216, 0.25), rgba(255, 216, 176, 0.15))',
              border: '1px solid rgba(255, 240, 216, 0.5)',
              color: '#fff8e8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ✨ 记录觉醒时刻
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 240, 216, 0.06)',
            border: '1px solid rgba(255, 240, 216, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#fff0d8' }}>
              ✨ 记录你的觉醒时刻
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                标题
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="这次觉醒是什么……"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 240, 216, 0.25)',
                  color: '#fff8e8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                觉醒类型
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {categoryOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: category === c ? 'rgba(255, 240, 216, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${category === c ? 'rgba(255, 240, 216, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: category === c ? '#fff0d8' : 'rgba(255,255,255,0.5)',
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
                专注行星
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {planetOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlanetFocus(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 12px',
                      borderRadius: 999,
                      background: planetFocus === p ? `${planetColorsLocal[p]}30` : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${planetFocus === p ? `${planetColorsLocal[p]}60` : 'rgba(255,255,255,0.1)'}`,
                      color: planetFocus === p ? planetColorsLocal[p] : 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: planetColorsLocal[p],
                    }} />
                    {planetNamesLocal[p].split('（')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                觉醒内容
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="那一刻，你明白了什么……"
                style={{
                  width: '100%',
                  minHeight: 120,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 240, 216, 0.25)',
                  color: '#fff8e8',
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
                disabled={!content.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 240, 216, 0.25), rgba(255, 216, 176, 0.15))',
                  border: '1px solid rgba(255, 240, 216, 0.5)',
                  color: '#fff8e8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: content.trim() ? 'pointer' : 'not-allowed',
                  opacity: content.trim() ? 1 : 0.5,
                }}
              >
                ✨ 记录
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
              ✨ 还没有觉醒记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                思维、情感、根基、行动、扩张<br />
                五颗行星汇聚，开启你的全星觉醒之旅
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
                  ? 'linear-gradient(135deg, rgba(255, 240, 216, 0.1), rgba(255, 216, 176, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === entry.id ? 'rgba(255, 240, 216, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: planetColorsLocal[entry.planetFocus],
                    boxShadow: `0 0 10px ${planetColorsLocal[entry.planetFocus]}40`,
                  }} />
                  <div style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#fff8e8',
                  }}>
                    {entry.title}
                  </div>
                </div>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(255, 240, 216, 0.15)',
                  color: '#fff0d8',
                }}>
                  {entry.category}
                </div>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 10, opacity: 0.8 }}>
                {selectedId === entry.id
                  ? entry.content
                  : entry.content.length > 100 ? entry.content.slice(0, 100) + '…' : entry.content}
              </div>

              <div style={{ fontSize: 10, opacity: 0.4 }}>
                {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}