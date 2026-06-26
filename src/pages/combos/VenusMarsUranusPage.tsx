import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface BreakTemplate {
  id: string
  oldTemplate: string
  newWay: string
  effect: string
  createdAt: string
}

interface FreeLove {
  id: string
  expression: string
  feeling: string
  change: string
  createdAt: string
}

interface InnovativeConnection {
  id: string
  newWay: string
  target: string
  result: string
  createdAt: string
}

function BreakTemplateModule({ records, setRecords }: {
  records: BreakTemplate[]
  setRecords: (fn: (prev: BreakTemplate[]) => BreakTemplate[]) => void
}) {
  const [oldTemplate, setOldTemplate] = useState('')
  const [newWay, setNewWay] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!oldTemplate.trim()) return
    const item: BreakTemplate = {
      id: `${Date.now()}`,
      oldTemplate: oldTemplate.trim(),
      newWay: newWay.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setOldTemplate('')
    setNewWay('')
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
    positive: records.filter(r => r.effect === '很好' || r.effect === '不错').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '打破模板', value: stats.total, icon: '🔨' },
          { label: '本月打破', value: stats.thisMonth, icon: '📅' },
          { label: '效果正面', value: stats.positive, icon: '✨' },
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
          🔨 打破模板
        </div>
        <input
          type="text"
          value={oldTemplate}
          onChange={(e) => setOldTemplate(e.target.value)}
          placeholder="旧模板是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={newWay}
          onChange={(e) => setNewWay(e.target.value)}
          placeholder="新的方式是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（很好/一般/待观察）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!oldTemplate.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldTemplate.trim() ? 'pointer' : 'not-allowed',
            opacity: oldTemplate.trim() ? 1 : 0.5,
          }}
        >
          🔨 打破模板
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
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>
                <span style={{ color: '#ff9090' }}>❌ {r.oldTemplate}</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>✨ {r.newWay}</div>
              {r.effect && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>📝 {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔨 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FreeLoveModule({ records, setRecords }: {
  records: FreeLove[]
  setRecords: (fn: (prev: FreeLove[]) => FreeLove[]) => void
}) {
  const [expression, setExpression] = useState('')
  const [feeling, setFeeling] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!expression.trim()) return
    const item: FreeLove = {
      id: `${Date.now()}`,
      expression: expression.trim(),
      feeling: feeling.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setExpression('')
    setFeeling('')
    setChange('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withChange: records.filter(r => r.change).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '爱的自由', value: stats.total, icon: '🕊️' },
          { label: '本月表达', value: stats.thisMonth, icon: '📅' },
          { label: '有变化', value: stats.withChange, icon: '🔄' },
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
          🕊️ 爱的自由
        </div>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="自由表达是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？"
          style={inputStyle}
        />
        <textarea
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="关系发生了什么变化？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!expression.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: expression.trim() ? 'pointer' : 'not-allowed',
            opacity: expression.trim() ? 1 : 0.5,
          }}
        >
          🕊️ 记录自由
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.expression}</div>
              {r.feeling && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🕊️ {r.feeling}</div>}
              {r.change && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🔄 {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🕊️ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InnovativeConnectionModule({ records, setRecords }: {
  records: InnovativeConnection[]
  setRecords: (fn: (prev: InnovativeConnection[]) => InnovativeConnection[]) => void
}) {
  const [newWay, setNewWay] = useState('')
  const [target, setTarget] = useState('')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!newWay.trim()) return
    const item: InnovativeConnection = {
      id: `${Date.now()}`,
      newWay: newWay.trim(),
      target: target.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setNewWay('')
    setTarget('')
    setResult('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    positive: records.filter(r => r.result === '成功' || r.result === '不错').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '创新连接', value: stats.total, icon: '💡' },
          { label: '本月创新', value: stats.thisMonth, icon: '📅' },
          { label: '效果正面', value: stats.positive, icon: '🌟' },
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
          💡 创新连接
        </div>
        <input
          type="text"
          value={newWay}
          onChange={(e) => setNewWay(e.target.value)}
          placeholder="新的连接方式是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="对象是谁？"
          style={inputStyle}
        />
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？（成功/一般/待观察）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!newWay.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: newWay.trim() ? 'pointer' : 'not-allowed',
            opacity: newWay.trim() ? 1 : 0.5,
          }}
        >
          💡 记录创新
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.newWay}</div>
              {r.target && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>👥 {r.target}</div>}
              {r.result && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌟 {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💡 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-mars-uranus']
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
  { id: 'break', name: '打破模板', icon: '🔨' },
  { id: 'free', name: '爱的自由', icon: '🕊️' },
  { id: 'innovative', name: '创新连接', icon: '💡' },
]

export default function VenusMarsUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('break')
  const [breakRecords, setBreakRecords] = useLocalStorage<BreakTemplate[]>('vmu-break', [])
  const [freeRecords, setFreeRecords] = useLocalStorage<FreeLove[]>('vmu-free', [])
  const [innovativeRecords, setInnovativeRecords] = useLocalStorage<InnovativeConnection[]>('vmu-innovative', [])

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
        {activeTab === 'break' && <BreakTemplateModule records={breakRecords} setRecords={setBreakRecords} />}
        {activeTab === 'free' && <FreeLoveModule records={freeRecords} setRecords={setFreeRecords} />}
        {activeTab === 'innovative' && <InnovativeConnectionModule records={innovativeRecords} setRecords={setInnovativeRecords} />}
      </div>
    </ComboShell>
  )
}
