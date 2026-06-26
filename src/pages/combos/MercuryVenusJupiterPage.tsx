import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface WordRecord {
  id: string
  word: string
  target: string
  reaction: string
  createdAt: string
}

interface WarmthRecord {
  id: string
  moment: string
  feeling: string
  effect: string
  createdAt: string
}

interface PracticeRecord {
  id: string
  content: string
  language: string
  gain: string
  createdAt: string
}

const TARGET_OPTIONS = ['家人', '朋友', '同事', '伴侣', '陌生人', '自己']
const REACTION_OPTIONS = ['温暖微笑', '感动落泪', '开心拥抱', '轻声感谢', '沉默良久', '转身回应']
const LANGUAGE_OPTIONS = ['肯定句', '感谢话', '鼓励语', '道歉话', '告别语', '倾听表达']

function WordModule({ records, setRecords }: {
  records: WordRecord[]
  setRecords: (fn: (prev: WordRecord[]) => WordRecord[]) => void
}) {
  const [word, setWord] = useState('')
  const [target, setTarget] = useState('朋友')
  const [reaction, setReaction] = useState('温暖微笑')

  const addRecord = () => {
    if (!word.trim()) return
    const item: WordRecord = {
      id: `${Date.now()}`,
      word: word.trim(),
      target,
      reaction,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setWord('')
  }

  const stats = {
    total: records.length,
    today: records.filter(r => r.createdAt === new Date().toLocaleDateString('zh-CN')).length,
    targets: new Set(records.map(r => r.target)).size,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '话语总数', value: stats.total, icon: '💬' },
          { label: '今日话语', value: stats.today, icon: '📅' },
          { label: '涉及对象', value: stats.targets, icon: '👥' },
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
          💬 善意话语
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={target} onChange={(e) => setTarget(e.target.value)} style={selectStyle}>
            {TARGET_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={reaction} onChange={(e) => setReaction(e.target.value)} style={selectStyle}>
            {REACTION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <textarea
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="你想说或已经说出的善意话语..."
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!word.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: word.trim() ? 'pointer' : 'not-allowed',
            opacity: word.trim() ? 1 : 0.5,
          }}
        >
          💬 记录话语
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的话语</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>{r.target} · {r.reaction}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{r.word}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💬 还没有话语</div>
          )}
        </div>
      </div>
    </div>
  )
}

function WarmthModule({ records, setRecords }: {
  records: WarmthRecord[]
  setRecords: (fn: (prev: WarmthRecord[]) => WarmthRecord[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [feeling, setFeeling] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: WarmthRecord = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      feeling: feeling.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setFeeling('')
    setEffect('')
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
          { label: '温暖时刻', value: stats.total, icon: '🌡️' },
          { label: '本周时刻', value: stats.thisWeek, icon: '📅' },
          { label: '持续传递', value: stats.total, icon: '💕' },
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
          🌡️ 温暖时刻
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="这是一个什么温暖时刻？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={inputStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="这个温暖带来了什么效果？"
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
          🌡️ 记录温暖
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的温暖</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>🌡️ {r.moment}</div>
              {r.feeling && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>感受: {r.feeling}</div>}
              {r.effect && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>效果: {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌡️ 还没有温暖</div>
          )}
        </div>
      </div>
    </div>
  )
}

function PracticeModule({ records, setRecords }: {
  records: PracticeRecord[]
  setRecords: (fn: (prev: PracticeRecord[]) => PracticeRecord[]) => void
}) {
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('肯定句')
  const [gain, setGain] = useState('')

  const addRecord = () => {
    if (!content.trim()) return
    const item: PracticeRecord = {
      id: `${Date.now()}`,
      content: content.trim(),
      language,
      gain: gain.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setContent('')
    setGain('')
  }

  const stats = {
    total: records.length,
    types: new Set(records.map(r => r.language)).size,
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
          { label: '练习总数', value: stats.total, icon: '📝' },
          { label: '语言类型', value: stats.types, icon: '🗣️' },
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
          📝 语言练习
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={selectStyle}>
            {LANGUAGE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={gain}
            onChange={(e) => setGain(e.target.value)}
            placeholder="练习收获"
            style={inputStyle}
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天练习了什么话语？"
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
          📝 记录练习
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>{r.language}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 4 }}>{r.content}</div>
              {r.gain && <div style={{ fontSize: 11, color: '#a0f0a0' }}>收获: {r.gain}</div>}
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>📝 还没有练习</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-venus-jupiter'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-venus-jupiter'].secondaryColor

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
  { id: 'word', name: '善意话语', icon: '💬' },
  { id: 'warmth', name: '温暖时刻', icon: '🌡️' },
  { id: 'practice', name: '语言练习', icon: '📝' },
]

export default function MercuryVenusJupiterPage() {
  const config = comboConfigs['mercury-venus-jupiter']
  const [activeTab, setActiveTab] = useState<string>('word')
  const [words, setWords] = useLocalStorage<WordRecord[]>('mvj-words', [])
  const [warmths, setWarmths] = useLocalStorage<WarmthRecord[]>('mvj-warmths', [])
  const [practices, setPractices] = useLocalStorage<PracticeRecord[]>('mvj-practices', [])

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
        {activeTab === 'word' && <WordModule records={words} setRecords={setWords} />}
        {activeTab === 'warmth' && <WarmthModule records={warmths} setRecords={setWarmths} />}
        {activeTab === 'practice' && <PracticeModule records={practices} setRecords={setPractices} />}
      </div>
    </ComboShell>
  )
}
