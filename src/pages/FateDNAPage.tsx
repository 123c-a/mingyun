/**
 * 命运DNA解读页面
 * DNA图谱 + 数字人实时解读
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import FateDNA from '../components/FateDNA'
import { speech } from '../store/speechStore'
import { useUniverseStore } from '../store/universeStore'

export default function FateDNAPage() {
  const navigate = useNavigate()
  const { fateProfile } = useUniverseStore()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentGene, setCurrentGene] = useState<string | null>(null)
  const [interpretation, setInterpretation] = useState<string[]>([])
  const interpretationRef = useRef<HTMLDivElement>(null)

  // 生成解读内容
  useEffect(() => {
    const interpretations = [
      '正在分析你的命运DNA结构...',
      '检测到8个核心命运基因片段',
      '事业基因活跃度中等，建议加强职业规划',
      '情感基因强度较高，人际关系运势良好',
      '健康基因表现优秀，生命力充沛',
      '创造基因异常活跃，艺术天赋突出',
      '智慧基因稳定，学习能力持续',
      '命运综合指数良好，整体运势平稳上升',
      '建议：发挥创造基因优势，探索艺术领域',
    ]
    setInterpretation(interpretations)
  }, [])

  // 自动播放解读
  const playInterpretation = async () => {
    setIsSpeaking(true)
    
    for (let i = 0; i < interpretation.length; i++) {
      setInterpretation(prev => prev.slice(0, i + 1))
      setCurrentGene(interpretation[i])
      
      speech.say(interpretation[i], 'normal', 'calm', 'fateDNA')
      
      // 等待语音结束
      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (!speech.isSpeaking()) {
            clearInterval(check)
            resolve()
          }
        }, 200)
      })
      
      // 短暂停顿
      await new Promise(r => setTimeout(r, 300))
    }
    
    setIsSpeaking(false)
    setCurrentGene(null)
  }

  // 滚动到最新解读
  useEffect(() => {
    if (interpretationRef.current) {
      interpretationRef.current.scrollTop = interpretationRef.current.scrollHeight
    }
  }, [interpretation])

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #0a1a2e 100%)',
      }}
    >
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/observatory')}
            className="flex items-center gap-2 text-purple-300/80 hover:text-cyan-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回观测站
          </button>

          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
            命运DNA图谱
          </h1>

          <div className="text-xs text-slate-500">
            基因解码 · 命运可视化
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🧬</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              你的命运DNA
            </h2>
            <p className="text-sm text-slate-400">
              每个人都有独特的命运基因组合，决定你的人生轨迹
            </p>
          </div>

          {/* DNA图谱 + 解读 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：DNA图谱 */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            >
              <div className="text-sm font-bold text-purple-300 mb-4">
                命运基因结构
              </div>
              <FateDNA />
            </div>

            {/* 右侧：解读面板 */}
            <div
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(56,189,248,0.3)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-cyan-300">
                  基因解读报告
                </div>
                <button
                  onClick={playInterpretation}
                  disabled={isSpeaking}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  style={{
                    background: isSpeaking
                      ? 'rgba(168,85,247,0.3)'
                      : 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(56,189,248,0.3))',
                    border: '1px solid rgba(168,85,247,0.5)',
                    color: '#e2e8f0',
                  }}
                >
                  {isSpeaking ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      解读中...
                    </span>
                  ) : (
                    '开始解读'
                  )}
                </button>
              </div>

              {/* 解读内容 */}
              <div
                ref={interpretationRef}
                className="flex-1 overflow-y-auto space-y-2 min-h-[300px]"
              >
                {interpretation.map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-lg transition-all"
                    style={{
                      background: currentGene === text
                        ? 'rgba(168,85,247,0.15)'
                        : 'rgba(30,41,59,0.5)',
                      border: currentGene === text
                        ? '1px solid rgba(168,85,247,0.4)'
                        : '1px solid rgba(148,163,184,0.1)',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        background: 'rgba(168,85,247,0.2)',
                        color: '#c4b5fd',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="text-sm text-slate-300 leading-relaxed">
                      {text}
                    </div>
                  </div>
                ))}
                
                {isSpeaking && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <div className="text-xs text-purple-300">数字人正在解读...</div>
                  </div>
                )}
              </div>

              {/* 底部提示 */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="text-xs text-amber-300">
                  💡 提示：点击DNA图谱上的基因片段，查看详细解读
                </div>
              </div>
            </div>
          </div>

          {/* 基因说明 */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '💼', label: '事业基因', desc: '职业成就潜力' },
              { icon: '❤️', label: '情感基因', desc: '人际关系运势' },
              { icon: '💚', label: '健康基因', desc: '身体素质活力' },
              { icon: '💰', label: '财富基因', desc: '财务运势积累' },
              { icon: '🎨', label: '创造基因', desc: '创新艺术天赋' },
              { icon: '🧠', label: '智慧基因', desc: '学习洞察能力' },
              { icon: '🚀', label: '冒险基因', desc: '勇气探索欲望' },
              { icon: '🏠', label: '稳定基因', desc: '安全感持久力' },
            ].map((gene, i) => (
              <div
                key={i}
                className="p-3 rounded-xl text-center"
                style={{
                  background: 'rgba(30,41,59,0.5)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <div className="text-2xl mb-1">{gene.icon}</div>
                <div className="text-xs font-bold text-white">{gene.label}</div>
                <div className="text-xs text-slate-500">{gene.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}