import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface ExpandLove {
  id: string
  way: string
  feeling: string
  impact: string
  createdAt: string
}

interface BoundlessLove {
  id: string
  moment: string
  experience: string
  growth: string
  createdAt: string
}

interface CosmicPerspective {
  id: string
  perspective: string
  change: string
  action: string
  createdAt: string
}

function ExpandLoveModule({ records, setRecords }: {
  records: ExpandLove[]
  setRecords: (fn: (prev: ExpandLove[]) => ExpandLove[]) => void
}) {
  const [way, setWay] = useState('')
  const [feeling, setFeeling] = useState('')
  const [impact, setImpact] = useState('')

  const addRecord = () => {
    if (!way.trim()) return
    const item: ExpandLove = {
      id: `${Date.now()}`,
      way: way.trim(),
      feeling: feeling.trim(),
      impact: impact.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setWay('')
    setFeeling('')
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
    positive: records.filter(r => r.impact === '很好' || r.impact === '正面').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '爱的扩展', value: stats.total, icon: '🌍' },
          { label: '本月扩展', value: stats.thisMonth, icon: '📅' },
          { label: '正面影响', value: stats.positive, icon: '✨' },
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
          🌍 爱的扩展
        </div>
        <input
          type="text"
          value={way}
          onChange={(e) => setWay(e.target.value)}
          placeholder="扩展方式是什么？"
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
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="带来了什么影响？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!way.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: way.trim() ? 'pointer' : 'not-allowed',
            opacity: way.trim() ? 1 : 0.5,
          }}
        >
          🌍 记录扩展
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.way}</div>
              {r.feeling && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌍 {r.feeling}</div>}
              {r.impact && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>✨ {r.impact}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌍 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BoundlessLoveModule({ records, setRecords }: {
  records: BoundlessLove[]
  setRecords: (fn: (prev: BoundlessLove[]) => BoundlessLove[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [experience, setExperience] = useState('')
  const [growth, setGrowth] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: BoundlessLove = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      experience: experience.trim(),
      growth: growth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setExperience('')
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
          { label: '无界之爱', value: stats.total, icon: '∞' },
          { label: '本月时刻', value: stats.thisMonth, icon: '📅' },
          { label: '有成长', value: stats.withGrowth, icon: '🌱' },
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
          ∞ 无界之爱
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="无界时刻是什么？"
          style={inputStyle}
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="体验如何？"
          style={textAreaStyle}
        />
        <textarea
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="带来了什么成长？"
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
          ∞ 记录时刻
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
              {r.experience && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>∞ {r.experience}</div>}
              {r.growth && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌱 {r.growth}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ∞ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CosmicPerspectiveModule({ records, setRecords }: {
  records: CosmicPerspective[]
  setRecords: (fn: (prev: CosmicPerspective[]) => CosmicPerspective[]) => void
}) {
  const [perspective, setPerspective] = useState('')
  const [change, setChange] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!perspective.trim()) return
    const item: CosmicPerspective = {
      id: `${Date.now()}`,
      perspective: perspective.trim(),
      change: change.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPerspective('')
    setChange('')
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
          { label: '宇宙视角', value: stats.total, icon: '🌌' },
          { label: '本月视角', value: stats.thisMonth, icon: '📅' },
          { label: '已行动', value: stats.withAction, icon: '⚡' },
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
          🌌 宇宙视角
        </div>
        <input
          type="text"
          value={perspective}
          onChange={(e) => setPerspective(e.target.value)}
          placeholder="获得了什么视角？"
          style={inputStyle}
        />
        <textarea
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="发生了什么改变？"
          style={textAreaStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="采取了什么行动？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!perspective.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: perspective.trim() ? 'pointer' : 'not-allowed',
            opacity: perspective.trim() ? 1 : 0.5,
          }}
        >
          🌌 记录视角
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.perspective}</div>
              {r.change && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌌 {r.change}</div>}
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌌 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-jupiter-uranus']
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
  { id: 'expand', name: '爱的扩展', icon: '🌍' },
  { id: 'boundless', name: '无界之爱', icon: '∞' },
  { id: 'cosmic', name: '宇宙视角', icon: '🌌' },
]

export default function VenusJupiterUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('expand')
  const [expandRecords, setExpandRecords] = useLocalStorage<ExpandLove[]>('vju-expand', [])
  const [boundlessRecords, setBoundlessRecords] = useLocalStorage<BoundlessLove[]>('vju-boundless', [])
  const [cosmicRecords, setCosmicRecords] = useLocalStorage<CosmicPerspective[]>('vju-cosmic', [])

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
        {activeTab === 'expand' && <ExpandLoveModule records={expandRecords} setRecords={setExpandRecords} />}
        {activeTab === 'boundless' && <BoundlessLoveModule records={boundlessRecords} setRecords={setBoundlessRecords} />}
        {activeTab === 'cosmic' && <CosmicPerspectiveModule records={cosmicRecords} setRecords={setCosmicRecords} />}
      </div>
    </ComboShell>
  )
}
