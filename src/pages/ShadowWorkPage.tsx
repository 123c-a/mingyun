import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function ShadowWorkPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="orbs" primaryColor="#8b5cf6" secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-6">🎭</div>
          <h1 className="text-3xl font-light mb-4" style={{ color: '#8b5cf6' }}>影子工作</h1>
          <p className="text-sm opacity-60 mb-8">拥抱你的阴影面，整合内在碎片</p>
          <div className="rounded-3xl p-10 backdrop-blur-2xl" style={{ background: 'linear-gradient(135deg, rgba(128,0,128,0.15), rgba(0,0,50,0.1))', border: '2px solid rgba(139,92,246,0.3)' }}>
            <p className="text-base leading-relaxed max-w-lg mx-auto">
              你的阴影面，是你拒绝看见的自己。<br />
              但它也是你力量的源泉。<br /><br />
              「最近，你在别人身上看到了什么让你不舒服的特质？」
            </p>
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
