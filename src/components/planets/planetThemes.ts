// 星球系统 - 通用视觉工具
// 每个星球有统一的极简卡片 + 星轨粒子动画风格

export interface PlanetTheme {
  id: string
  name: string
  subtitle: string
  description: string
  primaryColor: string
  secondaryColor: string
  glowColor: string
  particleColor: string
  bgGradient: string
  accentText: string
}

export const PLANET_THEMES: Record<string, PlanetTheme> = {
  mercury: {
    id: 'mercury',
    name: '水星',
    subtitle: '思绪清',
    description: '清理思维噪音，让文字自然流淌',
    primaryColor: '#b8c6ff',
    secondaryColor: '#4a5a8a',
    glowColor: 'rgba(184, 198, 255, 0.5)',
    particleColor: '#c8d4ff',
    bgGradient: 'radial-gradient(ellipse at 30% 40%, rgba(100, 120, 180, 0.25) 0%, rgba(15, 20, 40, 0.95) 60%, #0a0d18 100%)',
    accentText: '#d0d8ff',
  },
  venus: {
    id: 'venus',
    name: '金星',
    subtitle: '情之湾',
    description: '温柔修复爱的能量',
    primaryColor: '#ffb3d9',
    secondaryColor: '#8a5a7a',
    glowColor: 'rgba(255, 179, 217, 0.5)',
    particleColor: '#ffd6ea',
    bgGradient: 'radial-gradient(ellipse at 40% 35%, rgba(255, 179, 217, 0.22) 0%, rgba(40, 20, 40, 0.95) 60%, #15101c 100%)',
    accentText: '#ffd6ea',
  },
  earth: {
    id: 'earth',
    name: '地球',
    subtitle: '释怀锚',
    description: '安放遗憾，落地生根',
    primaryColor: '#7fc8e8',
    secondaryColor: '#3a6a8a',
    glowColor: 'rgba(127, 200, 232, 0.5)',
    particleColor: '#a8d8ea',
    bgGradient: 'radial-gradient(ellipse at 35% 45%, rgba(127, 200, 232, 0.25) 0%, rgba(15, 30, 50, 0.95) 60%, #0a1520 100%)',
    accentText: '#c8d8ea',
  },
  mars: {
    id: 'mars',
    name: '火星',
    subtitle: '心火炼',
    description: '愤怒化为热情的炼金术',
    primaryColor: '#ff8a6a',
    secondaryColor: '#8a4a3a',
    glowColor: 'rgba(255, 138, 106, 0.5)',
    particleColor: '#ffaa8a',
    bgGradient: 'radial-gradient(ellipse at 30% 40%, rgba(255, 100, 70, 0.22) 0%, rgba(40, 20, 15, 0.95) 60%, #1a0f0a 100%)',
    accentText: '#ffc8aa',
  },
  jupiter: {
    id: 'jupiter',
    name: '木星',
    subtitle: '贵人图',
    description: '看见人生的机会与祝福',
    primaryColor: '#ffd89a',
    secondaryColor: '#8a6a3a',
    glowColor: 'rgba(255, 216, 154, 0.5)',
    particleColor: '#ffe8ba',
    bgGradient: 'radial-gradient(ellipse at 50% 35%, rgba(255, 200, 120, 0.22) 0%, rgba(50, 35, 20, 0.95) 60%, #1a1510 100%)',
    accentText: '#ffe8ba',
  },
  saturn: {
    id: 'saturn',
    name: '土星',
    subtitle: '年轮庭',
    description: '时间的重量，也是礼物',
    primaryColor: '#c8b898',
    secondaryColor: '#6a5a3a',
    glowColor: 'rgba(200, 184, 152, 0.5)',
    particleColor: '#d8c8a8',
    bgGradient: 'radial-gradient(ellipse at 45% 40%, rgba(200, 184, 152, 0.22) 0%, rgba(35, 30, 25, 0.95) 60%, #15120f 100%)',
    accentText: '#e8d8b8',
  },
  uranus: {
    id: 'uranus',
    name: '天王星',
    subtitle: '脱壳门',
    description: '打破惯性，自由重生',
    primaryColor: '#9affd9',
    secondaryColor: '#3a8a7a',
    glowColor: 'rgba(154, 255, 217, 0.5)',
    particleColor: '#baffd9',
    bgGradient: 'radial-gradient(ellipse at 40% 35%, rgba(154, 255, 217, 0.22) 0%, rgba(15, 40, 35, 0.95) 60%, #0a1a18 100%)',
    accentText: '#baffd9',
  },
  neptune: {
    id: 'neptune',
    name: '海王星',
    subtitle: '梦境河',
    description: '潜意识的流淌与启示',
    primaryColor: '#b8a8ff',
    secondaryColor: '#6a5a9a',
    glowColor: 'rgba(184, 168, 255, 0.5)',
    particleColor: '#d0c8ff',
    bgGradient: 'radial-gradient(ellipse at 40% 40%, rgba(184, 168, 255, 0.22) 0%, rgba(25, 25, 50, 0.95) 60%, #0f0f1a 100%)',
    accentText: '#d0c8ff',
  },
}

export function getTheme(id: string): PlanetTheme {
  return PLANET_THEMES[id] || PLANET_THEMES.earth
}
