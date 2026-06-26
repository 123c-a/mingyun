import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  startWander,
  wanderStep,
  loadWanderState,
  resetWander,
  type WanderState,
  type WanderStep,
} from '../lib/comboRelations'
import { comboConfigs } from '../data/comboConfigs'
import { RELATION_TYPES } from '../lib/comboRelations'

interface Props {
  currentComboId: string
  primaryColor: string
  secondaryColor: string
  accentText: string
  glowColor: string
}

export default function StarWanderWidget({ currentComboId, primaryColor, secondaryColor, accentText, glowColor }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const [wanderState, setWanderState] = useState<WanderState | null>(null)
  const [showWanderMenu, setShowWanderMenu] = useState(false)
  const [wanderStyle, setWanderStyle] = useState<'random' | 'strongest' | 'weakest' | 'most_relations'>('random')

  useEffect(() => {
    const saved = loadWanderState()
    if (saved) {
      setWanderState(saved)
    }
  }, [])

  const handleStartWander = useCallback(() => {
    const state = startWander(currentComboId)
    setWanderState(state)
    setShowWanderMenu(false)
  }, [currentComboId])

  const handleWanderStep = useCallback(() => {
    if (!wanderState) return
    const result = wanderStep(wanderState, wanderStyle)
    if (result) {
      setWanderState(result.state)
      const targetConfig = comboConfigs[result.step.comboId]
      if (targetConfig) {
        navigate(targetConfig.route)
      }
    }
  }, [wanderState, wanderStyle, navigate])

  const handleResetWander = useCallback(() => {
    resetWander()
    setWanderState(null)
    setShowWanderMenu(false)
  }, [])

  const jumpToStep = useCallback((step: WanderStep) => {
    const targetConfig = comboConfigs[step.comboId]
    if (targetConfig) {
      navigate(targetConfig.route)
    }
  }, [navigate])

  const config = comboConfigs[currentComboId]
  const isCurrentlyWandering = wanderState && wanderState.currentComboId === currentComboId

  const styleOptions = [
    { id: 'random' as const, name: '随机漫步', icon: '🎲', desc: '跟随命运的指引' },
    { id: 'strongest' as const, name: '强关联', icon: '⚡', desc: '沿最强关联前进' },
    { id: 'weakest' as const, name: '弱关联', icon: '🌙', desc: '探索隐秘的连接' },
    { id: 'most_relations' as const, name: '多维度', icon: '🔮', desc: '关联类型最多者' },
  ]

  return (
    <div
      style={{
        position: 'relative',
        marginTop: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 16,
          background: `linear-gradient(135deg, ${primaryColor}12, ${secondaryColor}08)`,
          border: `1px solid ${primaryColor}25`,
          cursor: 'pointer',
        }}
        onClick={() => setShowWanderMenu(!showWanderMenu)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            🌠
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: primaryColor,
                letterSpacing: 1,
              }}
            >
              星图漫步
            </div>
            <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
              {wanderState
                ? `已探索 ${wanderState.discoveredCombos.size} 个组合 · 走了 ${wanderState.totalSteps} 步`
                : '让宇宙带你探索未知的星图'}
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            opacity: 0.5,
            transition: 'transform 0.3s',
            transform: showWanderMenu ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          ▼
        </span>
      </div>

      {showWanderMenu && (
        <div
          style={{
            marginTop: 8,
            padding: 20,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${primaryColor}08, ${secondaryColor}05)`,
            border: `1px solid ${primaryColor}20`,
            backdropFilter: 'blur(10px)',
          }}
        >
          {!wanderState ? (
            <div>
              <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 16, lineHeight: 1.6 }}>
                选择一种漫步方式，让宇宙的随机性带你探索星图中的隐藏关联。
                每一步都会带你到一个新的组合，发现意想不到的连接。
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {styleOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setWanderStyle(opt.id)
                    }}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${wanderStyle === opt.id ? primaryColor + '60' : primaryColor + '20'}`,
                      background: wanderStyle === opt.id ? `${primaryColor}20` : 'transparent',
                      color: accentText,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{opt.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{opt.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartWander()
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: `linear-gradient(135deg, ${primaryColor}cc, ${secondaryColor}cc)`,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  letterSpacing: 2,
                }}
              >
                ✨ 开始漫步
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    漫步路径（{wanderState.path.length} 步）
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResetWander()
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: `1px solid ${primaryColor}30`,
                      background: 'transparent',
                      color: accentText,
                      fontSize: 10,
                      cursor: 'pointer',
                      opacity: 0.6,
                    }}
                  >
                    重新开始
                  </button>
                </div>
                <div
                  style={{
                    maxHeight: 160,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: 4,
                  }}
                >
                  {wanderState.path.map((step, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        jumpToStep(step)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: step.comboId === currentComboId ? `${primaryColor}15` : 'transparent',
                        border: `1px solid ${step.comboId === currentComboId ? primaryColor + '40' : 'transparent'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 10, opacity: 0.4, width: 20 }}>
                        {i === 0 ? '起' : i}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: accentText }}>
                          {step.comboName}
                        </div>
                        {step.relationTypes.length > 0 && (
                          <div style={{ display: 'flex', gap: 3, marginTop: 2, flexWrap: 'wrap' }}>
                            {step.relationTypes.slice(0, 2).map(t => (
                              <span
                                key={t}
                                style={{
                                  fontSize: 9,
                                  padding: '1px 5px',
                                  borderRadius: 4,
                                  background: `${primaryColor}20`,
                                  opacity: 0.7,
                                }}
                              >
                                {RELATION_TYPES[t]?.icon} {RELATION_TYPES[t]?.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {step.strength < 100 && (
                        <span style={{ fontSize: 10, opacity: 0.5 }}>{step.strength}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleWanderStep()
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: `linear-gradient(135deg, ${primaryColor}cc, ${secondaryColor}cc)`,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  letterSpacing: 2,
                }}
              >
                🌠 继续漫步
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
