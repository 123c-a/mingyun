import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface LoveLanguageRecord {
  id: string
  languageType: string
  content: string
  feeling: string
  createdAt: string
}

interface AwarenessRecord {
  id: string
  relationship: string
  insight: string
  action: string
  createdAt: string
}

interface CommitmentRecord {
  id: string
  commitment: string
  target: string
  progress: string
  createdAt: string
}

const LANGUAGE_TYPE_OPTIONS = ['肯定的话语', '精心的时刻', '接受礼物', '服务的行动', '身体的接触']
const RELATIONSHIP_OPTIONS = ['家人', '朋友', '伴侣', '同事', '自己', '其他']
const PROGRESS_OPTIONS = ['开始', '进行中', '完成', '暂停']

function LoveLanguageModule({ records, setRecords }: {
  records: LoveLanguageRecord[]
  setRecords: (fn: (prev: LoveLanguageRecord[]) => LoveLanguageRecord[]) => void
}) {
  const [languageType, setLanguageType] = useState('肯定的话语')
  const [content, setContent] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!content.trim()) return
    const item: LoveLanguageRecord = {
      id: `${Date.now()}`,
      languageType,
      content: content.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setContent('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    types: new Set(records.map(r => r.languageType)).size,
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
          { label: '练习总数', value: stats.total, icon: '💝' },
          { label: '语言类型', value: stats.types, icon: '📂' },
          { label: '本月练习', value: stats.thisMonth, icon: '📅' },
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
          💝 爱的五种语言
        </div>
        <select value={languageType} onChange={(e) => setLanguageType(e.target.value)} style={selectStyle}>
          {LANGUAGE_TYPE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天练习了什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={inputStyle}
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
          💝 记录练习
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
              <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 6 }}>{r.languageType}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 4 }}>{r.content}</div>
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0' }}>感受: {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💝 还没有练习</div>
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
  const [relationship, setRelationship] = useState('朋友')
  const [insight, setInsight] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!insight.trim()) return
    const item: AwarenessRecord = {
      id: `${Date.now()}`,
      relationship,
      insight: insight.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setInsight('')
    setAction('')
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
          { label: '觉察总数', value: stats.total, icon: '🔍' },
          { label: '本周觉察', value: stats.thisWeek, icon: '📅' },
          { label: '关系洞察', value: stats.total, icon: '💭' },
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
          🔍 关系觉察
        </div>
        <select value={relationship} onChange={(e) => setRelationship(e.target.value)} style={selectStyle}>
          {RELATIONSHIP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="你觉察到了什么？"
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
          disabled={!insight.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: insight.trim() ? 'pointer' : 'not-allowed',
            opacity: insight.trim() ? 1 : 0.5,
          }}
        >
          🔍 记录觉察
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
              <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 6 }}>{r.relationship}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 4 }}>{r.insight}</div>
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>行动: {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🔍 还没有觉察</div>
          )}
        </div>
      </div>
    </div>
  )
}

function CommitmentModule({ records, setRecords }: {
  records: CommitmentRecord[]
  setRecords: (fn: (prev: CommitmentRecord[]) => CommitmentRecord[]) => void
}) {
  const [commitment, setCommitment] = useState('')
  const [target, setTarget] = useState('')
  const [progress, setProgress] = useState('开始')

  const addRecord = () => {
    if (!commitment.trim()) return
    const item: CommitmentRecord = {
      id: `${Date.now()}`,
      commitment: commitment.trim(),
      target: target.trim(),
      progress,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setCommitment('')
    setTarget('')
  }

  const stats = {
    total: records.length,
    active: records.filter(r => r.progress === '进行中').length,
    completed: records.filter(r => r.progress === '完成').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '承诺总数', value: stats.total, icon: '🤝' },
          { label: '进行中', value: stats.active, icon: '⏳' },
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
          🤝 承诺记录
        </div>
        <input
          type="text"
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          placeholder="你的承诺是什么？"
          style={inputStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="对象"
            style={inputStyle}
          />
          <select value={progress} onChange={(e) => setProgress(e.target.value)} style={selectStyle}>
            {PROGRESS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={addRecord}
          disabled={!commitment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: commitment.trim() ? 'pointer' : 'not-allowed',
            opacity: commitment.trim() ? 1 : 0.5,
          }}
        >
          🤝 记录承诺
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的承诺</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>🤝 {r.commitment}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.progress}</span>
              </div>
              {r.target && <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>对象: {r.target}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🤝 还没有承诺</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-venus-saturn'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-venus-saturn'].secondaryColor

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
  { id: 'lovelanguage', name: '爱的五种语言', icon: '💝' },
  { id: 'awareness', name: '关系觉察', icon: '🔍' },
  { id: 'commitment', name: '承诺记录', icon: '🤝' },
]

export default function MercuryVenusSaturnPage() {
  const config = comboConfigs['mercury-venus-saturn']
  const [activeTab, setActiveTab] = useState<string>('lovelanguage')
  const [languagerecords, setLanguageRecords] = useLocalStorage<LoveLanguageRecord[]>('mvs-languagerecords', [])
  const [awarenessrecords, setAwarenessRecords] = useLocalStorage<AwarenessRecord[]>('mvs-awarenessrecords', [])
  const [commitments, setCommitments] = useLocalStorage<CommitmentRecord[]>('mvs-commitments', [])

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
        {activeTab === 'lovelanguage' && <LoveLanguageModule records={languagerecords} setRecords={setLanguageRecords} />}
        {activeTab === 'awareness' && <AwarenessModule records={awarenessrecords} setRecords={setAwarenessRecords} />}
        {activeTab === 'commitment' && <CommitmentModule records={commitments} setRecords={setCommitments} />}
      </div>
    </ComboShell>
  )
}
