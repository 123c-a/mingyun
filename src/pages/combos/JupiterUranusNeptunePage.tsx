import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface ExpansionRecord {
  id: string
  expansion: string
  experience: string
  change: string
  createdAt: string
}

interface CosmicViewRecord {
  id: string
  view: string
  cognition: string
  action: string
  createdAt: string
}

interface UnityRecord {
  id: string
  unity: string
  moment: string
  harvest: string
  createdAt: string
}

function ExpansionModule({ records, setRecords }: {
  records: ExpansionRecord[]
  setRecords: (fn: (prev: ExpansionRecord[]) => ExpansionRecord[]) => void
}) {
  const [expansion, setExpansion] = useState('')
  const [experience, setExperience] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!expansion.trim()) return
    const item: ExpansionRecord = {
      id: `${Date.now()}`,
      expansion: expansion.trim(),
      experience: experience.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setExpansion('')
    setExperience('')
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
    withChange: records.filter(r => r.change).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '扩展总数', value: stats.total, icon: '🌌' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有变化', value: stats.withChange, icon: '🔄' },
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
          🌌 意识扩展
        </div>
        <input
          type="text"
          value={expansion}
          onChange={(e) => setExpansion(e.target.value)}
          placeholder="扩展了什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="你的体验是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="发生了什么变化？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!expansion.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: expansion.trim() ? 'pointer' : 'not-allowed',
            opacity: expansion.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录扩展
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的扩展</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🌌 {r.expansion}</div>
              {r.experience && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.experience}</div>}
              {r.change && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌌 还没有扩展
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CosmicViewModule({ records, setRecords }: {
  records: CosmicViewRecord[]
  setRecords: (fn: (prev: CosmicViewRecord[]) => CosmicViewRecord[]) => void
}) {
  const [view, setView] = useState('')
  const [cognition, setCognition] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!view.trim()) return
    const item: CosmicViewRecord = {
      id: `${Date.now()}`,
      view: view.trim(),
      cognition: cognition.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setView('')
    setCognition('')
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
          { label: '视角总数', value: stats.total, icon: '🔭' },
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
          🔭 宇宙视角
        </div>
        <input
          type="text"
          value={view}
          onChange={(e) => setView(e.target.value)}
          placeholder="视角是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={cognition}
          onChange={(e) => setCognition(e.target.value)}
          placeholder="你的认知是什么？"
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
          disabled={!view.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: view.trim() ? 'pointer' : 'not-allowed',
            opacity: view.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录视角
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的视角</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🔭 {r.view}</div>
              {r.cognition && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.cognition}</div>}
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔭 还没有视角
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UnityModule({ records, setRecords }: {
  records: UnityRecord[]
  setRecords: (fn: (prev: UnityRecord[]) => UnityRecord[]) => void
}) {
  const [unity, setUnity] = useState('')
  const [moment, setMoment] = useState('')
  const [harvest, setHarvest] = useState('')

  const addRecord = () => {
    if (!unity.trim()) return
    const item: UnityRecord = {
      id: `${Date.now()}`,
      unity: unity.trim(),
      moment: moment.trim(),
      harvest: harvest.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setUnity('')
    setMoment('')
    setHarvest('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withHarvest: records.filter(r => r.harvest).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '合一总数', value: stats.total, icon: '🌟' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有收获', value: stats.withHarvest, icon: '🎁' },
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
          🌟 合一体验
        </div>
        <input
          type="text"
          value={unity}
          onChange={(e) => setUnity(e.target.value)}
          placeholder="合一是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="那个时刻是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={harvest}
          onChange={(e) => setHarvest(e.target.value)}
          placeholder="你的收获是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!unity.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: unity.trim() ? 'pointer' : 'not-allowed',
            opacity: unity.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录合一
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的合一</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🌟 {r.unity}</div>
              {r.moment && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⏰ {r.moment}</div>}
              {r.harvest && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎁 {r.harvest}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌟 还没有合一
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'jupiter-uranus-neptune'
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
  { id: 'expansion', name: '意识扩展', icon: '🌌' },
  { id: 'cosmicView', name: '宇宙视角', icon: '🔭' },
  { id: 'unity', name: '合一体验', icon: '🌟' },
]

export default function JupiterUranusNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('expansion')
  const [expansions, setExpansions] = useLocalStorage<ExpansionRecord[]>('jun-expansions', [])
  const [cosmicViews, setCosmicViews] = useLocalStorage<CosmicViewRecord[]>('jun-cosmicviews', [])
  const [unities, setUnities] = useLocalStorage<UnityRecord[]>('jun-unities', [])

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
        {activeTab === 'expansion' && <ExpansionModule records={expansions} setRecords={setExpansions} />}
        {activeTab === 'cosmicView' && <CosmicViewModule records={cosmicViews} setRecords={setCosmicViews} />}
        {activeTab === 'unity' && <UnityModule records={unities} setRecords={setUnities} />}
      </div>
    </ComboShell>
  )
}
