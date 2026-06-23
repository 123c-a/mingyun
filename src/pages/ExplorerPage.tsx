import { useNavigate } from 'react-router-dom'
import PlanetVisual from '../components/PlanetVisual'

export default function ExplorerPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/80 text-amber-200 rounded-lg border border-amber-500/30 transition-all duration-300 backdrop-blur-sm text-lg"
      >
        ← 返回星盘
      </button>

      <div className="mb-8">
        <PlanetVisual type="mars" size={160} />
      </div>

      <h1 className="text-5xl font-bold text-amber-100 mb-4 drop-shadow-2xl tracking-wider">
        宇宙探索
      </h1>
      <p className="text-xl text-amber-200/70 text-center max-w-md mb-8">
        探索无尽宇宙的奥秘
      </p>

      <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 max-w-xl">
        <h2 className="text-2xl text-amber-200 font-semibold mb-4 text-center">🔭 功能开发中</h2>
        <p className="text-slate-300 text-center leading-relaxed">
          这里将提供探索新宇宙的界面，让你可以发现和研究未知的平行世界。
        </p>
      </div>
    </div>
  )
}
