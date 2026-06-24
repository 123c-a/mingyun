import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors, iChingHexagrams, castIChing } from '../lib/comboGenerator'

export default function IChingPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [hexagram, setHexagram] = useState<typeof iChingHexagrams[0] | null>(null)
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40`, borderColor: `${existingConfig.primaryColor}30` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const cast = () => setHexagram(castIChing(seed + Date.now()))

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#f59e0b" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-6">☯️</div>
          <h1 className="text-3xl font-light mb-4" style={{ color: '#f59e0b' }}>易经卦象</h1>
          <p className="text-sm opacity-60 mb-8">起卦问事，探寻变化之道</p>
          {hexagram === null ? (
            <div>
              <button onClick={cast} className="px-8 py-4 rounded-full text-lg font-medium backdrop-blur-xl hover:scale-105" style={{ background: 'linear-gradient(135deg, #f59e0bcc, #d97706cc)' }}>
                起卦
              </button>
              <p className="text-xs opacity-50 mt-4">静心凝神，想着你要问的事</p>
            </div>
          ) : (
            <div className="rounded-3xl p-10 backdrop-blur-2xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))', border: `2px solid ${theme.borderColor}`, boxShadow: `0 0 80px ${theme.glowColor}` }}>
              <div className="text-6xl mb-4">䷀</div>
              <p className="text-xl font-light mb-2">第 {hexagram.number} 卦</p>
              <p className="text-2xl font-medium mb-3" style={{ color: theme.primary }}>{hexagram.name}</p>
              <p className="text-sm opacity-80">{hexagram.meaning}</p>
              <button onClick={cast} className="mt-6 px-6 py-2 rounded-full text-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>再占一卦</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
