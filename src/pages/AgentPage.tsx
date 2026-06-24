import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { useAgentStore, LEVEL_NAMES, LEVEL_COLORS } from '../store/agentStore'
import { useCosmicStore, PlanetId, PLANET_META } from '../store/cosmicStore'
import { chatWithStarSpirit, recordToPlanet, getStarGreeting } from '../utils/agentService'

export default function AgentPage() {
  const navigate = useNavigate()
  const {
    messages,
    addMessage,
    level,
    exp,
    totalInteractions,
    greetingShown,
    setGreetingShown,
  } = useAgentStore()

  const cosmicStore = useCosmicStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'overview' | 'quests'>('overview')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeTab])

  useEffect(() => {
    if (!greetingShown && messages.length === 0) {
      const greeting = getStarGreeting()
      addMessage({ role: 'assistant', content: greeting })
      setGreetingShown(true)
    }
  }, [greetingShown, messages.length, addMessage, setGreetingShown])

  const planetStats = useMemo(() => {
    const planets: PlanetId[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun']
    return planets.map((p) => ({
      id: p,
      name: PLANET_META[p].name,
      title: PLANET_META[p].title,
      color: PLANET_META[p].color,
      count: cosmicStore[p].length,
      latest: cosmicStore[p].length > 0 ? cosmicStore[p][cosmicStore[p].length - 1] : null,
    }))
  }, [cosmicStore])

  const totalEntries = useMemo(() => {
    return planetStats.reduce((sum, p) => sum + p.count, 0)
  }, [planetStats])

  const nextLevelExp = useMemo(() => {
    const thresholds = { stardust: 50, starlet: 200, planet: 500, star: 1000, galaxy: 9999 }
    return thresholds[level] || 50
  }, [level])

  const progressPercent = Math.min(100, (exp / nextLevelExp) * 100)
  const levelColor = LEVEL_COLORS[level]

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    addMessage({ role: 'user', content: text })
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const { content, action } = await chatWithStarSpirit(text, history)
      addMessage({ role: 'assistant', content, action: action as any })

      if (action?.type === 'navigate') {
        setTimeout(() => {
          navigate(action.payload)
        }, 800)
      } else if (action?.type === 'record') {
        recordToPlanet(action.payload.planet, action.payload.text)
      }
    } catch (err) {
      addMessage({
        role: 'assistant',
        content: '抱歉，星光暂时有点黯淡…… 过一会儿再试试好吗？',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const quickQuestions = [
    '我有多少条思绪？',
    '推荐我做什么？',
    '带我去水星',
    '我最近情绪怎么样？',
  ]

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor={levelColor} secondaryColor="#6366f1" />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            ← 返回观测站
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: levelColor }}>
              ✨ 星灵殿
            </h1>
            <p className="text-xs opacity-60 mt-1">你的宇宙向导</p>
          </div>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* 星灵卡片 */}
            <div
              className="rounded-3xl p-6 backdrop-blur-2xl text-center"
              style={{
                background: `linear-gradient(135deg, ${levelColor}15, transparent)`,
                border: `1px solid ${levelColor}30`,
                boxShadow: `0 0 40px ${levelColor}15`,
              }}
            >
              <div className="relative inline-block mb-4">
                <div
                  className="absolute inset-0 rounded-full blur-xl animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${levelColor}50 0%, transparent 70%)`,
                    width: 100,
                    height: 100,
                    left: -20,
                    top: -20,
                  }}
                />
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto relative"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${levelColor}, ${levelColor}80 50%, ${levelColor}40 100%)`,
                    boxShadow: `0 0 30px ${levelColor}60`,
                  }}
                >
                  ✨
                </div>
              </div>
              <h2 className="text-xl font-light mb-1">星灵</h2>
              <p className="text-xs opacity-60 mb-4">
                {LEVEL_NAMES[level]}级 · {exp} / {nextLevelExp} 星尘
              </p>
              <div className="w-full h-1.5 rounded-full bg-white/10 mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${levelColor}, ${levelColor}aa)`,
                    boxShadow: `0 0 10px ${levelColor}`,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-lg font-light" style={{ color: levelColor }}>
                    {totalEntries}
                  </div>
                  <div className="text-[10px] opacity-50">星光记录</div>
                </div>
                <div>
                  <div className="text-lg font-light" style={{ color: levelColor }}>
                    {totalInteractions}
                  </div>
                  <div className="text-[10px] opacity-50">对话次数</div>
                </div>
              </div>
            </div>

            {/* 星图总览 */}
            <div className="rounded-3xl p-5 backdrop-blur-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-medium mb-4 opacity-80">🪐 星图总览</h3>
              <div className="space-y-3">
                {planetStats.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/${p.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                      style={{
                        background: `${p.color}20`,
                        color: p.color,
                        boxShadow: `0 0 10px ${p.color}30`,
                      }}
                    >
                      {p.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{p.title}</div>
                      <div className="text-[10px] opacity-50 truncate">
                        {p.latest && 'text' in p.latest
                          ? p.latest.text.slice(0, 15) + '...'
                          : '暂无记录'}
                      </div>
                    </div>
                    <div
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${p.color}20`, color: p.color }}
                    >
                      {p.count}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧对话区 */}
          <div className="lg:col-span-2">
            <div
              className="rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 flex flex-col"
              style={{ height: 600 }}
            >
              {/* Tab切换 */}
              <div className="flex-shrink-0 flex border-b border-white/10">
                {[
                  { id: 'overview', label: '总览' },
                  { id: 'chat', label: '对话' },
                  { id: 'quests', label: '任务' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-sm transition-colors ${
                      activeTab === tab.id ? '' : 'opacity-50 hover:opacity-80'
                    }`}
                    style={
                      activeTab === tab.id
                        ? { color: levelColor, borderBottom: `2px solid ${levelColor}` }
                        : {}
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 总览Tab */}
              {activeTab === 'overview' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-light mb-3" style={{ color: levelColor }}>
                      🌟 今日星语
                    </h3>
                    <div className="rounded-2xl p-5" style={{ background: `${levelColor}10`, border: `1px solid ${levelColor}20` }}>
                      <p className="text-sm leading-relaxed opacity-90">
                        {totalEntries === 0
                          ? '欢迎来到星灵殿。这里是你宇宙旅程的起点——每一颗行星都等着你去探索，每一个记录都是你的星光。'
                          : totalEntries < 10
                          ? '你已经开始收集星光了。慢慢来，不用急——每一颗行星都有它的节奏，每一次记录都是在认识自己。'
                          : '你收集了不少星光呢。回头看看，你会发现：那些你以为走不过去的时刻，其实都成了照亮你的光。'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-light mb-3 opacity-80">💡 推荐探索</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {planetStats
                        .filter((p) => p.count === 0)
                        .slice(0, 4)
                        .map((p) => (
                          <button
                            key={p.id}
                            onClick={() => navigate(`/${p.id}`)}
                            className="rounded-xl p-4 text-left hover:bg-white/10 transition-colors"
                            style={{ border: `1px solid ${p.color}30` }}
                          >
                            <div className="text-sm font-medium mb-1" style={{ color: p.color }}>
                              {p.title}
                            </div>
                            <div className="text-xs opacity-60">{PLANET_META[p.id].description}</div>
                          </button>
                        ))}
                    </div>
                    {planetStats.filter((p) => p.count === 0).length === 0 && (
                      <div className="text-center py-8 opacity-60">
                        <p className="text-sm">你已经探索了所有行星！</p>
                        <p className="text-xs mt-2">
                          试试组合炼金，看看不同行星碰撞出什么
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-light mb-3 opacity-80">⚡ 快捷操作</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: '记个思绪', action: () => navigate('/mercury') },
                        { label: '抽张神谕卡', action: () => navigate('/oracle-cards') },
                        { label: '今日愿望', action: () => navigate('/sun') },
                        { label: '情绪炼金', action: () => navigate('/mars') },
                        { label: '梦的解读', action: () => navigate('/neptune') },
                        { label: '观测站', action: () => navigate('/observatory') },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={item.action}
                          className="rounded-xl py-3 px-2 text-xs hover:bg-white/10 transition-colors"
                          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 对话Tab */}
              {activeTab === 'chat' && (
                <>
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                          style={{
                            background:
                              msg.role === 'user'
                                ? `linear-gradient(135deg, ${levelColor}40, ${levelColor}20)`
                                : 'rgba(30, 27, 50, 0.9)',
                            border:
                              msg.role === 'user'
                                ? `1px solid ${levelColor}40`
                                : '1px solid rgba(255,255,255,0.08)',
                            color: '#e2e8f0',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div
                          className="rounded-2xl px-4 py-2.5 text-sm"
                          style={{
                            background: 'rgba(30, 27, 50, 0.9)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <div className="flex items-center gap-2 text-slate-400">
                            <span
                              className="w-2 h-2 rounded-full animate-ping"
                              style={{ background: levelColor }}
                            />
                            星灵正在倾听……
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {messages.length <= 2 && (
                    <div className="flex-shrink-0 px-5 pb-3 flex flex-wrap gap-2">
                      {quickQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInput(q)
                            inputRef.current?.focus()
                          }}
                          className="text-xs px-3 py-1.5 rounded-full transition-colors"
                          style={{
                            color: levelColor,
                            background: `${levelColor}10`,
                            border: `1px solid ${levelColor}20`,
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className="flex-shrink-0 px-5 py-4"
                    style={{ borderTop: `1px solid ${levelColor}15` }}
                  >
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="和星灵说说话……"
                        rows={1}
                        className="flex-1 rounded-xl px-4 py-2.5 text-sm resize-none outline-none"
                        style={{
                          background: 'rgba(15, 12, 30, 0.9)',
                          border: `1px solid ${levelColor}30`,
                          color: '#e2e8f0',
                          minHeight: 44,
                          maxHeight: 120,
                        }}
                        onInput={(e) => {
                          const t = e.target as HTMLTextAreaElement
                          t.style.height = 'auto'
                          t.style.height = Math.min(t.scrollHeight, 120) + 'px'
                        }}
                      />
                      <button
                        onClick={send}
                        disabled={!input.trim() || loading}
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-base transition-all disabled:opacity-40 hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${levelColor}, ${levelColor}aa)`,
                          color: '#000',
                        }}
                      >
                        ➤
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* 任务Tab */}
              {activeTab === 'quests' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <h3 className="text-lg font-light mb-4" style={{ color: levelColor }}>
                    🎯 星际任务
                  </h3>
                  {[
                    {
                      title: '初入星河',
                      desc: '在第一颗行星留下记录',
                      completed: totalEntries > 0,
                      reward: 10,
                    },
                    {
                      title: '九星连线',
                      desc: '探索所有9颗行星',
                      completed: planetStats.filter((p) => p.count > 0).length >= 9,
                      reward: 50,
                    },
                    {
                      title: '思绪收藏家',
                      desc: '在水星记录10条思绪',
                      completed: cosmicStore.mercury.length >= 10,
                      reward: 20,
                    },
                    {
                      title: '情绪炼金师',
                      desc: '在火星完成5次情绪炼金',
                      completed: cosmicStore.mars.length >= 5,
                      reward: 20,
                    },
                    {
                      title: '梦的翻译者',
                      desc: '在海王星记录3个梦',
                      completed: cosmicStore.neptune.length >= 3,
                      reward: 15,
                    },
                    {
                      title: '宇宙大炼金',
                      desc: '完成一次跨行星组合',
                      completed: totalInteractions > 5,
                      reward: 30,
                    },
                  ].map((quest, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-4 flex items-center gap-4"
                      style={{
                        background: quest.completed ? `${levelColor}10` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${quest.completed ? levelColor + '40' : 'rgba(255,255,255,0.1)'}`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                        style={{
                          background: quest.completed ? `${levelColor}30` : 'rgba(255,255,255,0.05)',
                          color: quest.completed ? levelColor : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {quest.completed ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{quest.title}</div>
                        <div className="text-xs opacity-60">{quest.desc}</div>
                      </div>
                      <div
                        className="text-xs flex-shrink-0 px-2 py-1 rounded-full"
                        style={{
                          color: quest.completed ? levelColor : 'rgba(255,255,255,0.4)',
                          background: quest.completed ? `${levelColor}15` : 'rgba(255,255,255,0.05)',
                        }}
                      >
                        +{quest.reward} ⭐
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
