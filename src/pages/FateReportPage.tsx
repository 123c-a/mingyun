/**
 * 命运全息报告页面 - 一站式整合所有功能
 * 用户输入一次基础信息即可获取完整命运分析报告
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, User, Calendar, Rocket, Download, Share2, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useUniverseStore } from '../store/universeStore'
import type { Universe, LifeNode, FateOverview, DailyCard, FateProfile } from '../store/universeStore'
import { apiCallWithFallback } from '../lib/networkUtils'
import { generateMockFateProfile, generateMockLifeNodes, generateMockUniverses, generateMockFateOverview, generateMockDailyCard } from '../lib/mockDataGenerator'
import FateProfileCard from '../components/FateProfileCard'
import DestinyTimeline from '../components/DestinyTimeline'

type ReportStep = 'input' | 'generating' | 'profile' | 'universes' | 'nodes' | 'overview' | 'complete'

export default function FateReportPage() {
  const navigate = useNavigate()
  const { 
    fateProfile, setFateProfile,
    setLifeNodes,
    setFateOverview,
    dailyCard, setDailyCard,
    setUniverses
  } = useUniverseStore()

  // 输入状态
  const [step, setStep] = useState<ReportStep>(fateProfile ? 'complete' : 'input')
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [progress, setProgress] = useState(0)
  const [currentGenerating, setCurrentGenerating] = useState('')

  // 生成完整报告
  const generateFullReport = async () => {
    if (!birthYear || !birthMonth || !birthDay) return

    setStep('generating')
    setProgress(0)

    try {
      // 步骤1：生成命运底色 (0-25%)
      setCurrentGenerating('解读命运底色...')
      setProgress(5)
      const profileResult = await apiCallWithFallback<FateProfile>(
        '/api/fate-profile',
        { birthYear, birthMonth, birthDay, gender, name },
        generateMockFateProfile
      )
      setFateProfile(profileResult.data)
      setProgress(25)
      setStep('profile')

      // 步骤2：探索平行宇宙 (25-50%)
      await new Promise(r => setTimeout(r, 500))
      setCurrentGenerating('展开平行宇宙...')
      const input = `${name || '你'}的${birthYear}年人生探索`
      const universeResult = await apiCallWithFallback<{ universes: Universe[] }>(
        '/api/universes',
        { userInput: input, fate_profile: profileResult.data },
        () => ({ universes: generateMockUniverses(input) })
      )
      const universes = universeResult.data.universes || []
      setUniverses(universes)
      setProgress(50)
      setStep('universes')

      // 步骤3：生成人生节点 (50-75%)
      await new Promise(r => setTimeout(r, 500))
      setCurrentGenerating('揭示人生节点...')
      const nodesResult = await apiCallWithFallback<LifeNode[]>(
        '/api/life-nodes',
        { fate_profile: profileResult.data },
        generateMockLifeNodes
      )
      setLifeNodes(nodesResult.data)
      setProgress(75)
      setStep('nodes')

      // 步骤4：生成命运概览 (75-100%)
      await new Promise(r => setTimeout(r, 500))
      setCurrentGenerating('绘制命运轨迹...')
      const overviewResult = await apiCallWithFallback<FateOverview>(
        '/api/fate-overview',
        { 
          universes, 
          fate_profile: profileResult.data 
        },
        generateMockFateOverview
      )
      setFateOverview(overviewResult.data)
      
      // 生成今日签文
      const cardResult = await apiCallWithFallback<DailyCard>(
        '/api/daily-card',
        { fate_profile: profileResult.data },
        generateMockDailyCard
      )
      setDailyCard(cardResult.data)

      setProgress(100)
      setStep('complete')
    } catch (error) {
      console.error('生成报告失败:', error)
      // 使用mock数据完成
      setFateProfile(generateMockFateProfile())
      setLifeNodes(generateMockLifeNodes())
      setUniverses(generateMockUniverses('命运探索'))
      setFateOverview(generateMockFateOverview())
      setDailyCard(generateMockDailyCard())
      setProgress(100)
      setStep('complete')
    }
  }

  // 重新开始
  const handleReset = () => {
    setStep('input')
    setName('')
    setBirthYear('')
    setBirthMonth('')
    setBirthDay('')
    setGender('')
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-300/80 hover:text-cyan-400 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">
            🌌 命运全息报告
          </h1>
          <div className="w-20" />
        </div>
      </div>

      {/* 主内容 */}
      <div className="pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* 输入阶段 */}
          {step === 'input' && (
            <div className="py-8 space-y-8 animate-fade-in">
              {/* 标题 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">命运全息报告</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  输入你的基本信息，我们将为你生成一份完整的人生命运分析报告，包含命运底色、人生节点和平行宇宙预测
                </p>
              </div>

              {/* 输入表单 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 space-y-6">
                {/* 姓名 */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    你的名字（选填）
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="输入你的名字，让报告更具个性化"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                {/* 出生日期 */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    出生日期 *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input
                        type="number"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="年"
                        min="1950"
                        max="2025"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-center"
                      />
                      <span className="text-xs text-slate-500 mt-1 block text-center">年</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        placeholder="月"
                        min="1"
                        max="12"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-center"
                      />
                      <span className="text-xs text-slate-500 mt-1 block text-center">月</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        placeholder="日"
                        min="1"
                        max="31"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors text-center"
                      />
                      <span className="text-xs text-slate-500 mt-1 block text-center">日</span>
                    </div>
                  </div>
                </div>

                {/* 性别 */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">性别</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGender('male')}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        gender === 'male'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      男
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        gender === 'female'
                          ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      女
                    </button>
                  </div>
                </div>

                {/* 生成按钮 */}
                <button
                  onClick={generateFullReport}
                  disabled={!birthYear || !birthMonth || !birthDay}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  生成命运报告
                </button>
              </div>

              {/* 提示 */}
              <p className="text-center text-slate-500 text-sm">
                💡 报告包含：命运底色解读 · 人生关键节点 · 平行宇宙预测 · 命运轨迹时间轴
              </p>
            </div>
          )}

          {/* 生成中阶段 */}
          {step === 'generating' && (
            <div className="py-16 space-y-8 animate-fade-in">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{currentGenerating}</h2>
                <p className="text-slate-400 mb-8">正在连接命运之网，请稍候...</p>
                
                {/* 进度条 */}
                <div className="max-w-md mx-auto">
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-sm mt-2">{progress}%</p>
                </div>
              </div>
            </div>
          )}

          {/* 完成阶段 - 显示完整报告 */}
          {(step === 'complete') && (
            <div className="py-8 space-y-6 animate-fade-in">
              {/* 成功提示 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">报告生成完成</h2>
                <p className="text-slate-400">你的专属命运全息报告已就绪</p>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-center gap-3">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新生成
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300">
                  <Share2 className="w-4 h-4" />
                  分享报告
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all text-white">
                  <Download className="w-4 h-4" />
                  导出PDF
                </button>
              </div>

              {/* 命运底色 */}
              {fateProfile && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">🌟 命运底色</h3>
                  <FateProfileCard profile={fateProfile} />
                </div>
              )}

              {/* 命运轨迹时间轴 */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">📊 命运轨迹</h3>
                <DestinyTimeline />
              </div>

              {/* 每日签文 */}
              {dailyCard && (
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 p-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-4">📜 今日签文</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-semibold">{dailyCard.daily_fortune}</span>
                      <span className="text-slate-400">运势评分: {dailyCard.fortune_score}</span>
                    </div>
                    <p className="text-slate-300 italic">{dailyCard.fortune_poem}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">幸运色: {dailyCard.lucky_color}</span>
                      <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">幸运数: {dailyCard.lucky_number}</span>
                      <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">方位: {dailyCard.lucky_direction}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 动画 */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
