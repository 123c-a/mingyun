/**
 * useLiveAgent — Agent 状态机
 * 驱动 6 步剧本：自动推进、语音、特效、弹幕
 *
 * 生命周期：
 * 1. 进入某一步 → 自动调用必要的 API（如 fate-profile）
 * 2. 在步骤内，依次播放多条台词（每条 enqueue 到语音队列）
 * 3. 台词全部播完后，等待 minDuration 或用户点击"下一步"
 * 4. 自动进入下一步（如果 autoTrigger）
 *
 * Agent 与页面 API 解耦：
 * - 通过 runApi(stepId) 让 FateProgramPage 自己决定如何执行 API
 * - 通过 changePageStep(stepId) 让页面切换 UI 步骤
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { LIVE_SCRIPT, PersonalityKey, ScriptStep } from '../data/liveScripts'
import { speech } from '../store/speechStore'

export type AgentState = {
  isPlaying: boolean
  stepIndex: number
  line: string
  speaking: boolean
}

type AgentActions = {
  play: () => void
  pause: () => void
  next: () => void
  prev: () => void
  restart: () => void
  stop: () => void
  setSpeed: (s: number) => void
  setPersonality: (p: PersonalityKey) => void
  setVoice: (v: boolean) => void
  setDanmaku: (v: boolean) => void
  getPersonality: () => PersonalityKey
  getSpeed: () => number
  getVoice: () => boolean
  getDanmaku: () => boolean
  /** 触发一个特效事件（在页面层监听这个 custom event） */
  triggerEffect: (name: string) => void
  /** 弹幕爆发的 signal（用于 DanmakuLayer 的 burstSignal） */
  burstSignal: number
}

/**
 * 创建 Agent
 * @param runApi 页面对应步骤执行 API 的回调
 * @param onStepChange 步骤变化时通知页面（比如切到 profile）
 */
export function useLiveAgent(params: {
  enabled: boolean
  runApi?: (stepId: string, agentStepIndex: number) => Promise<void>
  onStepChange?: (stepId: string) => void
}) {
  const { enabled, runApi, onStepChange } = params

  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [line, setLine] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [personality, setPersonality] = useState<PersonalityKey>('mystic')
  const [voiceOn, setVoiceOn] = useState(true)
  const [danmakuOn, setDanmakuOn] = useState(true)
  const [burstSignal, setBurstSignal] = useState(0)

  // 当前进度定时器的 ref（便于 pause 时清掉）
  const stepTimerRef = useRef<number | null>(null)
  const lineTimerRef = useRef<number | null>(null)
  const apiRunningRef = useRef(false)

  // 一个步骤的"子进度"：正在播放第几条台词
  const lineProgressRef = useRef(0)
  const stepStartedRef = useRef(false)

  const currentStep: ScriptStep | undefined = LIVE_SCRIPT[stepIndex]

  // ============================================================
  // 工具：语音节奏映射
  // ============================================================
  const getVoiceSpeedForPersonality = (p: PersonalityKey): 'slow' | 'normal' | 'fast' => {
    if (p === 'mystic') return 'slow'
    if (p === 'savage') return 'fast'
    return 'normal'
  }

  const getEmotionForPersonality = (p: PersonalityKey): 'normal' | 'calm' | 'mysterious' | 'excited' | 'serious' => {
    if (p === 'mystic') return 'mysterious'
    if (p === 'savage') return 'normal'
    if (p === 'robot') return 'calm'
    return 'normal'
  }

  // ============================================================
  // 触发特效：通过 window custom event，页面层可以任选一种方式监听
  // ============================================================
  const triggerEffect = useCallback((name: string) => {
    if (!enabled) return
    // 发一个自定义事件，页面组件如果想监听可以捕捉
    try {
      const ev = new CustomEvent('live-agent-effect', { detail: { name } })
      window.dispatchEvent(ev)
    } catch { /* ignore */ }

    // 直接调用 speech scenes（走现有 store 已有实现，即使语音关掉也不报错）
    if (name === 'welcome') speech.enqueue('直播开始！', 'normal', 'excited', 'welcome')
    if (name === 'combo') speech.enqueue('连击！', 'fast', 'excited', 'combo')
    if (name === 'meteor') speech.enqueue('流星雨来了', 'normal', 'mysterious', 'meteorShower')
    if (name === 'aurora') speech.enqueue('极光出现', 'normal', 'mysterious', 'aurora')
    if (name === 'danmaku-burst') setBurstSignal((x) => x + 1)
  }, [enabled])

  // ============================================================
  // 重置内部状态（当 stepIndex 变化时）
  // ============================================================
  const clearTimers = useCallback(() => {
    if (stepTimerRef.current !== null) { window.clearTimeout(stepTimerRef.current); stepTimerRef.current = null }
    if (lineTimerRef.current !== null) { window.clearTimeout(lineTimerRef.current); lineTimerRef.current = null }
  }, [])

  // ============================================================
  // 开始执行"当前步骤"：先执行 API → 再依次播放台词
  // ============================================================
  const startStep = useCallback(async (idx: number) => {
    if (!enabled) return
    clearTimers()
    speech.stop()
    setLine('')
    stepStartedRef.current = true
    lineProgressRef.current = 0

    const step = LIVE_SCRIPT[idx]
    if (!step) return

    // 通知页面切换 UI 步骤
    onStepChange?.(step.id)

    // 触发推荐特效（如果有）
    step.effects?.forEach((ef, i) => {
      setTimeout(() => triggerEffect(ef), 200 + i * 400)
    })

    // 执行 API（异步但不阻塞第一条台词的开始）
    apiRunningRef.current = true
    const apiPromise = runApi?.(step.id, idx).finally(() => {
      apiRunningRef.current = false
    })

    // 依次播放多条台词
    const lines = step.lines[personality] || step.lines.mystic || []
    let i = 0
    const playNext = () => {
      if (!enabled) return
      if (i >= lines.length) {
        // 台词播完，进入等待（等待 API 完成 + 满足 minDuration），然后自动下一步
        const startAt = Date.now()
        const waitFor = step.minDuration / speed
        const tryAdvance = () => {
          const elapsed = Date.now() - startAt
          if (apiRunningRef.current) {
            lineTimerRef.current = window.setTimeout(tryAdvance, 300) as unknown as number
            return
          }
          if (elapsed >= waitFor) {
            // 如果当前这一步应该自动下一步，且用户没有暂停，则推进
            if (step.autoTrigger && isPlaying) {
              if (idx + 1 < LIVE_SCRIPT.length) {
                setStepIndex(idx + 1)
              } else {
                // 最后一步：停止
                setSpeaking(false)
                setLine('（直播结束）感谢观看！')
              }
            } else {
              setSpeaking(false)
            }
          } else {
            lineTimerRef.current = window.setTimeout(tryAdvance, Math.min(500, waitFor - elapsed)) as unknown as number
          }
        }
        lineTimerRef.current = window.setTimeout(tryAdvance, 200) as unknown as number
        return
      }
      const text = lines[i++]
      lineProgressRef.current = i

      // 显示台词 + 语音
      setLine(text)
      setSpeaking(true)
      if (voiceOn) {
        speech.enqueue(text, getVoiceSpeedForPersonality(personality), getEmotionForPersonality(personality), 'fateReveal')
      }
      // 估算朗读时长（按字数，大概 0.22s / 字，加上句间停顿 0.6s）
      const estDuration = Math.min(8000, text.length * 220 + 600) / speed
      lineTimerRef.current = window.setTimeout(playNext, estDuration) as unknown as number
    }
    playNext()

    // 等待 API 完成（只是为了 finally 不报错，主要逻辑在 playNext 内部判断）
    await apiPromise
  }, [enabled, personality, voiceOn, speed, clearTimers, onStepChange, runApi, triggerEffect, isPlaying])

  // ============================================================
  // 当 stepIndex 变化时自动启动新步骤（只要 Agent 启用且未暂停）
  // ============================================================
  useEffect(() => {
    if (!enabled) return
    if (!isPlaying) return
    // 首次 / 切换步骤 → 启动
    const t = window.setTimeout(() => startStep(stepIndex), 150)
    return () => window.clearTimeout(t)
  }, [enabled, isPlaying, stepIndex, startStep])

  // ============================================================
  // 当人格切换时：如果正在播放某步，重新播放当前步（换一种风格念）
  // ============================================================
  useEffect(() => {
    if (!enabled) return
    if (!isPlaying) return
    if (!stepStartedRef.current) return
    // 简单策略：切人格就重置当前步（避免部分念完）
    const t = window.setTimeout(() => startStep(stepIndex), 200)
    return () => window.clearTimeout(t)
    // 只在 personality 变才重跑
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personality])

  // ============================================================
  // 控制方法
  // ============================================================
  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    clearTimers()
    speech.stop()
    setSpeaking(false)
    setIsPlaying(false)
  }, [clearTimers])

  const next = useCallback(() => {
    setStepIndex((s) => Math.min(s + 1, LIVE_SCRIPT.length - 1))
  }, [])

  const prev = useCallback(() => {
    setStepIndex((s) => Math.max(s - 1, 0))
  }, [])

  const restart = useCallback(() => {
    clearTimers()
    speech.stop()
    setLine('')
    setSpeaking(false)
    setStepIndex(0)
    setIsPlaying(true)
  }, [clearTimers])

  const stop = useCallback(() => {
    clearTimers()
    speech.stop()
    setLine('')
    setSpeaking(false)
    setIsPlaying(false)
  }, [clearTimers])

  // ============================================================
  // 组件卸载时清理
  // ============================================================
  useEffect(() => {
    if (!enabled) {
      clearTimers()
      speech.stop()
      setSpeaking(false)
      setLine('')
    }
    return () => {
      if (!enabled) return
    }
  }, [enabled, clearTimers])

  return {
    state: {
      isPlaying,
      stepIndex,
      line,
      speaking,
      speed,
      personality,
      voiceOn,
      danmakuOn,
      burstSignal,
      totalSteps: LIVE_SCRIPT.length,
      currentStepId: currentStep?.id || '',
    },
    actions: {
      play,
      pause,
      next,
      prev,
      restart,
      stop,
      setSpeed,
      setPersonality,
      setVoice: setVoiceOn,
      setDanmaku: setDanmakuOn,
      getPersonality: () => personality,
      getSpeed: () => speed,
      getVoice: () => voiceOn,
      getDanmaku: () => danmakuOn,
      triggerEffect,
    } as AgentActions,
  }
}
