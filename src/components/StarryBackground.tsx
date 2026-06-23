import { useEffect, useRef } from 'react'

interface StarryBackgroundProps {
  children?: React.ReactNode
}

export default function StarryBackground({ children }: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 设置Canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // 星星数据
    const stars: Array<{
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number
      twinkleOffset: number
    }> = []
    
    // 初始化星星
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2
      })
    }
    
    // 流星数据
    const meteors: Array<{
      x: number
      y: number
      length: number
      speed: number
      opacity: number
    }> = []
    
    // 动画变量
    let animationId: number
    let time = 0
    
    // 动画循环
    const animate = () => {
      time += 0.016 // 约60fps
      
      // 清除画布
      ctx.fillStyle = 'rgba(13, 17, 38, 0.2)' // 半透明覆盖，产生拖尾效果
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // 绘制星星
      stars.forEach(star => {
        // 闪烁效果
        const twinkle = Math.sin(time * star.twinkleSpeed * 100 + star.twinkleOffset)
        const currentOpacity = star.opacity + twinkle * 0.2
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentOpacity)})`
        ctx.fill()
        
        // 添加光晕
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })
      
      // 随机生成流星
      if (Math.random() < 0.01) {
        meteors.push({
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.random() * 100 + 50,
          speed: Math.random() * 15 + 10,
          opacity: 1
        })
      }
      
      // 更新和绘制流星
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i]
        
        // 绘制流星
        const gradient = ctx.createLinearGradient(
          meteor.x, meteor.y,
          meteor.x - meteor.length, meteor.y + meteor.length
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(meteor.x - meteor.length, meteor.y + meteor.length)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()
        
        // 更新位置
        meteor.x += meteor.speed * 0.5
        meteor.y += meteor.speed
        meteor.opacity -= 0.02
        
        // 移除离开屏幕的流星
        if (meteor.y > canvas.height || meteor.opacity <= 0) {
          meteors.splice(i, 1)
        }
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* 星空Canvas背景 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ zIndex: 0 }}
      />
      
      {/* 内容层 */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
