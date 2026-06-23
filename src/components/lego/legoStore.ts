import { create } from 'zustand'

export type PieceType =
  | 'brick-1x1' | 'brick-2x2' | 'brick-2x4'
  | 'plate-2x2' | 'plate-2x4'
  | 'cylinder' | 'sphere' | 'cone'
  | 'roof'

export interface Piece {
  id: string
  type: PieceType
  position: [number, number, number]
  rotationY: number
  scale: number
  color: string
}

type Mode = 'place' | 'select'

interface LegoStore {
  pieces: Piece[]
  selectedId: string | null
  activeType: PieceType
  activeColor: string
  mode: Mode
  hoverPos: [number, number, number] | null

  setHoverPos: (p: [number, number, number] | null) => void
  setMode: (m: Mode) => void
  setActiveType: (t: PieceType) => void
  setActiveColor: (c: string) => void
  addPiece: (pos: [number, number, number]) => void
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
}

export const PIECE_COLORS = [
  '#ff3b3b', '#ff9500', '#ffcc00', '#34c759',
  '#00c7be', '#007aff', '#5856d6', '#af52de',
  '#ff2d55', '#e5e5ea', '#8e8e93', '#3a3a3c'
]

const defaultType = (t: PieceType): { w: number; h: number; d: number } => {
  switch (t) {
    case 'brick-1x1': return { w: 1, h: 1.2, d: 1 }
    case 'brick-2x2': return { w: 2, h: 1.2, d: 2 }
    case 'brick-2x4': return { w: 4, h: 1.2, d: 2 }
    case 'plate-2x2': return { w: 2, h: 0.4, d: 2 }
    case 'plate-2x4': return { w: 4, h: 0.4, d: 2 }
    case 'cylinder': return { w: 1.2, h: 1.2, d: 1.2 }
    case 'sphere': return { w: 1.5, h: 1.5, d: 1.5 }
    case 'cone': return { w: 1.5, h: 2, d: 1.5 }
    case 'roof': return { w: 4, h: 1.5, d: 2 }
    default: return { w: 2, h: 1.2, d: 2 }
  }
}

export function getPieceSize(type: PieceType, scale: number): { w: number; h: number; d: number } {
  const base = defaultType(type)
  return { w: base.w * scale, h: base.h * scale, d: base.d * scale }
}

function snapToGrid(v: number, grid = 1): number {
  return Math.round(v / grid) * grid
}

let _idCounter = 0
function genId(): string {
  _idCounter++
  return `p_${Date.now()}_${_idCounter}`
}

export const useLegoStore = create<LegoStore>((set, get) => ({
  pieces: [],
  selectedId: null,
  activeType: 'brick-2x2',
  activeColor: PIECE_COLORS[5],
  mode: 'place',
  hoverPos: null,

  setHoverPos: (p) => set({ hoverPos: p }),
  setMode: (m) => set({ mode: m }),
  setActiveType: (t) => set({ activeType: t }),
  setActiveColor: (c) => set({ activeColor: c }),

  addPiece: (pos) => {
    const { activeType, activeColor, pieces } = get()
    const size = getPieceSize(activeType, 1)
    const snapped: [number, number, number] = [
      snapToGrid(pos[0], 1),
      pos[1], // y: preserve stacking height
      snapToGrid(pos[2], 1),
    ]
    const newPiece: Piece = {
      id: genId(),
      type: activeType,
      position: snapped,
      rotationY: 0,
      scale: 1,
      color: activeColor,
    }
    set({ pieces: [...pieces, newPiece], selectedId: newPiece.id })
  },

  updatePiece: (id, updates) =>
    set((state) => ({
      pieces: state.pieces.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  movePiece: (id, pos) =>
    set((state) => ({
      pieces: state.pieces.map((p) =>
        p.id === id ? { ...p, position: [snapToGrid(pos[0], 1), pos[1], snapToGrid(pos[2], 1)] } : p
      ),
    })),

  removePiece: (id) =>
    set((state) => ({
      pieces: state.pieces.filter((p) => p.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  selectPiece: (id) => set({ selectedId: id }),

  rotateSelected: () => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    const newRot = (piece.rotationY + 90) % 360
    get().updatePiece(selectedId, { rotationY: newRot })
  },

  scaleSelected: (delta) => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    const newScale = Math.max(0.3, Math.min(3, Number((piece.scale + delta).toFixed(1))))
    get().updatePiece(selectedId, { scale: newScale })
  },

  moveSelected: (dx, dz) => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    const newPos: [number, number, number] = [
      piece.position[0] + dx,
      piece.position[1],
      piece.position[2] + dz,
    ]
    get().updatePiece(selectedId, { position: newPos })
  },

  moveSelectedY: (dy) => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    get().updatePiece(selectedId, {
      position: [piece.position[0], Math.max(0, piece.position[1] + dy), piece.position[2]],
    })
  },

  clearAll: () => set({ pieces: [], selectedId: null }),

  duplicateSelected: () => {
    const { selectedId, pieces } = get()
    if (!selectedId) return
    const piece = pieces.find((p) => p.id === selectedId)
    if (!piece) return
    const dup: Piece = {
      ...piece,
      id: genId(),
      position: [piece.position[0], piece.position[1], piece.position[2]],
    }
    // shift slightly so user sees the duplicate
    dup.position[0] += 2
    set({ pieces: [...pieces, dup], selectedId: dup.id })
  },
}))
