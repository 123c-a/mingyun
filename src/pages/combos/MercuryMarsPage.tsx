import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface AlchemyItem {
  id: string
  originalThought: string
  refinedThought: string
  steps: string[]
  createdAt: string
  level: number
}

const alchemyQuestions = [
  { q: '这个念头为什么重要？', key: 'why' },
  { q: '如果今天就做，第一步是什么？', key: 'first' },
  { q: '最大的困难是什么？', key: 'difficulty' },
  { q: '怎么把困难拆成小块？', key: 'breakdown' },
  { q: '怎么知道它成了？', key: 'success' },
]

export default function MercuryMarsPage() {
  const config = comboConfigs['mercury-mars']
  const [items, setItems] = useLocalStorage<AlchemyItem[]>('combo-mercury-mars', [])
  const [step, setStep] = useState(0)
  const [thought, setThought] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<AlchemyItem | null>(null)

  const startAlchemy = () => {
    if (!thought.trim()) return
    setStep(1)
    setAnswers({})
    setCurrentAnswer('')
  }

  const nextQuestion = () => {
    if (!currentAnswer.trim()) return
    const key = alchemyQuestions[step - 1].key
    const newAnswers = { ...answers, [key]: currentAnswer.trim() }
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (step < alchemyQuestions.length) {
      setStep(step + 1)
    } else {
      finishAlchemy(newAnswers)
    }
  }

  const finishAlchemy = (ans: Record<string, string>) => {
    const steps = [
      ans.first || '迈出第一步',
      ans.breakdown || '拆解困难',
      `衡量标准：${ans.success || '完成目标'}`,
    ].filter(Boolean)

    const newItem: AlchemyItem = {
      id: `${Date.now()}`,
      originalThought: thought.trim(),
      refinedThought: `${thought.trim()} —— ${ans.why || ''}`,
      steps,
      createdAt: new Date().toLocaleDateString('zh-CN'),
      level: 3,
    }

    setResult(newItem)
    setItems([newItem, ...items])
    setShowResult(true)
  }

  const reset = () => {
    setStep(0)
    setThought('')
    setAnswers({})
    setCurrentAnswer('')
    setShowResult(false)
    setResult(null)
  }

  const handleExport = () => {
    const items_list = (items || []).slice(0, 7).map((m) => ({
      text: m.originalThought,
      meta: `${m.steps.length}步炼金方案`,
    }))
    if (items_list.length === 0) items_list.push({ text: '还没有炼金记录', meta: '—' })
    exportAsImage(
      '念头炼金 · 想法锻造炉',
      '水星的灵感，火星的锻造',
      items_list,
      '#1a1020',
      '#f0d0ff',
      '#c080ff',
      `niantoulianjin-${Date.now()}.png`
    )
  }

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(192, 128, 255, 0.15)',
          border: '1px solid rgba(192, 128, 255, 0.4)',
          color: '#f0d0ff',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {step === 0 && !showResult && (
          <div style={{
            padding: 30,
            borderRadius: 20,
            background: 'rgba(192, 128, 255, 0.06)',
            border: '1px solid rgba(192, 128, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚗️</div>
            <div style={{ fontSize: 15, marginBottom: 20, letterSpacing: 2, color: '#c080ff' }}>
              把一个模糊的念头放进炼金炉
            </div>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="此刻你脑子里那个挥之不去的想法是……"
              style={{
                width: '100%',
                minHeight: 100,
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(192, 128, 255, 0.25)',
                color: '#f0d0ff',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            />
            <button
              onClick={startAlchemy}
              disabled={!thought.trim()}
              style={{
                padding: '14px 40px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(192, 128, 255, 0.3), rgba(255, 128, 160, 0.2))',
                border: '1px solid rgba(192, 128, 255, 0.5)',
                color: '#f0d0ff',
                fontSize: 13,
                letterSpacing: 4,
                cursor: thought.trim() ? 'pointer' : 'not-allowed',
                opacity: thought.trim() ? 1 : 0.5,
              }}
            >
              🔥 开始炼金
            </button>
          </div>
        )}

        {step > 0 && !showResult && (
          <div style={{
            padding: 30,
            borderRadius: 20,
            background: 'rgba(192, 128, 255, 0.06)',
            border: '1px solid rgba(192, 128, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: 'center' }}>
              {alchemyQuestions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 4,
                    borderRadius: 2,
                    background: i < step ? '#c080ff' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, textAlign: 'center', letterSpacing: 2 }}>
              火星的第 {step} 道提问
            </div>
            <div style={{ fontSize: 18, marginBottom: 20, textAlign: 'center', lineHeight: 1.6 }}>
              {alchemyQuestions[step - 1].q}
            </div>

            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="你的答案是……"
              style={{
                width: '100%',
                minHeight: 80,
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(192, 128, 255, 0.25)',
                color: '#f0d0ff',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => step === 1 ? reset() : setStep(step - 1)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  letterSpacing: 2,
                  cursor: 'pointer',
                }}
              >
                {step === 1 ? '放弃' : '上一题'}
              </button>
              <button
                onClick={nextQuestion}
                disabled={!currentAnswer.trim()}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(192, 128, 255, 0.3), rgba(255, 128, 160, 0.2))',
                  border: '1px solid rgba(192, 128, 255, 0.5)',
                  color: '#f0d0ff',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: currentAnswer.trim() ? 'pointer' : 'not-allowed',
                  opacity: currentAnswer.trim() ? 1 : 0.5,
                }}
              >
                {step === alchemyQuestions.length ? '✨ 炼成！' : '下一题'}
              </button>
            </div>
          </div>
        )}

        {showResult && result && (
          <div style={{
            padding: 30,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(192, 128, 255, 0.1), rgba(255, 128, 160, 0.08))',
            border: '1px solid rgba(192, 128, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            marginBottom: 30,
          }}>
            <div style={{ textAlign: 'center', fontSize: 32, marginBottom: 12 }}>✨</div>
            <div style={{ textAlign: 'center', fontSize: 14, color: '#c080ff', marginBottom: 20, letterSpacing: 3 }}>
              炼金完成
            </div>

            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, opacity: 0.4, marginBottom: 6, letterSpacing: 2 }}>原始念头</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>{result.originalThought}</div>
            </div>

            <div style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(192, 128, 255, 0.1)',
              border: '1px solid rgba(192, 128, 255, 0.2)',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 2, color: '#c080ff' }}>精炼后</div>
              <div style={{ fontSize: 15, lineHeight: 1.7 }}>{result.refinedThought}</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>行动步骤</div>
              {result.steps.map((s, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '8px 0',
                  fontSize: 13,
                }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'rgba(192, 128, 255, 0.2)',
                    border: '1px solid rgba(192, 128, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    flexShrink: 0,
                    color: '#c080ff',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(192, 128, 255, 0.2), rgba(255, 128, 160, 0.15))',
                border: '1px solid rgba(192, 128, 255, 0.4)',
                color: '#f0d0ff',
                fontSize: 12,
                letterSpacing: 3,
                cursor: 'pointer',
              }}
            >
              ⚗️ 再炼一个
            </button>
          </div>
        )}

        {(items || []).length > 0 && (
          <div style={{ marginTop: 30 }}>
            <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 14, letterSpacing: 2 }}>
              炼金记录（{(items || []).length}）
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(items || []).slice(0, 8).map((item) => (
                <div key={item.id} style={{
                  padding: 14,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 13,
                }}>
                  <div style={{ marginBottom: 6 }}>{item.originalThought}</div>
                  <div style={{ fontSize: 11, opacity: 0.4 }}>
                    {item.createdAt} · {item.steps.length}步方案
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ComboShell>
  )
}
