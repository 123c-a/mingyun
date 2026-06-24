import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VoiceSettings } from '../utils/speechService'
import { DEFAULT_VOICE_SETTINGS } from '../utils/speechService'

export type AgentMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  action?: {
    type: 'navigate' | 'query' | 'create' | 'recommend'
    payload: any
  }
}

export type AgentLevel = 'stardust' | 'starlet' | 'planet' | 'star' | 'galaxy'

export type AgentState = {
  orbOpen: boolean
  panelOpen: boolean
  orbPosition: { x: number; y: number }
  messages: AgentMessage[]
  level: AgentLevel
  exp: number
  totalInteractions: number
  lastActive: number
  greetingShown: boolean
  voiceSettings: VoiceSettings
  autoPlayVoice: boolean
}

export type AgentActions = {
  toggleOrb: () => void
  setOrbOpen: (open: boolean) => void
  togglePanel: () => void
  setPanelOpen: (open: boolean) => void
  setOrbPosition: (x: number, y: number) => void
  addMessage: (msg: Omit<AgentMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  addExp: (amount: number) => void
  incrementInteractions: () => void
  setGreetingShown: (shown: boolean) => void
  setVoiceSettings: (settings: Partial<VoiceSettings>) => void
  toggleAutoPlayVoice: () => void
  toggleVoiceEnabled: () => void
}

const LEVEL_EXP = {
  stardust: 0,
  starlet: 50,
  planet: 200,
  star: 500,
  galaxy: 1000,
}

function calcLevel(exp: number): AgentLevel {
  if (exp >= LEVEL_EXP.galaxy) return 'galaxy'
  if (exp >= LEVEL_EXP.star) return 'star'
  if (exp >= LEVEL_EXP.planet) return 'planet'
  if (exp >= LEVEL_EXP.starlet) return 'starlet'
  return 'stardust'
}

export const useAgentStore = create<AgentState & AgentActions>()(
  persist(
    (set, get) => ({
      orbOpen: true,
      panelOpen: false,
      orbPosition: { x: 20, y: 50 },
      messages: [],
      level: 'stardust',
      exp: 0,
      totalInteractions: 0,
      lastActive: Date.now(),
      greetingShown: false,
      voiceSettings: DEFAULT_VOICE_SETTINGS,
      autoPlayVoice: false,

      toggleOrb: () => set((s) => ({ orbOpen: !s.orbOpen })),
      setOrbOpen: (open) => set({ orbOpen: open }),
      togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
      setPanelOpen: (open) => set({ panelOpen: open }),
      setOrbPosition: (x, y) => set({ orbPosition: { x, y } }),

      addMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages,
            {
              ...msg,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              timestamp: Date.now(),
            },
          ].slice(-100),
          lastActive: Date.now(),
        })),

      clearMessages: () => set({ messages: [] }),

      addExp: (amount) =>
        set((s) => {
          const newExp = s.exp + amount
          return {
            exp: newExp,
            level: calcLevel(newExp),
          }
        }),

      incrementInteractions: () =>
        set((s) => ({
          totalInteractions: s.totalInteractions + 1,
        })),

      setGreetingShown: (shown) => set({ greetingShown: shown }),

      setVoiceSettings: (settings) =>
        set((s) => ({
          voiceSettings: { ...s.voiceSettings, ...settings },
        })),

      toggleAutoPlayVoice: () =>
        set((s) => ({ autoPlayVoice: !s.autoPlayVoice })),

      toggleVoiceEnabled: () =>
        set((s) => ({
          voiceSettings: {
            ...s.voiceSettings,
            enabled: !s.voiceSettings.enabled,
          },
        })),
    }),
    {
      name: 'star-agent-store',
      partialize: (s) => ({
        messages: s.messages.slice(-20),
        level: s.level,
        exp: s.exp,
        totalInteractions: s.totalInteractions,
        orbPosition: s.orbPosition,
        greetingShown: s.greetingShown,
        voiceSettings: s.voiceSettings,
        autoPlayVoice: s.autoPlayVoice,
      }),
    }
  )
)

export const LEVEL_NAMES: Record<AgentLevel, string> = {
  stardust: '星尘',
  starlet: '星子',
  planet: '行星',
  star: '恒星',
  galaxy: '星系',
}

export const LEVEL_COLORS: Record<AgentLevel, string> = {
  stardust: '#94a3b8',
  starlet: '#60a5fa',
  planet: '#a78bfa',
  star: '#fbbf24',
  galaxy: '#f472b6',
}
