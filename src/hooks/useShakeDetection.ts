import { useEffect, useRef, useCallback } from 'react'

interface ShakeOptions {
  threshold?: number // 加速度阈值，默认 15
  timeout?: number // 最小触发间隔(ms)，默认 1000
  onShake?: () => void
  enabled?: boolean
}

export function useShakeDetection({
  threshold = 15,
  timeout = 1000,
  onShake,
  enabled = true,
}: ShakeOptions) {
  const lastShakeRef = useRef<number>(0)
  const lastXRef = useRef<number | null>(null)
  const lastYRef = useRef<number | null>(null)
  const lastZRef = useRef<number | null>(null)

  const handleShake = useCallback(() => {
    const now = Date.now()
    if (now - lastShakeRef.current > timeout) {
      lastShakeRef.current = now
      onShake?.()
    }
  }, [timeout, onShake])

  useEffect(() => {
    if (!enabled) return

    // 仅移动设备
    if (!('DeviceMotionEvent' in window)) return

    // iOS 13+ 需要请求权限
    const requestPermission = async () => {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const response = await (DeviceMotionEvent as any).requestPermission()
          if (response !== 'granted') {
            console.warn('DeviceMotion permission denied')
          }
        } catch (e) {
          console.warn('DeviceMotion permission error:', e)
        }
      }
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.accelerationIncludingGravity || {}
      if (x === null || y === null || z === null) return

      if (lastXRef.current !== null) {
        const deltaX = Math.abs(x - lastXRef.current)
        const deltaY = Math.abs(y - lastYRef.current)
        const deltaZ = Math.abs(z - lastZRef.current)

        if (
          (deltaX > threshold && deltaY > threshold) ||
          (deltaX > threshold && deltaZ > threshold) ||
          (deltaY > threshold && deltaZ > threshold)
        ) {
          handleShake()
        }
      }

      lastXRef.current = x
      lastYRef.current = y
      lastZRef.current = z
    }

    // 尝试直接监听（Android/旧版iOS）
    window.addEventListener('devicemotion', handleMotion)

    // 尝试请求权限（新版iOS）
    requestPermission()

    return () => {
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [enabled, threshold, timeout, handleShake])

  return null
}

// 简单的桌面版：鼠标快速移动检测
export function useMouseShakeDetection({
  threshold = 50,
  onShake,
  enabled = true,
}: Omit<ShakeOptions, 'timeout' | 'threshold'> & { threshold?: number }) {
  const lastMoveRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const velocityRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()

      if (lastMoveRef.current) {
        const dx = e.clientX - lastMoveRef.current.x
        const dy = e.clientY - lastMoveRef.current.y
        const dt = now - lastMoveRef.current.time

        if (dt < 50) { // 50ms内
          const speed = Math.sqrt(dx * dx + dy * dy) / dt * 10
          velocityRef.current = speed

          if (speed > threshold) {
            onShake?.()
          }
        }
      }

      lastMoveRef.current = { x: e.clientX, y: e.clientY, time: now }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enabled, threshold, onShake])

  return null
}
