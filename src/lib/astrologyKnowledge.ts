export type Element = 'fire' | 'earth' | 'air' | 'water'
export type Modality = 'cardinal' | 'fixed' | 'mutable'
export type Polarity = 'yang' | 'yin'
export type DignityType = 'domicile' | 'exaltation' | 'triplicity' | 'term' | 'face' | 'detriment' | 'fall'
export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx' | 'semisextile' | 'sesquisquare'
export type AspectNature = 'harmonious' | 'challenging' | 'neutral'
export type HouseType = 'angular' | 'succedent' | 'cadent'
export type PlanetCategory = 'personal' | 'social' | 'transpersonal'

export interface PlanetInfo {
  id: string
  name: string
  chineseName: string
  element: Element
  modality?: Modality
  polarity: Polarity
  category: PlanetCategory
  diurnal: boolean
  number: number
  metal?: string
  keywords: string[]
  domiciles: string[]
  exaltation?: string
  detriment: string[]
  fall?: string
  triplicityDay?: string
  triplicityNight?: string
  joyHouse?: string
  color: string
  orbitOrder: number
}

export interface SignInfo {
  id: string
  name: string
  chineseName: string
  element: Element
  modality: Modality
  polarity: Polarity
  number: number
  ruler: string
  exaltation?: string
  detriment: string
  fall?: string
  naturalHouse: number
  keywords: string[]
  glyph: string
}

export interface AspectInfo {
  id: string
  name: string
  chineseName: string
  angle: number
  nature: AspectNature
  orb: number
  keywords: string[]
  symbol: string
}

export interface HouseInfo {
  number: number
  chineseName: string
  type: HouseType
  keywords: string[]
  naturalRuler: string
}

export interface ElementInfo {
  id: Element
  chineseName: string
  color: string
  traits: string[]
  season: string
  direction: string
}

export interface ModalityInfo {
  id: Modality
  chineseName: string
  traits: string[]
}

export const elements: Record<Element, ElementInfo> = {
  fire: {
    id: 'fire',
    chineseName: '火',
    color: '#FF4500',
    traits: ['热情', '行动', '创造力', '勇气', '直觉', '领导力', '冲动', '自我'],
    season: '夏',
    direction: '南',
  },
  earth: {
    id: 'earth',
    chineseName: '土',
    color: '#8B4513',
    traits: ['务实', '稳定', '耐心', '感官', '物质', '可靠', '固执', '缓慢'],
    season: '秋',
    direction: '中',
  },
  air: {
    id: 'air',
    chineseName: '风',
    color: '#87CEEB',
    traits: ['思维', '沟通', '社交', '理性', '客观', '灵活', '疏离', '多变'],
    season: '春',
    direction: '东',
  },
  water: {
    id: 'water',
    chineseName: '水',
    color: '#1E90FF',
    traits: ['情感', '直觉', '共情', '敏感', '想象', '滋养', '情绪化', '逃避'],
    season: '冬',
    direction: '北',
  },
}

export const modalities: Record<Modality, ModalityInfo> = {
  cardinal: {
    id: 'cardinal',
    chineseName: '基本',
    traits: ['开创', '主动', '领导', '行动', '果断', ' initiating', '急躁', '缺乏持久'],
  },
  fixed: {
    id: 'fixed',
    chineseName: '固定',
    traits: ['稳定', '坚持', '深度', '专注', '可靠', '固执', '抗拒变化', '积累'],
  },
  mutable: {
    id: 'mutable',
    chineseName: '变动',
    traits: ['适应', '灵活', '沟通', '多样', '变化', '分散', '不专注', '机敏'],
  },
}

export const planets: Record<string, PlanetInfo> = {
  sun: {
    id: 'sun',
    name: 'Sun',
    chineseName: '太阳',
    element: 'fire',
    polarity: 'yang',
    category: 'personal',
    diurnal: true,
    number: 1,
    metal: '金',
    keywords: ['自我', '意志', '生命力', '创造力', '身份认同', '父性', '权威', '荣耀'],
    domiciles: ['leo'],
    exaltation: 'aries',
    detriment: ['aquarius'],
    fall: 'libra',
    joyHouse: '9',
    color: '#FFD700',
    orbitOrder: 0,
  },
  moon: {
    id: 'moon',
    name: 'Moon',
    chineseName: '月亮',
    element: 'water',
    polarity: 'yin',
    category: 'personal',
    diurnal: false,
    number: 2,
    metal: '银',
    keywords: ['情感', '直觉', '滋养', '母性', '安全感', '习惯', '潜意识', '记忆'],
    domiciles: ['cancer'],
    exaltation: 'taurus',
    detriment: ['capricorn'],
    fall: 'scorpio',
    joyHouse: '3',
    color: '#C0C0C0',
    orbitOrder: 1,
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    chineseName: '水星',
    element: 'air',
    polarity: 'yang',
    category: 'personal',
    diurnal: true,
    number: 3,
    metal: '水银',
    keywords: ['思维', '沟通', '学习', '旅行', '信息', '商业', '灵活', '多变'],
    domiciles: ['gemini', 'virgo'],
    exaltation: 'virgo',
    detriment: ['sagittarius', 'pisces'],
    fall: 'pisces',
    joyHouse: '1',
    color: '#A9A9A9',
    orbitOrder: 2,
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    chineseName: '金星',
    element: 'earth',
    polarity: 'yin',
    category: 'personal',
    diurnal: false,
    number: 4,
    metal: '铜',
    keywords: ['爱', '美', '关系', '价值', '艺术', '享乐', '和谐', '金钱'],
    domiciles: ['taurus', 'libra'],
    exaltation: 'pisces',
    detriment: ['scorpio', 'aries'],
    fall: 'virgo',
    joyHouse: '5',
    color: '#FFB6C1',
    orbitOrder: 3,
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    chineseName: '火星',
    element: 'fire',
    polarity: 'yang',
    category: 'personal',
    diurnal: false,
    number: 5,
    metal: '铁',
    keywords: ['行动', '勇气', '欲望', '竞争', '性', '能量', '愤怒', '决断'],
    domiciles: ['aries', 'scorpio'],
    exaltation: 'capricorn',
    detriment: ['libra', 'taurus'],
    fall: 'cancer',
    joyHouse: '6',
    color: '#FF4500',
    orbitOrder: 4,
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    chineseName: '木星',
    element: 'fire',
    polarity: 'yang',
    category: 'social',
    diurnal: true,
    number: 6,
    metal: '锡',
    keywords: ['扩张', '幸运', '智慧', '信仰', '旅行', '高等教育', '丰盛', '乐观'],
    domiciles: ['sagittarius', 'pisces'],
    exaltation: 'cancer',
    detriment: ['gemini', 'virgo'],
    fall: 'capricorn',
    joyHouse: '11',
    color: '#DAA520',
    orbitOrder: 5,
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    chineseName: '土星',
    element: 'earth',
    polarity: 'yin',
    category: 'social',
    diurnal: true,
    number: 7,
    metal: '铅',
    keywords: ['限制', '责任', '结构', '时间', '权威', '纪律', '成熟', '业力'],
    domiciles: ['capricorn', 'aquarius'],
    exaltation: 'libra',
    detriment: ['cancer', 'leo'],
    fall: 'aries',
    joyHouse: '12',
    color: '#696969',
    orbitOrder: 6,
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    chineseName: '天王星',
    element: 'air',
    polarity: 'yang',
    category: 'transpersonal',
    diurnal: true,
    number: 8,
    keywords: ['突变', '自由', '创新', '科技', '叛逆', '觉醒', '独特', '革命'],
    domiciles: ['aquarius'],
    exaltation: 'scorpio',
    detriment: ['leo'],
    fall: 'taurus',
    color: '#00CED1',
    orbitOrder: 7,
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    chineseName: '海王星',
    element: 'water',
    polarity: 'yin',
    category: 'transpersonal',
    diurnal: false,
    number: 9,
    keywords: ['灵性', '梦幻', '消融', '艺术', '牺牲', '幻觉', '灵感', '慈悲'],
    domiciles: ['pisces'],
    exaltation: 'leo',
    detriment: ['virgo'],
    fall: 'aquarius',
    color: '#4169E1',
    orbitOrder: 8,
  },
  pluto: {
    id: 'pluto',
    name: 'Pluto',
    chineseName: '冥王星',
    element: 'fire',
    polarity: 'yin',
    category: 'transpersonal',
    diurnal: false,
    number: 10,
    keywords: ['转化', '死亡与重生', '权力', '深度', '潜意识', '毁灭', '蜕变', '控制'],
    domiciles: ['scorpio'],
    exaltation: 'aries',
    detriment: ['taurus'],
    fall: 'libra',
    color: '#8B0000',
    orbitOrder: 9,
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    chineseName: '地球',
    element: 'earth',
    polarity: 'yin',
    category: 'personal',
    diurnal: true,
    number: 0,
    keywords: ['根基', '物质', '显化', '身体', '自然', '稳定', '滋养', '家园'],
    domiciles: [],
    detriment: [],
    color: '#228B22',
    orbitOrder: 2.5,
  },
}

export const signs: Record<string, SignInfo> = {
  aries: {
    id: 'aries',
    name: 'Aries',
    chineseName: '白羊座',
    element: 'fire',
    modality: 'cardinal',
    polarity: 'yang',
    number: 1,
    ruler: 'mars',
    exaltation: 'sun',
    detriment: 'venus',
    fall: 'saturn',
    naturalHouse: 1,
    keywords: ['自我', '开创', '勇气', '行动', '冲动', '热情', '领导', '先锋'],
    glyph: '♈',
  },
  taurus: {
    id: 'taurus',
    name: 'Taurus',
    chineseName: '金牛座',
    element: 'earth',
    modality: 'fixed',
    polarity: 'yin',
    number: 2,
    ruler: 'venus',
    exaltation: 'moon',
    detriment: 'pluto',
    fall: 'uranus',
    naturalHouse: 2,
    keywords: ['稳定', '物质', '感官', '固执', '美', '价值', '积累', '耐心'],
    glyph: '♉',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    chineseName: '双子座',
    element: 'air',
    modality: 'mutable',
    polarity: 'yang',
    number: 3,
    ruler: 'mercury',
    detriment: 'jupiter',
    naturalHouse: 3,
    keywords: ['沟通', '好奇', '多变', '学习', '社交', '灵活', '信息', '二元性'],
    glyph: '♊',
  },
  cancer: {
    id: 'cancer',
    name: 'Cancer',
    chineseName: '巨蟹座',
    element: 'water',
    modality: 'cardinal',
    polarity: 'yin',
    number: 4,
    ruler: 'moon',
    exaltation: 'jupiter',
    detriment: 'saturn',
    fall: 'mars',
    naturalHouse: 4,
    keywords: ['情感', '家庭', '滋养', '保护', '敏感', '记忆', '母性', '安全感'],
    glyph: '♋',
  },
  leo: {
    id: 'leo',
    name: 'Leo',
    chineseName: '狮子座',
    element: 'fire',
    modality: 'fixed',
    polarity: 'yang',
    number: 5,
    ruler: 'sun',
    exaltation: 'neptune',
    detriment: 'uranus',
    naturalHouse: 5,
    keywords: ['创造', '表现', '自信', '荣耀', '慷慨', '戏剧', '领导', '自我'],
    glyph: '♌',
  },
  virgo: {
    id: 'virgo',
    name: 'Virgo',
    chineseName: '处女座',
    element: 'earth',
    modality: 'mutable',
    polarity: 'yin',
    number: 6,
    ruler: 'mercury',
    exaltation: 'mercury',
    detriment: 'neptune',
    fall: 'venus',
    naturalHouse: 6,
    keywords: ['分析', '服务', '完美主义', '细节', '健康', '秩序', '实用', '挑剔'],
    glyph: '♍',
  },
  libra: {
    id: 'libra',
    name: 'Libra',
    chineseName: '天秤座',
    element: 'air',
    modality: 'cardinal',
    polarity: 'yang',
    number: 7,
    ruler: 'venus',
    exaltation: 'saturn',
    detriment: 'mars',
    fall: 'sun',
    naturalHouse: 7,
    keywords: ['平衡', '关系', '美', '和谐', '外交', '公平', '艺术', '犹豫'],
    glyph: '♎',
  },
  scorpio: {
    id: 'scorpio',
    name: 'Scorpio',
    chineseName: '天蝎座',
    element: 'water',
    modality: 'fixed',
    polarity: 'yin',
    number: 8,
    ruler: 'pluto',
    exaltation: 'uranus',
    detriment: 'venus',
    fall: 'moon',
    naturalHouse: 8,
    keywords: ['深度', '转化', '性', '权力', '秘密', '死亡与重生', '直觉', '控制'],
    glyph: '♏',
  },
  sagittarius: {
    id: 'sagittarius',
    name: 'Sagittarius',
    chineseName: '射手座',
    element: 'fire',
    modality: 'mutable',
    polarity: 'yang',
    number: 9,
    ruler: 'jupiter',
    detriment: 'mercury',
    naturalHouse: 9,
    keywords: ['自由', '探索', '哲学', '旅行', '信仰', '乐观', '扩张', '直率'],
    glyph: '♐',
  },
  capricorn: {
    id: 'capricorn',
    name: 'Capricorn',
    chineseName: '摩羯座',
    element: 'earth',
    modality: 'cardinal',
    polarity: 'yin',
    number: 10,
    ruler: 'saturn',
    exaltation: 'mars',
    detriment: 'moon',
    fall: 'jupiter',
    naturalHouse: 10,
    keywords: ['野心', '责任', '结构', '成就', '权威', '纪律', '务实', '事业'],
    glyph: '♑',
  },
  aquarius: {
    id: 'aquarius',
    name: 'Aquarius',
    chineseName: '水瓶座',
    element: 'air',
    modality: 'fixed',
    polarity: 'yang',
    number: 11,
    ruler: 'uranus',
    detriment: 'sun',
    fall: 'neptune',
    naturalHouse: 11,
    keywords: ['创新', '自由', '人道', '科技', '叛逆', '独特', '群体', '未来'],
    glyph: '♒',
  },
  pisces: {
    id: 'pisces',
    name: 'Pisces',
    chineseName: '双鱼座',
    element: 'water',
    modality: 'mutable',
    polarity: 'yin',
    number: 12,
    ruler: 'neptune',
    exaltation: 'venus',
    detriment: 'mercury',
    naturalHouse: 12,
    keywords: ['灵性', '梦幻', '慈悲', '艺术', '牺牲', '直觉', '消融', '逃避'],
    glyph: '♓',
  },
}

export const aspects: Record<string, AspectInfo> = {
  conjunction: {
    id: 'conjunction',
    name: 'Conjunction',
    chineseName: '合相',
    angle: 0,
    nature: 'neutral',
    orb: 10,
    keywords: ['融合', '统一', '强化', '聚焦', '结合', '纯粹', '集中'],
    symbol: '☌',
  },
  sextile: {
    id: 'sextile',
    name: 'Sextile',
    chineseName: '六分相',
    angle: 60,
    nature: 'harmonious',
    orb: 6,
    keywords: ['机会', '合作', '和谐', '支持', '创造力', '轻松', '礼物'],
    symbol: '⚹',
  },
  square: {
    id: 'square',
    name: 'Square',
    chineseName: '四分相',
    angle: 90,
    nature: 'challenging',
    orb: 8,
    keywords: ['冲突', '挑战', '张力', '行动', '突破', '成长', '摩擦'],
    symbol: '□',
  },
  trine: {
    id: 'trine',
    name: 'Trine',
    chineseName: '三分相',
    angle: 120,
    nature: 'harmonious',
    orb: 8,
    keywords: ['和谐', '流畅', '天赋', '好运', '自然', '顺利', '保护'],
    symbol: '△',
  },
  opposition: {
    id: 'opposition',
    name: 'Opposition',
    chineseName: '对分相',
    angle: 180,
    nature: 'challenging',
    orb: 10,
    keywords: ['对立', '平衡', '投射', '关系', '两极', '整合', '意识'],
    symbol: '☍',
  },
  quincunx: {
    id: 'quincunx',
    name: 'Quincunx',
    chineseName: '梅花相',
    angle: 150,
    nature: 'neutral',
    orb: 3,
    keywords: ['调整', '适应', '不相关', '别扭', '微调', '健康', '服务'],
    symbol: '⚻',
  },
  semisextile: {
    id: 'semisextile',
    name: 'Semisextile',
    chineseName: '半六分相',
    angle: 30,
    nature: 'neutral',
    orb: 2,
    keywords: ['微弱', '潜能', '渐进', '微妙', '小机会', '相邻'],
    symbol: '⚺',
  },
  sesquisquare: {
    id: 'sesquisquare',
    name: 'Sesquisquare',
    chineseName: '补八分相',
    angle: 135,
    nature: 'challenging',
    orb: 3,
    keywords: ['紧张', '烦躁', '冲突', '调整', '压力', '中等挑战'],
    symbol: '⚼',
  },
}

export const houses: Record<number, HouseInfo> = {
  1: { number: 1, chineseName: '第一宫 · 自我', type: 'angular', keywords: ['自我', '身份', '外表', '个性', '第一印象', '生命态度'], naturalRuler: 'mars' },
  2: { number: 2, chineseName: '第二宫 · 价值', type: 'succedent', keywords: ['金钱', '物质', '价值', '资源', '才能', '安全感'], naturalRuler: 'venus' },
  3: { number: 3, chineseName: '第三宫 · 沟通', type: 'cadent', keywords: ['沟通', '学习', '兄弟姐妹', '短途旅行', '信息', '思维'], naturalRuler: 'mercury' },
  4: { number: 4, chineseName: '第四宫 · 根基', type: 'angular', keywords: ['家庭', '根基', '父母', '家园', '内心深处', '童年'], naturalRuler: 'moon' },
  5: { number: 5, chineseName: '第五宫 · 创造', type: 'succedent', keywords: ['创造', '表现', '恋爱', '子女', '娱乐', '自我表达'], naturalRuler: 'sun' },
  6: { number: 6, chineseName: '第六宫 · 服务', type: 'cadent', keywords: ['工作', '健康', '服务', '日常', '细节', '同事'], naturalRuler: 'mercury' },
  7: { number: 7, chineseName: '第七宫 · 关系', type: 'angular', keywords: ['伴侣', '合作', '关系', '婚姻', '对手', '他人'], naturalRuler: 'venus' },
  8: { number: 8, chineseName: '第八宫 · 转化', type: 'succedent', keywords: ['死亡', '重生', '性', '他人资源', '深度', '转化'], naturalRuler: 'pluto' },
  9: { number: 9, chineseName: '第九宫 · 探索', type: 'cadent', keywords: ['高等教育', '哲学', '信仰', '长途旅行', '外国', '意义'], naturalRuler: 'jupiter' },
  10: { number: 10, chineseName: '第十宫 · 事业', type: 'angular', keywords: ['事业', '地位', '权威', '成就', '社会角色', '父亲'], naturalRuler: 'saturn' },
  11: { number: 11, chineseName: '第十一宫 · 群体', type: 'succedent', keywords: ['朋友', '群体', '希望', '理想', '创新', '未来'], naturalRuler: 'uranus' },
  12: { number: 12, chineseName: '第十二宫 · 潜意识', type: 'cadent', keywords: ['潜意识', '灵性', '隐藏', '牺牲', '业力', '远方'], naturalRuler: 'neptune' },
}

export const signOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']

export const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']

export function getSignByNumber(n: number): SignInfo {
  const idx = ((n - 1) % 12 + 12) % 12
  return signs[signOrder[idx]]
}

export function getSignDifference(sign1: string, sign2: string): number {
  const i1 = signOrder.indexOf(sign1)
  const i2 = signOrder.indexOf(sign2)
  let diff = Math.abs(i1 - i2)
  if (diff > 6) diff = 12 - diff
  return diff
}

export function getAspectForSignDifference(diff: number): AspectInfo | null {
  const angle = diff * 30
  const mapping: Record<number, string> = {
    0: 'conjunction',
    2: 'sextile',
    3: 'square',
    4: 'trine',
    6: 'opposition',
    5: 'quincunx',
    7: 'quincunx',
    1: 'semisextile',
    11: 'semisextile',
  }
  const aspectId = mapping[diff]
  return aspectId ? aspects[aspectId] : null
}

export function getElementSigns(element: Element): string[] {
  return signOrder.filter(s => signs[s].element === element)
}

export function getModalitySigns(modality: Modality): string[] {
  return signOrder.filter(s => signs[s].modality === modality)
}

export function getPolaritySigns(polarity: Polarity): string[] {
  return signOrder.filter(s => signs[s].polarity === polarity)
}

export function getDomicileSigns(planetId: string): string[] {
  const p = planets[planetId]
  return p ? p.domiciles : []
}

export function arePlanetsInSameElement(planet1: string, planet2: string): boolean {
  const p1 = planets[planet1]
  const p2 = planets[planet2]
  return !!(p1 && p2 && p1.element === p2.element)
}

export function arePlanetsInSameCategory(planet1: string, planet2: string): boolean {
  const p1 = planets[planet1]
  const p2 = planets[planet2]
  return !!(p1 && p2 && p1.category === p2.category)
}

export function arePlanetsInSamePolarity(planet1: string, planet2: string): boolean {
  const p1 = planets[planet1]
  const p2 = planets[planet2]
  return !!(p1 && p2 && p1.polarity === p2.polarity)
}

export function getPlanetPairAspect(planet1: string, planet2: string): AspectInfo | null {
  const p1 = planets[planet1]
  const p2 = planets[planet2]
  if (!p1 || !p2) return null
  if (p1.domiciles.length === 0 || p2.domiciles.length === 0) return null

  let bestDiff = 999
  for (const s1 of p1.domiciles) {
    for (const s2 of p2.domiciles) {
      const diff = getSignDifference(s1, s2)
      if (diff < bestDiff) bestDiff = diff
    }
  }
  return getAspectForSignDifference(bestDiff)
}

export const elementCycles: Record<Element, Element> = {
  fire: 'earth',
  earth: 'air',
  air: 'water',
  water: 'fire',
}

export const elementCompatibility: Record<Element, Element[]> = {
  fire: ['fire', 'air', 'earth', 'water'],
  earth: ['earth', 'water', 'fire', 'air'],
  air: ['air', 'fire', 'water', 'earth'],
  water: ['water', 'earth', 'air', 'fire'],
}

export interface CombinationSignature {
  planets: string[]
  elements: Element[]
  categories: PlanetCategory[]
  polarities: Polarity[]
  dominantElement: Element
  dominantCategory: PlanetCategory
  level: number
}

export function getComboSignature(planetIds: string[]): CombinationSignature {
  const validPlanets = planetIds.filter(p => planets[p])
  const elements = [...new Set(validPlanets.map(p => planets[p].element))]
  const categories = [...new Set(validPlanets.map(p => planets[p].category))]
  const polarities = [...new Set(validPlanets.map(p => planets[p].polarity))]

  const elementCount: Record<string, number> = {}
  for (const p of validPlanets) {
    const e = planets[p].element
    elementCount[e] = (elementCount[e] || 0) + 1
  }
  let dominantElement: Element = 'fire'
  let maxCount = -1
  for (const e of ['fire', 'earth', 'air', 'water'] as Element[]) {
    if ((elementCount[e] || 0) > maxCount) {
      maxCount = elementCount[e] || 0
      dominantElement = e
    }
  }

  const catCount: Record<string, number> = {}
  for (const p of validPlanets) {
    const c = planets[p].category
    catCount[c] = (catCount[c] || 0) + 1
  }
  let dominantCategory: PlanetCategory = 'personal'
  let maxCat = -1
  for (const c of ['personal', 'social', 'transpersonal'] as PlanetCategory[]) {
    if ((catCount[c] || 0) > maxCat) {
      maxCat = catCount[c] || 0
      dominantCategory = c
    }
  }

  return {
    planets: validPlanets,
    elements,
    categories,
    polarities,
    dominantElement,
    dominantCategory,
    level: validPlanets.length,
  }
}
