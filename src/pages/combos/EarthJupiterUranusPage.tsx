import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface ChangeRecord {
  id: string
  change: string
  perception: string
  response: string
  createdAt: string
}

interface UnknownRecord {
  id: string
  unknown: string
  fear: string
  action: string
  createdAt: string
}

interface FutureRecord {
  id: string
  action: string
  future: string
  effect: string
  createdAt: string
}

function ChangeModule({ records, setRecords }: {
  records: ChangeRecord[]
  setRecords: (fn: (prev: ChangeRecord[]) => ChangeRecord[]) => void
}) {
  const [change, setChange] = useState('')
  const [perception, setPerception] = useState('')
  const [response, setResponse] = useState('')

  const addRecord = () => {
    if (!change.trim()) return
    const item: ChangeRecord = {
      id: `${Date.now()}`,
      change: change.trim(),
      perception: perception.trim(),
      response: response.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setChange('')
    setPerception('')
    setResponse('')
  }

  const stats = {
    total: records.length,
    thisWeek: records.filter(r => {
      const date = new Date(r.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
    withResponse: records.filter(r => r.response).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '变化总数', value: stats.total, icon: '🔄' },
          { label: '本周变化', value: stats.thisWeek, icon: '📅' },
          { label: '已应对', value: stats.withResponse, icon: '✅' },
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
          🔄 变化感知
        </div>
        <input
          type="text"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="发生了什么变化？"
          style={inputStyle}
        />
        <input
          type="text"
          value={perception}
          onChange={(e) => setPerception(e.target.value)}
          placeholder="你是如何感知的？"
          style={inputStyle}
        />
        <input
          type="text"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="你如何应对？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!change.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: change.trim() ? 'pointer' : 'not-allowed',
            opacity: change.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录变化
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的变化</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🔄 {r.change}</div>
              {r.perception && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>👁️ {r.perception}</div>}
              {r.response && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✅ {r.response}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔄 还没有变化
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UnknownModule({ records, setRecords }: {
  records: UnknownRecord[]
  setRecords: (fn: (prev: UnknownRecord[]) => UnknownRecord[]) => void
}) {
  const [unknown, setUnknown] = useState('')
  const [fear, setFear] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!unknown.trim()) return
    const item: UnknownRecord = {
      id: `${Date.now()}`,
      unknown: unknown.trim(),
      fear: fear.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setUnknown('')
    setFear('')
    setAction('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withAction: records.filter(r => r.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '未知总数', value: stats.total, icon: '❓' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已行动', value: stats.withAction, icon: '⚡' },
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
          ❓ 拥抱未知
        </div>
        <input
          type="text"
          value={unknown}
          onChange={(e) => setUnknown(e.target.value)}
          placeholder="未知是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={fear}
          onChange={(e) => setFear(e.target.value)}
          placeholder="你的恐惧是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你选择什么行动？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!unknown.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: unknown.trim() ? 'pointer' : 'not-allowed',
            opacity: unknown.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录未知
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的未知</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>❓ {r.unknown}</div>
              {r.fear && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>😨 {r.fear}</div>}
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ❓ 还没有未知
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FutureModule({ records, setRecords }: {
  records: FutureRecord[]
  setRecords: (fn: (prev: FutureRecord[]) => FutureRecord[]) => void
}) {
  const [action, setAction] = useState('')
  const [future, setFuture] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: FutureRecord = {
      id: `${Date.now()}`,
      action: action.trim(),
      future: future.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setFuture('')
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
    withEffect: records.filter(r => r.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '行动总数', value: stats.total, icon: '⚡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有效果', value: stats.withEffect, icon: '✨' },
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
          ⚡ 未来行动
        </div>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="行动是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={future}
          onChange={(e) => setFuture(e.target.value)}
          placeholder="这个行动面向怎样的未来？"
          style={inputStyle}
        />
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="预期效果是什么？"
          style={inputStyle}
        />
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
          ✨ 记录行动
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
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>⚡ {r.action}</div>
              {r.future && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔮 {r.future}</div>}
              {r.effect && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有行动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'earth-jupiter-uranus'
const config = comboConfigs[configKey]
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

const TAB_LIST = [
  { id: 'change', name: '变化感知', icon: '🔄' },
  { id: 'unknown', name: '拥抱未知', icon: '❓' },
  { id: 'future', name: '未来行动', icon: '⚡' },
]

export default function EarthJupiterUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('change')
  const [changes, setChanges] = useLocalStorage<ChangeRecord[]>('eju-changes', [])
  const [unknowns, setUnknowns] = useLocalStorage<UnknownRecord[]>('eju-unknowns', [])
  const [futures, setFutures] = useLocalStorage<FutureRecord[]>('eju-futures', [])

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
        {activeTab === 'change' && <ChangeModule records={changes} setRecords={setChanges} />}
        {activeTab === 'unknown' && <UnknownModule records={unknowns} setRecords={setUnknowns} />}
        {activeTab === 'future' && <FutureModule records={futures} setRecords={setFutures} />}
      </div>
    </ComboShell>
  )
}
