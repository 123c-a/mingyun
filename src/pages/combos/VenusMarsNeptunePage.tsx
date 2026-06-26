import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface SoulResonance {
  id: string
  resonance: string
  depth: string
  experience: string
  createdAt: string
}

interface BeyondSurface {
  id: string
  content: string
  feeling: string
  change: string
  createdAt: string
}

interface SpiritualConnection {
  id: string
  connection: string
  way: string
  experience: string
  createdAt: string
}

function SoulResonanceModule({ records, setRecords }: {
  records: SoulResonance[]
  setRecords: (fn: (prev: SoulResonance[]) => SoulResonance[]) => void
}) {
  const [resonance, setResonance] = useState('')
  const [depth, setDepth] = useState('')
  const [experience, setExperience] = useState('')

  const addRecord = () => {
    if (!resonance.trim()) return
    const item: SoulResonance = {
      id: `${Date.now()}`,
      resonance: resonance.trim(),
      depth: depth.trim(),
      experience: experience.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setResonance('')
    setDepth('')
    setExperience('')
  }

  const stats = {
    total: records.length,
    deep: records.filter(r => r.depth === '很深' || r.depth === '非常深').length,
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
          { label: '灵魂共鸣', value: stats.total, icon: '🎵' },
          { label: '很深共鸣', value: stats.deep, icon: '💜' },
          { label: '本月共鸣', value: stats.thisMonth, icon: '📅' },
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
          🎵 灵魂共鸣
        </div>
        <input
          type="text"
          value={resonance}
          onChange={(e) => setResonance(e.target.value)}
          placeholder="共鸣是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
          placeholder="深度（浅/一般/深/很深/非常深）"
          style={inputStyle}
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="体验如何？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!resonance.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: resonance.trim() ? 'pointer' : 'not-allowed',
            opacity: resonance.trim() ? 1 : 0.5,
          }}
        >
          🎵 记录共鸣
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.resonance}</div>
              {r.depth && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>💜 {r.depth}</div>}
              {r.experience && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>✨ {r.experience}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎵 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BeyondSurfaceModule({ records, setRecords }: {
  records: BeyondSurface[]
  setRecords: (fn: (prev: BeyondSurface[]) => BeyondSurface[]) => void
}) {
  const [content, setContent] = useState('')
  const [feeling, setFeeling] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!content.trim()) return
    const item: BeyondSurface = {
      id: `${Date.now()}`,
      content: content.trim(),
      feeling: feeling.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setContent('')
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
    withChange: records.filter(r => r.change).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '超越表面', value: stats.total, icon: '🌊' },
          { label: '本月超越', value: stats.thisMonth, icon: '📅' },
          { label: '有变化', value: stats.withChange, icon: '🔄' },
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
          🌊 超越表面
        </div>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="超越了什么内容？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？"
          style={inputStyle}
        />
        <textarea
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="关系发生了什么变化？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🌊 记录超越
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.content}</div>
              {r.feeling && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌊 {r.feeling}</div>}
              {r.change && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🔄 {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌊 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpiritualConnectionModule({ records, setRecords }: {
  records: SpiritualConnection[]
  setRecords: (fn: (prev: SpiritualConnection[]) => SpiritualConnection[]) => void
}) {
  const [connection, setConnection] = useState('')
  const [way, setWay] = useState('')
  const [experience, setExperience] = useState('')

  const addRecord = () => {
    if (!connection.trim()) return
    const item: SpiritualConnection = {
      id: `${Date.now()}`,
      connection: connection.trim(),
      way: way.trim(),
      experience: experience.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setConnection('')
    setWay('')
    setExperience('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    deep: records.filter(r => r.experience === '很深' || r.experience === '非常震撼').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '灵性连接', value: stats.total, icon: '✨' },
          { label: '本月连接', value: stats.thisMonth, icon: '📅' },
          { label: '很震撼', value: stats.deep, icon: '💫' },
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
          ✨ 灵性连接
        </div>
        <input
          type="text"
          value={connection}
          onChange={(e) => setConnection(e.target.value)}
          placeholder="连接的是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={way}
          onChange={(e) => setWay(e.target.value)}
          placeholder="连接方式是什么？"
          style={inputStyle}
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="体验如何？（一般/很深/非常震撼）"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!connection.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: connection.trim() ? 'pointer' : 'not-allowed',
            opacity: connection.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录连接
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.connection}</div>
              {r.way && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>✨ {r.way}</div>}
              {r.experience && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💫 {r.experience}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ✨ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-mars-neptune']
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
  { id: 'resonance', name: '灵魂共鸣', icon: '🎵' },
  { id: 'beyond', name: '超越表面', icon: '🌊' },
  { id: 'spiritual', name: '灵性连接', icon: '✨' },
]

export default function VenusMarsNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('resonance')
  const [resonanceRecords, setResonanceRecords] = useLocalStorage<SoulResonance[]>('vmn-resonance', [])
  const [beyondRecords, setBeyondRecords] = useLocalStorage<BeyondSurface[]>('vmn-beyond', [])
  const [spiritualRecords, setSpiritualRecords] = useLocalStorage<SpiritualConnection[]>('vmn-spiritual', [])

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
        {activeTab === 'resonance' && <SoulResonanceModule records={resonanceRecords} setRecords={setResonanceRecords} />}
        {activeTab === 'beyond' && <BeyondSurfaceModule records={beyondRecords} setRecords={setBeyondRecords} />}
        {activeTab === 'spiritual' && <SpiritualConnectionModule records={spiritualRecords} setRecords={setSpiritualRecords} />}
      </div>
    </ComboShell>
  )
}
