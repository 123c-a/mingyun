import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

interface Habit {
  id: string
  name: string
  icon: string
  color: string
  records: Record<string, boolean>
  createdAt: string
}

const habitTemplates = [
  { name: '早起', icon: '🌅' },
  { name: '运动', icon: '🏃' },
  { name: '阅读', icon: '📚' },
  { name: '冥想', icon: '🧘' },
  { name: '喝水', icon: '💧' },
  { name: '写日记', icon: '📝' },
  { name: '早睡', icon: '🌙' },
  { name: '感恩', icon: '💝' },
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function HabitPage() {
  const { '*': fullPath = '' } = useParams()
  const navigate = useNavigate()
  const comboId = fullPath.split('/')[0] || ''
  const [habits, setHabits] = useState<Habit[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = new Date(year, month, 1).getDay()

  const validPlanets = useMemo(() => comboId.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboId])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40`, borderColor: `${existingConfig.primaryColor}30` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  const habitColors = [theme.primary, theme.secondary, '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#fb7185']

  useEffect(() => {
    const saved = localStorage.getItem(`combo-habits-${comboId}`)
    if (saved) {
      try { setHabits(JSON.parse(saved)) } catch {}
    }
  }, [comboId])

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits)
    localStorage.setItem(`combo-habits-${comboId}`, JSON.stringify(newHabits))
  }

  const addHabit = (templateName?: string, templateIcon?: string) => {
    const name = templateName || newHabitName.trim()
    if (!name) return
    const newHabit: Habit = {
      id: `${Date.now()}`,
      name,
      icon: templateIcon || '⭐',
      color: habitColors[habits.length % habitColors.length],
      records: {},
      createdAt: new Date().toISOString(),
    }
    saveHabits([...habits, newHabit])
    setNewHabitName('')
    setShowAdd(false)
  }

  const toggleHabit = (habitId: string, date: string) => {
    const newHabits = habits.map(h => {
      if (h.id !== habitId) return h
      const newRecords = { ...h.records }
      if (newRecords[date]) {
        delete newRecords[date]
      } else {
        newRecords[date] = true
      }
      return { ...h, records: newRecords }
    })
    saveHabits(newHabits)
  }

  const deleteHabit = (habitId: string) => {
    if (!confirm('确定要删除这个习惯吗？')) return
    saveHabits(habits.filter(h => h.id !== habitId))
  }

  const getStreak = (habit: Habit) => {
    let streak = 0
    let d = new Date()
    while (true) {
      const dateStr = d.toISOString().split('T')[0]
      if (habit.records[dateStr]) {
        streak++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const todayStr = today.toISOString().split('T')[0]
  const todayDone = habits.filter(h => h.records[todayStr]).length
  const progress = habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">← 返回星图</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>⭐ 习惯星图</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">
            {showAdd ? '✕ 取消' : '＋ 新增'}
          </button>
        </div>

        {/* 今日进度 */}
        <div
          className="rounded-3xl p-8 mb-8 backdrop-blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`,
            border: `2px solid ${theme.borderColor}`,
            boxShadow: `0 0 60px ${theme.glowColor}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-60">今日进度</p>
              <p className="text-4xl font-light">{todayDone} / {habits.length}</p>
            </div>
            <div className="text-5xl">{habits.length > 0 && progress >= 100 ? '🎉' : '⭐'}</div>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
            />
          </div>
        </div>

        {/* 添加习惯 */}
        {showAdd && (
          <div className="rounded-2xl p-6 mb-8 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}>
            <p className="text-sm opacity-60 mb-4">快速添加：</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {habitTemplates.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => addHabit(t.name, t.icon)}
                  className="px-4 py-2 rounded-full text-sm backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all"
                  style={{ borderColor: habitColors[i], border: `1px solid ${habitColors[i]}40` }}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
                placeholder="自定义习惯名称..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-white/20"
              />
              <button
                onClick={() => addHabit()}
                className="px-6 py-3 rounded-xl text-sm"
                style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)` }}
              >
                添加
              </button>
            </div>
          </div>
        )}

        {/* 习惯列表 */}
        {habits.length === 0 ? (
          <div className="text-center py-16 opacity-50">
            <div className="text-6xl mb-4">✨</div>
            <p>还没有习惯</p>
            <p className="text-sm mt-2">点右上角的 ＋ 开始吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map(habit => {
              const streak = getStreak(habit)
              const doneToday = !!habit.records[todayStr]
              return (
                <div
                  key={habit.id}
                  className="rounded-2xl p-6 backdrop-blur-xl relative group"
                  style={{ background: doneToday ? `${habit.color}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${doneToday ? habit.color : theme.borderColor}` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleHabit(habit.id, todayStr)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${doneToday ? 'scale-110' : 'opacity-50'}`}
                        style={{ background: doneToday ? `${habit.color}40` : 'rgba(255,255,255,0.1)' }}
                      >
                        {doneToday ? '✓' : habit.icon}
                      </button>
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-xs opacity-60">🔥 连续 {streak} 天</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm opacity-60">{streak}天</span>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-sm transition-opacity"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {/* 本月打卡 */}
                  <div className="mt-4">
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const date = new Date(year, month, day)
                        const dateStr = date.toISOString().split('T')[0]
                        const done = !!habit.records[dateStr]
                        const isToday = day === today.getDate()
                        const isFuture = day > today.getDate()
                        return (
                          <button
                            key={day}
                            onClick={() => !isFuture && toggleHabit(habit.id, dateStr)}
                            disabled={isFuture}
                            className={`aspect-square rounded-lg text-xs transition-all ${
                              isFuture ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                            }`}
                            style={{
                              background: done ? habit.color : 'rgba(255,255,255,0.05)',
                              color: done ? '#fff' : 'inherit',
                              border: isToday ? `2px solid ${theme.primary}` : 'none',
                            }}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
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
