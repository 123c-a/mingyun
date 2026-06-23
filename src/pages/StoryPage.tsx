import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Trash2, ChevronRight, Sparkles } from 'lucide-react'
import { useUniverseStore } from '../store/universeStore'

export default function StoryPage() {
  const navigate = useNavigate()
  const { currentStory, clearStory } = useUniverseStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部导航 */}
      <div className={`sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-purple-500/20
                      transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-300/80 hover:text-cyan-400
                       transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>

          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            📖 我的故事
          </h1>

          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* 统计 */}
        {currentStory.length > 0 && (
          <div className={`max-w-2xl mx-auto mb-8 transition-all duration-700 delay-100
                          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="p-6 bg-gradient-to-br from-indigo-950/30 via-purple-950/30 to-indigo-950/30
                            border border-indigo-500/20 rounded-3xl text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-indigo-400" />
              <p className="text-4xl font-black text-transparent bg-clip-text
                           bg-gradient-to-r from-indigo-300 to-purple-300 mb-1">
                {currentStory.length}
              </p>
              <p className="text-sm text-purple-300/70">个命运决定</p>
              <p className="text-xs text-indigo-400/50 mt-2">
                命运已改写 {currentStory.length} 次
              </p>
            </div>
          </div>
        )}

        {/* 时间线 */}
        {currentStory.length > 0 ? (
          <div className={`max-w-2xl mx-auto transition-all duration-700 delay-200
                          ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {/* 清空按钮 */}
            <div className="flex justify-end mb-6">
              <button
                onClick={clearStory}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400/60
                           hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                清空故事
              </button>
            </div>

            {/* 时间线 */}
            <div className="relative">
              {/* 竖线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5
                              bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500" />

              {/* 节点 */}
              <div className="space-y-6 pl-12">
                {currentStory.map((node, index) => (
                  <div
                    key={node.id}
                    className="relative"
                    style={{
                      animation: `slideInLeft 0.6s ease-out forwards`,
                      animationDelay: `${index * 150}ms`,
                      opacity: 0,
                    }}
                  >
                    {/* 节点圆点 */}
                    <div
                      className={`absolute -left-12 top-4 w-6 h-6 rounded-full border-2 border-slate-900
                                 flex items-center justify-center text-[10px] font-bold
                                 ${index === currentStory.length - 1
                                   ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                                   : 'bg-slate-700 text-slate-300'}`}
                    >
                      {index + 1}
                    </div>

                    {/* 卡片 */}
                    <div
                      className={`p-5 rounded-2xl transition-all duration-300
                                 ${index === currentStory.length - 1
                                   ? 'bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                                   : 'bg-slate-900/60 border border-slate-700/30'}`}
                    >
                      {/* 标签 */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        {index === currentStory.length - 1 && (
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            最新
                          </span>
                        )}
                        <span className="text-[10px] text-purple-400/50 ml-auto">
                          {new Date(node.timestamp).toLocaleString('zh-CN')}
                        </span>
                      </div>

                      {/* 决定 */}
                      <p className="text-xs text-purple-300/80 italic mb-3">
                        {node.decision}
                      </p>

                      {/* 宇宙 */}
                      <div className={`p-4 rounded-xl mb-3
                                      ${index === currentStory.length - 1
                                        ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40'
                                        : 'bg-slate-800/40'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className={`w-4 h-4 ${index === currentStory.length - 1 ? 'text-amber-400' : 'text-indigo-400'}`} />
                          <h4 className={`text-sm font-bold
                                        ${index === currentStory.length - 1
                                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-200'
                                          : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200'}`}>
                            {node.chosenUniverse.universe_name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full
                                          ${index === currentStory.length - 1
                                            ? 'bg-amber-500/20 text-amber-300'
                                            : 'bg-indigo-500/20 text-indigo-300'}`}>
                            概率: {node.chosenUniverse.probability}%
                          </span>
                          <span className="text-xs text-purple-400/60">
                            {node.chosenUniverse.emotion_tags.join(' · ')}
                          </span>
                        </div>

                        <p className="text-xs text-purple-200/60 leading-relaxed line-clamp-2">
                          {node.chosenUniverse.description}
                        </p>
                      </div>

                      {/* 连接箭头 */}
                      {index < currentStory.length - 1 && (
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2">
                          <ChevronRight className="w-4 h-4 text-indigo-400/40" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-500/30" />
            <h2 className="text-xl font-bold text-purple-300/60 mb-2">
              故事为空
            </h2>
            <p className="text-sm text-purple-400/40 mb-6">
              去观测宇宙并接受命运吧
            </p>
            <button
              onClick={() => navigate('/observe')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600
                         rounded-xl text-white font-medium
                         hover:shadow-[0_0_25px_rgba(0,212,255,0.3)]
                         transition-all duration-300"
            >
              开始观测
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
