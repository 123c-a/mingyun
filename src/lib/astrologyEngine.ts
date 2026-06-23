import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  FIVE_ELEMENTS,
  TWELVE_HOUR_PERIODS,
  ZIWEI_MAIN_STARS,
  ZIWEI_12_PALACES,
  SIXTY_FOUR_HEXAGRAMS,
  STEM_BRANCH_COMBINATIONS_60,
  FiveElementKey,
} from '../data/traditionalChineseAstrology'

export type { FiveElementKey }

export interface BaziPillar {
  stem: string
  branch: string
  stemElement: string
  branchElement: string
  zodiac: string
  stemDesc: string
  branchDesc: string
}

export interface BaziResult {
  year: BaziPillar
  month: BaziPillar
  day: BaziPillar
  hour: BaziPillar
  zodiac: string
  hourPeriod: string
}

export interface FiveElementScore {
  element: FiveElementKey
  score: number
  percentage: number
  description: string
  direction: string
  season: string
  trait: string
}

export interface FiveElementAnalysis {
  scores: Record<FiveElementKey, FiveElementScore>
  dominant: FiveElementKey
  weakest: FiveElementKey
  balance: string
  advice: string
}

export interface ZiweiPalace {
  name: string
  mainStar: string
  starNature: string
  starDescription: string
  element: string
}

export interface ZiweiResult {
  palaces: ZiweiPalace[]
  mingGongStar: string
  summary: string
}

export interface IChingResult {
  hexagram: (typeof SIXTY_FOUR_HEXAGRAMS)[number]
  changingLines: number[]
  interpretation: string
  advice: string
}

export interface LifeIndicators {
  career: number
  wealth: number
  love: number
  health: number
}

export interface AstrologyReport {
  bazi: BaziResult
  fiveElement: FiveElementAnalysis
  ziwei: ZiweiResult
  iching: IChingResult
  indicators: LifeIndicators
  personality: string
  careerAdvice: string
  loveAdvice: string
  luckyColor: string
  luckyNumber: string
  luckyDirection: string
}

function getStemBranchIndex(year: number, month: number, day: number, hour: number) {
  const refYear = 1984
  const yearStemIdx = ((year - refYear) * 2) % 10
  const adjustedYearStemIdx = ((yearStemIdx % 10) + 10) % 10
  const yearBranchIdx = (((year - 4) % 12) + 12) % 12

  const yearStartStem = (yearStemIdx * 2 + 2) % 10
  const monthBranchIdx = (month + 1) % 12
  const monthStemIdx = ((yearStartStem + monthBranchIdx - 1) % 10 + 10) % 10

  const baseDate = new Date(refYear, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  const dayStemIdx = ((daysDiff % 10) + 10) % 10
  const dayBranchIdx = ((daysDiff % 12) + 12) % 12

  let hourBranchIdx = 0
  for (let i = 0; i < TWELVE_HOUR_PERIODS.length; i++) {
    const period = TWELVE_HOUR_PERIODS[i]
    if (period.start > period.end) {
      if (hour >= period.start || hour < period.end) {
        hourBranchIdx = i
        break
      }
    } else {
      if (hour >= period.start && hour < period.end) {
        hourBranchIdx = i
        break
      }
    }
  }

  const hourStemIdx = ((dayStemIdx * 2 + hourBranchIdx) % 10 + 10) % 10

  return {
    yearStemIdx: adjustedYearStemIdx,
    yearBranchIdx,
    monthStemIdx,
    monthBranchIdx,
    dayStemIdx,
    dayBranchIdx,
    hourStemIdx,
    hourBranchIdx,
  }
}

export function calculateBazi(year: number, month: number, day: number, hour: number): BaziResult {
  const idx = getStemBranchIndex(year, month, day, hour)

  const createPillar = (stemIdx: number, branchIdx: number): BaziPillar => {
    const stem = HEAVENLY_STEMS[stemIdx]
    const branch = EARTHLY_BRANCHES[branchIdx]
    return {
      stem: stem.key,
      branch: branch.key,
      stemElement: stem.element,
      branchElement: branch.element,
      zodiac: branch.zodiac,
      stemDesc: `${stem.yinYang}${stem.element}·${stem.description}`,
      branchDesc: `${branch.element}·${branch.description}`,
    }
  }

  const hourPeriod = TWELVE_HOUR_PERIODS[idx.hourBranchIdx].name

  return {
    year: createPillar(idx.yearStemIdx, idx.yearBranchIdx),
    month: createPillar(idx.monthStemIdx, idx.monthBranchIdx),
    day: createPillar(idx.dayStemIdx, idx.dayBranchIdx),
    hour: createPillar(idx.hourStemIdx, idx.hourBranchIdx),
    zodiac: EARTHLY_BRANCHES[idx.yearBranchIdx].zodiac,
    hourPeriod,
  }
}

export function analyzeFiveElements(bazi: BaziResult): FiveElementAnalysis {
  const elementKeys: FiveElementKey[] = ['木', '火', '土', '金', '水']
  const rawScores: Record<FiveElementKey, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }

  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour]
  pillars.forEach((p) => {
    rawScores[p.stemElement as FiveElementKey] += 1.5
    rawScores[p.branchElement as FiveElementKey] += 2
  })

  const total = Object.values(rawScores).reduce((a, b) => a + b, 0)

  const scores: Record<FiveElementKey, FiveElementScore> = {} as Record<FiveElementKey, FiveElementScore>
  elementKeys.forEach((k) => {
    const info = FIVE_ELEMENTS[k]
    const score = rawScores[k]
    const percentage = Math.round((score / total) * 100)
    scores[k] = {
      element: k,
      score,
      percentage,
      description: info.description,
      direction: info.direction,
      season: info.season,
      trait: info.trait,
    }
  })

  let dominant: FiveElementKey = '木'
  let weakest: FiveElementKey = '木'
  let maxScore = -1
  let minScore = Infinity
  elementKeys.forEach((k) => {
    if (scores[k].percentage > maxScore) {
      maxScore = scores[k].percentage
      dominant = k
    }
    if (scores[k].percentage < minScore) {
      minScore = scores[k].percentage
      weakest = k
    }
  })

  const balanceDiff = maxScore - minScore
  let balance: string
  let advice: string

  if (balanceDiff <= 15) {
    balance = '五行平衡'
    advice = '你的五行分布较为均衡，各方面运势发展平稳，是难得的好命局。继续保持身心和谐，自然水到渠成。'
  } else if (balanceDiff <= 30) {
    balance = `略偏${dominant}`
    advice = `五行中${dominant}稍旺，${weakest}略弱。建议多接触${FIVE_ELEMENTS[weakest].color}相关事物，或朝向${FIVE_ELEMENTS[weakest].direction}方发展，以调和五行。`
  } else {
    balance = `${dominant}旺${weakest}缺`
    advice = `五行中${dominant}过旺而${weakest}明显不足。需有意识地补充${weakest}元素：可多穿${FIVE_ELEMENTS[weakest].color}色系衣物，多吃${FIVE_ELEMENTS[weakest].season}季养生食物，注意${FIVE_ELEMENTS[weakest].direction}方位的布局。同时收敛${dominant}的过旺之气，以达致中和。`
  }

  return { scores, dominant, weakest, balance, advice }
}

export function calculateZiwei(bazi: BaziResult): ZiweiResult {
  const palaces: ZiweiPalace[] = []
  const monthBranchIdx = EARTHLY_BRANCHES.findIndex((b) => b.key === bazi.month.branch)
  const hourBranchIdx = EARTHLY_BRANCHES.findIndex((b) => b.key === bazi.hour.branch)

  const mingGongBase = (monthBranchIdx + hourBranchIdx) % 12
  const palaceOrder = [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

  for (let i = 0; i < 12; i++) {
    const palaceIdx = (mingGongBase + palaceOrder[i]) % 12
    const starIdx = (palaceIdx * 3 + Math.floor(Math.random() * 5) + hourBranchIdx) % ZIWEI_MAIN_STARS.length
    const star = ZIWEI_MAIN_STARS[starIdx]
    palaces.push({
      name: ZIWEI_12_PALACES[i],
      mainStar: star.key,
      starNature: star.nature,
      starDescription: star.description,
      element: star.element,
    })
  }

  const mingGong = palaces[0]
  const summary = `命宫坐${mingGong.mainStar}（${mingGong.starNature}），${mingGong.starDescription}。整体格局显示你在人生各领域的发展潜力与挑战。`

  return {
    palaces,
    mingGongStar: mingGong.mainStar,
    summary,
  }
}

export function drawIChing(question?: string): IChingResult {
  const hexIdx = Math.floor(Math.random() * SIXTY_FOUR_HEXAGRAMS.length)
  const hexagram = SIXTY_FOUR_HEXAGRAMS[hexIdx]

  const changingLines: number[] = []
  for (let i = 0; i < 6; i++) {
    if (Math.random() < 0.2) {
      changingLines.push(i + 1)
    }
  }

  const q = question ? `关于"${question}"，` : ''
  const interpretation = `${q}${hexagram.name}：${hexagram.meaning}`

  const adviceBase = [
    '此卦显示当前处于重要节点，宜冷静观察、审时度势。',
    '坚守正道，勿忘初心，自然会有贵人相助、柳暗花明之时。',
    '凡事三思而后行，切勿急于求成，稳中求进方为上策。',
    '机会与挑战并存，需以开放心态接受变化，灵活应变。',
    '积善之家必有余庆，注重德行修养，福报自然来临。',
  ]
  const advice = adviceBase[Math.floor(Math.random() * adviceBase.length)]

  return { hexagram, changingLines, interpretation, advice }
}

export function calculateLifeIndicators(bazi: BaziResult, five: FiveElementAnalysis): LifeIndicators {
  const baseScores: LifeIndicators = { career: 50, wealth: 50, love: 50, health: 50 }

  if (five.dominant === '金' || five.dominant === '土') baseScores.career += 20
  if (five.dominant === '火' || five.dominant === '木') baseScores.wealth += 15
  if (five.dominant === '水' || five.dominant === '火') baseScores.love += 20
  if (five.dominant === '土' || five.dominant === '木') baseScores.health += 15

  if (five.weakest === '金') baseScores.career -= 10
  if (five.weakest === '水') baseScores.wealth -= 10
  if (five.weakest === '火') baseScores.love -= 10
  if (five.weakest === '木') baseScores.health -= 10

  baseScores.career = Math.min(99, Math.max(30, baseScores.career + Math.floor(Math.random() * 15)))
  baseScores.wealth = Math.min(99, Math.max(30, baseScores.wealth + Math.floor(Math.random() * 20)))
  baseScores.love = Math.min(99, Math.max(30, baseScores.love + Math.floor(Math.random() * 20)))
  baseScores.health = Math.min(99, Math.max(30, baseScores.health + Math.floor(Math.random() * 15)))

  return baseScores
}

export function generateFullReport(
  year: number,
  month: number,
  day: number,
  hour: number,
  question?: string
): AstrologyReport {
  const bazi = calculateBazi(year, month, day, hour)
  const five = analyzeFiveElements(bazi)
  const ziwei = calculateZiwei(bazi)
  const iching = drawIChing(question)
  const indicators = calculateLifeIndicators(bazi, five)

  const personality = `你日主为${bazi.day.stem}${bazi.day.branch}，${bazi.day.stemDesc}。性格上${FIVE_ELEMENTS[five.dominant as FiveElementKey].description}。${bazi.year.branch}年出生属${bazi.zodiac}，天生具有敏锐的直觉与坚定的意志。五行中${five.dominant}为用，显示你在${FIVE_ELEMENTS[five.dominant as FiveElementKey].trait}方面有突出表现。`

  const careerAdvice =
    indicators.career >= 75
      ? '事业运势强盛，适合自主创业或担任领导职务。可把握35岁前后的关键时机，必有所成。建议多接触金融、地产、管理类行业。'
      : indicators.career >= 55
      ? '事业稳步发展，适合在专业领域深耕。建议积累经验、建立人脉，30岁后会迎来重要转折点。'
      : '事业上需多付出努力，宜稳不宜急。建议选择稳定性高的行业，避免频繁跳槽，专注积累。'

  const loveAdvice =
    indicators.love >= 75
      ? '感情运势旺盛，桃花缘佳。容易遇到志同道合的伴侣，婚姻生活和谐美满。建议主动把握机会。'
      : indicators.love >= 55
      ? '感情发展平稳，需多沟通交流。建议通过兴趣爱好或朋友介绍拓展社交圈，感情自然水到渠成。'
      : '感情上需多一些耐心与包容。建议先提升自我，内外兼修，自然会吸引到合适的缘分。'

  const luckyMap: Record<FiveElementKey, string> = {
    木: '绿色、青色',
    火: '红色、紫色、粉色',
    土: '黄色、棕色、米色',
    金: '白色、金色、银色',
    水: '蓝色、黑色、深灰色',
  }
  const luckyColor = luckyMap[five.dominant]
  const yearStemBranchIdx = STEM_BRANCH_COMBINATIONS_60.findIndex(
    (c) => c === `${bazi.year.stem}${bazi.year.branch}`
  )
  const luckyNumber = String(1 + ((yearStemBranchIdx >= 0 ? yearStemBranchIdx : year % 9) % 9))
  const luckyDirection = FIVE_ELEMENTS[five.dominant as FiveElementKey].direction

  return {
    bazi,
    fiveElement: five,
    ziwei,
    iching,
    indicators,
    personality,
    careerAdvice,
    loveAdvice,
    luckyColor,
    luckyNumber,
    luckyDirection,
  }
}
