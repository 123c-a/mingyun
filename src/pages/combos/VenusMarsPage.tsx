import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

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

interface TruthItem {
  id: string
  to: string
  content: string
  relationship: string
  sent: boolean
  createdAt: string
}

interface LoveLanguageRecord {
  id: string
  type: 'words' | 'quality' | 'gifts' | 'service' | 'touch'
  person: string
  expression: string
  createdAt: string
}

interface ConflictItem {
  id: string
  person: string
  situation: string
  myFeeling: string
  theirAngle: string
  lesson: string
  resolved: boolean
  createdAt: string
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

const LOVE_LANGUAGES = [
  { type: 'words' as const, name: '肯定的言词', icon: '💬', desc: '用语言表达爱意' },
  { type: 'quality' as const, name: '精心时刻', icon: '⏰', desc: '专注的陪伴时间' },
  { type: 'gifts' as const, name: '接受礼物', icon: '🎁', desc: '用心准备的礼物' },
  { type: 'service' as const, name: '服务行动', icon: '🤝', desc: '为对方做事' },
  { type: 'touch' as const, name: '身体接触', icon: '🤗', desc: '肢体接触表达' },
]

const PRIMARY_COLOR = '#ff9fb8'
const SECONDARY_COLOR = '#ff8a5a'

function TrialModule({ missions, setMissions }: {
  missions: LoveMission[]
  setMissions: (fn: (prev: LoveMission[]) => LoveMission[]) => void
}) {
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
    setMissions((prev) => [newMission, ...prev])
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

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return '#ffb8d8'
      case 2: return '#ff90b0'
      case 3: return '#ff7090'
      default: return '#ffb8d8'
    }
  }

  const stats = {
    total: missions.length,
    completed: missions.filter(m => m.completed).length,
    totalTrials: missions.reduce((sum, m) => sum + m.trials.filter(t => t.done).length, 0),
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '试炼对象', value: stats.total, icon: '🔥' },
          { label: '已完成', value: stats.completed, icon: '🏆' },
          { label: '试炼通过', value: stats.totalTrials, icon: '✨' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            padding: '14px 40px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}60`,
            color: '#ffe0ea', fontSize: 13, letterSpacing: 4,
            cursor: 'pointer', backdropFilter: 'blur(6px)',
          }}
        >
          🔥 开启爱火试炼
        </button>
      </div>

      {showCreate && (
        <div style={mainCardStyle}>
          <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR }}>
            ✨ 这段关系里，你想鼓起什么勇气？
          </div>
          <input type="text" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="TA是谁？" style={inputStyle} />
          <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="你们的关系是？" style={inputStyle} />
          <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="你想在这段关系里改变什么？" style={textAreaStyle} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowCreate(false)} style={cancelBtnStyle}>取消</button>
            <button onClick={createMission} disabled={!person.trim()} style={{ ...primaryBtnStyle, opacity: person.trim() ? 1 : 0.5, cursor: person.trim() ? 'pointer' : 'not-allowed' }}>
              🔥 开始试炼
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {missions.length === 0 && !showCreate && (
          <div style={{ textAlign: 'center', padding: 60, opacity: 0.3, fontSize: 13, letterSpacing: 3 }}>
            🔥 还没有勇气试炼
          </div>
        )}
        {missions.map((mission) => {
          const progress = getProgress(mission)
          return (
            <div
              key={mission.id}
              onClick={() => setSelectedId(mission.id === selectedId ? null : mission.id)}
              style={{
                padding: 18, borderRadius: 14, cursor: 'pointer',
                background: mission.completed
                  ? `linear-gradient(135deg, ${PRIMARY_COLOR}15, ${SECONDARY_COLOR}08)`
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${mission.completed ? PRIMARY_COLOR + '40' : 'rgba(255,255,255,0.08)'}`,
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
              {mission.goal && <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, lineHeight: 1.6 }}>{mission.goal}</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`, width: `${progress}%`, transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR, minWidth: 45, textAlign: 'right' }}>{progress}%</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, opacity: 0.5 }}>
                {mission.trials.filter(t => t.done).length}/{mission.trials.length} 个试炼完成
              </div>
              {selectedId === mission.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {mission.trials.map((trial) => (
                      <div
                        key={trial.id}
                        onClick={(e) => { e.stopPropagation(); toggleTrial(mission.id, trial.id) }}
                        style={{
                          display: 'flex', gap: 12, padding: 12, borderRadius: 10, cursor: 'pointer',
                          background: trial.done ? `${PRIMARY_COLOR}15` : 'rgba(0,0,0,0.15)',
                          border: `1px solid ${trial.done ? PRIMARY_COLOR + '40' : 'rgba(255,255,255,0.06)'}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          background: trial.done ? getLevelColor(trial.level) : 'transparent',
                          border: `2px solid ${getLevelColor(trial.level)}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, color: '#1a0a15', fontWeight: 'bold',
                        }}>
                          {trial.done ? '✓' : trial.level}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, marginBottom: 4, textDecoration: trial.done ? 'line-through' : 'none', opacity: trial.done ? 0.5 : 1 }}>
                            {trial.title}
                          </div>
                          <div style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.5 }}>{trial.description}</div>
                          {trial.done && trial.doneAt && <div style={{ fontSize: 10, color: PRIMARY_COLOR, marginTop: 4 }}>✨ {trial.doneAt} 完成</div>}
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
  )
}

function TruthModule({ truths, setTruths }: {
  truths: TruthItem[]
  setTruths: (fn: (prev: TruthItem[]) => TruthItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [to, setTo] = useState('')
  const [content, setContent] = useState('')
  const [relationship, setRelationship] = useState('')

  const addTruth = () => {
    if (!content.trim()) return
    const item: TruthItem = {
      id: `${Date.now()}`,
      to: to.trim() || '某个人',
      content: content.trim(),
      relationship: relationship.trim(),
      sent: false,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setTruths((prev) => [item, ...prev])
    setShowForm(false)
    setTo('')
    setContent('')
    setRelationship('')
  }

  const toggleSent = (id: string) => {
    setTruths((prev) => prev.map((t) => t.id === id ? { ...t, sent: !t.sent } : t))
  }

  const stats = {
    total: truths.length,
    sent: truths.filter(t => t.sent).length,
    held: truths.filter(t => !t.sent).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '真心话', value: stats.total, icon: '💬' },
          { label: '已送出', value: stats.sent, icon: '📬' },
          { label: '藏在心里', value: stats.held, icon: '🔒' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button onClick={() => setShowForm(true)} style={{
          padding: '14px 40px', borderRadius: 999,
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
          border: `1px solid ${PRIMARY_COLOR}60`,
          color: '#ffe0ea', fontSize: 13, letterSpacing: 4, cursor: 'pointer',
        }}>
          💬 说一句真心话
        </button>
      </div>

      {showForm && (
        <div style={mainCardStyle}>
          <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR }}>
            💬 你想说什么真心话？
          </div>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="想对谁说？" style={inputStyle} />
          <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="你们的关系（可选）" style={inputStyle} />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="写下你的真心话……" style={{ ...textAreaStyle, minHeight: 100 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>取消</button>
            <button onClick={addTruth} disabled={!content.trim()} style={{ ...primaryBtnStyle, opacity: content.trim() ? 1 : 0.5, cursor: content.trim() ? 'pointer' : 'not-allowed' }}>
              💾 保存
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {truths.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: 60, opacity: 0.3, fontSize: 13 }}>💬 还没有真心话</div>
        )}
        {truths.slice(0, 5).map((t) => (
          <div key={t.id} style={{
            padding: 16, borderRadius: 12,
            background: t.sent ? 'rgba(200, 240, 216, 0.06)' : `${PRIMARY_COLOR}08`,
            border: `1px solid ${t.sent ? 'rgba(200, 240, 216, 0.2)' : PRIMARY_COLOR + '20'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>致 {t.to}{t.relationship && ` · ${t.relationship}`}</span>
              <button onClick={() => toggleSent(t.id)} style={{
                padding: '4px 10px', borderRadius: 999, fontSize: 10,
                background: t.sent ? 'rgba(200, 240, 216, 0.2)' : `${PRIMARY_COLOR}20`,
                border: `1px solid ${t.sent ? 'rgba(200, 240, 216, 0.4)' : PRIMARY_COLOR + '40'}`,
                color: t.sent ? '#c8f0d8' : PRIMARY_COLOR, cursor: 'pointer',
              }}>
                {t.sent ? '📬 已送出' : '🔒 藏在心里'}
              </button>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>{t.content}</div>
            <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{t.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoveLanguageModule({ records, setRecords }: {
  records: LoveLanguageRecord[]
  setRecords: (fn: (prev: LoveLanguageRecord[]) => LoveLanguageRecord[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState<LoveLanguageRecord['type']>('words')
  const [person, setPerson] = useState('')
  const [expression, setExpression] = useState('')

  const saveRecord = () => {
    if (!expression.trim()) return
    const newItem: LoveLanguageRecord = {
      id: `${Date.now()}`,
      type: selectedType,
      person: person.trim() || '自己',
      expression: expression.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [newItem, ...prev])
    setShowForm(false)
    setPerson('')
    setExpression('')
  }

  const getTypeCount = () => {
    const count: Record<LoveLanguageRecord['type'], number> = { words: 0, quality: 0, gifts: 0, service: 0, touch: 0 }
    records.forEach(r => { count[r.type]++ })
    return count
  }

  const typeCount = getTypeCount()
  const mostUsedType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]
  const mostUsedLang = LOVE_LANGUAGES.find(l => l.type === mostUsedType?.[0])
  const coveredTypes = Object.values(typeCount).filter(c => c > 0).length

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '爱的表达', value: records.length, icon: '💕' },
          { label: '主要爱语', value: mostUsedLang?.name || '-', icon: '✨' },
          { label: '覆盖类型', value: coveredTypes, icon: '🌈' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: records.length > 0 && s.label === '主要爱语' ? 14 : 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{
          width: '100%', padding: 20, borderRadius: 16, marginBottom: 24,
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}20, ${SECONDARY_COLOR}08)`,
          border: `2px dashed ${PRIMARY_COLOR}50`,
          color: PRIMARY_COLOR, fontSize: 14, letterSpacing: 3, cursor: 'pointer',
        }}>
          💕 记录一次爱的表达
        </button>
      )}

      {showForm && (
        <div style={mainCardStyle}>
          <div style={{ fontSize: 14, marginBottom: 16, color: PRIMARY_COLOR, letterSpacing: 2 }}>
            💕 今天你表达爱了吗？
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 10 }}>选择爱的语言</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
            {LOVE_LANGUAGES.map(lang => (
              <button key={lang.type} onClick={() => setSelectedType(lang.type)} style={{
                padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                background: selectedType === lang.type ? `${PRIMARY_COLOR}25` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedType === lang.type ? PRIMARY_COLOR : 'rgba(255,255,255,0.1)'}`,
                color: selectedType === lang.type ? PRIMARY_COLOR : 'rgba(255,224,234,0.6)',
                fontSize: 11, textAlign: 'center', transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{lang.icon}</div>
                <div>{lang.name}</div>
              </button>
            ))}
          </div>
          <input type="text" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="对谁表达的？" style={inputStyle} />
          <textarea value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="具体做了什么/说了什么……" style={textAreaStyle} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>取消</button>
            <button onClick={saveRecord} disabled={!expression.trim()} style={{ ...primaryBtnStyle, opacity: expression.trim() ? 1 : 0.5, cursor: expression.trim() ? 'pointer' : 'not-allowed' }}>
              💾 记录
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {records.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: 60, opacity: 0.3, fontSize: 13 }}>💕 还没有记录</div>
        )}
        {records.slice(0, 5).map((r) => {
          const lang = LOVE_LANGUAGES.find(l => l.type === r.type)
          return (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>{lang?.icon} {lang?.name} · {r.person}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{r.expression}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ConflictModule({ conflicts, setConflicts }: {
  conflicts: ConflictItem[]
  setConflicts: (fn: (prev: ConflictItem[]) => ConflictItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [person, setPerson] = useState('')
  const [situation, setSituation] = useState('')
  const [myFeeling, setMyFeeling] = useState('')
  const [theirAngle, setTheirAngle] = useState('')
  const [lesson, setLesson] = useState('')

  const addConflict = () => {
    if (!situation.trim()) return
    const item: ConflictItem = {
      id: `${Date.now()}`,
      person: person.trim() || '某人',
      situation: situation.trim(),
      myFeeling: myFeeling.trim(),
      theirAngle: theirAngle.trim(),
      lesson: lesson.trim(),
      resolved: false,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setConflicts((prev) => [item, ...prev])
    setShowForm(false)
    setPerson('')
    setSituation('')
    setMyFeeling('')
    setTheirAngle('')
    setLesson('')
  }

  const toggleResolved = (id: string) => {
    setConflicts((prev) => prev.map((c) => c.id === id ? { ...c, resolved: !c.resolved } : c))
  }

  const stats = {
    total: conflicts.length,
    resolved: conflicts.filter(c => c.resolved).length,
    pending: conflicts.filter(c => !c.resolved).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '冲突记录', value: stats.total, icon: '⚖️' },
          { label: '已和解', value: stats.resolved, icon: '🤝' },
          { label: '待处理', value: stats.pending, icon: '💭' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button onClick={() => setShowForm(true)} style={{
          padding: '14px 40px', borderRadius: 999,
          background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
          border: `1px solid ${PRIMARY_COLOR}60`,
          color: '#ffe0ea', fontSize: 13, letterSpacing: 4, cursor: 'pointer',
        }}>
          ⚖️ 记录一次冲突
        </button>
      </div>

      {showForm && (
        <div style={mainCardStyle}>
          <div style={{ fontSize: 14, marginBottom: 16, color: PRIMARY_COLOR, letterSpacing: 2 }}>
            ⚖️ 把冲突变成成长
          </div>
          <input type="text" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="和谁的冲突？" style={inputStyle} />
          <textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="发生了什么事？" style={textAreaStyle} />
          <textarea value={myFeeling} onChange={(e) => setMyFeeling(e.target.value)} placeholder="我当时的感受是……" style={textAreaStyle} />
          <textarea value={theirAngle} onChange={(e) => setTheirAngle(e.target.value)} placeholder="站在TA的角度，可能是因为……" style={textAreaStyle} />
          <textarea value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder="我从中学到了……" style={textAreaStyle} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>取消</button>
            <button onClick={addConflict} disabled={!situation.trim()} style={{ ...primaryBtnStyle, opacity: situation.trim() ? 1 : 0.5, cursor: situation.trim() ? 'pointer' : 'not-allowed' }}>
              💾 记录
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {conflicts.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: 60, opacity: 0.3, fontSize: 13 }}>⚖️ 还没有冲突记录</div>
        )}
        {conflicts.slice(0, 5).map((c) => (
          <div key={c.id} style={{
            padding: 16, borderRadius: 12,
            background: c.resolved ? 'rgba(200, 240, 216, 0.06)' : `${PRIMARY_COLOR}08`,
            border: `1px solid ${c.resolved ? 'rgba(200, 240, 216, 0.2)' : PRIMARY_COLOR + '20'}`,
            opacity: c.resolved ? 0.7 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>与 {c.person} 的冲突</span>
              <button onClick={() => toggleResolved(c.id)} style={{
                padding: '4px 10px', borderRadius: 999, fontSize: 10,
                background: c.resolved ? 'rgba(200, 240, 216, 0.2)' : `${PRIMARY_COLOR}20`,
                border: `1px solid ${c.resolved ? 'rgba(200, 240, 216, 0.4)' : PRIMARY_COLOR + '40'}`,
                color: c.resolved ? '#c8f0d8' : PRIMARY_COLOR, cursor: 'pointer',
              }}>
                {c.resolved ? '🤝 已和解' : '⏳ 待处理'}
              </button>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}><strong>事件：</strong>{c.situation}</div>
            {c.myFeeling && <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6, marginBottom: 4 }}>💭 我的感受：{c.myFeeling}</div>}
            {c.theirAngle && <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6, marginBottom: 4 }}>👀 TA的角度：{c.theirAngle}</div>}
            {c.lesson && <div style={{ fontSize: 12, color: '#c8f0d8', lineHeight: 1.6 }}>✨ 学到的：{c.lesson}</div>}
            <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{c.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const statCardStyle: React.CSSProperties = {
  padding: 16, borderRadius: 14, textAlign: 'center',
  background: `${PRIMARY_COLOR}08`,
  border: `1px solid ${PRIMARY_COLOR}20`,
  backdropFilter: 'blur(10px)',
}

const mainCardStyle: React.CSSProperties = {
  padding: 24, borderRadius: 20, marginBottom: 24,
  background: `${PRIMARY_COLOR}08`,
  border: `1px solid ${PRIMARY_COLOR}25`,
  backdropFilter: 'blur(10px)',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#ffe0ea', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#ffe0ea', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: '12px 20px', borderRadius: 999,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.6)', fontSize: 12, letterSpacing: 2, cursor: 'pointer',
}

const primaryBtnStyle: React.CSSProperties = {
  flex: 1, padding: '12px 20px', borderRadius: 999,
  background: `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}30)`,
  border: `1px solid ${PRIMARY_COLOR}60`,
  color: '#ffe0ea', fontSize: 12, letterSpacing: 3,
}

const TAB_LIST = [
  { id: 'trial', name: '爱火试炼', icon: '🔥' },
  { id: 'truth', name: '真心话', icon: '💬' },
  { id: 'language', name: '爱的语言', icon: '💕' },
  { id: 'conflict', name: '冲突炼金', icon: '⚖️' },
]

export default function VenusMarsPage() {
  const config = comboConfigs['venus-mars']
  const [activeTab, setActiveTab] = useState<string>('trial')
  const [missions, setMissions] = useLocalStorage<LoveMission[]>('vm-missions', [])
  const [truths, setTruths] = useLocalStorage<TruthItem[]>('vm-truths', [])
  const [loveLangRecords, setLoveLangRecords] = useLocalStorage<LoveLanguageRecord[]>('vm-love-languages', [])
  const [conflicts, setConflicts] = useLocalStorage<ConflictItem[]>('vm-conflicts', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#ffe0ea' : 'rgba(255,255,255,0.5)',
    fontSize: 13, letterSpacing: 2, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(6px)',
  })

  const contentStyle: React.CSSProperties = { maxWidth: 640, margin: '0 auto' }

  return (
    <ComboShell config={config}>
      <div style={tabContainerStyle}>
        {TAB_LIST.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabButtonStyle(activeTab === tab.id)}>
            <span style={{ marginRight: 6 }}>{tab.icon}</span>{tab.name}
          </button>
        ))}
      </div>
      <div style={contentStyle}>
        {activeTab === 'trial' && <TrialModule missions={missions} setMissions={setMissions} />}
        {activeTab === 'truth' && <TruthModule truths={truths} setTruths={setTruths} />}
        {activeTab === 'language' && <LoveLanguageModule records={loveLangRecords} setRecords={setLoveLangRecords} />}
        {activeTab === 'conflict' && <ConflictModule conflicts={conflicts} setConflicts={setConflicts} />}
      </div>
    </ComboShell>
  )
}
