import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface SupernovaRecord {
  id: string
  supernova: string
  impact: string
  change: string
  createdAt: string
}

interface VibrationRecord {
  id: string
  vibration: string
  feeling: string
  response: string
  createdAt: string
}

interface NewRealityRecord {
  id: string
  newReality: string
  adaptation: string
  growth: string
  createdAt: string
}

function SupernovaModule({ records, setRecords }: {
  records: SupernovaRecord[]
  setRecords: (fn: (prev: SupernovaRecord[]) => SupernovaRecord[]) => void
}) {
  const [supernova, setSupernova] = useState('')
  const [impact, setImpact] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!supernova.trim()) return
    const item: SupernovaRecord = {
      id: `${Date.now()}`,
      supernova: supernova.trim(),
      impact: impact.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setSupernova('')
    setImpact('')
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
          { label: '爆发总数', value: stats.total, icon: '💥' },
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
          💥 超新星爆发
        </div>
        <input
          type="text"
          value={supernova}
          onChange={(e) => setSupernova(e.target.value)}
          placeholder="爆发的内容是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="它带来了什么影响？"
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
          disabled={!supernova.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: supernova.trim() ? 'pointer' : 'not-allowed',
            opacity: supernova.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录爆发
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的爆发</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>💥 {r.supernova}</div>
              {r.impact && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🌊 {r.impact}</div>}
              {r.change && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💥 还没有爆发
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VibrationModule({ records, setRecords }: {
  records: VibrationRecord[]
  setRecords: (fn: (prev: VibrationRecord[]) => VibrationRecord[]) => void
}) {
  const [vibration, setVibration] = useState('')
  const [feeling, setFeeling] = useState('')
  const [response, setResponse] = useState('')

  const addRecord = () => {
    if (!vibration.trim()) return
    const item: VibrationRecord = {
      id: `${Date.now()}`,
      vibration: vibration.trim(),
      feeling: feeling.trim(),
      response: response.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setVibration('')
    setFeeling('')
    setResponse('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withResponse: records.filter(r => r.response).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '震动总数', value: stats.total, icon: '📳' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有应对', value: stats.withResponse, icon: '✅' },
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
          📳 震动感知
        </div>
        <input
          type="text"
          value={vibration}
          onChange={(e) => setVibration(e.target.value)}
          placeholder="震动是什么？"
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
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="你如何应对？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!vibration.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: vibration.trim() ? 'pointer' : 'not-allowed',
            opacity: vibration.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录震动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的震动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>📳 {r.vibration}</div>
              {r.feeling && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.feeling}</div>}
              {r.response && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✅ {r.response}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📳 还没有震动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewRealityModule({ records, setRecords }: {
  records: NewRealityRecord[]
  setRecords: (fn: (prev: NewRealityRecord[]) => NewRealityRecord[]) => void
}) {
  const [newReality, setNewReality] = useState('')
  const [adaptation, setAdaptation] = useState('')
  const [growth, setGrowth] = useState('')

  const addRecord = () => {
    if (!newReality.trim()) return
    const item: NewRealityRecord = {
      id: `${Date.now()}`,
      newReality: newReality.trim(),
      adaptation: adaptation.trim(),
      growth: growth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setNewReality('')
    setAdaptation('')
    setGrowth('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withGrowth: records.filter(r => r.growth).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '新现实总数', value: stats.total, icon: '🌍' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有成长', value: stats.withGrowth, icon: '📈' },
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
          🌍 新现实
        </div>
        <input
          type="text"
          value={newReality}
          onChange={(e) => setNewReality(e.target.value)}
          placeholder="新现实是什么？"
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
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="你的成长是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!newReality.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: newReality.trim() ? 'pointer' : 'not-allowed',
            opacity: newReality.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录新现实
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的新现实</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🌍 {r.newReality}</div>
              {r.adaptation && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.adaptation}</div>}
              {r.growth && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📈 {r.growth}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌍 还没有新现实
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'earth-uranus-neptune'
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
  { id: 'supernova', name: '超新星爆发', icon: '💥' },
  { id: 'vibration', name: '震动感知', icon: '📳' },
  { id: 'newReality', name: '新现实', icon: '🌍' },
]

export default function EarthUranusNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('supernova')
  const [supernovas, setSupernovas] = useLocalStorage<SupernovaRecord[]>('eun-supernovas', [])
  const [vibrations, setVibrations] = useLocalStorage<VibrationRecord[]>('eun-vibrations', [])
  const [newRealities, setNewRealities] = useLocalStorage<NewRealityRecord[]>('eun-newrealities', [])

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
        {activeTab === 'supernova' && <SupernovaModule records={supernovas} setRecords={setSupernovas} />}
        {activeTab === 'vibration' && <VibrationModule records={vibrations} setRecords={setVibrations} />}
        {activeTab === 'newReality' && <NewRealityModule records={newRealities} setRecords={setNewRealities} />}
      </div>
    </ComboShell>
  )
}
