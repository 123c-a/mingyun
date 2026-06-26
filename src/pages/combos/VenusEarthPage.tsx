import { useState, useMemo, useCallback } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

/* ─────────────── 类型定义 ─────────────── */

interface GuardianItem {
  id: string
  name: string
  type: string
  reason: string
  createdAt: string
}

interface GratitudeEntry {
  id: string
  date: string
  items: string[]
  note: string
  createdAt: string
}

interface GentleMoment {
  id: string
  title: string
  description: string
  mood: string
  createdAt: string
}

interface KindnessAction {
  id: string
  content: string
  category: 'stranger' | 'friend' | 'family'
  recipient: string
  feeling: string
  createdAt: string
}

/* ─────────────── 常量数据 ─────────────── */

const TAB_LIST = [
  { id: 'guardian', name: '守护清单', icon: '💝', color: '#ffd0e8' },
  { id: 'gratitude', name: '感恩日记', icon: '🙏', color: '#ffb8d8' },
  { id: 'moment', name: '温柔时刻', icon: '🌸', color: '#ffc8e0' },
  { id: 'kindness', name: '善意行动', icon: '🎁', color: '#70c8f0' },
] as const

const GUARDIAN_TYPES = ['人', '事物', '信念', '习惯', '地方', '其他']

const MOOD_OPTIONS = [
  { value: '温暖', icon: '🌅', color: '#ffd0e8' },
  { value: '感动', icon: '🥹', color: '#ffb8d8' },
  { value: '平静', icon: '🌊', color: '#70c8f0' },
  { value: '喜悦', icon: '🌸', color: '#ffc8e0' },
  { value: '治愈', icon: '✨', color: '#e8d0ff' },
]

const CATEGORY_CONFIG = {
  stranger: { label: '陌生人', icon: '👤', color: '#70c8f0' },
  friend: { label: '朋友', icon: '🤝', color: '#ffd0e8' },
  family: { label: '家人', icon: '🏠', color: '#ffb8d8' },
}

/* ─────────────── 主组件 ─────────────── */

export default function VenusEarthPage() {
  const config = comboConfigs['venus-earth']
  const [activeTab, setActiveTab] = useState<string>('guardian')

  const [guardians, setGuardians] = useLocalStorage<GuardianItem[]>('ve-guardians', [])
  const [gratitudes, setGratitudes] = useLocalStorage<GratitudeEntry[]>('ve-gratitudes', [])
  const [moments, setMoments] = useLocalStorage<GentleMoment[]>('ve-moments', [])
  const [kindnesses, setKindnesses] = useLocalStorage<KindnessAction[]>('ve-kindnesses', [])

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
                color: activeTab === tab.id ? tab.color : 'rgba(255,232,240,0.6)',
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
          {activeTab === 'guardian' && (
            <GuardianList guardians={guardians} setGuardians={setGuardians} />
          )}
          {activeTab === 'gratitude' && (
            <GratitudeDiary gratitudes={gratitudes} setGratitudes={setGratitudes} />
          )}
          {activeTab === 'moment' && (
            <GentleMoments moments={moments} setMoments={setMoments} />
          )}
          {activeTab === 'kindness' && (
            <KindnessActions kindnesses={kindnesses} setKindnesses={setKindnesses} />
          )}
        </div>
      </div>
    </ComboShell>
  )
}

/* ─────────────── 模块一：守护清单 ─────────────── */

function GuardianList({ guardians, setGuardians }: {
  guardians: GuardianItem[]
  setGuardians: (v: GuardianItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('人')
  const [reason, setReason] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addItem = useCallback(() => {
    if (!name.trim()) return
    const newItem: GuardianItem = {
      id: `${Date.now()}`,
      name: name.trim(),
      type,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    }
    setGuardians([newItem, ...guardians])
    setShowForm(false)
    setName('')
    setReason('')
    setSelectedId(newItem.id)
  }, [name, type, reason, guardians, setGuardians])

  const typeStats = useMemo(() => {
    const counts: Record<string, number> = {}
    guardians.forEach(g => {
      counts[g.type] = (counts[g.type] || 0) + 1
    })
    return counts
  }, [guardians])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,208,232,0.08), rgba(255,184,216,0.04))',
      border: '1px solid rgba(255,208,232,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计概览 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="守护总数" value={guardians.length} icon="💝" color="#ffd0e8" />
        <StatCard
          label="守护类型"
          value={Object.keys(typeStats).length}
          icon="🌈"
          color="#ffb8d8"
        />
        <StatCard
          label="有人守护"
          value={guardians.filter(g => g.type === '人').length}
          icon="❤️"
          color="#70c8f0"
        />
      </div>

      {/* 添加按钮 */}
      {!showForm && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '16px 48px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #ffd0e8, #ffb8d8)',
              border: 'none',
              color: '#1a1518',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 4,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(255,208,232,0.3)',
            }}
          >
            💝 记录守护对象
          </button>
        </div>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,208,232,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#ffd0e8', marginBottom: 16, letterSpacing: 2 }}>
            💝 记录想要守护的一切
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              名称
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="想要守护的是什么……"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,208,232,0.25)',
                color: '#ffe8f0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              类型
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {GUARDIAN_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: type === t ? 'rgba(255,208,232,0.2)' : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${type === t ? 'rgba(255,208,232,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: type === t ? '#ffd0e8' : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              为什么要守护它
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="它对你意味着什么……"
              style={{
                width: '100%',
                minHeight: 100,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,208,232,0.25)',
                color: '#ffe8f0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.7,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '11px 20px',
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
              disabled={!name.trim()}
              style={{
                flex: 1,
                padding: '11px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ffd0e8, #ffb8d8)',
                border: 'none',
                color: '#1a1518',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                opacity: name.trim() ? 1 : 0.5,
              }}
            >
              💝 记录
            </button>
          </div>
        </div>
      )}

      {/* 列表 */}
      {guardians.length > 0 ? (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            守护清单
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {guardians.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                style={{
                  padding: 18,
                  borderRadius: 16,
                  background: selectedId === item.id
                    ? 'linear-gradient(135deg, rgba(255,208,232,0.1), rgba(255,184,216,0.06))'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedId === item.id ? 'rgba(255,208,232,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#ffe8f0' }}>
                    💝 {item.name}
                  </div>
                  <div style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: 'rgba(255,208,232,0.15)',
                    color: '#ffd0e8',
                  }}>
                    {item.type}
                  </div>
                </div>

                {item.reason && (
                  <div style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.8 }}>
                    {selectedId === item.id
                      ? item.reason
                      : item.reason.length > 80 ? item.reason.slice(0, 80) + '…' : item.reason}
                  </div>
                )}

                <div style={{ fontSize: 10, opacity: 0.4, marginTop: 10 }}>
                  {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💝</div>
            <div style={{ fontSize: 13, letterSpacing: 2 }}>
              还没有守护清单
            </div>
            <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
              用温柔的力量<br />
              守护你珍视的一切
            </div>
          </div>
        )
      )}

      {/* 历史记录（最近5条摘要） */}
      {guardians.length > 5 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            早期守护（共 {guardians.length} 条）
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块二：感恩日记 ─────────────── */

function GratitudeDiary({ gratitudes, setGratitudes }: {
  gratitudes: GratitudeEntry[]
  setGratitudes: (v: GratitudeEntry[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [item1, setItem1] = useState('')
  const [item2, setItem2] = useState('')
  const [item3, setItem3] = useState('')
  const [note, setNote] = useState('')

  const today = new Date().toLocaleDateString('zh-CN')
  const hasTodayEntry = gratitudes.some(g => g.date === today)

  const saveEntry = useCallback(() => {
    const items = [item1, item2, item3].filter(Boolean)
    if (items.length === 0) return
    const newEntry: GratitudeEntry = {
      id: `${Date.now()}`,
      date: today,
      items,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    }
    setGratitudes([newEntry, ...gratitudes.filter(g => g.date !== today)])
    setShowForm(false)
    setItem1('')
    setItem2('')
    setItem3('')
    setNote('')
  }, [item1, item2, item3, note, today, gratitudes, setGratitudes])

  const totalItems = useMemo(() => {
    return gratitudes.reduce((sum, g) => sum + g.items.length, 0)
  }, [gratitudes])

  const streakDays = useMemo(() => {
    if (gratitudes.length === 0) return 0
    let streak = 0
    const todayDate = new Date()
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(todayDate)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toLocaleDateString('zh-CN')
      if (gratitudes.some(g => g.date === dateStr)) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    return streak
  }, [gratitudes])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,184,216,0.08), rgba(255,208,232,0.04))',
      border: '1px solid rgba(255,184,216,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="记录天数" value={gratitudes.length} icon="📅" color="#ffb8d8" />
        <StatCard label="感恩总数" value={totalItems} icon="🙏" color="#ffd0e8" />
        <StatCard label="连续天数" value={streakDays} icon="🔥" color="#70c8f0" />
      </div>

      {/* 今日状态 / 写日记按钮 */}
      {!showForm && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          {hasTodayEntry ? (
            <div style={{ padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
              <div style={{ fontSize: 16, color: '#ffd0e8', marginBottom: 8, letterSpacing: 2 }}>
                今天已经感恩过啦
              </div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 20 }}>
                保持这份感恩的心，明天继续
              </div>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '12px 32px',
                  borderRadius: 999,
                  background: 'rgba(255,208,232,0.15)',
                  border: '1px solid rgba(255,208,232,0.4)',
                  color: '#ffd0e8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: 'pointer',
                }}
              >
                修改今日感恩
              </button>
            </div>
          ) : (
            <div style={{ padding: '20px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🙏</div>
              <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 2, color: '#ffb8d8' }}>
                感恩日记
              </div>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.8 }}>
                每天记录3件感恩的事<br />
                让温柔的力量充满生活
              </div>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '16px 48px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #ffb8d8, #ffd0e8)',
                  border: 'none',
                  color: '#1a1518',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 4,
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(255,184,216,0.3)',
                }}
              >
                写下今天的感恩
              </button>
            </div>
          )}
        </div>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,184,216,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#ffb8d8', marginBottom: 4, letterSpacing: 2 }}>
            🙏 今天的三件感恩小事
          </div>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 16 }}>
            {today}
          </div>

          {[1, 2, 3].map((num) => {
            const value = num === 1 ? item1 : num === 2 ? item2 : item3
            const setter = num === 1 ? setItem1 : num === 2 ? setItem2 : setItem3
            return (
              <div key={num} style={{ marginBottom: 12 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}>
                  <span style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(255,184,216,0.2)',
                    color: '#ffb8d8',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {num}
                  </span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={`第${num}件感恩的事……`}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,184,216,0.2)',
                      color: '#ffe8f0',
                      fontSize: 13,
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            )
          })}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              今日感悟（可选）
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="今天还有什么想说的……"
              style={{
                width: '100%',
                minHeight: 60,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,184,216,0.25)',
                color: '#ffe8f0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.7,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '11px 20px',
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
              onClick={saveEntry}
              disabled={!item1.trim() && !item2.trim() && !item3.trim()}
              style={{
                flex: 1,
                padding: '11px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ffb8d8, #ffd0e8)',
                border: 'none',
                color: '#1a1518',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: (item1.trim() || item2.trim() || item3.trim()) ? 'pointer' : 'not-allowed',
                opacity: (item1.trim() || item2.trim() || item3.trim()) ? 1 : 0.5,
              }}
            >
              🙏 保存感恩
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {gratitudes.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            感恩记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {gratitudes.slice(0, 5).map(entry => (
              <div key={entry.id} style={{
                padding: '16px 18px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  fontSize: 12,
                  color: '#ffb8d8',
                  marginBottom: 10,
                  letterSpacing: 1,
                }}>
                  📅 {entry.date}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {entry.items.map((item, i) => (
                    <div key={i} style={{
                      fontSize: 13,
                      opacity: 0.9,
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-start',
                      lineHeight: 1.6,
                    }}>
                      <span style={{ color: '#ffb8d8', flexShrink: 0 }}>🙏</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                {entry.note && (
                  <div style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 12,
                    opacity: 0.6,
                    lineHeight: 1.6,
                  }}>
                    💭 {entry.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块三：温柔时刻 ─────────────── */

function GentleMoments({ moments, setMoments }: {
  moments: GentleMoment[]
  setMoments: (v: GentleMoment[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mood, setMood] = useState('温暖')

  const addMoment = useCallback(() => {
    if (!title.trim() && !description.trim()) return
    const newMoment: GentleMoment = {
      id: `${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      mood,
      createdAt: new Date().toISOString(),
    }
    setMoments([newMoment, ...moments])
    setShowForm(false)
    setTitle('')
    setDescription('')
    setMood('温暖')
  }, [title, description, mood, moments, setMoments])

  const moodStats = useMemo(() => {
    const counts: Record<string, number> = {}
    moments.forEach(m => {
      counts[m.mood] = (counts[m.mood] || 0) + 1
    })
    return counts
  }, [moments])

  const topMood = useMemo(() => {
    if (moments.length === 0) return '-'
    let max = 0
    let top = ''
    Object.entries(moodStats).forEach(([m, c]) => {
      if (c > max) {
        max = c
        top = m
      }
    })
    return top
  }, [moments, moodStats])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(255,200,224,0.08), rgba(255,208,232,0.04))',
      border: '1px solid rgba(255,200,224,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="温柔时刻" value={moments.length} icon="🌸" color="#ffc8e0" />
        <StatCard label="心情种类" value={Object.keys(moodStats).length} icon="🎨" color="#ffd0e8" />
        <StatCard label="最多心情" value={topMood} icon="✨" color="#70c8f0" />
      </div>

      {/* 添加按钮 */}
      {!showForm && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌸</div>
            <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 2, color: '#ffc8e0' }}>
              温柔时刻
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.8 }}>
              记录生活中那些温暖的小瞬间<br />
              让温柔的记忆闪闪发光
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '16px 48px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ffc8e0, #ffd0e8)',
                border: 'none',
                color: '#1a1518',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 4,
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(255,200,224,0.3)',
              }}
            >
              🌸 记录温柔时刻
            </button>
          </div>
        </div>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,200,224,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#ffc8e0', marginBottom: 16, letterSpacing: 2 }}>
            🌸 记录一个温柔时刻
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              瞬间标题
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="用一句话概括这个瞬间……"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,200,224,0.25)',
                color: '#ffe8f0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              当时的心情
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MOOD_OPTIONS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    background: mood === m.value
                      ? `${m.color}30`
                      : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${mood === m.value ? m.color : 'rgba(255,255,255,0.1)'}`,
                    color: mood === m.value ? m.color : 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>{m.icon}</span>
                  {m.value}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              详细描述
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述一下这个温柔的瞬间吧……"
              style={{
                width: '100%',
                minHeight: 100,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,200,224,0.25)',
                color: '#ffe8f0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.7,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '11px 20px',
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
              onClick={addMoment}
              disabled={!title.trim() && !description.trim()}
              style={{
                flex: 1,
                padding: '11px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #ffc8e0, #ffd0e8)',
                border: 'none',
                color: '#1a1518',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: (title.trim() || description.trim()) ? 'pointer' : 'not-allowed',
                opacity: (title.trim() || description.trim()) ? 1 : 0.5,
              }}
            >
              🌸 保存时刻
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {moments.length > 0 && (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            温柔时刻（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {moments.slice(0, 5).map(m => {
              const moodInfo = MOOD_OPTIONS.find(o => o.value === m.mood) || MOOD_OPTIONS[0]
              return (
                <div key={m.id} style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#ffe8f0' }}>
                      {moodInfo.icon} {m.title || '一个温柔的瞬间'}
                    </div>
                    <span style={{
                      fontSize: 10,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: `${moodInfo.color}20`,
                      color: moodInfo.color,
                      flexShrink: 0,
                    }}>
                      {m.mood}
                    </span>
                  </div>
                  {m.description && (
                    <div style={{
                      fontSize: 13,
                      opacity: 0.8,
                      lineHeight: 1.7,
                      marginBottom: 8,
                    }}>
                      {m.description}
                    </div>
                  )}
                  <div style={{ fontSize: 10, opacity: 0.4 }}>
                    {new Date(m.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {moments.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌸</div>
          <div style={{ fontSize: 13, letterSpacing: 2 }}>
            还没有温柔时刻
          </div>
          <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
            生活中的小温暖<br />
            都值得被记录
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────── 模块四：善意行动 ─────────────── */

function KindnessActions({ kindnesses, setKindnesses }: {
  kindnesses: KindnessAction[]
  setKindnesses: (v: KindnessAction[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<'stranger' | 'friend' | 'family'>('stranger')
  const [recipient, setRecipient] = useState('')
  const [feeling, setFeeling] = useState('')

  const addAction = useCallback(() => {
    if (!content.trim()) return
    const newAction: KindnessAction = {
      id: `${Date.now()}`,
      content: content.trim(),
      category,
      recipient: recipient.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toISOString(),
    }
    setKindnesses([newAction, ...kindnesses])
    setShowForm(false)
    setContent('')
    setRecipient('')
    setFeeling('')
    setCategory('stranger')
  }, [content, category, recipient, feeling, kindnesses, setKindnesses])

  const categoryCounts = useMemo(() => {
    return {
      stranger: kindnesses.filter(k => k.category === 'stranger').length,
      friend: kindnesses.filter(k => k.category === 'friend').length,
      family: kindnesses.filter(k => k.category === 'family').length,
    }
  }, [kindnesses])

  return (
    <div style={{
      padding: 36,
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(112,200,240,0.08), rgba(255,208,232,0.04))',
      border: '1px solid rgba(112,200,240,0.2)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 30,
      }}>
        <StatCard label="善意总数" value={kindnesses.length} icon="🎁" color="#70c8f0" />
        <StatCard
          label="陌生人善意"
          value={categoryCounts.stranger}
          icon="👤"
          color="#70c8f0"
        />
        <StatCard
          label="亲友善意"
          value={categoryCounts.friend + categoryCounts.family}
          icon="❤️"
          color="#ffd0e8"
        />
      </div>

      {/* 添加按钮 */}
      {!showForm && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎁</div>
            <div style={{ fontSize: 18, marginBottom: 10, letterSpacing: 2, color: '#70c8f0' }}>
              善意行动
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 24, lineHeight: 1.8 }}>
              记录为他人做的小事<br />
              让善意在世界流动
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '16px 48px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #70c8f0, #ffd0e8)',
                border: 'none',
                color: '#1a1518',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 4,
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(112,200,240,0.3)',
              }}
            >
              🎁 记录善意行动
            </button>
          </div>
        </div>
      )}

      {/* 表单 */}
      {showForm && (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid rgba(112,200,240,0.25)',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, color: '#70c8f0', marginBottom: 16, letterSpacing: 2 }}>
            🎁 记录一次善意行动
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              善意分类
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map(key => {
                const cfg = CATEGORY_CONFIG[key]
                return (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: 12,
                      background: category === key
                        ? `${cfg.color}25`
                        : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${category === key ? cfg.color : 'rgba(255,255,255,0.1)'}`,
                      color: category === key ? cfg.color : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              做了什么
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="描述一下你做了什么善意的事……"
              style={{
                width: '100%',
                minHeight: 80,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(112,200,240,0.25)',
                color: '#ffe8f0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.7,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              对象是谁（可选）
            </div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="可以写名字，也可以描述一下……"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(112,200,240,0.25)',
                color: '#ffe8f0',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
              做完后的感受（可选）
            </div>
            <textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="做了这件事后，你有什么感受……"
              style={{
                width: '100%',
                minHeight: 60,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(112,200,240,0.25)',
                color: '#ffe8f0',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                lineHeight: 1.7,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '11px 20px',
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
              onClick={addAction}
              disabled={!content.trim()}
              style={{
                flex: 1,
                padding: '11px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #70c8f0, #ffd0e8)',
                border: 'none',
                color: '#1a1518',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                cursor: content.trim() ? 'pointer' : 'not-allowed',
                opacity: content.trim() ? 1 : 0.5,
              }}
            >
              🎁 保存善意
            </button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {kindnesses.length > 0 && (
        <div>
          <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 16, letterSpacing: 2 }}>
            善意记录（最近5条）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {kindnesses.slice(0, 5).map(k => {
              const cfg = CATEGORY_CONFIG[k.category]
              return (
                <div key={k.id} style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#ffe8f0', lineHeight: 1.6 }}>
                      {cfg.icon} {k.content}
                    </div>
                    <span style={{
                      fontSize: 10,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: `${cfg.color}20`,
                      color: cfg.color,
                      flexShrink: 0,
                      marginLeft: 10,
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  {k.recipient && (
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
                      👤 {k.recipient}
                    </div>
                  )}
                  {k.feeling && (
                    <div style={{
                      fontSize: 12,
                      opacity: 0.6,
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}>
                      💭 {k.feeling}
                    </div>
                  )}
                  <div style={{ fontSize: 10, opacity: 0.4 }}>
                    {new Date(k.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {kindnesses.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
          <div style={{ fontSize: 13, letterSpacing: 2 }}>
            还没有善意记录
          </div>
          <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
            小小的善意<br />
            也能温暖世界
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
