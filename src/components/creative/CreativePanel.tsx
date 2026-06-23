import { useEffect, useState } from 'react'
import { useGameStore, generateFromPrompt } from './CreativeScene'
import { useShapeStore } from '../healing/healingStore'

export function CreativePanel() {
  const { pos, vel, tool, setTool } = useGameStore()
  const [prompt, setPrompt] = useState('')
  const [speechOpen, setSpeechOpen] = useState(true)
  const addPieces = useShapeStore((s) => s.addPiecesBatch)
  const clearPieces = useShapeStore((s) => s.clearAll)
  const piecesCount = useShapeStore((s) => s.pieces.length)
  const [fps, setFps] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  // FPS
  useEffect(() => {
    let last = performance.now()
    let frames = 0
    let rafId: number
    const tick = () => {
      frames++
      const now = performance.now()
      if (now - last >= 1000) {
        setFps(frames)
        frames = 0
        last = now
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // 指针锁定状态
  useEffect(() => {
    const onLock = () => setIsLocked(document.pointerLockElement !== null)
    document.addEventListener('pointerlockchange', onLock)
    return () => document.removeEventListener('pointerlockchange', onLock)
  }, [])

  const speed = Math.sqrt(vel[0] * vel[0] + vel[2] * vel[2]).toFixed(1)

  const handleGenerate = () => {
    const text = prompt.trim()
    if (!text) return
    const pieces = generateFromPrompt(text)
    addPieces(pieces)
    setPrompt('')
  }

  const quickTemplates = [
    { label: '🌈 彩虹', text: '彩虹' },
    { label: '🌲 森林', text: '树' },
    { label: '💖 爱心', text: '爱心' },
    { label: '🌸 花朵', text: '花朵' },
    { label: '🏔 山脉', text: '山' },
    { label: '✨ 星空', text: '星星月亮云' },
    { label: '🏠 小屋', text: '房子树' },
    { label: '💎 水晶', text: '水晶' },
    { label: '🧱 砖墙', text: '砖石头' },
    { label: '🏗 矿洞', text: '矿石石头' },
    { label: '❄️ 雪原', text: '雪石头' },
    { label: '🌊 冰河', text: '冰河' },
  ]

  return (
    <>
      {/* ===== 左下角：言出法随输入面板 ===== */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 10,
        background: 'rgba(0,0,0,0.55)', padding: 12, borderRadius: 14,
        color: '#fff', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,200,150,0.25)',
        width: speechOpen ? 280 : 150,
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: speechOpen ? 10 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ffd890', letterSpacing: 1 }}>
            ✨ 言出法随
            <span style={{ fontSize: 11, opacity: 0.75, marginLeft: 6 }}>
              ({piecesCount} 件)
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { clearPieces() }} style={{
              fontSize: 11, padding: '4px 8px', borderRadius: 6,
              background: 'rgba(255,120,120,0.2)', color: '#ff9999',
              border: '1px solid rgba(255,120,120,0.3)', cursor: 'pointer',
            }}>清空</button>
            <button onClick={() => setSpeechOpen(!speechOpen)} style={{
              fontSize: 11, padding: '4px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
            }}>{speechOpen ? '−' : '+'}</button>
          </div>
        </div>

        {speechOpen && (
          <>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="描述你想要的世界..."
                style={{
                  flex: 1, padding: '8px 10px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,200,150,0.3)',
                  color: '#fff', fontSize: 12, outline: 'none',
                }}
              />
              <button onClick={handleGenerate} style={{
                padding: '8px 14px', borderRadius: 8,
                background: 'linear-gradient(135deg, #ffb347, #ff6b9d)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 12, letterSpacing: 1,
              }}>生成</button>
            </div>

            <div style={{ fontSize: 10, opacity: 0.65, marginBottom: 6 }}>
              💡 快速模板（点击）
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {quickTemplates.map((t, i) => (
                <button key={i} onClick={() => {
                  const pieces = generateFromPrompt(t.text)
                  addPieces(pieces)
                }} style={{
                  padding: '4px 10px', borderRadius: 12,
                  background: 'rgba(255,200,150,0.12)',
                  color: '#fff', fontSize: 11,
                  border: '1px solid rgba(255,200,150,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,200,150,0.25)')}
                   onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,200,150,0.12)')}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 10, opacity: 0.55, marginTop: 10, lineHeight: 1.5 }}>
              例："房子 树 花 山" → 自动生成建筑和植物<br />
              几何体将出现在你面前 6 格左右的地面上
            </div>
          </>
        )}
      </div>
      {/* ===== 左上角：状态信息 ===== */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 10,
        background: 'rgba(0,0,0,0.45)', padding: '12px 18px', borderRadius: 12,
        color: '#fff', fontSize: 13, lineHeight: 1.7, backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)', minWidth: 200,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#ffd890', marginBottom: 4, letterSpacing: 1 }}>
          🌍 像素世界
        </div>
        <div>📍 位置: {Math.round(pos[0])}, {Math.round(pos[1])}, {Math.round(pos[2])}</div>
        <div>🏃 速度: {speed}</div>
        <div>🎯 模式: {tool === 'place' ? '🧱 放置' : tool === 'remove' ? '✂️ 删除' : '—'}</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>FPS: {fps}</div>
      </div>

      {/* ===== 右上角：控制说明 ===== */}
      {!isLocked && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', zIndex: 100,
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.75)', padding: '30px 40px', borderRadius: 16,
          color: '#fff', textAlign: 'center', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,200,100,0.3)',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, letterSpacing: 2, color: '#ffcf6b' }}>
            👆 点击屏幕开始游戏
          </div>
          <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.9, textAlign: 'left', display: 'inline-block' }}>
            <div><b>WASD</b> / 方向键  — 移动</div>
            <div><b>空格</b>  — 跳跃</div>
            <div><b>鼠标</b>  — 视角</div>
            <div><b>左键</b>  — 放置方块</div>
            <div><b>右键</b>  — 删除方块</div>
            <div><b>1~9</b>  — 切换方块</div>
            <div><b>B</b>  — 放置/删除切换</div>
            <div><b>Esc</b>  — 释放鼠标</div>
          </div>
        </div>
      )}

      {/* ===== 屏幕中心十字准星 ===== */}
      {isLocked && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', zIndex: 10,
          transform: 'translate(-50%, -50%)',
          width: 22, height: 22, pointerEvents: 'none',
        }}>
          <div style={{ position: 'absolute', width: 22, height: 2, background: 'rgba(255,255,255,0.85)', top: 10, left: 0, boxShadow: '0 0 4px #000' }} />
          <div style={{ position: 'absolute', width: 2, height: 22, background: 'rgba(255,255,255,0.85)', left: 10, top: 0, boxShadow: '0 0 4px #000' }} />
        </div>
      )}

    </>
  )
}
