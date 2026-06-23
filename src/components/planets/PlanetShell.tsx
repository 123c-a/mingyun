import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTheme } from './planetThemes'
import { PlanetCanvas } from './PlanetCanvas'

export function PlanetShell({
  themeId,
  title,
  subtitle,
  description,
  children,
  accent,
}: {
  themeId: string
  title: string
  subtitle: string
  description: string
  children: ReactNode
  accent?: ReactNode
}) {
  const navigate = useNavigate()
  const theme = getTheme(themeId)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'auto',
      background: theme.bgGradient,
      color: theme.accentText,
      fontFamily: 'ui-serif, Georgia, "Songti SC", "Noto Serif CJK SC", serif',
    }}>
      <PlanetCanvas themeId={themeId} />

      {/* 顶栏 */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        padding: '24px 40px',
        backdropFilter: 'blur(10px)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: `1px solid ${theme.primaryColor}44`,
            color: theme.accentText,
            padding: '10px 18px',
            borderRadius: 999,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.25s',
            opacity: 0.75,
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '0.75')}
        >
          ← 星图
        </button>

        <div style={{ marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 14, opacity: 0.75, letterSpacing: 4 }}>{theme.name}</span>
          <span style={{ fontSize: 11, opacity: 0.45, letterSpacing: 2, marginTop: 2 }}>{subtitle}</span>
        </div>

        {accent && <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.65 }}>{accent}</div>}
      </div>

      {/* 标题区 */}
      <div style={{ padding: '10vh 60px 6vh', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontSize: 72,
          fontWeight: 300,
          letterSpacing: 8,
          color: theme.primaryColor,
          textShadow: `0 0 40px ${theme.glowColor}`,
        }}>
          {title}
        </div>
        <div style={{ fontSize: 16, opacity: 0.55, marginTop: 16, letterSpacing: 3, maxWidth: 560, margin: '16px auto 0' }}>
          {description}
        </div>
      </div>

      {/* 内容 */}
      <div style={{ position: 'relative', zIndex: 2, padding: '20px 60px 80px', maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}
