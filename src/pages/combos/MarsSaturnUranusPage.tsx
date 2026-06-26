import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface OldBurnRecord {
  id: string
  old: string
  reason: string
  feeling: string
  createdAt: string
}

interface NewIlluminateRecord {
  id: string
  new: string
  illuminate: string
  change: string
  createdAt: string
}

interface RebuildRecord {
  id: string
  rebuild: string
  action: string
  state: string
  createdAt: string
}

function OldBurnModule({ records, setRecords }: {
  records: OldBurnRecord[]
  setRecords: (fn: (prev: OldBurnRecord[]) => OldBurnRecord[]) => void
}) {
  const [old, setOld] = useState('')
  const [reason, setReason] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!old.trim()) return
    const item: OldBurnRecord = {
      id: `${Date.now()}`,
      old: old.trim(),
      reason: reason.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setOld('')
    setReason('')
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
    withFeeling: records.filter(r => r.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '旧的总数', value: stats.total, icon: '🔥' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有感受', value: stats.withFeeling, icon: '💭' },
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
          🔥 旧的燃烧
        </div>
        <input
          type="text"
          value={old}
          onChange={(e) => setOld(e.target.value)}
          placeholder="旧的是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="为什么燃烧它？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!old.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: old.trim() ? 'pointer' : 'not-allowed',
            opacity: old.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录燃烧
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的燃烧</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🔥 {r.old}</div>
              {r.reason && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>❓ {r.reason}</div>}
              {r.feeling && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔥 还没有燃烧
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewIlluminateModule({ records, setRecords }: {
  records: NewIlluminateRecord[]
  setRecords: (fn: (prev: NewIlluminateRecord[]) => NewIlluminateRecord[]) => void
}) {
  const [newIlluminate, setNewIlluminate] = useState('')
  const [illuminate, setIlluminate] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!newIlluminate.trim()) return
    const item: NewIlluminateRecord = {
      id: `${Date.now()}`,
      new: newIlluminate.trim(),
      illuminate: illuminate.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setNewIlluminate('')
    setIlluminate('')
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
          { label: '新的总数', value: stats.total, icon: '💡' },
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
          💡 新的照亮
        </div>
        <input
          type="text"
          value={newIlluminate}
          onChange={(e) => setNewIlluminate(e.target.value)}
          placeholder="新的什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={illuminate}
          onChange={(e) => setIlluminate(e.target.value)}
          placeholder="如何照亮？"
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
          disabled={!newIlluminate.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: newIlluminate.trim() ? 'pointer' : 'not-allowed',
            opacity: newIlluminate.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录照亮
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的照亮</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>💡 {r.new}</div>
              {r.illuminate && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.illuminate}</div>}
              {r.change && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💡 还没有照亮
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RebuildModule({ records, setRecords }: {
  records: RebuildRecord[]
  setRecords: (fn: (prev: RebuildRecord[]) => RebuildRecord[]) => void
}) {
  const [rebuild, setRebuild] = useState('')
  const [action, setAction] = useState('')
  const [state, setState] = useState('')

  const addRecord = () => {
    if (!rebuild.trim()) return
    const item: RebuildRecord = {
      id: `${Date.now()}`,
      rebuild: rebuild.trim(),
      action: action.trim(),
      state: state.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setRebuild('')
    setAction('')
    setState('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withState: records.filter(r => r.state).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '重建总数', value: stats.total, icon: '🏗️' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有状态', value: stats.withState, icon: '🎯' },
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
          🏗️ 重建过程
        </div>
        <input
          type="text"
          value={rebuild}
          onChange={(e) => setRebuild(e.target.value)}
          placeholder="重建什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="采取什么行动？"
          style={inputStyle}
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="状态如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!rebuild.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: rebuild.trim() ? 'pointer' : 'not-allowed',
            opacity: rebuild.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录重建
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的重建</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🏗️ {r.rebuild}</div>
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              {r.state && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎯 {r.state}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏗️ 还没有重建
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'mars-saturn-uranus'
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
  { id: 'oldBurn', name: '旧的燃烧', icon: '🔥' },
  { id: 'newIlluminate', name: '新的照亮', icon: '💡' },
  { id: 'rebuild', name: '重建过程', icon: '🏗️' },
]

export default function MarsSaturnUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('oldBurn')
  const [oldBurns, setOldBurns] = useLocalStorage<OldBurnRecord[]>('msu-oldburns', [])
  const [newIlluminates, setNewIlluminates] = useLocalStorage<NewIlluminateRecord[]>('msu-newilluminates', [])
  const [rebuilds, setRebuilds] = useLocalStorage<RebuildRecord[]>('msu-rebuilds', [])

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
        {activeTab === 'oldBurn' && <OldBurnModule records={oldBurns} setRecords={setOldBurns} />}
        {activeTab === 'newIlluminate' && <NewIlluminateModule records={newIlluminates} setRecords={setNewIlluminates} />}
        {activeTab === 'rebuild' && <RebuildModule records={rebuilds} setRecords={setRebuilds} />}
      </div>
    </ComboShell>
  )
}
