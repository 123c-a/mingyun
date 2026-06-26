import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Unconditional {
  id: string
  target: string
  practice: string
  feeling: string
  createdAt: string
}

interface Compassion {
  id: string
  target: string
  difficulty: string
  insight: string
  createdAt: string
}

interface Resonance {
  id: string
  person: string
  resonance: string
  feeling: string
  createdAt: string
}

interface Service {
  id: string
  target: string
  action: string
  harvest: string
  createdAt: string
}

const TARGET_TYPE_OPTIONS = [
  '自己', '家人', '朋友', '陌生人', '敌人', '所有人', '其他'
]

function UnconditionalModule({ unconditionals, setUnconditionals }: {
  unconditionals: Unconditional[]
  setUnconditionals: (fn: (prev: Unconditional[]) => Unconditional[]) => void
}) {
  const [target, setTarget] = useState('自己')
  const [practice, setPractice] = useState('')
  const [feeling, setFeeling] = useState('')

  const addUnconditional = () => {
    if (!practice.trim()) return
    const item: Unconditional = {
      id: `${Date.now()}`,
      target,
      practice: practice.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setUnconditionals((prev) => [item, ...prev])
    setPractice('')
    setFeeling('')
  }

  const stats = {
    total: unconditionals.length,
    targets: new Set(unconditionals.map(u => u.target)).size,
    withFeeling: unconditionals.filter(u => u.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '无条件爱', value: stats.total, icon: '💙' },
          { label: '爱的对象', value: stats.targets, icon: '💞' },
          { label: '有感受记录', value: stats.withFeeling, icon: '💫' },
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
          💙 无条件爱
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          练习不带条件的爱
        </div>

        <select value={target} onChange={(e) => setTarget(e.target.value)} style={selectStyle}>
          {TARGET_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <textarea
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="练习内容……"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="练习后的感受（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addUnconditional}
          disabled={!practice.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: practice.trim() ? 'pointer' : 'not-allowed',
            opacity: practice.trim() ? 1 : 0.5,
          }}
        >
          💙 记录练习
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>无条件爱</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {unconditionals.slice(0, 5).map((u) => (
            <div key={u.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  💙 对{u.target}的爱
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{u.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{u.practice}</div>
              {u.feeling && (
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8, fontStyle: 'italic' }}>
                  {u.feeling}
                </div>
              )}
            </div>
          ))}
          {unconditionals.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💙 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CompassionModule({ compassions, setCompassions }: {
  compassions: Compassion[]
  setCompassions: (fn: (prev: Compassion[]) => Compassion[]) => void
}) {
  const [target, setTarget] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [insight, setInsight] = useState('')

  const addCompassion = () => {
    if (!target.trim()) return
    const item: Compassion = {
      id: `${Date.now()}`,
      target: target.trim(),
      difficulty: difficulty.trim(),
      insight: insight.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setCompassions((prev) => [item, ...prev])
    setTarget('')
    setDifficulty('')
    setInsight('')
  }

  const stats = {
    total: compassions.length,
    withDifficulty: compassions.filter(c => c.difficulty).length,
    withInsight: compassions.filter(c => c.insight).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '慈悲心', value: stats.total, icon: '🙏' },
          { label: '有困难记录', value: stats.withDifficulty, icon: '💪' },
          { label: '有洞见', value: stats.withInsight, icon: '💡' },
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
          🙏 慈悲心
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          对难以共情的人生起慈悲
        </div>

        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="慈悲的对象是谁？"
          style={inputStyle}
        />
        <textarea
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          placeholder="生起慈悲的困难在哪里？（可选）"
          style={textAreaStyle}
        />
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="从中获得的洞见（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addCompassion}
          disabled={!target.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: target.trim() ? 'pointer' : 'not-allowed',
            opacity: target.trim() ? 1 : 0.5,
          }}
        >
          🙏 记录慈悲
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>慈悲心记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {compassions.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🙏 对{c.target}的慈悲
              </div>
              {c.difficulty && (
                <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6, marginBottom: 8 }}>
                  💪 困难：{c.difficulty}
                </div>
              )}
              {c.insight && (
                <div style={{ fontSize: 12, color: '#a0e0b0', lineHeight: 1.6 }}>
                  💡 洞见：{c.insight}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{c.createdAt}</div>
            </div>
          ))}
          {compassions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🙏 还没有慈悲记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResonanceModule({ resonances, setResonances }: {
  resonances: Resonance[]
  setResonances: (fn: (prev: Resonance[]) => Resonance[]) => void
}) {
  const [person, setPerson] = useState('')
  const [resonance, setResonance] = useState('')
  const [feeling, setFeeling] = useState('')

  const addResonance = () => {
    if (!person.trim()) return
    const item: Resonance = {
      id: `${Date.now()}`,
      person: person.trim(),
      resonance: resonance.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setResonances((prev) => [item, ...prev])
    setPerson('')
    setResonance('')
    setFeeling('')
  }

  const stats = {
    total: resonances.length,
    withResonance: resonances.filter(r => r.resonance).length,
    withFeeling: resonances.filter(r => r.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '灵魂共鸣', value: stats.total, icon: '🎵' },
          { label: '有共鸣点', value: stats.withResonance, icon: '✨' },
          { label: '有感受', value: stats.withFeeling, icon: '💫' },
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
          🎵 灵魂共鸣
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          记录那些灵魂深处的共鸣时刻
        </div>

        <input
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="共鸣的对象是谁？"
          style={inputStyle}
        />
        <textarea
          value={resonance}
          onChange={(e) => setResonance(e.target.value)}
          placeholder="你们在哪里产生了共鸣？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="共鸣时的感受（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addResonance}
          disabled={!person.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: person.trim() ? 'pointer' : 'not-allowed',
            opacity: person.trim() ? 1 : 0.5,
          }}
        >
          🎵 记录共鸣
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>灵魂共鸣</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {resonances.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                🎵 与{r.person}的共鸣
              </div>
              {r.resonance && (
                <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 8 }}>
                  {r.resonance}
                </div>
              )}
              {r.feeling && (
                <div style={{ fontSize: 11, opacity: 0.6, fontStyle: 'italic' }}>
                  {r.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {resonances.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎵 还没有共鸣记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ServiceModule({ services, setServices }: {
  services: Service[]
  setServices: (fn: (prev: Service[]) => Service[]) => void
}) {
  const [target, setTarget] = useState('')
  const [action, setAction] = useState('')
  const [harvest, setHarvest] = useState('')

  const addService = () => {
    if (!action.trim()) return
    const item: Service = {
      id: `${Date.now()}`,
      target: target.trim(),
      action: action.trim(),
      harvest: harvest.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setServices((prev) => [item, ...prev])
    setTarget('')
    setAction('')
    setHarvest('')
  }

  const stats = {
    total: services.length,
    targets: new Set(services.map(s => s.target).filter(Boolean)).size,
    withHarvest: services.filter(s => s.harvest).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '服务之爱', value: stats.total, icon: '🤲' },
          { label: '服务对象', value: stats.targets, icon: '👥' },
          { label: '有收获', value: stats.withHarvest, icon: '🌾' },
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
          🤲 服务之爱
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          通过服务他人表达爱
        </div>

        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="服务对象（可选）"
          style={inputStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你做了什么服务？"
          style={textAreaStyle}
        />
        <textarea
          value={harvest}
          onChange={(e) => setHarvest(e.target.value)}
          placeholder="你的收获是什么？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addService}
          disabled={!action.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0e8ff', fontSize: 12, letterSpacing: 3,
            cursor: action.trim() ? 'pointer' : 'not-allowed',
            opacity: action.trim() ? 1 : 0.5,
          }}
        >
          🤲 记录服务
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>服务之爱</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {services.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {s.target ? `服务：${s.target}` : '服务他人'}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{s.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{s.action}</div>
              {s.harvest && (
                <div style={{ fontSize: 12, color: '#a0e0b0', marginTop: 8 }}>
                  🌾 收获：{s.harvest}
                </div>
              )}
            </div>
          ))}
          {services.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🤲 还没有服务记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#a0c8ff'
const SECONDARY_COLOR = '#90b0f0'

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
  { id: 'unconditional', name: '无条件爱', icon: '💙' },
  { id: 'compassion', name: '慈悲心', icon: '🙏' },
  { id: 'resonance', name: '灵魂共鸣', icon: '🎵' },
  { id: 'service', name: '服务之爱', icon: '🤲' },
]

export default function VenusNeptunePage() {
  const config = comboConfigs['venus-neptune']
  const [activeTab, setActiveTab] = useState<string>('unconditional')
  const [unconditionals, setUnconditionals] = useLocalStorage<Unconditional[]>('vn-unconditionals', [])
  const [compassions, setCompassions] = useLocalStorage<Compassion[]>('vn-compassions', [])
  const [resonances, setResonances] = useLocalStorage<Resonance[]>('vn-resonances', [])
  const [services, setServices] = useLocalStorage<Service[]>('vn-services', [])

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
        {activeTab === 'unconditional' && <UnconditionalModule unconditionals={unconditionals} setUnconditionals={setUnconditionals} />}
        {activeTab === 'compassion' && <CompassionModule compassions={compassions} setCompassions={setCompassions} />}
        {activeTab === 'resonance' && <ResonanceModule resonances={resonances} setResonances={setResonances} />}
        {activeTab === 'service' && <ServiceModule services={services} setServices={setServices} />}
      </div>
    </ComboShell>
  )
}
