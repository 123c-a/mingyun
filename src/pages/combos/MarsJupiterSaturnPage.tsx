import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface LongTermRecord {
  id: string
  goal: string
  stage: string
  progress: string
  createdAt: string
}

interface BalanceRecord {
  id: string
  balance: string
  practice: string
  feeling: string
  createdAt: string
}

interface MilestoneRecord {
  id: string
  milestone: string
  achievement: string
  celebration: string
  createdAt: string
}

function LongTermModule({ records, setRecords }: {
  records: LongTermRecord[]
  setRecords: (fn: (prev: LongTermRecord[]) => LongTermRecord[]) => void
}) {
  const [goal, setGoal] = useState('')
  const [stage, setStage] = useState('')
  const [progress, setProgress] = useState('')

  const addRecord = () => {
    if (!goal.trim()) return
    const item: LongTermRecord = {
      id: `${Date.now()}`,
      goal: goal.trim(),
      stage: stage.trim(),
      progress: progress.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setGoal('')
    setStage('')
    setProgress('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withProgress: records.filter(r => r.progress).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '长期目标', value: stats.total, icon: '🎯' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有进展', value: stats.withProgress, icon: '📈' },
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
          🎯 长期目标
        </div>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="目标是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          placeholder="当前处于哪个阶段？"
          style={inputStyle}
        />
        <input
          type="text"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          placeholder="进展如何？"
          style={inputStyle}
        />
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
          ✨ 记录目标
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
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🎯 {r.goal}</div>
              {r.stage && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📍 {r.stage}</div>}
              {r.progress && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📈 {r.progress}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎯 还没有目标
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BalanceModule({ records, setRecords }: {
  records: BalanceRecord[]
  setRecords: (fn: (prev: BalanceRecord[]) => BalanceRecord[]) => void
}) {
  const [balance, setBalance] = useState('')
  const [practice, setPractice] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!balance.trim()) return
    const item: BalanceRecord = {
      id: `${Date.now()}`,
      balance: balance.trim(),
      practice: practice.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBalance('')
    setPractice('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withFeeling: records.filter(r => r.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '平衡总数', value: stats.total, icon: '⚖️' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有感受', value: stats.withFeeling, icon: '💭' },
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
          ⚖️ 耐心与热情
        </div>
        <input
          type="text"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="平衡是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="你如何践行？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!balance.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: balance.trim() ? 'pointer' : 'not-allowed',
            opacity: balance.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录平衡
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的平衡</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>⚖️ {r.balance}</div>
              {r.practice && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.practice}</div>}
              {r.feeling && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚖️ 还没有平衡
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MilestoneModule({ records, setRecords }: {
  records: MilestoneRecord[]
  setRecords: (fn: (prev: MilestoneRecord[]) => MilestoneRecord[]) => void
}) {
  const [milestone, setMilestone] = useState('')
  const [achievement, setAchievement] = useState('')
  const [celebration, setCelebration] = useState('')

  const addRecord = () => {
    if (!milestone.trim()) return
    const item: MilestoneRecord = {
      id: `${Date.now()}`,
      milestone: milestone.trim(),
      achievement: achievement.trim(),
      celebration: celebration.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMilestone('')
    setAchievement('')
    setCelebration('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withCelebration: records.filter(r => r.celebration).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '里程碑总数', value: stats.total, icon: '🏆' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有庆祝', value: stats.withCelebration, icon: '🎉' },
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
          🏆 里程碑
        </div>
        <input
          type="text"
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          placeholder="里程碑是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
          placeholder="达成了什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={celebration}
          onChange={(e) => setCelebration(e.target.value)}
          placeholder="如何庆祝？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!milestone.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: milestone.trim() ? 'pointer' : 'not-allowed',
            opacity: milestone.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录里程碑
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的里程碑</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🏆 {r.milestone}</div>
              {r.achievement && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✅ {r.achievement}</div>}
              {r.celebration && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎉 {r.celebration}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏆 还没有里程碑
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'mars-jupiter-saturn'
const config = comboConfigs[configKey]
const PRIMARY_COLOR = config.primaryColor
const SECONDARY_COLOR = config.secondaryColor

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

const TAB_LIST = [
  { id: 'longTerm', name: '长期目标', icon: '🎯' },
  { id: 'balance', name: '耐心与热情', icon: '⚖️' },
  { id: 'milestone', name: '里程碑', icon: '🏆' },
]

export default function MarsJupiterSaturnPage() {
  const [activeTab, setActiveTab] = useState<string>('longTerm')
  const [longTerms, setLongTerms] = useLocalStorage<LongTermRecord[]>('mjs-longterms', [])
  const [balances, setBalances] = useLocalStorage<BalanceRecord[]>('mjs-balances', [])
  const [milestones, setMilestones] = useLocalStorage<MilestoneRecord[]>('mjs-milestones', [])

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
        {activeTab === 'longTerm' && <LongTermModule records={longTerms} setRecords={setLongTerms} />}
        {activeTab === 'balance' && <BalanceModule records={balances} setRecords={setBalances} />}
        {activeTab === 'milestone' && <MilestoneModule records={milestones} setRecords={setMilestones} />}
      </div>
    </ComboShell>
  )
}
