import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface DeepSeaRecord {
  id: string
  pressure: string
  response: string
  effect: string
  createdAt: string
}

interface BurningRecord {
  id: string
  burning: string
  state: string
  source: string
  createdAt: string
}

interface DirectionRecord {
  id: string
  direction: string
  intuition: string
  action: string
  createdAt: string
}

function DeepSeaModule({ records, setRecords }: {
  records: DeepSeaRecord[]
  setRecords: (fn: (prev: DeepSeaRecord[]) => DeepSeaRecord[]) => void
}) {
  const [pressure, setPressure] = useState('')
  const [response, setResponse] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!pressure.trim()) return
    const item: DeepSeaRecord = {
      id: `${Date.now()}`,
      pressure: pressure.trim(),
      response: response.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPressure('')
    setResponse('')
    setEffect('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withEffect: records.filter(r => r.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '压力总数', value: stats.total, icon: '🌊' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有效果', value: stats.withEffect, icon: '✨' },
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
          🌊 深海压力
        </div>
        <input
          type="text"
          value={pressure}
          onChange={(e) => setPressure(e.target.value)}
          placeholder="压力是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="你如何应对？"
          style={inputStyle}
        />
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!pressure.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: pressure.trim() ? 'pointer' : 'not-allowed',
            opacity: pressure.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录压力
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的压力</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🌊 {r.pressure}</div>
              {r.response && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✅ {r.response}</div>}
              {r.effect && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌊 还没有压力
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BurningModule({ records, setRecords }: {
  records: BurningRecord[]
  setRecords: (fn: (prev: BurningRecord[]) => BurningRecord[]) => void
}) {
  const [burning, setBurning] = useState('')
  const [state, setState] = useState('')
  const [source, setSource] = useState('')

  const addRecord = () => {
    if (!burning.trim()) return
    const item: BurningRecord = {
      id: `${Date.now()}`,
      burning: burning.trim(),
      state: state.trim(),
      source: source.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBurning('')
    setState('')
    setSource('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withSource: records.filter(r => r.source).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '燃烧总数', value: stats.total, icon: '🔥' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有来源', value: stats.withSource, icon: '⚡' },
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
          🔥 持续燃烧
        </div>
        <input
          type="text"
          value={burning}
          onChange={(e) => setBurning(e.target.value)}
          placeholder="燃烧是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="状态如何？"
          style={inputStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="力量来源是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!burning.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: burning.trim() ? 'pointer' : 'not-allowed',
            opacity: burning.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录燃烧
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的燃烧</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🔥 {r.burning}</div>
              {r.state && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎯 {r.state}</div>}
              {r.source && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.source}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔥 还没有燃烧
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DirectionModule({ records, setRecords }: {
  records: DirectionRecord[]
  setRecords: (fn: (prev: DirectionRecord[]) => DirectionRecord[]) => void
}) {
  const [direction, setDirection] = useState('')
  const [intuition, setIntuition] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!direction.trim()) return
    const item: DirectionRecord = {
      id: `${Date.now()}`,
      direction: direction.trim(),
      intuition: intuition.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setDirection('')
    setIntuition('')
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
          { label: '方向总数', value: stats.total, icon: '🧭' },
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
          🧭 方向寻找
        </div>
        <input
          type="text"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          placeholder="方向是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={intuition}
          onChange={(e) => setIntuition(e.target.value)}
          placeholder="直觉告诉你什么？"
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
          disabled={!direction.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: direction.trim() ? 'pointer' : 'not-allowed',
            opacity: direction.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录方向
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的方向</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🧭 {r.direction}</div>
              {r.intuition && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔮 {r.intuition}</div>}
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🧭 还没有方向
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'mars-saturn-neptune'
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
  { id: 'deepSea', name: '深海压力', icon: '🌊' },
  { id: 'burning', name: '持续燃烧', icon: '🔥' },
  { id: 'direction', name: '方向寻找', icon: '🧭' },
]

export default function MarsSaturnNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('deepSea')
  const [deepSeas, setDeepSeas] = useLocalStorage<DeepSeaRecord[]>('msn-deepseas', [])
  const [burnings, setBurnings] = useLocalStorage<BurningRecord[]>('msn-burnings', [])
  const [directions, setDirections] = useLocalStorage<DirectionRecord[]>('msn-directions', [])

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
        {activeTab === 'deepSea' && <DeepSeaModule records={deepSeas} setRecords={setDeepSeas} />}
        {activeTab === 'burning' && <BurningModule records={burnings} setRecords={setBurnings} />}
        {activeTab === 'direction' && <DirectionModule records={directions} setRecords={setDirections} />}
      </div>
    </ComboShell>
  )
}
