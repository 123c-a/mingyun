import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function NumerologyPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [number, setNumber] = useState<number | null>(null)
  const validPlanets = useMemo(() => comboPath.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboPath])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const generate = () => {
    const today = new Date()
    setNumber(((seed + today.getFullYear() + today.getMonth() + today.getDate()) % 9) + 1)
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-8 left-0 right-0 flex justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10">← 返回</button>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-6">🔢</div>
          <h1 className="text-3xl font-light mb-4" style={{ color: theme.primary }}>数字命盘</h1>
          <p className="text-sm opacity-60 mb-8">今日幸运数字</p>
          {number === null ? (
            <button onClick={generate} className="px-8 py-4 rounded-full text-lg font-medium backdrop-blur-xl hover:scale-105" style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)` }}>
              🔮 生成幸运数字
            </button>
          ) : (
            <div className="rounded-3xl p-12 backdrop-blur-2xl" style={{ background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}15)`, border: `2px solid ${theme.borderColor}`, boxShadow: `0 0 80px ${theme.glowColor}` }}>
              <div className="text-8xl font-light mb-4" style={{ color: theme.primary }}>{number}</div>
              <p className="text-sm opacity-80 max-w-xs mx-auto">
                {number === 1 && '独立、开创、领导力。今天适合开启新事物。'}
                {number === 2 && '和谐、合作、平衡。今天适合连接他人。'}
                {number === 3 && '创造、表达、喜悦。今天适合发挥创意。'}
                {number === 4 && '稳定、务实、构建。今天适合打牢基础。'}
                {number === 5 && '自由、变化、冒险。今天适合拥抱变化。'}
                {number === 6 && '爱、关怀、疗愈。今天适合照顾自己和他人。'}
                {number === 7 && '智慧、内省、神秘。今天适合深度思考。'}
                {number === 8 && '丰盛、力量、成就。今天适合行动显化。'}
                {number === 9 && '完成、慈悲、智慧。今天适合总结和放下。'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
