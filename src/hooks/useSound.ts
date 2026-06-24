import { useCallback, useRef, useEffect } from 'react'

// 音效类型
type SoundType = 'select' | 'connect' | 'combo' | 'enter' | 'hover' | 'success'

// 音效配置（使用 Web Audio API 生成合成音效）
const soundConfigs: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; volume: number }> = {
  select: { frequency: 800, duration: 0.1, type: 'sine', volume: 0.15 },
  connect: { frequency: 600, duration: 0.15, type: 'triangle', volume: 0.12 },
  combo: { frequency: 1000, duration: 0.2, type: 'sine', volume: 0.18 },
  enter: { frequency: 500, duration: 0.25, type: 'sine', volume: 0.2 },
  hover: { frequency: 1200, duration: 0.05, type: 'sine', volume: 0.08 },
  success: { frequency: 800, duration: 0.3, type: 'sine', volume: 0.25 },
}

export function useSound(enabled: boolean = true) {
  const audioContextRef = useRef<AudioContext | null>(null)

  // 初始化 AudioContext
  useEffect(() => {
    if (enabled && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (e) {
        console.warn('Web Audio API not supported')
      }
    }
  }, [enabled])

  // 播放音效
  const playSound = useCallback((type: SoundType) => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const config = soundConfigs[type]

    // 如果 AudioContext 处于 suspended 状态，需要 resume
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    try {
      // 创建振荡器
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = config.type
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime)

      // 组合音效添加滑音效果
      if (type === 'combo' || type === 'success') {
        oscillator.frequency.exponentialRampToValueAtTime(
          config.frequency * 1.5,
          ctx.currentTime + config.duration * 0.5
        )
        oscillator.frequency.exponentialRampToValueAtTime(
          config.frequency * 0.8,
          ctx.currentTime + config.duration
        )
      }

      // 连接音效添加双音
      if (type === 'connect') {
        const oscillator2 = ctx.createOscillator()
        oscillator2.type = 'sine'
        oscillator2.frequency.setValueAtTime(config.frequency * 1.5, ctx.currentTime)
        oscillator2.connect(gainNode)
        oscillator2.start(ctx.currentTime)
        oscillator2.stop(ctx.currentTime + config.duration * 0.8)
      }

      // 设置音量淡出
      gainNode.gain.setValueAtTime(config.volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration)

      // 连接节点
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // 播放
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + config.duration)
    } catch (e) {
      console.warn('Failed to play sound:', e)
    }
  }, [enabled])

  // 播放组合音效（多颗行星连线成功）
  const playComboSound = useCallback((level: number) => {
    if (!enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const baseFreq = 600 + level * 100

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    try {
      // 根据组合等级播放不同音效
      for (let i = 0; i < level; i++) {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(baseFreq + i * 150, ctx.currentTime + i * 0.08)

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.15)

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.start(ctx.currentTime + i * 0.08)
        oscillator.stop(ctx.currentTime + i * 0.08 + 0.15)
      }
    } catch (e) {
      console.warn('Failed to play combo sound:', e)
    }
  }, [enabled])

  return { playSound, playComboSound }
}

// 导出简单播放函数（用于非 hook 环境）
export function playSimpleSound(type: SoundType) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const config = soundConfigs[type]

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = config.type
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime)

    gainNode.gain.setValueAtTime(config.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + config.duration)
  } catch (e) {
    console.warn('Failed to play simple sound:', e)
  }
}