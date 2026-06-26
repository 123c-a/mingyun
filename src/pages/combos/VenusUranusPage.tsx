import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface BreakItem {
  id: string
  oldTemplate: string
  newDefinition: string
  action: string
  createdAt: string
}

interface ExpressItem {
  id: string
  expression: string
  person: string
  reaction: string
  createdAt: string
}

interface ManifestoItem {
  id: string
  content: string
  relationship: string
  determination: string
  createdAt: string
}

interface NoveltyItem {
  id: string
  experience: string
  feeling: string
  inspiration: string
  createdAt: string
}

const DETERMINATION_OPTIONS = [
  '只是想想', '有些决心', '非常坚定', '势在必行'
]

function BreakModule({ breaks, setBreaks }: {
  breaks: BreakItem[]
  setBreaks: (fn: (prev: BreakItem[]) => BreakItem[]) => void
}) {
  const [oldTemplate, setOldTemplate] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [action, setAction] = useState('')

  const addBreak = () => {
    if (!oldTemplate.trim()) return
    const item: BreakItem = {
      id: `${Date.now()}`,
      oldTemplate: oldTemplate.trim(),
      newDefinition: newDefinition.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setBreaks((prev) => [item, ...prev])
    setOldTemplate('')
    setNewDefinition('')
    setAction('')
  }

  const stats = {
    total: breaks.length,
    withNew: breaks.filter(b => b.newDefinition).length,
    withAction: breaks.filter(b => b.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '打破模板', value: stats.total, icon: '💔' },
          { label: '有新定义', value: stats.withNew, icon: '💎' },
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
          💔 打破模板
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          打破旧有的爱的模板，重新定义爱
        </div>

        <textarea
          value={oldTemplate}
          onChange={(e) => setOldTemplate(e.target.value)}
          placeholder="旧有的爱的模板是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={newDefinition}
          onChange={(e) => setNewDefinition(e.target.value)}
          placeholder="你对爱的新定义是？"
          style={textAreaStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你将采取什么行动？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addBreak}
          disabled={!oldTemplate.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e8e0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldTemplate.trim() ? 'pointer' : 'not-allowed',
            opacity: oldTemplate.trim() ? 1 : 0.5,
          }}
        >
          💔 打破重塑
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>打破记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {breaks.slice(0, 5).map((b) => (
            <div key={b.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>
                <span style={{ color: '#ff90a0' }}>💔 {b.oldTemplate}</span>
              </div>
              {b.newDefinition && (
                <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                  <span style={{ color: '#c0b0ff' }}>✨ {b.newDefinition}</span>
                </div>
              )}
              {b.action && (
                <div style={{ fontSize: 11, color: '#a0e0b0', marginBottom: 8 }}>
                  🎯 {b.action}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{b.createdAt}</div>
            </div>
          ))}
          {breaks.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💔 还没有打破记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExpressModule({ expresses, setExpresses }: {
  expresses: ExpressItem[]
  setExpresses: (fn: (prev: ExpressItem[]) => ExpressItem[]) => void
}) {
  const [expression, setExpression] = useState('')
  const [person, setPerson] = useState('')
  const [reaction, setReaction] = useState('')

  const addExpress = () => {
    if (!expression.trim()) return
    const item: ExpressItem = {
      id: `${Date.now()}`,
      expression: expression.trim(),
      person: person.trim(),
      reaction: reaction.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setExpresses((prev) => [item, ...prev])
    setExpression('')
    setPerson('')
    setReaction('')
  }

  const stats = {
    total: expresses.length,
    withPerson: expresses.filter(e => e.person).length,
    withReaction: expresses.filter(e => e.reaction).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '独特表达', value: stats.total, icon: '🎨' },
          { label: '有对象', value: stats.withPerson, icon: '👥' },
          { label: '有反馈', value: stats.withReaction, icon: '💬' },
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
          🎨 独特表达
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          用你独特的方式表达爱
        </div>

        <input
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="表达对象（可选）"
          style={inputStyle}
        />
        <textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="你独特的爱的表达方式是？"
          style={textAreaStyle}
        />
        <textarea
          value={reaction}
          onChange={(e) => setReaction(e.target.value)}
          placeholder="对方的反应（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addExpress}
          disabled={!expression.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e8e0ff', fontSize: 12, letterSpacing: 3,
            cursor: expression.trim() ? 'pointer' : 'not-allowed',
            opacity: expression.trim() ? 1 : 0.5,
          }}
        >
          🎨 记录表达
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>爱的表达</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {expresses.slice(0, 5).map((e) => (
            <div key={e.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {e.person ? `对 ${e.person}` : '对自己'}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{e.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{e.expression}</div>
              {e.reaction && (
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  💬 {e.reaction}
                </div>
              )}
            </div>
          ))}
          {expresses.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎨 还没有表达记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ManifestoModule({ manifestos, setManifestos }: {
  manifestos: ManifestoItem[]
  setManifestos: (fn: (prev: ManifestoItem[]) => ManifestoItem[]) => void
}) {
  const [content, setContent] = useState('')
  const [relationship, setRelationship] = useState('')
  const [determination, setDetermination] = useState('有些决心')

  const addManifesto = () => {
    if (!content.trim()) return
    const item: ManifestoItem = {
      id: `${Date.now()}`,
      content: content.trim(),
      relationship: relationship.trim(),
      determination,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setManifestos((prev) => [item, ...prev])
    setContent('')
    setRelationship('')
  }

  const stats = {
    total: manifestos.length,
    withRelationship: manifestos.filter(m => m.relationship).length,
    firm: manifestos.filter(m => m.determination === '非常坚定' || m.determination === '势在必行').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '宣言总数', value: stats.total, icon: '🕊️' },
          { label: '适用关系', value: stats.withRelationship, icon: '💞' },
          { label: '坚定宣言', value: stats.firm, icon: '⚡' },
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
          🕊️ 自由宣言
        </div>

        <select value={determination} onChange={(e) => setDetermination(e.target.value)} style={selectStyle}>
          {DETERMINATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <input
          type="text"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          placeholder="适用的关系类型（可选）"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的自由宣言……"
          style={{ ...textAreaStyle, minHeight: 100 }}
        />

        <button
          onClick={addManifesto}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e8e0ff', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🕊️ 发布宣言
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>自由宣言</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {manifestos.slice(0, 5).map((m) => (
            <div key={m.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {m.relationship || '通用'}
                </span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 999,
                  background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR,
                }}>
                  {m.determination}
                </span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{m.content}</div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{m.createdAt}</div>
            </div>
          ))}
          {manifestos.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🕊️ 还没有宣言
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NoveltyModule({ novelties, setNovelties }: {
  novelties: NoveltyItem[]
  setNovelties: (fn: (prev: NoveltyItem[]) => NoveltyItem[]) => void
}) {
  const [experience, setExperience] = useState('')
  const [feeling, setFeeling] = useState('')
  const [inspiration, setInspiration] = useState('')

  const addNovelty = () => {
    if (!experience.trim()) return
    const item: NoveltyItem = {
      id: `${Date.now()}`,
      experience: experience.trim(),
      feeling: feeling.trim(),
      inspiration: inspiration.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setNovelties((prev) => [item, ...prev])
    setExperience('')
    setFeeling('')
    setInspiration('')
  }

  const stats = {
    total: novelties.length,
    withFeeling: novelties.filter(n => n.feeling).length,
    withInspiration: novelties.filter(n => n.inspiration).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '新鲜体验', value: stats.total, icon: '🌈' },
          { label: '有感受', value: stats.withFeeling, icon: '💫' },
          { label: '有启发', value: stats.withInspiration, icon: '💡' },
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
          🌈 新鲜体验
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          尝试新鲜事物，为关系注入活力
        </div>

        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="描述这次新鲜体验……"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是？（可选）"
          style={textAreaStyle}
        />
        <textarea
          value={inspiration}
          onChange={(e) => setInspiration(e.target.value)}
          placeholder="带来了什么启发？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addNovelty}
          disabled={!experience.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e8e0ff', fontSize: 12, letterSpacing: 3,
            cursor: experience.trim() ? 'pointer' : 'not-allowed',
            opacity: experience.trim() ? 1 : 0.5,
          }}
        >
          🌈 记录体验
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>新鲜体验</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {novelties.slice(0, 5).map((n) => (
            <div key={n.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 8 }}>
                🌈 {n.experience}
              </div>
              {n.feeling && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  💫 感受：{n.feeling}
                </div>
              )}
              {n.inspiration && (
                <div style={{ fontSize: 12, color: '#a0e0b0', lineHeight: 1.6 }}>
                  💡 启发：{n.inspiration}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{n.createdAt}</div>
            </div>
          ))}
          {novelties.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌈 还没有新鲜体验
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#c0b0ff'
const SECONDARY_COLOR = '#a090f0'

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
  color: '#e8e0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#e8e0ff', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#e8e0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'break', name: '打破模板', icon: '💔' },
  { id: 'express', name: '独特表达', icon: '🎨' },
  { id: 'manifesto', name: '自由宣言', icon: '🕊️' },
  { id: 'novelty', name: '新鲜体验', icon: '🌈' },
]

export default function VenusUranusPage() {
  const config = comboConfigs['venus-uranus']
  const [activeTab, setActiveTab] = useState<string>('break')
  const [breaks, setBreaks] = useLocalStorage<BreakItem[]>('vu-breaks', [])
  const [expresses, setExpresses] = useLocalStorage<ExpressItem[]>('vu-expresses', [])
  const [manifestos, setManifestos] = useLocalStorage<ManifestoItem[]>('vu-manifestos', [])
  const [novelties, setNovelties] = useLocalStorage<NoveltyItem[]>('vu-novelties', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#e8e0ff' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'break' && <BreakModule breaks={breaks} setBreaks={setBreaks} />}
        {activeTab === 'express' && <ExpressModule expresses={expresses} setExpresses={setExpresses} />}
        {activeTab === 'manifesto' && <ManifestoModule manifestos={manifestos} setManifestos={setManifestos} />}
        {activeTab === 'novelty' && <NoveltyModule novelties={novelties} setNovelties={setNovelties} />}
      </div>
    </ComboShell>
  )
}
