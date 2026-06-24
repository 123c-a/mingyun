import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function SoundHealingPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const frequencies = [
    { freq: '528Hz', name: '爱与修复', emoji: '💚' },
    { freq: '432Hz', name: '自然和谐', emoji: '🌿' },
    { freq: '396Hz', name: '释放恐惧', emoji: '🕊️' },
    { freq: '639Hz', name: '连接关系', emoji: '💞' },
    { freq: '741Hz', name: '表达与净化', emoji: '💙' },
    { freq: '852Hz', name: '直觉觉醒', emoji: '👁️' },
  ]

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="rings" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-6">🎵</div>
          <h1 className="text-3xl font-light mb-4" style={{ color: theme.primary }}>音声疗愈</h1>
          <p className="text-sm opacity-60 mb-8">用声音的频率，校准你的能量场</p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {frequencies.map(item => (
              <button key={item.freq} className="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-3xl mb-2">{item.emoji}</span>
                <span className="text-sm font-medium">{item.freq}</span>
                <span className="text-[10px] opacity-60">{item.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs opacity-50 mt-6">点击播放对应频率的疗愈音</p>
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
