import { useState, useMemo, useCallback } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

/* ─────────────── 类型定义 ─────────────── */

interface Mission {
  id: string
  title: string
  description: string
  earthTasks: { id: string; text: string; done: boolean }[]
  marsTasks: { id: string; text: string; done: boolean }[]
  createdAt: string
  completed?: boolean
}

interface CourageItem {
  id: string
  content: string
  level: 'small' | 'medium' | 'large'
  done: boolean
  createdAt: string
  completedAt?: string
}

interface AdventureLog {
  id: string
  title: string
  content: string
  mood: string
  harvest: string
  date: string
}

interface ComfortBreak {
  id: string
  challenge: string
  date: string
  completed: boolean
  note: string
}

/* ─────────────── 常量数据 ─────────────── */

const TAB_LIST = [
  { id: 'mission', name: '漫游任务', icon: '🚀', color: '#ff9860' },
  { id: 'courage', name: '勇气清单', icon: '💪', color: '#ff7b3d' },
  { id: 'journal', name: '探险日志', icon: '📔', color: '#6ab8e8' },
  { id: 'comfort', name: '舒适区突破', icon: '🎯', color: '#ffa070' },
] as const

const COURAGE_LEVELS = {
  small: { label: '小勇气', color: '#6ab8e8', icon: '🌱', desc: '迈出一小步' },
  medium: { label: '中勇气', color: '#ffb07a', icon: '🔥', desc: '挑战不习惯' },
  large: { label: '大勇气', color: '#ff7b3d', icon: '🚀', desc: '突破舒适区' },
}

const MOOD_OPTIONS = [
  { emoji: '😄', label: '兴奋' },
  { emoji: '😤', label: '紧张' },
  { emoji: '😌', label: '平静' },
  { emoji: '🥳', label: '成就感' },
  { emoji: '🤔', label: '思考' },
  { emoji: '💪', label: '充满力量' },
]

const DEFAULT_CHALLENGES = [
  '主动和一个陌生人打招呼',
  '尝试一种从没吃过的食物',
  '走一条不一样的回家路线',
  '在会议上主动发言一次',
  '早起30分钟做运动',
  '给很久没联系的朋友发条消息',
  '学习一个新技能的入门知识',
  '拒绝一个不想做的请求',
  '独自去一家新餐厅吃饭',
  '在公开场合表达不同意见',
]

/* ─────────────── 主组件 ─────────────── */

export default function EarthMarsPage() {
  const config = comboConfigs['earth-mars']
  const [activeTab, setActiveTab] = useState<string>('mission')

  const [missions, setMissions] = useLocalStorage<Mission[]>('em-missions', [])
  const [courages, setCourages] = useLocalStorage<CourageItem[]>('em-courages', [])
  const [journals, setJournals] = useLocalStorage<AdventureLog[]>('em-journals', [])
  const [comfortBreaks, setComfortBreaks] = useLocalStorage<ComfortBreak[]>('em-comfort', [])

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
                color: activeTab === tab.id ? tab.color : 'rgba(255,232,192,0.6)',
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
          {activeTab === 'mission' && (
            <RoamingMission missions={missions} setMissions={setMissions} />
          )}
          {activeTab === 'courage' && (
            <CourageList courages={courages} setCourages={setCourages} />
          )}
          {activeTab === 'journal' && (
            <AdventureJournal journals={journals} setJournals={setJournals} />
          )}
          {activeTab === 'comfort' && (
            <ComfortZoneBreak comfortBreaks={comfortBreaks} setComfortBreaks={setComfortBreaks} />
          )}
        </div>
      </div>
    </ComboShell>
  )
}

/* ─────────────── 模块一：漫游任务 ─────────────── */

function RoamingMission({ missions, setMissions }: {
  missions: Mission[]
  setMissions: (v: Mission[]) => void
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newEarthTask, setNewEarthTask] = useState('')
  const [newMarsTask, setNewMarsTask] = useState('')
  const [earthTaskList, setEarthTaskList] = useState<string[]>([])
  const [marsTaskList, setMarsTaskList] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEarthTask = useCallback(() => {
    if (!newEarthTask.trim()) return
    setEarthTaskList([...earthTaskList, newEarthTask.trim()])
    setNewEarthTask('')
  }, [newEarthTask, earthTaskList])

  const addMarsTask = useCallback(() => {
    if (!newMarsTask.trim()) return
    setMarsTaskList([...marsTaskList, newMarsTask.trim()])
    setNewMarsTask('')
  }, [newMarsTask, marsTaskList])

  const createMission = useCallback(() => {
    if (!newTitle.trim()) return
    const newMission: Mission = {
      id: `${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      earthTasks: earthTaskList.map((t, i) => ({ id: `e-${i}`, text: t, done: false })),
      marsTasks: marsTaskList.map((t, i) => ({ id: `m-${i}`, text: t, done: false })),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setMissions([newMission, ...missions])
    setShowCreate(false)
    setNewTitle('')
    setNewDesc('')
    setEarthTaskList([])
    setMarsTaskList([])
  }, [newTitle, newDesc, earthTaskList, marsTaskList, missions, setMissions])

  const toggleTask = useCallback((missionId: string, type: 'earth' | 'mars', taskId: string) => {
    setMissions(missions.map((m) => {
      if (m.id !== missionId) return m
      const tasks = type === 'earth' ? m.earthTasks : m.marsTasks
      const updated = tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
      const allDone = [...updated, ...(type === 'earth' ? m.marsTasks : m.earthTasks)].every((t) => t.done)
      return {
        ...m,
        [type === 'earth' ? 'earthTasks' : 'marsTasks']: updated,
        completed: allDone,
      }
    }))
  }, [missions, setMissions])

  const getProgress = useCallback((mission: Mission) => {
    const all = [...mission.earthTasks, ...mission.marsTasks]
    if (all.length === 0) return 0
    const done = all.filter((t) => t.done).length
    return Math.round((done / all.length) * 100)
  }, [])

  const completedCount = useMemo(() => missions.filter(m => m.completed).length, [missions])
  const totalTasks = useMemo(() => missions.reduce((s, m) => s + m.earthTasks.length + m.marsTasks.length, 0), [missions])
  const avgProgress = useMemo(() => {
    if (missions.length === 0) return 0
    const total = missions.reduce((s, m) => s + getProgress(m), 0)
    return Math.round(total / missions.length)
  }, [missions, getProgress])

  const selectedMission = missions.find((m) => m.id === selectedId)

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,152,96,0.08), rgba(106,184,232,0.04))',
      border: '1px solid rgba(255,152,96,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计概览 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="漫游总数" value={missions.length} icon="🚀" color="#ff9860" />
        <StatCard label="已完成" value={completedCount} icon="🏆" color="#6ab8e8" />
        <StatCard label="总任务数" value={totalTasks} icon="📋" color="#ffb07a" />
      </div>

      {/* 主交互区 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #ff9860, #ff7b3d)',
            border: 'none',
            color: '#1a0f05',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 4,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(255,152,96,0.3)',
          }}
        >
          🚀 开启新的漫游
        </button>
      </div>

      {showCreate && (
        <div style={{
          padding: 24,
          borderRadius: 20,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,152,96,0.25)',
          backdropFilter: 'blur(10px)',
          marginBottom: 30,
        }}>
          <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ff9860' }}>
            ✨ 设定你的漫游目标
          </div>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="这次漫游的目标是……"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,152,96,0.25)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              marginBottom: 12,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />

          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="为什么要开始这次漫游？"
            style={{
              width: '100%',
              minHeight: 60,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,152,96,0.25)',
              color: '#ffe8c0',
              fontSize: 13,
              outline: 'none',
              marginBottom: 16,
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#6ab8e8', marginBottom: 8, letterSpacing: 2 }}>
              🌍 地球任务（现实中的稳步前进）
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={newEarthTask}
                onChange={(e) => setNewEarthTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEarthTask()}
                placeholder="添加一个地球任务"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(106,184,232,0.25)',
                  color: '#e0f0f8',
                  fontSize: 12,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={addEarthTask}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'rgba(106,184,232,0.2)',
                  border: '1px solid rgba(106,184,232,0.4)',
                  color: '#b8d8e8',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                添加
              </button>
            </div>
            {earthTaskList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {earthTaskList.map((t, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(106,184,232,0.1)',
                    border: '1px solid rgba(106,184,232,0.2)',
                    fontSize: 11,
                    color: '#b8d8e8',
                  }}>
                    {t}
                    <button
                      onClick={() => setEarthTaskList(earthTaskList.filter((_, idx) => idx !== i))}
                      style={{ marginLeft: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#ff9860', marginBottom: 8, letterSpacing: 2 }}>
              🔴 火星探索（突破性的挑战）
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={newMarsTask}
                onChange={(e) => setNewMarsTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMarsTask()}
                placeholder="添加一个火星挑战"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,152,96,0.25)',
                  color: '#ffe8c0',
                  fontSize: 12,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={addMarsTask}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'rgba(255,152,96,0.2)',
                  border: '1px solid rgba(255,152,96,0.4)',
                  color: '#ffd4b8',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                添加
              </button>
            </div>
            {marsTaskList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {marsTaskList.map((t, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(255,152,96,0.1)',
                    border: '1px solid rgba(255,152,96,0.2)',
                    fontSize: 11,
                    color: '#ffd4b8',
                  }}>
                    {t}
                    <button
                      onClick={() => setMarsTaskList(marsTaskList.filter((_, idx) => idx !== i))}
                      style={{ marginLeft: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowCreate(false)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={createMission}
              disabled={!newTitle.trim()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ff9860, #ff7b3d)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: newTitle.trim() ? 'pointer' : 'not-allowed',
                opacity: newTitle.trim() ? 1 : 0.5,
              }}
            >
              🚀 出发！
            </button>
          </div>
        </div>
      )}

      {/* 任务列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {missions.length === 0 && !showCreate && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            opacity: 0.3,
            fontSize: 13,
            letterSpacing: 3,
          }}>
            🚀 还没有漫游计划
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              点击上方按钮，开启你的第一次地火漫游
            </div>
          </div>
        )}

        {missions.map((mission) => {
          const progress = getProgress(mission)
          return (
            <div
              key={mission.id}
              onClick={() => setSelectedId(mission.id === selectedId ? null : mission.id)}
              style={{
                padding: 20,
                borderRadius: 16,
                background: mission.completed
                  ? 'linear-gradient(135deg, rgba(255,152,96,0.12), rgba(106,184,232,0.08))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${mission.completed ? 'rgba(255,152,96,0.3)' : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>
                  {mission.completed && '🏆 '}{mission.title}
                </div>
                <div style={{ fontSize: 11, opacity: 0.5 }}>{mission.createdAt}</div>
              </div>

              {mission.description && (
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, lineHeight: 1.6 }}>
                  {mission.description}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 999,
                      background: 'linear-gradient(90deg, #6ab8e8, #ff9860)',
                      width: `${progress}%`,
                      transition: 'width 0.5s ease-out',
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: '#ff9860', minWidth: 45, textAlign: 'right' }}>
                  {progress}%
                </span>
              </div>

              <div style={{ display: 'flex', gap: 20, marginTop: 10, fontSize: 11, opacity: 0.5 }}>
                <span>🌍 {mission.earthTasks.filter(t => t.done).length}/{mission.earthTasks.length}</span>
                <span>🔴 {mission.marsTasks.filter(t => t.done).length}/{mission.marsTasks.length}</span>
              </div>

              {selectedId === mission.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  {mission.earthTasks.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: '#6ab8e8', marginBottom: 8, letterSpacing: 2 }}>🌍 地球任务</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {mission.earthTasks.map((task) => (
                          <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleTask(mission.id, 'earth', task.id)
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{
                              textDecoration: task.done ? 'line-through' : 'none',
                              opacity: task.done ? 0.4 : 1,
                            }}>
                              {task.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {mission.marsTasks.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#ff9860', marginBottom: 8, letterSpacing: 2 }}>🔴 火星探索</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {mission.marsTasks.map((task) => (
                          <label key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleTask(mission.id, 'mars', task.id)
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{
                              textDecoration: task.done ? 'line-through' : 'none',
                              opacity: task.done ? 0.4 : 1,
                            }}>
                              {task.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 历史记录 */}
      {missions.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            漫游记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {missions.slice(0, 5).map(m => (
              <div key={m.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, opacity: 0.9 }}>
                  {m.completed ? '🏆 ' : ''}{m.title}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  <span>{m.createdAt}</span>
                  <span>·</span>
                  <span>🌍 {m.earthTasks.filter(t => t.done).length}/{m.earthTasks.length}</span>
                  <span>·</span>
                  <span>🔴 {m.marsTasks.filter(t => t.done).length}/{m.marsTasks.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块二：勇气清单 ─────────────── */

function CourageList({ courages, setCourages }: {
  courages: CourageItem[]
  setCourages: (v: CourageItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [level, setLevel] = useState<'small' | 'medium' | 'large'>('medium')

  const addCourage = useCallback(() => {
    if (!content.trim()) return
    const newItem: CourageItem = {
      id: `${Date.now()}`,
      content: content.trim(),
      level,
      done: false,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setCourages([newItem, ...courages])
    setShowForm(false)
    setContent('')
    setLevel('medium')
  }, [content, level, courages, setCourages])

  const toggleCourage = useCallback((id: string) => {
    setCourages(courages.map(c => {
      if (c.id !== id) return c
      return {
        ...c,
        done: !c.done,
        completedAt: !c.done ? new Date().toLocaleDateString('zh-CN') : undefined,
      }
    }))
  }, [courages, setCourages])

  const deleteCourage = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCourages(courages.filter(c => c.id !== id))
  }, [courages, setCourages])

  const doneCount = useMemo(() => courages.filter(c => c.done).length, [courages])
  const largeCount = useMemo(() => courages.filter(c => c.level === 'large').length, [courages])
  const doneLarge = useMemo(() => courages.filter(c => c.level === 'large' && c.done).length, [courages])

  const sortedCourages = useMemo(() => {
    return [...courages].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      const levelOrder = { large: 0, medium: 1, small: 2 }
      return levelOrder[a.level] - levelOrder[b.level]
    })
  }, [courages])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,123,61,0.08), rgba(255,152,96,0.04))',
      border: '1px solid rgba(255,123,61,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="勇气总数" value={courages.length} icon="💪" color="#ff7b3d" />
        <StatCard label="已完成" value={doneCount} icon="✅" color="#6ab8e8" />
        <StatCard label="大勇气完成" value={`${doneLarge}/${largeCount}`} icon="🚀" color="#ff9860" />
      </div>

      {/* 新建按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255,123,61,0.15), rgba(255,152,96,0.05))',
            border: '2px dashed rgba(255,123,61,0.4)',
            color: '#ff7b3d',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          💪 添加一个想做但不敢做的事
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,123,61,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#ff7b3d', marginBottom: 16, letterSpacing: 2 }}>
            💪 添加勇气挑战
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="你想做但一直不敢做的事是什么？"
            style={{
              width: '100%',
              minHeight: 70,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,123,61,0.2)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 1 }}>
            选择勇气等级
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {(['small', 'medium', 'large'] as const).map(lv => (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                style={{
                  padding: '14px 10px',
                  borderRadius: 12,
                  background: level === lv
                    ? `${COURAGE_LEVELS[lv].color}30`
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${level === lv ? COURAGE_LEVELS[lv].color : 'rgba(255,255,255,0.1)'}`,
                  color: level === lv ? COURAGE_LEVELS[lv].color : 'rgba(255,232,192,0.6)',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{COURAGE_LEVELS[lv].icon}</div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{COURAGE_LEVELS[lv].label}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{COURAGE_LEVELS[lv].desc}</div>
              </button>
            ))}
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
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={addCourage}
              disabled={!content.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ff7b3d, #ff9860)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: content.trim() ? 'pointer' : 'not-allowed',
                opacity: content.trim() ? 1 : 0.5,
              }}
            >
              💪 添加挑战
            </button>
          </div>
        </div>
      )}

      {/* 勇气列表 */}
      {sortedCourages.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            勇气清单
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedCourages.map(c => (
              <div key={c.id} style={{
                padding: '16px 18px',
                borderRadius: 14,
                background: c.done ? 'rgba(106,184,232,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${c.done ? 'rgba(106,184,232,0.2)' : 'rgba(255,255,255,0.06)'}`,
                opacity: c.done ? 0.6 : 1,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <button
                  onClick={() => toggleCourage(c.id)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: c.done ? '#6ab8e8' : 'transparent',
                    border: `2px solid ${c.done ? '#6ab8e8' : COURAGE_LEVELS[c.level].color}`,
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: c.done ? '#1a0f05' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  ✓
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    textDecoration: c.done ? 'line-through' : 'none',
                    marginBottom: 6,
                  }}>
                    {c.content}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 11,
                    opacity: 0.5,
                  }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: `${COURAGE_LEVELS[c.level].color}20`,
                      color: COURAGE_LEVELS[c.level].color,
                      opacity: 1,
                    }}>
                      {COURAGE_LEVELS[c.level].icon} {COURAGE_LEVELS[c.level].label}
                    </span>
                    <span>{c.createdAt}</span>
                    {c.completedAt && <span>· 完成于 {c.completedAt}</span>}
                  </div>
                </div>
                <button
                  onClick={(e) => deleteCourage(c.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: '4px 8px',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💪</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有勇气挑战
            </div>
            <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
              把你想做但不敢做的事写下来
            </div>
          </div>
        )
      )}

      {/* 历史记录 */}
      {courages.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            最近完成的勇气（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {courages.filter(c => c.done).slice(0, 5).map(c => (
              <div key={c.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, opacity: 0.9 }}>
                  ✅ {c.content}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: `${COURAGE_LEVELS[c.level].color}20`,
                    color: COURAGE_LEVELS[c.level].color,
                  }}>
                    {COURAGE_LEVELS[c.level].icon} {COURAGE_LEVELS[c.level].label}
                  </span>
                  <span>{c.completedAt || c.createdAt}</span>
                </div>
              </div>
            ))}
            {courages.filter(c => c.done).length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0', opacity: 0.4, fontSize: 12 }}>
                还没有完成的勇气挑战，加油！
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块三：探险日志 ─────────────── */

function AdventureJournal({ journals, setJournals }: {
  journals: AdventureLog[]
  setJournals: (v: AdventureLog[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [harvest, setHarvest] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const saveJournal = useCallback(() => {
    if (!title.trim()) return
    const newItem: AdventureLog = {
      id: `${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      mood,
      harvest: harvest.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
    }
    setJournals([newItem, ...journals])
    setShowForm(false)
    setTitle('')
    setContent('')
    setMood('')
    setHarvest('')
  }, [title, content, mood, harvest, journals, setJournals])

  const deleteJournal = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setJournals(journals.filter(j => j.id !== id))
  }, [journals, setJournals])

  const selectedJournal = journals.find(j => j.id === selectedId)

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(106,184,232,0.08), rgba(255,152,96,0.04))',
      border: '1px solid rgba(106,184,232,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="日志总数" value={journals.length} icon="📔" color="#6ab8e8" />
        <StatCard label="本月记录" value={journals.filter(j => j.date.startsWith(new Date().toLocaleDateString('zh-CN').slice(0, 7))).length} icon="📅" color="#ff9860" />
        <StatCard label="有收获" value={journals.filter(j => j.harvest).length} icon="💡" color="#ffb07a" />
      </div>

      {/* 新建按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(106,184,232,0.15), rgba(255,152,96,0.05))',
            border: '2px dashed rgba(106,184,232,0.4)',
            color: '#6ab8e8',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          📔 记录一次冒险/突破经历
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(106,184,232,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#6ab8e8', marginBottom: 16, letterSpacing: 2 }}>
            📔 写下你的探险故事
          </div>

          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="给这次冒险起个标题"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(106,184,232,0.2)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="详细记录这次冒险的过程……"
            style={{
              width: '100%',
              minHeight: 100,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(106,184,232,0.2)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 1 }}>
            当时的心情
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {MOOD_OPTIONS.map(m => (
              <button
                key={m.emoji}
                onClick={() => setMood(mood === m.emoji ? '' : m.emoji)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: mood === m.emoji
                    ? 'rgba(106,184,232,0.25)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${mood === m.emoji ? '#6ab8e8' : 'rgba(255,255,255,0.1)'}`,
                  color: mood === m.emoji ? '#6ab8e8' : 'rgba(255,232,192,0.6)',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 1 }}>
            收获与感悟
          </div>
          <textarea
            value={harvest}
            onChange={e => setHarvest(e.target.value)}
            placeholder="这次冒险给你带来了什么？"
            style={{
              width: '100%',
              minHeight: 60,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(106,184,232,0.2)',
              color: '#ffe8c0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 20,
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
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={saveJournal}
              disabled={!title.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #6ab8e8, #ff9860)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                opacity: title.trim() ? 1 : 0.5,
              }}
            >
              📔 保存日志
            </button>
          </div>
        </div>
      )}

      {/* 日志列表 */}
      {journals.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            探险日志
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {journals.map(j => (
              <div
                key={j.id}
                onClick={() => setSelectedId(j.id === selectedId ? null : j.id)}
                style={{
                  padding: '18px 20px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>
                    {j.mood && <span style={{ marginRight: 8 }}>{j.mood}</span>}
                    {j.title}
                  </div>
                  <button
                    onClick={(e) => deleteJournal(j.id, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      fontSize: 16,
                      padding: '0 4px',
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{
                  fontSize: 12,
                  opacity: 0.5,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                }}>
                  <span>📅 {j.date}</span>
                  {j.harvest && <span>· 💡 有收获</span>}
                </div>

                {selectedId === j.id && (
                  <div style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {j.content && (
                      <div style={{
                        fontSize: 13,
                        lineHeight: 1.8,
                        opacity: 0.8,
                        marginBottom: 14,
                      }}>
                        {j.content}
                      </div>
                    )}
                    {j.harvest && (
                      <div style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'rgba(106,184,232,0.08)',
                        border: '1px solid rgba(106,184,232,0.15)',
                        fontSize: 12,
                        lineHeight: 1.6,
                      }}>
                        <div style={{ color: '#6ab8e8', marginBottom: 4, fontWeight: 600 }}>💡 收获与感悟</div>
                        <div style={{ opacity: 0.8 }}>{j.harvest}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📔</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有探险日志
            </div>
            <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
              记录你每一次突破和冒险的故事
            </div>
          </div>
        )
      )}

      {/* 历史记录 */}
      {journals.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            最近记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {journals.slice(0, 5).map(j => (
              <div key={j.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, opacity: 0.9 }}>
                  {j.mood && <span style={{ marginRight: 6 }}>{j.mood}</span>}
                  {j.title}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  <span>📅 {j.date}</span>
                  {j.harvest && <span>· 💡 有收获</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块四：舒适区突破 ─────────────── */

function ComfortZoneBreak({ comfortBreaks, setComfortBreaks }: {
  comfortBreaks: ComfortBreak[]
  setComfortBreaks: (v: ComfortBreak[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [customChallenge, setCustomChallenge] = useState('')
  const [selectedChallenge, setSelectedChallenge] = useState('')
  const [note, setNote] = useState('')

  const today = new Date().toLocaleDateString('zh-CN')
  const todayRecord = comfortBreaks.find(c => c.date === today)

  const streak = useMemo(() => {
    let count = 0
    const dates = new Set(comfortBreaks.filter(c => c.completed).map(c => c.date))
    let current = new Date()
    while (dates.has(current.toLocaleDateString('zh-CN'))) {
      count++
      current.setDate(current.getDate() - 1)
    }
    return count
  }, [comfortBreaks])

  const totalCompleted = useMemo(() => comfortBreaks.filter(c => c.completed).length, [comfortBreaks])
  const totalChallenges = useMemo(() => comfortBreaks.length, [comfortBreaks])

  const drawChallenge = useCallback(() => {
    const usedChallenges = new Set(comfortBreaks.map(c => c.challenge))
    const available = DEFAULT_CHALLENGES.filter(c => !usedChallenges.has(c))
    if (available.length === 0) {
      setSelectedChallenge(DEFAULT_CHALLENGES[Math.floor(Math.random() * DEFAULT_CHALLENGES.length)])
    } else {
      setSelectedChallenge(available[Math.floor(Math.random() * available.length)])
    }
  }, [comfortBreaks])

  const completeToday = useCallback(() => {
    const challenge = customChallenge.trim() || selectedChallenge
    if (!challenge) return

    const existing = comfortBreaks.find(c => c.date === today)
    if (existing) {
      setComfortBreaks(comfortBreaks.map(c =>
        c.date === today ? { ...c, completed: true, challenge, note: note.trim() } : c
      ))
    } else {
      const newItem: ComfortBreak = {
        id: `${Date.now()}`,
        challenge,
        date: today,
        completed: true,
        note: note.trim(),
      }
      setComfortBreaks([newItem, ...comfortBreaks])
    }
    setShowForm(false)
    setCustomChallenge('')
    setSelectedChallenge('')
    setNote('')
  }, [customChallenge, selectedChallenge, note, today, comfortBreaks, setComfortBreaks])

  const recentRecords = useMemo(() => {
    const sorted = [...comfortBreaks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return sorted.slice(0, 7)
  }, [comfortBreaks])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,160,112,0.08), rgba(255,123,61,0.04))',
      border: '1px solid rgba(255,160,112,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="连续打卡" value={`${streak}天`} icon="🔥" color="#ff7b3d" />
        <StatCard label="累计突破" value={totalCompleted} icon="🎯" color="#ff9860" />
        <StatCard label="总挑战数" value={totalChallenges} icon="📅" color="#6ab8e8" />
      </div>

      {/* 今日状态 */}
      <div style={{
        padding: 24,
        borderRadius: 16,
        background: todayRecord?.completed
          ? 'linear-gradient(135deg, rgba(106,184,232,0.15), rgba(255,152,96,0.08))'
          : 'rgba(0,0,0,0.15)',
        border: `1px solid ${todayRecord?.completed ? 'rgba(106,184,232,0.3)' : 'rgba(255,160,112,0.2)'}`,
        marginBottom: 24,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, opacity: 0.5, letterSpacing: 2, marginBottom: 10 }}>
          今日挑战
        </div>
        {todayRecord?.completed ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
            <div style={{ fontSize: 16, color: '#6ab8e8', marginBottom: 6 }}>
              今日已完成突破！
            </div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>
              {todayRecord.challenge}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎯</div>
            <div style={{ fontSize: 16, color: '#ffa070', marginBottom: 6 }}>
              今天还没突破哦
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>
              迈出一小步，突破舒适区
            </div>
            {!showForm && (
              <button
                onClick={() => {
                  setShowForm(true)
                  drawChallenge()
                }}
                style={{
                  padding: '12px 32px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #ffa070, #ff7b3d)',
                  border: 'none',
                  color: '#1a0f05',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: 3,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255,160,112,0.3)',
                }}
              >
                🎲 抽取今日挑战
              </button>
            )}
          </>
        )}
      </div>

      {/* 表单 */}
      {showForm && !todayRecord?.completed && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,160,112,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#ffa070', marginBottom: 16, letterSpacing: 2 }}>
            🎯 今日舒适区突破
          </div>

          {selectedChallenge && (
            <div style={{
              padding: '16px',
              borderRadius: 12,
              background: 'rgba(255,160,112,0.1)',
              border: '1px solid rgba(255,160,112,0.3)',
              marginBottom: 14,
              textAlign: 'center',
              fontSize: 15,
              lineHeight: 1.6,
            }}>
              {selectedChallenge}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button
              onClick={drawChallenge}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                background: 'rgba(255,160,112,0.15)',
                border: '1px solid rgba(255,160,112,0.3)',
                color: '#ffa070',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              🔄 换一个
            </button>
            <button
              onClick={() => {
                setSelectedChallenge('')
                setCustomChallenge('')
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 10,
                background: 'rgba(106,184,232,0.15)',
                border: '1px solid rgba(106,184,232,0.3)',
                color: '#6ab8e8',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              ✏️ 自定义
            </button>
          </div>

          <input
            type="text"
            value={customChallenge}
            onChange={e => setCustomChallenge(e.target.value)}
            placeholder="或者输入你自己的挑战……"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,160,112,0.2)',
              color: '#ffe8c0',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 14,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            完成记录（可选）
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="完成后的感受和收获……"
            style={{
              width: '100%',
              minHeight: 60,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,160,112,0.2)',
              color: '#ffe8c0',
              fontSize: 12,
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
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={completeToday}
              disabled={!customChallenge.trim() && !selectedChallenge}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ffa070, #ff7b3d)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: customChallenge.trim() || selectedChallenge ? 'pointer' : 'not-allowed',
                opacity: customChallenge.trim() || selectedChallenge ? 1 : 0.5,
              }}
            >
              ✅ 标记完成
            </button>
          </div>
        </div>
      )}

      {/* 打卡日历（最近7天） */}
      {recentRecords.length > 0 && (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            最近7天打卡
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 8,
            marginBottom: 24,
          }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date()
              d.setDate(d.getDate() - (6 - i))
              const dateStr = d.toLocaleDateString('zh-CN')
              const record = comfortBreaks.find(c => c.date === dateStr)
              const isToday = dateStr === today
              return (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    background: record?.completed
                      ? 'linear-gradient(135deg, #ffa070, #ff7b3d)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isToday ? '#ff9860' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    opacity: record?.completed ? 1 : 0.5,
                  }}
                >
                  <div style={{ fontSize: 16, marginBottom: 2 }}>
                    {record?.completed ? '✅' : '·'}
                  </div>
                  <div style={{ opacity: 0.6 }}>
                    {d.getMonth() + 1}/{d.getDate()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {comfortBreaks.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            突破记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {comfortBreaks.slice(0, 5).map(c => (
              <div key={c.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, opacity: 0.9 }}>
                  {c.completed ? '✅' : '⭕'} {c.challenge}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  <span>📅 {c.date}</span>
                  {c.note && <span>· 📝 有记录</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {comfortBreaks.length === 0 && !showForm && !todayRecord?.completed && (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 13, letterSpacing: 2 }}>
            开始你的舒适区突破之旅
          </div>
          <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
            每天一个小挑战，遇见更好的自己
          </div>
        </div>
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
