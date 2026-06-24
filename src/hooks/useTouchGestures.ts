import { useRef, useCallback, useState, useEffect } from 'react'

interface TouchGestureConfig {
  onTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  longPressDelay?: number
  doubleTapDelay?: number
}

export function useTouchGestures(config: TouchGestureConfig) {
  const {
    onTap,
    onDoubleTap,
    onLongPress,
    longPressDelay = 500,
    doubleTapDelay = 300,
  } = config

  const touchStartTimeRef = useRef<number>(0)
  const lastTapTimeRef = useRef<number>(0)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const touchMovedRef = useRef<boolean>(false)
  const [isLongPressing, setIsLongPressing] = useState(false)

  // 清除长按计时器
  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    setIsLongPressing(false)
  }, [])

  // 触摸开始
  const handleTouchStart = useCallback(() => {
    touchStartTimeRef.current = Date.now()
    touchMovedRef.current = false

    // 开始长按计时
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        setIsLongPressing(true)
        onLongPress()
      }, longPressDelay)
    }
  }, [onLongPress, longPressDelay])

  // 触摸移动（取消长按）
  const handleTouchMove = useCallback(() => {
    touchMovedRef.current = true
    clearLongPressTimer()
  }, [clearLongPressTimer])

  // 触摸结束
  const handleTouchEnd = useCallback(() => {
    const touchEndTime = Date.now()
    const touchDuration = touchEndTime - touchStartTimeRef.current

    // 清除长按计时器
    clearLongPressTimer()

    // 如果移动了，不触发任何手势
    if (touchMovedRef.current) return

    // 如果正在长按，不触发点击
    if (isLongPressing) {
      setIsLongPressing(false)
      return
    }

    // 检查是否是双击
    const timeSinceLastTap = touchEndTime - lastTapTimeRef.current
    if (timeSinceLastTap < doubleTapDelay && onDoubleTap) {
      lastTapTimeRef.current = 0 // 重置以防止三击触发双击
      onDoubleTap()
      return
    }

    // 单击
    if (touchDuration < longPressDelay && onTap) {
      lastTapTimeRef.current = touchEndTime
      onTap()
    }
  }, [clearLongPressTimer, touchMovedRef, isLongPressing, doubleTapDelay, longPressDelay, onTap, onDoubleTap])

  // 清理
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isLongPressing,
  }
}

// 检测是否是移动设备
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // 检测触摸支持
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      // 检测屏幕尺寸
      const isSmallScreen = window.innerWidth < 768
      // 检测用户代理
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      setIsMobile(hasTouchSupport && (isSmallScreen || isMobileUA))
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// 获取触摸反馈样式
export function getTouchFeedbackStyle(isPressed: boolean, baseStyle: React.CSSProperties = {}): React.CSSProperties {
  return {
    ...baseStyle,
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    opacity: isPressed ? 0.8 : 1,
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
  }
}