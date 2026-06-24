import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Mentor {
  id: string
  name: string
  relationship: string
  period: string
  story: string
  impact: string
  lesson: string
  createdAt: string
}

export default function JupiterSaturnPage() {
  const config = comboConfigs['jupiter-saturn']
  const [mentors, setMentors] = useLocalStorage<Mentor[]>('combo-jupiter-saturn', [])
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRelationship, setNewRelationship] = useState('')
  const [newPeriod, setNewPeriod] = useState('')
  const [newStory, setNewStory] = useState('')
  const [newImpact, setNewImpact] = useState('')
  const [newLesson, setNewLesson] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addMentor = () => {
    if (!newName.trim()) return
    const newItem: Mentor = {
      id: `${Date.now()}`,
      name: newName.trim(),
      relationship: newRelationship.trim(),
      period: newPeriod.trim(),
      story: newStory.trim(),
      impact: newImpact.trim(),
      lesson: newLesson.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setMentors([newItem, ...mentors])
    setShowAdd(false)
    setNewName('')
    setNewRelationship('')
    setNewPeriod('')
    setNewStory('')
    setNewImpact('')
    setNewLesson('')
  }

  const handleExport = () => {
    const items = (mentors || []).slice(0, 7).map((m) => ({
      text: `${m.name} · ${m.relationship || '贵人'}`,
      meta: m.period || m.lesson || '',
    }))
    if (items.length === 0) items.push({ text: '还没有贵人记录', meta: '—' })
    exportAsImage(
      '贵人年轮 · 时间长河里的相遇',
      '有些人出现在你生命里，不是偶然',
      items,
      '#1a160a',
      '#fff0d0',
      '#f0d8a0',
      `guirennianlun-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(240, 216, 160, 0.15)',
          border: '1px solid rgba(240, 216, 160, 0.4)',
          color: '#fff0d0',
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
            onClick={() => setShowAdd(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(240, 216, 160, 0.25), rgba(224, 200, 130, 0.15))',
              border: '1px solid rgba(240, 216, 160, 0.5)',
              color: '#fff0d0',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ✨ 记录一位贵人
          </button>
        </div>

        {showAdd && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(240, 216, 160, 0.06)',
            border: '1px solid rgba(240, 216, 160, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 30,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#f0d8a0' }}>
              ✨ 那位影响过你的人
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="TA的名字"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(240, 216, 160, 0.25)',
                  color: '#fff0d0',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="text"
                value={newRelationship}
                onChange={(e) => setNewRelationship(e.target.value)}
                placeholder="你们的关系"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(240, 216, 160, 0.25)',
                  color: '#fff0d0',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <input
              type="text"
              value={newPeriod}
              onChange={(e) => setNewPeriod(e.target.value)}
              placeholder="什么时候遇到的？（如：2018年冬 / 大三那年）"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 216, 160, 0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: 12,
              }}
            />

            <textarea
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              placeholder="你们之间的故事……"
              style={{
                width: '100%',
                minHeight: 80,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 216, 160, 0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 10,
              }}
            />

            <textarea
              value={newImpact}
              onChange={(e) => setNewImpact(e.target.value)}
              placeholder="TA对你的影响是……"
              style={{
                width: '100%',
                minHeight: 60,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 216, 160, 0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 10,
              }}
            />

            <textarea
              value={newLesson}
              onChange={(e) => setNewLesson(e.target.value)}
              placeholder="你从TA身上学到的一句话/一个道理"
              style={{
                width: '100%',
                minHeight: 50,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240, 216, 160, 0.25)',
                color: '#fff0d0',
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
                onClick={addMentor}
                disabled={!newName.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(240, 216, 160, 0.25), rgba(224, 200, 130, 0.15))',
                  border: '1px solid rgba(240, 216, 160, 0.5)',
                  color: '#fff0d0',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: newName.trim() ? 'pointer' : 'not-allowed',
                  opacity: newName.trim() ? 1 : 0.5,
                }}
              >
                ✨ 记录
              </button>
            </div>
          </div>
        )}

        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{
            position: 'absolute',
            left: 6,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, rgba(240, 216, 160, 0.3), rgba(240, 216, 160, 0.1))',
            borderRadius: 1,
          }} />

          {(mentors || []).length === 0 && !showAdd && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              ✨ 还没有贵人记录
              <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
                那些出现在你生命里的人，都在年轮里
              </div>
            </div>
          )}

          {(mentors || []).map((mentor) => (
            <div
              key={mentor.id}
              onClick={() => setSelectedId(mentor.id === selectedId ? null : mentor.id)}
              style={{
                position: 'relative',
                marginBottom: 16,
                cursor: 'pointer',
              }}
            >
              <div style={{
                position: 'absolute',
                left: -20,
                top: 18,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#f0d8a0',
                border: '3px solid #1a160a',
                boxShadow: '0 0 10px rgba(240, 216, 160, 0.5)',
              }} />

              <div style={{
                padding: 16,
                borderRadius: 14,
                background: selectedId === mentor.id
                  ? 'linear-gradient(135deg, rgba(240, 216, 160, 0.1), rgba(224, 200, 130, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === mentor.id ? 'rgba(240, 216, 160, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>
                    {mentor.name}
                    {mentor.relationship && (
                      <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 8, fontWeight: 'normal' }}>
                        · {mentor.relationship}
                      </span>
                    )}
                  </div>
                  {mentor.period && (
                    <span style={{ fontSize: 11, color: '#f0d8a0', opacity: 0.7 }}>{mentor.period}</span>
                  )}
                </div>

                {mentor.lesson && (
                  <div style={{
                    fontSize: 13,
                    color: '#f0d8a0',
                    fontStyle: 'italic',
                    marginBottom: selectedId === mentor.id ? 12 : 0,
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}>
                    "{mentor.lesson}"
                  </div>
                )}

                {selectedId === mentor.id && (
                  <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {mentor.story && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4, letterSpacing: 1 }}>故事</div>
                        <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>{mentor.story}</div>
                      </div>
                    )}
                    {mentor.impact && (
                      <div>
                        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4, letterSpacing: 1 }}>影响</div>
                        <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>{mentor.impact}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
