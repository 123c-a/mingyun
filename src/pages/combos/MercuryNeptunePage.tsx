import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Dream {
  id: string
  dream: string
  emotion: string
  characters: string
  interpretation: string
  createdAt: string
}

interface Writing {
  id: string
  topic: string
  content: string
  duration: string
  createdAt: string
}

interface SoulTranslation {
  id: string
  feeling: string
  translation: string
  trigger: string
  createdAt: string
}

interface Drift {
  id: string
  content: string
  status: string
  action: string
  createdAt: string
}

const EMOTION_OPTIONS = [
  '喜悦', '悲伤', '恐惧', '愤怒', '平静', '困惑', '期待', '其他'
]

const STATUS_OPTIONS = [
  '漂浮中', '落地', '漂流中'
]

function DreamModule({ dreams, setDreams }: {
  dreams: Dream[]
  setDreams: (fn: (prev: Dream[]) => Dream[]) => void
}) {
  const [dream, setDream] = useState('')
  const [emotion, setEmotion] = useState('平静')
  const [characters, setCharacters] = useState('')
  const [interpretation, setInterpretation] = useState('')

  const addDream = () => {
    if (!dream.trim()) return
    const item: Dream = {
      id: `${Date.now()}`,
      dream: dream.trim(),
      emotion,
      characters: characters.trim(),
      interpretation: interpretation.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setDreams((prev) => [item, ...prev])
    setDream('')
    setCharacters('')
    setInterpretation('')
  }

  const stats = {
    total: dreams.length,
    withInterpretation: dreams.filter(d => d.interpretation).length,
    emotions: new Set(dreams.map(d => d.emotion)).size,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '梦境总数', value: stats.total, icon: '🌙' },
          { label: '已解读', value: stats.withInterpretation, icon: '🔮' },
          { label: '情绪种类', value: stats.emotions, icon: '💫' },
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
          🌙 记录你的梦境
        </div>

        <select value={emotion} onChange={(e) => setEmotion(e.target.value)} style={selectStyle}>
          {EMOTION_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="描述你的梦境……"
          style={textAreaStyle}
        />

        <input
          type="text"
          value={characters}
          onChange={(e) => setCharacters(e.target.value)}
          placeholder="梦中出现的角色（可选）"
          style={inputStyle}
        />

        <textarea
          value={interpretation}
          onChange={(e) => setInterpretation(e.target.value)}
          placeholder="你的解梦解读（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addDream}
          disabled={!dream.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: dream.trim() ? 'pointer' : 'not-allowed',
            opacity: dream.trim() ? 1 : 0.5,
          }}
        >
          🌙 记录梦境
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的梦境</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dreams.slice(0, 5).map((d) => (
            <div key={d.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {d.emotion}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{d.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{d.dream}</div>
              {d.characters && (
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
                  👤 {d.characters}
                </div>
              )}
              {d.interpretation && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginTop: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  🔮 {d.interpretation}
                </div>
              )}
            </div>
          ))}
          {dreams.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌙 还没有梦境记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function WritingModule({ writings, setWritings }: {
  writings: Writing[]
  setWritings: (fn: (prev: Writing[]) => Writing[]) => void
}) {
  const [topic, setTopic] = useState('')
  const [content, setContent] = useState('')
  const [duration, setDuration] = useState('')

  const addWriting = () => {
    if (!content.trim()) return
    const item: Writing = {
      id: `${Date.now()}`,
      topic: topic.trim(),
      content: content.trim(),
      duration: duration.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setWritings((prev) => [item, ...prev])
    setTopic('')
    setContent('')
    setDuration('')
  }

  const stats = {
    total: writings.length,
    withDuration: writings.filter(w => w.duration).length,
    topics: new Set(writings.map(w => w.topic).filter(Boolean)).size,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '书写次数', value: stats.total, icon: '✍️' },
          { label: '有时长记录', value: stats.withDuration, icon: '⏱️' },
          { label: '主题数量', value: stats.topics, icon: '📝' },
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
          ✍️ 潜意识书写
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          让笔尖跟随潜意识自由流动
        </div>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="书写主题（可选）"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="开始自由书写……"
          style={{ ...textAreaStyle, minHeight: 120 }}
        />
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="书写时长（可选，如：15分钟）"
          style={inputStyle}
        />

        <button
          onClick={addWriting}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          ✍️ 保存书写
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的书写</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {writings.slice(0, 5).map((w) => (
            <div key={w.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>
                  {w.topic || '无题'}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>
                  {w.duration ? `${w.duration} · ` : ''}{w.createdAt}
                </span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{w.content}</div>
            </div>
          ))}
          {writings.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ✍️ 还没有书写记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TranslateModule({ translations, setTranslations }: {
  translations: SoulTranslation[]
  setTranslations: (fn: (prev: SoulTranslation[]) => SoulTranslation[]) => void
}) {
  const [feeling, setFeeling] = useState('')
  const [translation, setTranslation] = useState('')
  const [trigger, setTrigger] = useState('')

  const addTranslation = () => {
    if (!feeling.trim()) return
    const item: SoulTranslation = {
      id: `${Date.now()}`,
      feeling: feeling.trim(),
      translation: translation.trim(),
      trigger: trigger.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setTranslations((prev) => [item, ...prev])
    setFeeling('')
    setTranslation('')
    setTrigger('')
  }

  const stats = {
    total: translations.length,
    withTranslation: translations.filter(t => t.translation).length,
    withTrigger: translations.filter(t => t.trigger).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '翻译总数', value: stats.total, icon: '💭' },
          { label: '已清晰表达', value: stats.withTranslation, icon: '💎' },
          { label: '有触发点', value: stats.withTrigger, icon: '🎯' },
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
          💭 心灵翻译
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          把模糊的感受翻译成清晰的表达
        </div>

        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="描述那种模糊的感受……"
          style={textAreaStyle}
        />
        <textarea
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="翻译后的清晰表达"
          style={{ ...textAreaStyle, minHeight: 80 }}
        />
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="是什么触发了这种感受？（可选）"
          style={inputStyle}
        />

        <button
          onClick={addTranslation}
          disabled={!feeling.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: feeling.trim() ? 'pointer' : 'not-allowed',
            opacity: feeling.trim() ? 1 : 0.5,
          }}
        >
          💭 完成翻译
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的翻译</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {translations.slice(0, 5).map((t) => (
            <div key={t.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
                <span style={{ color: '#a0b0d0' }}>🌫️ {t.feeling}</span>
              </div>
              {t.translation && (
                <div style={{ fontSize: 13, color: PRIMARY_COLOR, lineHeight: 1.6, marginBottom: 8 }}>
                  ✨ {t.translation}
                </div>
              )}
              {t.trigger && (
                <div style={{ fontSize: 11, opacity: 0.5 }}>
                  🎯 触发点：{t.trigger}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{t.createdAt}</div>
            </div>
          ))}
          {translations.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💭 还没有翻译记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DriftModule({ drifts, setDrifts }: {
  drifts: Drift[]
  setDrifts: (fn: (prev: Drift[]) => Drift[]) => void
}) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('漂浮中')
  const [action, setAction] = useState('')

  const addDrift = () => {
    if (!content.trim()) return
    const item: Drift = {
      id: `${Date.now()}`,
      content: content.trim(),
      status,
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setDrifts((prev) => [item, ...prev])
    setContent('')
    setAction('')
  }

  const stats = {
    total: drifts.length,
    floating: drifts.filter(d => d.status === '漂浮中').length,
    landed: drifts.filter(d => d.status === '落地').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '灵感总数', value: stats.total, icon: '🎐' },
          { label: '漂浮中', value: stats.floating, icon: '🌬️' },
          { label: '已落地', value: stats.landed, icon: '🌱' },
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
          🎐 灵感漂流
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="记录你的灵感……"
          style={textAreaStyle}
        />

        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="想要采取的行动（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addDrift}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🎐 放飞灵感
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>灵感漂流瓶</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {drifts.slice(0, 5).map((d) => (
            <div key={d.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, padding: '2px 10px', borderRadius: 999,
                  background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR,
                }}>
                  {d.status === '漂浮中' && '🌬️'}
                  {d.status === '落地' && '🌱'}
                  {d.status === '漂流中' && '🎐'}
                  {' '}{d.status}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{d.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{d.content}</div>
              {d.action && (
                <div style={{ fontSize: 11, color: '#a0e0b0', marginTop: 8 }}>
                  🎯 {d.action}
                </div>
              )}
            </div>
          ))}
          {drifts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎐 还没有灵感
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#80b8ff'
const SECONDARY_COLOR = '#6090e0'

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
  color: '#d0e8ff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0e8ff', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#d0e8ff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'dream', name: '梦境翻译', icon: '🌙' },
  { id: 'write', name: '潜意识书写', icon: '✍️' },
  { id: 'translate', name: '心灵翻译', icon: '💭' },
  { id: 'drift', name: '灵感漂流', icon: '🎐' },
]

export default function MercuryNeptunePage() {
  const config = comboConfigs['mercury-neptune']
  const [activeTab, setActiveTab] = useState<string>('dream')
  const [dreams, setDreams] = useLocalStorage<Dream[]>('mn-dreams', [])
  const [writings, setWritings] = useLocalStorage<Writing[]>('mn-writings', [])
  const [translations, setTranslations] = useLocalStorage<SoulTranslation[]>('mn-translations', [])
  const [drifts, setDrifts] = useLocalStorage<Drift[]>('mn-drifts', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#d0e8ff' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'write' && <WritingModule writings={writings} setWritings={setWritings} />}
        {activeTab === 'translate' && <TranslateModule translations={translations} setTranslations={setTranslations} />}
        {activeTab === 'drift' && <DriftModule drifts={drifts} setDrifts={setDrifts} />}
      </div>
    </ComboShell>
  )
}
