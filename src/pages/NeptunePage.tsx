import { useState, useEffect } from 'react'
import { PlanetShell } from '../components/planets/PlanetShell'
import { useLocalStorage, exportAsImage } from '../utils/planetExport'
import { ai } from '../utils/aiService'
import { playSound, stopSound, currentSound, setVolume } from '../utils/neptuneSounds'

const bgColor = '#061018'
const fgColor = '#a8c8e8'
const accentColor = '#6090c8'

interface Dream {
  id: string
  text: string
  top: number
  delay: number
  createdAt: number
}

function matchSound(text: string): string {
  const patterns: { keys: string[]; sound: string }[] = [
    { keys: ['水', '雨', '海', '湖', '河', '浪', '泪', '滴', '流'], sound: '雨声' },
    { keys: ['风', '飞', '飘', '云', '叶', '呼啸', '轻拂'], sound: '风声' },
    { keys: ['光', '亮', '太阳', '星', '闪', '辉', '明', '火'], sound: '钟声' },
    { keys: ['暗', '夜', '深', '黑', '沉', '无声', '静'], sound: '低频嗡鸣' },
    { keys: ['火', '烧', '燃', '烟', '热', '烫', '焚'], sound: '火焰声' },
  ]
  for (const p of patterns) {
    for (const k of p.keys) {
      if (text.includes(k)) return p.sound
    }
  }
  return '海浪声'
}

export default function NeptunePage() {
  const [dreams, setDreams] = useLocalStorage<Dream[]>('neptune-dreams', [])
  const [input, setInput] = useState('')
  const [gift, setGift] = useState<string | null>(null)
  const [giftOptions, setGiftOptions] = useState<string[]>([])
  const [aiResult, setAiResult] = useState<{ symbols: { symbol: string; meaning: string }[]; theme: string; interpretation: string; sound: { emoji: string; label: string }; question: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSound, setActiveSound] = useState<string | null>(null)
  const [volume, setVolumeState] = useState(0.35)

  // 离开页面时停止声音
  useEffect(() => () => stopSound(), [])
  // 同步 activeSound
  useEffect(() => {
    const iv = setInterval(() => setActiveSound(currentSound()), 800)
    return () => clearInterval(iv)
  }, [])

  const addDream = () => {
    if (!input.trim()) return
    setDreams((prev) => [...prev, {
      id: `${Date.now()}`,
      text: input.trim(),
      top: 20 + (prev.length * 17) % 60,
      delay: Math.random() * 8,
      createdAt: Date.now(),
    }])
    setInput('')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('确认要让这条梦流走吗？')) {
      setDreams((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const pickGift = () => {
    const words = new Set<string>()
    for (const d of dreams) {
      for (const w of d.text.split(/[，,。.!！?？\s]+/)) {
        if (w.length >= 2 && w.length <= 4) words.add(w)
      }
    }
    const pool = Array.from(words).slice(0, 8)
    if (pool.length < 4) {
      const fallback = ['柔软', '清澈', '放下', '允许', '流动', '温柔', '呼吸', '允许自己']
      setGiftOptions(fallback.slice(0, 6))
    } else {
      setGiftOptions(pool)
    }
  }

  const handleExport = () => {
    exportAsImage(
      '梦境河',
      'NEPTUNE · 潜意识的流淌与启示',
      dreams.map((d) => ({
        text: d.text,
        meta: `🎵 ${matchSound(d.text)}`,
      })),
      bgColor, fgColor, accentColor, `neptune-${Date.now()}.png`
    )
  }

  return (
    <PlanetShell themeId="neptune" title="梦境河" subtitle="NEPTUNE · 潜意识的流淌与启示" description="海王星掌管梦、幻想、潜意识。当你睡着的时候，那些被你白天压在底下的东西就会流动起来。让这条河把它们慢慢地、缓缓地，漂给你看。"
      accent={
        <button onClick={handleExport} style={{
          padding: '10px 20px',
          borderRadius: 999,
          background: `${accentColor}20`,
          border: `1px solid ${accentColor}60`,
          color: fgColor,
          fontSize: 12,
          letterSpacing: 4,
          cursor: 'pointer',
        }}>导出为图片</button>
      }
    >
      {/* 流动的河 */}
      <div style={{ position: 'relative', height: 300, margin: '0 0 40px', overflow: 'hidden', opacity: dreams.length > 0 ? 1 : 0.25 }}>
        {dreams.map((d) => (
          <div key={d.id} onClick={(e) => { e.stopPropagation(); handleDelete(d.id) }} style={{
            position: 'absolute',
            top: `${d.top}%`,
            left: 0,
            whiteSpace: 'nowrap',
            fontSize: 14, letterSpacing: 4,
            color: fgColor,
            animation: `flowRight ${26 + d.delay}s linear ${d.delay}s infinite`,
            textShadow: `0 0 20px ${accentColor}60`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span>{d.text}</span>
            <span style={{
              fontSize: 11, opacity: 0.7,
              padding: '2px 8px', borderRadius: 999,
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}40`,
              letterSpacing: 2,
            }}>🎵 {matchSound(d.text)}</span>
            <span style={{ opacity: 0.5 }}>　·　</span>
          </div>
        ))}

        {/* 渐变蒙板 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, rgba(6,16,24,0.95) 0%, transparent 15%, transparent 85%, rgba(6,16,24,0.95) 100%)',
          pointerEvents: 'none',
        }} />

        {dreams.length === 0 && (
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', textAlign: 'center', fontSize: 14, color: fgColor, letterSpacing: 3, opacity: 0.55 }}>
            这条河现在是空的。写点什么，让它开始流动。
          </div>
        )}
      </div>

      {/* 捞起的词 */}
      {giftOptions.length > 0 && !gift && (
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: fgColor, letterSpacing: 3, opacity: 0.6, marginBottom: 20 }}>
            从这条河里，你捞起的是哪个词？
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 600, margin: '0 auto' }}>
            {giftOptions.map((w) => (
              <button key={w} onClick={() => setGift(w)}
                style={{
                  padding: '14px 24px', borderRadius: 999,
                  background: `${accentColor}15`,
                  border: `1px solid ${accentColor}40`,
                  color: fgColor, fontSize: 14, letterSpacing: 4, cursor: 'pointer',
                }}>
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {gift && (
        <div style={{ textAlign: 'center', marginBottom: 40, padding: 60 }}>
          <div style={{ fontSize: 42, letterSpacing: 10, color: fgColor, opacity: 0, animation: 'fadeIn 2s ease forwards', textShadow: `0 0 40px ${accentColor}60` }}>
            — {gift} —
          </div>
          <div style={{ fontSize: 12, opacity: 0.55, marginTop: 30, letterSpacing: 3, lineHeight: 2, color: fgColor }}>
            这是你的潜意识送给你的，<br />
            留着它，让它在你身体里，慢慢地找到位置。
          </div>
        </div>
      )}

      {/* 输入 */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: 24, borderRadius: 16, background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLTextAreaElement).value.trim()) { e.preventDefault(); addDream() } }}
          placeholder="一个梦、一段记忆、或一句反复出现的话 — 让它从你指尖流出"
          rows={2}
          style={{
            width: '100%', padding: 16,
            background: `${bgColor}aa`,
            border: `1px solid ${accentColor}30`,
            color: fgColor, fontSize: 14, letterSpacing: 2,
            borderRadius: 10, outline: 'none', resize: 'none',
            fontFamily: 'inherit', lineHeight: 2, boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={addDream} style={{ ...btnLav, flex: 1 }}>让它流进河里</button>
          <button onClick={pickGift} style={{ ...btnLav, flex: 1, background: `${accentColor}10`, borderColor: `${accentColor}40` }} disabled={dreams.length === 0}>
            从河里捞一个词
          </button>
          <button onClick={async () => {
            if ((dreams || []).length === 0) return
            setLoading(true)
            try {
              const r = await ai.neptune.dream((dreams || []).map((d: any) => d.text).join('\n'))
              setAiResult(r)
            } finally { setLoading(false) }
          }} disabled={loading || (dreams || []).length === 0} style={{ ...btnLav, flex: 1, background: 'rgba(160,200,255,0.15)', borderColor: 'rgba(160,200,255,0.4)' }}>
            {loading ? '倾听潜意识…' : `AI · 解读这条河`}
          </button>
        </div>
        {dreams.length > 0 && (
          <div style={{ fontSize: 11, opacity: 0.45, marginTop: 14, textAlign: 'center', letterSpacing: 2, color: fgColor }}>
            点击河里飘动的梦，可让它流走
          </div>
        )}
      </div>

      {aiResult && (
        <div style={{
          maxWidth: 620,
          margin: '40px auto 0',
          padding: 36,
          borderRadius: 16,
          background: 'rgba(12,28,45,0.65)',
          border: '1px solid rgba(100,160,220,0.3)',
          color: fgColor,
          position: 'relative',
        }}>
          <button onClick={() => setAiResult(null)} style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'transparent',
            border: '1px solid rgba(100,160,220,0.3)',
            color: fgColor,
            borderRadius: 999,
            width: 30,
            height: 30,
            cursor: 'pointer',
            fontSize: 14,
            opacity: 0.7,
          }}>×</button>

          <div style={{ textAlign: 'center', fontSize: 14, letterSpacing: 3, opacity: 0.55, marginBottom: 20 }}>
            这条河在说：{aiResult.theme}
          </div>

          <div style={{ textAlign: 'center', fontSize: 28, letterSpacing: 6, marginBottom: 32, textShadow: `0 0 30px ${accentColor}60` }}>
            {aiResult.theme}
          </div>

          <div style={{ marginBottom: 32 }}>
            {(aiResult.symbols || []).slice(0, 3).map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '14px 0',
                borderBottom: i < Math.min((aiResult.symbols || []).length, 3) - 1 ? '1px dashed rgba(100,160,220,0.2)' : 'none',
              }}>
                <div style={{
                  minWidth: 60,
                  fontSize: 14,
                  letterSpacing: 3,
                  color: accentColor,
                  fontWeight: 600,
                  opacity: 0.85,
                }}>{s.symbol}</div>
                <div style={{ flex: 1, fontSize: 13, letterSpacing: 2, lineHeight: 2, opacity: 0.85 }}>
                  {s.meaning}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            fontSize: 14,
            letterSpacing: 2,
            lineHeight: 2.2,
            opacity: 0.9,
            padding: '20px 24px',
            borderRadius: 12,
            background: `${accentColor}08`,
            border: `1px solid ${accentColor}20`,
            marginBottom: 28,
          }}>
            {aiResult.interpretation}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
              <button onClick={() => {
                const label = aiResult!.sound?.label || '海浪声'
                if (activeSound === label) { stopSound(); setActiveSound(null) }
                else { playSound(label); setActiveSound(label) }
              }} style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 38,
                background: activeSound === (aiResult!.sound?.label || '海浪声') ? `${accentColor}35` : `${accentColor}15`,
                border: `1px solid ${accentColor}${activeSound === (aiResult!.sound?.label || '海浪声') ? '90' : '40'}`,
                boxShadow: activeSound === (aiResult!.sound?.label || '海浪声') ? `0 0 40px ${accentColor}60, inset 0 0 20px ${accentColor}30` : `0 0 24px ${accentColor}30`,
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                animation: activeSound === (aiResult!.sound?.label || '海浪声') ? 'pulse 3s infinite ease-in-out' : 'none',
              }}>{aiResult.sound?.emoji}</button>
              <div style={{ fontSize: 14, letterSpacing: 3, opacity: 0.85 }}>
                {aiResult.sound?.label}<br/>
                <span style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>
                  {activeSound === (aiResult.sound?.label || '海浪声') ? '点击停止' : '点击播放'}
                </span>
              </div>
            </div>

            {/* 7 种声音快捷切换 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 560 }}>
              {['雨声', '风声', '钟声', '海浪声', '火焰声', '低频嗡鸣', '钢琴声'].map((sn) => (
                <button key={sn} onClick={() => {
                  if (activeSound === sn) { stopSound(); setActiveSound(null) }
                  else { playSound(sn); setActiveSound(sn) }
                }} style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: activeSound === sn ? `${accentColor}40` : 'rgba(100,160,220,0.08)',
                  border: `1px solid ${activeSound === sn ? `${accentColor}80` : 'rgba(100,160,220,0.25)'}`,
                  color: fgColor,
                  fontSize: 11,
                  letterSpacing: 3,
                  cursor: 'pointer',
                  opacity: activeSound === sn ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                }}>{sn}</button>
              ))}
            </div>

            {/* 音量滑块 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: 11, letterSpacing: 3, opacity: 0.55, color: fgColor }}>音量</span>
              <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => {
                const v = parseFloat(e.target.value)
                setVolumeState(v); setVolume(v)
              }} style={{
                width: 160, height: 2, WebkitAppearance: 'none', appearance: 'none',
                background: `linear-gradient(to right, ${accentColor}aa, ${accentColor}30)`,
                borderRadius: 999, outline: 'none', cursor: 'pointer',
              }}/>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: 18,
            fontStyle: 'italic',
            letterSpacing: 3,
            lineHeight: 2,
            opacity: 0.9,
            padding: '20px 16px 8px',
          }}>
            「{aiResult.question}」
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.35, marginTop: 30, letterSpacing: 3, color: fgColor }}>
        梦不需要被解释。它只需要被看见。
      </div>

      <style>{`
        @keyframes flowRight { from { transform: translateX(-100%); } to { transform: translateX(100vw); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: ${accentColor}; cursor: pointer; box-shadow: 0 0 8px ${accentColor}aa; }
        input[type="range"]::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: ${accentColor}; cursor: pointer; border: none; }
      `}</style>
    </PlanetShell>
  )
}

const btnLav: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: 999,
  background: `${accentColor}30`,
  border: `1px solid ${accentColor}60`,
  color: fgColor,
  fontSize: 13,
  letterSpacing: 4,
  cursor: 'pointer',
}
