// 水物理调试面板 - 实时调节水流参数
import { useState, useEffect } from 'react'
import { WATER_PHYSICS } from '../../lib/waterPhysics'

interface WaterPhysicsParams {
  density: number
  flowSpeed: number
  buoyancy: number
  drag: number
  damagePerSecond: number
  maxFlowDistance: number
}

export function WaterPhysicsDebugPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [params, setParams] = useState<WaterPhysicsParams>({
    density: WATER_PHYSICS.density,
    flowSpeed: WATER_PHYSICS.flowSpeed,
    buoyancy: WATER_PHYSICS.buoyancy,
    drag: WATER_PHYSICS.drag,
    damagePerSecond: WATER_PHYSICS.damagePerSecond,
    maxFlowDistance: WATER_PHYSICS.maxFlowDistance,
  })
  const [isEnabled, setIsEnabled] = useState(true)
  const [flowInterval, setFlowInterval] = useState(800)

  // 更新全局水物理参数
  useEffect(() => {
    (globalThis as any).__WATER_PHYSICS = {
      ...WATER_PHYSICS,
      ...params,
      flowInterval,
      enabled: isEnabled,
    }
  }, [params, isEnabled, flowInterval])

  const updateParam = (key: keyof WaterPhysicsParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div style={{
      position: 'absolute',
      top: isCollapsed ? 16 : 16,
      right: isCollapsed ? 16 : 350,
      zIndex: 100,
      width: isCollapsed ? 50 : 280,
      maxHeight: '70vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'rgba(10, 20, 40, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: 16,
      padding: isCollapsed ? 10 : 16,
      border: '1px solid rgba(68, 136, 204, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease',
    }}>
      {/* 折叠/展开按钮 */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          right: isCollapsed ? 'auto' : -8,
          top: isCollapsed ? 'auto' : 8,
          left: isCollapsed ? 'auto' : -8,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'rgba(68, 136, 204, 0.2)',
          border: '1px solid rgba(68, 136, 204, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 14,
          color: '#88c8ff',
          transition: 'all 0.2s',
          zIndex: 10,
        }}
        title={isCollapsed ? '展开水物理调试' : '折叠'}
      >
        {isCollapsed ? '💧' : '✕'}
      </div>

      {isCollapsed ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 30,
          fontSize: 22,
        }}>
          💧
        </div>
      ) : (
        <>
          <h3 style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#88c8ff',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textShadow: '0 0 10px rgba(68, 136, 204, 0.5)'
          }}>
            <span>💧</span> 水物理调试
          </h3>

          {/* 启用开关 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            padding: '8px 10px',
            background: 'rgba(68, 136, 204, 0.1)',
            borderRadius: 8,
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              width: '100%',
            }}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: 12, color: '#88c8ff' }}>
                启用水流模拟
              </span>
            </label>
          </div>

          {/* 流动间隔 */}
          <ParamSlider
            label="流动间隔"
            value={flowInterval}
            min={100}
            max={2000}
            step={100}
            unit="ms"
            onChange={setFlowInterval}
            disabled={!isEnabled}
          />

          {/* 流动速度 */}
          <ParamSlider
            label="流动速度"
            value={params.flowSpeed}
            min={0}
            max={2}
            step={0.1}
            unit="x"
            onChange={(v) => updateParam('flowSpeed', v)}
            disabled={!isEnabled}
          />

          {/* 密度 */}
          <ParamSlider
            label="水密度"
            value={params.density}
            min={0.1}
            max={2}
            step={0.1}
            unit=""
            onChange={(v) => updateParam('density', v)}
            disabled={!isEnabled}
          />

          {/* 浮力 */}
          <ParamSlider
            label="浮力系数"
            value={params.buoyancy}
            min={0}
            max={1.5}
            step={0.05}
            unit=""
            onChange={(v) => updateParam('buoyancy', v)}
            disabled={!isEnabled}
          />

          {/* 阻力 */}
          <ParamSlider
            label="水流阻力"
            value={params.drag}
            min={0.5}
            max={1}
            step={0.05}
            unit=""
            onChange={(v) => updateParam('drag', v)}
            disabled={!isEnabled}
          />

          {/* 最大流动距离 */}
          <ParamSlider
            label="最大流动距离"
            value={params.maxFlowDistance}
            min={1}
            max={15}
            step={1}
            unit="格"
            onChange={(v) => updateParam('maxFlowDistance', v)}
            disabled={!isEnabled}
          />

          {/* 当前参数显示 */}
          <div style={{
            marginTop: 12,
            padding: 10,
            background: 'rgba(68, 136, 204, 0.1)',
            borderRadius: 8,
            fontSize: 11,
            color: '#88c8ff',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: '#a8d8ff' }}>
              💡 参数说明
            </div>
            <div style={{ lineHeight: 1.6, color: '#7ab8e8' }}>
              <div>• 流动间隔：水流更新频率，越小流动越快</div>
              <div>• 流动速度：水流扩散的速度倍率</div>
              <div>• 水密度：影响物体在水中下沉速度</div>
              <div>• 浮力系数：物体在水中的上浮力度</div>
              <div>• 水流阻力：物体在水中移动的阻力</div>
              <div>• 最大流动距离：水可以流多远</div>
            </div>
          </div>

          {/* 重置按钮 */}
          <button
            onClick={() => setParams({
              density: 1.0,
              flowSpeed: 0.5,
              buoyancy: 0.85,
              drag: 0.95,
              damagePerSecond: 0,
              maxFlowDistance: 7,
            })}
            style={{
              width: '100%',
              marginTop: 10,
              padding: 8,
              background: 'rgba(68, 136, 204, 0.2)',
              color: '#88c8ff',
              border: '1px solid rgba(68, 136, 204, 0.4)',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🔄 重置为默认值
          </button>
        </>
      )}
    </div>
  )
}

// 滑块控件组件
interface ParamSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
  disabled?: boolean
}

function ParamSlider({ label, value, min, max, step, unit, onChange, disabled }: ParamSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div style={{
      marginBottom: 12,
      opacity: disabled ? 0.5 : 1,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      }}>
        <span style={{ fontSize: 11, color: '#88c8ff' }}>{label}</span>
        <span style={{ fontSize: 11, color: '#a8d8ff', fontWeight: 600 }}>
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            appearance: 'none',
            background: `linear-gradient(to right, #4488cc ${percentage}%, rgba(68, 136, 204, 0.2) ${percentage}%)`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
          }}
        />
      </div>
    </div>
  )
}
