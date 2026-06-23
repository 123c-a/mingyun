import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VoxelScene } from '../components/voxel/VoxelScene'
import { VoxelHotbar } from '../components/voxel/VoxelHotbar'

export default function VoxelWorldPage() {
  const navigate = useNavigate()
  const [locked, setLocked] = useState(false)

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: '#1a1a2e',
    }}>
      {/* 顶部返回栏 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'transparent', border: 'none', color: '#c8b8d0',
          cursor: 'pointer', fontSize: 13, padding: '6px 12px', borderRadius: 8,
        }}>
          ← 返回
        </button>
        <div style={{ flex: 1 }} />
        <div style={{
          fontSize: 13, color: '#ffd8ea', fontWeight: 600,
          letterSpacing: 2, textAlign: 'center',
        }}>
          🟩 像素世界 · Minecraft 风格
        </div>
        <div style={{ flex: 1 }} />
        {!locked && (
          <div style={{
            padding: '6px 14px', borderRadius: 8,
            background: 'rgba(74,140,63,0.3)', color: '#6ab84a',
            border: '1px solid rgba(74,140,63,0.5)',
            fontSize: 11, fontFamily: 'monospace',
          }}>
            点击画面进入
          </div>
        )}
      </div>

      {/* 3D 体素世界 */}
      <VoxelScene />

      {/* UI 层 */}
      <VoxelHotbar onLockChange={setLocked} />
    </div>
  )
}
