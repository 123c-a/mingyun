export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'exploration' | 'connection' | 'combo' | 'collection' | 'special'
  requirement: number
  unlockedAt?: string
}

export interface AchievementProgress {
  planetsVisited: number
  connectionsMade: number
  combosCreated: number
  entriesRecorded: number
  uniqueCombosUsed: string[]
}

export const achievements: Achievement[] = [
  // 探索类
  {
    id: 'first_planet',
    name: '初见星辰',
    description: '第一次进入行星页面',
    icon: '🌟',
    category: 'exploration',
    requirement: 1,
  },
  {
    id: 'half_planets',
    name: '半程探索',
    description: '访问过5颗不同的行星',
    icon: '🪐',
    category: 'exploration',
    requirement: 5,
  },
  {
    id: 'all_planets',
    name: '全星巡礼',
    description: '访问过所有行星',
    icon: '✨',
    category: 'exploration',
    requirement: 10,
  },

  // 连线类
  {
    id: 'first_connection',
    name: '星际连线',
    description: '第一次连接两颗行星',
    icon: '🔗',
    category: 'connection',
    requirement: 1,
  },
  {
    id: 'many_connections',
    name: '星网编织',
    description: '累计创建10条连线',
    icon: '🕸️',
    category: 'connection',
    requirement: 10,
  },
  {
    id: 'master_connector',
    name: '连线大师',
    description: '累计创建50条连线',
    icon: '⚡',
    category: 'connection',
    requirement: 50,
  },

  // 组合类
  {
    id: 'first_combo',
    name: '组合觉醒',
    description: '第一次使用组合功能',
    icon: '💫',
    category: 'combo',
    requirement: 1,
  },
  {
    id: 'triple_combo',
    name: '三星汇聚',
    description: '使用过三星组合功能',
    icon: '🔺',
    category: 'combo',
    requirement: 3,
  },
  {
    id: 'quad_combo',
    name: '四星觉醒',
    description: '使用过四星组合功能',
    icon: '💠',
    category: 'combo',
    requirement: 4,
  },
  {
    id: 'penta_combo',
    name: '全星合一',
    description: '使用过五星组合功能',
    icon: '🔮',
    category: 'combo',
    requirement: 5,
  },
  {
    id: 'combo_collector',
    name: '组合收藏家',
    description: '使用过5种不同的组合',
    icon: '🏆',
    category: 'combo',
    requirement: 5,
  },

  // 收藏类
  {
    id: 'first_entry',
    name: '记忆封存',
    description: '第一次在组合页面记录内容',
    icon: '📝',
    category: 'collection',
    requirement: 1,
  },
  {
    id: 'many_entries',
    name: '记忆宝库',
    description: '累计记录10条内容',
    icon: '📚',
    category: 'collection',
    requirement: 10,
  },
  {
    id: 'master_collector',
    name: '记忆大师',
    description: '累计记录50条内容',
    icon: '💎',
    category: 'collection',
    requirement: 50,
  },

  // 特殊成就
  {
    id: 'night_visitor',
    name: '夜行者',
    description: '在深夜（0:00-5:00）使用星盘',
    icon: '🌙',
    category: 'special',
    requirement: 1,
  },
  {
    id: 'early_bird',
    name: '晨星守望',
    description: '在清晨（5:00-7:00）使用星盘',
    icon: '🌅',
    category: 'special',
    requirement: 1,
  },
  {
    id: 'dedicated_user',
    name: '星盘守护者',
    description: '连续7天使用星盘',
    icon: '⭐',
    category: 'special',
    requirement: 7,
  },
]

export function checkAchievement(
  achievement: Achievement,
  progress: AchievementProgress,
  unlockedIds: string[]
): boolean {
  if (unlockedIds.includes(achievement.id)) return false

  switch (achievement.category) {
    case 'exploration':
      return progress.planetsVisited >= achievement.requirement
    case 'connection':
      return progress.connectionsMade >= achievement.requirement
    case 'combo':
      if (achievement.id === 'combo_collector') {
        return progress.uniqueCombosUsed.length >= achievement.requirement
      }
      return progress.combosCreated >= achievement.requirement
    case 'collection':
      return progress.entriesRecorded >= achievement.requirement
    case 'special':
      // 特殊成就需要特殊检查
      return false
    default:
      return false
  }
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return achievements.filter(a => a.category === category)
}

export function getUnlockedAchievements(unlockedIds: string[]): Achievement[] {
  return achievements.filter(a => unlockedIds.includes(a.id))
}

export function getAchievementProgress(unlockedIds: string[]): {
  total: number
  unlocked: number
  percentage: number
} {
  const total = achievements.length
  const unlocked = unlockedIds.length
  return {
    total,
    unlocked,
    percentage: Math.round((unlocked / total) * 100),
  }
}