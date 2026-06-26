import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface BoundaryAwareness {
  id: string
  boundary: string
  feeling: string
  adjustment: string
  createdAt: string
}

interface UnconditionalPractice {
  id: string
  practice: string
  target: string
  feeling: string
  createdAt: string
}

interface PossibilityLight {
  id: string
  possibility: string
  fear: string
  action: string
  createdAt: string
}

function BoundaryAwarenessModule({ records, setRecords }: {
  records: BoundaryAwareness[]
  setRecords: (fn: (prev: BoundaryAwareness[]) => BoundaryAwareness[]) => void
}) {
  const [boundary, setBoundary] = useState('')
  const [feeling, setFeeling] = useState('')
  const [adjustment, setAdjustment] = useState('')

  const addRecord = () => {
    if (!boundary.trim()) return
    const item: BoundaryAwareness = {
      id: `${Date.now()}`,
      boundary: boundary.trim(),
      feeling: feeling.trim(),
      adjustment: adjustment.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBoundary('')
    setFeeling('')
    setAdjustment('')
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
          { label: '边界觉察', value: stats.total, icon: '🚧' },
          { label: '本月觉察', value: stats.thisMonth, icon: '📅' },
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
          🚧 边界觉察
        </div>
        <input
          type="text"
          value={boundary}
          onChange={(e) => setBoundary(e.target.value)}
          placeholder="边界在哪里？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？"
          style={inputStyle}
        />
        <input
          type="text"
          value={adjustment}
          onChange={(e) => setAdjustment(e.target.value)}
          placeholder="如何调整？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!boundary.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: boundary.trim() ? 'pointer' : 'not-allowed',
            opacity: boundary.trim() ? 1 : 0.5,
          }}
        >
          🚧 记录边界
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.boundary}</div>
              {r.feeling && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🚧 {r.feeling}</div>}
              {r.adjustment && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>⚡ {r.adjustment}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🚧 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UnconditionalPracticeModule({ records, setRecords }: {
  records: UnconditionalPractice[]
  setRecords: (fn: (prev: UnconditionalPractice[]) => UnconditionalPractice[]) => void
}) {
  const [practice, setPractice] = useState('')
  const [target, setTarget] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!practice.trim()) return
    const item: UnconditionalPractice = {
      id: `${Date.now()}`,
      practice: practice.trim(),
      target: target.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPractice('')
    setTarget('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    positive: records.filter(r => r.feeling === '很好' || r.feeling === '平静').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '无条件练习', value: stats.total, icon: '💜' },
          { label: '本月练习', value: stats.thisMonth, icon: '📅' },
          { label: '感觉良好', value: stats.positive, icon: '✨' },
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
          💜 无条件练习
        </div>
        <input
          type="text"
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="练习内容是什么？"
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
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？（很好/一般/困难）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!practice.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: practice.trim() ? 'pointer' : 'not-allowed',
            opacity: practice.trim() ? 1 : 0.5,
          }}
        >
          💜 记录练习
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.practice}</div>
              {r.target && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>💜 {r.target}</div>}
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>✨ {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💜 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PossibilityLightModule({ records, setRecords }: {
  records: PossibilityLight[]
  setRecords: (fn: (prev: PossibilityLight[]) => PossibilityLight[]) => void
}) {
  const [possibility, setPossibility] = useState('')
  const [fear, setFear] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!possibility.trim()) return
    const item: PossibilityLight = {
      id: `${Date.now()}`,
      possibility: possibility.trim(),
      fear: fear.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPossibility('')
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
    acted: records.filter(r => r.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '可能之光', value: stats.total, icon: '💡' },
          { label: '本月发现', value: stats.thisMonth, icon: '📅' },
          { label: '已行动', value: stats.acted, icon: '⚡' },
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
          💡 可能之光
        </div>
        <input
          type="text"
          value={possibility}
          onChange={(e) => setPossibility(e.target.value)}
          placeholder="可能性是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={fear}
          onChange={(e) => setFear(e.target.value)}
          placeholder="恐惧是什么？"
          style={inputStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="采取了什么行动？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!possibility.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: possibility.trim() ? 'pointer' : 'not-allowed',
            opacity: possibility.trim() ? 1 : 0.5,
          }}
        >
          💡 记录可能
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.possibility}</div>
              {r.fear && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>💡 {r.fear}</div>}
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>⚡ {r.action}</div>}
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

const config = comboConfigs['venus-saturn-neptune']
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
  { id: 'boundary', name: '边界觉察', icon: '🚧' },
  { id: 'unconditional', name: '无条件练习', icon: '💜' },
  { id: 'possibility', name: '可能之光', icon: '💡' },
]

export default function VenusSaturnNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('boundary')
  const [boundaryRecords, setBoundaryRecords] = useLocalStorage<BoundaryAwareness[]>('vsn-boundary', [])
  const [unconditionalRecords, setUnconditionalRecords] = useLocalStorage<UnconditionalPractice[]>('vsn-unconditional', [])
  const [possibilityRecords, setPossibilityRecords] = useLocalStorage<PossibilityLight[]>('vsn-possibility', [])

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
        {activeTab === 'boundary' && <BoundaryAwarenessModule records={boundaryRecords} setRecords={setBoundaryRecords} />}
        {activeTab === 'unconditional' && <UnconditionalPracticeModule records={unconditionalRecords} setRecords={setUnconditionalRecords} />}
        {activeTab === 'possibility' && <PossibilityLightModule records={possibilityRecords} setRecords={setPossibilityRecords} />}
      </div>
    </ComboShell>
  )
}
