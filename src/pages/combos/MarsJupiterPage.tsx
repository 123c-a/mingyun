import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Courage {
  id: string
  challenge: string
  difficulty: string
  result: string
  createdAt: string
}

interface Expand {
  id: string
  goal: string
  area: string
  progress: number
  createdAt: string
}

interface Adventure {
  id: string
  experience: string
  feeling: string
  harvest: string
  createdAt: string
}

interface Confidence {
  id: string
  source: string
  achievement: string
  level: number
  createdAt: string
}

const DIFFICULTY_OPTIONS = ['⭐ 简单', '⭐⭐ 中等', '⭐⭐⭐ 困难', '⭐⭐⭐⭐ 挑战', '⭐⭐⭐⭐⭐ 极限']

function CourageModule({ courages, setCourages }: {
  courages: Courage[]
  setCourages: (fn: (prev: Courage[]) => Courage[]) => void
}) {
  const [challenge, setChallenge] = useState('')
  const [difficulty, setDifficulty] = useState('⭐⭐ 中等')
  const [result, setResult] = useState('')

  const addCourage = () => {
    if (!challenge.trim()) return
    const item: Courage = {
      id: `${Date.now()}`,
      challenge: challenge.trim(),
      difficulty,
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setCourages((prev) => [item, ...prev])
    setChallenge('')
    setDifficulty('⭐⭐ 中等')
    setResult('')
  }

  const stats = {
    total: courages.length,
    withResult: courages.filter(c => c.result).length,
    hardOnes: courages.filter(c => c.difficulty.includes('⭐⭐⭐') || c.difficulty.includes('⭐⭐⭐⭐') || c.difficulty.includes('⭐⭐⭐⭐⭐')).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '勇气挑战', value: stats.total, icon: '🔥' },
          { label: '有结果', value: stats.withResult, icon: '🏆' },
          { label: '高难度', value: stats.hardOnes, icon: '💪' },
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
          🔥 勇气清单
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录每一次鼓起勇气的时刻
        </div>

        <textarea
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="你挑战了什么？"
          style={textAreaStyle}
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={selectStyle}>
          {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addCourage}
          disabled={!challenge.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0e0', fontSize: 12, letterSpacing: 3,
            cursor: challenge.trim() ? 'pointer' : 'not-allowed',
            opacity: challenge.trim() ? 1 : 0.5,
          }}
        >
          🔥 记录勇气
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的勇气挑战</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {courages.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, fontWeight: 500 }}>
                  🔥 {c.challenge}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>
                  {c.difficulty}
                </span>
              </div>
              {c.result && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  🏆 结果：{c.result}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{c.createdAt}</div>
            </div>
          ))}
          {courages.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔥 还没有勇气记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExpandModule({ expands, setExpands }: {
  expands: Expand[]
  setExpands: (fn: (prev: Expand[]) => Expand[]) => void
}) {
  const [goal, setGoal] = useState('')
  const [area, setArea] = useState('')
  const [progress, setProgress] = useState(0)

  const addExpand = () => {
    if (!goal.trim()) return
    const item: Expand = {
      id: `${Date.now()}`,
      goal: goal.trim(),
      area: area.trim(),
      progress,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setExpands((prev) => [item, ...prev])
    setGoal('')
    setArea('')
    setProgress(0)
  }

  const stats = {
    total: expands.length,
    inProgress: expands.filter(e => e.progress > 0 && e.progress < 100).length,
    completed: expands.filter(e => e.progress === 100).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '扩张行动', value: stats.total, icon: '🚀' },
          { label: '进行中', value: stats.inProgress, icon: '⚡' },
          { label: '已完成', value: stats.completed, icon: '🎯' },
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
          🚀 扩张行动
        </div>

        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="你的扩张目标是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="在哪个领域扩张？"
          style={inputStyle}
        />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>进展：{progress}%</div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={addExpand}
          disabled={!goal.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0e0', fontSize: 12, letterSpacing: 3,
            cursor: goal.trim() ? 'pointer' : 'not-allowed',
            opacity: goal.trim() ? 1 : 0.5,
          }}
        >
          🚀 开始扩张
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的扩张行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {expands.slice(0, 5).map((e) => (
            <div key={e.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 6, fontWeight: 500 }}>
                🚀 {e.goal}
              </div>
              {e.area && (
                <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
                  📍 领域：{e.area}
                </div>
              )}
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                  <span>进展</span>
                  <span>{e.progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${e.progress}%`, background: PRIMARY_COLOR, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{e.createdAt}</div>
            </div>
          ))}
          {expands.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🚀 还没有扩张行动
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdventureModule({ adventures, setAdventures }: {
  adventures: Adventure[]
  setAdventures: (fn: (prev: Adventure[]) => Adventure[]) => void
}) {
  const [experience, setExperience] = useState('')
  const [feeling, setFeeling] = useState('')
  const [harvest, setHarvest] = useState('')

  const addAdventure = () => {
    if (!experience.trim()) return
    const item: Adventure = {
      id: `${Date.now()}`,
      experience: experience.trim(),
      feeling: feeling.trim(),
      harvest: harvest.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setAdventures((prev) => [item, ...prev])
    setExperience('')
    setFeeling('')
    setHarvest('')
  }

  const stats = {
    total: adventures.length,
    withFeeling: adventures.filter(a => a.feeling).length,
    withHarvest: adventures.filter(a => a.harvest).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '冒险经历', value: stats.total, icon: '🗺️' },
          { label: '有感受', value: stats.withFeeling, icon: '💭' },
          { label: '有收获', value: stats.withHarvest, icon: '💎' },
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
          🗺️ 冒险记录
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          人生就是一场冒险
        </div>

        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="你的冒险经历是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="过程中的感受"
          style={textAreaStyle}
        />
        <textarea
          value={harvest}
          onChange={(e) => setHarvest(e.target.value)}
          placeholder="你收获了什么？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addAdventure}
          disabled={!experience.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0e0', fontSize: 12, letterSpacing: 3,
            cursor: experience.trim() ? 'pointer' : 'not-allowed',
            opacity: experience.trim() ? 1 : 0.5,
          }}
        >
          🗺️ 记录冒险
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的冒险</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {adventures.slice(0, 5).map((a) => (
            <div key={a.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8, fontWeight: 500 }}>
                🗺️ {a.experience}
              </div>
              {a.feeling && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  💭 感受：{a.feeling}
                </div>
              )}
              {a.harvest && (
                <div style={{ fontSize: 12, color: '#ffd080', marginBottom: 6 }}>
                  💎 收获：{a.harvest}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{a.createdAt}</div>
            </div>
          ))}
          {adventures.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🗺️ 还没有冒险记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ConfidenceModule({ confidences, setConfidences }: {
  confidences: Confidence[]
  setConfidences: (fn: (prev: Confidence[]) => Confidence[]) => void
}) {
  const [source, setSource] = useState('')
  const [achievement, setAchievement] = useState('')
  const [level, setLevel] = useState(50)

  const addConfidence = () => {
    if (!source.trim()) return
    const item: Confidence = {
      id: `${Date.now()}`,
      source: source.trim(),
      achievement: achievement.trim(),
      level,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setConfidences((prev) => [item, ...prev])
    setSource('')
    setAchievement('')
    setLevel(50)
  }

  const stats = {
    total: confidences.length,
    withAchievement: confidences.filter(c => c.achievement).length,
    averageLevel: confidences.length > 0 ? Math.round(confidences.reduce((sum, c) => sum + c.level, 0) / confidences.length) : 0,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '信心来源', value: stats.total, icon: '💪' },
          { label: '有成就', value: stats.withAchievement, icon: '🏆' },
          { label: '平均水平', value: stats.averageLevel, icon: '📊' },
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
          💪 信心账户
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          存储每一份信心
        </div>

        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="这份信心来自哪里？"
          style={inputStyle}
        />
        <textarea
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
          placeholder="具体的成就/事件"
          style={textAreaStyle}
        />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>信心水平：{level}%</div>
          <input
            type="range"
            min="0"
            max="100"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={addConfidence}
          disabled={!source.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0e0', fontSize: 12, letterSpacing: 3,
            cursor: source.trim() ? 'pointer' : 'not-allowed',
            opacity: source.trim() ? 1 : 0.5,
          }}
        >
          💪 存入信心
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>信心账户记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {confidences.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 6, fontWeight: 500 }}>
                💪 {c.source}
              </div>
              {c.achievement && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  🏆 {c.achievement}
                </div>
              )}
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                  <span>信心水平</span>
                  <span>{c.level}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.level}%`, background: PRIMARY_COLOR, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{c.createdAt}</div>
            </div>
          ))}
          {confidences.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💪 还没有信心记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#ffb080'
const SECONDARY_COLOR = '#ff9060'

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
  color: '#fff0e0', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#fff0e0', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#fff0e0', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'courage', name: '勇气清单', icon: '🔥' },
  { id: 'expand', name: '扩张行动', icon: '🚀' },
  { id: 'adventure', name: '冒险记录', icon: '🗺️' },
  { id: 'confidence', name: '信心账户', icon: '💪' },
]

export default function MarsJupiterPage() {
  const config = comboConfigs['mars-jupiter']
  const [activeTab, setActiveTab] = useState<string>('courage')
  const [courages, setCourages] = useLocalStorage<Courage[]>('mj-courages', [])
  const [expands, setExpands] = useLocalStorage<Expand[]>('mj-expands', [])
  const [adventures, setAdventures] = useLocalStorage<Adventure[]>('mj-adventures', [])
  const [confidences, setConfidences] = useLocalStorage<Confidence[]>('mj-confidences', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#fff0e0' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'courage' && <CourageModule courages={courages} setCourages={setCourages} />}
        {activeTab === 'expand' && <ExpandModule expands={expands} setExpands={setExpands} />}
        {activeTab === 'adventure' && <AdventureModule adventures={adventures} setAdventures={setAdventures} />}
        {activeTab === 'confidence' && <ConfidenceModule confidences={confidences} setConfidences={setConfidences} />}
      </div>
    </ComboShell>
  )
}
