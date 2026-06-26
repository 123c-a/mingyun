import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface GoalRecord {
  id: string
  goal: string
  progress: string
  motivation: string
  createdAt: string
}

interface AdventureRecord {
  id: string
  adventure: string
  difficulty: string
  result: string
  createdAt: string
}

interface PassionRecord {
  id: string
  moment: string
  feeling: string
  gain: string
  createdAt: string
}

const DIFFICULTY_OPTIONS = ['简单', '中等', '困难', '极难']
const MOTIVATION_OPTIONS = ['高涨', '平稳', '低落']

function GoalModule({ records, setRecords }: {
  records: GoalRecord[]
  setRecords: (fn: (prev: GoalRecord[]) => GoalRecord[]) => void
}) {
  const [goal, setGoal] = useState('')
  const [progress, setProgress] = useState('')
  const [motivation, setMotivation] = useState('平稳')

  const addRecord = () => {
    if (!goal.trim()) return
    const item: GoalRecord = {
      id: `${Date.now()}`,
      goal: goal.trim(),
      progress: progress.trim(),
      motivation,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setGoal('')
    setProgress('')
  }

  const stats = {
    total: records.length,
    highMotivation: records.filter(r => r.motivation === '高涨').length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '目标总数', value: stats.total, icon: '🎯' },
          { label: '动力充沛', value: stats.highMotivation, icon: '🔥' },
          { label: '本月冲刺', value: stats.thisMonth, icon: '📅' },
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
          🎯 目标冲刺
        </div>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="目标是什么？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="当前进度"
            style={inputStyle}
          />
          <select value={motivation} onChange={(e) => setMotivation(e.target.value)} style={selectStyle}>
            {MOTIVATION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={addRecord}
          disabled={!goal.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: goal.trim() ? 'pointer' : 'not-allowed',
            opacity: goal.trim() ? 1 : 0.5,
          }}
        >
          🎯 记录目标
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的目标</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>🎯 {r.goal}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.motivation}</span>
              </div>
              {r.progress && <div style={{ fontSize: 11, opacity: 0.6 }}>进度: {r.progress}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🎯 还没有目标</div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdventureModule({ records, setRecords }: {
  records: AdventureRecord[]
  setRecords: (fn: (prev: AdventureRecord[]) => AdventureRecord[]) => void
}) {
  const [adventure, setAdventure] = useState('')
  const [difficulty, setDifficulty] = useState('中等')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!adventure.trim()) return
    const item: AdventureRecord = {
      id: `${Date.now()}`,
      adventure: adventure.trim(),
      difficulty,
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAdventure('')
    setResult('')
  }

  const stats = {
    total: records.length,
    completed: records.filter(r => r.result && (r.result.includes('完成') || r.result.includes('成功'))).length,
    hardCount: records.filter(r => r.difficulty === '困难' || r.difficulty === '极难').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '冒险总数', value: stats.total, icon: '⚡' },
          { label: '已完成', value: stats.completed, icon: '✅' },
          { label: '高难度', value: stats.hardCount, icon: '🔥' },
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
          ⚡ 冒险清单
        </div>
        <textarea
          value={adventure}
          onChange={(e) => setAdventure(e.target.value)}
          placeholder="想尝试什么冒险？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={selectStyle}>
            {DIFFICULTY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="结果如何"
            style={inputStyle}
          />
        </div>
        <button
          onClick={addRecord}
          disabled={!adventure.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: adventure.trim() ? 'pointer' : 'not-allowed',
            opacity: adventure.trim() ? 1 : 0.5,
          }}
        >
          ⚡ 记录冒险
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的冒险</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>⚡ {r.adventure}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.difficulty}</span>
              </div>
              {r.result && <div style={{ fontSize: 11, opacity: 0.75 }}>结果: {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>⚡ 还没有冒险</div>
          )}
        </div>
      </div>
    </div>
  )
}

function PassionModule({ records, setRecords }: {
  records: PassionRecord[]
  setRecords: (fn: (prev: PassionRecord[]) => PassionRecord[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [feeling, setFeeling] = useState('')
  const [gain, setGain] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: PassionRecord = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      feeling: feeling.trim(),
      gain: gain.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setFeeling('')
    setGain('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '热情时刻', value: stats.total, icon: '🔥' },
          { label: '本月时刻', value: stats.thisMonth, icon: '📅' },
          { label: '热血时刻', value: stats.total, icon: '⚡' },
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
          🔥 热情时刻
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="是什么时刻让你热血沸腾？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={inputStyle}
        />
        <textarea
          value={gain}
          onChange={(e) => setGain(e.target.value)}
          placeholder="你收获了什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!moment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: moment.trim() ? 'pointer' : 'not-allowed',
            opacity: moment.trim() ? 1 : 0.5,
          }}
        >
          🔥 记录时刻
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的时刻</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🔥 {r.moment}</div>
              {r.feeling && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>感受: {r.feeling}</div>}
              {r.gain && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>收获: {r.gain}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🔥 还没有时刻</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-mars-jupiter'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-mars-jupiter'].secondaryColor

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
  color: '#d0f0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0f0ff', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0f0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'goal', name: '目标冲刺', icon: '🎯' },
  { id: 'adventure', name: '冒险清单', icon: '⚡' },
  { id: 'passion', name: '热情时刻', icon: '🔥' },
]

export default function MercuryMarsJupiterPage() {
  const config = comboConfigs['mercury-mars-jupiter']
  const [activeTab, setActiveTab] = useState<string>('goal')
  const [goals, setGoals] = useLocalStorage<GoalRecord[]>('mmj-goals', [])
  const [adventures, setAdventures] = useLocalStorage<AdventureRecord[]>('mmj-adventures', [])
  const [passions, setPassions] = useLocalStorage<PassionRecord[]>('mmj-passions', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#d0f0ff' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'goal' && <GoalModule records={goals} setRecords={setGoals} />}
        {activeTab === 'adventure' && <AdventureModule records={adventures} setRecords={setAdventures} />}
        {activeTab === 'passion' && <PassionModule records={passions} setRecords={setPassions} />}
      </div>
    </ComboShell>
  )
}
