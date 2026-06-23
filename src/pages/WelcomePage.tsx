import { useNavigate } from 'react-router-dom'
import { Sparkles, Rocket, Compass, Star, Zap, BookOpen, Dices } from 'lucide-react'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 pb-12 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Logo */}
        <div className="mb-6">
          <div className="relative inline-block">
            <Sparkles className="w-14 h-14 text-amber-400 animate-pulse mx-auto mb-4" />
            <div className="absolute inset-0 blur-2xl bg-amber-400/20 rounded-full" />
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-5xl md:text-6xl font-black mb-4 shimmer-text">
          多元宇宙观测站
        </h1>
        <p className="text-xl text-amber-200/80 mb-2">
          看见你人生中那些没被选中的路
        </p>
        <p className="text-sm text-purple-300/50 mb-10">
          ✦ 由 DeepSeek 大模型驱动 ✦
        </p>

        {/* 🌟 核心入口 - 命运节目 */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/fate')}
            className="group relative w-full max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-amber-600 via-purple-600 to-cyan-600 text-white shadow-[0_0_60px_rgba(251,191,36,0.25)] hover:shadow-[0_0_80px_rgba(251,191,36,0.4)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.99] overflow-hidden"
          >
            {/* 内部光效 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              {/* 左侧：图标和说明 */}
              <div className="flex items-center gap-5 text-left">
                <div className="relative">
                  <Dices className="w-12 h-12 text-yellow-200" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-yellow-200/80 tracking-widest mb-1">✦ 核心体验 ✦</div>
                  <div className="text-2xl font-bold mb-1">命运节目 · 完整人生分析</div>
                  <div className="text-amber-100/80 text-sm">
                    扫描你的命运底色 · 探索6个人生关键节点 · 生成命运总览和今日签文
                  </div>
                </div>
              </div>

              {/* 右侧：按钮指示 */}
              <div className="flex-shrink-0">
                <div className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-base font-semibold whitespace-nowrap">
                  立即开始 →
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* 其他功能卡片 */}
        <div className="mb-10">
          <div className="text-center mb-5">
            <span className="text-sm text-purple-300/70 tracking-wider">其他观测工具</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 平行宇宙观测 */}
            <button
              onClick={() => navigate('/observe')}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-950/40 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex-shrink-0">
                  <Rocket className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white mb-1">平行宇宙观测</div>
                  <div className="text-sm text-purple-200/70">
                    输入你想探索的决定，AI 生成多个平行宇宙让你看见不同的可能性
                  </div>
                </div>
              </div>
            </button>

            {/* 命理殿堂 */}
            <button
              onClick={() => navigate('/fortune')}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-amber-950/40 border border-amber-500/30 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all duration-300 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex-shrink-0">
                  <Compass className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white mb-1">命理殿堂</div>
                  <div className="text-sm text-amber-200/70">
                    八字 · 紫微斗数 · 星座MBTI，传统命理与现代分析结合
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 次要入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/collection')}
            className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-400/40 transition-all"
          >
            <Star className="w-5 h-5 text-yellow-300 mx-auto mb-2" />
            <div className="text-sm text-white font-semibold mb-0.5">收藏图鉴</div>
            <div className="text-xs text-slate-400">收集过的宇宙</div>
          </button>

          <button
            onClick={() => navigate('/story')}
            className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-400/40 transition-all"
          >
            <BookOpen className="w-5 h-5 text-cyan-300 mx-auto mb-2" />
            <div className="text-sm text-white font-semibold mb-0.5">故事时间线</div>
            <div className="text-xs text-slate-400">你的人生档案</div>
          </button>

          <button
            onClick={() => navigate('/observe')}
            className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-400/40 transition-all"
          >
            <Zap className="w-5 h-5 text-amber-300 mx-auto mb-2" />
            <div className="text-sm text-white font-semibold mb-0.5">快速观测</div>
            <div className="text-xs text-slate-400">即时探索决定</div>
          </button>

          <button
            onClick={() => navigate('/fortune')}
            className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-400/40 transition-all"
          >
            <Sparkles className="w-5 h-5 text-purple-300 mx-auto mb-2" />
            <div className="text-sm text-white font-semibold mb-0.5">命理分析</div>
            <div className="text-xs text-slate-400">八字紫微星座</div>
          </button>
        </div>
      </div>

      {/* 底部版权 */}
      <div className="mt-auto pt-12 text-center">
        <p className="text-xs text-purple-500/30">
          ✦ 平行宇宙观测站 · 探索无限可能 ✦
        </p>
      </div>
    </div>
  )
}
