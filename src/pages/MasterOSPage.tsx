import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanetVisual from '../components/PlanetVisual'
import { useLocalStorage } from '../utils/planetExport'
import { achievements } from '../data/achievements'

interface StatsData {
  planetsVisited: number
  combosExplored: number
  entriesRecorded: number
  connectionsMade: number
}

const quickLinks = [
  { id: 'observatory', label: '观星台', icon: '🔮', desc: '输入生辰点亮命星', color: '#ffd700' },
  { id: 'timeline', label: '命运轨迹', icon: '⏳', desc: '时间长河中的印记', color: '#ffb6c1' },
  { id: 'earth-online', label: '地球遗憾', icon: '🌍', desc: '世界各地的故事', color: '#87ceeb' },
  { id: 'lego-builder', label: '乐高搭建', icon: '🧱', desc: '创造你的世界', color: '#ffd700' },
  { id: 'voxel-world', label: '像素世界', icon: '🟩', desc: 'Minecraft 风格', color: '#90ee90' },
  { id: 'healing-builder', label: '释怀空间', icon: '🌸', desc: '3D 治愈创造', color: '#ffb6c1' },
  { id: 'galaxy', label: '银河视图', icon: '🌌', desc: '命运银河', color: '#9370db' },
  { id: 'universe', label: '我的宇宙', icon: '📦', desc: '收藏的宇宙', color: '#ffa07a' },
]

const comboLinks = [
  { id: 'mercury-venus', label: '心语桥', level: 2 },
  { id: 'venus-earth', label: '温柔之锚', level: 2 },
  { id: 'earth-mars', label: '地火漫游', level: 2 },
  { id: 'mercury-mars', label: '念头炼金', level: 2 },
  { id: 'venus-mars', label: '爱火试炼', level: 2 },
  { id: 'mercury-jupiter', label: '贵人语录', level: 2 },
  { id: 'mercury-saturn', label: '时间胶囊', level: 2 },
  { id: 'jupiter-saturn', label: '贵人年轮', level: 2 },
  { id: 'uranus-neptune', label: '灵感涌现', level: 2 },
]

export default function MasterOSPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'combos' | 'data'>('overview')
  const [stats, setStats] = useState<StatsData>({
    planetsVisited: 0,
    combosExplored: 0,
    entriesRecorded: 0,
    connectionsMade: 0,
  })
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [showDataPanel, setShowDataPanel] = useState(false)

  useEffect(() => {
    const unlocked = localStorage.getItem('achievements_unlocked')
    const progress = localStorage.getItem('achievements_progress')
    if (unlocked) setUnlockedAchievements(JSON.parse(unlocked))
    if (progress) {
      const p = JSON.parse(progress)
      setStats({
        planetsVisited: p.planetsVisited || 0,
        combosExplored: p.uniqueCombosUsed?.length || 0,
        entriesRecorded: p.entriesRecorded || 0,
        connectionsMade: p.connectionsMade || 0,
      })
    }
  }, [])

  const totalAchievements = achievements.length
  const achievementProgress = Math.round((unlockedAchievements.length / totalAchievements) * 100)

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      const keys = Object.keys(localStorage).filter(k => 
        k.startsWith('combo-') || 
        k.startsWith('achievements_') ||
        k.startsWith('timeline-') ||
        k.includes('mercury') ||
        k.includes('venus') ||
        k.includes('mars') ||
        k.includes('jupiter') ||
        k.includes('saturn') ||
        k.includes('uranus') ||
        k.includes('neptune')
      )
      keys.forEach(k => localStorage.removeItem(k))
      window.location.reload()
    }
  }

  const handleExportData = () => {
    const data: Record<string, string> = {}
    Object.keys(localStorage).forEach(key => {
      data[key] = localStorage.getItem(key) || ''
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `parallel-universe-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const statCards = [
    { label: '已探索行星', value: stats.planetsVisited, icon: '🪐', color: '#ffd700', max: 9 },
    { label: '已解锁组合', value: stats.combosExplored, icon: '✨', color: '#ffb6c1', max: 19 },
    { label: '记录条目', value: stats.entriesRecorded, icon: '📝', color: '#87ceeb', max: 100 },
    { label: '连线次数', value: stats.connectionsMade, icon: '🔗', color: '#98fb98', max: 50 },
  ]

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ff6b9d 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }}
        />
      </div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/80 text-amber-200 rounded-lg border border-amber-500/30 transition-all duration-300 backdrop-blur-sm text-lg z-20"
      >
        ← 返回星盘
      </button>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <PlanetVisual type="jupiter" size={120} />
          </div>
          <h1 className="text-5xl font-bold text-amber-100 mb-3 drop-shadow-2xl tracking-wider">
            宇宙大师
          </h1>
          <p className="text-xl text-amber-200/70">
            全功能宇宙操作系统
          </p>
          <p className="text-amber-200/40 mt-2">
            掌控你的宇宙，洞察你的命运
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {[
            { id: 'overview', label: '总览', icon: '📊' },
            { id: 'tools', label: '工具箱', icon: '🛠️' },
            { id: 'combos', label: '组合图鉴', icon: '✨' },
            { id: 'data', label: '数据管理', icon: '💾' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id ? 'scale-105' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 157, 0.15))'
                  : 'rgba(30, 30, 50, 0.5)',
                border: `1px solid ${activeTab === tab.id ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: activeTab === tab.id ? '#fff0d0' : 'rgba(255,255,255,0.6)',
              }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(20, 20, 40, 0.6)',
                    border: `1px solid ${card.color}30`,
                  }}
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <div className="text-3xl font-bold mb-1" style={{ color: card.color }}>
                    {card.value}
                    <span className="text-sm opacity-50">/{card.max}</span>
                  </div>
                  <div className="text-sm text-white/50">{card.label}</div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, (card.value / card.max) * 100)}%`,
                        background: card.color,
                        boxShadow: `0 0 10px ${card.color}50`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="p-6 rounded-2xl backdrop-blur-sm"
                style={{
                  background: 'rgba(20, 20, 40, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-amber-100">🏆 成就进度</h3>
                  <span className="text-amber-200/70 text-sm">
                    {unlockedAchievements.length}/{totalAchievements}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${achievementProgress}%`,
                      background: 'linear-gradient(90deg, #ffd700, #ff6b9d)',
                      boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {achievements.slice(0, 8).map(a => {
                    const unlocked = unlockedAchievements.includes(a.id)
                    return (
                      <div
                        key={a.id}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{
                          background: unlocked ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${unlocked ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                          opacity: unlocked ? 1 : 0.3,
                          filter: unlocked ? 'none' : 'grayscale(100%)',
                        }}
                        title={a.name}
                      >
                        {a.icon}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div
                className="p-6 rounded-2xl backdrop-blur-sm"
                style={{
                  background: 'rgba(20, 20, 40, 0.6)',
                  border: '1px solid rgba(135, 206, 235, 0.2)',
                }}
              >
                <h3 className="text-lg font-semibold text-sky-200 mb-4">⚡ 快速入口</h3>
                <div className="grid grid-cols-4 gap-3">
                  {quickLinks.slice(0, 8).map(link => (
                    <button
                      key={link.id}
                      onClick={() => navigate(`/${link.id}`)}
                      className="p-3 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col items-center gap-1"
                      style={{
                        background: `${link.color}10`,
                        border: `1px solid ${link.color}30`,
                      }}
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="text-xs text-white/70">{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl backdrop-blur-sm"
              style={{
                background: 'rgba(20, 20, 40, 0.6)',
                border: '1px solid rgba(152, 251, 152, 0.2)',
              }}
            >
              <h3 className="text-lg font-semibold text-emerald-200 mb-4">💡 使用提示</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-2xl mb-2">🖱️</div>
                  <h4 className="font-medium text-white/80 mb-1">拖动行星连线</h4>
                  <p className="text-sm text-white/50">在星图中拖动行星，解锁更多组合功能</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-medium text-white/80 mb-1">解锁成就</h4>
                  <p className="text-sm text-white/50">探索更多功能，解锁隐藏成就</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-2xl mb-2">📥</div>
                  <h4 className="font-medium text-white/80 mb-1">数据导出</h4>
                  <p className="text-sm text-white/50">随时导出你的数据，永不丢失</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(link => (
              <button
                key={link.id}
                onClick={() => navigate(`/${link.id}`)}
                className="p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] text-left"
                style={{
                  background: 'rgba(20, 20, 40, 0.6)',
                  border: `1px solid ${link.color}30`,
                }}
              >
                <div className="text-4xl mb-4">{link.icon}</div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: link.color }}>
                  {link.label}
                </h3>
                <p className="text-sm text-white/50">{link.desc}</p>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'combos' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-amber-100 mb-4">⭐ 2星组合</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {comboLinks.map(combo => (
                  <button
                    key={combo.id}
                    onClick={() => navigate(`/combo/${combo.id}`)}
                    className="p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] text-left"
                    style={{
                      background: 'rgba(20, 20, 40, 0.6)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white/80">{combo.label}</span>
                      <span className="text-amber-400 text-sm">
                        {'⭐'.repeat(combo.level)}
                      </span>
                    </div>
                    <span className="text-xs text-white/40">{combo.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-rose-200 mb-4">⭐⭐⭐ 3星组合</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { id: 'mercury-venus-mars', label: '情感炼金术' },
                  { id: 'mercury-jupiter-saturn', label: '成长之路' },
                  { id: 'earth-mars-uranus', label: '突破行动' },
                  { id: 'venus-jupiter-saturn', label: '关系年鉴' },
                  { id: 'mercury-uranus-neptune', label: '创意炼金炉' },
                ].map(combo => (
                  <button
                    key={combo.id}
                    onClick={() => navigate(`/combo/${combo.id}`)}
                    className="p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] text-left"
                    style={{
                      background: 'rgba(30, 20, 30, 0.6)',
                      border: '1px solid rgba(255, 182, 193, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white/80">{combo.label}</span>
                      <span className="text-rose-300 text-sm">⭐⭐⭐</span>
                    </div>
                    <span className="text-xs text-white/40">{combo.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-sky-200 mb-4">⭐⭐⭐⭐ 4星组合</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { id: 'mercury-venus-jupiter-saturn', label: '人生智慧图鉴' },
                  { id: 'earth-mars-jupiter-saturn', label: '事业年轮' },
                  { id: 'mercury-uranus-neptune-pluto', label: '灵魂蜕变史' },
                ].map(combo => (
                  <button
                    key={combo.id}
                    onClick={() => navigate(`/combo/${combo.id}`)}
                    className="p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] text-left"
                    style={{
                      background: 'rgba(20, 25, 40, 0.6)',
                      border: '1px solid rgba(135, 206, 235, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white/80">{combo.label}</span>
                      <span className="text-sky-300 text-sm">⭐⭐⭐⭐</span>
                    </div>
                    <span className="text-xs text-white/40">{combo.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-violet-200 mb-4">⭐⭐⭐⭐⭐ 5星组合</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { id: 'mercury-venus-earth-mars-jupiter', label: '全星觉醒' },
                  { id: 'jupiter-saturn-uranus-neptune-pluto', label: '宇宙意识' },
                ].map(combo => (
                  <button
                    key={combo.id}
                    onClick={() => navigate(`/combo/${combo.id}`)}
                    className="p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] text-left"
                    style={{
                      background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.2), rgba(138, 43, 226, 0.1))',
                      border: '1px solid rgba(147, 112, 219, 0.4)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white/90">{combo.label}</span>
                      <span className="text-violet-300">⭐⭐⭐⭐⭐</span>
                    </div>
                    <span className="text-xs text-white/40">{combo.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl backdrop-blur-sm"
              style={{
                background: 'rgba(20, 20, 40, 0.6)',
                border: '1px solid rgba(255, 182, 193, 0.2)',
              }}
            >
              <h3 className="text-lg font-semibold text-rose-200 mb-4">📊 数据统计</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-amber-300">{stats.planetsVisited}</div>
                  <div className="text-sm text-white/50 mt-1">行星探索</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-rose-300">{stats.combosExplored}</div>
                  <div className="text-sm text-white/50 mt-1">组合解锁</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-sky-300">{stats.entriesRecorded}</div>
                  <div className="text-sm text-white/50 mt-1">记录条目</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <div className="text-3xl font-bold text-emerald-300">{stats.connectionsMade}</div>
                  <div className="text-sm text-white/50 mt-1">连线次数</div>
                </div>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl backdrop-blur-sm"
              style={{
                background: 'rgba(20, 20, 40, 0.6)',
                border: '1px solid rgba(144, 238, 144, 0.2)',
              }}
            >
              <h3 className="text-lg font-semibold text-emerald-200 mb-4">💾 数据管理</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] text-left"
                  style={{
                    background: 'rgba(144, 238, 144, 0.1)',
                    border: '1px solid rgba(144, 238, 144, 0.3)',
                  }}
                >
                  <div className="text-2xl mb-2">📤</div>
                  <h4 className="font-medium text-emerald-200 mb-1">导出数据</h4>
                  <p className="text-sm text-white/50">将所有数据导出为 JSON 文件</p>
                </button>

                <button
                  onClick={handleClearData}
                  className="p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] text-left"
                  style={{
                    background: 'rgba(255, 100, 100, 0.1)',
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                  }}
                >
                  <div className="text-2xl mb-2">🗑️</div>
                  <h4 className="font-medium text-red-300 mb-1">清除数据</h4>
                  <p className="text-sm text-white/50">清除所有本地存储的数据</p>
                </button>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl backdrop-blur-sm"
              style={{
                background: 'rgba(20, 20, 40, 0.6)',
                border: '1px solid rgba(147, 112, 219, 0.2)',
              }}
            >
              <h3 className="text-lg font-semibold text-violet-200 mb-4">🏆 成就列表</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map(a => {
                  const unlocked = unlockedAchievements.includes(a.id)
                  return (
                    <div
                      key={a.id}
                      className="p-4 rounded-xl flex items-center gap-4"
                      style={{
                        background: unlocked ? 'rgba(147, 112, 219, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${unlocked ? 'rgba(147, 112, 219, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                        opacity: unlocked ? 1 : 0.5,
                      }}
                    >
                      <div className="text-3xl" style={{ filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                        {a.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium" style={{ color: unlocked ? '#e9d5ff' : 'rgba(255,255,255,0.6)' }}>
                          {a.name}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">{a.description}</div>
                      </div>
                      {unlocked && (
                        <div className="text-violet-300 text-sm">✓</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
