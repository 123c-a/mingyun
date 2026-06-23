/**
 * OS Window — 可拖拽/缩放的窗口组件
 * 每个窗口：标题栏（可拖拽）+ 内容区（App）+ 右下角缩放手柄
 */

import { useOSStore, WindowState, APP_REGISTRY } from '../../store/osStore'
import { useWindowManager } from '../../hooks/useWindowManager'

type Props = {
  win: WindowState
  children: React.ReactNode
}

export default function OSWindow({ win, children }: Props) {
  const { onMouseDown } = useWindowManager(win.id)
  const closeWindow = useOSStore((s) => s.closeWindow)
  const minimizeWindow = useOSStore((s) => s.minimizeWindow)
  const maximizeWindow = useOSStore((s) => s.maximizeWindow)
  const restoreWindow = useOSStore((s) => s.restoreWindow)
  const focusWindow = useOSStore((s) => s.focusWindow)

  const appInfo = APP_REGISTRY[win.appId]
  const accent = appInfo?.accentColor || '#a855f7'

  if (win.isMinimized) return null

  const handleTitleBarDoubleClick = () => {
    maximizeWindow(win.id)
  }

  const handleWindowClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      focusWindow(win.id)
    }
  }

  return (
    <div
      onClick={handleWindowClick}
      style={{
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'all',
      }}
    >
      {/* ===== 标题栏 ===== */}
      <div
        onMouseDown={(e) => onMouseDown(e, 'move')}
        onDoubleClick={handleTitleBarDoubleClick}
        className="flex items-center justify-between px-3 flex-shrink-0 select-none cursor-grab active:cursor-grabbing rounded-t-xl overflow-hidden"
        style={{
          height: 40,
          background: `linear-gradient(135deg, ${accent}33, ${accent}15)`,
          borderBottom: `1px solid ${accent}44`,
          boxShadow: `0 2px 12px ${accent}22`,
        }}
      >
        {/* 左侧：图标 + 标题 */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">{appInfo?.icon || '📦'}</span>
          <span
            className="text-sm font-semibold truncate"
            style={{ color: accent }}
          >
            {win.title}
          </span>
        </div>

        {/* 右侧：控制按钮 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 最小化 */}
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-6 h-6 rounded flex items-center justify-center text-xs transition-all hover:bg-white/15"
            title="最小化"
          >
            <span style={{ color: '#94a3b8', fontSize: 10 }}>─</span>
          </button>
          {/* 最大化 */}
          <button
            onClick={() => maximizeWindow(win.id)}
            className="w-6 h-6 rounded flex items-center justify-center text-xs transition-all hover:bg-white/15"
            title={win.isMaximized ? '还原' : '最大化'}
          >
            <span style={{ color: '#94a3b8', fontSize: 10 }}>
              {win.isMaximized ? '❐' : '□'}
            </span>
          </button>
          {/* 关闭 */}
          {appInfo?.hasClose !== false && (
            <button
              onClick={() => closeWindow(win.id)}
              className="w-6 h-6 rounded flex items-center justify-center text-xs transition-all hover:bg-red-500/70 hover:text-white"
              title="关闭"
            >
              <span style={{ fontSize: 10 }}>✕</span>
            </button>
          )}
        </div>
      </div>

      {/* ===== 内容区 ===== */}
      <div
        className="flex-1 overflow-hidden rounded-b-xl"
        style={{
          background: 'rgba(8, 14, 28, 0.92)',
          border: `1px solid ${accent}33`,
          borderTop: 'none',
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 ${accent}22`,
        }}
      >
        {children}
      </div>

      {/* ===== 右下角缩放手柄 ===== */}
      {appInfo?.resizable && !win.isMaximized && (
        <div
          onMouseDown={(e) => onMouseDown(e, 'resize-se')}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            cursor: 'nwse-resize',
            zIndex: 10,
          }}
        >
          <svg
            viewBox="0 0 16 16"
            style={{ width: '100%', height: '100%', opacity: 0.3 }}
          >
            <path d="M13 3 L3 13 M9 3 L3 9 M13 9 L9 13" stroke={accent} strokeWidth="1.2" fill="none" />
          </svg>
        </div>
      )}
    </div>
  )
}
