import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { useAgentStore, LEVEL_NAMES, LEVEL_COLORS } from '../store/agentStore'
import { useCosmicStore, PlanetId, PLANET_META } from '../store/cosmicStore'
import { useMemoryStore } from '../store/memoryStore'
import { useTaskStore } from '../store/taskStore'
import {
  chatWithStarSpirit,
  recordToPlanet,
  getStarGreeting,
  getMoodTrend,
  getPlanetActivity,
  detectPatterns,
  generateWeeklyReport,
  getTodayInsights,
} from '../utils/agentService'
import { speak as speakText, stopSpeaking, initVoices } from '../utils/speechService'

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
    voiceSettings,
    setVoiceSettings,
    toggleVoiceEnabled,
    autoPlayVoice,
    toggleAutoPlayVoice,
  } = useAgentStore()

  const cosmicStore = useCosmicStore()
  const memoryStore = useMemoryStore()
  const taskStore = useTaskStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'memory' | 'tasks' | 'analytics'>('overview')
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    initVoices()
  }, [])

  const playSpeech = useCallback((text: string, msgId: string) => {
    if (!voiceSettings.enabled) return
    stopSpeaking()
    setSpeakingId(msgId)
    speakText(text, voiceSettings, () => setSpeakingId(null), () => setSpeakingId(msgId))
  }, [voiceSettings])

  const handleStopSpeech = useCallback(() => {
    stopSpeaking()
    setSpeakingId(null)
  }, [])

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
    '今日洞察',
    '情绪趋势怎么样？',
    '本周总结',
    '推荐我做什么？',
  ]

  // 新增数据
  const taskStats = useMemo(() => taskStore.getStats(), [taskStore])
  const memories = useMemo(() => memoryStore.getRecentMemories(10), [memoryStore])
  const moodData = useMemo(() => getMoodTrend(7), [])
  const patterns = useMemo(() => detectPatterns(), [])
  const weeklyReport = useMemo(() => generateWeeklyReport(), [])

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
              <div className="flex-shrink-0 flex border-b border-white/10 overflow-x-auto">
                {[
                  { id: 'overview', label: '总览', icon: '🌟' },
                  { id: 'chat', label: '对话', icon: '💬' },
                  { id: 'memory', label: '记忆', icon: '🧠' },
                  { id: 'tasks', label: '任务', icon: '📋' },
                  { id: 'analytics', label: '分析', icon: '📊' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-xs transition-colors whitespace-nowrap ${
                      activeTab === tab.id ? '' : 'opacity-50 hover:opacity-80'
                    }`}
                    style={
                      activeTab === tab.id
                        ? { color: levelColor, borderBottom: `2px solid ${levelColor}` }
                        : {}
                    }
                  >
                    {tab.icon} {tab.label}
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

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-light opacity-80">🎙️ 语音设置</h3>
                      <button
                        onClick={toggleVoiceEnabled}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${voiceSettings.enabled ? '' : 'opacity-50'}`}
                        style={{
                          color: levelColor,
                          background: voiceSettings.enabled ? `${levelColor}20` : 'rgba(255,255,255,0.05)',
                        }}
                      >
                        {voiceSettings.enabled ? '已开启' : '已关闭'}
                      </button>
                    </div>
                    <div className="rounded-2xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="opacity-60">音调</span>
                          <span style={{ color: levelColor }}>{voiceSettings.pitch.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.8"
                          max="2.0"
                          step="0.1"
                          value={voiceSettings.pitch}
                          onChange={(e) => setVoiceSettings({ pitch: parseFloat(e.target.value) })}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, ${levelColor} 0%, ${levelColor} ${((voiceSettings.pitch - 0.8) / 1.2) * 100}%, rgba(255,255,255,0.2) ${((voiceSettings.pitch - 0.8) / 1.2) * 100}%, rgba(255,255,255,0.2) 100%)` }}
                        />
                        <div className="flex justify-between text-[10px] opacity-40 mt-1">
                          <span>温柔</span>
                          <span>甜美</span>
                          <span>清脆</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="opacity-60">语速</span>
                          <span style={{ color: levelColor }}>{voiceSettings.rate.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.7"
                          max="1.3"
                          step="0.05"
                          value={voiceSettings.rate}
                          onChange={(e) => setVoiceSettings({ rate: parseFloat(e.target.value) })}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, ${levelColor} 0%, ${levelColor} ${((voiceSettings.rate - 0.7) / 0.6) * 100}%, rgba(255,255,255,0.2) ${((voiceSettings.rate - 0.7) / 0.6) * 100}%, rgba(255,255,255,0.2) 100%)` }}
                        />
                        <div className="flex justify-between text-[10px] opacity-40 mt-1">
                          <span>舒缓</span>
                          <span>自然</span>
                          <span>轻快</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="opacity-60">音量</span>
                          <span style={{ color: levelColor }}>{Math.round(voiceSettings.volume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={voiceSettings.volume}
                          onChange={(e) => setVoiceSettings({ volume: parseFloat(e.target.value) })}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, ${levelColor} 0%, ${levelColor} ${((voiceSettings.volume - 0.1) / 0.9) * 100}%, rgba(255,255,255,0.2) ${((voiceSettings.volume - 0.1) / 0.9) * 100}%, rgba(255,255,255,0.2) 100%)` }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (voiceSettings.enabled) {
                            speakText('嗨～我是星灵呀，很高兴认识你 ✨ 有什么想聊的吗', voiceSettings)
                          }
                        }}
                        disabled={!voiceSettings.enabled}
                        className="w-full py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40"
                        style={{
                          background: `linear-gradient(135deg, ${levelColor}40, ${levelColor}20)`,
                          border: `1px solid ${levelColor}40`,
                          color: levelColor,
                        }}
                      >
                        🔊 听一下效果
                      </button>
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
                        <div className="max-w-[80%]">
                          <div
                            className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                            style={{
                              background:
                                msg.role === 'user'
                                  ? `linear-gradient(135deg, ${levelColor}40, ${levelColor}20)`
                                  : 'rgba(30, 27, 50, 0.9)',
                              border:
                                msg.role === 'user'
                                  ? `1px solid ${levelColor}40`
                                  : `1px solid ${speakingId === msg.id ? levelColor + '60' : 'rgba(255,255,255,0.08)'}`,
                              color: '#e2e8f0',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                            }}
                          >
                            {msg.content}
                          </div>
                          {msg.role === 'assistant' && voiceSettings.enabled && (
                            <div className="mt-1.5 flex gap-2">
                              <button
                                onClick={() => speakingId === msg.id ? handleStopSpeech() : playSpeech(msg.content, msg.id)}
                                className="text-xs px-2.5 py-1 rounded-full transition-colors hover:opacity-80"
                                style={{
                                  color: speakingId === msg.id ? levelColor : 'rgba(255,255,255,0.5)',
                                  background: speakingId === msg.id ? `${levelColor}15` : 'rgba(255,255,255,0.05)',
                                }}
                              >
                                {speakingId === msg.id ? '⏹ 停止朗读' : '🔊 朗读'}
                              </button>
                            </div>
                          )}
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

              {/* 记忆Tab */}
              {activeTab === 'memory' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-light" style={{ color: levelColor }}>
                      🧠 记忆宫殿
                    </h3>
                    <span className="text-xs opacity-50">{memories.length} 条记忆</span>
                  </div>
                  
                  {memories.length === 0 ? (
                    <div className="text-center py-12 opacity-60">
                      <div className="text-4xl mb-4">🌌</div>
                      <p className="text-sm">记忆宫殿还是空的</p>
                      <p className="text-xs mt-2">和星灵聊聊，我会记住重要的事</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {memories.map((mem) => {
                        const typeColors: Record<string, string> = {
                          person: '#f472b6', goal: '#60a5fa', concern: '#fbbf24',
                          habit: '#a78bfa', preference: '#34d399', event: '#f87171', insight: '#fbbf24'
                        }
                        const typeNames: Record<string, string> = {
                          person: '人物', goal: '目标', concern: '担忧', habit: '习惯', preference: '偏好', event: '事件', insight: '洞察'
                        }
                        return (
                          <div
                            key={mem.id}
                            className="rounded-xl p-4"
                            style={{
                              background: `${typeColors[mem.type]}10`,
                              border: `1px solid ${typeColors[mem.type]}30`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: `${typeColors[mem.type]}20`, color: typeColors[mem.type] }}
                              >
                                {typeNames[mem.type]}
                              </span>
                              <span className="text-xs opacity-50">
                                被提及 {mem.referenceCount} 次
                              </span>
                            </div>
                            <p className="text-sm">{mem.content}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 任务Tab */}
              {activeTab === 'tasks' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-light" style={{ color: levelColor }}>
                      📋 任务中心
                    </h3>
                    <button
                      onClick={() => taskStore.generateDailyTasks()}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: `${levelColor}20`, color: levelColor }}
                    >
                      重置今日任务
                    </button>
                  </div>

                  {/* 统计卡片 */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="rounded-xl p-3 text-center" style={{ background: `${levelColor}10` }}>
                      <div className="text-xl font-light" style={{ color: levelColor }}>{taskStats.todayCompleted}/{taskStats.todayTotal}</div>
                      <div className="text-[10px] opacity-60">今日</div>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ background: `${levelColor}10` }}>
                      <div className="text-xl font-light" style={{ color: levelColor }}>{taskStats.weekCompleted}</div>
                      <div className="text-[10px] opacity-60">本周</div>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ background: `${levelColor}10` }}>
                      <div className="text-xl font-light" style={{ color: levelColor }}>{taskStats.longestStreak}</div>
                      <div className="text-[10px] opacity-60">连续天</div>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ background: `${levelColor}10` }}>
                      <div className="text-xl font-light" style={{ color: levelColor }}>{taskStats.activeGoals}</div>
                      <div className="text-[10px] opacity-60">进行中</div>
                    </div>
                  </div>

                  {/* 每日任务 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 opacity-80">✨ 今日任务</h4>
                    <div className="space-y-2">
                      {taskStore.getTodayTasks().map((task) => (
                        <button
                          key={task.id}
                          onClick={() => taskStore.toggleDailyTask(task.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                          style={{
                            background: task.completed ? `${levelColor}10` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${task.completed ? levelColor + '40' : 'rgba(255,255,255,0.1)'}`,
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                            style={{
                              background: task.completed ? levelColor : 'transparent',
                              border: `2px solid ${task.completed ? levelColor : 'rgba(255,255,255,0.3)'}`,
                              color: task.completed ? '#000' : 'transparent',
                            }}
                          >
                            {task.completed ? '✓' : ''}
                          </div>
                          <span className={task.completed ? 'opacity-50 line-through' : ''}>
                            {task.emoji} {task.title}
                          </span>
                        </button>
                      ))}
                      {taskStore.getTodayTasks().length === 0 && (
                        <p className="text-xs opacity-50 text-center py-4">点击上方按钮生成今日任务</p>
                      )}
                    </div>
                  </div>

                  {/* 进行中的目标 */}
                  {taskStore.goals.filter((g) => g.progress < 100).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3 opacity-80">🎯 进行中的目标</h4>
                      <div className="space-y-3">
                        {taskStore.goals.filter((g) => g.progress < 100).map((goal) => (
                          <div key={goal.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">{goal.title}</span>
                              <span className="text-xs" style={{ color: levelColor }}>{goal.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${goal.progress}%`, background: levelColor }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 分析Tab */}
              {activeTab === 'analytics' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <h3 className="text-lg font-light mb-4" style={{ color: levelColor }}>
                    📊 数据分析
                  </h3>

                  {/* 情绪趋势 */}
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 className="text-sm font-medium mb-3 opacity-80">💭 情绪趋势（7天）</h4>
                    <div className="flex items-end gap-1 h-20">
                      {moodData.map((day, i) => {
                        const maxVal = Math.max(...moodData.map((d) => d.value), 1)
                        const height = day.value > 0 ? (day.value / maxVal) * 100 : 10
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full rounded-t-lg transition-all"
                              style={{
                                height: `${height}%`,
                                background: day.value > 0 ? `linear-gradient(to top, ${levelColor}80, ${levelColor}40)` : 'rgba(255,255,255,0.1)',
                                minHeight: day.value > 0 ? 4 : 4,
                              }}
                            />
                            <span className="text-[9px] opacity-50">{day.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 发现模式 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 opacity-80">🔮 发现的模式</h4>
                    {patterns.length === 0 ? (
                      <div className="rounded-xl p-4 text-center opacity-60" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <p className="text-sm">记录更多数据，星灵会发现你的模式</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {patterns.map((pattern, i) => {
                          const typeColors: Record<string, string> = {
                            recurring: '#60a5fa', growth: '#34d399', concern: '#fbbf24', achievement: '#f472b6'
                          }
                          return (
                            <div key={i} className="rounded-xl p-4" style={{ background: `${typeColors[pattern.type]}10`, border: `1px solid ${typeColors[pattern.type]}30` }}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{pattern.type === 'growth' ? '📈' : pattern.type === 'concern' ? '💛' : pattern.type === 'achievement' ? '🏆' : '🔄'}</span>
                                <span className="text-sm font-medium">{pattern.title}</span>
                              </div>
                              <p className="text-xs opacity-80">{pattern.description}</p>
                              {pattern.suggestions.length > 0 && (
                                <p className="text-xs mt-2" style={{ color: levelColor }}>
                                  💡 {pattern.suggestions[0]}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* 本周报告 */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 opacity-80">📅 本周总结</h4>
                    <div className="rounded-2xl p-4" style={{ background: `${levelColor}10`, border: `1px solid ${levelColor}30` }}>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-2xl font-light" style={{ color: levelColor }}>{weeklyReport.overview.totalEntries}</div>
                          <div className="text-xs opacity-60">总记录</div>
                        </div>
                        <div>
                          <div className="text-2xl font-light" style={{ color: levelColor }}>{weeklyReport.overview.mostActivePlanet}</div>
                          <div className="text-xs opacity-60">最活跃</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">情绪趋势:</span>
                        <span className="text-lg">
                          {weeklyReport.overview.moodTrend === 'up' ? '📈 上升' : weeklyReport.overview.moodTrend === 'down' ? '📉 下降' : '➡️ 平稳'}
                        </span>
                      </div>
                      {weeklyReport.overview.achievements.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs opacity-80">🏆 {weeklyReport.overview.achievements[0]}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
