import { useState, useEffect, useRef } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface StarMessage {
  id: string
  text: string
  emotion: 'warm' | 'miss' | 'regret' | 'bless'
  isPublic: boolean
  x: number
  y: number
  vx: number
  vy: number
  time: string
  fading?: boolean
}

const emotionConfig = {
  warm: { label: '温暖', color: '#ffd6a0', emoji: '🌅' },
  miss: { label: '思念', color: '#ffb8d8', emoji: '💭' },
  regret: { label: '遗憾', color: '#b8c8e8', emoji: '💔' },
  bless: { label: '祝福', color: '#c8f0d8', emoji: '🌟' },
}

export default function MercuryVenusPage() {
  const config = comboConfigs['mercury-venus']
  const [input, setInput] = useState('')
  const [emotion, setEmotion] = useState<'warm' | 'miss' | 'regret' | 'bless'>('warm')
  const [isPublic, setIsPublic] = useState(false)
  const [messages, setMessages] = useLocalStorage<StarMessage[]>('combo-mercury-venus', [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const rafRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tick = () => {
      setMessages((prev) =>
        (prev || [])
          .map((m) => ({
            ...m,
            x: m.x + m.vx,
            y: m.y + m.vy,
            vx: m.vx * 0.997,
            vy: m.vy * 0.997 + (Math.random() - 0.5) * 0.02,
          }))
          .filter((m) => !m.fading || Math.random() > 0.01)
      )
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const addMessage = () => {
    const text = input.trim()
    if (!text) return

    const newMsg: StarMessage = {
      id: `${Date.now()}`,
      text,
      emotion,
      isPublic,
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      time: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newMsg])
    setInput('')
  }

  const releaseMessage = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, fading: true } : m)))
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id))
    }, 1500)
  }

  const handleExport = () => {
    const items = (messages || []).slice(0, 7).map((m) => ({
      text: m.text,
      meta: `${emotionConfig[m.emotion].emoji} ${emotionConfig[m.emotion].label}`,
    }))
    if (items.length === 0) items.push({ text: '星语瓶还空着', meta: '—' })
    exportAsImage(
      '心语桥 · 跨行星情感星语',
      '有些话，说不出口，就交给星星吧',
      items,
      '#1a1520',
      '#ffd6ea',
      '#ff9fb8',
      `xinyuqiao-${Date.now()}.png`
    )
  }

  const selectedMsg = messages?.find((m) => m.id === selectedId)

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 180, 220, 0.15)',
          border: '1px solid rgba(255, 180, 220, 0.4)',
          color: '#ffe8f0',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div ref={containerRef} style={{ position: 'relative', minHeight: '60vh' }}>
        <div style={{
          maxWidth: 500,
          margin: '0 auto 40px',
          padding: 24,
          borderRadius: 20,
          background: 'rgba(255, 200, 230, 0.06)',
          border: '1px solid rgba(255, 180, 220, 0.2)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ marginBottom: 16, textAlign: 'center', fontSize: 13, opacity: 0.7, letterSpacing: 3 }}>
            ✨ 写下想对TA说的话
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="有些话，说不出口……"
            style={{
              width: '100%',
              minHeight: 100,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255, 180, 220, 0.25)',
              color: '#ffe8f0',
              fontSize: 14,
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none',
              lineHeight: 1.6,
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(255, 180, 220, 0.6)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 180, 220, 0.25)')}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {(Object.keys(emotionConfig) as Array<keyof typeof emotionConfig>).map((key) => (
              <button
                key={key}
                onClick={() => setEmotion(key)}
                style={{
                  flex: 1,
                  minWidth: 80,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: emotion === key ? `${emotionConfig[key].color}25` : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${emotion === key ? emotionConfig[key].color + '80' : 'rgba(255,255,255,0.1)'}`,
                  color: emotion === key ? emotionConfig[key].color : 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {emotionConfig[key].emoji} {emotionConfig[key].label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 14, gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.7, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              公开漂流（其他人可能看到）
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button
              onClick={addMessage}
              disabled={!input.trim()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(255, 159, 184, 0.3), rgba(255, 180, 220, 0.2))',
                border: '1px solid rgba(255, 180, 220, 0.5)',
                color: '#ffe8f0',
                fontSize: 12,
                letterSpacing: 3,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                opacity: input.trim() ? 1 : 0.5,
              }}
            >
              💫 放入星语瓶
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', height: 400, margin: '40px 0' }}>
          {(messages || []).map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedId(msg.id === selectedId ? null : msg.id)}
              style={{
                position: 'absolute',
                left: `${(msg.x / window.innerWidth) * 100}%`,
                top: `${(msg.y / window.innerHeight) * 30 + 35}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                opacity: msg.fading ? 0 : 1,
                transition: 'opacity 1.5s ease-out',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 65,
                  borderRadius: '50% 50% 45% 45%',
                  background: `radial-gradient(ellipse at 30% 30%, ${emotionConfig[msg.emotion].color}40, ${emotionConfig[msg.emotion].color}10)`,
                  border: `1px solid ${emotionConfig[msg.emotion].color}50`,
                  boxShadow: `0 0 20px ${emotionConfig[msg.emotion].color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  position: 'relative',
                }}
              >
                {emotionConfig[msg.emotion].emoji}
                {msg.isPublic && (
                  <span style={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    fontSize: 10,
                  }}>
                    🌍
                  </span>
                )}
              </div>
            </div>
          ))}

          {(messages || []).length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              ✨ 星语瓶还空着 ✨
            </div>
          )}
        </div>

        {selectedMsg && (
          <div style={{
            maxWidth: 450,
            margin: '0 auto',
            padding: 24,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${emotionConfig[selectedMsg.emotion].color}10, rgba(0,0,0,0.3))`,
            border: `1px solid ${emotionConfig[selectedMsg.emotion].color}30`,
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <span style={{
                fontSize: 12,
                color: emotionConfig[selectedMsg.emotion].color,
                letterSpacing: 2,
              }}>
                {emotionConfig[selectedMsg.emotion].emoji} {emotionConfig[selectedMsg.emotion].label}
                {selectedMsg.isPublic && ' · 公开漂流'}
              </span>
              <span style={{ fontSize: 11, opacity: 0.4 }}>{selectedMsg.time}</span>
            </div>
            <div style={{
              fontSize: 15,
              lineHeight: 1.8,
              marginBottom: 16,
            }}>
              {selectedMsg.text}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => releaseMessage(selectedMsg.id)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 999,
                  background: 'rgba(255, 200, 230, 0.1)',
                  border: '1px solid rgba(255, 180, 220, 0.3)',
                  color: '#ffd6ea',
                  fontSize: 12,
                  letterSpacing: 2,
                  cursor: 'pointer',
                }}
              >
                🌊 让它漂走
              </button>
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </ComboShell>
  )
}
