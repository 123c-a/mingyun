import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors } from '../lib/comboGenerator'

const moodOptions = [
  { name: '喜悦', color: '#FFD700', emoji: '😊' },
  { name: '平静', color: '#87CEEB', emoji: '😌' },
  { name: '热情', color: '#FF6B6B', emoji: '🔥' },
  { name: '忧伤', color: '#6B8DD6', emoji: '😢' },
  { name: '感恩', color: '#22c55e', emoji: '🙏' },
  { name: '困惑', color: '#a855f7', emoji: '🤔' },
]

export default function JournalPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [entries, setEntries] = useState<Array<{ id: string; text: string; date: string; mood?: string; time: string }>>([])
  const [currentEntry, setCurrentEntry] = useState('')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const validPlanets = useMemo(() => {
    return comboPath.split('-').filter(id => planetNames[id] || id === 'pluto')
  }, [comboPath])

  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)

  const comboInfo = useMemo(() => {
    if (existingConfig) return { name: existingConfig.name }
    const { name } = generateComboName(validPlanets, seed)
    return { name }
  }, [validPlanets, seed, existingConfig])

  const theme = useMemo(() => {
    if (existingConfig) {
      return {
        primary: existingConfig.primaryColor,
        secondary: existingConfig.secondaryColor,
        glowColor: `${existingConfig.primaryColor}40`,
        borderColor: `${existingConfig.primaryColor}30`,
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  useEffect(() => {
    const saved = localStorage.getItem(`combo-journal-${comboPath}`)
    if (saved) {
      try {
        setEntries(JSON.parse(saved))
      } catch {}
    }
  }, [comboPath])

  const saveEntry = () => {
    if (!currentEntry.trim()) return
    const now = new Date()
    const newEntry = {
      id: `${Date.now()}`,
      text: currentEntry.trim(),
      date: now.toLocaleDateString('zh-CN'),
      time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood || undefined,
    }
    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem(`combo-journal-${comboPath}`, JSON.stringify(updated))
    setCurrentEntry('')
    setSelectedMood(null)
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem(`combo-journal-${comboPath}`, JSON.stringify(updated))
  }

  const selectedMoodData = moodOptions.find(m => m.name === selectedMood)

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor={theme.primary} secondaryColor={theme.secondary} />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            ← 返回
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-wider" style={{ color: theme.primary }}>📖 灵魂日记</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            {showHistory ? '✏️ 写日记' : `📚 ${entries.length}篇`}
          </button>
        </div>

        {!showHistory ? (
          <>
            {/* 心情选择 */}
            <div className="mb-8">
              <p className="text-sm opacity-60 mb-4 text-center">今天的心情</p>
              <div className="flex justify-center gap-3">
                {moodOptions.map(mood => (
                  <button
                    key={mood.name}
                    onClick={() => setSelectedMood(selectedMood === mood.name ? null : mood.name)}
                    className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-110"
                    style={{
                      background: selectedMood === mood.name ? mood.color : `${mood.color}30`,
                      boxShadow: selectedMood === mood.name ? `0 0 30px ${mood.color}60` : 'none',
                    }}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                  </button>
                ))}
              </div>
              {selectedMoodData && (
                <p className="text-center mt-4 text-sm" style={{ color: selectedMoodData.color }}>
                  {selectedMoodData.name}
                </p>
              )}
            </div>

            {/* 日记输入 */}
            <div
              className="rounded-3xl p-8 backdrop-blur-2xl mb-8"
              style={{
                background: selectedMoodData
                  ? `linear-gradient(135deg, ${selectedMoodData.color}10, ${theme.primary}05)`
                  : `linear-gradient(135deg, ${theme.primary}10, ${theme.secondary}05)`,
                border: `2px solid ${selectedMoodData ? selectedMoodData.color + '40' : theme.borderColor}`,
                boxShadow: `0 0 60px ${selectedMoodData ? selectedMoodData.color + '20' : theme.glowColor}`,
              }}
            >
              <textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="今天发生了什么？你的内心有什么感受？"
                className="w-full h-48 bg-transparent resize-none text-lg leading-relaxed placeholder-white/30 focus:outline-none"
              />
            </div>

            {/* 保存按钮 */}
            <div className="text-center">
              <button
                onClick={saveEntry}
                disabled={!currentEntry.trim()}
                className="px-12 py-4 rounded-full text-lg font-medium backdrop-blur-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: selectedMoodData
                    ? `linear-gradient(135deg, ${selectedMoodData.color}cc, ${selectedMoodData.color}80)`
                    : `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`,
                }}
              >
                ✨ 写入灵魂
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 历史记录 */}
            <div className="space-y-6">
              {entries.length === 0 ? (
                <div className="text-center py-16 opacity-50">
                  <div className="text-6xl mb-4">📝</div>
                  <p>还没有日记</p>
                  <p className="text-sm mt-2">开始记录你的灵魂之旅吧</p>
                </div>
              ) : (
                entries.map(entry => {
                  const mood = entry.mood ? moodOptions.find(m => m.name === entry.mood) : null
                  return (
                    <div
                      key={entry.id}
                      className="rounded-2xl p-6 backdrop-blur-xl relative group"
                      style={{
                        background: mood
                          ? `linear-gradient(135deg, ${mood.color}10, ${theme.primary}05)`
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${mood ? mood.color + '30' : theme.borderColor}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {mood && <span className="text-2xl">{mood.emoji}</span>}
                          <div>
                            <p className="text-sm font-medium">{entry.date}</p>
                            <p className="text-xs opacity-50">{entry.time}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-all text-sm"
                        >
                          删除
                        </button>
                      </div>
                      <p className="text-base leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
