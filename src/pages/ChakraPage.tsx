import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { planetNames, getComboConfig } from '../data/comboConfigs'
import { stringToSeed, generateComboName, generateThemeColors, chakras } from '../lib/comboGenerator'

function ChakraOrb({ color, intensity, position }: { color: string; intensity: number; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * intensity) * 0.1
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -state.clock.elapsedTime * 0.3
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      glowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.5} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      <pointLight color={color} intensity={intensity} distance={3} />
    </group>
  )
}

export default function ChakraPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()
  const [chakraStates, setChakraStates] = useState<number[]>([5, 5, 5, 5, 5, 5, 5])
  const [selectedChakra, setSelectedChakra] = useState<number | null>(null)
  const [balanceScore, setBalanceScore] = useState(0)

  const validPlanets = useMemo(() => {
    return comboPath.split('-').filter(id => planetNames[id] || id === 'pluto')
  }, [comboPath])

  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)

  const comboInfo = useMemo(() => {
    if (existingConfig) return { name: existingConfig.name }
    const { name } = generateComboName(validPlanets, seed)
    return { name }
  }, [validPlanets, seed, existingConfig])

  const theme = useMemo(() => {
    if (existingConfig) {
      return {
        primary: existingConfig.primaryColor,
        secondary: existingConfig.secondaryColor,
        glowColor: `${existingConfig.primaryColor}40`,
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  useEffect(() => {
    const avg = chakraStates.reduce((a, b) => a + b, 0) / chakraStates.length
    const variance = chakraStates.reduce((a, b) => a + Math.abs(b - avg), 0) / chakraStates.length
    setBalanceScore(Math.round((10 - variance) * 10))
  }, [chakraStates])

  const updateChakra = (index: number, value: number) => {
    const newStates = [...chakraStates]
    newStates[index] = value
    setChakraStates(newStates)
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* 3D 场景 */}
      <div className="fixed inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <color attach="background" args={['#050510']} />
          <fog attach="fog" args={['#050510', 10, 30]} />

          {chakras.map((chakra, i) => (
            <ChakraOrb
              key={i}
              color={chakra.color}
              intensity={chakraStates[i] / 10}
              position={[0, 3 - i * 1, 0]}
            />
          ))}

          {/* 中央能量柱 */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 8, 8]} />
            <meshBasicMaterial
              color={theme.primary}
              transparent
              opacity={0.3}
            />
          </mesh>
        </Canvas>
      </div>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            ← 返回
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-wider" style={{ color: theme.primary }}>💫 脉轮平衡</h1>
            <p className="text-xs opacity-60">{comboInfo.name}</p>
          </div>
          <div
            className="px-6 py-3 rounded-full text-sm backdrop-blur-xl"
            style={{ background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}20)` }}
          >
            平衡度: {balanceScore}%
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 脉轮列表 */}
          <div className="space-y-4">
            {chakras.map((chakra, i) => (
              <div
                key={i}
                onClick={() => setSelectedChakra(selectedChakra === i ? null : i)}
                className={`rounded-2xl p-6 backdrop-blur-xl transition-all cursor-pointer ${
                  selectedChakra === i ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
                style={{
                  background: selectedChakra === i
                    ? `linear-gradient(135deg, ${chakra.color}20, ${theme.primary}10)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedChakra === i ? chakra.color + '60' : theme.primary + '20'}`,
                  boxShadow: selectedChakra === i ? `0 0 40px ${chakra.color}30` : 'none',
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: `radial-gradient(circle, ${chakra.color}40, transparent)`,
                      boxShadow: `0 0 20px ${chakra.color}40`,
                    }}
                  >
                    {chakra.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium" style={{ color: chakra.color }}>{chakra.name}</h3>
                    <p className="text-xs opacity-60">{chakra.location}</p>
                  </div>
                  <div className="text-2xl font-light">{chakraStates[i]}</div>
                </div>

                {/* 滑块 */}
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={chakraStates[i]}
                  onChange={(e) => updateChakra(i, parseInt(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `${chakra.color}40`, accentColor: chakra.color }}
                />

                {/* 功能描述 */}
                <p className="text-xs opacity-60 mt-3">{chakra.function}</p>
              </div>
            ))}
          </div>

          {/* 选中脉轮详情 */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            {selectedChakra !== null ? (
              <div
                className="rounded-3xl p-8 backdrop-blur-2xl"
                style={{
                  background: `linear-gradient(135deg, ${chakras[selectedChakra].color}15, ${theme.primary}10)`,
                  border: `2px solid ${chakras[selectedChakra].color}40`,
                  boxShadow: `0 0 80px ${chakras[selectedChakra].color}30`,
                }}
              >
                <div className="text-center mb-6">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4"
                    style={{
                      background: `radial-gradient(circle, ${chakras[selectedChakra].color}40, transparent)`,
                      boxShadow: `0 0 40px ${chakras[selectedChakra].color}50`,
                    }}
                  >
                    {chakras[selectedChakra].icon}
                  </div>
                  <h2 className="text-2xl font-light" style={{ color: chakras[selectedChakra].color }}>
                    {chakras[selectedChakra].name}
                  </h2>
                  <p className="text-sm opacity-60">{chakras[selectedChakra].location}</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs opacity-50 mb-1">能量功能</p>
                    <p className="opacity-80">{chakras[selectedChakra].function}</p>
                  </div>

                  <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs opacity-50 mb-1">激活建议</p>
                    <p className="opacity-80">
                      {selectedChakra === 0 && '赤脚走路在大地上，进行户外活动，练习扎根冥想。'}
                      {selectedChakra === 1 && '释放创造力，进行舞蹈或艺术创作，拥抱感官体验。'}
                      {selectedChakra === 2 && '设定边界，表达个人意志，进行力量瑜伽。'}
                      {selectedChakra === 3 && '开放心扉，给予和接受无条件的爱，练习慈悲冥想。'}
                      {selectedChakra === 4 && '真实表达，倾听并说出真相，进行喉音冥想。'}
                      {selectedChakra === 5 && '发展直觉，相信内在智慧，进行可视化冥想。'}
                      {selectedChakra === 6 && '连接宇宙意识，超越二元对立，练习合一冥想。'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl p-8 text-center backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-6xl mb-4 opacity-30">👆</div>
                <p className="text-sm opacity-60">点击左侧脉轮查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const planetColors: Record<string, string> = {
  mercury: '#8b8bf5', venus: '#f5d0e0', earth: '#4ade80', mars: '#f87171',
  jupiter: '#fbbf24', saturn: '#d4a574', uranus: '#67e8f9', neptune: '#6366f1', pluto: '#a855f7',
}
