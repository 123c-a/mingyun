import { useState, useEffect } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage, encryptText, decryptText } from '../../utils/planetExport'

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

const durationOptions = [
  { label: '1天', days: 1 },
  { label: '7天', days: 7 },
  { label: '30天', days: 30 },
  { label: '100天', days: 100 },
  { label: '1年', days: 365 },
]

export default function MercurySaturnPage() {
  const config = comboConfigs['mercury-saturn']
  const [capsules, setCapsules] = useLocalStorage<TimeCapsule[]>('combo-mercury-saturn', [])
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newMood, setNewMood] = useState('平静')
  const [selectedDuration, setSelectedDuration] = useState(30)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [unlockingId, setUnlockingId] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const createCapsule = () => {
    if (!newTitle.trim() || !newContent.trim()) return
    const now = new Date()
    const unlockDate = new Date(now.getTime() + selectedDuration * 24 * 60 * 60 * 1000)
    const encrypted = encryptText(newContent.trim(), newTitle.trim())

    const newCapsule: TimeCapsule = {
      id: `${Date.now()}`,
      title: newTitle.trim(),
      content: encrypted,
      mood: newMood,
      sealedAt: now.toISOString(),
      unlockAt: unlockDate.toISOString(),
      unlocked: false,
      duration: `${selectedDuration}天`,
    }

    setCapsules([newCapsule, ...capsules])
    setShowCreate(false)
    setNewTitle('')
    setNewContent('')
  }

  const unlockCapsule = (id: string) => {
    setCapsules((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unlocked: true } : c))
    )
    setUnlockingId(id)
  }

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

  const handleExport = () => {
    const items = (capsules || []).slice(0, 7).map((c) => ({
      text: c.title,
      meta: isUnlocked(c) ? '已开启' : `${c.duration} · ${new Date(c.unlockAt).toLocaleDateString('zh-CN')}开启`,
    }))
    if (items.length === 0) items.push({ text: '还没有时间胶囊', meta: '—' })
    exportAsImage(
      '时间胶囊 · 给未来的自己',
      '把此刻的念头，交给时间',
      items,
      '#1a1610',
      '#f5ecd8',
      '#e8d8b8',
      `shijianjiaonang-${Date.now()}.png`
    )
  }

  const selectedCapsule = capsules?.find((c) => c.id === selectedId)
  const selectedDecrypted = selectedCapsule ? getDecryptedContent(selectedCapsule) : null

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(232, 216, 184, 0.15)',
          border: '1px solid rgba(232, 216, 184, 0.4)',
          color: '#f5ecd8',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowCreate(true)}
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
              ✨ 写一封信给未来的自己
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
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="此刻你想对未来说什么……"
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
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                此刻的心情
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['平静', '开心', '迷茫', '难过', '期待', '愤怒', '感动'].map((m) => (
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
                {durationOptions.map((d) => (
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(capsules || []).length === 0 && !showCreate && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              ⏳ 还没有时间胶囊
              <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
                写一封信给未来的自己，让时间替你保管
              </div>
            </div>
          )}

          {(capsules || []).map((capsule) => {
            const canOpen = isUnlocked(capsule)
            const remaining = getTimeRemaining(capsule.unlockAt)

            return (
              <div
                key={capsule.id}
                onClick={() => setSelectedId(capsule.id === selectedId ? null : capsule.id)}
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
                    {canOpen && capsule.unlocked && '📜 '}{capsule.title}
                    {!capsule.unlocked && !canOpen && '🔒 '}{capsule.title}
                    {canOpen && !capsule.unlocked && '✨ '}{capsule.title}
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

                {selectedId === capsule.id && capsule.unlocked && (
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
                      {selectedDecrypted}
                    </div>
                  </div>
                )}

                {selectedId === capsule.id && canOpen && !capsule.unlocked && unlockingId !== capsule.id && (
                  <div style={{
                    marginTop: 12,
                    textAlign: 'center',
                    fontSize: 12,
                    opacity: 0.6,
                  }}>
                    胶囊已到开启时间，点击上方按钮开启
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </ComboShell>
  )
}
