import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface PreparationRecord {
  id: string
  preparation: string
  target: string
  confidence: string
  createdAt: string
}

interface DreamActionRecord {
  id: string
  action: string
  dream关联: string
  effect: string
  createdAt: string
}

interface JourneyRecord {
  id: string
  unknown: string
  expectation: string
  action: string
  createdAt: string
}

function PreparationModule({ records, setRecords }: {
  records: PreparationRecord[]
  setRecords: (fn: (prev: PreparationRecord[]) => PreparationRecord[]) => void
}) {
  const [preparation, setPreparation] = useState('')
  const [target, setTarget] = useState('')
  const [confidence, setConfidence] = useState('')

  const addRecord = () => {
    if (!preparation.trim()) return
    const item: PreparationRecord = {
      id: `${Date.now()}`,
      preparation: preparation.trim(),
      target: target.trim(),
      confidence: confidence.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPreparation('')
    setTarget('')
    setConfidence('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withConfidence: records.filter(r => r.confidence).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '准备总数', value: stats.total, icon: '🎒' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有信心', value: stats.withConfidence, icon: '💪' },
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
          🎒 远征准备
        </div>
        <input
          type="text"
          value={preparation}
          onChange={(e) => setPreparation(e.target.value)}
          placeholder="准备是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="目标是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          placeholder="信心如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!preparation.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: preparation.trim() ? 'pointer' : 'not-allowed',
            opacity: preparation.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录准备
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的准备</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🎒 {r.preparation}</div>
              {r.target && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎯 {r.target}</div>}
              {r.confidence && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💪 {r.confidence}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎒 还没有准备
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DreamActionModule({ records, setRecords }: {
  records: DreamActionRecord[]
  setRecords: (fn: (prev: DreamActionRecord[]) => DreamActionRecord[]) => void
}) {
  const [action, setAction] = useState('')
  const [dream关联, setDream关联] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: DreamActionRecord = {
      id: `${Date.now()}`,
      action: action.trim(),
      dream关联: dream关联.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setDream关联('')
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
          { label: '梦想行动总数', value: stats.total, icon: '🌟' },
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
          🌟 梦想行动
        </div>
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="行动是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={dream关联}
          onChange={(e) => setDream关联(e.target.value)}
          placeholder="与梦想的关联是什么？"
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
          ✨ 记录行动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🌟 {r.action}</div>
              {r.dream关联 && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💭 {r.dream关联}</div>}
              {r.effect && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌟 还没有行动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function JourneyModule({ records, setRecords }: {
  records: JourneyRecord[]
  setRecords: (fn: (prev: JourneyRecord[]) => JourneyRecord[]) => void
}) {
  const [unknown, setUnknown] = useState('')
  const [expectation, setExpectation] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!unknown.trim()) return
    const item: JourneyRecord = {
      id: `${Date.now()}`,
      unknown: unknown.trim(),
      expectation: expectation.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setUnknown('')
    setExpectation('')
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
          { label: '未知旅程总数', value: stats.total, icon: '🗺️' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有行动', value: stats.withAction, icon: '⚡' },
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
          🗺️ 未知旅程
        </div>
        <input
          type="text"
          value={unknown}
          onChange={(e) => setUnknown(e.target.value)}
          placeholder="未知是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={expectation}
          onChange={(e) => setExpectation(e.target.value)}
          placeholder="你的期待是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你选择什么行动？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!unknown.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: unknown.trim() ? 'pointer' : 'not-allowed',
            opacity: unknown.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录旅程
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的旅程</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🗺️ {r.unknown}</div>
              {r.expectation && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>✨ {r.expectation}</div>}
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🗺️ 还没有旅程
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'mars-jupiter-neptune'
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
  { id: 'preparation', name: '远征准备', icon: '🎒' },
  { id: 'dreamAction', name: '梦想行动', icon: '🌟' },
  { id: 'journey', name: '未知旅程', icon: '🗺️' },
]

export default function MarsJupiterNeptunePage() {
  const [activeTab, setActiveTab] = useState<string>('preparation')
  const [preparations, setPreparations] = useLocalStorage<PreparationRecord[]>('mjn-preparations', [])
  const [dreamActions, setDreamActions] = useLocalStorage<DreamActionRecord[]>('mjn-dremactions', [])
  const [journeys, setJourneys] = useLocalStorage<JourneyRecord[]>('mjn-journeys', [])

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
        {activeTab === 'preparation' && <PreparationModule records={preparations} setRecords={setPreparations} />}
        {activeTab === 'dreamAction' && <DreamActionModule records={dreamActions} setRecords={setDreamActions} />}
        {activeTab === 'journey' && <JourneyModule records={journeys} setRecords={setJourneys} />}
      </div>
    </ComboShell>
  )
}
