/**
 * MultiverseOS — 宇宙操作系统主入口
 *
 * 将整个应用升维为一个桌面 OS：
 * - 星空桌面（Canvas 粒子背景）
 * - 窗口管理系统（拖拽/缩放/最小化/最大化/关闭）
 * - 任务栏（开始菜单 + 打开的窗口 + 系统托盘）
 * - 6 个系统 App
 */

import { useOSStore, AppId } from '../store/osStore'
import Desktop from '../components/os/Desktop'
import Taskbar from '../components/os/Taskbar'
import OSWindow from '../components/os/Window'
import FateOSApp from '../components/os/apps/FateOSApp'
import ObserverAIApp from '../components/os/apps/ObserverAIApp'
import LiveStudioApp from '../components/os/apps/LiveStudioApp'
import UniverseBrowserApp from '../components/os/apps/UniverseBrowserApp'
import JournalApp from '../components/os/apps/JournalApp'
import SystemApp from '../components/os/apps/SystemApp'
import DestinySimApp from '../components/os/apps/DestinySimApp'

// App ID → 渲染组件映射
const APP_RENDERERS: Record<AppId, React.ComponentType> = {
  fateos: FateOSApp,
  universebrowser: UniverseBrowserApp,
  observerai: ObserverAIApp,
  livedstudio: LiveStudioApp,
  journal: JournalApp,
  system: SystemApp,
  destinysim: DestinySimApp,
}

export default function MultiverseOS() {
  const windows = useOSStore((s) => s.windows)

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: '#030308',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        userSelect: 'none',
      }}
    >
      {/* 第 1 层：星空桌面背景 */}
      <Desktop />

      {/* 第 2 层：所有窗口（按 z-index 排序） */}
      {windows
        .slice()
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((win) => {
          const AppComponent = APP_RENDERERS[win.appId]
          if (!AppComponent) return null
          return (
            <OSWindow key={win.id} win={win}>
              <AppComponent />
            </OSWindow>
          )
        })}

      {/* 第 3 层：任务栏 */}
      <Taskbar />
    </div>
  )
}
