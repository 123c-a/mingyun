/**
 * Taskbar — 底部任务栏
 * - 左侧：Multiverse OS logo + 开始按钮
 * - 中间：打开的窗口缩略图标
 * - 右侧：系统托盘（时间 + 通知 + 设置）
 */

import { useState, useEffect } from 'react'
import { useOSStore, APP_REGISTRY, AppId, AppInfo } from '../../store/osStore'

function StartMenu({ onClose }: { onClose: () => void }) {
  const openApp = useOSStore((s) => s.openApp)

  const apps: AppInfo[] = Object.values(APP_REGISTRY)

  return (
    <div
      className="absolute bottom-14 left-2 rounded-2xl overflow-hidden z-[200]"
      style={{
        width: 320,
        background: 'rgba(8, 14, 28, 0.96)',
        border: '1px solid rgba(168,85,247,0.35)',
        boxShadow: '0 -8px 60px rgba(168,85,247,0.25), 0 20px 60px rgba(0,0,0,0.7)',
      }}
    >
      {/* 标题区 */}
      <div
        className="px-5 py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(56,189,248,0.12))',
          borderBottom: '1px solid rgba(168,85,247,0.25)',
        }}
      >
        <div className="text-lg font-bold text-white flex items-center gap-2">
          <span>🌌</span> Multiverse OS
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          探索你的无限可能
        </div>
      </div>

      {/* App 列表 */}
      <div className="py-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id as AppId)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/[0.06]"
            style={{}}
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: `${app.accentColor}22`,
                border: `1px solid ${app.accentColor}44`,
              }}
            >
              {app.icon}
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-100">{app.title}</div>
              <div className="text-[11px] text-slate-500">
                {app.id === 'fateos' && '命运编译与人生推演'}
                {app.id === 'universebrowser' && '平行宇宙可视化探索'}
                {app.id === 'observerai' && '全局 AI 智能助手'}
                {app.id === 'livedstudio' && '数字人自动直播演示'}
                {app.id === 'journal' && '记录命运观测轨迹'}
                {app.id === 'system' && '系统偏好与主题设置'}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 底部 */}
      <div
        className="px-5 py-3 text-xs text-slate-500 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(100,116,139,0.2)' }}
      >
        <span>v2.5 · 平行宇宙观测站</span>
        <span>© 2025 Multiverse Labs</span>
      </div>
    </div>
  )
}

export default function Taskbar() {
  const windows = useOSStore((s) => s.windows)
  const openApp = useOSStore((s) => s.openApp)
  const toggleStartMenu = useOSStore((s) => s.toggleStartMenu)
  const startMenuOpen = useOSStore((s) => s.startMenuOpen)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)

  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  // 关闭开始菜单（点击外部由父层处理）
  const handleStartClick = () => {
    toggleStartMenu()
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100]"
      style={{ height: 48 }}
    >
      {/* 开始菜单 */}
      {startMenuOpen && (
        <div
          className="fixed inset-0 z-[199]"
          onClick={toggleStartMenu}
        >
          <StartMenu onClose={toggleStartMenu} />
        </div>
      )}

      {/* 任务栏本体 */}
      <div
        className="flex items-center justify-between px-2 h-12 select-none"
        style={{
          background: 'rgba(6, 10, 24, 0.92)',
          borderTop: '1px solid rgba(168,85,247,0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* 左侧：开始按钮 + OS 名称 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
            style={{
              background: startMenuOpen
                ? 'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(56,189,248,0.25))'
                : 'rgba(255,255,255,0.06)',
              border: `1px solid ${startMenuOpen ? 'rgba(168,85,247,0.6)' : 'rgba(255,255,255,0.1)'}`,
              color: startMenuOpen ? '#e2e8f0' : '#94a3b8',
            }}
          >
            <span className="text-base">🌌</span>
            <span className="text-xs font-bold text-white hidden sm:inline">Multiverse OS</span>
          </button>

          {/* 分隔线 */}
          <div className="w-px h-6 bg-slate-700 mx-1" />

          {/* 打开的窗口图标 */}
          <div className="flex items-center gap-1 overflow-hidden max-w-[55vw]">
            {windows.map((win) => {
              const appInfo = APP_REGISTRY[win.appId]
              const isActive = !win.isMinimized
              return (
                <button
                  key={win.id}
                  onClick={() =>
                    win.isMinimized
                      ? restoreWindow(win.id)
                      : focusWindow(win.id)
                  }
                  onDoubleClick={() => minimizeWindow(win.id)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all flex-shrink-0"
                  style={{
                    background: isActive
                      ? `${appInfo?.accentColor}22`
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? `${appInfo?.accentColor}55` : 'rgba(255,255,255,0.08)'}`,
                    maxWidth: 140,
                  }}
                  title={win.title}
                >
                  <span className="text-sm">{appInfo?.icon || '📦'}</span>
                  <span
                    className="text-xs truncate max-w-[80px]"
                    style={{
                      color: isActive ? appInfo?.accentColor : '#94a3b8',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {win.title}
                  </span>
                  {win.isMinimized && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 右侧：系统托盘 */}
        <div className="flex items-center gap-2 px-2">
          {/* 快速打开 */}
          <button
            onClick={() => openApp('system')}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:bg-white/10"
            title="系统设置"
          >
            ⚙️
          </button>

          {/* 时间 */}
          <div className="text-right px-2 hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">{time}</div>
            <div className="text-[10px] text-slate-400 leading-tight">{date}</div>
          </div>

          {/* 通知灯 */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid rgba(168,85,247,0.3)',
            }}
            title="系统就绪"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
