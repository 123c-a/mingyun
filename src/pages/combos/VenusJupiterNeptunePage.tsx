import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface AbundanceFeeling {
  id: string
  feeling: string
  type: string
  abundanceLevel: string
  createdAt: string
}

interface SpiritualAbundance {
  id: string
  dimension: string
  practice: string
  harvest: string
  createdAt: string
}

interface SpiritualFullness {
  id: string
  experience: string
  feeling: string
  expression: string
  createdAt: string
}

function AbundanceFeelingModule({ records, setRecords }: {
  records: AbundanceFeeling[]
  setRecords: (fn: (prev: AbundanceFeeling[]) => AbundanceFeeling[]) => void
}) {
  const [feeling, setFeeling] = useState('')
  const [type, setType] = useState('')
  const [abundanceLevel, setAbundanceLevel] = useState('')

  const addRecord = () => {
    if (!feeling.trim()) return
    const item: AbundanceFeeling = {
      id: `${Date.now()}`,
      feeling: feeling.trim(),
      type: type.trim(),
      abundanceLevel: abundanceLevel.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setFeeling('')
    setType('')
    setAbundanceLevel('')
  }

  const stats = {
    total: records.length,
    thisWeek: records.filter(r => {
      const date = new Date(r.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
    abundant: records.filter(r => r.abundanceLevel === '丰富' || r.abundanceLevel === '非常丰富').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '富足感受', value: stats.total, icon: '💎' },
          { label: '本周感受', value: stats.thisWeek, icon: '📅' },
          { label: '感觉很丰富', value: stats.abundant, icon: '✨' },
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
          💎 富足感受
        </div>
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="类型（物质/情感/精神/全面）"
          style={inputStyle}
        />
        <input
          type="text"
          value={abundanceLevel}
          onChange={(e) => setAbundanceLevel(e.target.value)}
          placeholder="丰盛感（一般/丰富/非常丰富）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!feeling.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: feeling.trim() ? 'pointer' : 'not-allowed',
            opacity: feeling.trim() ? 1 : 0.5,
          }}
        >
          💎 记录感受
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.feeling}</div>
              {r.type && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>💎 {r.type}</div>}
              {r.abundanceLevel && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>✨ {r.abundanceLevel}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💎 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpiritualAbundanceModule({ records, setRecords }: {
  records: SpiritualAbundance[]
  setRecords: (fn: (prev: SpiritualAbundance[]) => SpiritualAbundance[]) => void
}) {
  const [dimension, setDimension] = useState('')
  const [practice, setPractice] = useState('')
  const [harvest, setHarvest] = useState('')

  const addRecord = () => {
    if (!dimension.trim()) return
    const item: SpiritualAbundance = {
      id: `${Date.now()}`,
      dimension: dimension.trim(),
      practice: practice.trim(),
      harvest: harvest.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setDimension('')
    setPractice('')
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
          { label: '心灵富足', value: stats.total, icon: '🌟' },
          { label: '本月收获', value: stats.thisMonth, icon: '📅' },
          { label: '有收获', value: stats.withHarvest, icon: '🎁' },
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
          🌟 心灵富足
        </div>
        <input
          type="text"
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
          placeholder="富足维度是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="如何实践？"
          style={inputStyle}
        />
        <textarea
          value={harvest}
          onChange={(e) => setHarvest(e.target.value)}
          placeholder="收获了什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!dimension.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: dimension.trim() ? 'pointer' : 'not-allowed',
            opacity: dimension.trim() ? 1 : 0.5,
          }}
        >
          🌟 记录富足
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.dimension}</div>
              {r.practice && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌟 {r.practice}</div>}
              {r.harvest && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🎁 {r.harvest}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌟 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpiritualFullnessModule({ records, setRecords }: {
  records: SpiritualFullness[]
  setRecords: (fn: (prev: SpiritualFullness[]) => SpiritualFullness[]) => void
}) {
  const [experience, setExperience] = useState('')
  const [feeling, setFeeling] = useState('')
  const [expression, setExpression] = useState('')

  const addRecord = () => {
    if (!experience.trim()) return
    const item: SpiritualFullness = {
      id: `${Date.now()}`,
      experience: experience.trim(),
      feeling: feeling.trim(),
      expression: expression.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setExperience('')
    setFeeling('')
    setExpression('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withExpression: records.filter(r => r.expression).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '灵性丰盛', value: stats.total, icon: '🌈' },
          { label: '本月体验', value: stats.thisMonth, icon: '📅' },
          { label: '有表达', value: stats.withExpression, icon: '💫' },
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
          🌈 灵性丰盛
        </div>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="丰盛体验是什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？"
          style={inputStyle}
        />
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="如何表达？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!experience.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: experience.trim() ? 'pointer' : 'not-allowed',
            opacity: experience.trim() ? 1 : 0.5,
          }}
        >
          🌈 记录丰盛
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.experience}</div>
              {r.feeling && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌈 {r.feeling}</div>}
              {r.expression && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💫 {r.expression}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌈 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-jupiter-neptune']
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

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0f0ff', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const TAB_LIST = [
  { id: 'abundance', name: '富足感受', icon: '💎' },
  { id: 'spiritual', name: '心灵富足', icon: '🌟' },
  { id: 'fullness', name: '灵性丰盛', icon: '🌈' },
]

export default function VenusJupiterNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('abundance')
  const [abundanceRecords, setAbundanceRecords] = useLocalStorage<AbundanceFeeling[]>('vjn-abundance', [])
  const [spiritualRecords, setSpiritualRecords] = useLocalStorage<SpiritualAbundance[]>('vjn-spiritual', [])
  const [fullnessRecords, setFullnessRecords] = useLocalStorage<SpiritualFullness[]>('vjn-fullness', [])

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
        {activeTab === 'abundance' && <AbundanceFeelingModule records={abundanceRecords} setRecords={setAbundanceRecords} />}
        {activeTab === 'spiritual' && <SpiritualAbundanceModule records={spiritualRecords} setRecords={setSpiritualRecords} />}
        {activeTab === 'fullness' && <SpiritualFullnessModule records={fullnessRecords} setRecords={setFullnessRecords} />}
      </div>
    </ComboShell>
  )
}
