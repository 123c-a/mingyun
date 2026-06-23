/**
 * FateOSApp — 命运编译器
 * 迁移自现有的 FateProgramPage，去掉 Agent 浮层，改为窗口内运行
 */

import { useState, useCallback } from 'react'
import { useUniverseStore, FateProfile, LifeNode, FateOverview, DailyCard, Universe } from '../../../store/universeStore'
import IdentityInput from '../../IdentityInput'
import FateProfileCard from '../../FateProfileCard'
import LifeNodesGrid from '../../LifeNodesGrid'
import BranchComparison from '../../BranchComparison'
import FateOverviewView from '../../FateOverview'
import DailyFortuneCard from '../../DailyFortuneCard'
import FateLoading from '../../FateLoading'
import { speech } from '../../../store/speechStore'

type StepId = 'identity' | 'profile' | 'nodes' | 'nodeDetail' | 'overview' | 'daily'

export default function FateOSApp() {
  const [step, setStep] = useState<StepId>('identity')
  const [userName, setUserName] = useState('')
  const [currentNode, setCurrentNode] = useState<LifeNode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fateProfile = useUniverseStore((s) => s.fateProfile)
  const lifeNodes = useUniverseStore((s) => s.lifeNodes)
  const nodeUniverses = useUniverseStore((s) => s.nodeUniverses)
  const fateOverview = useUniverseStore((s) => s.fateOverview)
  const dailyCard = useUniverseStore((s) => s.dailyCard)
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
  const resetFateProgram = useUniverseStore((s) => s.resetFateProgram)
  const isGeneratingNode = useUniverseStore((s) => s.isGeneratingNode)
  const isLoadingFateProfile = useUniverseStore((s) => s.isLoadingFateProfile)
  const isLoadingNodes = useUniverseStore((s) => s.isLoadingNodes)
  const isLoadingOverview = useUniverseStore((s) => s.isLoadingOverview)
  const isLoadingDailyCard = useUniverseStore((s) => s.isLoadingDailyCard)

  const apiCall = async <T,>(endpoint: string, body: any): Promise<T> => {
    const res = await fetch(`http://localhost:3001/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90000),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as T
  }

  const handleIdentitySubmit = async (data: any) => {
    setUserName(data.name || '观测者')
    setError(null)
    setLoadingFateProfile(true)
    setStep('profile')
    try {
      const r = await apiCall<{ profile: FateProfile }>('/fate-profile', data)
      setFateProfileStore(r.profile)
      setLoadingFateProfile(false)
      speech.enqueue(`命运底色已生成：${r.profile.fate_title}`, 'normal', 'excited')
    } catch (err: any) {
      setError(`失败: ${err.message}`)
      setLoadingFateProfile(false)
      setStep('identity')
    }
  }

  const handleProfileContinue = async () => {
    if (!fateProfile) return
    setError(null)
    setLoadingNodes(true)
    setStep('nodes')
    try {
      const r = await apiCall<{ nodes: LifeNode[] }>('/life-nodes', { fate_profile: fateProfile, userInput: '' })
      setLifeNodesStore(r.nodes)
      setLoadingNodes(false)
    } catch (err: any) {
      setError(`失败: ${err.message}`)
      setLoadingNodes(false)
      setStep('profile')
    }
  }

  const handleSelectNode = async (nodeId: number) => {
    const node = lifeNodes.find((n) => n.node_id === nodeId)
    if (!node || !fateProfile) return
    setCurrentNode(node)
    setError(null)
    setStep('nodeDetail')
    if (!nodeUniverses[nodeId]) {
      setGeneratingNode(true)
      try {
        const r = await apiCall<{ branch_a: any; branch_b: any }>('/universes', { fate_profile: fateProfile, life_node: node })
        setNodeBranch(nodeId, 'a', r.branch_a)
        setNodeBranch(nodeId, 'b', r.branch_b)
        setGeneratingNode(false)
      } catch (err: any) {
        setError(`失败: ${err.message}`)
        setGeneratingNode(false)
        setStep('nodes')
      }
    }
  }

  const handleGenerateOverview = async () => {
    const universes: Universe[] = []
    Object.values(nodeUniverses as any).forEach((v: any) => {
      if (v?.branch_a) universes.push(v.branch_a)
      if (v?.branch_b) universes.push(v.branch_b)
    })
    if (!universes.length || !fateProfile) { alert('请先探索至少一个节点'); return }
    setError(null)
    setLoadingOverview(true)
    setStep('overview')
    try {
      const r = await apiCall<{ overview: FateOverview }>('/fate-overview', { universes: universes.slice(0, 6), fateProfile })
      setFateOverviewStore(r.overview)
      setLoadingOverview(false)
    } catch (err: any) {
      setError(`失败: ${err.message}`)
      setLoadingOverview(false)
      setStep('nodes')
    }
  }

  const handleGenerateDaily = async () => {
    setError(null)
    setLoadingDailyCard(true)
    setStep('daily')
    try {
      const r = await apiCall<{ card: DailyCard; date: string }>('/daily-card', {
        birthYear: 1998, birthMonth: 3, birthDay: 14, gender: 'male',
        name: (fateProfile?.fate_title as string) || '观测者',
      })
      setDailyCardStore(r.card)
      setLoadingDailyCard(false)
    } catch (err: any) {
      setError(`失败: ${err.message}`)
      setLoadingDailyCard(false)
      setStep('overview')
    }
  }

  const handleRestart = () => {
    resetFateProgram()
    setStep('identity')
    setUserName('')
    setCurrentNode(null)
    setError(null)
  }

  const stepOrder: StepId[] = ['profile', 'nodes', 'overview', 'daily']
  const currentIndex = stepOrder.indexOf(step === 'nodeDetail' ? 'nodes' : step)
  const isLoading = isLoadingFateProfile || isLoadingNodes || isGeneratingNode || isLoadingOverview || isLoadingDailyCard

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 错误 */}
      {error && (
        <div className="flex-shrink-0 px-4 pt-3">
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex justify-between items-center">
            {error}
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200 ml-2">×</button>
          </div>
        </div>
      )}

      {/* 步骤条 */}
      {step !== 'identity' && (
        <div className="flex-shrink-0 px-4 py-2">
          <div className="flex items-center gap-2">
            {stepOrder.map((s, i) => {
              const labels: Record<StepId, string> = {
                identity: '输入', profile: '底色', nodes: '节点',
                nodeDetail: '分支', overview: '总览', daily: '签文',
              }
              const isActive = currentIndex >= i
              return (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] transition-all ${
                      isActive ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40' : 'bg-slate-800/50 text-slate-500 border border-slate-700'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-purple-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>{i + 1}</span>
                    {labels[s]}
                  </div>
                  {i < stepOrder.length - 1 && (
                    <div className={`w-4 h-px mx-0.5 ${isActive ? 'bg-purple-500/50' : 'bg-slate-700'}`}/>)}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {step === 'identity' && (
          <div>
            <div className="text-center mb-3">
              <button
                onClick={() => handleIdentitySubmit({ birthYear: 1998, birthMonth: 3, birthDay: 14, gender: 'male', name: '演示用户' })}
                className="text-xs text-purple-400 hover:text-purple-200 underline underline-offset-2"
              >
                🎬 快速演示
              </button>
            </div>
            <IdentityInput onSubmit={handleIdentitySubmit} loading={false} />
          </div>
        )}
        {step === 'profile' && (
          isLoadingFateProfile ? <FateLoading stage="fate-profile" /> :
          fateProfile ? <FateProfileCard profile={fateProfile} userName={userName} onContinue={handleProfileContinue} /> : null
        )}
        {step === 'nodes' && (
          isLoadingNodes ? <FateLoading stage="life-nodes" /> :
          <LifeNodesGrid nodes={lifeNodes} onSelect={handleSelectNode} exploredNodes={nodeUniverses as any}
            isGenerating={isGeneratingNode} currentNodeId={null} onContinue={handleGenerateOverview} />
        )}
        {step === 'nodeDetail' && currentNode && fateProfile && (
          isGeneratingNode ? <FateLoading stage="node-universes" /> :
          <BranchComparison nodeId={currentNode.node_id} nodeName={currentNode.node_name}
            nodeDescription={currentNode.node_description} choice_a={currentNode.choice_a} choice_b={currentNode.choice_b}
            branch_a={(nodeUniverses as any)[currentNode.node_id]?.branch_a}
            branch_b={(nodeUniverses as any)[currentNode.node_id]?.branch_b}
            isGenerating={isGeneratingNode} onGenerate={() => handleSelectNode(currentNode.node_id)}
            onBack={() => setStep('nodes')} onNext={() => setStep('nodes')} />
        )}
        {step === 'overview' && (
          isLoadingOverview ? <FateLoading stage="fate-overview" /> :
          fateOverview ? <FateOverviewView overview={fateOverview} userName={userName}
            onExplore={() => setStep('nodes')} onDailyCard={handleGenerateDaily} /> : null
        )}
        {step === 'daily' && (
          isLoadingDailyCard ? <FateLoading stage="daily-card" /> :
          dailyCard ? <DailyFortuneCard card={dailyCard} userName={userName} onRestart={handleRestart} /> : null
        )}
      </div>

      {/* 底部操作 */}
      {step !== 'identity' && (
        <div className="flex-shrink-0 px-4 py-2 flex gap-3 justify-center border-t border-slate-800/50">
          <button onClick={() => {
            if (step === 'profile') setStep('identity')
            else if (step === 'nodes') setStep('profile')
            else if (step === 'overview') setStep('nodes')
            else if (step === 'daily') setStep('overview')
            else if (step === 'nodeDetail') setStep('nodes')
          }} className="text-xs text-slate-500 hover:text-slate-300">← 上一步</button>
          <button onClick={handleRestart} className="text-xs text-slate-600 hover:text-slate-400">重新开始</button>
        </div>
      )}
    </div>
  )
}
