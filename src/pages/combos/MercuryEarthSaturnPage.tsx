import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface PracticeRecord {
  id: string
  practice: string
  status: string
  feeling: string
  createdAt: string
}

interface AwarenessRecord {
  id: string
  awareness: string
  trigger: string
  change: string
  createdAt: string
}

interface PatienceRecord {
  id: string
  content: string
  duration: string
  gain: string
  createdAt: string
}

const STATUS_OPTIONS = ['开始', '践行中', '完成', '暂停']

function PracticeModule({ records, setRecords }: {
  records: PracticeRecord[]
  setRecords: (fn: (prev: PracticeRecord[]) => PracticeRecord[]) => void
}) {
  const [practice, setPractice] = useState('')
  const [status, setStatus] = useState('开始')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!practice.trim()) return
    const item: PracticeRecord = {
      id: `${Date.now()}`,
      practice: practice.trim(),
      status,
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPractice('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    ongoing: records.filter(r => r.status === '践行中').length,
    completed: records.filter(r => r.status === '完成').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '功课总数', value: stats.total, icon: '🧘' },
          { label: '践行中', value: stats.ongoing, icon: '🔄' },
          { label: '已完成', value: stats.completed, icon: '✅' },
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
          🧘 修行功课
        </div>
        <textarea
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="今天践行什么功课？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            {STATUS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="践行感受"
            style={inputStyle}
          />
        </div>
        <button
          onClick={addRecord}
          disabled={!practice.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: practice.trim() ? 'pointer' : 'not-allowed',
            opacity: practice.trim() ? 1 : 0.5,
          }}
        >
          🧘 记录功课
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的功课</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>🧘 {r.practice}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.status}</span>
              </div>
              {r.feeling && <div style={{ fontSize: 11, opacity: 0.6 }}>感受: {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🧘 还没有功课</div>
          )}
        </div>
      </div>
    </div>
  )
}

function AwarenessModule({ records, setRecords }: {
  records: AwarenessRecord[]
  setRecords: (fn: (prev: AwarenessRecord[]) => AwarenessRecord[]) => void
}) {
  const [awareness, setAwareness] = useState('')
  const [trigger, setTrigger] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!awareness.trim()) return
    const item: AwarenessRecord = {
      id: `${Date.now()}`,
      awareness: awareness.trim(),
      trigger: trigger.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAwareness('')
    setTrigger('')
    setChange('')
  }

  const stats = {
    total: records.length,
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
          { label: '觉察总数', value: stats.total, icon: '👁️' },
          { label: '本周觉察', value: stats.thisWeek, icon: '📅' },
          { label: '持续觉醒', value: stats.total, icon: '✨' },
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
          👁️ 日常觉察
        </div>
        <textarea
          value={awareness}
          onChange={(e) => setAwareness(e.target.value)}
          placeholder="今天觉察到了什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="是什么触发了这个觉察？"
          style={inputStyle}
        />
        <textarea
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="你做了什么改变？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!awareness.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: awareness.trim() ? 'pointer' : 'not-allowed',
            opacity: awareness.trim() ? 1 : 0.5,
          }}
        >
          👁️ 记录觉察
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的觉察</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>👁️ {r.awareness}</div>
              {r.trigger && <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>触发: {r.trigger}</div>}
              {r.change && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>改变: {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>👁️ 还没有觉察</div>
          )}
        </div>
      </div>
    </div>
  )
}

function PatienceModule({ records, setRecords }: {
  records: PatienceRecord[]
  setRecords: (fn: (prev: PatienceRecord[]) => PatienceRecord[]) => void
}) {
  const [content, setContent] = useState('')
  const [duration, setDuration] = useState('')
  const [gain, setGain] = useState('')

  const addRecord = () => {
    if (!content.trim()) return
    const item: PatienceRecord = {
      id: `${Date.now()}`,
      content: content.trim(),
      duration: duration.trim(),
      gain: gain.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setContent('')
    setDuration('')
    setGain('')
  }

  const stats = {
    total: records.length,
    totalDays: records.reduce((sum, r) => sum + parseInt(r.duration || '0'), 0),
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '练习总数', value: stats.total, icon: '⏳' },
          { label: '累计天数', value: stats.totalDays, icon: '📆' },
          { label: '耐心培养', value: stats.total, icon: '🌱' },
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
          ⏳ 耐心练习
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="练习什么内容？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="坚持天数"
            style={inputStyle}
          />
          <input
            type="text"
            value={gain}
            onChange={(e) => setGain(e.target.value)}
            placeholder="收获"
            style={inputStyle}
          />
        </div>
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
          ⏳ 记录练习
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的练习</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>⏳ {r.content}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>坚持 {r.duration} 天</div>
              {r.gain && <div style={{ fontSize: 11, color: '#a0f0a0', marginTop: 4 }}>收获: {r.gain}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>⏳ 还没有练习</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-earth-saturn'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-earth-saturn'].secondaryColor

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
  { id: 'practice', name: '修行功课', icon: '🧘' },
  { id: 'awareness', name: '日常觉察', icon: '👁️' },
  { id: 'patience', name: '耐心练习', icon: '⏳' },
]

export default function MercuryEarthSaturnPage() {
  const config = comboConfigs['mercury-earth-saturn']
  const [activeTab, setActiveTab] = useState<string>('practice')
  const [practices, setPractices] = useLocalStorage<PracticeRecord[]>('mes-practices', [])
  const [awarenesses, setAwarenesses] = useLocalStorage<AwarenessRecord[]>('mes-awarenesses', [])
  const [patiences, setPatiences] = useLocalStorage<PatienceRecord[]>('mes-patiences', [])

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
        {activeTab === 'practice' && <PracticeModule records={practices} setRecords={setPractices} />}
        {activeTab === 'awareness' && <AwarenessModule records={awarenesses} setRecords={setAwarenesses} />}
        {activeTab === 'patience' && <PatienceModule records={patiences} setRecords={setPatiences} />}
      </div>
    </ComboShell>
  )
}
