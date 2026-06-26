import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface ImpulseRecord {
  id: string
  impulse: string
  steadiness: string
  result: string
  createdAt: string
}

interface StrengthRecord {
  id: string
  strength: string
  rootedness: string
  power: string
  createdAt: string
}

interface ActionRootedRecord {
  id: string
  action: string
  groundedness: string
  status: string
  createdAt: string
}

function ImpulseModule({ records, setRecords }: {
  records: ImpulseRecord[]
  setRecords: (fn: (prev: ImpulseRecord[]) => ImpulseRecord[]) => void
}) {
  const [impulse, setImpulse] = useState('')
  const [steadiness, setSteadiness] = useState('')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!impulse.trim()) return
    const item: ImpulseRecord = {
      id: `${Date.now()}`,
      impulse: impulse.trim(),
      steadiness: steadiness.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setImpulse('')
    setSteadiness('')
    setResult('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withResult: records.filter(r => r.result).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '冲动总数', value: stats.total, icon: '💥' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有结果', value: stats.withResult, icon: '✅' },
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
          💥 冲动与沉稳
        </div>
        <input
          type="text"
          value={impulse}
          onChange={(e) => setImpulse(e.target.value)}
          placeholder="冲动是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={steadiness}
          onChange={(e) => setSteadiness(e.target.value)}
          placeholder="如何沉稳下来？"
          style={inputStyle}
        />
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!impulse.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: impulse.trim() ? 'pointer' : 'not-allowed',
            opacity: impulse.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录冲动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的冲动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>💥 {r.impulse}</div>
              {r.steadiness && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚖️ {r.steadiness}</div>}
              {r.result && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✅ {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💥 还没有冲动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StrengthModule({ records, setRecords }: {
  records: StrengthRecord[]
  setRecords: (fn: (prev: StrengthRecord[]) => StrengthRecord[]) => void
}) {
  const [strength, setStrength] = useState('')
  const [rootedness, setRootedness] = useState('')
  const [power, setPower] = useState('')

  const addRecord = () => {
    if (!strength.trim()) return
    const item: StrengthRecord = {
      id: `${Date.now()}`,
      strength: strength.trim(),
      rootedness: rootedness.trim(),
      power: power.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setStrength('')
    setRootedness('')
    setPower('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withPower: records.filter(r => r.power).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '力量总数', value: stats.total, icon: '💪' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有力量', value: stats.withPower, icon: '⚡' },
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
          💪 有根基的行动
        </div>
        <input
          type="text"
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
          placeholder="力量是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={rootedness}
          onChange={(e) => setRootedness(e.target.value)}
          placeholder="根基在哪里？"
          style={inputStyle}
        />
        <input
          type="text"
          value={power}
          onChange={(e) => setPower(e.target.value)}
          placeholder="力量如何体现？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!strength.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: strength.trim() ? 'pointer' : 'not-allowed',
            opacity: strength.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录力量
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的力量</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>💪 {r.strength}</div>
              {r.rootedness && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🌍 {r.rootedness}</div>}
              {r.power && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.power}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💪 还没有力量
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionRootedModule({ records, setRecords }: {
  records: ActionRootedRecord[]
  setRecords: (fn: (prev: ActionRootedRecord[]) => ActionRootedRecord[]) => void
}) {
  const [action, setAction] = useState('')
  const [groundedness, setGroundedness] = useState('')
  const [status, setStatus] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: ActionRootedRecord = {
      id: `${Date.now()}`,
      action: action.trim(),
      groundedness: groundedness.trim(),
      status: status.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setGroundedness('')
    setStatus('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withStatus: records.filter(r => r.status).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '行动总数', value: stats.total, icon: '⚡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有状态', value: stats.withStatus, icon: '🎯' },
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
          ⚡ 行动与落地
        </div>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="行动是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={groundedness}
          onChange={(e) => setGroundedness(e.target.value)}
          placeholder="落地程度如何？"
          style={inputStyle}
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="状态如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!action.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: action.trim() ? 'pointer' : 'not-allowed',
            opacity: action.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录行动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>⚡ {r.action}</div>
              {r.groundedness && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🌍 {r.groundedness}</div>}
              {r.status && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎯 {r.status}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有行动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'earth-mars-saturn'
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
  { id: 'impulse', name: '冲动与沉稳', icon: '💥' },
  { id: 'strength', name: '有根基的行动', icon: '💪' },
  { id: 'actionRooted', name: '行动与落地', icon: '⚡' },
]

export default function EarthMarsSaturnPage() {
  const [activeTab, setActiveTab] = useState<string>('impulse')
  const [impulses, setImpulses] = useLocalStorage<ImpulseRecord[]>('ems-impulses', [])
  const [strengths, setStrengths] = useLocalStorage<StrengthRecord[]>('ems-strengths', [])
  const [actionRooteds, setActionRooteds] = useLocalStorage<ActionRootedRecord[]>('ems-actionrooteds', [])

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
        {activeTab === 'impulse' && <ImpulseModule records={impulses} setRecords={setImpulses} />}
        {activeTab === 'strength' && <StrengthModule records={strengths} setRecords={setStrengths} />}
        {activeTab === 'actionRooted' && <ActionRootedModule records={actionRooteds} setRecords={setActionRooteds} />}
      </div>
    </ComboShell>
  )
}
