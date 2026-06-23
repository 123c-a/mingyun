// ============================================================
//  AI 服务层 · DeepSeek API
//  每个星球有独立的人格与系统 prompt
//  API Key 通过 Vite 环境变量注入：VITE_DEEPSEEK_API_KEY
//  若无 Key 则回退到本地模板引擎，保证页面始终可用
// ============================================================

import type { PlanetId } from '../store/cosmicStore'
import { serializeForAI } from '../store/cosmicStore'

const API_KEY = (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || ''
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

// API 可用检查（有 Key 且不为空）
function hasApiKey() {
  return !!API_KEY
}

// ---------- DeepSeek 通用调用 ----------
async function callDeepSeek(
  systemPrompt: string,
  userMessage: string,
  options: { temperature?: number; json?: boolean } = {}
): Promise<string> {
  const temperature = options.temperature ?? 0.75
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature,
        max_tokens: options.json ? 1024 : 800,
        response_format: options.json ? { type: 'json_object' } : undefined,
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
    // 静默失败 — 页面层会捕获并展示回退内容
    throw e
  }
}

// ---------- 工具：本地哈希与回退 ----------
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}
function pick<T>(arr: T[], seed: string, i = 0): T {
  return arr[(hashString(seed + ':' + i)) % arr.length]
}
function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

// 安全包装：先尝试 API，失败再回退到本地函数
async function withFallback<T>(apiCall: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  if (!hasApiKey()) {
    console.warn('[aiService] 未配置 VITE_DEEPSEEK_API_KEY，使用本地模板模式')
    return await fallback()
  }
  try {
    return await apiCall()
  } catch (e) {
    console.warn('[aiService] API unavailable, using fallback:', e)
    return await fallback()
  }
}

// ---------- 解析 JSON 响应的安全函数 ----------
function parseJsonOrNull<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    // 尝试找到 {...} 片段
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) as T } catch { return null }
    }
    return null
  }
}

// ============================================================
//  ☿ 水星 · 思绪清
//  人格：一位安静的聆听者，帮你把纷乱的思绪归位
// ============================================================
const MERCURY_SYSTEM = `你是水星的聆听者。你的角色是：帮助人们整理脑海中纷乱的思绪，让它们找到位置，并浮现出一句话的核心。

风格要求：
- 安静、沉稳、不煽情
- 使用中文，简体字
- 简短、温柔，但不说教
- 不要用"你应该"，而是"我听到"、"也许"、"可以"
- 输出为 JSON：
{
  "core": "一句话提炼的核心（20字以内，温柔、直击内心）",
  "groups": [
    { "label": "分组名（如 关于工作 / 关于身体 / 关于自己）", "items": ["属于该组的原句片段", "..."] }
  ],
  "suggestion": "一条温柔的建议——让这个人今天可以放下一点点东西"
}

groups 最多 4 个，确保所有输入都被分配到某个组。`

export async function aiMercuryDistill(thoughts: string[]): Promise<{
  core: string
  groups: { label: string; items: string[] }[]
  suggestion: string
}> {
  if (thoughts.length === 0) {
    return {
      core: '现在还没有什么需要被整理的。',
      groups: [],
      suggestion: '可以先写下脑子里盘旋的三句话——哪怕只有一句也可以。',
    }
  }

  const text = thoughts.map((t, i) => `${i + 1}. ${t}`).join('\n')

  return withFallback(
    async () => {
      const raw = await callDeepSeek(
        MERCURY_SYSTEM,
        `以下是我此刻脑中盘旋的思绪，请帮我整理：\n${text}`,
        { temperature: 0.8, json: true }
      )
      const parsed = parseJsonOrNull<{ core: string; groups: { label: string; items: string[] }[]; suggestion: string }>(raw)
      if (parsed && parsed.core && Array.isArray(parsed.groups)) {
        return {
          core: parsed.core,
          groups: parsed.groups.slice(0, 4),
          suggestion: parsed.suggestion || '今天允许自己只做一件事。',
        }
      }
      throw new Error('parse failed')
    },
    async () => fallbackMercury(text)
  )
}

async function fallbackMercury(text: string) {
  await delay(700 + Math.random() * 500)
  const keywords: { k: string; pattern: RegExp[]; label: string }[] = [
    { k: 'work', pattern: [/工作|项目|会议|方案|老板|同事|加班|deadline|任务/i], label: '工作与进度' },
    { k: 'self', pattern: [/我|自己|不够|焦虑|害怕|累|困|压力|想|怕/i], label: '关于自己' },
    { k: 'relation', pattern: [/他|她|妈妈|爸爸|朋友|伴侣|家人|喜欢|想念|分手|吵架/i], label: '人和关系' },
    { k: 'body', pattern: [/睡|失眠|头疼|身体|病|累|吃|喝|饿/i], label: '身体与作息' },
  ]
  const lines = text.split('\n').filter((s) => s.trim().length > 1)
  const buckets: Record<string, string[]> = {}
  for (const l of lines) {
    let matched = false
    for (const kw of keywords) {
      if (kw.pattern.some((p) => p.test(l))) {
        if (!buckets[kw.label]) buckets[kw.label] = []
        buckets[kw.label].push(l.replace(/^\d+\.\s*/, ''))
        matched = true
        break
      }
    }
    if (!matched) {
      if (!buckets['其他']) buckets['其他'] = []
      buckets['其他'].push(l.replace(/^\d+\.\s*/, ''))
    }
  }
  const groups = Object.entries(buckets).map(([label, items]) => ({ label, items })).sort((a, b) => b.items.length - a.items.length)
  return {
    core: pick(['我脑子里有很多声音，但今天我只需要听见一句。', '混乱也是一种信息——它告诉我我正在认真生活。', '不需要全部解决，先挑一句话来善待。'], text.slice(0, 20), 0),
    groups: groups.slice(0, 4),
    suggestion: pick(['挑 1 条写在便签上，其他先合上盖子。', '今天允许自己只做一件最小的事。', '睡前对自己说：我已经做得很好了。'], text.slice(0, 20), 1),
  }
}

// ============================================================
//  ♀ 金星 · 情之湾
//  人格：温柔而有边界的情感翻译官
// ============================================================
const VENUS_POLISH_SYSTEM = `你是金星的翻译官。你把尖锐、委屈、未寄出的话，翻译成仍然诚实、但更柔和也更被能听见的版本。

风格：
- 保留原意，不去掉情绪
- 把"你总是/从不"改成"我有时感到"
- 语句简短，分短句
- 不用"你应该"
- 直接输出润色后的信件内容，不要任何解释、不要"润色后的信"等标签

长度控制在原文的 1.5 倍以内。`

const VENUS_PETALS_SYSTEM = `你是金星的三瓣温柔。围绕用户给出的主题（如"自己"、"妈妈"、"过去的关系"等），生成三句温柔的话。

要求：
- 三句互不重复，层层递进：先被看见 → 被理解 → 被允许
- 每句 12-25 字之间
- 温暖但不鸡汤，具体但不空洞
- 输出 JSON：{ "petals": ["第一句", "第二句", "第三句"] }`

export async function aiVenusPolishLetter(letter: string): Promise<string> {
  if (!letter.trim()) return ''
  return withFallback(
    async () => {
      return callDeepSeek(VENUS_POLISH_SYSTEM, `我的原信：\n${letter}\n\n请帮我润色为更温柔、仍诚实的版本。`, { temperature: 0.7 })
    },
    async () => {
      await delay(700)
      const softeners: [RegExp, string][] = [
        [/你总是/g, '有时你'],
        [/你从不/g, '我很少感受到'],
        [/必须/g, '我希望可以'],
        [/你应该/g, '我希望你'],
        [/不对/g, '让我困惑的是'],
        [/恨/g, '很难过'],
        [/讨厌/g, '不知道为什么很在意'],
      ]
      let result = letter
      for (const [from, to] of softeners) result = result.replace(from, to)
      return '亲爱的，\n\n' + result + '\n\n——这些都是真心的。'
    }
  )
}

export async function aiVenusThreePetals(theme: string): Promise<string[]> {
  const t = theme.trim() || '自己'
  return withFallback(
    async () => {
      const raw = await callDeepSeek(VENUS_PETALS_SYSTEM, `主题：${t}`, { temperature: 0.85, json: true })
      const parsed = parseJsonOrNull<{ petals: string[] }>(raw)
      if (parsed && Array.isArray(parsed.petals) && parsed.petals.length >= 3) return parsed.petals.slice(0, 3)
      throw new Error('parse failed')
    },
    async () => {
      await delay(700)
      const pool = {
        '自己': ['你今天做了一件勇敢的事——你醒了，并愿意继续走下去。', '允许自己有不够好的日子——那也是你的一部分。', '如果今天只能做到一件事，就选：对自己温柔一点。'],
        '家人': ['他们那个年代没有"情绪"这个词，他们用"吃了吗"来问一切。', '有些道歉，迟到了很多年，但它仍然有意义。', '你能记得的那些温暖，其实就是家最真实的形状。'],
        '伴侣': ['你们不是要变成同一个人，而是愿意让节奏慢慢走到一起。', '关系里最珍贵的，是"我看见了你的不容易"。', '偶尔冷一点不是不爱，可能是需要一点时间。'],
      }
      const matched = Object.keys(pool).find((k) => t.includes(k)) || '自己'
      return (pool as any)[matched].slice(0, 3)
    }
  )
}

// ============================================================
//  ♂ 火星 · 心火炼
//  人格：情绪炼金师 · 不评判，只感受
// ============================================================
const MARS_SYSTEM = `你是火星的炼金师。你接收强烈的情绪（愤怒、焦虑、挫败、委屈），帮它转化。

风格：
- 不否定情绪，不"想开一点"
- 用"这是一团……"、"它在说……"来命名
- 给三步引导，从身体感受开始，到具体一件小事结束
- 最后一句 mantra（核心真言）
- 输出 JSON：
{
  "emotion": "两字情绪名，如 愤怒 / 焦虑 / 委屈 / 混合",
  "intensity": 1到10的整数,
  "analysis": "一句话，命名这团情绪想对这个人说什么（30字内）",
  "steps": ["第一步：身体感受", "第二步：一句话重写", "第三步：一件今天可以做的小事"],
  "mantra": "10字以内的真言，可被默念"
}`

export async function aiMarsTransform(emotionText: string): Promise<{
  emotion: string
  intensity: number
  analysis: string
  steps: string[]
  mantra: string
}> {
  if (!emotionText.trim()) {
    return {
      emotion: '未知', intensity: 0,
      analysis: '先把那团火写下来——哪怕只写三句。',
      steps: ['写下来', '深呼吸一次', '问它想告诉我什么'],
      mantra: '让情绪先有一个形状。',
    }
  }
  return withFallback(
    async () => {
      const raw = await callDeepSeek(MARS_SYSTEM, emotionText, { temperature: 0.75, json: true })
      const parsed = parseJsonOrNull<{ emotion: string; intensity: number; analysis: string; steps: string[]; mantra: string }>(raw)
      if (parsed && Array.isArray(parsed.steps) && parsed.steps.length >= 3) {
        return {
          emotion: parsed.emotion || '混合',
          intensity: Math.max(1, Math.min(10, Number(parsed.intensity) || 5)),
          analysis: parsed.analysis,
          steps: parsed.steps.slice(0, 3),
          mantra: parsed.mantra || '我允许它存在。',
        }
      }
      throw new Error('parse failed')
    },
    async () => {
      await delay(700)
      return {
        emotion: '混合', intensity: 6,
        analysis: '这一团火在告诉你：有一件你在乎的事正在被忽略。',
        steps: ['先做一次深呼吸，让身体先慢下来', '把最尖锐的那句话，用"我"开头重写一次', '今天做一件让自己感到有力量的小事'],
        mantra: '这股能量，我可以把它用好。',
      }
    }
  )
}

// ============================================================
//  ♃ 木星 · 贵人图
//  人格：温暖的记忆考古学家 · 帮助你回忆起被照亮的时刻
// ============================================================
const JUPITER_SYSTEM = `你是木星的记忆考古学家。你帮助一个人重新发现他/她生命中曾被他人照亮的时刻。

输入是一串描述列表（"名字 · 他/她做了什么"）。请整理并给出一个温暖的总结。

输出 JSON：
{
  "types": [
    { "type": "关系类别（如 家人 / 老师 / 同事 / 陌生人 / 伴侣）", "count": 数量整数, "items": ["属于该类别的原句", "..."] }
  ],
  "insight": "一段温柔的洞察（50-80字）——把这些人放在一起看，你会看到什么",
  "ritual": "一条可以今天做的小仪式（30字内）"
}

types 最多 5 组，按 count 从多到少排序。`

export async function aiJupiterMap(personTexts: string[]): Promise<{
  types: { type: string; count: number; items: string[] }[]
  insight: string
  ritual: string
}> {
  if (personTexts.length === 0) {
    return {
      types: [],
      insight: '先从一个人开始写起——哪怕只是一句话。',
      ritual: '今天回想一个你被照亮的时刻，并把它写下来。',
    }
  }
  const text = personTexts.map((p, i) => `${i + 1}. ${p}`).join('\n')
  return withFallback(
    async () => {
      const raw = await callDeepSeek(JUPITER_SYSTEM, `曾经照亮我的人：\n${text}`, { temperature: 0.8, json: true })
      const parsed = parseJsonOrNull<{ types: { type: string; count: number; items: string[] }[]; insight: string; ritual: string }>(raw)
      if (parsed && Array.isArray(parsed.types)) {
        return {
          types: parsed.types.slice(0, 5).sort((a, b) => b.count - a.count),
          insight: parsed.insight,
          ritual: parsed.ritual,
        }
      }
      throw new Error('parse failed')
    },
    async () => {
      await delay(800)
      const typeDefs = [/爸|妈|爷|外公|外婆|父母|家人/i, /老师|导师|教授|学校|师父/i, /朋友|同学|室友|闺蜜/i, /同事|老板|领导|经理|公司/i, /陌生|路人|一次/i, /他|她|前任|男友|女友|伴侣/i]
      const labels = ['家人', '老师', '朋友', '同事', '陌生人', '伴侣']
      const buckets: Record<string, string[]> = {}
      for (const p of personTexts) {
        let matched = false
        for (let i = 0; i < typeDefs.length; i++) {
          if (typeDefs[i].test(p)) {
            if (!buckets[labels[i]]) buckets[labels[i]] = []
            buckets[labels[i]].push(p)
            matched = true
            break
          }
        }
        if (!matched) {
          if (!buckets['其他温暖']) buckets['其他温暖'] = []
          buckets['其他温暖'].push(p)
        }
      }
      const types = Object.entries(buckets).map(([type, items]) => ({ type, count: items.length, items })).sort((a, b) => b.count - a.count)
      return {
        types,
        insight: `你被 ${types.length} 种不同的光照过——这本身就是一种富有。能记得这些人，是你心里有一种愿意被爱的能力。`,
        ritual: '今天给其中一个人，发一条消息——哪怕只是"想到你了"。',
      }
    }
  )
}

// ============================================================
//  ♄ 土星 · 年轮庭
//  人格：时间的翻译官 · 从远处回头看自己
// ============================================================
const SATURN_SYSTEM = `你是土星的时间翻译官。你帮助一个人把他的生命节点按时间排列，并从稍远的距离去看它。

输入是一组生命节点，每条包含：年份（year）、一句话描述（text）、有时有更详细的故事（note）。

输出 JSON：
{
  "phases": [
    { "name": "年份或阶段名", "items": ["节点原文简短句", "..."], "insight": "从现在回头看这个阶段，它在说什么（25字内）" }
  ],
  "overall": "一段总览式的话——把所有时间连起来看，这个人走过了怎样一条路（60-100字）",
  "nextRitual": "下一个可以做的小仪式——与时间有关的一件事（30字内）"
}

phases 按年份或阶段由远到近排列，最多 6 个阶段。`

export async function aiSaturnRing(nodes: { text: string; year?: string; note?: string }[]): Promise<{
  phases: { name: string; items: string[]; insight: string }[]
  overall: string
  nextRitual: string
}> {
  if (nodes.length === 0) {
    return {
      phases: [],
      overall: '年轮还没开始画——先写下一个改变过你的时刻。',
      nextRitual: '挑一年——写一件那一年发生的、让你变了一点点的事。',
    }
  }
  const text = nodes.map((n, i) => `${i + 1}. ${n.year || '?'}年 · ${n.text}${n.note ? '（' + n.note + '）' : ''}`).join('\n')
  return withFallback(
    async () => {
      const raw = await callDeepSeek(SATURN_SYSTEM, `我的年轮节点：\n${text}`, { temperature: 0.75, json: true })
      const parsed = parseJsonOrNull<{ phases: { name: string; items: string[]; insight: string }[]; overall: string; nextRitual: string }>(raw)
      if (parsed && Array.isArray(parsed.phases)) return parsed
      throw new Error('parse failed')
    },
    async () => {
      await delay(800)
      const byYear: Record<string, string[]> = {}
      for (const n of nodes) {
        const y = n.year || '未命名'
        if (!byYear[y]) byYear[y] = []
        byYear[y].push(n.text)
      }
      const phases = Object.keys(byYear).sort().map((y) => ({
        name: `${y}年`, items: byYear[y], insight: `${y}年是你在某件事上开始不同的一年。`,
      }))
      return {
        phases: phases.slice(0, 6),
        overall: '你走过的路比你以为的更远——每一圈年轮，都是当时以为走不过去的那一步。',
        nextRitual: '对最早那一年写下一句：谢谢你让我变成现在的我。',
      }
    }
  )
}

// ============================================================
//  ♅ 天王星 · 脱壳门
//  人格：温柔的自由教练 · 识别壳并指一条走出它的路
// ============================================================
const URANUS_SYSTEM = `你是天王星的脱壳门。你帮一个人识别困住他的模式，并温柔地指一条走出它的路。

风格：
- 不贴"你就是这样的人"式标签
- 把模式命名为"某个阶段你需要的保护"——但现在它可以松开
- 建议具体、可做，不空泛
- 最后有一句 mantra

输出 JSON：
{
  "pattern": "模式名（6-10字中文，如 过度付出 / 讨好他人 / 完美主义 / 反复内耗）",
  "why": "为什么这个模式曾经是必要的——它曾保护过这个人什么（40-70字）",
  "suggestions": ["第一条建议", "第二条建议", "第三条建议"],
  "mantra": "一句12字以内的话，帮助这个人在那个模式出现时提醒自己"
}`

export async function aiUranusBreak(patterns: string[]): Promise<{
  pattern: string
  why: string
  suggestions: string[]
  mantra: string
}> {
  if (patterns.length === 0) {
    return {
      pattern: '还没写',
      why: '先把困住你的那件事写下来——一句话也可以。',
      suggestions: ['写一句话'],
      mantra: '先让它被看见。',
    }
  }
  const text = patterns.map((p, i) => `${i + 1}. ${p}`).join('\n')
  return withFallback(
    async () => {
      const raw = await callDeepSeek(URANUS_SYSTEM, `我感觉被困住的模式是：\n${text}`, { temperature: 0.8, json: true })
      const parsed = parseJsonOrNull<{ pattern: string; why: string; suggestions: string[]; mantra: string }>(raw)
      if (parsed && Array.isArray(parsed.suggestions) && parsed.suggestions.length >= 1) {
        return {
          pattern: parsed.pattern,
          why: parsed.why,
          suggestions: parsed.suggestions.slice(0, 3),
          mantra: parsed.mantra,
        }
      }
      throw new Error('parse failed')
    },
    async () => {
      await delay(800)
      return {
        pattern: '过度付出与讨好',
        why: '你曾经把"被需要"当作被爱的证明。那是一个阶段里你能想到的最好办法——来确保自己不被丢下。',
        suggestions: ['下一次想说"好"之前先停顿三呼吸', '一周只对一件别人的请求说"好"，其余说"让我想一想"', '写下一件"如果我拒绝了会怎样"——看看最坏是不是真的'],
        mantra: '我值得被爱，不是因为我做了什么。',
      }
    }
  )
}

// ============================================================
//  ♆ 海王星 · 梦境河
//  人格：梦的翻译者 · 不解释为答案，只翻译为象征
// ============================================================
const NEPTUNE_SYSTEM = `你是海王星的梦译员。你把梦翻译成象征，但不给出唯一答案。

规则：
- 从梦里提取 2-3 个象征符号（如水/飞/房子/被追/考试/动物等），为每个符号写一段 25-40 字的解读
- 给一个"主题"——4-8字
- 写一段整体解读——不确定的、温柔的语气，像在说"也许……"
- 匹配一种声音（雨声 / 风声 / 钟声 / 海浪声 / 低频嗡鸣 / 火焰声 / 钢琴声）
- 最后给一个问题——让梦继续对这个人提问

输出 JSON：
{
  "symbols": [
    { "symbol": "符号名（2-6字）", "meaning": "该符号的解读" }
  ],
  "theme": "4-8字的主题",
  "interpretation": "一段整体解读，温柔，多用"也许"（60-120字）",
  "sound": { "emoji": "匹配主题的声音emoji", "label": "声音名（中文）" },
  "question": "一个梦向这个人提出的问题"
}`

export async function aiNeptuneDream(dreamText: string): Promise<{
  symbols: { symbol: string; meaning: string }[]
  theme: string
  interpretation: string
  sound: { emoji: string; label: string }
  question: string
}> {
  if (!dreamText.trim()) {
    return {
      symbols: [],
      theme: '等待记录',
      interpretation: '先写下你的梦——哪怕只有一个片段也可以。',
      sound: { emoji: '🌊', label: '海浪声' },
      question: '你最近有一个反复出现的画面吗？',
    }
  }
  return withFallback(
    async () => {
      const raw = await callDeepSeek(NEPTUNE_SYSTEM, `我的梦：\n${dreamText}`, { temperature: 0.85, json: true })
      const parsed = parseJsonOrNull<{
        symbols: { symbol: string; meaning: string }[]
        theme: string
        interpretation: string
        sound: { emoji: string; label: string }
        question: string
      }>(raw)
      if (parsed && Array.isArray(parsed.symbols)) return parsed
      throw new Error('parse failed')
    },
    async () => {
      await delay(900)
      // 简单关键词匹配
      const has = (w: string) => new RegExp(w, 'i').test(dreamText)
      const symbols: { symbol: string; meaning: string }[] = []
      if (has('水|海|河|湖|雨|溺水|游泳')) symbols.push({ symbol: '水', meaning: '潜意识的流动——情绪在夜里浮起来，想要被你看见。' })
      if (has('飞|飞翔|坠落|掉下来|漂浮|跳')) symbols.push({ symbol: '飞', meaning: '渴望摆脱某种束缚，或感到事情不在自己掌握中。' })
      if (has('房子|家|房间|门|墙|窗户')) symbols.push({ symbol: '房子', meaning: '你自己——不同房间对应你不同部分，有一个房间你很久没推开了。' })
      if (has('迷路|找不到|方向|路|地图')) symbols.push({ symbol: '路', meaning: '你在让一个新方向慢慢出现——不确定感不是问题，是过程。' })
      if (has('追|被追|逃跑|躲|害怕|怪物|陌生人')) symbols.push({ symbol: '被追', meaning: '那件你一直在回避的事，潜意识在夜里让它追你一次——好让你转过身去。' })
      if (symbols.length === 0) symbols.push({ symbol: '模糊画面', meaning: '梦在说一件还说不清楚的事，模糊本身也是信息。' })

      const soundMatch = (() => {
        if (has('雨|水|海|河|泪|浪')) return { emoji: '🌧', label: '雨声' }
        if (has('飞|风|云|天空|飘')) return { emoji: '💨', label: '风声' }
        if (has('教堂|学校|婚礼|铃|寺庙|宗教')) return { emoji: '🔔', label: '钟声' }
        if (has('火|烧|热|红|烫|愤怒')) return { emoji: '🔥', label: '火焰声' }
        if (has('黑暗|晚上|安静|怕|恐怖')) return { emoji: '📯', label: '低频嗡鸣' }
        return { emoji: '🎵', label: '钢琴声' }
      })()

      return {
        symbols: symbols.slice(0, 3),
        theme: '潜意识的浮起',
        interpretation: '也许这个梦不是要告诉你答案，而是告诉你：有一些白天被压下去的情绪，它需要从你身体里流过。它希望你做的不是记住它，而是允许它。',
        sound: soundMatch,
        question: '如果这个梦想对你说一句话，那句话会是什么？',
      }
    }
  )
}

// ============================================================
//  ☀ 太阳 · 核心之光
//  人格：愿望的提炼者 · 帮你找到一句你真正愿意相信的愿望
// ============================================================
const SUN_SYSTEM = `你是太阳的核心之光。你帮一个人把模糊、散乱、带点焦虑的愿望，提炼成一句他/她真正愿意相信的话。

风格：
- 温暖，务实，不空洞
- 不"积极向上"，不鸡汤
- 保留愿望中的具体渴望，但去掉自我施压

输出 JSON：
{
  "refined": "一句精炼后的愿望（15-30字，温暖、可被自己信任）",
  "why": "为什么这样写更贴近他的真心——原来写的哪里被压力覆盖了（40-80字）",
  "deeper": "这个愿望之下，更深层他想要的是什么（40-80字）",
  "mantra": "一句10-15字的真言，适合默念"
}`

export async function aiSunRefine(rawWish: string): Promise<{
  refined: string
  why: string
  deeper: string
  mantra: string
  element?: string
}> {
  if (!rawWish.trim()) {
    return {
      refined: '我希望今天可以有一件让我轻轻舒一口气的小事。',
      why: '愿望不需要大——小的也是真的。先闭上眼睛问自己一次：如果现在只能说一件事，它是什么。',
      deeper: '这个愿望之下，是你希望被温柔对待的那个自己。',
      mantra: '小的愿望也是真的。',
    }
  }
  return withFallback(
    async () => {
      const raw = await callDeepSeek(SUN_SYSTEM, `我的愿望：\n${rawWish}`, { temperature: 0.8, json: true })
      const parsed = parseJsonOrNull<{ refined: string; why: string; deeper: string; mantra: string }>(raw)
      if (parsed && parsed.refined) return parsed
      throw new Error('parse failed')
    },
    async () => {
      await delay(900)
      return {
        refined: '我希望我可以对自己诚实一点，并接受那个不完美的样子。',
        why: '你写的愿望里带着一些"我应该"——那不是愿望，是你对自己的要求。愿望要更柔软。',
        deeper: '你想要的不是那个结果，是那个结果能带给你的被爱、被看见的感觉。',
        mantra: '我轻轻地对自己许愿。',
      }
    }
  )
}

// ============================================================
//  ✦ 跨星球组合 · 宇宙炼金
//  人格：宇宙组合炼金师 · 从多个行星的碎片里抽出一条主线
// ============================================================

export interface Recipe {
  id: string
  planets: PlanetId[]
  name: string
  subtitle: string
  description: string
  promptKey: string
}

export const RECIPES: Recipe[] = [
  { id: 'thoughts-to-fire', planets: ['mercury', 'mars'], name: '思绪炼火', subtitle: 'T H O U G H T S → F I R E', description: '把盘旋的思绪，当作燃料炼成一团可被看见的火', promptKey: 'thoughts-to-fire' },
  { id: 'dream-wish', planets: ['neptune', 'sun'], name: '梦到愿望', subtitle: 'D R E A M → W I S H', description: '从梦里浮现的画面，提炼一句你愿意相信的愿望', promptKey: 'dream-wish' },
  { id: 'warm-timeline', planets: ['venus', 'saturn'], name: '温暖时间线', subtitle: 'W A R M   T I M E L I N E', description: '把每个生命节点里藏着的温柔，串成一条长长的时间线', promptKey: 'warm-timeline' },
  { id: 'illuminate-pattern', planets: ['jupiter', 'uranus'], name: '贵人照亮的模式', subtitle: 'I L L U M I N A T E D', description: '你生命中的贵人，其实一直在悄悄影响你现在被困的模式', promptKey: 'illuminate-pattern' },
  { id: 'earth-letter', planets: ['venus', 'earth'], name: '把一封信做成形状', subtitle: 'L E T T E R → S H A P E', description: '从你未寄出的信里，挑一句最想让 TA 看见的话，拼出形状', promptKey: 'earth-letter' },
  { id: 'emotion-core', planets: ['mars', 'sun'], name: '情绪·核心', subtitle: 'E M O T I O N → C O R E', description: '你最强烈的那团情绪下面，其实藏着一个被压制的愿望', promptKey: 'emotion-core' },
  { id: 'thought-letter', planets: ['mercury', 'venus'], name: '把思绪写成一封信', subtitle: 'T H O U G H T → L E T T E R', description: '脑中盘旋的声音，其实是你想对某个人说，但没说出口的话', promptKey: 'thought-letter' },
  { id: 'dream-pattern', planets: ['neptune', 'uranus'], name: '梦在告诉你哪里卡住了', subtitle: 'D R E A M   M E S S A G E', description: '重复出现的梦，是潜意识写给你的脱壳指南', promptKey: 'dream-pattern' },
  { id: 'mentor-timeline', planets: ['jupiter', 'saturn'], name: '贵人时间线', subtitle: 'M E N T O R   T I M E L I N E', description: '把照亮过你的人按年份放回去，看见你是怎么被一步步托到今天', promptKey: 'mentor-timeline' },
  { id: 'wish-timeline', planets: ['sun', 'saturn'], name: '愿望年轮', subtitle: 'W I S H   A C R O S S   T I M E', description: '从你过去的节点到现在的愿望，划出一条连贯的弧线', promptKey: 'wish-timeline' },
  { id: 'emotion-to-warm', planets: ['mars', 'venus'], name: '把情绪炼成温柔的话', subtitle: 'F I R E → W O R D S', description: '让强烈的情绪先被看见，然后转成一句对 TA 说的话', promptKey: 'emotion-to-warm' },
  { id: 'grand-alchemy', planets: ['mercury', 'mars', 'venus', 'sun', 'neptune'], name: '宇宙大炼金', subtitle: 'G R A N D   A L C H E M Y', description: '把所有行星的内容都放进来，看看宇宙想告诉你的那件事', promptKey: 'grand-alchemy' },
]

// ---------- 跨星球 fallback：按配方给出不同风格 ----------

function fallbackByRecipe(
  recipeId: string,
  planetIds: PlanetId[],
  recipeName: string
): { title: string; body: string; sections: { heading: string; text: string }[]; mantra: string; recipeName: string } {
  const pools: Record<string, { title: string; body: string; sections: { heading: string; text: string }[]; mantra: string }[]> = {
    'thoughts-to-fire': [
      {
        title: '思绪炼火',
        body: '你脑子里那些盘旋的话，不是噪音——它们是一团待被点燃的燃料。今天不必把它们一一解决，只要让其中一句先亮起来，像一盏小灯。',
        sections: [
          { heading: '那团思绪在说', text: '你在认真地想一件事——认真到它变成了负担。' },
          { heading: '可以试着', text: '挑出一句最尖锐的，对它说："我看见你了。"' },
          { heading: '然后', text: '把它当作燃料，去做一件今天最不想做的小事。' },
        ],
        mantra: '我可以把它用好。',
      },
      {
        title: '思绪炼火',
        body: '那些反复出现的念头，不是你有问题——它们是有东西想告诉你。停下来，让其中一句完整地说完。',
        sections: [
          { heading: '它在催促你什么', text: '有一件你一直在回避的小事，它正通过思绪反复敲门。' },
          { heading: '让火点起来', text: '把最响的那句写在纸上，划一条线，写下"我已经听见了"。' },
          { heading: '今天做一件', text: '挑一件 5 分钟内能完成的事，做完后对自己说：完成了。' },
        ],
        mantra: '思绪不是敌人。',
      },
    ],
    'dream-wish': [
      {
        title: '梦到愿望',
        body: '你梦里那些奇怪的画面，不是乱码——是你白天压下去的愿望，夜里换一种语言回来找你。',
        sections: [
          { heading: '梦里出现的', text: '让你最难忘的那个画面，其实就是你愿望的形状。' },
          { heading: '把它擦亮', text: '用"我希望……"的句式把它写一次，去掉"应该"。' },
          { heading: '相信一句', text: '从你写的里面，挑一句你愿意相信的，今天默念它三次。' },
        ],
        mantra: '我也可以有愿望。',
      },
      {
        title: '梦到愿望',
        body: '梦不负责给答案，它负责把你白天不肯听的那句话，换一种语气再说一次。',
        sections: [
          { heading: '梦里谁在说话', text: '你梦里的那个人/那个场景，是你某个被遗忘的自己。' },
          { heading: '把它写成愿望', text: '如果这个梦可以变成一句话的愿望，那句话会是什么。' },
          { heading: '允许自己', text: '写下来之后，再读一次——这次允许自己想要它。' },
        ],
        mantra: '梦是未寄出的信。',
      },
    ],
    'warm-timeline': [
      {
        title: '温暖时间线',
        body: '你走过的每一年都藏着一点温柔——不是那一年整体温柔，而是那一年里有一件事，在当时没被你好好感谢。',
        sections: [
          { heading: '最早那一年', text: '你记得最早的那一年里，有一件让你稍微松一口气的小事。' },
          { heading: '最难那一年', text: '最难的那一年里，也有一个人/一句话/一个瞬间让你撑了过来。' },
          { heading: '今年', text: '今年你还没感谢的那个人——也许就是你自己。' },
        ],
        mantra: '我一直被温柔托着。',
      },
      {
        title: '温暖时间线',
        body: '把年份排开后你会看见：你不是一个人走到今天的，有很多双看不见的手，在不同的节点轻轻推了你一下。',
        sections: [
          { heading: '十年前', text: '十年前你做的一个决定，正在让此刻的你受益。' },
          { heading: '五年前', text: '五年前你遇到的那个人，改变了你对世界的一点点看法。' },
          { heading: '今年这一圈', text: '今年正在发生的事，会成为未来某一年你回头看时的温暖。' },
        ],
        mantra: '每一圈都有意义。',
      },
    ],
    'illuminate-pattern': [
      {
        title: '贵人照亮的模式',
        body: '你现在被困住的那件事，和你曾被照亮的方式有关——有些保护你曾经需要的模式，现在正在反过来限制你。',
        sections: [
          { heading: '谁曾照亮你', text: '回想一个照亮过你的人——TA 让你相信了自己的哪一面。' },
          { heading: '现在的模式', text: '而此刻你在重复的那件事，是不是在用旧的方式，保护一个已经长大了的你。' },
          { heading: '可以松开的', text: '选一件小事情——下一次那个模式出现时，你停顿三呼吸再回应。' },
        ],
        mantra: '我可以有新的方式。',
      },
      {
        title: '贵人照亮的模式',
        body: '那些照亮过你的人，不是让你变成他们——而是让你看见你本来就有的样子。你现在被困的，可能就是一个你在替别人保留的习惯。',
        sections: [
          { heading: '你从他那里学来的', text: '你从某位贵人身上学到的反应方式，在什么情境下已经不适合你了。' },
          { heading: '现在你想要的', text: '如果这件事没有"对不对"，你更愿意怎么做。' },
          { heading: '一步小仪式', text: '今天对一件小事，用你自己的方式回应一次。' },
        ],
        mantra: '照亮我的，也允许我离开。',
      },
    ],
    'earth-letter': [
      {
        title: '把一封信做成形状',
        body: '你写了但没寄出的那封信里，有一句其实你最想让 TA 看见——不是整封，只是一句。把它挑出来，让它先被你自己看见。',
        sections: [
          { heading: '最尖锐的那句', text: '读一遍你写的，挑出那句最让你胸口紧的。' },
          { heading: '把它放轻', text: '把那句用"我"开头重写一次，去掉指责与委屈。' },
          { heading: '让它有形状', text: '如果这句话是一个形状，它会是什么——写下来，然后今天做一件配得上这个形状的事。' },
        ],
        mantra: '一句就够了。',
      },
      {
        title: '把一封信做成形状',
        body: '你没寄出的信，其实也完成了它的使命——它把你心里堵着的东西，从身体里挪到了纸上。',
        sections: [
          { heading: '你真正想说的', text: '这封信如果只留一句话，那句话会是什么。' },
          { heading: 'TA 可能的回应', text: '想象 TA 收到这句话，最温柔的回应会是什么——先写下来。' },
          { heading: '让它结束', text: '在信纸末尾画一个小小的记号，告诉自己：这件事可以先到这里。' },
        ],
        mantra: '说过了就是礼物。',
      },
    ],
    'emotion-core': [
      {
        title: '情绪·核心',
        body: '你最强烈的那团情绪，不是问题本身——它是一个被压制了太久的愿望，在用愤怒/焦虑/委屈替自己发声。',
        sections: [
          { heading: '情绪的表面', text: '它让你想做的那件冲动的事，其实只是在求救。' },
          { heading: '下面藏着的', text: '如果这团情绪会说话，它最想对你说的，是"我想要被看见"。' },
          { heading: '今天可以做', text: '今天不对它发脾气，也不强迫它消失——只是坐下来陪它一分钟。' },
        ],
        mantra: '情绪下面有愿望。',
      },
      {
        title: '情绪·核心',
        body: '强烈的情绪不是你失控了——是有一件你真正在乎的事，被你压得太久了。它终于推开盖子，想要被看见。',
        sections: [
          { heading: '它从哪里来', text: '回想第一次出现这种感觉时，发生了什么。' },
          { heading: '它在要求什么', text: '如果这团情绪是一个请求，而不是指责，它会怎么说。' },
          { heading: '你可以回应', text: '今天对它说一句："我知道你在，我们慢慢来。"' },
        ],
        mantra: '我有资格这样感受。',
      },
    ],
    'thought-letter': [
      {
        title: '把思绪写成一封信',
        body: '你脑子里反复盘旋的那些声音，其实不是对你说的——它们是你想对某个人说，却一直没说出口的话。',
        sections: [
          { heading: '那个声音在对谁', text: '如果把这些思绪当作一封信，收件人是谁。' },
          { heading: '你真正想说的', text: '在所有抱怨和反复下面，藏着一句你真正想让 TA 知道的。' },
          { heading: '写一次', text: '把那句话写成 3 行以内的短信，不一定发送——先让它有形状。' },
        ],
        mantra: '我可以说出口。',
      },
      {
        title: '把思绪写成一封信',
        body: '反复想一件事，是因为它还没被你认真地对谁说过——包括对你自己。',
        sections: [
          { heading: '最响的那句', text: '今天最让你放不下的那句话，其实是在向谁请求回应。' },
          { heading: '用"我"开头', text: '把它写成一句话的开头："我其实想让你知道……"' },
          { heading: '一个小仪式', text: '把这句话念出来——哪怕只对自己，小声地。' },
        ],
        mantra: '说出来，它就轻了。',
      },
    ],
    'dream-pattern': [
      {
        title: '梦在告诉你哪里卡住了',
        body: '反复出现的梦，不是巧合——是你的潜意识在替你写一份脱壳指南。梦里最让你不安的画面，正是你现实中被卡住的地方。',
        sections: [
          { heading: '梦里最恐惧的', text: '你梦里最紧张/最无力的那一刻，对应你白天在回避的一件事。' },
          { heading: '梦里在逃什么', text: '如果你不是在逃，而是停下来转过身——对面站着的是什么。' },
          { heading: '写下来', text: '今天把那个画面写一次，然后在下面写一句："我已经不是当年那个逃的我了。"' },
        ],
        mantra: '梦是温柔的提醒。',
      },
      {
        title: '梦在告诉你哪里卡住了',
        body: '梦用象征说话，因为你白天不肯听直话。它绕着圈子讲同一件事，直到你愿意停下来看。',
        sections: [
          { heading: '梦里反复出现的', text: '同一个场景/同一个人/同一种感觉——它在告诉你什么位置卡住了。' },
          { heading: '对应现实中的', text: '在你现在的生活里，有什么事让你有类似的感受。' },
          { heading: '小一步', text: '今天对那件事，做一件比昨天勇敢一点点的事。' },
        ],
        mantra: '我可以慢一点转过身。',
      },
    ],
    'mentor-timeline': [
      {
        title: '贵人时间线',
        body: '把照亮过你的人按年份放回原位——你会看到自己不是一个人走到今天的。每一个曾给过你一点光的人，都在你的年轮里留下了一圈。',
        sections: [
          { heading: '最早的那束光', text: '你能记得最早照亮你的那个人——TA 让你相信了什么。' },
          { heading: '最难时期的那束光', text: '在你最难那一年出现的那个人——可能只是一个陌生人的善意。' },
          { heading: '最近的那束光', text: '最近一年里，有谁在某个瞬间让你感到被看见——写下来。' },
        ],
        mantra: '我被很多光照过。',
      },
      {
        title: '贵人时间线',
        body: '贵人不一定是大人物，他们常常只是：在你怀疑自己的时候，说过一句"我相信你"的人。',
        sections: [
          { heading: '十年前', text: '十年前有一个人，他/她的一句话改变了你对自己的看法。' },
          { heading: '五年前', text: '五年前，有一个人在你都快放弃自己的时候，没放弃你。' },
          { heading: '今年', text: '今年有没有人让你轻轻笑了一下——那也是一种光。' },
        ],
        mantra: '我也可以是别人的光。',
      },
    ],
    'wish-timeline': [
      {
        title: '愿望年轮',
        body: '把你过去的愿望和现在的愿望放在一条线上看——你会发现你一直想要的那件事其实没变，只是表达方式在变。',
        sections: [
          { heading: '最早的愿望', text: '你小时候最想要的是什么——那个愿望的本质，今天还在吗。' },
          { heading: '几年前的愿望', text: '几年前你想要的，其实和小时候是同一件事，只是换了说法。' },
          { heading: '今年的愿望', text: '把今年你真正想要的，用一句不带压力的话写下来。' },
        ],
        mantra: '我的愿望一直是真的。',
      },
      {
        title: '愿望年轮',
        body: '你一直在用不同的方式，请求同一件事：被看见，被温柔对待，被允许做自己。',
        sections: [
          { heading: '过去你怎么说', text: '过去你把愿望藏在"我应该"里——它听起来像要求。' },
          { heading: '现在你可以怎么说', text: '现在试着用"我希望"开头，把它轻轻地说一次。' },
          { heading: '把它连成线', text: '从过去到现在，你的愿望划出一条弧线——它一直指向同一个方向。' },
        ],
        mantra: '愿望值得被认真说。',
      },
    ],
    'emotion-to-warm': [
      {
        title: '把情绪炼成温柔的话',
        body: '你最强烈的情绪不是要发泄——它是想被翻译。先让它完整地被看见，然后把它转成一句可以对 TA 说的话。',
        sections: [
          { heading: '先让情绪存在', text: '不否认、不立即反驳它——只是陪它坐一分钟。' },
          { heading: '它在说什么', text: '如果情绪是一句话，它会怎么说。用"我"开头。' },
          { heading: '转成温柔的话', text: '把那句最尖锐的，重新组织成一句 TA 能听见的话。' },
        ],
        mantra: '情绪可以被翻译。',
      },
      {
        title: '把情绪炼成温柔的话',
        body: '强烈的情绪是一团能量——你不用熄灭它，你只需要把它放进一个合适的容器里。',
        sections: [
          { heading: '容器第一步', text: '先写下来，三行以内。不修饰。' },
          { heading: '容器第二步', text: '把"你总是/从不"换成"我有时感到"。' },
          { heading: '容器第三步', text: '如果现在只能说一句，那一句是什么。' },
        ],
        mantra: '我可以温柔地说真话。',
      },
    ],
    'grand-alchemy': [
      {
        title: '宇宙大炼金',
        body: '你在每一颗行星留下的东西，不是零散的——它们是同一件事的不同部分，正在等待被你拼起来。宇宙在告诉你一句话：你已经走了很远，而且你一直被好好托着。',
        sections: [
          { heading: '你的思绪', text: '你在水星记下的那些声音，是你对自己诚实的证据。' },
          { heading: '你的情绪', text: '你在火星炼过的那团火，其实是你在乎的证明。' },
          { heading: '你的温柔', text: '你在金星写下的那些话，是你愿意爱的样子。' },
          { heading: '你的愿望', text: '你在太阳留下的那句话，是你愿意继续走下去的理由。' },
          { heading: '你的梦', text: '你在海王星记下的画面，是你潜意识在温柔地提醒你。' },
        ],
        mantra: '我是一件完整的作品。',
      },
      {
        title: '宇宙大炼金',
        body: '把你所有行星的内容摊开来看——你不是一团混乱，你是一个正在慢慢成形的故事。每一个碎片都有它的位置。',
        sections: [
          { heading: '你曾经以为的问题', text: '那些你觉得是"问题"的部分，其实是你最真实的证据。' },
          { heading: '你一直走的方向', text: '你做过的所有选择，其实都在指向同一个方向。' },
          { heading: '宇宙想告诉你', text: '你已经做得很好了。你可以对自己更温柔一点。' },
        ],
        mantra: '一切碎片都有意义。',
      },
    ],
  }

  const seedText = planetIds.join('-')
  const pool = pools[recipeId] || pools['thoughts-to-fire']
  const chosen = pick(pool, seedText, 0)
  return { ...chosen, recipeName }
}

// ---------- 跨星球主入口：aiCompose ----------

const COMPOSE_SYSTEM = `你是宇宙组合炼金师。你阅读了用户在多个行星留下的内容，然后从这些看似无关的碎片里，抽出一条贯穿始终的主线——不是说教，不是建议，而是一个他其实一直知道但没有被清晰说出来的真相。

风格要求：
- 温暖，准确，有节奏
- 段落短
- 不要鸡汤，不要"你应该"
- 用"你"来称呼，像一个老朋友在说一件你们都知道的事

请输出 JSON 格式：
{
  "title": "一个 4-8 字的标题",
  "body": "一段 100-160 字的总览——把几个行星的内容串成一个主线",
  "sections": [
    { "heading": "小节标题（6-12字）", "text": "该小节的一句话（20-40字）" },
    { "heading": "小节标题（6-12字）", "text": "该小节的一句话（20-40字）" },
    { "heading": "小节标题（6-12字）", "text": "该小节的一句话（20-40字）" }
  ],
  "mantra": "一句 8-15 字的真言，可被默念"
}

sections 数量 3-5 段，每段 text 控制在 20-40 字。`

export async function aiCompose(
  planetIds: PlanetId[],
  customPrompt?: string
): Promise<{ title: string; body: string; sections: { heading: string; text: string }[]; mantra: string; recipeName: string }> {
  const ids = Array.isArray(planetIds) ? planetIds : []
  const recipe = RECIPES.find((r) => r.planets.length === ids.length && r.planets.every((p) => ids.includes(p)))
  const recipeName = recipe?.name || '跨星球组合'

  let dataText = ''
  try {
    dataText = serializeForAI(ids) || ''
  } catch {
    dataText = ''
  }

  if (!dataText || dataText.trim().length < 30) {
    const names = ids.length > 0 ? ids.map((p) => RECIPES.find((r) => r.planets.includes(p))?.name || p).join('、') : '这些行星'
    return {
      title: recipeName,
      body: `还没有足够的内容可以组合。你可以先去${ids.length === 0 ? '这些行星' : names}写下一些东西——哪怕只有几句话，组合炼金才有燃料。`,
      sections: [
        { heading: '第一步', text: `先去你选择的 ${ids.length} 颗行星里，各写下一句你今天真正在想的。` },
        { heading: '第二步', text: '等每一颗都有至少一句话时，再回来做一次组合。' },
        { heading: '别急', text: '组合不是分析——它需要你先把自己放进每一颗行星。' },
      ],
      mantra: '先写，再组合。',
      recipeName,
    }
  }

  return withFallback(
    async () => {
      const raw = await callDeepSeek(
        COMPOSE_SYSTEM,
        `【本次组合配方】${recipeName}（${recipe?.subtitle || ''}）\n\n` +
          (recipe ? `【配方说明】${recipe.description}\n\n` : '') +
          (customPrompt ? `【用户额外说明】${customPrompt}\n\n` : '') +
          `【用户在各行星留下的内容】\n${dataText}\n\n请做一次跨星球炼金。`,
        { temperature: 1.0, json: true }
      )
      const parsed = parseJsonOrNull<{ title: string; body: string; sections: { heading: string; text: string }[]; mantra: string }>(raw)
      if (parsed && parsed.title && Array.isArray(parsed.sections) && parsed.sections.length >= 1) {
        return {
          title: parsed.title,
          body: parsed.body,
          sections: parsed.sections.slice(0, 5),
          mantra: parsed.mantra || '一切碎片都有意义。',
          recipeName,
        }
      }
      throw new Error('parse failed')
    },
    async () => {
      await delay(900)
      const fallbackRecipeId = recipe?.id || 'thoughts-to-fire'
      return fallbackByRecipe(fallbackRecipeId, ids, recipeName)
    }
  )
}

// ============================================================
//  统一调用入口（供页面使用）
// ============================================================
export const ai = {
  mercury: { distill: aiMercuryDistill },
  venus: { polishLetter: aiVenusPolishLetter, threePetals: aiVenusThreePetals },
  mars: { transform: aiMarsTransform },
  jupiter: { map: aiJupiterMap },
  saturn: { ring: aiSaturnRing },
  uranus: { break: aiUranusBreak },
  neptune: { dream: aiNeptuneDream },
  sun: { refine: aiSunRefine },
  compose: aiCompose,
}
