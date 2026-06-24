import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Person {
  id: string
  name: string
  type: 'loves' | 'guides' | 'accompanies'
  story: string
  impact: string
  createdAt: string
}

export default function VenusJupiterSaturnPage() {
  const config = comboConfigs['venus-jupiter-saturn']
  const [people, setPeople] = useLocalStorage<Person[]>('combo-venus-jupiter-saturn', [])
  const [showAdd, setShowAdd] = useState(false)
  const [type, setType] = useState<'loves' | 'guides' | 'accompanies'>('loves')
  const [name, setName] = useState('')
  const [story, setStory] = useState('')
  const [impact, setImpact] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const typeLabels = {
    loves: '💕 爱你的人',
    guides: '🌟 指引你的人',
    accompanies: '🌿 陪伴你的人',
  }

  const addPerson = () => {
    if (!name.trim()) return
    const newPerson: Person = {
      id: `${Date.now()}`,
      name: name.trim(),
      type,
      story: story.trim(),
      impact: impact.trim(),
      createdAt: new Date().toISOString(),
    }
    setPeople([newPerson, ...people])
    setShowAdd(false)
    setName('')
    setStory('')
    setImpact('')
    setSelectedId(newPerson.id)
  }

  const handleExport = () => {
    const items = (people || []).slice(0, 7).map((p) => ({
      text: p.name,
      meta: typeLabels[p.type],
    }))
    if (items.length === 0) items.push({ text: '还没有重要的人', meta: '—' })
    exportAsImage(
      '关系年鉴 · 生命中重要的人',
      '那些爱你的人，那些指引你的人，那些陪伴你走过时间的人',
      items,
      '#1a1510',
      '#fff0d8',
      '#f0d8c0',
      `guanxinianjian-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(240, 216, 192, 0.15)',
          border: '1px solid rgba(240, 216, 192, 0.4)',
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
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(240, 216, 192, 0.25), rgba(255, 216, 160, 0.15))',
              border: '1px solid rgba(240, 216, 192, 0.5)',
              color: '#fff0d8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            💝 记录一个重要的人
          </button>
        </div>

        {showAdd && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(240, 216, 192, 0.06)',
            border: '1px solid rgba(240, 216, 192, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#f0d8c0' }}>
              💝 生命中重要的人
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                TA 是谁？
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="TA的名字……"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(240, 216, 192, 0.25)',
                  color: '#fff0d8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                TA 是你生命中的什么人？
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['loves', 'guides', 'accompanies'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      background: type === t ? 'rgba(240, 216, 192, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${type === t ? 'rgba(240, 216, 192, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: type === t ? '#f0d8c0' : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="你们之间的故事……"
              style={{
                width: '100%',
                minHeight: 80,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 216, 192, 0.25)',
                color: '#fff0d8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 10,
              }}
            />

            <textarea
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="TA在你生命里留下了什么？"
              style={{
                width: '100%',
                minHeight: 60,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 216, 192, 0.25)',
                color: '#fff0d8',
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
                onClick={addPerson}
                disabled={!name.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(240, 216, 192, 0.25), rgba(255, 216, 160, 0.15))',
                  border: '1px solid rgba(240, 216, 192, 0.5)',
                  color: '#fff0d8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  opacity: name.trim() ? 1 : 0.5,
                }}
              >
                💝 记录
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(people || []).length === 0 && !showAdd && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              💝 还没有重要的人记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                那些爱你的人<br />
                那些指引你的人<br />
                那些陪伴你走过时间的人
              </div>
            </div>
          )}

          {(people || []).map((person) => (
            <div
              key={person.id}
              onClick={() => setSelectedId(person.id === selectedId ? null : person.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === person.id
                  ? 'linear-gradient(135deg, rgba(240, 216, 192, 0.1), rgba(255, 216, 160, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === person.id ? 'rgba(240, 216, 192, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{person.name}</div>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(240, 216, 192, 0.12)',
                  color: '#f0d8c0',
                }}>
                  {typeLabels[person.type]}
                </div>
              </div>

              {selectedId === person.id ? (
                <>
                  {person.story && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4, letterSpacing: 1 }}>故事</div>
                      <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>{person.story}</div>
                    </div>
                  )}
                  {person.impact && (
                    <div style={{
                      padding: 12,
                      borderRadius: 10,
                      background: 'rgba(255, 216, 160, 0.08)',
                      marginTop: 10,
                    }}>
                      <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4, letterSpacing: 1, color: '#ffd8a0' }}>
                        💝 TA留下的痕迹
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.7, fontStyle: 'italic' }}>
                        {person.impact}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 12, opacity: 0.5 }}>
                  {person.impact.slice(0, 50)}{person.impact.length > 50 ? '…' : ''}
                </div>
              )}

              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 10 }}>
                {new Date(person.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
