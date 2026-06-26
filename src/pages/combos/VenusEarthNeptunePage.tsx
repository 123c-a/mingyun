import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface GroundingFeeling {
  id: string
  feeling: string
  groundingLevel: string
  expression: string
  createdAt: string
}

interface DeepConnection {
  id: string
  target: string
  way: string
  depth: string
  createdAt: string
}

interface RootlessLove {
  id: string
  moment: string
  adjustment: string
  status: string
  createdAt: string
}

function GroundingFeelingModule({ records, setRecords }: {
  records: GroundingFeeling[]
  setRecords: (fn: (prev: GroundingFeeling[]) => GroundingFeeling[]) => void
}) {
  const [feeling, setFeeling] = useState('')
  const [groundingLevel, setGroundingLevel] = useState('')
  const [expression, setExpression] = useState('')

  const addRecord = () => {
    if (!feeling.trim()) return
    const item: GroundingFeeling = {
      id: `${Date.now()}`,
      feeling: feeling.trim(),
      groundingLevel: groundingLevel.trim(),
      expression: expression.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setFeeling('')
    setGroundingLevel('')
    setExpression('')
  }

  const stats = {
    total: records.length,
    thisWeek: records.filter(r => {
      const date = new Date(r.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
    wellGrounded: records.filter(r => r.groundingLevel === '很扎实' || r.groundingLevel === '扎实').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '扎根感受', value: stats.total, icon: '🌍' },
          { label: '本周感受', value: stats.thisWeek, icon: '📅' },
          { label: '很扎实', value: stats.wellGrounded, icon: '💚' },
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
          🌍 扎根感受
        </div>
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={groundingLevel}
          onChange={(e) => setGroundingLevel(e.target.value)}
          placeholder="扎根程度（飘忽/一般/扎实/很扎实）"
          style={inputStyle}
        />
        <textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="如何表达？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!feeling.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: feeling.trim() ? 'pointer' : 'not-allowed',
            opacity: feeling.trim() ? 1 : 0.5,
          }}
        >
          🌍 记录感受
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.feeling}</div>
              {r.groundingLevel && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌍 {r.groundingLevel}</div>}
              {r.expression && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💬 {r.expression}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌍 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DeepConnectionModule({ records, setRecords }: {
  records: DeepConnection[]
  setRecords: (fn: (prev: DeepConnection[]) => DeepConnection[]) => void
}) {
  const [target, setTarget] = useState('')
  const [way, setWay] = useState('')
  const [depth, setDepth] = useState('')

  const addRecord = () => {
    if (!target.trim()) return
    const item: DeepConnection = {
      id: `${Date.now()}`,
      target: target.trim(),
      way: way.trim(),
      depth: depth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setTarget('')
    setWay('')
    setDepth('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    deep: records.filter(r => r.depth === '很深' || r.depth === '非常深').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '深层连接', value: stats.total, icon: '🔗' },
          { label: '本月连接', value: stats.thisMonth, icon: '📅' },
          { label: '很深', value: stats.deep, icon: '💜' },
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
          🔗 深层连接
        </div>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="连接对象是谁？"
          style={inputStyle}
        />
        <input
          type="text"
          value={way}
          onChange={(e) => setWay(e.target.value)}
          placeholder="连接方式是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
          placeholder="深度（浅/一般/深/很深/非常深）"
          style={inputStyle}
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
          🔗 记录连接
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.target}</div>
              {r.way && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🔗 {r.way}</div>}
              {r.depth && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💜 {r.depth}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔗 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RootlessLoveModule({ records, setRecords }: {
  records: RootlessLove[]
  setRecords: (fn: (prev: RootlessLove[]) => RootlessLove[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [adjustment, setAdjustment] = useState('')
  const [status, setStatus] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: RootlessLove = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      adjustment: adjustment.trim(),
      status: status.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setAdjustment('')
    setStatus('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    adjusted: records.filter(r => r.adjustment).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '无根之爱', value: stats.total, icon: '🌊' },
          { label: '本月记录', value: stats.thisMonth, icon: '📅' },
          { label: '已调整', value: stats.adjusted, icon: '⚡' },
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
          🌊 无根之爱
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="无根时刻是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={adjustment}
          onChange={(e) => setAdjustment(e.target.value)}
          placeholder="如何调整？"
          style={inputStyle}
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="当前状态（迷茫/寻找/重新扎根/稳定）"
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
          🌊 记录时刻
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
              {r.adjustment && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>⚡ {r.adjustment}</div>}
              {r.status && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌊 {r.status}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌊 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-earth-neptune']
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
  { id: 'grounding', name: '扎根感受', icon: '🌍' },
  { id: 'connection', name: '深层连接', icon: '🔗' },
  { id: 'rootless', name: '无根之爱', icon: '🌊' },
]

export default function VenusEarthNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('grounding')
  const [groundingRecords, setGroundingRecords] = useLocalStorage<GroundingFeeling[]>('ven-grounding', [])
  const [connectionRecords, setConnectionRecords] = useLocalStorage<DeepConnection[]>('ven-connection', [])
  const [rootlessRecords, setRootlessRecords] = useLocalStorage<RootlessLove[]>('ven-rootless', [])

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
        {activeTab === 'grounding' && <GroundingFeelingModule records={groundingRecords} setRecords={setGroundingRecords} />}
        {activeTab === 'connection' && <DeepConnectionModule records={connectionRecords} setRecords={setConnectionRecords} />}
        {activeTab === 'rootless' && <RootlessLoveModule records={rootlessRecords} setRecords={setRootlessRecords} />}
      </div>
    </ComboShell>
  )
}
