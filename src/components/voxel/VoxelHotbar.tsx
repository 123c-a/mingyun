import { useEffect } from 'react'
import { useVoxelWorldStore, HOTBAR_BLOCKS, BLOCK_DEFS, type BlockType } from './voxelWorldStore'
import { usePhysicsStore } from './physicsStore'

interface HotbarProps {
  onLockChange: (locked: boolean) => void
}

export function VoxelHotbar({ onLockChange }: HotbarProps) {
  const selectedSlot = useVoxelWorldStore((s) => s.selectedSlot)
  const setSelectedSlot = useVoxelWorldStore((s) => s.setSelectedSlot)
  const blocks = useVoxelWorldStore((s) => s.blocks)
  const crosshairTarget = useVoxelWorldStore((s) => s.crosshairTarget)
  const clearWorld = useVoxelWorldStore((s) => s.clearWorld)
  const regenerateWorld = useVoxelWorldStore((s) => s.regenerateWorld)

  const throwMode = usePhysicsStore((s) => s.throwMode)
  const setThrowMode = usePhysicsStore((s) => s.setThrowMode)
  const spawnBurst = usePhysicsStore((s) => s.spawnBurst)
  const spawnTower = usePhysicsStore((s) => s.spawnTower)
  const clearDynamic = usePhysicsStore((s) => s.clearDynamic)
  const gravity = usePhysicsStore((s) => s.gravity)
  const setGravity = usePhysicsStore((s) => s.setGravity)
  const resetGravity = usePhysicsStore((s) => s.resetGravity)
  const activeCount = usePhysicsStore((s) => s.activeCount)

  // 统计每种方块数量
  const blockCounts: Partial<Record<BlockType, number>> = {}
  blocks.forEach((b) => {
    blockCounts[b.type] = (blockCounts[b.type] || 0) + 1
  })

  // 数字键选择格子 + 快捷键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key)
      if (n >= 1 && n <= 9) {
        setSelectedSlot(n - 1)
      }
      if (e.key === 't' || e.key === 'T') {
        setThrowMode(!throwMode)
      }
      if (e.key === 'e' || e.key === 'E') {
        spawnBurst(HOTBAR_BLOCKS[selectedSlot] || 'grass')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSelectedSlot, setThrowMode, throwMode, spawnBurst, selectedSlot])

  const selectedBlock = HOTBAR_BLOCKS[selectedSlot]
  const def = selectedBlock ? BLOCK_DEFS[selectedBlock] : null

  return (
    <>
      {/* 顶部提示 */}
      <div style={{
        position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.78)', color: '#fff', padding: '8px 20px',
        borderRadius: 10, fontSize: 12, zIndex: 100, fontFamily: 'monospace',
        letterSpacing: 0.5, border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)', textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
      }}>
        <div style={{ marginBottom: 2 }}>
          🟩 像素世界 &nbsp;|&nbsp; 点击画面锁定鼠标 &nbsp;|&nbsp;
          <span style={{ color: '#aaa' }}>WASD 移动</span> &nbsp;
          <span style={{ color: '#aaa' }}>空格 跳跃</span> &nbsp;
          <span style={{ color: '#aaa' }}>1-9 选方块</span> &nbsp;
          <span style={{ color: '#aaa' }}>ESC 退出</span>
        </div>
        <div style={{ fontSize: 11, opacity: 0.9 }}>
          {throwMode
            ? <><span style={{ color: '#ffb347' }}>⚡ 投掷模式</span>：左键发射方块 · E 连发 10 个 · <span style={{ color: '#aaa' }}>T 切回建造</span></>
            : <><span style={{ color: '#6bff6b' }}>🛠 建造模式</span>：<span style={{ color: '#ff6b6b' }}>左键删除</span> · <span style={{ color: '#6bff6b' }}>右键放置</span> · <span style={{ color: '#aaa' }}>T 切换投掷</span></>
          }
        </div>
      </div>

      {/* 准星 */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 200,
        pointerEvents: 'none',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <line x1="12" y1="4" x2="12" y2="10" stroke={throwMode ? '#ffb347' : '#ffffff'} strokeWidth="1.5" />
          <line x1="12" y1="14" x2="12" y2="20" stroke={throwMode ? '#ffb347' : '#ffffff'} strokeWidth="1.5" />
          <line x1="4" y1="12" x2="10" y2="12" stroke={throwMode ? '#ffb347' : '#ffffff'} strokeWidth="1.5" />
          <line x1="14" y1="12" x2="20" y2="12" stroke={throwMode ? '#ffb347' : '#ffffff'} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="none" stroke={throwMode ? '#ffb347' : '#ffffff'} strokeWidth="0.8" opacity="0.85" />
        </svg>
        {crosshairTarget && !throwMode && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%',
            background: 'rgba(100,255,100,0.7)',
            animation: 'pulse 0.5s infinite',
          }} />
        )}
        {throwMode && (
          <div style={{
            position: 'absolute', top: 'calc(50% + 18px)', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10, fontFamily: 'monospace', color: '#ffb347',
            textShadow: '0 1px 2px rgba(0,0,0,1)', whiteSpace: 'nowrap',
          }}>
            ⚡ 射击 · {activeCount} 个动态方块
          </div>
        )}
      </div>

      {/* 底部 Hotbar + 物理控制 */}
      <div style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 100,
      }}>
        {/* 当前选中信息 */}
        <div style={{
          background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '4px 14px', borderRadius: 8,
          fontSize: 11, fontFamily: 'monospace', letterSpacing: 1,
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span>
            {def ? `${def.emoji} ${def.label}` : ''} &nbsp;
            <span style={{ opacity: 0.5 }}>[{selectedSlot + 1}/9]</span>
          </span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ color: '#88ccff' }}>🪐 动态 {activeCount} / 200</span>
        </div>

        {/* 9格热键栏 */}
        <div style={{
          display: 'flex', gap: 3,
          background: 'rgba(0,0,0,0.75)',
          padding: '4px 6px',
          borderRadius: 6,
          border: '2px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
        }}>
          {HOTBAR_BLOCKS.slice(0, 9).map((type, i) => {
            const blockDef = BLOCK_DEFS[type]
            const count = blockCounts[type] || 0
            const isSelected = i === selectedSlot

            return (
              <button
                key={i}
                onClick={() => setSelectedSlot(i)}
                title={blockDef.label}
                style={{
                  width: 44, height: 44,
                  background: isSelected
                    ? `linear-gradient(135deg, ${blockDef.color}88, ${blockDef.color}44)`
                    : `linear-gradient(135deg, #2a2a2a, #1a1a1a)`,
                  border: isSelected
                    ? `2px solid ${blockDef.color}`
                    : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: isSelected ? `0 0 12px ${blockDef.color}aa, inset 0 1px 0 rgba(255,255,255,0.1)` : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  transition: 'all 0.15s',
                  transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 3,
                  background: blockDef.color,
                  borderRadius: 2,
                  opacity: 0.85,
                  boxShadow: blockDef.emissive ? `0 0 10px ${blockDef.color}` : 'inset 0 -2px 0 rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.1)',
                }} />
                <span style={{
                  position: 'absolute', top: 2, left: 4,
                  fontSize: 9, fontFamily: 'monospace',
                  color: isSelected ? '#fff' : '#888', fontWeight: 700,
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                }}>{i + 1}</span>
                {count > 0 && (
                  <span style={{
                    position: 'absolute', bottom: 2, right: 4,
                    fontSize: 9, fontFamily: 'monospace',
                    color: '#fff', fontWeight: 700,
                    textShadow: '0 1px 2px rgba(0,0,0,1)',
                  }}>
                    {count > 999 ? '999+' : count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* 世界控制按钮 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, maxWidth: 720 }}>
          <button
            onClick={() => setThrowMode(!throwMode)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              fontFamily: 'monospace', backdropFilter: 'blur(8px)',
              background: throwMode
                ? 'linear-gradient(135deg, rgba(255,179,71,0.25), rgba(255,140,67,0.15))'
                : 'rgba(0,0,0,0.7)',
              color: throwMode ? '#ffb347' : '#aaa',
              border: `1px solid ${throwMode ? 'rgba(255,179,71,0.55)' : 'rgba(255,255,255,0.1)'}`,
              fontWeight: throwMode ? 700 : 400,
            }}>
            {throwMode ? '⚡ 投掷模式 (T)' : '🛠 建造模式 (T)'}
          </button>

          <button
            onClick={() => spawnBurst(HOTBAR_BLOCKS[selectedSlot] || 'grass')}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              fontFamily: 'monospace', backdropFilter: 'blur(8px)',
              background: 'linear-gradient(135deg, rgba(100,200,255,0.25), rgba(100,150,255,0.15))',
              color: '#88ccff',
              border: '1px solid rgba(100,200,255,0.45)',
            }}>
            💥 连发10 (E)
          </button>

          <button
            onClick={() => spawnTower(HOTBAR_BLOCKS[selectedSlot] || 'grass')}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              fontFamily: 'monospace', backdropFilter: 'blur(8px)',
              background: 'linear-gradient(135deg, rgba(255,150,200,0.25), rgba(200,100,200,0.15))',
              color: '#ffb0d8',
              border: '1px solid rgba(255,150,200,0.45)',
            }}>
            🏯 方块柱
          </button>

          <button
            onClick={() => clearDynamic()}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              fontFamily: 'monospace', backdropFilter: 'blur(8px)',
              background: 'linear-gradient(135deg, rgba(255,100,100,0.25), rgba(200,60,60,0.15))',
              color: '#ff9090',
              border: '1px solid rgba(255,100,100,0.45)',
            }}>
            🧹 清动态
          </button>

          <button
            onClick={() => {
              if (window.confirm('重新生成世界？地形会重置，动态方块会清空。')) {
                regenerateWorld()
              }
            }}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              fontFamily: 'monospace', backdropFilter: 'blur(8px)',
              background: 'rgba(0,0,0,0.7)', color: '#aaa',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
            🎲 新世界
          </button>

          <button
            onClick={() => {
              if (window.confirm('清除所有玩家放置的方块？')) {
                clearWorld()
              }
            }}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              fontFamily: 'monospace', backdropFilter: 'blur(8px)',
              background: 'rgba(0,0,0,0.7)', color: '#aaa',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
            🧹 清建造
          </button>
        </div>

        {/* 物理控制面板 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(0,0,0,0.75)', color: '#ccc', padding: '6px 14px',
          borderRadius: 8, fontSize: 11, fontFamily: 'monospace',
          border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
        }}>
          <span>🪐 重力</span>
          <input
            type="range" min={-30} max={40} step={1}
            value={Math.round(gravity)}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            style={{ width: 220 }}
          />
          <span style={{
            color: gravity <= 0 ? '#88ccff' : gravity > 25 ? '#ff9090' : '#aaa',
            minWidth: 50, textAlign: 'right',
          }}>
            {gravity <= 0 ? `↑ ${Math.abs(gravity).toFixed(0)}` : `↓ ${gravity.toFixed(0)}`}
          </span>
          <button
            onClick={resetGravity}
            style={{
              padding: '2px 10px', borderRadius: 6,
              fontSize: 10, cursor: 'pointer', fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.08)', color: '#aaa',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
            默认
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(to right, rgba(136,204,255,0.4), rgba(200,200,200,0.15), rgba(255,144,144,0.5));
          border-radius: 999px;
          height: 6px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px rgba(255,255,255,0.8);
          cursor: pointer;
          border: 2px solid #888;
        }
      `}</style>
    </>
  )
}
