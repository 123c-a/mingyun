import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

const innerChildPrompts = [
  { title: '对小时候的自己说', prompt: '如果现在的你，可以走到小时候的自己面前，你最想对ta说什么？' },
  { title: '你最怀念的瞬间', prompt: '闭上眼睛，回忆一个童年里最温暖、最安心的瞬间。那个画面里有什么？' },
  { title: '那个小梦想', prompt: '小时候，你曾经偷偷想过长大后要做什么？那个梦想现在还在吗？' },
  { title: '拥抱小时候的你', prompt: '如果可以给小时候的自己一个拥抱，你会在什么时候抱住ta？' },
  { title: '你最爱的玩具', prompt: '小时候你最心爱的一样东西是什么？它现在在哪里？' },
  { title: '那个没说出口的', prompt: '小时候有没有一件事，你一直想说却没说出口？现在说出来吧。' },
  { title: '小小的委屈', prompt: '小时候有没有一件事，让你觉得特别委屈？现在的你会怎么安慰ta？' },
  { title: '最勇敢的时刻', prompt: '你觉得小时候的自己，做过最勇敢的一件事是什么？' },
]

export default function InnerChildPage() {
  const { '*': fullPath = '' } = useParams()
  const navigate = useNavigate()
  const comboId = fullPath.split('/')[0] || ''
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ id: string; title: string; content: string; date: string }>>([])
  const [showMessages, setShowMessages] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const validPlanets = useMemo(() => comboId.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboId])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40`, borderColor: `${existingConfig.primaryColor}30` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])
  const currentPrompt = useMemo(() => innerChildPrompts[(seed + currentStep) % innerChildPrompts.length], [seed, currentStep])

  useEffect(() => {
    const saved = localStorage.getItem(`combo-innerchild-${comboId}`)
    if (saved) {
      try { setMessages(JSON.parse(saved)) } catch {}
    }
  }, [comboId])

  const saveMessage = () => {
    if (!message.trim()) return
    const newEntry = {
      id: `${Date.now()}`,
      title: currentPrompt.title,
      content: message.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
    }
    const updated = [newEntry, ...messages]
    setMessages(updated)
    localStorage.setItem(`combo-innerchild-${comboId}`, JSON.stringify(updated))
    setMessage('')
    setCurrentStep(prev => prev + 1)
  }

  const nextPrompt = () => {
    setCurrentStep(prev => prev + 1)
    setMessage('')
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="orbs" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">← 返回星图</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>👶 内在小孩</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <button onClick={() => setShowMessages(!showMessages)} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">
            {showMessages ? '✉️ 对话' : `📖 ${messages.length}`}
          </button>
        </div>

        {!showMessages ? (
          <>
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">👶✨</div>
              <p className="text-sm opacity-60">坐下来，和心里那个小小的自己说说话</p>
            </div>

            <div
              className="rounded-3xl p-8 mb-8 text-center backdrop-blur-2xl"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`,
                border: `2px solid ${theme.borderColor}`,
                boxShadow: `0 0 80px ${theme.glowColor}`,
              }}
            >
              <p className="text-xs opacity-50 mb-4">{currentPrompt.title}</p>
              <p className="text-xl font-light leading-relaxed">{currentPrompt.prompt}</p>
            </div>

            <div
              className="rounded-2xl p-6 backdrop-blur-xl mb-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}
            >
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="对着心里那个小小的自己，说点什么吧……"
                className="w-full h-44 bg-transparent resize-none text-base leading-relaxed placeholder-white/30 focus:outline-none"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={nextPrompt}
                className="px-8 py-4 rounded-full text-sm backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all"
              >
                换一个话题 ↻
              </button>
              <button
                onClick={saveMessage}
                disabled={!message.trim()}
                className="px-10 py-4 rounded-full font-medium backdrop-blur-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)` }}
              >
                💌 送出心里话
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <div className="text-6xl mb-4">👶</div>
                <p>还没有对话记录</p>
                <p className="text-sm mt-2">从第一个话题开始吧</p>
              </div>
            ) : (
              messages.map(entry => (
                <div key={entry.id} className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: `${theme.primary}30`, color: theme.primary }}>
                      {entry.title}
                    </span>
                    <span className="text-xs opacity-50">{entry.date}</span>
                  </div>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
