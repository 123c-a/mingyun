import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface BattleRecord {
  id: string
  battle: string
  days: string
  status: string
  createdAt: string
}

interface TrainingRecord {
  id: string
  content: string
  frequency: string
  effect: string
  createdAt: string
}

interface SetbackRecord {
  id: string
  setback: string
  transform: string
  growth: string
  createdAt: string
}

const STATUS_OPTIONS = ['刚开始', '进行中', '坚持中', '已完成']
const FREQUENCY_OPTIONS = ['每日', '每周', '偶尔']

function BattleModule({ records, setRecords }: {
  records: BattleRecord[]
  setRecords: (fn: (prev: BattleRecord[]) => BattleRecord[]) => void
}) {
  const [battle, setBattle] = useState('')
  const [days, setDays] = useState('')
  const [status, setStatus] = useState('刚开始')

  const addRecord = () => {
    if (!battle.trim()) return
    const item: BattleRecord = {
      id: `${Date.now()}`,
      battle: battle.trim(),
      days: days.trim() || '0',
      status,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setBattle('')
    setDays('')
  }

  const stats = {
    total: records.length,
    totalDays: records.reduce((sum, r) => sum + parseInt(r.days || '0'), 0),
    ongoing: records.filter(r => r.status === '进行中' || r.status === '坚持中').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '战役总数', value: stats.total, icon: '⚔️' },
          { label: '累计天数', value: stats.totalDays, icon: '📆' },
          { label: '进行中', value: stats.ongoing, icon: '🔄' },
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
          ⚔️ 长期战役
        </div>
        <textarea
          value={battle}
          onChange={(e) => setBattle(e.target.value)}
          placeholder="这是一场什么战役？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="已坚持天数"
            style={inputStyle}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
            {STATUS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={addRecord}
          disabled={!battle.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: battle.trim() ? 'pointer' : 'not-allowed',
            opacity: battle.trim() ? 1 : 0.5,
          }}
        >
          ⚔️ 记录战役
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的战役</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>⚔️ {r.battle}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.status}</span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>已坚持 {r.days} 天</div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>⚔️ 还没有战役</div>
          )}
        </div>
      </div>
    </div>
  )
}

function TrainingModule({ records, setRecords }: {
  records: TrainingRecord[]
  setRecords: (fn: (prev: TrainingRecord[]) => TrainingRecord[]) => void
}) {
  const [content, setContent] = useState('')
  const [frequency, setFrequency] = useState('每日')
  const [effect, setEffect] = useState('')

  const addRecord = () => {
    if (!content.trim()) return
    const item: TrainingRecord = {
      id: `${Date.now()}`,
      content: content.trim(),
      frequency,
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setContent('')
    setEffect('')
  }

  const stats = {
    total: records.length,
    daily: records.filter(r => r.frequency === '每日').length,
    positiveEffect: records.filter(r => r.effect && (r.effect.includes('好') || r.effect.includes('有效') || r.effect.includes('进步'))).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '训练总数', value: stats.total, icon: '💪' },
          { label: '每日训练', value: stats.daily, icon: '📅' },
          { label: '正向效果', value: stats.positiveEffect, icon: '✨' },
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
          💪 纪律训练
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="训练内容是什么？"
          style={textAreaStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={selectStyle}>
            {FREQUENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
            placeholder="训练效果"
            style={inputStyle}
          />
        </div>
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
          💪 记录训练
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的训练</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>💪 {r.content}</span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{r.frequency}</span>
              </div>
              {r.effect && <div style={{ fontSize: 11, opacity: 0.75 }}>效果: {r.effect}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💪 还没有训练</div>
          )}
        </div>
      </div>
    </div>
  )
}

function SetbackModule({ records, setRecords }: {
  records: SetbackRecord[]
  setRecords: (fn: (prev: SetbackRecord[]) => SetbackRecord[]) => void
}) {
  const [setback, setSetback] = useState('')
  const [transform, setTransform] = useState('')
  const [growth, setGrowth] = useState('')

  const addRecord = () => {
    if (!setback.trim()) return
    const item: SetbackRecord = {
      id: `${Date.now()}`,
      setback: setback.trim(),
      transform: transform.trim(),
      growth: growth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setSetback('')
    setTransform('')
    setGrowth('')
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
          { label: '挫折总数', value: stats.total, icon: '🌪️' },
          { label: '本月转化', value: stats.thisMonth, icon: '📅' },
          { label: '成长记录', value: stats.total, icon: '🌱' },
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
          🌪️ 挫折转化
        </div>
        <textarea
          value={setback}
          onChange={(e) => setSetback(e.target.value)}
          placeholder="遇到了什么挫折？"
          style={textAreaStyle}
        />
        <textarea
          value={transform}
          onChange={(e) => setTransform(e.target.value)}
          placeholder="如何转化这个挫折？"
          style={textAreaStyle}
        />
        <textarea
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="从中获得了什么成长？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!setback.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: setback.trim() ? 'pointer' : 'not-allowed',
            opacity: setback.trim() ? 1 : 0.5,
          }}
        >
          🌪️ 记录转化
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的转化</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: '#ff9090', marginBottom: 4 }}>❌ {r.setback}</div>
              {r.transform && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4, paddingLeft: 12, borderLeft: `2px solid ${PRIMARY_COLOR}40` }}>转化: {r.transform}</div>}
              {r.growth && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>成长: {r.growth}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌪️ 还没有转化</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-mars-saturn'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-mars-saturn'].secondaryColor

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
  { id: 'battle', name: '长期战役', icon: '⚔️' },
  { id: 'training', name: '纪律训练', icon: '💪' },
  { id: 'setback', name: '挫折转化', icon: '🌪️' },
]

export default function MercuryMarsSaturnPage() {
  const config = comboConfigs['mercury-mars-saturn']
  const [activeTab, setActiveTab] = useState<string>('battle')
  const [battles, setBattles] = useLocalStorage<BattleRecord[]>('mms-battles', [])
  const [trainings, setTrainings] = useLocalStorage<TrainingRecord[]>('mms-trainings', [])
  const [setbacks, setSetbacks] = useLocalStorage<SetbackRecord[]>('mms-setbacks', [])

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
        {activeTab === 'battle' && <BattleModule records={battles} setRecords={setBattles} />}
        {activeTab === 'training' && <TrainingModule records={trainings} setRecords={setTrainings} />}
        {activeTab === 'setback' && <SetbackModule records={setbacks} setRecords={setSetbacks} />}
      </div>
    </ComboShell>
  )
}
