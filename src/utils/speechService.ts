let speechSynth: SpeechSynthesis | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null
let currentSegments: string[] = []
let currentSegmentIndex = 0
let onSegmentEnd: (() => void) | null = null

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null
  if (!speechSynth) {
    speechSynth = window.speechSynthesis || null
  }
  return speechSynth
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function getChineseVoices(): SpeechSynthesisVoice[] {
  const synth = getSynth()
  if (!synth) return []
  
  return synth.getVoices().filter((voice) => {
    const lang = voice.lang.toLowerCase()
    return lang.includes('zh') || lang.includes('cn') || lang.includes('chinese')
  })
}

// 更自然的文本处理
function naturalizeText(text: string): string {
  let result = text
  
  // 移除URL和特殊格式
  result = result.replace(/https?:\/\/[^\s]+/g, '')
  result = result.replace(/<<NAVIGATE:.*?>>/gi, '')
  result = result.replace(/<<RECORD:.*?>>/gi, '')
  result = result.replace(/<<MEMORY:.*?>>/gi, '')
  result = result.replace(/<<TASK:.*?>>/gi, '')
  
  // 移除技术标签
  result = result.replace(/[\[\]]/g, '')
  
  // 把换行替换为停顿
  result = result.replace(/\n+/g, '，')
  
  // 移除多余的空白
  result = result.replace(/\s+/g, ' ')
  
  // 添加自然的语气
  if (!result.endsWith('。') && !result.endsWith('？') && !result.endsWith('！') && !result.endsWith('~')) {
    result = result + '～'
  }
  
  return result.trim()
}

// 将长文本分割成自然的段落
function splitIntoSegments(text: string): string[] {
  const segments: string[] = []
  
  // 按句子分割
  const sentences = text.split(/(?<=[。！？；~])/g)
  
  let current = ''
  for (const sentence of sentences) {
    if (!sentence.trim()) continue
    
    // 如果当前段落加上这句话不会太长
    if (current.length + sentence.length < 80) {
      current += sentence
    } else {
      // 如果当前段落已经有内容，先保存
      if (current.trim()) {
        segments.push(current.trim())
      }
      // 如果单句话太长，按逗号再分割
      if (sentence.length > 80) {
        const parts = sentence.split(/(?=[，、])/g)
        current = ''
        for (const part of parts) {
          if (current.length + part.length < 60) {
            current += part
          } else {
            if (current.trim()) segments.push(current.trim())
            current = part
          }
        }
      } else {
        current = sentence
      }
    }
  }
  
  if (current.trim()) {
    segments.push(current.trim())
  }
  
  return segments.length > 0 ? segments : [text]
}

export type VoiceSettings = {
  rate: number
  pitch: number
  volume: number
  voiceIndex?: number
  enabled: boolean
  naturalMode?: boolean
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  rate: 1.0,
  pitch: 1.5,
  volume: 0.9,
  enabled: true,
  naturalMode: true,
}

function speakSegment(
  text: string,
  settings: VoiceSettings,
  isFirst: boolean,
  isLast: boolean
): Promise<void> {
  return new Promise((resolve) => {
    const synth = getSynth()
    if (!synth) {
      resolve()
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    
    // 根据位置调整语速和音调，让开头和结尾更自然
    let rate = settings.rate
    let pitch = settings.pitch
    
    if (settings.naturalMode) {
      // 开头稍微慢一点，更有开场感
      if (isFirst) {
        rate = Math.max(0.7, rate - 0.1)
      }
      // 结尾稍微慢一点，更有结束感
      if (isLast) {
        rate = Math.max(0.75, rate - 0.15)
      }
    }
    
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = settings.volume
    utterance.lang = 'zh-CN'

    const chineseVoices = getChineseVoices()
    if (chineseVoices.length > 0) {
      const idx = settings.voiceIndex ?? 0
      if (idx < chineseVoices.length) {
        utterance.voice = chineseVoices[idx]
      } else {
        utterance.voice = chineseVoices[0]
      }
    }

    utterance.onend = () => {
      resolve()
    }

    utterance.onerror = () => {
      resolve()
    }

    synth.speak(utterance)
  })
}

export async function speak(
  text: string,
  settings: VoiceSettings = DEFAULT_VOICE_SETTINGS,
  onEnd?: () => void,
  onStart?: () => void
): Promise<void> {
  const synth = getSynth()
  if (!synth || !settings.enabled) {
    onEnd?.()
    return
  }

  stopSpeaking()
  onStart?.()

  const naturalText = naturalizeText(text)
  if (!naturalText) {
    onEnd?.()
    return
  }

  const segments = splitIntoSegments(naturalText)
  currentSegments = segments
  currentSegmentIndex = 0
  onSegmentEnd = onEnd

  // 逐段朗读
  for (let i = 0; i < segments.length; i++) {
    if (!isSpeaking()) break // 被中断
    
    const isFirst = i === 0
    const isLast = i === segments.length - 1
    
    // 段落之间的停顿
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    await speakSegment(segments[i], settings, isFirst, isLast)
  }

  currentSegments = []
  currentSegmentIndex = 0
  onSegmentEnd = null
  onEnd?.()
}

export function stopSpeaking(): void {
  const synth = getSynth()
  if (!synth) return
  synth.cancel()
  currentUtterance = null
}

export function isSpeaking(): boolean {
  const synth = getSynth()
  if (!synth) return false
  return synth.speaking
}

export function pauseSpeaking(): void {
  const synth = getSynth()
  if (!synth) return
  synth.pause()
}

export function resumeSpeaking(): void {
  const synth = getSynth()
  if (!synth) return
  synth.resume()
}

export function getAvailableVoices(): { name: string; lang: string; index: number }[] {
  const voices = getChineseVoices()
  return voices.map((v, i) => ({
    name: v.name,
    lang: v.lang,
    index: i,
  }))
}

export function initVoices(callback?: () => void): void {
  const synth = getSynth()
  if (!synth) return
  
  if (synth.getVoices().length > 0) {
    callback?.()
    return
  }

  const handler = () => {
    callback?.()
    synth.removeEventListener('voiceschanged', handler)
  }

  synth.addEventListener('voiceschanged', handler)
}
