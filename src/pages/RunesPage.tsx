import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors, runes, drawRunes } from '../lib/comboGenerator'

export default function RunesPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [drawnRunes, setDrawnRunes] = useState<typeof runes | null>(null)
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => {
    if (existingConfig) {
      return { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40`, borderColor: `${existingConfig.primaryColor}30`, cardBg: `linear-gradient(135deg, ${existingConfig.primaryColor}08 0%, ${existingConfig.secondaryColor}08 100%)` }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  const draw = () => setDrawnRunes(drawRunes(seed + Date.now(), 3))

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#a855f7" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>ᚠ 如尼符文</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="w-24" />
        </div>
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🪨</div>
          <button onClick={draw} className="px-8 py-4 rounded-full text-lg font-medium backdrop-blur-xl transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)` }}>
            投掷如尼石
          </button>
        </div>
        {drawnRunes && (
          <div className="space-y-6">
            {drawnRunes.map((rune, i) => (
              <div key={i} className="rounded-2xl p-6 flex items-center gap-6 backdrop-blur-xl" style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}` }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl" style={{ background: 'rgba(255,255,255,0.05)' }}>{rune.symbol}</div>
                <div>
                  <h3 className="text-lg font-medium">{rune.name}</h3>
                  <p className="text-sm opacity-60">{rune.meaning}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 mt-2 inline-block">{i === 0 ? '过去' : i === 1 ? '现在' : '未来'}</span>
                </div>
              </div>
            ))}
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
