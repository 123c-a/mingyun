import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'

// 八字结果类型
interface BaziResult {
  bazi: {
    yearPillar: string
    monthPillar: string
    dayPillar: string
    hourPillar: string
    dayMaster: string
    fiveElements: Record<string, number>
    soulAnimal: string
    luckyNumber: number[]
    luckyColor: string
    luckyDirection: string
    luckyMonth: string
  }
  analysis: {
    personality: string
    career: string
    love: string
    wealth: string
    health: string
  }
  compatibility: {
    bestMatch: string
    avoidMatch: string
    relationshipAdvice: string
  }
  fortune: {
    thisYear: string
    nextYear: string
    fiveYears: string
  }
  advice: string
}

// 紫微斗数结果类型
interface ZiweiResult {
  ziwei: {
    mingGong: string
    shenGong: string
    mainStars: string[]
    auxiliaryStars: string[]
    transformedStars: string[]
    lifePalace: string
    soulAnimal: string
  }
  palaceAnalysis: Record<string, string>
  analysis: {
    personality: string
    career: string
    love: string
    wealth: string
  }
  luckCycles: Record<string, string>
  advice: string
}

// 星座MBTI结果类型
interface AstrologyResult {
  astrology: {
    zodiac: string
    symbol: string
    element: string
    period: string
    traits: string
    strengths: string[]
    weaknesses: string[]
  }
  mbti: {
    type: string
    personality: string
    cognitiveFunctions: string
  }
  analysis: {
    comprehensive: string
    career: string
    love: string
    wealth: string
    health: string
  }
  compatibility: {
    bestMatch: string
    relationshipStyle: string
  }
  fortune: {
    thisMonth: string
    thisYear: string
    luckyDirection: string
    luckyColor: string
    luckyNumber: string
    luckyDay: string
  }
  advice: string
}

type TabType = 'bazi' | 'ziwei' | 'astrology'

// MBTI选项
const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

export default function FortunePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('bazi')

  // 八字表单
  const [baziForm, setBaziForm] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: ''
  })
  const [baziLoading, setBaziLoading] = useState(false)
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null)

  // 紫微表单
  const [ziweiForm, setZiweiForm] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: ''
  })
  const [ziweiLoading, setZiweiLoading] = useState(false)
  const [ziweiResult, setZiweiResult] = useState<ZiweiResult | null>(null)

  // 星座MBTI表单
  const [astroForm, setAstroForm] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthMonth: '',
    birthDay: '',
    mbti: ''
  })
  const [astroLoading, setAstroLoading] = useState(false)
  const [astroResult, setAstroResult] = useState<AstrologyResult | null>(null)

  // 提交八字
  const handleBaziSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBaziLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/bazi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baziForm)
      })
      const data = await response.json()
      setBaziResult(data.result)
    } catch (error) {
      console.error('八字分析失败:', error)
    } finally {
      setBaziLoading(false)
    }
  }

  // 提交紫微
  const handleZiweiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setZiweiLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/ziwei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ziweiForm)
      })
      const data = await response.json()
      setZiweiResult(data.result)
    } catch (error) {
      console.error('紫微斗数分析失败:', error)
    } finally {
      setZiweiLoading(false)
    }
  }

  // 提交星座MBTI
  const handleAstroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAstroLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(astroForm)
      })
      const data = await response.json()
      setAstroResult(data.result)
    } catch (error) {
      console.error('星座分析失败:', error)
    } finally {
      setAstroLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-purple-300/80 hover:text-cyan-400
                       transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>

          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
            命理殿堂
          </h1>

          <div className="w-16" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-gradient-to-r from-amber-500/20 to-orange-500/20
                          border border-amber-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">命理分析</span>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text
                         bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200">
            探索你的命运轨迹
          </h2>
          <p className="text-sm text-amber-400/60 mt-2">
            结合传统命理与现代心理学，解读你的人生密码
          </p>
        </div>

        {/* Tab切换 */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'bazi' as TabType, label: '八字算命', icon: '☯' },
            { id: 'ziwei' as TabType, label: '紫微斗数', icon: '⭐' },
            { id: 'astrology' as TabType, label: '星座+MBTI', icon: '♈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300
                         ${activeTab === tab.id
                           ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                           : 'bg-slate-800/50 text-slate-400 hover:text-amber-300 border border-slate-700'
                         }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 八字算命 */}
        {activeTab === 'bazi' && (
          <div className="max-w-xl mx-auto">
            {!baziResult ? (
              <form onSubmit={handleBaziSubmit} className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-amber-950/40
                                border border-amber-500/20">
                  <h3 className="text-lg font-bold text-amber-200 mb-4">基本信息</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">姓名（可选）</label>
                      <input
                        type="text"
                        value={baziForm.name}
                        onChange={e => setBaziForm({...baziForm, name: e.target.value})}
                        placeholder="输入姓名"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                   text-white placeholder-slate-500 focus:border-amber-500/50
                                   focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-1">性别</label>
                      <div className="flex gap-3">
                        {[
                          { value: 'male', label: '男' },
                          { value: 'female', label: '女' }
                        ].map(g => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setBaziForm({...baziForm, gender: g.value as 'male' | 'female'})}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all
                                       ${baziForm.gender === g.value
                                         ? 'bg-amber-600 text-white'
                                         : 'bg-slate-800/50 text-slate-400 border border-slate-700'
                                       }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生年</label>
                        <select
                          value={baziForm.birthYear}
                          onChange={e => setBaziForm({...baziForm, birthYear: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-amber-500/50 focus:outline-none"
                        >
                          <option value="">选择年份</option>
                          {years.map(y => (
                            <option key={y} value={y}>{y}年</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生月</label>
                        <select
                          value={baziForm.birthMonth}
                          onChange={e => setBaziForm({...baziForm, birthMonth: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-amber-500/50 focus:outline-none"
                        >
                          <option value="">选择月份</option>
                          {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}月</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生日</label>
                        <select
                          value={baziForm.birthDay}
                          onChange={e => setBaziForm({...baziForm, birthDay: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-amber-500/50 focus:outline-none"
                        >
                          <option value="">选择日期</option>
                          {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{d}日</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生时辰</label>
                        <select
                          value={baziForm.birthHour}
                          onChange={e => setBaziForm({...baziForm, birthHour: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-amber-500/50 focus:outline-none"
                        >
                          <option value="">选择时辰</option>
                          {Array.from({length: 24}, (_, i) => i).map(h => (
                            <option key={h} value={h}>
                              {h}时 ({h < 23 && h >= 21 ? '亥时' : h >= 19 ? '戌时' : h >= 17 ? '酉时' : h >= 15 ? '申时' : h >= 13 ? '未时' : h >= 11 ? '午时' : h >= 9 ? '巳时' : h >= 7 ? '辰时' : h >= 5 ? '卯时' : h >= 3 ? '寅时' : h >= 1 ? '丑时' : '子时'})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={baziLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600
                             text-white font-semibold shadow-lg
                             hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]
                             disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {baziLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>命理分析中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>开始八字分析</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                {/* 八字排盘 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-amber-950/40
                                border border-amber-500/20">
                  <h3 className="text-lg font-bold text-amber-200 mb-4 flex items-center gap-2">
                    <span>☯</span> 八字排盘
                  </h3>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                      { label: '年柱', value: baziResult.bazi.yearPillar },
                      { label: '月柱', value: baziResult.bazi.monthPillar },
                      { label: '日柱', value: baziResult.bazi.dayPillar },
                      { label: '时柱', value: baziResult.bazi.hourPillar }
                    ].map(p => (
                      <div key={p.label} className="p-3 rounded-xl bg-slate-800/50">
                        <div className="text-xs text-slate-500 mb-1">{p.label}</div>
                        <div className="text-lg font-bold text-amber-300">{p.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="text-sm text-amber-400/60">日主 · 五行</div>
                    <div className="text-lg text-amber-200 font-medium">
                      {baziResult.bazi.dayMaster} · {baziResult.bazi.soulAnimal}
                    </div>
                  </div>
                </div>

                {/* 五行分析 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-amber-950/40
                                border border-amber-500/20">
                  <h3 className="text-lg font-bold text-amber-200 mb-4">五行分布</h3>
                  <div className="space-y-2">
                    {['金', '木', '水', '火', '土'].map(el => (
                      <div key={el} className="flex items-center gap-3">
                        <span className="w-6 text-amber-300">{el}</span>
                        <div className="flex-1 h-4 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                            style={{ width: `${(baziResult.bazi.fiveElements[el] / 5) * 100}%` }}
                          />
                        </div>
                        <span className="w-6 text-slate-400 text-sm">{baziResult.bazi.fiveElements[el]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="px-3 py-2 rounded-lg bg-slate-800/50">
                      <span className="text-xs text-slate-500">幸运色</span>
                      <div className="text-amber-300">{baziResult.bazi.luckyColor}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-slate-800/50">
                      <span className="text-xs text-slate-500">幸运数字</span>
                      <div className="text-amber-300">{baziResult.bazi.luckyNumber?.join(', ')}</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-slate-800/50">
                      <span className="text-xs text-slate-500">幸运方位</span>
                      <div className="text-amber-300">{baziResult.bazi.luckyDirection}</div>
                    </div>
                  </div>
                </div>

                {/* 分析 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-amber-950/40
                                border border-amber-500/20">
                  <h3 className="text-lg font-bold text-amber-200 mb-4">命理分析</h3>
                  <div className="space-y-3">
                    {[
                      { label: '性格', value: baziResult.analysis.personality },
                      { label: '事业', value: baziResult.analysis.career },
                      { label: '感情', value: baziResult.analysis.love },
                      { label: '财运', value: baziResult.analysis.wealth },
                      { label: '健康', value: baziResult.analysis.health }
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-xl bg-slate-800/30">
                        <div className="text-xs text-amber-400/60 mb-1">{item.label}</div>
                        <div className="text-sm text-slate-200">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 运势 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-amber-950/40
                                border border-amber-500/20">
                  <h3 className="text-lg font-bold text-amber-200 mb-4">运势走向</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="text-xs text-amber-400/60 mb-1">今年运势</div>
                      <div className="text-sm text-slate-200">{baziResult.fortune.thisYear}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/30">
                      <div className="text-xs text-slate-500 mb-1">明年运势</div>
                      <div className="text-sm text-slate-300">{baziResult.fortune.nextYear}</div>
                    </div>
                  </div>
                </div>

                {/* 建议 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10
                                border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-400/60 uppercase tracking-wider">命运指引</span>
                  </div>
                  <p className="text-amber-100 leading-relaxed italic">"{baziResult.advice}"</p>
                </div>

                <button
                  onClick={() => setBaziResult(null)}
                  className="w-full py-3 rounded-xl bg-slate-800/50 text-slate-400
                             hover:text-white border border-slate-700 transition-all"
                >
                  重新分析
                </button>
              </div>
            )}
          </div>
        )}

        {/* 紫微斗数 */}
        {activeTab === 'ziwei' && (
          <div className="max-w-xl mx-auto">
            {!ziweiResult ? (
              <form onSubmit={handleZiweiSubmit} className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-950/40
                                border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-200 mb-4">基本信息</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">姓名（可选）</label>
                      <input
                        type="text"
                        value={ziweiForm.name}
                        onChange={e => setZiweiForm({...ziweiForm, name: e.target.value})}
                        placeholder="输入姓名"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                   text-white placeholder-slate-500 focus:border-purple-500/50
                                   focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-1">性别</label>
                      <div className="flex gap-3">
                        {[
                          { value: 'male', label: '男' },
                          { value: 'female', label: '女' }
                        ].map(g => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setZiweiForm({...ziweiForm, gender: g.value as 'male' | 'female'})}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all
                                       ${ziweiForm.gender === g.value
                                         ? 'bg-purple-600 text-white'
                                         : 'bg-slate-800/50 text-slate-400 border border-slate-700'
                                       }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生年</label>
                        <select
                          value={ziweiForm.birthYear}
                          onChange={e => setZiweiForm({...ziweiForm, birthYear: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-purple-500/50 focus:outline-none"
                        >
                          <option value="">选择年份</option>
                          {years.map(y => (
                            <option key={y} value={y}>{y}年</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生月</label>
                        <select
                          value={ziweiForm.birthMonth}
                          onChange={e => setZiweiForm({...ziweiForm, birthMonth: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-purple-500/50 focus:outline-none"
                        >
                          <option value="">选择月份</option>
                          {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}月</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生日</label>
                        <select
                          value={ziweiForm.birthDay}
                          onChange={e => setZiweiForm({...ziweiForm, birthDay: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-purple-500/50 focus:outline-none"
                        >
                          <option value="">选择日期</option>
                          {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{d}日</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生时辰</label>
                        <select
                          value={ziweiForm.birthHour}
                          onChange={e => setZiweiForm({...ziweiForm, birthHour: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-purple-500/50 focus:outline-none"
                        >
                          <option value="">选择时辰</option>
                          {Array.from({length: 24}, (_, i) => i).map(h => (
                            <option key={h} value={h}>{h}时</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={ziweiLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600
                             text-white font-semibold shadow-lg
                             hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
                             disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {ziweiLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>命盘解析中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>开始紫微分析</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                {/* 命宫 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-950/40
                                border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center gap-2">
                    <span>⭐</span> 命宫主星
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">{ziweiResult.ziwei.mainStars?.join(' · ')}</div>
                    <div className="text-purple-300">{ziweiResult.ziwei.mingGong}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-slate-800/50">
                      <div className="text-xs text-slate-500">身宫</div>
                      <div className="text-purple-300">{ziweiResult.ziwei.shenGong}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50">
                      <div className="text-xs text-slate-500">命格</div>
                      <div className="text-purple-300">{ziweiResult.ziwei.soulAnimal}</div>
                    </div>
                  </div>
                </div>

                {/* 十二宫 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-950/40
                                border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-200 mb-4">十二宫分析</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'mingGong', label: '命宫', desc: '人生核心命运' },
                      { key: 'fuGong', label: '福德宫', desc: '精神享乐' },
                      { key: 'guanLu', label: '官禄宫', desc: '事业学业' },
                      { key: 'qiNvm', label: '夫妻宫', desc: '婚姻感情' },
                      { key: 'caiBo', label: '财帛宫', desc: '财富财运' },
                      { key: 'jiShi', label: '疾厄宫', desc: '健康疾病' },
                      { key: 'tianZhai', label: '田宅宫', desc: '房产家业' },
                      { key: 'ziNv', label: '子女宫', desc: '子女后代' }
                    ].map(item => (
                      <div key={item.key} className="p-3 rounded-xl bg-slate-800/30 flex items-start gap-3">
                        <div className="shrink-0 w-20">
                          <div className="text-sm text-purple-300 font-medium">{item.label}</div>
                          <div className="text-[10px] text-slate-500">{item.desc}</div>
                        </div>
                        <div className="text-sm text-slate-300 flex-1">
                          {ziweiResult.palaceAnalysis[item.key]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 分析 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-purple-950/40
                                border border-purple-500/20">
                  <h3 className="text-lg font-bold text-purple-200 mb-4">综合分析</h3>
                  <div className="space-y-3">
                    {[
                      { label: '性格', value: ziweiResult.analysis.personality },
                      { label: '事业', value: ziweiResult.analysis.career },
                      { label: '感情', value: ziweiResult.analysis.love },
                      { label: '财运', value: ziweiResult.analysis.wealth }
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-xl bg-slate-800/30">
                        <div className="text-xs text-purple-400/60 mb-1">{item.label}</div>
                        <div className="text-sm text-slate-200">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 建议 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/10
                                border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-400/60 uppercase tracking-wider">命运指引</span>
                  </div>
                  <p className="text-purple-100 leading-relaxed italic">"{ziweiResult.advice}"</p>
                </div>

                <button
                  onClick={() => setZiweiResult(null)}
                  className="w-full py-3 rounded-xl bg-slate-800/50 text-slate-400
                             hover:text-white border border-slate-700 transition-all"
                >
                  重新分析
                </button>
              </div>
            )}
          </div>
        )}

        {/* 星座+MBTI */}
        {activeTab === 'astrology' && (
          <div className="max-w-xl mx-auto">
            {!astroResult ? (
              <form onSubmit={handleAstroSubmit} className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-pink-950/40
                                border border-pink-500/20">
                  <h3 className="text-lg font-bold text-pink-200 mb-4">基本信息</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">姓名（可选）</label>
                      <input
                        type="text"
                        value={astroForm.name}
                        onChange={e => setAstroForm({...astroForm, name: e.target.value})}
                        placeholder="输入姓名"
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                   text-white placeholder-slate-500 focus:border-pink-500/50
                                   focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-1">性别</label>
                      <div className="flex gap-3">
                        {[
                          { value: 'male', label: '男' },
                          { value: 'female', label: '女' }
                        ].map(g => (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setAstroForm({...astroForm, gender: g.value as 'male' | 'female'})}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all
                                       ${astroForm.gender === g.value
                                         ? 'bg-pink-600 text-white'
                                         : 'bg-slate-800/50 text-slate-400 border border-slate-700'
                                       }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生月</label>
                        <select
                          value={astroForm.birthMonth}
                          onChange={e => setAstroForm({...astroForm, birthMonth: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-pink-500/50 focus:outline-none"
                        >
                          <option value="">选择月份</option>
                          {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}月</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">出生日</label>
                        <select
                          value={astroForm.birthDay}
                          onChange={e => setAstroForm({...astroForm, birthDay: e.target.value})}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                     text-white focus:border-pink-500/50 focus:outline-none"
                        >
                          <option value="">选择日期</option>
                          {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{d}日</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-1">MBTI性格类型（可选）</label>
                      <select
                        value={astroForm.mbti}
                        onChange={e => setAstroForm({...astroForm, mbti: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700
                                   text-white focus:border-pink-500/50 focus:outline-none"
                      >
                        <option value="">选择MBTI（不选则AI推测）</option>
                        {MBTI_OPTIONS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={astroLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600
                             text-white font-semibold shadow-lg
                             hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]
                             disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {astroLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>星座解读中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>开始星座分析</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                {/* 星座 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-pink-950/40
                                border border-pink-500/20 text-center">
                  <div className="text-6xl mb-2">{astroResult.astrology.symbol}</div>
                  <h3 className="text-2xl font-bold text-pink-200">{astroResult.astrology.zodiac}</h3>
                  <div className="text-sm text-pink-400/60">{astroResult.astrology.element} · {astroResult.astrology.period}</div>
                  <div className="mt-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                    <div className="text-xs text-pink-400/60 mb-1">核心特质</div>
                    <div className="text-pink-200">{astroResult.astrology.traits}</div>
                  </div>
                </div>

                {/* MBTI */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-pink-950/40
                                border border-pink-500/20">
                  <h3 className="text-lg font-bold text-pink-200 mb-3 flex items-center gap-2">
                    <span>🧠</span> MBTI: {astroResult.mbti.type}
                  </h3>
                  <div className="text-sm text-slate-300 mb-2">{astroResult.mbti.personality}</div>
                  <div className="text-xs text-slate-500">{astroResult.mbti.cognitiveFunctions}</div>
                </div>

                {/* 优缺点 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-emerald-900/20
                                  border border-emerald-500/20">
                    <div className="text-xs text-emerald-400/60 uppercase tracking-wider mb-2">优点</div>
                    <div className="space-y-1">
                      {astroResult.astrology.strengths?.map((s, i) => (
                        <div key={i} className="text-sm text-emerald-200">{s}</div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/40 to-rose-900/20
                                  border border-rose-500/20">
                    <div className="text-xs text-rose-400/60 uppercase tracking-wider mb-2">缺点</div>
                    <div className="space-y-1">
                      {astroResult.astrology.weaknesses?.map((w, i) => (
                        <div key={i} className="text-sm text-rose-200">{w}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 分析 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-pink-950/40
                                border border-pink-500/20">
                  <h3 className="text-lg font-bold text-pink-200 mb-4">综合分析</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                      <div className="text-xs text-pink-400/60 mb-1">性格</div>
                      <div className="text-sm text-slate-200">{astroResult.analysis.comprehensive}</div>
                    </div>
                    {[
                      { label: '事业', value: astroResult.analysis.career },
                      { label: '感情', value: astroResult.analysis.love },
                      { label: '财运', value: astroResult.analysis.wealth }
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-xl bg-slate-800/30">
                        <div className="text-xs text-pink-400/60 mb-1">{item.label}</div>
                        <div className="text-sm text-slate-200">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 幸运信息 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-pink-950/40
                                border border-pink-500/20">
                  <h3 className="text-lg font-bold text-pink-200 mb-4">幸运信息</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                      <div className="text-xs text-slate-500">幸运色</div>
                      <div className="text-pink-300">{astroResult.fortune.luckyColor}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                      <div className="text-xs text-slate-500">幸运数字</div>
                      <div className="text-pink-300">{astroResult.fortune.luckyNumber}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                      <div className="text-xs text-slate-500">幸运方向</div>
                      <div className="text-pink-300">{astroResult.fortune.luckyDirection}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                      <div className="text-xs text-slate-500">幸运日</div>
                      <div className="text-pink-300">{astroResult.fortune.luckyDay}</div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                    <div className="text-xs text-pink-400/60 mb-1">本月运势</div>
                    <div className="text-sm text-pink-200">{astroResult.fortune.thisMonth}</div>
                  </div>
                </div>

                {/* 适配 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10
                                border border-pink-500/30">
                  <div className="text-xs text-pink-400/60 uppercase tracking-wider mb-2">最佳伴侣</div>
                  <div className="text-lg text-pink-200 font-medium mb-1">{astroResult.compatibility.bestMatch}</div>
                  <div className="text-sm text-slate-400">{astroResult.compatibility.relationshipStyle}</div>
                </div>

                {/* 建议 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10
                                border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-pink-400/60 uppercase tracking-wider">命运指引</span>
                  </div>
                  <p className="text-pink-100 leading-relaxed italic">"{astroResult.advice}"</p>
                </div>

                <button
                  onClick={() => setAstroResult(null)}
                  className="w-full py-3 rounded-xl bg-slate-800/50 text-slate-400
                             hover:text-white border border-slate-700 transition-all"
                >
                  重新分析
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
