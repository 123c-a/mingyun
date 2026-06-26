import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Shell {
  id: string
  pattern: string
  limit: string
  source: string
  createdAt: string
}

interface Crack {
  id: string
  moment: string
  trigger: string
  feeling: string
  createdAt: string
}

interface FreeExperiment {
  id: string
  newTry: string
  comparison: string
  effect: string
  createdAt: string
}

interface NewStructure {
  id: string
  structure: string
  content: string
  effect: string
  createdAt: string
}

function ShellModule({ shells, setShells }: {
  shells: Shell[]
  setShells: (fn: (prev: Shell[]) => Shell[]) => void
}) {
  const [pattern, setPattern] = useState('')
  const [limit, setLimit] = useState('')
  const [source, setSource] = useState('')

  const addShell = () => {
    if (!pattern.trim()) return
    const item: Shell = {
      id: `${Date.now()}`,
      pattern: pattern.trim(),
      limit: limit.trim(),
      source: source.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setShells((prev) => [item, ...prev])
    setPattern('')
    setLimit('')
    setSource('')
  }

  const stats = {
    total: shells.length,
    withLimit: shells.filter(s => s.limit).length,
    withSource: shells.filter(s => s.source).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '旧模式', value: stats.total, icon: '🐚' },
          { label: '有限制', value: stats.withLimit, icon: '🔒' },
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
          🐚 旧壳识别
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          识别束缚你的旧模式，看见它的限制和来源
        </div>

        <textarea
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="你发现了什么旧模式？"
          style={textAreaStyle}
        />
        <textarea
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="这个模式带来了什么限制？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="这个模式来自哪里？"
          style={inputStyle}
        />

        <button
          onClick={addShell}
          disabled={!pattern.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: pattern.trim() ? 'pointer' : 'not-allowed',
            opacity: pattern.trim() ? 1 : 0.5,
          }}
        >
          🐚 识别旧壳
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近识别的旧壳</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shells.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🐚 {s.pattern}
              </div>
              {s.limit && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8, color: '#ff9090' }}>
                  🔒 限制：{s.limit}
                </div>
              )}
              {s.source && (
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8 }}>
                  🎯 来源：{s.source}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{s.createdAt}</div>
            </div>
          ))}
          {shells.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🐚 还没有识别
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CrackModule({ cracks, setCracks }: {
  cracks: Crack[]
  setCracks: (fn: (prev: Crack[]) => Crack[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [trigger, setTrigger] = useState('')
  const [feeling, setFeeling] = useState('')

  const addCrack = () => {
    if (!moment.trim()) return
    const item: Crack = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      trigger: trigger.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setCracks((prev) => [item, ...prev])
    setMoment('')
    setTrigger('')
    setFeeling('')
  }

  const stats = {
    total: cracks.length,
    withTrigger: cracks.filter(c => c.trigger).length,
    withFeeling: cracks.filter(c => c.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '裂缝总数', value: stats.total, icon: '⚡' },
          { label: '有触发', value: stats.withTrigger, icon: '🎯' },
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
          ⚡ 裂缝时刻
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录打破旧壳的那个瞬间
        </div>

        <textarea
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="什么时候打破了旧模式？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="是什么触发了这个突破？"
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="那一刻的感受如何？"
          style={inputStyle}
        />

        <button
          onClick={addCrack}
          disabled={!moment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: moment.trim() ? 'pointer' : 'not-allowed',
            opacity: moment.trim() ? 1 : 0.5,
          }}
        >
          ⚡ 记录裂缝
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的裂缝</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cracks.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                ⚡ {c.moment}
              </div>
              {c.trigger && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  🎯 触发：{c.trigger}
                </div>
              )}
              {c.feeling && (
                <div style={{ fontSize: 11, color: '#f0b0d0', marginBottom: 8 }}>
                  💭 {c.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{c.createdAt}</div>
            </div>
          ))}
          {cracks.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ⚡ 还没有裂缝
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FreeExperimentModule({ experiments, setExperiments }: {
  experiments: FreeExperiment[]
  setExperiments: (fn: (prev: FreeExperiment[]) => FreeExperiment[]) => void
}) {
  const [newTry, setNewTry] = useState('')
  const [comparison, setComparison] = useState('')
  const [effect, setEffect] = useState('')

  const addExperiment = () => {
    if (!newTry.trim()) return
    const item: FreeExperiment = {
      id: `${Date.now()}`,
      newTry: newTry.trim(),
      comparison: comparison.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setExperiments((prev) => [item, ...prev])
    setNewTry('')
    setComparison('')
    setEffect('')
  }

  const stats = {
    total: experiments.length,
    withComparison: experiments.filter(e => e.comparison).length,
    withEffect: experiments.filter(e => e.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '尝试总数', value: stats.total, icon: '🕊️' },
          { label: '有对比', value: stats.withComparison, icon: '⚖️' },
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
          🕊️ 自由实验
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          勇敢尝试新方式，对比旧模式的效果
        </div>

        <textarea
          value={newTry}
          onChange={(e) => setNewTry(e.target.value)}
          placeholder="你尝试了什么新方式？"
          style={textAreaStyle}
        />
        <textarea
          value={comparison}
          onChange={(e) => setComparison(e.target.value)}
          placeholder="和旧模式相比有什么不同？"
          style={textAreaStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addExperiment}
          disabled={!newTry.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: newTry.trim() ? 'pointer' : 'not-allowed',
            opacity: newTry.trim() ? 1 : 0.5,
          }}
        >
          🕊️ 记录尝试
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的尝试</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {experiments.slice(0, 5).map((e) => (
            <div key={e.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🕊️ {e.newTry}
              </div>
              {e.comparison && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>
                  ⚖️ {e.comparison}
                </div>
              )}
              {e.effect && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  ✨ 效果：{e.effect}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{e.createdAt}</div>
            </div>
          ))}
          {experiments.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🕊️ 还没有尝试
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StructureModule({ structures, setStructures }: {
  structures: NewStructure[]
  setStructures: (fn: (prev: NewStructure[]) => NewStructure[]) => void
}) {
  const [structure, setStructure] = useState('')
  const [content, setContent] = useState('')
  const [effect, setEffect] = useState('')

  const addStructure = () => {
    if (!structure.trim()) return
    const item: NewStructure = {
      id: `${Date.now()}`,
      structure: structure.trim(),
      content: content.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setStructures((prev) => [item, ...prev])
    setStructure('')
    setContent('')
    setEffect('')
  }

  const stats = {
    total: structures.length,
    withContent: structures.filter(s => s.content).length,
    withEffect: structures.filter(s => s.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '新结构', value: stats.total, icon: '🏗️' },
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
          🏗️ 新结构
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          建立支持你新生活的新结构
        </div>

        <input
          type="text"
          value={structure}
          onChange={(e) => setStructure(e.target.value)}
          placeholder="这是什么样的新结构？"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="具体内容是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addStructure}
          disabled={!structure.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d8dce8', fontSize: 12, letterSpacing: 3,
            cursor: structure.trim() ? 'pointer' : 'not-allowed',
            opacity: structure.trim() ? 1 : 0.5,
          }}
        >
          🏗️ 建立结构
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的结构</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {structures.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🏗️ {s.structure}
              </div>
              {s.content && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  📝 {s.content}
                </div>
              )}
              {s.effect && (
                <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 8 }}>
                  ✨ 效果：{s.effect}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{s.createdAt}</div>
            </div>
          ))}
          {structures.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏗️ 还没有结构
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#b0b8d0'
const SECONDARY_COLOR = '#90a0c0'

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

const TAB_LIST = [
  { id: 'shell', name: '旧壳识别', icon: '🐚' },
  { id: 'crack', name: '裂缝时刻', icon: '⚡' },
  { id: 'experiment', name: '自由实验', icon: '🕊️' },
  { id: 'structure', name: '新结构', icon: '🏗️' },
]

export default function SaturnUranusPage() {
  const config = comboConfigs['saturn-uranus']
  const [activeTab, setActiveTab] = useState<string>('shell')
  const [shells, setShells] = useLocalStorage<Shell[]>('su-shells', [])
  const [cracks, setCracks] = useLocalStorage<Crack[]>('su-cracks', [])
  const [experiments, setExperiments] = useLocalStorage<FreeExperiment[]>('su-experiments', [])
  const [structures, setStructures] = useLocalStorage<NewStructure[]>('su-structures', [])

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
        {activeTab === 'shell' && <ShellModule shells={shells} setShells={setShells} />}
        {activeTab === 'crack' && <CrackModule cracks={cracks} setCracks={setCracks} />}
        {activeTab === 'experiment' && <FreeExperimentModule experiments={experiments} setExperiments={setExperiments} />}
        {activeTab === 'structure' && <StructureModule structures={structures} setStructures={setStructures} />}
      </div>
    </ComboShell>
  )
}
