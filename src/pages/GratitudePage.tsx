import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

interface GratitudeEntry {
  id: string
  content: string
  category: string
  date: string
}

const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼', '🌿', '🍀', '🌴', '🌳', '🌲']
const categories = [
  { name: '人', icon: '👥' },
  { name: '事', icon: '✨' },
  { name: '物', icon: '🎁' },
  { name: '自己', icon: '💝' },
  { name: '自然', icon: '🌿' },
  { name: '小确幸', icon: '🍀' },
]

export default function GratitudePage() {
  const { '*': fullPath = '' } = useParams()
  const navigate = useNavigate()
  const comboId = fullPath.split('/')[0] || ''
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('人')
  const [showGarden, setShowGarden] = useState(true)

  const validPlanets = useMemo(() => comboId.split('-').filter(id => planetNames[id] || id === 'pluto'), [comboId])
  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)
  const comboInfo = useMemo(() => existingConfig ? { name: existingConfig.name } : { name: generateComboName(validPlanets, seed).name }, [validPlanets, seed, existingConfig])
  const theme = useMemo(() => existingConfig ? { primary: existingConfig.primaryColor, secondary: existingConfig.secondaryColor, glowColor: `${existingConfig.primaryColor}40`, borderColor: `${existingConfig.primaryColor}30` } : generateThemeColors(validPlanets, planetColors, seed), [validPlanets, seed, existingConfig])

  useEffect(() => {
    const saved = localStorage.getItem(`combo-gratitude-${comboId}`)
    if (saved) {
      try { setEntries(JSON.parse(saved)) } catch {}
    }
  }, [comboId])

  const saveEntries = (newEntries: GratitudeEntry[]) => {
    setEntries(newEntries)
    localStorage.setItem(`combo-gratitude-${comboId}`, JSON.stringify(newEntries))
  }

  const addEntry = () => {
    if (!content.trim()) return
    const newEntry: GratitudeEntry = {
      id: `${Date.now()}`,
      content: content.trim(),
      category,
      date: new Date().toLocaleDateString('zh-CN'),
    }
    saveEntries([newEntry, ...entries])
    setContent('')
  }

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id))
  }

  const todayCount = entries.filter(e => e.date === new Date().toLocaleDateString('zh-CN')).length

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="orbs" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">← 返回星图</button>
          <div className="text-center">
            <h1 className="text-2xl font-light" style={{ color: theme.primary }}>🌸 感恩花园</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <button onClick={() => setShowGarden(!showGarden)} className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10">
            {showGarden ? '📝 列表' : '🌸 花园'}
          </button>
        </div>

        {/* 今日统计 */}
        <div
          className="rounded-3xl p-8 mb-8 backdrop-blur-2xl text-center"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`,
            border: `2px solid ${theme.borderColor}`,
            boxShadow: `0 0 60px ${theme.glowColor}`,
          }}
        >
          <p className="text-sm opacity-60 mb-2">今日已种下</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-5xl">{flowers[entries.length % flowers.length]}</span>
            <span className="text-5xl font-light">{todayCount}</span>
            <span className="text-lg opacity-60">朵花</span>
          </div>
          <p className="text-sm opacity-60">总共 {entries.length} 朵感恩花</p>
        </div>

        {/* 输入区 */}
        <div className="rounded-2xl p-6 mb-8 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}>
          <div className="flex gap-2 mb-4 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  category === cat.name ? 'scale-105' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  background: category === cat.name ? `${theme.primary}30` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${category === cat.name ? theme.primary : 'transparent'}`,
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addEntry()}
              placeholder="今天，有什么让你心存感激的？"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-base focus:outline-none focus:border-white/20"
            />
            <button
              onClick={addEntry}
              disabled={!content.trim()}
              className="px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)` }}
            >
              🌱 种下
            </button>
          </div>
        </div>

        {showGarden ? (
          /* 花园视图 */
          <div className="rounded-2xl p-8 backdrop-blur-xl min-h-[400px]" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${theme.borderColor}` }}>
            {entries.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <div className="text-6xl mb-4">🌱</div>
                <p>花园还是空的</p>
                <p className="text-sm mt-2">种下第一朵感恩花吧</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {entries.map((entry, i) => (
                  <div
                    key={entry.id}
                    className="group relative"
                    style={{
                      animation: `float ${3 + (i % 5)}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    <div className="text-5xl cursor-pointer hover:scale-125 transition-transform">
                      {flowers[i % flowers.length]}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" style={{ background: 'rgba(0,0,0,0.8)', border: `1px solid ${theme.borderColor}` }}>
                      <p className="text-xs opacity-60 mb-1">{entry.date} · {entry.category}</p>
                      <p className="text-sm">{entry.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 列表视图 */
          <div className="space-y-3">
            {entries.length === 0 ? (
              <div className="text-center py-16 opacity-50">
                <div className="text-6xl mb-4">🌸</div>
                <p>还没有记录</p>
              </div>
            ) : (
              entries.map(entry => (
                <div
                  key={entry.id}
                  className="rounded-xl p-4 backdrop-blur-xl group flex items-start justify-between"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{flowers[Math.abs(parseInt(entry.id)) % flowers.length]}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${theme.primary}30`, color: theme.primary }}>
                          {categories.find(c => c.name === entry.category)?.icon}{entry.category}
                        </span>
                        <span className="text-xs opacity-50">{entry.date}</span>
                      </div>
                      <p className="text-sm">{entry.content}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs transition-opacity"
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
