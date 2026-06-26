import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Vision {
  id: string
  vision: string
  steps: string
  nextStep: string
  createdAt: string
}

interface Inventory {
  id: string
  type: string
  content: string
  usage: string
  createdAt: string
}

interface Growth {
  id: string
  area: string
  comparison: string
  feeling: string
  createdAt: string
}

interface ActionItem {
  id: string
  content: string
  frequency: string
  effect: string
  createdAt: string
}

const RESOURCE_TYPE_OPTIONS = [
  '时间', '金钱', '技能', '人脉', '健康', '知识', '其他'
]

const FREQUENCY_OPTIONS = [
  '每天', '每周', '每月', '偶尔', '持续进行'
]

function VisionModule({ visions, setVisions }: {
  visions: Vision[]
  setVisions: (fn: (prev: Vision[]) => Vision[]) => void
}) {
  const [vision, setVision] = useState('')
  const [steps, setSteps] = useState('')
  const [nextStep, setNextStep] = useState('')

  const addVision = () => {
    if (!vision.trim()) return
    const item: Vision = {
      id: `${Date.now()}`,
      vision: vision.trim(),
      steps: steps.trim(),
      nextStep: nextStep.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setVisions((prev) => [item, ...prev])
    setVision('')
    setSteps('')
    setNextStep('')
  }

  const stats = {
    total: visions.length,
    withSteps: visions.filter(v => v.steps).length,
    withNextStep: visions.filter(v => v.nextStep).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '愿景总数', value: stats.total, icon: '🌱' },
          { label: '有已完成步骤', value: stats.withSteps, icon: '📝' },
          { label: '有下一步', value: stats.withNextStep, icon: '🎯' },
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
          🌱 愿景落地
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          把愿景拆解成可执行的步骤
        </div>

        <textarea
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="你的愿景是什么？"
          style={textAreaStyle}
        />
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="已经完成的步骤（可选）"
          style={textAreaStyle}
        />
        <textarea
          value={nextStep}
          onChange={(e) => setNextStep(e.target.value)}
          placeholder="下一步行动（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addVision}
          disabled={!vision.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e0f8e8', fontSize: 12, letterSpacing: 3,
            cursor: vision.trim() ? 'pointer' : 'not-allowed',
            opacity: vision.trim() ? 1 : 0.5,
          }}
        >
          🌱 种下愿景
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>愿景清单</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visions.slice(0, 5).map((v) => (
            <div key={v.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 8 }}>
                🌱 {v.vision}
              </div>
              {v.steps && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  ✅ 已完成：{v.steps}
                </div>
              )}
              {v.nextStep && (
                <div style={{ fontSize: 12, color: PRIMARY_COLOR, lineHeight: 1.6 }}>
                  🎯 下一步：{v.nextStep}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{v.createdAt}</div>
            </div>
          ))}
          {visions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌱 还没有愿景
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InventoryModule({ inventories, setInventories }: {
  inventories: Inventory[]
  setInventories: (fn: (prev: Inventory[]) => Inventory[]) => void
}) {
  const [type, setType] = useState('时间')
  const [content, setContent] = useState('')
  const [usage, setUsage] = useState('')

  const addInventory = () => {
    if (!content.trim()) return
    const item: Inventory = {
      id: `${Date.now()}`,
      type,
      content: content.trim(),
      usage: usage.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setInventories((prev) => [item, ...prev])
    setContent('')
    setUsage('')
  }

  const stats = {
    total: inventories.length,
    types: new Set(inventories.map(i => i.type)).size,
    withUsage: inventories.filter(i => i.usage).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '资源总数', value: stats.total, icon: '📦' },
          { label: '资源类型', value: stats.types, icon: '📂' },
          { label: '有利用方式', value: stats.withUsage, icon: '⚡' },
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
          📦 资源盘点
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
          {RESOURCE_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="具体资源内容……"
          style={textAreaStyle}
        />
        <textarea
          value={usage}
          onChange={(e) => setUsage(e.target.value)}
          placeholder="利用方式（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addInventory}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e0f8e8', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          📦 记录资源
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>资源清单</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {inventories.slice(0, 5).map((i) => (
            <div key={i.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, padding: '2px 10px', borderRadius: 999,
                  background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR,
                }}>
                  {i.type}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{i.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{i.content}</div>
              {i.usage && (
                <div style={{ fontSize: 11, color: '#a0e0b0', marginTop: 8 }}>
                  ⚡ 利用：{i.usage}
                </div>
              )}
            </div>
          ))}
          {inventories.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📦 还没有资源记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GrowthModule({ growths, setGrowths }: {
  growths: Growth[]
  setGrowths: (fn: (prev: Growth[]) => Growth[]) => void
}) {
  const [area, setArea] = useState('')
  const [comparison, setComparison] = useState('')
  const [feeling, setFeeling] = useState('')

  const addGrowth = () => {
    if (!area.trim()) return
    const item: Growth = {
      id: `${Date.now()}`,
      area: area.trim(),
      comparison: comparison.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setGrowths((prev) => [item, ...prev])
    setArea('')
    setComparison('')
    setFeeling('')
  }

  const stats = {
    total: growths.length,
    areas: new Set(growths.map(g => g.area)).size,
    withComparison: growths.filter(g => g.comparison).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '成长记录', value: stats.total, icon: '📈' },
          { label: '成长领域', value: stats.areas, icon: '🌿' },
          { label: '有前后对比', value: stats.withComparison, icon: '↔️' },
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
          📈 成长记录
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          看见自己的成长轨迹
        </div>

        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="成长领域"
          style={inputStyle}
        />
        <textarea
          value={comparison}
          onChange={(e) => setComparison(e.target.value)}
          placeholder="前后对比（可选）"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="成长的感受（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addGrowth}
          disabled={!area.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e0f8e8', fontSize: 12, letterSpacing: 3,
            cursor: area.trim() ? 'pointer' : 'not-allowed',
            opacity: area.trim() ? 1 : 0.5,
          }}
        >
          📈 记录成长
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>成长轨迹</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {growths.slice(0, 5).map((g) => (
            <div key={g.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                📈 {g.area}
              </div>
              {g.comparison && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  ↔️ {g.comparison}
                </div>
              )}
              {g.feeling && (
                <div style={{ fontSize: 11, opacity: 0.6, fontStyle: 'italic' }}>
                  {g.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{g.createdAt}</div>
            </div>
          ))}
          {growths.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📈 还没有成长记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionModule({ actions, setActions }: {
  actions: ActionItem[]
  setActions: (fn: (prev: ActionItem[]) => ActionItem[]) => void
}) {
  const [content, setContent] = useState('')
  const [frequency, setFrequency] = useState('每天')
  const [effect, setEffect] = useState('')

  const addAction = () => {
    if (!content.trim()) return
    const item: ActionItem = {
      id: `${Date.now()}`,
      content: content.trim(),
      frequency,
      effect: effect.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setActions((prev) => [item, ...prev])
    setContent('')
    setEffect('')
  }

  const stats = {
    total: actions.length,
    frequencies: new Set(actions.map(a => a.frequency)).size,
    withEffect: actions.filter(a => a.effect).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '丰盛行动', value: stats.total, icon: '🎁' },
          { label: '频率种类', value: stats.frequencies, icon: '⏰' },
          { label: '有效果记录', value: stats.withEffect, icon: '✨' },
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
          🎁 丰盛行动
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          用行动创造丰盛
        </div>

        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={selectStyle}>
          {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="行动内容……"
          style={textAreaStyle}
        />
        <textarea
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="带来的效果（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addAction}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#e0f8e8', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🎁 开始行动
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>丰盛行动</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {actions.slice(0, 5).map((a) => (
            <div key={a.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, padding: '2px 10px', borderRadius: 999,
                  background: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR,
                }}>
                  {a.frequency}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{a.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{a.content}</div>
              {a.effect && (
                <div style={{ fontSize: 11, color: '#ffd080', marginTop: 8 }}>
                  ✨ 效果：{a.effect}
                </div>
              )}
            </div>
          ))}
          {actions.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎁 还没有行动记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#a0e0b0'
const SECONDARY_COLOR = '#80d0a0'

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
  color: '#e0f8e8', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#e0f8e8', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#e0f8e8', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'vision', name: '愿景落地', icon: '🌱' },
  { id: 'inventory', name: '资源盘点', icon: '📦' },
  { id: 'growth', name: '成长记录', icon: '📈' },
  { id: 'action', name: '丰盛行动', icon: '🎁' },
]

export default function EarthJupiterPage() {
  const config = comboConfigs['earth-jupiter']
  const [activeTab, setActiveTab] = useState<string>('vision')
  const [visions, setVisions] = useLocalStorage<Vision[]>('ej-visions', [])
  const [inventories, setInventories] = useLocalStorage<Inventory[]>('ej-inventories', [])
  const [growths, setGrowths] = useLocalStorage<Growth[]>('ej-growths', [])
  const [actions, setActions] = useLocalStorage<ActionItem[]>('ej-actions', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#e0f8e8' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'vision' && <VisionModule visions={visions} setVisions={setVisions} />}
        {activeTab === 'inventory' && <InventoryModule inventories={inventories} setInventories={setInventories} />}
        {activeTab === 'growth' && <GrowthModule growths={growths} setGrowths={setGrowths} />}
        {activeTab === 'action' && <ActionModule actions={actions} setActions={setActions} />}
      </div>
    </ComboShell>
  )
}
