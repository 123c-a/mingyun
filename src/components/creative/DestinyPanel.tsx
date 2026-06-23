import { useState, useEffect } from 'react'
import { analyzeDestiny, generateDestinyScene, generateFortuneReading, DestinyAnalysis, DestinyScene } from '../../lib/astrologyApi'
import { generateDestinyWorld, renderWorldToBlocks, DestinyWorld, WUXING_WORLD_CONFIG } from '../../lib/destinyWorldGenerator'
import { naturalToMingliPrompt, quickNaturalToMingli, generateScenePrompt } from '../../lib/naturalLanguageToMingli'
import { useVoxelWorldStore, BLOCK_DEFS, type BlockType } from '../voxel/voxelWorldStore'

export function DestinyPanel() {
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 20)
  const [birthMonth, setBirthMonth] = useState(1)
  const [birthDay, setBirthDay] = useState(1)
  const [birthHour, setBirthHour] = useState(12)
  const [analysis, setAnalysis] = useState<DestinyAnalysis | null>(null)
  const [scene, setScene] = useState<DestinyScene | null>(null)
  const [fortune, setFortune] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scenePrompt, setScenePrompt] = useState('')
  const [isGeneratingWorld, setIsGeneratingWorld] = useState(false)
  const [world, setWorld] = useState<DestinyWorld | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [panelWidth, setPanelWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mingliPrompt, setMingliPrompt] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const voxelStore = useVoxelWorldStore()

  // 自然语言转命理提示词
  const handleConvertToMingli = async () => {
    if (!scenePrompt.trim()) return
    setIsConverting(true)
    try {
      const result = await naturalToMingliPrompt(scenePrompt)
      setMingliPrompt(result)
    } catch (error) {
      console.error('Conversion error:', error)
      // 降级到快速转换
      setMingliPrompt(quickNaturalToMingli(scenePrompt))
    } finally {
      setIsConverting(false)
    }
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    const startX = e.clientX
    const startWidth = panelWidth
    
    const handleResize = (e: MouseEvent) => {
      const newWidth = Math.max(280, Math.min(600, startWidth - (e.clientX - startX)))
      setPanelWidth(newWidth)
    }
    
    const handleResizeEnd = () => {
      setIsResizing(false)
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', handleResizeEnd)
    }
    
    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', handleResizeEnd)
  }

  useEffect(() => {
    generateFortuneReading().then(setFortune)
  }, [])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeDestiny(birthYear, birthMonth, birthDay, birthHour)
      setAnalysis(result)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateScene = async () => {
    if (!analysis) return
    const prompt = scenePrompt || `根据${analysis.zodiac}生肖和${analysis.element}元素生成一个命理场景`
    const result = await generateDestinyScene(prompt)
    setScene(result)
    buildScene(result)
  }

  const handleGenerateWorld = async () => {
    setIsGeneratingWorld(true)
    setGenerationProgress(0)
    
    try {
      setGenerationProgress(10)
      const destinyWorld = await generateDestinyWorld(birthYear, birthMonth, birthDay, birthHour)
      setWorld(destinyWorld)
      setGenerationProgress(50)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const blocks = renderWorldToBlocks(destinyWorld)
      setGenerationProgress(80)
      
      voxelStore.clearWorld()
      const newBlocks = new Map<string, { type: BlockType; placed: boolean }>()
      
      blocks.forEach((block, index) => {
        const key = `${block.x},${block.y},${block.z}`
        newBlocks.set(key, { type: block.type as BlockType, placed: true })
        
        if (index % 50 === 0) {
          setGenerationProgress(80 + Math.floor((index / blocks.length) * 20))
        }
      })
      
      localStorage.setItem('voxel_blocks', JSON.stringify(Array.from(newBlocks.entries())))
      voxelStore.setBlocks(newBlocks)
      setGenerationProgress(100)
    } catch (error) {
      console.error('World generation error:', error)
    } finally {
      setIsGeneratingWorld(false)
    }
  }

  const buildScene = (destinyScene: DestinyScene) => {
    const { structure, blocks } = destinyScene
    const sizeMap = { small: 5, medium: 10, large: 15 }
    const size = sizeMap[structure.size]
    
    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        const dist = Math.sqrt(x * x + z * z)
        if (dist <= size) {
          const groundBlock = blocks.includes('grass') ? 'grass' : 'dirt'
          placeBlockAt(x, 0, z, groundBlock)
          
          if (structure.type === 'mountain') {
            const height = Math.floor((1 - dist / size) * size * 1.5)
            for (let y = 1; y <= height; y++) {
              const block = y === height ? 'snow' : (y > height - 2 ? 'stone' : 'dirt')
              placeBlockAt(x, y, z, block)
            }
            if (x === 0 && z === 0) {
              placeBlockAt(0, height + 1, 0, 'constellation')
              placeBlockAt(0, height + 2, 0, 'ziwei_tianshu')
            }
          }
          
          if (structure.type === 'river') {
            if (Math.abs(z) <= 1 && x >= -size && x <= size) {
              placeBlockAt(x, 1, z, 'water')
              placeBlockAt(x, 2, z, 'water')
            }
            if (x % 3 === 0 && z === 0) {
              placeBlockAt(x, 3, z, 'crystal_ball')
            }
          }
          
          if (structure.type === 'forest') {
            if (dist % 2 === 1 && dist > 2) {
              for (let y = 1; y <= 4; y++) {
                placeBlockAt(x, y, z, 'wood')
              }
              for (let dy = 1; dy <= 3; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  for (let dz = -1; dz <= 1; dz++) {
                    if (Math.abs(dx) + Math.abs(dz) + dy <= 3) {
                      placeBlockAt(x + dx, 4 + dy, z + dz, 'leaves')
                    }
                  }
                }
              }
            }
          }
          
          if (structure.type === 'temple') {
            if (Math.abs(x) <= 2 && Math.abs(z) <= 2) {
              const maxY = Math.abs(x) <= 1 && Math.abs(z) <= 1 ? 6 : 4
              for (let y = 1; y <= maxY; y++) {
                placeBlockAt(x, y, z, 'brick')
              }
              if (x === 0 && z === 0 && maxY === 6) {
                placeBlockAt(0, 7, 0, 'gold')
                placeBlockAt(0, 8, 0, 'bagua_qian')
              }
            }
          }
          
          if (structure.type === 'garden') {
            if (dist > 0 && dist <= size) {
              if (dist % 2 === 0) {
                placeBlockAt(x, 1, z, 'flower_red')
              } else {
                placeBlockAt(x, 1, z, 'flower_yellow')
              }
            }
            if (x === 0 && z === 0) {
              placeBlockAt(0, 1, 0, 'heart_block')
              placeBlockAt(0, 2, 0, 'crystal_ball')
            }
          }
        }
      }
    }
  }

  const placeBlockAt = (x: number, y: number, z: number, blockType: string) => {
    const key = `${x},${y},${z}`
    const newBlocks = new Map(voxelStore.blocks)
    newBlocks.set(key, { type: blockType as any, placed: true })
    localStorage.setItem('voxel_blocks', JSON.stringify(Array.from(newBlocks.entries())))
    voxelStore.setBlocks(newBlocks)
  }

  const ElementColors: Record<string, string> = {
    '金': '#c8c8d8',
    '木': '#4a883a',
    '水': '#4488cc',
    '火': '#ff4444',
    '土': '#a08060'
  }

  return (
    <div style={{
      position: 'absolute', top: 16, right: 16, zIndex: 100,
      width: isCollapsed ? 50 : panelWidth,
      maxHeight: isCollapsed ? 50 : '80vh',
      overflowY: isCollapsed ? 'hidden' : 'auto',
      overflowX: 'hidden',
      background: 'rgba(15, 10, 30, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: 20,
      padding: isCollapsed ? 10 : 20,
      border: '1px solid rgba(255, 179, 217, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      transition: 'all 0.3s ease',
    }}>
      {/* 拖拽调整大小的手柄 - 仅在展开时显示 */}
      {!isCollapsed && (
        <div 
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            cursor: 'ew-resize',
            background: isResizing ? 'rgba(255, 179, 217, 0.3)' : 'transparent',
            borderRadius: '4px 0 0 4px',
            transition: 'background 0.2s',
          }}
          title="拖拽调整宽度"
        />
      )}
      
      {/* 折叠/展开按钮 */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: isCollapsed ? 'relative' : 'absolute',
          right: isCollapsed ? 'auto' : -8,
          top: isCollapsed ? 'auto' : 8,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'rgba(255, 179, 217, 0.2)',
          border: '1px solid rgba(255, 179, 217, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 16,
          color: '#ffd8e8',
          transition: 'all 0.2s',
          zIndex: 10,
        }}
        title={isCollapsed ? '展开面板' : '折叠面板'}
      >
        {isCollapsed ? '🔮' : '✕'}
      </div>
      
      {/* 折叠状态下只显示图标 */}
      {isCollapsed ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 30,
          fontSize: 24,
        }}>
          🔮
        </div>
      ) : (
        <>
          <h2 style={{
            fontSize: 20, fontWeight: 700, color: '#ffd8e8',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
            textShadow: '0 0 10px rgba(255, 179, 217, 0.5)'
          }}>
            <span>🔮</span> 命理人生沙盒
          </h2>

      {fortune && (
        <div style={{
          background: 'rgba(255, 179, 217, 0.1)',
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
          color: '#ffd8e8',
          fontSize: 13,
          lineHeight: 1.6,
          borderLeft: '3px solid #ff99cc'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>✨ 今日运势</div>
          {fortune}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ color: '#ffd8e8', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          📅 输入生辰信息
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <div>
            <label style={{ fontSize: 11, color: '#a898b8', display: 'block', marginBottom: 4 }}>年</label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              style={{
                width: '100%', padding: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                textAlign: 'center'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#a898b8', display: 'block', marginBottom: 4 }}>月</label>
            <input
              type="number"
              value={birthMonth}
              onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, Number(e.target.value))))}
              style={{
                width: '100%', padding: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                textAlign: 'center'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#a898b8', display: 'block', marginBottom: 4 }}>日</label>
            <input
              type="number"
              value={birthDay}
              onChange={(e) => setBirthDay(Math.min(31, Math.max(1, Number(e.target.value))))}
              style={{
                width: '100%', padding: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                textAlign: 'center'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#a898b8', display: 'block', marginBottom: 4 }}>时</label>
            <input
              type="number"
              value={birthHour}
              onChange={(e) => setBirthHour(Math.min(23, Math.max(0, Number(e.target.value))))}
              style={{
                width: '100%', padding: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                textAlign: 'center'
              }}
            />
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          style={{
            width: '100%', marginTop: 12, padding: 10,
            background: 'linear-gradient(135deg, #ff88cc, #cc66ff)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(255, 136, 204, 0.4)',
            opacity: isAnalyzing ? 0.7 : 1
          }}
        >
          {isAnalyzing ? '🔮 分析中...' : '🔮 测算八字'}
        </button>
      </div>

      {analysis && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ color: '#ffd8e8', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
            📊 命理分析结果
          </h3>
          
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            marginBottom: 12
          }}>
            <div style={{
              width: 60, height: 60,
              borderRadius: 50,
              background: ElementColors[analysis.element] || '#888',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
              boxShadow: `0 0 20px ${ElementColors[analysis.element] || '#888'}88`
            }}>
              {analysis.element}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                {analysis.zodiac}生肖
              </div>
              <div style={{ fontSize: 12, color: '#a898b8' }}>
                日主五行：{analysis.element}
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 179, 217, 0.05)',
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            color: '#e8d8e8',
            fontSize: 13,
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 600, color: '#ffd8e8', marginBottom: 4 }}>🎭 性格特点</div>
            {analysis.personality}
          </div>

          <div style={{
            background: 'rgba(136, 200, 255, 0.05)',
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            color: '#d8e8f8',
            fontSize: 13,
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 600, color: '#88c8ff', marginBottom: 4 }}>🌟 运势展望</div>
            {analysis.fortune}
          </div>

          <div style={{
            background: 'rgba(255, 200, 136, 0.05)',
            borderRadius: 12,
            padding: 12,
            color: '#f8e8d8',
            fontSize: 13,
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 600, color: '#ffc888', marginBottom: 4 }}>💡 温馨建议</div>
            {analysis.advice}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#a898b8', marginBottom: 8 }}>🍀 幸运方块</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {analysis.luckyBlocks.map((blockType) => {
                const def = BLOCK_DEFS[blockType as keyof typeof BLOCK_DEFS]
                return def ? (
                  <div
                    key={blockType}
                    style={{
                      width: 40, height: 40,
                      borderRadius: 8,
                      background: def.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      border: '2px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      transform: 'scale(1)',
                      boxShadow: def.emissive ? `0 0 10px ${def.color}88` : 'none'
                    }}
                    title={def.label}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {def.emoji}
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 style={{ color: '#ffd8e8', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          🏗️ 生成命理场景
        </h3>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            value={scenePrompt}
            onChange={(e) => {
              setScenePrompt(e.target.value)
              setMingliPrompt('') // 清空转换结果
            }}
            placeholder="描述你想要的场景..."
            style={{
              width: '100%', padding: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 13,
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleConvertToMingli}
            disabled={isConverting || !scenePrompt.trim()}
            style={{
              width: '100%', marginTop: 8, padding: 8,
              background: isConverting ? '#666' : 'linear-gradient(135deg, #ff88cc, #cc66aa)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: isConverting || !scenePrompt.trim() ? 'not-allowed' : 'pointer',
              opacity: isConverting ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isConverting ? '✨ 转换中...' : '🌟 转换为命理风格'}
          </button>
        </div>
        
        {/* 转换后的命理提示词显示 */}
        {mingliPrompt && (
          <div style={{
            marginBottom: 10,
            padding: 10,
            background: 'rgba(255, 136, 204, 0.1)',
            borderRadius: 10,
            border: '1px solid rgba(255, 136, 204, 0.3)',
          }}>
            <div style={{ fontSize: 11, color: '#ff88cc', marginBottom: 4 }}>
              📜 命理风格描述：
            </div>
            <div style={{ fontSize: 12, color: '#ffd8e8', lineHeight: 1.5 }}>
              {mingliPrompt}
            </div>
          </div>
        )}
        
        <button
          onClick={handleGenerateScene}
          style={{
            width: '100%', padding: 10,
            background: 'linear-gradient(135deg, #88ccff, #66aaff)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(136, 204, 255, 0.4)'
          }}
        >
          ✨ 生成场景
        </button>
        
        <button
          onClick={handleGenerateWorld}
          disabled={isGeneratingWorld}
          style={{
            width: '100%', padding: 10,
            background: isGeneratingWorld ? '#666' : 'linear-gradient(135deg, #ffcc66, #ff9933)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: isGeneratingWorld ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: isGeneratingWorld ? 'none' : '0 4px 15px rgba(255, 204, 102, 0.4)',
            marginTop: 10,
            opacity: isGeneratingWorld ? 0.8 : 1
          }}
        >
          {isGeneratingWorld ? `⏳ 生成中... ${generationProgress}%` : '🌍 生成完整命理世界'}
        </button>
        
        {isGeneratingWorld && (
          <div style={{ marginTop: 10 }}>
            <div style={{
              height: 4,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${generationProgress}%`,
                background: 'linear-gradient(90deg, #ffcc66, #ff9933)',
                borderRadius: 2,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      {scene && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: 'rgba(136, 204, 255, 0.1)',
          borderRadius: 12,
          border: '1px solid rgba(136, 204, 255, 0.3)'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#88c8ff', marginBottom: 4 }}>
            {scene.title}
          </div>
          <div style={{ fontSize: 12, color: '#a8c8e8', marginBottom: 8 }}>
            {scene.description}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {scene.blocks.slice(0, 8).map((blockType) => {
              const def = BLOCK_DEFS[blockType as keyof typeof BLOCK_DEFS]
              return def ? (
                <span
                  key={blockType}
                  style={{
                    padding: '4px 8px',
                    background: `${def.color}33`,
                    borderRadius: 6,
                    fontSize: 11,
                    color: '#d8e8f8'
                  }}
                >
                  {def.emoji} {def.label}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      <div style={{
        marginTop: 16,
        padding: 12,
        background: 'rgba(255, 179, 217, 0.05)',
        borderRadius: 12,
        border: '1px dashed rgba(255, 179, 217, 0.3)'
      }}>
        <div style={{ fontSize: 11, color: '#a898b8', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: '#ffd8e8', marginBottom: 4 }}>💫 命理方块说明</div>
          <div>• <span style={{ color: '#ff6644' }}>火相🔥</span>、<span style={{ color: '#4488cc' }}>水相💧</span>、<span style={{ color: '#6ba84a' }}>土相🌿</span>、<span style={{ color: '#e8e8ff' }}>风相💨</span> - 西方占星四元素</div>
          <div>• <span style={{ color: '#ffdd88' }}>☰乾</span>☷坤☵坎☲离☳震☴巽☶艮☱兑 - 八卦</div>
          <div>• 🐀鼠🐂牛🐅虎🐇兔🐉龙🐍蛇🐴马🐑羊🐒猴🐓鸡🐕狗🐖猪 - 十二生肖</div>
          <div>• ⚔️金💧水🌲木🔥火🪨土 - 五行元素</div>
          <div>• 🌌天机星✨天枢星🌟天府星 - 紫微斗数星辰</div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}