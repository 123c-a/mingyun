import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import {
  stringToSeed,
  generateComboName,
  generateThemeColors,
  generatePromptCard,
  mirrorQuestions,
} from '../lib/comboGenerator'

export default function ReflectionPage() {
  const { '*': fullPath = '' } = useParams()
  const navigate = useNavigate()
  const comboId = fullPath.split('/')[0] || ''
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState<Array<{ id: string; question: string; answer: string; date: string }>>([])
  const [showHistory, setShowHistory] = useState(false)
  const [currentQIndex, setCurrentQIndex] = useState(0)

  const validPlanets = useMemo(() => comboId.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboId])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40`, borderColor: `${existingConfig.primaryColor}30` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])
  const prompt = useMemo(() => generatePromptCard(seed + currentQIndex), [seed, currentQIndex])

  useEffect(() => {
    const saved = localStorage.getItem(`combo-mirror-${comboId}`)
    if (saved) {
      try { setAnswers(JSON.parse(saved)) } catch {}
    }
  }, [comboId])

  const saveAnswer = () => {
    if (!answer.trim()) return
    const newEntry = {
      id: `${Date.now()}`,
      question: prompt.content,
      answer: answer.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
    }
    const updated = [newEntry, ...answers]
    setAnswers(updated)
    localStorage.setItem(`combo-mirror-${comboId}`, JSON.stringify(updated))
    setAnswer('')
    setCurrentQIndex(prev => prev + 1)
  }

  const nextQuestion = () => {
    setCurrentQIndex(prev => prev + 1)
    setAnswer('')
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="constellation" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">← 返回星图</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>🪞 每日魔镜</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <button onClick={() => setShowHistory(!showHistory)} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">
            {showHistory ? '✏️ 今日' : `📖 ${answers.length}`}
          </button>
        </div>

        {!showHistory ? (
          <>
            <div className="text-center mb-8">
              <div className="text-7xl mb-4 animate-pulse">🪞</div>
              <p className="text-sm opacity-60">今日，星图想让你看见的是……</p>
            </div>

            <div
              className="rounded-3xl p-8 mb-8 text-center backdrop-blur-2xl"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`,
                border: `2px solid ${theme.borderColor}`,
                boxShadow: `0 0 80px ${theme.glowColor}`,
              }}
            >
              <p className="text-xs opacity-50 mb-4">{prompt.title}</p>
              <p className="text-2xl font-light leading-relaxed">"{prompt.content}"</p>
            </div>

            <div
              className="rounded-2xl p-6 backdrop-blur-xl mb-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}
            >
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="对着魔镜，说出你看见的自己……"
                className="w-full h-40 bg-transparent resize-none text-base leading-relaxed placeholder-white/30 focus:outline-none"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={nextQuestion}
                className="px-8 py-4 rounded-full text-sm backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all"
              >
                换一个问题 ↻
              </button>
              <button
                onClick={saveAnswer}
                disabled={!answer.trim()}
                className="px-10 py-4 rounded-full font-medium backdrop-blur-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)` }}
              >
                ✨ 保存今日镜像
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {answers.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <div className="text-6xl mb-4">🪞</div>
                <p>还没有记录</p>
                <p className="text-sm mt-2">从今天的问题开始吧</p>
              </div>
            ) : (
              answers.map(entry => (
                <div key={entry.id} className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: `${theme.primary}30`, color: theme.primary }}>
                      {entry.date}
                    </span>
                  </div>
                  <p className="text-sm opacity-70 mb-3 italic">"{entry.question}"</p>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{entry.answer}</p>
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
