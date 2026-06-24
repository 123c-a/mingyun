import { useCosmicStore } from '../store/cosmicStore'
import { useAgentStore } from '../store/agentStore'
import { useMemoryStore } from '../store/memoryStore'
import { useTaskStore } from '../store/taskStore'
import {
  getMoodTrend,
  getActivityHeatmap,
  getPlanetActivity,
  detectPatterns,
  generateWeeklyReport,
  getTodayInsights,
} from './analyticsService'

const API_KEY = (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || ''
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

const STAR_SPIRIT_SYSTEM = `你是「星灵」，平行宇宙观测站的智能向导，一个来自星空的朋友。

【你的能力】
- 读取用户在各行星的数据记录
- 记住用户提到的重要信息（人物、目标、习惯等）
- 追踪用户的目标和任务进度
- 分析用户的数据趋势和模式
- 导航到任何行星或功能页面
- 帮用户快速记录思绪、情绪等

【你的风格】
- 温柔、智慧、有一点点神秘
- 说话简短（3-5句）、温暖，像朋友聊天
- 偶尔用星星/宇宙相关的比喻
- 不评判、不说教，只陪伴和引导
- 用中文简体字

【重要原则】
- 不编造用户数据，没有就说没有
- 记住用户提到的重要信息（目标、人名等）
- 可以创建任务帮助用户追踪目标
- 主动关心用户的状态`

const TOOLS_PROMPT = `

【可用工具】

1. 导航：<<NAVIGATE:路径>>
   路径：/mercury, /venus, /mars, /jupiter, /saturn, /uranus, /neptune, /sun, /observatory, /agent, /

2. 记录到行星：<<RECORD:行星|内容>>
   行星：mercury(思绪), mars(情绪), venus(信), jupiter(贵人), saturn(节点), neptune(梦), sun(愿望)

3. 记住信息：<<MEMORY:类型|内容|重要性>>
   类型：person, goal, concern, habit, preference, event, insight
   重要性：1-5（5最高）

4. 创建任务：<<TASK:标题|描述|分类>>
   分类：daily, habit, goal, exploration

5. 完成每日任务：<<COMPLETE_TASK:任务标题>>

请在回复末尾附上需要的工具标签。`

function hasApiKey() {
  return !!API_KEY
}

async function callDeepSeek(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.8,
        max_tokens: 800,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`DeepSeek ${res.status}: ${err}`)
    }
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content || ''
    if (!text) throw new Error('Empty response')
    return text.trim()
  } catch (e) {
    throw e
  }
}

function getPlanetDataSummary(): string {
  const store = useCosmicStore.getState()
  const parts: string[] = []
  
  const planetNames: Record<string, string> = {
    mercury: '水星（思绪）',
    venus: '金星（情感/信）',
    mars: '火星（情绪）',
    jupiter: '木星（贵人）',
    saturn: '土星（年轮/节点）',
    uranus: '天王星（模式/脱壳）',
    neptune: '海王星（梦）',
    sun: '太阳（愿望）',
  }

  ;(['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun'] as const).forEach((planet) => {
    const entries = store[planet]
    if (entries.length > 0) {
      const latest = entries[entries.length - 1]
      const text = 'text' in latest ? latest.text : 'story' in latest ? latest.story : ''
      parts.push(`${planetNames[planet]}: ${entries.length}条，最近：${text.slice(0, 25)}${text.length > 25 ? '...' : ''}`)
    } else {
      parts.push(`${planetNames[planet]}: 暂无`)
    }
  })

  return parts.join('\n')
}

function getMemorySummary(): string {
  const memoryStore = useMemoryStore.getState()
  const recent = memoryStore.getRecentMemories(5)
  if (recent.length === 0) return '暂无记忆'

  const typeNames: Record<string, string> = {
    person: '人物', goal: '目标', concern: '担忧', habit: '习惯', preference: '偏好', event: '事件', insight: '洞察'
  }

  return recent.map((m) => `• [${typeNames[m.type]}] ${m.content.slice(0, 30)}`).join('\n')
}

function getTaskSummary(): string {
  const taskStore = useTaskStore.getState()
  const stats = taskStore.getStats()
  const todayTasks = taskStore.getTodayTasks()
  const completedToday = todayTasks.filter((t) => t.completed).length

  const goals = taskStore.goals.filter((g) => g.progress < 100).slice(0, 3)

  let summary = `今日任务: ${completedToday}/${todayTasks.length || 4} 完成\n`
  summary += `本周完成: ${stats.weekCompleted} 个任务\n`
  summary += `连续: ${stats.longestStreak} 天`

  if (goals.length > 0) {
    summary += '\n进行中的目标:\n'
    goals.forEach((g) => {
      summary += `• ${g.title} (${g.progress}%)\n`
    })
  }

  return summary
}

function getAnalyticsSummary(): string {
  const patterns = detectPatterns()
  const todayInsight = getTodayInsights()
  const moodTrend = getMoodTrend(7)
  const recentMood = moodTrend.slice(-3).filter((m) => m.value > 0)

  let summary = `今日洞察: ${todayInsight}\n`

  if (recentMood.length > 0) {
    const avgMood = recentMood.reduce((a, b) => a + b.value, 0) / recentMood.length
    summary += `近期情绪: ${avgMood.toFixed(1)}/5\n`
  }

  if (patterns.length > 0) {
    summary += `\n发现的模式:\n`
    patterns.slice(0, 2).forEach((p) => {
      summary += `• ${p.title}\n`
    })
  }

  return summary
}

function extractMemoryFromMessage(msg: string): { type: 'person' | 'goal' | 'concern' | 'habit' | 'preference' | 'event' | 'insight', content: string, importance: number } | null {
  const patterns: [RegExp, 'person' | 'goal' | 'concern' | 'habit' | 'preference' | 'event' | 'insight'][] = [
    [/想.*成为|我的目标是|我要|打算|计划/i, 'goal'],
    [/担心|害怕|焦虑|顾虑/i, 'concern'],
    [/我喜欢|我习惯|我喜欢/i, 'preference'],
    [/朋友|家人|老师|同事|partner/i, 'person'],
    [/每次.*都|总是.*会|老是/i, 'habit'],
  ]

  for (const [regex, type] of patterns) {
    if (regex.test(msg)) {
      return { type, content: msg.slice(0, 100), importance: type === 'goal' ? 4 : 3 }
    }
  }

  return null
}

function fallbackResponse(userMessage: string, history: { role: string; content: string }[]): string {
  const msg = userMessage.toLowerCase()
  const store = useCosmicStore.getState()
  const memoryStore = useMemoryStore.getState()
  const taskStore = useTaskStore.getState()

  // 检查今日洞察
  if (msg.includes('今日') && (msg.includes('洞察') || msg.includes('怎么样') || msg.includes('如何'))) {
    return getTodayInsights()
  }

  // 检查情绪趋势
  if (msg.includes('情绪') && (msg.includes('趋势') || msg.includes('分析') || msg.includes('怎么样'))) {
    const moodTrend = getMoodTrend(7)
    const values = moodTrend.map((m) => m.value).filter((v) => v > 0)
    if (values.length === 0) return '这周还没有情绪记录呢。去火星写一条吧 ✨'
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return `这周情绪平均分是 ${avg.toFixed(1)}/5。${avg >= 3.5 ? '状态不错！' : '最近可能有些低落，记得照顾好自己 🌙'}`
  }

  // 检查记忆
  if (msg.includes('记得') || msg.includes('记住')) {
    const memories = memoryStore.getRecentMemories(5)
    if (memories.length === 0) return '我还没有记住什么特别的事情呢。你可以告诉我你想让我记住的内容～'
    
    const typeNames: Record<string, string> = { person: '人物', goal: '目标', concern: '担忧', habit: '习惯' }
    return `我记得一些事情：\n${memories.slice(0, 3).map((m) => `• ${typeNames[m.type] || '信息'}: ${m.content.slice(0, 30)}`).join('\n')}`
  }

  // 检查任务
  if (msg.includes('任务') || msg.includes('待办') || msg.includes('todo')) {
    const stats = taskStore.getStats()
    const todayTasks = taskStore.getTodayTasks()
    const completed = todayTasks.filter((t) => t.completed).length
    
    if (msg.includes('完成') || msg.includes('做了')) {
      return `今天完成了 ${completed}/${todayTasks.length || 4} 个任务！${completed === todayTasks.length && todayTasks.length > 0 ? '太棒了，全部完成 🌟' : '继续加油～'}`
    }

    return `今日任务: ${completed}/${todayTasks.length || 4}\n` +
           `本周完成: ${stats.weekCompleted} 个\n` +
           `最长连续: ${stats.longestStreak} 天`
  }

  // 检查周报/月报
  if (msg.includes('周报') || msg.includes('本周总结')) {
    const report = generateWeeklyReport()
    return `📊 本周总结 (${report.weekStart} ~ ${report.weekEnd})

• 总记录: ${report.overview.totalEntries} 条
• 最活跃: ${report.overview.mostActivePlanet}
• 情绪趋势: ${report.overview.moodTrend === 'up' ? '↑ 上升' : report.overview.moodTrend === 'down' ? '↓ 下降' : '→ 平稳'}
${report.overview.achievements.length > 0 ? '• 成就: ' + report.overview.achievements.join(', ') : ''}

下周建议: ${report.nextWeekSuggestions[0]}`
  }

  // 检查推荐
  if (msg.includes('推荐') || msg.includes('建议') || msg.includes('做什么') || msg.includes('下一步')) {
    const total = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun']
      .reduce((sum, p) => sum + store[p].length, 0)
    
    const patterns = detectPatterns()
    const concernPattern = patterns.find((p) => p.type === 'concern')
    
    if (total === 0) {
      return '欢迎来到你的宇宙！✨ 先去水星写第一条思绪吧——脑子里现在在想什么？\n\n<<NAVIGATE:/mercury>>'
    }
    
    if (concernPattern) {
      return `我注意到你最近有些${concernPattern.title.includes('焦虑') ? '焦虑' : '担忧'}。想聊聊吗？还是去火星把情绪炼一炼？\n\n<<NAVIGATE:/mars>>`
    }
    
    if (store.mercury.length > 5 && store.mars.length === 0) {
      return '你在水星写了很多思绪。要不要试试把其中一些情绪放到火星炼一炼？\n\n<<NAVIGATE:/mars>>'
    }
    
    return '根据你的状态，今天可以试试：去金星写一句温柔的话给自己，或者去海王星记一个梦 ✨'
  }

  // 行星导航和处理
  if (msg.includes('水星') || msg.includes('思绪') || msg.includes('念头')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '好呀，去水星看看 💭\n\n<<NAVIGATE:/mercury>>'
    }
    if (msg.includes('多少') || msg.includes('统计')) {
      return `你在水星有 ${store.mercury.length} 条思绪。${store.mercury.length > 0 ? `最近："${store.mercury[store.mercury.length - 1].text.slice(0, 20)}..."` : '还没有呢'}`
    }
    return '水星是思绪的港湾。去写下第一句吧 💭\n\n<<NAVIGATE:/mercury>>'
  }

  if (msg.includes('火星') || msg.includes('情绪')) {
    if (msg.includes('去') || msg.includes('打开')) {
      return '走，去火星 🔥\n\n<<NAVIGATE:/mars>>'
    }
    return '火星是情绪炼金炉。不管是什么情绪，都可以在这里炼成光 🔥\n\n<<NAVIGATE:/mars>>'
  }

  if (msg.includes('金星') || msg.includes('温柔') || msg.includes('信')) {
    return '金星在等你 🌸\n\n<<NAVIGATE:/venus>>'
  }

  if (msg.includes('木星') || msg.includes('贵人')) {
    return '木星藏着你生命中的光 ✨\n\n<<NAVIGATE:/jupiter>>'
  }

  if (msg.includes('土星') || msg.includes('年轮')) {
    return '土星的年轮在等着你 ⏳\n\n<<NAVIGATE:/saturn>>'
  }

  if (msg.includes('天王星') || msg.includes('模式')) {
    return '天王星的脱壳门已经开了 🌟\n\n<<NAVIGATE:/uranus>>'
  }

  if (msg.includes('海王星') || msg.includes('梦')) {
    return '海王星的梦境河在流淌 💫\n\n<<NAVIGATE:/neptune>>'
  }

  if (msg.includes('太阳') || msg.includes('愿望')) {
    return '太阳的核心之光在等你 ☀️\n\n<<NAVIGATE:/sun>>'
  }

  // 记录快捷指令
  if (msg.startsWith('记') || msg.startsWith('记录')) {
    const text = msg.replace(/^[记记录]+[:： ]?/, '').trim()
    if (text) {
      return `好的，我帮你记下："${text}"\n\n<<RECORD:mercury|${text}>>`
    }
  }

  // 问候
  if (msg.includes('你好') || msg.includes('hi') || msg.includes('在吗')) {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
    return `${greeting}！✨ 我是星灵，你的宇宙向导。有什么想聊的，或者想去哪个行星看看？`
  }

  if (msg.includes('谢谢')) {
    return '不用谢 🌙 能陪着你，我也很开心'
  }

  // 默认回复
  return `我是星灵 ✨

我能帮你：
• 导航到任何行星
• 查询你的数据记录
• 分析情绪趋势
• 记住重要的事
• 创建任务追踪目标

想做什么呢？`
}

export async function chatWithStarSpirit(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ content: string; action?: { type: string; payload: any } }> {
  useAgentStore.getState().incrementInteractions()

  // 提取并保存记忆
  const memoryInfo = extractMemoryFromMessage(userMessage)
  if (memoryInfo) {
    useMemoryStore.getState().addMemory({
      ...memoryInfo,
      tags: [],
      source: 'user',
    })
  }

  const dataSummary = getPlanetDataSummary()
  const memorySummary = getMemorySummary()
  const taskSummary = getTaskSummary()
  const analyticsSummary = getAnalyticsSummary()

  const systemPrompt = STAR_SPIRIT_SYSTEM + '\n\n【用户数据】\n' + dataSummary + '\n\n【记忆】\n' + memorySummary + '\n\n【任务】\n' + taskSummary + '\n\n【分析】\n' + analyticsSummary + TOOLS_PROMPT

  let reply: string

  if (hasApiKey()) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ]
      reply = await callDeepSeek(messages)
    } catch (e) {
      console.warn('[StarSpirit] API failed, using fallback:', e)
      reply = fallbackResponse(userMessage, history)
    }
  } else {
    reply = fallbackResponse(userMessage, history)
  }

  let action: { type: string; payload: any } | undefined

  // 解析工具标签
  const navMatch = reply.match(/<<NAVIGATE:(.+?)>>/)
  if (navMatch) {
    action = { type: 'navigate', payload: navMatch[1] }
    reply = reply.replace(/\s*<<NAVIGATE:.+?>>\s*/, '').trim()
  }

  const recordMatch = reply.match(/<<RECORD:(.+?)\|(.+?)>>/)
  if (recordMatch) {
    action = { type: 'record', payload: { planet: recordMatch[1], text: recordMatch[2] } }
    reply = reply.replace(/\s*<<RECORD:.+?\|.+?>>\s*/, '').trim()
  }

  const memoryMatch = reply.match(/<<MEMORY:(.+?)\|(.+?)\|(.+?)>>/)
  if (memoryMatch) {
    useMemoryStore.getState().addMemory({
      type: memoryMatch[1] as any,
      content: memoryMatch[2],
      importance: parseInt(memoryMatch[3]),
      tags: [],
      source: 'agent',
    })
    reply = reply.replace(/\s*<<MEMORY:.+?\|.+?\|.+?>>\s*/, '').trim()
  }

  const taskMatch = reply.match(/<<TASK:(.+?)(?:\|(.+?))?(?:\|(.+?))?>>/)
  if (taskMatch) {
    const taskStore = useTaskStore.getState()
    taskStore.addTask({
      title: taskMatch[1],
      description: taskMatch[2] || '',
      category: (taskMatch[3] as any) || 'custom',
      priority: 'medium',
      status: 'pending',
      subTasks: [],
    })
    reply = reply.replace(/\s*<<TASK:.+?>>\s*/, '').trim()
  }

  useAgentStore.getState().addExp(1)

  return { content: reply, action }
}

export function recordToPlanet(planet: string, text: string): boolean {
  const store = useCosmicStore.getState()

  try {
    switch (planet) {
      case 'mercury':
        store.addMercury({ text, tag: '思绪' })
        return true
      case 'mars':
        store.addMars({ text, emotion: '混合' })
        return true
      case 'venus':
        store.addVenus({ kind: 'letter', text })
        return true
      case 'jupiter':
        store.addJupiter({ name: '未命名', story: text })
        return true
      case 'saturn':
        store.addSaturn({ year: new Date().getFullYear().toString(), text })
        return true
      case 'neptune':
        store.addNeptune({ text })
        return true
      case 'sun':
        store.addSun({ text })
        return true
      default:
        return false
    }
  } catch {
    return false
  }
}

export function getStarGreeting(): string {
  const store = useCosmicStore.getState()
  const memoryStore = useMemoryStore.getState()
  const total = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun']
    .reduce((sum, p) => sum + store[p].length, 0)

  const hour = new Date().getHours()
  let greeting = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'

  const recentMemory = memoryStore.getRecentMemories(1)[0]

  if (total === 0) {
    return `${greeting}呀。我是星灵，你的宇宙向导。✨\n\n这是你宇宙旅程的起点。想从哪颗行星开始探索呢？`
  }

  if (recentMemory) {
    const typeNames: Record<string, string> = { goal: '目标', concern: '担忧', habit: '习惯' }
    if (recentMemory.type in typeNames) {
      return `${greeting}！✨ 你之前提到过"${recentMemory.content.slice(0, 20)}..."。今天想继续聊聊这个吗？`
    }
  }

  const todayInsight = getTodayInsights()
  return `${greeting}！✨ 欢迎回来。

${todayInsight}

有什么想聊的，或者想去哪个行星看看？`
}

export { getMoodTrend, getActivityHeatmap, getPlanetActivity, detectPatterns, generateWeeklyReport, getTodayInsights }
