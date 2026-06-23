import { useState } from 'react'
import { useShapeStore, PIECE_COLORS, type PieceType } from './healingStore'

interface ShapeDef { type: PieceType; label: string; emoji: string; desc: string }

const BASIC_SHAPES: ShapeDef[] = [
  { type: 'cube', label: '方块', emoji: '🧊', desc: '坚实的基础' },
  { type: 'slab', label: '薄板', emoji: '📋', desc: '铺地与做路' },
  { type: 'pillar', label: '柱子', emoji: '🏛', desc: '支撑与引导' },
  { type: 'sphere', label: '球体', emoji: '🔮', desc: '完整与圆满' },
]

const NATURE_SHAPES: ShapeDef[] = [
  { type: 'tree', label: '小树', emoji: '🌳', desc: '生命的生长' },
  { type: 'flower', label: '小花', emoji: '🌸', desc: '美好与绽放' },
  { type: 'grass', label: '草丛', emoji: '🌿', desc: '默默的陪伴' },
  { type: 'mountain', label: '山峰', emoji: '⛰', desc: '跨越与坚持' },
  { type: 'cloud', label: '云朵', emoji: '☁️', desc: '轻盈与释然' },
  { type: 'rainbow', label: '彩虹', emoji: '🌈', desc: '美好的遇见' },
  { type: 'river', label: '河流', emoji: '🌊', desc: '流动与变化' },
]

const HEALING_SHAPES: ShapeDef[] = [
  { type: 'heart', label: '心形', emoji: '💗', desc: '爱与被爱' },
  { type: 'star', label: '星星', emoji: '⭐', desc: '希望与指引' },
  { type: 'crystal', label: '水晶', emoji: '💎', desc: '内敛的光芒' },
  { type: 'feather', label: '羽毛', emoji: '🪶', desc: '轻盈放下' },
  { type: 'shell', label: '贝壳', emoji: '🐚', desc: '珍贵的记忆' },
  { type: 'petal', label: '花瓣', emoji: '🌸', desc: '生命的美好' },
  { type: 'moon', label: '月亮', emoji: '🌙', desc: '温柔的陪伴' },
  { type: 'tower', label: '灯塔', emoji: '🗼', desc: '为自己发光' },
  { type: 'bridge', label: '桥', emoji: '🌉', desc: '连接与跨越' },
  { type: 'text-label', label: '文字', emoji: '📝', desc: '写一句给自己' },
]

type TabKey = 'basic' | 'nature' | 'healing'

export function HealingPanel() {
  const { activeType, setActiveType, setActiveColor, activeColor, mode, setMode, clearAll, pieces, selectedId,
    rotateSelected, duplicateSelected, removePiece, scaleSelected, activeOpacity, setActiveOpacity,
    activeMetalness, setActiveMetalness, activeMaterial, setActiveMaterial, activeLabel, setActiveLabel,
    savedScenes, saveScene, loadScene, deleteScene
  } = useShapeStore()

  const [tab, setTab] = useState<TabKey>('basic')
  const [sceneName, setSceneName] = useState('')

  const shapesForTab = (() => {
    switch (tab) {
      case 'basic': return BASIC_SHAPES
      case 'nature': return NATURE_SHAPES
      case 'healing': return HEALING_SHAPES
    }
  })()

  const containerStyle: React.CSSProperties = {
    width: 280,
    background: 'rgba(20, 16, 30, 0.92)',
    borderRight: '1px solid rgba(255,179,217,0.12)',
    padding: '18px 16px',
    overflowY: 'auto',
    color: '#f0e6f4',
    backdropFilter: 'blur(16px)',
    maxHeight: '100vh',
  }

  return (
    <div style={containerStyle}>
      {/* 标题 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#ffd8ea', letterSpacing: 2 }}>
          🌸 释怀 3D
        </div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>共 {pieces.length} 件几何体 · 塑造你的场景</div>
      </div>

      {/* 模式切换 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setMode('place')}
          style={mode === 'place' ? activeBtn() : inactiveBtn()}>✨ 创造</button>
        <button onClick={() => setMode('select')}
          style={mode === 'select' ? activeBtn() : inactiveBtn()}>👆 调整</button>
      </div>

      {/* 形状分类 Tab */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, fontSize: 11 }}>
        {([['basic', '基础'], ['nature', '自然'], ['healing', '治愈']] as [TabKey, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={tab === k ? tabActive() : tabInactive()}>
            {label}
          </button>
        ))}
      </div>

      {/* 形状网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
        {shapesForTab.map((s) => (
          <button key={s.type} onClick={() => setActiveType(s.type)}
            style={activeType === s.type ? shapeBtnActive() : shapeBtnInactive()}
            title={s.desc}>
            <div style={{ fontSize: 20, lineHeight: 1.1 }}>{s.emoji}</div>
            <div style={{ fontSize: 11, marginTop: 2 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* 文字标签输入 */}
      {activeType === 'text-label' && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6, letterSpacing: 1 }}>写一句文字：</div>
          <input
            type="text"
            value={activeLabel}
            onChange={(e) => setActiveLabel(e.target.value)}
            placeholder="写一句放在场景里的话..."
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,179,217,0.2)',
              color: '#f0e6f4',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* 颜色选择 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8, letterSpacing: 1 }}>色彩</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
          {PIECE_COLORS.map((c) => (
            <button key={c} onClick={() => setActiveColor(c)} style={{
              aspectRatio: '1/1',
              background: c,
              border: activeColor === c ? '2px solid #fff' : '2px solid transparent',
              borderRadius: 6,
              boxShadow: activeColor === c ? `0 0 12px ${c}aa` : 'none',
              transform: activeColor === c ? 'scale(1.15)' : 'scale(1)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* 透明度 + 金属度 + 发光材质 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>透明度 · {Math.round(activeOpacity * 100)}%</div>
          <input type="range" min={0.15} max={1} step={0.05} value={activeOpacity}
            onChange={(e) => setActiveOpacity(parseFloat(e.target.value))}
            style={{ width: '100%' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>金属光 · {Math.round(activeMetalness * 100)}%</div>
          <input type="range" min={0} max={1} step={0.05} value={activeMetalness}
            onChange={(e) => setActiveMetalness(parseFloat(e.target.value))}
            style={{ width: '100%' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>材质模式</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['standard', 'mat', 'glow'] as const).map((m) => (
              <button key={m} onClick={() => setActiveMaterial(m)}
                style={activeMaterial === m ? activeBtn('#ffb3d9', '#1a1030') : inactiveBtn()}>
                {m === 'standard' ? '🌆 标准' : m === 'mat' ? '🌫 柔光' : '✨ 发光'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 操作区 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8, letterSpacing: 1 }}>当前 · {selectedId ? '已选中' : '未选中'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button disabled={!selectedId} onClick={rotateSelected} style={!selectedId ? disabledOpBtn() : opBtn()}>↻ 旋转</button>
          <button disabled={!selectedId} onClick={duplicateSelected} style={!selectedId ? disabledOpBtn() : opBtn()}>📋 复制</button>
          <button disabled={!selectedId} onClick={() => removePiece(selectedId!)} style={!selectedId ? disabledOpBtn() : delBtn()}>🗑 删除</button>
          <button onClick={() => scaleSelected(-0.1)} style={opBtn()}>➖ 小</button>
          <button onClick={() => scaleSelected(0.1)} style={opBtn()}>➕ 大</button>
          <button onClick={() => { if (window.confirm('清空整个场景?')) clearAll() }} style={opBtn()}>🧹 清空</button>
        </div>
      </div>

      {/* 场景保存/读取 */}
      <div style={{ marginBottom: 14, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6, letterSpacing: 1 }}>🏛 我的场景</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input type="text" value={sceneName} onChange={(e) => setSceneName(e.target.value)}
            placeholder="名字..." style={{
              flex: 1, padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0e6f4', outline: 'none',
            }} />
          <button onClick={() => {
            const name = (sceneName || '未命名').trim()
            saveScene(name)
            setSceneName('')
          }} style={{
            padding: '6px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
            background: 'linear-gradient(135deg,#ffb3d9,#b0a8e8)', color: '#1a1030', border: 'none', fontWeight: 600,
          }}>保存</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 120, overflowY: 'auto' }}>
          {savedScenes.length === 0 && (
            <div style={{ fontSize: 11, opacity: 0.5, textAlign: 'center', padding: 8 }}>
              还没有保存场景
            </div>
          )}
          {savedScenes.map((sc, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => loadScene(sc.name)} style={miniBtn()}>📂 {sc.name} <span style={{ opacity: 0.6 }}>· {sc.pieces.length}件</span></button>
              <button onClick={() => deleteScene(sc.name)} style={miniDelBtn()}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* 快捷键提示 */}
      <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 10, lineHeight: 1.7, opacity: 0.45 }}>
        <div style={{ opacity: 0.8, marginBottom: 4, letterSpacing: 2 }}>⌨ 快捷键</div>
        <div>← → ↑ ↓   移动形状</div>
        <div>↑ Shift+     调整高度</div>
        <div>R 旋转 · D 复制 · Del 删除</div>
        <div>+ / -   放大 / 缩小</div>
        <div style={{ marginTop: 6 }}>🖱 右键旋转 · 滚轮缩放 · 中键平移</div>
      </div>
    </div>
  )
}

// ============ 样式 helpers ============
function activeBtn(from = '#ffb3d9', to = '#b0a8e8'): React.CSSProperties {
  return {
    flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 600,
    background: `linear-gradient(135deg,${from},${to})`, color: '#1a1030',
    border: 'none', cursor: 'pointer', letterSpacing: 2,
    boxShadow: '0 2px 10px rgba(255,179,217,0.3)',
  }
}
function inactiveBtn(): React.CSSProperties {
  return {
    flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 12,
    background: 'rgba(255,255,255,0.04)', color: '#b0a0c0',
    border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', letterSpacing: 2,
  }
}
function tabActive(): React.CSSProperties {
  return {
    padding: '5px 12px', borderRadius: 99, fontSize: 11, cursor: 'pointer',
    background: 'rgba(255,179,217,0.25)', color: '#ffd6ea', border: '1px solid rgba(255,179,217,0.5)', letterSpacing: 2,
  }
}
function tabInactive(): React.CSSProperties {
  return {
    padding: '5px 12px', borderRadius: 99, fontSize: 11, cursor: 'pointer',
    background: 'rgba(255,255,255,0.04)', color: '#a898c0', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: 2,
  }
}
function shapeBtnActive(): React.CSSProperties {
  return {
    background: 'rgba(255,179,217,0.18)', border: '1.5px solid rgba(255,179,217,0.55)', color: '#ffd6ea',
    padding: '8px 4px', borderRadius: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
    transition: 'all 0.2s',
  }
}
function shapeBtnInactive(): React.CSSProperties {
  return { ...shapeBtnActive(), background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#a898c0' }
}
function opBtn(): React.CSSProperties {
  return {
    padding: '6px 10px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
    background: 'rgba(255,255,255,0.05)', color: '#e0c8e8', border: '1px solid rgba(255,255,255,0.1)',
    letterSpacing: 1,
  }
}
function disabledOpBtn(): React.CSSProperties {
  return { ...opBtn(), opacity: 0.35, cursor: 'not-allowed' }
}
function delBtn(): React.CSSProperties {
  return {
    padding: '6px 10px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
    background: 'rgba(255,90,90,0.15)', color: '#ffb0b0', border: '1px solid rgba(255,90,90,0.25)',
    letterSpacing: 1,
  }
}
function miniBtn(): React.CSSProperties {
  return {
    flex: 1, textAlign: 'left', padding: '6px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
    background: 'rgba(255,255,255,0.03)', color: '#e0c8e8', border: '1px solid rgba(255,255,255,0.05)',
  }
}
function miniDelBtn(): React.CSSProperties {
  return {
    padding: '4px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
    background: 'transparent', color: '#a87878', border: '1px solid rgba(255,90,90,0.15)',
  }
}
