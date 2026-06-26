import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface LimitRecord {
  id: string
  limit: string
  source: string
  impact: string
  createdAt: string
}

interface DreamBoundaryRecord {
  id: string
  dream: string
  boundary: string
  adjustment: string
  createdAt: string
}

interface WisdomRecord {
  id: string
  wisdom: string
  practice: string
  effect: string
  createdAt: string
}

const SOURCE_OPTIONS = ['成长经历', '家庭教育', '社会文化', '工作环境', '自己设定', '其他']

function LimitModule({ records, setRecords }: {
  records: LimitRecord[]
  setRecords: (fn: (prev: LimitRecord[]) => LimitRecord[]) => void
}) {
  const [limit, setLimit] = useState('')
  const [source, setSource] = useState('自己设定')
  const [impact, setImpact] = useState('')

  const addRecord = () => {
    if (!limit.trim()) return
    const item: LimitRecord = {
      id: `${Date.now()}`,
      limit: limit.trim(),
      source,
      impact: impact.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setLimit('')
    setImpact('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '限制总数', value: stats.total, icon: '🚧' },
          { label: '本月识别', value: stats.thisMonth, icon: '📅' },
          { label: '边界探索', value: stats.total, icon: '🔍' },
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
          🚧 限制识别
        </div>
        <textarea
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="这是什么限制？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
            {SOURCE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            placeholder="影响是什么"
            style={inputStyle}
          />
        </div>
        <button
          onClick={addRecord}
          disabled={!limit.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: limit.trim() ? 'pointer' : 'not-allowed',
            opacity: limit.trim() ? 1 : 0.5,
          }}
        >
          🚧 记录限制
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近识别的限制</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: PRIMARY_COLOR }}>🚧 {r.limit}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.source}</span>
              </div>
              {r.impact && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>影响: {r.impact}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🚧 还没有限制</div>
          )}
        </div>
      </div>
    </div>
  )
}

function DreamBoundaryModule({ records, setRecords }: {
  records: DreamBoundaryRecord[]
  setRecords: (fn: (prev: DreamBoundaryRecord[]) => DreamBoundaryRecord[]) => void
}) {
  const [dream, setDream] = useState('')
  const [boundary, setBoundary] = useState('')
  const [adjustment, setAdjustment] = useState('')

  const addRecord = () => {
    if (!dream.trim()) return
    const item: DreamBoundaryRecord = {
      id: `${Date.now()}`,
      dream: dream.trim(),
      boundary: boundary.trim(),
      adjustment: adjustment.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setDream('')
    setBoundary('')
    setAdjustment('')
  }

  const stats = {
    total: records.length,
    withBoundary: records.filter(r => r.boundary).length,
    withAdjustment: records.filter(r => r.adjustment).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '梦想总数', value: stats.total, icon: '🌟' },
          { label: '已有边界', value: stats.withBoundary, icon: '🚧' },
          { label: '已调整', value: stats.withAdjustment, icon: '✨' },
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
          🌟 梦想边界
        </div>
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="这个梦想是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={boundary}
          onChange={(e) => setBoundary(e.target.value)}
          placeholder="边界在哪里？"
          style={textAreaStyle}
        />
        <textarea
          value={adjustment}
          onChange={(e) => setAdjustment(e.target.value)}
          placeholder="调整方案是什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!dream.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: dream.trim() ? 'pointer' : 'not-allowed',
            opacity: dream.trim() ? 1 : 0.5,
          }}
        >
          🌟 记录边界
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的边界</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🌟 {r.dream}</div>
              {r.boundary && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>边界: {r.boundary}</div>}
              {r.adjustment && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>调整: {r.adjustment}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌟 还没有边界</div>
          )}
        </div>
      </div>
    </div>
  )
}

function WisdomModule({ records, setRecords }: {
  records: WisdomRecord[]
  setRecords: (fn: (prev: WisdomRecord[]) => WisdomRecord[]) => void
}) {
  const [wisdom, setWisdom] = useState('')
  const [practice, setPractice] = useState('')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!wisdom.trim()) return
    const item: WisdomRecord = {
      id: `${Date.now()}`,
      wisdom: wisdom.trim(),
      practice: practice.trim(),
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setWisdom('')
    setPractice('')
    setEffect('')
  }

  const stats = {
    total: records.length,
    withPractice: records.filter(r => r.practice).length,
    withEffect: records.filter(r => r.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '智慧总数', value: stats.total, icon: '🧙' },
          { label: '已实践', value: stats.withPractice, icon: '✨' },
          { label: '有效智慧', value: stats.withEffect, icon: '🎯' },
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
          🧙 时间智慧
        </div>
        <textarea
          value={wisdom}
          onChange={(e) => setWisdom(e.target.value)}
          placeholder="这是什么样的时间智慧？"
          style={textAreaStyle}
        />
        <textarea
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="如何在实践中应用？"
          style={textAreaStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="效果如何？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!wisdom.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: wisdom.trim() ? 'pointer' : 'not-allowed',
            opacity: wisdom.trim() ? 1 : 0.5,
          }}
        >
          🧙 记录智慧
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的智慧</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🧙 {r.wisdom}</div>
              {r.practice && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>实践: {r.practice}</div>}
              {r.effect && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>效果: {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🧙 还没有智慧</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-saturn-neptune'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-saturn-neptune'].secondaryColor

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
  { id: 'limit', name: '限制识别', icon: '🚧' },
  { id: 'dreamboundary', name: '梦想边界', icon: '🌟' },
  { id: 'wisdom', name: '时间智慧', icon: '🧙' },
]

export default function MercurySaturnNeptunePage() {
  const config = comboConfigs['mercury-saturn-neptune']
  const [activeTab, setActiveTab] = useState<string>('limit')
  const [limits, setLimits] = useLocalStorage<LimitRecord[]>('msn-limits', [])
  const [dreamboundaries, setDreamBoundaries] = useLocalStorage<DreamBoundaryRecord[]>('msn-dreamboundaries', [])
  const [wisdoms, setWisdoms] = useLocalStorage<WisdomRecord[]>('msn-wisdoms', [])

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
        {activeTab === 'limit' && <LimitModule records={limits} setRecords={setLimits} />}
        {activeTab === 'dreamboundary' && <DreamBoundaryModule records={dreamboundaries} setRecords={setDreamBoundaries} />}
        {activeTab === 'wisdom' && <WisdomModule records={wisdoms} setRecords={setWisdoms} />}
      </div>
    </ComboShell>
  )
}
