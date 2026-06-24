import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgentStore, LEVEL_NAMES, LEVEL_COLORS } from '../../store/agentStore'
import { chatWithStarSpirit, recordToPlanet, getStarGreeting } from '../../utils/agentService'
import { speak, stopSpeaking, isSpeechSupported, initVoices } from '../../utils/speechService'

export default function FloatingOrb() {
  const navigate = useNavigate()
  const {
    panelOpen,
    setPanelOpen,
    messages,
    addMessage,
    level,
    exp,
    orbPosition,
    setOrbPosition,
    greetingShown,
    setGreetingShown,
    voiceSettings,
    toggleVoiceEnabled,
  } = useAgentStore()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [speechReady, setSpeechReady] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initVoices(() => setSpeechReady(true))
    setTimeout(() => setSpeechReady(true), 1000)
  }, [])

  const playSpeech = useCallback((text: string, msgId: string) => {
    if (!voiceSettings.enabled) return
    setSpeakingId(msgId)
    speak(text, voiceSettings, () => setSpeakingId(null), () => setSpeakingId(msgId))
  }, [voiceSettings])

  const stopSpeech = useCallback(() => {
    stopSpeaking()
    setSpeakingId(null)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!greetingShown && messages.length === 0) {
      const greeting = getStarGreeting()
      addMessage({ role: 'assistant', content: greeting })
      setGreetingShown(true)
    }
  }, [greetingShown, messages.length, addMessage, setGreetingShown])

  const handleOrbMouseDown = useCallback((e: React.MouseEvent) => {
    if (!orbRef.current) return
    const rect = orbRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    })
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX - dragOffset.x) / window.innerWidth) * 100
      const y = ((e.clientY - dragOffset.y) / window.innerHeight) * 100
      setOrbPosition(
        Math.max(5, Math.min(95, x)),
        Math.max(5, Math.min(95, y))
      )
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, setOrbPosition])

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

  const levelColor = LEVEL_COLORS[level]

  return (
    <>
      {/* 悬浮球 */}
      <div
        ref={orbRef}
        className="fixed z-50 cursor-pointer select-none transition-all"
        style={{
          left: `${orbPosition.x}%`,
          top: `${orbPosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        onMouseDown={handleOrbMouseDown}
        onClick={() => !isDragging && setPanelOpen(!panelOpen)}
      >
        <div className="relative">
          {/* 外光晕 */}
          <div
            className="absolute inset-0 rounded-full blur-xl animate-pulse"
            style={{
              background: `radial-gradient(circle, ${levelColor}60 0%, transparent 70%)`,
              width: 72,
              height: 72,
              left: -12,
              top: -12,
            }}
          />
          {/* 能量球本体 */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl backdrop-blur-xl border transition-transform hover:scale-110"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${levelColor}, ${levelColor}80 50%, ${levelColor}40 100%)`,
              boxShadow: `0 0 30px ${levelColor}80, inset 0 0 20px ${levelColor}40`,
              borderColor: `${levelColor}60`,
            }}
          >
            <span className="drop-shadow-lg">✨</span>
          </div>
          {/* 等级标记 */}
          <div
            className="absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm"
            style={{
              background: `${levelColor}30`,
              color: levelColor,
              border: `1px solid ${levelColor}50`,
            }}
          >
            {LEVEL_NAMES[level]}
          </div>
        </div>
      </div>

      {/* 对话面板 */}
      {panelOpen && (
        <div
          className="fixed z-40 flex flex-col overflow-hidden backdrop-blur-2xl rounded-2xl shadow-2xl"
          style={{
            right: 80,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 360,
            height: 520,
            background: 'rgba(10, 8, 24, 0.92)',
            border: `1px solid ${levelColor}30`,
            boxShadow: `0 0 60px ${levelColor}20`,
          }}
        >
          {/* 头部 */}
          <div
            className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
            style={{
              background: `linear-gradient(135deg, ${levelColor}15, transparent)`,
              borderBottom: `1px solid ${levelColor}20`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${levelColor}, ${levelColor}60)`,
                boxShadow: `0 0 20px ${levelColor}60`,
              }}
            >
              ✨
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">星灵</div>
              <div className="text-[10px] opacity-60 text-slate-400">
                {LEVEL_NAMES[level]}级 · {exp} 星尘
              </div>
            </div>
            <button
              onClick={toggleVoiceEnabled}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${voiceSettings.enabled ? '' : 'opacity-50'}`}
              style={{ color: levelColor, background: `${levelColor}15` }}
              title={voiceSettings.enabled ? '关闭语音' : '开启语音'}
            >
              {voiceSettings.enabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => navigate('/agent')}
              className="text-xs px-2 py-1 rounded-lg transition-colors"
              style={{ color: levelColor, background: `${levelColor}15` }}
            >
              星灵殿
            </button>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-slate-400 hover:text-white text-lg"
            >
              ×
            </button>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[85%]">
                  <div
                    className="rounded-2xl px-3 py-2 text-sm leading-relaxed"
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
                    <div className="mt-1 flex gap-1">
                      <button
                        onClick={() => speakingId === msg.id ? stopSpeech() : playSpeech(msg.content, msg.id)}
                        className="text-[10px] px-2 py-0.5 rounded-full transition-colors hover:opacity-80"
                        style={{
                          color: speakingId === msg.id ? levelColor : 'rgba(255,255,255,0.4)',
                          background: speakingId === msg.id ? `${levelColor}15` : 'transparent',
                        }}
                      >
                        {speakingId === msg.id ? '⏹ 停止' : '🔊 播放'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-3 py-2 text-sm"
                  style={{
                    background: 'rgba(30, 27, 50, 0.9)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: levelColor }} />
                    星灵正在倾听……
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷建议 */}
          {messages.length <= 1 && (
            <div className="flex-shrink-0 px-3 pb-2 flex flex-wrap gap-1.5">
              {['我想去水星', '推荐下一步', '我有多少思绪', '今天做什么'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q)
                    inputRef.current?.focus()
                  }}
                  className="text-xs px-2 py-1 rounded-full transition-colors"
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

          {/* 输入框 */}
          <div
            className="flex-shrink-0 px-3 py-3"
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
                className="flex-1 rounded-xl px-3 py-2 text-sm resize-none outline-none"
                style={{
                  background: 'rgba(15, 12, 30, 0.9)',
                  border: `1px solid ${levelColor}30`,
                  color: '#e2e8f0',
                  minHeight: 36,
                  maxHeight: 80,
                }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement
                  t.style.height = 'auto'
                  t.style.height = Math.min(t.scrollHeight, 80) + 'px'
                }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all disabled:opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${levelColor}, ${levelColor}aa)`,
                  color: '#000',
                }}
              >
                ➤
              </button>
            </div>
            <div className="text-[10px] text-slate-600 mt-1 text-center">
              Enter 发送 · Shift+Enter 换行
            </div>
          </div>
        </div>
      )}
    </>
  )
}
