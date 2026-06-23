import { create } from 'zustand'

// 升级版宇宙数据
export interface Universe {
  universe_name: string
  probability: number
  description: string
  emotion_tags: string[]
  // 新增字段
  atmosphere?: string
  key_character?: {
    name: string
    role: string
  }
  timeline?: Array<{
    year: string
    event: string
  }>
  future_prediction?: string
  fate_symbol?: string
}

export interface UniverseDetail {
  origin_story: string
  physical_laws: string
  social_structure: string
  cultural特征: string
  key_artifacts: string[]
  key_figures: Array<{
    name: string
    title: string
    fate: string
  }>
  turning_points: Array<{
    year: string
    description: string
  }>
  alternate_timelines: Array<{
    name: string
    description: string
  }>
  final_verdict: string
}

export interface FateAnalysis {
  fate_title: string
  core_personality: {
    title: string
    description: string
  }
  inner_fears: string[]
  hidden_desires: string[]
  choice_patterns: {
    title: string
    description: string
  }
  emotional_baseline: {
    dominant: string
    description: string
  }
  fate_guidance: string
  compatibility: {
    best_choice_type: string
    worst_choice_type: string
  }
  life_themes: string[]
  strengths: string[]
  growth_areas: string[]
}

// ===== 命运节目相关类型 =====

export interface FateProfile {
  fate_title: string
  element_profile: string
  soul_essence: string
  personality_tags: string[]
  decision_bias: string
  inner_drive: string
  hidden_fear: string
  emotional_pattern: string
  keywords: string[]
  life_theme: string
  core_challenge: string
  core_gift: string
  growth_roadmap: string
  lucky_info: {
    lucky_color: string
    lucky_number: number | string
    lucky_direction: string
    lucky_time: string
  }
}

export interface LifeNode {
  node_id: number
  node_name: string
  age_range: string
  node_description: string
  choice_a: {
    label: string
    universe_hint: string
  }
  choice_b: {
    label: string
    universe_hint: string
  }
  theme_weight: number
  branch_a?: Universe | null
  branch_b?: Universe | null
}

export interface FateOverview {
  most_likely_universe: string
  radar_scores: {
    career_score: number
    love_score: number
    wealth_score: number
    health_score: number
    freedom_score: number
  }
  fate_symbol: {
    name: string
    meaning: string
  }
  key_years: string[]
  key_person: string
  conclusion: string
  action_advice: string
  action_advice_2?: string
  action_advice_3?: string
  action_advice_list?: string[]
}

export interface DailyCard {
  daily_fortune: string
  fortune_score: number
  lucky_color: string
  lucky_number: number | string
  lucky_direction: string
  today_message: string
  today_theme: string
  recommended_action: string
  avoid_action: string
  universe_insight: string
  fortune_poem: string
}

export interface ObservationRecord {
  id: string
  userInput: string
  universes: Universe[]
  timestamp: number
}

export interface StoryNode {
  id: string
  decision: string
  chosenUniverse: Universe
  timestamp: number
}

export interface CollectedUniverse {
  universe_name: string
  emotion_tags: string[]
  atmosphere?: string
  firstSeen: number
  count: number
}

interface UniverseStore {
  userInput: string
  universes: Universe[]
  isLoading: boolean
  selectedUniverse: Universe | null
  universeDetail: UniverseDetail | null
  isLoadingDetail: boolean
  history: ObservationRecord[]
  compareList: Universe[]
  currentDecision: string
  currentStory: StoryNode[]
  collection: CollectedUniverse[]
  fateUniverse: Universe | null
  isFateRolling: boolean
  fateAnalysis: FateAnalysis | null
  isAnalyzingFate: boolean

  // ===== 命运节目新增状态 =====
  fateProfile: FateProfile | null
  isLoadingFateProfile: boolean
  lifeNodes: LifeNode[]
  isLoadingNodes: boolean
  currentNode: LifeNode | null
  nodeUniverses: { [nodeId: number]: { branch_a: Universe | null; branch_b: Universe | null } }
  isGeneratingNode: boolean
  fateOverview: FateOverview | null
  isLoadingOverview: boolean
  dailyCard: DailyCard | null
  isLoadingDailyCard: boolean

  setUserInput: (input: string) => void
  setUniverses: (universes: Universe[]) => void
  setLoading: (loading: boolean) => void
  selectUniverse: (universe: Universe | null) => void
  setUniverseDetail: (detail: UniverseDetail | null) => void
  setLoadingDetail: (loading: boolean) => void
  addToHistory: (record: ObservationRecord) => void
  clearHistory: () => void
  toggleCompare: (universe: Universe) => void
  clearCompare: () => void
  setCurrentDecision: (decision: string) => void
  addToStory: (decision: string, universe: Universe) => void
  clearStory: () => void
  rollFate: () => void
  addToCollection: (universe: Universe) => void
  setFateAnalysis: (analysis: FateAnalysis | null) => void
  setAnalyzingFate: (analyzing: boolean) => void

  // ===== 命运节目新增方法 =====
  setFateProfile: (profile: FateProfile | null) => void
  setLoadingFateProfile: (loading: boolean) => void
  setLifeNodes: (nodes: LifeNode[]) => void
  setLoadingNodes: (loading: boolean) => void
  setCurrentNode: (node: LifeNode | null) => void
  setNodeBranch: (nodeId: number, branch: 'a' | 'b', universe: Universe | null) => void
  setGeneratingNode: (generating: boolean) => void
  setFateOverview: (overview: FateOverview | null) => void
  setLoadingOverview: (loading: boolean) => void
  setDailyCard: (card: DailyCard | null) => void
  setLoadingDailyCard: (loading: boolean) => void
  resetFateProgram: () => void
}

export const useUniverseStore = create<UniverseStore>((set, get) => ({
  userInput: '',
  universes: [],
  isLoading: false,
  selectedUniverse: null,
  universeDetail: null,
  isLoadingDetail: false,
  history: [],
  compareList: [],
  currentDecision: '',
  currentStory: [],
  collection: [],
  fateUniverse: null,
  isFateRolling: false,
  fateAnalysis: null,
  isAnalyzingFate: false,

  // ===== 命运节目初始状态 =====
  fateProfile: null,
  isLoadingFateProfile: false,
  lifeNodes: [],
  isLoadingNodes: false,
  currentNode: null,
  nodeUniverses: {},
  isGeneratingNode: false,
  fateOverview: null,
  isLoadingOverview: false,
  dailyCard: null,
  isLoadingDailyCard: false,

  setUserInput: (input) => set({ userInput: input }),
  setUniverses: (universes) => set({ universes }),
  setLoading: (loading) => set({ isLoading: loading }),
  selectUniverse: (universe) => set({ selectedUniverse: universe }),
  setUniverseDetail: (detail) => set({ universeDetail: detail }),
  setLoadingDetail: (loading) => set({ isLoadingDetail: loading }),
  setCurrentDecision: (decision) => set({ currentDecision: decision }),

  addToHistory: (record) =>
    set((state) => ({
      history: [record, ...state.history].slice(0, 20),
    })),
  clearHistory: () => set({ history: [] }),

  toggleCompare: (universe) =>
    set((state) => {
      const exists = state.compareList.find(
        (u) => u.universe_name === universe.universe_name && u.description === universe.description
      )
      if (exists) {
        return {
          compareList: state.compareList.filter(
            (u) => !(u.universe_name === universe.universe_name && u.description === universe.description)
          ),
        }
      }
      if (state.compareList.length >= 3) {
        return state
      }
      return { compareList: [...state.compareList, universe] }
    }),
  clearCompare: () => set({ compareList: [] }),

  addToStory: (decision, universe) =>
    set((state) => ({
      currentStory: [
        ...state.currentStory,
        { id: `node-${Date.now()}`, decision, chosenUniverse: universe, timestamp: Date.now() },
      ],
    })),

  clearStory: () => set({ currentStory: [] }),

  rollFate: () => {
    const { universes } = get()
    if (universes.length === 0) return

    set({ isFateRolling: true })

    let rollCount = 0
    const maxRolls = 15
    const interval = setInterval(() => {
      rollCount++
      if (rollCount >= maxRolls) {
        clearInterval(interval)
        const total = universes.reduce((sum, u) => sum + u.probability, 0)
        let random = Math.random() * total
        let chosen = universes[0]
        for (const u of universes) {
          random -= u.probability
          if (random <= 0) {
            chosen = u
            break
          }
        }
        set({ fateUniverse: chosen, isFateRolling: false })
      } else {
        const randomIndex = Math.floor(Math.random() * universes.length)
        set({ fateUniverse: universes[randomIndex] })
      }
    }, 100)
  },

  addToCollection: (universe) =>
    set((state) => {
      const existing = state.collection.find(
        (c) => c.universe_name === universe.universe_name
      )
      if (existing) {
        return {
          collection: state.collection.map((c) =>
            c.universe_name === universe.universe_name
              ? { ...c, count: c.count + 1 }
              : c
          ),
        }
      }
      return {
        collection: [
          ...state.collection,
          {
            universe_name: universe.universe_name,
            emotion_tags: universe.emotion_tags,
            atmosphere: universe.atmosphere,
            firstSeen: Date.now(),
            count: 1,
          },
        ],
      }
    }),

  setFateAnalysis: (analysis) => set({ fateAnalysis: analysis }),
  setAnalyzingFate: (analyzing) => set({ isAnalyzingFate: analyzing }),

  // ===== 命运节目方法实现 =====
  setFateProfile: (profile) => set({ fateProfile: profile }),
  setLoadingFateProfile: (loading) => set({ isLoadingFateProfile: loading }),
  setLifeNodes: (nodes) => set({ lifeNodes: nodes }),
  setLoadingNodes: (loading) => set({ isLoadingNodes: loading }),
  setCurrentNode: (node) => set({ currentNode: node }),
  setNodeBranch: (nodeId, branch, universe) =>
    set((state) => ({
      nodeUniverses: {
        ...state.nodeUniverses,
        [nodeId]: {
          branch_a: branch === 'a' ? universe : state.nodeUniverses[nodeId]?.branch_a || null,
          branch_b: branch === 'b' ? universe : state.nodeUniverses[nodeId]?.branch_b || null,
        },
      },
    })),
  setGeneratingNode: (generating) => set({ isGeneratingNode: generating }),
  setFateOverview: (overview) => set({ fateOverview: overview }),
  setLoadingOverview: (loading) => set({ isLoadingOverview: loading }),
  setDailyCard: (card) => set({ dailyCard: card }),
  setLoadingDailyCard: (loading) => set({ isLoadingDailyCard: loading }),
  resetFateProgram: () => set({
    fateProfile: null,
    lifeNodes: [],
    currentNode: null,
    nodeUniverses: {},
    fateOverview: null,
  }),
}))
