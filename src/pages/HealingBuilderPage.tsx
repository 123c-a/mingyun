import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HealingBuilder } from '../components/healing/HealingBuilder'
import { useShapeStore } from '../components/healing/healingStore'

export default function HealingBuilderPage() {
  const navigate = useNavigate()
  const {
    rotateSelected, duplicateSelected, removePiece,
    selectedId, scaleSelected, moveSelected, moveSelectedY,
  } = useShapeStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return

      switch (e.key) {
        case 'r':
        case 'R':
          e.preventDefault()
          rotateSelected()
          break
        case 'd':
        case 'D':
          if (e.ctrlKey || e.metaKey) return
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
          scaleSelected(0.15)
          break
        case '-':
          e.preventDefault()
          scaleSelected(-0.15)
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
          e.preventDefault()
          if (e.shiftKey) moveSelectedY(1)
          else moveSelected(0, -1)
          break
        case 'ArrowDown':
          e.preventDefault()
          if (e.shiftKey) moveSelectedY(-1)
          else moveSelected(0, 1)
          break
        case 'Escape':
          if (window.confirm('返回主页？')) navigate('/')
          break
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, rotateSelected, duplicateSelected, removePiece, selectedId, scaleSelected, moveSelected, moveSelectedY])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f1120' }}>
      <HealingBuilder />
    </div>
  )
}
