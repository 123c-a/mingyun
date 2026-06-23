import { useShapeStore, PIECE_COLORS } from './healingStore'

export function HealingPropertyPanel() {
  const { selectedId, pieces, updatePiece, removePiece, duplicateSelected, rotateSelected } = useShapeStore()
  const piece = pieces.find((p) => p.id === selectedId)

  return (
    <div
      className="z-20 flex flex-col gap-3"
      style={{
        width: 240,
        background: 'rgba(20, 16, 30, 0.95)',
        borderLeft: '1px solid rgba(255,179,217,0.12)',
        padding: '20px 14px',
        overflowY: 'auto',
        color: '#f0e6f4',
        backdropFilter: 'blur(16px)',
      }}
    >
      <h2 className="text-lg font-bold" style={{ color: '#ffd6ea' }}>⚙️ 精调</h2>

      {!piece && (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
          <div style={{ fontSize: 40 }}>🌱</div>
          <p className="text-sm mt-2" style={{ color: '#c8a8d8' }}>
            选中一个形状<br />来调整它的属性
          </p>
        </div>
      )}

      {piece && (
        <>
          {/* 颜色 */}
          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-60">颜色</div>
            <div className="grid grid-cols-8 gap-1.5">
              {PIECE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updatePiece(piece.id, { color: c })}
                  style={{
                    background: c,
                    aspectRatio: '1',
                    borderRadius: 6,
                    transform: piece.color === c ? 'scale(1.2)' : 'scale(1)',
                    outline: piece.color === c ? '2px solid rgba(255,255,255,0.6)' : 'none',
                    outlineOffset: '1px',
                    boxShadow: piece.color === c ? `0 0 8px ${c}` : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* 透明度 */}
          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-60">
              透明度 · {Math.round(piece.opacity * 100)}%
            </div>
            <input
              type="range" min={0.05} max={1} step={0.05}
              value={piece.opacity}
              onChange={(e) => updatePiece(piece.id, { opacity: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#ffb3d9' }}
            />
          </div>

          {/* 位置 */}
          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-60">位置</div>
            <div className="grid grid-cols-3 gap-2">
              {(['X', 'Y', 'Z'] as const).map((axis, i) => (
                <div key={axis} className="flex flex-col">
                  <span className="text-[10px] text-white/40 mb-1 text-center">{axis}</span>
                  <input
                    type="number" step={1}
                    value={piece.position[i]}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0
                      const newPos: [number, number, number] = [...piece.position]
                      newPos[i] = v
                      updatePiece(piece.id, { position: newPos })
                    }}
                    className="w-full px-2 py-1.5 text-sm rounded-lg outline-none text-center"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#f0e6f4', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 缩放 */}
          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-60">
              缩放 · {piece.scale.toFixed(2)}x
            </div>
            <input
              type="range" min={0.1} max={5} step={0.05}
              value={piece.scale}
              onChange={(e) => updatePiece(piece.id, { scale: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#ffb3d9' }}
            />
          </div>

          {/* 旋转 */}
          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-60">
              旋转 · {piece.rotationY}°
            </div>
            <input
              type="range" min={0} max={315} step={45}
              value={piece.rotationY}
              onChange={(e) => updatePiece(piece.id, { rotationY: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#ffb3d9' }}
            />
          </div>

          {/* 快速操作 */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button onClick={rotateSelected}
              className="py-2.5 rounded-xl text-sm bg-white/8 hover:bg-white/15 text-white/80 transition-all">
              ↻ 旋转 45°
            </button>
            <button onClick={duplicateSelected}
              className="py-2.5 rounded-xl text-sm bg-white/8 hover:bg-white/15 text-white/80 transition-all">
              📋 复制形状
            </button>
            <button onClick={() => removePiece(piece.id)}
              className="py-2.5 rounded-xl text-sm bg-red-500/15 hover:bg-red-500/25 text-red-300 transition-all">
              🗑 移除
            </button>
          </div>
        </>
      )}

      <div className="mt-auto pt-3 border-t border-white/10 text-[11px] text-white/35">
        💡 提示：在「创造」模式下点击可堆叠新形状，「调整」模式可拖拽移动现有形状。
      </div>
    </div>
  )
}
