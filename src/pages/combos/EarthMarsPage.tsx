import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Mission {
  id: string
  title: string
  description: string
  earthTasks: { id: string; text: string; done: boolean }[]
  marsTasks: { id: string; text: string; done: boolean }[]
  createdAt: string
  completed?: boolean
}

export default function EarthMarsPage() {
  const config = comboConfigs['earth-mars']
  const [missions, setMissions] = useLocalStorage<Mission[]>('combo-earth-mars', [])
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newEarthTask, setNewEarthTask] = useState('')
  const [newMarsTask, setNewMarsTask] = useState('')
  const [earthTaskList, setEarthTaskList] = useState<string[]>([])
  const [marsTaskList, setMarsTaskList] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEarthTask = () => {
    if (!newEarthTask.trim()) return
    setEarthTaskList([...earthTaskList, newEarthTask.trim()])
    setNewEarthTask('')
  }

  const addMarsTask = () => {
    if (!newMarsTask.trim()) return
    setMarsTaskList([...marsTaskList, newMarsTask.trim()])
    setNewMarsTask('')
  }

  const createMission = () => {
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
  }

  const toggleTask = (missionId: string, type: 'earth' | 'mars', taskId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m
        const tasks = type === 'earth' ? m.earthTasks : m.marsTasks
        const updated = tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
        const allDone = [...updated, ...(type === 'earth' ? m.marsTasks : m.earthTasks)].every((t) => t.done)
        return {
          ...m,
          [type === 'earth' ? 'earthTasks' : 'marsTasks']: updated,
          completed: allDone,
        }
      })
    )
  }

  const getProgress = (mission: Mission) => {
    const all = [...mission.earthTasks, ...mission.marsTasks]
    if (all.length === 0) return 0
    const done = all.filter((t) => t.done).length
    return Math.round((done / all.length) * 100)
  }

  const handleExport = () => {
    const items = (missions || []).slice(0, 7).map((m) => ({
      text: m.title,
      meta: `${getProgress(m)}% · ${m.earthTasks.length + m.marsTasks.length}个任务`,
    }))
    if (items.length === 0) items.push({ text: '还没有漫游计划', meta: '—' })
    exportAsImage(
      '地火漫游 · 跨行星行动力',
      '地球的脚步，火星的勇气',
      items,
      '#101820',
      '#e8d5b7',
      '#d4a574',
      `dihuomanyou-${Date.now()}.png`
    )
  }

  const selectedMission = missions?.find((m) => m.id === selectedId)

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(212, 165, 116, 0.15)',
          border: '1px solid rgba(212, 165, 116, 0.4)',
          color: '#f5e6d0',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(180, 130, 90, 0.2))',
              border: '1px solid rgba(212, 165, 116, 0.5)',
              color: '#f5e6d0',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🚀 开启新的漫游
          </button>
        </div>

        {showCreate && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(212, 165, 116, 0.06)',
            border: '1px solid rgba(212, 165, 116, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 30,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#d4a574' }}>
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
                border: '1px solid rgba(212, 165, 116, 0.25)',
                color: '#f5e6d0',
                fontSize: 14,
                outline: 'none',
                marginBottom: 12,
                fontFamily: 'inherit',
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
                border: '1px solid rgba(212, 165, 116, 0.25)',
                color: '#f5e6d0',
                fontSize: 13,
                outline: 'none',
                marginBottom: 16,
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#7eb8da', marginBottom: 8, letterSpacing: 2 }}>
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
                    border: '1px solid rgba(126, 184, 218, 0.25)',
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
                    background: 'rgba(126, 184, 218, 0.2)',
                    border: '1px solid rgba(126, 184, 218, 0.4)',
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
                      background: 'rgba(126, 184, 218, 0.1)',
                      border: '1px solid rgba(126, 184, 218, 0.2)',
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
              <div style={{ fontSize: 12, color: '#d4a574', marginBottom: 8, letterSpacing: 2 }}>
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
                    border: '1px solid rgba(212, 165, 116, 0.25)',
                    color: '#f5e6d0',
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
                    background: 'rgba(212, 165, 116, 0.2)',
                    border: '1px solid rgba(212, 165, 116, 0.4)',
                    color: '#e8d5b7',
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
                      background: 'rgba(212, 165, 116, 0.1)',
                      border: '1px solid rgba(212, 165, 116, 0.2)',
                      fontSize: 11,
                      color: '#e8d5b7',
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
                  background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(180, 130, 90, 0.2))',
                  border: '1px solid rgba(212, 165, 116, 0.5)',
                  color: '#f5e6d0',
                  fontSize: 12,
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(missions || []).length === 0 && !showCreate && (
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

          {(missions || []).map((mission) => {
            const progress = getProgress(mission)
            return (
              <div
                key={mission.id}
                onClick={() => setSelectedId(mission.id === selectedId ? null : mission.id)}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: mission.completed
                    ? 'linear-gradient(135deg, rgba(212, 165, 116, 0.12), rgba(126, 184, 218, 0.08))'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${mission.completed ? 'rgba(212, 165, 116, 0.3)' : 'rgba(255,255,255,0.08)'}`,
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
                        background: 'linear-gradient(90deg, #7eb8da, #d4a574)',
                        width: `${progress}%`,
                        transition: 'width 0.5s ease-out',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: '#d4a574', minWidth: 45, textAlign: 'right' }}>
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
                        <div style={{ fontSize: 11, color: '#7eb8da', marginBottom: 8, letterSpacing: 2 }}>🌍 地球任务</div>
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
                        <div style={{ fontSize: 11, color: '#d4a574', marginBottom: 8, letterSpacing: 2 }}>🔴 火星探索</div>
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
      </div>
    </ComboShell>
  )
}
