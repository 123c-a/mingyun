import { useNavigate } from 'react-router-dom'
import PlanetVisual from '../components/PlanetVisual'
import Scene3DBackground from '../components/Scene3DBackground'
import { MingliStarPanel } from '../components/MingliStarPanel'

export default function ObservatoryPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Scene3DBackground type="stars" primaryColor="#ffd700" secondaryColor="#ffb6c1" />
      <div className="absolute inset-0 bg-black/20" />

      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/80 text-amber-200 rounded-lg border border-amber-500/30 transition-all duration-300 backdrop-blur-sm text-lg z-20"
      >
        ← 返回星盘
      </button>

      {/* 命理星盘面板 */}
      <MingliStarPanel />

      {/* 标题 */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        textAlign: 'center',
        zIndex: 10,
      }}>
        <h1 className="text-5xl font-bold text-amber-100 mb-4 drop-shadow-2xl tracking-wider">
          观测站
        </h1>
        <p className="text-xl text-amber-200/70 text-center max-w-md">
          输入生辰，点亮你的命星
        </p>
      </div>
    </div>
  )
}
