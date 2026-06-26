import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface FeelingRecord {
  id: string
  feeling: string
  source: string
  expressed: string
  createdAt: string
}

interface HeartTalkRecord {
  id: string
  heartTalk: string
  translation: string
  action: string
  createdAt: string
}

interface SpiritualRecord {
  id: string
  moment: string
  experience: string
  gain: string
  createdAt: string
}

const SOURCE_OPTIONS = ['梦境', '直觉', '冥想', '音乐', '艺术', '自然', '对话', '其他']
const EXPRESSED_OPTIONS = ['是', '否', '部分']

function FeelingModule({ records, setRecords }: {
  records: FeelingRecord[]
  setRecords: (fn: (prev: FeelingRecord[]) => FeelingRecord[]) => void
}) {
  const [feeling, setFeeling] = useState('')
  const [source, setSource] = useState('直觉')
  const [expressed, setExpressed] = useState('否')

  const addRecord = () => {
    if (!feeling.trim()) return
    const item: FeelingRecord = {
      id: `${Date.now()}`,
      feeling: feeling.trim(),
      source,
      expressed,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
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
    expressedCount: records.filter(r => r.expressed === '是').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '感受总数', value: stats.total, icon: '💭' },
          { label: '本月感受', value: stats.thisMonth, icon: '📅' },
          { label: '已表达', value: stats.expressedCount, icon: '🗣️' },
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
          💭 深层感受
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
            {SOURCE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={expressed} onChange={(e) => setExpressed(e.target.value)} style={selectStyle}>
            {EXPRESSED_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="此刻你感受到什么深层情绪？"
          style={textAreaStyle}
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
          💭 记录感受
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的感受</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>{r.source}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.expressed === '是' ? '🗣️ 已表达' : '🤐 未表达'}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{r.feeling}</div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💭 还没有感受</div>
          )}
        </div>
      </div>
    </div>
  )
}

function HeartTalkModule({ records, setRecords }: {
  records: HeartTalkRecord[]
  setRecords: (fn: (prev: HeartTalkRecord[]) => HeartTalkRecord[]) => void
}) {
  const [heartTalk, setHeartTalk] = useState('')
  const [translation, setTranslation] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!heartTalk.trim()) return
    const item: HeartTalkRecord = {
      id: `${Date.now()}`,
      heartTalk: heartTalk.trim(),
      translation: translation.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setHeartTalk('')
    setTranslation('')
    setAction('')
  }

  const stats = {
    total: records.length,
    withTranslation: records.filter(r => r.translation).length,
    withAction: records.filter(r => r.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '心语总数', value: stats.total, icon: '💗' },
          { label: '已有翻译', value: stats.withTranslation, icon: '🔮' },
          { label: '已转行动', value: stats.withAction, icon: '🎯' },
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
          💗 心语翻译
        </div>
        <textarea
          value={heartTalk}
          onChange={(e) => setHeartTalk(e.target.value)}
          placeholder="你的心在说什么？"
          style={textAreaStyle}
        />
        <textarea
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="翻译成理性语言是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你将采取什么行动？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!heartTalk.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: heartTalk.trim() ? 'pointer' : 'not-allowed',
            opacity: heartTalk.trim() ? 1 : 0.5,
          }}
        >
          💗 翻译心语
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的心语</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>💗 {r.heartTalk}</div>
              {r.translation && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>翻译: {r.translation}</div>}
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>行动: {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💗 还没有心语</div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpiritualModule({ records, setRecords }: {
  records: SpiritualRecord[]
  setRecords: (fn: (prev: SpiritualRecord[]) => SpiritualRecord[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [experience, setExperience] = useState('')
  const [gain, setGain] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: SpiritualRecord = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      experience: experience.trim(),
      gain: gain.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setExperience('')
    setGain('')
  }

  const stats = {
    total: records.length,
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
          { label: '灵性时刻', value: stats.total, icon: '✨' },
          { label: '本月时刻', value: stats.thisMonth, icon: '📅' },
          { label: '心灵收获', value: stats.total, icon: '🌟' },
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
          ✨ 灵性时刻
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="这是一个什么时刻？"
          style={inputStyle}
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="你的体验是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={gain}
          onChange={(e) => setGain(e.target.value)}
          placeholder="你收获了什么？"
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
          ✨ 记录灵性时刻
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的灵性时刻</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>✨ {r.moment}</div>
              {r.experience && <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>{r.experience}</div>}
              {r.gain && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>收获: {r.gain}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>✨ 还没有灵性时刻</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-venus-neptune'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-venus-neptune'].secondaryColor

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
  { id: 'feeling', name: '深层感受', icon: '💭' },
  { id: 'hearttalk', name: '心语翻译', icon: '💗' },
  { id: 'spiritual', name: '灵性时刻', icon: '✨' },
]

export default function MercuryVenusNeptunePage() {
  const config = comboConfigs['mercury-venus-neptune']
  const [activeTab, setActiveTab] = useState<string>('feeling')
  const [feelings, setFeelings] = useLocalStorage<FeelingRecord[]>('mvn-feelings', [])
  const [heartTalks, setHeartTalks] = useLocalStorage<HeartTalkRecord[]>('mvn-hearttalks', [])
  const [spiritualRecords, setSpiritualRecords] = useLocalStorage<SpiritualRecord[]>('mvn-spiritualrecords', [])

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
        {activeTab === 'feeling' && <FeelingModule records={feelings} setRecords={setFeelings} />}
        {activeTab === 'hearttalk' && <HeartTalkModule records={heartTalks} setRecords={setHeartTalks} />}
        {activeTab === 'spiritual' && <SpiritualModule records={spiritualRecords} setRecords={setSpiritualRecords} />}
      </div>
    </ComboShell>
  )
}
