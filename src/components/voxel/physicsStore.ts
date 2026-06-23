import { create } from 'zustand'
import type { Body } from 'cannon-es'
import type { BlockType } from './voxelWorldStore'

// ============ 物理状态 ============
export interface PhysicsBodyDescriptor {
  id: string
  type: BlockType
  position: [number, number, number]
  velocity: [number, number, number]
  mass: number
  // runtime references filled by physics world:
  body?: Body
}

const DEFAULT_GRAVITY = 18
const MAX_ACTIVE = 200

interface PhysicsStore {
  pendingSpawns: PhysicsBodyDescriptor[]
  pendingRemoveIds: string[]
  activeCount: number
  throwMode: boolean
  debugMesh: boolean
  gravity: number

  // ============ actions ============
  scheduleSpawn: (d: PhysicsBodyDescriptor) => void
  consumeSpawns: () => PhysicsBodyDescriptor[]
  scheduleRemove: (id: string) => void
  consumeRemoves: () => string[]
  setActiveCount: (n: number) => void
  setThrowMode: (b: boolean) => void
  setDebugMesh: (b: boolean) => void
  setGravity: (n: number) => void
  resetGravity: () => void
  clearAll: () => void
  clearDynamic: () => void
  allDynamicIds: string[]
  setDynamicIds: (ids: string[]) => void

  // 快捷动作：按镜头朝向前方连射 N 个方块（store 只负责 queue 一批描述，不用关心摄像机）
  spawnAt: (pos: [number, number, number], vel: [number, number, number], type: BlockType, mass?: number) => void
  spawnBurst: (type: BlockType) => void
  spawnTower: (type: BlockType) => void
}

let nextId = 1
const genId = () => `dyn_${nextId++}`

export const usePhysicsStore = create<PhysicsStore>((set, get) => ({
  pendingSpawns: [],
  pendingRemoveIds: [],
  activeCount: 0,
  throwMode: true,
  debugMesh: false,
  gravity: DEFAULT_GRAVITY,
  allDynamicIds: [],

  scheduleSpawn: (d) => {
    const { activeCount, pendingSpawns } = get()
    if (activeCount + pendingSpawns.length >= MAX_ACTIVE) return
    set((s) => ({ pendingSpawns: [...s.pendingSpawns, d] }))
  },
  consumeSpawns: () => {
    const out = get().pendingSpawns
    set({ pendingSpawns: [] })
    return out
  },
  scheduleRemove: (id) => set((s) => ({ pendingRemoveIds: [...s.pendingRemoveIds, id] })),
  consumeRemoves: () => {
    const out = get().pendingRemoveIds
    set({ pendingRemoveIds: [] })
    return out
  },
  setActiveCount: (n) => set({ activeCount: n }),
  setThrowMode: (b) => set({ throwMode: b }),
  setDebugMesh: (b) => set({ debugMesh: b }),
  setGravity: (n) => set({ gravity: n }),
  resetGravity: () => set({ gravity: DEFAULT_GRAVITY }),
  clearAll: () => set((s) => ({ pendingRemoveIds: [...s.pendingRemoveIds, ...s.allDynamicIds] })),
  clearDynamic: () => {
    const all = get().allDynamicIds
    if (all.length) set((s) => ({ pendingRemoveIds: [...s.pendingRemoveIds, ...all] }))
  },
  setDynamicIds: (ids) => set({ allDynamicIds: ids }),

  spawnAt: (pos, vel, type, mass = 1) => {
    const { activeCount, pendingSpawns } = get()
    if (activeCount + pendingSpawns.length >= MAX_ACTIVE) return
    usePhysicsStore.getState().scheduleSpawn({
      id: genId(),
      type,
      position: pos,
      velocity: vel,
      mass,
    })
  },

  // 在随机偏向下连射 N 个方块（例如从屏幕中心往镜头方向）
  // 为了让行为在纯 store 中可触发，这里改用"在原点向上方偏出的随机位置上发"，由渲染循环决定摄像机位置
  spawnBurst: (type) => {
    for (let i = 0; i < 10; i++) {
      const dx = (Math.random() - 0.5) * 4
      const dy = 1 + Math.random() * 2
      const dz = (Math.random() - 0.5) * 4
      const vx = dx * 3 + (Math.random() - 0.5) * 4
      const vy = 4 + Math.random() * 6
      const vz = dz * 3 + (Math.random() - 0.5) * 4
      usePhysicsStore.getState().spawnAt(
        [dx, dy, dz],
        [vx, vy, vz],
        type,
        0.6 + Math.random() * 1.2,
      )
    }
  },

  // 在原点前方垂直方向放 10 个方块（形成柱）
  spawnTower: (type) => {
    for (let i = 0; i < 10; i++) {
      usePhysicsStore.getState().spawnAt(
        [(i % 2 === 0 ? 0 : 0.8), i * 1.2 + 2, 0],
        [0, 0, 0],
        type,
        1,
      )
    }
  },
}))
