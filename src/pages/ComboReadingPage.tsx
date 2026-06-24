import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, planetColors, getComboConfig } from '../data/comboConfigs'
import {
  stringToSeed,
  generateComboName,
  generateDescription,
  generateWisdomQuotes,
  generateThemeColors,
  generatePromptCard,
  generateAffirmation,
} from '../lib/comboGenerator'

export default function ComboReadingPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)
  const [revealedQuotes, setRevealedQuotes] = useState<number[]>([])

  const validPlanets = useMemo(() => {
    return comboPath.split('-').filter(id => planetNames[id] || id === 'pluto')
  }, [comboPath])

  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)

  const comboInfo = useMemo(() => {
    if (existingConfig) {
      return { name: existingConfig.name, subtitle: existingConfig.subtitle }
    }
    const { name, subtitle } = generateComboName(validPlanets, seed)
    return { name, subtitle }
  }, [validPlanets, seed, existingConfig])

  const theme = useMemo(() => {
    if (existingConfig) {
      return {
        primary: existingConfig.primaryColor,
        secondary: existingConfig.secondaryColor,
        glowColor: `${existingConfig.primaryColor}40`,
        borderColor: `${existingConfig.primaryColor}30`,
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  const wisdomQuotes = useMemo(() => generateWisdomQuotes(validPlanets, seed), [validPlanets, seed])
  const promptCard = useMemo(() => generatePromptCard(seed), [seed])
  const affirmation = useMemo(() => generateAffirmation(seed), [seed])

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const revealQuote = (index: number) => {
    if (!revealedQuotes.includes(index)) {
      setRevealedQuotes([...revealedQuotes, index])
    }
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="constellation" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            ← 返回总览
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-wider" style={{ color: theme.primary }}>星图智慧</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="w-24" />
        </div>

        <div className={`space-y-16 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* 今日启示 */}
          <div className="text-center">
            <div
              className="inline-block rounded-3xl p-12 backdrop-blur-2xl"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}15)`,
                border: `2px solid ${theme.borderColor}`,
                boxShadow: `0 0 80px ${theme.glowColor}`,
              }}
            >
              <p className="text-xs opacity-50 mb-4 tracking-[0.3em]">{promptCard.title}</p>
              <p className="text-3xl font-light leading-relaxed max-w-lg">"{promptCard.content}"</p>
            </div>
          </div>

          {/* Affirmation */}
          <div className="text-center">
            <p className="text-xs opacity-40 mb-4 tracking-widest">✨ 每日肯定</p>
            <p className="text-2xl font-light italic" style={{ color: theme.primary }}>"{affirmation}"</p>
          </div>

          {/* 智慧语录 */}
          <div>
            <h2 className="text-xl font-light mb-8 text-center opacity-70">💫 智慧传承</h2>
            <div className="space-y-6">
              {wisdomQuotes.map((quote, i) => (
                <div
                  key={i}
                  onClick={() => revealQuote(i)}
                  className="relative cursor-pointer group"
                >
                  <div
                    className="rounded-2xl p-8 backdrop-blur-xl transition-all"
                    style={{
                      background: revealedQuotes.includes(i)
                        ? `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`
                        : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${revealedQuotes.includes(i) ? theme.borderColor : 'rgba(255,255,255,0.1)'}`,
                      transform: revealedQuotes.includes(i) ? 'scale(1)' : 'scale(0.98)',
                    }}
                  >
                    {revealedQuotes.includes(i) ? (
                      <p className="text-lg font-light leading-relaxed">{quote}</p>
                    ) : (
                      <div className="flex items-center justify-center gap-4 opacity-30">
                        <div className="w-8 h-0.5 bg-white/30" />
                        <span className="text-sm">点击揭示</span>
                        <div className="w-8 h-0.5 bg-white/30" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
