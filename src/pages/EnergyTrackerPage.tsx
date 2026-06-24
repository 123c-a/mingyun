import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

export default function EnergyTrackerPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [todayEnergy, setTodayEnergy] = useState(5)
  const [history, setHistory] = useState<number[]>([])
  const [weekDays, setWeekDays] = useState<string[]>([])

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
        borderColor: `${existingConfig.primaryColor}30`,
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  useEffect(() => {
    const saved = localStorage.getItem(`combo-energy-${comboPath}`)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {}
    }
    // 生成最近7天的标签
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toLocaleDateString('zh-CN', { weekday: 'short' }))
    }
    setWeekDays(days)
  }, [comboPath])

  const saveEnergy = () => {
    const updated = [...history, todayEnergy]
    setHistory(updated)
    localStorage.setItem(`combo-energy-${comboPath}`, JSON.stringify(updated))
  }

  const avgEnergy = history.length > 0
    ? Math.round(history.reduce((a, b) => a + b, 0) / history.length * 10) / 10
    : 0

  const maxEnergy = 10
  const displayHistory = history.slice(-14)

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="rings" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            ← 返回
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-wider" style={{ color: theme.primary }}>📊 能量追踪</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div className="px-6 py-3 rounded-full text-sm backdrop-blur-xl" style={{ background: theme.primary + '30' }}>
            平均 {avgEnergy}
          </div>
        </div>

        {/* 今日能量 */}
        <div className="mb-12">
          <div
            className="rounded-3xl p-10 text-center backdrop-blur-2xl"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`,
              border: `2px solid ${theme.borderColor}`,
              boxShadow: `0 0 80px ${theme.glowColor}`,
            }}
          >
            <p className="text-sm opacity-60 mb-6">今日能量状态</p>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${theme.primary}40, transparent)`,
                  boxShadow: `0 0 60px ${theme.glowColor}`,
                }}
              >
                <span className="text-6xl font-light" style={{ color: theme.primary }}>{todayEnergy}</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={todayEnergy}
              onChange={(e) => setTodayEnergy(parseInt(e.target.value))}
              className="w-full max-w-md h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: `${theme.primary}40`, accentColor: theme.primary }}
            />

            <div className="flex justify-between text-xs opacity-50 mt-2 max-w-md mx-auto">
              <span>低迷</span>
              <span>充沛</span>
            </div>

            <button
              onClick={saveEnergy}
              className="mt-8 px-10 py-4 rounded-full text-lg font-medium backdrop-blur-xl transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`,
              }}
            >
              💾 记录今日
            </button>
          </div>
        </div>

        {/* 历史趋势 */}
        {displayHistory.length > 0 && (
          <div
            className="rounded-3xl p-8 backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}
          >
            <h3 className="text-lg font-light mb-6 text-center">📈 能量趋势</h3>

            {/* 柱状图 */}
            <div className="flex items-end justify-center gap-2 h-40 mb-6">
              {displayHistory.slice(-7).map((value, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-8 rounded-t-lg transition-all"
                    style={{
                      height: `${value * 16}px`,
                      background: `linear-gradient(to top, ${theme.primary}, ${theme.secondary})`,
                      opacity: 0.7 + (value / 10) * 0.3,
                    }}
                  />
                  <span className="text-[10px] opacity-50 mt-2">{weekDays[weekDays.length - 7 + i] || ''}</span>
                </div>
              ))}
            </div>

            {/* 统计 */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-2xl font-light" style={{ color: theme.primary }}>
                  {Math.max(...displayHistory.slice(-7))}
                </p>
                <p className="text-xs opacity-50">最高</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-2xl font-light" style={{ color: theme.primary }}>
                  {Math.round(displayHistory.slice(-7).reduce((a, b) => a + b, 0) / Math.min(displayHistory.length, 7) * 10) / 10}
                </p>
                <p className="text-xs opacity-50">平均</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-2xl font-light" style={{ color: theme.primary }}>
                  {Math.min(...displayHistory.slice(-7))}
                </p>
                <p className="text-xs opacity-50">最低</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
