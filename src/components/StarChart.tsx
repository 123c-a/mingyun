import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanetVisual from './PlanetVisual'

interface Planet {
  id: string
  name: string
  type: 'sun' | 'moon' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
  size: number
  orbitRadius: number
  orbitSpeed: number
  route: string
  description: string
}

interface OrbitingPlanetProps {
  planet: Planet
}

function OrbitingPlanet({ planet }: OrbitingPlanetProps) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    navigate(planet.route)
  }

  return (
    <div
      className="absolute"
      style={{
        width: `${planet.orbitRadius * 2}px`,
        height: `${planet.orbitRadius * 2}px`,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: `orbit-${planet.id.replace(/-/g, '')} ${20 / planet.orbitSpeed}s linear infinite`,
        pointerEvents: 'none'
      }}
    >
      {/* 轨道环 */}
      <div
        className="absolute rounded-full border border-amber-500/15"
        style={{
          width: '100%',
          height: '100%',
          left: 0,
          top: 0
        }}
      />

      {/* 星球 */}
      <div
        className="absolute cursor-pointer transition-transform duration-300"
        style={{
          left: '50%',
          top: 0,
          transform: `translateX(-50%) translateY(-${planet.size / 2}px) scale(${isHovered ? 1.3 : 1})`,
          width: `${planet.size}px`,
          height: `${planet.size}px`,
          pointerEvents: 'auto'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <PlanetVisual type={planet.type} size={planet.size} />

        {/* 悬停信息 */}
        {isHovered && (
          <div className="absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 mt-2 border border-amber-500/30 z-30">
            <p className="text-amber-200 font-bold text-sm">{planet.name}</p>
            <p className="text-amber-100/70 text-xs">{planet.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StarChart() {
  const planets: Planet[] = [
    {
      id: 'observatory',
      name: '观测站',
      type: 'moon',
      size: 45,
      orbitRadius: 180,
      orbitSpeed: 1.2,
      route: '/observatory',
      description: '观测平行宇宙'
    },
    {
      id: 'universe-library',
      name: '宇宙库',
      type: 'mercury',
      size: 40,
      orbitRadius: 260,
      orbitSpeed: 1.0,
      route: '/universe',
      description: '收藏的宇宙'
    },
    {
      id: 'timeline',
      name: '命运轨迹',
      type: 'saturn',
      size: 50,
      orbitRadius: 340,
      orbitSpeed: 0.8,
      route: '/timeline',
      description: '时间命运长河'
    },
    {
      id: 'explorer',
      name: '宇宙探索',
      type: 'mars',
      size: 40,
      orbitRadius: 420,
      orbitSpeed: 0.6,
      route: '/explorer',
      description: '探索无尽宇宙'
    },
    {
      id: 'master-os',
      name: '宇宙大师',
      type: 'jupiter',
      size: 60,
      orbitRadius: 500,
      orbitSpeed: 0.4,
      route: '/master-os',
      description: '全功能操作系统'
    },
    {
      id: 'settings',
      name: '系统设置',
      type: 'uranus',
      size: 45,
      orbitRadius: 580,
      orbitSpeed: 0.3,
      route: '/settings',
      description: '个性化配置'
    },
    {
      id: 'earth-online',
      name: '地球 · 一切发生之处',
      type: 'earth',
      size: 55,
      orbitRadius: 680,
      orbitSpeed: 0.25,
      route: '/earth-online',
      description: '世界 / 拼搭 / 言出法随'
    },
    {
      id: 'voxel-world',
      name: '像素世界',
      type: 'earth',
      size: 40,
      orbitRadius: 760,
      orbitSpeed: 0.2,
      route: '/voxel-world',
      description: 'Minecraft 风格体素世界'
    }
  ]

  return (
    <div className="w-full h-full relative">
      {/* 中心太阳 - 命运核心 */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <PlanetVisual type="sun" size={120} />
        <p className="text-center text-amber-200 font-bold mt-4 text-2xl drop-shadow-lg">命运核心</p>
      </div>

      {/* 公转星球 */}
      {planets.map(planet => (
        <OrbitingPlanet key={planet.id} planet={planet} />
      ))}

      {/* 预留空轨道 */}
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gray-500/20"
        style={{ width: '680px', height: '680px' }}
      >
        <div className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 text-gray-500 text-xs whitespace-nowrap">
          🔮 待定
        </div>
      </div>
      <div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gray-500/20"
        style={{ width: '780px', height: '780px' }}
      >
        <div className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 text-gray-500 text-xs whitespace-nowrap">
          ⭐ 待定
        </div>
      </div>

      {/* CSS动画 */}
      <style>{`
        ${planets.map(planet => `
          @keyframes orbit-${planet.id.replace(/-/g, '')} {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `).join('\n')}
      `}</style>
    </div>
  )
}
