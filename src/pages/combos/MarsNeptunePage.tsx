import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Dream {
  id: string
  description: string
  why: string
  firstStep: string
  createdAt: string
}

interface ActionWave {
  id: string
  content: string
  connection: string
  feeling: string
  createdAt: string
}

interface Imagine {
  id: string
  content: string
  feeling: string
  acted: boolean
  createdAt: string
}

interface VisionAction {
  id: string
  vision: string
  action: string
  progress: string
  createdAt: string
}

function DreamModule({ dreams, setDreams }: {
  dreams: Dream[]
  setDreams: (fn: (prev: Dream[]) => Dream[]) => void
}) {
  const [description, setDescription] = useState('')
  const [why, setWhy] = useState('')
  const [firstStep, setFirstStep] = useState('')

  const addDream = () => {
    if (!description.trim()) return
    const item: Dream = {
      id: `${Date.now()}`,
      description: description.trim(),
      why: why.trim(),
      firstStep: firstStep.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setDreams((prev) => [item, ...prev])
    setDescription('')
    setWhy('')
    setFirstStep('')
  }

  const stats = {
    total: dreams.length,
    withStep: dreams.filter(d => d.firstStep).length,
    thisMonth: dreams.filter(d => {
      const date = new Date(d.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '梦想总数', value: stats.total, icon: '🌊' },
          { label: '有第一步', value: stats.withStep, icon: '👟' },
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
          🌊 梦想蓝图
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          描绘你的梦想，找到它的意义，迈出第一步
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="你的梦想是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="为什么这个梦想对你很重要？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={firstStep}
          onChange={(e) => setFirstStep(e.target.value)}
          placeholder="实现梦想的第一步是什么？"
          style={inputStyle}
        />

        <button
          onClick={addDream}
          disabled={!description.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e0ff', fontSize: 12, letterSpacing: 3,
            cursor: description.trim() ? 'pointer' : 'not-allowed',
            opacity: description.trim() ? 1 : 0.5,
          }}
        >
          🌊 种下梦想
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的梦想</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dreams.slice(0, 5).map((d) => (
            <div key={d.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🌊 {d.description}
              </div>
              {d.why && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  💭 {d.why}
                </div>
              )}
              {d.firstStep && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  👟 第一步：{d.firstStep}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{d.createdAt}</div>
            </div>
          ))}
          {dreams.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌊 还没有梦想
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionModule({ actions, setActions }: {
  actions: ActionWave[]
  setActions: (fn: (prev: ActionWave[]) => ActionWave[]) => void
}) {
  const [content, setContent] = useState('')
  const [connection, setConnection] = useState('')
  const [feeling, setFeeling] = useState('')

  const addAction = () => {
    if (!content.trim()) return
    const item: ActionWave = {
      id: `${Date.now()}`,
      content: content.trim(),
      connection: connection.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setActions((prev) => [item, ...prev])
    setContent('')
    setConnection('')
    setFeeling('')
  }

  const stats = {
    total: actions.length,
    withConnection: actions.filter(a => a.connection).length,
    withFeeling: actions.filter(a => a.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '行动总数', value: stats.total, icon: '🌊' },
          { label: '关联梦想', value: stats.withConnection, icon: '🔗' },
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
          🌊 行动海浪
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录每一个朝向梦想的行动
        </div>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="你做了什么行动？"
          style={inputStyle}
        />
        <textarea
          value={connection}
          onChange={(e) => setConnection(e.target.value)}
          placeholder="这个行动和你的梦想有什么关联？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="行动后的感受如何？"
          style={inputStyle}
        />

        <button
          onClick={addAction}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e0ff', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🌊 记录行动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {actions.slice(0, 5).map((a) => (
            <div key={a.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🌊 {a.content}
              </div>
              {a.connection && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  🔗 {a.connection}
                </div>
              )}
              {a.feeling && (
                <div style={{ fontSize: 11, color: '#f0b0d0', marginBottom: 8 }}>
                  💭 {a.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{a.createdAt}</div>
            </div>
          ))}
          {actions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌊 还没有行动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ImagineModule({ imagines, setImagines }: {
  imagines: Imagine[]
  setImagines: (fn: (prev: Imagine[]) => Imagine[]) => void
}) {
  const [content, setContent] = useState('')
  const [feeling, setFeeling] = useState('')
  const [acted, setActed] = useState(false)

  const addImagine = () => {
    if (!content.trim()) return
    const item: Imagine = {
      id: `${Date.now()}`,
      content: content.trim(),
      feeling: feeling.trim(),
      acted,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setImagines((prev) => [item, ...prev])
    setContent('')
    setFeeling('')
    setActed(false)
  }

  const toggleActed = (id: string) => {
    setImagines((prev) => prev.map(i => i.id === id ? { ...i, acted: !i.acted } : i))
  }

  const stats = {
    total: imagines.length,
    acted: imagines.filter(i => i.acted).length,
    withFeeling: imagines.filter(i => i.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '想象总数', value: stats.total, icon: '🎨' },
          { label: '已采取行动', value: stats.acted, icon: '✅' },
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
          🎨 想象力训练
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          让想象力飞翔，然后看看它能否落地
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="你想象到了什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="想象时的感受是怎样的？"
          style={inputStyle}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={acted}
            onChange={(e) => setActed(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>是否已经采取了行动？</span>
        </div>

        <button
          onClick={addImagine}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e0ff', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🎨 记录想象
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的想象</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {imagines.slice(0, 5).map((i) => (
            <div key={i.id} style={{
              padding: 14, borderRadius: 12,
              background: i.acted ? 'rgba(160, 216, 255, 0.08)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${i.acted ? 'rgba(160, 216, 255, 0.3)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR }}>
                  🎨 {i.content}
                </span>
                <button
                  onClick={() => toggleActed(i.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10,
                    background: i.acted ? 'rgba(160, 216, 255, 0.2)' : `${PRIMARY_COLOR}15`,
                    border: `1px solid ${i.acted ? 'rgba(160, 216, 255, 0.4)' : PRIMARY_COLOR + '30'}`,
                    color: PRIMARY_COLOR, cursor: 'pointer',
                  }}
                >
                  {i.acted ? '✅ 已行动' : '⏳ 待行动'}
                </button>
              </div>
              {i.feeling && (
                <div style={{ fontSize: 11, color: '#f0b0d0', marginBottom: 8 }}>
                  💭 {i.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{i.createdAt}</div>
            </div>
          ))}
          {imagines.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎨 还没有想象
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VisionModule({ visions, setVisions }: {
  visions: VisionAction[]
  setVisions: (fn: (prev: VisionAction[]) => VisionAction[]) => void
}) {
  const [vision, setVision] = useState('')
  const [action, setAction] = useState('')
  const [progress, setProgress] = useState('')

  const addVision = () => {
    if (!vision.trim()) return
    const item: VisionAction = {
      id: `${Date.now()}`,
      vision: vision.trim(),
      action: action.trim(),
      progress: progress.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setVisions((prev) => [item, ...prev])
    setVision('')
    setAction('')
    setProgress('')
  }

  const stats = {
    total: visions.length,
    withAction: visions.filter(v => v.action).length,
    withProgress: visions.filter(v => v.progress).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '愿景总数', value: stats.total, icon: '🌈' },
          { label: '有行动', value: stats.withAction, icon: '🎯' },
          { label: '有进展', value: stats.withProgress, icon: '📈' },
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
          🌈 愿景行动
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          描绘愿景，制定行动，记录进展
        </div>

        <textarea
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="你的愿景是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="为了实现愿景，你将采取什么行动？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          placeholder="目前的进展如何？"
          style={inputStyle}
        />

        <button
          onClick={addVision}
          disabled={!vision.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e0ff', fontSize: 12, letterSpacing: 3,
            cursor: vision.trim() ? 'pointer' : 'not-allowed',
            opacity: vision.trim() ? 1 : 0.5,
          }}
        >
          🌈 记录愿景
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的愿景</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visions.slice(0, 5).map((v) => (
            <div key={v.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🌈 {v.vision}
              </div>
              {v.action && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  🎯 {v.action}
                </div>
              )}
              {v.progress && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  📈 进展：{v.progress}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{v.createdAt}</div>
            </div>
          ))}
          {visions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌈 还没有愿景
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#90a0ff'
const SECONDARY_COLOR = '#8090f0'

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
  color: '#d0e0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0e0ff', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const TAB_LIST = [
  { id: 'dream', name: '梦想蓝图', icon: '🌊' },
  { id: 'action', name: '行动海浪', icon: '🌊' },
  { id: 'imagine', name: '想象力训练', icon: '🎨' },
  { id: 'vision', name: '愿景行动', icon: '🌈' },
]

export default function MarsNeptunePage() {
  const config = comboConfigs['mars-neptune']
  const [activeTab, setActiveTab] = useState<string>('dream')
  const [dreams, setDreams] = useLocalStorage<Dream[]>('mn2-dreams', [])
  const [actions, setActions] = useLocalStorage<ActionWave[]>('mn2-actions', [])
  const [imagines, setImagines] = useLocalStorage<Imagine[]>('mn2-imagines', [])
  const [visions, setVisions] = useLocalStorage<VisionAction[]>('mn2-visions', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#d0e0ff' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'dream' && <DreamModule dreams={dreams} setDreams={setDreams} />}
        {activeTab === 'action' && <ActionModule actions={actions} setActions={setActions} />}
        {activeTab === 'imagine' && <ImagineModule imagines={imagines} setImagines={setImagines} />}
        {activeTab === 'vision' && <VisionModule visions={visions} setVisions={setVisions} />}
      </div>
    </ComboShell>
  )
}
