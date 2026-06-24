import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'important'
export type TaskCategory = 'daily' | 'habit' | 'goal' | 'exploration' | 'custom'

export type SubTask = {
  id: string
  title: string
  completed: boolean
}

export type Task = {
  id: string
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  subTasks: SubTask[]
  relatedPlanet?: string
  relatedGoalId?: string
  createdAt: number
  updatedAt: number
  dueDate?: number
  completedAt?: number
  streak: number       // 连续完成天数
  totalCompletions: number // 总完成次数
  lastCompletedDate?: string // 格式: YYYY-MM-DD
}

export type DailyTask = {
  id: string
  title: string
  emoji: string
  planet?: string
  completed: boolean
  completedAt?: number
  date: string  // YYYY-MM-DD
}

export type Goal = {
  id: string
  title: string
  description?: string
  subGoals: { id: string; title: string; completed: boolean }[]
  relatedPlanet?: string
  createdAt: number
  targetDate?: number
  progress: number  // 0-100
}

export type TaskState = {
  tasks: Task[]
  dailyTasks: DailyTask[]
  goals: Goal[]
  completedTasksCount: number
  totalStreak: number  // 最长连续完成任务天数
}

export type TaskActions = {
  // 任务CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'streak' | 'totalCompletions'>) => string
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  completeTask: (id: string) => void
  
  // 每日任务
  getTodayTasks: () => DailyTask[]
  addDailyTask: (task: Omit<DailyTask, 'id' | 'date'>) => void
  toggleDailyTask: (id: string) => void
  resetDailyTasks: () => void
  
  // 目标管理
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => string
  updateGoal: (id: string, updates: Partial<Goal>) => void
  removeGoal: (id: string) => void
  updateGoalProgress: (id: string) => void
  
  // 统计
  getStats: () => {
    todayCompleted: number
    todayTotal: number
    weekCompleted: number
    weekTotal: number
    activeGoals: number
    longestStreak: number
  }
  
  // 自动生成每日任务
  generateDailyTasks: () => void
}

const now = () => Date.now()
const today = () => new Date().toISOString().slice(0, 10)

const DEFAULT_DAILY_TASKS = [
  { title: '记录一个思绪', emoji: '💭', planet: 'mercury' },
  { title: '觉察一次情绪', emoji: '🔥', planet: 'mars' },
  { title: '说一句温柔的话', emoji: '🌸', planet: 'venus' },
  { title: '感谢一个人', emoji: '✨', planet: 'jupiter' },
]

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set, get) => ({
      tasks: [],
      dailyTasks: [],
      goals: [],
      completedTasksCount: 0,
      totalStreak: 0,

      addTask: (task) => {
        const id = `task-${now()}-${Math.random().toString(36).slice(2, 6)}`
        set((s) => ({
          tasks: [
            {
              ...task,
              id,
              createdAt: now(),
              updatedAt: now(),
              streak: 0,
              totalCompletions: 0,
            },
            ...s.tasks,
          ],
        }))
        return id
      },

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: now() } : t
          ),
        })),

      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      completeTask: (id) =>
        set((s) => {
          const task = s.tasks.find((t) => t.id === id)
          if (!task) return s

          const todayStr = today()
          const isSameDay = task.lastCompletedDate === todayStr
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
          const isYesterday = task.lastCompletedDate === yesterday
          const newStreak = isSameDay ? task.streak : isYesterday ? task.streak + 1 : 1

          return {
            tasks: s.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: 'completed' as TaskStatus,
                    completedAt: now(),
                    updatedAt: now(),
                    streak: newStreak,
                    totalCompletions: t.totalCompletions + 1,
                    lastCompletedDate: todayStr,
                  }
                : t
            ),
            completedTasksCount: s.completedTasksCount + 1,
            totalStreak: Math.max(s.totalStreak, newStreak),
          }
        }),

      getTodayTasks: () => {
        const todayStr = today()
        const { dailyTasks } = get()
        return dailyTasks.filter((t) => t.date === todayStr)
      },

      addDailyTask: (task) => {
        const todayStr = today()
        const id = `daily-${now()}-${Math.random().toString(36).slice(2, 6)}`
        set((s) => ({
          dailyTasks: [
            ...s.dailyTasks,
            { ...task, id, date: todayStr },
          ],
        }))
      },

      toggleDailyTask: (id) =>
        set((s) => ({
          dailyTasks: s.dailyTasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? now() : undefined,
                }
              : t
          ),
        })),

      resetDailyTasks: () => {
        const todayStr = today()
        set((s) => ({
          dailyTasks: [
            ...s.dailyTasks.filter((t) => t.date !== todayStr),
            ...DEFAULT_DAILY_TASKS.map((t, i) => ({
              id: `default-daily-${now()}-${i}`,
              ...t,
              completed: false,
              date: todayStr,
            })),
          ],
        }))
      },

      addGoal: (goal) => {
        const id = `goal-${now()}-${Math.random().toString(36).slice(2, 6)}`
        set((s) => ({
          goals: [
            {
              ...goal,
              id,
              createdAt: now(),
              progress: 0,
            },
            ...s.goals,
          ],
        }))
        return id
      },

      updateGoal: (id, updates) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),

      removeGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      updateGoalProgress: (id) =>
        set((s) => ({
          goals: s.goals.map((g) => {
            if (g.id !== id) return g
            const completed = g.subGoals.filter((sg) => sg.completed).length
            const progress = Math.round((completed / g.subGoals.length) * 100)
            return { ...g, progress }
          }),
        })),

      getStats: () => {
        const todayStr = today()
        const { tasks, dailyTasks, goals } = get()
        
        const todayDailyTasks = dailyTasks.filter((t) => t.date === todayStr)
        const todayCompleted = todayDailyTasks.filter((t) => t.completed).length
        
        const weekAgo = Date.now() - 7 * 86400000
        const weekCompleted = tasks.filter(
          (t) => t.completedAt && t.completedAt > weekAgo
        ).length
        const weekTotal = tasks.filter((t) => t.createdAt > weekAgo).length + 7
        
        return {
          todayCompleted,
          todayTotal: todayDailyTasks.length || DEFAULT_DAILY_TASKS.length,
          weekCompleted,
          weekTotal,
          activeGoals: goals.filter((g) => g.progress < 100).length,
          longestStreak: get().totalStreak,
        }
      },

      generateDailyTasks: () => {
        const todayStr = today()
        const { dailyTasks } = get()
        const existingToday = dailyTasks.filter((t) => t.date === todayStr)
        
        if (existingToday.length === 0) {
          get().resetDailyTasks()
        }
      },
    }),
    {
      name: 'star-task-store',
      partialize: (s) => ({
        tasks: s.tasks.slice(-50),
        dailyTasks: s.dailyTasks.slice(-30),
        goals: s.goals,
        completedTasksCount: s.completedTasksCount,
        totalStreak: s.totalStreak,
      }),
    }
  )
)
