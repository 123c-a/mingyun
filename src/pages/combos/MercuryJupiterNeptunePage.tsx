import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface BeliefRecord {
  id: string
  belief: string
  source: string
  firmness: string
  createdAt: string
}

interface TranslationRecord {
  id: string
  vagueBelief: string
  clearExpression: string
  action: string
  createdAt: string
}

interface IntuitionRecord {
  id: string
  intuition: string
  trusted: string
  result: string
  createdAt: string
}

const SOURCE_OPTIONS = ['成长经历', '家庭教育', '社会文化', '个人经验', '权威人士', '直觉', '其他']
const FIRMNESS_OPTIONS = ['坚定', '较坚定', '动摇', '不确定']
const TRUSTED_OPTIONS = ['是', '否', '不确定']

function BeliefModule({ records, setRecords }: {
  records: BeliefRecord[]
  setRecords: (fn: (prev: BeliefRecord[]) => BeliefRecord[]) => void
}) {
  const [belief, setBelief] = useState('')
  const [source, setSource] = useState('个人经验')
  const [firmness, setFirmness] = useState('较坚定')

  const addRecord = () => {
    if (!belief.trim()) return
    const item: BeliefRecord = {
      id: `${Date.now()}`,
      belief: belief.trim(),
      source,
      firmness,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBelief('')
  }

  const stats = {
    total: records.length,
    firmBeliefs: records.filter(r => r.firmness === '坚定' || r.firmness === '较坚定').length,
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
          { label: '信念总数', value: stats.total, icon: '🌱' },
          { label: '坚定信念', value: stats.firmBeliefs, icon: '💪' },
          { label: '本月识别', value: stats.thisMonth, icon: '📅' },
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
          🌱 信念识别
        </div>
        <textarea
          value={belief}
          onChange={(e) => setBelief(e.target.value)}
          placeholder="这是什么信念？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
            {SOURCE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={firmness} onChange={(e) => setFirmness(e.target.value)} style={selectStyle}>
            {FIRMNESS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={addRecord}
          disabled={!belief.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: belief.trim() ? 'pointer' : 'not-allowed',
            opacity: belief.trim() ? 1 : 0.5,
          }}
        >
          🌱 记录信念
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的信念</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>🌱 {r.belief}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.firmness}</span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>来源: {r.source}</div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌱 还没有信念</div>
          )}
        </div>
      </div>
    </div>
  )
}

function TranslationModule({ records, setRecords }: {
  records: TranslationRecord[]
  setRecords: (fn: (prev: TranslationRecord[]) => TranslationRecord[]) => void
}) {
  const [vagueBelief, setVagueBelief] = useState('')
  const [clearExpression, setClearExpression] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!vagueBelief.trim()) return
    const item: TranslationRecord = {
      id: `${Date.now()}`,
      vagueBelief: vagueBelief.trim(),
      clearExpression: clearExpression.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setVagueBelief('')
    setClearExpression('')
    setAction('')
  }

  const stats = {
    total: records.length,
    withClear: records.filter(r => r.clearExpression).length,
    withAction: records.filter(r => r.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '翻译总数', value: stats.total, icon: '🔮' },
          { label: '已清晰化', value: stats.withClear, icon: '✨' },
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
          🔮 信念翻译
        </div>
        <textarea
          value={vagueBelief}
          onChange={(e) => setVagueBelief(e.target.value)}
          placeholder="模糊的信念是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={clearExpression}
          onChange={(e) => setClearExpression(e.target.value)}
          placeholder="清晰表达是什么？"
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
          disabled={!vagueBelief.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: vagueBelief.trim() ? 'pointer' : 'not-allowed',
            opacity: vagueBelief.trim() ? 1 : 0.5,
          }}
        >
          🔮 翻译信念
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的翻译</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>模糊: {r.vagueBelief}</div>
              {r.clearExpression && <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>清晰: {r.clearExpression}</div>}
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>行动: {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🔮 还没有翻译</div>
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
  const [trusted, setTrusted] = useState('不确定')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!intuition.trim()) return
    const item: IntuitionRecord = {
      id: `${Date.now()}`,
      intuition: intuition.trim(),
      trusted,
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setIntuition('')
    setResult('')
  }

  const stats = {
    total: records.length,
    trustedCount: records.filter(r => r.trusted === '是').length,
    positiveResult: records.filter(r => r.result && (r.result.includes('好') || r.result.includes('正确') || r.result.includes('成功'))).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '直觉总数', value: stats.total, icon: '🔮' },
          { label: '已信任', value: stats.trustedCount, icon: '💚' },
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
          🔮 直觉解码
        </div>
        <textarea
          value={intuition}
          onChange={(e) => setIntuition(e.target.value)}
          placeholder="直觉告诉你什么？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={trusted} onChange={(e) => setTrusted(e.target.value)} style={selectStyle}>
            {TRUSTED_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
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
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>🔮 {r.intuition}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.trusted}</span>
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

const PRIMARY_COLOR = comboConfigs['mercury-jupiter-neptune'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-jupiter-neptune'].secondaryColor

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
  { id: 'belief', name: '信念识别', icon: '🌱' },
  { id: 'translation', name: '信念翻译', icon: '🔮' },
  { id: 'intuition', name: '直觉解码', icon: '✨' },
]

export default function MercuryJupiterNeptunePage() {
  const config = comboConfigs['mercury-jupiter-neptune']
  const [activeTab, setActiveTab] = useState<string>('belief')
  const [beliefs, setBeliefs] = useLocalStorage<BeliefRecord[]>('mjn-beliefs', [])
  const [translations, setTranslations] = useLocalStorage<TranslationRecord[]>('mjn-translations', [])
  const [intuitions, setIntuitions] = useLocalStorage<IntuitionRecord[]>('mjn-intuitions', [])

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
        {activeTab === 'belief' && <BeliefModule records={beliefs} setRecords={setBeliefs} />}
        {activeTab === 'translation' && <TranslationModule records={translations} setRecords={setTranslations} />}
        {activeTab === 'intuition' && <IntuitionModule records={intuitions} setRecords={setIntuitions} />}
      </div>
    </ComboShell>
  )
}
