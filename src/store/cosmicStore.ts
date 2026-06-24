// ============================================================
//  Cosmic Store · 九大行星共享数据层
//
//  一个统一的 Zustand Store，每个行星把自己的数据写进来
//  这样「组合实验室」就可以拿到所有数据自由编排
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ---------- 类型定义 ----------

export type PlanetId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'sun'

export interface PlanetMeta {
  id: PlanetId
  name: string
  title: string       // 思绪清 / 情之湾 / 心火炼 ...
  subtitle: string    // 一句英文副标题
  color: string       // 主题色
  bgColor: string
  description: string
  itemsCount: number  // 该行星当前有多少条数据
  updatedAt: number
}

// 水星
export interface MercuryEntry {
  id: string
  text: string
  createdAt: number
  tag?: '思绪' | '杂念' | '灵感'
}

// 金星
export interface VenusEntry {
  id: string
  kind: 'letter' | 'petal' | 'ring'
  text: string
  createdAt: number
  recipient?: string    // 写给谁
  relationName?: string  // 关系名称（年轮用）
  depth?: number       // 关系深度 1-5
}

// 地球（拼搭 + 地图标记）
export interface EarthEntry {
  id: string
  kind: 'build' | 'marker'
  sceneName?: string    // 拼搭场景名
  pieceCount?: number   // 拼搭块数
  mood?: string         // 拼搭心情
  location?: string     // 地图地点名
  country?: string      // 国家
  emotion?: string      // 标记情绪
  text?: string         // 标记内容 / 拼搭笔记
  createdAt: number
  note?: string
}

// 火星
export interface MarsEntry {
  id: string
  text: string
  emotion: string
  createdAt: number
}

// 木星
export interface JupiterEntry {
  id: string
  name: string
  story: string
  relation?: string
  createdAt: number
}

// 土星
export interface SaturnEntry {
  id: string
  year: string
  text: string
  note?: string
  createdAt: number
}

// 天王星
export interface UranusEntry {
  id: string
  text: string
  createdAt: number
  broken?: boolean
}

// 海王星
export interface NeptuneEntry {
  id: string
  text: string
  createdAt: number
  tag?: string
}

// 太阳
export interface SunEntry {
  id: string
  text: string
  refined?: string
  createdAt: number
}

// ---------- 星座类型定义 ----------
export interface Constellation {
  id: string
  name: string
  subtitle: string
  description: string
  planets: string[]
  interpretation: string  // 星座解读
  wisdom: string          // 智慧启示
}

// 星座数据
export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'triangle-1',
    name: '天枢三角',
    subtitle: '内省之座',
    description: '水星 × 金星 × 地球',
    planets: ['mercury', 'venus', 'earth'],
    interpretation: '你的内心正在经历一场温柔的整合——思维、感受、落地行动，三者正在找到彼此的节奏。',
    wisdom: '不必急于得出结论，让思绪飘一会儿，让感受流过身体，让地球承接一切。答案会在你准备好的时候自己浮现。'
  },
  {
    id: 'triangle-2',
    name: '星芒三角',
    subtitle: '行动之座',
    description: '火星 × 木星 × 土星',
    planets: ['mars', 'jupiter', 'saturn'],
    interpretation: '你正站在一个行动与责任的交汇点上——热情在燃烧，视野在扩展，时间在提醒你什么是最重要的。',
    wisdom: '把火星的火焰导向木星的方向，用土星的耐心来打磨每一步。这不是冲刺，而是一场马拉松。'
  },
  {
    id: 'cross-1',
    name: '命运十字',
    subtitle: '抉择之座',
    description: '水星 × 木星 / 金星 × 土星',
    planets: ['mercury', 'jupiter', 'venus', 'saturn'],
    interpretation: '你的生命中正在形成一个关键的结构——思维与扩张的对话，温柔与时间的舞蹈。这两条线索正在编织你的下一步。',
    wisdom: '倾听思维在说什么，观察扩张指向何方，感受温柔允许什么存在，注意时间在提醒什么。答案不在任何一个行星里，而是在它们的对话中。'
  },
  {
    id: 'outer-triangle',
    name: '远域三角',
    subtitle: '蜕变之座',
    description: '天王星 × 海王星 × 冥王星',
    planets: ['uranus', 'neptune', 'pluto'],
    interpretation: '深层的转变正在发生——困住你的模式正在裂开，潜意识的信息正在浮现，最深处的内核正在重生。',
    wisdom: '这是最慢的变化，也是最深的。不要抗拒裂痕，那正是光照进来的地方。让梦境、让突破、让放下一起发生。'
  }
]

// ---------- Store ----------

interface CosmicState {
  mercury: MercuryEntry[]
  venus: VenusEntry[]
  earth: EarthEntry[]
  mars: MarsEntry[]
  jupiter: JupiterEntry[]
  saturn: SaturnEntry[]
  uranus: UranusEntry[]
  neptune: NeptuneEntry[]
  sun: SunEntry[]

  // --- 星座解锁状态 ---
  unlockedConstellations: string[]  // 已解锁的星座ID列表

  // --- 星座相关方法 ---
  unlockConstellation: (id: string) => void
  isConstellationUnlocked: (id: string) => boolean
  getUnlockedConstellations: () => Constellation[]
  getConstellationByPlanets: (planets: string[]) => Constellation | null

  // --- 添加/删除 ---
  addMercury: (e: Omit<MercuryEntry, 'id' | 'createdAt'>) => void
  addVenus: (e: Omit<VenusEntry, 'id' | 'createdAt'>) => void
  addEarth: (e: Omit<EarthEntry, 'id' | 'createdAt'>) => void
  addMars: (e: Omit<MarsEntry, 'id' | 'createdAt'>) => void
  addJupiter: (e: Omit<JupiterEntry, 'id' | 'createdAt'>) => void
  addSaturn: (e: Omit<SaturnEntry, 'id' | 'createdAt'>) => void
  addUranus: (e: Omit<UranusEntry, 'id' | 'createdAt'>) => void
  addNeptune: (e: Omit<NeptuneEntry, 'id' | 'createdAt'>) => void
  addSun: (e: Omit<SunEntry, 'id' | 'createdAt'>) => void

  removeMercury: (id: string) => void
  removeVenus: (id: string) => void
  removeEarth: (id: string) => void
  removeMars: (id: string) => void
  removeJupiter: (id: string) => void
  removeSaturn: (id: string) => void
  removeUranus: (id: string) => void
  removeNeptune: (id: string) => void
  removeSun: (id: string) => void

  // --- 查询 ---
  getMeta: (id: PlanetId) => PlanetMeta
  getAllMetas: () => PlanetMeta[]
  totalEntries: () => number
}

export const PLANET_META: Record<PlanetId, Omit<PlanetMeta, 'itemsCount' | 'updatedAt'>> = {
  mercury: { id: 'mercury', name: '水星', title: '思绪清', subtitle: 'M E R C U R Y', color: '#d8d4c8', bgColor: '#1a1a2a', description: '把脑子里盘旋的思绪放下来' },
  venus:   { id: 'venus',   name: '金星', title: '情之湾', subtitle: 'V E N U S',     color: '#ffd8c0', bgColor: '#2a1818', description: '温柔的话、未寄出的信' },
  earth:   { id: 'earth',   name: '地球', title: '释怀锚地', subtitle: 'E A R T H',   color: '#a8c8e8', bgColor: '#0a1828', description: '用几何拼搭出当下的感受' },
  mars:    { id: 'mars',    name: '火星', title: '心火炼', subtitle: 'M A R S',      color: '#ffb890', bgColor: '#2a0a08', description: '把强烈的情绪炼成火' },
  jupiter: { id: 'jupiter', name: '木星', title: '贵人图', subtitle: 'J U P I T E R', color: '#ffd8a0', bgColor: '#2a1a08', description: '那些照亮过你的人和事' },
  saturn:  { id: 'saturn',  name: '土星', title: '年轮庭', subtitle: 'S A T U R N',  color: '#f0e0c0', bgColor: '#1f1a12', description: '生命中改变你的节点' },
  uranus:  { id: 'uranus',  name: '天王星', title: '脱壳门', subtitle: 'U R A N U S', color: '#a8e0e8', bgColor: '#0c1e2a', description: '困住你的模式，让它裂开' },
  neptune: { id: 'neptune', name: '海王星', title: '梦境河', subtitle: 'N E P T U N E', color: '#90b8e8', bgColor: '#061018', description: '梦和潜意识的话语' },
  sun:     { id: 'sun',     name: '太阳', title: '核心之光', subtitle: 'S U N',      color: '#ffe8a0', bgColor: '#2a1a08', description: '你愿意相信的愿望' },
}

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export const useCosmicStore = create<CosmicState>()(
  persist(
    (set, get) => ({
      mercury: [], venus: [], earth: [], mars: [], jupiter: [], saturn: [], uranus: [], neptune: [], sun: [],

      // 星座解锁状态
      unlockedConstellations: [],

      // 星座相关方法
      unlockConstellation: (id) => set((s) => ({
        unlockedConstellations: s.unlockedConstellations.includes(id)
          ? s.unlockedConstellations
          : [...s.unlockedConstellations, id]
      })),

      isConstellationUnlocked: (id) => get().unlockedConstellations.includes(id),

      getUnlockedConstellations: () => {
        const s = get()
        return CONSTELLATIONS.filter(c => s.unlockedConstellations.includes(c.id))
      },

      getConstellationByPlanets: (planets) => {
        return CONSTELLATIONS.find(c => {
          const cPlanets = c.planets
          // 检查是否所有需要的行星都在选中的行星中
          return cPlanets.every(p => planets.includes(p))
        }) || null
      },

      addMercury: (e) => set((s) => ({ mercury: [...s.mercury, { ...e, id: nowId(), createdAt: Date.now() }] })),
      addVenus:   (e) => set((s) => ({ venus:   [...s.venus,   { ...e, id: nowId(), createdAt: Date.now() }] })),
      addEarth:   (e) => set((s) => ({ earth:   [...s.earth,   { ...e, id: nowId(), createdAt: Date.now() }] })),
      addMars:    (e) => set((s) => ({ mars:    [...s.mars,    { ...e, id: nowId(), createdAt: Date.now() }] })),
      addJupiter: (e) => set((s) => ({ jupiter: [...s.jupiter, { ...e, id: nowId(), createdAt: Date.now() }] })),
      addSaturn:  (e) => set((s) => ({ saturn:  [...s.saturn,  { ...e, id: nowId(), createdAt: Date.now() }] })),
      addUranus:  (e) => set((s) => ({ uranus:  [...s.uranus,  { ...e, id: nowId(), createdAt: Date.now() }] })),
      addNeptune: (e) => set((s) => ({ neptune: [...s.neptune, { ...e, id: nowId(), createdAt: Date.now() }] })),
      addSun:     (e) => set((s) => ({ sun:     [...s.sun,     { ...e, id: nowId(), createdAt: Date.now() }] })),

      removeMercury: (id) => set((s) => ({ mercury: s.mercury.filter((x) => x.id !== id) })),
      removeVenus:   (id) => set((s) => ({ venus: s.venus.filter((x) => x.id !== id) })),
      removeEarth:   (id) => set((s) => ({ earth: s.earth.filter((x) => x.id !== id) })),
      removeMars:    (id) => set((s) => ({ mars: s.mars.filter((x) => x.id !== id) })),
      removeJupiter: (id) => set((s) => ({ jupiter: s.jupiter.filter((x) => x.id !== id) })),
      removeSaturn:  (id) => set((s) => ({ saturn: s.saturn.filter((x) => x.id !== id) })),
      removeUranus:  (id) => set((s) => ({ uranus: s.uranus.filter((x) => x.id !== id) })),
      removeNeptune: (id) => set((s) => ({ neptune: s.neptune.filter((x) => x.id !== id) })),
      removeSun:     (id) => set((s) => ({ sun: s.sun.filter((x) => x.id !== id) })),

      getMeta: (id) => {
        const s = get()
        const base = PLANET_META[id]
        const list = s[id]
        return { ...base, itemsCount: list.length, updatedAt: list.length ? Math.max(...list.map((x) => (x as any).createdAt)) : 0 }
      },

      getAllMetas: () => {
        const s = get()
        return (Object.keys(PLANET_META) as PlanetId[]).map((id) => s.getMeta(id))
      },

      totalEntries: () => {
        const s = get()
        return s.mercury.length + s.venus.length + s.earth.length + s.mars.length
          + s.jupiter.length + s.saturn.length + s.uranus.length + s.neptune.length + s.sun.length
      },
    }),
    { name: 'cosmic-store' }
  )
)

// ---------- 工具：把整份 Store 序列化为 AI 可读文本 ----------
export function serializeForAI(planetIds: PlanetId[]): string {
  const s = useCosmicStore.getState()
  const parts: string[] = []

  if (planetIds.includes('mercury') && s.mercury.length) {
    parts.push(`【水星 · 思绪】共${s.mercury.length}条：\n` + s.mercury.map((x) => `· ${x.text}`).join('\n'))
  }
  if (planetIds.includes('venus') && s.venus.length) {
    const letters = s.venus.filter((x) => x.kind === 'letter')
    const petals = s.venus.filter((x) => x.kind === 'petal')
    const rings = s.venus.filter((x) => x.kind === 'ring')
    if (letters.length) parts.push(`【金星 · 未寄出的信】共${letters.length}封：\n` + letters.map((x) => `【致${x.recipient || '未命名'}】\n${x.text}`).join('\n\n'))
    if (petals.length) parts.push(`【金星 · 三瓣温柔】共${petals.length}句：\n` + petals.map((x) => `· ${x.text}`).join('\n'))
    if (rings.length) parts.push(`【金星 · 关系的年轮】共${rings.length}段关系：\n` + rings.map((x) => `· ${x.relationName || '某段关系'}（深度${x.depth || 3}/5）：${x.text}`).join('\n'))
  }
  if (planetIds.includes('earth') && s.earth.length) {
    const builds = s.earth.filter((x) => x.kind === 'build')
    const markers = s.earth.filter((x) => x.kind === 'marker')
    if (builds.length) parts.push(`【地球 · 治愈拼搭】共${builds.length}个场景：\n` + builds.map((x) => `· "${x.sceneName}" ${x.pieceCount || 0}件几何体 · 心情:${x.mood || '未记录'}${x.note ? ' · ' + x.note : ''}`).join('\n'))
    if (markers.length) parts.push(`【地球 · 足迹地图】共${markers.length}个标记：\n` + markers.map((x) => `· ${x.location || '某地'}（${x.country || '未知'}）[${x.emotion || '无情绪'}]：${x.text || ''}`).join('\n'))
  }
  if (planetIds.includes('mars') && s.mars.length) {
    parts.push(`【火星 · 心火炼】共${s.mars.length}条：\n` + s.mars.map((x) => `· [${x.emotion}] ${x.text}`).join('\n'))
  }
  if (planetIds.includes('jupiter') && s.jupiter.length) {
    parts.push(`【木星 · 贵人图】共${s.jupiter.length}人：\n` + s.jupiter.map((x) => `· ${x.name}${x.relation ? '（' + x.relation + '）' : ''}：${x.story}`).join('\n'))
  }
  if (planetIds.includes('saturn') && s.saturn.length) {
    parts.push(`【土星 · 年轮庭】共${s.saturn.length}个节点：\n` + s.saturn.sort((a, b) => (a.year || '').localeCompare(b.year || '')).map((x) => `· ${x.year}年：${x.text}${x.note ? '（' + x.note + '）' : ''}`).join('\n'))
  }
  if (planetIds.includes('uranus') && s.uranus.length) {
    parts.push(`【天王星 · 脱壳门】共${s.uranus.length}条：\n` + s.uranus.map((x) => `· ${x.text}`).join('\n'))
  }
  if (planetIds.includes('neptune') && s.neptune.length) {
    parts.push(`【海王星 · 梦境河】共${s.neptune.length}条：\n` + s.neptune.map((x) => `· ${x.text}`).join('\n'))
  }
  if (planetIds.includes('sun') && s.sun.length) {
    parts.push(`【太阳 · 核心之光】共${s.sun.length}个愿望：\n` + s.sun.map((x) => `· ${x.refined || x.text}`).join('\n'))
  }

  if (parts.length === 0) return ''
  return parts.join('\n\n')
}

// ---------- 桥接：从各行星页面已有 localStorage key 同步到共享 store ----------
export function syncFromPlanetPages() {
  const store = useCosmicStore.getState()
  let changed = false

  try {
    const raw = localStorage.getItem('mercury-thoughts')
    if (raw) {
      for (const t of JSON.parse(raw) as any[]) {
        if (t.text && !store.mercury.find((x) => x.text === t.text)) {
          store.addMercury({ text: t.text })
          changed = true
        }
      }
    }
  } catch {}

  try {
    const petalsRaw = localStorage.getItem('venus-petals')
    if (petalsRaw) {
      for (const p of JSON.parse(petalsRaw) as any[]) {
        const text = p.text || p.words || p.content || ''
        if (text && !store.venus.find((x) => x.text === text)) {
          store.addVenus({ kind: 'petal', text, recipient: p.theme || p.topic })
          changed = true
        }
      }
    }
    const letterRaw = localStorage.getItem('venus-letter-encrypted')
    if (letterRaw && letterRaw.length > 5) {
      if (!store.venus.find((x) => x.kind === 'letter')) {
        store.addVenus({ kind: 'letter', text: '（一封温柔的信，完整内容保存在"情之湾）', recipient: '未命名' })
        changed = true
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem('mars-emotions')
    if (raw) {
      for (const f of JSON.parse(raw) as any[]) {
        const text = f.text || f.content || f.emotion || ''
        if (text && !store.mars.find((x) => x.text === text)) {
          store.addMars({ text, emotion: f.emotion || f.tag || '混合' })
          changed = true
        }
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem('jupiter-people')
    if (raw) {
      for (const s of JSON.parse(raw) as any[]) {
        const name = s.name || s.person || ''
        const story = s.story || s.content || s.text || ''
        if (!name && !story) continue
        if (store.jupiter.find((x) => x.name === name && x.story === story)) continue
        store.addJupiter({ name: name || '某个人', story, relation: s.relation })
        changed = true
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem('saturn-rings')
    if (raw) {
      for (const r of JSON.parse(raw) as any[]) {
        const text = r.text || r.content || r.title || ''
        if (!text || store.saturn.find((x) => x.text === text)) continue
        store.addSaturn({ year: r.year || r.time || '', text, note: r.note })
        changed = true
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem('uranus-shells')
    if (raw) {
      for (const sh of JSON.parse(raw) as any[]) {
        const text = sh.text || sh.content || sh.title || ''
        if (!text || store.uranus.find((x) => x.text === text)) continue
        store.addUranus({ text, broken: !!sh.broken })
        changed = true
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem('neptune-dreams')
    if (raw) {
      for (const d of JSON.parse(raw) as any[]) {
        const text = d.text || d.content || ''
        if (!text || store.neptune.find((x) => x.text === text)) continue
        store.addNeptune({ text })
        changed = true
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem('sun-wishes')
    if (raw) {
      for (const w of JSON.parse(raw) as any[]) {
        const text = w.text || w.content || w.wish || ''
        if (!text || store.sun.find((x) => x.text === text)) continue
        store.addSun({ text, refined: w.refined })
        changed = true
      }
    }
  } catch {}

  return changed
}

// ---------- 清空：用户要求重置整个宇宙
export function resetCosmos() {
  const s = useCosmicStore.getState()
  for (const id of Object.keys(s) as PlanetId[]) {
    // only reset arrays -list of store fields
  }
  useCosmicStore.setState({ mercury: [], venus: [], earth: [], mars: [], jupiter: [], saturn: [], uranus: [], neptune: [], sun: [] })
}
