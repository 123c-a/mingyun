import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Insight {
  id: string
  content: string
  category: string
  source: string
  tags: string[]
  createdAt: string
  followed: boolean
}

interface FlashThought {
  id: string
  thought: string
  connection: string
  createdAt: string
}

interface AhaRecord {
  id: string
  moment: string
  insight: string
  impact: string
  createdAt: string
}

interface Breakthrough {
  id: string
  oldPattern: string
  newPerspective: string
  action: string
  createdAt: string
}

const CATEGORY_OPTIONS = [
  '思维洞见', '创意灵感', '关联发现', '直觉顿悟', '问题解答', '其他'
]

const SOURCE_OPTIONS = [
  '阅读', '对话', '冥想', '散步', '半梦半醒', '突然闪现', '工作', '其他'
]

function InsightCaptureModule({ insights, setInsights }: {
  insights: Insight[]
  setInsights: (fn: (prev: Insight[]) => Insight[]) => void
}) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('思维洞见')
  const [source, setSource] = useState('突然闪现')
  const [tagInput, setTagInput] = useState('')

  const capture = () => {
    if (!content.trim()) return
    const insight: Insight = {
      id: `${Date.now()}`,
      content: content.trim(),
      category,
      source,
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toLocaleDateString('zh-CN'),
      followed: false,
    }
    setInsights((prev) => [insight, ...prev])
    setContent('')
    setTagInput('')
  }

  const toggleFollowed = (id: string) => {
    setInsights((prev) => prev.map(i => i.id === id ? { ...i, followed: !i.followed } : i))
  }

  const stats = {
    total: insights.length,
    followed: insights.filter(i => i.followed).length,
    categories: new Set(insights.map(i => i.category)).size,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '灵感总数', value: stats.total, icon: '💡' },
          { label: '已跟进', value: stats.followed, icon: '✅' },
          { label: '涉及领域', value: stats.categories, icon: '🎯' },
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
          💡 捕捉此刻的洞见
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
            {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="刚才脑子里闪过什么……"
          style={textAreaStyle}
        />

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="标签（用逗号分隔，如：创意,工作,生活）"
          style={inputStyle}
        />

        <button
          onClick={capture}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          ⚡ 闪电记录
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的灵感</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {insights.slice(0, 5).map((i) => (
            <div key={i.id} style={{
              padding: 14, borderRadius: 12,
              background: i.followed ? 'rgba(160, 216, 255, 0.08)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${i.followed ? 'rgba(160, 216, 255, 0.3)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {i.category} · {i.source}
                </span>
                <button
                  onClick={() => toggleFollowed(i.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10,
                    background: i.followed ? 'rgba(160, 216, 255, 0.2)' : `${PRIMARY_COLOR}15`,
                    border: `1px solid ${i.followed ? 'rgba(160, 216, 255, 0.4)' : PRIMARY_COLOR + '30'}`,
                    color: PRIMARY_COLOR, cursor: 'pointer',
                  }}
                >
                  {i.followed ? '✅ 已跟进' : '⏳ 待跟进'}
                </button>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{i.content}</div>
              {i.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {i.tags.map((tag, idx) => (
                    <span key={idx} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}15`, color: PRIMARY_COLOR }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{i.createdAt}</div>
            </div>
          ))}
          {insights.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💡 还没有灵感
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ConnectionModule({ connections, setConnections }: {
  connections: FlashThought[]
  setConnections: (fn: (prev: FlashThought[]) => FlashThought[]) => void
}) {
  const [thought, setThought] = useState('')
  const [connection, setConnection] = useState('')

  const addConnection = () => {
    if (!thought.trim()) return
    const item: FlashThought = {
      id: `${Date.now()}`,
      thought: thought.trim(),
      connection: connection.trim(),
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setConnections((prev) => [item, ...prev])
    setThought('')
    setConnection('')
  }

  const stats = {
    total: connections.length,
    today: connections.filter(c => c.createdAt === new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })).length,
    withConnection: connections.filter(c => c.connection).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '闪现念头', value: stats.total, icon: '⚡' },
          { label: '今日闪现', value: stats.today, icon: '📅' },
          { label: '已建立连接', value: stats.withConnection, icon: '🔗' },
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
          ⚡ 瞬间连接
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记下此刻的念头，然后寻找它与其他事物的关联
        </div>

        <input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="此刻你在想什么？"
          style={inputStyle}
        />
        <textarea
          value={connection}
          onChange={(e) => setConnection(e.target.value)}
          placeholder="它和什么产生了关联？想到了什么？"
          style={{ ...textAreaStyle, minHeight: 80 }}
        />

        <button
          onClick={addConnection}
          disabled={!thought.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: thought.trim() ? 'pointer' : 'not-allowed',
            opacity: thought.trim() ? 1 : 0.5,
          }}
        >
          🔗 建立连接
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的连接</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {connections.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>💭 {c.thought}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{c.createdAt}</span>
              </div>
              {c.connection && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginTop: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  🔗 {c.connection}
                </div>
              )}
            </div>
          ))}
          {connections.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有连接
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AhaModule({ ahas, setAhas }: {
  ahas: AhaRecord[]
  setAhas: (fn: (prev: AhaRecord[]) => AhaRecord[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [insight, setInsight] = useState('')
  const [impact, setImpact] = useState('')

  const addAha = () => {
    if (!moment.trim()) return
    const item: AhaRecord = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      insight: insight.trim(),
      impact: impact.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setAhas((prev) => [item, ...prev])
    setMoment('')
    setInsight('')
    setImpact('')
  }

  const stats = {
    total: ahas.length,
    thisWeek: ahas.filter(a => {
      const date = new Date(a.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '顿悟总数', value: stats.total, icon: '✨' },
          { label: '本周顿悟', value: stats.thisWeek, icon: '📅' },
          { label: '成长记录', value: stats.total, icon: '📈' },
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
          ✨ 记录一个"啊哈"时刻
        </div>

        <input
          type="text"
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="是什么触发了这个顿悟？"
          style={inputStyle}
        />
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="你顿悟到了什么？"
          style={{ ...textAreaStyle, minHeight: 80 }}
        />
        <textarea
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="这个顿悟会带来什么改变？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addAha}
          disabled={!moment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: moment.trim() ? 'pointer' : 'not-allowed',
            opacity: moment.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录顿悟
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>顿悟时刻</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ahas.slice(0, 5).map((a) => (
            <div key={a.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                💡 {a.moment}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 8 }}>
                {a.insight}
              </div>
              {a.impact && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  🌱 {a.impact}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{a.createdAt}</div>
            </div>
          ))}
          {ahas.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ✨ 还没有顿悟
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BreakthroughModule({ breakthroughs, setBreakthroughs }: {
  breakthroughs: Breakthrough[]
  setBreakthroughs: (fn: (prev: Breakthrough[]) => Breakthrough[]) => void
}) {
  const [oldPattern, setOldPattern] = useState('')
  const [newPerspective, setNewPerspective] = useState('')
  const [action, setAction] = useState('')

  const addBreakthrough = () => {
    if (!oldPattern.trim()) return
    const item: Breakthrough = {
      id: `${Date.now()}`,
      oldPattern: oldPattern.trim(),
      newPerspective: newPerspective.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setBreakthroughs((prev) => [item, ...prev])
    setOldPattern('')
    setNewPerspective('')
    setAction('')
  }

  const stats = {
    total: breakthroughs.length,
    thisMonth: breakthroughs.filter(b => {
      const date = new Date(b.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '突破总数', value: stats.total, icon: '🚀' },
          { label: '本月突破', value: stats.thisMonth, icon: '📅' },
          { label: '认知升级', value: stats.total, icon: '🧠' },
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
          🚀 认知突破
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录一次思维模式的转变
        </div>

        <input
          type="text"
          value={oldPattern}
          onChange={(e) => setOldPattern(e.target.value)}
          placeholder="以前我是怎么想的？"
          style={inputStyle}
        />
        <textarea
          value={newPerspective}
          onChange={(e) => setNewPerspective(e.target.value)}
          placeholder="现在我怎么看？"
          style={{ ...textAreaStyle, minHeight: 80 }}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="我将采取什么行动？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addBreakthrough}
          disabled={!oldPattern.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldPattern.trim() ? 'pointer' : 'not-allowed',
            opacity: oldPattern.trim() ? 1 : 0.5,
          }}
        >
          🚀 记录突破
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>突破记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {breakthroughs.slice(0, 5).map((b) => (
            <div key={b.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>
                <span style={{ color: '#ff9090' }}>❌ {b.oldPattern}</span>
              </div>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                <span style={{ color: '#a0f0a0' }}>✅ {b.newPerspective}</span>
              </div>
              {b.action && (
                <div style={{ fontSize: 11, color: '#f0d080', marginBottom: 8 }}>
                  🎯 {b.action}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{b.createdAt}</div>
            </div>
          ))}
          {breakthroughs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🚀 还没有突破
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#a0d8ff'
const SECONDARY_COLOR = '#80c8f0'

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
  { id: 'insight', name: '灵感捕捉', icon: '💡' },
  { id: 'connection', name: '瞬间连接', icon: '⚡' },
  { id: 'aha', name: '顿悟时刻', icon: '✨' },
  { id: 'breakthrough', name: '认知突破', icon: '🚀' },
]

export default function MercuryUranusPage() {
  const config = comboConfigs['mercury-uranus']
  const [activeTab, setActiveTab] = useState<string>('insight')
  const [insights, setInsights] = useLocalStorage<Insight[]>('mu-insights', [])
  const [connections, setConnections] = useLocalStorage<FlashThought[]>('mu-connections', [])
  const [ahas, setAhas] = useLocalStorage<AhaRecord[]>('mu-ahas', [])
  const [breakthroughs, setBreakthroughs] = useLocalStorage<Breakthrough[]>('mu-breakthroughs', [])

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
        {activeTab === 'insight' && <InsightCaptureModule insights={insights} setInsights={setInsights} />}
        {activeTab === 'connection' && <ConnectionModule connections={connections} setConnections={setConnections} />}
        {activeTab === 'aha' && <AhaModule ahas={ahas} setAhas={setAhas} />}
        {activeTab === 'breakthrough' && <BreakthroughModule breakthroughs={breakthroughs} setBreakthroughs={setBreakthroughs} />}
      </div>
    </ComboShell>
  )
}
