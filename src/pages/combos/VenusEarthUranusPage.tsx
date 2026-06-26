import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface OldLovePattern {
  id: string
  pattern: string
  source: string
  impact: string
  createdAt: string
}

interface NewLoveDefinition {
  id: string
  definition: string
  practice: string
  challenge: string
  createdAt: string
}

interface PatternBreakthrough {
  id: string
  moment: string
  change: string
  effect: string
  createdAt: string
}

function OldPatternModule({ records, setRecords }: {
  records: OldLovePattern[]
  setRecords: (fn: (prev: OldLovePattern[]) => OldLovePattern[]) => void
}) {
  const [pattern, setPattern] = useState('')
  const [source, setSource] = useState('')
  const [impact, setImpact] = useState('')

  const addRecord = () => {
    if (!pattern.trim()) return
    const item: OldLovePattern = {
      id: `${Date.now()}`,
      pattern: pattern.trim(),
      source: source.trim(),
      impact: impact.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPattern('')
    setSource('')
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
    withImpact: records.filter(r => r.impact).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '旧爱模式', value: stats.total, icon: '🔄' },
          { label: '本月发现', value: stats.thisMonth, icon: '📅' },
          { label: '有影响记录', value: stats.withImpact, icon: '📝' },
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
          🔄 旧爱模式
        </div>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="旧模式是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="来源于哪里？"
          style={inputStyle}
        />
        <textarea
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="对你有什么影响？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!pattern.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: pattern.trim() ? 'pointer' : 'not-allowed',
            opacity: pattern.trim() ? 1 : 0.5,
          }}
        >
          🔄 记录模式
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.pattern}</div>
              {r.source && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>📍 {r.source}</div>}
              {r.impact && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💭 {r.impact}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔄 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewDefinitionModule({ records, setRecords }: {
  records: NewLoveDefinition[]
  setRecords: (fn: (prev: NewLoveDefinition[]) => NewLoveDefinition[]) => void
}) {
  const [definition, setDefinition] = useState('')
  const [practice, setPractice] = useState('')
  const [challenge, setChallenge] = useState('')

  const addRecord = () => {
    if (!definition.trim()) return
    const item: NewLoveDefinition = {
      id: `${Date.now()}`,
      definition: definition.trim(),
      practice: practice.trim(),
      challenge: challenge.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setDefinition('')
    setPractice('')
    setChallenge('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withChallenge: records.filter(r => r.challenge).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '新爱定义', value: stats.total, icon: '✨' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '有挑战', value: stats.withChallenge, icon: '⚡' },
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
          ✨ 新爱定义
        </div>
        <input
          type="text"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="新的爱的定义是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="如何实践？"
          style={inputStyle}
        />
        <input
          type="text"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="遇到的挑战？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!definition.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: definition.trim() ? 'pointer' : 'not-allowed',
            opacity: definition.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录定义
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.definition}</div>
              {r.practice && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>✨ {r.practice}</div>}
              {r.challenge && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>⚡ {r.challenge}</div>}
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

function BreakthroughModule({ records, setRecords }: {
  records: PatternBreakthrough[]
  setRecords: (fn: (prev: PatternBreakthrough[]) => PatternBreakthrough[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [change, setChange] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: PatternBreakthrough = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      change: change.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setChange('')
    setEffect('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    positiveEffect: records.filter(r => r.effect === '很好' || r.effect === '非常好').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '模式突破', value: stats.total, icon: '🚀' },
          { label: '本月突破', value: stats.thisMonth, icon: '📅' },
          { label: '正向效果', value: stats.positiveEffect, icon: '🌟' },
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
          🚀 模式突破
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="突破时刻是什么？"
          style={inputStyle}
        />
        <textarea
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="做出了什么改变？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（很好/一般/还需努力）"
          style={inputStyle}
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
          🚀 记录突破
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
              {r.change && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🔄 {r.change}</div>}
              {r.effect && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌟 {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🚀 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-earth-uranus']
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
  { id: 'old', name: '旧爱模式', icon: '🔄' },
  { id: 'new', name: '新爱定义', icon: '✨' },
  { id: 'breakthrough', name: '模式突破', icon: '🚀' },
]

export default function VenusEarthUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('old')
  const [oldRecords, setOldRecords] = useLocalStorage<OldLovePattern[]>('veu-old', [])
  const [newRecords, setNewRecords] = useLocalStorage<NewLoveDefinition[]>('veu-new', [])
  const [breakthroughRecords, setBreakthroughRecords] = useLocalStorage<PatternBreakthrough[]>('veu-breakthrough', [])

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
        {activeTab === 'old' && <OldPatternModule records={oldRecords} setRecords={setOldRecords} />}
        {activeTab === 'new' && <NewDefinitionModule records={newRecords} setRecords={setNewRecords} />}
        {activeTab === 'breakthrough' && <BreakthroughModule records={breakthroughRecords} setRecords={setBreakthroughRecords} />}
      </div>
    </ComboShell>
  )
}
