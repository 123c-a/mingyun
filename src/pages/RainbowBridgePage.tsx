import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function RainbowBridgePage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const steps = ['1. 找一个安静的地方，坐下来', '2. 闭上眼睛，做几次深呼吸', '3. 想象你脚下有一道彩虹，从地面升起', '4. 顺着彩虹桥慢慢往上走', '5. 在桥的另一端，遇见更高的自己', '6. 问 TA 任何你想问的问题']
  const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#9400D3" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>🌈 彩虹桥冥想</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="w-24" />
        </div>
        <div className="text-center mb-12">
          <div className="inline-flex gap-1 mb-8">
            {rainbowColors.map((color, i) => (
              <div key={i} className="w-6 h-16 rounded-t-full animate-pulse" style={{ background: color, animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
          <p className="text-sm opacity-70">想象一道彩虹桥，连接你和更高维度的自己</p>
        </div>
        <div className="space-y-4 max-w-md mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="rounded-xl p-4 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-sm opacity-80">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
