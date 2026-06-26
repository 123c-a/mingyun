import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface OldPatternRecord {
  id: string
  oldPattern: string
  impact: string
  reason: string
  createdAt: string
}

interface NewPatternRecord {
  id: string
  newPattern: string
  plan: string
  obstacle: string
  createdAt: string
}

interface BreakthroughRecord {
  id: string
  moment: string
  feeling: string
  change: string
  createdAt: string
}

function OldPatternModule({ records, setRecords }: {
  records: OldPatternRecord[]
  setRecords: (fn: (prev: OldPatternRecord[]) => OldPatternRecord[]) => void
}) {
  const [oldPattern, setOldPattern] = useState('')
  const [impact, setImpact] = useState('')
  const [reason, setReason] = useState('')

  const addRecord = () => {
    if (!oldPattern.trim()) return
    const item: OldPatternRecord = {
      id: `${Date.now()}`,
      oldPattern: oldPattern.trim(),
      impact: impact.trim(),
      reason: reason.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setOldPattern('')
    setImpact('')
    setReason('')
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
          { label: '旧模式总数', value: stats.total, icon: '🔄' },
          { label: '本月识别', value: stats.thisMonth, icon: '📅' },
          { label: '等待突破', value: stats.total, icon: '⏳' },
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
          🔄 旧情感模式
        </div>
        <textarea
          value={oldPattern}
          onChange={(e) => setOldPattern(e.target.value)}
          placeholder="这个旧模式是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="它如何影响你？"
          style={textAreaStyle}
        />
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="为什么想改变它？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!oldPattern.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldPattern.trim() ? 'pointer' : 'not-allowed',
            opacity: oldPattern.trim() ? 1 : 0.5,
          }}
        >
          🔄 记录模式
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的模式</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: '#ff9090', marginBottom: 6 }}>❌ {r.oldPattern}</div>
              {r.impact && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>影响: {r.impact}</div>}
              {r.reason && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>原因: {r.reason}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🔄 还没有模式</div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewPatternModule({ records, setRecords }: {
  records: NewPatternRecord[]
  setRecords: (fn: (prev: NewPatternRecord[]) => NewPatternRecord[]) => void
}) {
  const [newPattern, setNewPattern] = useState('')
  const [plan, setPlan] = useState('')
  const [obstacle, setObstacle] = useState('')

  const addRecord = () => {
    if (!newPattern.trim()) return
    const item: NewPatternRecord = {
      id: `${Date.now()}`,
      newPattern: newPattern.trim(),
      plan: plan.trim(),
      obstacle: obstacle.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setNewPattern('')
    setPlan('')
    setObstacle('')
  }

  const stats = {
    total: records.length,
    withPlan: records.filter(r => r.plan).length,
    withObstacle: records.filter(r => r.obstacle).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '新模式总数', value: stats.total, icon: '✨' },
          { label: '已有计划', value: stats.withPlan, icon: '📋' },
          { label: '遇到障碍', value: stats.withObstacle, icon: '⚠️' },
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
          ✨ 新可能
        </div>
        <textarea
          value={newPattern}
          onChange={(e) => setNewPattern(e.target.value)}
          placeholder="新模式是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="你的计划是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={obstacle}
          onChange={(e) => setObstacle(e.target.value)}
          placeholder="可能的障碍是什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!newPattern.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: newPattern.trim() ? 'pointer' : 'not-allowed',
            opacity: newPattern.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录新模式
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的新可能</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: '#a0f0a0', marginBottom: 6 }}>✨ {r.newPattern}</div>
              {r.plan && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>计划: {r.plan}</div>}
              {r.obstacle && <div style={{ fontSize: 11, color: '#f0d080', marginBottom: 4 }}>障碍: {r.obstacle}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>✨ 还没有新可能</div>
          )}
        </div>
      </div>
    </div>
  )
}

function BreakthroughModule({ records, setRecords }: {
  records: BreakthroughRecord[]
  setRecords: (fn: (prev: BreakthroughRecord[]) => BreakthroughRecord[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [feeling, setFeeling] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: BreakthroughRecord = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      feeling: feeling.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setFeeling('')
    setChange('')
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
          { label: '突破总数', value: stats.total, icon: '🚀' },
          { label: '本月突破', value: stats.thisMonth, icon: '📅' },
          { label: '情感升级', value: stats.total, icon: '💝' },
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
          🚀 突破时刻
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="突破发生在什么时刻？"
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
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="发生了什么变化？"
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
          🚀 记录突破
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的突破</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🚀 {r.moment}</div>
              {r.feeling && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>感受: {r.feeling}</div>}
              {r.change && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>变化: {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🚀 还没有突破</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-venus-uranus'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-venus-uranus'].secondaryColor

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
  { id: 'oldpattern', name: '旧情感模式', icon: '🔄' },
  { id: 'newpattern', name: '新可能', icon: '✨' },
  { id: 'breakthrough', name: '突破时刻', icon: '🚀' },
]

export default function MercuryVenusUranusPage() {
  const config = comboConfigs['mercury-venus-uranus']
  const [activeTab, setActiveTab] = useState<string>('oldpattern')
  const [oldpatterns, setOldPatterns] = useLocalStorage<OldPatternRecord[]>('mvu-oldpatterns', [])
  const [newpatterns, setNewPatterns] = useLocalStorage<NewPatternRecord[]>('mvu-newpatterns', [])
  const [breakthroughs, setBreakthroughs] = useLocalStorage<BreakthroughRecord[]>('mvu-breakthroughs', [])

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
        {activeTab === 'oldpattern' && <OldPatternModule records={oldpatterns} setRecords={setOldPatterns} />}
        {activeTab === 'newpattern' && <NewPatternModule records={newpatterns} setRecords={setNewPatterns} />}
        {activeTab === 'breakthrough' && <BreakthroughModule records={breakthroughs} setRecords={setBreakthroughs} />}
      </div>
    </ComboShell>
  )
}
