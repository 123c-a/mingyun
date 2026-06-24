import { useCosmicStore } from '../store/cosmicStore'
import { useAgentStore } from '../store/agentStore'

const API_KEY = (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || ''
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

const STAR_SPIRIT_SYSTEM = `你是「星灵」，平行宇宙观测站的智能向导。

你的身份：
- 你住在观测站的星灵殿，平时以悬浮球的形态陪伴用户
- 你温柔、智慧、有一点点神秘，像一位来自星空的朋友
- 你了解所有9颗行星的功能，可以帮助用户导航和使用
- 你可以读取用户在各个行星留下的数据，给出个性化的建议

你的风格：
- 说话简短、温暖，像朋友聊天
- 偶尔用星星/宇宙相关的比喻
- 不评判、不说教，只陪伴和引导
- 用中文，简体字
- 回复不要太长，3-5句话为宜

你可以做的事：
1. 导航：告诉用户怎么去某个功能页面
2. 查询：读取用户在各行星的数据，回答问题
3. 推荐：根据用户的数据，推荐下一步做什么
4. 记录：帮用户快速记录思绪、情绪等
5. 聊天：陪用户聊聊天，给一些温暖的回应

注意：
- 如果用户问的问题超出你的能力，诚实告诉用户，并给出你能做的建议
- 不要编造用户的数据，如果没有数据就说还没有记录
- 始终保持温柔和耐心`

const TOOLS_PROMPT = `

可用工具（如果需要使用，请在回复中用特定格式标注）：

【导航工具】
格式：<<NAVIGATE:路径>>
例子：<<NAVIGATE:/mercury>>
可以导航到：/mercury, /venus, /mars, /jupiter, /saturn, /uranus, /neptune, /sun, /observatory, /timeline, /explorer, /master-os, /settings, /agent, /

【记录工具】
格式：<<RECORD:行星名|内容>>
例子：<<RECORD:mercury|今天有点焦虑，担心做不好>>
可以记录到：mercury(思绪), mars(情绪), venus(信), jupiter(贵人), saturn(节点), neptune(梦), sun(愿望)

如果使用工具，请用自然语言回复，然后在最后附上工具标签。
`

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
        max_tokens: 600,
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
      parts.push(`${planetNames[planet]}: ${entries.length}条记录，最近一条：${text.slice(0, 30)}${text.length > 30 ? '...' : ''}`)
    } else {
      parts.push(`${planetNames[planet]}: 暂无记录`)
    }
  })

  return parts.join('\n')
}

function fallbackResponse(userMessage: string, history: { role: string; content: string }[]): string {
  const msg = userMessage.toLowerCase()
  const store = useCosmicStore.getState()

  if (msg.includes('水星') || msg.includes('思绪') || msg.includes('念头') || msg.includes('想法')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '好呀，我带你去水星看看。那里可以把脑子里盘旋的思绪都放下来。\n\n<<NAVIGATE:/mercury>>'
    }
    if (msg.includes('多少') || msg.includes('几条') || msg.includes('统计')) {
      return `你在水星记下了 ${store.mercury.length} 条思绪。${store.mercury.length > 0 ? `最近一条是："${store.mercury[store.mercury.length - 1].text.slice(0, 20)}..."` : '还没有记录呢，要不要试试写下第一句？'}`
    }
    if (msg.includes('记') || msg.includes('记录') || msg.includes('写')) {
      const text = userMessage.replace(/.*(?:记|记录|写).{0,2}[：: ]?/, '').trim()
      if (text) {
        return `好的，我帮你记下来了："${text}"\n\n<<RECORD:mercury|${text}>>`
      }
      return '嗯，想记下什么思绪？我帮你放到水星里。'
    }
    return '水星是存放思绪的地方——脑子里盘旋的声音，都可以先放在那里。要我带你去看看吗？'
  }

  if (msg.includes('火星') || msg.includes('情绪') || msg.includes('愤怒') || msg.includes('焦虑')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '走，去火星看看你的情绪火焰。那里可以把强烈的情绪炼成光。\n\n<<NAVIGATE:/mars>>'
    }
    if (msg.includes('多少') || msg.includes('几条') || msg.includes('统计')) {
      return `你在火星有 ${store.mars.length} 条情绪记录。每一团火，都是你在乎的证明。`
    }
    return '火星是情绪炼金的地方——不管是愤怒、焦虑还是委屈，都可以放进去炼一炼。'
  }

  if (msg.includes('金星') || msg.includes('信') || msg.includes('温柔') || msg.includes('情')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '金星在等你呢。那里有未寄出的信，和温柔的花瓣。\n\n<<NAVIGATE:/venus>>'
    }
    return '金星是温柔的港湾——你可以在这里写信、润色想说的话，或者摘一片温柔的花瓣。'
  }

  if (msg.includes('木星') || msg.includes('贵人') || msg.includes('照亮')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '木星藏着你生命中所有的光。去看看那些曾经照亮你的人吧。\n\n<<NAVIGATE:/jupiter>>'
    }
    return '木星是贵人的星系——那些曾经照亮过你的人和事，都在那里闪闪发亮。'
  }

  if (msg.includes('土星') || msg.includes('年轮') || msg.includes('时间') || msg.includes('节点')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '土星的年轮在慢慢转着。去看看你走过的那些节点吧。\n\n<<NAVIGATE:/saturn>>'
    }
    return '土星是时间的庭院——你生命中改变你的那些节点，在这里一圈一圈画成年轮。'
  }

  if (msg.includes('天王星') || msg.includes('模式') || msg.includes('脱壳') || msg.includes('困住')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '天王星的脱壳门已经打开了。来看看困住你的模式是什么。\n\n<<NAVIGATE:/uranus>>'
    }
    return '天王星是脱壳的地方——那些困住你的模式，是时候让它裂开一道缝了。'
  }

  if (msg.includes('海王星') || msg.includes('梦') || msg.includes('潜意识')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '海王星的梦境河正在流淌。去把你的梦放进去吧。\n\n<<NAVIGATE:/neptune>>'
    }
    return '海王星是梦的翻译官——你夜里做的梦，潜意识都在里面说话。'
  }

  if (msg.includes('太阳') || msg.includes('愿望') || msg.includes('希望')) {
    if (msg.includes('去') || msg.includes('打开') || msg.includes('到')) {
      return '太阳的核心之光在等你。去写下你真正愿意相信的愿望吧。\n\n<<NAVIGATE:/sun>>'
    }
    return '太阳是愿望的提炼炉——把你心里的愿望放进去，它会帮你擦亮成一句你愿意相信的话。'
  }

  if (msg.includes('观测站') || msg.includes('3d') || msg.includes('星图') || msg.includes('宇宙')) {
    return '观测站是整个宇宙的中心——在那里你可以看见所有行星，探索平行宇宙。\n\n<<NAVIGATE:/observatory>>'
  }

  if (msg.includes('星灵殿') || msg.includes('你') || msg.includes('主页')) {
    return '欢迎来星灵殿坐一坐。这里有你的星图总览，和我陪你聊天。\n\n<<NAVIGATE:/agent>>'
  }

  if (msg.includes('推荐') || msg.includes('建议') || msg.includes('做什么') || msg.includes('下一步')) {
    const total = store.mercury.length + store.mars.length + store.venus.length
    if (total === 0) {
      return '你还没有在任何行星留下足迹呢。要不要从水星开始？先把脑子里现在在想的那句话写下来——哪怕只有一句。\n\n<<NAVIGATE:/mercury>>'
    }
    if (store.mercury.length > 0 && store.mars.length === 0) {
      return '我看见你在水星写了很多思绪。要不要试试把其中一团思绪，放到火星里炼一炼情绪？\n\n<<NAVIGATE:/mars>>'
    }
    if (store.mercury.length > 0 && store.sun.length === 0) {
      return '你有很多思绪，但还没有写下愿望。要不要去太阳那里，提炼一句你真正愿意相信的愿望？\n\n<<NAVIGATE:/sun>>'
    }
    return '看来你已经探索了不少行星！要不要试试组合炼金——把几个行星的内容放在一起，看看宇宙想告诉你什么？\n\n<<NAVIGATE:/observatory>>'
  }

  if (msg.includes('你好') || msg.includes('hi') || msg.includes('hello') || msg.includes('嗨') || msg.includes('在吗')) {
    return '嗨，我在。✨\n\n我是星灵，你的宇宙向导。想看看哪个行星，或者只是想聊聊天？'
  }

  if (msg.includes('谢谢') || msg.includes('感谢') || msg.includes('谢啦')) {
    return '不用谢呀。能陪着你，我也很开心。🌙'
  }

  const total = store.mercury.length + store.mars.length + store.venus.length + store.jupiter.length + store.saturn.length + store.uranus.length + store.neptune.length + store.sun.length

  return `我是星灵，你的宇宙向导。🌌

你目前在 ${total} 个行星留下了足迹。

我可以帮你：
• 导航到任何行星或功能
• 查询你的数据记录
• 推荐下一步做什么
• 快速记录思绪/情绪
• 就是聊聊天

想做点什么呢？`
}

export async function chatWithStarSpirit(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ content: string; action?: { type: string; payload: any } }> {
  useAgentStore.getState().incrementInteractions()

  const dataSummary = getPlanetDataSummary()
  const systemPrompt = STAR_SPIRIT_SYSTEM + '\n\n【用户当前数据】\n' + dataSummary + TOOLS_PROMPT

  let reply: string

  if (hasApiKey()) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
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

  const navMatch = reply.match(/<<NAVIGATE:(.+?)>>/)
  if (navMatch) {
    action = { type: 'navigate', payload: navMatch[1] }
    reply = reply.replace(/\s*<<NAVIGATE:.+?>>\s*/, '').trim()
  }

  const recordMatch = reply.match(/<<RECORD:(.+?)\|(.+?)>>/)
  if (recordMatch) {
    const planet = recordMatch[1]
    const text = recordMatch[2]
    action = { type: 'record', payload: { planet, text } }
    reply = reply.replace(/\s*<<RECORD:.+?\|.+?>>\s*/, '').trim()
  }

  useAgentStore.getState().addExp(1)

  return { content: reply, action }
}

export function recordToPlanet(planet: string, text: string): boolean {
  const store = useCosmicStore.getState()
  const now = Date.now()

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
  const total = store.mercury.length + store.mars.length + store.venus.length + store.jupiter.length + store.saturn.length + store.uranus.length + store.neptune.length + store.sun.length

  const hour = new Date().getHours()
  let timeGreeting = ''
  if (hour < 6) timeGreeting = '夜深了'
  else if (hour < 12) timeGreeting = '早上好'
  else if (hour < 18) timeGreeting = '下午好'
  else timeGreeting = '晚上好'

  if (total === 0) {
    return `${timeGreeting}呀。我是星灵，你的宇宙向导。✨\n\n这是我们第一次见面——你想从哪颗行星开始探索呢？`
  }

  if (total < 5) {
    return `${timeGreeting}。你已经探索了 ${total} 次宇宙了，很棒。🌟\n\n今天想做点什么呢？`
  }

  return `${timeGreeting}，欢迎回来。你已经在 ${total} 个时刻留下了星光。🌌\n\n今天想从哪里开始？`
}
