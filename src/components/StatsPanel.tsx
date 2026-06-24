import { useState } from 'react'
import { achievements, getAchievementProgress, Achievement } from '../data/achievements'
import { comboConfigs } from '../data/comboConfigs'

interface StatsPanelProps {
  unlockedIds: string[]
  progress: {
    planetsVisited: number
    connectionsMade: number
    combosCreated: number
    entriesRecorded: number
    uniqueCombosUsed: string[]
  }
  onClose: () => void
}

export function StatsPanel({ unlockedIds, progress, onClose }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'combos'>('stats')

  const achievementProgress = getAchievementProgress(unlockedIds)

  // 计算组合使用统计
  const comboStats = progress.uniqueCombosUsed.map(id => {
    const config = comboConfigs[id]
    return {
      id,
      name: config?.name || id,
      level: config?.level || 2,
    }
  }).sort((a, b) => b.level - a.level)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '90%',
          maxWidth: 600,
          maxHeight: '80vh',
          background: 'linear-gradient(135deg, rgba(20, 15, 10, 0.95), rgba(30, 25, 20, 0.9))',
          border: '1px solid rgba(255, 220, 180, 0.3)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(255, 200, 140, 0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 220, 180, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600, color: '#fff8e8', letterSpacing: 2 }}>
            ✦ 星盘数据 ✦
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255, 220, 180, 0.1)',
              border: '1px solid rgba(255, 220, 180, 0.3)',
              color: '#fff8e8',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* 标签页 */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 220, 180, 0.1)',
          }}
        >
          {[
            { key: 'stats', label: '使用统计', icon: '📊' },
            { key: 'achievements', label: '成就进度', icon: '🏆' },
            { key: 'combos', label: '组合记录', icon: '✨' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '10px 16px',
                borderRadius: 999,
                background: activeTab === tab.key ? 'rgba(255, 220, 180, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                border: `1px solid ${activeTab === tab.key ? 'rgba(255, 220, 180, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                color: activeTab === tab.key ? '#fff8e8' : 'rgba(255, 255, 255, 0.5)',
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div
          style={{
            padding: 24,
            maxHeight: 'calc(80vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {activeTab === 'stats' && (
            <div>
              {/* 总览卡片 */}
              <div
                style={{
                  background: 'rgba(255, 220, 180, 0.08)',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 12, color: '#ffd78a', letterSpacing: 2, marginBottom: 12 }}>
                  总览
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    { label: '行星访问', value: progress.planetsVisited, icon: '🪐' },
                    { label: '连线创建', value: progress.connectionsMade, icon: '🔗' },
                    { label: '组合使用', value: progress.combosCreated, icon: '✨' },
                    { label: '内容记录', value: progress.entriesRecorded, icon: '📝' },
                  ].map(stat => (
                    <div
                      key={stat.label}
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 12,
                        padding: 16,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                      <div style={{ fontSize: 28, fontWeight: 600, color: '#fff8e8' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255, 248, 232, 0.5)', marginTop: 4 }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 成就进度条 */}
              <div
                style={{
                  background: 'rgba(255, 220, 180, 0.05)',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#ffd78a' }}>成就进度</span>
                  <span style={{ fontSize: 12, color: '#fff8e8' }}>
                    {achievementProgress.unlocked}/{achievementProgress.total}
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${achievementProgress.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #ffd78a, #fff8e8)',
                      borderRadius: 4,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255, 248, 232, 0.4)', marginTop: 8, textAlign: 'right' }}>
                  {achievementProgress.percentage}% 完成
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {achievements.map(achievement => {
                const isUnlocked = unlockedIds.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: 16,
                      borderRadius: 12,
                      background: isUnlocked ? 'rgba(255, 220, 180, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                      border: `1px solid ${isUnlocked ? 'rgba(255, 220, 180, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                      opacity: isUnlocked ? 1 : 0.5,
                    }}
                  >
                    <div style={{ fontSize: 28, opacity: isUnlocked ? 1 : 0.3 }}>
                      {achievement.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#fff8e8' }}>
                        {achievement.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255, 248, 232, 0.5)', marginTop: 4 }}>
                        {achievement.description}
                      </div>
                    </div>
                    {isUnlocked && (
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: 999,
                          background: 'rgba(255, 220, 180, 0.2)',
                          color: '#ffd78a',
                          fontSize: 11,
                        }}
                      >
                        ✓ 已解锁
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'combos' && (
            <div>
              {comboStats.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 40,
                    color: 'rgba(255, 248, 232, 0.4)',
                    fontSize: 13,
                  }}
                >
                  还没有使用过任何组合功能
                  <div style={{ fontSize: 11, marginTop: 12 }}>
                    连接行星后点击连线中点的圆环即可进入组合页面
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {comboStats.map(combo => (
                    <div
                      key={combo.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 14,
                        borderRadius: 12,
                        background: 'rgba(255, 220, 180, 0.08)',
                        border: '1px solid rgba(255, 220, 180, 0.15)',
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${combo.level === 5 ? '#fff0d8' : combo.level === 4 ? '#ffe8c8' : combo.level === 3 ? '#ffb8d0' : '#ffd6ea'}, rgba(0,0,0,0.3))`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          color: '#1a1510',
                          fontWeight: 600,
                        }}
                      >
                        {combo.level}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: '#fff8e8' }}>{combo.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255, 248, 232, 0.4)', marginTop: 4 }}>
                          {combo.level}星组合
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}