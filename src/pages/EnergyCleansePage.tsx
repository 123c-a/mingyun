import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function EnergyCleansePage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const methods = [
    { icon: '🌿', title: '接地', desc: '光脚站在地上，感受大地的支撑' },
    { icon: '💧', title: '水疗', desc: '用清水冲洗双手，想象负面能量被冲走' },
    { icon: '🔥', title: '火焰', desc: '点燃蜡烛，让火焰转化负面能量' },
    { icon: '🌬️', title: '风息', desc: '深吸一口气，然后用力呼出' },
    { icon: '✨', title: '光照', desc: '想象金色的光从头顶灌入全身' },
  ]

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="orbs" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>⚡ 能量清理</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="w-24" />
        </div>
        <div className="text-center mb-8">
          <p className="text-sm opacity-60">净化你的能量场，释放不再服务于你的一切</p>
        </div>
        <div className="space-y-4 max-w-md mx-auto">
          {methods.map((m, i) => (
            <div key={i} className="rounded-2xl p-6 flex items-center gap-4 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-4xl">{m.icon}</span>
              <div>
                <p className="text-lg font-medium">{m.title}</p>
                <p className="text-sm opacity-60">{m.desc}</p>
              </div>
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
