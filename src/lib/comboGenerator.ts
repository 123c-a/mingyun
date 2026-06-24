// 种子随机数生成器 - Mulberry32
export function createSeededRandom(seed: number) {
  let t = seed >>> 0
  return function() {
    t = (t + 0x6D2B79F5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// 从字符串生成种子
export function stringToSeed(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// 从数组随机选择
export function pickRandom<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

// 从数组随机选择n个不重复的
export function pickRandomN<T>(rand: () => number, arr: T[], n: number): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, n)
}

// ========== 组合名称生成素材 ==========
const namePrefixes = [
  '星', '月', '梦', '魂', '灵', '道', '境', '界', '光', '影',
  '风', '云', '雨', '雪', '霜', '露', '花', '草', '树', '山',
  '海', '川', '天', '地', '人', '心', '意', '情', '思', '念',
  '玄', '幻', '真', '虚', '空', '无', '有', '生', '灭', '化'
]

const nameSuffixes = [
  '途', '路', '桥', '门', '塔', '殿', '阁', '楼', '台', '庭',
  '域', '界', '境', '园', '林', '海', '湖', '山', '谷', '洞',
  '咒', '术', '法', '阵', '器', '丹', '书', '卷', '谱', '录',
  '歌', '诗', '曲', '舞', '画', '印', '纹', '符', '令', '钥'
]

const nameMiddle = [
  '之', '·', '·', '·', '无', '有', '如', '若', '似', '化',
  '归', '向', '行', '坐', '卧', '起', '落', '升', '降', '转'
]

export function generateComboName(planetIds: string[], seed: number): { name: string; subtitle: string } {
  const rand = createSeededRandom(seed)
  const level = planetIds.length
  
  const prefix = pickRandom(rand, namePrefixes)
  const suffix = pickRandom(rand, nameSuffixes)
  const hasMiddle = rand() > 0.3
  const middle = hasMiddle ? pickRandom(rand, nameMiddle) : ''
  
  const name = `${prefix}${middle}${suffix}`
  
  const planetStr = planetIds.map(p => p.toUpperCase()).join(' × ')
  const subtitleTemplates = [
    `${planetStr} · 神秘星图`,
    `${planetStr} · 宇宙共鸣`,
    `${planetStr} · 命运交织`,
    `${planetStr} · 星辰之约`,
    `${planetStr} · 灵魂回响`,
    `${planetStr} · 时空交汇`,
    `${planetStr} · 能量流动`,
    `${planetStr} · 意识跃迁`,
  ]
  const subtitle = pickRandom(rand, subtitleTemplates)
  
  return { name, subtitle }
}

// ========== 描述生成 ==========
const descTemplates = [
  (planets: string, traits: string) => 
    `当${planets}连线，${traits}汇聚成一股独特的能量。这股能量将带你进入新的意识层次。`,
  (planets: string, traits: string) => 
    `${planets}——${traits}，它们在你的星图中交织，编织出专属于你的生命密码。`,
  (planets: string, traits: string) => 
    `在${planets}的共振中，${traits}找到了彼此的节奏。倾听它们的对话，你会听见内心的答案。`,
  (planets: string, traits: string) => 
    `${planets}形成的星图，揭示了${traits}之间隐藏的联系。发现它，理解它，运用它。`,
  (planets: string, traits: string) => 
    `每一次${planets}的连线，都是宇宙给你的提示。关于${traits}，你还有更多可以探索。`,
  (planets: string, traits: string) => 
    `${planets}的能量正在流动。${traits}——这些面向正在你的生命中逐渐清晰。`,
  (planets: string, traits: string) => 
    `连接${planets}，激活${traits}。这张星图，是你内在宇宙的一面镜子。`,
  (planets: string, traits: string) => 
    `${planets}的组合不多见。${traits}的融合，将为你打开一扇新的门。`,
]

export function generateDescription(
  planetIds: string[], 
  planetNamesMap: Record<string, string>,
  planetTraitsMap: Record<string, string>,
  seed: number
): string {
  const rand = createSeededRandom(seed)
  const template = pickRandom(rand, descTemplates)
  
  const planetStr = planetIds.map(p => planetNamesMap[p] || p).join('、')
  const traits = planetIds.map(p => planetTraitsMap[p] || '').filter(Boolean).join('、')
  
  return template(planetStr, traits)
}

// ========== 高级功能模块 ==========
export interface PlayModule {
  id: string
  name: string
  icon: string
  description: string
  category: 'reflection' | 'creative' | 'meditation' | 'tracking' | 'divination' | 'healing'
  rarity: 'common' | 'rare' | 'legendary'
}

const playModules: PlayModule[] = [
  // 反思类
  { id: 'daily-mirror', name: '每日魔镜', icon: '🪞', description: '与星图能量对话，看见真实的自己', category: 'reflection', rarity: 'common' },
  { id: 'soul-journal', name: '灵魂日记', icon: '📖', description: '写下内心深处的感受与领悟', category: 'reflection', rarity: 'common' },
  { id: 'shadow-work', name: '影子工作', icon: '🎭', description: '拥抱你的阴影面，整合内在碎片', category: 'reflection', rarity: 'rare' },
  { id: 'pattern-finder', name: '模式解密', icon: '🔍', description: '发现生命中的重复模式与课题', category: 'reflection', rarity: 'common' },
  { id: 'deep-question', name: '深度追问', icon: '❓', description: '探索内在深层问题，找到答案', category: 'reflection', rarity: 'common' },
  
  // 创意类
  { id: 'cosmic-letter', name: '宇宙来信', icon: '💌', description: '收到一封来自宇宙的神秘信件', category: 'creative', rarity: 'rare' },
  { id: 'mood-palette', name: '情绪调色板', icon: '🎨', description: '用色彩记录今日情绪能量', category: 'creative', rarity: 'common' },
  { id: 'dream-weaver', name: '织梦者', icon: '🌙', description: '记录梦境，编织潜意识的线索', category: 'creative', rarity: 'rare' },
  { id: 'wish-upon-star', name: '向星许愿', icon: '🌠', description: '把愿望种进星空，看着它成长', category: 'creative', rarity: 'legendary' },
  { id: 'inner-child', name: '内在小孩', icon: '🎪', description: '与内在小孩对话，疗愈童年创伤', category: 'creative', rarity: 'rare' },
  
  // 冥想类
  { id: 'rainbow-bridge', name: '彩虹桥冥想', icon: '🌈', description: '穿越彩虹桥，连接更高维度的自己', category: 'meditation', rarity: 'rare' },
  { id: 'breath-of-life', name: '生命之息', icon: '💨', description: '4-7-8 呼吸法，快速平复情绪', category: 'meditation', rarity: 'common' },
  { id: 'energy-cleanse', name: '能量清理', icon: '⚡', description: '净化你的能量场，释放负面情绪', category: 'meditation', rarity: 'common' },
  { id: 'sound-healing', name: '音声疗愈', icon: '🎵', description: '用频率调音，找回内在和谐', category: 'meditation', rarity: 'legendary' },
  
  // 追踪类
  { id: 'energy-tracker', name: '能量追踪', icon: '📊', description: '记录每日能量状态，发现规律', category: 'tracking', rarity: 'common' },
  { id: 'habit-stars', name: '习惯星图', icon: '⭐', description: '用星星打卡，养成新习惯', category: 'tracking', rarity: 'common' },
  { id: 'gratitude-garden', name: '感恩花园', icon: '💝', description: '每天浇灌感恩，让花园盛开', category: 'tracking', rarity: 'common' },
  { id: 'transformation-journal', name: '蜕变日志', icon: '🦋', description: '记录你的蜕变历程与成长', category: 'tracking', rarity: 'rare' },
  
  // 占卜类
  { id: 'oracle-cards', name: '神谕卡', icon: '🃏', description: '抽取今日神谕，接收宇宙指引', category: 'divination', rarity: 'rare' },
  { id: 'numerology', name: '数字命盘', icon: '🔢', description: '探索今日数字能量与启示', category: 'divination', rarity: 'common' },
  { id: 'rune-reading', name: '如尼符文', icon: 'ᚠ', description: '投掷如尼石，解读古老智慧', category: 'divination', rarity: 'legendary' },
  { id: 'i-ching', name: '易经卦象', icon: '☯️', description: '起卦问事，探寻变化之道', category: 'divination', rarity: 'legendary' },
  
  // 疗愈类
  { id: 'self-love-ritual', name: '自爱仪式', icon: '🌸', description: '设计专属于你的自爱仪式', category: 'healing', rarity: 'rare' },
  { id: 'inner-smile', name: '内在微笑', icon: '😊', description: '用微笑疗愈每一个器官', category: 'healing', rarity: 'common' },
  { id: 'cord-cutting', name: '能量剪线', icon: '✂️', description: '剪断不健康的能量连接', category: 'healing', rarity: 'rare' },
  { id: 'chakra-balance', name: '脉轮平衡', icon: '💫', description: '校准七大脉轮，恢复能量流动', category: 'healing', rarity: 'legendary' },
]

// 一个组合对应一个专属功能
export function generateSingleModule(planetIds: string[], seed: number): PlayModule {
  const rand = createSeededRandom(seed)
  const level = planetIds.length

  // 行星越多，越容易抽到稀有/传说
  const rarityRoll = rand()
  let targetRarity: 'common' | 'rare' | 'legendary'

  if (level >= 5) {
    // 5+星：40%传说，50%稀有，10%普通
    targetRarity = rarityRoll < 0.4 ? 'legendary' : rarityRoll < 0.9 ? 'rare' : 'common'
  } else if (level >= 4) {
    // 4星：25%传说，55%稀有，20%普通
    targetRarity = rarityRoll < 0.25 ? 'legendary' : rarityRoll < 0.8 ? 'rare' : 'common'
  } else if (level >= 3) {
    // 3星：15%传说，45%稀有，40%普通
    targetRarity = rarityRoll < 0.15 ? 'legendary' : rarityRoll < 0.6 ? 'rare' : 'common'
  } else {
    // 2星：5%传说，30%稀有，65%普通
    targetRarity = rarityRoll < 0.05 ? 'legendary' : rarityRoll < 0.35 ? 'rare' : 'common'
  }

  const filtered = playModules.filter(m => m.rarity === targetRarity)
  if (filtered.length === 0) {
    return pickRandom(rand, playModules)
  }
  return pickRandom(rand, filtered)
}

export function generatePlayModules(planetIds: string[], seed: number): PlayModule[] {
  const rand = createSeededRandom(seed)
  const level = planetIds.length
  
  // 根据行星数量决定模块数量：2星=4个，3星=5个，4星=6个，5星+=7个
  const count = Math.min(4 + Math.floor(level / 2), playModules.length)
  
  // 确保每个类别至少有一个模块（如果可能的话）
  const categories = ['reflection', 'creative', 'meditation', 'tracking', 'divination', 'healing']
  const selected: PlayModule[] = []
  
  // 先从每个类别随机选一个
  const shuffledCats = [...categories].sort(() => rand() - 0.5)
  for (const cat of shuffledCats.slice(0, Math.min(count, categories.length))) {
    const catModules = playModules.filter(m => m.category === cat && !selected.includes(m))
    if (catModules.length > 0) {
      selected.push(pickRandom(rand, catModules))
    }
  }
  
  // 再随机选剩下的
  const remaining = playModules.filter(m => !selected.includes(m))
  const extra = pickRandomN(rand, remaining, count - selected.length)
  selected.push(...extra)
  
  // 打乱顺序
  return selected.sort(() => rand() - 0.5)
}

// ========== 智慧语录 ==========
const wisdomStarts = [
  '你已经知道答案了',
  '宇宙一直在回应你',
  '现在就是最好的时机',
  '你的感受是真实的',
  '不必急着做决定',
  '允许自己慢慢来',
  '答案在安静的时候出现',
  '你比想象中更勇敢',
  '一切都在刚刚好的节奏里',
  '信任你的直觉',
]

const wisdomEnds = [
  '只是你还没准备好听见',
  '用你能理解的方式',
  '即使你还没准备好',
  '哪怕它看起来不完美',
  '先感受，再思考',
  '成长有它自己的时间表',
  '让心安静下来',
  '因为你一直在成长',
  '你只需要走下一步',
  '它永远不会骗你',
]

export function generateWisdomQuotes(planetIds: string[], seed: number): string[] {
  const rand = createSeededRandom(seed + 100)
  const count = 3 + Math.floor(rand() * 4)
  const quotes: string[] = []
  
  for (let i = 0; i < count; i++) {
    const start = pickRandom(rand, wisdomStarts)
    const end = pickRandom(rand, wisdomEnds)
    quotes.push(`「${start}，${end}。」`)
  }
  
  return quotes
}

// ========== 主题色生成 ==========
export function generateThemeColors(
  planetIds: string[], 
  planetColorsMap: Record<string, string>,
  seed: number
): { 
  primary: string
  secondary: string 
  accent: string
  bgGradient: string
  glowColor: string
  cardBg: string
  borderColor: string
} {
  const rand = createSeededRandom(seed + 200)
  
  const colors = planetIds.map(p => planetColorsMap[p] || '#8080c0')
  
  const primaryIdx = Math.floor(rand() * colors.length)
  let secondaryIdx = Math.floor(rand() * colors.length)
  while (secondaryIdx === primaryIdx && colors.length > 1) {
    secondaryIdx = Math.floor(rand() * colors.length)
  }
  
  const primary = colors[primaryIdx]
  const secondary = colors[secondaryIdx]
  const accent = colors[Math.floor(rand() * colors.length)]
  
  const bgGradient = `radial-gradient(ellipse at 20% 0%, ${primary}20 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${secondary}20 0%, transparent 50%), linear-gradient(180deg, #0a0515 0%, #0d0820 100%)`
  const glowColor = `${primary}40`
  const cardBg = `linear-gradient(135deg, ${primary}08 0%, ${secondary}08 100%)`
  const borderColor = `${primary}30`
  
  return { primary, secondary, accent, bgGradient, glowColor, cardBg, borderColor }
}

// ========== 神谕卡内容 ==========
export const oracleCards = [
  { title: '觉醒', content: '是时候醒来了，你已经沉睡太久。', image: '🌅' },
  { title: '放下', content: '紧握的手无法接收新的礼物。', image: '🍃' },
  { title: '勇气', content: '恐惧是正常的，但你依然可以前行。', image: '🦁' },
  { title: '疗愈', content: '伤口正在愈合，给它一些时间。', image: '💚' },
  { title: '转变', content: '旧的正在褪去，新的正在诞生。', image: '🦋' },
  { title: '丰盛', content: '宇宙的丰盛正在流向你。', image: '🌻' },
  { title: '保护', content: '你被神圣的光芒包围着。', image: '🛡️' },
  { title: '连接', content: '你并不孤单，有人在想着你。', image: '🔗' },
  { title: '平衡', content: '在给予和接收之间找到平衡。', image: '⚖️' },
  { title: '创造', content: '你是自己生命的创造者。', image: '🎨' },
  { title: '信任', content: '相信生命的流动，一切都在变好。', image: '🌊' },
  { title: '感恩', content: '细数你拥有的祝福，它们比你想得多。', image: '💝' },
  { title: '释放', content: '让过去过去，未来才能进来。', image: '🕊️' },
  { title: '力量', content: '你比自己想象的更加强大。', image: '⚡' },
  { title: '爱', content: '爱是宇宙中最强大的力量。', image: '💗' },
  { title: '智慧', content: '答案就在你心中，向内寻找。', image: '🦉' },
  { title: '机会', content: '新的机会正在向你走来。', image: '🚪' },
  { title: '休息', content: '你需要休息，这不是偷懒。', image: '🌙' },
]

export function drawOracleCard(seed: number): typeof oracleCards[0] {
  const rand = createSeededRandom(seed + Math.floor(Date.now() / 86400000))
  return pickRandom(rand, oracleCards)
}

// ========== 每日 affirmation ==========
const affirmations = [
  '我值得被爱，也值得被好好对待。',
  '我有能力处理好眼前的一切。',
  '我的感受是真实的，也是重要的。',
  '我允许自己慢慢来，不需要急。',
  '宇宙一直在以它的方式支持我。',
  '每一步都算数，即使看起来很小。',
  '我比自己想象的更加勇敢和坚强。',
  '答案会在正确的时候出现。',
  '我可以为自己的人生负责。',
  '成长有它的节奏，我信任这个过程。',
  '我的存在本身就很有价值。',
  '我值得拥有美好的事物。',
]

export function generateAffirmation(seed: number): string {
  const rand = createSeededRandom(seed + 400 + Math.floor(Date.now() / 86400000))
  return pickRandom(rand, affirmations)
}

// ========== 每日启示卡 ==========
const promptCards = [
  { title: '今日课题', content: '今天，宇宙想让你学习什么？' },
  { title: '放下什么', content: '有什么是你可以放下的？' },
  { title: '拥抱什么', content: '有什么是你值得被拥抱的？' },
  { title: '内在声音', content: '安静下来，听听内心在说什么？' },
  { title: '下一步', content: '如果只走一步，那一步是什么？' },
  { title: '隐藏的礼物', content: '最近的困难里，藏着什么礼物？' },
  { title: '需要看见', content: '有什么是你一直回避的？' },
  { title: '真实渴望', content: '抛开一切，你真正想要的是什么？' },
  { title: '感恩时刻', content: '此刻，有什么让你心怀感激？' },
  { title: '自我对话', content: '如果跟内心说一句话，你会说什么？' },
  { title: '身体智慧', content: '你的身体今天想告诉你什么？' },
  { title: '关系镜子', content: '最近的关系中，你看到了自己的什么？' },
]

export function generatePromptCard(seed: number): { title: string; content: string } {
  const rand = createSeededRandom(seed + 300 + Math.floor(Date.now() / 86400000))
  return pickRandom(rand, promptCards)
}

// ========== 宇宙来信 ==========
const letterOpenings = [
  '亲爱的孩子，',
  '我最珍贵的存在，',
  '正在读这封信的你，',
  '勇敢的灵魂，',
  '我一直注视着你，',
]

const letterBodies = [
  '我知道你最近有些疲惫。但请相信，你走过的每一步都在塑造更强大的你。那些看似没有回报的日子，其实是在为你积蓄力量。',
  '你正在经历的一切都有意义。即使现在还看不清，但终有一天你会回头微笑，感谢自己没有放弃。',
  '你的光芒比你想象的更耀眼。不要因为别人的眼光而收敛自己的光芒，你值得被看见，值得被爱。',
  '有时候，停下也是一种前进。给自己一些喘息的空间，你不需要一直保持高效。',
  '你已经做得很好了。真的。即使你觉得自己还不够好，但在我眼中，你已经足够完美。',
]

const letterClosings = [
  '永远爱你的宇宙 ✨',
  '相信你的星辰 🌟',
  '与你同在的光 💫',
  '守护你的天使 👼',
  '爱你的宇宙 💝',
]

export function generateCosmicLetter(seed: number): string {
  const rand = createSeededRandom(seed + 500 + Math.floor(Date.now() / 86400000))
  const opening = pickRandom(rand, letterOpenings)
  const body = pickRandom(rand, letterBodies)
  const closing = pickRandom(rand, letterClosings)
  
  return `${opening}\n\n${body}\n\n${closing}`
}

// ========== 脉轮信息 ==========
export const chakras = [
  { name: '根轮', color: '#FF0000', icon: '🌱', location: '脊柱底部', function: '安全感、生存、根基' },
  { name: '脐轮', color: '#FF7F00', icon: '🔥', location: '下腹部', function: '创造力、性能量、热情' },
  { name: '太阳神经丛', color: '#FFFF00', icon: '☀️', location: '上腹部', function: '力量、自信、意志力' },
  { name: '心轮', color: '#00FF00', icon: '💚', location: '胸口', function: '爱、慈悲、连接' },
  { name: '喉轮', color: '#0000FF', icon: '💙', location: '喉咙', function: '表达、沟通、真相' },
  { name: '第三眼', color: '#4B0082', icon: '👁️', location: '两眉之间', function: '直觉、洞察、想象' },
  { name: '顶轮', color: '#9400D3', icon: '👑', location: '头顶', function: '灵性、开悟、宇宙连接' },
]

// ========== 如尼符文 ==========
export const runes = [
  { name: 'Fehu', symbol: 'ᚠ', meaning: '财富、繁荣、新开始' },
  { name: 'Uruz', symbol: 'ᚢ', meaning: '力量、健康、勇气' },
  { name: 'Thurisaz', symbol: 'ᚦ', meaning: '保护、防御、突破障碍' },
  { name: 'Ansuz', symbol: 'ᚨ', meaning: '智慧、沟通、神圣启示' },
  { name: 'Raido', symbol: 'ᚱ', meaning: '旅程、运动、正确行动' },
  { name: 'Kenaz', symbol: 'ᚲ', meaning: '光明、知识、创造力' },
  { name: 'Gebo', symbol: 'ᚷ', meaning: '礼物、伙伴关系、平衡' },
  { name: 'Wunjo', symbol: 'ᚹ', meaning: '喜悦、和谐、成功' },
  { name: 'Hagalaz', symbol: 'ᚺ', meaning: '破坏、转变、释放' },
  { name: 'Nauthiz', symbol: 'ᚾ', meaning: '需求、限制、耐心' },
  { name: 'Isa', symbol: 'ᛁ', meaning: '静止、冻结、内省' },
  { name: 'Jera', symbol: 'ᛃ', meaning: '收获、周期、结果' },
  { name: 'Eihwaz', symbol: 'ᛇ', meaning: '坚持、保护、死亡与重生' },
  { name: 'Perthro', symbol: 'ᛈ', meaning: '秘密、命运、潜意识' },
  { name: 'Algiz', symbol: 'ᛉ', meaning: '保护、防御、神圣连接' },
  { name: 'Sowilo', symbol: 'ᛊ', meaning: '太阳、成功、生命力' },
  { name: 'Tiwaz', symbol: 'ᛏ', meaning: '正义、牺牲、领导力' },
  { name: 'Berkano', symbol: 'ᛒ', meaning: '出生、疗愈、母性' },
  { name: 'Ehwaz', symbol: 'ᛖ', meaning: '运动、伙伴关系、信任' },
  { name: 'Mannaz', symbol: 'ᛗ', meaning: '人性、自我、社会' },
  { name: 'Laguz', symbol: 'ᛚ', meaning: '水、直觉、潜意识' },
  { name: 'Ingwaz', symbol: 'ᛜ', meaning: '种子、潜力、内在成长' },
  { name: 'Dagaz', symbol: 'ᛞ', meaning: '黎明、觉醒、突破' },
  { name: 'Othala', symbol: 'ᛟ', meaning: '遗产、家园、智慧' },
]

// ========== 易经卦象（简化版）==========
export const iChingHexagrams = [
  { name: '乾为天', number: 1, meaning: '刚健中正，自强不息' },
  { name: '坤为地', number: 2, meaning: '厚德载物，包容万物' },
  { name: '水雷屯', number: 3, meaning: '起始艰难，坚定前行' },
  { name: '山水蒙', number: 4, meaning: '蒙昧初开，启发智慧' },
  { name: '水天需', number: 5, meaning: '等待时机，耐心守候' },
  { name: '天水讼', number: 6, meaning: '争议冲突，和解为上' },
  { name: '地水师', number: 7, meaning: '率众出征，纪律严明' },
  { name: '水地比', number: 8, meaning: '亲近和谐，团结互助' },
]

export function castIChing(seed: number): typeof iChingHexagrams[0] {
  const rand = createSeededRandom(seed + Math.floor(Date.now() / 86400000))
  return pickRandom(rand, iChingHexagrams)
}

export function drawRunes(seed: number, count: number = 3): typeof runes {
  const rand = createSeededRandom(seed + Math.floor(Date.now() / 86400000))
  return pickRandomN(rand, runes, count)
}
