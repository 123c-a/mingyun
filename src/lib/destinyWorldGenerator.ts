import { calculateBazi, analyzeFiveElements, generateFullReport, FiveElementKey, FiveElementAnalysis } from './astrologyEngine'
import type { BlockType } from '../components/voxel/voxelWorldStore'

// ============ 五行元素与世界生成的深度结合配置 ============

/**
 * 五行元素对世界生成的增强配置
 * 根据用户八字中的五行强弱，动态调整世界生成的方块、颜色、氛围
 */
export const WUXING_WORLD_CONFIG: Record<FiveElementKey, {
  // 世界主题
  worldTheme: {
    title: string
    description: string
    atmosphere: '神秘' | '宁静' | '热烈' | '生機' | '厚重'
    colorScheme: string[]
  }
  // 地形配置
  terrain: {
    primary: WorldZone['terrainType']  // 主要地形
    secondary: WorldZone['terrainType'] // 次要地形
    special: WorldZone['terrainType']   // 特殊地形
  }
  // 基础方块配置
  baseBlocks: {
    ground: BlockType      // 地面方块
    path: BlockType        // 道路方块
    wall: BlockType        // 墙壁方块
    accent: BlockType      // 装饰方块
  }
  // 建筑风格
  architecture: {
    style: '古典' | '自然' | '神秘' | '现代' | '寺庙'
    materials: BlockType[]
  }
  // 特殊效果方块
  specialBlocks: BlockType[]
  // 五行特效方块
  wuxingEffectBlocks: BlockType[]
}> = {
  '金': {
    worldTheme: {
      title: '庚金世界',
      description: '锐利而纯净的金属世界，光芒四射，坚不可摧',
      atmosphere: '热烈',
      colorScheme: ['#c8c8d0', '#ffd700', '#ff6600', '#e8e8e8']
    },
    terrain: {
      primary: 'mountain',
      secondary: 'plain',
      special: 'mystic'
    },
    baseBlocks: {
      ground: 'iron',
      path: 'smooth_stone',
      wall: 'iron_block',
      accent: 'gold'
    },
    architecture: {
      style: '现代',
      materials: ['iron_block', 'gold_block', 'glass', 'diamond_block']
    },
    specialBlocks: ['iron_bars', 'redstone_torch', 'oak_button'],
    wuxingEffectBlocks: ['wu_xing_metal', 'gold', 'diamond', 'glowstone']
  },
  '木': {
    worldTheme: {
      title: '甲木世界',
      description: '生机勃勃的森林世界，万物生长，欣欣向荣',
      atmosphere: '生機',
      colorScheme: ['#4a8c3f', '#80b020', '#2d6b2d', '#6ab84a']
    },
    terrain: {
      primary: 'forest',
      secondary: 'river',
      special: 'lake'
    },
    baseBlocks: {
      ground: 'oak_planks',
      path: 'spruce_planks',
      wall: 'oak_log',
      accent: 'oak_leaves'
    },
    architecture: {
      style: '自然',
      materials: ['oak_log', 'birch_log', 'spruce_planks', 'oak_leaves']
    },
    specialBlocks: ['vines', 'flower_red', 'flower_yellow', 'mushroom_brown', 'lilac'],
    wuxingEffectBlocks: ['wu_xing_wood', 'spruce_leaves', 'birch_leaves', 'jungle_leaves', 'moss_block']
  },
  '水': {
    worldTheme: {
      title: '壬水世界',
      description: '灵动深邃的水之世界，智慧如海，包容万象',
      atmosphere: '宁静',
      colorScheme: ['#4488cc', '#3080d0', '#1a5080', '#60b8e8']
    },
    terrain: {
      primary: 'lake',
      secondary: 'river',
      special: 'mystic'
    },
    baseBlocks: {
      ground: 'sand',
      path: 'sandstone',
      wall: 'prismarine',
      accent: 'sea_lantern'
    },
    architecture: {
      style: '古典',
      materials: ['prismarine', 'prismarine_bricks', 'dark_prismarine', 'sea_lantern']
    },
    specialBlocks: ['water', 'ice', 'packed_ice', 'kelp', 'seagrass', 'tall_seagrass'],
    wuxingEffectBlocks: ['wu_xing_water', 'ice', 'blue_ice', 'sea_lantern', 'glowstone']
  },
  '火': {
    worldTheme: {
      title: '丙火世界',
      description: '热烈燃烧的火之世界，热情洋溢，照亮前路',
      atmosphere: '热烈',
      colorScheme: ['#ff6644', '#ff4400', '#ffaa00', '#ff8844']
    },
    terrain: {
      primary: 'mountain',
      secondary: 'desert',
      special: 'mystic'
    },
    baseBlocks: {
      ground: 'netherrack',
      path: 'brick',
      wall: 'bricks',
      accent: 'glowstone'
    },
    architecture: {
      style: '寺庙',
      materials: ['brick', 'bricks', 'glowstone', 'nether_bricks', 'quartz_block']
    },
    specialBlocks: ['redstone_torch', 'soul_torch', 'lantern', 'soul_lantern'],
    wuxingEffectBlocks: ['wu_xing_fire', 'glowstone', 'soul_lantern', 'netherrack']
  },
  '土': {
    worldTheme: {
      title: '戊土世界',
      description: '厚重稳定的土之世界，承载万物，根基牢固',
      atmosphere: '厚重',
      colorScheme: ['#8b6b4a', '#6a5030', '#d8c870', '#c8a060']
    },
    terrain: {
      primary: 'plain',
      secondary: 'mountain',
      special: 'mystic'
    },
    baseBlocks: {
      ground: 'dirt',
      path: 'cobblestone',
      wall: 'stone_bricks',
      accent: 'gold'
    },
    architecture: {
      style: '古典',
      materials: ['cobblestone', 'stone', 'stone_bricks', 'bricks', 'oak_planks']
    },
    specialBlocks: ['grass', 'dirt', 'gravel', 'clay', 'mossy_cobblestone'],
    wuxingEffectBlocks: ['wu_xing_earth', 'granite', 'diorite', 'andesite', 'bedrock']
  }
}

/**
 * 根据用户五行分析结果，生成加权元素配置
 * 用于在五行强弱不同时，调整方块使用的比例
 */
export function getWeightedElementConfig(fiveElements: FiveElementAnalysis): {
  primaryElement: FiveElementKey
  secondaryElement: FiveElementKey
  baseWeight: number      // 主元素权重
  accentWeight: number    // 辅助元素权重
  weaknessWeight: number  // 弱元素权重（较少使用）
} {
  const { dominant, weakest, scores } = fiveElements
  
  // 从scores中提取各元素的score值（FiveElementKey是'金','木','水','火','土'）
  const metal = scores['金']?.score || 0
  const wood = scores['木']?.score || 0
  const water = scores['水']?.score || 0
  const fire = scores['火']?.score || 0
  const earth = scores['土']?.score || 0
  
  const elements: Array<{ key: FiveElementKey; value: number }> = [
    { key: '金', value: metal },
    { key: '木', value: wood },
    { key: '水', value: water },
    { key: '火', value: fire },
    { key: '土', value: earth }
  ]

  // 排序获取第二强元素
  elements.sort((a, b) => b.value - a.value)
  const primaryElement = dominant || elements[0].key
  const secondaryElement = elements.find(e => e.key !== primaryElement)?.key || '土'

  // 计算权重
  const total = metal + wood + water + fire + earth
  const baseWeight = dominant ? (scores[dominant]?.score || 0) / total : 0.3
  const accentWeight = 0.15
  const weaknessWeight = 0.05

  return {
    primaryElement,
    secondaryElement,
    baseWeight,
    accentWeight,
    weaknessWeight
  }
}

/**
 * 根据五行配置选择随机方块
 * @param element 五行元素
 * @param blockPool 可选的方块池
 * @param preferPrimary 是否优先使用主元素方块
 */
export function selectElementBlock(
  element: FiveElementKey,
  blockPool: BlockType[],
  preferPrimary: boolean = true
): BlockType {
  const config = WUXING_WORLD_CONFIG[element]

  // 筛选出符合五行元素的方块
  const matchingBlocks = blockPool.filter(b =>
    config.wuxingEffectBlocks.includes(b) ||
    config.specialBlocks.includes(b) ||
    config.baseBlocks.ground === b ||
    config.baseBlocks.accent === b
  )

  // 如果有匹配的方块，随机选择一个
  if (matchingBlocks.length > 0) {
    return matchingBlocks[Math.floor(Math.random() * matchingBlocks.length)]
  }

  // 否则从配置的材料中选择
  if (config.architecture.materials.length > 0) {
    return config.architecture.materials[Math.floor(Math.random() * config.architecture.materials.length)] as BlockType
  }

  // 默认返回地面方块
  return config.baseBlocks.ground
}

export interface WorldZone {
  id: string
  name: string
  x: number
  z: number
  width: number
  height: number
  terrainType: 'plain' | 'mountain' | 'forest' | 'river' | 'lake' | 'desert' | 'snow' | 'mystic'
  structures: WorldStructure[]
}

export interface WorldStructure {
  id: string
  type: 'temple' | 'tower' | 'house' | 'garden' | 'gate' | 'monument' | 'fountain' | 'bridge'
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  blocks: StructureBlock[]
}

export interface StructureBlock {
  x: number
  y: number
  z: number
  type: string
}

export interface DestinyWorld {
  title: string
  description: string
  seed: number
  zones: WorldZone[]
  specialLocations: SpecialLocation[]
}

export interface SpecialLocation {
  id: string
  name: string
  x: number
  y: number
  z: number
  type: 'birthstone' | 'energy_point' | 'portal' | 'treasure' | 'mystery'
  description: string
}

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'your-api-key-here'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function generateDestinyWorld(birthYear: number, birthMonth: number, birthDay: number, birthHour: number): Promise<DestinyWorld> {
  const bazi = calculateBazi(birthYear, birthMonth, birthDay, birthHour)
  const fiveElements = analyzeFiveElements(bazi)
  const dominantElement = fiveElements.dominant || '土'
  
  // 获取五行世界配置
  const wuxingConfig = WUXING_WORLD_CONFIG[dominantElement]
  const weightedConfig = getWeightedElementConfig(fiveElements)
  
  try {
    const prompt = `
你是一位精通中国传统风水学和命理的大师，请根据以下命理信息设计一个3D沙盒世界：

命理信息：
- 生肖：${bazi.zodiac}
- 日主：${bazi.day.stem}${bazi.day.branch}
- 五行：${dominantElement}强，${fiveElements.weakest}弱
- 八字：${bazi.year.stem}${bazi.year.branch} ${bazi.month.stem}${bazi.month.branch} ${bazi.day.stem}${bazi.day.branch} ${bazi.hour.stem}${bazi.hour.branch}

世界主题：${wuxingConfig.worldTheme.title}
世界氛围：${wuxingConfig.worldTheme.atmosphere}感
主要地形：${wuxingConfig.terrain.primary}，次要地形：${wuxingConfig.terrain.secondary}
建筑风格：${wuxingConfig.architecture.style}
色彩方案：${wuxingConfig.worldTheme.colorScheme.join('、')}

请设计一个与命理相匹配的世界，包含：
1. 世界主题和描述
2. 3-5个区域（每个区域包含地形类型和主要建筑）
3. 3-5个特殊地点（如能量点、传送门、宝藏等）

请用JSON格式输出，格式如下：
{
  "title": "世界名称",
  "description": "世界描述",
  "zones": [
    {
      "name": "区域名称",
      "terrain": "plain|mountain|forest|river|lake|desert|snow|mystic",
      "structures": [{"type": "temple|tower|house|garden|gate|monument|fountain", "description": "建筑描述"}]
    }
  ],
  "specialLocations": [
    {"name": "地点名称", "type": "birthstone|energy_point|portal|treasure|mystery", "description": "地点描述"}
  ]
}
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
    
    try {
      const result = JSON.parse(content)
      return buildWorldFromAI(result, dominantElement)
    } catch {
      return generateDefaultWorld(bazi.zodiac, dominantElement)
    }
  } catch (error) {
    console.error('World generation error:', error)
    return generateDefaultWorld(bazi.zodiac, dominantElement)
  }
}

function buildWorldFromAI(aiResult: any, element: FiveElementKey): DestinyWorld {
  const zones: WorldZone[] = []
  let currentZoneX = 0
  
  const zoneList = aiResult.zones || []
  for (let index = 0; index < zoneList.length; index++) {
    const zoneData = zoneList[index]
    const terrainType = mapTerrainType(zoneData.terrain)
    const width = terrainType === 'mountain' ? 20 : 15
    const height = terrainType === 'mountain' ? 15 : 8
    
    const structList = zoneData.structures || []
    const structures: WorldStructure[] = []
    for (let i = 0; i < structList.length; i++) {
      const struct = structList[i]
      const structType = mapStructureType(struct.type)
      const structWidth = 4 + Math.floor(Math.random() * 4)
      const structHeight = 3 + Math.floor(Math.random() * 5)
      const structDepth = 4 + Math.floor(width / 3)
      
      structures.push({
        id: `struct-${index}-${i}`,
        type: structType,
        x: currentZoneX + Math.floor(width / 2),
        y: 0,
        z: Math.floor(height / 2),
        width: structWidth,
        height: structHeight,
        depth: structDepth,
        blocks: generateStructureBlocks(structType, element)
      })
    }
    
    zones.push({
      id: `zone-${index}`,
      name: zoneData.name || `区域${index + 1}`,
      x: currentZoneX,
      z: 0,
      width,
      height,
      terrainType,
      structures
    })
    
    currentZoneX += width + 5
  }
  
  const locList = aiResult.specialLocations || []
  const specialLocations: SpecialLocation[] = []
  for (let i = 0; i < locList.length; i++) {
    const loc = locList[i]
    specialLocations.push({
      id: `loc-${i}`,
      name: loc.name || `神秘地点${i + 1}`,
      x: Math.floor(Math.random() * currentZoneX),
      y: 0,
      z: Math.floor(Math.random() * 20) - 10,
      type: mapLocationType(loc.type),
      description: loc.description || '神秘的力量在此汇聚'
    })
  }
  
  return {
    title: aiResult.title || '命运之境',
    description: aiResult.description || '一个由命运编织的神秘世界',
    seed: Date.now(),
    zones,
    specialLocations
  }
}

function generateDefaultWorld(zodiac: string, element: FiveElementKey): DestinyWorld {
  const zones: WorldZone[] = [
    {
      id: 'zone-0',
      name: '出生之地',
      x: 0,
      z: 0,
      width: 15,
      height: 15,
      terrainType: 'plain',
      structures: [{
        id: 'house-0',
        type: 'house',
        x: 7,
        y: 0,
        z: 7,
        width: 5,
        height: 4,
        depth: 5,
        blocks: generateStructureBlocks('house', element)
      }]
    },
    {
      id: 'zone-1',
      name: '五行圣山',
      x: 20,
      z: 0,
      width: 20,
      height: 20,
      terrainType: 'mountain',
      structures: [{
        id: 'temple-0',
        type: 'temple',
        x: 30,
        y: 12,
        z: 10,
        width: 6,
        height: 8,
        depth: 6,
        blocks: generateStructureBlocks('temple', element)
      }]
    },
    {
      id: 'zone-2',
      name: element === '木' ? '生命之林' : element === '水' ? '智慧之湖' : '神秘领域',
      x: 45,
      z: 0,
      width: 18,
      height: 18,
      terrainType: element === '木' ? 'forest' : element === '水' ? 'lake' : 'mystic',
      structures: [{
        id: 'monument-0',
        type: 'monument',
        x: 54,
        y: 0,
        z: 9,
        width: 3,
        height: 10,
        depth: 3,
        blocks: generateStructureBlocks('monument', element)
      }]
    }
  ]
  
  const specialLocations: SpecialLocation[] = [
    {
      id: 'birthstone',
      name: '本命石',
      x: 7,
      y: 1,
      z: 7,
      type: 'birthstone',
      description: `属于${zodiac}生肖的神秘宝石，蕴含着你的命运能量`
    },
    {
      id: 'energy-peak',
      name: '能量巅峰',
      x: 30,
      y: 15,
      z: 10,
      type: 'energy_point',
      description: '圣山之巅，汇聚天地灵气'
    },
    {
      id: 'mystery-portal',
      name: '命运之门',
      x: 54,
      y: 0,
      z: 9,
      type: 'portal',
      description: '一扇通往未知命运的神秘传送门'
    }
  ]
  
  return {
    title: `${zodiac}的命运世界`,
    description: `一个根据${zodiac}生肖和${element}元素生成的神秘世界`,
    seed: Date.now(),
    zones,
    specialLocations
  }
}

function mapTerrainType(type: string): WorldZone['terrainType'] {
  const map: Record<string, WorldZone['terrainType']> = {
    'plain': 'plain',
    'mountain': 'mountain',
    'forest': 'forest',
    'river': 'river',
    'lake': 'lake',
    'desert': 'desert',
    'snow': 'snow',
    'mystic': 'mystic'
  }
  return map[type] || 'plain'
}

function mapStructureType(type: string): WorldStructure['type'] {
  const map: Record<string, WorldStructure['type']> = {
    'temple': 'temple',
    'tower': 'tower',
    'house': 'house',
    'garden': 'garden',
    'gate': 'gate',
    'monument': 'monument',
    'fountain': 'fountain',
    'bridge': 'bridge'
  }
  return map[type] || 'house'
}

function mapLocationType(type: string): SpecialLocation['type'] {
  const map: Record<string, SpecialLocation['type']> = {
    'birthstone': 'birthstone',
    'energy_point': 'energy_point',
    'portal': 'portal',
    'treasure': 'treasure',
    'mystery': 'mystery'
  }
  return map[type] || 'mystery'
}

function generateStructureBlocks(type: WorldStructure['type'], element: FiveElementKey): StructureBlock[] {
  const blocks: StructureBlock[] = []
  const elementBlocks: Record<FiveElementKey, string> = {
    '金': 'wu_xing_metal',
    '木': 'wu_xing_wood',
    '水': 'wu_xing_water',
    '火': 'wu_xing_fire',
    '土': 'wu_xing_earth'
  }
  
  switch (type) {
    case 'temple':
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          for (let y = 0; y < 4; y++) {
            blocks.push({ x, y, z, type: y === 0 ? 'stone' : 'brick' })
          }
        }
      }
      blocks.push({ x: 0, y: 4, z: 0, type: 'gold' })
      blocks.push({ x: 0, y: 5, z: 0, type: 'bagua_qian' })
      blocks.push({ x: 0, y: 6, z: 0, type: 'ziwei_tianshu' })
      break
      
    case 'tower':
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          for (let y = 0; y < 8; y++) {
            blocks.push({ x, y, z, type: y < 4 ? 'stone' : 'brick' })
          }
        }
      }
      blocks.push({ x: 0, y: 8, z: 0, type: elementBlocks[element] })
      break
      
    case 'house':
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          blocks.push({ x, y: 0, z, type: 'stone' })
          if (x !== -2 && x !== 2 && z !== -2 && z !== 2) {
            blocks.push({ x, y: 1, z, type: 'wood' })
            blocks.push({ x, y: 2, z, type: 'wood' })
          }
        }
      }
      blocks.push({ x: 0, y: 3, z: 0, type: 'wood' })
      break
      
    case 'monument':
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          for (let y = 0; y < 6; y++) {
            blocks.push({ x, y, z, type: y < 3 ? 'stone' : 'gold' })
          }
        }
      }
      blocks.push({ x: 0, y: 6, z: 0, type: 'crystal_ball' })
      break
      
    case 'garden':
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 3; z++) {
          blocks.push({ x, y: 0, z, type: 'grass' })
          if (Math.abs(x) + Math.abs(z) === 4) {
            blocks.push({ x, y: 1, z, type: 'flower_red' })
          }
        }
      }
      blocks.push({ x: 0, y: 0, z: 0, type: 'heart_block' })
      blocks.push({ x: 0, y: 1, z: 0, type: 'crystal_ball' })
      break
      
    case 'fountain':
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          blocks.push({ x, y: 0, z, type: 'stone' })
        }
      }
      blocks.push({ x: 0, y: 1, z: 0, type: 'water' })
      blocks.push({ x: 0, y: 2, z: 0, type: 'water' })
      blocks.push({ x: 0, y: 3, z: 0, type: 'crystal_blue' })
      break
      
    case 'gate':
      blocks.push({ x: -2, y: 0, z: 0, type: 'stone' })
      blocks.push({ x: -2, y: 1, z: 0, type: 'stone' })
      blocks.push({ x: -2, y: 2, z: 0, type: 'stone' })
      blocks.push({ x: 2, y: 0, z: 0, type: 'stone' })
      blocks.push({ x: 2, y: 1, z: 0, type: 'stone' })
      blocks.push({ x: 2, y: 2, z: 0, type: 'stone' })
      blocks.push({ x: -2, y: 3, z: 0, type: 'gold' })
      blocks.push({ x: 2, y: 3, z: 0, type: 'gold' })
      break
  }
  
  return blocks
}

export function renderWorldToBlocks(world: DestinyWorld): { x: number; y: number; z: number; type: BlockType }[] {
  const result: { x: number; y: number; z: number; type: BlockType }[] = []
  
  world.zones.forEach(zone => {
    for (let x = 0; x < zone.width; x++) {
      for (let z = 0; z < zone.height; z++) {
        const worldX = zone.x + x
        const worldZ = zone.z + z
        
        let groundHeight = 0
        let groundBlock: BlockType = 'grass'
        
        switch (zone.terrainType) {
          case 'mountain':
            const distFromCenter = Math.sqrt(Math.pow(x - zone.width/2, 2) + Math.pow(z - zone.height/2, 2))
            groundHeight = Math.floor((1 - distFromCenter / (zone.width/2)) * 10)
            groundBlock = groundHeight > 5 ? 'stone' : groundHeight > 3 ? 'dirt' : 'grass'
            break
          case 'desert':
            groundBlock = 'sand'
            break
          case 'snow':
            groundBlock = 'snow'
            break
          case 'lake':
            groundHeight = -2
            groundBlock = 'water'
            break
          case 'forest':
            groundBlock = 'grass'
            break
          case 'river':
            if (Math.abs(z - zone.height/2) <= 1) {
              groundHeight = -1
              groundBlock = 'water'
            }
            break
          case 'mystic':
            groundBlock = 'stone'
            break
        }
        
        for (let y = 0; y <= groundHeight; y++) {
          result.push({ x: worldX, y, z: worldZ, type: groundBlock })
        }
        
        if (zone.terrainType === 'forest' && Math.random() < 0.15 && x > 2 && x < zone.width - 2 && z > 2 && z < zone.height - 2) {
          for (let y = groundHeight + 1; y <= groundHeight + 5; y++) {
            result.push({ x: worldX, y, z: worldZ, type: 'wood' })
          }
          for (let dy = 1; dy <= 3; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              for (let dz = -1; dz <= 1; dz++) {
                if (Math.abs(dx) + Math.abs(dz) + dy <= 3) {
                  result.push({ x: worldX + dx, y: groundHeight + 4 + dy, z: worldZ + dz, type: 'leaves' })
                }
              }
            }
          }
        }
      }
    }
    
    zone.structures.forEach(struct => {
      struct.blocks.forEach(block => {
        result.push({
          x: zone.x + struct.x + block.x,
          y: struct.y + block.y,
          z: zone.z + struct.z + block.z,
          type: block.type as BlockType
        })
      })
    })
  })
  
  world.specialLocations.forEach(loc => {
    switch (loc.type) {
      case 'birthstone':
        result.push({ x: loc.x, y: loc.y + 1, z: loc.z, type: 'crystal_ball' })
        result.push({ x: loc.x, y: loc.y, z: loc.z, type: 'ziwei_tianshu' })
        break
      case 'energy_point':
        result.push({ x: loc.x, y: loc.y, z: loc.z, type: 'constellation' })
        break
      case 'portal':
        result.push({ x: loc.x, y: loc.y, z: loc.z, type: 'destiny_core' })
        break
      case 'treasure':
        result.push({ x: loc.x, y: loc.y, z: loc.z, type: 'gold' })
        break
    }
  })
  
  return result
}