import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface ActionRecord {
  id: string
  action: string
  reason: string
  status: string
  createdAt: string
}

interface ProcrastinationRecord {
  id: string
  target: string
  method: string
  result: string
  createdAt: string
}

interface ExecutionRecord {
  id: string
  executedThing: string
  efficiency: string
  feeling: string
  createdAt: string
}

const STATUS_OPTIONS = ['待开始', '进行中', '已完成', '已放弃']
const EFFICIENCY_OPTIONS = ['高效', '正常', '低效']

function ActionModule({ records, setRecords }: {
  records: ActionRecord[]
  setRecords: (fn: (prev: ActionRecord[]) => ActionRecord[]) => void
}) {
  const [action, setAction] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('待开始')

  const addRecord = () => {
    if (!action.trim()) return
    const item: ActionRecord = {
      id: `${Date.now()}`,
      action: action.trim(),
      reason: reason.trim(),
      status,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setReason('')
  }

  const stats = {
    total: records.length,
    inProgress: records.filter(r => r.status === '进行中').length,
    completed: records.filter(r => r.status === '已完成').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '行动总数', value: stats.total, icon: '⚡' },
          { label: '进行中', value: stats.inProgress, icon: '🔄' },
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
          ⚡ 行动清单
        </div>
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="要采取什么行动？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="为什么想做这件事？"
          style={inputStyle}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
          {STATUS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={addRecord}
          disabled={!action.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: action.trim() ? 'pointer' : 'not-allowed',
            opacity: action.trim() ? 1 : 0.5,
          }}
        >
          ⚡ 添加行动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>⚡ {r.action}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.status}</span>
              </div>
              {r.reason && <div style={{ fontSize: 11, opacity: 0.6 }}>原因: {r.reason}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>⚡ 还没有行动</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProcrastinationModule({ records, setRecords }: {
  records: ProcrastinationRecord[]
  setRecords: (fn: (prev: ProcrastinationRecord[]) => ProcrastinationRecord[]) => void
}) {
  const [target, setTarget] = useState('')
  const [method, setMethod] = useState('')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!target.trim()) return
    const item: ProcrastinationRecord = {
      id: `${Date.now()}`,
      target: target.trim(),
      method: method.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setTarget('')
    setMethod('')
    setResult('')
  }

  const stats = {
    total: records.length,
    withMethod: records.filter(r => r.method).length,
    successful: records.filter(r => r.result && (r.result.includes('成功') || r.result.includes('完成'))).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '拖延总数', value: stats.total, icon: '⏰' },
          { label: '已有方法', value: stats.withMethod, icon: '💡' },
          { label: '成功突破', value: stats.successful, icon: '🎉' },
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
          ⏰ 拖延突破
        </div>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="拖延的对象是什么？"
          style={inputStyle}
        />
        <textarea
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          placeholder="你用了什么方法突破？"
          style={textAreaStyle}
        />
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!target.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: target.trim() ? 'pointer' : 'not-allowed',
            opacity: target.trim() ? 1 : 0.5,
          }}
        >
          ⏰ 记录突破
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
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>⏰ {r.target}</div>
              {r.method && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>方法: {r.method}</div>}
              {r.result && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>结果: {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>⏰ 还没有突破</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExecutionModule({ records, setRecords }: {
  records: ExecutionRecord[]
  setRecords: (fn: (prev: ExecutionRecord[]) => ExecutionRecord[]) => void
}) {
  const [executedThing, setExecutedThing] = useState('')
  const [efficiency, setEfficiency] = useState('正常')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!executedThing.trim()) return
    const item: ExecutionRecord = {
      id: `${Date.now()}`,
      executedThing: executedThing.trim(),
      efficiency,
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setExecutedThing('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    efficient: records.filter(r => r.efficiency === '高效').length,
    effective: records.filter(r => r.feeling && (r.feeling.includes('好') || r.feeling.includes('成功'))).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '执行总数', value: stats.total, icon: '🎯' },
          { label: '高效执行', value: stats.efficient, icon: '⚡' },
          { label: '感觉良好', value: stats.effective, icon: '😊' },
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
          🎯 执行力
        </div>
        <input
          type="text"
          value={executedThing}
          onChange={(e) => setExecutedThing(e.target.value)}
          placeholder="执行了什么？"
          style={inputStyle}
        />
        <select value={efficiency} onChange={(e) => setEfficiency(e.target.value)} style={selectStyle}>
          {EFFICIENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!executedThing.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: executedThing.trim() ? 'pointer' : 'not-allowed',
            opacity: executedThing.trim() ? 1 : 0.5,
          }}
        >
          🎯 记录执行
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的执行</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>🎯 {r.executedThing}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.efficiency}</span>
              </div>
              {r.feeling && <div style={{ fontSize: 11, opacity: 0.75 }}>感受: {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🎯 还没有执行</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-earth-mars'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-earth-mars'].secondaryColor

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
  { id: 'action', name: '行动清单', icon: '⚡' },
  { id: 'procrastination', name: '拖延突破', icon: '⏰' },
  { id: 'execution', name: '执行力', icon: '🎯' },
]

export default function MercuryEarthMarsPage() {
  const config = comboConfigs['mercury-earth-mars']
  const [activeTab, setActiveTab] = useState<string>('action')
  const [actions, setActions] = useLocalStorage<ActionRecord[]>('mem-actions', [])
  const [procrastinations, setProcrastinations] = useLocalStorage<ProcrastinationRecord[]>('mem-procrastinations', [])
  const [executions, setExecutions] = useLocalStorage<ExecutionRecord[]>('mem-executions', [])

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
        {activeTab === 'action' && <ActionModule records={actions} setRecords={setActions} />}
        {activeTab === 'procrastination' && <ProcrastinationModule records={procrastinations} setRecords={setProcrastinations} />}
        {activeTab === 'execution' && <ExecutionModule records={executions} setRecords={setExecutions} />}
      </div>
    </ComboShell>
  )
}
