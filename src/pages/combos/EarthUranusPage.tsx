import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Limit {
  id: string
  oldLimit: string
  newPossibility: string
  verify: string
  createdAt: string
}

interface Innovate {
  id: string
  idea: string
  steps: string
  status: string
  createdAt: string
}

interface Surprise {
  id: string
  event: string
  meaning: string
  action: string
  createdAt: string
}

interface Redefine {
  id: string
  target: string
  newDefinition: string
  feeling: string
  createdAt: string
}

function LimitModule({ limits, setLimits }: {
  limits: Limit[]
  setLimits: (fn: (prev: Limit[]) => Limit[]) => void
}) {
  const [oldLimit, setOldLimit] = useState('')
  const [newPossibility, setNewPossibility] = useState('')
  const [verify, setVerify] = useState('')

  const addLimit = () => {
    if (!oldLimit.trim()) return
    const item: Limit = {
      id: `${Date.now()}`,
      oldLimit: oldLimit.trim(),
      newPossibility: newPossibility.trim(),
      verify: verify.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setLimits((prev) => [item, ...prev])
    setOldLimit('')
    setNewPossibility('')
    setVerify('')
  }

  const stats = {
    total: limits.length,
    withPossibility: limits.filter(l => l.newPossibility).length,
    withVerify: limits.filter(l => l.verify).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '打破限制', value: stats.total, icon: '⚡' },
          { label: '新可能', value: stats.withPossibility, icon: '🌟' },
          { label: '已验证', value: stats.withVerify, icon: '✅' },
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
          ⚡ 打破限制
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          识别旧有限制，发现新的可能
        </div>

        <textarea
          value={oldLimit}
          onChange={(e) => setOldLimit(e.target.value)}
          placeholder="你认为的旧有限制是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={newPossibility}
          onChange={(e) => setNewPossibility(e.target.value)}
          placeholder="新的可能性是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={verify}
          onChange={(e) => setVerify(e.target.value)}
          placeholder="如何验证这个新可能？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addLimit}
          disabled={!oldLimit.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: oldLimit.trim() ? 'pointer' : 'not-allowed',
            opacity: oldLimit.trim() ? 1 : 0.5,
          }}
        >
          ⚡ 打破限制
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的限制突破</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {limits.slice(0, 5).map((l) => (
            <div key={l.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: '#ff9090', marginBottom: 6 }}>
                ❌ {l.oldLimit}
              </div>
              {l.newPossibility && (
                <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>
                  ✨ {l.newPossibility}
                </div>
              )}
              {l.verify && (
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  🔍 验证：{l.verify}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{l.createdAt}</div>
            </div>
          ))}
          {limits.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有限制突破
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InnovateModule({ innovates, setInnovates }: {
  innovates: Innovate[]
  setInnovates: (fn: (prev: Innovate[]) => Innovate[]) => void
}) {
  const [idea, setIdea] = useState('')
  const [steps, setSteps] = useState('')
  const [status, setStatus] = useState('💡 想法阶段')

  const STATUS_OPTIONS = ['💡 想法阶段', '📋 计划中', '🚀 进行中', '✅ 已落地', '🔄 迭代中']

  const addInnovate = () => {
    if (!idea.trim()) return
    const item: Innovate = {
      id: `${Date.now()}`,
      idea: idea.trim(),
      steps: steps.trim(),
      status,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setInnovates((prev) => [item, ...prev])
    setIdea('')
    setSteps('')
    setStatus('💡 想法阶段')
  }

  const stats = {
    total: innovates.length,
    inProgress: innovates.filter(i => i.status.includes('进行中') || i.status.includes('计划中')).length,
    completed: innovates.filter(i => i.status.includes('已落地')).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '创意总数', value: stats.total, icon: '💡' },
          { label: '落地中', value: stats.inProgress, icon: '🚀' },
          { label: '已落地', value: stats.completed, icon: '✅' },
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
          💡 创新落地
        </div>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="你的创意想法是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="落地步骤是什么？"
          style={textAreaStyle}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <button
          onClick={addInnovate}
          disabled={!idea.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: idea.trim() ? 'pointer' : 'not-allowed',
            opacity: idea.trim() ? 1 : 0.5,
          }}
        >
          💡 记录创意
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的创新</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {innovates.slice(0, 5).map((i) => (
            <div key={i.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, fontWeight: 500 }}>
                  💡 {i.idea}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>
                  {i.status}
                </span>
              </div>
              {i.steps && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  📋 {i.steps}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{i.createdAt}</div>
            </div>
          ))}
          {innovates.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💡 还没有创意记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SurpriseModule({ surprises, setSurprises }: {
  surprises: Surprise[]
  setSurprises: (fn: (prev: Surprise[]) => Surprise[]) => void
}) {
  const [event, setEvent] = useState('')
  const [meaning, setMeaning] = useState('')
  const [action, setAction] = useState('')

  const addSurprise = () => {
    if (!event.trim()) return
    const item: Surprise = {
      id: `${Date.now()}`,
      event: event.trim(),
      meaning: meaning.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setSurprises((prev) => [item, ...prev])
    setEvent('')
    setMeaning('')
    setAction('')
  }

  const stats = {
    total: surprises.length,
    withMeaning: surprises.filter(s => s.meaning).length,
    withAction: surprises.filter(s => s.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '意外礼物', value: stats.total, icon: '🎁' },
          { label: '有意义', value: stats.withMeaning, icon: '💎' },
          { label: '有行动', value: stats.withAction, icon: '🎯' },
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
          🎁 意外礼物
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          每一个意外都是宇宙送的礼物
        </div>

        <textarea
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="发生了什么意外事件？"
          style={textAreaStyle}
        />
        <textarea
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="这件事的正面意义是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你将采取什么行动？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addSurprise}
          disabled={!event.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: event.trim() ? 'pointer' : 'not-allowed',
            opacity: event.trim() ? 1 : 0.5,
          }}
        >
          🎁 收下礼物
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的意外礼物</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {surprises.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🎁 {s.event}
              </div>
              {s.meaning && (
                <div style={{ fontSize: 12, color: '#a0f0c0', marginBottom: 6 }}>
                  💎 {s.meaning}
                </div>
              )}
              {s.action && (
                <div style={{ fontSize: 11, opacity: 0.75 }}>
                  🎯 行动：{s.action}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{s.createdAt}</div>
            </div>
          ))}
          {surprises.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎁 还没有意外礼物
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RedefineModule({ redefines, setRedefines }: {
  redefines: Redefine[]
  setRedefines: (fn: (prev: Redefine[]) => Redefine[]) => void
}) {
  const [target, setTarget] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRedefine = () => {
    if (!target.trim()) return
    const item: Redefine = {
      id: `${Date.now()}`,
      target: target.trim(),
      newDefinition: newDefinition.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRedefines((prev) => [item, ...prev])
    setTarget('')
    setNewDefinition('')
    setFeeling('')
  }

  const stats = {
    total: redefines.length,
    withDefinition: redefines.filter(r => r.newDefinition).length,
    withFeeling: redefines.filter(r => r.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '重新定义', value: stats.total, icon: '🔄' },
          { label: '新定义', value: stats.withDefinition, icon: '📝' },
          { label: '有感受', value: stats.withFeeling, icon: '💭' },
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
          🔄 重新定义
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          换个角度看世界，重新定义一切
        </div>

        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="你要重新定义什么？"
          style={inputStyle}
        />
        <textarea
          value={newDefinition}
          onChange={(e) => setNewDefinition(e.target.value)}
          placeholder="你的新定义是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="重新定义后的感受"
          style={textAreaStyle}
        />

        <button
          onClick={addRedefine}
          disabled={!target.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: target.trim() ? 'pointer' : 'not-allowed',
            opacity: target.trim() ? 1 : 0.5,
          }}
        >
          🔄 重新定义
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的重新定义</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {redefines.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 6 }}>
                🔄 {r.target}
              </div>
              {r.newDefinition && (
                <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.6, marginBottom: 6, paddingLeft: 10, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  📝 {r.newDefinition}
                </div>
              )}
              {r.feeling && (
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  💭 {r.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {redefines.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔄 还没有重新定义
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#80d0e0'
const SECONDARY_COLOR = '#60c0d0'

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
  color: '#d0f5ff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0f5ff', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0f5ff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'limit', name: '打破限制', icon: '⚡' },
  { id: 'innovate', name: '创新落地', icon: '💡' },
  { id: 'surprise', name: '意外礼物', icon: '🎁' },
  { id: 'redefine', name: '重新定义', icon: '🔄' },
]

export default function EarthUranusPage() {
  const config = comboConfigs['earth-uranus']
  const [activeTab, setActiveTab] = useState<string>('limit')
  const [limits, setLimits] = useLocalStorage<Limit[]>('eu-limits', [])
  const [innovates, setInnovates] = useLocalStorage<Innovate[]>('eu-innovates', [])
  const [surprises, setSurprises] = useLocalStorage<Surprise[]>('eu-surprises', [])
  const [redefines, setRedefines] = useLocalStorage<Redefine[]>('eu-redefines', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#d0f5ff' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'limit' && <LimitModule limits={limits} setLimits={setLimits} />}
        {activeTab === 'innovate' && <InnovateModule innovates={innovates} setInnovates={setInnovates} />}
        {activeTab === 'surprise' && <SurpriseModule surprises={surprises} setSurprises={setSurprises} />}
        {activeTab === 'redefine' && <RedefineModule redefines={redefines} setRedefines={setRedefines} />}
      </div>
    </ComboShell>
  )
}
