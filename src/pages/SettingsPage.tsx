import { useNavigate } from 'react-router-dom'
import PlanetVisual from '../components/PlanetVisual'
import Scene3DBackground from '../components/Scene3DBackground'

export default function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#60a5fa" secondaryColor="#a78bfa" />
      <div className="absolute inset-0 bg-black/30" />
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/80 text-amber-200 rounded-lg border border-amber-500/30 transition-all duration-300 backdrop-blur-sm text-lg z-20"
      >
        ← 返回星盘
      </button>

      <div className="relative z-10 mb-8">
        <PlanetVisual type="uranus" size={160} />
      </div>

      <h1 className="relative z-10 text-5xl font-bold text-amber-100 mb-4 drop-shadow-2xl tracking-wider">
        系统设置
      </h1>
      <p className="relative z-10 text-xl text-amber-200/70 text-center max-w-md mb-8">
        个性化你的宇宙导航系统
      </p>

      <div className="relative z-10 bg-slate-900/60 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 max-w-xl">
        <h2 className="text-2xl text-amber-200 font-semibold mb-4 text-center">⚙️ 功能开发中</h2>
        <p className="text-slate-300 text-center leading-relaxed">
          这里将提供系统设置界面，包括主题、语言、数据管理等个性化配置选项。
        </p>
      </div>
    </div>
  )
}
