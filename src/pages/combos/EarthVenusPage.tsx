import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

/* ─────────────── 类型定义 ─────────────── */

interface SensoryEntry {
  id: string
  sense: 'sight' | 'sound' | 'touch' | 'smell' | 'taste'
  name: string
  desc: string
  rating: number
  createdAt: string
}

interface BodyEntry {
  part: string
  note: string
  date: string
}

interface AestheticEntry {
  id: string
  type: 'color' | 'texture' | 'form'
  value: string
  feeling: string
  createdAt: string
}

interface ManifestEntry {
  id: string
  desire: string
  stage: 'intention' | 'action' | 'manifested'
  steps: string[]
  gratitude: string
  createdAt: string
}

interface RhythmEntry {
  id: string
  type: 'season' | 'moon' | 'element'
  subtype: string
  note: string
  date: string
}

/* ─────────────── 常量数据 ─────────────── */

const TAB_LIST = [
  { id: 'sensory', name: '感官圣殿', icon: '🌺', color: '#e8a87c' },
  { id: 'body', name: '身体星图', icon: '🧘', color: '#85dcb8' },
  { id: 'aesthetics', name: '美学实验室', icon: '🎨', color: '#cf6a87' },
  { id: 'values', name: '价值罗盘', icon: '🧭', color: '#f7d794' },
  { id: 'meditation', name: '大地冥想', icon: '🌿', color: '#78e08f' },
  { id: 'manifest', name: '物质显化', icon: '✨', color: '#f8b500' },
  { id: 'rhythm', name: '自然韵律', icon: '🌙', color: '#a29bfe' },
] as const

const SENSE_LABELS: Record<string, { label: string; icon: string; prompt: string }> = {
  sight: { label: '视觉', icon: '👁️', prompt: '今天看到了什么让你心动的美？' },
  sound: { label: '听觉', icon: '👂', prompt: '什么声音让你感到宁静或愉悦？' },
  smell: { label: '嗅觉', icon: '👃', prompt: '什么气味唤起了你的记忆或情感？' },
  touch: { label: '触觉', icon: '✋', prompt: '触摸到什么让你感到温暖或舒适？' },
  taste: { label: '味觉', icon: '👅', prompt: '什么味道让你感到满足或幸福？' },
}

const BODY_PARTS = [
  { name: '脚底', meaning: '与大地的连接，根基与稳定', element: '土', emoji: '🦶' },
  { name: '双腿', meaning: '支撑与前行，承载身体的力量', element: '土', emoji: '🦵' },
  { name: '腹部', meaning: '消化系统，吸收与转化', element: '土', emoji: '🫃' },
  { name: '心脏', meaning: '爱与美的中心，金星能量汇聚', element: '金', emoji: '❤️' },
  { name: '喉咙', meaning: '表达与美感，金星守护的领域', element: '金', emoji: '🗣️' },
  { name: '双手', meaning: '创造与触摸，将美带入现实', element: '金', emoji: '✋' },
  { name: '面部', meaning: '外在之美，自我呈现', element: '金', emoji: '😊' },
  { name: '头顶', meaning: '灵性连接，接收宇宙之美', element: '土', emoji: '👤' },
]

const CORE_VALUES = [
  '爱', '自由', '健康', '成长', '创造',
  '安全', '乐趣', '贡献', '真实', '和谐',
  '知识', '美丽', '权力', '平衡', '宁静',
]

const MEDITATION_STEPS = [
  { part: '脚底', text: '感受脚底与地面的接触。大地托举着你的全部重量，温柔而坚定。让这种稳定感从脚底升起。', seconds: 30 },
  { part: '双腿', text: '将注意力带到双腿。它们是你行走世界的工具，承载着你的每一步。感受肌肉中的力量与放松。', seconds: 30 },
  { part: '腹部', text: '来到腹部。这里是你的直觉中心，消化着物质与情感。让它柔软下来，像大地一样包容。', seconds: 30 },
  { part: '心脏', text: '现在，让金星的能量注入心脏。感受爱、美与和谐的振动。你的心是一座花园，让它绽放。', seconds: 45 },
  { part: '喉咙', text: '感受喉咙的开放。这是美与表达的通道。让温柔的话语自然流淌，不需要完美，只需要真实。', seconds: 30 },
  { part: '双手', text: '将觉知带到双手。它们创造、触摸、给予与接收。感受指尖的敏感，那是你与物质世界对话的桥梁。', seconds: 30 },
  { part: '面部', text: '放松面部肌肉，尤其是眼睛周围。让目光柔和，像欣赏一朵花那样看待世界。', seconds: 30 },
  { part: '头顶', text: '最后，感受头顶上方的空间。如同大地承载你，天空也在拥抱你。你处于天与地之间，完整而平衡。', seconds: 45 },
]

const SEASONS = [
  { name: '春', meaning: '生发 · 播种', icon: '🌸', color: '#f8a5c2' },
  { name: '夏', meaning: '生长 · 盛放', icon: '☀️', color: '#f7d794' },
  { name: '秋', meaning: '收获 · 沉淀', icon: '🍂', color: '#e08e45' },
  { name: '冬', meaning: '藏养 · 孕育', icon: '❄️', color: '#74b9ff' },
]

const MOON_PHASES = [
  { name: '新月', meaning: '意图萌发', icon: '🌑' },
  { name: '上弦月', meaning: '行动展开', icon: '🌓' },
  { name: '满月', meaning: '能量峰值', icon: '🌕' },
  { name: '下弦月', meaning: '释放清理', icon: '🌗' },
]

/* ─────────────── 主组件 ─────────────── */

export default function EarthVenusPage() {
  const config = comboConfigs['venus-earth']
  const [activeTab, setActiveTab] = useState<string>('sensory')

  return (
    <ComboShell config={config} showRelations={true}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* 顶部引言 */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(255,208,232,0.08), rgba(112,200,240,0.06))',
          border: '1px solid rgba(255,208,232,0.15)',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🌍✨</div>
          <div style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.8, letterSpacing: 1 }}>
            地球承载万物，金星赋予之美。<br />
            在这里，你探索物质与感官的深层连接，<br />
            发现身体、价值与美学的隐秘花园。
          </div>
        </div>

        {/* 标签导航 */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '4px 0 16px',
          marginBottom: 8,
          scrollbarWidth: 'none',
        }}>
          {TAB_LIST.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                padding: '10px 18px',
                borderRadius: 999,
                border: `1px solid ${activeTab === tab.id ? tab.color + '60' : 'rgba(255,255,255,0.08)'}`,
                background: activeTab === tab.id ? tab.color + '18' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.55)',
                fontSize: 13,
                letterSpacing: 2,
                cursor: 'pointer',
                transition: 'all 0.25s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 15 }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div style={{ minHeight: 400 }}>
          {activeTab === 'sensory' && <SensoryTemple />}
          {activeTab === 'body' && <BodyStarMap />}
          {activeTab === 'aesthetics' && <AestheticsLab />}
          {activeTab === 'values' && <ValueCompass />}
          {activeTab === 'meditation' && <EarthMeditation />}
          {activeTab === 'manifest' && <ManifestationGarden />}
          {activeTab === 'rhythm' && <NaturalRhythm />}
        </div>
      </div>
    </ComboShell>
  )
}

/* ═══════════════════════════════════════
   模块一：感官圣殿
   ═══════════════════════════════════════ */

function SensoryTemple() {
  const [entries, setEntries] = useLocalStorage<SensoryEntry[]>('earth-venus-sensory', [])
  const [showForm, setShowForm] = useState(false)
  const [sense, setSense] = useState<'sight' | 'sound' | 'touch' | 'smell' | 'taste'>('sight')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [rating, setRating] = useState(3)

  const add = () => {
    if (!name.trim()) return
    const newEntry: SensoryEntry = {
      id: Date.now().toString(),
      sense,
      name: name.trim(),
      desc: desc.trim(),
      rating,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [newEntry, ...prev])
    setName('')
    setDesc('')
    setRating(3)
    setShowForm(false)
  }

  const stats = useMemo(() => {
    const counts: Record<string, number> = {}
    entries.forEach(e => { counts[e.sense] = (counts[e.sense] || 0) + 1 })
    return counts
  }, [entries])

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
          地球赠予你五感，金星教会你欣赏。记录每一次触动心灵的感官体验。
        </p>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '12px 32px',
          borderRadius: 999,
          background: 'linear-gradient(135deg, rgba(232,168,124,0.25), rgba(232,168,124,0.1))',
          border: '1px solid rgba(232,168,124,0.4)',
          color: '#e8c4a8',
          fontSize: 13,
          letterSpacing: 3,
          cursor: 'pointer',
        }}>
          {showForm ? '收起' : '➕ 记录感官体验'}
        </button>
      </div>

      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 20,
          background: 'rgba(232,168,124,0.06)',
          border: '1px solid rgba(232,168,124,0.15)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {Object.entries(SENSE_LABELS).map(([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => setSense(key as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  background: sense === key ? 'rgba(232,168,124,0.2)' : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${sense === key ? 'rgba(232,168,124,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: sense === key ? '#e8c4a8' : 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, opacity: 0.5, marginBottom: 12 }}>{SENSE_LABELS[sense].prompt}</p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="名称..."
            style={inputStyle('#e8c4a8')}
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="描述这种体验带给你的感受..."
            style={{ ...inputStyle('#e8c4a8'), minHeight: 80, marginTop: 10 }}
          />
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, opacity: 0.6 }}>触动程度</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  style={{
                    fontSize: 18,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: n <= rating ? '#e8c4a8' : 'rgba(255,255,255,0.2)',
                    transition: 'color 0.2s',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <button onClick={add} disabled={!name.trim()} style={{
            marginTop: 16,
            padding: '10px 28px',
            borderRadius: 999,
            background: name.trim() ? 'rgba(232,168,124,0.25)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${name.trim() ? 'rgba(232,168,124,0.5)' : 'rgba(255,255,255,0.1)'}`,
            color: name.trim() ? '#e8c4a8' : 'rgba(255,255,255,0.3)',
            fontSize: 12,
            letterSpacing: 3,
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            width: '100%',
          }}>
            ✨ 记录体验
          </button>
        </div>
      )}

      {/* 统计 */}
      {entries.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.entries(SENSE_LABELS).map(([key, { label, icon }]) => (
            <div key={key} style={{
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 12,
              opacity: 0.7,
            }}>
              {icon} {label}: {stats[key] || 0}
            </div>
          ))}
        </div>
      )}

      {/* 列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.3, fontSize: 13 }}>
            🌺 还没有感官记录<br />
            <span style={{ fontSize: 11 }}>当你被某种美触动时，把它记录下来</span>
          </div>
        )}
        {entries.map(e => (
          <div key={e.id} style={{
            padding: 16,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{SENSE_LABELS[e.sense].icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#ffe8f0' }}>{e.name}</span>
              </div>
              <div style={{ color: '#e8c4a8', fontSize: 13 }}>{'★'.repeat(e.rating)}{'☆'.repeat(5 - e.rating)}</div>
            </div>
            {e.desc && <p style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6 }}>{e.desc}</p>}
            <p style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{new Date(e.createdAt).toLocaleDateString('zh-CN')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   模块二：身体星图
   ═══════════════════════════════════════ */

function BodyStarMap() {
  const [selectedPart, setSelectedPart] = useState<number | null>(null)
  const [entries, setEntries] = useLocalStorage<BodyEntry[]>('earth-venus-body', [])
  const [note, setNote] = useState('')

  const addNote = () => {
    if (selectedPart === null || !note.trim()) return
    setEntries(prev => [{
      part: BODY_PARTS[selectedPart].name,
      note: note.trim(),
      date: new Date().toISOString(),
    }, ...prev])
    setNote('')
  }

  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', marginBottom: 24 }}>
        占星学中，地球对应身体根基，金星掌管喉咙与美感。点击身体部位，感知它的讯息。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {BODY_PARTS.map((part, i) => (
          <button
            key={i}
            onClick={() => setSelectedPart(i === selectedPart ? null : i)}
            style={{
              padding: 16,
              borderRadius: 16,
              background: selectedPart === i
                ? 'linear-gradient(135deg, rgba(133,220,184,0.15), rgba(133,220,184,0.05))'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${selectedPart === i ? 'rgba(133,220,184,0.35)' : 'rgba(255,255,255,0.06)'}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{part.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{part.name}</div>
            <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: 1 }}>{part.element}元素</div>
            {selectedPart === i && (
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8, lineHeight: 1.6, color: '#b8f0d4' }}>
                {part.meaning}
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedPart !== null && (
        <div style={{
          padding: 20,
          borderRadius: 16,
          background: 'rgba(133,220,184,0.06)',
          border: '1px solid rgba(133,220,184,0.15)',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, marginBottom: 10, color: '#b8f0d4' }}>
            📝 记录 {BODY_PARTS[selectedPart].name} 的感受
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={`今天你的${BODY_PARTS[selectedPart].name}有什么感受...`}
            style={{ ...inputStyle('#b8f0d4'), minHeight: 60 }}
          />
          <button onClick={addNote} disabled={!note.trim()} style={{
            marginTop: 10,
            padding: '8px 20px',
            borderRadius: 999,
            background: note.trim() ? 'rgba(133,220,184,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${note.trim() ? 'rgba(133,220,184,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: note.trim() ? '#b8f0d4' : 'rgba(255,255,255,0.3)',
            fontSize: 12,
            cursor: note.trim() ? 'pointer' : 'not-allowed',
          }}>
            记录
          </button>
        </div>
      )}

      {entries.length > 0 && (
        <div>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>身体感知日记</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.slice(0, 10).map((e, i) => (
              <div key={i} style={{
                padding: 12,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: 12,
              }}>
                <span style={{ color: '#b8f0d4', fontWeight: 500 }}>{e.part}</span>
                <span style={{ opacity: 0.6, marginLeft: 8 }}>{e.note}</span>
                <span style={{ opacity: 0.3, marginLeft: 8, fontSize: 10 }}>{new Date(e.date).toLocaleDateString('zh-CN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   模块三：美学实验室
   ═══════════════════════════════════════ */

function AestheticsLab() {
  const [entries, setEntries] = useLocalStorage<AestheticEntry[]>('earth-venus-aesthetics', [])
  const [atype, setAtype] = useState<'color' | 'texture' | 'form'>('color')
  const [value, setValue] = useState('')
  const [feeling, setFeeling] = useState('')
  const [showForm, setShowForm] = useState(false)

  const presets: Record<string, string[]> = {
    color: ['#e8a87c', '#85dcb8', '#cf6a87', '#f7d794', '#a29bfe', '#74b9ff', '#ff7675', '#fd79a8'],
    texture: ['丝绸', '粗陶', '原木', '大理石', '棉麻', '金属拉丝', '皮革', '玻璃'],
    form: ['螺旋', '对称', '分形', '波浪', '放射', '椭圆', '网格', '有机曲线'],
  }

  const add = () => {
    if (!value.trim()) return
    setEntries(prev => [{
      id: Date.now().toString(),
      type: atype,
      value: value.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toISOString(),
    }, ...prev])
    setValue('')
    setFeeling('')
    setShowForm(false)
  }

  const typeLabels = { color: '色彩', texture: '材质', form: '形态' }

  const byType = useMemo(() => {
    const g: Record<string, AestheticEntry[]> = { color: [], texture: [], form: [] }
    entries.forEach(e => { g[e.type].push(e) })
    return g
  }, [entries])

  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', marginBottom: 20 }}>
        收集触动你的色彩、材质与形态，构建属于你的美学基因图谱。
      </p>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 28px',
          borderRadius: 999,
          background: 'rgba(207,106,135,0.15)',
          border: '1px solid rgba(207,106,135,0.35)',
          color: '#f0a0b8',
          fontSize: 13,
          letterSpacing: 2,
          cursor: 'pointer',
        }}>
          {showForm ? '收起' : '➕ 添加美学收藏'}
        </button>
      </div>

      {showForm && (
        <div style={{
          padding: 20,
          borderRadius: 16,
          background: 'rgba(207,106,135,0.06)',
          border: '1px solid rgba(207,106,135,0.15)',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {(['color', 'texture', 'form'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setAtype(t); setValue('') }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: atype === t ? 'rgba(207,106,135,0.2)' : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${atype === t ? 'rgba(207,106,135,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: atype === t ? '#f0a0b8' : 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {presets[atype].map(p => (
              <button
                key={p}
                onClick={() => setValue(p)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: atype === 'color' ? p + '40' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${value === p ? 'rgba(207,106,135,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: atype === 'color' ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontSize: 11,
                  cursor: 'pointer',
                  minWidth: atype === 'color' ? 36 : undefined,
                  height: atype === 'color' ? 36 : undefined,
                }}
              >
                {atype === 'color' ? '' : p}
              </button>
            ))}
          </div>

          {atype === 'color' && value && (
            <div style={{
              width: '100%',
              height: 60,
              borderRadius: 12,
              background: value,
              marginBottom: 12,
              border: '1px solid rgba(255,255,255,0.1)',
            }} />
          )}

          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={atype === 'color' ? '输入颜色值或选择上方色块...' : '输入或选择...'}
            style={inputStyle('#f0a0b8')}
          />
          <textarea
            value={feeling}
            onChange={e => setFeeling(e.target.value)}
            placeholder="它让你联想到什么？带来怎样的情绪..."
            style={{ ...inputStyle('#f0a0b8'), minHeight: 60, marginTop: 8 }}
          />
          <button onClick={add} disabled={!value.trim()} style={{
            marginTop: 10,
            padding: '8px 20px',
            borderRadius: 999,
            background: value.trim() ? 'rgba(207,106,135,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${value.trim() ? 'rgba(207,106,135,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: value.trim() ? '#f0a0b8' : 'rgba(255,255,255,0.3)',
            fontSize: 12,
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            width: '100%',
          }}>
            🎨 收藏
          </button>
        </div>
      )}

      {/* 展示区域 */}
      {(['color', 'texture', 'form'] as const).map(t => (
        byType[t].length > 0 && (
          <div key={t} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>
              {typeLabels[t]}收藏 ({byType[t].length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {byType[t].map(e => (
                <div key={e.id} style={{
                  padding: 14,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  {t === 'color' && (
                    <div style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 8,
                      background: e.value,
                      marginBottom: 8,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }} />
                  )}
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.value}</div>
                  {e.feeling && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>{e.feeling}</div>}
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {entries.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.3, fontSize: 13 }}>
          🎨 还没有美学收藏<br />
          <span style={{ fontSize: 11 }}>从一束光、一块布、一个形状开始</span>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   模块四：价值罗盘
   ═══════════════════════════════════════ */

function ValueCompass() {
  const [order, setOrder] = useLocalStorage<string[]>('earth-venus-values', [...CORE_VALUES])
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return
    setOrder(prev => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }

  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', marginBottom: 20 }}>
        金星告诉你什么值得珍视，地球问你愿意为何扎根。拖拽排序，发现你的核心价值。
      </p>

      <div style={{
        padding: 20,
        borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(247,215,148,0.06), rgba(247,215,148,0.02))',
        border: '1px solid rgba(247,215,148,0.12)',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 14, textAlign: 'center', letterSpacing: 2 }}>
          按重要性排序（最重要在上）
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {order.map((val, i) => (
            <div
              key={val}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                borderRadius: 12,
                background: i < 3
                  ? 'linear-gradient(90deg, rgba(247,215,148,0.15), transparent)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${i < 3 ? 'rgba(247,215,148,0.25)' : 'rgba(255,255,255,0.05)'}`,
                transition: 'all 0.2s',
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: i < 3 ? 'rgba(247,215,148,0.2)' : 'rgba(255,255,255,0.06)',
                color: i < 3 ? '#f7d794' : 'rgba(255,255,255,0.4)',
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
              }}>
                {i + 1}
              </span>
              <span style={{
                flex: 1,
                fontSize: 14,
                color: i < 3 ? '#fff5d6' : 'rgba(255,255,255,0.7)',
                fontWeight: i < 3 ? 500 : 400,
              }}>
                {val}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  style={navBtnStyle(i === 0)}
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, i + 1)}
                  disabled={i === order.length - 1}
                  style={navBtnStyle(i === order.length - 1)}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 前三价值分析 */}
      <div style={{
        padding: 20,
        borderRadius: 16,
        background: 'rgba(247,215,148,0.04)',
        border: '1px solid rgba(247,215,148,0.1)',
      }}>
        <div style={{ fontSize: 13, color: '#f7d794', marginBottom: 12, letterSpacing: 2 }}>
          🧭 你的核心价值三角
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {order.slice(0, 3).map((val, i) => (
            <div key={val} style={{
              padding: '14px 20px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(247,215,148,0.12), rgba(247,215,148,0.04))',
              border: '1px solid rgba(247,215,148,0.2)',
              textAlign: 'center',
              flex: 1,
              minWidth: 120,
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{['🥇', '🥈', '🥉'][i]}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#fff5d6' }}>{val}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 14, lineHeight: 1.7 }}>
          当「{order[0]}」与「{order[1]}」发生冲突时，你的内心会倾向于前者。
          这是你在物质世界中做选择的隐形罗盘。
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   模块五：大地冥想
   ═══════════════════════════════════════ */

function EarthMeditation() {
  const [step, setStep] = useState(-1)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [reflection, setReflection] = useState('')
  const [reflections, setReflections] = useLocalStorage<{ text: string; date: string }[]>('earth-venus-meditations', [])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    setStep(0)
    setSeconds(MEDITATION_STEPS[0].seconds)
    setIsRunning(true)
    setCompleted(false)
  }

  const tick = useCallback(() => {
    setSeconds(prev => {
      if (prev <= 1) {
        setStep(current => {
          if (current >= MEDITATION_STEPS.length - 1) {
            setIsRunning(false)
            setCompleted(true)
            return current
          }
          return current + 1
        })
        return MEDITATION_STEPS[Math.min(step + 1, MEDITATION_STEPS.length - 1)]?.seconds || 0
      }
      return prev - 1
    })
  }, [step])

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(tick, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, tick])

  useEffect(() => {
    if (step >= 0 && step < MEDITATION_STEPS.length) {
      setSeconds(MEDITATION_STEPS[step].seconds)
    }
  }, [step])

  const saveReflection = () => {
    if (!reflection.trim()) return
    setReflections(prev => [{ text: reflection.trim(), date: new Date().toISOString() }, ...prev])
    setReflection('')
  }

  const progress = step >= 0 ? ((step + 1) / MEDITATION_STEPS.length) * 100 : 0

  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', marginBottom: 24 }}>
        从脚底到头顶，感受大地的承载与金星的爱。一次完整的身体扫描冥想。
      </p>

      {step === -1 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧘</div>
          <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24, lineHeight: 1.8 }}>
            找一个舒适的姿势坐下或躺下。<br />
            闭上眼睛，深呼吸三次。<br />
            当你准备好了，开始这场 5 分钟的身体之旅。
          </p>
          <button onClick={start} style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(120,224,143,0.25), rgba(120,224,143,0.1))',
            border: '1px solid rgba(120,224,143,0.4)',
            color: '#a8f0b8',
            fontSize: 14,
            letterSpacing: 4,
            cursor: 'pointer',
          }}>
            🌿 开始冥想
          </button>
        </div>
      )}

      {step >= 0 && step < MEDITATION_STEPS.length && (
        <div style={{
          padding: 28,
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(120,224,143,0.06), rgba(120,224,143,0.02))',
          border: '1px solid rgba(120,224,143,0.12)',
        }}>
          {/* 进度条 */}
          <div style={{
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.06)',
            marginBottom: 20,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #78e08f, #a8f0b8)',
              borderRadius: 2,
              transition: 'width 0.5s',
            }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8 }}>
              步骤 {step + 1} / {MEDITATION_STEPS.length} · {MEDITATION_STEPS[step].part}
            </div>
            <div style={{
              fontSize: 42,
              fontVariantNumeric: 'tabular-nums',
              color: '#a8f0b8',
              letterSpacing: 2,
              marginBottom: 16,
            }}>
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </div>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 16,
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(120,224,143,0.1)',
            fontSize: 14,
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
          }}>
            {MEDITATION_STEPS[step].text}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
            <button onClick={() => setIsRunning(!isRunning)} style={{
              padding: '8px 20px',
              borderRadius: 999,
              background: 'rgba(120,224,143,0.15)',
              border: '1px solid rgba(120,224,143,0.3)',
              color: '#a8f0b8',
              fontSize: 12,
              cursor: 'pointer',
            }}>
              {isRunning ? '⏸️ 暂停' : '▶️ 继续'}
            </button>
            <button onClick={() => { setIsRunning(false); setStep(-1); }} style={{
              padding: '8px 20px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 12,
              cursor: 'pointer',
            }}>
              结束
            </button>
          </div>
        </div>
      )}

      {completed && (
        <div style={{
          padding: 28,
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(120,224,143,0.08), rgba(120,224,143,0.03))',
          border: '1px solid rgba(120,224,143,0.15)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
          <div style={{ fontSize: 16, color: '#a8f0b8', marginBottom: 8 }}>冥想完成</div>
          <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 20 }}>
            你的身体是一座圣殿，每一次觉知都是一次祝福。
          </p>

          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="这次冥想中，你感受到了什么..."
            style={{ ...inputStyle('#a8f0b8'), minHeight: 80, textAlign: 'left' }}
          />
          <button onClick={saveReflection} disabled={!reflection.trim()} style={{
            marginTop: 10,
            padding: '10px 28px',
            borderRadius: 999,
            background: reflection.trim() ? 'rgba(120,224,143,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${reflection.trim() ? 'rgba(120,224,143,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: reflection.trim() ? '#a8f0b8' : 'rgba(255,255,255,0.3)',
            fontSize: 12,
            cursor: reflection.trim() ? 'pointer' : 'not-allowed',
          }}>
            🌿 保存感受
          </button>
          <button onClick={() => { setCompleted(false); setStep(-1); }} style={{
            marginTop: 10,
            marginLeft: 10,
            padding: '10px 28px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            cursor: 'pointer',
          }}>
            再来一次
          </button>
        </div>
      )}

      {reflections.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>冥想记录</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reflections.slice(0, 5).map((r, i) => (
              <div key={i} style={{
                padding: 12,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: 12,
                lineHeight: 1.7,
              }}>
                <span style={{ opacity: 0.8 }}>{r.text}</span>
                <span style={{ opacity: 0.3, marginLeft: 8, fontSize: 10 }}>{new Date(r.date).toLocaleDateString('zh-CN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════
   模块六：物质显化
   ═══════════════════════════════════════ */

function ManifestationGarden() {
  const [entries, setEntries] = useLocalStorage<ManifestEntry[]>('earth-venus-manifest', [])
  const [desire, setDesire] = useState('')
  const [stage, setStage] = useState<'intention' | 'action' | 'manifested'>('intention')
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newStep, setNewStep] = useState('')
  const [gratitude, setGratitude] = useState('')

  const add = () => {
    if (!desire.trim()) return
    setEntries(prev => [{
      id: Date.now().toString(),
      desire: desire.trim(),
      stage,
      steps: [],
      gratitude: '',
      createdAt: new Date().toISOString(),
    }, ...prev])
    setDesire('')
    setStage('intention')
    setShowForm(false)
  }

  const addStep = (id: string) => {
    if (!newStep.trim()) return
    setEntries(prev => prev.map(e =>
      e.id === id ? { ...e, steps: [...e.steps, newStep.trim()] } : e
    ))
    setNewStep('')
  }

  const advanceStage = (id: string) => {
    const stages: Array<'intention' | 'action' | 'manifested'> = ['intention', 'action', 'manifested']
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const idx = stages.indexOf(e.stage)
      return { ...e, stage: stages[Math.min(idx + 1, 2)] }
    }))
  }

  const saveGratitude = (id: string) => {
    if (!gratitude.trim()) return
    setEntries(prev => prev.map(e =>
      e.id === id ? { ...e, gratitude: gratitude.trim() } : e
    ))
    setGratitude('')
  }

  const stageInfo = {
    intention: { label: '意念', color: '#f8b500', desc: '种子已种下' },
    action: { label: '行动', color: '#e08e45', desc: '正在生长' },
    manifested: { label: '显化', color: '#78e08f', desc: '已开花结果' },
  }

  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', marginBottom: 20 }}>
        地球将意念化为物质，金星让显化的过程充满美感。播种你的愿望，见证它们开花结果。
      </p>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 28px',
          borderRadius: 999,
          background: 'rgba(248,181,0,0.15)',
          border: '1px solid rgba(248,181,0,0.35)',
          color: '#f8d060',
          fontSize: 13,
          letterSpacing: 2,
          cursor: 'pointer',
        }}>
          {showForm ? '收起' : '➕ 播种愿望'}
        </button>
      </div>

      {showForm && (
        <div style={{
          padding: 20,
          borderRadius: 16,
          background: 'rgba(248,181,0,0.06)',
          border: '1px solid rgba(248,181,0,0.15)',
          marginBottom: 20,
        }}>
          <input
            value={desire}
            onChange={e => setDesire(e.target.value)}
            placeholder="你想显化什么..."
            style={inputStyle('#f8d060')}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {(['intention', 'action', 'manifested'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStage(s)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: stage === s ? 'rgba(248,181,0,0.2)' : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${stage === s ? 'rgba(248,181,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: stage === s ? '#f8d060' : 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {stageInfo[s].label}
              </button>
            ))}
          </div>
          <button onClick={add} disabled={!desire.trim()} style={{
            marginTop: 12,
            padding: '10px 28px',
            borderRadius: 999,
            background: desire.trim() ? 'rgba(248,181,0,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${desire.trim() ? 'rgba(248,181,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: desire.trim() ? '#f8d060' : 'rgba(255,255,255,0.3)',
            fontSize: 12,
            cursor: desire.trim() ? 'pointer' : 'not-allowed',
            width: '100%',
          }}>
            ✨ 播种
          </button>
        </div>
      )}

      {/* 列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {entries.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.3, fontSize: 13 }}>
            ✨ 还没有播种的愿望<br />
            <span style={{ fontSize: 11 }}>每一个物质现实，都曾是一个意念的种子</span>
          </div>
        )}

        {entries.map(e => (
          <div key={e.id} style={{
            padding: 18,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${stageInfo[e.stage].color}20`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{e.desire}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: 999,
                    background: stageInfo[e.stage].color + '20',
                    color: stageInfo[e.stage].color,
                    fontSize: 10,
                  }}>
                    {stageInfo[e.stage].label}
                  </span>
                  <span style={{ fontSize: 10, opacity: 0.4 }}>{stageInfo[e.stage].desc}</span>
                </div>
              </div>
              {e.stage !== 'manifested' && (
                <button onClick={() => advanceStage(e.id)} style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'rgba(248,181,0,0.15)',
                  border: '1px solid rgba(248,181,0,0.3)',
                  color: '#f8d060',
                  fontSize: 11,
                  cursor: 'pointer',
                }}>
                  推进
                </button>
              )}
            </div>

            {/* 步骤 */}
            {e.steps.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6 }}>行动步骤</div>
                {e.steps.map((s, i) => (
                  <div key={i} style={{ fontSize: 12, opacity: 0.75, padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: stageInfo[e.stage].color }}>◆</span> {s}
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setExpandedId(expandedId === e.id ? null : e.id)} style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 11,
              cursor: 'pointer',
              padding: 0,
            }}>
              {expandedId === e.id ? '▲ 收起' : '▼ 添加步骤 / 感恩'}
            </button>

            {expandedId === e.id && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    value={newStep}
                    onChange={ev => setNewStep(ev.target.value)}
                    placeholder="添加一个行动步骤..."
                    style={{ ...inputStyle('#f8d060'), flex: 1 }}
                  />
                  <button onClick={() => addStep(e.id)} disabled={!newStep.trim()} style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    background: newStep.trim() ? 'rgba(248,181,0,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${newStep.trim() ? 'rgba(248,181,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    color: newStep.trim() ? '#f8d060' : 'rgba(255,255,255,0.3)',
                    fontSize: 12,
                    cursor: newStep.trim() ? 'pointer' : 'not-allowed',
                  }}>
                    添加
                  </button>
                </div>
                {e.stage === 'manifested' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={gratitude}
                      onChange={ev => setGratitude(ev.target.value)}
                      placeholder="对已实现的心愿表达感恩..."
                      style={{ ...inputStyle('#f8d060'), flex: 1 }}
                    />
                    <button onClick={() => saveGratitude(e.id)} disabled={!gratitude.trim()} style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      background: gratitude.trim() ? 'rgba(120,224,143,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${gratitude.trim() ? 'rgba(120,224,143,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      color: gratitude.trim() ? '#a8f0b8' : 'rgba(255,255,255,0.3)',
                      fontSize: 12,
                      cursor: gratitude.trim() ? 'pointer' : 'not-allowed',
                    }}>
                      感恩
                    </button>
                  </div>
                )}
                {e.gratitude && (
                  <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: 'rgba(120,224,143,0.06)', fontSize: 12, color: '#a8f0b8' }}>
                    🙏 {e.gratitude}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   模块七：自然韵律
   ═══════════════════════════════════════ */

function NaturalRhythm() {
  const [entries, setEntries] = useLocalStorage<RhythmEntry[]>('earth-venus-rhythm', [])
  const [rtype, setRtype] = useState<'season' | 'moon' | 'element'>('season')
  const [note, setNote] = useState('')
  const [showForm, setShowForm] = useState(false)

  const typeOptions: Record<string, { label: string; items: { name: string; icon: string }[] }> = {
    season: {
      label: '四季',
      items: SEASONS.map(s => ({ name: s.name, icon: s.icon })),
    },
    moon: {
      label: '月相',
      items: MOON_PHASES.map(m => ({ name: m.name, icon: m.icon })),
    },
    element: {
      label: '元素',
      items: [
        { name: '土', icon: '🌍' },
        { name: '金', icon: '✨' },
        { name: '水', icon: '💧' },
        { name: '火', icon: '🔥' },
        { name: '风', icon: '🌬️' },
      ],
    },
  }

  const add = (subtype: string) => {
    if (!note.trim()) return
    setEntries(prev => [{
      id: Date.now().toString(),
      type: rtype,
      subtype,
      note: note.trim(),
      date: new Date().toISOString(),
    }, ...prev])
    setNote('')
    setShowForm(false)
  }

  const byType = useMemo(() => {
    const g: Record<string, RhythmEntry[]> = { season: [], moon: [], element: [] }
    entries.forEach(e => { g[e.type].push(e) })
    return g
  }, [entries])

  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', marginBottom: 20 }}>
        感受自然的韵律——四季更迭、月相盈亏、元素流转。你的身体就是一座微缩的宇宙。
      </p>

      {/* 类型切换 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['season', 'moon', 'element'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setRtype(t); setShowForm(false) }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 12,
              background: rtype === t ? 'rgba(162,155,254,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${rtype === t ? 'rgba(162,155,254,0.35)' : 'rgba(255,255,255,0.06)'}`,
              color: rtype === t ? '#c4b8ff' : 'rgba(255,255,255,0.5)',
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            {typeOptions[t].label}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {typeOptions[rtype].items.map(item => {
          const count = byType[rtype].filter(e => e.subtype === item.name).length
          return (
            <button
              key={item.name}
              onClick={() => { setShowForm(true) }}
              style={{
                padding: 16,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
              {rtype === 'season' && (
                <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>
                  {SEASONS.find(s => s.name === item.name)?.meaning}
                </div>
              )}
              {rtype === 'moon' && (
                <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>
                  {MOON_PHASES.find(m => m.name === item.name)?.meaning}
                </div>
              )}
              {count > 0 && (
                <div style={{
                  marginTop: 6,
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'rgba(162,155,254,0.15)',
                  color: '#c4b8ff',
                  display: 'inline-block',
                }}>
                  {count} 条记录
                </div>
              )}
            </button>
          )
        })}
      </div>

      {showForm && (
        <div style={{
          padding: 20,
          borderRadius: 16,
          background: 'rgba(162,155,254,0.06)',
          border: '1px solid rgba(162,155,254,0.15)',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 10 }}>
            记录你当前感受到的{typeOptions[rtype].label}能量
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="今天的感受..."
            style={{ ...inputStyle('#c4b8ff'), minHeight: 60 }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {typeOptions[rtype].items.map(item => (
              <button
                key={item.name}
                onClick={() => add(item.name)}
                disabled={!note.trim()}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: note.trim() ? 'rgba(162,155,254,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${note.trim() ? 'rgba(162,155,254,0.35)' : 'rgba(255,255,255,0.1)'}`,
                  color: note.trim() ? '#c4b8ff' : 'rgba(255,255,255,0.3)',
                  fontSize: 12,
                  cursor: note.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 记录列表 */}
      {(['season', 'moon', 'element'] as const).map(t => (
        byType[t].length > 0 && (
          <div key={t} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 2 }}>
              {typeOptions[t].label}记录
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {byType[t].map((e, i) => (
                <div key={i} style={{
                  padding: 10,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{ fontSize: 16 }}>
                    {typeOptions[t].items.find(it => it.name === e.subtype)?.icon}
                  </span>
                  <span style={{ color: '#c4b8ff', fontWeight: 500, minWidth: 40 }}>{e.subtype}</span>
                  <span style={{ opacity: 0.7, flex: 1 }}>{e.note}</span>
                  <span style={{ opacity: 0.3, fontSize: 10 }}>{new Date(e.date).toLocaleDateString('zh-CN')}</span>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {entries.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.3, fontSize: 13 }}>
          🌙 还没有自然韵律记录<br />
          <span style={{ fontSize: 11 }}>感受当下的季节、月相或元素能量</span>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 工具样式 ─────────────── */

function inputStyle(accentColor: string): React.CSSProperties {
  return {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    background: 'rgba(0,0,0,0.2)',
    border: `1px solid ${accentColor}30`,
    color: '#ffe8f0',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.6,
    boxSizing: 'border-box',
  }
}

function navBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
    fontSize: 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}
