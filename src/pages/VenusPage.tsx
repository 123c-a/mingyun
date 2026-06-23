import { useState } from 'react'
import { PlanetShell } from '../components/planets/PlanetShell'
import { useLocalStorage, exportAsImage, encryptText, decryptText } from '../utils/planetExport'
import { ai } from '../utils/aiService'

interface PetalRecord {
  words: string[]
  time: string
}

interface RingRecord {
  name: string
  detail: string
  time: string
}

const btnPink: React.CSSProperties = {
  padding: '12px 28px',
  borderRadius: 999,
  background: 'rgba(255, 179, 217, 0.2)',
  border: '1px solid rgba(255, 179, 217, 0.5)',
  color: '#ffd6ea',
  fontSize: 13,
  letterSpacing: 3,
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = { ...btnPink, background: 'transparent', border: '1px solid rgba(255, 179, 217, 0.3)' }

const btnExport: React.CSSProperties = {
  padding: '8px 22px',
  borderRadius: 999,
  background: 'rgba(255, 179, 217, 0.15)',
  border: '1px solid rgba(255, 179, 217, 0.4)',
  color: '#ffd6ea',
  fontSize: 12,
  letterSpacing: 4,
  cursor: 'pointer',
  backdropFilter: 'blur(6px)',
}

export default function VenusPage() {
  const [mode, setMode] = useState<'home' | 'letter' | 'petals' | 'rings'>('home')
  const [letter, setLetter] = useState('')
  const [envelope, setEnvelope] = useState(false)
  const [sent, setSent] = useState(false)
  const [petals, setPetals] = useState<string[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [rings, setRings] = useState<RingRecord[]>([])
  const [expandedRing, setExpandedRing] = useState<number | null>(null)
  const [ringInput, setRingInput] = useState('')
  const [ringDetail, setRingDetail] = useState('')
  const [aiLetterLoading, setAiLetterLoading] = useState(false)
  const [aiPetalsLoading, setAiPetalsLoading] = useState(false)
  const [aiPetalsResult, setAiPetalsResult] = useState<string[] | null>(null)

  const [savedLetter, setSavedLetter] = useLocalStorage<string>('venus-letter-encrypted', '')
  const [petalsHistory, setPetalsHistory] = useLocalStorage<PetalRecord[]>('venus-petals', [])
  const [ringsHistory, setRingsHistory] = useLocalStorage<RingRecord[]>('venus-years', [])

  const [password, setPassword] = useState('')
  const [verifyPass, setVerifyPass] = useState('')
  const [letterUnlocked, setLetterUnlocked] = useState(false)
  const [decryptedText, setDecryptedText] = useState('')
  const [passError, setPassError] = useState('')

  const wordPool = ['温暖', '安全', '柔软', '勇敢', '被看见', '流动', '缓慢', '陪伴', '真诚', '允许', '放下', '完整']

  const timeStr = () => new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  const handleLetterSave = () => {
    if (!letter.trim()) return
    const p = password.trim()
    if (!p) { setPassError('请先设置一个密码'); return }
    setPassError('')
    setSavedLetter(encryptText(letter.trim(), p))
    setEnvelope(true)
    setTimeout(() => { setSent(true) }, 1800)
  }

  const handleUnlock = () => {
    if (!savedLetter) { setPassError('还没有保存过的信'); return }
    const dec = decryptText(savedLetter, verifyPass)
    if (!dec) { setPassError('密码不对，或者信已被时光带走'); return }
    setPassError('')
    setDecryptedText(dec)
    setLetterUnlocked(true)
  }

  const handleDeleteLetter = () => {
    if (window.confirm('确定要把这封信交给时光吗？')) {
      setSavedLetter('')
      setLetterUnlocked(false)
      setDecryptedText('')
      setSent(false)
      setEnvelope(false)
      setLetter('')
    }
  }

  const handlePetalConfirm = () => {
    if (selectedWords.length < 3) return
    setPetals([...selectedWords])
    setPetalsHistory((prev) => [{ words: [...selectedWords], time: timeStr() }, ...(prev || [])].slice(0, 20))
  }

  const handleAddRing = () => {
    const name = ringInput.trim()
    if (!name) return
    const newRing: RingRecord = { name, detail: ringDetail.trim(), time: timeStr() }
    setRings((prev) => [...prev, newRing])
    setRingsHistory((prev) => [...(prev || []), newRing])
    setRingInput('')
    setRingDetail('')
  }

  const handleExport = (type: 'letter' | 'petals' | 'rings') => {
    if (type === 'letter') {
      const items: { text: string; meta: string }[] = []
      if (letterUnlocked && decryptedText) {
        decryptedText.split('\n').filter((l) => l.trim()).forEach((l) => items.push({ text: l, meta: '未寄出的信' }))
      } else {
        items.push({ text: '这封信被密码温柔地锁着', meta: '—' })
      }
      exportAsImage('情之湾 · 未寄出的信', '写给自己的温柔', items, '#1a0d14', '#ffd6ea', '#ffb8d8', `venus-letter-${Date.now()}.png`)
    } else if (type === 'petals') {
      const items = (petalsHistory || []).slice(0, 7).map((p) => ({ text: p.words.join(' · '), meta: p.time }))
      if (items.length === 0) items.push({ text: '还没有收到过的花瓣', meta: '—' })
      exportAsImage('情之湾 · 三瓣温柔', '送给自己的温柔', items, '#1a0d14', '#ffd6ea', '#ffb8d8', `venus-petals-${Date.now()}.png`)
    } else {
      const items = (ringsHistory || []).slice(0, 7).map((r) => ({ text: r.name + (r.detail ? ` — ${r.detail}` : ''), meta: r.time }))
      if (items.length === 0) items.push({ text: '还没有被记得的关系', meta: '—' })
      exportAsImage('情之湾 · 关系年轮', '每一段都值得被记得', items, '#1a0d14', '#ffd6ea', '#ffb8d8', `venus-rings-${Date.now()}.png`)
    }
  }

  const actionBar = (type: 'letter' | 'petals' | 'rings') => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '20px 0' }}>
      <button onClick={() => handleExport(type)} style={btnExport}>导出为图</button>
      <button onClick={() => setMode('home')} style={{ ...btnGhost, padding: '8px 22px', fontSize: 12 }}>返回</button>
    </div>
  )

  if (mode === 'letter') {
    return (
      <PlanetShell
        themeId="venus"
        title="情之湾"
        subtitle="VENUS · 未寄出的信"
        description="把那些一直想说、却一直没说出口的话写在这里，然后可以让它被温柔地封存。"
      >
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {savedLetter && !letterUnlocked ? (
            <>
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ffd6ea', letterSpacing: 4, fontSize: 15, opacity: 0.85 }}>
                有一封被锁着的信 · 需要密码才能打开
              </div>
              <input
                type="password"
                value={verifyPass}
                onChange={(e) => { setVerifyPass(e.target.value); setPassError('') }}
                placeholder="输入密码"
                style={{
                  width: '100%', padding: '16px 20px', marginBottom: 10,
                  borderRadius: 12, background: 'rgba(40, 25, 40, 0.55)',
                  border: '1px solid rgba(255, 179, 217, 0.2)', color: '#ffd6ea',
                  fontSize: 15, letterSpacing: 3, outline: 'none', boxSizing: 'border-box',
                }}
              />
              {passError && <div style={{ color: '#ff9eb0', fontSize: 12, textAlign: 'center', marginBottom: 10, letterSpacing: 2, opacity: 0.8 }}>{passError}</div>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={handleUnlock} style={btnPink}>打开这封信</button>
                <button onClick={handleDeleteLetter} style={{ ...btnGhost, borderColor: 'rgba(255, 160, 180, 0.35)', color: '#ffb8c8' }}>交给时光</button>
              </div>
            </>
          ) : letterUnlocked ? (
            <>
              <div style={{
                padding: 32, borderRadius: 16, background: 'rgba(40, 25, 40, 0.55)',
                border: '1px solid rgba(255, 179, 217, 0.2)', color: '#ffd6ea',
                fontSize: 15, lineHeight: 2.2, letterSpacing: 2, whiteSpace: 'pre-wrap',
              }}>{decryptedText}</div>
              <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, opacity: 0.5, letterSpacing: 3 }}>
                · 这就是你曾经写给自己的温柔 ·
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'center' }}>
                <button onClick={() => { setLetterUnlocked(false); setVerifyPass('') }} style={btnGhost}>重新封上</button>
                <button onClick={handleDeleteLetter} style={{ ...btnGhost, borderColor: 'rgba(255, 160, 180, 0.35)', color: '#ffb8c8' }}>交给时光</button>
              </div>
            </>
          ) : !sent ? (
            <>
              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder="亲爱的_________\n\n我一直想告诉你……\n\n谢谢你，也谢谢你曾经在我生命里出现过。"
                style={{
                  width: '100%', height: 260, padding: 24, borderRadius: 12,
                  background: 'rgba(40, 25, 40, 0.55)', border: '1px solid rgba(255, 179, 217, 0.2)',
                  color: '#ffd6ea', fontSize: 15, lineHeight: 2, letterSpacing: 2,
                  fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box',
                }}
              />
              <button onClick={async () => {
                if (!letter.trim()) return
                setAiLetterLoading(true)
                try {
                  const r = await ai.venus.polishLetter(letter)
                  if (r) setLetter(r)
                } finally { setAiLetterLoading(false) }
              }} disabled={aiLetterLoading || !letter.trim()} style={{
                width: '100%', marginTop: 12, padding: '12px 0', borderRadius: 999,
                background: 'rgba(255,179,217,0.15)',
                border: '1px solid rgba(255,179,217,0.35)',
                color: '#ffd6ea', fontSize: 12, letterSpacing: 4, cursor: 'pointer',
              }}>{aiLetterLoading ? '温柔润色中…' : 'AI · 温柔版（让话语柔和一些）'}</button>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPassError('') }}
                placeholder="设置一个密码来封存这封信"
                style={{
                  width: '100%', padding: '14px 20px', marginTop: 14, borderRadius: 12,
                  background: 'rgba(40, 25, 40, 0.55)', border: '1px solid rgba(255, 179, 217, 0.2)',
                  color: '#ffd6ea', fontSize: 13, letterSpacing: 3, outline: 'none', boxSizing: 'border-box',
                }}
              />
              {passError && <div style={{ color: '#ff9eb0', fontSize: 12, textAlign: 'center', marginTop: 8, letterSpacing: 2, opacity: 0.8 }}>{passError}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
                <button onClick={handleLetterSave} style={btnPink}>折成信封，封存它</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 20, animation: 'float 4s ease-in-out infinite' }}>💌</div>
              <div style={{ fontSize: 20, color: '#ffd6ea', letterSpacing: 4, opacity: 0.85, lineHeight: 2 }}>
                它已经被温柔地收到了。
                <br />
                <span style={{ fontSize: 14, opacity: 0.5 }}>——有些话，写下来，就已经是疗愈。</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 40, justifyContent: 'center' }}>
                <button onClick={() => { setSent(false); setEnvelope(false); setLetter(''); setPassword(''); }} style={btnGhost}>再写一封</button>
                <button onClick={() => setMode('home')} style={btnGhost}>返回首页</button>
              </div>
            </div>
          )}

          {envelope && !letterUnlocked && !savedLetter && (
            <div style={{
              position: 'absolute', top: 120, left: 0, right: 0, margin: '0 auto',
              width: 280, height: 180,
              background: 'linear-gradient(135deg, rgba(255,179,217,0.3), rgba(200,150,180,0.15))',
              border: '1px solid rgba(255, 179, 217, 0.4)', borderRadius: 6,
              boxShadow: '0 20px 60px rgba(255, 100, 180, 0.2)',
              animation: 'foldIn 1.4s ease forwards', zIndex: 5,
            }} />
          )}
        </div>

        {actionBar('letter')}

        <style>{`
          @keyframes foldIn { 0% { transform: translateY(-60px) rotateX(60deg); opacity: 0; } 60% { opacity: 1; } 100% { transform: translateY(20px) rotateX(0); opacity: 0.85; } }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>
      </PlanetShell>
    )
  }

  if (mode === 'petals') {
    return (
      <PlanetShell themeId="venus" title="情之湾" subtitle="VENUS · 落在水面的花瓣" description="选三个词，代表你想收到的温柔，让它们落在水面上，成为此刻送给自己的一句话。">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxWidth: 500, margin: '0 auto', justifyContent: 'center' }}>
          {wordPool.map((w) => (
            <button
              key={w}
              onClick={() => {
                if (selectedWords.length < 3 && !selectedWords.includes(w)) {
                  setSelectedWords([...selectedWords, w])
                } else if (selectedWords.includes(w)) {
                  setSelectedWords(selectedWords.filter((x) => x !== w))
                }
              }}
              style={{
                padding: '12px 22px', borderRadius: 999,
                background: selectedWords.includes(w) ? 'rgba(255, 179, 217, 0.35)' : 'rgba(255, 179, 217, 0.08)',
                border: `1px solid rgba(255, 179, 217, ${selectedWords.includes(w) ? 0.5 : 0.2})`,
                color: '#ffd6ea', fontSize: 14, letterSpacing: 3, cursor: 'pointer', transition: 'all 0.3s',
              }}
            >{w}</button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={handlePetalConfirm} style={btnPink} disabled={selectedWords.length < 3}>让它们落下</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button onClick={async () => {
            setAiPetalsLoading(true)
            try {
              const r = await ai.venus.threePetals('自己')
              if (r && r.length > 0) setAiPetalsResult(r)
            } finally { setAiPetalsLoading(false) }
          }} disabled={aiPetalsLoading} style={{
            ...btnPink,
            background: 'rgba(255,179,217,0.12)',
            border: '1px solid rgba(255,179,217,0.3)',
            padding: '10px 24px',
            fontSize: 12,
            letterSpacing: 3,
          }}>{aiPetalsLoading ? '温柔飘落中…' : 'AI · 再给我三瓣温柔'}</button>
        </div>

        {aiPetalsResult && aiPetalsResult.length > 0 && (
          <div style={{ maxWidth: 520, margin: '24px auto 0', padding: 20, borderRadius: 14, background: 'rgba(40,25,40,0.5)', border: '1px solid rgba(255,179,217,0.2)', position: 'relative' }}>
            <button onClick={() => setAiPetalsResult(null)} style={{
              position: 'absolute', top: 10, right: 10, background: 'transparent', border: '1px solid rgba(255,179,217,0.3)',
              color: '#ffd6ea', cursor: 'pointer', borderRadius: 999, padding: '3px 12px', fontSize: 11, letterSpacing: 2,
            }}>关闭</button>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#ffd6ea', letterSpacing: 4, marginBottom: 14, opacity: 0.7 }}>· 写给此刻的你 ·</div>
            {aiPetalsResult.map((p, i) => (
              <div key={i} style={{ fontSize: 14, color: '#ffd6ea', lineHeight: 2.2, letterSpacing: 3, textAlign: 'center', padding: '10px 0', borderBottom: i < aiPetalsResult.length - 1 ? '1px dashed rgba(255,179,217,0.12)' : 'none' }}>
                · {p} ·
              </div>
            ))}
          </div>
        )}

        {petals.length === 3 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', letterSpacing: 6, fontSize: 22, color: '#ffd6ea' }}>
            {petals.map((p, i) => (
              <span key={p} style={{
                display: 'inline-block', margin: '0 16px',
                opacity: 0, animation: `petal 2s ease ${i * 0.4}s forwards`,
              }}>· {p} ·</span>
            ))}
            <div style={{ fontSize: 13, opacity: 0.45, marginTop: 30, letterSpacing: 3 }}>
              你值得被这样温柔地对待
            </div>
          </div>
        )}

        {(petalsHistory || []).length > 0 && (
          <div style={{ maxWidth: 520, margin: '40px auto 0', padding: 20, borderRadius: 16, background: 'rgba(40, 25, 40, 0.4)', border: '1px solid rgba(255, 179, 217, 0.15)' }}>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#ffd6ea', letterSpacing: 4, opacity: 0.7, marginBottom: 16 }}>· 过往收到过的温柔 ·</div>
            {(petalsHistory || []).slice(0, 10).map((p, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 13, color: '#ffd6ea', letterSpacing: 3, opacity: 0.75, padding: '10px 0', borderBottom: i < (petalsHistory || []).length - 1 && i < 9 ? '1px dashed rgba(255, 179, 217, 0.15)' : 'none' }}>
                <div>{p.words.join(' · ')}</div>
                <div style={{ fontSize: 10, opacity: 0.4, marginTop: 4, letterSpacing: 2 }}>{p.time}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button onClick={() => { setPetals([]); setSelectedWords([]) }} style={btnGhost}>重新选</button>
        </div>

        {actionBar('petals')}
        <style>{`@keyframes petal { 0% { opacity: 0; transform: translateY(-20px) rotate(-10deg); } 100% { opacity: 0.85; transform: translateY(0) rotate(0); } }`}</style>
      </PlanetShell>
    )
  }

  if (mode === 'rings') {
    const currentRings = rings.length > 0 ? rings : (ringsHistory || [])
    return (
      <PlanetShell themeId="venus" title="情之湾" subtitle="VENUS · 关系的年轮" description="每一段值得被记得的关系，都在时间上留下一个同心圆。越深、越近、越亮。">
        <div style={{ position: 'relative', width: 500, height: 500, margin: '40px auto' }}>
          {currentRings.map((r, i) => (
            <div
              key={i}
              onClick={() => setExpandedRing(expandedRing === i ? null : i)}
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 100 + i * 70, height: 100 + i * 70,
                border: `1px solid rgba(255, 179, 217, ${expandedRing === i ? 0.6 : 0.25})`,
                borderRadius: '50%',
                boxShadow: expandedRing === i ? '0 0 40px rgba(255, 179, 217, 0.3)' : '0 0 40px rgba(255, 179, 217, 0.08)',
                animation: 'ringGrow 1.4s ease',
                cursor: 'pointer',
                transition: 'all 0.4s',
              }}
            >
              <span style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(20, 15, 25, 0.9)', padding: '4px 12px',
                fontSize: 12, color: '#ffd6ea', letterSpacing: 2, opacity: expandedRing === i ? 1 : 0.8,
              }}>{r.name}</span>
              {expandedRing === i && r.detail && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  color: '#ffd6ea', fontSize: 13, letterSpacing: 2, textAlign: 'center',
                  maxWidth: 260, lineHeight: 2, opacity: 0.9,
                }}>
                  {r.detail}
                  <div style={{ fontSize: 10, opacity: 0.45, marginTop: 8, letterSpacing: 2 }}>{r.time}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, opacity: 0.4, marginBottom: 16, letterSpacing: 3 }}>
          · 点击一圈查看详情 ·
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', maxWidth: 560, margin: '0 auto', flexWrap: 'wrap' }}>
          <input
            placeholder="给这段关系起个名字……"
            value={ringInput}
            onChange={(e) => setRingInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRing()}
            style={{
              flex: 1, minWidth: 200, padding: '12px 18px', borderRadius: 999,
              background: 'rgba(40, 25, 40, 0.55)', border: '1px solid rgba(255, 179, 217, 0.2)',
              color: '#ffd6ea', fontSize: 14, letterSpacing: 2, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <input
            placeholder="加一点细节（可留空）"
            value={ringDetail}
            onChange={(e) => setRingDetail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRing()}
            style={{
              flex: 1, minWidth: 200, padding: '12px 18px', borderRadius: 999,
              background: 'rgba(40, 25, 40, 0.55)', border: '1px solid rgba(255, 179, 217, 0.2)',
              color: '#ffd6ea', fontSize: 14, letterSpacing: 2, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <button onClick={handleAddRing} style={btnPink}>让它成为一圈</button>
        </div>

        {actionBar('rings')}
        <style>{`@keyframes ringGrow { from { opacity: 0; transform: translate(-50%, -50%) scale(0.6); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }`}</style>
      </PlanetShell>
    )
  }

  return (
    <PlanetShell themeId="venus" title="情之湾" subtitle="VENUS · 温柔修复爱的能量" description="情感是流动的河。这里有三个温柔的仪式，给那些需要被好好对待的情绪。">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        {[
          { key: 'letter', title: '未寄出的信', desc: '给一个人，写一封可能永远不会寄出的信，用密码温柔地封起来', icon: '💌' },
          { key: 'petals', title: '三瓣温柔', desc: '选三个词，组成一句你此刻想收到的温柔，过往的都被记得', icon: '🌸' },
          { key: 'rings', title: '关系的年轮', desc: '标记一段值得被记得的关系，让它成为同心圆，点击查看', icon: '🌀' },
        ].map((card) => (
          <button
            key={card.key}
            onClick={() => setMode(card.key as any)}
            style={{
              padding: 40, borderRadius: 20,
              background: 'rgba(40, 25, 40, 0.5)',
              border: '1px solid rgba(255, 179, 217, 0.15)',
              color: '#ffd6ea', textAlign: 'center', cursor: 'pointer', transition: 'all 0.4s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 179, 217, 0.18)'; e.currentTarget.style.borderColor = 'rgba(255, 179, 217, 0.45)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(40, 25, 40, 0.5)'; e.currentTarget.style.borderColor = 'rgba(255, 179, 217, 0.15)' }}
          >
            <div style={{ fontSize: 42, marginBottom: 14 }}>{card.icon}</div>
            <div style={{ fontSize: 18, letterSpacing: 4, marginBottom: 8 }}>{card.title}</div>
            <div style={{ fontSize: 12, opacity: 0.55, letterSpacing: 1.5, lineHeight: 2 }}>{card.desc}</div>
          </button>
        ))}
      </div>
    </PlanetShell>
  )
}
