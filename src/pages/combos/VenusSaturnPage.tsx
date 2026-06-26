import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Lesson {
  id: string
  person: string
  lesson: string
  feeling: string
  createdAt: string
}

interface Boundary {
  id: string
  content: string
  established: boolean
  difficulty: string
  createdAt: string
}

interface PromiseItem {
  id: string
  content: string
  person: string
  progress: string
  createdAt: string
}

interface Timeless {
  id: string
  relationship: string
  gratitude: string
  growth: string
  createdAt: string
}

const PROGRESS_OPTIONS = [
  '刚开始', '进行中', '已完成', '需要调整'
]

function LessonModule({ lessons, setLessons }: {
  lessons: Lesson[]
  setLessons: (fn: (prev: Lesson[]) => Lesson[]) => void
}) {
  const [person, setPerson] = useState('')
  const [lesson, setLesson] = useState('')
  const [feeling, setFeeling] = useState('')

  const addLesson = () => {
    if (!lesson.trim()) return
    const item: Lesson = {
      id: `${Date.now()}`,
      person: person.trim(),
      lesson: lesson.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setLessons((prev) => [item, ...prev])
    setPerson('')
    setLesson('')
    setFeeling('')
  }

  const stats = {
    total: lessons.length,
    withPerson: lessons.filter(l => l.person).length,
    withFeeling: lessons.filter(l => l.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '功课总数', value: stats.total, icon: '📚' },
          { label: '涉及关系', value: stats.withPerson, icon: '👥' },
          { label: '有感受记录', value: stats.withFeeling, icon: '💭' },
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
          📚 关系功课
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          每段关系都是一堂必修课
        </div>

        <input
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="关系对象（可选）"
          style={inputStyle}
        />
        <textarea
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          placeholder="你学到了什么功课？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addLesson}
          disabled={!lesson.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f8e8d0', fontSize: 12, letterSpacing: 3,
            cursor: lesson.trim() ? 'pointer' : 'not-allowed',
            opacity: lesson.trim() ? 1 : 0.5,
          }}
        >
          📚 记录功课
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>功课记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lessons.slice(0, 5).map((l) => (
            <div key={l.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {l.person || '未知对象'}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{l.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{l.lesson}</div>
              {l.feeling && (
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8, fontStyle: 'italic' }}>
                  {l.feeling}
                </div>
              )}
            </div>
          ))}
          {lessons.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📚 还没有功课记录
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
  const [content, setContent] = useState('')
  const [established, setEstablished] = useState(false)
  const [difficulty, setDifficulty] = useState('')

  const addBoundary = () => {
    if (!content.trim()) return
    const item: Boundary = {
      id: `${Date.now()}`,
      content: content.trim(),
      established,
      difficulty: difficulty.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setBoundaries((prev) => [item, ...prev])
    setContent('')
    setDifficulty('')
  }

  const stats = {
    total: boundaries.length,
    established: boundaries.filter(b => b.established).length,
    withDifficulty: boundaries.filter(b => b.difficulty).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '边界总数', value: stats.total, icon: '🛡️' },
          { label: '已设立', value: stats.established, icon: '✅' },
          { label: '有困难记录', value: stats.withDifficulty, icon: '💪' },
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
          🛡️ 边界练习
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => setEstablished(!established)}
            style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 12,
              background: established ? `${PRIMARY_COLOR}30` : 'rgba(0,0,0,0.2)',
              border: `1px solid ${established ? PRIMARY_COLOR + '60' : PRIMARY_COLOR + '30'}`,
              color: established ? '#f8e8d0' : 'rgba(248, 232, 208, 0.5)',
              cursor: 'pointer',
            }}
          >
            {established ? '✅ 已设立' : '⏳ 待设立'}
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="描述这个边界……"
          style={textAreaStyle}
        />
        <textarea
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          placeholder="设立过程中的困难（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addBoundary}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f8e8d0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🛡️ 记录边界
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>边界列表</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {boundaries.slice(0, 5).map((b) => (
            <div key={b.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, padding: '2px 10px', borderRadius: 999,
                  background: b.established ? 'rgba(160, 224, 176, 0.2)' : `${PRIMARY_COLOR}20`,
                  color: b.established ? '#a0e0b0' : PRIMARY_COLOR,
                }}>
                  {b.established ? '✅ 已设立' : '⏳ 待设立'}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{b.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{b.content}</div>
              {b.difficulty && (
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
                  💪 困难：{b.difficulty}
                </div>
              )}
            </div>
          ))}
          {boundaries.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🛡️ 还没有边界记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PromiseModule({ promises, setPromises }: {
  promises: PromiseItem[]
  setPromises: (fn: (prev: PromiseItem[]) => PromiseItem[]) => void
}) {
  const [content, setContent] = useState('')
  const [person, setPerson] = useState('')
  const [progress, setProgress] = useState('刚开始')

  const addPromise = () => {
    if (!content.trim()) return
    const item: PromiseItem = {
      id: `${Date.now()}`,
      content: content.trim(),
      person: person.trim(),
      progress,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setPromises((prev) => [item, ...prev])
    setContent('')
    setPerson('')
  }

  const stats = {
    total: promises.length,
    completed: promises.filter(p => p.progress === '已完成').length,
    inProgress: promises.filter(p => p.progress === '进行中').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '承诺总数', value: stats.total, icon: '💍' },
          { label: '进行中', value: stats.inProgress, icon: '⏳' },
          { label: '已完成', value: stats.completed, icon: '✅' },
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
          💍 承诺清单
        </div>

        <select value={progress} onChange={(e) => setProgress(e.target.value)} style={selectStyle}>
          {PROGRESS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <input
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="承诺对象（可选）"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="承诺内容"
          style={textAreaStyle}
        />

        <button
          onClick={addPromise}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f8e8d0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          💍 许下承诺
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>承诺清单</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {promises.slice(0, 5).map((p) => (
            <div key={p.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {p.person ? `对 ${p.person}` : '对自己'}
                </span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 999,
                  background: p.progress === '已完成' ? 'rgba(160, 224, 176, 0.2)' : `${PRIMARY_COLOR}20`,
                  color: p.progress === '已完成' ? '#a0e0b0' : PRIMARY_COLOR,
                }}>
                  {p.progress}
                </span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{p.content}</div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{p.createdAt}</div>
            </div>
          ))}
          {promises.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💍 还没有承诺
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TimelessModule({ timelesses, setTimelesses }: {
  timelesses: Timeless[]
  setTimelesses: (fn: (prev: Timeless[]) => Timeless[]) => void
}) {
  const [relationship, setRelationship] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [growth, setGrowth] = useState('')

  const addTimeless = () => {
    if (!relationship.trim()) return
    const item: Timeless = {
      id: `${Date.now()}`,
      relationship: relationship.trim(),
      gratitude: gratitude.trim(),
      growth: growth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setTimelesses((prev) => [item, ...prev])
    setRelationship('')
    setGratitude('')
    setGrowth('')
  }

  const stats = {
    total: timelesses.length,
    withGratitude: timelesses.filter(t => t.gratitude).length,
    withGrowth: timelesses.filter(t => t.growth).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '长期关系', value: stats.total, icon: '⏳' },
          { label: '有感恩点', value: stats.withGratitude, icon: '💖' },
          { label: '有成长记录', value: stats.withGrowth, icon: '🌱' },
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
          ⏳ 时间的爱
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录那些经得起时间考验的爱
        </div>

        <input
          type="text"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          placeholder="这段长期关系是？"
          style={inputStyle}
        />
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="感恩的点（可选）"
          style={textAreaStyle}
        />
        <textarea
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="共同的成长（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addTimeless}
          disabled={!relationship.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#f8e8d0', fontSize: 12, letterSpacing: 3,
            cursor: relationship.trim() ? 'pointer' : 'not-allowed',
            opacity: relationship.trim() ? 1 : 0.5,
          }}
        >
          ⏳ 记录时光
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>时间的爱</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {timelesses.slice(0, 5).map((t) => (
            <div key={t.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                ⏳ {t.relationship}
              </div>
              {t.gratitude && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  💖 感恩：{t.gratitude}
                </div>
              )}
              {t.growth && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6 }}>
                  🌱 成长：{t.growth}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{t.createdAt}</div>
            </div>
          ))}
          {timelesses.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⏳ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#e8c8a0'
const SECONDARY_COLOR = '#d0b080'

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
  color: '#f8e8d0', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#f8e8d0', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#f8e8d0', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'lesson', name: '关系功课', icon: '📚' },
  { id: 'boundary', name: '边界练习', icon: '🛡️' },
  { id: 'promise', name: '承诺清单', icon: '💍' },
  { id: 'timeless', name: '时间的爱', icon: '⏳' },
]

export default function VenusSaturnPage() {
  const config = comboConfigs['venus-saturn']
  const [activeTab, setActiveTab] = useState<string>('lesson')
  const [lessons, setLessons] = useLocalStorage<Lesson[]>('vs-lessons', [])
  const [boundaries, setBoundaries] = useLocalStorage<Boundary[]>('vs-boundaries', [])
  const [promises, setPromises] = useLocalStorage<PromiseItem[]>('vs-promises', [])
  const [timelesses, setTimelesses] = useLocalStorage<Timeless[]>('vs-timeless', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#f8e8d0' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'lesson' && <LessonModule lessons={lessons} setLessons={setLessons} />}
        {activeTab === 'boundary' && <BoundaryModule boundaries={boundaries} setBoundaries={setBoundaries} />}
        {activeTab === 'promise' && <PromiseModule promises={promises} setPromises={setPromises} />}
        {activeTab === 'timeless' && <TimelessModule timelesses={timelesses} setTimelesses={setTimelesses} />}
      </div>
    </ComboShell>
  )
}
