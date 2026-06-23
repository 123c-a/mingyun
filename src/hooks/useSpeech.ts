import { useCallback, useRef, useEffect } from 'react'

export type VoiceSpeed = 'slow' | 'normal' | 'fast'

interface SpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
}

const SPEED_MAP: Record<VoiceSpeed, number> = {
  slow: 0.75,
  normal: 1.0,
  fast: 1.3,
}

export function useSpeech() {
  const speakingRef = useRef(false)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 初始化中文语音
  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices()
    // 优先选择中文语音
    const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'))
    return zhVoice || voices[0] || null
  }, [])

  // 确保语音列表已加载（部分浏览器需要延迟）
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices()
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  // 停止当前语音
  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    speakingRef.current = false
  }, [])

  // 说话
  const speak = useCallback((text: string, options?: SpeechOptions) => {
    return new Promise<void>((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve()
        return
      }

      // 先停止之前的
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = getVoice()
      utterance.lang = 'zh-CN'
      utterance.rate = options?.rate ?? SPEED_MAP.normal
      utterance.pitch = options?.pitch ?? 1.0
      utterance.volume = options?.volume ?? 1.0

      utterance.onstart = () => {
        speakingRef.current = true
      }

      utterance.onend = () => {
        speakingRef.current = false
        resolve()
      }

      utterance.onerror = () => {
        speakingRef.current = false
        resolve()
      }

      currentUtteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    })
  }, [getVoice])

  // 快捷方法
  const say = useCallback((text: string, speed: VoiceSpeed = 'normal') => {
    return speak(text, { rate: SPEED_MAP[speed] })
  }, [speak])

  // 广播频道列表（可被外部监听）
  return {
    speak,
    say,
    stop,
    speakingRef,
    // 场景化语音
    scenes: {
      // 观测开始
      observeStart: () => say('正在观测多元宇宙，请稍候...', 'normal'),
      // 观测完成
      observeComplete: (count: number) => {
        const msg = count === 1
          ? `观测完成！发现了 ${count} 个平行宇宙`
          : `观测完成！发现了 ${count} 个平行宇宙`
        return say(msg, 'normal')
      },
      // 切换宇宙
      switchUniverse: (index: number, name: string) => {
        return say(`第 ${index + 1} 号宇宙：${name}`, 'normal')
      },
      // 命运骰子
      fateRolling: () => say('命运在召唤...', 'slow'),
      fateReveal: (name: string, prob: number) => {
        return say(`命运揭晓！${name}，概率 ${prob}%`, 'normal')
      },
      fateAccept: () => say('命运已被接受，这个宇宙将成为你的现实', 'normal'),
      // 成就解锁
      achievementUnlock: (name: string, rarity: string) => {
        const prefix = rarity === 'legendary' ? '🎉 传说成就！' :
                       rarity === 'epic' ? '✨ 史诗成就！' :
                       rarity === 'rare' ? '💎 稀有成就！' : '🏆 成就解锁！'
        return say(`${prefix} ${name}`, rarity === 'legendary' ? 'slow' : 'normal')
      },
      // 随机事件
      meteorShower: () => say('流星雨来了！许个愿吧', 'slow'),
      aurora: () => say('极光出现了！宇宙正在共振', 'slow'),
      // 连击
      combo: (count: number) => {
        if (count >= 10) return say(`${count}连击！势不可挡！`, 'fast')
        if (count >= 5) return say(`${count}连击！太棒了！`, 'normal')
        return say(`${count}连击！`, 'normal')
      },
      // 页面
      welcome: () => say('欢迎来到平行宇宙观测站，探索你决定的无限可能', 'slow'),
      // 分享
      share: (name: string) => say(`分享 ${name} 到宇宙图鉴`, 'normal'),
      // 导出
      exportUniverse: () => say('正在生成宇宙卡片', 'normal'),
      // 收集
      collect: (name: string) => say(`${name} 已收录到你的收藏`, 'normal'),
    },
  }
}
