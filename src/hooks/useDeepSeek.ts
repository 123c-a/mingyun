import { useUniverseStore, Universe, FateProfile, LifeNode, FateOverview, DailyCard } from '../store/universeStore'
import { speech } from '../store/speechStore'

const API_URL = 'http://localhost:3001/api/universes'
const FATE_PROFILE_URL = 'http://localhost:3001/api/fate-profile'
const LIFE_NODES_URL = 'http://localhost:3001/api/life-nodes'
const FATE_OVERVIEW_URL = 'http://localhost:3001/api/fate-overview'
const DAILY_CARD_URL = 'http://localhost:3001/api/daily-card'

export async function fetchUniverses(userInput: string): Promise<Universe[]> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `请求失败: ${response.status}`)
  }

  const data = await response.json()
  return data.universes || []
}

// ===== 命运节目新增函数 =====

export async function fetchFateProfile(params: {
  birthYear: number | string
  birthMonth: number | string
  birthDay: number | string
  birthHour?: number | string
  gender?: string
  name?: string
}): Promise<FateProfile> {
  const response = await fetch(FATE_PROFILE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || '命运底色分析失败')
  }
  const data = await response.json()
  return data.profile
}

export async function fetchLifeNodes(fateProfile: FateProfile, userInput?: string): Promise<LifeNode[]> {
  const response = await fetch(LIFE_NODES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fate_profile: fateProfile, userInput }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || '人生节点生成失败')
  }
  const data = await response.json()
  return data.nodes || []
}

// 生成某个节点的两条分支宇宙
export async function fetchNodeUniverses(
  node: LifeNode,
  fateProfile: FateProfile
): Promise<{ branch_a: Universe; branch_b: Universe }> {
  // 分支A
  const responseA = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInput: `${node.node_name}节点：选择${node.choice_a.label}（${node.choice_a.universe_hint}）`,
      fate_profile: fateProfile,
      life_node: {
        node_name: node.node_name,
        node_description: node.node_description,
        choice_a: node.choice_a.label,
        choice_b: node.choice_b.label,
      },
    }),
  })
  if (!responseA.ok) throw new Error('分支A生成失败')
  const dataA = await responseA.json()

  // 分支B
  const responseB = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInput: `${node.node_name}节点：选择${node.choice_b.label}（${node.choice_b.universe_hint}）`,
      fate_profile: fateProfile,
      life_node: {
        node_name: node.node_name,
        node_description: node.node_description,
        choice_a: node.choice_a.label,
        choice_b: node.choice_b.label,
      },
    }),
  })
  if (!responseB.ok) throw new Error('分支B生成失败')
  const dataB = await responseB.json()

  return {
    branch_a: (dataA.universes && dataA.universes[0]) || {
      universe_name: '未知宇宙',
      probability: 50,
      description: '宇宙观测失败',
      emotion_tags: ['神秘'],
    },
    branch_b: (dataB.universes && dataB.universes[0]) || {
      universe_name: '未知宇宙',
      probability: 50,
      description: '宇宙观测失败',
      emotion_tags: ['神秘'],
    },
  }
}

export async function fetchFateOverview(
  universes: Universe[],
  fateProfile: FateProfile
): Promise<FateOverview> {
  const response = await fetch(FATE_OVERVIEW_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ universes, fate_profile: fateProfile }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || '命运总览生成失败')
  }
  const data = await response.json()
  return data.overview
}

export async function fetchDailyCard(fateProfile?: FateProfile): Promise<DailyCard> {
  const response = await fetch(DAILY_CARD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fate_profile: fateProfile }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || '今日签文生成失败')
  }
  const data = await response.json()
  return data.card
}

export function useDeepSeek() {
  const { setUniverses, setLoading, addToHistory, setUserInput,
    setFateProfile, setLoadingFateProfile,
    setLifeNodes, setLoadingNodes,
    setNodeBranch, setGeneratingNode,
    setFateOverview, setLoadingOverview,
    setDailyCard, setLoadingDailyCard,
  } = useUniverseStore()

  const generateUniverses = async (userInput: string) => {
    setLoading(true)
    speech.scenes.observeStart()
    try {
      const universes = await fetchUniverses(userInput)
      setUniverses(universes)
      if (universes.length > 0) {
        addToHistory({
          id: `obs-${Date.now()}`,
          userInput,
          universes,
          timestamp: Date.now(),
        })
      }
      speech.scenes.observeComplete(universes.length)
    } catch (error) {
      speech.scenes.apiError()
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ===== 命运节目新增方法 =====
  const generateFateProfile = async (params: Parameters<typeof fetchFateProfile>[0]) => {
    setLoadingFateProfile(true)
    try {
      const profile = await fetchFateProfile(params)
      setFateProfile(profile)
      return profile
    } catch (error) {
      speech.scenes.apiError()
      throw error
    } finally {
      setLoadingFateProfile(false)
    }
  }

  const generateLifeNodes = async (profile: FateProfile, userInput?: string) => {
    setLoadingNodes(true)
    try {
      const nodes = await fetchLifeNodes(profile, userInput)
      setLifeNodes(nodes)
      return nodes
    } catch (error) {
      throw error
    } finally {
      setLoadingNodes(false)
    }
  }

  const generateNodeUniverses = async (node: LifeNode, profile: FateProfile) => {
    setGeneratingNode(true)
    try {
      const { branch_a, branch_b } = await fetchNodeUniverses(node, profile)
      setNodeBranch(node.node_id, 'a', branch_a)
      setNodeBranch(node.node_id, 'b', branch_b)
      return { branch_a, branch_b }
    } catch (error) {
      throw error
    } finally {
      setGeneratingNode(false)
    }
  }

  const generateFateOverview = async (universes: Universe[], profile: FateProfile) => {
    setLoadingOverview(true)
    try {
      const overview = await fetchFateOverview(universes, profile)
      setFateOverview(overview)
      return overview
    } catch (error) {
      throw error
    } finally {
      setLoadingOverview(false)
    }
  }

  const generateDailyCard = async (profile?: FateProfile) => {
    setLoadingDailyCard(true)
    try {
      const card = await fetchDailyCard(profile)
      setDailyCard(card)
      return card
    } catch (error) {
      throw error
    } finally {
      setLoadingDailyCard(false)
    }
  }

  const restoreFromHistory = (input: string, universes: Universe[]) => {
    setUserInput(input)
    setUniverses(universes)
  }

  return {
    generateUniverses,
    restoreFromHistory,
    generateFateProfile,
    generateLifeNodes,
    generateNodeUniverses,
    generateFateOverview,
    generateDailyCard,
  }
}