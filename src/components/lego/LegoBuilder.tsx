import { LegoPanel } from './LegoPanel'
import { LegoPropertyPanel } from './LegoPropertyPanel'
import { LegoScene } from './LegoScene'

export function LegoBuilder() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LegoPanel />
      <div style={{ flex: 1, position: 'relative' }}>
        <LegoScene />
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20, 22, 34, 0.85)',
            color: '#e5e7eb',
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: 13,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            zIndex: 20,
          }}
        >
          🧱 乐高式搭建 · 左键放置 / 选中 / 拖拽 · 右键旋转视角
        </div>
      </div>
      <LegoPropertyPanel />
    </div>
  )
}
