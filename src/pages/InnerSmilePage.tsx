import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function InnerSmilePage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const parts = ['头顶 - 放松你的大脑', '眼睛 - 让眼睛休息一下', '喉咙 - 释放未说出口的话', '心脏 - 对心脏说"谢谢你"', '肺部 - 深呼吸，充满氧气', '胃部 - 消化的不只是食物', '腹部 - 那里有你的直觉', '双腿 - 它们带你去任何地方', '双脚 - 稳稳地站在大地上']

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>😊 内在微笑</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="w-24" />
        </div>
        <div className="text-center mb-8">
          <h2 className="text-xl font-light mb-4" style={{ color: theme.primary }}>用微笑，疗愈你身体的每一个部位</h2>
          <p className="text-sm opacity-50">想象一道温柔的光，带着微笑，从上到下，流经你身体的每一个部位</p>
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          {parts.map((part, i) => (
            <div key={i} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-lg">😊</span>
              <span className="text-sm opacity-80">{part}</span>
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
