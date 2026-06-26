import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Anchor {
  id: string
  content: string
  source: string
  effect: string
  createdAt: string
}

interface Duty {
  id: string
  content: string
  completed: boolean
  feeling: string
  createdAt: string
}

interface Calibrate {
  id: string
  gap: string
  plan: string
  progress: number
  createdAt: string
}

interface Patience {
  id: string
  content: string
  waitTime: string
  harvest: string
  createdAt: string
}

function AnchorModule({ anchors, setAnchors }: {
  anchors: Anchor[]
  setAnchors: (fn: (prev: Anchor[]) => Anchor[]) => void
}) {
  const [content, setContent] = useState('')
  const [source, setSource] = useState('')
  const [effect, setEffect] = useState('')

  const addAnchor = () => {
    if (!content.trim()) return
    const item: Anchor = {
      id: `${Date.now()}`,
      content: content.trim(),
      source: source.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setAnchors((prev) => [item, ...prev])
    setContent('')
    setSource('')
    setEffect('')
  }

  const stats = {
    total: anchors.length,
    withSource: anchors.filter(a => a.source).length,
    withEffect: anchors.filter(a => a.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '稳定基石', value: stats.total, icon: '🪨' },
          { label: '有来源', value: stats.withSource, icon: '🌱' },
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
          🪨 记录让你稳定的事
        </div>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="什么让你感到稳定？"
          style={inputStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="这份稳定感来自哪里？"
          style={inputStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="它带给你什么效果？"
          style={textAreaStyle}
        />

        <button
          onClick={addAnchor}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5f0e0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🪨 记录基石
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的稳定基石</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {anchors.slice(0, 5).map((a) => (
            <div key={a.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 6, fontWeight: 500 }}>
                🪨 {a.content}
              </div>
              {a.source && (
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                  🌱 来源：{a.source}
                </div>
              )}
              {a.effect && (
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                  ✨ 效果：{a.effect}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{a.createdAt}</div>
            </div>
          ))}
          {anchors.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🪨 还没有稳定基石
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DutyModule({ duties, setDuties }: {
  duties: Duty[]
  setDuties: (fn: (prev: Duty[]) => Duty[]) => void
}) {
  const [content, setContent] = useState('')
  const [feeling, setFeeling] = useState('')

  const addDuty = () => {
    if (!content.trim()) return
    const item: Duty = {
      id: `${Date.now()}`,
      content: content.trim(),
      completed: false,
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setDuties((prev) => [item, ...prev])
    setContent('')
    setFeeling('')
  }

  const toggleCompleted = (id: string) => {
    setDuties((prev) => prev.map(d => d.id === id ? { ...d, completed: !d.completed } : d))
  }

  const stats = {
    total: duties.length,
    completed: duties.filter(d => d.completed).length,
    pending: duties.filter(d => !d.completed).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '责任总数', value: stats.total, icon: '📋' },
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
          📋 添加责任清单
        </div>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="你的责任是什么？"
          style={inputStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="完成后的感受/期待"
          style={textAreaStyle}
        />

        <button
          onClick={addDuty}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5f0e0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          📋 添加责任
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的责任</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {duties.slice(0, 5).map((d) => (
            <div key={d.id} style={{
              padding: 14, borderRadius: 12,
              background: d.completed ? 'rgba(200, 192, 160, 0.12)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${d.completed ? 'rgba(200, 192, 160, 0.4)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, textDecoration: d.completed ? 'line-through' : 'none', opacity: d.completed ? 0.6 : 1 }}>
                  📋 {d.content}
                </span>
                <button
                  onClick={() => toggleCompleted(d.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10,
                    background: d.completed ? 'rgba(200, 192, 160, 0.25)' : `${PRIMARY_COLOR}15`,
                    border: `1px solid ${d.completed ? 'rgba(200, 192, 160, 0.5)' : PRIMARY_COLOR + '30'}`,
                    color: PRIMARY_COLOR, cursor: 'pointer',
                  }}
                >
                  {d.completed ? '✅ 已完成' : '⏳ 进行中'}
                </button>
              </div>
              {d.feeling && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  💭 {d.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{d.createdAt}</div>
            </div>
          ))}
          {duties.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📋 还没有责任记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CalibrateModule({ calibrates, setCalibrates }: {
  calibrates: Calibrate[]
  setCalibrates: (fn: (prev: Calibrate[]) => Calibrate[]) => void
}) {
  const [gap, setGap] = useState('')
  const [plan, setPlan] = useState('')
  const [progress, setProgress] = useState(0)

  const addCalibrate = () => {
    if (!gap.trim()) return
    const item: Calibrate = {
      id: `${Date.now()}`,
      gap: gap.trim(),
      plan: plan.trim(),
      progress: progress,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setCalibrates((prev) => [item, ...prev])
    setGap('')
    setPlan('')
    setProgress(0)
  }

  const stats = {
    total: calibrates.length,
    inProgress: calibrates.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: calibrates.filter(c => c.progress === 100).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '校准项目', value: stats.total, icon: '🎯' },
          { label: '进行中', value: stats.inProgress, icon: '⚙️' },
          { label: '已完成', value: stats.completed, icon: '🏆' },
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
          🎯 现实校准
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          看清理想与现实的差距，制定调整方案
        </div>

        <textarea
          value={gap}
          onChange={(e) => setGap(e.target.value)}
          placeholder="理想与现实的差距是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="你的调整方案是什么？"
          style={textAreaStyle}
        />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>进度：{progress}%</div>
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
          onClick={addCalibrate}
          disabled={!gap.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5f0e0', fontSize: 12, letterSpacing: 3,
            cursor: gap.trim() ? 'pointer' : 'not-allowed',
            opacity: gap.trim() ? 1 : 0.5,
          }}
        >
          🎯 记录校准
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的校准</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {calibrates.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🎯 {c.gap}
              </div>
              {c.plan && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  📋 {c.plan}
                </div>
              )}
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                  <span>进度</span>
                  <span>{c.progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: PRIMARY_COLOR, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{c.createdAt}</div>
            </div>
          ))}
          {calibrates.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎯 还没有校准记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PatienceModule({ patiences, setPatiences }: {
  patiences: Patience[]
  setPatiences: (fn: (prev: Patience[]) => Patience[]) => void
}) {
  const [content, setContent] = useState('')
  const [waitTime, setWaitTime] = useState('')
  const [harvest, setHarvest] = useState('')

  const addPatience = () => {
    if (!content.trim()) return
    const item: Patience = {
      id: `${Date.now()}`,
      content: content.trim(),
      waitTime: waitTime.trim(),
      harvest: harvest.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setPatiences((prev) => [item, ...prev])
    setContent('')
    setWaitTime('')
    setHarvest('')
  }

  const stats = {
    total: patiences.length,
    withHarvest: patiences.filter(p => p.harvest).length,
    waiting: patiences.filter(p => !p.harvest).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '耐心事项', value: stats.total, icon: '⏰' },
          { label: '已有收获', value: stats.withHarvest, icon: '🌾' },
          { label: '等待中', value: stats.waiting, icon: '⏳' },
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
          ⏰ 时间沉淀
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录需要耐心等待的事
        </div>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="需要耐心的事是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={waitTime}
          onChange={(e) => setWaitTime(e.target.value)}
          placeholder="已经等待了多久？"
          style={inputStyle}
        />
        <textarea
          value={harvest}
          onChange={(e) => setHarvest(e.target.value)}
          placeholder="已经收获了什么？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addPatience}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5f0e0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          ⏰ 记录耐心
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的耐心沉淀</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {patiences.slice(0, 5).map((p) => (
            <div key={p.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 6 }}>
                ⏰ {p.content}
              </div>
              {p.waitTime && (
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                  ⌛ 已等待：{p.waitTime}
                </div>
              )}
              {p.harvest && (
                <div style={{ fontSize: 12, color: '#a0d0a0', marginBottom: 4 }}>
                  🌾 收获：{p.harvest}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{p.createdAt}</div>
            </div>
          ))}
          {patiences.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⏰ 还没有耐心记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#c8c0a0'
const SECONDARY_COLOR = '#b0a888'

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
  color: '#f5f0e0', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#f5f0e0', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const TAB_LIST = [
  { id: 'anchor', name: '稳定基石', icon: '🪨' },
  { id: 'duty', name: '责任清单', icon: '📋' },
  { id: 'calibrate', name: '现实校准', icon: '🎯' },
  { id: 'patience', name: '时间沉淀', icon: '⏰' },
]

export default function EarthSaturnPage() {
  const config = comboConfigs['earth-saturn']
  const [activeTab, setActiveTab] = useState<string>('anchor')
  const [anchors, setAnchors] = useLocalStorage<Anchor[]>('es-anchors', [])
  const [duties, setDuties] = useLocalStorage<Duty[]>('es-duties', [])
  const [calibrates, setCalibrates] = useLocalStorage<Calibrate[]>('es-calibrates', [])
  const [patiences, setPatiences] = useLocalStorage<Patience[]>('es-patiences', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#f5f0e0' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'anchor' && <AnchorModule anchors={anchors} setAnchors={setAnchors} />}
        {activeTab === 'duty' && <DutyModule duties={duties} setDuties={setDuties} />}
        {activeTab === 'calibrate' && <CalibrateModule calibrates={calibrates} setCalibrates={setCalibrates} />}
        {activeTab === 'patience' && <PatienceModule patiences={patiences} setPatiences={setPatiences} />}
      </div>
    </ComboShell>
  )
}
