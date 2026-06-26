import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface CollectiveChangeRecord {
  id: string
  change: string
  perception: string
  impact: string
  createdAt: string
}

interface TransitionRecord {
  id: string
  transition: string
  challenge: string
  opportunity: string
  createdAt: string
}

interface NewEraRecord {
  id: string
  newEra: string
  adaptation: string
  action: string
  createdAt: string
}

function CollectiveChangeModule({ records, setRecords }: {
  records: CollectiveChangeRecord[]
  setRecords: (fn: (prev: CollectiveChangeRecord[]) => CollectiveChangeRecord[]) => void
}) {
  const [change, setChange] = useState('')
  const [perception, setPerception] = useState('')
  const [impact, setImpact] = useState('')

  const addRecord = () => {
    if (!change.trim()) return
    const item: CollectiveChangeRecord = {
      id: `${Date.now()}`,
      change: change.trim(),
      perception: perception.trim(),
      impact: impact.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setChange('')
    setPerception('')
    setImpact('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withImpact: records.filter(r => r.impact).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '变化总数', value: stats.total, icon: '🌍' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有影响', value: stats.withImpact, icon: '💫' },
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
          🌍 集体变化
        </div>
        <input
          type="text"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="变化是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={perception}
          onChange={(e) => setPerception(e.target.value)}
          placeholder="你是如何感知的？"
          style={inputStyle}
        />
        <input
          type="text"
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="它对你有什么影响？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!change.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: change.trim() ? 'pointer' : 'not-allowed',
            opacity: change.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录变化
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的变化</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🌍 {r.change}</div>
              {r.perception && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>👁️ {r.perception}</div>}
              {r.impact && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💫 {r.impact}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌍 还没有变化
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TransitionModule({ records, setRecords }: {
  records: TransitionRecord[]
  setRecords: (fn: (prev: TransitionRecord[]) => TransitionRecord[]) => void
}) {
  const [transition, setTransition] = useState('')
  const [challenge, setChallenge] = useState('')
  const [opportunity, setOpportunity] = useState('')

  const addRecord = () => {
    if (!transition.trim()) return
    const item: TransitionRecord = {
      id: `${Date.now()}`,
      transition: transition.trim(),
      challenge: challenge.trim(),
      opportunity: opportunity.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setTransition('')
    setChallenge('')
    setOpportunity('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withOpportunity: records.filter(r => r.opportunity).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '转型期总数', value: stats.total, icon: '🔄' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有机会', value: stats.withOpportunity, icon: '🌟' },
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
          🔄 转型期
        </div>
        <input
          type="text"
          value={transition}
          onChange={(e) => setTransition(e.target.value)}
          placeholder="转型是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="挑战是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={opportunity}
          onChange={(e) => setOpportunity(e.target.value)}
          placeholder="机会是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!transition.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: transition.trim() ? 'pointer' : 'not-allowed',
            opacity: transition.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录转型
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的转型</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🔄 {r.transition}</div>
              {r.challenge && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚠️ {r.challenge}</div>}
              {r.opportunity && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🌟 {r.opportunity}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔄 还没有转型
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewEraModule({ records, setRecords }: {
  records: NewEraRecord[]
  setRecords: (fn: (prev: NewEraRecord[]) => NewEraRecord[]) => void
}) {
  const [newEra, setNewEra] = useState('')
  const [adaptation, setAdaptation] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!newEra.trim()) return
    const item: NewEraRecord = {
      id: `${Date.now()}`,
      newEra: newEra.trim(),
      adaptation: adaptation.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setNewEra('')
    setAdaptation('')
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
          { label: '新时代总数', value: stats.total, icon: '✨' },
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
          ✨ 新时代
        </div>
        <input
          type="text"
          value={newEra}
          onChange={(e) => setNewEra(e.target.value)}
          placeholder="新时代是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={adaptation}
          onChange={(e) => setAdaptation(e.target.value)}
          placeholder="你如何适应？"
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
          disabled={!newEra.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: newEra.trim() ? 'pointer' : 'not-allowed',
            opacity: newEra.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录新时代
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的新时代</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>✨ {r.newEra}</div>
              {r.adaptation && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.adaptation}</div>}
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ✨ 还没有新时代
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'saturn-uranus-neptune'
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
  { id: 'collectiveChange', name: '集体变化', icon: '🌍' },
  { id: 'transition', name: '转型期', icon: '🔄' },
  { id: 'newEra', name: '新时代', icon: '✨' },
]

export default function SaturnUranusNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('collectiveChange')
  const [collectiveChanges, setCollectiveChanges] = useLocalStorage<CollectiveChangeRecord[]>('sun-collectivechanges', [])
  const [transitions, setTransitions] = useLocalStorage<TransitionRecord[]>('sun-transitions', [])
  const [newEras, setNewEras] = useLocalStorage<NewEraRecord[]>('sun-neweras', [])

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
        {activeTab === 'collectiveChange' && <CollectiveChangeModule records={collectiveChanges} setRecords={setCollectiveChanges} />}
        {activeTab === 'transition' && <TransitionModule records={transitions} setRecords={setTransitions} />}
        {activeTab === 'newEra' && <NewEraModule records={newEras} setRecords={setNewEras} />}
      </div>
    </ComboShell>
  )
}
