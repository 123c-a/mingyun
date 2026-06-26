import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface InsightRecord {
  id: string
  insight: string
  source: string
  application: string
  createdAt: string
}

interface ConnectionRecord {
  id: string
  field1: string
  field2: string
  discovery: string
  value: string
  createdAt: string
}

interface BreakthroughRecord {
  id: string
  point: string
  verification: string
  impact: string
  createdAt: string
}

const SOURCE_OPTIONS = ['阅读', '对话', '冥想', '散步', '工作', '突然闪现', '梦境', '其他']

function InsightModule({ records, setRecords }: {
  records: InsightRecord[]
  setRecords: (fn: (prev: InsightRecord[]) => InsightRecord[]) => void
}) {
  const [insight, setInsight] = useState('')
  const [source, setSource] = useState('突然闪现')
  const [application, setApplication] = useState('')

  const addRecord = () => {
    if (!insight.trim()) return
    const item: InsightRecord = {
      id: `${Date.now()}`,
      insight: insight.trim(),
      source,
      application: application.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setInsight('')
    setApplication('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withApp: records.filter(r => r.application).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '洞察总数', value: stats.total, icon: '💡' },
          { label: '本月捕捉', value: stats.thisMonth, icon: '📅' },
          { label: '已应用', value: stats.withApp, icon: '🎯' },
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
          💡 洞察捕捉
        </div>
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="捕捉到了什么洞察？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
            {SOURCE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={application}
            onChange={(e) => setApplication(e.target.value)}
            placeholder="如何应用"
            style={inputStyle}
          />
        </div>
        <button
          onClick={addRecord}
          disabled={!insight.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: insight.trim() ? 'pointer' : 'not-allowed',
            opacity: insight.trim() ? 1 : 0.5,
          }}
        >
          💡 记录洞察
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的洞察</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>💡 {r.source}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 4 }}>{r.insight}</div>
              {r.application && <div style={{ fontSize: 11, color: '#a0f0a0' }}>应用: {r.application}</div>}
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💡 还没有洞察</div>
          )}
        </div>
      </div>
    </div>
  )
}

function ConnectionModule({ records, setRecords }: {
  records: ConnectionRecord[]
  setRecords: (fn: (prev: ConnectionRecord[]) => ConnectionRecord[]) => void
}) {
  const [field1, setField1] = useState('')
  const [field2, setField2] = useState('')
  const [discovery, setDiscovery] = useState('')
  const [value, setValue] = useState('')

  const addRecord = () => {
    if (!field1.trim() || !field2.trim()) return
    const item: ConnectionRecord = {
      id: `${Date.now()}`,
      field1: field1.trim(),
      field2: field2.trim(),
      discovery: discovery.trim(),
      value: value.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setField1('')
    setField2('')
    setDiscovery('')
    setValue('')
  }

  const stats = {
    total: records.length,
    withDiscovery: records.filter(r => r.discovery).length,
    withValue: records.filter(r => r.value).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '连接总数', value: stats.total, icon: '🔗' },
          { label: '有新发现', value: stats.withDiscovery, icon: '✨' },
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
          🔗 跨界连接
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            value={field1}
            onChange={(e) => setField1(e.target.value)}
            placeholder="领域一"
            style={inputStyle}
          />
          <input
            type="text"
            value={field2}
            onChange={(e) => setField2(e.target.value)}
            placeholder="领域二"
            style={inputStyle}
          />
        </div>
        <textarea
          value={discovery}
          onChange={(e) => setDiscovery(e.target.value)}
          placeholder="发现了什么连接？"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="这个连接的价值是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!field1.trim() || !field2.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: (field1.trim() && field2.trim()) ? 'pointer' : 'not-allowed',
            opacity: (field1.trim() && field2.trim()) ? 1 : 0.5,
          }}
        >
          🔗 记录连接
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的连接</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>{r.field1} ⚡ {r.field2}</div>
              {r.discovery && <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>发现: {r.discovery}</div>}
              {r.value && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>价值: {r.value}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🔗 还没有连接</div>
          )}
        </div>
      </div>
    </div>
  )
}

function BreakthroughModule({ records, setRecords }: {
  records: BreakthroughRecord[]
  setRecords: (fn: (prev: BreakthroughRecord[]) => BreakthroughRecord[]) => void
}) {
  const [point, setPoint] = useState('')
  const [verification, setVerification] = useState('')
  const [impact, setImpact] = useState('')

  const addRecord = () => {
    if (!point.trim()) return
    const item: BreakthroughRecord = {
      id: `${Date.now()}`,
      point: point.trim(),
      verification: verification.trim(),
      impact: impact.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setPoint('')
    setVerification('')
    setImpact('')
  }

  const stats = {
    total: records.length,
    verified: records.filter(r => r.verification).length,
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
          { label: '突破总数', value: stats.total, icon: '🚀' },
          { label: '已验证', value: stats.verified, icon: '✅' },
          { label: '本月突破', value: stats.thisMonth, icon: '📅' },
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
          🚀 突破思维
        </div>
        <textarea
          value={point}
          onChange={(e) => setPoint(e.target.value)}
          placeholder="突破点是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={verification}
          onChange={(e) => setVerification(e.target.value)}
          placeholder="如何验证这个突破？"
          style={textAreaStyle}
        />
        <textarea
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="这个突破的影响是什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!point.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: point.trim() ? 'pointer' : 'not-allowed',
            opacity: point.trim() ? 1 : 0.5,
          }}
        >
          🚀 记录突破
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的突破</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🚀 {r.point}</div>
              {r.verification && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>验证: {r.verification}</div>}
              {r.impact && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>影响: {r.impact}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🚀 还没有突破</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-jupiter-uranus'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-jupiter-uranus'].secondaryColor

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
  { id: 'insight', name: '洞察捕捉', icon: '💡' },
  { id: 'connection', name: '跨界连接', icon: '🔗' },
  { id: 'breakthrough', name: '突破思维', icon: '🚀' },
]

export default function MercuryJupiterUranusPage() {
  const config = comboConfigs['mercury-jupiter-uranus']
  const [activeTab, setActiveTab] = useState<string>('insight')
  const [insights, setInsights] = useLocalStorage<InsightRecord[]>('mju-insights', [])
  const [connections, setConnections] = useLocalStorage<ConnectionRecord[]>('mju-connections', [])
  const [breakthroughs, setBreakthroughs] = useLocalStorage<BreakthroughRecord[]>('mju-breakthroughs', [])

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
        {activeTab === 'insight' && <InsightModule records={insights} setRecords={setInsights} />}
        {activeTab === 'connection' && <ConnectionModule records={connections} setRecords={setConnections} />}
        {activeTab === 'breakthrough' && <BreakthroughModule records={breakthroughs} setRecords={setBreakthroughs} />}
      </div>
    </ComboShell>
  )
}
