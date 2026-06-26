import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface OldShellRecord {
  id: string
  oldShell: string
  limitation: string
  reason: string
  createdAt: string
}

interface CrackRecord {
  id: string
  crack: string
  trigger: string
  feeling: string
  createdAt: string
}

interface NewShellRecord {
  id: string
  newShell: string
  process: string
  effect: string
  createdAt: string
}

function OldShellModule({ records, setRecords }: {
  records: OldShellRecord[]
  setRecords: (fn: (prev: OldShellRecord[]) => OldShellRecord[]) => void
}) {
  const [oldShell, setOldShell] = useState('')
  const [limitation, setLimitation] = useState('')
  const [reason, setReason] = useState('')

  const addRecord = () => {
    if (!oldShell.trim()) return
    const item: OldShellRecord = {
      id: `${Date.now()}`,
      oldShell: oldShell.trim(),
      limitation: limitation.trim(),
      reason: reason.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setOldShell('')
    setLimitation('')
    setReason('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withReason: records.filter(r => r.reason).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '旧壳总数', value: stats.total, icon: '🐚' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有原因', value: stats.withReason, icon: '❓' },
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
          🐚 旧壳识别
        </div>
        <input
          type="text"
          value={oldShell}
          onChange={(e) => setOldShell(e.target.value)}
          placeholder="这个旧壳是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={limitation}
          onChange={(e) => setLimitation(e.target.value)}
          placeholder="它限制了你什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="为什么想突破它？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!oldShell.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldShell.trim() ? 'pointer' : 'not-allowed',
            opacity: oldShell.trim() ? 1 : 0.5,
          }}
        >
          ✨ 识别旧壳
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的旧壳</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🐚 {r.oldShell}</div>
              {r.limitation && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⛓️ {r.limitation}</div>}
              {r.reason && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>❓ {r.reason}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🐚 还没有旧壳
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CrackModule({ records, setRecords }: {
  records: CrackRecord[]
  setRecords: (fn: (prev: CrackRecord[]) => CrackRecord[]) => void
}) {
  const [crack, setCrack] = useState('')
  const [trigger, setTrigger] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!crack.trim()) return
    const item: CrackRecord = {
      id: `${Date.now()}`,
      crack: crack.trim(),
      trigger: trigger.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setCrack('')
    setTrigger('')
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
          { label: '裂缝总数', value: stats.total, icon: '💥' },
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
          💥 裂缝出现
        </div>
        <input
          type="text"
          value={crack}
          onChange={(e) => setCrack(e.target.value)}
          placeholder="裂缝是什么？"
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
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!crack.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: crack.trim() ? 'pointer' : 'not-allowed',
            opacity: crack.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录裂缝
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的裂缝</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>💥 {r.crack}</div>
              {r.trigger && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.trigger}</div>}
              {r.feeling && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💥 还没有裂缝
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewShellModule({ records, setRecords }: {
  records: NewShellRecord[]
  setRecords: (fn: (prev: NewShellRecord[]) => NewShellRecord[]) => void
}) {
  const [newShell, setNewShell] = useState('')
  const [process, setProcess] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!newShell.trim()) return
    const item: NewShellRecord = {
      id: `${Date.now()}`,
      newShell: newShell.trim(),
      process: process.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setNewShell('')
    setProcess('')
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
          { label: '新壳总数', value: stats.total, icon: '🌟' },
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
          🌟 新壳建立
        </div>
        <input
          type="text"
          value={newShell}
          onChange={(e) => setNewShell(e.target.value)}
          placeholder="新壳是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={process}
          onChange={(e) => setProcess(e.target.value)}
          placeholder="建立过程是怎样的？"
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
          disabled={!newShell.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: newShell.trim() ? 'pointer' : 'not-allowed',
            opacity: newShell.trim() ? 1 : 0.5,
          }}
        >
          ✨ 建立新壳
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的新壳</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🌟 {r.newShell}</div>
              {r.process && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔧 {r.process}</div>}
              {r.effect && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌟 还没有新壳
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'earth-saturn-uranus'
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
  { id: 'oldShell', name: '旧壳识别', icon: '🐚' },
  { id: 'crack', name: '裂缝出现', icon: '💥' },
  { id: 'newShell', name: '新壳建立', icon: '🌟' },
]

export default function EarthSaturnUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('oldShell')
  const [oldShells, setOldShells] = useLocalStorage<OldShellRecord[]>('esu-oldshells', [])
  const [cracks, setCracks] = useLocalStorage<CrackRecord[]>('esu-cracks', [])
  const [newShells, setNewShells] = useLocalStorage<NewShellRecord[]>('esu-newshells', [])

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
        {activeTab === 'oldShell' && <OldShellModule records={oldShells} setRecords={setOldShells} />}
        {activeTab === 'crack' && <CrackModule records={cracks} setRecords={setCracks} />}
        {activeTab === 'newShell' && <NewShellModule records={newShells} setRecords={setNewShells} />}
      </div>
    </ComboShell>
  )
}
