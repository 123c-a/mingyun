/**
 * 命运节目页面（升级版：支持用户操作 + Agent 直播台两种模式）
 *
 * 正常模式：用户点击「快速演示」或手动输入生日 → 按步骤生成
 * Agent 直播模式：点击「开启数字人直播台」后，Agent 自动跑 6 步剧本
 */

import { useState, useEffect, useCallback } from 'react'
import { useUniverseStore, FateProfile, LifeNode, FateOverview, DailyCard, Universe } from '../store/universeStore'
import IdentityInput from '../components/IdentityInput'
import FateProfileCard from '../components/FateProfileCard'
import LifeNodesGrid from '../components/LifeNodesGrid'
import BranchComparison from '../components/BranchComparison'
import FateOverviewView from '../components/FateOverview'
import DailyFortuneCard from '../components/DailyFortuneCard'
import FateLoading from '../components/FateLoading'

// ============ Agent 直播台组件 ============
import DigitalHost from '../components/DigitalHost'
import LiveControlPanel from '../components/LiveControlPanel'
import DanmakuLayer from '../components/DanmakuLayer'
import LiveStats from '../components/LiveStats'
import { useLiveAgent } from '../hooks/useLiveAgent'
import { DEMO_USER } from '../data/liveScripts'
import { speech } from '../store/speechStore'

type StepId = 'identity' | 'profile' | 'nodes' | 'nodeDetail' | 'overview' | 'daily'

const LOADING_STAGE_MAP: Record<string, 'fate-profile' | 'life-nodes' | 'node-universes' | 'fate-overview' | 'daily-card' | null> = {
  identity: null,
  profile: 'fate-profile',
  nodes: 'life-nodes',
  nodeDetail: 'node-universes',
  overview: 'fate-overview',
  daily: 'daily-card',
}

// Agent step → 页面 UI step 的映射
function agentStepToUi(agentStep: string): StepId | null {
  switch (agentStep) {
    case 'intro':    return 'identity'
    case 'profile':  return 'profile'
    case 'nodes':    return 'nodes'
    case 'branch':   return 'nodeDetail'
    case 'overview': return 'overview'
    case 'daily':    return 'daily'
    default:         return null
  }
}

export default function FateProgramPage() {
  const [step, setStep] = useState<StepId>('identity')
  const [userName, setUserName] = useState<string>('')
  const [currentNode, setCurrentNode] = useState<LifeNode | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ============ Agent 直播台相关 ============
  const [liveMode, setLiveMode] = useState(false)

  // store 状态
  const fateProfile = useUniverseStore((s) => s.fateProfile)
  const lifeNodes = useUniverseStore((s) => s.lifeNodes)
  const nodeUniverses = useUniverseStore((s) => s.nodeUniverses)
  const fateOverview = useUniverseStore((s) => s.fateOverview)
  const dailyCard = useUniverseStore((s) => s.dailyCard)
  const resetFateProgram = useUniverseStore((s) => s.resetFateProgram)
  const setFateProfileStore = useUniverseStore((s) => s.setFateProfile)
  const setLifeNodesStore = useUniverseStore((s) => s.setLifeNodes)
  const setFateOverviewStore = useUniverseStore((s) => s.setFateOverview)
  const setDailyCardStore = useUniverseStore((s) => s.setDailyCard)
  const setNodeBranch = useUniverseStore((s) => s.setNodeBranch)
  const setGeneratingNode = useUniverseStore((s) => s.setGeneratingNode)
  const setLoadingFateProfile = useUniverseStore((s) => s.setLoadingFateProfile)
  const setLoadingNodes = useUniverseStore((s) => s.setLoadingNodes)
  const setLoadingOverview = useUniverseStore((s) => s.setLoadingOverview)
  const setLoadingDailyCard = useUniverseStore((s) => s.setLoadingDailyCard)

  // Agent 执行的步骤 → API 调用（Agent 通过 runApi 触发）
  const runApiByAgent = useCallback(async (stepId: string) => {
    try {
      switch (stepId) {
        case 'profile': {
          setLoadingFateProfile(true)
          const r = await apiCallInternal<{ profile: FateProfile }>('/fate-profile', DEMO_USER)
          setFateProfileStore(r.profile)
          setUserName(DEMO_USER.name)
          setLoadingFateProfile(false)
          break
        }
        case 'nodes': {
          if (!fateProfile) {
            // 重新取一次（避免在某些情况下未更新）
            break
          }
          setLoadingNodes(true)
          const r = await apiCallInternal<{ nodes: LifeNode[] }>('/life-nodes', {
            fate_profile: fateProfile,
            userInput: '',
          })
          setLifeNodesStore(r.nodes)
          setLoadingNodes(false)
          break
        }
        case 'branch': {
          const currentStore = useUniverseStore.getState()
          const node = (currentStore.lifeNodes.length > 0 ? currentStore.lifeNodes : lifeNodes)?.[0]
          if (!node) break
          setCurrentNode(node)
          setGeneratingNode(true)
          const currentProfile = currentStore.fateProfile || fateProfile
          const r = await apiCallInternal<{ branch_a: Universe; branch_b: Universe }>('/universes', {
            fate_profile: currentProfile,
            life_node: node,
          })
          setNodeBranch(node.node_id, 'a', r.branch_a)
          setNodeBranch(node.node_id, 'b', r.branch_b)
          setGeneratingNode(false)
          break
        }
        case 'overview': {
          const currentStore = useUniverseStore.getState()
          setLoadingOverview(true)
          const currentUniverses: Universe[] = []
          const nu = Object.keys(currentStore.nodeUniverses).length > 0 ? currentStore.nodeUniverses : nodeUniverses
          Object.values(nu as any).forEach((val: any) => {
            if (val?.branch_a) currentUniverses.push(val.branch_a)
            if (val?.branch_b) currentUniverses.push(val.branch_b)
          })
          const currentProfile = currentStore.fateProfile || fateProfile
          const r = await apiCallInternal<{ overview: FateOverview }>('/fate-overview', {
            universes: currentUniverses.slice(0, 6),
            fateProfile: currentProfile,
          })
          setFateOverviewStore(r.overview)
          setLoadingOverview(false)
          break
        }
        case 'daily': {
          const currentStore = useUniverseStore.getState()
          setLoadingDailyCard(true)
          const profileName = (currentStore.fateProfile?.fate_title as string) || (fateProfile?.fate_title as string) || '观测者'
          const r = await apiCallInternal<{ card: DailyCard; date: string }>('/daily-card', {
            birthYear: DEMO_USER.birthYear,
            birthMonth: DEMO_USER.birthMonth,
            birthDay: DEMO_USER.birthDay,
            gender: DEMO_USER.gender,
            name: profileName,
          })
          setDailyCardStore(r.card)
          setLoadingDailyCard(false)
          break
        }
        default:
          break
      }
      setError(null)
    } catch (err: any) {
      setError(err?.message || '直播演示出错，请重试')
    }
  }, [
    fateProfile, lifeNodes, nodeUniverses,
    setFateProfileStore, setLifeNodesStore, setFateOverviewStore, setDailyCardStore,
    setNodeBranch, setGeneratingNode, setLoadingFateProfile, setLoadingNodes, setLoadingOverview, setLoadingDailyCard,
  ])

  // Agent 的 onStepChange：把 Agent 的 stepId 翻译成 UI step
  const onAgentStepChange = useCallback((agentStepId: string) => {
    const ui = agentStepToUi(agentStepId)
    if (ui) setStep(ui)
  }, [])

  const agent = useLiveAgent({
    enabled: liveMode,
    runApi: runApiByAgent,
    onStepChange: onAgentStepChange,
  })

  // ============ API 调用（共用） ============
  const apiCallInternal = async <T,>(endpoint: string, body: any): Promise<T> => {
    const maxRetries = 2
    let lastError: Error | null = null
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const res = await fetch(`http://localhost:3001/api${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(90000),
        })
        if (!res.ok) {
          const errText = await res.text().catch(() => '未知错误')
          throw new Error(`HTTP ${res.status}: ${errText}`)
        }
        return (await res.json()) as T
      } catch (err: any) {
        lastError = err
        if (i < maxRetries && (err.name === 'TimeoutError' || err.message?.includes('fetch'))) {
          await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
        } else {
          throw err
        }
      }
    }
    throw lastError || new Error('请求失败')
  }

  // ============ 用户手动模式：身份输入 → 命运底色 ============
  const handleIdentitySubmit = async (data: {
    birthYear: number; birthMonth: number; birthDay: number; birthHour?: number; gender: string; name: string
  }) => {
    setUserName(data.name || '匿名观测者')
    setError(null)
    setLoadingFateProfile(true)
    setStep('profile')
    try {
      const result = await apiCallInternal<{ profile: FateProfile }>('/fate-profile', data)
      setFateProfileStore(result.profile)
      setLoadingFateProfile(false)
      speech.enqueue(`命运底色已生成：${result.profile.fate_title}`, 'normal', 'excited', 'fateReveal')
    } catch (err: any) {
      setError(`命运底色分析失败: ${err.message}`)
      setLoadingFateProfile(false)
      setStep('identity')
    }
  }

  // ============ 手动：继续到节点扫描 ============
  const handleProfileContinue = async () => {
    if (!fateProfile) return
    setError(null)
    setLoadingNodes(true)
    setStep('nodes')
    try {
      const result = await apiCallInternal<{ nodes: LifeNode[] }>('/life-nodes', {
        fate_profile: fateProfile,
        userInput: '',
      })
      setLifeNodesStore(result.nodes)
      setLoadingNodes(false)
      speech.enqueue(`已扫描到 ${result.nodes.length} 个人生关键节点`, 'normal', 'mysterious')
    } catch (err: any) {
      setError(`人生节点扫描失败: ${err.message}`)
      setLoadingNodes(false)
      setStep('profile')
    }
  }

  // ============ 手动：选择节点 → 生成分支 ============
  const handleSelectNode = async (nodeId: number) => {
    const node = lifeNodes.find((n) => n.node_id === nodeId)
    if (!node || !fateProfile) return
    setCurrentNode(node)
    setError(null)
    setStep('nodeDetail')
    if (!nodeUniverses[nodeId]) {
      setGeneratingNode(true)
      try {
        const result = await apiCallInternal<{ branch_a: any; branch_b: any }>('/universes', {
          fate_profile: fateProfile,
          life_node: node,
        })
        setNodeBranch(nodeId, 'a', result.branch_a)
        setNodeBranch(nodeId, 'b', result.branch_b)
        setGeneratingNode(false)
      } catch (err: any) {
        setError(`宇宙分裂失败: ${err.message}`)
        setGeneratingNode(false)
        setStep('nodes')
      }
    }
  }

  // ============ 手动：生成命运总览 ============
  const handleGenerateOverview = async () => {
    const currentUniverses: Universe[] = []
    Object.values(nodeUniverses as any).forEach((val: any) => {
      if (val?.branch_a) currentUniverses.push(val.branch_a)
      if (val?.branch_b) currentUniverses.push(val.branch_b)
    })
    if (currentUniverses.length === 0 || !fateProfile) {
      alert('请先至少探索一个人生节点')
      return
    }
    setError(null)
    setLoadingOverview(true)
    setStep('overview')
    try {
      const result = await apiCallInternal<{ overview: FateOverview }>('/fate-overview', {
        universes: currentUniverses.slice(0, 6),
        fateProfile,
      })
      setFateOverviewStore(result.overview)
      setLoadingOverview(false)
    } catch (err: any) {
      setError(`命运总览生成失败: ${err.message}`)
      setLoadingOverview(false)
      setStep('nodes')
    }
  }

  // ============ 手动：生成今日签 ============
  const handleGenerateDaily = async () => {
    setError(null)
    setLoadingDailyCard(true)
    setStep('daily')
    try {
      const result = await apiCallInternal<{ card: DailyCard; date: string }>('/daily-card', {
        birthYear: 1998, birthMonth: 3, birthDay: 14, gender: 'male',
        name: fateProfile?.fate_title || '观测者',
      })
      setDailyCardStore(result.card)
      setLoadingDailyCard(false)
    } catch (err: any) {
      setError(`今日签文生成失败: ${err.message}`)
      setLoadingDailyCard(false)
      setStep('overview')
    }
  }

  // ============ 手动：重置 ============
  const handleRestart = () => {
    localStorage.removeItem('fate-program-state')
    resetFateProgram()
    setStep('identity')
    setUserName('')
    setCurrentNode(null)
    setError(null)
  }

  // ============ 手动：快速演示 ============
  const handleDemo = () => {
    const demoData = { ...DEMO_USER, name: '直播观众' }
    setUserName('直播观众')
    setLoadingFateProfile(true)
    setStep('profile')
    apiCallInternal<{ profile: FateProfile }>('/fate-profile', demoData)
      .then((r) => {
        setFateProfileStore(r.profile)
        setLoadingFateProfile(false)
        return apiCallInternal<{ nodes: LifeNode[] }>('/life-nodes', {
          fate_profile: r.profile, userInput: '',
        })
      })
      .then((r) => {
        setLifeNodesStore(r.nodes)
        if (r.nodes.length > 0) {
          setTimeout(() => {
            setLoadingNodes(false)
            handleSelectNode(r.nodes[0].node_id)
          }, 1200)
        }
      })
      .catch((err) => {
        setError(`演示失败: ${err.message}`)
        setStep('identity')
      })
  }

  // ============ Agent 开关 ============
  const toggleLiveMode = () => {
    speech.stop()
    if (liveMode) {
      // 关掉
      agent.actions.stop()
      setLiveMode(false)
      setStep('identity')
      resetFateProgram()
      setCurrentNode(null)
      setError(null)
    } else {
      // 打开：重置 store，Agent 会自己从第 0 步开始
      resetFateProgram()
      setCurrentNode(null)
      setError(null)
      setStep('identity')
      setLiveMode(true)
      // 重置 Agent 到第 0 步并播放
      agent.actions.restart()
    }
  }

  // ============ Agent → UI 控制面板的回调映射 ============
  const togglePlayOrPause = () => {
    if (agent.state.isPlaying) agent.actions.pause()
    else agent.actions.play()
  }

  // ============ 渲染：直播台外壳（左上角数字人 + 右上控制台 + 弹幕） ============
  const isGeneratingNode = useUniverseStore((s) => s.isGeneratingNode)
  const isLoadingFateProfile = useUniverseStore((s) => s.isLoadingFateProfile)
  const isLoadingNodes = useUniverseStore((s) => s.isLoadingNodes)
  const isLoadingOverview = useUniverseStore((s) => s.isLoadingOverview)
  const isLoadingDailyCard = useUniverseStore((s) => s.isLoadingDailyCard)

  const showSteps = step !== 'identity'
  const stepOrder: StepId[] = ['profile', 'nodes', 'overview', 'daily']
  const currentIndex = stepOrder.indexOf(step === 'nodeDetail' ? 'nodes' : step)

  const isLoading =
    isLoadingFateProfile || isLoadingNodes || isGeneratingNode || isLoadingOverview || isLoadingDailyCard
  const loadingStage = LOADING_STAGE_MAP[step] || 'fate-profile'

  return (
    <div className="min-h-screen pt-6 pb-16 px-4 relative">
      {/* 弹幕层（固定覆盖整屏，不拦截操作） */}
      {liveMode && (
        <DanmakuLayer
          enabled={agent.state.danmakuOn}
          stepIndex={agent.state.stepIndex}
          personality={agent.state.personality}
          burstSignal={agent.state.burstSignal}
        />
      )}

      {/* ========= 顶部：直播台入口 / 步骤指示器 ========= */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">命运节目</h2>
          <button
            onClick={toggleLiveMode}
            className="text-sm rounded-full px-3 py-1.5 transition-all border"
            style={{
              background: liveMode
                ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(244,63,94,0.25))'
                : 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(251,191,36,0.18))',
              borderColor: liveMode ? 'rgba(244,63,94,0.5)' : 'rgba(251,191,36,0.4)',
              color: liveMode ? '#fecaca' : '#fde68a',
              fontWeight: 700,
            }}
          >
            {liveMode ? '■ 退出直播台' : '🎥 开启数字人直播台'}
          </button>
        </div>
        {liveMode && (
          <div className="text-xs text-amber-300/80 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Agent 正在为你演示（步骤 {agent.state.stepIndex + 1}/{agent.state.totalSteps}）
          </div>
        )}
      </div>

      {/* ========= 中间 UI 步骤（不管是否直播都显示） ========= */}
      {showSteps && (
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center justify-center">
            {stepOrder.map((s, i) => {
              const isActive = currentIndex >= i
              const labels: Record<StepId, string> = {
                identity: '输入',
                profile: '命运底色',
                nodes: '人生节点',
                nodeDetail: '节点',
                overview: '命运总览',
                daily: '今日签',
              }
              return (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-200 border border-amber-500/40'
                      : 'bg-slate-900/40 text-slate-500 border border-slate-700'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      isActive ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>{i + 1}</span>
                    <span>{labels[s]}</span>
                  </div>
                  {i < stepOrder.length - 1 && (
                    <div className={`w-8 h-px ${isActive ? 'bg-gradient-to-r from-amber-500/50 to-purple-500/50' : 'bg-slate-700'}`}/>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm">
            <button onClick={() => setError(null)} className="float-right text-red-400 hover:text-red-200">×</button>
            {error}
          </div>
        </div>
      )}

      {/* ========= 主体内容 ========= */}
      <div className="animate-[fadeIn_0.5s_ease-out]">
        {step === 'identity' && !liveMode && (
          <div>
            <div className="max-w-2xl mx-auto mb-6 text-center">
              <button
                onClick={handleDemo}
                className="text-sm text-purple-400 hover:text-purple-200 transition-colors underline underline-offset-4"
              >
                🎬 快速演示模式（跳过输入，体验完整流程）
              </button>
            </div>
            <IdentityInput onSubmit={handleIdentitySubmit} loading={false}/>
          </div>
        )}

        {step === 'identity' && liveMode && (
          <div className="max-w-2xl mx-auto text-center text-slate-400 text-sm py-12">
            Agent 正在准备，请稍候……
          </div>
        )}

        {step === 'profile' && (
          <>
            {isLoadingFateProfile ? <FateLoading stage="fate-profile"/> : fateProfile ? (
              <FateProfileCard profile={fateProfile} userName={userName} onContinue={handleProfileContinue}/>
            ) : null}
          </>
        )}

        {step === 'nodes' && (
          <>
            {isLoadingNodes ? <FateLoading stage="life-nodes"/> : (
              <LifeNodesGrid
                nodes={lifeNodes}
                onSelect={handleSelectNode}
                exploredNodes={nodeUniverses as any}
                isGenerating={isGeneratingNode}
                currentNodeId={null}
                onContinue={handleGenerateOverview}
              />
            )}
          </>
        )}

        {step === 'nodeDetail' && currentNode && fateProfile && (
          <>
            {isGeneratingNode ? <FateLoading stage="node-universes"/> : (
              <BranchComparison
                nodeId={currentNode.node_id}
                nodeName={currentNode.node_name}
                nodeDescription={currentNode.node_description}
                choice_a={currentNode.choice_a}
                choice_b={currentNode.choice_b}
                branch_a={(nodeUniverses as any)[currentNode.node_id]?.branch_a}
                branch_b={(nodeUniverses as any)[currentNode.node_id]?.branch_b}
                isGenerating={isGeneratingNode}
                onGenerate={() => handleSelectNode(currentNode.node_id)}
                onBack={() => setStep('nodes')}
                onNext={() => setStep('nodes')}
              />
            )}
          </>
        )}

        {step === 'overview' && (
          <>
            {isLoadingOverview ? <FateLoading stage="fate-overview"/> : fateOverview ? (
              <FateOverviewView
                overview={fateOverview}
                userName={userName}
                onExplore={() => setStep('nodes')}
                onDailyCard={handleGenerateDaily}
              />
            ) : null}
          </>
        )}

        {step === 'daily' && (
          <>
            {isLoadingDailyCard ? <FateLoading stage="daily-card"/> : dailyCard ? (
              <DailyFortuneCard card={dailyCard} userName={userName} onRestart={handleRestart}/>
            ) : null}
          </>
        )}
      </div>

      {/* ========= 直播台：数字人 + 控制台 + 人气（固定浮层） ========= */}
      {liveMode && (
        <>
          {/* 左上：数字人 + 台词气泡 */}
          <div
            style={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 50,
              maxWidth: 380,
            }}
          >
            <DigitalHost
              personality={agent.state.personality}
              line={agent.state.line}
              speaking={agent.state.speaking}
            />
          </div>

          {/* 右上：直播控制台 */}
          <div
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 50,
            }}
          >
            <LiveControlPanel
              stepIndex={agent.state.stepIndex}
              isPlaying={agent.state.isPlaying}
              voice={agent.state.voiceOn}
              speed={agent.state.speed}
              personality={agent.state.personality}
              danmaku={agent.state.danmakuOn}
              onTogglePlay={togglePlayOrPause}
              onNext={() => agent.actions.next()}
              onPrev={() => agent.actions.prev()}
              onRestart={() => agent.actions.restart()}
              onStop={toggleLiveMode}
              onSpeed={(s) => agent.actions.setSpeed(s)}
              onToggleVoice={() => agent.actions.setVoice(!agent.state.voiceOn)}
              onToggleDanmaku={() => agent.actions.setDanmaku(!agent.state.danmakuOn)}
              onChangePersonality={(p) => agent.actions.setPersonality(p)}
              onTriggerEffect={(name) => agent.actions.triggerEffect(name)}
            />
          </div>

          {/* 右下：人气数据 */}
          <div
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 50,
            }}
          >
            <LiveStats
              enabled={true}
              stepIndex={agent.state.stepIndex}
              totalSteps={agent.state.totalSteps}
            />
          </div>
        </>
      )}

      {/* 底部操作（正常模式） */}
      {!liveMode && (
        <div className="max-w-3xl mx-auto mt-12 text-center space-y-4">
          {step !== 'identity' && (
            <button
              onClick={() => {
                if (step === 'profile') setStep('identity')
                else if (step === 'nodes') setStep('profile')
                else if (step === 'overview') setStep('nodes')
                else if (step === 'daily') setStep('overview')
                else if (step === 'nodeDetail') setStep('nodes')
              }}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← 上一步
            </button>
          )}
          <div>
            <button
              onClick={handleRestart}
              className="text-sm text-slate-600 hover:text-slate-400 transition-colors"
            >
              重新开始
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
