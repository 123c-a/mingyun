import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface BeliefRecord {
  id: string
  belief: string
  source: string
  location: string
  createdAt: string
}

interface ActionRecord {
  id: string
  action: string
  beliefDriven: string
  effect: string
  createdAt: string
}

interface IntuitionRecord {
  id: string
  intuition: string
  trust: string
  result: string
  createdAt: string
}

function BeliefModule({ records, setRecords }: {
  records: BeliefRecord[]
  setRecords: (fn: (prev: BeliefRecord[]) => BeliefRecord[]) => void
}) {
  const [belief, setBelief] = useState('')
  const [source, setSource] = useState('')
  const [location, setLocation] = useState('')

  const addRecord = () => {
    if (!belief.trim()) return
    const item: BeliefRecord = {
      id: `${Date.now()}`,
      belief: belief.trim(),
      source: source.trim(),
      location: location.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBelief('')
    setSource('')
    setLocation('')
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
          { label: '信念总数', value: stats.total, icon: '🧭' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有来源', value: stats.withSource, icon: '📍' },
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
          🧭 信念绘制
        </div>
        <input
          type="text"
          value={belief}
          onChange={(e) => setBelief(e.target.value)}
          placeholder="这个信念是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="它来自哪里？"
          style={inputStyle}
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="它在你信念地图的哪个位置？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!belief.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: belief.trim() ? 'pointer' : 'not-allowed',
            opacity: belief.trim() ? 1 : 0.5,
          }}
        >
          ✨ 绘制信念
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的信念</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🧭 {r.belief}</div>
              {r.source && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📍 {r.source}</div>}
              {r.location && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🗺️ {r.location}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🧭 还没有信念
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionBeliefModule({ records, setRecords }: {
  records: ActionRecord[]
  setRecords: (fn: (prev: ActionRecord[]) => ActionRecord[]) => void
}) {
  const [action, setAction] = useState('')
  const [beliefDriven, setBeliefDriven] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: ActionRecord = {
      id: `${Date.now()}`,
      action: action.trim(),
      beliefDriven: beliefDriven.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setBeliefDriven('')
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
          { label: '行动总数', value: stats.total, icon: '⚡' },
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
          ⚡ 信念行动
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
          value={beliefDriven}
          onChange={(e) => setBeliefDriven(e.target.value)}
          placeholder="这个行动受什么信念驱动？"
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
              {r.beliefDriven && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🧭 {r.beliefDriven}</div>}
              {r.effect && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.effect}</div>}
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

function IntuitionModule({ records, setRecords }: {
  records: IntuitionRecord[]
  setRecords: (fn: (prev: IntuitionRecord[]) => IntuitionRecord[]) => void
}) {
  const [intuition, setIntuition] = useState('')
  const [trust, setTrust] = useState('')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!intuition.trim()) return
    const item: IntuitionRecord = {
      id: `${Date.now()}`,
      intuition: intuition.trim(),
      trust: trust.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setIntuition('')
    setTrust('')
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
          { label: '直觉总数', value: stats.total, icon: '🔮' },
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
          🔮 直觉地图
        </div>
        <input
          type="text"
          value={intuition}
          onChange={(e) => setIntuition(e.target.value)}
          placeholder="直觉是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={trust}
          onChange={(e) => setTrust(e.target.value)}
          placeholder="你信任这个直觉吗？"
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
          disabled={!intuition.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: intuition.trim() ? 'pointer' : 'not-allowed',
            opacity: intuition.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录直觉
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的直觉</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🔮 {r.intuition}</div>
              {r.trust && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.trust}</div>}
              {r.result && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✅ {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔮 还没有直觉
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'earth-jupiter-neptune'
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
  { id: 'belief', name: '信念绘制', icon: '🧭' },
  { id: 'action', name: '信念行动', icon: '⚡' },
  { id: 'intuition', name: '直觉地图', icon: '🔮' },
]

export default function EarthJupiterNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('belief')
  const [beliefs, setBeliefs] = useLocalStorage<BeliefRecord[]>('ejn-beliefs', [])
  const [actions, setActions] = useLocalStorage<ActionRecord[]>('ejn-actions', [])
  const [intuitions, setIntuitions] = useLocalStorage<IntuitionRecord[]>('ejn-intuitions', [])

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
        {activeTab === 'belief' && <BeliefModule records={beliefs} setRecords={setBeliefs} />}
        {activeTab === 'action' && <ActionBeliefModule records={actions} setRecords={setActions} />}
        {activeTab === 'intuition' && <IntuitionModule records={intuitions} setRecords={setIntuitions} />}
      </div>
    </ComboShell>
  )
}
