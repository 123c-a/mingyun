import { create } from 'zustand'

// ========== 形状类型 ==========
export type PieceType =
  | 'cube'
  | 'slab'
  | 'pillar'
  | 'sphere'
  | 'cloud'
  | 'star'
  | 'heart'
  | 'petal'
  | 'crystal'
  | 'feather'
  | 'shell'
  | 'mountain'
  | 'tree'
  | 'rainbow'
  | 'grass'
  | 'flower'
  | 'moon'
  | 'tower'
  | 'bridge'
  | 'river'
  | 'text-label'

export interface Piece {
  id: string
  type: PieceType
  position: [number, number, number]
  rotationY: number
  scale: number
  color: string
  opacity: number
  metalness: number
  material: 'standard' | 'glow' | 'mat'
  label?: string
}

type Mode = 'place' | 'select'

interface ShapeStore {
  pieces: Piece[]
  selectedId: string | null
  activeType: PieceType
  activeColor: string
  activeOpacity: number
  activeMetalness: number
  activeMaterial: 'standard' | 'glow' | 'mat'
  activeLabel: string
  mode: Mode
  hoverPos: [number, number, number] | null
  savedScenes: { name: string; pieces: Piece[]; createdAt: number }[]

  setHoverPos: (p: [number, number, number] | null) => void
  setMode: (m: Mode) => void
  setActiveType: (t: PieceType) => void
  setActiveColor: (c: string) => void
  setActiveOpacity: (o: number) => void
  setActiveMetalness: (n: number) => void
  setActiveMaterial: (m: 'standard' | 'glow' | 'mat') => void
  setActiveLabel: (s: string) => void
  addPiece: (pos: [number, number, number]) => void
  addPieceAt: (p: Partial<Piece> & { position: [number, number, number]; type: PieceType }) => void
  addPiecesBatch: (items: (Partial<Piece> & { position: [number, number, number]; type: PieceType })[]) => void
  updatePiece: (id: string, updates: Partial<Piece>) => void
  movePiece: (id: string, pos: [number, number, number]) => void
  removePiece: (id: string) => void
  selectPiece: (id: string | null) => void
  rotateSelected: () => void
  scaleSelected: (delta: number) => void
  moveSelected: (dx: number, dz: number) => void
  moveSelectedY: (dy: number) => void
  clearAll: () => void
  duplicateSelected: () => void
  saveScene: (name: string) => void
  deleteScene: (name: string) => void
  loadScene: (name: string) => void
}

export const PIECE_COLORS = [
  '#f8b4c4', '#ffd6e0', '#c9e4de', '#b8d4e3', '#fff3cd',
  '#e8d5f5', '#ffe4c4', '#d4f1f9', '#f9e4d4', '#e4f0d4',
  '#f5e6fa', '#fffaf0', '#d0e8f0', '#f0e6d8', '#c8e6c9',
  '#fff9c4', '#b8b8d8', '#a0c4d8', '#d4d4e8', '#f2f2f2',
]

export interface PieceSize { w: number; h: number; d: number }

export function getPieceSize(type: PieceType, scale: number): PieceSize {
  const base = getPieceBaseSize(type)
  return { w: base.w * scale, h: base.h * scale, d: base.d * scale }
}

function getPieceBaseSize(type: PieceType): PieceSize {
  switch (type) {
    case 'cube':        return { w: 2,   h: 2,   d: 2 }
    case 'slab':        return { w: 2.5, h: 0.6, d: 2.5 }
    case 'pillar':      return { w: 1,   h: 3,   d: 1 }
    case 'sphere':      return { w: 2,   h: 2,   d: 2 }
    case 'cloud':       return { w: 3.2, h: 1.8, d: 2 }
    case 'star':        return { w: 2.2, h: 0.6, d: 2.2 }
    case 'heart':       return { w: 2.2, h: 2.2, d: 0.8 }
    case 'petal':       return { w: 2,   h: 0.4, d: 2 }
    case 'crystal':     return { w: 1.5, h: 2.8, d: 1.5 }
    case 'feather':     return { w: 2,   h: 0.3, d: 3 }
    case 'shell':       return { w: 2,   h: 1.2, d: 2 }
    case 'mountain':    return { w: 3.5, h: 3,   d: 3.5 }
    case 'tree':        return { w: 2,   h: 4,   d: 2 }
    case 'rainbow':     return { w: 8,   h: 4,   d: 0.5 }
    case 'grass':       return { w: 1.5, h: 1.2, d: 1.5 }
    case 'flower':      return { w: 1.5, h: 2,   d: 1.5 }
    case 'moon':        return { w: 2,   h: 2,   d: 2 }
    case 'tower':       return { w: 1.4, h: 5,   d: 1.4 }
    case 'bridge':      return { w: 5,   h: 1.5, d: 1.5 }
    case 'river':        return { w: 6,   h: 0.3, d: 2 }
    case 'text-label':   return { w: 3,   h: 1.5, d: 0.1 }
    default:             return { w: 2,   h: 2,   d: 2 }
  }
}

function snapToGrid(v: number, grid = 1): number {
  return Math.round(v / grid) * grid
}

let _idCounter = 0
function genId(): string {
  _idCounter++
  return `s_${Date.now()}_${_idCounter}`
}

// 从 localStorage 读取/写入 pieces
const LS_KEY = 'healing-shape-store-v3'
const LS_SCENES = 'healing-shape-store-scenes-v3'
function loadLS<T>(k: string, fallback: T): T {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}
function saveLS<T>(k: string, v: T) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

export const useShapeStore = create<ShapeStore>((set, get) => ({
  pieces: loadLS<Piece[]>(LS_KEY, []),
  selectedId: null,
  activeType: 'cube',
  activeColor: PIECE_COLORS[0],
  activeOpacity: 1,
  activeMetalness: 0,
  activeMaterial: 'standard',
  activeLabel: '',
  mode: 'place',
  hoverPos: null,
  savedScenes: loadLS<{ name: string; pieces: Piece[]; createdAt: number }[]>(LS_SCENES, []),

  setHoverPos: (p) => set({ hoverPos: p }),
  setMode: (m) => set({ mode: m }),
  setActiveType: (t) => set({ activeType: t }),
  setActiveColor: (c) => set({ activeColor: c }),
  setActiveOpacity: (o) => set({ activeOpacity: o }),
  setActiveMetalness: (n) => set({ activeMetalness: n }),
  setActiveMaterial: (m) => set({ activeMaterial: m }),
  setActiveLabel: (s) => set({ activeLabel: s }),

  addPiece: (pos) => {
    const { activeType, activeColor, activeOpacity, activeMetalness, activeMaterial, activeLabel } = get()
    const newPiece: Piece = {
      id: genId(),
      type: activeType,
      position: [snapToGrid(pos[0], 1), pos[1], snapToGrid(pos[2], 1)],
      rotationY: 0,
      scale: 1,
      color: activeColor,
      opacity: activeOpacity,
      metalness: activeMetalness,
      material: activeMaterial,
      label: activeLabel,
    }
    const pieces = [...get().pieces, newPiece]
    saveLS(LS_KEY, pieces)
    set({ pieces, selectedId: newPiece.id })
  },

  addPieceAt: (partial) => {
    const base: Piece = {
      id: genId(),
      type: partial.type,
      position: [snapToGrid(partial.position[0], 1), partial.position[1], snapToGrid(partial.position[2], 1)],
      rotationY: partial.rotationY || 0,
      scale: partial.scale || 1,
      color: partial.color || PIECE_COLORS[0],
      opacity: partial.opacity ?? 1,
      metalness: partial.metalness ?? 0,
      material: partial.material || 'standard',
      label: partial.label,
    }
    const pieces = [...get().pieces, base]
    saveLS(LS_KEY, pieces)
    set({ pieces, selectedId: base.id })
  },

  addPiecesBatch: (items) => {
    const pieces = get().pieces.slice()
    let lastId = ''
    for (const it of items) {
      const p: Piece = {
        id: genId(),
        type: it.type,
        position: it.position,
        rotationY: it.rotationY || 0,
        scale: it.scale || 1,
        color: it.color || PIECE_COLORS[0],
        opacity: it.opacity ?? 1,
        metalness: it.metalness ?? 0,
        material: it.material || 'standard',
        label: it.label,
      }
      pieces.push(p)
      lastId = p.id
    }
    saveLS(LS_KEY, pieces)
    set({ pieces, selectedId: lastId })
  },

  updatePiece: (id, updates) => {
    const pieces = get().pieces.map((p) => (p.id === id ? { ...p, ...updates } : p))
    saveLS(LS_KEY, pieces)
    set({ pieces })
  },

  movePiece: (id, pos) => {
    const pieces = get().pieces.map((p) => p.id === id ? { ...p, position: [snapToGrid(pos[0], 1), pos[1], snapToGrid(pos[2], 1)] as [number, number, number] } : p)
    saveLS(LS_KEY, pieces)
    set({ pieces })
  },

  removePiece: (id) => {
    const pieces = get().pieces.filter((p) => p.id !== id)
    saveLS(LS_KEY, pieces)
    set({ pieces, selectedId: get().selectedId === id ? null : get().selectedId })
  },

  selectPiece: (id) => set({ selectedId: id }),

  rotateSelected: () => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    get().updatePiece(selectedId, { rotationY: (piece.rotationY + 45) % 360 })
  },

  scaleSelected: (delta) => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    const newScale = Math.max(0.2, Math.min(5, Number((piece.scale + delta).toFixed(2))))
    get().updatePiece(selectedId, { scale: newScale })
  },

  moveSelected: (dx, dz) => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    get().updatePiece(selectedId, { position: [piece.position[0] + dx, piece.position[1], piece.position[2] + dz] })
  },

  moveSelectedY: (dy) => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    get().updatePiece(selectedId, { position: [piece.position[0], Math.max(0, piece.position[1] + dy), piece.position[2]] })
  },

  clearAll: () => {
    saveLS(LS_KEY, [])
    set({ pieces: [], selectedId: null })
  },

  duplicateSelected: () => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    const dup: Piece = { ...piece, id: genId(), position: [piece.position[0] + 2, piece.position[1], piece.position[2]] }
    const next = [...pieces, dup]
    saveLS(LS_KEY, next)
    set({ pieces: next, selectedId: dup.id })
  },

  saveScene: (name) => {
    const { pieces, savedScenes } = get()
    const existing = savedScenes.find((sc) => sc.name === name)
    let next: typeof savedScenes
    if (existing) {
      next = savedScenes.map((sc) => (sc.name === name ? { ...sc, pieces: JSON.parse(JSON.stringify(pieces)), createdAt: Date.now() } : sc))
    } else {
      next = [...savedScenes, { name, pieces: JSON.parse(JSON.stringify(pieces)), createdAt: Date.now() }]
    }
    saveLS(LS_SCENES, next)
    set({ savedScenes: next })
  },

  deleteScene: (name) => {
    const next = get().savedScenes.filter((sc) => sc.name !== name)
    saveLS(LS_SCENES, next)
    set({ savedScenes: next })
  },

  loadScene: (name) => {
    const sc = get().savedScenes.find((x) => x.name === name)
    if (!sc) return
    const pieces: Piece[] = JSON.parse(JSON.stringify(sc.pieces)).map((p: Piece) => ({ ...p, id: genId() }))
    saveLS(LS_KEY, pieces)
    set({ pieces })
  },
}))
