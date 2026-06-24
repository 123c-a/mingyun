import { useState, useRef, useEffect } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface Inspiration {
  id: string
  content: string
  category: string
  mood: string
  source: string
  tags: string[]
  createdAt: string
  incubated: boolean
  incubationDays: number
}

const categoryOptions = ['创意想法', '梦境碎片', '顿悟瞬间', '艺术灵感', '问题解法', '其他']
const moodOptions = ['兴奋', '平静', '疑惑', '感动', '好奇', '震撼']
const sourceOptions = ['梦境', '冥想', '散步', '洗澡', '阅读', '对话', '其他']

const promptQuestions = [
  '如果这个想法是一个颜色，它是什么颜色？',
  '它想让你做什么？',
  '三年后回头看，这个想法会变成什么？',
  '如果它有声音，会说什么？',
  '它最害怕什么？最渴望什么？',
  '把它送给十年前的自己，会怎样？',
  '如果这个想法是一颗种子，它需要什么土壤？',
]

export default function UranusNeptunePage() {
  const config = comboConfigs['uranus-neptune']
  const [inspirations, setInspirations] = useLocalStorage<Inspiration[]>('combo-uranus-neptune', [])
  const [showCapture, setShowCapture] = useState(false)
  const [showDeepDive, setShowDeepDive] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('创意想法')
  const [newMood, setNewMood] = useState('好奇')
  const [newSource, setNewSource] = useState('冥想')
  const [newTags, setNewTags] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [deepDiveAnswer, setDeepDiveAnswer] = useState('')
  const [deepDiveHistory, setDeepDiveHistory] = useState<{ question: string; answer: string }[]>([])
  const [showRandom, setShowRandom] = useState(false)
  const [randomInspiration, setRandomInspiration] = useState<Inspiration | null>(null)
  const [drawingMode, setDrawingMode] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)

  const addInspiration = () => {
    if (!newContent.trim()) return
    const newItem: Inspiration = {
      id: `${Date.now()}`,
      content: newContent.trim(),
      category: newCategory,
      mood: newMood,
      source: newSource,
      tags: newTags.split(/[,，\s]+/).filter(Boolean),
      createdAt: new Date().toISOString(),
      incubated: false,
      incubationDays: 0,
    }
    setInspirations([newItem, ...inspirations])
    setShowCapture(false)
    setNewContent('')
    setNewTags('')
    setSelectedId(newItem.id)
  }

  const getRandomPrompt = () => {
    const idx = Math.floor(Math.random() * promptQuestions.length)
    setCurrentPrompt(promptQuestions[idx])
  }

  const submitDeepDive = () => {
    if (!deepDiveAnswer.trim() || !currentPrompt) return
    setDeepDiveHistory([...deepDiveHistory, { question: currentPrompt, answer: deepDiveAnswer.trim() }])
    setDeepDiveAnswer('')
    setTimeout(() => getRandomPrompt(), 300)
  }

  const startDeepDive = () => {
    setShowDeepDive(true)
    setDeepDiveHistory([])
    setDeepDiveAnswer('')
    getRandomPrompt()
  }

  const endDeepDive = () => {
    if (deepDiveHistory.length > 0) {
      const summary = deepDiveHistory.map((h) => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n')
      const newItem: Inspiration = {
        id: `${Date.now()}`,
        content: `【深度探索】\n\n${summary}`,
        category: '创意想法',
        mood: '好奇',
        source: '冥想',
        tags: ['深度探索', '潜意识'],
        createdAt: new Date().toISOString(),
        incubated: false,
        incubationDays: 0,
      }
      setInspirations([newItem, ...inspirations])
      setSelectedId(newItem.id)
    }
    setShowDeepDive(false)
  }

  const pickRandom = () => {
    if ((inspirations || []).length === 0) return
    const idx = Math.floor(Math.random() * inspirations.length)
    setRandomInspiration(inspirations[idx])
    setShowRandom(true)
  }

  const startDrawing = () => {
    setDrawingMode(true)
    setShowCapture(false)
    setTimeout(() => initCanvas(), 50)
  }

  const initCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'rgba(10, 20, 40, 0.9)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#70d8e8'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handleCanvasDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    isDrawingRef.current = true
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const pos = getCanvasPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const handleCanvasMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawingRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const pos = getCanvasPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const handleCanvasUp = () => {
    isDrawingRef.current = false
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const newItem: Inspiration = {
      id: `${Date.now()}`,
      content: `【灵感涂鸦】\n（已保存为图像记忆）`,
      category: '艺术灵感',
      mood: '兴奋',
      source: '冥想',
      tags: ['涂鸦', '视觉灵感'],
      createdAt: new Date().toISOString(),
      incubated: false,
      incubationDays: 0,
    }
    setInspirations([newItem, ...inspirations])
    setDrawingMode(false)
    setSelectedId(newItem.id)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.fillStyle = 'rgba(10, 20, 40, 0.9)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleExport = () => {
    const items = (inspirations || []).slice(0, 7).map((i) => ({
      text: i.content.slice(0, 40) + (i.content.length > 40 ? '…' : ''),
      meta: `${i.category} · ${i.mood}`,
    }))
    if (items.length === 0) items.push({ text: '还没有灵感记录', meta: '—' })
    exportAsImage(
      '灵感涌现 · 从潜意识下载创意',
      '在意识的深海里，有无数灵感在漂浮',
      items,
      '#0a1525',
      '#c0f0f8',
      '#70d8e8',
      `lingganyongxian-${Date.now()}.png`
    )
  }

  const selectedInspiration = inspirations?.find((i) => i.id === selectedId)

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(112, 216, 232, 0.15)',
          border: '1px solid rgba(112, 216, 232, 0.4)',
          color: '#c0f0f8',
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
        <div style={{ display: 'flex', gap: 12, marginBottom: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setShowCapture(true)}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(112, 216, 232, 0.25), rgba(96, 144, 200, 0.15))',
              border: '1px solid rgba(112, 216, 232, 0.5)',
              color: '#c0f0f8',
              fontSize: 12,
              letterSpacing: 3,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ✨ 捕捉灵感
          </button>
          <button
            onClick={startDeepDive}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(96, 144, 200, 0.25), rgba(112, 216, 232, 0.15))',
              border: '1px solid rgba(96, 144, 200, 0.5)',
              color: '#c0f0f8',
              fontSize: 12,
              letterSpacing: 3,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🌊 深度潜入
          </button>
          <button
            onClick={startDrawing}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(180, 120, 220, 0.2), rgba(112, 216, 232, 0.15))',
              border: '1px solid rgba(180, 120, 220, 0.4)',
              color: '#c0f0f8',
              fontSize: 12,
              letterSpacing: 3,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🎨 灵感涂鸦
          </button>
          <button
            onClick={pickRandom}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#c0f0f8',
              fontSize: 12,
              letterSpacing: 3,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            🎲 随机抽取
          </button>
        </div>

        {showCapture && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(112, 216, 232, 0.06)',
            border: '1px solid rgba(112, 216, 232, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#70d8e8' }}>
              ✨ 抓住这一刻的灵感
            </div>

            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="此刻脑中浮现的是什么……"
              style={{
                width: '100%',
                minHeight: 100,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(112, 216, 232, 0.25)',
                color: '#c0f0f8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            />

            <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 1 }}>类型</div>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(112, 216, 232, 0.25)',
                    color: '#c0f0f8',
                    fontSize: 12,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 1 }}>心情</div>
                <select
                  value={newMood}
                  onChange={(e) => setNewMood(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(112, 216, 232, 0.25)',
                    color: '#c0f0f8',
                    fontSize: 12,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {moodOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, letterSpacing: 1 }}>来源</div>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(112, 216, 232, 0.25)',
                    color: '#c0f0f8',
                    fontSize: 12,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="标签（用逗号或空格分隔）"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(112, 216, 232, 0.25)',
                color: '#c0f0f8',
                fontSize: 12,
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowCapture(false)}
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
                onClick={addInspiration}
                disabled={!newContent.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(112, 216, 232, 0.25), rgba(96, 144, 200, 0.15))',
                  border: '1px solid rgba(112, 216, 232, 0.5)',
                  color: '#c0f0f8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: newContent.trim() ? 'pointer' : 'not-allowed',
                  opacity: newContent.trim() ? 1 : 0.5,
                }}
              >
                ✨ 保存
              </button>
            </div>
          </div>
        )}

        {drawingMode && (
          <div style={{
            padding: 20,
            borderRadius: 20,
            background: 'rgba(112, 216, 232, 0.06)',
            border: '1px solid rgba(112, 216, 232, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 14, letterSpacing: 2, color: '#70d8e8' }}>
              🎨 用画笔画出灵感
            </div>
            <canvas
              ref={canvasRef}
              width={560}
              height={300}
              onMouseDown={handleCanvasDown}
              onMouseMove={handleCanvasMove}
              onMouseUp={handleCanvasUp}
              onMouseLeave={handleCanvasUp}
              onTouchStart={handleCanvasDown}
              onTouchMove={handleCanvasMove}
              onTouchEnd={handleCanvasUp}
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid rgba(112, 216, 232, 0.3)',
                cursor: 'crosshair',
                touchAction: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={clearCanvas}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                清空
              </button>
              <button
                onClick={() => setDrawingMode(false)}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={saveDrawing}
                style={{
                  flex: 1.5,
                  padding: '10px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(112, 216, 232, 0.25), rgba(96, 144, 200, 0.15))',
                  border: '1px solid rgba(112, 216, 232, 0.5)',
                  color: '#c0f0f8',
                  fontSize: 12,
                  letterSpacing: 2,
                  cursor: 'pointer',
                }}
              >
                ✨ 保存涂鸦
              </button>
            </div>
          </div>
        )}

        {showDeepDive && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(96, 144, 200, 0.08)',
            border: '1px solid rgba(96, 144, 200, 0.25)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 16, letterSpacing: 3, color: '#70d8e8', marginBottom: 6 }}>
                🌊 潜入潜意识深海
              </div>
              <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>
                第 {deepDiveHistory.length + 1} 个问题
              </div>
            </div>

            {currentPrompt && (
              <div style={{
                padding: '20px 24px',
                borderRadius: 14,
                background: 'rgba(112, 216, 232, 0.08)',
                border: '1px solid rgba(112, 216, 232, 0.2)',
                textAlign: 'center',
                marginBottom: 16,
                fontSize: 15,
                lineHeight: 1.8,
                fontStyle: 'italic',
                color: '#c0f0f8',
              }}>
                "{currentPrompt}"
              </div>
            )}

            <textarea
              value={deepDiveAnswer}
              onChange={(e) => setDeepDiveAnswer(e.target.value)}
              placeholder="让答案从深处浮现……"
              style={{
                width: '100%',
                minHeight: 100,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(96, 144, 200, 0.25)',
                color: '#c0f0f8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.7,
                marginBottom: 14,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={endDeepDive}
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
                结束并保存
              </button>
              <button
                onClick={submitDeepDive}
                disabled={!deepDiveAnswer.trim()}
                style={{
                  flex: 1.5,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(112, 216, 232, 0.25), rgba(96, 144, 200, 0.15))',
                  border: '1px solid rgba(112, 216, 232, 0.5)',
                  color: '#c0f0f8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: deepDiveAnswer.trim() ? 'pointer' : 'not-allowed',
                  opacity: deepDiveAnswer.trim() ? 1 : 0.5,
                }}
              >
                下一个问题 →
              </button>
            </div>

            {deepDiveHistory.length > 0 && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, opacity: 0.4, letterSpacing: 2, marginBottom: 10 }}>探索记录</div>
                {deepDiveHistory.map((h, i) => (
                  <div key={i} style={{ marginBottom: 10, padding: 10, borderRadius: 8, background: 'rgba(0,0,0,0.15)' }}>
                    <div style={{ fontSize: 11, color: '#70d8e8', marginBottom: 4 }}>Q: {h.question}</div>
                    <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6 }}>A: {h.answer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showRandom && randomInspiration && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 10, 20, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }} onClick={() => setShowRandom(false)}>
            <div
              style={{
                maxWidth: 500,
                width: '100%',
                padding: 40,
                borderRadius: 24,
                background: 'linear-gradient(135deg, rgba(112, 216, 232, 0.12), rgba(96, 144, 200, 0.08))',
                border: '1px solid rgba(112, 216, 232, 0.3)',
                textAlign: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: 40, marginBottom: 20 }}>✨</div>
              <div style={{ fontSize: 12, letterSpacing: 4, color: '#70d8e8', marginBottom: 20 }}>
                命运抽取
              </div>
              <div style={{
                fontSize: 16,
                lineHeight: 2,
                fontStyle: 'italic',
                marginBottom: 24,
                color: '#c0f0f8',
                whiteSpace: 'pre-wrap',
              }}>
                {randomInspiration.content}
              </div>
              <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2, marginBottom: 24 }}>
                {randomInspiration.category} · {randomInspiration.mood} · {new Date(randomInspiration.createdAt).toLocaleDateString('zh-CN')}
              </div>
              <button
                onClick={() => setShowRandom(false)}
                style={{
                  padding: '10px 32px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(112, 216, 232, 0.25), rgba(96, 144, 200, 0.15))',
                  border: '1px solid rgba(112, 216, 232, 0.5)',
                  color: '#c0f0f8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: 'pointer',
                }}
              >
                收下这份灵感
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(inspirations || []).length === 0 && !showCapture && !showDeepDive && !drawingMode && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              🌊 还没有灵感记录
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                灵感像深海里的鱼<br />
                需要的时候，它就会游过来
              </div>
            </div>
          )}

          {(inspirations || []).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === item.id
                  ? 'linear-gradient(135deg, rgba(112, 216, 232, 0.1), rgba(96, 144, 200, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === item.id ? 'rgba(112, 216, 232, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 8,
                gap: 12,
              }}>
                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, flex: 1 }}>
                  {item.content.length > 60 ? item.content.slice(0, 60) + '…' : item.content}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{
                  fontSize: 10,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(112, 216, 232, 0.12)',
                  color: '#70d8e8',
                  letterSpacing: 1,
                }}>
                  {item.category}
                </span>
                <span style={{
                  fontSize: 10,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: 1,
                }}>
                  {item.mood}
                </span>
                <span style={{
                  fontSize: 10,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: 1,
                }}>
                  {item.source}
                </span>
              </div>

              <div style={{ fontSize: 10, opacity: 0.4 }}>
                {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                {item.tags.length > 0 && ` · ${item.tags.join('、')}`}
              </div>

              {selectedId === item.id && (
                <div style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    fontSize: 14,
                    lineHeight: 2,
                    whiteSpace: 'pre-wrap',
                    opacity: 0.9,
                  }}>
                    {item.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
