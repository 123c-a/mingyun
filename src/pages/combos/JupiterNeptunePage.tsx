import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Faith {
  id: string
  content: string
  source: string
  strength: string
  createdAt: string
}

interface Trust {
  id: string
  hint: string
  trusted: boolean
  result: string
  createdAt: string
}

interface Meaning {
  id: string
  event: string
  meaning: string
  feeling: string
  createdAt: string
}

interface Hope {
  id: string
  hope: string
  situation: string
  belief: string
  createdAt: string
}

const STRENGTH_OPTIONS = ['坚定', '比较坚定', '一般', '有些动摇', '需要加强']

function FaithModule({ faiths, setFaiths }: {
  faiths: Faith[]
  setFaiths: (fn: (prev: Faith[]) => Faith[]) => void
}) {
  const [content, setContent] = useState('')
  const [source, setSource] = useState('')
  const [strength, setStrength] = useState('坚定')

  const addFaith = () => {
    if (!content.trim()) return
    const item: Faith = {
      id: `${Date.now()}`,
      content: content.trim(),
      source: source.trim(),
      strength,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setFaiths((prev) => [item, ...prev])
    setContent('')
    setSource('')
    setStrength('坚定')
  }

  const stats = {
    total: faiths.length,
    strong: faiths.filter(f => f.strength === '坚定' || f.strength === '比较坚定').length,
    withSource: faiths.filter(f => f.source).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '信念总数', value: stats.total, icon: '⚓' },
          { label: '坚定信念', value: stats.strong, icon: '💪' },
          { label: '有来源', value: stats.withSource, icon: '🎯' },
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
          ⚓ 信念锚点
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          锚定你的信念，让它成为你的指南针
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="你相信什么？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="这个信念来自哪里？"
          style={inputStyle}
        />
        <select value={strength} onChange={(e) => setStrength(e.target.value)} style={selectStyle}>
          {STRENGTH_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <button
          onClick={addFaith}
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
          ⚓ 锚定信念
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的信念</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faiths.slice(0, 5).map((f) => (
            <div key={f.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                ⚓ {f.content}
              </div>
              <div style={{ fontSize: 11, color: '#f0b0d0', marginBottom: 8 }}>
                💪 坚定程度：{f.strength}
              </div>
              {f.source && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  🎯 来源：{f.source}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{f.createdAt}</div>
            </div>
          ))}
          {faiths.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚓ 还没有信念
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TrustModule({ trusts, setTrusts }: {
  trusts: Trust[]
  setTrusts: (fn: (prev: Trust[]) => Trust[]) => void
}) {
  const [hint, setHint] = useState('')
  const [trusted, setTrusted] = useState(false)
  const [result, setResult] = useState('')

  const addTrust = () => {
    if (!hint.trim()) return
    const item: Trust = {
      id: `${Date.now()}`,
      hint: hint.trim(),
      trusted,
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setTrusts((prev) => [item, ...prev])
    setHint('')
    setTrusted(false)
    setResult('')
  }

  const toggleTrusted = (id: string) => {
    setTrusts((prev) => prev.map(t => t.id === id ? { ...t, trusted: !t.trusted } : t))
  }

  const stats = {
    total: trusts.length,
    trusted: trusts.filter(t => t.trusted).length,
    withResult: trusts.filter(t => t.result).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '直觉总数', value: stats.total, icon: '🌊' },
          { label: '已信任', value: stats.trusted, icon: '✅' },
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
          🌊 直觉信任
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          倾听内心的声音，相信你的直觉
        </div>

        <textarea
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="你的直觉告诉你什么？"
          style={textAreaStyle}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={trusted}
            onChange={(e) => setTrusted(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>你是否信任这个直觉？</span>
        </div>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addTrust}
          disabled={!hint.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: hint.trim() ? 'pointer' : 'not-allowed',
            opacity: hint.trim() ? 1 : 0.5,
          }}
        >
          🌊 记录直觉
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的直觉</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {trusts.slice(0, 5).map((t) => (
            <div key={t.id} style={{
              padding: 14, borderRadius: 12,
              background: t.trusted ? 'rgba(144, 176, 255, 0.1)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${t.trusted ? 'rgba(144, 176, 255, 0.35)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR }}>
                  🌊 {t.hint}
                </span>
                <button
                  onClick={() => toggleTrusted(t.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10,
                    background: t.trusted ? 'rgba(144, 176, 255, 0.25)' : `${PRIMARY_COLOR}15`,
                    border: `1px solid ${t.trusted ? 'rgba(144, 176, 255, 0.45)' : PRIMARY_COLOR + '30'}`,
                    color: PRIMARY_COLOR, cursor: 'pointer',
                  }}
                >
                  {t.trusted ? '✅ 已信任' : '⏳ 待验证'}
                </button>
              </div>
              {t.result && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  🎯 {t.result}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{t.createdAt}</div>
            </div>
          ))}
          {trusts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌊 还没有直觉
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MeaningModule({ meanings, setMeanings }: {
  meanings: Meaning[]
  setMeanings: (fn: (prev: Meaning[]) => Meaning[]) => void
}) {
  const [event, setEvent] = useState('')
  const [meaning, setMeaning] = useState('')
  const [feeling, setFeeling] = useState('')

  const addMeaning = () => {
    if (!event.trim()) return
    const item: Meaning = {
      id: `${Date.now()}`,
      event: event.trim(),
      meaning: meaning.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setMeanings((prev) => [item, ...prev])
    setEvent('')
    setMeaning('')
    setFeeling('')
  }

  const stats = {
    total: meanings.length,
    withMeaning: meanings.filter(m => m.meaning).length,
    withFeeling: meanings.filter(m => m.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '事件总数', value: stats.total, icon: '🔍' },
          { label: '找到意义', value: stats.withMeaning, icon: '💡' },
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
          🔍 意义寻找
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          在每一件事中寻找更深层的意义
        </div>

        <textarea
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="发生了什么事？"
          style={textAreaStyle}
        />
        <textarea
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="你从中找到了什么意义？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受如何？"
          style={inputStyle}
        />

        <button
          onClick={addMeaning}
          disabled={!event.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: event.trim() ? 'pointer' : 'not-allowed',
            opacity: event.trim() ? 1 : 0.5,
          }}
        >
          🔍 记录意义
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的发现</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {meanings.slice(0, 5).map((m) => (
            <div key={m.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🔍 {m.event}
              </div>
              {m.meaning && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  💡 {m.meaning}
                </div>
              )}
              {m.feeling && (
                <div style={{ fontSize: 11, color: '#f0b0d0', marginBottom: 8 }}>
                  💭 {m.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{m.createdAt}</div>
            </div>
          ))}
          {meanings.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔍 还没有发现
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HopeModule({ hopes, setHopes }: {
  hopes: Hope[]
  setHopes: (fn: (prev: Hope[]) => Hope[]) => void
}) {
  const [hope, setHope] = useState('')
  const [situation, setSituation] = useState('')
  const [belief, setBelief] = useState('')

  const addHope = () => {
    if (!hope.trim()) return
    const item: Hope = {
      id: `${Date.now()}`,
      hope: hope.trim(),
      situation: situation.trim(),
      belief: belief.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setHopes((prev) => [item, ...prev])
    setHope('')
    setSituation('')
    setBelief('')
  }

  const stats = {
    total: hopes.length,
    withSituation: hopes.filter(h => h.situation).length,
    withBelief: hopes.filter(h => h.belief).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '希望总数', value: stats.total, icon: '🏮' },
          { label: '有现状', value: stats.withSituation, icon: '📊' },
          { label: '有支撑', value: stats.withBelief, icon: '⚓' },
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
          🏮 希望灯塔
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          让希望成为照亮前路的灯塔
        </div>

        <textarea
          value={hope}
          onChange={(e) => setHope(e.target.value)}
          placeholder="你希望什么？"
          style={textAreaStyle}
        />
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="当前的状况如何？"
          style={textAreaStyle}
        />
        <textarea
          value={belief}
          onChange={(e) => setBelief(e.target.value)}
          placeholder="支撑你的信念是什么？"
          style={textAreaStyle}
        />

        <button
          onClick={addHope}
          disabled={!hope.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: hope.trim() ? 'pointer' : 'not-allowed',
            opacity: hope.trim() ? 1 : 0.5,
          }}
        >
          🏮 点亮希望
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的希望</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hopes.slice(0, 5).map((h) => (
            <div key={h.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🏮 {h.hope}
              </div>
              {h.situation && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  📊 现状：{h.situation}
                </div>
              )}
              {h.belief && (
                <div style={{ fontSize: 11, color: '#f0d080', marginBottom: 8 }}>
                  ⚓ 支撑信念：{h.belief}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{h.createdAt}</div>
            </div>
          ))}
          {hopes.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏮 还没有希望
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#90b0ff'
const SECONDARY_COLOR = '#80a0e8'

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
  { id: 'faith', name: '信念锚点', icon: '⚓' },
  { id: 'trust', name: '直觉信任', icon: '🌊' },
  { id: 'meaning', name: '意义寻找', icon: '🔍' },
  { id: 'hope', name: '希望灯塔', icon: '🏮' },
]

export default function JupiterNeptunePage() {
  const config = comboConfigs['jupiter-neptune']
  const [activeTab, setActiveTab] = useState<string>('faith')
  const [faiths, setFaiths] = useLocalStorage<Faith[]>('jn-faiths', [])
  const [trusts, setTrusts] = useLocalStorage<Trust[]>('jn-trusts', [])
  const [meanings, setMeanings] = useLocalStorage<Meaning[]>('jn-meanings', [])
  const [hopes, setHopes] = useLocalStorage<Hope[]>('jn-hopes', [])

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
        {activeTab === 'faith' && <FaithModule faiths={faiths} setFaiths={setFaiths} />}
        {activeTab === 'trust' && <TrustModule trusts={trusts} setTrusts={setTrusts} />}
        {activeTab === 'meaning' && <MeaningModule meanings={meanings} setMeanings={setMeanings} />}
        {activeTab === 'hope' && <HopeModule hopes={hopes} setHopes={setHopes} />}
      </div>
    </ComboShell>
  )
}
