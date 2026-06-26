import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Seed {
  id: string
  dream: string
  seeds: string
  sprout: string
  createdAt: string
}

interface Step {
  id: string
  step: string
  completed: boolean
  feeling: string
  createdAt: string
}

interface Intuition {
  id: string
  hint: string
  followed: boolean
  result: string
  createdAt: string
}

interface Manifest {
  id: string
  goal: string
  evidence: string
  feeling: string
  createdAt: string
}

function SeedModule({ seeds, setSeeds }: {
  seeds: Seed[]
  setSeeds: (fn: (prev: Seed[]) => Seed[]) => void
}) {
  const [dream, setDream] = useState('')
  const [seedsText, setSeedsText] = useState('')
  const [sprout, setSprout] = useState('')

  const addSeed = () => {
    if (!dream.trim()) return
    const item: Seed = {
      id: `${Date.now()}`,
      dream: dream.trim(),
      seeds: seedsText.trim(),
      sprout: sprout.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setSeeds((prev) => [item, ...prev])
    setDream('')
    setSeedsText('')
    setSprout('')
  }

  const stats = {
    total: seeds.length,
    withSeeds: seeds.filter(s => s.seeds).length,
    withSprout: seeds.filter(s => s.sprout).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '梦想种子', value: stats.total, icon: '🌱' },
          { label: '已播种', value: stats.withSeeds, icon: '🌿' },
          { label: '已发芽', value: stats.withSprout, icon: '🌾' },
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
          🌱 梦的种子
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          在心中播下梦想的种子
        </div>

        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="你的梦想是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={seedsText}
          onChange={(e) => setSeedsText(e.target.value)}
          placeholder="你已经播下了哪些小行动的种子？"
          style={textAreaStyle}
        />
        <textarea
          value={sprout}
          onChange={(e) => setSprout(e.target.value)}
          placeholder="有哪些发芽的迹象？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addSeed}
          disabled={!dream.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: dream.trim() ? 'pointer' : 'not-allowed',
            opacity: dream.trim() ? 1 : 0.5,
          }}
        >
          🌱 播下种子
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的梦想种子</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {seeds.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8, fontWeight: 500 }}>
                🌱 {s.dream}
              </div>
              {s.seeds && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  🌿 种子：{s.seeds}
                </div>
              )}
              {s.sprout && (
                <div style={{ fontSize: 12, color: '#a0f0c0', marginBottom: 6 }}>
                  🌾 发芽：{s.sprout}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{s.createdAt}</div>
            </div>
          ))}
          {seeds.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌱 还没有梦想种子
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepsModule({ steps, setSteps }: {
  steps: Step[]
  setSteps: (fn: (prev: Step[]) => Step[]) => void
}) {
  const [step, setStep] = useState('')
  const [feeling, setFeeling] = useState('')

  const addStep = () => {
    if (!step.trim()) return
    const item: Step = {
      id: `${Date.now()}`,
      step: step.trim(),
      completed: false,
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setSteps((prev) => [item, ...prev])
    setStep('')
    setFeeling('')
  }

  const toggleCompleted = (id: string) => {
    setSteps((prev) => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  const stats = {
    total: steps.length,
    completed: steps.filter(s => s.completed).length,
    pending: steps.filter(s => !s.completed).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '现实步骤', value: stats.total, icon: '👣' },
          { label: '已完成', value: stats.completed, icon: '✅' },
          { label: '待完成', value: stats.pending, icon: '⏳' },
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
          👣 现实化步骤
        </div>

        <textarea
          value={step}
          onChange={(e) => setStep(e.target.value)}
          placeholder="这一步要做什么？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="完成后的感受/期待"
          style={textAreaStyle}
        />

        <button
          onClick={addStep}
          disabled={!step.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: step.trim() ? 'pointer' : 'not-allowed',
            opacity: step.trim() ? 1 : 0.5,
          }}
        >
          👣 添加步骤
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的步骤</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {steps.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: s.completed ? 'rgba(112, 200, 216, 0.12)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${s.completed ? 'rgba(112, 200, 216, 0.4)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, textDecoration: s.completed ? 'line-through' : 'none', opacity: s.completed ? 0.6 : 1 }}>
                  👣 {s.step}
                </span>
                <button
                  onClick={() => toggleCompleted(s.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10,
                    background: s.completed ? 'rgba(112, 200, 216, 0.25)' : `${PRIMARY_COLOR}15`,
                    border: `1px solid ${s.completed ? 'rgba(112, 200, 216, 0.5)' : PRIMARY_COLOR + '30'}`,
                    color: PRIMARY_COLOR, cursor: 'pointer',
                  }}
                >
                  {s.completed ? '✅ 已完成' : '⏳ 进行中'}
                </button>
              </div>
              {s.feeling && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  💭 {s.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{s.createdAt}</div>
            </div>
          ))}
          {steps.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              👣 还没有步骤记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function IntuitionModule({ intuitions, setIntuitions }: {
  intuitions: Intuition[]
  setIntuitions: (fn: (prev: Intuition[]) => Intuition[]) => void
}) {
  const [hint, setHint] = useState('')
  const [followed, setFollowed] = useState(false)
  const [result, setResult] = useState('')

  const addIntuition = () => {
    if (!hint.trim()) return
    const item: Intuition = {
      id: `${Date.now()}`,
      hint: hint.trim(),
      followed,
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setIntuitions((prev) => [item, ...prev])
    setHint('')
    setFollowed(false)
    setResult('')
  }

  const stats = {
    total: intuitions.length,
    followed: intuitions.filter(i => i.followed).length,
    withResult: intuitions.filter(i => i.result).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '直觉提示', value: stats.total, icon: '🧭' },
          { label: '已跟随', value: stats.followed, icon: '👣' },
          { label: '有结果', value: stats.withResult, icon: '🎯' },
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
          🧭 直觉指引
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          聆听内心的声音
        </div>

        <textarea
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="你的直觉给了你什么提示？"
          style={textAreaStyle}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={followed}
            onChange={(e) => setFollowed(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, opacity: 0.8 }}>是否跟随了这个直觉？</span>
        </div>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addIntuition}
          disabled={!hint.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: hint.trim() ? 'pointer' : 'not-allowed',
            opacity: hint.trim() ? 1 : 0.5,
          }}
        >
          🧭 记录直觉
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的直觉指引</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {intuitions.slice(0, 5).map((i) => (
            <div key={i.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, fontWeight: 500 }}>
                  🧭 {i.hint}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: i.followed ? 'rgba(160, 240, 192, 0.2)' : 'rgba(255, 200, 100, 0.2)', color: i.followed ? '#a0f0c0' : '#ffc864' }}>
                  {i.followed ? '👣 已跟随' : '⏳ 待决定'}
                </span>
              </div>
              {i.result && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6 }}>
                  🎯 结果：{i.result}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{i.createdAt}</div>
            </div>
          ))}
          {intuitions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🧭 还没有直觉记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ManifestModule({ manifests, setManifests }: {
  manifests: Manifest[]
  setManifests: (fn: (prev: Manifest[]) => Manifest[]) => void
}) {
  const [goal, setGoal] = useState('')
  const [evidence, setEvidence] = useState('')
  const [feeling, setFeeling] = useState('')

  const addManifest = () => {
    if (!goal.trim()) return
    const item: Manifest = {
      id: `${Date.now()}`,
      goal: goal.trim(),
      evidence: evidence.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setManifests((prev) => [item, ...prev])
    setGoal('')
    setEvidence('')
    setFeeling('')
  }

  const stats = {
    total: manifests.length,
    withEvidence: manifests.filter(m => m.evidence).length,
    withFeeling: manifests.filter(m => m.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '显化目标', value: stats.total, icon: '📓' },
          { label: '有证据', value: stats.withEvidence, icon: '🔍' },
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
          📓 显化日记
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录显化的旅程
        </div>

        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="你想显化什么？"
          style={inputStyle}
        />
        <textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="有哪些显化的证据？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="显化过程中的感受"
          style={textAreaStyle}
        />

        <button
          onClick={addManifest}
          disabled={!goal.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f5ff', fontSize: 12, letterSpacing: 3,
            cursor: goal.trim() ? 'pointer' : 'not-allowed',
            opacity: goal.trim() ? 1 : 0.5,
          }}
        >
          📓 记录显化
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的显化日记</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {manifests.slice(0, 5).map((m) => (
            <div key={m.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8, fontWeight: 500 }}>
                📓 {m.goal}
              </div>
              {m.evidence && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  🔍 证据：{m.evidence}
                </div>
              )}
              {m.feeling && (
                <div style={{ fontSize: 11, opacity: 0.7 }}>
                  💭 感受：{m.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{m.createdAt}</div>
            </div>
          ))}
          {manifests.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📓 还没有显化记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#70c8d8'
const SECONDARY_COLOR = '#60b0c8'

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

const TAB_LIST = [
  { id: 'seed', name: '梦的种子', icon: '🌱' },
  { id: 'steps', name: '现实化步骤', icon: '👣' },
  { id: 'intuition', name: '直觉指引', icon: '🧭' },
  { id: 'manifest', name: '显化日记', icon: '📓' },
]

export default function EarthNeptunePage() {
  const config = comboConfigs['earth-neptune']
  const [activeTab, setActiveTab] = useState<string>('seed')
  const [seeds, setSeeds] = useLocalStorage<Seed[]>('en-seeds', [])
  const [steps, setSteps] = useLocalStorage<Step[]>('en-steps', [])
  const [intuitions, setIntuitions] = useLocalStorage<Intuition[]>('en-intuitions', [])
  const [manifests, setManifests] = useLocalStorage<Manifest[]>('en-manifests', [])

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
        {activeTab === 'seed' && <SeedModule seeds={seeds} setSeeds={setSeeds} />}
        {activeTab === 'steps' && <StepsModule steps={steps} setSteps={setSteps} />}
        {activeTab === 'intuition' && <IntuitionModule intuitions={intuitions} setIntuitions={setIntuitions} />}
        {activeTab === 'manifest' && <ManifestModule manifests={manifests} setManifests={setManifests} />}
      </div>
    </ComboShell>
  )
}
