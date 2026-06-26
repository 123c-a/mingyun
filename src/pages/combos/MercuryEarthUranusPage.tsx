import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface BlindSpotRecord {
  id: string
  blindSpot: string
  impact: string
  breakthrough: string
  createdAt: string
}

interface CreativityRecord {
  id: string
  idea: string
  connection: string
  plan: string
  createdAt: string
}

interface HabitBreakRecord {
  id: string
  oldHabit: string
  newAction: string
  effect: string
  createdAt: string
}

function BlindSpotModule({ records, setRecords }: {
  records: BlindSpotRecord[]
  setRecords: (fn: (prev: BlindSpotRecord[]) => BlindSpotRecord[]) => void
}) {
  const [blindSpot, setBlindSpot] = useState('')
  const [impact, setImpact] = useState('')
  const [breakthrough, setBreakthrough] = useState('')

  const addRecord = () => {
    if (!blindSpot.trim()) return
    const item: BlindSpotRecord = {
      id: `${Date.now()}`,
      blindSpot: blindSpot.trim(),
      impact: impact.trim(),
      breakthrough: breakthrough.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBlindSpot('')
    setImpact('')
    setBreakthrough('')
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
          { label: '盲区总数', value: stats.total, icon: '👁️' },
          { label: '本月发现', value: stats.thisMonth, icon: '📅' },
          { label: '认知升级', value: stats.total, icon: '🧠' },
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
          👁️ 思维盲区
        </div>
        <textarea
          value={blindSpot}
          onChange={(e) => setBlindSpot(e.target.value)}
          placeholder="这是什么思维盲区？"
          style={textAreaStyle}
        />
        <textarea
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="它如何影响你？"
          style={textAreaStyle}
        />
        <textarea
          value={breakthrough}
          onChange={(e) => setBreakthrough(e.target.value)}
          placeholder="如何突破这个盲区？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!blindSpot.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: blindSpot.trim() ? 'pointer' : 'not-allowed',
            opacity: blindSpot.trim() ? 1 : 0.5,
          }}
        >
          👁️ 记录盲区
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的盲区</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>👁️ {r.blindSpot}</div>
              {r.impact && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>影响: {r.impact}</div>}
              {r.breakthrough && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>突破: {r.breakthrough}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>👁️ 还没有盲区</div>
          )}
        </div>
      </div>
    </div>
  )
}

function CreativityModule({ records, setRecords }: {
  records: CreativityRecord[]
  setRecords: (fn: (prev: CreativityRecord[]) => CreativityRecord[]) => void
}) {
  const [idea, setIdea] = useState('')
  const [connection, setConnection] = useState('')
  const [plan, setPlan] = useState('')

  const addRecord = () => {
    if (!idea.trim()) return
    const item: CreativityRecord = {
      id: `${Date.now()}`,
      idea: idea.trim(),
      connection: connection.trim(),
      plan: plan.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setIdea('')
    setConnection('')
    setPlan('')
  }

  const stats = {
    total: records.length,
    withConnection: records.filter(r => r.connection).length,
    withPlan: records.filter(r => r.plan).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '创意总数', value: stats.total, icon: '💡' },
          { label: '已建立连接', value: stats.withConnection, icon: '🔗' },
          { label: '已有计划', value: stats.withPlan, icon: '📋' },
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
          💡 创意闪现
        </div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="突然想到什么创意？"
          style={textAreaStyle}
        />
        <textarea
          value={connection}
          onChange={(e) => setConnection(e.target.value)}
          placeholder="它和什么产生了关联？"
          style={textAreaStyle}
        />
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="执行计划是什么？"
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
          💡 记录创意
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的创意</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>💡 {r.idea}</div>
              {r.connection && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>关联: {r.connection}</div>}
              {r.plan && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>计划: {r.plan}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💡 还没有创意</div>
          )}
        </div>
      </div>
    </div>
  )
}

function HabitBreakModule({ records, setRecords }: {
  records: HabitBreakRecord[]
  setRecords: (fn: (prev: HabitBreakRecord[]) => HabitBreakRecord[]) => void
}) {
  const [oldHabit, setOldHabit] = useState('')
  const [newAction, setNewAction] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!oldHabit.trim()) return
    const item: HabitBreakRecord = {
      id: `${Date.now()}`,
      oldHabit: oldHabit.trim(),
      newAction: newAction.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setOldHabit('')
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
          🚀 打破惯性
        </div>
        <textarea
          value={oldHabit}
          onChange={(e) => setOldHabit(e.target.value)}
          placeholder="旧的惯性行为是什么？"
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
          disabled={!oldHabit.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldHabit.trim() ? 'pointer' : 'not-allowed',
            opacity: oldHabit.trim() ? 1 : 0.5,
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
              <div style={{ fontSize: 12, color: '#ff9090', marginBottom: 4 }}>❌ {r.oldHabit}</div>
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

const PRIMARY_COLOR = comboConfigs['mercury-earth-uranus'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-earth-uranus'].secondaryColor

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
  { id: 'blindspot', name: '思维盲区', icon: '👁️' },
  { id: 'creativity', name: '创意闪现', icon: '💡' },
  { id: 'habitbreak', name: '打破惯性', icon: '🚀' },
]

export default function MercuryEarthUranusPage() {
  const config = comboConfigs['mercury-earth-uranus']
  const [activeTab, setActiveTab] = useState<string>('blindspot')
  const [blindspots, setBlindspots] = useLocalStorage<BlindSpotRecord[]>('meu-blindspots', [])
  const [creativities, setCreativities] = useLocalStorage<CreativityRecord[]>('meu-creativities', [])
  const [habitbreaks, setHabitbreaks] = useLocalStorage<HabitBreakRecord[]>('meu-habitbreaks', [])

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
        {activeTab === 'blindspot' && <BlindSpotModule records={blindspots} setRecords={setBlindspots} />}
        {activeTab === 'creativity' && <CreativityModule records={creativities} setRecords={setCreativities} />}
        {activeTab === 'habitbreak' && <HabitBreakModule records={habitbreaks} setRecords={setHabitbreaks} />}
      </div>
    </ComboShell>
  )
}
