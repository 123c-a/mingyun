import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors, oracleCards, drawOracleCard } from '../lib/comboGenerator'

export default function OracleCardsPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [cardFlipped, setCardFlipped] = useState(false)
  const [drawnCards, setDrawnCards] = useState<typeof oracleCards>([])
  const [currentCard, setCurrentCard] = useState(oracleCards[0])

  const validPlanets = useMemo(() => {
    return comboPath.split('-').filter(id => planetNames[id] || id === 'pluto')
  }, [comboPath])

  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)

  const comboInfo = useMemo(() => {
    if (existingConfig) return { name: existingConfig.name }
    const { name } = generateComboName(validPlanets, seed)
    return { name }
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

  const drawCard = () => {
    setCardFlipped(false)
    setTimeout(() => {
      const newCard = drawOracleCard(seed + Date.now())
      setCurrentCard(newCard)
      setDrawnCards(prev => [newCard, ...prev].slice(0, 5))
      setCardFlipped(true)
    }, 500)
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

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
            <h1 className="text-2xl font-light tracking-wider" style={{ color: theme.primary }}>🃏 神谕卡</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="w-24" />
        </div>

        {/* 神谕卡区域 */}
        <div className="flex flex-col items-center mb-16">
          {/* 主卡 */}
          <div
            className="relative w-72 h-96 cursor-pointer perspective-1000"
            onClick={drawCard}
          >
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: cardFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
              }}
            >
              {/* 背面 */}
              <div
                className="absolute inset-0 rounded-3xl flex items-center justify-center backdrop-blur-2xl"
                style={{
                  backfaceVisibility: 'hidden',
                  background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}20)`,
                  border: `2px solid ${theme.borderColor}`,
                  boxShadow: `0 0 60px ${theme.glowColor}`,
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">✦</div>
                  <p className="text-sm opacity-60">点击抽取神谕</p>
                </div>
              </div>

              {/* 正面 */}
              <div
                className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 backdrop-blur-2xl"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: `linear-gradient(135deg, ${theme.primary}25, ${theme.secondary}15)`,
                  border: `2px solid ${theme.borderColor}`,
                  boxShadow: `0 0 80px ${theme.glowColor}`,
                }}
              >
                <div className="text-7xl mb-6">{currentCard.image}</div>
                <h2 className="text-2xl font-light mb-4" style={{ color: theme.primary }}>{currentCard.title}</h2>
                <p className="text-sm text-center opacity-80 leading-relaxed">{currentCard.content}</p>
                <div className="mt-6 text-xs opacity-40">— 宇宙的指引 —</div>
              </div>
            </div>
          </div>

          {/* 抽卡按钮 */}
          <button
            onClick={drawCard}
            className="mt-8 px-8 py-4 rounded-full text-lg font-medium backdrop-blur-xl transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`,
              boxShadow: `0 0 40px ${theme.glowColor}`,
            }}
          >
            🎴 抽取神谕卡
          </button>
        </div>

        {/* 历史记录 */}
        {drawnCards.length > 0 && (
          <div>
            <h3 className="text-lg font-light mb-6 text-center opacity-70">最近抽取</h3>
            <div className="grid grid-cols-5 gap-4">
              {drawnCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 text-center backdrop-blur-xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${theme.borderColor}40`,
                  }}
                >
                  <div className="text-3xl mb-2">{card.image}</div>
                  <p className="text-xs font-medium">{card.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 卡片说明 */}
        <div className="mt-16 text-center">
          <p className="text-sm opacity-50 max-w-md mx-auto">
            每一张神谕卡都承载着宇宙的智慧。闭上眼睛，深呼吸，让直觉引导你选择一张卡。
            卡片会揭示你今日需要知道的信息。
          </p>
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
