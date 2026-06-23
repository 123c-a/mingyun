/**
 * UniverseBrowserApp — 宇宙浏览器
 * 3D 可视化展示多个平行宇宙的分叉与关系
 */

import { useEffect, useRef, useState } from 'react'

type UniverseNode = {
  id: string
  name: string
  type: 'root' | 'branch-a' | 'branch-b' | 'merged'
  x: number
  y: number
  z: number
  color: string
  description: string
  connectedTo: string[]
}

const DEMO_UNIVERSES: UniverseNode[] = [
  { id: 'u0', name: '本源宇宙', type: 'root', x: 0, y: 0, z: 0, color: '#a855f7', description: '你的初始命运线', connectedTo: ['u1', 'u2'] },
  { id: 'u1', name: '宇宙 A — 冒险者', type: 'branch-a', x: -180, y: 80, z: -50, color: '#38bdf8', description: '你选择了勇敢探索未知', connectedTo: ['u3'] },
  { id: 'u2', name: '宇宙 B — 守护者', type: 'branch-b', x: 180, y: 80, z: -50, color: '#f43f5e', description: '你选择了安稳与守护', connectedTo: ['u3'] },
  { id: 'u3', name: '融合宇宙', type: 'merged', x: 0, y: 180, z: 0, color: '#fbbf24', description: '两条路径最终在某个节点交汇', connectedTo: [] },
]

export default function UniverseBrowserApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ down: false, x: 0, y: 0, rotX: 0.3, rotY: 0 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    const draw = () => {
      frame++
      const W = canvas.clientWidth
      const H = canvas.clientHeight
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const rotY = mouseRef.current.rotY + rotation * 0.005

      // 3D→2D 投影
      const project = (u: UniverseNode) => {
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const x3 = u.x * cosY - u.z * sinY
        const z3 = u.x * sinY + u.z * cosY
        const x2 = cx + x3
        const y2 = cy + u.y - z3 * 0.3
        const scale = 1 - z3 * 0.001
        return { x: x2, y: y2, scale: Math.max(0.4, scale) }
      }

      // 画连线
      for (const u of DEMO_UNIVERSES) {
        for (const tid of u.connectedTo) {
          const t = DEMO_UNIVERSES.find((x) => x.id === tid)
          if (!t) continue
          const p1 = project(u)
          const p2 = project(t)
          const isHighlighted = selected === u.id || selected === tid
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = isHighlighted
            ? `${u.color}99`
            : `${u.color}22`
          ctx.lineWidth = isHighlighted ? 2 : 1
          ctx.stroke()

          // 流动粒子
          if (isHighlighted && frame % 3 === 0) {
            const t_param = ((frame * 0.015) % 1)
            const px = p1.x + (p2.x - p1.x) * t_param
            const py = p1.y + (p2.y - p1.y) * t_param
            ctx.beginPath()
            ctx.arc(px, py, 3, 0, Math.PI * 2)
            ctx.fillStyle = u.color
            ctx.fill()
          }
        }
      }

      // 画节点（按 z 排序）
      const sorted = [...DEMO_UNIVERSES].sort((a, b) => {
        const pa = project(a), pb = project(b)
        return pb.scale - pa.scale
      })

      for (const u of sorted) {
        const p = project(u)
        const r = (20 + (u.type === 'root' ? 10 : 0)) * p.scale
        const isSelected = selected === u.id
        const isHovered = hoveredId === u.id

        // 光晕
        const glowR = r + (isSelected ? 20 : isHovered ? 12 : 6)
        const grad = ctx.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, glowR)
        grad.addColorStop(0, `${u.color}cc`)
        grad.addColorStop(1, `${u.color}00`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // 主体
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `${u.color}33`
        ctx.strokeStyle = u.color
        ctx.lineWidth = isSelected ? 2.5 : 1.5
        ctx.fill()
        ctx.stroke()

        // 符号
        const labels: Record<string, string> = { root: '✦', 'branch-a': 'A', 'branch-b': 'B', merged: '✴' }
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${Math.round(14 * p.scale)}px system-ui`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(labels[u.type] || '●', p.x, p.y)

        // 名称
        const labelY = p.y + r + 14 * p.scale
        ctx.fillStyle = isSelected ? u.color : '#94a3b8'
        ctx.font = `${Math.round(11 * p.scale)}px system-ui`
        ctx.fillText(u.name, p.x, labelY)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [selected, hoveredId, rotation])

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseRef.current.down = true
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseRef.current.down) {
      const dx = e.clientX - mouseRef.current.x
      mouseRef.current.rotY += dx * 0.01
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    // 简单的命中检测
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    const cx = W / 2
    const cy = H / 2
    const rotY = mouseRef.current.rotY + rotation * 0.005

    const project = (u: UniverseNode) => {
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const x3 = u.x * cosY - u.z * sinY
      const z3 = u.x * sinY + u.z * cosY
      const x2 = cx + x3
      const y2 = cy + u.y - z3 * 0.3
      const scale = Math.max(0.4, 1 - z3 * 0.001)
      return { x: x2, y: y2, r: (20 + (u.type === 'root' ? 10 : 0)) * scale }
    }

    let hit: string | null = null
    for (const u of DEMO_UNIVERSES) {
      const p = project(u)
      const dx = e.clientX - rect.left - p.x
      const dy = e.clientY - rect.top - p.y
      if (Math.sqrt(dx * dx + dy * dy) < p.r + 10) {
        hit = u.id
        break
      }
    }
    setHoveredId(hit)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredId) {
      setSelected((prev) => (prev === hoveredId ? null : hoveredId))
    } else {
      setSelected(null)
    }
  }

  const handleMouseUp = () => {
    mouseRef.current.down = false
  }

  const selectedNode = DEMO_UNIVERSES.find((u) => u.id === selected)

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'rgba(6,10,24,0.97)' }}>
      {/* 画布 */}
      <div
        className="flex-shrink-0 relative"
        style={{ height: 280, cursor: hoveredId ? 'pointer' : 'grab' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
        />

        {/* 提示 */}
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-500">
          拖拽旋转 · 点击节点查看详情
        </div>
      </div>

      {/* 详情面板 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {selectedNode ? (
          <div
            className="rounded-xl p-4 text-sm"
            style={{
              background: `${selectedNode.color}12`,
              border: `1px solid ${selectedNode.color}44`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: `${selectedNode.color}22`, border: `1px solid ${selectedNode.color}55` }}
              >
                {selectedNode.type === 'root' ? '✦' : selectedNode.type === 'merged' ? '✴' : selectedNode.type === 'branch-a' ? 'A' : 'B'}
              </span>
              <div>
                <div className="font-bold text-white">{selectedNode.name}</div>
                <div className="text-xs" style={{ color: selectedNode.color }}>{selectedNode.type === 'root' ? '本源宇宙' : selectedNode.type === 'merged' ? '融合宇宙' : `分支宇宙 ${selectedNode.type === 'branch-a' ? 'A' : 'B'}`}</div>
              </div>
            </div>
            <div className="text-slate-400 text-xs leading-relaxed">{selectedNode.description}</div>
          </div>
        ) : (
          <div className="text-center text-slate-500 text-xs py-6">
            <div className="text-2xl mb-2">🪐</div>
            <div>点击任意宇宙节点查看详情</div>
            <div className="mt-1 text-slate-600">拖拽画布旋转视角</div>
          </div>
        )}

        {/* 图例 */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { color: '#a855f7', label: '本源宇宙', icon: '✦' },
            { color: '#38bdf8', label: '分支 A', icon: 'A' },
            { color: '#f43f5e', label: '分支 B', icon: 'B' },
            { color: '#fbbf24', label: '融合宇宙', icon: '✴' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${item.color}0d`, border: `1px solid ${item.color}22` }}>
              <span style={{ color: item.color, fontSize: 12 }}>{item.icon}</span>
              <span className="text-xs text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
