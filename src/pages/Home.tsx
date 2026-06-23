/**
 * 首页 - 导航中心 + 入口页面
 * 支持两种模式：独立导航 或 带星图的主页
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Telescope, Film, Dna, Compass, BookMarked, BookOpen, MonitorSmartphone, Sparkles, ArrowLeft, Home as HomeIcon, Zap } from 'lucide-react'
import StarMap from '../components/StarMap'

interface NavCard {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  path?: string
  panelType?: string
  color: string
  highlight?: boolean
}

const NAV_CARDS: NavCard[] = [
  {
    id: 'report',
    title: '命运全息报告',
    subtitle: 'One-Stop Destiny Report',
    description: '一键生成完整命运分析，包含所有功能的整合报告',
    icon: <Zap className="w-8 h-8" />,
    path: '/report',
    color: 'from-amber-500 to-orange-600',
    highlight: true,
  },
  {
    id: 'observatory',
    title: '观测站',
    subtitle: 'Explore the Multiverse',
    description: '进入3D星图，探索平行宇宙的可能性',
    icon: <Telescope className="w-8 h-8" />,
    path: '/?panel=observe',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'fate',
    title: '命运核心',
    subtitle: 'Fate Program',
    description: '输入生辰，获取专属命运分析报告',
    icon: <Film className="w-8 h-8" />,
    panelType: 'fate',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'fate-dna',
    title: '命运DNA',
    subtitle: 'Destiny DNA',
    description: '可视化你的命运基因图谱',
    icon: <Dna className="w-8 h-8" />,
    panelType: 'fate-dna',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'fortune',
    title: '命理殿堂',
    subtitle: 'Fortune Temple',
    description: '八字、紫微斗数、星座命理解读',
    icon: <Compass className="w-8 h-8" />,
    panelType: 'fortune',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'collection',
    title: '宇宙图鉴',
    subtitle: 'Collection',
    description: '收藏的平行宇宙与人生轨迹',
    icon: <BookMarked className="w-8 h-8" />,
    panelType: 'collection-detail',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'story',
    title: '我的故事',
    subtitle: 'My Story',
    description: '回顾你的人生决策时间线',
    icon: <BookOpen className="w-8 h-8" />,
    panelType: 'life-node-detail',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'os',
    title: '多元宇宙OS',
    subtitle: 'Multiverse OS',
    description: '进入全屏桌面操作系统体验',
    icon: <MonitorSmartphone className="w-8 h-8" />,
    panelType: 'os',
    color: 'from-slate-500 to-zinc-600',
  },
  {
    id: 'daily',
    title: '每日签文',
    subtitle: 'Daily Fortune',
    description: '查看今日宇宙运势与指引',
    icon: <Sparkles className="w-8 h-8" />,
    panelType: 'daily-card',
    color: 'from-yellow-500 to-amber-600',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showStarMap, setShowStarMap] = useState(false)

  // 检查URL参数，如果指定了panel则显示星图并打开对应面板
  const initialPanel = searchParams.get('panel')

  useEffect(() => {
    if (initialPanel) {
      setShowStarMap(true)
    }
  }, [initialPanel])

  // 导航处理
  const handleNavigate = (path: string) => {
    navigate(path)
  }

  // 切换到独立导航模式
  const handleShowNav = () => {
    setShowStarMap(false)
    navigate('/')
  }

  // 切换到星图模式
  const handleShowStarMap = () => {
    setShowStarMap(true)
    navigate('/?panel=observe')
  }

  // 如果是星图模式，显示星图主页
  if (showStarMap || initialPanel) {
    return (
      <div className="relative min-h-screen bg-slate-950">
        {/* 顶部导航栏 */}
        <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-purple-500/20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-300/80 hover:text-cyan-400 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </button>

            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">
              🌌 平行宇宙观测站
            </h1>

            <button
              onClick={handleShowNav}
              className="flex items-center gap-2 text-purple-300/80 hover:text-cyan-400 transition-colors text-sm"
            >
              <HomeIcon className="w-4 h-4" />
              导航
            </button>
          </div>
        </div>

        {/* 星图主体 */}
        <div className="pt-14">
          <StarMap 
            onOpenPanel={(panelType) => {
              console.log('Opening panel:', panelType)
            }} 
          />
        </div>

        {/* 快捷导航悬浮按钮 */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <button
            onClick={() => handleNavigate('/report')}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            title="命运全息报告"
          >
            <Zap className="w-7 h-7" />
          </button>
          <button
            onClick={() => handleNavigate('/?panel=fate')}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            title="命运核心"
          >
            <Film className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigate('/?panel=fortune')}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            title="命理殿堂"
          >
            <Compass className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavigate('/os')}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
            title="多元宇宙OS"
          >
            <MonitorSmartphone className="w-6 h-6" />
          </button>
        </div>
      </div>
    )
  }

  // 导航首页模式
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* 标题 */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              平行宇宙观测站
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            命运探索系统 · 探索你的多元人生可能性
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => handleNavigate('/observatory')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
            >
              🔮 命理星盘测算
            </button>
            <button
              onClick={handleShowStarMap}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              进入观测站
            </button>
            <button
              onClick={() => navigate('/os')}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-700 transition-all"
            >
              打开桌面系统
            </button>
          </div>
          <p className="text-amber-400/80 text-sm mt-4">
            输入生辰，点亮你的专属命星
          </p>
        </div>

        {/* 导航卡片网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {NAV_CARDS.map((card, index) => (
            <button
              key={card.id}
              onClick={() => card.path ? handleNavigate(card.path) : handleNavigate(`/?panel=${card.panelType}`)}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`
                group relative p-5 sm:p-6 rounded-2xl
                bg-slate-800/50 backdrop-blur-sm border border-slate-700/50
                hover:border-slate-600
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-2xl
                text-left animate-fade-in-up
                ${hoveredId === card.id ? 'ring-2 ring-white/20' : ''}
                ${card.highlight ? 'ring-2 ring-amber-500/50' : ''}
              `}
            >
              {/* 渐变背景 */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                bg-gradient-to-br ${card.color}
                transition-opacity duration-300
              `} />

              {/* 内容 */}
              <div className="relative z-10">
                {/* 图标 */}
                <div className={`
                  w-14 h-14 rounded-xl mb-4
                  bg-gradient-to-br ${card.color}
                  flex items-center justify-center
                  text-white
                  group-hover:scale-110 transition-transform duration-300
                  group-hover:rotate-3
                `}>
                  {card.icon}
                </div>

                {/* 标题 */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white transition-colors">
                  {card.title}
                </h3>

                {/* 副标题 */}
                <p className="text-xs text-cyan-400/80 font-medium mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {card.subtitle}
                </p>

                {/* 描述 */}
                <p className="text-xs text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {card.description}
                </p>
              </div>

              {/* 悬停边框光效 */}
              <div className={`
                absolute inset-0 rounded-2xl
                bg-gradient-to-r ${card.color} opacity-0
                group-hover:opacity-20 blur-sm
                transition-opacity duration-300
              `} />
            </button>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-12 text-slate-500 text-sm">
          <p>选择一个模块开始探索你的命运</p>
        </div>
      </div>

      {/* 动画样式 */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
