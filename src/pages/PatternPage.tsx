import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function PatternPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="constellation" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-light mb-4" style={{ color: theme.primary }}>模式解密</h1>
          <p className="text-sm opacity-60 mb-8">生命中的重复模式，都是未完成的课题</p>
          <div className="space-y-4 max-w-md mx-auto">
            {['在关系中，你是否总是重复同样的剧本？', '工作中，什么模式让你停滞不前？', '你的情绪有什么周期性的规律？'].map((q, i) => (
              <div key={i} className="rounded-xl p-4 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-sm">{q}</p>
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
