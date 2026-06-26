import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface DreamRecord {
  id: string
  content: string
  emotion: string
  interpretation: string
  createdAt: string
}

interface IntuitionRecord {
  id: string
  intuition: string
  followed: string
  result: string
  createdAt: string
}

interface InspirationRecord {
  id: string
  inspiration: string
  translation: string
  action: string
  createdAt: string
}

const EMOTION_OPTIONS = ['平静', '喜悦', '恐惧', '焦虑', '悲伤', '困惑', '兴奋', '其他']
const FOLLOWED_OPTIONS = ['是', '否', '不确定']

function DreamModule({ records, setRecords }: {
  records: DreamRecord[]
  setRecords: (fn: (prev: DreamRecord[]) => DreamRecord[]) => void
}) {
  const [content, setContent] = useState('')
  const [emotion, setEmotion] = useState('平静')
  const [interpretation, setInterpretation] = useState('')

  const addRecord = () => {
    if (!content.trim()) return
    const item: DreamRecord = {
      id: `${Date.now()}`,
      content: content.trim(),
      emotion,
      interpretation: interpretation.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setContent('')
    setInterpretation('')
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
          { label: '梦境总数', value: stats.total, icon: '🌙' },
          { label: '本月梦境', value: stats.thisMonth, icon: '📅' },
          { label: '潜意识探索', value: stats.total, icon: '🔮' },
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
          🌙 梦境记录
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="梦到了什么？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={emotion} onChange={(e) => setEmotion(e.target.value)} style={selectStyle}>
            {EMOTION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            placeholder="解读"
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
          🌙 记录梦境
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的梦境</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>🌙 {r.emotion}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 4 }}>{r.content}</div>
              {r.interpretation && <div style={{ fontSize: 11, color: '#a0f0a0' }}>解读: {r.interpretation}</div>}
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌙 还没有梦境</div>
          )}
        </div>
      </div>
    </div>
  )
}

function IntuitionModule({ records, setRecords }: {
  records: IntuitionRecord[]
  setRecords: (fn: (prev: IntuitionRecord[]) => IntuitionRecord[]) => void
}) {
  const [intuition, setIntuition] = useState('')
  const [followed, setFollowed] = useState('不确定')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!intuition.trim()) return
    const item: IntuitionRecord = {
      id: `${Date.now()}`,
      intuition: intuition.trim(),
      followed,
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setIntuition('')
    setResult('')
  }

  const stats = {
    total: records.length,
    followedCount: records.filter(r => r.followed === '是').length,
    positiveResult: records.filter(r => r.result && (r.result.includes('好') || r.result.includes('正确') || r.result.includes('成功'))).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '直觉总数', value: stats.total, icon: '🔮' },
          { label: '已跟随', value: stats.followedCount, icon: '✅' },
          { label: '正向结果', value: stats.positiveResult, icon: '✨' },
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
          🔮 直觉捕捉
        </div>
        <textarea
          value={intuition}
          onChange={(e) => setIntuition(e.target.value)}
          placeholder="直觉告诉你什么？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={followed} onChange={(e) => setFollowed(e.target.value)} style={selectStyle}>
            {FOLLOWED_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="结果如何"
            style={inputStyle}
          />
        </div>
        <button
          onClick={addRecord}
          disabled={!intuition.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: intuition.trim() ? 'pointer' : 'not-allowed',
            opacity: intuition.trim() ? 1 : 0.5,
          }}
        >
          🔮 记录直觉
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的直觉</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>🔮 {r.intuition}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.followed}</span>
              </div>
              {r.result && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>结果: {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🔮 还没有直觉</div>
          )}
        </div>
      </div>
    </div>
  )
}

function InspirationModule({ records, setRecords }: {
  records: InspirationRecord[]
  setRecords: (fn: (prev: InspirationRecord[]) => InspirationRecord[]) => void
}) {
  const [inspiration, setInspiration] = useState('')
  const [translation, setTranslation] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!inspiration.trim()) return
    const item: InspirationRecord = {
      id: `${Date.now()}`,
      inspiration: inspiration.trim(),
      translation: translation.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setInspiration('')
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
          { label: '灵感总数', value: stats.total, icon: '💫' },
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
          💫 灵感翻译
        </div>
        <textarea
          value={inspiration}
          onChange={(e) => setInspiration(e.target.value)}
          placeholder="灵感是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="翻译成具体内容"
          style={textAreaStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="将采取什么行动？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!inspiration.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: inspiration.trim() ? 'pointer' : 'not-allowed',
            opacity: inspiration.trim() ? 1 : 0.5,
          }}
        >
          💫 记录灵感
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的灵感</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>💫 {r.inspiration}</div>
              {r.translation && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>翻译: {r.translation}</div>}
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>行动: {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💫 还没有灵感</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-earth-neptune'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-earth-neptune'].secondaryColor

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
  { id: 'dream', name: '梦境记录', icon: '🌙' },
  { id: 'intuition', name: '直觉捕捉', icon: '🔮' },
  { id: 'inspiration', name: '灵感翻译', icon: '💫' },
]

export default function MercuryEarthNeptunePage() {
  const config = comboConfigs['mercury-earth-neptune']
  const [activeTab, setActiveTab] = useState<string>('dream')
  const [dreams, setDreams] = useLocalStorage<DreamRecord[]>('men-dreams', [])
  const [intuitions, setIntuitions] = useLocalStorage<IntuitionRecord[]>('men-intuitions', [])
  const [inspirations, setInspirations] = useLocalStorage<InspirationRecord[]>('men-inspirations', [])

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
        {activeTab === 'dream' && <DreamModule records={dreams} setRecords={setDreams} />}
        {activeTab === 'intuition' && <IntuitionModule records={intuitions} setRecords={setIntuitions} />}
        {activeTab === 'inspiration' && <InspirationModule records={inspirations} setRecords={setInspirations} />}
      </div>
    </ComboShell>
  )
}
