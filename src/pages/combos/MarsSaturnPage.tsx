import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface LongGame {
  id: string
  goal: string
  days: number
  feeling: string
  createdAt: string
}

interface Discipline {
  id: string
  content: string
  frequency: string
  effect: string
  createdAt: string
}

interface Forge {
  id: string
  event: string
  lesson: string
  change: string
  createdAt: string
}

interface SlowFast {
  id: string
  action: string
  content: string
  effect: string
  createdAt: string
}

const FREQUENCY_OPTIONS = ['每天', '每周', '每两周', '每月', '不定期']

function LongGameModule({ longgames, setLonggames }: {
  longgames: LongGame[]
  setLonggames: (fn: (prev: LongGame[]) => LongGame[]) => void
}) {
  const [goal, setGoal] = useState('')
  const [days, setDays] = useState(0)
  const [feeling, setFeeling] = useState('')

  const addLongGame = () => {
    if (!goal.trim()) return
    const item: LongGame = {
      id: `${Date.now()}`,
      goal: goal.trim(),
      days,
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setLonggames((prev) => [item, ...prev])
    setGoal('')
    setDays(0)
    setFeeling('')
  }

  const stats = {
    total: longgames.length,
    totalDays: longgames.reduce((sum, g) => sum + g.days, 0),
    withFeeling: longgames.filter(g => g.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '长期目标', value: stats.total, icon: '⚔️' },
          { label: '总坚持天数', value: stats.totalDays, icon: '📅' },
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
          ⚔️ 持久战
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录你的长期目标和坚持
        </div>

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="你的长期目标是什么？"
          style={textAreaStyle}
        />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>已坚持天数：{days} 天</div>
          <input
            type="range"
            min="0"
            max="365"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="坚持过程中的感受"
          style={textAreaStyle}
        />

        <button
          onClick={addLongGame}
          disabled={!goal.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5e8d8', fontSize: 12, letterSpacing: 3,
            cursor: goal.trim() ? 'pointer' : 'not-allowed',
            opacity: goal.trim() ? 1 : 0.5,
          }}
        >
          ⚔️ 记录持久战
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的持久战</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {longgames.slice(0, 5).map((g) => (
            <div key={g.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 6, fontWeight: 500 }}>
                ⚔️ {g.goal}
              </div>
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
                📅 已坚持 {g.days} 天
              </div>
              {g.feeling && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  💭 {g.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{g.createdAt}</div>
            </div>
          ))}
          {longgames.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚔️ 还没有持久战记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DisciplineModule({ disciplines, setDisciplines }: {
  disciplines: Discipline[]
  setDisciplines: (fn: (prev: Discipline[]) => Discipline[]) => void
}) {
  const [content, setContent] = useState('')
  const [frequency, setFrequency] = useState('每天')
  const [effect, setEffect] = useState('')

  const addDiscipline = () => {
    if (!content.trim()) return
    const item: Discipline = {
      id: `${Date.now()}`,
      content: content.trim(),
      frequency,
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setDisciplines((prev) => [item, ...prev])
    setContent('')
    setFrequency('每天')
    setEffect('')
  }

  const stats = {
    total: disciplines.length,
    daily: disciplines.filter(d => d.frequency === '每天').length,
    withEffect: disciplines.filter(d => d.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '纪律训练', value: stats.total, icon: '📐' },
          { label: '每日训练', value: stats.daily, icon: '☀️' },
          { label: '有成效', value: stats.withEffect, icon: '✨' },
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
          📐 纪律训练
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="训练内容是什么？"
          style={textAreaStyle}
        />
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={selectStyle}>
          {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="训练带来的成效"
          style={textAreaStyle}
        />

        <button
          onClick={addDiscipline}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5e8d8', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          📐 添加训练
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的纪律训练</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {disciplines.slice(0, 5).map((d) => (
            <div key={d.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR, fontWeight: 500 }}>
                  📐 {d.content}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>
                  {d.frequency}
                </span>
              </div>
              {d.effect && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  ✨ 成效：{d.effect}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{d.createdAt}</div>
            </div>
          ))}
          {disciplines.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📐 还没有纪律训练
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ForgeModule({ forges, setForges }: {
  forges: Forge[]
  setForges: (fn: (prev: Forge[]) => Forge[]) => void
}) {
  const [event, setEvent] = useState('')
  const [lesson, setLesson] = useState('')
  const [change, setChange] = useState('')

  const addForge = () => {
    if (!event.trim()) return
    const item: Forge = {
      id: `${Date.now()}`,
      event: event.trim(),
      lesson: lesson.trim(),
      change: change.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setForges((prev) => [item, ...prev])
    setEvent('')
    setLesson('')
    setChange('')
  }

  const stats = {
    total: forges.length,
    withLesson: forges.filter(f => f.lesson).length,
    withChange: forges.filter(f => f.change).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '挫折炼金', value: stats.total, icon: '💔' },
          { label: '有教训', value: stats.withLesson, icon: '📚' },
          { label: '有改变', value: stats.withChange, icon: '🦋' },
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
          💔 挫折炼金
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          每一次挫折都是成长的炼金炉
        </div>

        <textarea
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="发生了什么挫折？"
          style={textAreaStyle}
        />
        <textarea
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          placeholder="你学到了什么？"
          style={textAreaStyle}
        />
        <textarea
          value={change}
          onChange={(e) => setChange(e.target.value)}
          placeholder="你做出了什么改变？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addForge}
          disabled={!event.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5e8d8', fontSize: 12, letterSpacing: 3,
            cursor: event.trim() ? 'pointer' : 'not-allowed',
            opacity: event.trim() ? 1 : 0.5,
          }}
        >
          💔 炼金转化
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的挫折炼金</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {forges.slice(0, 5).map((f) => (
            <div key={f.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: '#ff9080', marginBottom: 8 }}>
                💔 {f.event}
              </div>
              {f.lesson && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  📚 教训：{f.lesson}
                </div>
              )}
              {f.change && (
                <div style={{ fontSize: 12, color: '#a0d0a0', marginBottom: 6 }}>
                  🦋 改变：{f.change}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{f.createdAt}</div>
            </div>
          ))}
          {forges.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💔 还没有挫折记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SlowFastModule({ slowfasts, setSlowfasts }: {
  slowfasts: SlowFast[]
  setSlowfasts: (fn: (prev: SlowFast[]) => SlowFast[]) => void
}) {
  const [action, setAction] = useState('')
  const [content, setContent] = useState('')
  const [effect, setEffect] = useState('')

  const addSlowFast = () => {
    if (!action.trim()) return
    const item: SlowFast = {
      id: `${Date.now()}`,
      action: action.trim(),
      content: content.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setSlowfasts((prev) => [item, ...prev])
    setAction('')
    setContent('')
    setEffect('')
  }

  const stats = {
    total: slowfasts.length,
    withContent: slowfasts.filter(s => s.content).length,
    withEffect: slowfasts.filter(s => s.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '慢行动', value: stats.total, icon: '🐢' },
          { label: '有内容', value: stats.withContent, icon: '📝' },
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
          🐢 慢就是快
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          慢慢来，比较快
        </div>

        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="这个慢行动是什么？"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="具体内容/做法"
          style={textAreaStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="慢行动带来的效果"
          style={textAreaStyle}
        />

        <button
          onClick={addSlowFast}
          disabled={!action.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f5e8d8', fontSize: 12, letterSpacing: 3,
            cursor: action.trim() ? 'pointer' : 'not-allowed',
            opacity: action.trim() ? 1 : 0.5,
          }}
        >
          🐢 记录慢行动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的慢行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slowfasts.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 6, fontWeight: 500 }}>
                🐢 {s.action}
              </div>
              {s.content && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 6 }}>
                  📝 {s.content}
                </div>
              )}
              {s.effect && (
                <div style={{ fontSize: 12, color: '#a0d0a0', marginBottom: 6 }}>
                  ✨ 效果：{s.effect}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{s.createdAt}</div>
            </div>
          ))}
          {slowfasts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🐢 还没有慢行动记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#d0a080'
const SECONDARY_COLOR = '#b89060'

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
  color: '#f5e8d8', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#f5e8d8', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#f5e8d8', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'longgame', name: '持久战', icon: '⚔️' },
  { id: 'discipline', name: '纪律训练', icon: '📐' },
  { id: 'forge', name: '挫折炼金', icon: '💔' },
  { id: 'slowfast', name: '慢就是快', icon: '🐢' },
]

export default function MarsSaturnPage() {
  const config = comboConfigs['mars-saturn']
  const [activeTab, setActiveTab] = useState<string>('longgame')
  const [longgames, setLonggames] = useLocalStorage<LongGame[]>('ms-longgames', [])
  const [disciplines, setDisciplines] = useLocalStorage<Discipline[]>('ms-disciplines', [])
  const [forges, setForges] = useLocalStorage<Forge[]>('ms-forges', [])
  const [slowfasts, setSlowfasts] = useLocalStorage<SlowFast[]>('ms-slowfasts', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#f5e8d8' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'longgame' && <LongGameModule longgames={longgames} setLonggames={setLonggames} />}
        {activeTab === 'discipline' && <DisciplineModule disciplines={disciplines} setDisciplines={setDisciplines} />}
        {activeTab === 'forge' && <ForgeModule forges={forges} setForges={setForges} />}
        {activeTab === 'slowfast' && <SlowFastModule slowfasts={slowfasts} setSlowfasts={setSlowfasts} />}
      </div>
    </ComboShell>
  )
}
