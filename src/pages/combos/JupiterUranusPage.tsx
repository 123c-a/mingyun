import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface LuckyEvent {
  id: string
  event: string
  source: string
  feeling: string
  createdAt: string
}

interface Chance {
  id: string
  description: string
  seized: boolean
  result: string
  createdAt: string
}

interface Bonus {
  id: string
  bonus: string
  source: string
  value: string
  createdAt: string
}

interface Experiment {
  id: string
  content: string
  hypothesis: string
  result: string
  createdAt: string
}

function LuckyModule({ luckies, setLuckies }: {
  luckies: LuckyEvent[]
  setLuckies: (fn: (prev: LuckyEvent[]) => LuckyEvent[]) => void
}) {
  const [event, setEvent] = useState('')
  const [source, setSource] = useState('')
  const [feeling, setFeeling] = useState('')

  const addLucky = () => {
    if (!event.trim()) return
    const item: LuckyEvent = {
      id: `${Date.now()}`,
      event: event.trim(),
      source: source.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setLuckies((prev) => [item, ...prev])
    setEvent('')
    setSource('')
    setFeeling('')
  }

  const stats = {
    total: luckies.length,
    withSource: luckies.filter(l => l.source).length,
    thisWeek: luckies.filter(l => {
      const date = new Date(l.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '幸运总数', value: stats.total, icon: '🍀' },
          { label: '有来源', value: stats.withSource, icon: '🎯' },
          { label: '本周幸运', value: stats.thisWeek, icon: '📅' },
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
          🍀 幸运捕捉
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          捕捉生活中的每一个小幸运
        </div>

        <textarea
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="发生了什么幸运的事？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="这个幸运来自哪里？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受到了什么？"
          style={inputStyle}
        />

        <button
          onClick={addLucky}
          disabled={!event.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e8e0ff', fontSize: 12, letterSpacing: 3,
            cursor: event.trim() ? 'pointer' : 'not-allowed',
            opacity: event.trim() ? 1 : 0.5,
          }}
        >
          🍀 捕捉幸运
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的幸运</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {luckies.slice(0, 5).map((l) => (
            <div key={l.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🍀 {l.event}
              </div>
              {l.source && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  🎯 来源：{l.source}
                </div>
              )}
              {l.feeling && (
                <div style={{ fontSize: 11, color: '#f0b0d0', marginBottom: 8 }}>
                  💭 {l.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{l.createdAt}</div>
            </div>
          ))}
          {luckies.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🍀 还没有幸运
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ChanceModule({ chances, setChances }: {
  chances: Chance[]
  setChances: (fn: (prev: Chance[]) => Chance[]) => void
}) {
  const [description, setDescription] = useState('')
  const [seized, setSeized] = useState(false)
  const [result, setResult] = useState('')

  const addChance = () => {
    if (!description.trim()) return
    const item: Chance = {
      id: `${Date.now()}`,
      description: description.trim(),
      seized,
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setChances((prev) => [item, ...prev])
    setDescription('')
    setSeized(false)
    setResult('')
  }

  const toggleSeized = (id: string) => {
    setChances((prev) => prev.map(c => c.id === id ? { ...c, seized: !c.seized } : c))
  }

  const stats = {
    total: chances.length,
    seized: chances.filter(c => c.seized).length,
    withResult: chances.filter(c => c.result).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '机会总数', value: stats.total, icon: '🚀' },
          { label: '已抓住', value: stats.seized, icon: '✅' },
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
          🚀 突破机会
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录每一个可能带来突破的机会
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="这是一个什么样的机会？"
          style={textAreaStyle}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={seized}
            onChange={(e) => setSeized(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, opacity: 0.7 }}>是否已经抓住了这个机会？</span>
        </div>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addChance}
          disabled={!description.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e8e0ff', fontSize: 12, letterSpacing: 3,
            cursor: description.trim() ? 'pointer' : 'not-allowed',
            opacity: description.trim() ? 1 : 0.5,
          }}
        >
          🚀 记录机会
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的机会</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {chances.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: c.seized ? 'rgba(208, 192, 255, 0.1)' : `${PRIMARY_COLOR}08`,
              border: `1px solid ${c.seized ? 'rgba(208, 192, 255, 0.35)' : PRIMARY_COLOR + '20'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR }}>
                  🚀 {c.description}
                </span>
                <button
                  onClick={() => toggleSeized(c.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10,
                    background: c.seized ? 'rgba(208, 192, 255, 0.25)' : `${PRIMARY_COLOR}15`,
                    border: `1px solid ${c.seized ? 'rgba(208, 192, 255, 0.45)' : PRIMARY_COLOR + '30'}`,
                    color: PRIMARY_COLOR, cursor: 'pointer',
                  }}
                >
                  {c.seized ? '✅ 已抓住' : '⏳ 待抓住'}
                </button>
              </div>
              {c.result && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  🎯 {c.result}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{c.createdAt}</div>
            </div>
          ))}
          {chances.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🚀 还没有机会
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BonusModule({ bonuses, setBonuses }: {
  bonuses: Bonus[]
  setBonuses: (fn: (prev: Bonus[]) => Bonus[]) => void
}) {
  const [bonus, setBonus] = useState('')
  const [source, setSource] = useState('')
  const [value, setValue] = useState('')

  const addBonus = () => {
    if (!bonus.trim()) return
    const item: Bonus = {
      id: `${Date.now()}`,
      bonus: bonus.trim(),
      source: source.trim(),
      value: value.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setBonuses((prev) => [item, ...prev])
    setBonus('')
    setSource('')
    setValue('')
  }

  const stats = {
    total: bonuses.length,
    withSource: bonuses.filter(b => b.source).length,
    withValue: bonuses.filter(b => b.value).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '收获总数', value: stats.total, icon: '🎁' },
          { label: '有来源', value: stats.withSource, icon: '🎯' },
          { label: '有价值', value: stats.withValue, icon: '💎' },
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
          🎁 意外收获
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录那些意料之外的惊喜收获
        </div>

        <textarea
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          placeholder="你获得了什么意外收获？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="这个收获来自哪里？"
          style={inputStyle}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="它对你有什么价值？"
          style={inputStyle}
        />

        <button
          onClick={addBonus}
          disabled={!bonus.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e8e0ff', fontSize: 12, letterSpacing: 3,
            cursor: bonus.trim() ? 'pointer' : 'not-allowed',
            opacity: bonus.trim() ? 1 : 0.5,
          }}
        >
          🎁 记录收获
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的收获</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bonuses.slice(0, 5).map((b) => (
            <div key={b.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🎁 {b.bonus}
              </div>
              {b.source && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  🎯 来源：{b.source}
                </div>
              )}
              {b.value && (
                <div style={{ fontSize: 11, color: '#f0d080', marginBottom: 8 }}>
                  💎 价值：{b.value}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{b.createdAt}</div>
            </div>
          ))}
          {bonuses.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎁 还没有收获
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExperimentModule({ experiments, setExperiments }: {
  experiments: Experiment[]
  setExperiments: (fn: (prev: Experiment[]) => Experiment[]) => void
}) {
  const [content, setContent] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [result, setResult] = useState('')

  const addExperiment = () => {
    if (!content.trim()) return
    const item: Experiment = {
      id: `${Date.now()}`,
      content: content.trim(),
      hypothesis: hypothesis.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setExperiments((prev) => [item, ...prev])
    setContent('')
    setHypothesis('')
    setResult('')
  }

  const stats = {
    total: experiments.length,
    withHypothesis: experiments.filter(e => e.hypothesis).length,
    withResult: experiments.filter(e => e.result).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '实验总数', value: stats.total, icon: '🧪' },
          { label: '有假设', value: stats.withHypothesis, icon: '💭' },
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
          🧪 扩张实验
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          大胆尝试新事物，记录你的发现
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="你做了什么实验？"
          style={textAreaStyle}
        />
        <textarea
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
          placeholder="你的假设是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="实验结果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addExperiment}
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
          🧪 记录实验
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的实验</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {experiments.slice(0, 5).map((e) => (
            <div key={e.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🧪 {e.content}
              </div>
              {e.hypothesis && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  💭 假设：{e.hypothesis}
                </div>
              )}
              {e.result && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  🎯 结果：{e.result}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{e.createdAt}</div>
            </div>
          ))}
          {experiments.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🧪 还没有实验
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#d0c0ff'
const SECONDARY_COLOR = '#b0a0f0'

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

const TAB_LIST = [
  { id: 'lucky', name: '幸运捕捉', icon: '🍀' },
  { id: 'chance', name: '突破机会', icon: '🚀' },
  { id: 'bonus', name: '意外收获', icon: '🎁' },
  { id: 'experiment', name: '扩张实验', icon: '🧪' },
]

export default function JupiterUranusPage() {
  const config = comboConfigs['jupiter-uranus']
  const [activeTab, setActiveTab] = useState<string>('lucky')
  const [luckies, setLuckies] = useLocalStorage<LuckyEvent[]>('ju-luckies', [])
  const [chances, setChances] = useLocalStorage<Chance[]>('ju-chances', [])
  const [bonuses, setBonuses] = useLocalStorage<Bonus[]>('ju-bonuses', [])
  const [experiments, setExperiments] = useLocalStorage<Experiment[]>('ju-experiments', [])

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
        {activeTab === 'lucky' && <LuckyModule luckies={luckies} setLuckies={setLuckies} />}
        {activeTab === 'chance' && <ChanceModule chances={chances} setChances={setChances} />}
        {activeTab === 'bonus' && <BonusModule bonuses={bonuses} setBonuses={setBonuses} />}
        {activeTab === 'experiment' && <ExperimentModule experiments={experiments} setExperiments={setExperiments} />}
      </div>
    </ComboShell>
  )
}
