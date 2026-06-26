import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface TriggerRecord {
  id: string
  trigger: string
  feeling: string
  change: string
  createdAt: string
}

interface TriplePowerRecord {
  id: string
  power: string
  cooperation: string
  experience: string
  createdAt: string
}

interface MetamorphosisRecord {
  id: string
  process: string
  stage: string
  result: string
  createdAt: string
}

function TriggerModule({ records, setRecords }: {
  records: TriggerRecord[]
  setRecords: (fn: (prev: TriggerRecord[]) => TriggerRecord[]) => void
}) {
  const [trigger, setTrigger] = useState('')
  const [feeling, setFeeling] = useState('')
  const [change, setChange] = useState('')

  const addRecord = () => {
    if (!trigger.trim()) return
    const item: TriggerRecord = {
      id: `${Date.now()}`,
      trigger: trigger.trim(),
      feeling: feeling.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setTrigger('')
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
          { label: '触发总数', value: stats.total, icon: '💥' },
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
          💥 剧变触发
        </div>
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="触发是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
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
          disabled={!trigger.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: trigger.trim() ? 'pointer' : 'not-allowed',
            opacity: trigger.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录触发
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的触发</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>💥 {r.trigger}</div>
              {r.feeling && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.feeling}</div>}
              {r.change && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🔄 {r.change}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💥 还没有触发
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TriplePowerModule({ records, setRecords }: {
  records: TriplePowerRecord[]
  setRecords: (fn: (prev: TriplePowerRecord[]) => TriplePowerRecord[]) => void
}) {
  const [power, setPower] = useState('')
  const [cooperation, setCooperation] = useState('')
  const [experience, setExperience] = useState('')

  const addRecord = () => {
    if (!power.trim()) return
    const item: TriplePowerRecord = {
      id: `${Date.now()}`,
      power: power.trim(),
      cooperation: cooperation.trim(),
      experience: experience.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPower('')
    setCooperation('')
    setExperience('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withExperience: records.filter(r => r.experience).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '三重力量总数', value: stats.total, icon: '⚡' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有体验', value: stats.withExperience, icon: '✨' },
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
          ⚡ 三重力量
        </div>
        <input
          type="text"
          value={power}
          onChange={(e) => setPower(e.target.value)}
          placeholder="三种力量是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={cooperation}
          onChange={(e) => setCooperation(e.target.value)}
          placeholder="它们如何协作？"
          style={inputStyle}
        />
        <input
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="你的体验是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!power.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: power.trim() ? 'pointer' : 'not-allowed',
            opacity: power.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录力量
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的力量</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>⚡ {r.power}</div>
              {r.cooperation && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🤝 {r.cooperation}</div>}
              {r.experience && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.experience}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有力量
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetamorphosisModule({ records, setRecords }: {
  records: MetamorphosisRecord[]
  setRecords: (fn: (prev: MetamorphosisRecord[]) => MetamorphosisRecord[]) => void
}) {
  const [process, setProcess] = useState('')
  const [stage, setStage] = useState('')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!process.trim()) return
    const item: MetamorphosisRecord = {
      id: `${Date.now()}`,
      process: process.trim(),
      stage: stage.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setProcess('')
    setStage('')
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
    withResult: records.filter(r => r.result).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '蜕变总数', value: stats.total, icon: '🦋' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有结果', value: stats.withResult, icon: '✨' },
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
          🦋 蜕变过程
        </div>
        <input
          type="text"
          value={process}
          onChange={(e) => setProcess(e.target.value)}
          placeholder="过程是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          placeholder="处于哪个阶段？"
          style={inputStyle}
        />
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!process.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: process.trim() ? 'pointer' : 'not-allowed',
            opacity: process.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录蜕变
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的蜕变</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🦋 {r.process}</div>
              {r.stage && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📍 {r.stage}</div>}
              {r.result && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🦋 还没有蜕变
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'mars-uranus-neptune'
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
  { id: 'trigger', name: '剧变触发', icon: '💥' },
  { id: 'triplePower', name: '三重力量', icon: '⚡' },
  { id: 'metamorphosis', name: '蜕变过程', icon: '🦋' },
]

export default function MarsUranusNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('trigger')
  const [triggers, setTriggers] = useLocalStorage<TriggerRecord[]>('mun-triggers', [])
  const [triplePowers, setTriplePowers] = useLocalStorage<TriplePowerRecord[]>('mun-triplepowers', [])
  const [metamorphoses, setMetamorphoses] = useLocalStorage<MetamorphosisRecord[]>('mun-metamorphoses', [])

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
        {activeTab === 'trigger' && <TriggerModule records={triggers} setRecords={setTriggers} />}
        {activeTab === 'triplePower' && <TriplePowerModule records={triplePowers} setRecords={setTriplePowers} />}
        {activeTab === 'metamorphosis' && <MetamorphosisModule records={metamorphoses} setRecords={setMetamorphoses} />}
      </div>
    </ComboShell>
  )
}
