import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function CordCuttingPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#ef4444" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-6">✂️</div>
          <h1 className="text-3xl font-light mb-4" style={{ color: '#ef4444' }}>能量剪线</h1>
          <div className="rounded-3xl p-8 mb-8 backdrop-blur-2xl" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.08))', border: '2px solid rgba(239,68,68,0.3)' }}>
            <p className="text-sm opacity-80 mb-4">想一想：</p>
            <ul className="text-sm space-y-2 opacity-70 text-left max-w-sm mx-auto">
              <li>• 谁让你感到消耗？</li>
              <li>• 什么关系让你疲惫？</li>
              <li>• 哪些旧模式还在拉扯你？</li>
            </ul>
          </div>
          <div className="text-6xl mb-6 line-through opacity-30">════════</div>
          <p className="text-sm opacity-60">想象你和 TA 之间有一根线<br />然后，温柔而坚定地，剪断它</p>
          <p className="text-xs opacity-40 mt-4">你可以爱一个人，同时不被 TA 消耗</p>
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
