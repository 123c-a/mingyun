import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface AccumulationRecord {
  id: string
  accumulation: string
  explosion: string
  effect: string
  createdAt: string
}

interface BreakthroughRecord {
  id: string
  breakthrough: string
  trigger: string
  change: string
  createdAt: string
}

interface InnovationRecord {
  id: string
  innovation: string
  risk: string
  harvest: string
  createdAt: string
}

function AccumulationModule({ records, setRecords }: {
  records: AccumulationRecord[]
  setRecords: (fn: (prev: AccumulationRecord[]) => AccumulationRecord[]) => void
}) {
  const [accumulation, setAccumulation] = useState('')
  const [explosion, setExplosion] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!accumulation.trim()) return
    const item: AccumulationRecord = {
      id: `${Date.now()}`,
      accumulation: accumulation.trim(),
      explosion: explosion.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAccumulation('')
    setExplosion('')
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
          { label: '积累总数', value: stats.total, icon: '📦' },
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
          📦 积累与爆发
        </div>
        <input
          type="text"
          value={accumulation}
          onChange={(e) => setAccumulation(e.target.value)}
          placeholder="积累是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={explosion}
          onChange={(e) => setExplosion(e.target.value)}
          placeholder="爆发是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!accumulation.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: accumulation.trim() ? 'pointer' : 'not-allowed',
            opacity: accumulation.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录积累
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的积累</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>📦 {r.accumulation}</div>
              {r.explosion && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💥 {r.explosion}</div>}
              {r.effect && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📦 还没有积累
            </div>
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
  const [breakthrough, setBreakthrough] = useState('')
  const [trigger, setTrigger] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!breakthrough.trim()) return
    const item: BreakthroughRecord = {
      id: `${Date.now()}`,
      breakthrough: breakthrough.trim(),
      trigger: trigger.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBreakthrough('')
    setTrigger('')
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
          { label: '突破总数', value: stats.total, icon: '⚡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有变化', value: stats.withChange, icon: '🔄' },
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
          ⚡ 闪电突破
        </div>
        <input
          type="text"
          value={breakthrough}
          onChange={(e) => setBreakthrough(e.target.value)}
          placeholder="突破是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="是什么触发了它？"
          style={inputStyle}
        />
        <input
          type="text"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="发生了什么变化？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!breakthrough.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: breakthrough.trim() ? 'pointer' : 'not-allowed',
            opacity: breakthrough.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录突破
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
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>⚡ {r.breakthrough}</div>
              {r.trigger && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💫 {r.trigger}</div>}
              {r.change && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有突破
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InnovationModule({ records, setRecords }: {
  records: InnovationRecord[]
  setRecords: (fn: (prev: InnovationRecord[]) => InnovationRecord[]) => void
}) {
  const [innovation, setInnovation] = useState('')
  const [risk, setRisk] = useState('')
  const [harvest, setHarvest] = useState('')

  const addRecord = () => {
    if (!innovation.trim()) return
    const item: InnovationRecord = {
      id: `${Date.now()}`,
      innovation: innovation.trim(),
      risk: risk.trim(),
      harvest: harvest.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setInnovation('')
    setRisk('')
    setHarvest('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withHarvest: records.filter(r => r.harvest).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '创新行动总数', value: stats.total, icon: '💡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有收获', value: stats.withHarvest, icon: '🎁' },
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
          💡 创新行动
        </div>
        <input
          type="text"
          value={innovation}
          onChange={(e) => setInnovation(e.target.value)}
          placeholder="创新行动是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          placeholder="风险是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={harvest}
          onChange={(e) => setHarvest(e.target.value)}
          placeholder="收获是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!innovation.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: innovation.trim() ? 'pointer' : 'not-allowed',
            opacity: innovation.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录创新
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的创新</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>💡 {r.innovation}</div>
              {r.risk && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚠️ {r.risk}</div>}
              {r.harvest && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎁 {r.harvest}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💡 还没有创新
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'mars-jupiter-uranus'
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
  { id: 'accumulation', name: '积累与爆发', icon: '📦' },
  { id: 'breakthrough', name: '闪电突破', icon: '⚡' },
  { id: 'innovation', name: '创新行动', icon: '💡' },
]

export default function MarsJupiterUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('accumulation')
  const [accumulations, setAccumulations] = useLocalStorage<AccumulationRecord[]>('mju-accumulations', [])
  const [breakthroughs, setBreakthroughs] = useLocalStorage<BreakthroughRecord[]>('mju-breakthroughs', [])
  const [innovations, setInnovations] = useLocalStorage<InnovationRecord[]>('mju-innovations', [])

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
        {activeTab === 'accumulation' && <AccumulationModule records={accumulations} setRecords={setAccumulations} />}
        {activeTab === 'breakthrough' && <BreakthroughModule records={breakthroughs} setRecords={setBreakthroughs} />}
        {activeTab === 'innovation' && <InnovationModule records={innovations} setRecords={setInnovations} />}
      </div>
    </ComboShell>
  )
}
