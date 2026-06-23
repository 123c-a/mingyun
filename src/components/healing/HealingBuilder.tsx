import { HealingPanel } from './HealingPanel'
import { HealingPropertyPanel } from './HealingPropertyPanel'
import { HealingScene } from './HealingScene'

export function HealingBuilder() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <HealingPanel />
      <div style={{ flex: 1, position: 'relative' }}>
        <HealingScene />
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20, 16, 30, 0.85)',
            color: '#e0c8f0',
            padding: '8px 18px',
            borderRadius: 12,
            fontSize: 13,
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,179,217,0.15)',
            zIndex: 20,
            whiteSpace: 'nowrap',
          }}
        >
          🌸 释怀空间 · 选择形状后点击场景创造 · 拖拽调整
        </div>
      </div>
      <HealingPropertyPanel />
    </div>
  )
}
