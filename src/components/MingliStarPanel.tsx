import { useState, useEffect } from 'react'
import { useMingliProfile, elementColors, elementEmojis } from '../lib/mingliCache'
import { generateFullReport, AstrologyReport } from '../lib/astrologyEngine'

function formatReport(report: AstrologyReport): string {
  return `【八字】${report.bazi.year.stem}${report.bazi.year.branch} ${report.bazi.month.stem}${report.bazi.month.branch} ${report.bazi.day.stem}${report.bazi.day.branch} ${report.bazi.hour.stem}${report.bazi.hour.branch}

【五行分析】
日主：${report.bazi.day.stem}${report.bazi.day.branch}
主五行：${report.fiveElement.dominant}
弱五行：${report.fiveElement.weakest}

【性格特质】
${report.personality}

【事业建议】
${report.careerAdvice}

【感情建议】
${report.loveAdvice}

【吉祥提示】
幸运颜色：${report.luckyColor}
幸运数字：${report.luckyNumber}
幸运方向：${report.luckyDirection}`
}

export function MingliStarPanel() {
  const { profile, isLoading, saveProfile, clearProfile } = useMingliProfile()
  const [showInput, setShowInput] = useState(!profile)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear() - 20,
    month: 1,
    day: 1,
    hour: 12
  })
  const [showReport, setShowReport] = useState(false)
  const [starAnimation, setStarAnimation] = useState(false)

  useEffect(() => {
    if (profile) {
      setStarAnimation(true)
      const timer = setTimeout(() => setStarAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [profile])

  const handleSubmit = async () => {
    if (isLoading) return
    await saveProfile(formData.year, formData.month, formData.day, formData.hour)
    setShowInput(false)
  }

  const handleClear = () => {
    clearProfile()
    setShowInput(true)
    setShowReport(false)
  }

  if (!profile && !showInput) {
    return null
  }

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 30,
      textAlign: 'center',
    }}>
      {/* 悬浮的命理星星 */}
      {profile && (
        <div style={{
          marginBottom: 24,
          animation: starAnimation ? 'starAppear 2s ease-out forwards' : 'starFloat 4s ease-in-out infinite',
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: elementColors[profile.destiny.element],
            boxShadow: `0 0 40px ${elementColors[profile.destiny.element]}cc, 0 0 80px ${elementColors[profile.destiny.element]}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto',
            position: 'relative',
          }}>
            {elementEmojis[profile.destiny.element]}
            <div style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: `2px solid ${elementColors[profile.destiny.element]}88`,
              animation: 'starPulse 2s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute',
              inset: -16,
              borderRadius: '50%',
              border: `1px solid ${elementColors[profile.destiny.element]}44`,
              animation: 'starPulse 3s ease-in-out infinite 0.5s',
            }} />
          </div>
          <div style={{
            marginTop: 16,
            fontSize: 14,
            color: '#ffe8a0',
            letterSpacing: 3,
            textShadow: `0 0 20px ${elementColors[profile.destiny.element]}66`,
          }}>
            {profile.destiny.zodiac}生肖 · {profile.destiny.element}行命星
          </div>
        </div>
      )}

      {/* 输入表单或命理信息 */}
      {showInput ? (
        <div style={{
          padding: 32,
          borderRadius: 24,
          background: 'rgba(40, 25, 10, 0.95)',
          border: '1px solid rgba(255, 216, 128, 0.3)',
          maxWidth: 420,
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#ffe8a0',
            textAlign: 'center',
            marginBottom: 24,
            letterSpacing: 4,
          }}>
            🔮 输入生辰
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            marginBottom: 24,
          }}>
            <div>
              <label style={{
                fontSize: 11,
                color: '#a898b8',
                display: 'block',
                marginBottom: 4,
              }}>年</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label style={{
                fontSize: 11,
                color: '#a898b8',
                display: 'block',
                marginBottom: 4,
              }}>月</label>
              <input
                type="number"
                value={formData.month}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  month: Math.min(12, Math.max(1, Number(e.target.value)))
                }))}
                style={{
                  width: '100%',
                  padding: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label style={{
                fontSize: 11,
                color: '#a898b8',
                display: 'block',
                marginBottom: 4,
              }}>日</label>
              <input
                type="number"
                value={formData.day}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  day: Math.min(31, Math.max(1, Number(e.target.value)))
                }))}
                style={{
                  width: '100%',
                  padding: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label style={{
                fontSize: 11,
                color: '#a898b8',
                display: 'block',
                marginBottom: 4,
              }}>时</label>
              <input
                type="number"
                value={formData.hour}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  hour: Math.min(23, Math.max(0, Number(e.target.value)))
                }))}
                style={{
                  width: '100%',
                  padding: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(255, 216, 128, 0.4), rgba(255, 160, 80, 0.2))',
              border: '1px solid rgba(255, 216, 128, 0.5)',
              color: '#ffe8a0',
              fontSize: 14,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              letterSpacing: 3,
              transition: 'all 0.3s',
            }}
          >
            {isLoading ? '测算中…' : '点亮我的命星'}
          </button>
        </div>
      ) : (
        <div style={{
          padding: 24,
          borderRadius: 20,
          background: 'rgba(40, 25, 10, 0.85)',
          border: `1px solid ${elementColors[profile.destiny.element]}66`,
          maxWidth: 360,
          width: '90%',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 16,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: elementColors[profile.destiny.element],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: `0 0 15px ${elementColors[profile.destiny.element]}88`,
            }}>
              {elementEmojis[profile.destiny.element]}
            </div>
            <div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#ffe8a0',
                letterSpacing: 2,
              }}>
                {profile.destiny.zodiac}生肖 · {profile.destiny.element}行
              </div>
              <div style={{
                fontSize: 11,
                opacity: 0.6,
                color: '#ffd880',
              }}>
                {profile.year}年{profile.month}月{profile.day}日{profile.hour}时
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: 10,
          }}>
            <button
              onClick={() => setShowReport(!showReport)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 999,
                background: 'rgba(255, 216, 128, 0.15)',
                border: '1px solid rgba(255, 216, 128, 0.3)',
                color: '#ffd880',
                fontSize: 11,
                cursor: 'pointer',
                letterSpacing: 2,
              }}
            >
              {showReport ? '收起报告' : '查看报告'}
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: 10,
                borderRadius: 999,
                background: 'transparent',
                border: '1px solid rgba(255, 216, 128, 0.3)',
                color: '#ffd880',
                fontSize: 11,
                cursor: 'pointer',
                letterSpacing: 2,
              }}
            >
              重新测算
            </button>
          </div>

          {/* 命理报告 */}
          {showReport && profile && (
            <div style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: 'rgba(255, 216, 128, 0.05)',
              border: '1px solid rgba(255, 216, 128, 0.15)',
              maxHeight: 300,
              overflowY: 'auto',
            }}>
              <div style={{
                fontSize: 12,
                color: '#ffe8a0',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}>
                {formatReport(generateFullReport(profile.year, profile.month, profile.day, profile.hour))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS动画 */}
      <style>{`
        @keyframes starFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes starAppear {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes starPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}