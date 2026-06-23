// 自然语言转复古命理风格提示词系统
// 将用户的日常自然语言描述转换为复古、古典的命理风格提示词

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'your-api-key-here'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

/**
 * 自然语言转复古命理风格提示词的系统提示
 */
const SYSTEM_PROMPT = `你是一位精通中国传统风水学、命理学和古典文学的大师。你需要将用户输入的日常语言转换为复古、古典的命理风格描述。

转换规则：
1. 将现代词汇转换为古典命理术语
2. 融入五行、八卦、天干地支等元素
3. 使用对仗、押韵等古典修辞
4. 描述要富有诗意和神秘感
5. 保持原意的同时，增加命理内涵

示例转换：
- "我要一个安静的地方" → "寻一方静谧之所，水光潋滟，灵气汇聚之地"
- "建一座高塔" → "筑九层玄塔，承天接地，镇守一方风水"
- "多种些树" → "遍植五行木气，青翠成林，荫蔽众生"
- "挖个水池" → "开一方壬水之池，映照天机，汇聚财气"
- "用金色装饰" → "镶庚金之辉，光芒万丈，贵气逼人"

请直接输出转换后的描述，不要添加解释或其他内容。`

/**
 * 常见自然语言到命理术语的映射（快速转换，无需API）
 */
const QUICK_MAPPINGS: Record<string, string> = {
  // 描述词
  '安静': '静谧安宁',
  '热闹': '繁盛热闹',
  '神秘': '玄秘莫测',
  '神圣': '神圣庄严',
  '古老': '古朴沧桑',
  '现代': '今朝新象',
  '自然': '浑然天成',
  '豪华': '金碧辉煌',
  '简约': '素雅清幽',
  
  // 地形
  '平原': '一马平川，土气厚重之地',
  '山': '巍峨山峦，镇守四方',
  '森林': '林木葱郁，木气旺盛之所',
  '河流': '蜿蜒水脉，流动不息',
  '湖泊': '静水深潭，水气汇聚之处',
  '沙漠': '千里黄沙，火气燥烈之地',
  '雪地': '银装素裹，金水相生之境',
  '洞穴': '幽深洞穴，地气凝结之所',
  
  // 建筑
  '房子': '居所宅邸，安身立命之处',
  '塔': '高耸入云之塔，通天彻地',
  '寺庙': '禅林古刹，香火鼎盛之地',
  '宫殿': '金殿琼楼，皇家气象',
  '桥梁': '架通两岸，沟通有无',
  '花园': '芳菲满园，灵气盎然',
  '喷泉': '水涌如注，财气流动',
  '雕像': '雕塑神像，镇宅辟邪',
  '城墙': '城墙巍峨，固若金汤',
  
  // 颜色
  '红色': '朱红之色，火气炽烈',
  '蓝色': '碧蓝之色，水气灵动',
  '绿色': '翠绿之色，木气生机',
  '金色': '金黄之色，庚金辉煌',
  '白色': '素白之色，银光皎洁',
  '黑色': '玄黑之色，水深如墨',
  '紫色': '紫微之色，贵气逼人',
  
  // 材质
  '木头': '木质建材，五行属木',
  '石头': '石材垒砌，厚重稳固',
  '金属': '金铁打造，坚硬锐利',
  '玻璃': '琉璃通透，光彩照人',
  '水': '壬水之属，流动不息',
  '泥土': '坤土之质，承载万物',
  '砖': '砖石砌筑，根基牢固',
  '砖块': '砖石砌筑，根基牢固',
  
  // 植物
  '花': '奇葩异卉，芬芳馥郁',
  '树': '参天古木，枝繁叶茂',
  '草': '绿草如茵，生机勃勃',
  '竹': '翠竹修长，虚心有节',
  '梅': '寒梅傲雪，铁骨铮铮',
  '兰': '幽兰空谷，清香四溢',
  '松': '苍松翠柏，长青不老',
  
  // 元素（使用更明确的匹配避免冲突）
  '木屋': '木构居所，甲木之精',
  '水晶': '水晶之属，壬水之灵',
  '火焰': '炽热火焰，丙火之光',
  '土地': '土地厚德，戊土之质',
}

/**
 * 将自然语言快速转换为命理风格描述
 * 使用简单的字符串匹配，适用于简单场景
 */
export function quickNaturalToMingli(text: string): string {
  let result = text
  
  // 按长度降序排序关键字，确保先匹配长的
  const sortedKeys = Object.keys(QUICK_MAPPINGS).sort((a, b) => b.length - a.length)
  
  for (const key of sortedKeys) {
    const regex = new RegExp(key, 'gi')
    result = result.replace(regex, QUICK_MAPPINGS[key])
  }
  
  return result
}

/**
 * 使用AI将自然语言转换为命理风格描述
 * @param input 用户输入的自然语言
 * @returns 命理风格的描述
 */
export async function naturalToMingliPrompt(input: string): Promise<string> {
  // 先尝试快速转换
  const quickResult = quickNaturalToMingli(input)
  
  // 如果输入包含需要AI处理的复杂描述，调用API
  const needsAI = /[创建|建造|生成|设计|构建]/i.test(input) && input.length > 10
  
  if (!needsAI) {
    return quickResult
  }
  
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: input }
        ],
        temperature: 0.9,
        max_tokens: 200
      })
    })
    
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()
    
    if (content) {
      return content
    }
  } catch (error) {
    console.error('Natural to Mingli conversion error:', error)
  }
  
  // 如果API调用失败，返回快速转换的结果
  return quickResult
}

/**
 * 将多个自然语言描述组合成一个命理风格的世界描述
 */
export function combineMingliDescriptions(descriptions: string[]): string {
  const mingliDescriptions = descriptions.map(d => quickNaturalToMingli(d))
  return mingliDescriptions.join('，')
}

/**
 * 从命理描述中提取关键词用于AI生成
 */
export function extractKeywordsForGeneration(mingliText: string): string[] {
  const keywords: string[] = []
  
  // 提取五行元素
  const wuxing = ['金', '木', '水', '火', '土']
  wuxing.forEach(w => {
    if (mingliText.includes(w)) keywords.push(w)
  })
  
  // 提取地形关键词
  const terrains = ['平原', '山', '森林', '河流', '湖泊', '沙漠', '雪地', '洞穴']
  terrains.forEach(t => {
    if (mingliText.includes(t)) keywords.push(t)
  })
  
  // 提取建筑关键词
  const buildings = ['房子', '塔', '寺庙', '宫殿', '桥梁', '花园', '喷泉']
  buildings.forEach(b => {
    if (mingliText.includes(b)) keywords.push(b)
  })
  
  return [...new Set(keywords)]
}

/**
 * 生成用于场景生成的完整提示词
 * 结合命理风格和用户输入
 */
export function generateScenePrompt(userInput: string, zodiac: string, element: string): string {
  const mingliInput = quickNaturalToMingli(userInput)
  
  const basePrompt = `根据${zodiac}生肖和${element}属相，构建以下命理场景：${mingliInput}

要求：
1. 融入五行相生相克之道
2. 符合八卦方位之理
3. 兼顾天时地利人和
4. 营造天人合一的意境
5. 使用以下方块类型来构建：
   - 自然方块：grass, dirt, stone, sand, wood, leaves, flowers
   - 建筑方块：planks, cobblestone, bricks, glass
   - 特殊方块：glowstone, sea_lantern（用于照明）
   - 五行方块：wu_xing_metal, wu_xing_wood, wu_xing_water, wu_xing_fire, wu_xing_earth
   - 命理方块：bagua_qian, bagua_kun, ziwei_tianji, ziwei_tianzhu等

请描述这个场景的具体结构和氛围。`
  
  return basePrompt
}
