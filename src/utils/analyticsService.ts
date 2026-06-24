import { useCosmicStore } from '../store/cosmicStore'
import { useTaskStore } from '../store/taskStore'

export type MoodEntry = {
  date: string
  score: number  // 1-5
  label: string
}

export type TrendData = {
  date: string
  value: number
  label?: string
}

export type PatternInsight = {
  type: 'recurring' | 'growth' | 'concern' | 'achievement'
  title: string
  description: string
  evidence: string[]
  suggestions: string[]
}

export type WeeklyReport = {
  weekStart: string
  weekEnd: string
  overview: {
    totalEntries: number
    mostActivePlanet: string
    moodTrend: 'up' | 'down' | 'stable'
    achievements: string[]
  }
  planetBreakdown: {
    planet: string
    entries: number
    highlights: string[]
  }[]
  insights: PatternInsight[]
  nextWeekSuggestions: string[]
}

export type MonthlyReport = {
  month: string
  overview: {
    totalEntries: number
    moodAverage: number
    streak: number
    topPlanet: string
    achievements: string[]
  }
  weeklyData: TrendData[]
  insights: PatternInsight[]
  growthAreas: string[]
  recommendedFocus: string
}

const PLANET_NAMES: Record<string, string> = {
  mercury: '水星',
  venus: '金星',
  earth: '地球',
  mars: '火星',
  jupiter: '木星',
  saturn: '土星',
  uranus: '天王星',
  neptune: '海王星',
  sun: '太阳',
}

function getDateRange(days: number): { start: number; end: number } {
  const end = Date.now()
  const start = end - days * 86400000
  return { start, end }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10)
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

export function getMoodTrend(days: number = 7): TrendData[] {
  const store = useCosmicStore.getState()
  const { start, end } = getDateRange(days)

  const dailyMoods: Record<string, number[]> = {}

  // 从火星数据提取情绪分数
  store.mars.forEach((entry: any) => {
    if (entry.createdAt >= start && entry.createdAt <= end) {
      const date = formatDate(entry.createdAt)
      const emotionScores: Record<string, number> = {
        '平静': 3, '喜悦': 5, '感恩': 4, '希望': 4,
        '焦虑': 2, '忧伤': 2, '愤怒': 1, '恐惧': 1, '孤独': 2,
        '混合': 3,
      }
      const score = emotionScores[entry.emotion] || 3
      if (!dailyMoods[date]) dailyMoods[date] = []
      dailyMoods[date].push(score)
    }
  })

  // 填充缺失的日期
  const result: TrendData[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const date = d.toISOString().slice(0, 10)
    const scores = dailyMoods[date]
    result.push({
      date,
      value: scores ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0,
      label: d.toLocaleDateString('zh-CN', { weekday: 'short' }),
    })
  }

  return result
}

export function getActivityHeatmap(days: number = 30): Record<string, number> {
  const store = useCosmicStore.getState()
  const { start, end } = getDateRange(days)

  const heatmap: Record<string, number> = {}

  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'] as const
  
  planets.forEach((planet) => {
    store[planet].forEach((entry: any) => {
      if (entry.createdAt >= start && entry.createdAt <= end) {
        const date = formatDate(entry.createdAt)
        heatmap[date] = (heatmap[date] || 0) + 1
      }
    })
  })

  return heatmap
}

export function getPlanetActivity(days: number = 30): { planet: string; count: number; recent: string }[] {
  const store = useCosmicStore.getState()
  const { start } = getDateRange(days)

  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'] as const
  
  return planets
    .map((planet) => {
      const entries = store[planet].filter((e: any) => e.createdAt >= start)
      const recent = entries.length > 0 
        ? entries[entries.length - 1] 
        : null
      return {
        planet,
        count: entries.length,
        recent: recent 
          ? ('text' in recent ? recent.text : 'story' in recent ? recent.story : '已记录').slice(0, 20)
          : '',
      }
    })
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count)
}

export function detectPatterns(): PatternInsight[] {
  const store = useCosmicStore.getState()
  const insights: PatternInsight[] = []

  // 情绪模式检测
  const recentMoods = getMoodTrend(14)
  const moodValues = recentMoods.map((m) => m.value).filter((v) => v > 0)
  
  if (moodValues.length >= 7) {
    const avgMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length
    const recentTrend = moodValues.slice(-3)
    const trendAvg = recentTrend.reduce((a, b) => a + b, 0) / recentTrend.length
    
    if (trendAvg > avgMood + 0.5) {
      insights.push({
        type: 'growth',
        title: '情绪正在上升 ✨',
        description: '最近几天的情绪状态比之前整体更好了',
        evidence: [`近14天平均情绪分: ${avgMood.toFixed(1)}`, `近3天平均: ${trendAvg.toFixed(1)}`],
        suggestions: ['继续保持', '可以尝试新的挑战'],
      })
    } else if (trendAvg < avgMood - 0.5) {
      insights.push({
        type: 'concern',
        title: '情绪有些低落 🌙',
        description: '最近几天的情绪状态比之前有所下降',
        evidence: [`近14天平均: ${avgMood.toFixed(1)}`, `近3天平均: ${trendAvg.toFixed(1)}`],
        suggestions: ['给自己一些休息时间', '去水星整理一下思绪', '试试深呼吸练习'],
      })
    }
  }

  // 思绪频率检测
  if (store.mercury.length >= 10) {
    const recentMercury = store.mercury.slice(-10)
    const keywords = recentMercury.flatMap((e: any) => e.text.split(/[,，。！？、\s]/))
    const keywordCounts: Record<string, number> = {}
    
    const focusWords = ['焦虑', '担心', '工作', '人际', '成长', '未来', '家庭', '健康']
    focusWords.forEach((word) => {
      const count = keywords.filter((k) => k.includes(word)).length
      if (count >= 2) keywordCounts[word] = count
    })
    
    if (Object.keys(keywordCounts).length > 0) {
      const topWord = Object.entries(keywordCounts).sort((a, b) => b[1] - a[1])[0]
      insights.push({
        type: 'recurring',
        title: '你最近在想：' + topWord[0],
        description: `你最近多次提到这个话题`,
        evidence: [`在 ${topWord[1]} 条思绪中提到`],
        suggestions: ['可以专门花时间梳理一下这个话题', '如果困扰已久，试试找信任的人聊聊'],
      })
    }
  }

  // 成就检测
  const totalEntries = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun']
    .reduce((sum, p) => sum + store[p].length, 0)
  
  if (totalEntries >= 50) {
    insights.push({
      type: 'achievement',
      title: '宇宙探索者 🌟',
      description: '你已经记录了50+条星光',
      evidence: [`总计 ${totalEntries} 条记录`],
      suggestions: ['给自己一个赞', '可以回顾一下这段时间的成长'],
    })
  }

  return insights
}

export function generateWeeklyReport(): WeeklyReport {
  const store = useCosmicStore.getState()
  const taskStore = useTaskStore.getState()
  
  const weekStart = getWeekStart(new Date())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'] as const
  
  const weeklyData = planets.map((planet) => ({
    planet,
    entries: store[planet].filter((e: any) => e.createdAt >= weekStart.getTime()).length,
    highlights: store[planet]
      .filter((e: any) => e.createdAt >= weekStart.getTime())
      .slice(-2)
      .map((e: any) => ('text' in e ? e.text : 'story' in e ? e.story : '记录').slice(0, 30)),
  })).filter((p) => p.entries > 0)

  const totalEntries = weeklyData.reduce((sum, p) => sum + p.entries, 0)
  const mostActive = weeklyData.sort((a, b) => b.entries - a.entries)[0]

  const moodTrend = getMoodTrend(7)
  const moodValues = moodTrend.map((m) => m.value).filter((v) => v > 0)
  const trend: 'up' | 'down' | 'stable' = moodValues.length >= 4
    ? (moodValues.slice(-2).reduce((a, b) => a + b, 0) / 2 > moodValues.slice(0, 2).reduce((a, b) => a + b, 0) / 2 + 0.3 ? 'up' : 'down')
    : 'stable'

  const achievements: string[] = []
  if (taskStore.totalStreak >= 7) achievements.push(`连续 ${taskStore.totalStreak} 天完成任务`)
  if (totalEntries >= 20) achievements.push(`本周记录 ${totalEntries} 条星光`)

  return {
    weekStart: weekStart.toISOString().slice(0, 10),
    weekEnd: weekEnd.toISOString().slice(0, 10),
    overview: {
      totalEntries,
      mostActivePlanet: mostActive ? PLANET_NAMES[mostActive.planet] : '暂无',
      moodTrend: trend,
      achievements,
    },
    planetBreakdown: weeklyData,
    insights: detectPatterns().slice(0, 3),
    nextWeekSuggestions: [
      '继续记录每天的情绪变化',
      '尝试探索一个还没去过的行星',
      '如果有困扰，写下来让水星帮你整理',
    ],
  }
}

export function generateMonthlyReport(): MonthlyReport {
  const store = useCosmicStore.getState()
  const taskStore = useTaskStore.getState()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'] as const
  
  const monthlyPlanetData = planets.map((planet) => ({
    planet,
    count: store[planet].filter((e: any) => e.createdAt >= monthStart.getTime()).length,
  })).filter((p) => p.count > 0)

  const totalEntries = monthlyPlanetData.reduce((sum, p) => sum + p.count, 0)
  const topPlanet = monthlyPlanetData.sort((a, b) => b.count - a.count)[0]

  const moodData = getMoodTrend(30)
  const moodValues = moodData.map((m) => m.value).filter((v) => v > 0)
  const moodAverage = moodValues.length > 0 
    ? Math.round((moodValues.reduce((a, b) => a + b, 0) / moodValues.length) * 10) / 10
    : 0

  const weeklyData: TrendData[] = []
  for (let w = 0; w < 4; w++) {
    const weekStart = new Date(monthStart)
    weekStart.setDate(weekStart.getDate() + w * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const weekEntries = planets.reduce((sum, planet) => 
      sum + store[planet].filter((e: any) => 
        e.createdAt >= weekStart.getTime() && e.createdAt < weekEnd.getTime()
      ).length
    , 0)

    weeklyData.push({
      date: `第${w + 1}周`,
      value: weekEntries,
    })
  }

  const insights = detectPatterns()
  const growthAreas = insights
    .filter((i) => i.type === 'growth')
    .map((i) => i.title)

  const recommendedFocus = moodAverage < 3 
    ? '情绪照顾' 
    : topPlanet?.planet === 'mercury' 
      ? '行动落地' 
      : '持续探索'

  return {
    month: now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
    overview: {
      totalEntries,
      moodAverage,
      streak: taskStore.totalStreak,
      topPlanet: topPlanet ? PLANET_NAMES[topPlanet.planet] : '暂无',
      achievements: [],
    },
    weeklyData,
    insights,
    growthAreas,
    recommendedFocus,
  }
}

export function getTodayInsights(): string {
  const store = useCosmicStore.getState()
  const taskStore = useTaskStore.getState()
  
  const todayStr = new Date().toISOString().slice(0, 10)
  const todayEntries = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun']
    .reduce((sum, planet) => 
      sum + store[planet].filter((e: any) => formatDate(e.createdAt) === todayStr).length
    , 0)

  const todayTasks = taskStore.dailyTasks.filter((t) => t.date === todayStr)
  const completedTasks = todayTasks.filter((t) => t.completed).length

  if (todayEntries === 0 && completedTasks === 0) {
    return '今天还没开始记录呢。要不要从一条思绪开始？'
  }
  
  if (completedTasks === todayTasks.length && todayTasks.length > 0) {
    return '今天的任务都完成啦！你真棒 🌟'
  }

  const remaining = todayTasks.length - completedTasks
  if (remaining > 0) {
    return `今天完成了 ${completedTasks}/${todayTasks.length} 个任务，还有 ${remaining} 个等你完成`
  }

  if (todayEntries >= 3) {
    return `今天记录了 ${todayEntries} 条星光，你对宇宙的探索很有热情呢 ✨`
  }

  return `今天有一点记录了，继续保持 🌙`
}
