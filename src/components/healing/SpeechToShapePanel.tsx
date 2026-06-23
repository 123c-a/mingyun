import { useState, useEffect } from 'react'
import { useShapeStore, type PieceType, type Piece, PIECE_COLORS } from './healingStore'

interface HistoryEntry {
  id: string
  prompt: string
  pieces: Piece[]
  at: number
}

const HISTORY_KEY = 'healing-speech-history-v1'

function makePieceFromRule(
  type: PieceType,
  position: [number, number, number],
  color: string,
  scale = 1,
  opts?: Partial<Piece>
): Piece {
  const store = useShapeStore.getState()
  return {
    id: Math.random().toString(36).slice(2, 10),
    type,
    position,
    rotationY: 0,
    scale,
    color,
    opacity: opts?.opacity ?? 1,
    metalness: opts?.metalness ?? 0,
    material: opts?.material ?? 'mat',
    label: opts?.label,
  }
}

// 简单规则生成 - 将关键词匹配到形状组合
function simpleCompose(text: string): Piece[] {
  const lower = text.toLowerCase()
  const result: Piece[] = []
  let z = 0
  let x = 0

  const has = (kws: string[]) => kws.some((k) => lower.includes(k))

  // 主题检测 - 逐个添加形状
  if (has(['彩虹', 'rainbow'])) {
    result.push(makePieceFromRule('rainbow', [0, 3.5, z], '#ffb3d9', 1.1))
  }
  if (has(['山', '山峰', '山', '山', 'mountain'])) {
    result.push(makePieceFromRule('mountain', [-4, 0, 0], '#8a7cb0', 1.2))
    result.push(makePieceFromRule('mountain', [4, 0, 0], '#b0a8e8', 1))
  }
  if (has(['房子', '小屋', '家', 'house', 'home'])) {
    result.push(makePieceFromRule('cube', [0, 1, 0], '#ffd6ea', 2))
    result.push(makePieceFromRule('cube', [0, 3, 0], '#ffb3d9', 1.5))
    result.push(makePieceFromRule('pillar', [-1.5, 0.5, 0], '#e8c8d8', 1))
    result.push(makePieceFromRule('pillar', [1.5, 0.5, 0], '#e8c8d8', 1))
  }
  if (has(['树', 'tree', '森林', 'forest'])) {
    result.push(makePieceFromRule('tree', [-3, 0, 2], '#7cb89a', 1))
    result.push(makePieceFromRule('tree', [3, 0, -2], '#6ca88a', 1.2))
    result.push(makePieceFromRule('tree', [2, 0, 3], '#8cc8aa', 0.8))
  }
  if (has(['花', 'flower'])) {
    result.push(makePieceFromRule('flower', [-1, 0, 2], '#ffb3d9', 0.9))
    result.push(makePieceFromRule('flower', [1.5, 0, 2.5], '#ff99c8', 1))
    result.push(makePieceFromRule('flower', [0.5, 0, -1], '#ffccea', 0.8))
  }
  if (has(['心', '心', 'heart', '爱', 'love'])) {
    result.push(makePieceFromRule('heart', [0, 3, 0], '#ff6b9d', 1.2, { material: 'glow' }))
  }
  if (has(['星', '星', 'star', 'star'])) {
    result.push(makePieceFromRule('star', [2, 5, -1], '#fff1a8', 0.8, { material: 'glow' }))
    result.push(makePieceFromRule('star', [-3, 6, 1], '#ffdb88', 0.6, { material: 'glow' }))
    result.push(makePieceFromRule('star', [1, 7, 2], '#ffe8b5', 0.5, { material: 'glow' }))
  }
  if (has(['月亮', '月', 'moon'])) {
    result.push(makePieceFromRule('moon', [-4, 6, -3], '#fff1a8', 0.7, { material: 'glow' }))
  }
  if (has(['云', 'cloud', '云'])) {
    result.push(makePieceFromRule('cloud', [-2, 5, 0], '#e8dff5', 1))
    result.push(makePieceFromRule('cloud', [3, 6, -2], '#f0e8ff', 1.2))
  }
  if (has(['水晶', 'crystal'])) {
    result.push(makePieceFromRule('crystal', [0, 1.5, -3], '#b8d4ff', 1, { metalness: 0.4, material: 'standard' }))
  }
  if (has(['羽毛', 'feather'])) {
    result.push(makePieceFromRule('feather', [2, 2, -2], '#d8e8ff', 1))
  }
  if (has(['贝壳', 'shell'])) {
    result.push(makePieceFromRule('shell', [-2, 0.3, -2], '#ffd8c0', 1))
  }
  if (has(['草', 'grass'])) {
    for (let i = 0; i < 6; i++) {
      result.push(makePieceFromRule('grass', [(i - 3) * 1.2, 0, 4 + Math.sin(i) * 0.5], '#7cb89a', 0.6))
    }
  }
  if (has(['河', 'river', '河', '河'])) {
    result.push(makePieceFromRule('river', [0, 0.1, 0], '#6b9dd4', 1.3, { opacity: 0.75 }))
  }
  if (has(['桥', 'bridge'])) {
    result.push(makePieceFromRule('bridge', [0, 1, 3], '#d4b89a', 1.2))
  }
  if (has(['灯塔', 'tower', '塔'])) {
    result.push(makePieceFromRule('tower', [4, 0, -3], '#ffd6ea', 1.1, { material: 'glow' }))
  }

  // 如没匹配任何特殊关键词 - 按描述中字符长度随机散列
  if (result.length === 0) {
    // 默认生成 3-5 个基础形状
    const seedWords = lower.trim().split(/\s+/).filter(Boolean)
    const baseCount = Math.min(Math.max(seedWords.length, 3), 6)
    const types: PieceType[] = ['heart', 'star', 'crystal', 'petal', 'flower', 'sphere']
    for (let i = 0; i < baseCount; i++) {
      const t = types[(i + lower.length) % types.length]
      const col = PIECE_COLORS[(i * 3 + lower.charCodeAt(i % Math.max(1, lower.length - 1))) % PIECE_COLORS.length]
      const px = ((i - baseCount / 2) * 1.8)
      const py = 1 + (i % 3) * 1.2
      const pz = (i % 2 === 0 ? 1 : -1) * (i * 0.4)
      const isGlow = t === 'heart' || t === 'star' || i % 3 === 0
      result.push(makePieceFromRule(t, [px, py, pz], col, 0.8 + (i % 3) * 0.15,
        isGlow ? { material: 'glow' } : { material: 'mat' }))
    }
  }

  // 添加文字提示（如描述中包含）
  if (lower.length > 2 && lower.length < 40) {
    const shortText = text.length > 18 ? text.slice(0, 18) + '…' : text
    result.push(makePieceFromRule('text-label', [0, 0.1, -6], '#ffd6ea', 1, { label: shortText, opacity: 0.95 }))
  }

  return result
}

export function SpeechToShapePanel() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [lastPieces, setLastPieces] = useState<Piece[] | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  const quickPrompts = [
    '一座彩虹下的小房子，周围有小花和树',
    '夜晚的星空，有月亮和星星',
    '山里的小屋，有桥和河流',
    '盛开的花园，有花和草',
    '写一句给自己："我已经做得很好了"',
  ]

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const pieces = simpleCompose(prompt)
      useShapeStore.getState().addPiecesBatch(pieces)
      const entry: HistoryEntry = {
        id: Math.random().toString(36).slice(2, 10),
        prompt,
        pieces,
        at: Date.now(),
      }
      const newHist = [entry, ...history].slice(0, 10)
      setHistory(newHist)
      setLastPieces(pieces)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist))
      setPrompt('')
    } finally {
      setLoading(false)
    }
  }

  const applyHistory = (h: HistoryEntry) => {
    useShapeStore.getState().addPiecesBatch(h.pieces)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const containerStyle: React.CSSProperties = {
    padding: '18px 16px',
    color: '#f0e6f4',
    overflowY: 'auto',
    maxHeight: '100vh',
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#ffd8ea', letterSpacing: 2 }}>
          🪄 言出法随
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
          用一句话描述你想看到的场景
        </div>
      </div>

      <div style={{
        padding: 14, borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(255,179,217,0.12), rgba(176,168,232,0.12))',
        border: '1px solid rgba(255,179,217,0.25)',
        marginBottom: 14,
      }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              generate()
            }
          }}
          placeholder="例如：一座彩虹下的小房子，周围有小花和树..."
          style={{
            width: '100%',
            minHeight: 80,
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(20,16,30,0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f0e6f4',
            fontSize: 13,
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.6,
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button onClick={generate} disabled={loading || !prompt.trim()}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: loading || !prompt.trim()
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg,#ffb3d9,#b0a8e8)',
              color: loading || !prompt.trim() ? '#a898c0' : '#1a1030',
              border: 'none', cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              letterSpacing: 2,
            }}>
            {loading ? '正在生成...' : '✨ 生成场景'}
          </button>
        </div>
      </div>

      {/* 快捷提示 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8, letterSpacing: 1 }}>试试这些</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {quickPrompts.map((q, i) => (
            <button key={i} onClick={() => setPrompt(q)}
              style={{
                textAlign: 'left', padding: '8px 10px', borderRadius: 8, fontSize: 12,
                background: 'rgba(255,255,255,0.03)', color: '#d8c8e0',
                border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                transition: 'all 0.2s', lineHeight: 1.5,
              }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 上次生成结果 */}
      {lastPieces && (
        <div style={{
          marginBottom: 14, padding: 12, borderRadius: 10,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6, letterSpacing: 1 }}>
            🎨 刚刚生成了 {lastPieces.length} 个形状
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {lastPieces.slice(0, 12).map((p, i) => (
              <span key={i} style={{
                fontSize: 10, padding: '3px 7px', borderRadius: 99,
                background: `${p.color}33`, color: p.color, border: `1px solid ${p.color}55`,
              }}>{p.type}</span>
            ))}
          </div>
        </div>
      )}

      {/* 历史记录 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: 1 }}>历史记录</div>
          {history.length > 0 && (
            <button onClick={clearHistory}
              style={{
                background: 'transparent', border: 'none', color: '#a87878', fontSize: 10,
                cursor: 'pointer', opacity: 0.6,
              }}>清空</button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 200, overflowY: 'auto' }}>
          {history.length === 0 && (
            <div style={{ fontSize: 11, opacity: 0.5, textAlign: 'center', padding: 12 }}>
              还没有生成过，试试看吧
            </div>
          )}
          {history.map((h) => (
            <button key={h.id} onClick={() => applyHistory(h)}
              style={{
                textAlign: 'left', padding: '8px 10px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer', color: '#c8b8d0', fontSize: 11, lineHeight: 1.5,
              }}>
              <div style={{ opacity: 0.9, marginBottom: 3 }}>「{h.prompt}」</div>
              <div style={{ opacity: 0.55, fontSize: 10 }}>
                {new Date(h.at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} · {h.pieces.length} 件
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
