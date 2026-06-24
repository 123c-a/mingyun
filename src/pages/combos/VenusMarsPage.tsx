import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Trial {
  id: string
  title: string
  level: number
  description: string
  done: boolean
  doneAt?: string
}

interface LoveMission {
  id: string
  person: string
  relationship: string
  goal: string
  trials: Trial[]
  createdAt: string
  completed?: boolean
}

const defaultTrials = [
  { id: 't1', title: '想一件TA的好', level: 1, description: '认真想一件TA最近做过的让你感到温暖的小事' },
  { id: 't2', title: '说一声谢谢', level: 1, description: '对TA说一句真诚的"谢谢"，具体到某件事' },
  { id: 't3', title: '主动发一条消息', level: 2, description: '主动发一条不是"在吗"的消息，分享你此刻的感受' },
  { id: 't4', title: '表达一个欣赏', level: 2, description: '告诉TA你欣赏TA的哪个特质，为什么' },
  { id: 't5', title: '一起做件小事', level: 3, description: '邀请TA一起做一件简单的事，比如散步/喝杯东西' },
  { id: 't6', title: '说出你的真实想法', level: 3, description: '在一件事上坦诚说出你的真实想法，即使可能不同' },
  { id: 't7', title: '给一个拥抱', level: 3, description: '给TA一个真诚的拥抱，持续3秒以上' },
]

export default function VenusMarsPage() {
  const config = comboConfigs['venus-mars']
  const [missions, setMissions] = useLocalStorage<LoveMission[]>('combo-venus-mars', [])
  const [showCreate, setShowCreate] = useState(false)
  const [person, setPerson] = useState('')
  const [relationship, setRelationship] = useState('')
  const [goal, setGoal] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const createMission = () => {
    if (!person.trim()) return
    const newMission: LoveMission = {
      id: `${Date.now()}`,
      person: person.trim(),
      relationship: relationship.trim(),
      goal: goal.trim(),
      trials: defaultTrials.map((t) => ({ ...t, done: false })),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setMissions([newMission, ...missions])
    setShowCreate(false)
    setPerson('')
    setRelationship('')
    setGoal('')
  }

  const toggleTrial = (missionId: string, trialId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m
        const updated = m.trials.map((t) =>
          t.id === trialId
            ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toLocaleDateString('zh-CN') : undefined }
            : t
        )
        const allDone = updated.every((t) => t.done)
        return { ...m, trials: updated, completed: allDone }
      })
    )
  }

  const getProgress = (mission: LoveMission) => {
    if (mission.trials.length === 0) return 0
    const done = mission.trials.filter((t) => t.done).length
    return Math.round((done / mission.trials.length) * 100)
  }

  const handleExport = () => {
    const items = (missions || []).slice(0, 7).map((m) => ({
      text: `${m.person} · ${m.relationship || '关系'}`,
      meta: `${getProgress(m)}% · ${m.trials.filter(t => t.done).length}/${m.trials.length}试炼`,
    }))
    if (items.length === 0) items.push({ text: '还没有勇气试炼', meta: '—' })
    exportAsImage(
      '爱火试炼 · 勇气修行',
      '金星的温柔，火星的勇气',
      items,
      '#1a0a15',
      '#ffd0e0',
      '#ff7090',
      `aihuoshilian-${Date.now()}.png`
    )
  }

  const selectedMission = missions?.find((m) => m.id === selectedId)

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return '#ffb8d8'
      case 2: return '#ff90b0'
      case 3: return '#ff7090'
      default: return '#ffb8d8'
    }
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 112, 144, 0.15)',
          border: '1px solid rgba(255, 112, 144, 0.4)',
          color: '#ffd0e0',
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
            onClick={() => setShowCreate(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(255, 112, 144, 0.3), rgba(255, 150, 100, 0.2))',
              border: '1px solid rgba(255, 112, 144, 0.5)',
              color: '#ffe0ea',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🔥 开启爱火试炼
          </button>
        </div>

        {showCreate && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 112, 144, 0.06)',
            border: '1px solid rgba(255, 112, 144, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 30,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ff90b0' }}>
              ✨ 这段关系里，你想鼓起什么勇气？
            </div>

            <input
              type="text"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="TA是谁？"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 112, 144, 0.25)',
                color: '#ffe0ea',
                fontSize: 14,
                outline: 'none',
                marginBottom: 12,
                fontFamily: 'inherit',
              }}
            />

            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="你们的关系是？（朋友/恋人/家人/同事…）"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 112, 144, 0.25)',
                color: '#ffe0ea',
                fontSize: 14,
                outline: 'none',
                marginBottom: 12,
                fontFamily: 'inherit',
              }}
            />

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="你想在这段关系里改变什么？"
              style={{
                width: '100%',
                minHeight: 60,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 112, 144, 0.25)',
                color: '#ffe0ea',
                fontSize: 13,
                outline: 'none',
                marginBottom: 20,
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
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
                onClick={createMission}
                disabled={!person.trim()}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 112, 144, 0.3), rgba(255, 150, 100, 0.2))',
                  border: '1px solid rgba(255, 112, 144, 0.5)',
                  color: '#ffe0ea',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: person.trim() ? 'pointer' : 'not-allowed',
                  opacity: person.trim() ? 1 : 0.5,
                }}
              >
                🔥 开始试炼
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(missions || []).length === 0 && !showCreate && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              🔥 还没有勇气试炼
              <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
                爱需要勇气，点击上方按钮开始你的修行
              </div>
            </div>
          )}

          {(missions || []).map((mission) => {
            const progress = getProgress(mission)
            return (
              <div
                key={mission.id}
                onClick={() => setSelectedId(mission.id === selectedId ? null : mission.id)}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: mission.completed
                    ? 'linear-gradient(135deg, rgba(255, 112, 144, 0.12), rgba(255, 150, 100, 0.08))'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${mission.completed ? 'rgba(255, 112, 144, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>
                    {mission.completed && '🏆 '}{mission.person}
                    {mission.relationship && <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 8 }}>{mission.relationship}</span>}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{mission.createdAt}</div>
                </div>

                {mission.goal && (
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, lineHeight: 1.6 }}>
                    {mission.goal}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #ff90b0, #ff7090)',
                        width: `${progress}%`,
                        transition: 'width 0.5s ease-out',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: '#ff90b0', minWidth: 45, textAlign: 'right' }}>
                    {progress}%
                  </span>
                </div>

                <div style={{ marginTop: 10, fontSize: 11, opacity: 0.5 }}>
                  {mission.trials.filter(t => t.done).length}/{mission.trials.length} 个试炼完成
                </div>

                {selectedId === mission.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: 11, color: '#ff90b0', marginBottom: 12, letterSpacing: 2 }}>🔥 爱火试炼列表</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {mission.trials.map((trial) => (
                        <div
                          key={trial.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTrial(mission.id, trial.id)
                          }}
                          style={{
                            display: 'flex',
                            gap: 12,
                            padding: 12,
                            borderRadius: 10,
                            background: trial.done
                              ? 'rgba(255, 112, 144, 0.1)'
                              : 'rgba(0,0,0,0.15)',
                            border: `1px solid ${trial.done ? 'rgba(255, 112, 144, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: trial.done ? getLevelColor(trial.level) : 'transparent',
                            border: `2px solid ${getLevelColor(trial.level)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 12,
                            color: '#1a0a15',
                            fontWeight: 'bold',
                          }}>
                            {trial.done ? '✓' : trial.level}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: 13,
                              marginBottom: 4,
                              textDecoration: trial.done ? 'line-through' : 'none',
                              opacity: trial.done ? 0.5 : 1,
                            }}>
                              {trial.title}
                            </div>
                            <div style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.5 }}>
                              {trial.description}
                            </div>
                            {trial.done && trial.doneAt && (
                              <div style={{ fontSize: 10, color: '#ff90b0', marginTop: 4 }}>
                                ✨ {trial.doneAt} 完成
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </ComboShell>
  )
}
