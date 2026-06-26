import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface ModuleRecord {
  id: string
  field1: string
  field2: string
  field3: string
  createdAt: string
}

interface VisionRecord {
  id: string
  vision: string
  path: string
  phase: string
  createdAt: string
}

interface GoalRecord {
  id: string
  goal: string
  reality: string
  progress: string
  createdAt: string
}

interface PlanRecord {
  id: string
  plan: string
  milestone: string
  execution: string
  createdAt: string
}

function VisionModule({ records, setRecords }: {
  records: VisionRecord[]
  setRecords: (fn: (prev: VisionRecord[]) => VisionRecord[]) => void
}) {
  const [vision, setVision] = useState('')
  const [path, setPath] = useState('')
  const [phase, setPhase] = useState('')

  const addRecord = () => {
    if (!vision.trim()) return
    const item: VisionRecord = {
      id: `${Date.now()}`,
      vision: vision.trim(),
      path: path.trim(),
      phase: phase.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setVision('')
    setPath('')
    setPhase('')
  }

  const stats = {
    total: records.length,
    thisWeek: records.filter(r => {
      const date = new Date(r.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
    withPath: records.filter(r => r.path).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '愿景总数', value: stats.total, icon: '🎯' },
          { label: '本周新增', value: stats.thisWeek, icon: '📅' },
          { label: '已有路径', value: stats.withPath, icon: '🛤️' },
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
          🎯 愿景规划
        </div>
        <input
          type="text"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="你的愿景是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="实现路径是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          placeholder="当前处于哪个阶段？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!vision.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: vision.trim() ? 'pointer' : 'not-allowed',
            opacity: vision.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录愿景
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的愿景</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🎯 {r.vision}</div>
              {r.path && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🛤️ {r.path}</div>}
              {r.phase && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📍 {r.phase}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎯 还没有愿景
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GoalModule({ records, setRecords }: {
  records: GoalRecord[]
  setRecords: (fn: (prev: GoalRecord[]) => GoalRecord[]) => void
}) {
  const [goal, setGoal] = useState('')
  const [reality, setReality] = useState('')
  const [progress, setProgress] = useState('')

  const addRecord = () => {
    if (!goal.trim()) return
    const item: GoalRecord = {
      id: `${Date.now()}`,
      goal: goal.trim(),
      reality: reality.trim(),
      progress: progress.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setGoal('')
    setReality('')
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
          { label: '目标总数', value: stats.total, icon: '🏁' },
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
          🏁 目标落地
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
          value={reality}
          onChange={(e) => setReality(e.target.value)}
          placeholder="现实性如何？"
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
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🏁 {r.goal}</div>
              {r.reality && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📊 {r.reality}</div>}
              {r.progress && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📈 {r.progress}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏁 还没有目标
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PlanModule({ records, setRecords }: {
  records: PlanRecord[]
  setRecords: (fn: (prev: PlanRecord[]) => PlanRecord[]) => void
}) {
  const [plan, setPlan] = useState('')
  const [milestone, setMilestone] = useState('')
  const [execution, setExecution] = useState('')

  const addRecord = () => {
    if (!plan.trim()) return
    const item: PlanRecord = {
      id: `${Date.now()}`,
      plan: plan.trim(),
      milestone: milestone.trim(),
      execution: execution.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPlan('')
    setMilestone('')
    setExecution('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withMilestone: records.filter(r => r.milestone).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '规划总数', value: stats.total, icon: '📋' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有里程碑', value: stats.withMilestone, icon: '🏆' },
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
          📋 时间规划
        </div>
        <input
          type="text"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="规划是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          placeholder="里程碑是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={execution}
          onChange={(e) => setExecution(e.target.value)}
          placeholder="执行情况如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!plan.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: plan.trim() ? 'pointer' : 'not-allowed',
            opacity: plan.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录规划
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的规划</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>📋 {r.plan}</div>
              {r.milestone && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🏆 {r.milestone}</div>}
              {r.execution && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.execution}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📋 还没有规划
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'earth-jupiter-saturn'
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
  { id: 'vision', name: '愿景规划', icon: '🎯' },
  { id: 'goal', name: '目标落地', icon: '🏁' },
  { id: 'plan', name: '时间规划', icon: '📋' },
]

export default function EarthJupiterSaturnPage() {
  const [activeTab, setActiveTab] = useState<string>('vision')
  const [visions, setVisions] = useLocalStorage<VisionRecord[]>('ejs-visions', [])
  const [goals, setGoals] = useLocalStorage<GoalRecord[]>('ejs-goals', [])
  const [plans, setPlans] = useLocalStorage<PlanRecord[]>('ejs-plans', [])

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
        {activeTab === 'vision' && <VisionModule records={visions} setRecords={setVisions} />}
        {activeTab === 'goal' && <GoalModule records={goals} setRecords={setGoals} />}
        {activeTab === 'plan' && <PlanModule records={plans} setRecords={setPlans} />}
      </div>
    </ComboShell>
  )
}
