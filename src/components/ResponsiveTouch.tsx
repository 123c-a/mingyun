import React, { useState, useEffect } from 'react'

interface ResponsiveFeedbackProps {
  children: React.ReactNode
  onTap?: () => void
  onDoubleTap?: () => void
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export function ResponsiveTouchFeedback({
  children,
  onTap,
  onDoubleTap,
  className,
  style,
  disabled = false,
}: ResponsiveFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(hasTouchSupport && (isSmallScreen || isMobileUA))
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 双击检测
  const lastTapRef = React.useRef<number>(0)

  const handleClick = () => {
    if (disabled) return

    const now = Date.now()
    const timeDiff = now - lastTapRef.current

    // 双击检测（300ms内两次点击）
    if (timeDiff < 300 && onDoubleTap) {
      lastTapRef.current = 0
      onDoubleTap()
      return
    }

    lastTapRef.current = now

    // 延迟触发单击，以便检测是否是双击
    setTimeout(() => {
      if (lastTapRef.current === now && onTap) {
        lastTapRef.current = 0
        onTap()
      }
    }, 300)
  }

  // 触摸反馈样式
  const getFeedbackStyle = (): React.CSSProperties => ({
    ...style,
    transform: isPressed ? 'scale(0.97)' : 'scale(1)',
    opacity: isPressed ? 0.85 : 1,
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  })

  return (
    <div
      className={className}
      style={getFeedbackStyle()}
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
    >
      {children}
    </div>
  )
}

// 触摸波纹效果组件
interface RippleEffectProps {
  active: boolean
  x: number
  y: number
}

export function RippleEffect({ active, x, y }: RippleEffectProps) {
  if (!active) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'rgba(255, 220, 180, 0.5)',
        transform: 'translate(-50%, -50%)',
        animation: 'ripple 0.6s ease-out forwards',
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// 按钮触摸反馈组件
interface TouchButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function TouchButton({
  children,
  onClick,
  className,
  style,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: TouchButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(hasTouchSupport)
    }
    checkMobile()
  }, [])

  // 根据 variant 和 size 计算样式
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: variant === 'primary' ? '9999px' : variant === 'secondary' ? '12px' : '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px',
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
    background: variant === 'primary'
      ? 'linear-gradient(135deg, rgba(255, 220, 180, 0.25), rgba(255, 200, 140, 0.15))'
      : variant === 'secondary'
      ? 'rgba(0, 0, 0, 0.2)'
      : 'transparent',
    color: '#fff8e8',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.2s ease-out',
    transform: isPressed && isMobile ? 'scale(0.95)' : 'scale(1)',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  }

  const combinedStyle = { ...baseStyles, ...style }

  return (
    <button
      className={className}
      style={combinedStyle}
      onClick={disabled ? undefined : onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// 移动端适配工具
export function useMobileAdaptation() {
  const [isMobile, setIsMobile] = useState(false)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const checkDevice = () => {
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(hasTouchSupport && (isSmallScreen || isMobileUA))
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return {
    isMobile,
    viewport,
    isPortrait: viewport.height > viewport.width,
    isLandscape: viewport.width > viewport.height,
  }
}