/**
 * MultiverseOS Store
 * 负责：
 * - 窗口管理（打开/关闭/最小化/最大化/前台化）
 * - App 注册表
 * - 桌面背景/主题偏好
 * - 系统状态（开始菜单/系统托盘）
 */

import { create } from 'zustand'

// ============ 类型定义 ============

export type AppId =
  | 'fateos'
  | 'universebrowser'
  | 'observerai'
  | 'livedstudio'
  | 'journal'
  | 'system'
  | 'destinysim'

export type AppInfo = {
  id: AppId
  title: string
  icon: string        // emoji 或文字
  accentColor: string // CSS 颜色
  minWidth: number
  minHeight: number
  defaultWidth: number
  defaultHeight: number
  resizable: boolean
  /** 是否有标题栏关闭按钮 */
  hasClose?: boolean
}

export type WindowState = {
  id: string              // unique window instance id (e.g. "fateos-1")
  appId: AppId
  title: string
  x: number               // 屏幕左侧偏移
  y: number               // 屏幕顶部偏移
  width: number
  height: number
  zIndex: number          // 层叠顺序
  isMinimized: boolean
  isMaximized: boolean
  /** 最小化前的位置（用于恢复） */
  prevBounds?: { x: number; y: number; width: number; height: number }
}

type OSStore = {
  // ============ 窗口列表 ============
  windows: WindowState[]
  topZIndex: number

  // ============ 桌面偏好 ============
  theme: 'dark' | 'light'
  bgMusicEnabled: boolean

  // ============ UI 状态 ============
  startMenuOpen: boolean
  systemTrayOpen: boolean

  // ============ 方法：窗口管理 ============
  openApp: (appId: AppId) => void
  closeWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  restoreWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  updateWindowBounds: (windowId: string, bounds: Partial<Pick<WindowState, 'x' | 'y' | 'width' | 'height'>>) => void
  closeAllWindows: () => void

  // ============ 方法：UI ============
  toggleStartMenu: () => void
  toggleSystemTray: () => void
  setTheme: (t: 'dark' | 'light') => void
  toggleBgMusic: () => void

  // ============ 方法：查找 ============
  getAppInfo: (appId: AppId) => AppInfo | undefined
  getWindowById: (windowId: string) => WindowState | undefined
}

// ============ App 注册表 ============
export const APP_REGISTRY: Record<AppId, AppInfo> = {
  fateos: {
    id: 'fateos',
    title: '命运编译器',
    icon: '🔮',
    accentColor: '#a855f7',
    minWidth: 480,
    minHeight: 400,
    defaultWidth: 720,
    defaultHeight: 600,
    resizable: true,
    hasClose: true,
  },
  universebrowser: {
    id: 'universebrowser',
    title: '宇宙浏览器',
    icon: '🪐',
    accentColor: '#38bdf8',
    minWidth: 500,
    minHeight: 400,
    defaultWidth: 900,
    defaultHeight: 650,
    resizable: true,
    hasClose: true,
  },
  observerai: {
    id: 'observerai',
    title: '观察者 AI',
    icon: '🤖',
    accentColor: '#f43f5e',
    minWidth: 400,
    minHeight: 350,
    defaultWidth: 520,
    defaultHeight: 480,
    resizable: true,
    hasClose: true,
  },
  livedstudio: {
    id: 'livedstudio',
    title: '星际直播台',
    icon: '📺',
    accentColor: '#f59e0b',
    minWidth: 380,
    minHeight: 300,
    defaultWidth: 480,
    defaultHeight: 420,
    resizable: true,
    hasClose: true,
  },
  journal: {
    id: 'journal',
    title: '观测日志',
    icon: '📔',
    accentColor: '#10b981',
    minWidth: 400,
    minHeight: 350,
    defaultWidth: 560,
    defaultHeight: 480,
    resizable: true,
    hasClose: true,
  },
  system: {
    id: 'system',
    title: '系统设置',
    icon: '⚙️',
    accentColor: '#64748b',
    minWidth: 420,
    minHeight: 380,
    defaultWidth: 520,
    defaultHeight: 480,
    resizable: true,
    hasClose: true,
  },
  destinysim: {
    id: 'destinysim',
    title: '命运模拟器',
    icon: '🌟',
    accentColor: '#ec4899',
    minWidth: 700,
    minHeight: 500,
    defaultWidth: 850,
    defaultHeight: 650,
    resizable: true,
    hasClose: true,
  },
}

// ============ Store 实现 ============
let windowCounter = 0
const genWindowId = (appId: AppId) => `${appId}-${++windowCounter}`

export const useOSStore = create<OSStore>((set, get) => ({
  windows: [],
  topZIndex: 100,
  theme: 'dark',
  bgMusicEnabled: false,
  startMenuOpen: false,
  systemTrayOpen: false,

  // ============ 打开 App ============
  openApp: (appId) => {
    const appInfo = APP_REGISTRY[appId]
    if (!appInfo) return

    const state = get()
    const winId = genWindowId(appId)
    const newZ = state.topZIndex + 1

    // 如果该 App 已经打开，则聚焦而非新建
    const existing = state.windows.find((w) => w.appId === appId)
    if (existing) {
      if (existing.isMinimized) {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === existing.id
              ? { ...w, isMinimized: false, zIndex: newZ }
              : w
          ),
          topZIndex: newZ,
        }))
      } else {
        get().focusWindow(existing.id)
      }
      return
    }

    // 智能初始位置（级联）
    const offset = (state.windows.filter((w) => !w.isMinimized).length % 8) * 30
    const x = Math.min(80 + offset, window.innerWidth - appInfo.defaultWidth - 40)
    const y = Math.min(60 + offset, window.innerHeight - appInfo.defaultHeight - 60)

    const newWin: WindowState = {
      id: winId,
      appId,
      title: appInfo.title,
      x,
      y,
      width: appInfo.defaultWidth,
      height: appInfo.defaultHeight,
      zIndex: newZ,
      isMinimized: false,
      isMaximized: false,
    }

    set((s) => ({
      windows: [...s.windows, newWin],
      topZIndex: newZ,
      startMenuOpen: false,
    }))
  },

  // ============ 关闭窗口 ============
  closeWindow: (windowId) => {
    set((s) => ({ windows: s.windows.filter((w) => w.id !== windowId) }))
  },

  // ============ 最小化 ============
  minimizeWindow: (windowId) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      ),
    }))
  },

  // ============ 最大化 / 还原 ============
  maximizeWindow: (windowId) => {
    const win = get().windows.find((w) => w.id === windowId)
    if (!win) return
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== windowId) return w
        if (w.isMaximized) {
          // 还原
          return {
            ...w,
            isMaximized: false,
            ...(w.prevBounds || {}),
          }
        } else {
          // 最大化：记住当前位置
          return {
            ...w,
            isMaximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - 48, // 留任务栏
          }
        }
      }),
    }))
  },

  // ============ 还原（取消最小化 + 聚焦） ============
  restoreWindow: (windowId) => {
    const newZ = get().topZIndex + 1
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === windowId
          ? { ...w, isMinimized: false, zIndex: newZ }
          : w
      ),
      topZIndex: newZ,
    }))
  },

  // ============ 聚焦窗口（提升 z-index） ============
  focusWindow: (windowId) => {
    const newZ = get().topZIndex + 1
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: newZ } : w
      ),
      topZIndex: newZ,
    }))
  },

  // ============ 更新窗口位置/大小 ============
  updateWindowBounds: (windowId, bounds) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === windowId
          ? { ...w, ...bounds, isMaximized: false }
          : w
      ),
    }))
  },

  // ============ 关闭所有窗口 ============
  closeAllWindows: () => {
    set({ windows: [] })
  },

  // ============ UI 开关 ============
  toggleStartMenu: () => set((s) => ({ startMenuOpen: !s.startMenuOpen, systemTrayOpen: false })),
  toggleSystemTray: () => set((s) => ({ systemTrayOpen: !s.systemTrayOpen, startMenuOpen: false })),
  setTheme: (t) => set({ theme: t }),
  toggleBgMusic: () => set((s) => ({ bgMusicEnabled: !s.bgMusicEnabled })),

  // ============ 查找 ============
  getAppInfo: (appId) => APP_REGISTRY[appId],
  getWindowById: (windowId) => get().windows.find((w) => w.id === windowId),
}))
