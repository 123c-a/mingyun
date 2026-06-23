import { calculateBazi, analyzeFiveElements, generateFullReport, FiveElementKey } from './astrologyEngine'

export interface DestinyAnalysis {
  zodiac: string
  element: FiveElementKey
  personality: string
  fortune: string
  advice: string
  luckyBlocks: string[]
}

export interface DestinyScene {
  title: string
  description: string
  blocks: string[]
  structure: {
    type: 'mountain' | 'river' | 'forest' | 'temple' | 'garden' | 'palace' | 'cave' | 'lake'
    size: 'small' | 'medium' | 'large'
  }
}

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'your-api-key-here'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function analyzeDestiny(birthYear: number, birthMonth: number, birthDay: number, birthHour: number): Promise<DestinyAnalysis> {
  try {
    const bazi = calculateBazi(birthYear, birthMonth, birthDay, birthHour)
    const fiveElements = analyzeFiveElements(bazi)
    const report = generateFullReport(birthYear, birthMonth, birthDay, birthHour)
    
    const prompt = `
你是一位精通中国传统命理的大师，请根据以下八字信息进行分析：

八字信息：
- 年柱：${bazi.year.stem}${bazi.year.branch}
- 月柱：${bazi.month.stem}${bazi.month.branch}
- 日柱：${bazi.day.stem}${bazi.day.branch}
- 时柱：${bazi.hour.stem}${bazi.hour.branch}
- 生肖：${bazi.zodiac}
- 五行强弱：${fiveElements.dominant}强，${fiveElements.weakest}弱

请用简洁优美的语言分析：
1. 性格特点
2. 近期运势
3. 建议事项
4. 适合的颜色和方位

请用中文回复，语气亲切自然。
    `.trim()

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    const dominantElement = fiveElements.dominant || '土'
    return {
      zodiac: bazi.zodiac,
      element: dominantElement as FiveElementKey,
      personality: extractSection(content, '性格特点') || report.personality,
      fortune: extractSection(content, '近期运势') || '运势平稳，吉人天相',
      advice: extractSection(content, '建议事项') || '保持平常心，顺其自然',
      luckyBlocks: getLuckyBlocks(dominantElement as FiveElementKey)
    }
  } catch (error) {
    console.error('Destiny analysis error:', error)
    const bazi = calculateBazi(birthYear, birthMonth, birthDay, birthHour)
    const fiveElements = analyzeFiveElements(bazi)
    const report = generateFullReport(birthYear, birthMonth, birthDay, birthHour)
    const dominantElement = fiveElements.dominant || '土'
    return {
      zodiac: bazi.zodiac,
      element: dominantElement as FiveElementKey,
      personality: report.personality,
      fortune: '运势平稳，吉人天相',
      advice: '保持平常心，顺其自然',
      luckyBlocks: getLuckyBlocks(dominantElement as FiveElementKey)
    }
  }
}

function extractSection(text: string, sectionName: string): string | null {
  const regex = new RegExp(`${sectionName}[：:](.*?)(?=\\n\\d+\\.|\\n\\s*$)`, 'gs')
  const match = regex.exec(text)
  return match ? match[1].trim() : null
}

function getLuckyBlocks(element: FiveElementKey): string[] {
  const elementBlocks: Record<FiveElementKey, string[]> = {
    金: ['wu_xing_metal', 'gold', 'diamond', 'iron'],
    木: ['wu_xing_wood', 'wood', 'leaves', 'grass', 'cherry_wood', 'cherry_leaves'],
    水: ['wu_xing_water', 'water', 'crystal_blue', 'moon_stone'],
    火: ['wu_xing_fire', 'torch', 'candle', 'crystal_pink', 'lantern'],
    土: ['wu_xing_earth', 'dirt', 'stone', 'brick', 'sand', 'cobblestone']
  }
  return elementBlocks[element] || []
}

export async function generateDestinyScene(prompt: string): Promise<DestinyScene> {
  try {
    const scenePrompt = `
根据用户的描述，生成一个3D方块世界的场景描述。

用户描述：${prompt}

请输出：
1. 场景标题（中文）
2. 场景描述（中文，100字以内）
3. 使用的方块类型（用逗号分隔）
4. 场景结构类型：mountain, river, forest, temple, garden, palace, cave, lake
5. 场景大小：small, medium, large

请用JSON格式输出，不要有多余内容。
    `.trim()

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: scenePrompt }],
        temperature: 0.8
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    try {
      const result = JSON.parse(content)
      return {
        title: result.title || '神秘场景',
        description: result.description || '一个神秘的命理场景',
        blocks: (result.blocks || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        structure: {
          type: (result.type as DestinyScene['structure']['type']) || 'garden',
          size: (result.size as DestinyScene['structure']['size']) || 'medium'
        }
      }
    } catch {
      return generateDefaultScene(prompt)
    }
  } catch (error) {
    console.error('Scene generation error:', error)
    return generateDefaultScene(prompt)
  }
}

function generateDefaultScene(prompt: string): DestinyScene {
  if (prompt.includes('山') || prompt.includes('峰') || prompt.includes('高原')) {
    return {
      title: '神秘山峰',
      description: '巍峨的山峰直插云霄，云雾缭绕',
      blocks: ['stone', 'snow', 'constellation', 'ziwei_tianshu'],
      structure: { type: 'mountain', size: 'large' }
    }
  }
  if (prompt.includes('河') || prompt.includes('湖') || prompt.includes('海')) {
    return {
      title: '命运之河',
      description: '波光粼粼的河流穿越大地',
      blocks: ['water', 'sand', 'crystal_ball', 'moon_phase'],
      structure: { type: 'river', size: 'medium' }
    }
  }
  if (prompt.includes('森林') || prompt.includes('树') || prompt.includes('林')) {
    return {
      title: '神秘森林',
      description: '古老的森林中隐藏着神秘力量',
      blocks: ['wood', 'leaves', 'grass', 'crystal_pink', 'rune'],
      structure: { type: 'forest', size: 'large' }
    }
  }
  if (prompt.includes('庙') || prompt.includes('寺') || prompt.includes('殿')) {
    return {
      title: '命运神殿',
      description: '古老的神殿散发着神秘的光芒',
      blocks: ['gold', 'brick', 'crystal_violet', 'bagua_qian', 'lantern'],
      structure: { type: 'temple', size: 'medium' }
    }
  }
  return {
    title: '命运花园',
    description: '美丽的花园中蕴含着命运的奥秘',
    blocks: ['grass', 'flower_red', 'flower_yellow', 'heart_block', 'candle'],
    structure: { type: 'garden', size: 'small' }
  }
}

export async function generateFortuneReading(): Promise<string> {
  try {
    const prompt = `
请为今天生成一条运势指引。用诗意的语言描述，包含：
1. 今日主题
2. 吉时提醒
3. 注意事项
4. 幸运颜色

请用中文回复，语气温暖而充满希望。
    `.trim()

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9
      })
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || '今日运势：顺其自然，静待花开。'
  } catch (error) {
    console.error('Fortune reading error:', error)
    const fortunes = [
      '今日运势：花开有时，静待佳期。保持内心的平静，好运自会降临。',
      '今日运势：星光指引，前路光明。相信直觉，勇敢前行。',
      '今日运势：清风徐来，水波不兴。顺其自然，便是最好的安排。',
      '今日运势：山高路远，风景正好。每一步都在接近梦想。',
      '今日运势：云开雾散，阳光普照。阴霾终将过去，希望就在前方。'
    ]
    return fortunes[Math.floor(Math.random() * fortunes.length)]
  }
}