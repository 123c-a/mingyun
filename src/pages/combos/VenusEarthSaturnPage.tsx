import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface GuardianItem {
  id: string
  target: string
  way: string
  persistence: string
  createdAt: string
}

interface CommitmentRecord {
  id: string
  commitment: string
  fulfillment: string
  feeling: string
  createdAt: string
}

interface LongTermRelation {
  id: string
  relation: string
  stage: string
  status: string
  createdAt: string
}

function GuardianModule({ records, setRecords }: {
  records: GuardianItem[]
  setRecords: (fn: (prev: GuardianItem[]) => GuardianItem[]) => void
}) {
  const [target, setTarget] = useState('')
  const [way, setWay] = useState('')
  const [persistence, setPersistence] = useState('')

  const addRecord = () => {
    if (!target.trim()) return
    const item: GuardianItem = {
      id: `${Date.now()}`,
      target: target.trim(),
      way: way.trim(),
      persistence: persistence.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setTarget('')
    setWay('')
    setPersistence('')
  }

  const stats = {
    total: records.length,
    persistent: records.filter(r => r.persistence === '坚持中' || r.persistence === '已坚持很久').length,
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
          { label: '守护清单', value: stats.total, icon: '🛡️' },
          { label: '坚持中', value: stats.persistent, icon: '⏰' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
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
          🛡️ 守护清单
        </div>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="守护对象是谁？"
          style={inputStyle}
        />
        <input
          type="text"
          value={way}
          onChange={(e) => setWay(e.target.value)}
          placeholder="如何守护？"
          style={inputStyle}
        />
        <input
          type="text"
          value={persistence}
          onChange={(e) => setPersistence(e.target.value)}
          placeholder="坚持情况（刚开始/坚持中/已坚持很久）"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!target.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: target.trim() ? 'pointer' : 'not-allowed',
            opacity: target.trim() ? 1 : 0.5,
          }}
        >
          🛡️ 添加守护
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.target}</div>
              {r.way && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>🛡️ {r.way}</div>}
              {r.persistence && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>⏰ {r.persistence}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🛡️ 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CommitmentModule({ records, setRecords }: {
  records: CommitmentRecord[]
  setRecords: (fn: (prev: CommitmentRecord[]) => CommitmentRecord[]) => void
}) {
  const [commitment, setCommitment] = useState('')
  const [fulfillment, setFulfillment] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!commitment.trim()) return
    const item: CommitmentRecord = {
      id: `${Date.now()}`,
      commitment: commitment.trim(),
      fulfillment: fulfillment.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setCommitment('')
    setFulfillment('')
    setFeeling('')
  }

  const stats = {
    total: records.length,
    fulfilled: records.filter(r => r.fulfillment === '已兑现' || r.fulfillment === '部分兑现').length,
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
          { label: '承诺记录', value: stats.total, icon: '🤝' },
          { label: '已兑现', value: stats.fulfilled, icon: '✅' },
          { label: '本月承诺', value: stats.thisMonth, icon: '📅' },
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
          🤝 承诺记录
        </div>
        <input
          type="text"
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          placeholder="做了什么承诺？"
          style={inputStyle}
        />
        <input
          type="text"
          value={fulfillment}
          onChange={(e) => setFulfillment(e.target.value)}
          placeholder="兑现情况（待兑现/已兑现/部分兑现）"
          style={inputStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="感受如何？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!commitment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: commitment.trim() ? 'pointer' : 'not-allowed',
            opacity: commitment.trim() ? 1 : 0.5,
          }}
        >
          🤝 记录承诺
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.commitment}</div>
              {r.fulfillment && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>✅ {r.fulfillment}</div>}
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💭 {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🤝 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LongTermRelationModule({ records, setRecords }: {
  records: LongTermRelation[]
  setRecords: (fn: (prev: LongTermRelation[]) => LongTermRelation[]) => void
}) {
  const [relation, setRelation] = useState('')
  const [stage, setStage] = useState('')
  const [status, setStatus] = useState('')

  const addRecord = () => {
    if (!relation.trim()) return
    const item: LongTermRelation = {
      id: `${Date.now()}`,
      relation: relation.trim(),
      stage: stage.trim(),
      status: status.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setRelation('')
    setStage('')
    setStatus('')
  }

  const stats = {
    total: records.length,
    growing: records.filter(r => r.stage === '成长期' || r.stage === '成熟期').length,
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
          { label: '长期关系', value: stats.total, icon: '💎' },
          { label: '成长中', value: stats.growing, icon: '🌱' },
          { label: '本月更新', value: stats.thisMonth, icon: '📅' },
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
          💎 长期关系
        </div>
        <input
          type="text"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="是什么关系？"
          style={inputStyle}
        />
        <input
          type="text"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          placeholder="发展阶段（初识/熟悉/亲密/成长期/成熟期）"
          style={inputStyle}
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="状态如何？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!relation.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: relation.trim() ? 'pointer' : 'not-allowed',
            opacity: relation.trim() ? 1 : 0.5,
          }}
        >
          💎 记录关系
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
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>{r.relation}</div>
              {r.stage && <div style={{ fontSize: 11, color: PRIMARY_COLOR, marginBottom: 4 }}>📍 {r.stage}</div>}
              {r.status && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>💎 {r.status}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💎 还没有记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const config = comboConfigs['venus-earth-saturn']
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
  { id: 'guardian', name: '守护清单', icon: '🛡️' },
  { id: 'commitment', name: '承诺记录', icon: '🤝' },
  { id: 'relation', name: '长期关系', icon: '💎' },
]

export default function VenusEarthSaturnPage() {
  const [activeTab, setActiveTab] = useState<string>('guardian')
  const [guardianRecords, setGuardianRecords] = useLocalStorage<GuardianItem[]>('ves-guardian', [])
  const [commitmentRecords, setCommitmentRecords] = useLocalStorage<CommitmentRecord[]>('ves-commitment', [])
  const [relationRecords, setRelationRecords] = useLocalStorage<LongTermRelation[]>('ves-relation', [])

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
        {activeTab === 'guardian' && <GuardianModule records={guardianRecords} setRecords={setGuardianRecords} />}
        {activeTab === 'commitment' && <CommitmentModule records={commitmentRecords} setRecords={setCommitmentRecords} />}
        {activeTab === 'relation' && <LongTermRelationModule records={relationRecords} setRecords={setRelationRecords} />}
      </div>
    </ComboShell>
  )
}
