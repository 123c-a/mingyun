import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors, generateCosmicLetter } from '../lib/comboGenerator'

export default function CosmicLetterPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [showLetter, setShowLetter] = useState(false)
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40`, borderColor: `${existingConfig.primaryColor}30` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])
  const letter = useMemo(() => generateCosmicLetter(seed), [seed])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#fbbf24" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        {!showLetter ? (
          <div className="text-center">
            <div className="text-8xl mb-8 animate-bounce">💌</div>
            <h1 className="text-3xl font-light mb-4" style={{ color: '#fbbf24' }}>宇宙来信</h1>
            <p className="text-sm opacity-60 mb-8 max-w-md">有一封信，从遥远的星辰寄来...</p>
            <button onClick={() => setShowLetter(true)} className="px-10 py-4 rounded-full text-lg font-medium backdrop-blur-xl hover:scale-105" style={{ background: 'linear-gradient(135deg, #fbbf24cc, #f59e0bcc)', boxShadow: '0 0 60px rgba(251,191,36,0.4)' }}>
              拆开信封
            </button>
          </div>
        ) : (
          <div className="rounded-3xl p-10 max-w-lg text-center backdrop-blur-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,180,0,0.05))', border: `2px solid ${theme.borderColor}`, boxShadow: `0 0 80px ${theme.glowColor}` }}>
            <div className="text-4xl mb-6">✨💌✨</div>
            <div className="space-y-4 text-sm leading-relaxed text-left">
              {letter.split('\n\n').map((para, i) => (
                <p key={i} className={i === 0 ? 'font-medium' : i === letter.split('\n\n').length - 1 ? 'text-right italic opacity-80' : ''}>{para}</p>
              ))}
            </div>
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
