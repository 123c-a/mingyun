import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface DiscoveryRecord {
  id: string
  discovery: string
  type: string
  feeling: string
  createdAt: string
}

interface MomentRecord {
  id: string
  moment: string
  content: string
  rating: string
  createdAt: string
}

interface RitualRecord {
  id: string
  ritual: string
  frequency: string
  days: string
  createdAt: string
}

const TYPE_OPTIONS = ['人物', '事物', '感受', '想法', '场景', '其他']
const FEELING_OPTIONS = ['惊喜', '温暖', '治愈', '启发', '平静', '喜悦']
const RATING_OPTIONS = ['1', '2', '3', '4', '5']
const FREQUENCY_OPTIONS = ['每日', '每周', '每月', '偶尔']

function DiscoveryModule({ records, setRecords }: {
  records: DiscoveryRecord[]
  setRecords: (fn: (prev: DiscoveryRecord[]) => DiscoveryRecord[]) => void
}) {
  const [discovery, setDiscovery] = useState('')
  const [type, setType] = useState('事物')
  const [feeling, setFeeling] = useState('惊喜')

  const addRecord = () => {
    if (!discovery.trim()) return
    const item: DiscoveryRecord = {
      id: `${Date.now()}`,
      discovery: discovery.trim(),
      type,
      feeling,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setDiscovery('')
  }

  const stats = {
    total: records.length,
    today: records.filter(r => r.createdAt === new Date().toLocaleDateString('zh-CN')).length,
    types: new Set(records.map(r => r.type)).size,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '发现总数', value: stats.total, icon: '🌟' },
          { label: '今日发现', value: stats.today, icon: '📅' },
          { label: '涉及类型', value: stats.types, icon: '📂' },
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
          🌟 美好发现
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            {TYPE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={feeling} onChange={(e) => setFeeling(e.target.value)} style={selectStyle}>
            {FEELING_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <textarea
          value={discovery}
          onChange={(e) => setDiscovery(e.target.value)}
          placeholder="今天发现了什么美好的人事物..."
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!discovery.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: discovery.trim() ? 'pointer' : 'not-allowed',
            opacity: discovery.trim() ? 1 : 0.5,
          }}
        >
          🌟 记录发现
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的发现</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>{r.type} · {r.feeling}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{r.discovery}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌟 还没有发现</div>
          )}
        </div>
      </div>
    </div>
  )
}

function MomentModule({ records, setRecords }: {
  records: MomentRecord[]
  setRecords: (fn: (prev: MomentRecord[]) => MomentRecord[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState('5')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: MomentRecord = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      content: content.trim(),
      rating,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setContent('')
  }

  const stats = {
    total: records.length,
    avgRating: records.length ? (records.reduce((sum, r) => sum + parseInt(r.rating), 0) / records.length).toFixed(1) : '0',
    thisWeek: records.filter(r => {
      const date = new Date(r.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '品味时刻', value: stats.total, icon: '☕' },
          { label: '平均评分', value: stats.avgRating, icon: '⭐' },
          { label: '本周时刻', value: stats.thisWeek, icon: '📅' },
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
          ☕ 品味时刻
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="这是一个什么时刻？"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="此刻的感受和内容..."
          style={{ ...textAreaStyle, minHeight: 80 }}
        />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>评分</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {RATING_OPTIONS.map(r => (
              <button
                key={r}
                onClick={() => setRating(r)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8,
                  background: rating === r ? `${PRIMARY_COLOR}40` : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${rating === r ? PRIMARY_COLOR + '60' : PRIMARY_COLOR + '20'}`,
                  color: rating === r ? '#d0f0ff' : 'rgba(255,255,255,0.5)',
                  fontSize: 12, cursor: 'pointer',
                }}
              >
                {r}星
              </button>
            ))}
          </div>
        </div>
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
          ☕ 记录时刻
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的品味</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>☕ {r.moment}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{'⭐'.repeat(parseInt(r.rating))}</span>
              </div>
              {r.content && <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6 }}>{r.content}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>☕ 还没有时刻</div>
          )}
        </div>
      </div>
    </div>
  )
}

function RitualModule({ records, setRecords }: {
  records: RitualRecord[]
  setRecords: (fn: (prev: RitualRecord[]) => RitualRecord[]) => void
}) {
  const [ritual, setRitual] = useState('')
  const [frequency, setFrequency] = useState('每日')
  const [days, setDays] = useState('')

  const addRecord = () => {
    if (!ritual.trim()) return
    const item: RitualRecord = {
      id: `${Date.now()}`,
      ritual: ritual.trim(),
      frequency,
      days: days.trim() || '0',
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setRitual('')
    setDays('')
  }

  const stats = {
    total: records.length,
    daily: records.filter(r => r.frequency === '每日').length,
    totalDays: records.reduce((sum, r) => sum + parseInt(r.days || '0'), 0),
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '仪式总数', value: stats.total, icon: '🧘' },
          { label: '每日仪式', value: stats.daily, icon: '📅' },
          { label: '累计天数', value: stats.totalDays, icon: '🔥' },
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
          🧘 日常仪式
        </div>
        <input
          type="text"
          value={ritual}
          onChange={(e) => setRitual(e.target.value)}
          placeholder="你的日常仪式是什么？"
          style={inputStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={selectStyle}>
            {FREQUENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="坚持天数"
            style={inputStyle}
          />
        </div>
        <button
          onClick={addRecord}
          disabled={!ritual.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: ritual.trim() ? 'pointer' : 'not-allowed',
            opacity: ritual.trim() ? 1 : 0.5,
          }}
        >
          🧘 记录仪式
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的仪式</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>🧘 {r.ritual}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.frequency}</span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>已坚持 {r.days} 天</div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🧘 还没有仪式</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-venus-earth'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-venus-earth'].secondaryColor

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

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0f0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'discovery', name: '美好发现', icon: '🌟' },
  { id: 'moment', name: '品味时刻', icon: '☕' },
  { id: 'ritual', name: '日常仪式', icon: '🧘' },
]

export default function MercuryVenusEarthPage() {
  const config = comboConfigs['mercury-venus-earth']
  const [activeTab, setActiveTab] = useState<string>('discovery')
  const [discoveries, setDiscoveries] = useLocalStorage<DiscoveryRecord[]>('mve-discoveries', [])
  const [moments, setMoments] = useLocalStorage<MomentRecord[]>('mve-moments', [])
  const [rituals, setRituals] = useLocalStorage<RitualRecord[]>('mve-rituals', [])

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
        {activeTab === 'discovery' && <DiscoveryModule records={discoveries} setRecords={setDiscoveries} />}
        {activeTab === 'moment' && <MomentModule records={moments} setRecords={setMoments} />}
        {activeTab === 'ritual' && <RitualModule records={rituals} setRecords={setRituals} />}
      </div>
    </ComboShell>
  )
}
