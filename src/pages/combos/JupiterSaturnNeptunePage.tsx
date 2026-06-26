import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface CycleRecord {
  id: string
  cycle: string
  stage: string
  meaning: string
  createdAt: string
}

interface SignalRecord {
  id: string
  signal: string
  recognized: string
  action: string
  createdAt: string
}

interface WheelRecord {
  id: string
  wheel: string
  change: string
  acceptance: string
  createdAt: string
}

function CycleModule({ records, setRecords }: {
  records: CycleRecord[]
  setRecords: (fn: (prev: CycleRecord[]) => CycleRecord[]) => void
}) {
  const [cycle, setCycle] = useState('')
  const [stage, setStage] = useState('')
  const [meaning, setMeaning] = useState('')

  const addRecord = () => {
    if (!cycle.trim()) return
    const item: CycleRecord = {
      id: `${Date.now()}`,
      cycle: cycle.trim(),
      stage: stage.trim(),
      meaning: meaning.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setCycle('')
    setStage('')
    setMeaning('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withMeaning: records.filter(r => r.meaning).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '周期总数', value: stats.total, icon: '🔄' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有意义', value: stats.withMeaning, icon: '💫' },
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
          🔄 周期觉察
        </div>
        <input
          type="text"
          value={cycle}
          onChange={(e) => setCycle(e.target.value)}
          placeholder="周期是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          placeholder="处于哪个阶段？"
          style={inputStyle}
        />
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="它的意义是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!cycle.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: cycle.trim() ? 'pointer' : 'not-allowed',
            opacity: cycle.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录周期
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的周期</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🔄 {r.cycle}</div>
              {r.stage && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📍 {r.stage}</div>}
              {r.meaning && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💫 {r.meaning}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔄 还没有周期
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SignalModule({ records, setRecords }: {
  records: SignalRecord[]
  setRecords: (fn: (prev: SignalRecord[]) => SignalRecord[]) => void
}) {
  const [signal, setSignal] = useState('')
  const [recognized, setRecognized] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!signal.trim()) return
    const item: SignalRecord = {
      id: `${Date.now()}`,
      signal: signal.trim(),
      recognized: recognized.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setSignal('')
    setRecognized('')
    setAction('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withAction: records.filter(r => r.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '信号总数', value: stats.total, icon: '📡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有行动', value: stats.withAction, icon: '⚡' },
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
          📡 转变信号
        </div>
        <input
          type="text"
          value={signal}
          onChange={(e) => setSignal(e.target.value)}
          placeholder="信号是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={recognized}
          onChange={(e) => setRecognized(e.target.value)}
          placeholder="你是否识别到它？"
          style={inputStyle}
        />
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你采取什么行动？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!signal.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: signal.trim() ? 'pointer' : 'not-allowed',
            opacity: signal.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录信号
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的信号</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>📡 {r.signal}</div>
              {r.recognized && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>👁️ {r.recognized}</div>}
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📡 还没有信号
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function WheelModule({ records, setRecords }: {
  records: WheelRecord[]
  setRecords: (fn: (prev: WheelRecord[]) => WheelRecord[]) => void
}) {
  const [wheel, setWheel] = useState('')
  const [change, setChange] = useState('')
  const [acceptance, setAcceptance] = useState('')

  const addRecord = () => {
    if (!wheel.trim()) return
    const item: WheelRecord = {
      id: `${Date.now()}`,
      wheel: wheel.trim(),
      change: change.trim(),
      acceptance: acceptance.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setWheel('')
    setChange('')
    setAcceptance('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withAcceptance: records.filter(r => r.acceptance).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '命运之轮总数', value: stats.total, icon: '🎡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有接受', value: stats.withAcceptance, icon: '🙏' },
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
          🎡 命运之轮
        </div>
        <input
          type="text"
          value={wheel}
          onChange={(e) => setWheel(e.target.value)}
          placeholder="轮转是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="改变了什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={acceptance}
          onChange={(e) => setAcceptance(e.target.value)}
          placeholder="你如何接受？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!wheel.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: wheel.trim() ? 'pointer' : 'not-allowed',
            opacity: wheel.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录轮转
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的轮转</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🎡 {r.wheel}</div>
              {r.change && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.change}</div>}
              {r.acceptance && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🙏 {r.acceptance}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎡 还没有轮转
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'jupiter-saturn-neptune'
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
  { id: 'cycle', name: '周期觉察', icon: '🔄' },
  { id: 'signal', name: '转变信号', icon: '📡' },
  { id: 'wheel', name: '命运之轮', icon: '🎡' },
]

export default function JupiterSaturnNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('cycle')
  const [cycles, setCycles] = useLocalStorage<CycleRecord[]>('jsn-cycles', [])
  const [signals, setSignals] = useLocalStorage<SignalRecord[]>('jsn-signals', [])
  const [wheels, setWheels] = useLocalStorage<WheelRecord[]>('jsn-wheels', [])

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
        {activeTab === 'cycle' && <CycleModule records={cycles} setRecords={setCycles} />}
        {activeTab === 'signal' && <SignalModule records={signals} setRecords={setSignals} />}
        {activeTab === 'wheel' && <WheelModule records={wheels} setRecords={setWheels} />}
      </div>
    </ComboShell>
  )
}
