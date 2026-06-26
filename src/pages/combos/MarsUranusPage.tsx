import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Flash {
  id: string
  inspiration: string
  executed: boolean
  result: string
  createdAt: string
}

interface Inertia {
  id: string
  oldHabit: string
  newAction: string
  days: number
  createdAt: string
}

interface Mission {
  id: string
  content: string
  urgency: string
  completed: boolean
  createdAt: string
}

interface Burst {
  id: string
  moment: string
  action: string
  feeling: string
  createdAt: string
}

const URGENCY_OPTIONS = ['🔴 紧急', '🟠 高', '🟡 中', '🟢 低']

function FlashModule({ flashes, setFlashes }: {
  flashes: Flash[]
  setFlashes: (fn: (prev: Flash[]) => Flash[]) => void
}) {
  const [inspiration, setInspiration] = useState('')
  const [executed, setExecuted] = useState(false)
  const [result, setResult] = useState('')

  const addFlash = () => {
    if (!inspiration.trim()) return
    const item: Flash = {
      id: `${Date.now()}`,
      inspiration: inspiration.trim(),
      executed,
      result: result.trim(),
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setFlashes((prev) => [item, ...prev])
    setInspiration('')
    setExecuted(false)
    setResult('')
  }

  const stats = {
    total: flashes.length,
    executed: flashes.filter(f => f.executed).length,
    withResult: flashes.filter(f => f.result).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '闪电行动', value: stats.total, icon: '⚡' },
          { label: '已执行', value: stats.executed, icon: '✅' },
          { label: '有结果', value: stats.withResult, icon: '🎯' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          ⚡ 闪电行动
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          灵感来了就立刻行动
        </div>

        <textarea
          value={inspiration}
          onChange={(e) => setInspiration(e.target.value)}
          placeholder="你的行动灵感是什么？"
          style={textAreaStyle}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={executed}
            onChange={(e) => setExecuted(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, opacity: 0.8 }}>是否已经执行？</span>
        </div>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addFlash}
          disabled={!inspiration.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: inspiration.trim() ? 'pointer' : 'not-allowed',
            opacity: inspiration.trim() ? 1 : 0.5,
          }}
        >
          ⚡ 闪电记录
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的闪电行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {flashes.slice(0, 5).map((f) => (
            <div key={f.id} style={{
              padding: 14, borderRadius: 12,
              background: f.executed ? 'rgba(255, 144, 192, 0.12)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${f.executed ? 'rgba(255, 144, 192, 0.4)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, fontWeight: 500 }}>
                  ⚡ {f.inspiration}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: f.executed ? 'rgba(160, 240, 192, 0.2)' : 'rgba(255, 200, 100, 0.2)', color: f.executed ? '#a0f0c0' : '#ffc864' }}>
                  {f.executed ? '✅ 已执行' : '⏳ 待执行'}
                </span>
              </div>
              {f.result && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  🎯 结果：{f.result}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{f.createdAt}</div>
            </div>
          ))}
          {flashes.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有闪电行动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InertiaModule({ inertias, setInertias }: {
  inertias: Inertia[]
  setInertias: (fn: (prev: Inertia[]) => Inertia[]) => void
}) {
  const [oldHabit, setOldHabit] = useState('')
  const [newAction, setNewAction] = useState('')
  const [days, setDays] = useState(0)

  const addInertia = () => {
    if (!oldHabit.trim()) return
    const item: Inertia = {
      id: `${Date.now()}`,
      oldHabit: oldHabit.trim(),
      newAction: newAction.trim(),
      days,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setInertias((prev) => [item, ...prev])
    setOldHabit('')
    setNewAction('')
    setDays(0)
  }

  const stats = {
    total: inertias.length,
    withNewAction: inertias.filter(i => i.newAction).length,
    totalDays: inertias.reduce((sum, i) => sum + i.days, 0),
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '打破惯性', value: stats.total, icon: '💥' },
          { label: '新行动', value: stats.withNewAction, icon: '🌟' },
          { label: '总坚持天数', value: stats.totalDays, icon: '📅' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          💥 打破惯性
        </div>

        <textarea
          value={oldHabit}
          onChange={(e) => setOldHabit(e.target.value)}
          placeholder="你想打破什么旧惯性？"
          style={textAreaStyle}
        />
        <textarea
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          placeholder="取而代之的新行动是什么？"
          style={textAreaStyle}
        />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>坚持天数：{days} 天</div>
          <input
            type="range"
            min="0"
            max="100"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={addInertia}
          disabled={!oldHabit.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: oldHabit.trim() ? 'pointer' : 'not-allowed',
            opacity: oldHabit.trim() ? 1 : 0.5,
          }}
        >
          💥 打破惯性
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的惯性突破</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {inertias.slice(0, 5).map((i) => (
            <div key={i.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: '#ff9090', marginBottom: 6 }}>
                ❌ {i.oldHabit}
              </div>
              {i.newAction && (
                <div style={{ fontSize: 12, color: '#a0f0c0', marginBottom: 6 }}>
                  ✅ {i.newAction}
                </div>
              )}
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                📅 已坚持 {i.days} 天
              </div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>{i.createdAt}</div>
            </div>
          ))}
          {inertias.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💥 还没有惯性突破
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MissionModule({ missions, setMissions }: {
  missions: Mission[]
  setMissions: (fn: (prev: Mission[]) => Mission[]) => void
}) {
  const [content, setContent] = useState('')
  const [urgency, setUrgency] = useState('🟡 中')

  const addMission = () => {
    if (!content.trim()) return
    const item: Mission = {
      id: `${Date.now()}`,
      content: content.trim(),
      urgency,
      completed: false,
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMissions((prev) => [item, ...prev])
    setContent('')
    setUrgency('🟡 中')
  }

  const toggleCompleted = (id: string) => {
    setMissions((prev) => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m))
  }

  const stats = {
    total: missions.length,
    completed: missions.filter(m => m.completed).length,
    urgent: missions.filter(m => m.urgency.includes('🔴') || m.urgency.includes('🟠')).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '突发任务', value: stats.total, icon: '🎯' },
          { label: '已完成', value: stats.completed, icon: '✅' },
          { label: '紧急任务', value: stats.urgent, icon: '🚨' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          🎯 突发任务
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="任务内容是什么？"
          style={textAreaStyle}
        />
        <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={selectStyle}>
          {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>

        <button
          onClick={addMission}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🎯 添加任务
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的突发任务</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {missions.slice(0, 5).map((m) => (
            <div key={m.id} style={{
              padding: 14, borderRadius: 12,
              background: m.completed ? 'rgba(255, 144, 192, 0.12)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${m.completed ? 'rgba(255, 144, 192, 0.4)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, textDecoration: m.completed ? 'line-through' : 'none', opacity: m.completed ? 0.6 : 1 }}>
                  🎯 {m.content}
                </span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10 }}>{m.urgency}</span>
                  <button
                    onClick={() => toggleCompleted(m.id)}
                    style={{
                      padding: '4px 10px', borderRadius: 999, fontSize: 10,
                      background: m.completed ? 'rgba(160, 240, 192, 0.2)' : `${PRIMARY_COLOR}15`,
                      border: `1px solid ${m.completed ? 'rgba(160, 240, 192, 0.4)' : PRIMARY_COLOR + '30'}`,
                      color: PRIMARY_COLOR, cursor: 'pointer',
                    }}
                  >
                    {m.completed ? '✅' : '⏳'}
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>{m.createdAt}</div>
            </div>
          ))}
          {missions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎯 还没有突发任务
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BurstModule({ bursts, setBursts }: {
  bursts: Burst[]
  setBursts: (fn: (prev: Burst[]) => Burst[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [action, setAction] = useState('')
  const [feeling, setFeeling] = useState('')

  const addBurst = () => {
    if (!moment.trim()) return
    const item: Burst = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      action: action.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setBursts((prev) => [item, ...prev])
    setMoment('')
    setAction('')
    setFeeling('')
  }

  const stats = {
    total: bursts.length,
    withAction: bursts.filter(b => b.action).length,
    withFeeling: bursts.filter(b => b.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '能量爆发', value: stats.total, icon: '💫' },
          { label: '有行动', value: stats.withAction, icon: '⚡' },
          { label: '有感受', value: stats.withFeeling, icon: '💭' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          💫 能量爆发
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录那些能量满满的时刻
        </div>

        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="爆发时刻是什么时候/什么场景？"
          style={inputStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你做了什么？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="那是怎样的感受？"
          style={textAreaStyle}
        />

        <button
          onClick={addBurst}
          disabled={!moment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: moment.trim() ? 'pointer' : 'not-allowed',
            opacity: moment.trim() ? 1 : 0.5,
          }}
        >
          💫 记录爆发
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的能量爆发</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bursts.slice(0, 5).map((b) => (
            <div key={b.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8, fontWeight: 500 }}>
                💫 {b.moment}
              </div>
              {b.action && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  ⚡ {b.action}
                </div>
              )}
              {b.feeling && (
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  💭 {b.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{b.createdAt}</div>
            </div>
          ))}
          {bursts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💫 还没有能量爆发记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#ff90c0'
const SECONDARY_COLOR = '#f070a0'

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
  color: '#ffe8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#ffe8f0', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#ffe8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'flash', name: '闪电行动', icon: '⚡' },
  { id: 'inertia', name: '打破惯性', icon: '💥' },
  { id: 'mission', name: '突发任务', icon: '🎯' },
  { id: 'burst', name: '能量爆发', icon: '💫' },
]

export default function MarsUranusPage() {
  const config = comboConfigs['mars-uranus']
  const [activeTab, setActiveTab] = useState<string>('flash')
  const [flashes, setFlashes] = useLocalStorage<Flash[]>('mu-flashes', [])
  const [inertias, setInertias] = useLocalStorage<Inertia[]>('mu-inertias', [])
  const [missions, setMissions] = useLocalStorage<Mission[]>('mu-missions', [])
  const [bursts, setBursts] = useLocalStorage<Burst[]>('mu-bursts', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#ffe8f0' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'flash' && <FlashModule flashes={flashes} setFlashes={setFlashes} />}
        {activeTab === 'inertia' && <InertiaModule inertias={inertias} setInertias={setInertias} />}
        {activeTab === 'mission' && <MissionModule missions={missions} setMissions={setMissions} />}
        {activeTab === 'burst' && <BurstModule bursts={bursts} setBursts={setBursts} />}
      </div>
    </ComboShell>
  )
}
