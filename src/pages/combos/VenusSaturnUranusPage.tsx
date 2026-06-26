import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface StructureLove {
  id: string
  structure: string
  balance: string
  effect: string
  createdAt: string
}

interface OldRuleBreak {
  id: string
  oldRule: string
  newRule: string
  feeling: string
  createdAt: string
}

interface LoveRebuild {
  id: string
  content: string
  process: string
  result: string
  createdAt: string
}

function StructureLoveModule({ records, setRecords }: {
  records: StructureLove[]
  setRecords: (fn: (prev: StructureLove[]) => StructureLove[]) => void
}) {
  const [structure, setStructure] = useState('')
  const [balance, setBalance] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!structure.trim()) return
    const item: StructureLove = {
      id: `${Date.now()}`,
      structure: structure.trim(),
      balance: balance.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setStructure('')
    setBalance('')
    setEffect('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    positive: records.filter(r => r.effect === '很好' || r.effect === '正面').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '结构与爱', value: stats.total, icon: '🏛️' },
          { label: '本月记录', value: stats.thisMonth, icon: '📅' },
          { label: '效果正面', value: stats.positive, icon: '✨' },
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
          🏛️ 结构与爱
        </div>
        <input
          type="text"
          value={structure}
          onChange={(e) => setStructure(e.target.value)}
          placeholder="建立了什么结构？"
          style={inputStyle}
        />
        <input
          type="text"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="平衡点在哪里？"
          style={inputStyle}
        />
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？（很好/一般/待观察）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!structure.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: structure.trim() ? 'pointer' : 'not-allowed',
            opacity: structure.trim() ? 1 : 0.5,
          }}
        >
          🏛️ 记录结构
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.structure}</div>
              {r.balance && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>⚖️ {r.balance}</div>}
              {r.effect && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>✨ {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏛️ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OldRuleBreakModule({ records, setRecords }: {
  records: OldRuleBreak[]
  setRecords: (fn: (prev: OldRuleBreak[]) => OldRuleBreak[]) => void
}) {
  const [oldRule, setOldRule] = useState('')
  const [newRule, setNewRule] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!oldRule.trim()) return
    const item: OldRuleBreak = {
      id: `${Date.now()}`,
      oldRule: oldRule.trim(),
      newRule: newRule.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setOldRule('')
    setNewRule('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    positive: records.filter(r => r.feeling === '很好' || r.feeling === '轻松').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '旧规则突破', value: stats.total, icon: '🔨' },
          { label: '本月突破', value: stats.thisMonth, icon: '📅' },
          { label: '感觉良好', value: stats.positive, icon: '💚' },
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
          🔨 旧规则突破
        </div>
        <input
          type="text"
          value={oldRule}
          onChange={(e) => setOldRule(e.target.value)}
          placeholder="旧规则是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder='新规则是什么？（如果没有新规则可填"打破"）'
          style={inputStyle}
        />
        <input
          type="text"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？（很好/一般/不安）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!oldRule.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: oldRule.trim() ? 'pointer' : 'not-allowed',
            opacity: oldRule.trim() ? 1 : 0.5,
          }}
        >
          🔨 突破规则
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>
                <span style={{ color: '#ff9090' }}>❌ {r.oldRule}</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>✅ {r.newRule}</div>
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💚 {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔨 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoveRebuildModule({ records, setRecords }: {
  records: LoveRebuild[]
  setRecords: (fn: (prev: LoveRebuild[]) => LoveRebuild[]) => void
}) {
  const [content, setContent] = useState('')
  const [process, setProcess] = useState('')
  const [result, setResult] = useState('')

  const addRecord = () => {
    if (!content.trim()) return
    const item: LoveRebuild = {
      id: `${Date.now()}`,
      content: content.trim(),
      process: process.trim(),
      result: result.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setContent('')
    setProcess('')
    setResult('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    positive: records.filter(r => r.result === '成功' || r.result === '进展顺利').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '爱的重建', value: stats.total, icon: '🔧' },
          { label: '本月重建', value: stats.thisMonth, icon: '📅' },
          { label: '进展顺利', value: stats.positive, icon: '🌱' },
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
          🔧 爱的重建
        </div>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="重建什么内容？"
          style={inputStyle}
        />
        <textarea
          value={process}
          onChange={(e) => setProcess(e.target.value)}
          placeholder="过程如何？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="结果如何？（成功/进行中/待观察）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
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
          🔧 记录重建
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.content}</div>
              {r.process && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🔧 {r.process}</div>}
              {r.result && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>🌱 {r.result}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🔧 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-saturn-uranus']
const PRIMARY_COLOR = config.primaryColor
const SECONDARY_COLOR = config.secondaryColor

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

const TAB_LIST = [
  { id: 'structure', name: '结构与爱', icon: '🏛️' },
  { id: 'break', name: '旧规则突破', icon: '🔨' },
  { id: 'rebuild', name: '爱的重建', icon: '🔧' },
]

export default function VenusSaturnUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('structure')
  const [structureRecords, setStructureRecords] = useLocalStorage<StructureLove[]>('vsu-structure', [])
  const [breakRecords, setBreakRecords] = useLocalStorage<OldRuleBreak[]>('vsu-break', [])
  const [rebuildRecords, setRebuildRecords] = useLocalStorage<LoveRebuild[]>('vsu-rebuild', [])

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
        {activeTab === 'structure' && <StructureLoveModule records={structureRecords} setRecords={setStructureRecords} />}
        {activeTab === 'break' && <OldRuleBreakModule records={breakRecords} setRecords={setBreakRecords} />}
        {activeTab === 'rebuild' && <LoveRebuildModule records={rebuildRecords} setRecords={setRebuildRecords} />}
      </div>
    </ComboShell>
  )
}
