import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanetVisual from '../components/PlanetVisual'
import Scene3DBackground from '../components/Scene3DBackground'
import { useLocalStorage } from '../utils/planetExport'

interface TimelineEvent {
  id: string
  title: string
  date: string
  type: 'turning' | 'growth' | 'decision' | 'meeting' | 'loss' | 'achievement'
  description: string
  impact: string
  tags: string[]
  createdAt: string
}

const typeConfig = {
  turning: { label: '转折点', color: '#ffd700', icon: '🔄', bg: 'rgba(255, 215, 0, 0.15)' },
  growth: { label: '成长', color: '#7fffd4', icon: '🌱', bg: 'rgba(127, 255, 212, 0.15)' },
  decision: { label: '重要决策', color: '#ffb6c1', icon: '⚖️', bg: 'rgba(255, 182, 193, 0.15)' },
  meeting: { label: '相遇', color: '#87ceeb', icon: '🌟', bg: 'rgba(135, 206, 235, 0.15)' },
  loss: { label: '失去', color: '#b0a8b0', icon: '🍂', bg: 'rgba(176, 168, 176, 0.15)' },
  achievement: { label: '成就', color: '#ffd700', icon: '🏆', bg: 'rgba(255, 215, 0, 0.15)' },
}

export default function TimelinePage() {
  const navigate = useNavigate()
  const [events, setEvents] = useLocalStorage<TimelineEvent[]>('timeline-events', [])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)

  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newType, setNewType] = useState<TimelineEvent['type']>('growth')
  const [newDescription, setNewDescription] = useState('')
  const [newImpact, setNewImpact] = useState('')
  const [newTags, setNewTags] = useState('')

  const sortedEvents = [...(events || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const filteredEvents = filterType 
    ? sortedEvents.filter(e => e.type === filterType)
    : sortedEvents

  const addEvent = () => {
    if (!newTitle.trim() || !newDate.trim()) return
    const newItem: TimelineEvent = {
      id: `${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      type: newType,
      description: newDescription.trim(),
      impact: newImpact.trim(),
      tags: newTags.split(/[,，\s]+/).filter(Boolean),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setEvents([newItem, ...events])
    setShowAdd(false)
    setNewTitle('')
    setNewDate('')
    setNewType('growth')
    setNewDescription('')
    setNewImpact('')
    setNewTags('')
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const selectedEvent = events.find(e => e.id === selectedId)

  const typeStats = Object.keys(typeConfig).reduce((acc, key) => {
    acc[key] = events.filter(e => e.type === key).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <Scene3DBackground type="constellation" primaryColor="#ffb6c1" secondaryColor="#ffd700" />
      <div className="absolute inset-0 bg-black/30" />

      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/80 text-amber-200 rounded-lg border border-amber-500/30 transition-all duration-300 backdrop-blur-sm text-lg z-10"
      >
        ← 返回星盘
      </button>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <PlanetVisual type="saturn" size={100} />
          </div>
          <h1 className="text-5xl font-bold text-amber-100 mb-4 drop-shadow-2xl tracking-wider">
            命运轨迹
          </h1>
          <p className="text-xl text-amber-200/70">
            时间长河中的命运印记
          </p>
          <p className="text-amber-200/50 mt-2 max-w-2xl mx-auto">
            那些改变了你的时刻，那些塑造了你的选择，都在这条时间线上发着光
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterType(filterType === key ? null : key)}
              className={`px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                filterType === key 
                  ? 'scale-105' 
                  : 'hover:scale-102'
              }`}
              style={{
                background: filterType === key ? cfg.bg : 'rgba(30, 30, 50, 0.5)',
                borderColor: filterType === key ? cfg.color : 'rgba(255,255,255,0.1)',
                color: cfg.color,
              }}
            >
              <div className="text-2xl mb-1">{cfg.icon}</div>
              <div className="text-xs font-medium">{cfg.label}</div>
              <div className="text-xs opacity-60">{typeStats[key] || 0}</div>
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowAdd(true)}
            className="px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 180, 100, 0.15))',
              border: '1px solid rgba(255, 215, 0, 0.5)',
              color: '#fff0d0',
              letterSpacing: '0.1em',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
            }}
          >
            ✨ 记录一个重要时刻
          </button>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">⏳</div>
            <p className="text-amber-200/50 text-lg">
              {filterType ? '还没有这类时刻' : '还没有时间线记录'}
            </p>
            <p className="text-amber-200/30 mt-2">
              那些重要的时刻，值得被好好记住
            </p>
          </div>
        ) : (
          <div className="relative">
            <div 
              className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.3), transparent)' }}
            />

            <div className="space-y-8">
              {filteredEvents.map((event, index) => {
                const cfg = typeConfig[event.type]
                const isLeft = index % 2 === 0
                return (
                  <div key={event.id} className="relative flex items-center">
                    {isLeft && (
                      <div className="w-1/2 pr-8 text-right">
                        <div
                          className="inline-block p-5 rounded-2xl backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] max-w-md"
                          style={{
                            background: cfg.bg,
                            border: `1px solid ${cfg.color}30`,
                          }}
                          onClick={() => setSelectedId(event.id)}
                        >
                          <div className="flex items-center gap-2 justify-end mb-2">
                            <span className="text-sm font-medium" style={{ color: cfg.color }}>
                              {cfg.label}
                            </span>
                            <span className="text-xl">{cfg.icon}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-white/60">{event.date}</p>
                          {event.tags.length > 0 && (
                            <div className="flex gap-2 mt-3 justify-end flex-wrap">
                              {event.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    background: `${cfg.color}20`,
                                    color: cfg.color,
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10"
                      style={{
                        background: cfg.color,
                        boxShadow: `0 0 20px ${cfg.color}80`,
                      }}
                    />

                    {!isLeft && (
                      <div className="w-1/2 pl-8">
                        <div
                          className="inline-block p-5 rounded-2xl backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] max-w-md"
                          style={{
                            background: cfg.bg,
                            border: `1px solid ${cfg.color}30`,
                          }}
                          onClick={() => setSelectedId(event.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{cfg.icon}</span>
                            <span className="text-sm font-medium" style={{ color: cfg.color }}>
                              {cfg.label}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-white/60">{event.date}</p>
                          {event.tags.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {event.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    background: `${cfg.color}20`,
                                    color: cfg.color,
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-lg p-8 rounded-3xl relative"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 60px rgba(255, 215, 0, 0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-amber-100 mb-6 text-center">
              ✨ 记录重要时刻
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-amber-200/80 text-sm mb-2">事件名称 *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="那一刻发生了什么"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,215,0,0.2)',
                  }}
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm mb-2">日期 *</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,215,0,0.2)',
                    colorScheme: 'dark',
                  }}
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm mb-2">类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setNewType(key as TimelineEvent['type'])}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                        newType === key ? 'scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        background: newType === key ? cfg.bg : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${newType === key ? cfg.color : 'rgba(255,255,255,0.1)'}`,
                        color: cfg.color,
                      }}
                    >
                      <span className="mr-1">{cfg.icon}</span>
                      <span className="text-xs">{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm mb-2">发生了什么</label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="描述一下这个时刻..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,215,0,0.2)',
                  }}
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm mb-2">它如何改变了你</label>
                <textarea
                  value={newImpact}
                  onChange={e => setNewImpact(e.target.value)}
                  placeholder="这个时刻对你的影响..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,215,0,0.2)',
                  }}
                />
              </div>

              <div>
                <label className="block text-amber-200/80 text-sm mb-2">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="成长, 勇气, 爱..."
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,215,0,0.2)',
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                取消
              </button>
              <button
                onClick={addEvent}
                className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 180, 100, 0.2))',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                  color: '#fff0d0',
                }}
              >
                记录
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full max-w-lg p-8 rounded-3xl relative"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              border: `1px solid ${typeConfig[selectedEvent.type].color}40`,
              boxShadow: `0 0 60px ${typeConfig[selectedEvent.type].color}15`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{typeConfig[selectedEvent.type].icon}</div>
              <div 
                className="text-sm font-medium mb-2"
                style={{ color: typeConfig[selectedEvent.type].color }}
              >
                {typeConfig[selectedEvent.type].label}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {selectedEvent.title}
              </h2>
              <p className="text-white/50 mt-1">{selectedEvent.date}</p>
            </div>

            {selectedEvent.description && (
              <div className="mb-4">
                <h4 className="text-amber-200/80 text-sm mb-2">发生了什么</h4>
                <p className="text-white/80 leading-relaxed">{selectedEvent.description}</p>
              </div>
            )}

            {selectedEvent.impact && (
              <div className="mb-4">
                <h4 className="text-amber-200/80 text-sm mb-2">它如何改变了你</h4>
                <p className="text-white/80 leading-relaxed">{selectedEvent.impact}</p>
              </div>
            )}

            {selectedEvent.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-amber-200/80 text-sm mb-2">标签</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedEvent.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-sm px-3 py-1 rounded-full"
                      style={{
                        background: `${typeConfig[selectedEvent.type].color}20`,
                        color: typeConfig[selectedEvent.type].color,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedId(null)}
                className="flex-1 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                关闭
              </button>
              <button
                onClick={() => deleteEvent(selectedEvent.id)}
                className="flex-1 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 100, 100, 0.15)',
                  border: '1px solid rgba(255, 100, 100, 0.3)',
                  color: 'rgba(255, 150, 150, 0.9)',
                }}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
