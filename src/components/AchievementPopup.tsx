import { useEffect, useState } from 'react'
import { Achievement } from '../data/achievements'

interface AchievementPopupProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    // 入场动画
    setTimeout(() => setVisible(true), 50)
    // 自动关闭
    setTimeout(() => {
      setAnimating(false)
      setTimeout(onClose, 300)
    }, 3000)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) ${visible ? 'scale(1)' : 'scale(0.8)'}`,
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 25, 20, 0.95), rgba(40, 35, 30, 0.9))',
          border: '2px solid rgba(255, 220, 180, 0.5)',
          borderRadius: 20,
          padding: '30px 40px',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(255, 200, 140, 0.3), inset 0 0 40px rgba(255, 220, 180, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* 光效背景 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(255, 220, 180, 0.2) 0%, transparent 70%)',
            animation: animating ? 'pulse 1s ease-in-out infinite' : 'none',
          }}
        />

        {/* 成就图标 */}
        <div
          style={{
            fontSize: 48,
            marginBottom: 16,
            animation: animating ? 'bounce 0.6s ease-in-out infinite' : 'none',
          }}
        >
          {achievement.icon}
        </div>

        {/* 成就解锁文字 */}
        <div
          style={{
            fontSize: 12,
            letterSpacing: 4,
            color: '#ffd78a',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}
        >
          ✦ 成就解锁 ✦
        </div>

        {/* 成就名称 */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#fff8e8',
            marginBottom: 8,
            letterSpacing: 2,
          }}
        >
          {achievement.name}
        </div>

        {/* 成就描述 */}
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255, 248, 232, 0.7)',
            letterSpacing: 1,
          }}
        >
          {achievement.description}
        </div>
      </div>

      {/* CSS 动画 */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  )
}