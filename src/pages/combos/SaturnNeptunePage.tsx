import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Blueprint {
  id: string
  dream: string
  plan: string
  progress: string
  createdAt: string
}

interface Boundary {
  id: string
  boundary: string
  connection: string
  effect: string
  createdAt: string
}

interface TimeDream {
  id: string
  dream: string
  timeInvested: string
  milestone: string
  createdAt: string
}

interface Ritual {
  id: string
  ritual: string
  frequency: string
  effect: string
  createdAt: string
}

const FREQUENCY_OPTIONS = ['每天', '每周', '每两周', '每月', '不定期']

function BlueprintModule({ blueprints, setBlueprints }: {
  blueprints: Blueprint[]
  setBlueprints: (fn: (prev: Blueprint[]) => Blueprint[]) => void
}) {
  const [dream, setDream] = useState('')
  const [plan, setPlan] = useState('')
  const [progress, setProgress] = useState('')

  const addBlueprint = () => {
    if (!dream.trim()) return
    const item: Blueprint = {
      id: `${Date.now()}`,
      dream: dream.trim(),
      plan: plan.trim(),
      progress: progress.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setBlueprints((prev) => [item, ...prev])
    setDream('')
    setPlan('')
    setProgress('')
  }

  const stats = {
    total: blueprints.length,
    withPlan: blueprints.filter(b => b.plan).length,
    withProgress: blueprints.filter(b => b.progress).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '梦想蓝图', value: stats.total, icon: '📐' },
          { label: '有计划', value: stats.withPlan, icon: '📋' },
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
          📐 梦的蓝图
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          将梦想转化为现实的蓝图
        </div>

        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="你的梦想是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="你的现实计划是什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          placeholder="目前的进度如何？"
          style={inputStyle}
        />

        <button
          onClick={addBlueprint}
          disabled={!dream.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: dream.trim() ? 'pointer' : 'not-allowed',
            opacity: dream.trim() ? 1 : 0.5,
          }}
        >
          📐 绘制蓝图
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的蓝图</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {blueprints.slice(0, 5).map((b) => (
            <div key={b.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                📐 {b.dream}
              </div>
              {b.plan && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  📋 {b.plan}
                </div>
              )}
              {b.progress && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  📈 进度：{b.progress}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{b.createdAt}</div>
            </div>
          ))}
          {blueprints.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📐 还没有蓝图
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BoundaryModule({ boundaries, setBoundaries }: {
  boundaries: Boundary[]
  setBoundaries: (fn: (prev: Boundary[]) => Boundary[]) => void
}) {
  const [boundary, setBoundary] = useState('')
  const [connection, setConnection] = useState('')
  const [effect, setEffect] = useState('')

  const addBoundary = () => {
    if (!boundary.trim()) return
    const item: Boundary = {
      id: `${Date.now()}`,
      boundary: boundary.trim(),
      connection: connection.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setBoundaries((prev) => [item, ...prev])
    setBoundary('')
    setConnection('')
    setEffect('')
  }

  const stats = {
    total: boundaries.length,
    withConnection: boundaries.filter(b => b.connection).length,
    withEffect: boundaries.filter(b => b.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '界限总数', value: stats.total, icon: '🛡️' },
          { label: '关联梦想', value: stats.withConnection, icon: '🔗' },
          { label: '有效果', value: stats.withEffect, icon: '✨' },
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
          🛡️ 界限与梦想
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          设立健康的界限，守护你的梦想
        </div>

        <textarea
          value={boundary}
          onChange={(e) => setBoundary(e.target.value)}
          placeholder="你设立了什么界限？"
          style={textAreaStyle}
        />
        <textarea
          value={connection}
          onChange={(e) => setConnection(e.target.value)}
          placeholder="这个界限和你的梦想有什么关系？"
          style={textAreaStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addBoundary}
          disabled={!boundary.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: boundary.trim() ? 'pointer' : 'not-allowed',
            opacity: boundary.trim() ? 1 : 0.5,
          }}
        >
          🛡️ 设立界限
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的界限</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {boundaries.slice(0, 5).map((b) => (
            <div key={b.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🛡️ {b.boundary}
              </div>
              {b.connection && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  🔗 {b.connection}
                </div>
              )}
              {b.effect && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  ✨ 效果：{b.effect}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{b.createdAt}</div>
            </div>
          ))}
          {boundaries.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🛡️ 还没有界限
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TimeDreamModule({ timeDreams, setTimeDreams }: {
  timeDreams: TimeDream[]
  setTimeDreams: (fn: (prev: TimeDream[]) => TimeDream[]) => void
}) {
  const [dream, setDream] = useState('')
  const [timeInvested, setTimeInvested] = useState('')
  const [milestone, setMilestone] = useState('')

  const addTimeDream = () => {
    if (!dream.trim()) return
    const item: TimeDream = {
      id: `${Date.now()}`,
      dream: dream.trim(),
      timeInvested: timeInvested.trim(),
      milestone: milestone.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setTimeDreams((prev) => [item, ...prev])
    setDream('')
    setTimeInvested('')
    setMilestone('')
  }

  const stats = {
    total: timeDreams.length,
    withTime: timeDreams.filter(t => t.timeInvested).length,
    withMilestone: timeDreams.filter(t => t.milestone).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '长期梦想', value: stats.total, icon: '⏳' },
          { label: '已投入时间', value: stats.withTime, icon: '⌛' },
          { label: '有里程碑', value: stats.withMilestone, icon: '🏁' },
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
          ⏳ 时间之梦
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录你的长期梦想和时间投入
        </div>

        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="你的长期梦想是什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={timeInvested}
          onChange={(e) => setTimeInvested(e.target.value)}
          placeholder="已经投入了多少时间？"
          style={inputStyle}
        />
        <input
          type="text"
          value={milestone}
          onChange={(e) => setMilestone(e.target.value)}
          placeholder="下一个里程碑是什么？"
          style={inputStyle}
        />

        <button
          onClick={addTimeDream}
          disabled={!dream.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: dream.trim() ? 'pointer' : 'not-allowed',
            opacity: dream.trim() ? 1 : 0.5,
          }}
        >
          ⏳ 记录梦想
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>时间之梦</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {timeDreams.slice(0, 5).map((t) => (
            <div key={t.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                ⏳ {t.dream}
              </div>
              {t.timeInvested && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  ⌛ 已投入：{t.timeInvested}
                </div>
              )}
              {t.milestone && (
                <div style={{ fontSize: 11, color: '#f0d080', marginBottom: 8 }}>
                  🏁 里程碑：{t.milestone}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{t.createdAt}</div>
            </div>
          ))}
          {timeDreams.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⏳ 还没有梦想
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RitualModule({ rituals, setRituals }: {
  rituals: Ritual[]
  setRituals: (fn: (prev: Ritual[]) => Ritual[]) => void
}) {
  const [ritual, setRitual] = useState('')
  const [frequency, setFrequency] = useState('每天')
  const [effect, setEffect] = useState('')

  const addRitual = () => {
    if (!ritual.trim()) return
    const item: Ritual = {
      id: `${Date.now()}`,
      ritual: ritual.trim(),
      frequency,
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRituals((prev) => [item, ...prev])
    setRitual('')
    setFrequency('每天')
    setEffect('')
  }

  const stats = {
    total: rituals.length,
    daily: rituals.filter(r => r.frequency === '每天').length,
    withEffect: rituals.filter(r => r.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '仪式总数', value: stats.total, icon: '🌱' },
          { label: '每日仪式', value: stats.daily, icon: '☀️' },
          { label: '有效果', value: stats.withEffect, icon: '✨' },
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
          🌱 落地仪式
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          建立让梦想落地的日常仪式
        </div>

        <textarea
          value={ritual}
          onChange={(e) => setRitual(e.target.value)}
          placeholder="你的仪式是什么？"
          style={textAreaStyle}
        />
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={selectStyle}>
          {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addRitual}
          disabled={!ritual.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: ritual.trim() ? 'pointer' : 'not-allowed',
            opacity: ritual.trim() ? 1 : 0.5,
          }}
        >
          🌱 建立仪式
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的仪式</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rituals.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR }}>
                  🌱 {r.ritual}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>
                  {r.frequency}
                </span>
              </div>
              {r.effect && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  ✨ 效果：{r.effect}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {rituals.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌱 还没有仪式
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#a0a8c8'
const SECONDARY_COLOR = '#8890b0'

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
  color: '#d8dce8', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d8dce8', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d8dce8', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'blueprint', name: '梦的蓝图', icon: '📐' },
  { id: 'boundary', name: '界限与梦想', icon: '🛡️' },
  { id: 'timedream', name: '时间之梦', icon: '⏳' },
  { id: 'ritual', name: '落地仪式', icon: '🌱' },
]

export default function SaturnNeptunePage() {
  const config = comboConfigs['saturn-neptune']
  const [activeTab, setActiveTab] = useState<string>('blueprint')
  const [blueprints, setBlueprints] = useLocalStorage<Blueprint[]>('sn-blueprints', [])
  const [boundaries, setBoundaries] = useLocalStorage<Boundary[]>('sn-boundaries', [])
  const [timeDreams, setTimeDreams] = useLocalStorage<TimeDream[]>('sn-timedreams', [])
  const [rituals, setRituals] = useLocalStorage<Ritual[]>('sn-rituals', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#d8dce8' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'blueprint' && <BlueprintModule blueprints={blueprints} setBlueprints={setBlueprints} />}
        {activeTab === 'boundary' && <BoundaryModule boundaries={boundaries} setBoundaries={setBoundaries} />}
        {activeTab === 'timedream' && <TimeDreamModule timeDreams={timeDreams} setTimeDreams={setTimeDreams} />}
        {activeTab === 'ritual' && <RitualModule rituals={rituals} setRituals={setRituals} />}
      </div>
    </ComboShell>
  )
}
