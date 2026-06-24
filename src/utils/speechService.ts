let speechSynth: SpeechSynthesis | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null

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

function cleanTextForSpeech(text: string): string {
  let cleaned = text
  cleaned = cleaned.replace(/[，。！？、；：""''（）《》【】…—~]/g, ' ')
  cleaned = cleaned.replace(/[,.!?;:"'()<>\[\]{}\-_~`@#$%^&*+=|\\/]/g, ' ')
  cleaned = cleaned.replace(/\s+/g, ' ')
  cleaned = cleaned.replace(/[^\u4e00-\u9fa5\w\s]/g, '')
  return cleaned.trim()
}

export type VoiceSettings = {
  rate: number
  pitch: number
  volume: number
  voiceIndex?: number
  enabled: boolean
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  rate: 1.15,
  pitch: 1.7,
  volume: 0.9,
  enabled: true,
}

export function speak(
  text: string,
  settings: VoiceSettings = DEFAULT_VOICE_SETTINGS,
  onEnd?: () => void,
  onStart?: () => void
): void {
  const synth = getSynth()
  if (!synth || !settings.enabled) {
    onEnd?.()
    return
  }

  stopSpeaking()

  const cleanedText = cleanTextForSpeech(text)
  if (!cleanedText) {
    onEnd?.()
    return
  }

  const utterance = new SpeechSynthesisUtterance(cleanedText)
  utterance.rate = settings.rate
  utterance.pitch = settings.pitch
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

  utterance.onstart = () => {
    onStart?.()
  }

  utterance.onend = () => {
    currentUtterance = null
    onEnd?.()
  }

  utterance.onerror = () => {
    currentUtterance = null
    onEnd?.()
  }

  currentUtterance = utterance
  synth.speak(utterance)
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
