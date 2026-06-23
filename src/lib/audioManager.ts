/**
 * 音频管理器
 * 支持：背景音乐、环境音效、交互音效
 * 动态音量控制、静音模式
 */

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'transition' | 'achievement' | 'meteor' | 'aurora'
type BgmType = 'mysterious' | 'excited' | 'calm' | 'fate'

interface AudioManagerState {
  masterVolume: number      // 主音量 0-1
  bgmVolume: number        // BGM音量 0-1
  sfxVolume: number        // 音效音量 0-1
  isMuted: boolean         // 全局静音
  currentBgm: BgmType | null
}

// 生成简单的音效（使用Web Audio API合成）
function generateSound(type: SoundType, volume: number): AudioBufferSourceNode | null {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    const now = audioContext.currentTime
    gainNode.gain.setValueAtTime(volume * 0.3, now)
    
    switch (type) {
      case 'click':
        oscillator.frequency.setValueAtTime(800, now)
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        oscillator.start(now)
        oscillator.stop(now + 0.1)
        break
        
      case 'hover':
        oscillator.frequency.setValueAtTime(600, now)
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
        oscillator.start(now)
        oscillator.stop(now + 0.05)
        break
        
      case 'success':
        oscillator.frequency.setValueAtTime(523, now) // C5
        oscillator.frequency.setValueAtTime(659, now + 0.1) // E5
        oscillator.frequency.setValueAtTime(784, now + 0.2) // G5
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        oscillator.start(now)
        oscillator.stop(now + 0.4)
        break
        
      case 'error':
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(200, now)
        oscillator.frequency.setValueAtTime(150, now + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
        oscillator.start(now)
        oscillator.stop(now + 0.2)
        break
        
      case 'achievement':
        oscillator.frequency.setValueAtTime(523, now)
        oscillator.frequency.setValueAtTime(784, now + 0.15)
        oscillator.frequency.setValueAtTime(1047, now + 0.3) // C6
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        oscillator.start(now)
        oscillator.stop(now + 0.5)
        break
        
      case 'transition':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(300, now)
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.2)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        oscillator.start(now)
        oscillator.stop(now + 0.3)
        break
        
      case 'meteor':
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(1000, now)
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        oscillator.start(now)
        oscillator.stop(now + 0.5)
        break
        
      case 'aurora':
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(200, now)
        oscillator.frequency.linearRampToValueAtTime(400, now + 0.5)
        oscillator.frequency.linearRampToValueAtTime(200, now + 1)
        gainNode.gain.setValueAtTime(volume * 0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1)
        oscillator.start(now)
        oscillator.stop(now + 1)
        break
        
      default:
        return null
    }
    
    return oscillator
  } catch {
    return null
  }
}

// 生成简单的BGM循环（使用Web Audio API合成基础氛围音）
function createBgmLoop(type: BgmType, volume: number): { node: OscillatorNode; gain: GainNode } | null {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()
    
    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    gainNode.gain.setValueAtTime(volume * 0.15, audioContext.currentTime)
    filter.type = 'lowpass'
    
    switch (type) {
      case 'mysterious':
        // 低沉的嗡鸣声
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(55, audioContext.currentTime) // A1
        filter.frequency.setValueAtTime(200, audioContext.currentTime)
        break
        
      case 'excited':
        // 轻快的高频音
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
        filter.frequency.setValueAtTime(800, audioContext.currentTime)
        break
        
      case 'calm':
        // 柔和的持续音
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime) // A3
        filter.frequency.setValueAtTime(400, audioContext.currentTime)
        break
        
      case 'fate':
        // 命运感 - 中等频率
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(110, audioContext.currentTime) // A2
        filter.frequency.setValueAtTime(300, audioContext.currentTime)
        break
    }
    
    return { node: oscillator, gain: gainNode }
  } catch {
    return null
  }
}

class AudioManagerClass {
  private state: AudioManagerState = {
    masterVolume: 0.8,
    bgmVolume: 0.5,
    sfxVolume: 0.7,
    isMuted: false,
    currentBgm: null,
  }
  
  private bgmNode: OscillatorNode | null = null
  private bgmGain: GainNode | null = null
  private bgmInterval: number | null = null
  private audioContext: AudioContext | null = null
  
  constructor() {
    // 尝试恢复AudioContext（浏览器限制）
    this.setupAutoResume()
  }
  
  private setupAutoResume() {
    const tryResume = () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
    }
    
    document.addEventListener('click', tryResume, { once: true })
    document.addEventListener('keydown', tryResume, { once: true })
  }
  
  // 播放音效
  playSound(type: SoundType) {
    if (this.state.isMuted) return
    const volume = this.state.masterVolume * this.state.sfxVolume
    generateSound(type, volume)
  }
  
  // 播放BGM
  playBgm(type: BgmType) {
    if (this.state.isMuted) return
    if (this.state.currentBgm === type) return
    
    // 停止当前BGM
    this.stopBgm()
    
    const volume = this.state.masterVolume * this.state.bgmVolume
    const bgmData = createBgmLoop(type, volume)
    
    if (bgmData) {
      this.bgmNode = bgmData.node
      this.bgmGain = bgmData.gain
      this.bgmNode.start()
      this.state.currentBgm = type
      
      // 随机微微变化频率增加自然感
      this.bgmInterval = window.setInterval(() => {
        if (this.bgmNode && this.audioContext) {
          const baseFreq = this.getBaseFrequency(type)
          const variation = (Math.random() - 0.5) * 10
          this.bgmNode.frequency.setValueAtTime(
            baseFreq + variation, 
            this.audioContext.currentTime
          )
        }
      }, 2000)
    }
  }
  
  private getBaseFrequency(type: BgmType): number {
    switch (type) {
      case 'mysterious': return 55
      case 'excited': return 440
      case 'calm': return 220
      case 'fate': return 110
    }
  }
  
  // 停止BGM
  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval)
      this.bgmInterval = null
    }
    if (this.bgmNode) {
      try {
        this.bgmNode.stop()
      } catch {}
      this.bgmNode = null
    }
    this.bgmGain = null
    this.state.currentBgm = null
  }
  
  // 暂停BGM
  pauseBgm() {
    if (this.bgmGain && this.audioContext) {
      this.bgmGain.gain.setValueAtTime(0, this.audioContext.currentTime)
    }
  }
  
  // 恢复BGM
  resumeBgm() {
    if (this.bgmGain && this.audioContext) {
      const volume = this.state.masterVolume * this.state.bgmVolume
      this.bgmGain.gain.setValueAtTime(volume * 0.15, this.audioContext.currentTime)
    }
  }
  
  // 淡入BGM
  fadeInBgm(type: BgmType, duration: number = 2000) {
    if (this.state.isMuted) return
    
    this.playBgm(type)
    
    if (this.bgmGain && this.audioContext) {
      const targetVolume = this.state.masterVolume * this.state.bgmVolume * 0.15
      this.bgmGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      this.bgmGain.gain.linearRampToValueAtTime(targetVolume, this.audioContext.currentTime + duration / 1000)
    }
  }
  
  // 淡出BGM
  fadeOutBgm(duration: number = 2000) {
    if (this.bgmGain && this.audioContext && this.bgmNode) {
      const currentVolume = this.state.masterVolume * this.state.bgmVolume * 0.15
      this.bgmGain.gain.setValueAtTime(currentVolume, this.audioContext.currentTime)
      this.bgmGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000)
      
      setTimeout(() => {
        this.stopBgm()
      }, duration)
    } else {
      this.stopBgm()
    }
  }
  
  // 切换场景BGM
  switchSceneBgm(scene: 'home' | 'fate' | 'observe' | 'collection') {
    const bgmMap: Record<string, BgmType> = {
      'home': 'mysterious',
      'fate': 'fate',
      'observe': 'excited',
      'collection': 'calm',
    }
    
    const bgmType = bgmMap[scene] || 'mysterious'
    this.fadeInBgm(bgmType, 1500)
  }
  
  // 静音切换
  toggleMute() {
    this.state.isMuted = !this.state.isMuted
    
    if (this.state.isMuted) {
      this.pauseBgm()
    } else {
      this.resumeBgm()
    }
    
    return this.state.isMuted
  }
  
  // 设置主音量
  setMasterVolume(volume: number) {
    this.state.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumes()
  }
  
  // 设置BGM音量
  setBgmVolume(volume: number) {
    this.state.bgmVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumes()
  }
  
  // 设置音效音量
  setSfxVolume(volume: number) {
    this.state.sfxVolume = Math.max(0, Math.min(1, volume))
  }
  
  private updateVolumes() {
    if (this.bgmGain && this.audioContext && !this.state.isMuted) {
      const volume = this.state.masterVolume * this.state.bgmVolume * 0.15
      this.bgmGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    }
  }
  
  // 获取当前状态
  getState() {
    return { ...this.state }
  }
  
  // 播放点击音效（便捷方法）
  click() {
    this.playSound('click')
  }
  
  // 播放成功音效
  success() {
    this.playSound('success')
  }
  
  // 播放错误音效
  error() {
    this.playSound('error')
  }
  
  // 播放成就音效
  achievement() {
    this.playSound('achievement')
  }
  
  // 播放流星音效
  meteor() {
    this.playSound('meteor')
  }
  
  // 播放极光音效
  aurora() {
    this.playSound('aurora')
  }
}

// 单例
export const audioManager = new AudioManagerClass()

// React Hook
import { useEffect, useState } from 'react'

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false)
  
  useEffect(() => {
    const handleClick = () => audioManager.click()
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
  
  const toggleMute = () => {
    const newMuted = audioManager.toggleMute()
    setIsMuted(newMuted)
  }
  
  return {
    audioManager,
    isMuted,
    toggleMute,
    playSound: (type: SoundType) => audioManager.playSound(type),
    playBgm: (type: BgmType) => audioManager.playBgm(type),
    switchSceneBgm: (scene: 'home' | 'fate' | 'observe' | 'collection') => audioManager.switchSceneBgm(scene),
  }
}
