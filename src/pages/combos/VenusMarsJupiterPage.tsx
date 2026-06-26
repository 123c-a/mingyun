import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface PassionExpression {
  id: string
  way: string
  target: string
  reaction: string
  createdAt: string
}

interface BoldAction {
  id: string
  action: string
  courageLevel: string
  result: string
  createdAt: string
}

interface BoldLove {
  id: string
  moment: string
  feeling: string
  growth: string
  createdAt: string
}

function PassionExpressionModule({ records, setRecords }: {
  records: PassionExpression[]
  setRecords: (fn: (prev: PassionExpression[]) => PassionExpression[]) => void
}) {
  const [way, setWay] = useState('')
  const [target, setTarget] = useState('')
  const [reaction, setReaction] = useState('')

  const addRecord = () => {
    if (!way.trim()) return
    const item: PassionExpression = {
      id: `${Date.now()}`,
      way: way.trim(),
      target: target.trim(),
      reaction: reaction.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setWay('')
    setTarget('')
    setReaction('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    positive: records.filter(r => r.reaction === '正面' || r.reaction === '很正面').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '热情表达', value: stats.total, icon: '🔥' },
          { label: '本月表达', value: stats.thisMonth, icon: '📅' },
          { label: '正面反应', value: stats.positive, icon: '💖' },
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
          🔥 热情表达
        </div>
        <input
          type="text"
          value={way}
          onChange={(e) => setWay(e.target.value)}
          placeholder="表达方式是什么？"
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
          value={reaction}
          onChange={(e) => setReaction(e.target.value)}
          placeholder="对方反应如何？（正面/中立/负面）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!way.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: way.trim() ? 'pointer' : 'not-allowed',
            opacity: way.trim() ? 1 : 0.5,
          }}
        >
          🔥 记录表达
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.way}</div>
              {r.target && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>👥 {r.target}</div>}
              {r.reaction && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💖 {r.reaction}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔥 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BoldActionModule({ records, setRecords }: {
  records: BoldAction[]
  setRecords: (fn: (prev: BoldAction[]) => BoldAction[]) => void
}) {
  const [action, setAction] = useState('')
  const [courageLevel, setCourageLevel] = useState('')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: BoldAction = {
      id: `${Date.now()}`,
      action: action.trim(),
      courageLevel: courageLevel.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setCourageLevel('')
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
    brave: records.filter(r => r.courageLevel === '很勇敢' || r.courageLevel === '非常勇敢').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '大胆行动', value: stats.total, icon: '⚡' },
          { label: '本月行动', value: stats.thisMonth, icon: '📅' },
          { label: '很勇敢', value: stats.brave, icon: '🦁' },
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
          ⚡ 大胆行动
        </div>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="做了什么行动？"
          style={inputStyle}
        />
        <input
          type="text"
          value={courageLevel}
          onChange={(e) => setCourageLevel(e.target.value)}
          placeholder="勇气程度（一般/勇敢/很勇敢/非常勇敢）"
          style={inputStyle}
        />
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？"
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
          ⚡ 记录行动
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.action}</div>
              {r.courageLevel && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🦁 {r.courageLevel}</div>}
              {r.result && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>⚡ {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BoldLoveModule({ records, setRecords }: {
  records: BoldLove[]
  setRecords: (fn: (prev: BoldLove[]) => BoldLove[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [feeling, setFeeling] = useState('')
  const [growth, setGrowth] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: BoldLove = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      feeling: feeling.trim(),
      growth: growth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setFeeling('')
    setGrowth('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withGrowth: records.filter(r => r.growth).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '爱的大胆', value: stats.total, icon: '💗' },
          { label: '本月时刻', value: stats.thisMonth, icon: '📅' },
          { label: '有成长', value: stats.withGrowth, icon: '🌱' },
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
          💗 爱的大胆
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="大胆时刻是什么？"
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
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="带来了什么成长？"
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
          💗 记录时刻
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
              {r.feeling && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>💗 {r.feeling}</div>}
              {r.growth && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌱 {r.growth}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💗 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-mars-jupiter']
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
  { id: 'passion', name: '热情表达', icon: '🔥' },
  { id: 'bold', name: '大胆行动', icon: '⚡' },
  { id: 'love', name: '爱的大胆', icon: '💗' },
]

export default function VenusMarsJupiterPage() {
  const [activeTab, setActiveTab] = useState<string>('passion')
  const [passionRecords, setPassionRecords] = useLocalStorage<PassionExpression[]>('vmj-passion', [])
  const [boldRecords, setBoldRecords] = useLocalStorage<BoldAction[]>('vmj-bold', [])
  const [loveRecords, setLoveRecords] = useLocalStorage<BoldLove[]>('vmj-love', [])

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
        {activeTab === 'passion' && <PassionExpressionModule records={passionRecords} setRecords={setPassionRecords} />}
        {activeTab === 'bold' && <BoldActionModule records={boldRecords} setRecords={setBoldRecords} />}
        {activeTab === 'love' && <BoldLoveModule records={loveRecords} setRecords={setLoveRecords} />}
      </div>
    </ComboShell>
  )
}
