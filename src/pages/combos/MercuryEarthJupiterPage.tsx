import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface LearningRecord {
  id: string
  topic: string
  goal: string
  progress: string
  createdAt: string
}

interface KnowledgeRecord {
  id: string
  knowledge: string
  application: string
  practice: string
  createdAt: string
}

interface GrowthRecord {
  id: string
  growthPoint: string
  evidence: string
  feeling: string
  createdAt: string
}

const GOAL_OPTIONS = ['入门', '基础', '进阶', '精通']

function LearningModule({ records, setRecords }: {
  records: LearningRecord[]
  setRecords: (fn: (prev: LearningRecord[]) => LearningRecord[]) => void
}) {
  const [topic, setTopic] = useState('')
  const [goal, setGoal] = useState('入门')
  const [progress, setProgress] = useState('')

  const addRecord = () => {
    if (!topic.trim()) return
    const item: LearningRecord = {
      id: `${Date.now()}`,
      topic: topic.trim(),
      goal,
      progress: progress.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setTopic('')
    setProgress('')
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
          { label: '学习主题', value: stats.total, icon: '📚' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '持续学习', value: stats.total, icon: '🔥' },
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
          📚 学习主题
        </div>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="想学什么主题？"
          style={inputStyle}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} style={selectStyle}>
            {GOAL_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="当前进度"
            style={inputStyle}
          />
        </div>
        <button
          onClick={addRecord}
          disabled={!topic.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: topic.trim() ? 'pointer' : 'not-allowed',
            opacity: topic.trim() ? 1 : 0.5,
          }}
        >
          📚 添加主题
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的主题</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: PRIMARY_COLOR }}>📚 {r.topic}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}>{r.goal}</span>
              </div>
              {r.progress && <div style={{ fontSize: 11, opacity: 0.6 }}>进度: {r.progress}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>📚 还没有主题</div>
          )}
        </div>
      </div>
    </div>
  )
}

function KnowledgeModule({ records, setRecords }: {
  records: KnowledgeRecord[]
  setRecords: (fn: (prev: KnowledgeRecord[]) => KnowledgeRecord[]) => void
}) {
  const [knowledge, setKnowledge] = useState('')
  const [application, setApplication] = useState('')
  const [practice, setPractice] = useState('')

  const addRecord = () => {
    if (!knowledge.trim()) return
    const item: KnowledgeRecord = {
      id: `${Date.now()}`,
      knowledge: knowledge.trim(),
      application: application.trim(),
      practice: practice.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setKnowledge('')
    setApplication('')
    setPractice('')
  }

  const stats = {
    total: records.length,
    withApplication: records.filter(r => r.application).length,
    withPractice: records.filter(r => r.practice).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '知识总数', value: stats.total, icon: '💡' },
          { label: '已有应用', value: stats.withApplication, icon: '🔧' },
          { label: '已实践', value: stats.withPractice, icon: '✅' },
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
          💡 知识落地
        </div>
        <textarea
          value={knowledge}
          onChange={(e) => setKnowledge(e.target.value)}
          placeholder="学到了什么知识？"
          style={textAreaStyle}
        />
        <textarea
          value={application}
          onChange={(e) => setApplication(e.target.value)}
          placeholder="如何应用这个知识？"
          style={textAreaStyle}
        />
        <textarea
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          placeholder="实践结果如何？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!knowledge.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: knowledge.trim() ? 'pointer' : 'not-allowed',
            opacity: knowledge.trim() ? 1 : 0.5,
          }}
        >
          💡 记录知识
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的知识</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>💡 {r.knowledge}</div>
              {r.application && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>应用: {r.application}</div>}
              {r.practice && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>实践: {r.practice}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>💡 还没有知识</div>
          )}
        </div>
      </div>
    </div>
  )
}

function GrowthModule({ records, setRecords }: {
  records: GrowthRecord[]
  setRecords: (fn: (prev: GrowthRecord[]) => GrowthRecord[]) => void
}) {
  const [growthPoint, setGrowthPoint] = useState('')
  const [evidence, setEvidence] = useState('')
  const [feeling, setFeeling] = useState('')

  const addRecord = () => {
    if (!growthPoint.trim()) return
    const item: GrowthRecord = {
      id: `${Date.now()}`,
      growthPoint: growthPoint.trim(),
      evidence: evidence.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setGrowthPoint('')
    setEvidence('')
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
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '成长总数', value: stats.total, icon: '🌱' },
          { label: '本月成长', value: stats.thisMonth, icon: '📅' },
          { label: '持续进化', value: stats.total, icon: '✨' },
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
          🌱 成长记录
        </div>
        <textarea
          value={growthPoint}
          onChange={(e) => setGrowthPoint(e.target.value)}
          placeholder="成长的点是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="有什么证据？"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="你的感受是什么？"
          style={textAreaStyle}
        />
        <button
          onClick={addRecord}
          disabled={!growthPoint.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: growthPoint.trim() ? 'pointer' : 'not-allowed',
            opacity: growthPoint.trim() ? 1 : 0.5,
          }}
        >
          🌱 记录成长
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的成长</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 6 }}>🌱 {r.growthPoint}</div>
              {r.evidence && <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>证据: {r.evidence}</div>}
              {r.feeling && <div style={{ fontSize: 11, color: '#a0f0a0', marginBottom: 4 }}>感受: {r.feeling}</div>}
              <div style={{ fontSize: 10, opacity: 0.4 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>🌱 还没有成长</div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = comboConfigs['mercury-earth-jupiter'].primaryColor
const SECONDARY_COLOR = comboConfigs['mercury-earth-jupiter'].secondaryColor

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
  { id: 'learning', name: '学习主题', icon: '📚' },
  { id: 'knowledge', name: '知识落地', icon: '💡' },
  { id: 'growth', name: '成长记录', icon: '🌱' },
]

export default function MercuryEarthJupiterPage() {
  const config = comboConfigs['mercury-earth-jupiter']
  const [activeTab, setActiveTab] = useState<string>('learning')
  const [learnings, setLearnings] = useLocalStorage<LearningRecord[]>('mej-learnings', [])
  const [knowledges, setKnowledges] = useLocalStorage<KnowledgeRecord[]>('mej-knowledges', [])
  const [growths, setGrowths] = useLocalStorage<GrowthRecord[]>('mej-growths', [])

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
        {activeTab === 'learning' && <LearningModule records={learnings} setRecords={setLearnings} />}
        {activeTab === 'knowledge' && <KnowledgeModule records={knowledges} setRecords={setKnowledges} />}
        {activeTab === 'growth' && <GrowthModule records={growths} setRecords={setGrowths} />}
      </div>
    </ComboShell>
  )
}
