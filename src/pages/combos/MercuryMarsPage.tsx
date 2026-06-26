import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

/* ─────────────── 类型定义 ─────────────── */

interface DecisionItem {
  id: string
  question: string
  optionA: string
  optionB: string
  choice: 'A' | 'B'
  reason: string
  createdAt: string
  responseTime: number
}

interface SpeechItem {
  id: string
  topic: string
  duration: number
  date: string
  rating: number
  note: string
}

interface BlueprintItem {
  id: string
  thought: string
  actionSteps: string[]
  deadline: string
  priority: 'high' | 'medium' | 'low'
  status: 'draft' | 'in-progress' | 'done'
  createdAt: string
}

interface SprintItem {
  id: string
  goal: string
  duration: number
  completed: boolean
  date: string
  focusScore: number
  note: string
}

/* ─────────────── 常量数据 ─────────────── */

const TAB_LIST = [
  { id: 'forge', name: '思维兵工厂', icon: '⚔️', color: '#ff6b35' },
  { id: 'speech', name: '言辞熔炉', icon: '🔥', color: '#ff8c42' },
  { id: 'blueprint', name: '行动蓝图', icon: '⚡', color: '#ffb347' },
  { id: 'sprint', name: '冲刺实验室', icon: '🚀', color: '#64b5f6' },
] as const

const DECISION_PROMPTS = [
  { q: '今天的首要任务是？', a: '处理最难的事', b: '先做简单的热身' },
  { q: '遇到意见分歧时', a: '直接表达观点', b: '先倾听再回应' },
  { q: '学习新技能时', a: '边做边学', b: '先研究理论' },
  { q: '面对风险决策', a: '相信直觉快速出击', b: '谨慎评估再行动' },
  { q: '时间不够用时', a: '抓重点放弃完美', b: '加班也要做好' },
  { q: '团队合作中', a: '主动带领方向', b: '配合他人节奏' },
  { q: '处理冲突时', a: '直面问题解决', b: '冷静后再沟通' },
  { q: '设定目标时', a: '跳高一点挑战自己', b: '务实一点确保完成' },
  { q: '遇到挫折时', a: '立刻换方法再战', b: '先复盘总结经验' },
  { q: '日常表达中', a: '直接坦率说出来', b: '委婉含蓄地表达' },
  { q: '做计划时', a: '大方向明确就开干', b: '细节规划周全再动' },
  { q: '面对机会时', a: '先抓住再说', b: '想清楚再决定' },
]

const SPEECH_TOPICS = [
  '如果我能给五年前的自己一个建议',
  '我理想中的一天是什么样的',
  '最近学到的一个重要道理',
  '我最感激的一个人或一件事',
  '如果明天就是世界末日',
  '我的一个小怪癖',
  '最近让我感到快乐的小事',
  '我想改变的一个习惯',
  '童年最难忘的记忆',
  '如果我有超能力',
  '我心中的英雄是谁',
  '最近读过的一本好书/电影',
  '我的人生座右铭',
  '如果我是亿万富翁',
  '我最害怕的一件事',
  '我的完美周末',
  '最喜欢的季节和原因',
  '如果能和任何人共进晚餐',
]

const SPRINT_DURATIONS = [
  { label: '闪电冲刺 15min', value: 15, desc: '快速搞定小事' },
  { label: '经典番茄 25min', value: 25, desc: '标准专注时段' },
  { label: '深度工作 45min', value: 45, desc: '沉浸式攻坚' },
  { label: '马拉松 90min', value: 90, desc: '终极挑战' },
]

/* ─────────────── 主组件 ─────────────── */

export default function MercuryMarsPage() {
  const config = comboConfigs['mercury-mars']
  const [activeTab, setActiveTab] = useState<string>('forge')

  const [decisions, setDecisions] = useLocalStorage<DecisionItem[]>('mm-decisions', [])
  const [speeches, setSpeeches] = useLocalStorage<SpeechItem[]>('mm-speeches', [])
  const [blueprints, setBlueprints] = useLocalStorage<BlueprintItem[]>('mm-blueprints', [])
  const [sprints, setSprints] = useLocalStorage<SprintItem[]>('mm-sprints', [])

  const activeTabData = TAB_LIST.find(t => t.id === activeTab)!

  return (
    <ComboShell config={config}>
      <div>
        {/* 标签导航 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 40,
          flexWrap: 'wrap',
        }}>
          {TAB_LIST.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 28px',
                borderRadius: 999,
                background: activeTab === tab.id
                  ? `linear-gradient(135deg, ${tab.color}40, ${tab.color}15)`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.1)'}`,
                color: activeTab === tab.id ? tab.color : 'rgba(255,232,192,0.6)',
                fontSize: 13,
                letterSpacing: 3,
                cursor: 'pointer',
                transition: 'all 0.3s',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* 模块内容 */}
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {activeTab === 'forge' && (
            <ThoughtForge decisions={decisions} setDecisions={setDecisions} />
          )}
          {activeTab === 'speech' && (
            <SpeechForge speeches={speeches} setSpeeches={setSpeeches} />
          )}
          {activeTab === 'blueprint' && (
            <ActionBlueprint blueprints={blueprints} setBlueprints={setBlueprints} />
          )}
          {activeTab === 'sprint' && (
            <SprintLab sprints={sprints} setSprints={setSprints} />
          )}
        </div>
      </div>
    </ComboShell>
  )
}

/* ─────────────── 模块一：思维兵工厂 ─────────────── */

function ThoughtForge({ decisions, setDecisions }: {
  decisions: DecisionItem[]
  setDecisions: (v: DecisionItem[]) => void
}) {
  const [phase, setPhase] = useState<'idle' | 'deciding' | 'reason'>('idle')
  const [currentPrompt, setCurrentPrompt] = useState(DECISION_PROMPTS[0])
  const [startTime, setStartTime] = useState(0)
  const [choice, setChoice] = useState<'A' | 'B' | null>(null)
  const [reason, setReason] = useState('')
  const [streak, setStreak] = useState(0)

  const startRound = useCallback(() => {
    const random = DECISION_PROMPTS[Math.floor(Math.random() * DECISION_PROMPTS.length)]
    setCurrentPrompt(random)
    setStartTime(Date.now())
    setChoice(null)
    setReason('')
    setPhase('deciding')
  }, [])

  const makeChoice = useCallback((c: 'A' | 'B') => {
    setChoice(c)
    setPhase('reason')
  }, [])

  const saveDecision = useCallback(() => {
    const responseTime = Math.round((Date.now() - startTime) / 1000)
    const newItem: DecisionItem = {
      id: `${Date.now()}`,
      question: currentPrompt.q,
      optionA: currentPrompt.a,
      optionB: currentPrompt.b,
      choice: choice!,
      reason: reason.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
      responseTime,
    }
    setDecisions([newItem, ...decisions])
    setStreak(s => s + 1)
    setPhase('idle')
  }, [currentPrompt, choice, reason, startTime, decisions, setDecisions])

  const avgResponseTime = useMemo(() => {
    if (decisions.length === 0) return 0
    const total = decisions.reduce((sum, d) => sum + d.responseTime, 0)
    return Math.round(total / decisions.length)
  }, [decisions])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,179,71,0.04))',
      border: '1px solid rgba(255,107,53,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计概览 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="决策总数" value={decisions.length} icon="⚔️" color="#ff6b35" />
        <StatCard label="平均用时" value={`${avgResponseTime}s`} icon="⚡" color="#ffb347" />
        <StatCard label="连胜" value={streak} icon="🔥" color="#ff8c42" />
      </div>

      {/* 主交互区 */}
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⚔️</div>
          <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 2, color: '#ff6b35' }}>
            思维兵工厂
          </div>
          <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 30, lineHeight: 1.8 }}>
            火星的果决 + 水星的聪慧<br />
            在二选一的瞬间，磨砺你的决策力
          </div>
          <button
            onClick={startRound}
            style={{
              padding: '16px 48px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #ff6b35, #ffb347)',
              border: 'none',
              color: '#1a0f05',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 4,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(255,107,53,0.3)',
            }}
          >
            开始决策训练
          </button>
        </div>
      )}

      {phase === 'deciding' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, opacity: 0.4, letterSpacing: 3, marginBottom: 20 }}>
            第 {decisions.length + 1} 道决策题
          </div>
          <div style={{
            fontSize: 20,
            marginBottom: 40,
            lineHeight: 1.6,
            padding: '20px 24px',
            borderRadius: 16,
            background: 'rgba(255,107,53,0.08)',
            border: '1px solid rgba(255,107,53,0.2)',
          }}>
            {currentPrompt.q}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <button
              onClick={() => makeChoice('A')}
              style={{
                padding: '30px 20px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,107,53,0.05))',
                border: '2px solid rgba(255,107,53,0.4)',
                color: '#ffe8c0',
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s',
                lineHeight: 1.6,
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.borderColor = '#ff6b35'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>🅰️</div>
              {currentPrompt.a}
            </button>
            <button
              onClick={() => makeChoice('B')}
              style={{
                padding: '30px 20px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(100,181,246,0.2), rgba(100,181,246,0.05))',
                border: '2px solid rgba(100,181,246,0.4)',
                color: '#ffe8c0',
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s',
                lineHeight: 1.6,
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.borderColor = '#64b5f6'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.borderColor = 'rgba(100,181,246,0.4)'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>🅱️</div>
              {currentPrompt.b}
            </button>
          </div>
        </div>
      )}

      {phase === 'reason' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 14, opacity: 0.5, letterSpacing: 2, marginBottom: 10 }}>
              你选择了 {choice === 'A' ? 'A' : 'B'}
            </div>
            <div style={{ fontSize: 16, color: choice === 'A' ? '#ff6b35' : '#64b5f6' }}>
              {choice === 'A' ? currentPrompt.a : currentPrompt.b}
            </div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>
            为什么这么选？（给自己一个理由）
          </div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="记录你的决策逻辑……"
            style={{
              width: '100%',
              minHeight: 100,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,107,53,0.25)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setPhase('deciding')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              重新选择
            </button>
            <button
              onClick={saveDecision}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ff6b35, #ffb347)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: 'pointer',
              }}
            >
              ✔ 确认并继续
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {decisions.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            决策记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {decisions.slice(0, 5).map(d => (
              <div key={d.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, opacity: 0.9 }}>{d.question}</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: d.choice === 'A' ? 'rgba(255,107,53,0.2)' : 'rgba(100,181,246,0.2)',
                    color: d.choice === 'A' ? '#ff6b35' : '#64b5f6',
                    fontWeight: 600,
                  }}>
                    选{d.choice}
                  </span>
                  <span>{d.createdAt}</span>
                  <span>·</span>
                  <span>{d.responseTime}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块二：言辞熔炉 ─────────────── */

function SpeechForge({ speeches, setSpeeches }: {
  speeches: SpeechItem[]
  setSpeeches: (v: SpeechItem[]) => void
}) {
  const [phase, setPhase] = useState<'idle' | 'prep' | 'speaking' | 'done'>('idle')
  const [currentTopic, setCurrentTopic] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [duration, setDuration] = useState(60)
  const timerRef = useRef<number | null>(null)
  const [rating, setRating] = useState(3)
  const [note, setNote] = useState('')

  const drawTopic = useCallback(() => {
    const topic = SPEECH_TOPICS[Math.floor(Math.random() * SPEECH_TOPICS.length)]
    setCurrentTopic(topic)
    setPhase('prep')
  }, [])

  const startSpeech = useCallback(() => {
    setTimeLeft(duration)
    setPhase('speaking')
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [duration])

  const endEarly = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setPhase('done')
  }, [])

  const saveSpeech = useCallback(() => {
    const actualDuration = duration - timeLeft
    const newItem: SpeechItem = {
      id: `${Date.now()}`,
      topic: currentTopic,
      duration: actualDuration > 0 ? actualDuration : duration,
      date: new Date().toLocaleDateString('zh-CN'),
      rating,
      note: note.trim(),
    }
    setSpeeches([newItem, ...speeches])
    setPhase('idle')
    setRating(3)
    setNote('')
  }, [currentTopic, duration, timeLeft, rating, note, speeches, setSpeeches])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = ((duration - timeLeft) / duration) * 100

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,140,66,0.08), rgba(255,107,53,0.04))',
      border: '1px solid rgba(255,140,66,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="演讲次数" value={speeches.length} icon="🎤" color="#ff8c42" />
        <StatCard
          label="总时长"
          value={`${speeches.reduce((s, x) => s + x.duration, 0)}s`}
          icon="⏱️"
          color="#ff6b35"
        />
        <StatCard
          label="平均评分"
          value={speeches.length > 0 ? (speeches.reduce((s, x) => s + x.rating, 0) / speeches.length).toFixed(1) : '-'}
          icon="⭐"
          color="#ffb347"
        />
      </div>

      {/* 空闲状态 */}
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🔥</div>
          <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 2, color: '#ff8c42' }}>
            言辞熔炉
          </div>
          <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.8 }}>
            水星的表达 × 火星的勇气<br />
            随机抽题，即兴演讲，锻造表达力
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 12, letterSpacing: 2 }}>
              选择演讲时长
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[30, 60, 90, 120].map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 999,
                    background: duration === d
                      ? 'linear-gradient(135deg, rgba(255,140,66,0.3), rgba(255,140,66,0.1))'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${duration === d ? '#ff8c42' : 'rgba(255,255,255,0.1)'}`,
                    color: duration === d ? '#ff8c42' : 'rgba(255,232,192,0.6)',
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {d}秒
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={drawTopic}
            style={{
              padding: '16px 48px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #ff8c42, #ff6b35)',
              border: 'none',
              color: '#1a0f05',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 4,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(255,140,66,0.3)',
            }}
          >
            🎲 抽题开始
          </button>
        </div>
      )}

      {/* 准备阶段 */}
      {phase === 'prep' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 12, opacity: 0.4, letterSpacing: 3, marginBottom: 16 }}>
            你抽到的题目是
          </div>
          <div style={{
            fontSize: 22,
            lineHeight: 1.6,
            padding: '28px 24px',
            borderRadius: 16,
            background: 'rgba(255,140,66,0.1)',
            border: '1px solid rgba(255,140,66,0.3)',
            marginBottom: 28,
          }}>
            「{currentTopic}」
          </div>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 20 }}>
            时长：{duration}秒 · 准备好就开始
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={drawTopic}
              style={{
                padding: '12px 28px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              🔄 换一题
            </button>
            <button
              onClick={startSpeech}
              style={{
                padding: '12px 36px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ff8c42, #ff6b35)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: 'pointer',
              }}
            >
              🔥 开始演讲
            </button>
          </div>
        </div>
      )}

      {/* 演讲中 */}
      {phase === 'speaking' && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 20, letterSpacing: 2 }}>
            {currentTopic}
          </div>
          <div style={{
            fontSize: 72,
            fontWeight: 200,
            color: timeLeft <= 10 ? '#ff6b35' : '#ff8c42',
            textShadow: `0 0 40px ${timeLeft <= 10 ? 'rgba(255,107,53,0.5)' : 'rgba(255,140,66,0.4)'}`,
            marginBottom: 24,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            marginBottom: 30,
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #ff8c42, #ff6b35)',
              transition: 'width 1s linear',
            }} />
          </div>
          <button
            onClick={endEarly}
            style={{
              padding: '12px 40px',
              borderRadius: 999,
              background: 'rgba(255,107,53,0.15)',
              border: '1px solid rgba(255,107,53,0.4)',
              color: '#ff6b35',
              fontSize: 12,
              letterSpacing: 3,
              cursor: 'pointer',
            }}
          >
            结束演讲
          </button>
        </div>
      )}

      {/* 完成 */}
      {phase === 'done' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, color: '#ff8c42', letterSpacing: 2, marginBottom: 6 }}>
              演讲完成！
            </div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>
              用时 {duration - timeLeft} 秒
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>
            今天的发挥怎么样？
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setRating(s)}
                style={{
                  fontSize: 28,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: rating >= s ? 1 : 0.3,
                  transition: 'all 0.2s',
                  transform: rating >= s ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                ⭐
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>
            收获记录（可选）
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="这次演讲有什么感悟？下次可以怎么改进？"
            style={{
              width: '100%',
              minHeight: 80,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,140,66,0.25)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setPhase('idle')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              放弃
            </button>
            <button
              onClick={saveSpeech}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ff8c42, #ff6b35)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: 'pointer',
              }}
            >
              ✔ 保存记录
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {speeches.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            演讲记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {speeches.slice(0, 5).map(s => (
              <div key={s.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, opacity: 0.9 }}>「{s.topic}」</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  <span>{s.date}</span>
                  <span>·</span>
                  <span>{s.duration}s</span>
                  <span>·</span>
                  <span>{'⭐'.repeat(s.rating)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块三：行动蓝图 ─────────────── */

function ActionBlueprint({ blueprints, setBlueprints }: {
  blueprints: BlueprintItem[]
  setBlueprints: (v: BlueprintItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [thought, setThought] = useState('')
  const [step1, setStep1] = useState('')
  const [step2, setStep2] = useState('')
  const [step3, setStep3] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')

  const createBlueprint = useCallback(() => {
    if (!thought.trim()) return
    const steps = [step1, step2, step3].filter(Boolean)
    const newItem: BlueprintItem = {
      id: `${Date.now()}`,
      thought: thought.trim(),
      actionSteps: steps.length > 0 ? steps : ['迈出第一步'],
      deadline,
      priority,
      status: 'draft',
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setBlueprints([newItem, ...blueprints])
    setShowForm(false)
    setThought('')
    setStep1('')
    setStep2('')
    setStep3('')
    setDeadline('')
    setPriority('medium')
  }, [thought, step1, step2, step3, deadline, priority, blueprints, setBlueprints])

  const toggleStatus = useCallback((id: string) => {
    setBlueprints(blueprints.map(b => {
      if (b.id !== id) return b
      if (b.status === 'draft') return { ...b, status: 'in-progress' }
      if (b.status === 'in-progress') return { ...b, status: 'done' }
      return { ...b, status: 'draft' }
    }))
  }, [blueprints, setBlueprints])

  const priorityConfig = {
    high: { label: '高优先级', color: '#ff6b35', icon: '🔥' },
    medium: { label: '中优先级', color: '#ffb347', icon: '⚡' },
    low: { label: '低优先级', color: '#64b5f6', icon: '❄️' },
  }

  const statusConfig = {
    draft: { label: '草稿', color: 'rgba(255,255,255,0.4)' },
    'in-progress': { label: '进行中', color: '#ffb347' },
    done: { label: '已完成', color: '#78e08f' },
  }

  const doneCount = blueprints.filter(b => b.status === 'done').length

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,179,71,0.08), rgba(255,140,66,0.04))',
      border: '1px solid rgba(255,179,71,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="蓝图总数" value={blueprints.length} icon="⚡" color="#ffb347" />
        <StatCard label="进行中" value={blueprints.filter(b => b.status === 'in-progress').length} icon="🔥" color="#ff8c42" />
        <StatCard label="已完成" value={doneCount} icon="✅" color="#78e08f" />
      </div>

      {/* 新建按钮 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255,179,71,0.15), rgba(255,140,66,0.05))',
            border: '2px dashed rgba(255,179,71,0.4)',
            color: '#ffb347',
            fontSize: 14,
            letterSpacing: 3,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.3s',
          }}
        >
          ⚡ 把一个念头变成行动蓝图
        </button>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,179,71,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#ffb347', marginBottom: 16, letterSpacing: 2 }}>
            ⚡ 锻造行动蓝图
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            你的念头是？
          </div>
          <textarea
            value={thought}
            onChange={e => setThought(e.target.value)}
            placeholder="把你脑子里那个想法写下来……"
            style={{
              width: '100%',
              minHeight: 70,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,179,71,0.2)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8, letterSpacing: 1 }}>
            具体行动步骤（最多3步）
          </div>
          {['第一步', '第二步', '第三步'].map((label, i) => (
            <input
              key={i}
              type="text"
              value={i === 0 ? step1 : i === 1 ? step2 : step3}
              onChange={e => {
                if (i === 0) setStep1(e.target.value)
                else if (i === 1) setStep2(e.target.value)
                else setStep3(e.target.value)
              }}
              placeholder={`${label}……`}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,179,71,0.2)',
                color: '#ffe8c0',
                fontSize: 13,
                outline: 'none',
                marginBottom: 10,
                boxSizing: 'border-box',
              }}
            />
          ))}

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>目标日期</div>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,179,71,0.2)',
                  color: '#ffe8c0',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>优先级</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['high', 'medium', 'low'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      background: priority === p
                        ? `${priorityConfig[p].color}30`
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${priority === p ? priorityConfig[p].color : 'rgba(255,255,255,0.1)'}`,
                      color: priority === p ? priorityConfig[p].color : 'rgba(255,232,192,0.5)',
                      fontSize: 11,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {priorityConfig[p].icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={createBlueprint}
              disabled={!thought.trim()}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ffb347, #ff8c42)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: thought.trim() ? 'pointer' : 'not-allowed',
                opacity: thought.trim() ? 1 : 0.5,
              }}
            >
              ⚡ 生成蓝图
            </button>
          </div>
        </div>
      )}

      {/* 列表 */}
      {blueprints.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            行动蓝图
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {blueprints.map(b => (
              <div key={b.id} style={{
                padding: '18px 20px',
                borderRadius: 14,
                background: b.status === 'done'
                  ? 'rgba(120,224,143,0.06)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${b.status === 'done' ? 'rgba(120,224,143,0.2)' : 'rgba(255,255,255,0.06)'}`,
                opacity: b.status === 'done' ? 0.6 : 1,
                transition: 'all 0.3s',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 10,
                }}>
                  <button
                    onClick={() => toggleStatus(b.id)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: b.status === 'done'
                        ? '#78e08f'
                        : 'transparent',
                      border: `2px solid ${statusConfig[b.status].color}`,
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: b.status === 'done' ? '#1a0f05' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    ✓
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      textDecoration: b.status === 'done' ? 'line-through' : 'none',
                      opacity: b.status === 'done' ? 0.5 : 1,
                    }}>
                      {b.thought}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: `${priorityConfig[b.priority].color}20`,
                    color: priorityConfig[b.priority].color,
                    flexShrink: 0,
                  }}>
                    {priorityConfig[b.priority].icon}
                  </span>
                </div>

                {b.actionSteps.length > 0 && (
                  <div style={{ marginLeft: 36, marginBottom: 10 }}>
                    {b.actionSteps.map((step, i) => (
                      <div key={i} style={{
                        fontSize: 12,
                        opacity: 0.6,
                        padding: '4px 0',
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}>
                        <span style={{ color: '#ffb347', flexShrink: 0 }}>{i + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{
                  marginLeft: 36,
                  display: 'flex',
                  gap: 10,
                  fontSize: 11,
                  opacity: 0.4,
                }}>
                  <span>{b.createdAt}</span>
                  {b.deadline && (<><span>·</span><span>截止 {b.deadline}</span></>)}
                  <span>·</span>
                  <span style={{ color: statusConfig[b.status].color, opacity: 1 }}>
                    {statusConfig[b.status].label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有行动蓝图
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 模块四：冲刺实验室 ─────────────── */

function SprintLab({ sprints, setSprints }: {
  sprints: SprintItem[]
  setSprints: (v: SprintItem[]) => void
}) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')
  const [selectedDuration, setSelectedDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [goal, setGoal] = useState('')
  const timerRef = useRef<number | null>(null)
  const [focusScore, setFocusScore] = useState(3)
  const [note, setNote] = useState('')

  const startSprint = useCallback(() => {
    setTimeLeft(selectedDuration * 60)
    setPhase('running')
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [selectedDuration])

  const stopSprint = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setPhase('done')
  }, [])

  const saveSprint = useCallback(() => {
    const completed = timeLeft === 0
    const actualDuration = selectedDuration * 60 - timeLeft
    const newItem: SprintItem = {
      id: `${Date.now()}`,
      goal: goal.trim() || '未命名冲刺',
      duration: Math.round(actualDuration / 60),
      completed,
      date: new Date().toLocaleDateString('zh-CN'),
      focusScore,
      note: note.trim(),
    }
    setSprints([newItem, ...sprints])
    setPhase('idle')
    setGoal('')
    setFocusScore(3)
    setNote('')
  }, [selectedDuration, timeLeft, goal, focusScore, note, sprints, setSprints])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const totalSprintMin = sprints.reduce((s, x) => s + x.duration, 0)
  const completedSprints = sprints.filter(s => s.completed).length

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(100,181,246,0.08), rgba(255,179,71,0.04))',
      border: '1px solid rgba(100,181,246,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="冲刺次数" value={sprints.length} icon="🚀" color="#64b5f6" />
        <StatCard label="专注时长" value={`${totalSprintMin}m`} icon="⏱️" color="#ffb347" />
        <StatCard label="完成率" value={sprints.length > 0 ? `${Math.round(completedSprints / sprints.length * 100)}%` : '-'} icon="🎯" color="#78e08f" />
      </div>

      {/* 空闲 */}
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🚀</div>
          <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 2, color: '#64b5f6' }}>
            冲刺实验室
          </div>
          <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.8 }}>
            火星的冲劲 + 水星的专注<br />
            设定目标，全神贯注，高效冲刺
          </div>

          <input
            type="text"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="这次冲刺的目标是……"
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(100,181,246,0.25)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              marginBottom: 24,
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 14, letterSpacing: 2 }}>
            选择冲刺时长
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 28,
          }}>
            {SPRINT_DURATIONS.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDuration(d.value)}
                style={{
                  padding: '16px 12px',
                  borderRadius: 14,
                  background: selectedDuration === d.value
                    ? 'linear-gradient(135deg, rgba(100,181,246,0.25), rgba(100,181,246,0.08))'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedDuration === d.value ? '#64b5f6' : 'rgba(255,255,255,0.1)'}`,
                  color: selectedDuration === d.value ? '#64b5f6' : 'rgba(255,232,192,0.6)',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{d.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={startSprint}
            style={{
              padding: '16px 56px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #64b5f6, #ffb347)',
              border: 'none',
              color: '#1a0f05',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 4,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(100,181,246,0.3)',
            }}
          >
            🚀 开始冲刺
          </button>
        </div>
      )}

      {/* 进行中 */}
      {phase === 'running' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {goal && (
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 20, letterSpacing: 1 }}>
              🎯 {goal}
            </div>
          )}
          <div style={{
            fontSize: 80,
            fontWeight: 200,
            color: timeLeft < 60 ? '#ff6b35' : '#64b5f6',
            textShadow: `0 0 60px ${timeLeft < 60 ? 'rgba(255,107,53,0.5)' : 'rgba(100,181,246,0.4)'}`,
            marginBottom: 24,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: 4,
          }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            marginBottom: 30,
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #64b5f6, #ffb347)',
              transition: 'width 1s linear',
            }} />
          </div>
          <button
            onClick={stopSprint}
            style={{
              padding: '12px 40px',
              borderRadius: 999,
              background: 'rgba(255,107,53,0.15)',
              border: '1px solid rgba(255,107,53,0.4)',
              color: '#ff6b35',
              fontSize: 12,
              letterSpacing: 3,
              cursor: 'pointer',
            }}
          >
            结束冲刺
          </button>
        </div>
      )}

      {/* 完成 */}
      {phase === 'done' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {timeLeft === 0 ? '🎉' : '⏸️'}
            </div>
            <div style={{ fontSize: 18, color: '#64b5f6', letterSpacing: 2, marginBottom: 6 }}>
              {timeLeft === 0 ? '冲刺完成！' : '已暂停'}
            </div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>
              专注了 {Math.round((selectedDuration * 60 - timeLeft) / 60)} 分钟
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>
            专注质量打分
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setFocusScore(s)}
                style={{
                  fontSize: 28,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: focusScore >= s ? 1 : 0.3,
                  transition: 'all 0.2s',
                  transform: focusScore >= s ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                🌟
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 10, letterSpacing: 2 }}>
            冲刺笔记（可选）
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="这次冲刺效率如何？有什么收获？"
            style={{
              width: '100%',
              minHeight: 80,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(100,181,246,0.25)',
              color: '#ffe8c0',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setPhase('idle')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,232,192,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              放弃
            </button>
            <button
              onClick={saveSprint}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #64b5f6, #ffb347)',
                border: 'none',
                color: '#1a0f05',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: 'pointer',
              }}
            >
              ✔ 保存记录
            </button>
          </div>
        </div>
      )}

      {/* 历史 */}
      {sprints.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            冲刺记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sprints.slice(0, 5).map(s => (
              <div key={s.id} style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}>
                <div style={{ marginBottom: 6, opacity: 0.9 }}>
                  {s.completed ? '✅' : '⏸️'} {s.goal}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  <span>{s.date}</span>
                  <span>·</span>
                  <span>{s.duration}分钟</span>
                  <span>·</span>
                  <span>{'🌟'.repeat(s.focusScore)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 通用统计卡片 ─────────────── */

function StatCard({ label, value, icon, color }: {
  label: string
  value: number | string
  icon: string
  color: string
}) {
  return (
    <div style={{
      padding: '16px 12px',
      borderRadius: 14,
      background: 'rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.06)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>{label}</div>
    </div>
  )
}
