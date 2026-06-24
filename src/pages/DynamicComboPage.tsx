import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo, useRef } from 'react'
import { planetNames, planetColors, getComboConfig } from '../data/comboConfigs'
import {
  stringToSeed,
  generateComboName,
  generateDescription,
  generatePlayModules,
  generateWisdomQuotes,
  generateThemeColors,
  generatePromptCard,
  generateAffirmation,
  generateCosmicLetter,
  drawOracleCard,
  oracleCards,
  chakras,
  runes,
  drawRunes,
  castIChing,
  type PlayModule,
} from '../lib/comboGenerator'

const planetTraits: Record<string, { element: string; meaning: string; emoji: string }> = {
  mercury: { element: '风', meaning: '思维与沟通', emoji: '💧' },
  venus: { element: '金', meaning: '情感与美感', emoji: '✨' },
  earth: { element: '土', meaning: '根基与实际', emoji: '🌍' },
  mars: { element: '火', meaning: '行动与热情', emoji: '🔥' },
  jupiter: { element: '木', meaning: '扩展与幸运', emoji: '🌟' },
  saturn: { element: '土', meaning: '限制与沉淀', emoji: '⏳' },
  uranus: { element: '风', meaning: '突变与自由', emoji: '⚡' },
  neptune: { element: '水', meaning: '消融与灵性', emoji: '🌊' },
  pluto: { element: '冥', meaning: '重生与转化', emoji: '🦋' },
}

const rarityColors: Record<string, string> = {
  common: 'from-gray-400/30 to-gray-500/20 border-gray-400/30',
  rare: 'from-blue-400/30 to-purple-500/20 border-blue-400/30',
  legendary: 'from-amber-400/30 to-orange-500/20 border-amber-400/40',
}

const rarityBadge: Record<string, { text: string; color: string }> = {
  common: { text: '普通', color: 'bg-gray-500/30 text-gray-300' },
  rare: { text: '稀有', color: 'bg-blue-500/30 text-blue-300' },
  legendary: { text: '传说', color: 'bg-amber-500/30 text-amber-300' },
}

export default function DynamicComboPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()

  const validPlanets = useMemo(() => {
    return comboPath.split('-').filter(id => planetNames[id] || id === 'pluto')
  }, [comboPath])

  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])

  const existingConfig = getComboConfig(validPlanets)

  const comboInfo = useMemo(() => {
    if (existingConfig) {
      return {
        name: existingConfig.name,
        subtitle: existingConfig.subtitle,
        description: existingConfig.description,
      }
    }
    const { name, subtitle } = generateComboName(validPlanets, seed)
    const description = generateDescription(
      validPlanets,
      planetNames,
      Object.fromEntries(Object.entries(planetTraits).map(([k, v]) => [k, v.meaning])),
      seed
    )
    return { name, subtitle, description }
  }, [validPlanets, seed, existingConfig])

  const theme = useMemo(() => {
    if (existingConfig) {
      return {
        primary: existingConfig.primaryColor,
        secondary: existingConfig.secondaryColor,
        accent: existingConfig.accentText,
        bgGradient: existingConfig.bgGradient,
        glowColor: `${existingConfig.primaryColor}40`,
        cardBg: `linear-gradient(135deg, ${existingConfig.primaryColor}08 0%, ${existingConfig.secondaryColor}08 100%)`,
        borderColor: `${existingConfig.primaryColor}30`,
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  const playModules = useMemo<PlayModule[]>(() => {
    return generatePlayModules(validPlanets, seed)
  }, [validPlanets, seed])

  const wisdomQuotes = useMemo(() => {
    return generateWisdomQuotes(validPlanets, seed)
  }, [validPlanets, seed])

  const promptCard = useMemo(() => generatePromptCard(seed), [seed])
  const affirmation = useMemo(() => generateAffirmation(seed), [seed])

  const [activeTab, setActiveTab] = useState<string>('overview')
  const [journalEntry, setJournalEntry] = useState('')
  const [entries, setEntries] = useState<Array<{ id: string; text: string; date: string; type: string; mood?: string }>>([])

  // 能量追踪
  const [energyLevels, setEnergyLevels] = useState<number[]>([])
  const [todayEnergy, setTodayEnergy] = useState(5)

  // 习惯打卡
  const [habitStars, setHabitStars] = useState<Record<string, boolean>>({})

  // 感恩花园
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([])
  const [gratitudeInput, setGratitudeInput] = useState('')

  // 呼吸动画
  const [breathing, setBreathing] = useState(false)
  const breathTimerRef = useRef<number | null>(null)

  // 神谕卡
  const [cardFlipped, setCardFlipped] = useState(false)
  const [currentOracle, setCurrentOracle] = useState(oracleCards[0])

  // 愿望
  const [wish, setWish] = useState('')
  const [wishPlanted, setWishPlanted] = useState(false)

  // 情绪调色板
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const moodColors = [
    { name: '喜悦', color: '#FFD700', emoji: '😊' },
    { name: '平静', color: '#87CEEB', emoji: '😌' },
    { name: '热情', color: '#FF6B6B', emoji: '🔥' },
    { name: '忧伤', color: '#6B8DD6', emoji: '😢' },
    { name: '愤怒', color: '#FF4500', emoji: '😤' },
    { name: '恐惧', color: '#9370DB', emoji: '😨' },
    { name: '疲惫', color: '#A0A0A0', emoji: '😴' },
    { name: '好奇', color: '#FFD700', emoji: '🤔' },
  ]

  // 脉轮平衡
  const [chakraStates, setChakraStates] = useState<number[]>([5, 5, 5, 5, 5, 5, 5])

  // 数字命盘
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null)

  // 如尼符文
  const [drawnRunes, setDrawnRunes] = useState<typeof runes | null>(null)

  // 易经
  const [hexagram, setHexagram] = useState<typeof import('../lib/comboGenerator').iChingHexagrams[0] | null>(null)

  // 宇宙来信
  const [showLetter, setShowLetter] = useState(false)
  const cosmicLetter = useMemo(() => generateCosmicLetter(seed), [seed])

  // 加载本地存储数据
  useEffect(() => {
    if (validPlanets.length >= 2) {
      const saved = localStorage.getItem(`combo-journal-${comboPath}`)
      if (saved) {
        try { setEntries(JSON.parse(saved)) } catch {}
      }
      const energy = localStorage.getItem(`combo-energy-${comboPath}`)
      if (energy) {
        try { setEnergyLevels(JSON.parse(energy)) } catch {}
      }
      const habits = localStorage.getItem(`combo-habits-${comboPath}`)
      if (habits) {
        try { setHabitStars(JSON.parse(habits)) } catch {}
      }
      const gratitudes = localStorage.getItem(`combo-gratitude-${comboPath}`)
      if (gratitudes) {
        try { setGratitudeItems(JSON.parse(gratitudes)) } catch {}
      }
      const wishData = localStorage.getItem(`combo-wish-${comboPath}`)
      if (wishData) {
        try { setWish(wishData); setWishPlanted(true) } catch {}
      }
    }
  }, [comboPath, validPlanets.length])

  // 保存日记
  const saveEntry = (type: string = 'journal') => {
    if (!journalEntry.trim()) return
    const newEntry = {
      id: Date.now().toString(),
      text: journalEntry.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
      type,
      mood: selectedMood || undefined,
    }
    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem(`combo-journal-${comboPath}`, JSON.stringify(updated))
    setJournalEntry('')
    setSelectedMood(null)
  }

  // 删除日记
  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem(`combo-journal-${comboPath}`, JSON.stringify(updated))
  }

  // 保存能量
  const saveEnergy = () => {
    const today = new Date().toDateString()
    const updated = [...energyLevels, todayEnergy]
    setEnergyLevels(updated)
    localStorage.setItem(`combo-energy-${comboPath}`, JSON.stringify(updated))
  }

  // 习惯打卡
  const toggleHabit = (habitId: string) => {
    const today = new Date().toDateString()
    const key = `${habitId}-${today}`
    const updated = { ...habitStars, [key]: !habitStars[key] }
    setHabitStars(updated)
    localStorage.setItem(`combo-habits-${comboPath}`, JSON.stringify(updated))
  }

  const habitList = ['冥想', '运动', '阅读', '写作', '感恩', '早睡']

  // 感恩
  const addGratitude = () => {
    if (!gratitudeInput.trim()) return
    const updated = [gratitudeInput.trim(), ...gratitudeItems]
    setGratitudeItems(updated)
    localStorage.setItem(`combo-gratitude-${comboPath}`, JSON.stringify(updated))
    setGratitudeInput('')
  }

  // 呼吸练习
  const startBreathing = () => {
    setBreathing(!breathing)
    if (breathing && breathTimerRef.current) {
      clearInterval(breathTimerRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current)
    }
  }, [])

  // 抽神谕卡
  const drawCard = () => {
    setCardFlipped(false)
    setTimeout(() => {
      setCurrentOracle(drawOracleCard(seed + Date.now()))
      setCardFlipped(true)
    }, 300)
  }

  // 种愿望
  const plantWish = () => {
    if (!wish.trim()) return
    setWishPlanted(true)
    localStorage.setItem(`combo-wish-${comboPath}`, wish)
  }

  // 幸运数字
  const generateLuckyNumber = () => {
    const today = new Date()
    const daySeed = seed + today.getFullYear() + today.getMonth() + today.getDate()
    setLuckyNumber((daySeed % 9) + 1)
  }

  // 抽如尼石
  const drawRuneSet = () => {
    setDrawnRunes(drawRunes(seed + Date.now(), 3))
  }

  // 起卦
  const castHexagram = () => {
    setHexagram(castIChing(seed + Date.now()))
  }

  // 导出数据
  const handleExport = () => {
    const data = {
      combo: comboPath,
      name: comboInfo.name,
      journal: entries,
      energy: energyLevels,
      gratitude: gratitudeItems,
      wish: wish,
      date: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${comboInfo.name}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 稀有度排序
  const sortedModules = useMemo(() => {
    const order = { legendary: 0, rare: 1, common: 2 }
    return [...playModules].sort((a, b) => order[a.rarity] - order[b.rarity])
  }, [playModules])

  const renderModuleContent = (moduleId: string) => {
    switch (moduleId) {
      // ===== 反思类 =====
      case 'daily-mirror':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🪞 每日魔镜</h3>
            <div className="rounded-2xl p-6 mb-4" style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}` }}>
              <div className="text-center">
                <div className="text-6xl mb-4">🪞</div>
                <p className="text-sm opacity-70 mb-4">今日，星图想让你看见的是……</p>
                <p className="text-xl font-light">「{promptCard.content}」</p>
              </div>
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="对着魔镜，说出你看见的自己……"
              className="w-full h-32 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2"
              style={{ borderColor: theme.borderColor, color: theme.primary }}
            />
            <button
              onClick={() => saveEntry('mirror')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
            >
              保存今日镜像
            </button>
          </div>
        )

      case 'soul-journal':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>📖 灵魂日记</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {moodColors.slice(0, 5).map(mood => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(selectedMood === mood.name ? null : mood.name)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all"
                  style={{
                    background: selectedMood === mood.name ? mood.color : 'rgba(255,255,255,0.05)',
                    color: selectedMood === mood.name ? '#000' : '#fff',
                    opacity: selectedMood === mood.name ? 1 : 0.7,
                  }}
                >
                  {mood.emoji} {mood.name}
                </button>
              ))}
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="今天，你的灵魂想说些什么？"
              className="w-full h-40 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('soul')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
            >
              写入灵魂
            </button>
            {entries.filter(e => e.type === 'soul').length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm opacity-70">最近的记录</h4>
                {entries.filter(e => e.type === 'soul').slice(0, 3).map(entry => (
                  <div key={entry.id} className="rounded-xl p-4 text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}40` }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs opacity-50">{entry.date}</span>
                      <button onClick={() => deleteEntry(entry.id)} className="text-xs opacity-50 hover:opacity-100">删除</button>
                    </div>
                    <p className="opacity-80">{entry.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'shadow-work':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🎭 影子工作</h3>
            <div className="rounded-2xl p-6 mb-4" style={{ background: 'linear-gradient(135deg, rgba(128,0,128,0.1), rgba(0,0,50,0.1))', border: `1px solid ${theme.borderColor}` }}>
              <p className="text-sm opacity-70 mb-3">你的阴影面，是你拒绝看见的自己。</p>
              <p className="text-sm opacity-70 mb-4">但它也是你力量的源泉。</p>
              <div className="space-y-3">
                <p className="text-base font-light">「最近，你在别人身上看到了什么让你不舒服的特质？」</p>
                <p className="text-xs opacity-50">提示：那些让你不舒服的，可能正是你压抑的自己。</p>
              </div>
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="诚实地面对你的阴影……"
              className="w-full h-32 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('shadow')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff' }}
            >
              看见并接纳
            </button>
          </div>
        )

      case 'pattern-finder':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🔍 模式解密</h3>
            <p className="text-sm opacity-70 mb-4">生命中的重复模式，都是未完成的课题。</p>
            <div className="space-y-3 mb-4">
              {['在关系中，你是否总是重复同样的剧本？', '工作中，什么模式让你停滞不前？', '你的情绪有什么周期性的规律？'].map((q, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}40` }}>
                  <p className="text-sm">{q}</p>
                </div>
              ))}
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="写下你发现的模式……"
              className="w-full h-28 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('pattern')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
            >
              记录模式
            </button>
          </div>
        )

      case 'deep-question':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>❓ 深度追问</h3>
            <div className="rounded-2xl p-8 text-center mb-6" style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}` }}>
              <div className="text-5xl mb-4">❓</div>
              <p className="text-xl font-light">{promptCard.content}</p>
              <p className="text-xs opacity-50 mt-3">— {promptCard.title} —</p>
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="让答案从深处浮上来……"
              className="w-full h-36 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('deep')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
            >
              记录答案
            </button>
          </div>
        )

      // ===== 创意类 =====
      case 'cosmic-letter':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>💌 宇宙来信</h3>
            {!showLetter ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6 animate-bounce">💌</div>
                <p className="text-sm opacity-70 mb-6">有一封信，从遥远的星辰寄来……</p>
                <button
                  onClick={() => setShowLetter(true)}
                  className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
                >
                  拆开信封
                </button>
              </div>
            ) : (
              <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,180,0,0.05))', border: `1px solid ${theme.borderColor}` }}>
                <div className="text-4xl mb-6 text-center">✨💌✨</div>
                <div className="space-y-4 text-sm leading-relaxed">
                  {cosmicLetter.split('\n\n').map((para, i) => (
                    <p key={i} className={i === 0 ? 'font-medium' : i === cosmicLetter.split('\n\n').length - 1 ? 'text-right italic opacity-80' : ''}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'mood-palette':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🎨 情绪调色板</h3>
            <p className="text-sm opacity-70 mb-4">今天，你的情绪是什么颜色？</p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {moodColors.map(mood => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(selectedMood === mood.name ? null : mood.name)}
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: selectedMood === mood.name ? mood.color : `${mood.color}30`,
                    boxShadow: selectedMood === mood.name ? `0 0 20px ${mood.color}60` : 'none',
                  }}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs mt-1" style={{ color: selectedMood === mood.name ? '#000' : '#fff' }}>{mood.name}</span>
                </button>
              ))}
            </div>
            {selectedMood && (
              <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.borderColor}` }}>
                <p className="text-sm">你选择了 <span className="font-medium">{selectedMood}</span></p>
                <p className="text-xs opacity-60 mt-2">这种情绪在告诉你什么？</p>
              </div>
            )}
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="和你的情绪待一会儿……"
              className="w-full h-28 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('mood')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
            >
              保存心情
            </button>
          </div>
        )

      case 'dream-weaver':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🌙 织梦者</h3>
            <p className="text-sm opacity-70 mb-4">梦，是潜意识写给你的信。</p>
            <div className="rounded-xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(75,0,130,0.1), rgba(0,0,80,0.1))', border: `1px solid ${theme.borderColor}` }}>
              <p className="text-xs opacity-60 mb-2">💡 记录提示</p>
              <ul className="text-xs space-y-1 opacity-70">
                <li>• 梦里有什么人物、地点、事物？</li>
                <li>• 你在梦中的情绪是怎样的？</li>
                <li>• 梦的结局是什么？</li>
                <li>• 醒来后，你想到了什么？</li>
              </ul>
            </div>
            <input
              type="text"
              placeholder="给这个梦起个名字……"
              className="w-full bg-black/30 rounded-xl p-3 text-sm mb-3 focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="描述你的梦……"
              className="w-full h-40 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('dream')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
            >
              编织梦境
            </button>
          </div>
        )

      case 'wish-upon-star':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🌠 向星许愿</h3>
            {!wishPlanted ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🌠</div>
                <p className="text-sm opacity-70 mb-6">在星空下，种下你的愿望</p>
                <input
                  type="text"
                  value={wish}
                  onChange={e => setWish(e.target.value)}
                  placeholder="写下你的愿望……"
                  className="w-full bg-black/30 rounded-xl p-4 text-center text-base mb-4 focus:outline-none"
                  style={{ border: `1px solid ${theme.borderColor}` }}
                />
                <button
                  onClick={plantWish}
                  className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, #fbbf24, #f59e0b)`, color: '#000' }}
                >
                  ✨ 种下愿望
                </button>
                <p className="text-xs opacity-50 mt-4">愿望说出来就不灵了？不，宇宙需要听见。</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-pulse">⭐</div>
                <p className="text-sm opacity-70 mb-2">你的愿望已种入星空</p>
                <p className="text-base font-light italic">"{wish}"</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < 3 ? '#fbbf24' : '#ffffff20', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
                <p className="text-xs opacity-50 mt-4">正在成长中…… 每天回来看看它</p>
              </div>
            )}
          </div>
        )

      case 'inner-child':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🎪 内在小孩</h3>
            <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,182,193,0.1), rgba(221,160,221,0.1))', border: `1px solid ${theme.borderColor}` }}>
              <div className="text-5xl mb-4">🧒</div>
              <p className="text-sm opacity-70 mb-2">闭上眼睛，问问内在的那个小孩：</p>
              <p className="text-lg font-light">「你现在还好吗？」</p>
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="TA 说了什么？你想对 TA 说什么？"
              className="w-full h-36 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('inner-child')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)', color: '#fff' }}
            >
              抱抱 TA
            </button>
          </div>
        )

      // ===== 冥想类 =====
      case 'rainbow-bridge':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🌈 彩虹桥冥想</h3>
            <p className="text-sm opacity-70 mb-6">想象一道彩虹桥，连接你和更高维度的自己</p>
            <div className="text-center mb-6">
              <div className="inline-flex gap-1">
                {['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'].map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-16 rounded-t-full animate-pulse"
                    style={{ background: color, animationDelay: `${i * 0.3}s`, opacity: breathing ? 1 : 0.5 }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                '1. 找一个安静的地方，坐下来',
                '2. 闭上眼睛，做几次深呼吸',
                '3. 想象你脚下有一道彩虹，从地面升起',
                '4. 顺着彩虹桥慢慢往上走',
                '5. 在桥的另一端，遇见更高的自己',
                '6. 问 TA 任何你想问的问题',
              ].map((step, i) => (
                <p key={i} className="opacity-70">{step}</p>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={startBreathing}
                className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: breathing ? 'linear-gradient(135deg, #ef4444, #8b5cf6)' : `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
              >
                {breathing ? '结束冥想' : '开始彩虹桥之旅'}
              </button>
            </div>
          </div>
        )

      case 'breath-of-life':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>💨 生命之息</h3>
            <p className="text-sm opacity-70 mb-6">4-7-8 呼吸法：吸气4秒 · 屏息7秒 · 呼气8秒</p>
            <div className="text-center mb-8">
              <div
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-1000"
                style={{
                  background: `radial-gradient(circle, ${theme.primary}40, transparent)`,
                  transform: breathing ? 'scale(1.5)' : 'scale(1)',
                  boxShadow: `0 0 40px ${theme.glowColor}`,
                }}
              >
                <span className="text-4xl">💨</span>
              </div>
              <p className="mt-4 text-sm opacity-70">
                {breathing ? '跟随呼吸的节奏……' : '准备好就开始'}
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={startBreathing}
                className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: breathing ? '#ef4444cc' : `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
              >
                {breathing ? '停止' : '开始呼吸'}
              </button>
            </div>
          </div>
        )

      case 'energy-cleanse':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>⚡ 能量清理</h3>
            <p className="text-sm opacity-70 mb-6">净化你的能量场，释放不再服务于你的一切</p>
            <div className="space-y-4">
              {[
                { icon: '🌿', title: '接地', desc: '光脚站在地上，感受大地的支撑' },
                { icon: '💧', title: '水疗', desc: '用清水冲洗双手，想象负面能量被冲走' },
                { icon: '🔥', title: '火焰', desc: '点燃蜡烛，让火焰转化负面能量' },
                { icon: '🌬️', title: '风息', desc: '深吸一口气，然后用力呼出' },
                { icon: '✨', title: '光照', desc: '想象金色的光从头顶灌入全身' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}40` }}>
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs opacity-60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => saveEntry('cleanse')}
                className="px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
              >
                记录清理感受
              </button>
            </div>
          </div>
        )

      case 'sound-healing':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🎵 音声疗愈</h3>
            <p className="text-sm opacity-70 mb-6">用声音的频率，校准你的能量场</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { freq: '528Hz', name: '爱与修复', emoji: '💚' },
                { freq: '432Hz', name: '自然和谐', emoji: '🌿' },
                { freq: '396Hz', name: '释放恐惧', emoji: '🕊️' },
                { freq: '639Hz', name: '连接关系', emoji: '💞' },
                { freq: '741Hz', name: '表达与净化', emoji: '💙' },
                { freq: '852Hz', name: '直觉觉醒', emoji: '👁️' },
              ].map(item => (
                <button
                  key={item.freq}
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.borderColor}` }}
                >
                  <span className="text-2xl mb-1">{item.emoji}</span>
                  <span className="text-xs font-medium">{item.freq}</span>
                  <span className="text-[10px] opacity-60">{item.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-center opacity-50">点击播放对应频率的疗愈音</p>
          </div>
        )

      // ===== 追踪类 =====
      case 'energy-tracker':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>📊 能量追踪</h3>
            <p className="text-sm opacity-70 mb-4">今天，你的能量状态如何？</p>
            <div className="rounded-2xl p-6 mb-6" style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}` }}>
              <div className="text-center mb-4">
                <span className="text-4xl font-light">{todayEnergy}</span>
                <span className="text-sm opacity-50"> / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={todayEnergy}
                onChange={e => setTodayEnergy(parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: theme.primary }}
              />
              <div className="flex justify-between text-xs opacity-50 mt-2">
                <span>低迷</span>
                <span>充沛</span>
              </div>
            </div>
            <button
              onClick={saveEnergy}
              className="w-full py-3 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
            >
              记录今日能量
            </button>
            {energyLevels.length > 0 && (
              <div className="mt-6">
                <p className="text-sm opacity-70 mb-3">能量趋势（{energyLevels.length}天）</p>
                <div className="flex items-end gap-1 h-24">
                  {energyLevels.slice(-14).map((level, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all"
                      style={{
                        height: `${level * 10}%`,
                        background: `linear-gradient(to top, ${theme.primary}80, ${theme.secondary}80)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'habit-stars':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>⭐ 习惯星图</h3>
            <p className="text-sm opacity-70 mb-4">用星星打卡，点亮你的习惯</p>
            <div className="space-y-3">
              {habitList.map(habit => {
                const today = new Date().toDateString()
                const key = `${habit}-${today}`
                const done = !!habitStars[key]
                return (
                  <button
                    key={habit}
                    onClick={() => toggleHabit(habit)}
                    className="w-full rounded-xl p-4 flex items-center justify-between transition-all hover:scale-[1.02]"
                    style={{
                      background: done ? `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}20)` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${done ? theme.primary + '60' : theme.borderColor + '40'}`,
                    }}
                  >
                    <span className="text-sm">{habit}</span>
                    <span className={`text-xl ${done ? 'animate-pulse' : 'opacity-30'}`}>
                      {done ? '⭐' : '☆'}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-center opacity-50 mt-4">
              今日完成：{habitList.filter(h => habitStars[`${h}-${new Date().toDateString()}`]).length}/{habitList.length}
            </p>
          </div>
        )

      case 'gratitude-garden':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>💝 感恩花园</h3>
            <p className="text-sm opacity-70 mb-4">每一份感恩，都是一朵盛开的花</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={gratitudeInput}
                onChange={e => setGratitudeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addGratitude()}
                placeholder="今天，你感恩什么？"
                className="flex-1 bg-black/30 rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ border: `1px solid ${theme.borderColor}` }}
              />
              <button
                onClick={addGratitude}
                className="px-4 py-2 rounded-xl text-sm"
                style={{ background: theme.primary + 'cc', color: '#fff' }}
              >
                种下
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {gratitudeItems.slice(0, 20).map((item, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-full text-xs"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`,
                    border: `1px solid ${theme.borderColor}`,
                  }}
                >
                  🌸 {item}
                </div>
              ))}
            </div>
            {gratitudeItems.length === 0 && (
              <p className="text-center text-sm opacity-40 py-8">花园还空着，种下第一朵感恩之花吧</p>
            )}
            <p className="text-xs text-center opacity-50 mt-4">花园里有 {gratitudeItems.length} 朵花</p>
          </div>
        )

      case 'transformation-journal':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🦋 蜕变日志</h3>
            <p className="text-sm opacity-70 mb-4">记录你的蜕变：从什么，变成了什么？</p>
            <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.1))', border: `1px solid ${theme.borderColor}` }}>
              <div className="text-4xl mb-2">🐛 → 🦋</div>
              <p className="text-xs opacity-60">每一次蜕变，都值得被记录</p>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs opacity-60 mb-2">以前的我：</p>
                <input
                  type="text"
                  placeholder="例如：害怕表达自己"
                  className="w-full bg-black/30 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ border: `1px solid ${theme.borderColor}` }}
                />
              </div>
              <div className="text-center text-xl opacity-30">↓</div>
              <div>
                <p className="text-xs opacity-60 mb-2">现在的我：</p>
                <input
                  type="text"
                  placeholder="例如：开始勇敢表达"
                  className="w-full bg-black/30 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ border: `1px solid ${theme.borderColor}` }}
                />
              </div>
            </div>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="这个蜕变是怎么发生的？"
              className="w-full h-28 bg-black/30 rounded-xl p-4 text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${theme.borderColor}` }}
            />
            <button
              onClick={() => saveEntry('transform')}
              className="mt-3 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)', color: '#fff' }}
            >
              记录蜕变
            </button>
          </div>
        )

      // ===== 占卜类 =====
      case 'oracle-cards':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🃏 神谕卡</h3>
            <p className="text-sm opacity-70 mb-6">抽一张卡，接收今日的宇宙指引</p>
            <div className="text-center mb-6">
              <div
                className="w-48 h-64 mx-auto rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105"
                style={{
                  background: cardFlipped
                    ? `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}40)`
                    : 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  border: `2px solid ${cardFlipped ? theme.primary + '80' : theme.borderColor}`,
                  boxShadow: cardFlipped ? `0 0 30px ${theme.glowColor}` : 'none',
                  transform: cardFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                }}
                onClick={drawCard}
              >
                {cardFlipped ? (
                  <>
                    <div className="text-5xl mb-4">{currentOracle.image}</div>
                    <p className="text-lg font-medium mb-2">{currentOracle.title}</p>
                    <p className="text-xs opacity-70 px-4">{currentOracle.content}</p>
                  </>
                ) : (
                  <div className="text-5xl">✦</div>
                )}
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={drawCard}
                className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
              >
                🎴 抽取神谕卡
              </button>
            </div>
          </div>
        )

      case 'numerology':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🔢 数字命盘</h3>
            <p className="text-sm opacity-70 mb-6">今日幸运数字，来自宇宙的数字振动</p>
            {luckyNumber === null ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-6 opacity-30">?</div>
                <button
                  onClick={generateLuckyNumber}
                  className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
                >
                  🔮 生成今日幸运数字
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: `radial-gradient(circle, ${theme.primary}40, transparent)`,
                    boxShadow: `0 0 40px ${theme.glowColor}`,
                  }}
                >
                  <span className="text-6xl font-light">{luckyNumber}</span>
                </div>
                <p className="text-base font-light mb-2">你的今日幸运数字</p>
                <p className="text-xs opacity-60 max-w-xs mx-auto">
                  {luckyNumber === 1 && '独立、开创、领导力。今天适合开启新事物。'}
                  {luckyNumber === 2 && '和谐、合作、平衡。今天适合连接他人。'}
                  {luckyNumber === 3 && '创造、表达、喜悦。今天适合发挥创意。'}
                  {luckyNumber === 4 && '稳定、务实、构建。今天适合打牢基础。'}
                  {luckyNumber === 5 && '自由、变化、冒险。今天适合拥抱变化。'}
                  {luckyNumber === 6 && '爱、关怀、疗愈。今天适合照顾自己和他人。'}
                  {luckyNumber === 7 && '智慧、内省、神秘。今天适合深度思考。'}
                  {luckyNumber === 8 && '丰盛、力量、成就。今天适合行动显化。'}
                  {luckyNumber === 9 && '完成、慈悲、智慧。今天适合总结和放下。'}
                </p>
              </div>
            )}
          </div>
        )

      case 'rune-reading':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>ᚠ 如尼符文</h3>
            <p className="text-sm opacity-70 mb-6">三颗如尼石：过去 · 现在 · 未来</p>
            {!drawnRunes ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-6">🪨</div>
                <button
                  onClick={drawRuneSet}
                  className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
                >
                  投掷如尼石
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {drawnRunes.map((rune, i) => (
                  <div key={i} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}` }}>
                    <div className="text-4xl w-16 h-16 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '28px' }}>{rune.symbol}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{rune.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">
                          {i === 0 ? '过去' : i === 1 ? '现在' : '未来'}
                        </span>
                      </div>
                      <p className="text-xs opacity-60 mt-1">{rune.meaning}</p>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <button
                    onClick={drawRuneSet}
                    className="px-6 py-2 rounded-full text-sm"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    重新投掷
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      case 'i-ching':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>☯️ 易经卦象</h3>
            <p className="text-sm opacity-70 mb-6">起卦问事，探寻变化之道</p>
            {!hexagram ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-6">☯️</div>
                <button
                  onClick={castHexagram}
                  className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`, color: '#fff' }}
                >
                  起卦
                </button>
                <p className="text-xs opacity-50 mt-4">静心凝神，想着你要问的事</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">䷀</div>
                <p className="text-xl font-light mb-2">第 {hexagram.number} 卦</p>
                <p className="text-lg font-medium mb-3" style={{ color: theme.primary }}>{hexagram.name}</p>
                <p className="text-sm opacity-70">{hexagram.meaning}</p>
                <button
                  onClick={castHexagram}
                  className="mt-6 px-6 py-2 rounded-full text-sm"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  再占一卦
                </button>
              </div>
            )}
          </div>
        )

      // ===== 疗愈类 =====
      case 'self-love-ritual':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>🌸 自爱仪式</h3>
            <p className="text-sm opacity-70 mb-6">设计专属于你的自爱仪式</p>
            <div className="space-y-3">
              {[
                { icon: '🛁', title: '沐浴仪式', desc: '用喜爱的沐浴露，泡一个放松的澡' },
                { icon: '🎵', title: '音乐疗愈', desc: '听一首让你感觉美好的歌' },
                { icon: '📖', title: '阅读时光', desc: '读几页你喜欢的书' },
                { icon: '🌿', title: '自然连接', desc: '出门走走，感受大自然' },
                { icon: '💆', title: '身体扫描', desc: '从头到脚放松每一块肌肉' },
                { icon: '☕', title: '好好吃饭', desc: '认真做一顿自己爱吃的' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}40` }}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs opacity-60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs opacity-50">选择 2-3 项，作为你今天的自爱仪式</p>
            </div>
          </div>
        )

      case 'inner-smile':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>😊 内在微笑</h3>
            <p className="text-sm opacity-70 mb-6">用微笑，疗愈你身体的每一个部位</p>
            <div className="space-y-2">
              {[
                '头顶 - 放松你的大脑',
                '眼睛 - 让眼睛休息一下',
                '喉咙 - 释放未说出口的话',
                '心脏 - 对心脏说"谢谢你"',
                '肺部 - 深呼吸，充满氧气',
                '胃部 - 消化的不只是食物',
                '腹部 - 那里有你的直觉',
                '双腿 - 它们带你去任何地方',
                '双脚 - 稳稳地站在大地上',
              ].map((part, i) => (
                <div key={i} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-lg">😊</span>
                  <span className="text-sm opacity-80">{part}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs opacity-50 mb-3">想象一道温柔的光，带着微笑</p>
              <p className="text-xs opacity-50">从上到下，流经你身体的每一个部位</p>
            </div>
          </div>
        )

      case 'cord-cutting':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>✂️ 能量剪线</h3>
            <p className="text-sm opacity-70 mb-6">剪断不再服务于你的能量连接</p>
            <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.08))', border: `1px solid ${theme.borderColor}` }}>
              <p className="text-sm opacity-80 mb-4">想一想：</p>
              <ul className="text-sm space-y-2 opacity-70">
                <li>• 谁让你感到消耗？</li>
                <li>• 什么关系让你疲惫？</li>
                <li>• 哪些旧模式还在拉扯你？</li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-70 mb-4">想象你和 TA 之间有一根线</p>
              <p className="text-sm opacity-70 mb-6">然后，温柔而坚定地，剪断它</p>
              <div className="text-6xl mb-4">✂️ ════════</div>
              <p className="text-xs opacity-50">你可以爱一个人，同时不被 TA 消耗</p>
            </div>
          </div>
        )

      case 'chakra-balance':
        return (
          <div>
            <h3 className="text-lg font-light mb-4" style={{ color: theme.primary }}>💫 脉轮平衡</h3>
            <p className="text-sm opacity-70 mb-6">校准七大脉轮，恢复能量流动</p>
            <div className="space-y-3">
              {chakras.map((chakra, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}40` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{chakra.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium" style={{ color: chakra.color }}>{chakra.name}</span>
                        <span className="text-xs opacity-60">{chakraStates[i]}/10</span>
                      </div>
                      <p className="text-[10px] opacity-50">{chakra.location} · {chakra.function}</p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={chakraStates[i]}
                    onChange={e => {
                      const newStates = [...chakraStates]
                      newStates[i] = parseInt(e.target.value)
                      setChakraStates(newStates)
                    }}
                    className="w-full h-1"
                    style={{ accentColor: chakra.color }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs opacity-50">调整每个脉轮的能量状态，找到平衡</p>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 opacity-50">
            <p className="text-sm">此功能正在加载中……</p>
          </div>
        )
    }
  }

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        background: theme.bgGradient,
        minHeight: '100vh',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: 'rgba(10,5,21,0.7)', borderBottom: `1px solid ${theme.borderColor}40` }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-all"
          >
            ← 返回
          </button>
          <div className="text-center">
            <h1 className="text-lg font-light tracking-wider">{comboInfo.name}</h1>
            <p className="text-[10px] opacity-60">{comboInfo.subtitle}</p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-all"
            style={{ color: theme.primary }}
          >
            导出 ✦
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 行星展示 */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {validPlanets.map(planetId => {
            const trait = planetTraits[planetId] || { emoji: '✨', meaning: planetId, element: '?' }
            return (
              <div
                key={planetId}
                className="text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1"
                  style={{
                    background: `radial-gradient(circle, ${planetColors[planetId] || '#888'}40, transparent)`,
                    boxShadow: `0 0 20px ${planetColors[planetId] || '#888'}30`,
                  }}
                >
                  {trait.emoji}
                </div>
                <p className="text-xs opacity-70">{planetNames[planetId] || planetId}</p>
              </div>
            )
          })}
        </div>

        {/* 描述 */}
        <p className="text-center text-sm opacity-70 mb-6 max-w-xl mx-auto">
          {comboInfo.description}
        </p>

        {/* 今日 affirmation */}
        <div
          className="rounded-2xl p-5 mb-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`,
            border: `1px solid ${theme.borderColor}`,
          }}
        >
          <p className="text-xs opacity-50 mb-2">✨ 今日 affirmation</p>
          <p className="text-base font-light italic">"{affirmation}"</p>
        </div>

        {/* 功能模块标签 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'overview' ? '' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              background: activeTab === 'overview' ? `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)` : 'rgba(255,255,255,0.05)',
              color: activeTab === 'overview' ? '#fff' : undefined,
            }}
          >
            📊 总览
          </button>
          {sortedModules.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveTab(module.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === module.id ? '' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                background: activeTab === module.id
                  ? `linear-gradient(135deg, ${theme.primary}cc, ${theme.secondary}cc)`
                  : `linear-gradient(135deg, ${rarityColors[module.rarity]})`,
                color: activeTab === module.id ? '#fff' : undefined,
                border: `1px solid ${activeTab === module.id ? 'transparent' : theme.borderColor + '40'}`,
              }}
            >
              <span>{module.icon}</span>
              <span>{module.name}</span>
              {module.rarity === 'legendary' && <span className="text-amber-300">✦</span>}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div
          className="rounded-3xl p-6 mb-8"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${theme.borderColor}40`,
            backdropFilter: 'blur(20px)',
          }}
        >
          {activeTab === 'overview' ? (
            <div>
              <h3 className="text-lg font-light mb-6" style={{ color: theme.primary }}>✨ 星图总览</h3>

              {/* 模块预览 */}
              <div className="mb-8">
                <h4 className="text-sm opacity-70 mb-3">解锁功能</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sortedModules.map(module => (
                    <button
                      key={module.id}
                      onClick={() => setActiveTab(module.id)}
                      className="rounded-2xl p-4 text-left transition-all hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${rarityColors[module.rarity]})`,
                        border: `1px solid ${theme.borderColor}40`,
                      }}
                    >
                      <div className="text-2xl mb-2">{module.icon}</div>
                      <p className="text-sm font-medium">{module.name}</p>
                      <p className="text-[10px] opacity-60 mt-1">{module.description}</p>
                      <div className="mt-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${rarityBadge[module.rarity].color}`}>
                          {rarityBadge[module.rarity].text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 智慧语录 */}
              <div className="mb-8">
                <h4 className="text-sm opacity-70 mb-3">💫 星图智慧</h4>
                <div className="space-y-3">
                  {wisdomQuotes.map((quote, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4 text-sm"
                      style={{ background: theme.cardBg, border: `1px solid ${theme.borderColor}40` }}
                    >
                      {quote}
                    </div>
                  ))}
                </div>
              </div>

              {/* 行星详情 */}
              <div>
                <h4 className="text-sm opacity-70 mb-3">🪐 组合行星</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {validPlanets.map(planetId => {
                    const trait = planetTraits[planetId] || { emoji: '✨', meaning: '未知', element: '?' }
                    return (
                      <div
                        key={planetId}
                        className="rounded-xl p-4 flex items-center gap-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${theme.borderColor}40` }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                          style={{
                            background: `radial-gradient(circle, ${planetColors[planetId] || '#888'}40, transparent)`,
                          }}
                        >
                          {trait.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{planetNames[planetId] || planetId}</p>
                          <p className="text-xs opacity-60">{trait.element}元素 · {trait.meaning}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            renderModuleContent(activeTab)
          )}
        </div>

        {/* 底部 */}
        <div className="text-center pb-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.borderColor}40` }}
          >
            ← 继续探索星图
          </button>
        </div>
      </div>
    </div>
  )
}
