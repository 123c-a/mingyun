import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface GroundingStep {
  id: string
  step: string
  completion: string
  status: string
  createdAt: string
}

interface DreamAction {
  id: string
  action: string
  relation: string
  effect: string
  createdAt: string
}

interface SoilCultivation {
  id: string
  cultivation: string
  investment: string
  growth: string
  createdAt: string
}

function GroundingStepModule({ records, setRecords }: {
  records: GroundingStep[]
  setRecords: (fn: (prev: GroundingStep[]) => GroundingStep[]) => void
}) {
  const [step, setStep] = useState('')
  const [completion, setCompletion] = useState('')
  const [status, setStatus] = useState('')

  const addRecord = () => {
    if (!step.trim()) return
    const item: GroundingStep = {
      id: `${Date.now()}`,
      step: step.trim(),
      completion: completion.trim(),
      status: status.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setStep('')
    setCompletion('')
    setStatus('')
  }

  const stats = {
    total: records.length,
    completed: records.filter(r => r.status === '已完成' || r.status === '完成').length,
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
          { label: '落地步骤', value: stats.total, icon: '👣' },
          { label: '已完成', value: stats.completed, icon: '✅' },
          { label: '本月步骤', value: stats.thisMonth, icon: '📅' },
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
          👣 落地步骤
        </div>
        <input
          type="text"
          value={step}
          onChange={(e) => setStep(e.target.value)}
          placeholder="步骤是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={completion}
          onChange={(e) => setCompletion(e.target.value)}
          placeholder="完成度（0-100%）"
          style={inputStyle}
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="状态（进行中/已完成/暂停）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!step.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: step.trim() ? 'pointer' : 'not-allowed',
            opacity: step.trim() ? 1 : 0.5,
          }}
        >
          👣 记录步骤
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.step}</div>
              {r.completion && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>👣 {r.completion}</div>}
              {r.status && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>📍 {r.status}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              👣 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DreamActionModule({ records, setRecords }: {
  records: DreamAction[]
  setRecords: (fn: (prev: DreamAction[]) => DreamAction[]) => void
}) {
  const [action, setAction] = useState('')
  const [relation, setRelation] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: DreamAction = {
      id: `${Date.now()}`,
      action: action.trim(),
      relation: relation.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setRelation('')
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
    positive: records.filter(r => r.effect === '很好' || r.effect === '有效').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '梦想行动', value: stats.total, icon: '🌟' },
          { label: '本月行动', value: stats.thisMonth, icon: '📅' },
          { label: '有效行动', value: stats.positive, icon: '✨' },
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
          🌟 梦想行动
        </div>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="采取了什么行动？"
          style={inputStyle}
        />
        <input
          type="text"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="与梦想的关联是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（很好/一般/待观察）"
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
          🌟 记录行动
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
              {r.relation && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌟 {r.relation}</div>}
              {r.effect && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌟 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SoilCultivationModule({ records, setRecords }: {
  records: SoilCultivation[]
  setRecords: (fn: (prev: SoilCultivation[]) => SoilCultivation[]) => void
}) {
  const [cultivation, setCultivation] = useState('')
  const [investment, setInvestment] = useState('')
  const [growth, setGrowth] = useState('')

  const addRecord = () => {
    if (!cultivation.trim()) return
    const item: SoilCultivation = {
      id: `${Date.now()}`,
      cultivation: cultivation.trim(),
      investment: investment.trim(),
      growth: growth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setCultivation('')
    setInvestment('')
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
    growing: records.filter(r => r.growth === '成长中' || r.growth === '很好').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '土壤培育', value: stats.total, icon: '🌱' },
          { label: '本月培育', value: stats.thisMonth, icon: '📅' },
          { label: '成长中', value: stats.growing, icon: '💚' },
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
          🌱 土壤培育
        </div>
        <input
          type="text"
          value={cultivation}
          onChange={(e) => setCultivation(e.target.value)}
          placeholder="培育什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="投入了多少？（少/中/多）"
          style={inputStyle}
        />
        <input
          type="text"
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="成长情况（播种/发芽/成长中/很好）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!cultivation.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: cultivation.trim() ? 'pointer' : 'not-allowed',
            opacity: cultivation.trim() ? 1 : 0.5,
          }}
        >
          🌱 记录培育
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.cultivation}</div>
              {r.investment && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🌱 {r.investment}</div>}
              {r.growth && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💚 {r.growth}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌱 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['earth-mars-neptune']
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
  { id: 'step', name: '落地步骤', icon: '👣' },
  { id: 'dream', name: '梦想行动', icon: '🌟' },
  { id: 'cultivation', name: '土壤培育', icon: '🌱' },
]

export default function EarthMarsNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('step')
  const [stepRecords, setStepRecords] = useLocalStorage<GroundingStep[]>('emn-step', [])
  const [dreamRecords, setDreamRecords] = useLocalStorage<DreamAction[]>('emn-dream', [])
  const [cultivationRecords, setCultivationRecords] = useLocalStorage<SoilCultivation[]>('emn-cultivation', [])

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
        {activeTab === 'step' && <GroundingStepModule records={stepRecords} setRecords={setStepRecords} />}
        {activeTab === 'dream' && <DreamActionModule records={dreamRecords} setRecords={setDreamRecords} />}
        {activeTab === 'cultivation' && <SoilCultivationModule records={cultivationRecords} setRecords={setCultivationRecords} />}
      </div>
    </ComboShell>
  )
}
