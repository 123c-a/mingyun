import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

/* ─────────────── 类型定义 ─────────────── */

interface InspirationItem {
  id: string
  content: string
  category: string
  tags: string[]
  createdAt: string
}

interface DreamItem {
  id: string
  title: string
  content: string
  mood: string
  keyElements: string[]
  insight: string
  date: string
}

interface WritingItem {
  id: string
  title: string
  content: string
  prompt: string
  duration: number
  wordCount: number
  date: string
}

interface IncubationItem {
  id: string
  inspirationId: string
  inspirationContent: string
  projectName: string
  steps: { id: string; text: string; done: boolean }[]
  status: 'incubating' | 'in-progress' | 'hatched'
  createdAt: string
  deadline: string
}

/* ─────────────── 常量数据 ─────────────── */

const TAB_LIST = [
  { id: 'inspiration', name: '灵感捕捉', icon: '💡', color: '#70d8e8' },
  { id: 'dream', name: '梦境记录', icon: '🌙', color: '#6090c8' },
  { id: 'writing', name: '自由书写', icon: '✍️', color: '#80d0e8' },
  { id: 'incubation', name: '创意孵化', icon: '🥚', color: '#a0b8e0' },
] as const

const CATEGORY_OPTIONS = ['创意想法', '梦境碎片', '顿悟瞬间', '艺术灵感', '问题解法', '其他']

const MOOD_OPTIONS = ['愉悦', '平静', '神秘', '恐惧', '悲伤', '兴奋', '困惑']

const WRITING_PROMPTS = [
  '如果我能和十年前的自己说一句话……',
  '今天窗外的天空是这样的……',
  '我最近一次感到幸福是因为……',
  '如果我有一所属于自己的小房子……',
  '今夜的月亮让我想起……',
  '假如可以穿越到任意一个时代……',
  '我心中理想的一天是这样度过的……',
  '有一个秘密，我从来没告诉过任何人……',
  '如果我是一种植物，我会是……',
  '最近一直在我脑海里盘旋的念头是……',
  '当我独自一人的时候，我喜欢……',
  '我想给未来的自己写一封信……',
]

const INCUBATION_STEP_TEMPLATES = [
  '明确核心愿景：一句话描述这个创意要达成什么',
  '收集灵感素材：找3-5个相关的参考或素材',
  '制定里程碑：拆分为2-3个关键节点',
  '迈出第一步：今天就能做的最小行动',
  '设定复盘日：一周后回顾进展',
]

/* ─────────────── 通用组件 ─────────────── */

function StatCard({ label, value, icon, color }: {
  label: string
  value: number | string
  icon: string
  color: string
}) {
  return (
    <div style={{
      padding: '16px 14px',
      borderRadius: 14,
      background: `linear-gradient(135deg, ${color}12, ${color}05)`,
      border: `1px solid ${color}25`,
      textAlign: 'center',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 300, color, marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>{label}</div>
    </div>
  )
}

/* ─────────────── 主组件 ─────────────── */

export default function UranusNeptunePage() {
  const config = comboConfigs['uranus-neptune']
  const [activeTab, setActiveTab] = useState<string>('inspiration')

  const [inspirations, setInspirations] = useLocalStorage<InspirationItem[]>('un-inspirations', [])
  const [dreams, setDreams] = useLocalStorage<DreamItem[]>('un-dreams', [])
  const [writings, setWritings] = useLocalStorage<WritingItem[]>('un-writings', [])
  const [incubations, setIncubations] = useLocalStorage<IncubationItem[]>('un-incubations', [])

  return (
    <ComboShell config={config}>
      <div>
        {/* 标签导航 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 40,
          flexWrap: 'wrap',
        }}>
          {TAB_LIST.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 28px',
                borderRadius: 999,
                background: activeTab === tab.id
                  ? `linear-gradient(135deg, ${tab.color}40, ${tab.color}15)`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.1)'}`,
                color: activeTab === tab.id ? tab.color : 'rgba(192,240,248,0.6)',
                fontSize: 13,
                letterSpacing: 3,
                cursor: 'pointer',
                transition: 'all 0.3s',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* 模块内容 */}
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {activeTab === 'inspiration' && (
            <InspirationCapture inspirations={inspirations} setInspirations={setInspirations} />
          )}
          {activeTab === 'dream' && (
            <DreamJournal dreams={dreams} setDreams={setDreams} />
          )}
          {activeTab === 'writing' && (
            <FreeWriting writings={writings} setWritings={setWritings} />
          )}
          {activeTab === 'incubation' && (
            <CreativeIncubation
              inspirations={inspirations}
              incubations={incubations}
              setIncubations={setIncubations}
            />
          )}
        </div>
      </div>
    </ComboShell>
  )
}

/* ─────────────── 模块一：灵感捕捉 ─────────────── */

function InspirationCapture({ inspirations, setInspirations }: {
  inspirations: InspirationItem[]
  setInspirations: (v: InspirationItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('创意想法')
  const [tagInput, setTagInput] = useState('')

  const saveInspiration = useCallback(() => {
    if (!content.trim()) return
    const tags = tagInput.split(/[,，\s]+/).filter(Boolean)
    const newItem: InspirationItem = {
      id: `${Date.now()}`,
      content: content.trim(),
      category,
      tags,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setInspirations([newItem, ...inspirations])
    setShowForm(false)
    setContent('')
    setTagInput('')
    setCategory('创意想法')
  }, [content, category, tagInput, inspirations, setInspirations])

  const categoryCount = useMemo(() => {
    const map: Record<string, number> = {}
    inspirations.forEach(i => {
      map[i.category] = (map[i.category] || 0) + 1
    })
    return map
  }, [inspirations])

  const topCategory = useMemo(() => {
    let max = 0
    let name = '-'
    Object.entries(categoryCount).forEach(([k, v]) => {
      if (v > max) { max = v; name = k }
    })
    return name
  }, [categoryCount])

  const totalTags = useMemo(() => {
    const set = new Set<string>()
    inspirations.forEach(i => i.tags.forEach(t => set.add(t)))
    return set.size
  }, [inspirations])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(112,216,232,0.08), rgba(96,144,200,0.04))',
      border: '1px solid rgba(112,216,232,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计概览 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="灵感总数" value={inspirations.length} icon="💡" color="#70d8e8" />
        <StatCard label="标签数量" value={totalTags} icon="🏷️" color="#6090c8" />
        <StatCard label="最多类别" value={topCategory} icon="✨" color="#80d0e8" />
      </div>

      {/* 捕捉按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(112,216,232,0.15), rgba(96,144,200,0.05))',
            border: '2px dashed rgba(112,216,232,0.4)',
            color: '#70d8e8',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          💡 捕捉此刻的灵感
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(112,216,232,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#70d8e8', marginBottom: 16, letterSpacing: 2 }}>
            💡 抓住这一刻的灵感
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="此刻脑中浮现的是什么……"
            style={{
              width: '100%',
              minHeight: 100,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(112,216,232,0.25)',
              color: '#c0f0f8',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 1 }}>分类</div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(112,216,232,0.25)',
                  color: '#c0f0f8',
                  fontSize: 12,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              >
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="标签（用逗号或空格分隔）"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(112,216,232,0.25)',
              color: '#c0f0f8',
              fontSize: 12,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => { setShowForm(false); setContent(''); setTagInput('') }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(192,240,248,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={saveInspiration}
              disabled={!content.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #70d8e8, #6090c8)',
                border: 'none',
                color: '#0a1525',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: content.trim() ? 'pointer' : 'not-allowed',
                opacity: content.trim() ? 1 : 0.5,
              }}
            >
              ✨ 保存灵感
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {inspirations.length > 0 && (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            灵感记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inspirations.slice(0, 5).map(item => (
              <div key={item.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 8, lineHeight: 1.6, opacity: 0.9 }}>
                  {item.content.length > 80 ? item.content.slice(0, 80) + '…' : item.content}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: 'rgba(112,216,232,0.12)',
                    color: '#70d8e8',
                    letterSpacing: 1,
                  }}>
                    {item.category}
                  </span>
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(96,144,200,0.15)',
                      color: '#a0b8e0',
                    }}>
                      #{tag}
                    </span>
                  ))}
                  <span style={{ fontSize: 11, opacity: 0.4, marginLeft: 'auto' }}>
                    {item.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {inspirations.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💡</div>
          <div style={{ fontSize: 13, letterSpacing: 2, lineHeight: 1.8 }}>
            还没有捕捉到灵感
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              灵感像深海里的鱼<br />需要的时候，它就会游过来
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块二：梦境记录 ─────────────── */

function DreamJournal({ dreams, setDreams }: {
  dreams: DreamItem[]
  setDreams: (v: DreamItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('平静')
  const [elementsInput, setElementsInput] = useState('')
  const [insight, setInsight] = useState('')

  const saveDream = useCallback(() => {
    if (!content.trim()) return
    const keyElements = elementsInput.split(/[,，\s]+/).filter(Boolean)
    const newItem: DreamItem = {
      id: `${Date.now()}`,
      title: title.trim() || '未命名梦境',
      content: content.trim(),
      mood,
      keyElements,
      insight: insight.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
    }
    setDreams([newItem, ...dreams])
    setShowForm(false)
    setTitle('')
    setContent('')
    setMood('平静')
    setElementsInput('')
    setInsight('')
  }, [title, content, mood, elementsInput, insight, dreams, setDreams])

  const moodCount = useMemo(() => {
    const map: Record<string, number> = {}
    dreams.forEach(d => {
      map[d.mood] = (map[d.mood] || 0) + 1
    })
    return map
  }, [dreams])

  const topMood = useMemo(() => {
    let max = 0
    let name = '-'
    Object.entries(moodCount).forEach(([k, v]) => {
      if (v > max) { max = v; name = k }
    })
    return name
  }, [moodCount])

  const totalElements = useMemo(() => {
    const set = new Set<string>()
    dreams.forEach(d => d.keyElements.forEach(e => set.add(e)))
    return set.size
  }, [dreams])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(96,144,200,0.08), rgba(112,216,232,0.04))',
      border: '1px solid rgba(96,144,200,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="梦境总数" value={dreams.length} icon="🌙" color="#6090c8" />
        <StatCard label="梦中元素" value={totalElements} icon="✨" color="#70d8e8" />
        <StatCard label="主导情绪" value={topMood} icon="💭" color="#80d0e8" />
      </div>

      {/* 记录按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(96,144,200,0.15), rgba(112,216,232,0.05))',
            border: '2px dashed rgba(96,144,200,0.4)',
            color: '#6090c8',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          🌙 记录昨夜的梦
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(96,144,200,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#6090c8', marginBottom: 16, letterSpacing: 2 }}>
            🌙 梦境日记
          </div>

          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="给这个梦起个名字……"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(96,144,200,0.25)',
              color: '#c0f0f8',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 1 }}>梦境内容</div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="尽可能详细地描述你的梦境……"
            style={{
              width: '100%',
              minHeight: 100,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(96,144,200,0.25)',
              color: '#c0f0f8',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 1 }}>梦中心情</div>
              <select
                value={mood}
                onChange={e => setMood(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(96,144,200,0.25)',
                  color: '#c0f0f8',
                  fontSize: 12,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              >
                {MOOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <input
            type="text"
            value={elementsInput}
            onChange={e => setElementsInput(e.target.value)}
            placeholder="梦中的关键元素（用逗号分隔，如：水、飞翔、陌生人）"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(96,144,200,0.25)',
              color: '#c0f0f8',
              fontSize: 12,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 1 }}>醒来后的感悟</div>
          <textarea
            value={insight}
            onChange={e => setInsight(e.target.value)}
            placeholder="这个梦想告诉你什么？"
            style={{
              width: '100%',
              minHeight: 60,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(96,144,200,0.25)',
              color: '#c0f0f8',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => { setShowForm(false); setTitle(''); setContent(''); setElementsInput(''); setInsight('') }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(192,240,248,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={saveDream}
              disabled={!content.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #6090c8, #70d8e8)',
                border: 'none',
                color: '#0a1525',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: content.trim() ? 'pointer' : 'not-allowed',
                opacity: content.trim() ? 1 : 0.5,
              }}
            >
              🌙 保存梦境
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {dreams.length > 0 && (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            梦境记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dreams.slice(0, 5).map(d => (
              <div key={d.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, fontWeight: 500, opacity: 0.9 }}>{d.title}</div>
                <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.6, marginBottom: 8 }}>
                  {d.content.length > 60 ? d.content.slice(0, 60) + '…' : d.content}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: 'rgba(96,144,200,0.15)',
                    color: '#a0b8e0',
                    letterSpacing: 1,
                  }}>
                    {d.mood}
                  </span>
                  {d.keyElements.slice(0, 2).map(el => (
                    <span key={el} style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(112,216,232,0.12)',
                      color: '#70d8e8',
                    }}>
                      {el}
                    </span>
                  ))}
                  <span style={{ fontSize: 11, opacity: 0.4, marginLeft: 'auto' }}>
                    {d.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dreams.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
          <div style={{ fontSize: 13, letterSpacing: 2, lineHeight: 1.8 }}>
            还没有梦境记录
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              梦是潜意识的来信<br />醒来后记得第一时间记下它
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块三：自由书写 ─────────────── */

function FreeWriting({ writings, setWritings }: {
  writings: WritingItem[]
  setWritings: (v: WritingItem[]) => void
}) {
  const [phase, setPhase] = useState<'idle' | 'writing' | 'done'>('idle')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [content, setContent] = useState('')
  const [timeLeft, setTimeLeft] = useState(600)
  const timerRef = useRef<number | null>(null)
  const [title, setTitle] = useState('')
  const startTimeRef = useRef<number>(0)

  const drawPrompt = useCallback(() => {
    const prompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)]
    setCurrentPrompt(prompt)
  }, [])

  const startWriting = useCallback(() => {
    if (!currentPrompt) drawPrompt()
    setTimeLeft(600)
    setContent('')
    startTimeRef.current = Date.now()
    setPhase('writing')
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [currentPrompt, drawPrompt])

  const finishEarly = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setPhase('done')
  }, [])

  const saveWriting = useCallback(() => {
    const actualDuration = 600 - timeLeft
    const wordCount = content.replace(/\s/g, '').length
    const newItem: WritingItem = {
      id: `${Date.now()}`,
      title: title.trim() || '未命名作品',
      content: content.trim(),
      prompt: currentPrompt,
      duration: Math.round(actualDuration / 60),
      wordCount,
      date: new Date().toLocaleDateString('zh-CN'),
    }
    setWritings([newItem, ...writings])
    setPhase('idle')
    setTitle('')
    setContent('')
  }, [title, content, currentPrompt, timeLeft, writings, setWritings])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const totalWords = writings.reduce((s, w) => s + w.wordCount, 0)
  const avgDuration = writings.length > 0
    ? Math.round(writings.reduce((s, w) => s + w.duration, 0) / writings.length)
    : 0

  const progress = ((600 - timeLeft) / 600) * 100
  const currentWordCount = content.replace(/\s/g, '').length

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(128,208,232,0.08), rgba(96,144,200,0.04))',
      border: '1px solid rgba(128,208,232,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="作品数量" value={writings.length} icon="✍️" color="#80d0e8" />
        <StatCard label="总字数" value={totalWords} icon="📝" color="#70d8e8" />
        <StatCard label="平均时长" value={`${avgDuration}min`} icon="⏱️" color="#6090c8" />
      </div>

      {/* 空闲状态 */}
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✍️</div>
          <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 2, color: '#80d0e8' }}>
            自由书写
          </div>
          <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.8 }}>
            海王星的流动 × 天王星的突破<br />
            10分钟无限制书写，让文字自由流淌
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 14, letterSpacing: 2 }}>
            今天的起始句
          </div>
          <div style={{
            fontSize: 15,
            fontStyle: 'italic',
            padding: '16px 24px',
            borderRadius: 14,
            background: 'rgba(112,216,232,0.08)',
            border: '1px solid rgba(112,216,232,0.2)',
            marginBottom: 24,
            lineHeight: 1.6,
            color: '#c0f0f8',
          }}>
            {currentPrompt || '「点击下方按钮抽取起始句」'}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={drawPrompt}
              style={{
                padding: '12px 28px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(192,240,248,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              🎲 换一句
            </button>
            <button
              onClick={startWriting}
              style={{
                padding: '12px 36px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #80d0e8, #6090c8)',
                border: 'none',
                color: '#0a1525',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: 'pointer',
              }}
            >
              ✍️ 开始书写
            </button>
          </div>
        </div>
      )}

      {/* 书写中 */}
      {phase === 'writing' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <div style={{
              fontSize: 12,
              opacity: 0.6,
              fontStyle: 'italic',
              maxWidth: '60%',
            }}>
              {currentPrompt}
            </div>
            <div style={{
              fontSize: 28,
              fontWeight: 200,
              color: timeLeft <= 60 ? '#ff8080' : '#80d0e8',
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 20px ${timeLeft <= 60 ? 'rgba(255,128,128,0.4)' : 'rgba(128,208,232,0.3)'}`,
            }}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div style={{
            width: '100%',
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #80d0e8, #6090c8)',
              transition: 'width 1s linear',
            }} />
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="让思绪顺着笔尖流淌……不要停，不要评判，只是写。"
            autoFocus
            style={{
              width: '100%',
              minHeight: 280,
              padding: '18px 20px',
              borderRadius: 14,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(128,208,232,0.3)',
              color: '#c0f0f8',
              fontSize: 15,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.8,
              boxSizing: 'border-box',
            }}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
          }}>
            <div style={{ fontSize: 11, opacity: 0.4 }}>
              已写 {currentWordCount} 字
            </div>
            <button
              onClick={finishEarly}
              style={{
                padding: '10px 28px',
                borderRadius: 999,
                background: 'rgba(96,144,200,0.15)',
                border: '1px solid rgba(96,144,200,0.4)',
                color: '#a0b8e0',
                fontSize: 11,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              提前结束
            </button>
          </div>
        </div>
      )}

      {/* 完成 */}
      {phase === 'done' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌟</div>
            <div style={{ fontSize: 18, color: '#80d0e8', letterSpacing: 2, marginBottom: 6 }}>
              书写完成！
            </div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>
              用时 {Math.round((600 - timeLeft) / 60)} 分钟 · {currentWordCount} 字
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            给这篇作品起个名字
          </div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="未命名作品"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(128,208,232,0.25)',
              color: '#c0f0f8',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            作品预览
          </div>
          <div style={{
            padding: '16px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.15)',
            border: '1px solid rgba(128,208,232,0.2)',
            maxHeight: 160,
            overflow: 'auto',
            marginBottom: 20,
            fontSize: 13,
            lineHeight: 1.8,
            opacity: 0.8,
            whiteSpace: 'pre-wrap',
          }}>
            {content || '（空作品）'}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => { setPhase('idle'); setContent(''); setTitle('') }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(192,240,248,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              放弃
            </button>
            <button
              onClick={saveWriting}
              disabled={!content.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #80d0e8, #6090c8)',
                border: 'none',
                color: '#0a1525',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: content.trim() ? 'pointer' : 'not-allowed',
                opacity: content.trim() ? 1 : 0.5,
              }}
            >
              ✨ 保存作品
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {writings.length > 0 && phase === 'idle' && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            作品记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {writings.slice(0, 5).map(w => (
              <div key={w.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, fontWeight: 500, opacity: 0.9 }}>{w.title}</div>
                <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic' }}>
                  「{w.prompt}」
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 11,
                  opacity: 0.5,
                }}>
                  <span>{w.date}</span>
                  <span>·</span>
                  <span>{w.duration}min</span>
                  <span>·</span>
                  <span>{w.wordCount}字</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块四：创意孵化 ─────────────── */

function CreativeIncubation({ inspirations, incubations, setIncubations }: {
  inspirations: InspirationItem[]
  incubations: IncubationItem[]
  setIncubations: (v: IncubationItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [selectedInspirationId, setSelectedInspirationId] = useState('')
  const [projectName, setProjectName] = useState('')
  const [stepInputs, setStepInputs] = useState<string[]>(['', '', ''])
  const [deadline, setDeadline] = useState('')

  const selectedInspiration = inspirations.find(i => i.id === selectedInspirationId)

  const startIncubation = useCallback(() => {
    if (!selectedInspirationId || !projectName.trim()) return
    const steps = stepInputs
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, i) => ({
        id: `step-${Date.now()}-${i}`,
        text,
        done: false,
      }))
    if (steps.length === 0) {
      steps.push({
        id: `step-${Date.now()}-0`,
        text: '迈出第一步',
        done: false,
      })
    }
    const insp = inspirations.find(i => i.id === selectedInspirationId)
    const newItem: IncubationItem = {
      id: `${Date.now()}`,
      inspirationId: selectedInspirationId,
      inspirationContent: insp?.content || '',
      projectName: projectName.trim(),
      steps,
      status: 'incubating',
      createdAt: new Date().toLocaleDateString('zh-CN'),
      deadline,
    }
    setIncubations([newItem, ...incubations])
    setShowForm(false)
    setSelectedInspirationId('')
    setProjectName('')
    setStepInputs(['', '', ''])
    setDeadline('')
  }, [selectedInspirationId, projectName, stepInputs, deadline, inspirations, incubations, setIncubations])

  const toggleStep = useCallback((incubationId: string, stepId: string) => {
    setIncubations(incubations.map(inc => {
      if (inc.id !== incubationId) return inc
      const newSteps = inc.steps.map(s =>
        s.id === stepId ? { ...s, done: !s.done } : s
      )
      const allDone = newSteps.length > 0 && newSteps.every(s => s.done)
      const anyDone = newSteps.some(s => s.done)
      let newStatus: IncubationItem['status'] = 'incubating'
      if (allDone) newStatus = 'hatched'
      else if (anyDone) newStatus = 'in-progress'
      return { ...inc, steps: newSteps, status: newStatus }
    }))
  }, [incubations, setIncubations])

  const statusConfig = {
    incubating: { label: '孵化中', color: '#a0b8e0', icon: '🥚' },
    'in-progress': { label: '成长中', color: '#80d0e8', icon: '🌱' },
    hatched: { label: '已破壳', color: '#78e0c8', icon: '🐣' },
  }

  const hatchedCount = incubations.filter(i => i.status === 'hatched').length
  const inProgressCount = incubations.filter(i => i.status === 'in-progress').length

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(160,184,224,0.08), rgba(96,144,200,0.04))',
      border: '1px solid rgba(160,184,224,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="孵化项目" value={incubations.length} icon="🥚" color="#a0b8e0" />
        <StatCard label="进行中" value={inProgressCount} icon="🌱" color="#80d0e8" />
        <StatCard label="已破壳" value={hatchedCount} icon="🐣" color="#78e0c8" />
      </div>

      {/* 新建按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(160,184,224,0.15), rgba(96,144,200,0.05))',
            border: '2px dashed rgba(160,184,224,0.4)',
            color: '#a0b8e0',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          🥚 孵化一个创意
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(160,184,224,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#a0b8e0', marginBottom: 16, letterSpacing: 2 }}>
            🥚 创意孵化计划
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            选择一个灵感
          </div>
          <select
            value={selectedInspirationId}
            onChange={e => setSelectedInspirationId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(160,184,224,0.25)',
              color: '#c0f0f8',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          >
            <option value="">-- 从灵感库中选择 --</option>
            {inspirations.map(i => (
              <option key={i.id} value={i.id}>
                [{i.category}] {i.content.slice(0, 30)}{i.content.length > 30 ? '…' : ''}
              </option>
            ))}
          </select>

          {selectedInspiration && (
            <div style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(112,216,232,0.06)',
              border: '1px solid rgba(112,216,232,0.15)',
              marginBottom: 14,
              fontSize: 12,
              lineHeight: 1.6,
              opacity: 0.8,
            }}>
              {selectedInspiration.content}
            </div>
          )}

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            项目名称
          </div>
          <input
            type="text"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="给这个孵化项目起个名字"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(160,184,224,0.25)',
              color: '#c0f0f8',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            孵化步骤（最多3步）
          </div>
          {stepInputs.map((step, i) => (
            <input
              key={i}
              type="text"
              value={step}
              onChange={e => {
                const newSteps = [...stepInputs]
                newSteps[i] = e.target.value
                setStepInputs(newSteps)
              }}
              placeholder={INCUBATION_STEP_TEMPLATES[i]}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(160,184,224,0.2)',
                color: '#c0f0f8',
                fontSize: 12,
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: 8,
                boxSizing: 'border-box',
              }}
            />
          ))}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>目标完成日期</div>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(160,184,224,0.2)',
                color: '#c0f0f8',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                colorScheme: 'dark',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                setShowForm(false)
                setSelectedInspirationId('')
                setProjectName('')
                setStepInputs(['', '', ''])
                setDeadline('')
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(192,240,248,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={startIncubation}
              disabled={!selectedInspirationId || !projectName.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #a0b8e0, #6090c8)',
                border: 'none',
                color: '#0a1525',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: selectedInspirationId && projectName.trim() ? 'pointer' : 'not-allowed',
                opacity: selectedInspirationId && projectName.trim() ? 1 : 0.5,
              }}
            >
              🥚 开始孵化
            </button>
          </div>
        </div>
      )}

      {/* 列表 */}
      {incubations.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            孵化项目
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {incubations.map(inc => {
              const doneSteps = inc.steps.filter(s => s.done).length
              const progress = inc.steps.length > 0
                ? Math.round((doneSteps / inc.steps.length) * 100)
                : 0
              return (
                <div key={inc.id} style={{
                  padding: '18px 20px',
                  borderRadius: 14,
                  background: inc.status === 'hatched'
                    ? 'rgba(120,224,200,0.06)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${inc.status === 'hatched' ? 'rgba(120,224,200,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  opacity: inc.status === 'hatched' ? 0.8 : 1,
                  transition: 'all 0.3s',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 12,
                  }}>
                    <div style={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: `${statusConfig[inc.status].color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      {statusConfig[inc.status].icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 500,
                        marginBottom: 4,
                        textDecoration: inc.status === 'hatched' ? 'line-through' : 'none',
                      }}>
                        {inc.projectName}
                      </div>
                      <div style={{
                        fontSize: 11,
                        opacity: 0.5,
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                        marginBottom: 8,
                      }}>
                        {inc.inspirationContent.length > 60
                          ? inc.inspirationContent.slice(0, 60) + '…'
                          : inc.inspirationContent}
                      </div>
                      <div style={{
                        width: '100%',
                        height: 4,
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                        marginBottom: 8,
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: statusConfig[inc.status].color,
                          transition: 'width 0.3s',
                        }} />
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: `${statusConfig[inc.status].color}20`,
                      color: statusConfig[inc.status].color,
                      flexShrink: 0,
                      letterSpacing: 1,
                    }}>
                      {statusConfig[inc.status].label}
                    </span>
                  </div>

                  {inc.steps.length > 0 && (
                    <div style={{ marginLeft: 44 }}>
                      {inc.steps.map((step, i) => (
                        <div
                          key={step.id}
                          onClick={() => toggleStep(inc.id, step.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '6px 0',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            opacity: step.done ? 0.5 : 1,
                          }}
                        >
                          <div style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: `2px solid ${step.done ? '#78e0c8' : 'rgba(255,255,255,0.2)'}`,
                            background: step.done ? '#78e0c8' : 'transparent',
                            flexShrink: 0,
                            marginTop: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: step.done ? '#0a1525' : 'transparent',
                            transition: 'all 0.2s',
                          }}>
                            ✓
                          </div>
                          <div style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            textDecoration: step.done ? 'line-through' : 'none',
                          }}>
                            {step.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{
                    marginLeft: 44,
                    marginTop: 10,
                    display: 'flex',
                    gap: 10,
                    fontSize: 11,
                    opacity: 0.4,
                  }}>
                    <span>{inc.createdAt}</span>
                    {inc.deadline && (<><span>·</span><span>目标 {inc.deadline}</span></>)}
                    <span>·</span>
                    <span>{doneSteps}/{inc.steps.length} 步</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🥚</div>
            <div style={{ fontSize: 13, letterSpacing: 2, lineHeight: 1.8 }}>
              还没有孵化项目
              <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
                选一个灵感<br />给它时间，它会长成惊喜
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
