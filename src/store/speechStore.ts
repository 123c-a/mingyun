/**
 * 语音服务
 * 优先使用浏览器 Web Speech API（无需外部服务，即开即用）
 * 备用 Python Edge TTS（需要 localhost:3003 启动）
 *
 * 修复要点：
 * - 不使用一次性缓存 null 的 getBestZhVoice
 * - onvoiceschanged 可靠触发：预加载 + 每次需要时重新扫描
 * - 分句+韵律停顿改为更稳定的实现
 */

import { useEffect, useRef } from 'react'

let audioContext: AudioContext | null = null
let currentAudio: HTMLAudioElement | null = null
let isSpeakingRef = { current: false }

const TTS_SERVER = 'http://localhost:3003'

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// 场景 -> 语音配置
const SCENE_CONFIG: Record<string, { voice: string; emotion: string }> = {
  welcome:           { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'mysterious' },
  observeStart:      { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'calm' },
  observeComplete:   { voice: 'zh-CN-YunyangNeural', emotion: 'excited' },
  switchUniverse:    { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'mysterious' },
  fateRolling:       { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'mysterious' },
  fateReveal:        { voice: 'zh-CN-YunyangNeural', emotion: 'excited' },
  fateAccept:        { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'calm' },
  achievementUnlock: { voice: 'zh-CN-YunyangNeural', emotion: 'excited' },
  meteorShower:      { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'mysterious' },
  aurora:            { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'mysterious' },
  combo:             { voice: 'zh-CN-YunyangNeural', emotion: 'excited' },
  share:             { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'calm' },
  exportComplete:    { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'calm' },
  collect:           { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'calm' },
  navigate:          { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'calm' },
  apiError:          { voice: 'zh-CN-XiaoxiaoNeural', emotion: 'calm' },
}

type Emotion = 'excited' | 'calm' | 'mysterious' | 'normal' | 'sad' | 'happy' | 'serious'
type VoiceSpeed = 'slow' | 'normal' | 'fast'

const SPEED_MAP: Record<VoiceSpeed, number> = {
  slow: 0.8,
  normal: 1.0,
  fast: 1.15,
}

const PITCH_MAP: Record<Emotion, number> = {
  excited: 1.15,
  calm: 0.95,
  mysterious: 0.88,
  normal: 1.0,
  sad: 0.88,
  happy: 1.12,
  serious: 0.92,
}

const RATE_BY_EMOTION: Record<Emotion, number> = {
  excited: 1.05,
  calm: 0.95,
  mysterious: 0.88,
  normal: 1.0,
  sad: 0.9,
  happy: 1.05,
  serious: 0.93,
}

// ===== 智能分句 =====
function splitTextByPunctuation(text: string): string[] {
  const sentences: string[] = []
  let current = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    current += char

    if (['。', '！', '？', '；', '：', '…', '\n', '!', '?', ';', ':'].includes(char)) {
      const trimmed = current.trim()
      if (trimmed) sentences.push(trimmed)
      current = ''
    } else if ((char === '，' || char === ',') && current.length > 20) {
      const trimmed = current.trim()
      if (trimmed) sentences.push(trimmed)
      current = ''
    }
  }

  if (current.trim()) {
    sentences.push(current.trim())
  }

  return sentences
}

// ===== 计算句间停顿时间 =====
function getPauseDuration(text: string, emotion: Emotion): number {
  const lastChar = text[text.length - 1] || ''
  const basePause = {
    '。': 650, '！': 700, '？': 800, '；': 450, '：': 380, '…': 900,
    '!': 700, '?': 800, ';': 450, ':': 380,
    '，': 200, ',': 200,
  }[lastChar] || 150

  const emotionMultiplier = {
    excited: 0.75, calm: 1.0, mysterious: 1.35, normal: 1.0,
    sad: 1.3, happy: 0.85, serious: 1.1,
  }[emotion]

  return Math.round(basePause * emotionMultiplier)
}

// ===== 选择最佳中文语音（每次重新扫描，不缓存 null） =====
let cachedBestVoice: SpeechSynthesisVoice | null = null
let cachedVoiceCount = 0

function getBestZhVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null

  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  // 如果语音数量没变且已有缓存，直接返回
  if (cachedBestVoice && cachedVoiceCount === voices.length) {
    return cachedBestVoice
  }

  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    let score = 0
    const name = v.name.toLowerCase()
    const lang = v.lang.toLowerCase()

    const zhLabels = ['zh-cn', 'zh-hans', 'zh', 'cmn-cn', 'cmn']
    for (const label of zhLabels) {
      if (lang === label) { score += 100; break }
      if (lang.includes(label.replace('-', ''))) score += 50
    }

    const priorityTags = ['premium', 'neural', 'natural', 'enhanced', 'google', 'microsoft']
    for (let i = 0; i < priorityTags.length; i++) {
      if (name.includes(priorityTags[i])) {
        score += (priorityTags.length - i) * 10
      }
    }

    if (v.localService) score += 20
    if (name.includes('female') || name.includes('xiaoxiao')) score += 15

    return score
  }

  const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))
  const zhVoice = sorted.find(v =>
    ['zh-cn', 'zh-hans', 'zh', 'cmn-cn', 'cmn'].some(l => v.lang.toLowerCase().includes(l))
  )
  cachedBestVoice = zhVoice || sorted[0] || null
  cachedVoiceCount = voices.length
  return cachedBestVoice
}

// 预加载语音列表（全局，只需执行一次）
let voicesPreloaded = false
function preloadVoices() {
  if (voicesPreloaded) return
  if (!('speechSynthesis' in window)) return
  voicesPreloaded = true

  // 触发一次 getVoices
  window.speechSynthesis.getVoices()
  // 监听 voiceschanged
  window.speechSynthesis.onvoiceschanged = () => {
    cachedBestVoice = null
    cachedVoiceCount = 0
    window.speechSynthesis.getVoices()
  }
}

// ============================================================
// 浏览器 Web Speech API（主要方案）
// ============================================================
async function playBrowserTTS(text: string, emotion: Emotion, speed: VoiceSpeed): Promise<boolean> {
  if (!('speechSynthesis' in window)) return false

  // 确保语音列表已加载
  preloadVoices()

  return new Promise((resolve) => {
    window.speechSynthesis.cancel()
    isSpeakingRef.current = true

    const sentences = splitTextByPunctuation(text)
    if (sentences.length === 0) {
      isSpeakingRef.current = false
      resolve(false)
      return
    }

    const baseRate = Math.min(SPEED_MAP[speed] * RATE_BY_EMOTION[emotion], 1.4)
    const pitch = PITCH_MAP[emotion]
    let sentenceIndex = 0
    let resolved = false

    const finish = (ok: boolean) => {
      if (resolved) return
      resolved = true
      isSpeakingRef.current = false
      resolve(ok)
    }

    const tryStartWithVoice = () => {
      // 再次尝试获取语音（可能 onvoiceschanged 刚刚触发）
      const bestVoice = getBestZhVoice()

      const speakNext = () => {
        if (sentenceIndex >= sentences.length || !isSpeakingRef.current) {
          finish(true)
          return
        }

        const sentence = sentences[sentenceIndex++]
        if (!sentence || !sentence.trim()) {
          speakNext()
          return
        }

        const utter = new SpeechSynthesisUtterance(sentence)
        if (bestVoice) {
          utter.voice = bestVoice
          utter.lang = bestVoice.lang || 'zh-CN'
        } else {
          utter.lang = 'zh-CN'
        }
        utter.rate = baseRate
        utter.pitch = pitch
        utter.volume = 1.0

        let ended = false
        utter.onend = () => {
          if (ended) return
          ended = true
          if (!isSpeakingRef.current) { finish(false); return }
          const pause = getPauseDuration(sentence, emotion)
          setTimeout(speakNext, pause)
        }
        utter.onerror = (e) => {
          if (ended) return
          ended = true
          // interrupted / canceled 属于正常停止
          if (e && (e as any).error && ['interrupted', 'canceled'].includes((e as any).error)) {
            finish(false)
            return
          }
          if (!isSpeakingRef.current) { finish(false); return }
          const pause = getPauseDuration(sentence, emotion)
          setTimeout(speakNext, pause)
        }

        try {
          window.speechSynthesis.speak(utter)
          // Chrome 某些版本中 speak 后需要 resume
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume()
          }
        } catch {
          finish(false)
        }
      }

      speakNext()
    }

    // 如果语音列表已经有，直接开始
    if (window.speechSynthesis.getVoices().length > 0) {
      tryStartWithVoice()
    } else {
      // 等待 onvoiceschanged 触发，最多 1.5 秒
      let started = false
      const handler = () => {
        if (started) return
        started = true
        tryStartWithVoice()
      }
      window.speechSynthesis.addEventListener('voiceschanged', handler, { once: true })
      setTimeout(() => {
        if (!started) {
          started = true
          // 即使没加载到语音，也尝试用默认 lang 播放
          tryStartWithVoice()
        }
      }, 1200)
    }

    // 安全超时：最长 60 秒强制结束
    setTimeout(() => finish(true), 60000)
  })
}

// ============================================================
// Python Edge TTS 备用方案
// ============================================================
async function playEdgeTTS(text: string, scene: string, emotion?: Emotion): Promise<boolean> {
  const config = SCENE_CONFIG[scene] || SCENE_CONFIG.navigate
  const effectiveEmotion = emotion || config.emotion

  try {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }

    const url = `${TTS_SERVER}/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(config.voice)}&emotion=${encodeURIComponent(effectiveEmotion)}`

    const audio = new Audio()
    currentAudio = audio
    audio.src = url
    audio.crossOrigin = 'anonymous'

    return new Promise((resolve) => {
      try {
        const ctx = getAudioContext()
        if (ctx.state === 'suspended') ctx.resume().catch(() => {})
      } catch { /* ignore */ }

      audio.oncanplaythrough = () => { isSpeakingRef.current = true }
      audio.onended = () => {
        isSpeakingRef.current = false
        currentAudio = null
        resolve(true)
      }
      audio.onerror = () => {
        isSpeakingRef.current = false
        currentAudio = null
        resolve(false)
      }

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => resolve(false))
      }
    })
  } catch {
    return false
  }
}

// ============================================================
// 语音队列（用于直播台多段台词，避免叠音）
// ============================================================
type QueuedItem = { text: string; speed: VoiceSpeed; emotion: Emotion; scene: string }
const speechQueue: QueuedItem[] = []
let queueRunning = false

async function runQueue() {
  if (queueRunning) return
  queueRunning = true
  while (speechQueue.length > 0 && isSpeakingRef.current) {
    const item = speechQueue.shift()
    if (!item) continue
    try {
      const ok = await playBrowserTTS(item.text, item.emotion, item.speed)
      if (!ok) {
        // 兜底：直接播
        const utter = new SpeechSynthesisUtterance(item.text)
        utter.lang = 'zh-CN'
        utter.rate = Math.min(SPEED_MAP[item.speed] * RATE_BY_EMOTION[item.emotion], 1.4)
        utter.pitch = PITCH_MAP[item.emotion]
        utter.volume = 1.0
        await new Promise<void>((resolve) => {
          utter.onend = () => resolve()
          utter.onerror = () => resolve()
          try { window.speechSynthesis.speak(utter) } catch { resolve() }
        })
      }
    } catch { /* ignore */ }
  }
  queueRunning = false
  isSpeakingRef.current = false
}

// ============================================================
// 全局语音单例
// ============================================================
export const speech = {
  say: async (
    text: string,
    speed: VoiceSpeed = 'normal',
    emotion: Emotion = 'normal',
    scene = 'navigate'
  ) => {
    if (!text || !text.trim()) return

    isSpeakingRef.current = true

    // 方案1: 浏览器 Web Speech API
    try {
      const success = await playBrowserTTS(text, emotion, speed)
      if (success) return
    } catch { /* 继续尝试备用方案 */ }

    // 方案2: Python Edge TTS 备用
    try {
      const success = await playEdgeTTS(text, scene, emotion)
      if (success) return
    } catch { /* 继续 */ }

    // 方案3: 最简单的直接播放兜底
    try {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'zh-CN'
      utter.rate = Math.min(SPEED_MAP[speed] * RATE_BY_EMOTION[emotion], 1.4)
      utter.pitch = PITCH_MAP[emotion]
      utter.volume = 1.0
      utter.onend = () => { isSpeakingRef.current = false }
      utter.onerror = () => { isSpeakingRef.current = false }

      const tryPlay = () => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume()
        window.speechSynthesis.speak(utter)
      }

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = tryPlay
        setTimeout(tryPlay, 400)
      } else {
        tryPlay()
      }
    } catch {
      isSpeakingRef.current = false
    }
  },

  /** 排队朗读（用于数字人主播的多段台词，自动按顺序播放，可随时 stop 清空） */
  enqueue: (
    text: string,
    speed: VoiceSpeed = 'normal',
    emotion: Emotion = 'normal',
    scene = 'navigate'
  ) => {
    if (!text || !text.trim()) return
    isSpeakingRef.current = true
    speechQueue.push({ text, speed, emotion, scene })
    // 切函数：触发 runQueue（注意：runQueue 内部会循环清空队列，所以只需调用一次）
    const trigger = () => runQueue()
    if (speechQueue.length === 1) setTimeout(trigger, 0)
  },

  stop: () => {
    speechQueue.length = 0
    isSpeakingRef.current = false
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel() } catch { /* ignore */ }
    }
  },

  isSpeaking: () => isSpeakingRef.current,

  isAvailable: () => 'speechSynthesis' in window,

  queueLength: () => speechQueue.length,

  scenes: {
    welcome: () => speech.say('欢迎来到平行宇宙观测站，探索你决定的无限可能', 'normal', 'mysterious', 'welcome'),
    observeStart: () => speech.say('正在观测多元宇宙，请稍候', 'normal', 'calm', 'observeStart'),
    observeComplete: (count: number) => speech.say(`观测完成，发现了 ${count} 个平行宇宙`, 'fast', 'excited', 'observeComplete'),
    switchUniverse: (index: number, name: string) => speech.say(`第 ${index + 1} 号宇宙：${name}`, 'normal', 'mysterious', 'switchUniverse'),
    fateRolling: () => speech.say('命运在召唤', 'slow', 'mysterious', 'fateRolling'),
    fateReveal: (name: string, prob?: number) => {
      const text = prob !== undefined
        ? `命运揭晓！${name}，概率百分之 ${prob}`
        : `命运揭晓！你的命运称号是：${name}`
      return speech.say(text, 'normal', 'excited', 'fateReveal')
    },
    fateAccept: () => speech.say('命运已被接受，这个宇宙将成为你的现实', 'normal', 'calm', 'fateAccept'),
    achievementUnlock: (name: string, rarity: string) => {
      const prefix = rarity === 'legendary' ? '传说成就！'
                   : rarity === 'epic' ? '史诗成就！'
                   : rarity === 'rare' ? '稀有成就！' : '成就解锁！'
      return speech.say(`${prefix} ${name}`, 'fast', 'excited', 'achievementUnlock')
    },
    meteorShower: () => speech.say('流星雨来了，许个愿吧', 'normal', 'mysterious', 'meteorShower'),
    aurora: () => speech.say('极光出现，宇宙正在共振', 'slow', 'mysterious', 'aurora'),
    combo: (count: number) => {
      const text = count >= 10 ? `${count} 连击！势不可挡！`
                 : count >= 5 ? `${count} 连击！太棒了！`
                 : `${count} 连击！`
      return speech.say(text, 'fast', 'excited', 'combo')
    },
    share: (name: string) => speech.say(`分享 ${name} 到宇宙图鉴`, 'normal', 'calm', 'share'),
    exportComplete: () => speech.say('宇宙卡片已生成', 'normal', 'calm', 'exportComplete'),
    collect: (name: string) => speech.say(`${name} 已收录到你的收藏`, 'normal', 'calm', 'collect'),
    navigate: (page: string) => {
      const text = page === 'observe' ? '进入观测站'
                 : page === 'collection' ? '打开宇宙图鉴'
                 : page === 'story' ? '打开故事线'
                 : '回到首页'
      return speech.say(text, 'normal', 'calm', 'navigate')
    },
    apiError: () => speech.say('观测失败，请检查网络连接', 'normal', 'calm', 'apiError'),
  },
}

// React Hook
export function useSpeech() {
  const speakingRef = useRef(false)

  useEffect(() => {
    preloadVoices()
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const { text, speed, emotion, scene } = (e as CustomEvent<{
        text: string
        speed?: VoiceSpeed
        emotion?: Emotion
        scene?: string
      }>).detail
      speech.say(text, speed ?? 'normal', emotion ?? 'normal', scene ?? 'navigate')
    }
    window.addEventListener('speech-event', handler)
    return () => window.removeEventListener('speech-event', handler)
  }, [])

  return { speech, speaking: speakingRef }
}

export function triggerSpeech(
  text: string,
  speed: VoiceSpeed = 'normal',
  emotion: Emotion = 'normal',
  scene = 'navigate'
) {
  speech.say(text, speed, emotion, scene)
}
