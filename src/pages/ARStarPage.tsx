import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Scene3DBackground from '../components/Scene3DBackground'
import { isSpeechSupported, speak, stopSpeaking } from '../utils/speechService'

type ARMode = 'immersive' | 'projection' | 'guide'

interface ARFeature {
  id: ARMode
  title: string
  description: string
  icon: string
  gradient: string
  requiresCamera?: boolean
}

const FEATURES: ARFeature[] = [
  {
    id: 'immersive',
    title: '沉浸星空调验',
    description: '通过陀螺仪或鼠标控制视角，360度身临其境遨游星空，点击星星许愿或查看星座信息',
    icon: '✨',
    gradient: 'from-violet-600/60 to-purple-600/60',
    requiresCamera: false,
  },
  {
    id: 'projection',
    title: '行星AR投影',
    description: '开启摄像头，将九大行星投影到现实世界，AR技术打造沉浸式行星体验',
    icon: '🪐',
    gradient: 'from-blue-600/60 to-cyan-600/60',
    requiresCamera: true,
  },
  {
    id: 'guide',
    title: '星空导览',
    description: '天文馆式体验，陀螺仪导航星座，查看个人专属星盘与行星运行轨迹',
    icon: '🔭',
    gradient: 'from-amber-600/60 to-orange-600/60',
    requiresCamera: false,
  },
]

export default function ARStarPage() {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState<ARMode | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleStart = useCallback(async (mode: ARMode) => {
    if (mode === 'projection') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setPermissionGranted(true)
        speak('即将开启行星AR投影，将行星带入你的世界', {
          rate: 1.05,
          pitch: 1.4,
          volume: 0.9,
          enabled: true,
        }, () => setIsSpeaking(false), () => setIsSpeaking(true))
      } catch (err) {
        setPermissionDenied(true)
        speak('无法访问摄像头，请检查权限设置', {
          rate: 1.05,
          pitch: 1.4,
          volume: 0.9,
          enabled: true,
        }, () => setIsSpeaking(false), () => setIsSpeaking(true))
      }
    }
    setSelectedMode(mode)
    setShowIntro(false)
  }, [])

  const handleBack = () => {
    if (selectedMode === 'projection' && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    stopSpeaking()
    if (showIntro && !selectedMode) {
      navigate('/')
    } else {
      setSelectedMode(null)
      setShowIntro(true)
      setPermissionGranted(false)
      setPermissionDenied(false)
    }
  }

  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [])

  const renderContent = () => {
    if (selectedMode === 'immersive') {
      return <ImmersiveStarView onBack={handleBack} />
    }
    if (selectedMode === 'projection') {
      return <ARProjectionView videoRef={videoRef} permissionGranted={permissionGranted} permissionDenied={permissionDenied} onBack={handleBack} />
    }
    if (selectedMode === 'guide') {
      return <StarGuideView onBack={handleBack} />
    }
    return null
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-16">
      <Scene3DBackground type="stars" primaryColor="#a78bfa" secondaryColor="#6366f1" />
      <div className="absolute inset-0 bg-black/40" />

      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="absolute top-8 left-8 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/80 text-amber-200 rounded-lg border border-amber-500/30 transition-all duration-300 backdrop-blur-sm text-lg z-30"
      >
        ← 返回
      </button>

      {showIntro ? (
        <>
          <div className="relative z-10 mb-6 text-center">
            <h1 className="text-4xl font-bold text-amber-100 mb-2 drop-shadow-2xl">
              AR 星空
            </h1>
            <p className="text-xl text-amber-200/70">
              探索宇宙的无限可能
            </p>
          </div>

          <div className="relative z-10 w-full max-w-3xl px-4 space-y-4">
            {FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleStart(feature.id)}
                className={`w-full p-6 bg-gradient-to-r ${feature.gradient} hover:scale-[1.02] transition-all duration-300 rounded-2xl border border-white/20 backdrop-blur-sm text-left`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{feature.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="relative z-10 mt-8 text-white/50 text-sm">
            推荐使用手机浏览器体验，效果更佳 📱
          </p>
        </>
      ) : (
        renderContent()
      )}
    </div>
  )
}

// 沉浸星空调验模式
function ImmersiveStarView({ onBack }: { onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [wishes, setWishes] = useState<{ id: number; x: number; y: number; text: string }[]>([])
  const [showWishInput, setShowWishInput] = useState(false)
  const [wishText, setWishText] = useState('')
  const [selectedStar, setSelectedStar] = useState<{ x: number; y: number; name: string } | null>(null)

  const constellations = [
    { name: '射手座', x: 20, y: 30 },
    { name: '双子座', x: 60, y: 20 },
    { name: '狮子座', x: 80, y: 50 },
    { name: '天蝎座', x: 40, y: 70 },
    { name: '金牛座', x: 15, y: 60 },
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && !showWishInput) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30
        setRotation({ x: -y, y: x })
      }
    }

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null && !showWishInput) {
        setRotation({ x: (e.beta - 45) * 0.5, y: e.gamma * 0.5 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('deviceorientation', handleDeviceOrientation)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [showWishInput])

  const handleMakeWish = () => {
    if (wishText.trim()) {
      const newWish = {
        id: Date.now(),
        x: 30 + Math.random() * 40,
        y: 20 + Math.random() * 40,
        text: wishText,
      }
      setWishes([...wishes, newWish])
      setWishText('')
      setShowWishInput(false)
    }
  }

  return (
    <div ref={containerRef} className="relative z-10 w-full h-[70vh] overflow-hidden cursor-crosshair">
      {/* 星空背景 */}
      <div
        className="absolute inset-0 transition-transform duration-100"
        style={{
          background: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 40% 70%, white, transparent),
            radial-gradient(1px 1px at 60% 20%, white, transparent),
            radial-gradient(2px 2px at 80% 50%, white, transparent),
            radial-gradient(1px 1px at 10% 80%, white, transparent),
            radial-gradient(2px 2px at 50% 40%, white, transparent),
            radial-gradient(1px 1px at 70% 80%, white, transparent),
            radial-gradient(2px 2px at 30% 10%, white, transparent),
            radial-gradient(1px 1px at 90% 90%, white, transparent),
            radial-gradient(2px 2px at 5% 50%, white, transparent)
          `,
          backgroundSize: '200px 200px',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      />

      {/* 星座 */}
      {constellations.map((c) => (
        <button
          key={c.name}
          onClick={() => setSelectedStar({ x: c.x, y: c.y, name: c.name })}
          className="absolute text-white/60 hover:text-yellow-300 transition-colors text-sm"
          style={{ left: `${c.x}%`, top: `${c.y}%` }}
        >
          ⭐ {c.name}
        </button>
      ))}

      {/* 许愿流星 */}
      {wishes.map((w) => (
        <div
          key={w.id}
          className="absolute animate-pulse"
          style={{ left: `${w.x}%`, top: `${w.y}%` }}
        >
          <span className="text-2xl">🌠</span>
          <div className="absolute top-8 left-4 bg-slate-900/80 px-3 py-1 rounded-lg text-white text-xs whitespace-nowrap">
            {w.text}
          </div>
        </div>
      ))}

      {/* 选中的星星信息 */}
      {selectedStar && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-sm p-6 rounded-2xl border border-amber-500/30 z-20">
          <h3 className="text-xl font-semibold text-amber-200 mb-2">{selectedStar.name}</h3>
          <p className="text-white/70 text-sm mb-4">
            这是一片充满能量的星空区域，蕴含着无限可能
          </p>
          <button
            onClick={() => setSelectedStar(null)}
            className="text-white/50 hover:text-white text-sm"
          >
            关闭
          </button>
        </div>
      )}

      {/* 操作提示 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm text-center">
        <p>移动鼠标或转动手机查看星空</p>
        <button
          onClick={() => setShowWishInput(true)}
          className="mt-2 px-4 py-2 bg-purple-600/60 hover:bg-purple-500/60 rounded-lg text-white text-sm transition-colors"
        >
          ✨ 许个愿
        </button>
      </div>

      {/* 许愿输入 */}
      {showWishInput && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 p-6 rounded-2xl border border-amber-500/30 z-20 w-80">
          <h3 className="text-lg font-semibold text-amber-200 mb-4">✨ 写下你的愿望</h3>
          <input
            type="text"
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            placeholder="希望一切顺利..."
            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 mb-4"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleMakeWish()}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowWishInput(false)}
              className="flex-1 py-2 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-lg text-sm"
            >
              取消
            </button>
            <button
              onClick={handleMakeWish}
              className="flex-1 py-2 bg-purple-600/60 hover:bg-purple-500/60 text-white rounded-lg text-sm"
            >
              发送愿望
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// AR投影模式
function ARProjectionView({
  videoRef,
  permissionGranted,
  permissionDenied,
  onBack,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  permissionGranted: boolean
  permissionDenied: boolean
  onBack: () => void
}) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [planetPosition, setPlanetPosition] = useState({ x: 50, y: 50 })

  const planets = [
    { id: 'mercury', name: '水星', emoji: '☿️', color: '#a8a8a8', description: '思维与沟通之星' },
    { id: 'venus', name: '金星', emoji: '♀', color: '#ffd700', description: '情感与美之星' },
    { id: 'mars', name: '火星', emoji: '♂', color: '#ff6b6b', description: '行动与勇气之星' },
    { id: 'jupiter', name: '木星', emoji: '♃', color: '#4ecdc4', description: '幸运与成长之星' },
    { id: 'saturn', name: '土星', emoji: '♄', color: '#f9d423', description: '责任与考验之星' },
    { id: 'uranus', name: '天王星', emoji: '⛢', color: '#60a5fa', description: '变革与创新之星' },
    { id: 'neptune', name: '海王星', emoji: '♆', color: '#6366f1', description: '梦想与直觉之星' },
    { id: 'sun', name: '太阳', emoji: '☉', color: '#fbbf24', description: '生命与力量之源' },
  ]

  useEffect(() => {
    if (permissionGranted) {
      const handleClick = (e: MouseEvent) => {
        if (selectedPlanet) {
          const rect = (videoRef.current as HTMLVideoElement)?.getBoundingClientRect()
          if (rect) {
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            setPlanetPosition({ x, y })
          }
        }
      }
      window.addEventListener('click', handleClick)
      return () => window.removeEventListener('click', handleClick)
    }
  }, [selectedPlanet, permissionGranted, videoRef])

  return (
    <div className="relative z-10 w-full h-[70vh]">
      {permissionDenied ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80 rounded-2xl">
          <span className="text-5xl mb-4">📷</span>
          <h3 className="text-xl font-semibold text-white mb-2">无法访问摄像头</h3>
          <p className="text-white/60 text-sm text-center max-w-xs mb-4">
            请在浏览器设置中允许访问摄像头，然后重试
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-lg text-sm"
          >
            返回
          </button>
        </div>
      ) : permissionGranted ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-2xl"
          />

          {/* 行星选择器 */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
            {planets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlanet(selectedPlanet === p.id ? null : p.id)}
                className={`px-3 py-2 rounded-full text-xl transition-all ${
                  selectedPlanet === p.id
                    ? 'bg-white/30 scale-110'
                    : 'bg-slate-900/60 hover:bg-slate-800/60'
                }`}
                style={{ border: selectedPlanet === p.id ? `2px solid ${p.color}` : 'none' }}
              >
                {p.emoji}
              </button>
            ))}
          </div>

          {/* 选中的行星 */}
          {selectedPlanet && (() => {
            const planet = planets.find(p => p.id === selectedPlanet)!
            return (
              <div
                className="absolute text-6xl transform -translate-x-1/2 -translate-y-1/2 animate-bounce pointer-events-none"
                style={{ left: `${planetPosition.x}%`, top: `${planetPosition.y}%` }}
              >
                {planet.emoji}
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 rounded-lg text-xs whitespace-nowrap"
                  style={{ backgroundColor: `${planet.color}90` }}
                >
                  <span className="text-white font-medium">{planet.name}</span>
                </div>
              </div>
            )
          })()}

          <p className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm bg-slate-900/60 px-4 py-2 rounded-lg">
            点击行星，再点击画面放置
          </p>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-900/80 rounded-2xl">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🪐</div>
            <p className="text-white/60">正在启动摄像头...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 星空导览模式
function StarGuideView({ onBack }: { onBack: () => void }) {
  const [direction, setDirection] = useState(0)
  const [viewing, setViewing] = useState<'constellation' | 'horoscope' | 'orbit'>('constellation')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDirection(e.alpha)
      }
    }
    window.addEventListener('deviceorientation', handleDeviceOrientation)
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation)
  }, [])

  const constellations = [
    { name: '白羊座', period: '3.21-4.19', element: '火', symbol: '♈', desc: '勇敢开拓，第一星象' },
    { name: '金牛座', period: '4.20-5.20', element: '土', symbol: '♉', desc: '稳健务实，财富之星' },
    { name: '双子座', period: '5.21-6.21', element: '风', symbol: '♊', desc: '灵活多变，沟通之能' },
    { name: '巨蟹座', period: '6.22-7.22', element: '水', symbol: '♋', desc: '温柔守护，情感之源' },
    { name: '狮子座', period: '7.23-8.22', element: '火', symbol: '♌', desc: '王者风范，光芒之耀' },
    { name: '处女座', period: '8.23-9.22', element: '土', symbol: '♍', desc: '完美追求，智慧之星' },
  ]

  const horoscopes = [
    { type: '今日运势', color: '#fbbf24', icon: '☀️' },
    { type: '本周运势', color: '#6366f1', icon: '🌟' },
    { type: '本月运势', color: '#ec4899', icon: '🌙' },
    { type: '年度运势', color: '#10b981', icon: '✨' },
  ]

  return (
    <div ref={containerRef} className="relative z-10 w-full h-[70vh] overflow-hidden">
      {/* 星空背景 */}
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{
          background: `
            radial-gradient(1px 1px at 10% 20%, white, transparent),
            radial-gradient(1px 1px at 30% 60%, white, transparent),
            radial-gradient(1px 1px at 50% 30%, white, transparent),
            radial-gradient(1px 1px at 70% 70%, white, transparent),
            radial-gradient(1px 1px at 90% 40%, white, transparent),
            radial-gradient(2px 2px at 20% 80%, rgba(255,255,255,0.5), transparent),
            radial-gradient(2px 2px at 60% 10%, rgba(255,255,255,0.5), transparent)
          `,
          backgroundSize: '250px 250px',
          transform: `rotateY(${(direction % 360) * 0.3}deg)`,
        }}
      />

      {/* 方向指示 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        <span className="text-2xl">🧭</span>
        <p>方位角: {Math.round(direction % 360)}°</p>
      </div>

      {/* 视图切换 */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[
          { key: 'constellation' as const, label: '星座', icon: '⭐' },
          { key: 'horoscope' as const, label: '运势', icon: '🔮' },
          { key: 'orbit' as const, label: '轨道', icon: '🪐' },
        ].map((v) => (
          <button
            key={v.key}
            onClick={() => setViewing(v.key)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              viewing === v.key
                ? 'bg-amber-500/60 text-white'
                : 'bg-slate-800/60 text-white/60 hover:bg-slate-700/60'
            }`}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="absolute inset-x-4 bottom-20 top-32 overflow-y-auto">
        {viewing === 'constellation' && (
          <div className="grid grid-cols-2 gap-3">
            {constellations.map((c) => (
              <div
                key={c.name}
                className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{c.symbol}</span>
                  <span className="text-white font-medium">{c.name}</span>
                </div>
                <p className="text-white/50 text-xs mb-1">{c.period}</p>
                <p className="text-amber-300/80 text-xs mb-1">{c.element}象星座</p>
                <p className="text-white/60 text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
        )}

        {viewing === 'horoscope' && (
          <div className="space-y-3">
            {horoscopes.map((h) => (
              <button
                key={h.type}
                className="w-full p-4 rounded-xl border border-white/10 text-left transition-all hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${h.color}30, ${h.color}10)` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{h.icon}</span>
                  <div>
                    <h4 className="text-white font-medium">{h.type}</h4>
                    <p className="text-white/60 text-sm">点击查看详细分析</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {viewing === 'orbit' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="relative w-48 h-48 mb-6">
              {/* 简化的轨道图 */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-4 rounded-full border border-amber-500/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              <div className="absolute inset-8 rounded-full border border-blue-500/30 animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-12 rounded-full border border-green-500/30 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
              <div className="absolute inset-16 rounded-full border border-pink-500/30 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
            </div>
            <p className="text-white/70 text-sm">行星轨道运行图</p>
            <p className="text-white/50 text-xs mt-2">转动手机查看不同角度</p>
          </div>
        )}
      </div>

      <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-sm">
        转动手机查看不同方向星空 🔭
      </p>
    </div>
  )
}
