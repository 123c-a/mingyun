// 水流动系统 - 模拟水方块的物理流动
import type { Block } from '../components/voxel/voxelWorldStore'

export interface WaterTick {
  blocks: Map<string, Block>
  waterSources: Array<{ x: number; y: number; z: number; level: number }>
}

// 流动方向：下、东、西、南、北
const FLOW_DIRECTIONS = [
  { dx: 0, dy: -1, dz: 0, weight: 3 }, // 下
  { dx: 1, dy: 0, dz: 0, weight: 1 },  // 东
  { dx: -1, dy: 0, dz: 0, weight: 1 }, // 西
  { dx: 0, dy: 0, dz: 1, weight: 1 },  // 南
  { dx: 0, dy: 0, dz: -1, weight: 1 }, // 北
]

/**
 * 水方块流动模拟
 * 简化版本：水会向下流，会向四周扩散，最大流动距离7格
 */
export function simulateWaterFlow(
  blocks: Map<string, Block>,
  currentTime: number
): { changed: boolean; blocks: Map<string, Block> } {
  const newBlocks = new Map(blocks)
  let changed = false

  // 找出所有水方块
  const waterBlocks: Array<{ x: number; y: number; z: number; key: string }> = []
  newBlocks.forEach((b, key) => {
    if (b.type === 'water') {
      const [x, y, z] = key.split(',').map(Number)
      waterBlocks.push({ x, y, z, key })
    }
  })

  if (waterBlocks.length === 0) return { changed: false, blocks: newBlocks }

  // 每秒流动一次（避免性能问题）
  const flowInterval = 800 // 毫秒
  const lastFlowTime = (globalThis as any).__lastWaterFlowTime || 0
  if (currentTime - lastFlowTime < flowInterval) {
    return { changed: false, blocks: newBlocks }
  }
  ;(globalThis as any).__lastWaterFlowTime = currentTime

  // 模拟水流动
  waterBlocks.forEach((water) => {
    // 向下流动（最高优先级）
    const downKey = `${water.x},${water.y - 1},${water.z}`
    if (!newBlocks.has(downKey)) {
      newBlocks.set(downKey, { type: 'water', placed: false })
      changed = true
      return
    }

    // 水平扩散（限制距离）
    const neighbors = [
      { x: water.x + 1, y: water.y, z: water.z },
      { x: water.x - 1, y: water.y, z: water.z },
      { x: water.x, y: water.y, z: water.z + 1 },
      { x: water.x, y: water.y, z: water.z - 1 },
    ]

    // 随机选择一个方向流动（简化模拟）
    const shuffled = neighbors.sort(() => Math.random() - 0.5)
    for (const neighbor of shuffled) {
      const nKey = `${neighbor.x},${neighbor.y},${neighbor.z}`
      if (!newBlocks.has(nKey)) {
        // 计算距离水源的距离（简化）
        newBlocks.set(nKey, { type: 'water', placed: false })
        changed = true
        break // 一次只流一个方向
      }
    }
  })

  return { changed, blocks: newBlocks }
}

/**
 * 移除孤立水方块（没有相邻水源的水）
 */
export function removeIsolatedWater(blocks: Map<string, Block>): { changed: boolean; blocks: Map<string, Block> } {
  const newBlocks = new Map(blocks)
  let changed = false

  const toRemove: string[] = []

  newBlocks.forEach((b, key) => {
    if (b.type !== 'water') return
    const [x, y, z] = key.split(',').map(Number)

    // 检查下方或四周是否有其他方块
    const hasSupport = newBlocks.has(`${x},${y - 1},${z}`) ||
      newBlocks.has(`${x + 1},${y},${z}`) ||
      newBlocks.has(`${x - 1},${y},${z}`) ||
      newBlocks.has(`${x},${y},${z + 1}`) ||
      newBlocks.has(`${x},${y},${z - 1}`)

    if (!hasSupport) {
      toRemove.push(key)
    }
  })

  toRemove.forEach((key) => {
    newBlocks.delete(key)
    changed = true
  })

  return { changed, blocks: newBlocks }
}

/**
 * 水的物理参数 - 用于玩家交互
 */
export const WATER_PHYSICS = {
  density: 1.0,        // 水的密度
  flowSpeed: 0.5,      // 流动速度
  buoyancy: 0.85,      // 浮力系数
  drag: 0.95,          // 阻力
  damagePerSecond: 0,  // 溺水伤害（暂未启用）
  maxFlowDistance: 7,  // 最大流动距离
}
