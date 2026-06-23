import { useLegoStore, PIECE_COLORS, PieceType, getPieceSize } from './legoStore'

interface PieceButton {
  type: PieceType
  label: string
  desc: string
}

const PIECE_BUTTONS: PieceButton[] = [
  { type: 'brick-1x1', label: '1×1 方', desc: '标准 1 格积木' },
  { type: 'brick-2x2', label: '2×2 方', desc: '2×2 标准积木' },
  { type: 'brick-2x4', label: '2×4 方', desc: '2×4 长积木' },
  { type: 'plate-2x2', label: '2×2 板', desc: '薄板 2×2' },
  { type: 'plate-2x4', label: '2×4 板', desc: '薄板 2×4' },
  { type: 'cylinder', label: '圆柱', desc: '圆形积木' },
  { type: 'sphere', label: '球体', desc: '圆球状积木' },
  { type: 'cone', label: '尖顶', desc: '锥形积木' },
  { type: 'roof', label: '屋顶', desc: '斜面屋顶' },
]

export function LegoPanel() {
  const {
    activeType,
    activeColor,
    mode,
    setActiveType,
    setActiveColor,
    setMode,
    clearAll,
    duplicateSelected,
    removePiece,
    selectedId,
    rotateSelected,
    scaleSelected,
    pieces,
  } = useLegoStore()

  return (
    <div
      className="z-20 flex flex-col gap-4"
      style={{
        width: 240,
        background: 'rgba(20, 22, 34, 0.92)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 14px',
        overflowY: 'auto',
        color: '#e5e7eb',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div>
        <h2 className="text-lg font-bold mb-1" style={{ color: '#fff' }}>
          🏗️ 乐高搭建台
        </h2>
        <p className="text-xs opacity-60">
          共 {pieces.length} 块 · 选中: {selectedId ? '是' : '无'}
        </p>
      </div>

      {/* Mode */}
      <div>
        <div className="text-xs uppercase tracking-wider mb-2 opacity-70">模式</div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('place')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'place'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            ➕ 放置
          </button>
          <button
            onClick={() => setMode('select')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'select'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            👆 选择
          </button>
        </div>
      </div>

      {/* Piece palette */}
      <div>
        <div className="text-xs uppercase tracking-wider mb-2 opacity-70">零件</div>
        <div className="grid grid-cols-2 gap-2">
          {PIECE_BUTTONS.map((b) => {
            const size = getPieceSize(b.type, 1)
            const w = Math.max(28, Math.min(44, size.w * 12))
            const h = Math.max(16, Math.min(40, size.h * 16))
            const d = Math.max(16, Math.min(28, size.d * 12))
            return (
              <button
                key={b.type}
                onClick={() => setActiveType(b.type)}
                className={`rounded-lg py-2 px-2 flex flex-col items-center gap-1 transition-all text-[11px] ${
                  activeType === b.type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                }`}
                title={b.desc}
              >
                <div
                  style={{
                    width: w,
                    height: h,
                    borderRadius: 4,
                    background: activeColor,
                    boxShadow: activeType === b.type ? '0 2px 8px rgba(0,229,255,0.4)' : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                    marginBottom: 4,
                  }}
                />
                <span>{b.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Colors */}
      <div>
        <div className="text-xs uppercase tracking-wider mb-2 opacity-70">颜色</div>
        <div className="grid grid-cols-6 gap-2">
          {PIECE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              className={`aspect-square rounded-md transition-all ${
                activeColor === c ? 'ring-2 ring-cyan-400 scale-110' : 'hover:scale-105'
              }`}
              style={{ background: c, boxShadow: activeColor === c ? '0 0 10px ' + c : 'inset 0 1px 2px rgba(0,0,0,0.3)' }}
            />
          ))}
        </div>
      </div>

      {/* Selected piece actions */}
      <div>
        <div className="text-xs uppercase tracking-wider mb-2 opacity-70">操作</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={!selectedId}
            onClick={() => rotateSelected()}
            className="py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ↻ 旋转 (R)
          </button>
          <button
            disabled={!selectedId}
            onClick={() => duplicateSelected()}
            className="py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            📋 复制 (D)
          </button>
          <button
            disabled={!selectedId}
            onClick={() => removePiece(selectedId!)}
            className="py-2 rounded-lg text-sm bg-red-500/20 hover:bg-red-500/40 text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            🗑 删除 (Del)
          </button>
          <button
            disabled={!selectedId}
            onClick={() => scaleSelected(-0.1)}
            className="py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            -小 (-)
          </button>
          <button
            disabled={!selectedId}
            onClick={() => scaleSelected(0.1)}
            className="col-span-1 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            +大 (+)
          </button>
          <button
            onClick={clearAll}
            className="py-2 rounded-lg text-sm bg-white/10 hover:bg-red-500/40 text-white/80 transition-all"
          >
            🧹 清空
          </button>
        </div>
      </div>

      {/* Keyboard help */}
      <div className="mt-auto pt-3 border-t border-white/10 text-[11px] leading-relaxed text-white/50">
        <div className="font-semibold text-white/70 mb-1">快捷键</div>
        <div>🖱 左键：放置 / 选择 / 拖拽</div>
        <div>⎋ 箭头：移动选中积木</div>
        <div>↑ ↓ 高度: 移动 Y 轴</div>
        <div>R: 旋转 · D: 复制 · Del: 删除</div>
        <div>+ / - : 放大 / 缩小</div>
        <div className="mt-2">🖲 右键旋转视角 · 滚轮缩放 · 中键平移</div>
      </div>
    </div>
  )
}
