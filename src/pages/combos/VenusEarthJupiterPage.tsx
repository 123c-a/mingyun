import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface HappinessSeed {
  id: string
  seed: string
  plantDate: string
  status: string
  createdAt: string
}

interface GratitudeNurture {
  id: string
  gratitude: string
  nurtureWay: string
  feeling: string
  createdAt: string
}

interface HappinessAction {
  id: string
  action: string
  frequency: string
  happiness: string
  createdAt: string
}

function HappinessSeedModule({ records, setRecords }: {
  records: HappinessSeed[]
  setRecords: (fn: (prev: HappinessSeed[]) => HappinessSeed[]) => void
}) {
  const [seed, setSeed] = useState('')
  const [plantDate, setPlantDate] = useState('')
  const [status, setStatus] = useState('')

  const addRecord = () => {
    if (!seed.trim()) return
    const item: HappinessSeed = {
      id: `${Date.now()}`,
      seed: seed.trim(),
      plantDate: plantDate.trim(),
      status: status.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setSeed('')
    setPlantDate('')
    setStatus('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    active: records.filter(r => r.status === '发芽中' || r.status === '生长中').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '幸福种子', value: stats.total, icon: '🌱' },
          { label: '本月播种', value: stats.thisMonth, icon: '📅' },
          { label: '活跃中', value: stats.active, icon: '🌿' },
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
          🌱 幸福种子
        </div>
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="种下什么幸福种子？"
          style={inputStyle}
        />
        <input
          type="text"
          value={plantDate}
          onChange={(e) => setPlantDate(e.target.value)}
          placeholder="种下日期"
          style={inputStyle}
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="状态（种子/发芽中/生长中/开花）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!seed.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: seed.trim() ? 'pointer' : 'not-allowed',
            opacity: seed.trim() ? 1 : 0.5,
          }}
        >
          🌱 播种
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.seed}</div>
              {r.plantDate && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>📅 {r.plantDate}</div>}
              {r.status && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌿 {r.status}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌱 还没有种子
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GratitudeNurtureModule({ records, setRecords }: {
  records: GratitudeNurture[]
  setRecords: (fn: (prev: GratitudeNurture[]) => GratitudeNurture[]) => void
}) {
  const [gratitude, setGratitude] = useState('')
  const [nurtureWay, setNurtureWay] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!gratitude.trim()) return
    const item: GratitudeNurture = {
      id: `${Date.now()}`,
      gratitude: gratitude.trim(),
      nurtureWay: nurtureWay.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setGratitude('')
    setNurtureWay('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    thisWeek: records.filter(r => {
      const date = new Date(r.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
    withFeeling: records.filter(r => r.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '感恩滋养', value: stats.total, icon: '🙏' },
          { label: '本周感恩', value: stats.thisWeek, icon: '📅' },
          { label: '有感受', value: stats.withFeeling, icon: '💚' },
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
          🙏 感恩滋养
        </div>
        <input
          type="text"
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="感恩什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={nurtureWay}
          onChange={(e) => setNurtureWay(e.target.value)}
          placeholder="如何滋养？"
          style={inputStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!gratitude.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: gratitude.trim() ? 'pointer' : 'not-allowed',
            opacity: gratitude.trim() ? 1 : 0.5,
          }}
        >
          🙏 记录感恩
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.gratitude}</div>
              {r.nurtureWay && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌱 {r.nurtureWay}</div>}
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💚 {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🙏 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HappinessActionModule({ records, setRecords }: {
  records: HappinessAction[]
  setRecords: (fn: (prev: HappinessAction[]) => HappinessAction[]) => void
}) {
  const [action, setAction] = useState('')
  const [frequency, setFrequency] = useState('')
  const [happiness, setHappiness] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: HappinessAction = {
      id: `${Date.now()}`,
      action: action.trim(),
      frequency: frequency.trim(),
      happiness: happiness.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setFrequency('')
    setHappiness('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    highHappiness: records.filter(r => r.happiness === '很高' || r.happiness === '非常高').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '幸福行动', value: stats.total, icon: '☀️' },
          { label: '本月行动', value: stats.thisMonth, icon: '📅' },
          { label: '高幸福感', value: stats.highHappiness, icon: '🌟' },
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
          ☀️ 幸福行动
        </div>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="做了什么行动？"
          style={inputStyle}
        />
        <input
          type="text"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          placeholder="频率（每天/每周/偶尔）"
          style={inputStyle}
        />
        <input
          type="text"
          value={happiness}
          onChange={(e) => setHappiness(e.target.value)}
          placeholder="幸福感（低/中/高/很高）"
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
          ☀️ 记录行动
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.action}</div>
              {r.frequency && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>📅 {r.frequency}</div>}
              {r.happiness && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌟 {r.happiness}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ☀️ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-earth-jupiter']
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
  { id: 'seed', name: '幸福种子', icon: '🌱' },
  { id: 'gratitude', name: '感恩滋养', icon: '🙏' },
  { id: 'action', name: '幸福行动', icon: '☀️' },
]

export default function VenusEarthJupiterPage() {
  const [activeTab, setActiveTab] = useState<string>('seed')
  const [seedRecords, setSeedRecords] = useLocalStorage<HappinessSeed[]>('vej-seed', [])
  const [gratitudeRecords, setGratitudeRecords] = useLocalStorage<GratitudeNurture[]>('vej-gratitude', [])
  const [actionRecords, setActionRecords] = useLocalStorage<HappinessAction[]>('vej-action', [])

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
        {activeTab === 'seed' && <HappinessSeedModule records={seedRecords} setRecords={setSeedRecords} />}
        {activeTab === 'gratitude' && <GratitudeNurtureModule records={gratitudeRecords} setRecords={setGratitudeRecords} />}
        {activeTab === 'action' && <HappinessActionModule records={actionRecords} setRecords={setActionRecords} />}
      </div>
    </ComboShell>
  )
}
