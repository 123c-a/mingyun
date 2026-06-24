import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

const moodColors = [
  { name: '喜悦', color: '#FFD700', emoji: '😊' },
  { name: '平静', color: '#87CEEB', emoji: '😌' },
  { name: '热情', color: '#FF6B6B', emoji: '🔥' },
  { name: '忧伤', color: '#6B8DD6', emoji: '😢' },
]

export default function MoodPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="orbs" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-light mb-6" style={{ color: theme.primary }}>🎨 情绪调色板</h1>
          <p className="text-sm opacity-60 mb-8">今天，你的情绪是什么颜色？</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moodColors.map(mood => (
              <div key={mood.name} className="rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-all" style={{ background: `${mood.color}30`, boxShadow: `0 0 30px ${mood.color}40` }}>
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <p className="text-sm" style={{ color: mood.color }}>{mood.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
