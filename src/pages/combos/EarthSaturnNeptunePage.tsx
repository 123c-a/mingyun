import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface DeepDiveRecord {
  id: string
  deepDive: string
  feeling: string
  discovery: string
  createdAt: string
}

interface PressureRecord {
  id: string
  structure: string
  pressure: string
  effect: string
  createdAt: string
}

interface LandingRecord {
  id: string
  action: string
  grounding: string
  state: string
  createdAt: string
}

function DeepDiveModule({ records, setRecords }: {
  records: DeepDiveRecord[]
  setRecords: (fn: (prev: DeepDiveRecord[]) => DeepDiveRecord[]) => void
}) {
  const [deepDive, setDeepDive] = useState('')
  const [feeling, setFeeling] = useState('')
  const [discovery, setDiscovery] = useState('')

  const addRecord = () => {
    if (!deepDive.trim()) return
    const item: DeepDiveRecord = {
      id: `${Date.now()}`,
      deepDive: deepDive.trim(),
      feeling: feeling.trim(),
      discovery: discovery.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setDeepDive('')
    setFeeling('')
    setDiscovery('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withDiscovery: records.filter(r => r.discovery).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '深潜总数', value: stats.total, icon: '🤿' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有发现', value: stats.withDiscovery, icon: '💎' },
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
          🤿 深潜时刻
        </div>
        <input
          type="text"
          value={deepDive}
          onChange={(e) => setDeepDive(e.target.value)}
          placeholder="你在深潜什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={discovery}
          onChange={(e) => setDiscovery(e.target.value)}
          placeholder="你发现了什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!deepDive.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: deepDive.trim() ? 'pointer' : 'not-allowed',
            opacity: deepDive.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录深潜
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的深潜</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🤿 {r.deepDive}</div>
              {r.feeling && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.feeling}</div>}
              {r.discovery && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💎 {r.discovery}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🤿 还没有深潜
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PressureModule({ records, setRecords }: {
  records: PressureRecord[]
  setRecords: (fn: (prev: PressureRecord[]) => PressureRecord[]) => void
}) {
  const [structure, setStructure] = useState('')
  const [pressure, setPressure] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!structure.trim()) return
    const item: PressureRecord = {
      id: `${Date.now()}`,
      structure: structure.trim(),
      pressure: pressure.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setStructure('')
    setPressure('')
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
          { label: '结构总数', value: stats.total, icon: '🏛️' },
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
          🏛️ 压力结构
        </div>
        <input
          type="text"
          value={structure}
          onChange={(e) => setStructure(e.target.value)}
          placeholder="这个结构是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={pressure}
          onChange={(e) => setPressure(e.target.value)}
          placeholder="它承受了什么压力？"
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
          disabled={!structure.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: structure.trim() ? 'pointer' : 'not-allowed',
            opacity: structure.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录结构
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的结构</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🏛️ {r.structure}</div>
              {r.pressure && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.pressure}</div>}
              {r.effect && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏛️ 还没有结构
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LandingModule({ records, setRecords }: {
  records: LandingRecord[]
  setRecords: (fn: (prev: LandingRecord[]) => LandingRecord[]) => void
}) {
  const [action, setAction] = useState('')
  const [grounding, setGrounding] = useState('')
  const [state, setState] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: LandingRecord = {
      id: `${Date.now()}`,
      action: action.trim(),
      grounding: grounding.trim(),
      state: state.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setGrounding('')
    setState('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withState: records.filter(r => r.state).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '行动总数', value: stats.total, icon: '⚡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有状态', value: stats.withState, icon: '🎯' },
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
          ⚡ 着陆行动
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
          value={grounding}
          onChange={(e) => setGrounding(e.target.value)}
          placeholder="如何落地？"
          style={inputStyle}
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
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
              {r.grounding && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🏠 {r.grounding}</div>}
              {r.state && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎯 {r.state}</div>}
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

const configKey = 'earth-saturn-neptune'
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
  { id: 'deepDive', name: '深潜时刻', icon: '🤿' },
  { id: 'pressure', name: '压力结构', icon: '🏛️' },
  { id: 'landing', name: '着陆行动', icon: '⚡' },
]

export default function EarthSaturnNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('deepDive')
  const [deepDives, setDeepDives] = useLocalStorage<DeepDiveRecord[]>('esn-deepdives', [])
  const [pressures, setPressures] = useLocalStorage<PressureRecord[]>('esn-pressures', [])
  const [landings, setLandings] = useLocalStorage<LandingRecord[]>('esn-landings', [])

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
        {activeTab === 'deepDive' && <DeepDiveModule records={deepDives} setRecords={setDeepDives} />}
        {activeTab === 'pressure' && <PressureModule records={pressures} setRecords={setPressures} />}
        {activeTab === 'landing' && <LandingModule records={landings} setRecords={setLandings} />}
      </div>
    </ComboShell>
  )
}
