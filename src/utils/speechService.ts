let speechSynth: SpeechSynthesis | null = null

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null
  if (!speechSynth) {
    speechSynth = window.speechSynthesis
  }
  return speechSynth
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth()
  if (!synth) return []
  return synth.getVoices().filter(v => v.lang.startsWith('zh')) || []
}

// 获取晓晓音色（优先选择）
function getXiaoxiaoVoice(): SpeechSynthesisVoice | null {
  const synth = getSynth()
  if (!synth) return null
  const voices = synth.getVoices()
  // 优先匹配晓晓/小美相关音色（Windows系统语音）
  const xiaoxiao = voices.find(v =>
    v.name.toLowerCase().includes('xiaoxiao') ||
    v.name.includes('晓晓') ||
    v.name.includes('小晓') ||
    v.name.includes('小美') ||
    v.name.includes('xiaomei') ||
    v.name.includes('yaoyao') ||
    v.name.includes('yao')
  )
  return xiaoxiao || null
}

export function initVoices(): Promise<void> {
  return new Promise((resolve) => {
    const synth = getSynth()
    if (!synth) {
      resolve()
      return
    }
    const voices = synth.getVoices()
    if (voices.length > 0) {
      resolve()
      return
    }
    synth.onvoiceschanged = () => {
      resolve()
    }
    // 超时处理
    setTimeout(resolve, 1000)
  })
}

function naturalizeText(text: string): string {
  let result = text
  // 移除URL
  result = result.replace(/https?:\/\/[^\s]+/g, '')
  // 移除特殊标签
  result = result.replace(/<<[^>]+>>/g, '')
  // 移除技术标签
  result = result.replace(/[\[\]]/g, '')
  // 换行替换为停顿
  result = result.replace(/\n+/g, '，')
  // 移除多余空白
  result = result.replace(/\s+/g, ' ')
  // 添加结束语气
  result = result.trim()
  if (result && !result.endsWith('。') && !result.endsWith('？') && !result.endsWith('！') && !result.endsWith('~')) {
    result = result + '～'
  }
  return result
}

function splitIntoSegments(text: string): string[] {
  if (!text) return []
  const result: string[] = []
  // 按句子分割
  const sentences = text.split(/(?<=[。！？~])/)
  let current = ''
  for (const s of sentences) {
    if (!s.trim()) continue
    if (current.length + s.length < 60) {
      current += s
    } else {
      if (current.trim()) result.push(current.trim())
      current = s
    }
  }
  if (current.trim()) result.push(current.trim())
  return result.length > 0 ? result : [text]
}

export type VoiceSettings = {
  rate: number
  pitch: number
  volume: number
  enabled: boolean
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  rate: 1.05,
  pitch: 1.4,
  volume: 0.95,
  enabled: true,
}

export function speak(
  text: string,
  settings: VoiceSettings = DEFAULT_VOICE_SETTINGS,
  onEnd?: () => void,
  onStart?: () => void
): void {
  const synth = getSynth()
  if (!synth || !settings.enabled || !text.trim()) {
    onEnd?.()
    return
  }

  // 取消之前的播放
  synth.cancel()

  const naturalText = naturalizeText(text)
  if (!naturalText) {
    onEnd?.()
    return
  }

  const segments = splitIntoSegments(naturalText)

  onStart?.()

  let index = 0

  function speakNext() {
    if (index >= segments.length) {
      onEnd?.()
      return
    }

    const segment = segments[index]
    if (!segment.trim()) {
      index++
      speakNext()
      return
    }

    const utterance = new SpeechSynthesisUtterance(segment)
    utterance.rate = settings.rate
    utterance.pitch = settings.pitch
    utterance.volume = settings.volume
    utterance.lang = 'zh-CN'

    // 优先使用晓晓音色
    const xiaoxiao = getXiaoxiaoVoice()
    if (xiaoxiao) {
      utterance.voice = xiaoxiao
    } else {
      // 尝试选择中文语音
      const voices = synth.getVoices()
      const chineseVoice = voices.find(v => v.lang.startsWith('zh'))
      if (chineseVoice) {
        utterance.voice = chineseVoice
      }
    }

    utterance.onend = () => {
      index++
      // 段落间停顿
      if (index < segments.length) {
        setTimeout(speakNext, 300)
      } else {
        onEnd?.()
      }
    }

    utterance.onerror = () => {
      index++
      if (index < segments.length) {
        setTimeout(speakNext, 300)
      } else {
        onEnd?.()
      }
    }

    synth.speak(utterance)
  }

  speakNext()
}

export function stopSpeaking(): void {
  const synth = getSynth()
  if (!synth) return
  synth.cancel()
}

export function isSpeaking(): boolean {
  const synth = getSynth()
  if (!synth) return false
  return synth.speaking
}
