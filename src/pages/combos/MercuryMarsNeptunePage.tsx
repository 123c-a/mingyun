import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface DreamRecord {
  id: string
  dream: string
  firstStep: string
  status: string
  createdAt: string
}

interface ActionRecord {
  id: string
  action: string
  relevance: string
  effect: string
  createdAt: string
}

interface ImaginationRecord {
  id: string
  imagination: string
  feeling: string
  landed: string
  createdAt: string
}

const STATUS_OPTIONS = ['刚开始', '进行中', '已有进展', '接近目标']

function DreamModule({ records, setRecords }: {
  records: DreamRecord[]
  setRecords: (fn: (prev: DreamRecord[]) => DreamRecord[]) => void
}) {
  const [dream, setDream] = useState('')
  const [firstStep, setFirstStep] = useState('')
  const [status, setStatus] = useState('刚开始')

  const addRecord = () => {
    if (!dream.trim()) return
    const item: DreamRecord = {
      id: `${Date.now()}`,
      dream: dream.trim(),
      firstStep: firstStep.trim(),
      status,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setDream('')
    setFirstStep('')
  }

  const stats = {
    total: records.length,
    inProgress: records.filter(r => r.status === '进行中' || r.status === '已有进展').length,
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
          { label: '梦想总数', value: stats.total, icon: '🌟' },
          { label: '进行中', value: stats.inProgress, icon: '🔄' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
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
          🌟 梦想蓝图
        </div>
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="你的梦想是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={firstStep}
          onChange={(e) => setFirstStep(e.target.value)}
          placeholder="第一步是什么？"
          style={textAreaStyle}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
          {STATUS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={addRecord}
          disabled={!dream.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: dream.trim() ? 'pointer' : 'not-allowed',
            opacity: dream.trim() ? 1 : 0.5,
          }}
        >
          🌟 记录梦想
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的梦想</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>🌟 {r.dream}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.status}</span>
              </div>
              {r.firstStep && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>第一步: {r.firstStep}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌟 还没有梦想</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionModule({ records, setRecords }: {
  records: ActionRecord[]
  setRecords: (fn: (prev: ActionRecord[]) => ActionRecord[]) => void
}) {
  const [action, setAction] = useState('')
  const [relevance, setRelevance] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!action.trim()) return
    const item: ActionRecord = {
      id: `${Date.now()}`,
      action: action.trim(),
      relevance: relevance.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAction('')
    setRelevance('')
    setEffect('')
  }

  const stats = {
    total: records.length,
    relatedActions: records.filter(r => r.relevance).length,
    withEffect: records.filter(r => r.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '行动总数', value: stats.total, icon: '⚡' },
          { label: '关联梦想', value: stats.relatedActions, icon: '🔗' },
          { label: '有效行动', value: stats.withEffect, icon: '✨' },
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
          ⚡ 梦想行动
        </div>
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="采取了什么行动？"
          style={textAreaStyle}
        />
        <textarea
          value={relevance}
          onChange={(e) => setRelevance(e.target.value)}
          placeholder="与梦想有什么关联？"
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
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的动作</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>⚡ {r.action}</div>
              {r.relevance && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>关联: {r.relevance}</div>}
              {r.effect && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>效果: {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>⚡ 还没有行动</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ImaginationModule({ records, setRecords }: {
  records: ImaginationRecord[]
  setRecords: (fn: (prev: ImaginationRecord[]) => ImaginationRecord[]) => void
}) {
  const [imagination, setImagination] = useState('')
  const [feeling, setFeeling] = useState('')
  const [landed, setLanded] = useState('')

  const addRecord = () => {
    if (!imagination.trim()) return
    const item: ImaginationRecord = {
      id: `${Date.now()}`,
      imagination: imagination.trim(),
      feeling: feeling.trim(),
      landed: landed.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setImagination('')
    setFeeling('')
    setLanded('')
  }

  const stats = {
    total: records.length,
    landed: records.filter(r => r.landed && (r.landed.includes('是') || r.landed.includes('已'))).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '想象总数', value: stats.total, icon: '🎆' },
          { label: '已落地', value: stats.landed, icon: '✅' },
          { label: '梦想行动', value: stats.total, icon: '🌟' },
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
          🎆 想象力
        </div>
        <textarea
          value={imagination}
          onChange={(e) => setImagination(e.target.value)}
          placeholder="你想象的是什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="想象时的感受是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={landed}
          onChange={(e) => setLanded(e.target.value)}
          placeholder="是否已经落地？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!imagination.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: imagination.trim() ? 'pointer' : 'not-allowed',
            opacity: imagination.trim() ? 1 : 0.5,
          }}
        >
          🎆 记录想象
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的想象</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🎆 {r.imagination}</div>
              {r.feeling && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>感受: {r.feeling}</div>}
              {r.landed && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>落地: {r.landed}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🎆 还没有想象</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-mars-neptune'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-mars-neptune'].secondaryColor

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
  { id: 'dream', name: '梦想蓝图', icon: '🌟' },
  { id: 'action', name: '梦想行动', icon: '⚡' },
  { id: 'imagination', name: '想象力', icon: '🎆' },
]

export default function MercuryMarsNeptunePage() {
  const config = comboConfigs['mercury-mars-neptune']
  const [activeTab, setActiveTab] = useState<string>('dream')
  const [dreams, setDreams] = useLocalStorage<DreamRecord[]>('mmn-dreams', [])
  const [actions, setActions] = useLocalStorage<ActionRecord[]>('mmn-actions', [])
  const [imaginations, setImaginations] = useLocalStorage<ImaginationRecord[]>('mmn-imaginations', [])

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
        {activeTab === 'dream' && <DreamModule records={dreams} setRecords={setDreams} />}
        {activeTab === 'action' && <ActionModule records={actions} setRecords={setActions} />}
        {activeTab === 'imagination' && <ImaginationModule records={imaginations} setRecords={setImaginations} />}
      </div>
    </ComboShell>
  )
}
