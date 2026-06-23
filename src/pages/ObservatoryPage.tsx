import { useNavigate } from 'react-router-dom'
import PlanetVisual from '../components/PlanetVisual'
import { MingliStarPanel } from '../components/MingliStarPanel'

export default function ObservatoryPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 overflow-hidden">
      {/* 背景星星效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

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
      }}>
        <h1 className="text-5xl font-bold text-amber-100 mb-4 drop-shadow-2xl tracking-wider">
          观测站
        </h1>
        <p className="text-xl text-amber-200/70 text-center max-w-md">
          输入生辰，点亮你的命星
        </p>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
