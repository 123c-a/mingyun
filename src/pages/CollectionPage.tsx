import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, BookMarked, Sparkles, Trash2 } from 'lucide-react'
import { useUniverseStore } from '../store/universeStore'

export default function CollectionPage() {
  const navigate = useNavigate()
  const { collection, clearHistory } = useUniverseStore()
  const [selectedType, setSelectedType] = useState<string>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    window.scrollTo(0, 0)
  }, [])

  const allTags = Array.from(new Set(collection.flatMap((c) => c.emotion_tags))).sort()

  const filteredCollection = selectedType === 'all'
    ? collection
    : collection.filter((c) => c.emotion_tags.includes(selectedType))

  const sortedCollection = [...filteredCollection].sort((a, b) => b.count - a.count)

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

          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">
            🌟 宇宙图鉴
          </h1>

          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* 统计 */}
        <div className={`max-w-4xl mx-auto mb-8 transition-all duration-700 delay-100
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="p-6 bg-gradient-to-br from-amber-950/30 via-purple-950/30 to-amber-950/30
                          border border-amber-500/20 rounded-3xl text-center">
            <BookMarked className="w-10 h-10 mx-auto mb-3 text-amber-400" />
            <p className="text-4xl font-black text-transparent bg-clip-text
                         bg-gradient-to-r from-amber-300 to-yellow-200 mb-1">
              {collection.length}
            </p>
            <p className="text-sm text-purple-300/70">种宇宙类型已收录</p>
          </div>
        </div>

        {/* 过滤 */}
        {collection.length > 0 && (
          <div className={`max-w-4xl mx-auto mb-6 transition-all duration-700 delay-200
                          ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300
                  ${selectedType === 'all'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                    : 'bg-slate-800/50 text-purple-400 border border-slate-700/30 hover:text-amber-300'}`}
              >
                全部
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedType(tag)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-300
                    ${selectedType === tag
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                      : 'bg-slate-800/50 text-purple-400 border border-slate-700/30 hover:text-amber-300'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 图鉴网格 */}
        {sortedCollection.length > 0 ? (
          <div className={`max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4
                          transition-all duration-700 delay-300
                          ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {sortedCollection.map((item, i) => (
              <div
                key={item.universe_name}
                className="relative p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/70
                           border border-purple-500/20 hover:border-amber-500/40
                           transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]
                           group"
                style={{
                  animation: `cardFlyIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                  animationDelay: `${i * 80}ms`,
                  opacity: 0,
                }}
              >
                {/* 出现次数标识 */}
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center
                                text-sm font-bold
                                ${item.count >= 5
                                  ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                                  : item.count >= 2
                                    ? 'bg-purple-500/80 text-white'
                                    : 'bg-slate-700 text-slate-300'}`}>
                  ×{item.count}
                </div>

                {/* 命运眷顾标识 */}
                {item.count >= 5 && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1
                                  px-2 py-0.5 bg-amber-500 rounded-full text-[10px] text-white">
                    <Sparkles className="w-3 h-3" />
                    命运眷顾
                  </div>
                )}

                <h4 className="text-sm font-bold text-transparent bg-clip-text
                               bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200
                               mb-2 pr-8">
                  {item.universe_name}
                </h4>

                <div className="flex flex-wrap gap-1">
                  {item.emotion_tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] rounded-full
                                 bg-amber-500/10 border border-amber-500/20 text-amber-300/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 首次出现时间 */}
                <p className="text-[10px] text-purple-400/50 mt-2">
                  首次: {new Date(item.firstSeen).toLocaleDateString('zh-CN')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookMarked className="w-16 h-16 mx-auto mb-4 text-purple-500/30" />
            <h2 className="text-xl font-bold text-purple-300/60 mb-2">
              图鉴为空
            </h2>
            <p className="text-sm text-purple-400/40 mb-6">
              去观测宇宙并收藏遇到的类型吧
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
