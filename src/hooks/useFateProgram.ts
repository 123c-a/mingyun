/**
 * 命运节目专用 Hook
 * 包含：演示模式、进度保存、错误重试、TTS 语音
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import { useUniverseStore, FateProfile, LifeNode } from '../store/universeStore'
import { speech } from '../store/speechStore'

const API_BASE = 'http://localhost:3001/api'
const STORAGE_KEY = 'fate-program-state'

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 2000,
}

// 延迟函数
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 带重试的 fetch
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries = RETRY_CONFIG.maxRetries
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(90000), // 90秒超时
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => '未知错误')
        throw new Error(`HTTP ${res.status}: ${errText}`)
      }
      return await res.json()
    } catch (err: any) {
      lastError = err
      if (i < retries && (err.message?.includes('timeout') || err.message?.includes('fetch') || err.message?.includes('网络'))) {
        await delay(RETRY_CONFIG.retryDelay * (i + 1))
      } else {
        throw err
      }
    }
  }
  throw lastError || new Error('请求失败')
}

// 持久化状态
interface FateProgramState {
  userName: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour?: number
  gender: string
  fateProfile: FateProfile | null
  lifeNodes: LifeNode[]
  exploredNodes: number[]
  currentStep: string
}

function saveState(state: FateProgramState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function loadState(): FateProgramState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

// 语音播报命运节目内容
function speakFateContent(text: string, emotion: 'excited' | 'calm' | 'mysterious' = 'mysterious') {
  speech.say(text, 'normal', emotion, 'fateReveal')
}

// 演示数据
const DEMO_DATA = {
  name: '直播观众',
  birthYear: 1998,
  birthMonth: 3,
  birthDay: 14,
  gender: 'male',
  birthHour: 9,
}

export function useFateProgram() {
  const store = useUniverseStore()
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const demoRef = useRef<number | null>(null)

  // 加载保存的状态
  const loadSavedState = useCallback(() => {
    const saved = loadState()
    if (saved) {
      if (saved.fateProfile) store.setFateProfile(saved.fateProfile)
      if (saved.lifeNodes.length > 0) store.setLifeNodes(saved.lifeNodes)
      if (saved.exploredNodes.length > 0) {
        saved.exploredNodes.forEach((nodeId) => {
          store.setNodeBranch(nodeId, 'a', null)
          store.setNodeBranch(nodeId, 'b', null)
        })
      }
      return saved
    }
    return null
  }, [store])

  // 保存当前状态
  const saveCurrentState = useCallback(
    (userData: any, step: string) => {
      saveState({
        userName: userData.name || '匿名观测者',
        birthYear: userData.birthYear,
        birthMonth: userData.birthMonth,
        birthDay: userData.birthDay,
        birthHour: userData.birthHour,
        gender: userData.gender,
        fateProfile: store.fateProfile,
        lifeNodes: store.lifeNodes,
        exploredNodes: Object.keys(store.nodeUniverses).map(Number),
        currentStep: step,
      })
    },
    [store]
  )

  // API 调用（带重试）
  const apiCall = useCallback(
    async <T>(endpoint: string, body: any): Promise<T> => {
      return fetchWithRetry<T>(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    },
    []
  )

  // 生成命运底色（带语音）
  const generateFateProfile = useCallback(
    async (data: any) => {
      const profile = await apiCall<{ profile: FateProfile }>('/fate-profile', data)
      store.setFateProfile(profile.profile)
      store.setLoadingFateProfile(false)
      // 语音播报
      speakFateContent(`命运底色已生成：${profile.profile.fate_title}`, 'excited')
      return profile.profile
    },
    [apiCall, store]
  )

  // 生成人生节点（带语音）
  const generateLifeNodes = useCallback(
    async (profile: FateProfile, userInput: string) => {
      const result = await apiCall<{ nodes: LifeNode[] }>('/life-nodes', {
        fate_profile: profile,
        userInput,
      })
      store.setLifeNodes(result.nodes)
      store.setLoadingNodes(false)
      speakFateContent(`已扫描到 ${result.nodes.length} 个人生关键节点`, 'mysterious')
      return result.nodes
    },
    [apiCall, store]
  )

  // 生成节点宇宙（带语音）
  const generateNodeUniverses = useCallback(
    async (node: LifeNode, profile: FateProfile) => {
      const result = await apiCall<{ branch_a: any; branch_b: any }>('/universes', {
        fateProfile: profile,
        lifeNode: node,
      })
      store.setNodeBranch(node.node_id, 'a', result.branch_a)
      store.setNodeBranch(node.node_id, 'b', result.branch_b)
      store.setGeneratingNode(false)
      speakFateContent(`${node.node_name} 的两条平行宇宙已分裂完成`, 'mysterious')
      return result
    },
    [apiCall, store]
  )

  // 生成命运总览（带语音）
  const generateFateOverview = useCallback(
    async (universes: any[], profile: FateProfile) => {
      const result = await apiCall<{ overview: any }>('/fate-overview', {
        universes: universes.slice(0, 6),
        fateProfile: profile,
      })
      store.setFateOverview(result.overview)
      store.setLoadingOverview(false)
      speakFateContent('命运总览已生成，全景图正在展开', 'excited')
      return result.overview
    },
    [apiCall, store]
  )

  // 生成今日签文（带语音）
  const generateDailyCard = useCallback(
    async (profile?: FateProfile) => {
      const result = await apiCall<{ card: any; date: string }>('/daily-card', {
        birthYear: 1998,
        birthMonth: 3,
        birthDay: 14,
        gender: 'male',
        name: profile?.fate_title || '观测者',
      })
      store.setDailyCard(result.card)
      store.setLoadingDailyCard(false)
      // 朗读签诗
      setTimeout(() => {
        speakFateContent(`今日签诗：${result.card.fortune_poem.replace(/\n/g, '，')}`, 'calm')
      }, 1000)
      return result.card
    },
    [apiCall, store]
  )

  // 启动演示模式
  const startDemoMode = useCallback(() => {
    setIsDemoMode(true)
    setDemoStep(0)
    store.resetFateProgram()

    const DEMO_STEPS = [
      // Step 1: 命运底色
      async () => {
        store.setLoadingFateProfile(true)
        try {
          const profile = await generateFateProfile(DEMO_DATA)
          await delay(1500) // 演示等待
          speakFateContent('命运底色分析完成，准备进入下一步', 'calm')
          setDemoStep(1)
        } catch {
          store.setLoadingFateProfile(false)
        }
      },
      // Step 2: 人生节点
      async () => {
        if (!store.fateProfile) return
        store.setLoadingNodes(true)
        try {
          const nodes = await generateLifeNodes(store.fateProfile, '')
          await delay(1500)
          speakFateContent('人生节点扫描完成，选择第一个节点', 'calm')
          setDemoStep(2)
          // 自动选第一个节点
          if (nodes.length > 0) {
            setTimeout(() => {
              startDemoNode(nodes[0])
            }, 2000)
          }
        } catch {
          store.setLoadingNodes(false)
        }
      },
    ]

    let currentStep = 0
    const run = async () => {
      if (currentStep < DEMO_STEPS.length) {
        await DEMO_STEPS[currentStep]()
        currentStep++
        if (currentStep < DEMO_STEPS.length) {
          demoRef.current = setTimeout(run, 2000)
        }
      }
    }

    run()
  }, [store, generateFateProfile, generateLifeNodes])

  // 演示模式：探索节点
  const startDemoNode = useCallback(
    async (node: LifeNode) => {
      if (!store.fateProfile) return
      store.setGeneratingNode(true)
      try {
        await generateNodeUniverses(node, store.fateProfile)
        await delay(1500)
        speakFateContent('分支宇宙已生成，演示完成', 'excited')
        setIsDemoMode(false)
      } catch {
        store.setGeneratingNode(false)
      }
    },
    [store, generateNodeUniverses]
  )

  // 停止演示模式
  const stopDemoMode = useCallback(() => {
    if (demoRef.current) clearTimeout(demoRef.current)
    setIsDemoMode(false)
    setDemoStep(0)
    store.resetFateProgram()
  }, [store])

  // 清理状态
  const clearAllState = useCallback(() => {
    clearState()
    store.resetFateProgram()
    setIsDemoMode(false)
  }, [store])

  return {
    // 状态
    isDemoMode,
    demoStep,
    loadSavedState,
    saveCurrentState,
    // API
    apiCall,
    generateFateProfile,
    generateLifeNodes,
    generateNodeUniverses,
    generateFateOverview,
    generateDailyCard,
    // 演示模式
    startDemoMode,
    startDemoNode,
    stopDemoMode,
    clearAllState,
    // 语音
    speakFateContent,
  }
}
