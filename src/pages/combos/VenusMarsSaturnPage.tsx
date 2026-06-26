import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface FearExplore {
  id: string
  fear: string
  reason: string
  facingWay: string
  createdAt: string
}

interface BraveChoice {
  id: string
  choice: string
  fear: string
  action: string
  createdAt: string
}

interface LoveCourage {
  id: string
  moment: string
  growth: string
  feeling: string
  createdAt: string
}

function FearExploreModule({ records, setRecords }: {
  records: FearExplore[]
  setRecords: (fn: (prev: FearExplore[]) => FearExplore[]) => void
}) {
  const [fear, setFear] = useState('')
  const [reason, setReason] = useState('')
  const [facingWay, setFacingWay] = useState('')

  const addRecord = () => {
    if (!fear.trim()) return
    const item: FearExplore = {
      id: `${Date.now()}`,
      fear: fear.trim(),
      reason: reason.trim(),
      facingWay: facingWay.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setFear('')
    setReason('')
    setFacingWay('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withWay: records.filter(r => r.facingWay).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '恐惧探索', value: stats.total, icon: '😨' },
          { label: '本月探索', value: stats.thisMonth, icon: '📅' },
          { label: '已面对', value: stats.withWay, icon: '💪' },
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
          😨 恐惧探索
        </div>
        <input
          type="text"
          value={fear}
          onChange={(e) => setFear(e.target.value)}
          placeholder="恐惧是什么？"
          style={inputStyle}
        />
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="恐惧背后的原因是什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={facingWay}
          onChange={(e) => setFacingWay(e.target.value)}
          placeholder="如何面对？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!fear.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: fear.trim() ? 'pointer' : 'not-allowed',
            opacity: fear.trim() ? 1 : 0.5,
          }}
        >
          😨 记录恐惧
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.fear}</div>
              {r.reason && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🔍 {r.reason}</div>}
              {r.facingWay && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💪 {r.facingWay}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              😨 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BraveChoiceModule({ records, setRecords }: {
  records: BraveChoice[]
  setRecords: (fn: (prev: BraveChoice[]) => BraveChoice[]) => void
}) {
  const [choice, setChoice] = useState('')
  const [fear, setFear] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!choice.trim()) return
    const item: BraveChoice = {
      id: `${Date.now()}`,
      choice: choice.trim(),
      fear: fear.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setChoice('')
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
          { label: '勇敢选择', value: stats.total, icon: '🦁' },
          { label: '本月选择', value: stats.thisMonth, icon: '📅' },
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
          🦁 勇敢选择
        </div>
        <input
          type="text"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          placeholder="做了什么选择？"
          style={inputStyle}
        />
        <input
          type="text"
          value={fear}
          onChange={(e) => setFear(e.target.value)}
          placeholder="克服了什么恐惧？"
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
          disabled={!choice.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: choice.trim() ? 'pointer' : 'not-allowed',
            opacity: choice.trim() ? 1 : 0.5,
          }}
        >
          🦁 记录选择
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.choice}</div>
              {r.fear && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>😨 {r.fear}</div>}
              {r.action && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🦁 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoveCourageModule({ records, setRecords }: {
  records: LoveCourage[]
  setRecords: (fn: (prev: LoveCourage[]) => LoveCourage[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [growth, setGrowth] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!moment.trim()) return
    const item: LoveCourage = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      growth: growth.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setMoment('')
    setGrowth('')
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
    withGrowth: records.filter(r => r.growth).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '爱的勇气', value: stats.total, icon: '💗' },
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
          💗 爱的勇气
        </div>
        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="勇敢时刻是什么？"
          style={inputStyle}
        />
        <textarea
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="带来了什么成长？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？"
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
              {r.growth && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌱 {r.growth}</div>}
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💗 {r.feeling}</div>}
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

const config = comboConfigs['venus-mars-saturn']
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
  { id: 'fear', name: '恐惧探索', icon: '😨' },
  { id: 'choice', name: '勇敢选择', icon: '🦁' },
  { id: 'love', name: '爱的勇气', icon: '💗' },
]

export default function VenusMarsSaturnPage() {
  const [activeTab, setActiveTab] = useState<string>('fear')
  const [fearRecords, setFearRecords] = useLocalStorage<FearExplore[]>('vms-fear', [])
  const [choiceRecords, setChoiceRecords] = useLocalStorage<BraveChoice[]>('vms-choice', [])
  const [loveRecords, setLoveRecords] = useLocalStorage<LoveCourage[]>('vms-love', [])

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
        {activeTab === 'fear' && <FearExploreModule records={fearRecords} setRecords={setFearRecords} />}
        {activeTab === 'choice' && <BraveChoiceModule records={choiceRecords} setRecords={setChoiceRecords} />}
        {activeTab === 'love' && <LoveCourageModule records={loveRecords} setRecords={setLoveRecords} />}
      </div>
    </ComboShell>
  )
}
