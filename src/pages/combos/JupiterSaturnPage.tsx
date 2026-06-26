import { useState, useMemo, useCallback } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

/* ─────────────── 类型定义 ─────────────── */

interface Mentor {
  id: string
  name: string
  relationship: string
  period: string
  story: string
  impact: string
  lesson: string
  createdAt: string
}

interface StageMentor {
  id: string
  stage: string
  name: string
  role: string
  memory: string
  gratitude: string
  createdAt: string
}

interface HelperRecord {
  id: string
  name: string
  relationship: string
  helpType: string
  advice: string
  outcome: string
  date: string
}

interface LegacyItem {
  id: string
  category: string
  title: string
  content: string
  importance: number
  createdAt: string
}

/* ─────────────── 常量数据 ─────────────── */

const TAB_LIST = [
  { id: 'mentors', name: '贵人档案', icon: '🧑‍🏫', color: '#f0d8a0' },
  { id: 'stages', name: '人生阶段', icon: '📅', color: '#e8d090' },
  { id: 'helper', name: '我是贵人', icon: '🤲', color: '#d4b870' },
  { id: 'legacy', name: '传承清单', icon: '📜', color: '#c9a85a' },
] as const

const LIFE_STAGES = [
  { id: 'childhood', label: '童年', icon: '🧸', desc: '最早的记忆' },
  { id: 'primary', label: '小学', icon: '📚', desc: '启蒙时期' },
  { id: 'middle', label: '中学', icon: '🎒', desc: '成长岁月' },
  { id: 'university', label: '大学', icon: '🎓', desc: '独立探索' },
  { id: 'earlywork', label: '工作初期', icon: '💼', desc: '职场新人' },
  { id: 'now', label: '现在', icon: '✨', desc: '当下时光' },
]

const HELP_TYPES = [
  '职业指导',
  '情感支持',
  '生活建议',
  '技能传授',
  '资源介绍',
  '倾听陪伴',
  '其他帮助',
]

const LEGACY_CATEGORIES = [
  { id: 'career', label: '职业', icon: '💼' },
  { id: 'emotion', label: '情感', icon: '❤️' },
  { id: 'life', label: '生活', icon: '🌿' },
  { id: 'growth', label: '成长', icon: '🌱' },
]

/* ─────────────── 主组件 ─────────────── */

export default function JupiterSaturnPage() {
  const config = comboConfigs['jupiter-saturn']
  const [activeTab, setActiveTab] = useState<string>('mentors')

  const [mentors, setMentors] = useLocalStorage<Mentor[]>('js-mentors', [])
  const [stageMentors, setStageMentors] = useLocalStorage<StageMentor[]>('js-stage-mentors', [])
  const [helperRecords, setHelperRecords] = useLocalStorage<HelperRecord[]>('js-helpers', [])
  const [legacyItems, setLegacyItems] = useLocalStorage<LegacyItem[]>('js-legacy', [])

  const activeTabData = TAB_LIST.find(t => t.id === activeTab)!

  return (
    <ComboShell config={config}>
      <div>
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
                color: activeTab === tab.id ? tab.color : 'rgba(255,240,208,0.6)',
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

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {activeTab === 'mentors' && (
            <MentorArchive mentors={mentors} setMentors={setMentors} />
          )}
          {activeTab === 'stages' && (
            <LifeStageReview stageMentors={stageMentors} setStageMentors={setStageMentors} />
          )}
          {activeTab === 'helper' && (
            <IAmMentor records={helperRecords} setRecords={setHelperRecords} />
          )}
          {activeTab === 'legacy' && (
            <LegacyList items={legacyItems} setItems={setLegacyItems} />
          )}
        </div>
      </div>
    </ComboShell>
  )
}

/* ─────────────── 模块一：贵人档案 ─────────────── */

function MentorArchive({ mentors, setMentors }: {
  mentors: Mentor[]
  setMentors: (v: Mentor[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [period, setPeriod] = useState('')
  const [story, setStory] = useState('')
  const [impact, setImpact] = useState('')
  const [lesson, setLesson] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const addMentor = useCallback(() => {
    if (!name.trim()) return
    const newItem: Mentor = {
      id: `${Date.now()}`,
      name: name.trim(),
      relationship: relationship.trim(),
      period: period.trim(),
      story: story.trim(),
      impact: impact.trim(),
      lesson: lesson.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setMentors([newItem, ...mentors])
    setShowForm(false)
    setName('')
    setRelationship('')
    setPeriod('')
    setStory('')
    setImpact('')
    setLesson('')
  }, [name, relationship, period, story, impact, lesson, mentors, setMentors])

  const deleteMentor = useCallback((id: string) => {
    setMentors(mentors.filter(m => m.id !== id))
  }, [mentors, setMentors])

  const uniqueRelationships = useMemo(() => {
    const set = new Set(mentors.map(m => m.relationship).filter(Boolean))
    return set.size
  }, [mentors])

  const hasLessonCount = useMemo(() => {
    return mentors.filter(m => m.lesson).length
  }, [mentors])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(240,216,160,0.08), rgba(232,208,144,0.04))',
      border: '1px solid rgba(240,216,160,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="贵人总数" value={mentors.length} icon="🧑‍🏫" color="#f0d8a0" />
        <StatCard label="关系种类" value={uniqueRelationships} icon="🔗" color="#e8d090" />
        <StatCard label="珍贵教训" value={hasLessonCount} icon="💡" color="#d4b870" />
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(240,216,160,0.15), rgba(232,208,144,0.05))',
            border: '2px dashed rgba(240,216,160,0.4)',
            color: '#f0d8a0',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          ✨ 记录一位生命中的贵人
        </button>
      )}

      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(240,216,160,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#f0d8a0', marginBottom: 16, letterSpacing: 2 }}>
            ✨ 那位影响过你的人
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="TA的名字"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240,216,160,0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <input
              type="text"
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              placeholder="你们的关系"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(240,216,160,0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <input
            type="text"
            value={period}
            onChange={e => setPeriod(e.target.value)}
            placeholder="什么时候遇到的？（如：2018年冬 / 大三那年）"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(240,216,160,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            你们之间的故事
          </div>
          <textarea
            value={story}
            onChange={e => setStory(e.target.value)}
            placeholder="写下你们的相遇与故事……"
            style={{
              width: '100%',
              minHeight: 70,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(240,216,160,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 10,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            TA对你的影响
          </div>
          <textarea
            value={impact}
            onChange={e => setImpact(e.target.value)}
            placeholder="TA如何改变了你的人生轨迹……"
            style={{
              width: '100%',
              minHeight: 60,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(240,216,160,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 10,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            从TA身上学到的一句话/道理
          </div>
          <textarea
            value={lesson}
            onChange={e => setLesson(e.target.value)}
            placeholder="那句让你铭记在心的话……"
            style={{
              width: '100%',
              minHeight: 50,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(240,216,160,0.25)',
              color: '#fff0d0',
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
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,240,208,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={addMentor}
              disabled={!name.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #f0d8a0, #e8d090)',
                border: 'none',
                color: '#1a160a',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                opacity: name.trim() ? 1 : 0.5,
              }}
            >
              ✨ 记录贵人
            </button>
          </div>
        </div>
      )}

      {mentors.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            贵人档案
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mentors.map(mentor => (
              <div key={mentor.id} style={{
                padding: '18px 20px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s',
              }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(expandedId === mentor.id ? null : mentor.id)}
                >
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{mentor.name}</span>
                    {mentor.relationship && (
                      <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 8, fontWeight: 'normal' }}>
                        · {mentor.relationship}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {mentor.period && (
                      <span style={{ fontSize: 11, color: '#f0d8a0', opacity: 0.7 }}>{mentor.period}</span>
                    )}
                    <span style={{ fontSize: 12, opacity: 0.4 }}>
                      {expandedId === mentor.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {mentor.lesson && (
                  <div style={{
                    fontSize: 13,
                    color: '#f0d8a0',
                    fontStyle: 'italic',
                    marginTop: 10,
                    marginBottom: expandedId === mentor.id ? 12 : 0,
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}>
                    "{mentor.lesson}"
                  </div>
                )}

                {expandedId === mentor.id && (
                  <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {mentor.story && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4, letterSpacing: 1 }}>故事</div>
                        <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>{mentor.story}</div>
                      </div>
                    )}
                    {mentor.impact && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4, letterSpacing: 1 }}>影响</div>
                        <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.85 }}>{mentor.impact}</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, opacity: 0.4 }}>记录于 {mentor.createdAt}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteMentor(mentor.id)
                        }}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 999,
                          background: 'rgba(255,100,100,0.1)',
                          border: '1px solid rgba(255,100,100,0.2)',
                          color: 'rgba(255,150,150,0.7)',
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧑‍🏫</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有贵人记录
            </div>
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              那些出现在你生命里的人，都在年轮里
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 模块二：人生阶段回顾 ─────────────── */

function LifeStageReview({ stageMentors, setStageMentors }: {
  stageMentors: StageMentor[]
  setStageMentors: (v: StageMentor[]) => void
}) {
  const [activeStage, setActiveStage] = useState(LIFE_STAGES[0].id)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [memory, setMemory] = useState('')
  const [gratitude, setGratitude] = useState('')

  const addStageMentor = useCallback(() => {
    if (!name.trim()) return
    const newItem: StageMentor = {
      id: `${Date.now()}`,
      stage: activeStage,
      name: name.trim(),
      role: role.trim(),
      memory: memory.trim(),
      gratitude: gratitude.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setStageMentors([newItem, ...stageMentors])
    setShowForm(false)
    setName('')
    setRole('')
    setMemory('')
    setGratitude('')
  }, [activeStage, name, role, memory, gratitude, stageMentors, setStageMentors])

  const deleteStageMentor = useCallback((id: string) => {
    setStageMentors(stageMentors.filter(m => m.id !== id))
  }, [stageMentors, setStageMentors])

  const stageMentorsMap = useMemo(() => {
    const map: Record<string, StageMentor[]> = {}
    LIFE_STAGES.forEach(s => { map[s.id] = [] })
    stageMentors.forEach(m => {
      if (map[m.stage]) map[m.stage].push(m)
    })
    return map
  }, [stageMentors])

  const totalStagesCovered = useMemo(() => {
    return LIFE_STAGES.filter(s => stageMentorsMap[s.id].length > 0).length
  }, [stageMentorsMap])

  const currentStageMentors = stageMentorsMap[activeStage] || []

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(232,208,144,0.08), rgba(240,216,160,0.04))',
      border: '1px solid rgba(232,208,144,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="贵人总数" value={stageMentors.length} icon="📅" color="#e8d090" />
        <StatCard label="覆盖阶段" value={`${totalStagesCovered}/${LIFE_STAGES.length}`} icon="🎯" color="#f0d8a0" />
        <StatCard label="当前阶段" value={currentStageMentors.length} icon="✨" color="#d4b870" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: 24,
      }}>
        {LIFE_STAGES.map(stage => (
          <button
            key={stage.id}
            onClick={() => setActiveStage(stage.id)}
            style={{
              padding: '14px 10px',
              borderRadius: 12,
              background: activeStage === stage.id
                ? 'linear-gradient(135deg, rgba(232,208,144,0.25), rgba(232,208,144,0.08))'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeStage === stage.id ? '#e8d090' : 'rgba(255,255,255,0.08)'}`,
              color: activeStage === stage.id ? '#e8d090' : 'rgba(255,240,208,0.5)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{stage.icon}</div>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>{stage.label}</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>{stage.desc}</div>
            <div style={{
              marginTop: 6,
              fontSize: 10,
              opacity: 0.8,
              color: '#f0d8a0',
            }}>
              {stageMentorsMap[stage.id]?.length || 0} 位贵人
            </div>
          </button>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(232,208,144,0.15), rgba(240,216,160,0.05))',
            border: '2px dashed rgba(232,208,144,0.4)',
            color: '#e8d090',
            fontSize: 13,
            letterSpacing: 2,
            cursor: 'pointer',
            marginBottom: 20,
            transition: 'all 0.3s',
          }}
        >
          + 添加这个阶段的贵人
        </button>
      )}

      {showForm && (
        <div style={{
          padding: 20,
          borderRadius: 12,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(232,208,144,0.25)',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, color: '#e8d090', marginBottom: 14, letterSpacing: 2 }}>
            记录 {LIFE_STAGES.find(s => s.id === activeStage)?.label} 时期的贵人
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="TA的名字"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(232,208,144,0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="TA的身份（如：班主任）"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(232,208,144,0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>难忘的记忆</div>
          <textarea
            value={memory}
            onChange={e => setMemory(e.target.value)}
            placeholder="那个让你难忘的场景……"
            style={{
              width: '100%',
              minHeight: 60,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(232,208,144,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 10,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>想对TA说的感谢</div>
          <textarea
            value={gratitude}
            onChange={e => setGratitude(e.target.value)}
            placeholder="在心里对TA说声谢谢……"
            style={{
              width: '100%',
              minHeight: 50,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(232,208,144,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,240,208,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={addStageMentor}
              disabled={!name.trim()}
              style={{
                flex: 2,
                padding: '10px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #e8d090, #f0d8a0)',
                border: 'none',
                color: '#1a160a',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                opacity: name.trim() ? 1 : 0.5,
              }}
            >
              ✨ 记录
            </button>
          </div>
        </div>
      )}

      {currentStageMentors.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 14, letterSpacing: 2 }}>
            {LIFE_STAGES.find(s => s.id === activeStage)?.label}时期的贵人
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentStageMentors.map(m => (
              <div key={m.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{m.name}</span>
                    {m.role && (
                      <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 8 }}>· {m.role}</span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteStageMentor(m.id)}
                    style={{
                      padding: '2px 10px',
                      borderRadius: 999,
                      background: 'rgba(255,100,100,0.1)',
                      border: '1px solid rgba(255,100,100,0.2)',
                      color: 'rgba(255,150,150,0.7)',
                      fontSize: 10,
                      cursor: 'pointer',
                    }}
                  >
                    删除
                  </button>
                </div>
                {m.memory && (
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6, lineHeight: 1.6 }}>
                    📝 {m.memory}
                  </div>
                )}
                {m.gratitude && (
                  <div style={{ fontSize: 12, color: '#e8d090', opacity: 0.8, lineHeight: 1.6, fontStyle: 'italic' }}>
                    💛 {m.gratitude}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '30px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{LIFE_STAGES.find(s => s.id === activeStage)?.icon}</div>
            <div style={{ fontSize: 12, letterSpacing: 2 }}>
              这个阶段还没有贵人记录
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 模块三：我是贵人 ─────────────── */

function IAmMentor({ records, setRecords }: {
  records: HelperRecord[]
  setRecords: (v: HelperRecord[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [helpType, setHelpType] = useState(HELP_TYPES[0])
  const [advice, setAdvice] = useState('')
  const [outcome, setOutcome] = useState('')
  const [date, setDate] = useState('')

  const addRecord = useCallback(() => {
    if (!name.trim()) return
    const newItem: HelperRecord = {
      id: `${Date.now()}`,
      name: name.trim(),
      relationship: relationship.trim(),
      helpType,
      advice: advice.trim(),
      outcome: outcome.trim(),
      date: date || new Date().toLocaleDateString('zh-CN'),
    }
    setRecords([newItem, ...records])
    setShowForm(false)
    setName('')
    setRelationship('')
    setHelpType(HELP_TYPES[0])
    setAdvice('')
    setOutcome('')
    setDate('')
  }, [name, relationship, helpType, advice, outcome, date, records, setRecords])

  const deleteRecord = useCallback((id: string) => {
    setRecords(records.filter(r => r.id !== id))
  }, [records, setRecords])

  const uniquePeople = useMemo(() => {
    return new Set(records.map(r => r.name)).size
  }, [records])

  const topHelpType = useMemo(() => {
    if (records.length === 0) return '-'
    const count: Record<string, number> = {}
    records.forEach(r => {
      count[r.helpType] = (count[r.helpType] || 0) + 1
    })
    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || '-'
  }, [records])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(212,184,112,0.08), rgba(232,208,144,0.04))',
      border: '1px solid rgba(212,184,112,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="帮助人数" value={uniquePeople} icon="🤲" color="#d4b870" />
        <StatCard label="帮助次数" value={records.length} icon="💝" color="#f0d8a0" />
        <StatCard label="最常帮助" value={topHelpType} icon="🌟" color="#e8d090" />
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(212,184,112,0.15), rgba(232,208,144,0.05))',
            border: '2px dashed rgba(212,184,112,0.4)',
            color: '#d4b870',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          🤲 记录一次我成为贵人的经历
        </button>
      )}

      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(212,184,112,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#d4b870', marginBottom: 16, letterSpacing: 2 }}>
            🤲 你帮助过的人
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="TA的名字"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(212,184,112,0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <input
              type="text"
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              placeholder="你们的关系"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(212,184,112,0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            帮助类型
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {HELP_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setHelpType(type)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: helpType === type
                    ? 'rgba(212,184,112,0.25)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${helpType === type ? '#d4b870' : 'rgba(255,255,255,0.1)'}`,
                  color: helpType === type ? '#d4b870' : 'rgba(255,240,208,0.5)',
                  fontSize: 11,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            你给过的建议/帮助
          </div>
          <textarea
            value={advice}
            onChange={e => setAdvice(e.target.value)}
            placeholder="你对TA说了什么？做了什么？"
            style={{
              width: '100%',
              minHeight: 70,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(212,184,112,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 10,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            结果如何？
          </div>
          <textarea
            value={outcome}
            onChange={e => setOutcome(e.target.value)}
            placeholder="TA后来怎么样了？你有什么感受？"
            style={{
              width: '100%',
              minHeight: 60,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(212,184,112,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>日期（可选）</div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(212,184,112,0.25)',
                color: '#fff0d0',
                fontSize: 13,
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,240,208,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={addRecord}
              disabled={!name.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #d4b870, #e8d090)',
                border: 'none',
                color: '#1a160a',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                opacity: name.trim() ? 1 : 0.5,
              }}
            >
              🤲 记录
            </button>
          </div>
        </div>
      )}

      {records.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            我是贵人的经历（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {records.slice(0, 5).map(r => (
              <div key={r.id} style={{
                padding: '16px 18px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{r.name}</span>
                    {r.relationship && (
                      <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 8 }}>· {r.relationship}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: 'rgba(212,184,112,0.15)',
                      color: '#d4b870',
                    }}>
                      {r.helpType}
                    </span>
                    <button
                      onClick={() => deleteRecord(r.id)}
                      style={{
                        padding: '2px 10px',
                        borderRadius: 999,
                        background: 'rgba(255,100,100,0.1)',
                        border: '1px solid rgba(255,100,100,0.2)',
                        color: 'rgba(255,150,150,0.7)',
                        fontSize: 10,
                        cursor: 'pointer',
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
                {r.advice && (
                  <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6, lineHeight: 1.6 }}>
                    💬 {r.advice}
                  </div>
                )}
                {r.outcome && (
                  <div style={{ fontSize: 12, color: '#d4b870', opacity: 0.85, lineHeight: 1.6 }}>
                    🌟 {r.outcome}
                  </div>
                )}
                <div style={{ fontSize: 11, opacity: 0.4, marginTop: 8 }}>{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🤲</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有记录
            </div>
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              你也是别人生命中的贵人
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 模块四：传承清单 ─────────────── */

function LegacyList({ items, setItems }: {
  items: LegacyItem[]
  setItems: (v: LegacyItem[]) => void
}) {
  const [activeCategory, setActiveCategory] = useState(LEGACY_CATEGORIES[0].id)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [importance, setImportance] = useState(3)

  const addItem = useCallback(() => {
    if (!title.trim()) return
    const newItem: LegacyItem = {
      id: `${Date.now()}`,
      category: activeCategory,
      title: title.trim(),
      content: content.trim(),
      importance,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setItems([newItem, ...items])
    setShowForm(false)
    setTitle('')
    setContent('')
    setImportance(3)
  }, [activeCategory, title, content, importance, items, setItems])

  const deleteItem = useCallback((id: string) => {
    setItems(items.filter(i => i.id !== id))
  }, [items, setItems])

  const categoryItems = useMemo(() => {
    return items.filter(i => i.category === activeCategory)
  }, [items, activeCategory])

  const totalItems = items.length
  const highImportance = items.filter(i => i.importance >= 4).length
  const categoriesCovered = new Set(items.map(i => i.category)).size

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(201,168,90,0.08), rgba(212,184,112,0.04))',
      border: '1px solid rgba(201,168,90,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="智慧总数" value={totalItems} icon="📜" color="#c9a85a" />
        <StatCard label="珍贵智慧" value={highImportance} icon="💎" color="#f0d8a0" />
        <StatCard label="覆盖领域" value={`${categoriesCovered}/4`} icon="🎯" color="#d4b870" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        marginBottom: 24,
      }}>
        {LEGACY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '14px 8px',
              borderRadius: 12,
              background: activeCategory === cat.id
                ? 'linear-gradient(135deg, rgba(201,168,90,0.25), rgba(201,168,90,0.08))'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${activeCategory === cat.id ? '#c9a85a' : 'rgba(255,255,255,0.08)'}`,
              color: activeCategory === cat.id ? '#c9a85a' : 'rgba(255,240,208,0.5)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
            <div style={{ fontWeight: 500 }}>{cat.label}</div>
            <div style={{
              marginTop: 4,
              fontSize: 10,
              opacity: 0.8,
              color: '#f0d8a0',
            }}>
              {items.filter(i => i.category === cat.id).length} 条
            </div>
          </button>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(201,168,90,0.15), rgba(212,184,112,0.05))',
            border: '2px dashed rgba(201,168,90,0.4)',
            color: '#c9a85a',
            fontSize: 13,
            letterSpacing: 2,
            cursor: 'pointer',
            marginBottom: 20,
            transition: 'all 0.3s',
          }}
        >
          + 添加一条{LEGACY_CATEGORIES.find(c => c.id === activeCategory)?.label}智慧
        </button>
      )}

      {showForm && (
        <div style={{
          padding: 20,
          borderRadius: 12,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(201,168,90,0.25)',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, color: '#c9a85a', marginBottom: 14, letterSpacing: 2 }}>
            📜 记录想传承的智慧
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>标题</div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="用一句话概括这条智慧……"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(201,168,90,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>详细内容</div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="详细描述这条智慧、经验或教训……"
            style={{
              width: '100%',
              minHeight: 80,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(201,168,90,0.25)',
              color: '#fff0d0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10 }}>重要程度</div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setImportance(s)}
                style={{
                  fontSize: 24,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: importance >= s ? 1 : 0.3,
                  transition: 'all 0.2s',
                  transform: importance >= s ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                💎
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,240,208,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={addItem}
              disabled={!title.trim()}
              style={{
                flex: 2,
                padding: '10px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #c9a85a, #d4b870)',
                border: 'none',
                color: '#1a160a',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                opacity: title.trim() ? 1 : 0.5,
              }}
            >
              📜 记录
            </button>
          </div>
        </div>
      )}

      {categoryItems.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 14, letterSpacing: 2 }}>
            {LEGACY_CATEGORIES.find(c => c.id === activeCategory)?.label}智慧
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {categoryItems.map(item => (
              <div key={item.id} style={{
                padding: '16px 18px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
                position: 'relative',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{item.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>
                      {'💎'.repeat(item.importance)}
                    </span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{
                        padding: '2px 10px',
                        borderRadius: 999,
                        background: 'rgba(255,100,100,0.1)',
                        border: '1px solid rgba(255,100,100,0.2)',
                        color: 'rgba(255,150,150,0.7)',
                        fontSize: 10,
                        cursor: 'pointer',
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
                {item.content && (
                  <div style={{
                    fontSize: 12,
                    opacity: 0.75,
                    lineHeight: 1.7,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(201,168,90,0.06)',
                    borderLeft: '3px solid #c9a85a',
                  }}>
                    {item.content}
                  </div>
                )}
                <div style={{ fontSize: 11, opacity: 0.4, marginTop: 10 }}>
                  记录于 {item.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '30px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>
              {LEGACY_CATEGORIES.find(c => c.id === activeCategory)?.icon}
            </div>
            <div style={{ fontSize: 12, letterSpacing: 2 }}>
              这个领域还没有智慧记录
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 通用统计卡片 ─────────────── */

function StatCard({ label, value, icon, color }: {
  label: string
  value: number | string
  icon: string
  color: string
}) {
  return (
    <div style={{
      padding: '16px 12px',
      borderRadius: 14,
      background: 'rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.06)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>{label}</div>
    </div>
  )
}
