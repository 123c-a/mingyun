import { useCosmicStore } from '../store/cosmicStore'
import { useMemoryStore } from '../store/memoryStore'
import { useTaskStore } from '../store/taskStore'
import { useAgentStore } from '../store/agentStore'

export type ProjectStatus = {
  totalRecords: number
  mostActivePlanet: string | null
  explorationProgress: number
  streak: number
  level: string
  exp: number
  recentActivity: string[]
  untappedFeatures: string[]
  insights: string[]
}

export type CrossModuleInsight = {
  title: string
  description: string
  relatedPlanets: string[]
  action: string
  priority: 'high' | 'medium' | 'low'
}

const PLANET_NAMES: Record<string, string> = {
  mercury: '水星', venus: '金星', earth: '地球', mars: '火星',
  jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星', sun: '太阳'
}

const ALL_FEATURES = [
  { id: 'mercury', name: '思绪整理', planet: '水星', category: '核心' },
  { id: 'venus', name: '情感花园', planet: '金星', category: '核心' },
  { id: 'mars', name: '情绪炼金', planet: '火星', category: '核心' },
  { id: 'jupiter', name: '贵人图谱', planet: '木星', category: '核心' },
  { id: 'saturn', name: '年轮庭', planet: '土星', category: '核心' },
  { id: 'uranus', name: '脱壳模式', planet: '天王星', category: '核心' },
  { id: 'neptune', name: '梦境河', planet: '海王星', category: '核心' },
  { id: 'sun', name: '愿望之光', planet: '太阳', category: '核心' },
  { id: 'combo', name: '组合炼金', category: '进阶' },
  { id: 'oracle', name: '神谕卡', category: '工具' },
  { id: 'breathing', name: '呼吸练习', category: '疗愈' },
  { id: 'chakra', name: '脉轮平衡', category: '疗愈' },
  { id: 'journal', name: '星光日记', category: '工具' },
  { id: 'wish', name: '愿望墙', category: '工具' },
  { id: 'energy', name: '能量追踪', category: '追踪' },
  { id: 'gratitude', name: '感恩花园', category: '疗愈' },
  { id: 'habit', name: '习惯星图', category: '追踪' },
  { id: 'runes', name: '符文占卜', category: '占卜' },
  { id: 'mood', name: '情绪日历', category: '追踪' },
  { id: 'reflection', name: '每日镜鉴', category: '反思' },
  { id: 'shadow', name: '阴影工作', category: '疗愈' },
  { id: 'pattern', name: '模式识别', category: '分析' },
  { id: 'dream', name: '梦的分析', category: '分析' },
  { id: 'transformation', name: '蜕变追踪', category: '追踪' },
  { id: 'numerology', name: '数字命理', category: '占卜' },
  { id: 'iching', name: '易经占卜', category: '占卜' },
  { id: 'sound', name: '声音疗愈', category: '疗愈' },
  { id: 'innerchild', name: '内在小孩', category: '疗愈' },
  { id: 'innersmile', name: '内在微笑', category: '疗愈' },
  { id: 'cordcutting', name: '能量切割', category: '疗愈' },
  { id: 'energycleanse', name: '能量净化', category: '疗愈' },
  { id: 'rainbowbridge', name: '彩虹桥', category: '疗愈' },
  { id: 'cosmicletter', name: '宇宙信', category: '疗愈' },
  { id: 'selflove', name: '自爱练习', category: '疗愈' },
]

export function getProjectStatus(): ProjectStatus {
  const cosmicStore = useCosmicStore.getState()
  const memoryStore = useMemoryStore.getState()
  const taskStore = useTaskStore.getState()
  const agentStore = useAgentStore.getState()

  const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'] as const
  
  const planetCounts = planets.map((p) => ({
    planet: p,
    count: cosmicStore[p].length
  })).filter((p) => p.count > 0)

  const totalRecords = planetCounts.reduce((sum, p) => sum + p.count, 0)
  const mostActive = planetCounts.sort((a, b) => b.count - a.count)[0]
  const exploredPlanets = planetCounts.length
  const explorationProgress = Math.round((exploredPlanets / 9) * 100)

  const recentActivity: string[] = []
  if (taskStore.totalStreak > 0) recentActivity.push(`连续 ${taskStore.totalStreak} 天完成任务`)
  if (memoryStore.memories.length > 0) recentActivity.push(`建立了 ${memoryStore.memories.length} 条记忆`)
  if (mostActive) recentActivity.push(`最活跃：${PLANET_NAMES[mostActive.planet]} (${mostActive.count}条)`)

  const untappedFeatures = ALL_FEATURES.filter((f) => {
    if (f.planet) {
      return cosmicStore[f.id as keyof typeof cosmicStore].length === 0
    }
    return false
  }).slice(0, 3).map((f) => f.name)

  const insights: string[] = []
  if (totalRecords === 0) {
    insights.push('刚开启宇宙之旅，一切从水星开始')
  } else if (totalRecords < 10) {
    insights.push('正在探索宇宙，已开始收集星光')
  } else if (totalRecords < 50) {
    insights.push('宇宙正在慢慢丰富，继续探索')
  } else if (totalRecords < 100) {
    insights.push('星光渐增，宇宙地图正在展开')
  } else {
    insights.push('宇宙日益繁荣，星灵见证你的成长')
  }

  return {
    totalRecords,
    mostActivePlanet: mostActive?.planet || null,
    explorationProgress,
    streak: taskStore.totalStreak,
    level: agentStore.level,
    exp: agentStore.exp,
    recentActivity,
    untappedFeatures,
    insights,
  }
}

export function getCrossModuleInsights(): CrossModuleInsight[] {
  const cosmicStore = useCosmicStore.getState()
  const memoryStore = useMemoryStore.getState()
  const insights: CrossModuleInsight[] = []

  const total = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun']
    .reduce((sum, p) => sum + cosmicStore[p as keyof typeof cosmicStore].length, 0)

  if (total >= 20) {
    insights.push({
      title: '宇宙数据已具备规模',
      description: '你积累了足够的星光数据，星灵可以为你进行更深入的分析了',
      relatedPlanets: ['all'],
      action: '让星灵为你生成一份综合报告',
      priority: 'medium',
    })
  }

  if (cosmicStore.mercury.length > 5 && cosmicStore.mars.length === 0) {
    insights.push({
      title: '思绪与情绪的桥梁',
      description: '你在水星记录了很多思绪，但还没有炼化成情绪。也许是时候把一些思绪放进火星炼一炼了',
      relatedPlanets: ['mercury', 'mars'],
      action: '去火星炼化一条思绪',
      priority: 'high',
    })
  }

  if (cosmicStore.mercury.length > 0 && cosmicStore.sun.length === 0) {
    insights.push({
      title: '从思绪到愿望',
      description: '你有很多思绪，但还没有提炼成愿望。也许可以把一个重要的思绪，提炼成太阳的愿望',
      relatedPlanets: ['mercury', 'sun'],
      action: '去太阳提炼一个愿望',
      priority: 'medium',
    })
  }

  if (cosmicStore.jupiter.length > 0 && cosmicStore.saturn.length === 0) {
    insights.push({
      title: '贵人与时间的对话',
      description: '你记录了很多贵人，但他们出现在你生命中的哪些关键时刻呢？去土星画一圈年轮吧',
      relatedPlanets: ['jupiter', 'saturn'],
      action: '去土星记录一个改变你的节点',
      priority: 'low',
    })
  }

  if (cosmicStore.uranus.length > 0 && cosmicStore.neptune.length === 0) {
    insights.push({
      title: '模式与梦境',
      description: '你在天王星发现了一些困住你的模式。去海王星看看，这些模式在你的梦里有没有出现过',
      relatedPlanets: ['uranus', 'neptune'],
      action: '去海王星记录一个梦',
      priority: 'low',
    })
  }

  const importantMemories = memoryStore.getImportantMemories(3)
  if (importantMemories.length > 0) {
    const goalMemory = importantMemories.find((m) => m.type === 'goal')
    if (goalMemory) {
      insights.push({
        title: '目标追踪',
        description: `你提到过"${goalMemory.content.slice(0, 20)}..."。这个目标现在进展如何？`,
        relatedPlanets: ['mercury'],
        action: '更新这个目标的进展',
        priority: 'high',
      })
    }
  }

  if (cosmicStore.venus.length > 3 && cosmicStore.earth.length === 0) {
    insights.push({
      title: '情感与行动',
      description: '你在金星写了很多温柔的话，但还没有在地球落地成行动。也许可以用几何拼搭出一种感受',
      relatedPlanets: ['venus', 'earth'],
      action: '去地球拼一个图形',
      priority: 'low',
    })
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

export function getFeatureRecommendations(): { category: string; features: { name: string; reason: string; path: string }[] }[] {
  const cosmicStore = useCosmicStore.getState()
  const recommendations: { category: string; features: { name: string; reason: string; path: string }[] }[] = []

  if (cosmicStore.mercury.length > 0 && cosmicStore.mars.length === 0) {
    recommendations.push({
      category: '情绪探索',
      features: [
        { name: '火星情绪炼金', reason: '把水星的思绪炼化成情绪力量', path: '/mars' },
        { name: '神谕卡', reason: '看看宇宙今天想告诉你什么', path: '/oracle-cards' },
      ],
    })
  }

  if (cosmicStore.venus.length === 0) {
    recommendations.push({
      category: '温柔练习',
      features: [
        { name: '金星情感花园', reason: '学习温柔地对待自己和他人', path: '/venus' },
        { name: '自爱练习', reason: '建立健康的自我关系', path: '/self-love' },
      ],
    })
  }

  if (cosmicStore.jupiter.length > 0) {
    recommendations.push({
      category: '贵人连接',
      features: [
        { name: '贵人图谱', reason: '看看那些照亮你的人', path: '/jupiter' },
        { name: '土星年轮', reason: '记录改变你的那些节点', path: '/saturn' },
      ],
    })
  }

  if (cosmicStore.neptune.length > 0) {
    recommendations.push({
      category: '深度探索',
      features: [
        { name: '梦境分析', reason: '探索你的潜意识语言', path: '/dream' },
        { name: '内在小孩', reason: '连接童年的自己', path: '/inner-child' },
      ],
    })
  }

  recommendations.push({
    category: '日常练习',
    features: [
      { name: '呼吸练习', reason: '每天5分钟，找回平静', path: '/breathing' },
      { name: '每日镜鉴', reason: '问自己一个好问题', path: '/reflection' },
    ],
  })

  return recommendations
}

export function generateCosmicNarrative(): string {
  const status = getProjectStatus()
  const insights = getCrossModuleInsights()
  
  let narrative = ''

  if (status.totalRecords === 0) {
    narrative = `在这片宇宙中，你刚刚睁开眼睛。✨

每一颗行星都等着你去探索，每一条记录都会成为你的星光。

建议从水星开始——那里是思绪的港湾，先把脑子里现在在想的一句话写下来。`
  } else {
    const parts: string[] = []

    parts.push(`你的宇宙正在生长。`)

    if (status.mostActivePlanet) {
      parts.push(`目前最活跃的是${PLANET_NAMES[status.mostActivePlanet]}，你已经在这里留下了${status.totalRecords}条星光。`)
    }

    if (status.explorationProgress > 50) {
      parts.push(`你已经探索了${status.explorationProgress}%的宇宙地图。`)
    } else if (status.explorationProgress < 30) {
      const unexplored = 9 - Math.round(status.explorationProgress * 9 / 100)
      parts.push(`还有${unexplored}颗行星等待你去探索。`)
    }

    if (status.streak > 0) {
      parts.push(`你已经连续${status.streak}天完成每日任务，真棒！`)
    }

    if (insights.length > 0) {
      parts.push(`\n${insights[0].description}`)
    }
  }

  return narrative
}

export function executeProjectAction(action: string, params?: any): { success: boolean; message: string; navigateTo?: string } {
  switch (action) {
    case 'navigate':
      return { success: true, message: '导航', navigateTo: params?.path }
    
    case 'create_memory':
      useMemoryStore.getState().addMemory({
        type: params?.type || 'insight',
        content: params?.content,
        importance: params?.importance || 3,
        tags: params?.tags || [],
        source: 'agent',
      })
      return { success: true, message: '已保存到记忆宫殿' }
    
    case 'create_task':
      const taskId = useTaskStore.getState().addTask({
        title: params?.title,
        description: params?.description,
        category: params?.category || 'custom',
        priority: params?.priority || 'medium',
        status: 'pending',
        subTasks: [],
      })
      return { success: true, message: `已创建任务：${params?.title}` }
    
    case 'add_note':
      const cosmicStore = useCosmicStore.getState()
      const planet = params?.planet
      const text = params?.text
      if (planet && text) {
        switch (planet) {
          case 'mercury': cosmicStore.addMercury({ text, tag: '思绪' }); break
          case 'mars': cosmicStore.addMars({ text, emotion: '混合' }); break
          case 'venus': cosmicStore.addVenus({ kind: 'letter', text }); break
          case 'jupiter': cosmicStore.addJupiter({ name: '未命名', story: text }); break
          case 'saturn': cosmicStore.addSaturn({ year: new Date().getFullYear().toString(), text }); break
          case 'neptune': cosmicStore.addNeptune({ text }); break
          case 'sun': cosmicStore.addSun({ text }); break
        }
        return { success: true, message: `已记录到${PLANET_NAMES[planet] || planet}` }
      }
      return { success: false, message: '参数不完整' }
    
    default:
      return { success: false, message: '未知操作' }
  }
}
