import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MemoryType = 
  | 'person'      // 人物
  | 'goal'        // 目标
  | 'concern'     // 担忧
  | 'habit'       // 习惯
  | 'preference'  // 偏好
  | 'event'       // 事件
  | 'insight'     // 洞察

export type MemoryEntry = {
  id: string
  type: MemoryType
  content: string
  tags: string[]
  importance: number      // 1-5，重要性
  lastReferenced: number  // 上次提及时间戳
  referenceCount: number   // 被提及/引用次数
  createdAt: number
  source: 'user' | 'agent' | 'system'
  relatedPlanets?: string[] // 关联的行星，如 ['mars', 'mercury']
}

export type MemoryState = {
  memories: MemoryEntry[]
  memoryCount: number
}

export type MemoryActions = {
  addMemory: (entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'lastReferenced' | 'referenceCount'>) => void
  updateMemory: (id: string, updates: Partial<MemoryEntry>) => void
  removeMemory: (id: string) => void
  touchMemory: (id: string) => void  // 更新最后提及时间
  getMemoriesByType: (type: MemoryType) => MemoryEntry[]
  getRecentMemories: (limit?: number) => MemoryEntry[]
  getImportantMemories: (limit?: number) => MemoryEntry[]
  searchMemories: (keyword: string) => MemoryEntry[]
  getMemorySummary: () => string
  clearOldMemories: (daysOld?: number) => void
}

const now = () => Date.now()

export const useMemoryStore = create<MemoryState & MemoryActions>()(
  persist(
    (set, get) => ({
      memories: [],
      memoryCount: 0,

      addMemory: (entry) =>
        set((s) => {
          const id = `mem-${now()}-${Math.random().toString(36).slice(2, 8)}`
          const newEntry: MemoryEntry = {
            ...entry,
            id,
            createdAt: now(),
            lastReferenced: now(),
            referenceCount: 0,
          }
          return {
            memories: [newEntry, ...s.memories].slice(0, 500), // 最多保留500条
            memoryCount: s.memoryCount + 1,
          }
        }),

      updateMemory: (id, updates) =>
        set((s) => ({
          memories: s.memories.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      removeMemory: (id) =>
        set((s) => ({
          memories: s.memories.filter((m) => m.id !== id),
        })),

      touchMemory: (id) =>
        set((s) => ({
          memories: s.memories.map((m) =>
            m.id === id
              ? { ...m, lastReferenced: now(), referenceCount: m.referenceCount + 1 }
              : m
          ),
        })),

      getMemoriesByType: (type) => get().memories.filter((m) => m.type === type),

      getRecentMemories: (limit = 10) =>
        [...get().memories]
          .sort((a, b) => b.lastReferenced - a.lastReferenced)
          .slice(0, limit),

      getImportantMemories: (limit = 10) =>
        [...get().memories]
          .sort((a, b) => b.importance - a.importance || b.referenceCount - a.referenceCount)
          .slice(0, limit),

      searchMemories: (keyword) =>
        get().memories.filter(
          (m) =>
            m.content.toLowerCase().includes(keyword.toLowerCase()) ||
            m.tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()))
        ),

      getMemorySummary: () => {
        const memories = get().memories
        const byType = memories.reduce((acc, m) => {
          acc[m.type] = (acc[m.type] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const typeNames: Record<string, string> = {
          person: '人物',
          goal: '目标',
          concern: '担忧',
          habit: '习惯',
          preference: '偏好',
          event: '事件',
          insight: '洞察',
        }

        const parts = Object.entries(byType)
          .map(([type, count]) => `${typeNames[type] || type}: ${count}`)
          .join('，')

        return parts || '暂无记忆'
      },

      clearOldMemories: (daysOld = 90) =>
        set((s) => ({
          memories: s.memories.filter(
            (m) => now() - m.createdAt < daysOld * 24 * 60 * 60 * 1000
          ),
        })),
    }),
    {
      name: 'star-memory-store',
      partialize: (s) => ({
        memories: s.memories.slice(-200),
        memoryCount: s.memoryCount,
      }),
    }
  )
)
