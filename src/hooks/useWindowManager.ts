/**
 * useWindowManager — 窗口拖拽 + 缩放 Hook
 *
 * 绑定到 Window 组件的根 div：
 * - 鼠标按下标题栏 → 开始拖拽
 * - 鼠标按下边缘/角落 → 开始缩放
 * - 拖拽时实时更新 store 中的位置/尺寸
 */

import { useCallback, useRef } from 'react'
import { useOSStore } from '../store/osStore'

type DragType = 'move' | 'resize-e' | 'resize-s' | 'resize-se' | null

export function useWindowManager(windowId: string) {
  const updateBounds = useOSStore((s) => s.updateWindowBounds)
  const focusWindow = useOSStore((s) => s.focusWindow)

  const dragRef = useRef<{
    type: DragType
    startX: number
    startY: number
    startWinX: number
    startWinY: number
    startWinW: number
    startWinH: number
  }>({
    type: null,
    startX: 0,
    startY: 0,
    startWinX: 0,
    startWinY: 0,
    startWinW: 0,
    startWinH: 0,
  })

  const onMouseDown = useCallback(
    (e: React.MouseEvent, type: DragType) => {
      if (type === null) return
      e.preventDefault()
      e.stopPropagation()

      focusWindow(windowId)
      const win = useOSStore.getState().getWindowById(windowId)
      if (!win) return

      dragRef.current = {
        type,
        startX: e.clientX,
        startY: e.clientY,
        startWinX: win.x,
        startWinY: win.y,
        startWinW: win.width,
        startWinH: win.height,
      }

      const onMove = (ev: MouseEvent) => {
        const d = dragRef.current
        if (!d.type) return
        const dx = ev.clientX - d.startX
        const dy = ev.clientY - d.startY

        if (d.type === 'move') {
          updateBounds(windowId, {
            x: d.startWinX + dx,
            y: Math.max(0, d.startWinY + dy),
          })
        } else if (d.type === 'resize-e') {
          updateBounds(windowId, {
            width: Math.max(200, d.startWinW + dx),
          })
        } else if (d.type === 'resize-s') {
          updateBounds(windowId, {
            height: Math.max(200, d.startWinH + dy),
          })
        } else if (d.type === 'resize-se') {
          updateBounds(windowId, {
            width: Math.max(200, d.startWinW + dx),
            height: Math.max(200, d.startWinH + dy),
          })
        }
      }

      const onUp = () => {
        dragRef.current.type = null
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [windowId, focusWindow, updateBounds]
  )

  return { onMouseDown }
}
