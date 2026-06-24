import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

const phaseConfig = {
  inhale: { duration: 4, label: '吸气', color: '#4ade80' },
  hold: { duration: 7, label: '屏息', color: '#fbbf24' },
  exhale: { duration: 8, label: '呼气', color: '#6366f1' },
  rest: { duration: 0, label: '准备', color: '#94a3b8' },
}

export default function BreathingPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<BreathPhase>('rest')
  const [countdown, setCountdown] = useState(0)
  const [scale, setScale] = useState(1)
  const [totalBreaths, setTotalBreaths] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const validPlanets = useMemo(() => {
    return comboPath.split('-').filter(id => planetNames[id] || id === 'pluto')
  }, [comboPath])

  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)

  const comboInfo = useMemo(() => {
    if (existingConfig) return { name: existingConfig.name }
    const { name } = generateComboName(validPlanets, seed)
    return { name }
  }, [validPlanets, seed, existingConfig])

  const theme = useMemo(() => {
    if (existingConfig) {
      return {
        primary: existingConfig.primaryColor,
        secondary: existingConfig.secondaryColor,
        glowColor: `${existingConfig.primaryColor}40`,
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  useEffect(() => {
    if (isActive) {
      // 开始4-7-8呼吸循环
      const phases: BreathPhase[] = ['inhale', 'hold', 'exhale']
      let currentPhaseIndex = 0

      const runPhase = () => {
        const currentPhase = phases[currentPhaseIndex]
        setPhase(currentPhase)
        const config = phaseConfig[currentPhase]
        setCountdown(config.duration)

        // 动画缩放
        if (currentPhase === 'inhale') {
          setScale(1.8)
        } else if (currentPhase === 'exhale') {
          setScale(1)
        }

        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
              if (currentPhaseIndex === 0) {
                setTotalBreaths(prev => prev + 1)
              }
              setTimeout(runPhase, 200)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }

      runPhase()
    } else {
      setPhase('rest')
      setCountdown(0)
      setScale(1)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive])

  const currentConfig = phaseConfig[phase]

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="orbs" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* 顶部导航 */}
        <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            ← 返回
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-wider" style={{ color: theme.primary }}>💨 生命之息</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5">
            {totalBreaths} 次呼吸
          </div>
        </div>

        {/* 呼吸球 */}
        <div className="flex flex-col items-center">
          <div
            className="relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${currentConfig.color}40, ${theme.primary}20, transparent)`,
              transform: `scale(${scale})`,
              boxShadow: `0 0 100px ${currentConfig.color}60, 0 0 200px ${currentConfig.color}30`,
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-2">
                {phase === 'inhale' ? '🌬️' : phase === 'hold' ? '⏸️' : phase === 'exhale' ? '💨' : '○'}
              </div>
              {isActive && (
                <div
                  className="text-5xl font-light"
                  style={{ color: currentConfig.color }}
                >
                  {countdown}
                </div>
              )}
            </div>
          </div>

          {/* 阶段标签 */}
          <div className="mt-8 text-center">
            <p
              className="text-2xl font-light transition-all"
              style={{ color: currentConfig.color }}
            >
              {isActive ? currentConfig.label : '准备开始'}
            </p>
            {isActive && (
              <p className="text-sm opacity-50 mt-2">
                {phase === 'inhale' && '深深吸气，让气息充满肺部'}
                {phase === 'hold' && '屏住呼吸，保持这个状态'}
                {phase === 'exhale' && '缓缓呼气，释放所有紧张'}
              </p>
            )}
          </div>

          {/* 控制按钮 */}
          <button
            onClick={() => setIsActive(!isActive)}
            className="mt-12 px-12 py-5 rounded-full text-lg font-medium backdrop-blur-2xl transition-all hover:scale-105"
            style={{
              background: isActive
                ? 'linear-gradient(135deg, #ef4444cc, #dc2626cc)'
                : `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`,
              boxShadow: `0 0 60px ${isActive ? '#ef444440' : theme.glowColor}`,
            }}
          >
            {isActive ? '⏹ 停止' : '▶ 开始呼吸'}
          </button>
        </div>

        {/* 说明 */}
        <div className="absolute bottom-12 text-center max-w-md">
          <p className="text-sm opacity-50">
            4-7-8 呼吸法是一种古老的放松技巧。
            <br />
            吸气 4 秒，屏息 7 秒，呼气 8 秒。
            <br />
            重复这个循环数次，感受内心的平静。
          </p>
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
