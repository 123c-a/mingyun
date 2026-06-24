import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function WishPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [wish, setWish] = useState('')
  const [planted, setPlanted] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

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
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  useEffect(() => {
    const saved = localStorage.getItem(`combo-wish-${comboPath}`)
    if (saved) {
      setWish(saved)
      setPlanted(true)
    }
  }, [comboPath])

  const plantWish = () => {
    if (!wish.trim()) return
    localStorage.setItem(`combo-wish-${comboPath}`, wish)
    setPlanted(true)
    // 生成粒子动画
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      y: 50 + Math.random() * 20,
      delay: Math.random() * 0.5,
    }))
    setParticles(newParticles)
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#fbbf24" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* 顶部 */}
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            ← 返回总览
          </button>
        </div>

        {!planted ? (
          <>
            {/* 未种下愿望 */}
            <div className="text-center mb-12">
              <div className="text-8xl mb-6 animate-bounce">🌠</div>
              <h1 className="text-3xl font-light mb-4" style={{ color: '#fbbf24' }}>向星许愿</h1>
              <p className="text-sm opacity-60 max-w-md">
                在星空下，将你的愿望托付给宇宙。
                每一个愿望都是一颗种子，等待被星光滋养。
              </p>
            </div>

            <div
              className="w-full rounded-3xl p-8 backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))',
                border: '2px solid rgba(251,191,36,0.3)',
                boxShadow: '0 0 80px rgba(251,191,36,0.2)',
              }}
            >
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="写下你的愿望..."
                className="w-full h-40 bg-transparent resize-none text-xl text-center placeholder-white/30 focus:outline-none"
              />
            </div>

            <button
              onClick={plantWish}
              disabled={!wish.trim()}
              className="mt-8 px-12 py-5 rounded-full text-lg font-medium backdrop-blur-2xl transition-all hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #fbbf24cc, #f59e0bcc)',
                boxShadow: '0 0 60px rgba(251,191,36,0.4)',
              }}
            >
              ✨ 种下愿望
            </button>
          </>
        ) : (
          <>
            {/* 已种下愿望 */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <div className="text-8xl animate-pulse">⭐</div>
                {/* 粒子 */}
                {particles.map(p => (
                  <div
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full bg-yellow-300 animate-float"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      animationDelay: `${p.delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div
              className="w-full rounded-3xl p-8 text-center backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))',
                border: '2px solid rgba(251,191,36,0.4)',
                boxShadow: '0 0 100px rgba(251,191,36,0.3)',
              }}
            >
              <p className="text-xs opacity-50 mb-4">你的愿望已种入星空</p>
              <p className="text-2xl font-light italic leading-relaxed">"{wish}"</p>
              <p className="text-xs opacity-40 mt-6">
                星光正在滋养它...
                <br />
                每天回来看看它的成长
              </p>
            </div>

            {/* 成长指示 */}
            <div className="mt-12 flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${i <= 3 ? 'animate-pulse' : 'opacity-30'}`}
                  style={{
                    background: i <= 3 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#ffffff20',
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-sm opacity-50 mt-4">愿望成长中 · 阶段 3/5</p>
          </>
        )}
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
