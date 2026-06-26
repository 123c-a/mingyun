import { useState, useEffect, useRef, useCallback } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, encryptText, decryptText } from '../../utils/planetExport'

/* ─────────────── 类型定义 ─────────────── */

interface TimeCapsule {
  id: string
  title: string
  content: string
  mood: string
  sealedAt: string
  unlockAt: string
  unlocked: boolean
  duration: string
}

interface FutureLetter {
  id: string
  title: string
  content: string
  targetYear: number
  createdAt: string
  delivered: boolean
  category: string
}

interface GrowthRing {
  id: string
  year: number
  toNextYear: string
  fromPrevYear?: string
  createdAt: string
  milestones: string[]
}

interface BucketItem {
  id: string
  title: string
  category: string
  completed: boolean
  completedAt?: string
  createdAt: string
  priority: 'high' | 'medium' | 'low'
  note?: string
}

/* ─────────────── 常量数据 ─────────────── */

const TAB_LIST = [
  { id: 'capsule', name: '时间胶囊', icon: '⏳', color: '#e8d8b8' },
  { id: 'letter', name: '给未来的信', icon: '📮', color: '#c8c2ba' },
  { id: 'growth', name: '成长年轮', icon: '🌱', color: '#a8b8a0' },
  { id: 'bucket', name: '倒计时清单', icon: '⏰', color: '#d4a574' },
] as const

const MOOD_OPTIONS = ['平静', '开心', '迷茫', '难过', '期待', '感激', '激动']

const CAPSULE_DURATIONS = [
  { label: '1天', days: 1 },
  { label: '7天', days: 7 },
  { label: '30天', days: 30 },
  { label: '100天', days: 100 },
  { label: '1年', days: 365 },
  { label: '3年', days: 1095 },
]

const FUTURE_YEARS = [1, 3, 5, 10, 20]

const LETTER_CATEGORIES = ['人生感悟', '职业规划', '感情寄语', '健康提醒', '财务目标', '其他']

const BUCKET_CATEGORIES = ['旅行探索', '个人成长', '职业成就', '家庭亲情', '健康运动', '艺术创作', '美食体验', '其他']

const BUCKET_IDEAS = [
  { title: '去一次北极看极光', category: '旅行探索' },
  { title: '写一本书', category: '艺术创作' },
  { title: '学会一门新语言', category: '个人成长' },
  { title: '跑完一场马拉松', category: '健康运动' },
  { title: '带父母环游中国', category: '家庭亲情' },
  { title: '创业一次', category: '职业成就' },
  { title: '学弹一首完整的钢琴曲', category: '艺术创作' },
  { title: '去非洲看动物大迁徙', category: '旅行探索' },
  { title: '存够第一个100万', category: '职业成就' },
  { title: '学会做100道菜', category: '美食体验' },
]

/* ─────────────── 主组件 ─────────────── */

export default function MercurySaturnPage() {
  const config = comboConfigs['mercury-saturn']
  const [activeTab, setActiveTab] = useState<string>('capsule')

  const [capsules, setCapsules] = useLocalStorage<TimeCapsule[]>('ms-capsules', [])
  const [letters, setLetters] = useLocalStorage<FutureLetter[]>('ms-letters', [])
  const [growthRings, setGrowthRings] = useLocalStorage<GrowthRing[]>('ms-growth-rings', [])
  const [bucketList, setBucketList] = useLocalStorage<BucketItem[]>('ms-bucket-list', [])

  return (
    <ComboShell config={config}>
      <div>
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
                color: activeTab === tab.id ? tab.color : 'rgba(245, 236, 216, 0.6)',
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

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {activeTab === 'capsule' && (
            <TimeCapsuleModule capsules={capsules} setCapsules={setCapsules} />
          )}
          {activeTab === 'letter' && (
            <FutureLetterModule letters={letters} setLetters={setLetters} />
          )}
          {activeTab === 'growth' && (
            <GrowthRingModule growthRings={growthRings} setGrowthRings={setGrowthRings} />
          )}
          {activeTab === 'bucket' && (
            <BucketListModule bucketList={bucketList} setBucketList={setBucketList} />
          )}
        </div>
      </div>
    </ComboShell>
  )
}

/* ─────────────── 模块一：时间胶囊 ─────────────── */

function TimeCapsuleModule({ capsules, setCapsules }: {
  capsules: TimeCapsule[]
  setCapsules: (v: TimeCapsule[]) => void
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newMood, setNewMood] = useState('平静')
  const [selectedDuration, setSelectedDuration] = useState(30)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const createCapsule = useCallback(() => {
    if (!newTitle.trim() || !newContent.trim()) return
    const currentDate = new Date()
    const unlockDate = new Date(currentDate.getTime() + selectedDuration * 24 * 60 * 60 * 1000)
    const encrypted = encryptText(newContent.trim(), newTitle.trim())

    const newCapsule: TimeCapsule = {
      id: `${Date.now()}`,
      title: newTitle.trim(),
      content: encrypted,
      mood: newMood,
      sealedAt: currentDate.toISOString(),
      unlockAt: unlockDate.toISOString(),
      unlocked: false,
      duration: `${selectedDuration}天`,
    }

    setCapsules([newCapsule, ...capsules])
    setShowCreate(false)
    setNewTitle('')
    setNewContent('')
    setNewMood('平静')
  }, [newTitle, newContent, newMood, selectedDuration, capsules, setCapsules])

  const unlockCapsule = useCallback((id: string) => {
    setCapsules(capsules.map(c => c.id === id ? { ...c, unlocked: true } : c))
  }, [capsules, setCapsules])

  const getTimeRemaining = (unlockAt: string) => {
    const target = new Date(unlockAt).getTime()
    const diff = target - now
    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (days > 0) return `${days}天${hours}时`
    if (hours > 0) return `${hours}时${minutes}分`
    if (minutes > 0) return `${minutes}分${seconds}秒`
    return `${seconds}秒`
  }

  const isUnlocked = (capsule: TimeCapsule) => {
    if (capsule.unlocked) return true
    return new Date(capsule.unlockAt).getTime() <= now
  }

  const getDecryptedContent = (capsule: TimeCapsule) => {
    if (!capsule.unlocked && new Date(capsule.unlockAt).getTime() > now) return null
    return decryptText(capsule.content, capsule.title)
  }

  const unlockedCount = capsules.filter(c => isUnlocked(c) && c.unlocked).length
  const pendingCount = capsules.filter(c => !isUnlocked(c)).length

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(232, 216, 184, 0.08), rgba(200, 194, 186, 0.04))',
      border: '1px solid rgba(232, 216, 184, 0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="胶囊总数" value={capsules.length} icon="⏳" color="#e8d8b8" />
        <StatCard label="已开启" value={unlockedCount} icon="📬" color="#a8b8a0" />
        <StatCard label="等待中" value={pendingCount} icon="🔒" color="#c8c2ba" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(232, 216, 184, 0.25), rgba(200, 180, 140, 0.15))',
            border: '1px solid rgba(232, 216, 184, 0.5)',
            color: '#f5ecd8',
            fontSize: 13,
            letterSpacing: 4,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          ⏳ 封存一颗时间胶囊
        </button>
      </div>

      {showCreate && (
        <div style={{
          padding: 24,
          borderRadius: 20,
          background: 'rgba(232, 216, 184, 0.06)',
          border: '1px solid rgba(232, 216, 184, 0.2)',
          backdropFilter: 'blur(10px)',
          marginBottom: 30,
        }}>
          <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#e8d8b8' }}>
            ✉ 写一封信给未来的自己
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="给这颗胶囊起个名字"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(232, 216, 184, 0.25)',
                color: '#f5ecd8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="此刻你想将未来说什么……"
              style={{
                width: '100%',
                minHeight: 120,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(232, 216, 184, 0.25)',
                color: '#f5ecd8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              此刻的心情
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setNewMood(m)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: newMood === m ? 'rgba(232, 216, 184, 0.2)' : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${newMood === m ? 'rgba(232, 216, 184, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: newMood === m ? '#e8d8b8' : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              封存多久
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CAPSULE_DURATIONS.map((d) => (
                <button
                  key={d.days}
                  onClick={() => setSelectedDuration(d.days)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    background: selectedDuration === d.days
                      ? 'rgba(232, 216, 184, 0.2)'
                      : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${selectedDuration === d.days
                      ? 'rgba(232, 216, 184, 0.5)'
                      : 'rgba(255,255,255,0.1)'}`,
                    color: selectedDuration === d.days ? '#e8d8b8' : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowCreate(false)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={createCapsule}
              disabled={!newTitle.trim() || !newContent.trim()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(232, 216, 184, 0.25), rgba(200, 180, 140, 0.15))',
                border: '1px solid rgba(232, 216, 184, 0.5)',
                color: '#f5ecd8',
                fontSize: 12,
                letterSpacing: 3,
                cursor: newTitle.trim() && newContent.trim() ? 'pointer' : 'not-allowed',
                opacity: newTitle.trim() && newContent.trim() ? 1 : 0.5,
              }}
            >
              ⏳ 封存
            </button>
          </div>
        </div>
      )}

      {capsules.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            我的时间胶囊
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {capsules.map((capsule) => {
              const canOpen = isUnlocked(capsule)
              const remaining = getTimeRemaining(capsule.unlockAt)
              const isSelected = selectedId === capsule.id
              const decrypted = isSelected ? getDecryptedContent(capsule) : null

              return (
                <div
                  key={capsule.id}
                  onClick={() => setSelectedId(isSelected ? null : capsule.id)}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: canOpen && capsule.unlocked
                      ? 'linear-gradient(135deg, rgba(232, 216, 184, 0.1), rgba(200, 180, 140, 0.06))'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${canOpen && capsule.unlocked
                      ? 'rgba(232, 216, 184, 0.3)'
                      : 'rgba(255,255,255,0.08)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>
                      {canOpen && capsule.unlocked && '📬 '}
                      {!capsule.unlocked && !canOpen && '🔒 '}
                      {canOpen && !capsule.unlocked && '✨ '}
                      {capsule.title}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>
                      {capsule.duration}
                    </div>
                  </div>

                  <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 12 }}>
                    封存于 {new Date(capsule.sealedAt).toLocaleDateString('zh-CN')}
                    {' · '}
                    开启日 {new Date(capsule.unlockAt).toLocaleDateString('zh-CN')}
                  </div>

                  {!canOpen && (
                    <div style={{
                      textAlign: 'center',
                      padding: '12px 0',
                      fontSize: 13,
                      color: '#e8d8b8',
                      letterSpacing: 2,
                    }}>
                      ⏳ {remaining}后开启
                    </div>
                  )}

                  {canOpen && !capsule.unlocked && (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          unlockCapsule(capsule.id)
                        }}
                        style={{
                          padding: '8px 24px',
                          borderRadius: 999,
                          background: 'linear-gradient(135deg, rgba(232, 216, 184, 0.25), rgba(200, 180, 140, 0.15))',
                          border: '1px solid rgba(232, 216, 184, 0.5)',
                          color: '#f5ecd8',
                          fontSize: 12,
                          letterSpacing: 2,
                          cursor: 'pointer',
                        }}
                      >
                        ✨ 开启胶囊
                      </button>
                    </div>
                  )}

                  {isSelected && capsule.unlocked && decrypted && (
                    <div style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8 }}>
                        心情：{capsule.mood}
                      </div>
                      <div style={{
                        fontSize: 14,
                        lineHeight: 1.8,
                        padding: 14,
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.15)',
                        fontStyle: 'italic',
                      }}>
                        {decrypted}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        !showCreate && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有时间胶囊
            </div>
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              写一封信给未来的自己，让时间替你保管
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 模块二：给未来的信 ─────────────── */

function FutureLetterModule({ letters, setLetters }: {
  letters: FutureLetter[]
  setLetters: (v: FutureLetter[]) => void
}) {
  const [showWrite, setShowWrite] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetYear, setTargetYear] = useState(5)
  const [category, setCategory] = useState('人生感悟')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const currentYear = new Date().getFullYear()

  const writeLetter = useCallback(() => {
    if (!title.trim() || !content.trim()) return
    const newLetter: FutureLetter = {
      id: `${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      targetYear: currentYear + targetYear,
      createdAt: new Date().toISOString(),
      delivered: false,
      category,
    }
    setLetters([newLetter, ...letters])
    setShowWrite(false)
    setTitle('')
    setContent('')
  }, [title, content, targetYear, category, currentYear, letters, setLetters])

  const deliveredCount = letters.filter(l => l.delivered).length
  const inTransitCount = letters.filter(l => !l.delivered).length
  const categories = [...new Set(letters.map(l => l.category))].length

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(200, 194, 186, 0.08), rgba(232, 216, 184, 0.04))',
      border: '1px solid rgba(200, 194, 186, 0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="信件总数" value={letters.length} icon="📮" color="#c8c2ba" />
        <StatCard label="已送达" value={deliveredCount} icon="📬" color="#a8b8a0" />
        <StatCard label="分类数" value={categories} icon="🏷️" color="#e8d8b8" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setShowWrite(!showWrite)}
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(200, 194, 186, 0.25), rgba(232, 216, 184, 0.15))',
            border: '1px solid rgba(200, 194, 186, 0.5)',
            color: '#f5ecd8',
            fontSize: 13,
            letterSpacing: 4,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          📮 写一封给未来的信
        </button>
      </div>

      {showWrite && (
        <div style={{
          padding: 24,
          borderRadius: 20,
          background: 'rgba(200, 194, 186, 0.06)',
          border: '1px solid rgba(200, 194, 186, 0.2)',
          backdropFilter: 'blur(10px)',
          marginBottom: 30,
        }}>
          <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#c8c2ba' }}>
            ✉ 致未来的自己
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="信件标题"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(200, 194, 186, 0.25)',
                color: '#f5ecd8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="亲爱的未来的我，你好吗……"
              style={{
                width: '100%',
                minHeight: 160,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(200, 194, 186, 0.25)',
                color: '#f5ecd8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.8,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              寄给多少年後的自己
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FUTURE_YEARS.map(y => (
                <button
                  key={y}
                  onClick={() => setTargetYear(y)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    background: targetYear === y
                      ? 'rgba(200, 194, 186, 0.2)'
                      : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${targetYear === y
                      ? 'rgba(200, 194, 186, 0.5)'
                      : 'rgba(255,255,255,0.1)'}`,
                    color: targetYear === y ? '#c8c2ba' : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {y}年后
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, opacity: 0.4, marginTop: 8 }}>
              将在 {currentYear + targetYear} 年送达
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              信件分类
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LETTER_CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: category === c ? 'rgba(200, 194, 186, 0.2)' : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${category === c ? 'rgba(200, 194, 186, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: category === c ? '#c8c2ba' : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowWrite(false)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={writeLetter}
              disabled={!title.trim() || !content.trim()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(200, 194, 186, 0.25), rgba(232, 216, 184, 0.15))',
                border: '1px solid rgba(200, 194, 186, 0.5)',
                color: '#f5ecd8',
                fontSize: 12,
                letterSpacing: 3,
                cursor: title.trim() && content.trim() ? 'pointer' : 'not-allowed',
                opacity: title.trim() && content.trim() ? 1 : 0.5,
              }}
            >
              📮 寄出
            </button>
          </div>
        </div>
      )}

      {letters.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            寄出的信（最近5封）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {letters.slice(0, 5).map(letter => {
              const isDelivered = new Date().getFullYear() >= letter.targetYear
              const isSelected = selectedId === letter.id

              return (
                <div
                  key={letter.id}
                  onClick={() => setSelectedId(isSelected ? null : letter.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 14,
                    background: isDelivered
                      ? 'linear-gradient(135deg, rgba(168, 184, 160, 0.1), rgba(200, 194, 186, 0.06))'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isDelivered ? 'rgba(168, 184, 160, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {isDelivered ? '📬 ' : '📤 '}{letter.title}
                    </div>
                    <span style={{
                      fontSize: 10,
                      padding: '3px 8px',
                      borderRadius: 999,
                      background: 'rgba(200, 194, 186, 0.15)',
                      color: '#c8c2ba',
                    }}>
                      {letter.category}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 12,
                    opacity: 0.6,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                    <span>{new Date(letter.createdAt).toLocaleDateString('zh-CN')}寄出</span>
                    <span>·</span>
                    <span style={{ color: isDelivered ? '#a8b8a0' : '#e8d8b8' }}>
                      {isDelivered ? '已送达' : `寄往 ${letter.targetYear} 年`}
                    </span>
                  </div>

                  {isSelected && isDelivered && (
                    <div style={{
                      padding: 14,
                      borderRadius: 10,
                      background: 'rgba(0,0,0,0.15)',
                      fontSize: 13,
                      lineHeight: 1.8,
                      fontStyle: 'italic',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      marginTop: 12,
                    }}>
                      {letter.content}
                    </div>
                  )}

                  {isSelected && !isDelivered && (
                    <div style={{
                      marginTop: 12,
                      textAlign: 'center',
                      fontSize: 12,
                      opacity: 0.6,
                      fontStyle: 'italic',
                    }}>
                      🕰️ 这封信还在路上，{letter.targetYear - new Date().getFullYear()} 年后才能拆开哦
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        !showWrite && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📮</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有寄出的信
            </div>
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              写一封信，穿越时空，遇见未来的自己
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 模块三：成长年轮 ─────────────── */

function GrowthRingModule({ growthRings, setGrowthRings }: {
  growthRings: GrowthRing[]
  setGrowthRings: (v: GrowthRing[]) => void
}) {
  const currentYear = new Date().getFullYear()
  const [showWrite, setShowWrite] = useState(false)
  const [toNextYear, setToNextYear] = useState('')
  const [milestones, setMilestones] = useState<string[]>([])
  const [newMilestone, setNewMilestone] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const currentRing = growthRings.find(r => r.year === currentYear)

  const addMilestone = () => {
    if (!newMilestone.trim()) return
    setMilestones([...milestones, newMilestone.trim()])
    setNewMilestone('')
  }

  const removeMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx))
  }

  const saveRing = useCallback(() => {
    if (!toNextYear.trim()) return
    const existing = growthRings.findIndex(r => r.year === currentYear)
    const newRing: GrowthRing = {
      id: existing >= 0 ? growthRings[existing].id : `${Date.now()}`,
      year: currentYear,
      toNextYear: toNextYear.trim(),
      fromPrevYear: existing >= 0 ? growthRings[existing].fromPrevYear : undefined,
      createdAt: existing >= 0 ? growthRings[existing].createdAt : new Date().toISOString(),
      milestones,
    }

    if (existing >= 0) {
      const updated = [...growthRings]
      updated[existing] = newRing
      setGrowthRings(updated)
    } else {
      setGrowthRings([newRing, ...growthRings].sort((a, b) => b.year - a.year))
    }

    setShowWrite(false)
    setToNextYear('')
    setMilestones([])
  }, [toNextYear, milestones, currentYear, growthRings, setGrowthRings])

  useEffect(() => {
    if (currentRing) {
      setToNextYear(currentRing.toNextYear)
      setMilestones(currentRing.milestones)
    }
  }, [])

  const totalYears = growthRings.length
  const totalMilestones = growthRings.reduce((s, r) => s + r.milestones.length, 0)
  const hasCurrentYear = !!currentRing

  const sortedRings = [...growthRings].sort((a, b) => b.year - a.year)

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(168, 184, 160, 0.08), rgba(232, 216, 184, 0.04))',
      border: '1px solid rgba(168, 184, 160, 0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="记录年数" value={`${totalYears}年`} icon="🌱" color="#a8b8a0" />
        <StatCard label="里程碑" value={totalMilestones} icon="🏆" color="#e8d8b8" />
        <StatCard label="今年已写" value={hasCurrentYear ? '✓' : '✗'} icon="📝" color={hasCurrentYear ? '#a8b8a0' : '#c8c2ba'} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setShowWrite(!showWrite)}
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(168, 184, 160, 0.25), rgba(232, 216, 184, 0.15))',
            border: '1px solid rgba(168, 184, 160, 0.5)',
            color: '#f5ecd8',
            fontSize: 13,
            letterSpacing: 4,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          🌱 {currentRing ? '编辑今年的年轮' : '写下今年的年轮'}
        </button>
      </div>

      {showWrite && (
        <div style={{
          padding: 24,
          borderRadius: 20,
          background: 'rgba(168, 184, 160, 0.06)',
          border: '1px solid rgba(168, 184, 160, 0.2)',
          backdropFilter: 'blur(10px)',
          marginBottom: 30,
        }}>
          <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#a8b8a0' }}>
            🌿 {currentYear} 年 · 给明年的自己
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              今年的里程碑（重要事件）
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                value={newMilestone}
                onChange={e => setNewMilestone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                placeholder="添加一个里程碑……"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(168, 184, 160, 0.25)',
                  color: '#f5ecd8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={addMilestone}
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: 'rgba(168, 184, 160, 0.2)',
                  border: '1px solid rgba(168, 184, 160, 0.4)',
                  color: '#a8b8a0',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                添加
              </button>
            </div>
            {milestones.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {milestones.map((m, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'rgba(168, 184, 160, 0.15)',
                      border: '1px solid rgba(168, 184, 160, 0.3)',
                      fontSize: 11,
                      color: '#a8b8a0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    🏆 {m}
                    <span
                      onClick={() => removeMilestone(i)}
                      style={{ cursor: 'pointer', opacity: 0.6 }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              想对明年的自己说的话
            </div>
            <textarea
              value={toNextYear}
              onChange={e => setToNextYear(e.target.value)}
              placeholder="亲爱的明年的我，你好……"
              style={{
                width: '100%',
                minHeight: 120,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(168, 184, 160, 0.25)',
                color: '#f5ecd8',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.8,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowWrite(false)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={saveRing}
              disabled={!toNextYear.trim()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(168, 184, 160, 0.25), rgba(232, 216, 184, 0.15))',
                border: '1px solid rgba(168, 184, 160, 0.5)',
                color: '#f5ecd8',
                fontSize: 12,
                letterSpacing: 3,
                cursor: toNextYear.trim() ? 'pointer' : 'not-allowed',
                opacity: toNextYear.trim() ? 1 : 0.5,
              }}
            >
              🌿 保存
            </button>
          </div>
        </div>
      )}

      {sortedRings.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            成长年轮
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: 20,
              top: 10,
              bottom: 10,
              width: 2,
              background: 'linear-gradient(to bottom, #a8b8a0, #e8d8b8)',
              opacity: 0.3,
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {sortedRings.map(ring => {
                const isSelected = selectedYear === ring.year
                const isCurrent = ring.year === currentYear

                return (
                  <div key={ring.id} style={{ display: 'flex', gap: 16 }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: isCurrent
                        ? 'linear-gradient(135deg, #a8b8a0, #e8d8b8)'
                        : 'rgba(168, 184, 160, 0.2)',
                      border: `2px solid ${isCurrent ? '#a8b8a0' : 'rgba(168, 184, 160, 0.4)'}`,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                      color: isCurrent ? '#1a1610' : '#a8b8a0',
                      zIndex: 1,
                    }}>
                      {ring.year.toString().slice(2)}
                    </div>
                    <div
                      onClick={() => setSelectedYear(isSelected ? null : ring.year)}
                      style={{
                        flex: 1,
                        padding: 16,
                        borderRadius: 14,
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(168, 184, 160, 0.12), rgba(232, 216, 184, 0.08))'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? 'rgba(168, 184, 160, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        fontSize: 15,
                        fontWeight: 500,
                        marginBottom: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        {ring.year} 年
                        {isCurrent && (
                          <span style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 999,
                            background: 'rgba(168, 184, 160, 0.2)',
                            color: '#a8b8a0',
                            fontWeight: 400,
                          }}>
                            今年
                          </span>
                        )}
                      </div>
                      {ring.milestones.length > 0 && (
                        <div style={{
                          fontSize: 12,
                          opacity: 0.7,
                          marginBottom: 8,
                        }}>
                          🏆 {ring.milestones.length} 个里程碑
                        </div>
                      )}
                      {isSelected && (
                        <div style={{ marginTop: 12 }}>
                          {ring.milestones.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6 }}>里程碑</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {ring.milestones.map((m, i) => (
                                  <span key={i} style={{
                                    padding: '4px 10px',
                                    borderRadius: 999,
                                    background: 'rgba(168, 184, 160, 0.15)',
                                    border: '1px solid rgba(168, 184, 160, 0.3)',
                                    fontSize: 11,
                                    color: '#a8b8a0',
                                  }}>
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div style={{
                            fontSize: 12,
                            opacity: 0.5,
                            marginBottom: 6,
                          }}>
                            给下一年的话
                          </div>
                          <div style={{
                            fontSize: 13,
                            lineHeight: 1.8,
                            padding: 12,
                            borderRadius: 10,
                            background: 'rgba(0,0,0,0.15)',
                            fontStyle: 'italic',
                          }}>
                            {ring.toNextYear}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        !showWrite && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有成长记录
            </div>
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              每年写一封给明年的信，记录你的成长轨迹
            </div>
          </div>
        )
      )}
    </div>
  )
}

/* ─────────────── 模块四：倒计时清单 ─────────────── */

function BucketListModule({ bucketList, setBucketList }: {
  bucketList: BucketItem[]
  setBucketList: (v: BucketItem[]) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('旅行探索')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [note, setNote] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'done'>('all')

  const addItem = useCallback(() => {
    if (!title.trim()) return
    const newItem: BucketItem = {
      id: `${Date.now()}`,
      title: title.trim(),
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      note: note.trim() || undefined,
    }
    setBucketList([newItem, ...bucketList])
    setShowAdd(false)
    setTitle('')
    setNote('')
  }, [title, category, priority, note, bucketList, setBucketList])

  const toggleComplete = useCallback((id: string) => {
    setBucketList(bucketList.map(item =>
      item.id === id
        ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : undefined }
        : item
    ))
  }, [bucketList, setBucketList])

  const deleteItem = useCallback((id: string) => {
    setBucketList(bucketList.filter(item => item.id !== id))
  }, [bucketList, setBucketList])

  const addIdea = (idea: { title: string; category: string }) => {
    const newItem: BucketItem = {
      id: `${Date.now()}`,
      title: idea.title,
      category: idea.category,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium',
    }
    setBucketList([newItem, ...bucketList])
  }

  const totalItems = bucketList.length
  const completedItems = bucketList.filter(i => i.completed).length
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  const categoriesUsed = [...new Set(bucketList.map(i => i.category))].length

  const priorityConfig = {
    high: { label: '高', color: '#d4a574', icon: '🔥' },
    medium: { label: '中', color: '#e8d8b8', icon: '✨' },
    low: { label: '低', color: '#c8c2ba', icon: '🌙' },
  }

  const filteredList = bucketList.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    if (filterStatus === 'pending' && item.completed) return false
    if (filterStatus === 'done' && !item.completed) return false
    return true
  })

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.08), rgba(232, 216, 184, 0.04))',
      border: '1px solid rgba(212, 165, 116, 0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="清单总数" value={totalItems} icon="📋" color="#d4a574" />
        <StatCard label="已完成" value={completedItems} icon="✅" color="#a8b8a0" />
        <StatCard label="完成率" value={`${completionRate}%`} icon="🎯" color="#e8d8b8" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            padding: '14px 40px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.25), rgba(232, 216, 184, 0.15))',
            border: '1px solid rgba(212, 165, 116, 0.5)',
            color: '#f5ecd8',
            fontSize: 13,
            letterSpacing: 4,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          ⏰ 添加人生清单
        </button>
      </div>

      {showAdd && (
        <div style={{
          padding: 24,
          borderRadius: 20,
          background: 'rgba(212, 165, 116, 0.06)',
          border: '1px solid rgba(212, 165, 116, 0.2)',
          backdropFilter: 'blur(10px)',
          marginBottom: 30,
        }}>
          <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#d4a574' }}>
            ✨ 死前想做的一件事
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="我想……"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(212, 165, 116, 0.25)',
                color: '#f5ecd8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              分类
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {BUCKET_CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: category === c ? 'rgba(212, 165, 116, 0.2)' : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${category === c ? 'rgba(212, 165, 116, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: category === c ? '#d4a574' : 'rgba(255,255,255,0.5)',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              优先级
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['high', 'medium', 'low'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 10,
                    background: priority === p ? `${priorityConfig[p].color}20` : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${priority === p ? priorityConfig[p].color : 'rgba(255,255,255,0.1)'}`,
                    color: priority === p ? priorityConfig[p].color : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  {priorityConfig[p].icon} {priorityConfig[p].label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              备注（可选）
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="为什么想做这件事？有什么特别的意义？"
              style={{
                width: '100%',
                minHeight: 60,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(212, 165, 116, 0.25)',
                color: '#f5ecd8',
                fontSize: 12,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                letterSpacing: 2,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={addItem}
              disabled={!title.trim()}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.25), rgba(232, 216, 184, 0.15))',
                border: '1px solid rgba(212, 165, 116, 0.5)',
                color: '#f5ecd8',
                fontSize: 12,
                letterSpacing: 3,
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                opacity: title.trim() ? 1 : 0.5,
              }}
            >
              ➕ 添加
            </button>
          </div>
        </div>
      )}

      {!showAdd && bucketList.length < 3 && (
        <div style={{
          padding: 20,
          borderRadius: 16,
          background: 'rgba(212, 165, 116, 0.04)',
          border: '1px solid rgba(212, 165, 116, 0.15)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>
            💡 不知道写什么？试试这些灵感
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BUCKET_IDEAS.slice(0, 6).map((idea, i) => (
              <button
                key={i}
                onClick={() => addIdea(idea)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(245, 236, 216, 0.7)',
                  fontSize: 11,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                + {idea.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {bucketList.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 16,
          flexWrap: 'wrap',
          fontSize: 11,
        }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ opacity: 0.5 }}>分类:</span>
            <button
              onClick={() => setFilterCategory('all')}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                background: filterCategory === 'all' ? 'rgba(212, 165, 116, 0.2)' : 'transparent',
                border: `1px solid ${filterCategory === 'all' ? 'rgba(212, 165, 116, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: filterCategory === 'all' ? '#d4a574' : 'rgba(255,255,255,0.5)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              全部
            </button>
            {BUCKET_CATEGORIES.slice(0, 4).map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: filterCategory === c ? 'rgba(212, 165, 116, 0.2)' : 'transparent',
                  border: `1px solid ${filterCategory === c ? 'rgba(212, 165, 116, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: filterCategory === c ? '#d4a574' : 'rgba(255,255,255,0.5)',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ opacity: 0.5 }}>状态:</span>
            {(['all', 'pending', 'done'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: filterStatus === s ? 'rgba(212, 165, 116, 0.2)' : 'transparent',
                  border: `1px solid ${filterStatus === s ? 'rgba(212, 165, 116, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: filterStatus === s ? '#d4a574' : 'rgba(255,255,255,0.5)',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {s === 'all' ? '全部' : s === 'pending' ? '待完成' : '已完成'}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredList.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            人生清单 ({filteredList.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredList.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: item.completed
                    ? 'rgba(168, 184, 160, 0.06)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${item.completed ? 'rgba(168, 184, 160, 0.2)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  transition: 'all 0.2s',
                }}
              >
                <button
                  onClick={() => toggleComplete(item.id)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: item.completed ? '#a8b8a0' : 'transparent',
                    border: `2px solid ${item.completed ? '#a8b8a0' : priorityConfig[item.priority].color}`,
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: item.completed ? '#1a1610' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  ✓
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                    textDecoration: item.completed ? 'line-through' : 'none',
                    opacity: item.completed ? 0.5 : 1,
                    marginBottom: 4,
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 11,
                    opacity: 0.6,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: 'rgba(212, 165, 116, 0.12)',
                      color: '#d4a574',
                    }}>
                      {item.category}
                    </span>
                    <span>{priorityConfig[item.priority].icon}</span>
                    <span>
                      {item.completed && item.completedAt
                        ? `完成于 ${new Date(item.completedAt).toLocaleDateString('zh-CN')}`
                        : `添加于 ${new Date(item.createdAt).toLocaleDateString('zh-CN')}`}
                    </span>
                  </div>
                  {item.note && (
                    <div style={{
                      marginTop: 8,
                      fontSize: 12,
                      opacity: 0.5,
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}>
                      {item.note}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: 16,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    opacity: 0.6,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        bucketList.length > 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              当前筛选没有结果
            </div>
          </div>
        )
      )}

      {bucketList.length === 0 && !showAdd && (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏰</div>
          <div style={{ fontSize: 13, letterSpacing: 2 }}>
            还没有人生清单
          </div>
          <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
            写下死前想做的100件事，不虚此生
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
