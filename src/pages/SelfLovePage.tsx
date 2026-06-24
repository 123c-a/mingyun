import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function SelfLovePage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const rituals = [
    { icon: '🛁', title: '沐浴仪式', desc: '用喜爱的沐浴露，泡一个放松的澡' },
    { icon: '🎵', title: '音乐疗愈', desc: '听一首让你感觉美好的歌' },
    { icon: '📖', title: '阅读时光', desc: '读几页你喜欢的书' },
    { icon: '🌿', title: '自然连接', desc: '出门走走，感受大自然' },
    { icon: '💆', title: '身体扫描', desc: '从头到脚放松每一块肌肉' },
    { icon: '☕', title: '好好吃饭', desc: '认真做一顿自己爱吃的' },
  ]

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="orbs" primaryColor="#f472b6" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: '#f472b6' }}>🌸 自爱仪式</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="w-24" />
        </div>
        <div className="text-center mb-8">
          <p className="text-sm opacity-60">设计专属于你的自爱仪式</p>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {rituals.map((r, i) => (
            <div key={i} className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-3xl mb-3 block">{r.icon}</span>
              <p className="text-sm font-medium mb-1">{r.title}</p>
              <p className="text-xs opacity-60">{r.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-center opacity-50 mt-8">选择 2-3 项，作为你今天的自爱仪式</p>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
