import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LegoBuilder } from '../components/lego/LegoBuilder'
import { useLegoStore } from '../components/lego/legoStore'

export default function LegoBuilderPage() {
  const navigate = useNavigate()
  const {
    rotateSelected,
    duplicateSelected,
    removePiece,
    selectedId,
    scaleSelected,
    moveSelected,
    moveSelectedY,
  } = useLegoStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in input fields
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }

      switch (e.key) {
        case 'r':
        case 'R':
          e.preventDefault()
          rotateSelected()
          break
        case 'd':
        case 'D':
          if (e.ctrlKey || e.metaKey) return // allow browser duplicate-tab
          e.preventDefault()
          duplicateSelected()
          break
        case 'Delete':
        case 'Backspace':
          if (selectedId) {
            e.preventDefault()
            removePiece(selectedId)
          }
          break
        case '+':
        case '=':
          e.preventDefault()
          scaleSelected(0.1)
          break
        case '-':
          e.preventDefault()
          scaleSelected(-0.1)
          break
        case 'ArrowLeft':
          e.preventDefault()
          moveSelected(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          moveSelected(1, 0)
          break
        case 'ArrowUp':
          if (e.shiftKey) {
            e.preventDefault()
            moveSelectedY(1)
          } else {
            e.preventDefault()
            moveSelected(0, -1)
          }
          break
        case 'ArrowDown':
          if (e.shiftKey) {
            e.preventDefault()
            moveSelectedY(-1)
          } else {
            e.preventDefault()
            moveSelected(0, 1)
          }
          break
        case 'Escape':
          if (window.confirm('返回主页？')) {
            navigate('/')
          }
          break
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, rotateSelected, duplicateSelected, removePiece, selectedId, scaleSelected, moveSelected, moveSelectedY])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f1118' }}>
      <LegoBuilder />
    </div>
  )
}
