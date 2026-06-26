import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildComboNetwork, type ComboNetworkNode, type ComboNetworkEdge } from '../lib/comboRelations'
import { comboConfigs } from '../data/comboConfigs'

interface Props {
  currentComboId: string
  primaryColor: string
  secondaryColor: string
  width?: number
  height?: number
}

export default function ComboNetworkGraph({ currentComboId, primaryColor, secondaryColor, width = 600, height = 400 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()
  const [hoveredNode, setHoveredNode] = useState<ComboNetworkNode | null>(null)
  const animRef = useRef<number>(0)

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildComboNetwork(25), [])

  const nodesRef = useRef<ComboNetworkNode[]>([])
  const edgesRef = useRef<ComboNetworkEdge[]>([])

  useEffect(() => {
    nodesRef.current = initialNodes.map(n => ({ ...n }))
    edgesRef.current = [...initialEdges]
  }, [initialNodes, initialEdges])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    let t = 0
    const nodes = nodesRef.current
    const edges = edgesRef.current

    const centerX = width / 2
    const centerY = height / 2

    const nodeMap = new Map(nodes.map(n => [n.id, n]))

    const applyForces = () => {
      const repulsion = 800
      const attraction = 0.008
      const centerPull = 0.003
      const damping = 0.92

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = repulsion / (dist * dist)
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          nodes[i].vx -= fx
          nodes[i].vy -= fy
          nodes[j].vx += fx
          nodes[j].vy += fy
        }
      }

      for (const edge of edges) {
        const source = nodeMap.get(edge.source)
        const target = nodeMap.get(edge.target)
        if (!source || !target) continue
        const dx = target.x - source.x
        const dy = target.y - source.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const targetDist = 100 + (3 - edge.strength / 50) * 50
        const force = (dist - targetDist) * attraction
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        source.vx += fx
        source.vy += fy
        target.vx -= fx
        target.vy -= fy
      }

      for (const node of nodes) {
        const dx = centerX - node.x
        const dy = centerY - node.y
        node.vx += dx * centerPull
        node.vy += dy * centerPull
      }

      for (const node of nodes) {
        node.vx *= damping
        node.vy *= damping
        node.x += node.vx
        node.y += node.vy
        node.x = Math.max(30, Math.min(width - 30, node.x))
        node.y = Math.max(30, Math.min(height - 30, node.y))
      }
    }

    const draw = () => {
      t += 0.016
      applyForces()

      ctx.clearRect(0, 0, width, height)

      const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2)
      bgGrad.addColorStop(0, 'rgba(20, 15, 30, 0.3)')
      bgGrad.addColorStop(1, 'rgba(5, 3, 15, 0.1)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      for (const edge of edges) {
        const source = nodeMap.get(edge.source)
        const target = nodeMap.get(edge.target)
        if (!source || !target) continue

        const alpha = (edge.strength / 100) * 0.4
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.strokeStyle = `rgba(180, 160, 220, ${alpha})`
        ctx.lineWidth = edge.strength / 50
        ctx.stroke()
      }

      for (const node of nodes) {
        const isCurrent = node.id === currentComboId
        const isHovered = hoveredNode?.id === node.id
        const pulse = isCurrent ? 1 + Math.sin(t * 3) * 0.15 : 1
        const size = node.size * pulse * (isHovered ? 1.3 : 1)

        if (isCurrent) {
          const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3)
          glowGrad.addColorStop(0, `${primaryColor}40`)
          glowGrad.addColorStop(0.5, `${primaryColor}15`)
          glowGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        const nodeGrad = ctx.createRadialGradient(
          node.x - size * 0.3,
          node.y - size * 0.3,
          0,
          node.x,
          node.y,
          size
        )
        nodeGrad.addColorStop(0, isCurrent ? primaryColor : node.color + 'cc')
        nodeGrad.addColorStop(0.7, isCurrent ? secondaryColor : node.color + '88')
        nodeGrad.addColorStop(1, isCurrent ? primaryColor + '44' : node.color + '33')

        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fillStyle = nodeGrad
        ctx.fill()

        if (isCurrent || isHovered) {
          ctx.strokeStyle = primaryColor
          ctx.lineWidth = 2
          ctx.stroke()
        }

        if (isHovered || isCurrent) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          ctx.font = '10px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(node.name, node.x, node.y + size + 14)
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [width, height, currentComboId, primaryColor, hoveredNode])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let found: ComboNetworkNode | null = null
    for (const node of nodesRef.current) {
      const dx = node.x - x
      const dy = node.y - y
      if (dx * dx + dy * dy < (node.size + 5) * (node.size + 5)) {
        found = node
        break
      }
    }
    setHoveredNode(found)
    canvas.style.cursor = found ? 'pointer' : 'default'
  }

  const handleClick = () => {
    if (hoveredNode) {
      const config = comboConfigs[hoveredNode.id]
      if (config) {
        navigate(config.route)
      }
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          borderRadius: 16,
          display: 'block',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          fontSize: 10,
          opacity: 0.5,
          letterSpacing: 1,
        }}
      >
        🌐 星图网络
      </div>
    </div>
  )
}
