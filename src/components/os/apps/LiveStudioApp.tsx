/**
 * LiveStudioApp — 星际直播台
 * 迁移自 FateProgramPage 中的 Agent 直播模式，独立窗口运行
 */

import { useState, useEffect } from 'react'
import DigitalHost from '../../DigitalHost'
import LiveControlPanel from '../../LiveControlPanel'
import DanmakuLayer from '../../DanmakuLayer'
import LiveStats from '../../LiveStats'
import { useLiveAgent } from '../../../hooks/useLiveAgent'
import { DEMO_USER } from '../../../data/liveScripts'
import { useUniverseStore, FateProfile, LifeNode, FateOverview, DailyCard, Universe } from '../../../store/universeStore'
import { speech } from '../../../store/speechStore'

export default function LiveStudioApp() {
  const [liveMode, setLiveMode] = useState(true)

  const fateProfile = useUniverseStore((s) => s.fateProfile)
  const lifeNodes = useUniverseStore((s) => s.lifeNodes)
  const nodeUniverses = useUniverseStore((s) => s.nodeUniverses)
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

  const apiCall = async <T,>(endpoint: string, body: any): Promise<T> => {
    const res = await fetch(`http://localhost:3001/api${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(90000),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as T
  }

  const runApi = async (stepId: string) => {
    switch (stepId) {
      case 'profile': {
        setLoadingFateProfile(true)
        const r = await apiCall<{ profile: FateProfile }>('/fate-profile', DEMO_USER)
        setFateProfileStore(r.profile)
        setLoadingFateProfile(false)
        break
      }
      case 'nodes': {
        if (!fateProfile) break
        setLoadingNodes(true)
        const r = await apiCall<{ nodes: LifeNode[] }>('/life-nodes', { fate_profile: fateProfile, userInput: '' })
        setLifeNodesStore(r.nodes)
        setLoadingNodes(false)
        break
      }
      case 'branch': {
        const node = (useUniverseStore.getState().lifeNodes.length > 0 ? useUniverseStore.getState().lifeNodes : lifeNodes)?.[0]
        if (!node) break
        setGeneratingNode(true)
        const pf = useUniverseStore.getState().fateProfile || fateProfile
        const r = await apiCall<{ branch_a: any; branch_b: any }>('/universes', { fate_profile: pf, life_node: node })
        setNodeBranch(node.node_id, 'a', r.branch_a)
        setNodeBranch(node.node_id, 'b', r.branch_b)
        setGeneratingNode(false)
        break
      }
      case 'overview': {
        const pf = useUniverseStore.getState().fateProfile || fateProfile
        setLoadingOverview(true)
        const r = await apiCall<{ overview: FateOverview }>('/fate-overview', {
          universes: Object.values(useUniverseStore.getState().nodeUniverses as any)
            .flatMap((v: any) => [v?.branch_a, v?.branch_b]).filter(Boolean).slice(0, 6),
          fateProfile: pf,
        })
        setFateOverviewStore(r.overview)
        setLoadingOverview(false)
        break
      }
      case 'daily': {
        setLoadingDailyCard(true)
        const r = await apiCall<{ card: DailyCard; date: string }>('/daily-card', {
          birthYear: DEMO_USER.birthYear, birthMonth: DEMO_USER.birthMonth,
          birthDay: DEMO_USER.birthDay, gender: DEMO_USER.gender,
          name: (useUniverseStore.getState().fateProfile?.fate_title as string) || '观测者',
        })
        setDailyCardStore(r.card)
        setLoadingDailyCard(false)
        break
      }
    }
  }

  const agent = useLiveAgent({ enabled: liveMode, runApi })

  const togglePlay = () => {
    if (agent.state.isPlaying) agent.actions.pause()
    else agent.actions.play()
  }

  const handleStop = () => {
    speech.stop()
    agent.actions.stop()
    resetFateProgram()
    setLiveMode(false)
  }

  if (!liveMode) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-5xl">📺</div>
        <div className="text-center">
          <div className="text-white font-bold mb-1">星际直播台</div>
          <div className="text-slate-400 text-xs">数字人主播为你自动演示命运推演</div>
        </div>
        <button
          onClick={() => { resetFateProgram(); agent.actions.restart(); setLiveMode(true) }}
          className="px-6 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(168,85,247,0.25))',
            border: '1px solid rgba(251,191,36,0.5)',
            color: '#fde68a',
          }}
        >
          ▶ 开启直播演示
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'rgba(6,10,24,0.97)' }}>
      {/* 弹幕层 */}
      <DanmakuLayer
        enabled={agent.state.danmakuOn}
        stepIndex={agent.state.stepIndex}
        personality={agent.state.personality}
        burstSignal={agent.state.burstSignal}
      />

      {/* 数字人区域 */}
      <div className="flex-shrink-0 px-4 pt-4">
        <DigitalHost
          personality={agent.state.personality}
          line={agent.state.line}
          speaking={agent.state.speaking}
        />
      </div>

      {/* 控制面板 */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <LiveControlPanel
          stepIndex={agent.state.stepIndex}
          isPlaying={agent.state.isPlaying}
          voice={agent.state.voiceOn}
          speed={agent.state.speed}
          personality={agent.state.personality}
          danmaku={agent.state.danmakuOn}
          onTogglePlay={togglePlay}
          onNext={() => agent.actions.next()}
          onPrev={() => agent.actions.prev()}
          onRestart={() => agent.actions.restart()}
          onStop={handleStop}
          onSpeed={(s) => agent.actions.setSpeed(s)}
          onToggleVoice={() => agent.actions.setVoice(!agent.state.voiceOn)}
          onToggleDanmaku={() => agent.actions.setDanmaku(!agent.state.danmakuOn)}
          onChangePersonality={(p) => agent.actions.setPersonality(p)}
          onTriggerEffect={(name) => agent.actions.triggerEffect(name)}
        />
      </div>

      {/* 底部人气 */}
      <div className="flex-shrink-0 px-4 pb-3">
        <LiveStats
          enabled={true}
          stepIndex={agent.state.stepIndex}
          totalSteps={agent.state.totalSteps}
        />
      </div>
    </div>
  )
}
