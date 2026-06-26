import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface IdeaRecord {
  id: string
  idea: string
  connection: string
  action: string
  createdAt: string
}

interface ExperimentRecord {
  id: string
  experiment: string
  result: string
  gain: string
  createdAt: string
}

interface BreakthroughRecord {
  id: string
  oldInertia: string
  newAction: string
  effect: string
  createdAt: string
}

function IdeaModule({ records, setRecords }: {
  records: IdeaRecord[]
  setRecords: (fn: (prev: IdeaRecord[]) => IdeaRecord[]) => void
}) {
  const [idea, setIdea] = useState('')
  const [connection, setConnection] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!idea.trim()) return
    const item: IdeaRecord = {
      id: `${Date.now()}`,
      idea: idea.trim(),
      connection: connection.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setIdea('')
    setConnection('')
    setAction('')
  }

  const stats = {
    total: records.length,
    withConnection: records.filter(r => r.connection).length,
    withAction: records.filter(r => r.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '灵感总数', value: stats.total, icon: '💡' },
          { label: '已建立连接', value: stats.withConnection, icon: '🔗' },
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
          💡 闪电灵感
        </div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="灵感是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={connection}
          onChange={(e) => setConnection(e.target.value)}
          placeholder="它和什么产生了关联？"
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
          disabled={!idea.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: idea.trim() ? 'pointer' : 'not-allowed',
            opacity: idea.trim() ? 1 : 0.5,
          }}
        >
          💡 记录灵感
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
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>💡 {r.idea}</div>
              {r.connection && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>关联: {r.connection}</div>}
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>行动: {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💡 还没有灵感</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExperimentModule({ records, setRecords }: {
  records: ExperimentRecord[]
  setRecords: (fn: (prev: ExperimentRecord[]) => ExperimentRecord[]) => void
}) {
  const [experiment, setExperiment] = useState('')
  const [result, setResult] = useState('')
  const [gain, setGain] = useState('')

  const addRecord = () => {
    if (!experiment.trim()) return
    const item: ExperimentRecord = {
      id: `${Date.now()}`,
      experiment: experiment.trim(),
      result: result.trim(),
      gain: gain.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setExperiment('')
    setResult('')
    setGain('')
  }

  const stats = {
    total: records.length,
    positiveResult: records.filter(r => r.result && (r.result.includes('成功') || r.result.includes('有效') || r.result.includes('好'))).length,
    withGain: records.filter(r => r.gain).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '实验总数', value: stats.total, icon: '🧪' },
          { label: '正向结果', value: stats.positiveResult, icon: '✅' },
          { label: '有收获', value: stats.withGain, icon: '💎' },
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
          🧪 创意实验
        </div>
        <textarea
          value={experiment}
          onChange={(e) => setExperiment(e.target.value)}
          placeholder="想做什么实验？"
          style={textAreaStyle}
        />
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="实验结果如何？"
          style={textAreaStyle}
        />
        <textarea
          value={gain}
          onChange={(e) => setGain(e.target.value)}
          placeholder="收获是什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!experiment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: experiment.trim() ? 'pointer' : 'not-allowed',
            opacity: experiment.trim() ? 1 : 0.5,
          }}
        >
          🧪 记录实验
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的实验</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🧪 {r.experiment}</div>
              {r.result && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>结果: {r.result}</div>}
              {r.gain && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>收获: {r.gain}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🧪 还没有实验</div>
          )}
        </div>
      </div>
    </div>
  )
}

function BreakthroughModule({ records, setRecords }: {
  records: BreakthroughRecord[]
  setRecords: (fn: (prev: BreakthroughRecord[]) => BreakthroughRecord[]) => void
}) {
  const [oldInertia, setOldInertia] = useState('')
  const [newAction, setNewAction] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!oldInertia.trim()) return
    const item: BreakthroughRecord = {
      id: `${Date.now()}`,
      oldInertia: oldInertia.trim(),
      newAction: newAction.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setOldInertia('')
    setNewAction('')
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
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '突破总数', value: stats.total, icon: '🚀' },
          { label: '本月突破', value: stats.thisMonth, icon: '📅' },
          { label: '惯性打破', value: stats.total, icon: '⚡' },
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
          🚀 突破惯性
        </div>
        <textarea
          value={oldInertia}
          onChange={(e) => setOldInertia(e.target.value)}
          placeholder="旧的惯性是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          placeholder="新的行动是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!oldInertia.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldInertia.trim() ? 'pointer' : 'not-allowed',
            opacity: oldInertia.trim() ? 1 : 0.5,
          }}
        >
          🚀 记录突破
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的突破</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: '#ff9090', marginBottom: 4 }}>❌ {r.oldInertia}</div>
              <div style={{ fontSize: 12, color: '#a0f0a0', marginBottom: 4 }}>✅ {r.newAction}</div>
              {r.effect && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>效果: {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🚀 还没有突破</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-mars-uranus'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-mars-uranus'].secondaryColor

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
  { id: 'idea', name: '闪电灵感', icon: '💡' },
  { id: 'experiment', name: '创意实验', icon: '🧪' },
  { id: 'breakthrough', name: '突破惯性', icon: '🚀' },
]

export default function MercuryMarsUranusPage() {
  const config = comboConfigs['mercury-mars-uranus']
  const [activeTab, setActiveTab] = useState<string>('idea')
  const [ideas, setIdeas] = useLocalStorage<IdeaRecord[]>('mmu-ideas', [])
  const [experiments, setExperiments] = useLocalStorage<ExperimentRecord[]>('mmu-experiments', [])
  const [breakthroughs, setBreakthroughs] = useLocalStorage<BreakthroughRecord[]>('mmu-breakthroughs', [])

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
        {activeTab === 'idea' && <IdeaModule records={ideas} setRecords={setIdeas} />}
        {activeTab === 'experiment' && <ExperimentModule records={experiments} setRecords={setExperiments} />}
        {activeTab === 'breakthrough' && <BreakthroughModule records={breakthroughs} setRecords={setBreakthroughs} />}
      </div>
    </ComboShell>
  )
}
