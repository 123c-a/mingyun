import { useLegoStore, PIECE_COLORS } from './legoStore'

export function LegoPropertyPanel() {
  const { selectedId, pieces, updatePiece, removePiece, duplicateSelected } = useLegoStore()
  const piece = pieces.find((p) => p.id === selectedId)

  return (
    <div
      className="z-20 flex flex-col gap-4"
      style={{
        width: 230,
        background: 'rgba(20, 22, 34, 0.92)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 14px',
        overflowY: 'auto',
        color: '#e5e7eb',
        backdropFilter: 'blur(12px)',
      }}
    >
      <h2 className="text-lg font-bold" style={{ color: '#fff' }}>
        ⚙️ 属性
      </h2>

      {!piece && (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
          <div className="text-4xl mb-2">🔲</div>
          <p className="text-sm">点击场景中的积木 或选择左侧"放置"模式新建</p>
        </div>
      )}

      {piece && (
        <>
          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-70">类型</div>
            <div className="text-sm bg-white/10 rounded-lg py-2 px-3 text-white/80">
              {piece.type}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-70">颜色</div>
            <div className="grid grid-cols-6 gap-1.5">
              {PIECE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updatePiece(piece.id, { color: c })}
                  className={`aspect-square rounded-md transition-all ${
                    piece.color === c ? 'ring-2 ring-cyan-400 scale-110' : 'hover:scale-105'
                  }`}
                  style={{
                    background: c,
                    boxShadow: piece.color === c ? '0 0 10px ' + c : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-70">
              位置 (X, Y, Z)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['X', 'Y', 'Z'] as const).map((axis, i) => (
                <div key={axis} className="flex flex-col">
                  <span className="text-[10px] text-white/50 mb-1">{axis}</span>
                  <input
                    type="number"
                    step={1}
                    value={piece.position[i]}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0
                      const newPos: [number, number, number] = [...piece.position]
                      newPos[i] = v
                      updatePiece(piece.id, { position: newPos })
                    }}
                    className="w-full px-2 py-1 text-sm bg-white/10 text-white rounded-md outline-none focus:bg-white/20 border border-white/10"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-70">
              缩放 · {piece.scale.toFixed(1)}x
            </div>
            <input
              type="range"
              min={0.3}
              max={3}
              step={0.1}
              value={piece.scale}
              onChange={(e) => updatePiece(piece.id, { scale: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] opacity-60 mt-1">
              <span>0.3</span>
              <span>3.0</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider mb-2 opacity-70">
              旋转 · {piece.rotationY}°
            </div>
            <input
              type="range"
              min={0}
              max={270}
              step={90}
              value={piece.rotationY}
              onChange={(e) => updatePiece(piece.id, { rotationY: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => duplicateSelected()}
              className="py-2 rounded-lg text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-all"
            >
              📋 复制 (D)
            </button>
            <button
              onClick={() => removePiece(piece.id)}
              className="py-2 rounded-lg text-sm bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all"
            >
              🗑 删除 (Del)
            </button>
          </div>
        </>
      )}

      <div className="mt-auto pt-3 border-t border-white/10 text-[11px] text-white/40">
        💡 提示：拖拽积木可直接移动到新位置。堆在其它积木上会自动吸附到顶层。
      </div>
    </div>
  )
}
