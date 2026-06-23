/**
 * 命运模拟器核心引擎
 * 分析用户数据，生成人生节点和决策树
 */

import { create } from 'zustand'

// ============ 类型定义 ============

export type LifeNode = {
  id: string
  age: number           // 发生年龄
  category: 'career' | 'relationship' | 'health' | 'finance' | 'personal'
  title: string
  description: string
  choices: Choice[]
  importance: 'low' | 'medium' | 'high' | 'critical'
  probability: number   // 发生概率 0-1
}

export type Choice = {
  id: string
  label: string
  description: string
  consequence: Consequence
}

export type Consequence = {
  shortTerm: string
  mediumTerm: string
  longTerm: string
  impact: {
    happiness: number   // -100 到 +100
    success: number     // -100 到 +100
    health: number      // -100 到 +100
    wealth: number      // -100 到 +100
  }
}

export type DestinyPath = {
  id: string
  name: string
  nodes: string[]       // 选择的节点ID
  choices: { nodeId: string; choiceId: string }[]
  finalOutcome: Outcome
}

export type Outcome = {
  happiness: number
  success: number
  health: number
  wealth: number
  summary: string
  recommendations: string[]
}

type DestinyStore = {
  // 状态
  userData: UserData | null
  nodes: LifeNode[]
  currentPath: DestinyPath | null
  selectedChoices: Record<string, string>  // nodeId -> choiceId
  isAnalyzing: boolean
  analysisError: string | null
  
  // 方法
  analyzeDestiny: (data: UserData) => Promise<void>
  selectChoice: (nodeId: string, choiceId: string) => void
  resetAnalysis: () => void
  exportReport: () => string
}

export type UserData = {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  gender: 'male' | 'female' | 'other'
  currentAge: number
  occupation?: string
  relationshipStatus?: 'single' | 'married' | 'dating' | 'divorced'
  healthStatus?: 'excellent' | 'good' | 'average' | 'poor'
  financialStatus?: 'wealthy' | 'comfortable' | 'average' | 'struggling'
  goals?: string[]
  concerns?: string[]
}

// ============ Store 实现 ============
export const useDestinyStore = create<DestinyStore>((set, get) => ({
  userData: null,
  nodes: [],
  currentPath: null,
  selectedChoices: {},
  isAnalyzing: false,
  analysisError: null,

  analyzeDestiny: async (data) => {
    set({ isAnalyzing: true, analysisError: null })
    
    try {
      // 调用后端分析
      const res = await fetch('http://localhost:3001/api/destiny-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) throw new Error(await res.text())
      const result = await res.json() as { nodes: LifeNode[] }
      
      set({ 
        userData: data, 
        nodes: result.nodes,
        selectedChoices: {},
        currentPath: null 
      })
    } catch (err) {
      // 如果后端不可用，使用本地模拟
      console.log('使用本地分析引擎')
      const nodes = generateSimulatedNodes(data)
      set({ userData: data, nodes, selectedChoices: {}, currentPath: null })
    }
    
    set({ isAnalyzing: false })
  },

  selectChoice: (nodeId, choiceId) => {
    set((s) => ({
      selectedChoices: { ...s.selectedChoices, [nodeId]: choiceId },
    }))
    
    // 检查是否所有节点都已选择
    const { nodes, selectedChoices } = get()
    const allSelected = nodes.every((n) => selectedChoices[n.id])
    
    if (allSelected) {
      calculateFinalPath()
    }
  },

  resetAnalysis: () => {
    set({
      userData: null,
      nodes: [],
      currentPath: null,
      selectedChoices: {},
      analysisError: null,
    })
  },

  exportReport: () => {
    const { userData, nodes, selectedChoices, currentPath } = get()
    if (!userData || !currentPath) return ''
    
    let report = `命运模拟器报告\n\n`
    report += `姓名: ${userData.name}\n`
    report += `出生日期: ${userData.birthYear}-${userData.birthMonth}-${userData.birthDay}\n`
    report += `当前年龄: ${userData.currentAge}\n\n`
    report += `=== 人生节点分析 ===\n\n`
    
    nodes.forEach((node) => {
      const choice = node.choices.find((c) => c.id === selectedChoices[node.id])
      report += `【${node.age}岁】${node.title}\n`
      report += `描述: ${node.description}\n`
      report += `选择: ${choice?.label || '未选择'}\n\n`
    })
    
    report += `=== 最终命运 ===\n\n`
    report += `幸福指数: ${currentPath.finalOutcome.happiness}\n`
    report += `成功指数: ${currentPath.finalOutcome.success}\n`
    report += `健康指数: ${currentPath.finalOutcome.health}\n`
    report += `财富指数: ${currentPath.finalOutcome.wealth}\n\n`
    report += `总结: ${currentPath.finalOutcome.summary}\n\n`
    report += `建议:\n`
    currentPath.finalOutcome.recommendations.forEach((r, i) => {
      report += `${i + 1}. ${r}\n`
    })
    
    return report
  },
}))

// ============ 本地模拟分析引擎 ============
function generateSimulatedNodes(data: UserData): LifeNode[] {
  const nodes: LifeNode[] = []
  
  // 根据年龄生成节点
  const baseAge = data.currentAge
  
  // 职业节点
  nodes.push({
    id: 'career-1',
    age: baseAge + 2,
    category: 'career',
    title: '职业转折点',
    description: '你将面临一个重要的职业选择，这将影响你未来5年的职业发展轨迹。',
    importance: 'critical',
    probability: 0.9,
    choices: [
      {
        id: 'c1-a',
        label: '接受新工作机会',
        description: '接受一家更有发展潜力的公司的邀请',
        consequence: {
          shortTerm: '短期内收入增加，工作压力增大',
          mediumTerm: '获得更多晋升机会，拓展人脉',
          longTerm: '职业发展加速，可能成为行业精英',
          impact: { happiness: 30, success: 50, health: -10, wealth: 40 },
        },
      },
      {
        id: 'c1-b',
        label: '留在原公司',
        description: '继续在当前公司发展，积累经验',
        consequence: {
          shortTerm: '稳定舒适，收入平稳',
          mediumTerm: '逐步晋升，工作生活平衡',
          longTerm: '成为公司中坚力量，稳定性高',
          impact: { happiness: 20, success: 20, health: 20, wealth: 10 },
        },
      },
      {
        id: 'c1-c',
        label: '创业',
        description: '放弃稳定工作，追逐创业梦想',
        consequence: {
          shortTerm: '压力巨大，收入不稳定',
          mediumTerm: '可能成功也可能失败',
          longTerm: '成功则财务自由，失败则重新开始',
          impact: { happiness: 10, success: 70, health: -30, wealth: 60 },
        },
      },
    ],
  })
  
  // 关系节点
  nodes.push({
    id: 'rel-1',
    age: baseAge + 3,
    category: 'relationship',
    title: '感情抉择',
    description: '一段重要的感情关系将面临考验或机会。',
    importance: 'high',
    probability: 0.85,
    choices: [
      {
        id: 'r1-a',
        label: '结婚/稳定关系',
        description: '与伴侣建立稳定的长期关系',
        consequence: {
          shortTerm: '幸福感提升，责任增加',
          mediumTerm: '共同生活，共同规划未来',
          longTerm: '建立家庭，人生更加完整',
          impact: { happiness: 50, success: 10, health: 20, wealth: -10 },
        },
      },
      {
        id: 'r1-b',
        label: '保持现状',
        description: '维持当前的关系状态',
        consequence: {
          shortTerm: '继续享受恋爱的甜蜜',
          mediumTerm: '关系可能发展也可能变化',
          longTerm: '未来充满不确定性',
          impact: { happiness: 20, success: 5, health: 10, wealth: 5 },
        },
      },
      {
        id: 'r1-c',
        label: '结束关系',
        description: '结束当前关系，重新开始',
        consequence: {
          shortTerm: '痛苦但自由',
          mediumTerm: '自我成长，重新寻找方向',
          longTerm: '可能找到更合适的伴侣',
          impact: { happiness: -20, success: 15, health: 5, wealth: 10 },
        },
      },
    ],
  })
  
  // 健康节点
  nodes.push({
    id: 'health-1',
    age: baseAge + 5,
    category: 'health',
    title: '健康觉醒',
    description: '健康问题将迫使你重新审视生活方式。',
    importance: 'critical',
    probability: 0.7,
    choices: [
      {
        id: 'h1-a',
        label: '积极改变',
        description: '开始健身、调整饮食、关注心理健康',
        consequence: {
          shortTerm: '需要付出时间和努力',
          mediumTerm: '身体状况明显改善',
          longTerm: '延长健康寿命，提高生活质量',
          impact: { happiness: 25, success: 15, health: 60, wealth: -5 },
        },
      },
      {
        id: 'h1-b',
        label: '维持现状',
        description: '继续当前的生活方式',
        consequence: {
          shortTerm: '暂时舒适',
          mediumTerm: '健康状况可能恶化',
          longTerm: '可能出现严重健康问题',
          impact: { happiness: 5, success: 0, health: -30, wealth: 0 },
        },
      },
    ],
  })
  
  // 财务节点
  nodes.push({
    id: 'finance-1',
    age: baseAge + 7,
    category: 'finance',
    title: '财务决策',
    description: '一个重要的投资或财务决策机会出现。',
    importance: 'high',
    probability: 0.6,
    choices: [
      {
        id: 'f1-a',
        label: '投资创业项目',
        description: '投资一个有潜力的创业项目',
        consequence: {
          shortTerm: '资金有风险',
          mediumTerm: '可能获得高额回报',
          longTerm: '财务状况可能大幅改善',
          impact: { happiness: 15, success: 30, health: -5, wealth: 70 },
        },
      },
      {
        id: 'f1-b',
        label: '保守投资',
        description: '投资低风险理财产品',
        consequence: {
          shortTerm: '安心稳定',
          mediumTerm: '稳步增值',
          longTerm: '财务安全有保障',
          impact: { happiness: 20, success: 10, health: 10, wealth: 30 },
        },
      },
      {
        id: 'f1-c',
        label: '消费享受',
        description: '用积蓄享受生活',
        consequence: {
          shortTerm: '即时满足感',
          mediumTerm: '生活品质提升',
          longTerm: '财务积累较慢',
          impact: { happiness: 35, success: -5, health: 15, wealth: -20 },
        },
      },
    ],
  })
  
  // 个人成长节点
  nodes.push({
    id: 'personal-1',
    age: baseAge + 10,
    category: 'personal',
    title: '人生转折',
    description: '一个改变人生方向的机会或挑战出现。',
    importance: 'critical',
    probability: 0.8,
    choices: [
      {
        id: 'p1-a',
        label: '追求梦想',
        description: '放下一切，追求内心真正想要的',
        consequence: {
          shortTerm: '风险和不确定性',
          mediumTerm: '自我发现和成长',
          longTerm: '实现人生价值，不留遗憾',
          impact: { happiness: 60, success: 40, health: 20, wealth: -10 },
        },
      },
      {
        id: 'p1-b',
        label: '维持稳定',
        description: '继续当前的生活轨迹',
        consequence: {
          shortTerm: '安全舒适',
          mediumTerm: '稳步前进',
          longTerm: '可能会有遗憾',
          impact: { happiness: 30, success: 25, health: 15, wealth: 25 },
        },
      },
    ],
  })
  
  return nodes.sort((a, b) => a.age - b.age)
}

// ============ 计算最终路径 ============
function calculateFinalPath() {
  const { nodes, selectedChoices, userData } = useDestinyStore.getState()
  
  if (!userData) return
  
  let totalHappiness = 50
  let totalSuccess = 50
  let totalHealth = 50
  let totalWealth = 50
  
  const recommendations: string[] = []
  
  nodes.forEach((node) => {
    const choiceId = selectedChoices[node.id]
    const choice = node.choices.find((c) => c.id === choiceId)
    
    if (choice) {
      totalHappiness += choice.consequence.impact.happiness
      totalSuccess += choice.consequence.impact.success
      totalHealth += choice.consequence.impact.health
      totalWealth += choice.consequence.impact.wealth
      
      // 根据选择生成建议
      if (node.category === 'health' && choiceId === 'h1-b') {
        recommendations.push('请关注您的健康状况，适当调整生活方式')
      }
      if (node.category === 'career' && choiceId === 'c1-c') {
        recommendations.push('创业有风险，请做好充分准备')
      }
      if (node.category === 'relationship' && choiceId === 'r1-c') {
        recommendations.push('结束关系后请关注心理健康')
      }
    }
  })
  
  // 限制在 0-100
  totalHappiness = Math.max(0, Math.min(100, totalHappiness))
  totalSuccess = Math.max(0, Math.min(100, totalSuccess))
  totalHealth = Math.max(0, Math.min(100, totalHealth))
  totalWealth = Math.max(0, Math.min(100, totalWealth))
  
  // 生成总结
  let summary = '你的人生路径分析完成。'
  if (totalHappiness >= 70) summary += '你选择了一条注重幸福的人生道路。'
  if (totalSuccess >= 70) summary += '你追求事业上的卓越成就。'
  if (totalHealth >= 70) summary += '你重视健康和生活平衡。'
  if (totalWealth >= 70) summary += '你实现了良好的财务状况。'
  
  if (totalHappiness < 50) recommendations.push('可以更多关注自己的情感需求')
  if (totalSuccess < 50) recommendations.push('可以设定一些职业目标')
  if (totalHealth < 50) recommendations.push('健康是一切的基础，请多加关注')
  if (totalWealth < 50) recommendations.push('可以学习一些理财知识')
  
  const path: DestinyPath = {
    id: `path-${Date.now()}`,
    name: `${userData.name}的命运路径`,
    nodes: nodes.map((n) => n.id),
    choices: Object.entries(selectedChoices).map(([nodeId, choiceId]) => ({ nodeId, choiceId })),
    finalOutcome: {
      happiness: Math.round(totalHappiness),
      success: Math.round(totalSuccess),
      health: Math.round(totalHealth),
      wealth: Math.round(totalWealth),
      summary,
      recommendations: recommendations.length > 0 ? recommendations : ['继续保持，你的人生道路很平衡'],
    },
  }
  
  useDestinyStore.setState({ currentPath: path })
}
