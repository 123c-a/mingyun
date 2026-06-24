import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface CreativeIdea {
  id: string
  idea: string
  insight: string
  action: string
  stage: 'subconscious' | 'eureka' | 'materialize'
  createdAt: string
}

const stageLabels = {
  subconscious: '🌊 潜意识中漂浮',
  eureka: '💡 顿悟时刻',
  materialize: '🎯 落地行动',
}

export default function MercuryUranusNeptunePage() {
  const config = comboConfigs['mercury-uranus-neptune']
  const [ideas, setIdeas] = useLocalStorage<CreativeIdea[]>('combo-mercury-uranus-neptune', [])
  const [showForm, setShowForm] = useState(false)
  const [idea, setIdea] = useState('')
  const [insight, setInsight] = useState('')
  const [action, setAction] = useState('')
  const [stage, setStage] = useState<'subconscious' | 'eureka' | 'materialize'>('subconscious')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addIdea = () => {
    if (!idea.trim()) return
    const newIdea: CreativeIdea = {
      id: `${Date.now()}`,
      idea: idea.trim(),
      insight: insight.trim(),
      action: action.trim(),
      stage,
      createdAt: new Date().toISOString(),
    }
    setIdeas([newIdea, ...ideas])
    setShowForm(false)
    setIdea('')
    setInsight('')
    setAction('')
    setStage('subconscious')
    setSelectedId(newIdea.id)
  }

  const handleExport = () => {
    const items = (ideas || []).slice(0, 7).map((i) => ({
      text: i.idea.slice(0, 40) + (i.idea.length > 40 ? '…' : ''),
      meta: stageLabels[i.stage],
    }))
    if (items.length === 0) items.push({ text: '还没有创意记录', meta: '—' })
    exportAsImage(
      '创意炼金炉 · 创意的诞生与落地',
      '潜意识里有无限宝藏，让创意从深海升起，化为现实',
      items,
      '#0f1825',
      '#d0f0f8',
      '#a0d8f0',
      `chuangyilianjin-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(160, 216, 240, 0.15)',
          border: '1px solid rgba(160, 216, 240, 0.4)',
          color: '#d0f0f8',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(160, 216, 240, 0.25), rgba(128, 200, 232, 0.15))',
              border: '1px solid rgba(160, 216, 240, 0.5)',
              color: '#d0f0f8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🏺 投入一颗创意
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(160, 216, 240, 0.06)',
            border: '1px solid rgba(160, 216, 240, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#a0d8f0' }}>
              🏺 创意炼金炉
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                它现在在哪个阶段？
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['subconscious', 'eureka', 'materialize'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      background: stage === s ? 'rgba(160, 216, 240, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${stage === s ? 'rgba(160, 216, 240, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: stage === s ? '#a0d8f0' : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {stageLabels[s]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                💭 这个创意是什么？
              </div>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="描述你的创意……"
                style={{
                  width: '100%',
                  minHeight: 80,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(160, 216, 240, 0.25)',
                  color: '#d0f0f8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.7,
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                💡 顿悟时刻（如果有的话）
              </div>
              <textarea
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                placeholder="突然想通了什么？"
                style={{
                  width: '100%',
                  minHeight: 60,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(160, 216, 240, 0.25)',
                  color: '#d0f0f8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                🎯 下一步行动
              </div>
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="让它落地的下一步是什么？"
                style={{
                  width: '100%',
                  minHeight: 60,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(160, 216, 240, 0.25)',
                  color: '#d0f0f8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  letterSpacing: 2,
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={addIdea}
                disabled={!idea.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(160, 216, 240, 0.25), rgba(128, 200, 232, 0.15))',
                  border: '1px solid rgba(160, 216, 240, 0.5)',
                  color: '#d0f0f8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: idea.trim() ? 'pointer' : 'not-allowed',
                  opacity: idea.trim() ? 1 : 0.5,
                }}
              >
                🏺 投入炉中
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(ideas || []).length === 0 && !showForm && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              🏺 还没有创意记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                潜意识里有无限宝藏<br />
                让创意从深海升起<br />
                化为现实
              </div>
            </div>
          )}

          {(ideas || []).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === item.id
                  ? 'linear-gradient(135deg, rgba(160, 216, 240, 0.1), rgba(128, 200, 232, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === item.id ? 'rgba(160, 216, 240, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(160, 216, 240, 0.15)',
                  color: '#a0d8f0',
                }}>
                  {stageLabels[item.stage]}
                </div>
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>
                💭 {item.idea.length > 60 ? item.idea.slice(0, 60) + '…' : item.idea}
              </div>

              {selectedId === item.id && (
                <>
                  {item.insight && (
                    <div style={{
                      padding: 10,
                      borderRadius: 8,
                      background: 'rgba(128, 200, 232, 0.1)',
                      marginBottom: 10,
                    }}>
                      <div style={{ fontSize: 11, color: '#80c8e8', marginBottom: 4 }}>💡 顿悟</div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>
                        {item.insight}
                      </div>
                    </div>
                  )}
                  {item.action && (
                    <div style={{
                      padding: 10,
                      borderRadius: 8,
                      background: 'rgba(160, 216, 240, 0.1)',
                    }}>
                      <div style={{ fontSize: 11, color: '#a0d8f0', marginBottom: 4 }}>🎯 行动</div>
                      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                        {item.action}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 10 }}>
                {new Date(item.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
