import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface HighFrequencyVibration {
  id: string
  vibration: string
  experience: string
  feeling: string
  createdAt: string
}

interface SoulConnection {
  id: string
  connection: string
  depth: string
  experience: string
  createdAt: string
}

interface ResonanceMoment {
  id: string
  moment: string
  content: string
  harvest: string
  createdAt: string
}

function HighFrequencyVibrationModule({ records, setRecords }: {
  records: HighFrequencyVibration[]
  setRecords: (fn: (prev: HighFrequencyVibration[]) => HighFrequencyVibration[]) => void
}) {
  const [vibration, setVibration] = useState('')
  const [experience, setExperience] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!vibration.trim()) return
    const item: HighFrequencyVibration = {
      id: `${Date.now()}`,
      vibration: vibration.trim(),
      experience: experience.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setVibration('')
    setExperience('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    highVibration: records.filter(r => r.feeling === '很高' || r.feeling === '非常高').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '高频振动', value: stats.total, icon: '✨' },
          { label: '本月振动', value: stats.thisMonth, icon: '📅' },
          { label: '频率很高', value: stats.highVibration, icon: '🌟' },
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
          ✨ 高频振动
        </div>
        <input
          type="text"
          value={vibration}
          onChange={(e) => setVibration(e.target.value)}
          placeholder="振动是什么？"
          style={inputStyle}
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="体验如何？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？（一般/高/很高/非常高）"
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
          ✨ 记录振动
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.vibration}</div>
              {r.experience && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>✨ {r.experience}</div>}
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌟 {r.feeling}</div>}
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

function SoulConnectionModule({ records, setRecords }: {
  records: SoulConnection[]
  setRecords: (fn: (prev: SoulConnection[]) => SoulConnection[]) => void
}) {
  const [connection, setConnection] = useState('')
  const [depth, setDepth] = useState('')
  const [experience, setExperience] = useState('')

  const addRecord = () => {
    if (!connection.trim()) return
    const item: SoulConnection = {
      id: `${Date.now()}`,
      connection: connection.trim(),
      depth: depth.trim(),
      experience: experience.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setConnection('')
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
          { label: '灵魂连接', value: stats.total, icon: '🔮' },
          { label: '很深连接', value: stats.deep, icon: '💜' },
          { label: '本月连接', value: stats.thisMonth, icon: '📅' },
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
          🔮 灵魂连接
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
          🔮 记录连接
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
              {r.depth && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>💜 {r.depth}</div>}
              {r.experience && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🔮 {r.experience}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔮 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResonanceMomentModule({ records, setRecords }: {
  records: ResonanceMoment[]
  setRecords: (fn: (prev: ResonanceMoment[]) => ResonanceMoment[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [content, setContent] = useState('')
  const [harvest, setHarvest] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: ResonanceMoment = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      content: content.trim(),
      harvest: harvest.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setContent('')
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
          { label: '共振时刻', value: stats.total, icon: '🌟' },
          { label: '本月时刻', value: stats.thisMonth, icon: '📅' },
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
          🌟 共振时刻
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="共振时刻是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="共振内容是什么？"
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
          disabled={!moment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: moment.trim() ? 'pointer' : 'not-allowed',
            opacity: moment.trim() ? 1 : 0.5,
          }}
        >
          🌟 记录共振
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.moment}</div>
              {r.content && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌟 {r.content}</div>}
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

const config = comboConfigs['venus-uranus-neptune']
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
  { id: 'vibration', name: '高频振动', icon: '✨' },
  { id: 'soul', name: '灵魂连接', icon: '🔮' },
  { id: 'resonance', name: '共振时刻', icon: '🌟' },
]

export default function VenusUranusNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('vibration')
  const [vibrationRecords, setVibrationRecords] = useLocalStorage<HighFrequencyVibration[]>('vun-vibration', [])
  const [soulRecords, setSoulRecords] = useLocalStorage<SoulConnection[]>('vun-soul', [])
  const [resonanceRecords, setResonanceRecords] = useLocalStorage<ResonanceMoment[]>('vun-resonance', [])

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
        {activeTab === 'vibration' && <HighFrequencyVibrationModule records={vibrationRecords} setRecords={setVibrationRecords} />}
        {activeTab === 'soul' && <SoulConnectionModule records={soulRecords} setRecords={setSoulRecords} />}
        {activeTab === 'resonance' && <ResonanceMomentModule records={resonanceRecords} setRecords={setResonanceRecords} />}
      </div>
    </ComboShell>
  )
}
