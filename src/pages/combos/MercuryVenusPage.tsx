import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface StarMessage {
  id: string
  text: string
  emotion: 'warm' | 'miss' | 'regret' | 'bless'
  to: string
  time: string
}

interface LoveLetter {
  id: string
  to: string
  relationship: string
  title: string
  content: string
  mood: string
  sent: boolean
  createdAt: string
}

interface EmotionWord {
  id: string
  word: string
  description: string
  intensity: number
  date: string
}

interface Unspoken {
  id: string
  to: string
  content: string
  reason: string
  date: string
  released: boolean
}

const emotionConfig = {
  warm: { label: '温暖', color: '#ffd6a0', emoji: '🌅' },
  miss: { label: '思念', color: '#ffb8d8', emoji: '💭' },
  regret: { label: '遗憾', color: '#b8c8e8', emoji: '💔' },
  bless: { label: '祝福', color: '#c8f0d8', emoji: '🌟' },
}

const LETTER_TEMPLATES = [
  { title: '感谢信', prompt: '谢谢TA做过的一件事' },
  { title: '道歉信', prompt: '说一句你一直想说的对不起' },
  { title: '告白信', prompt: '说出你藏在心里的喜欢' },
  { title: '告别信', prompt: '好好说一声再见' },
  { title: '鼓励信', prompt: '给低谷中的TA加加油' },
]

const EMOTION_WORDS = [
  '怅然', '悸动', '缱绻', '释然', '笃定', '惘然', '澄澈', '炽热',
  '静谧', '澎湃', '恬淡', '苍茫', '缱绻', '悱恻', '惺忪', '阑珊',
]

function StarBottleModule({ messages, setMessages }: {
  messages: StarMessage[]
  setMessages: (fn: (prev: StarMessage[]) => StarMessage[]) => void
}) {
  const [input, setInput] = useState('')
  const [emotion, setEmotion] = useState<StarMessage['emotion']>('warm')
  const [to, setTo] = useState('')
  const [floating, setFloating] = useState<StarMessage[]>([])

  const addMessage = () => {
    const text = input.trim()
    if (!text) return
    const newMsg: StarMessage = {
      id: `${Date.now()}`,
      text,
      emotion,
      to: to.trim() || '宇宙',
      time: new Date().toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [newMsg, ...prev])
    setFloating((prev) => [...prev, newMsg])
    setInput('')
    setTo('')
    setTimeout(() => {
      setFloating((prev) => prev.filter((m) => m.id !== newMsg.id))
    }, 3000)
  }

  const stats = {
    total: messages.length,
    warm: messages.filter(m => m.emotion === 'warm').length,
    miss: messages.filter(m => m.emotion === 'miss').length,
    bless: messages.filter(m => m.emotion === 'bless').length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '星语总数', value: stats.total, icon: '✨' },
          { label: '温暖', value: stats.warm, icon: '🌅' },
          { label: '思念', value: stats.miss, icon: '💭' },
          { label: '祝福', value: stats.bless, icon: '🌟' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#ffd6ea' }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffb8d8', textAlign: 'center' }}>
          💫 写下想对TA说的话
        </div>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="写给谁？（留空则写给宇宙）"
          style={inputStyle}
        />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="有些话，说不出口……"
          style={textAreaStyle}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {(Object.keys(emotionConfig) as Array<keyof typeof emotionConfig>).map((key) => (
            <button
              key={key}
              onClick={() => setEmotion(key)}
              style={{
                flex: 1, minWidth: 70, padding: '8px 12px', borderRadius: 999,
                background: emotion === key ? `${emotionConfig[key].color}25` : 'rgba(0,0,0,0.15)',
                border: `1px solid ${emotion === key ? emotionConfig[key].color + '80' : 'rgba(255,255,255,0.1)'}`,
                color: emotion === key ? emotionConfig[key].color : 'rgba(255,255,255,0.6)',
                fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {emotionConfig[key].emoji} {emotionConfig[key].label}
            </button>
          ))}
        </div>
        <button
          onClick={addMessage}
          disabled={!input.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(255, 159, 184, 0.3), rgba(255, 180, 220, 0.2))',
            border: '1px solid rgba(255, 180, 220, 0.5)',
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            opacity: input.trim() ? 1 : 0.5,
          }}
        >
          💫 放入星语瓶
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的星语</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.slice(0, 5).map((m) => (
            <div key={m.id} style={{
              padding: 14, borderRadius: 12,
              background: `${emotionConfig[m.emotion].color}08`,
              border: `1px solid ${emotionConfig[m.emotion].color}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: emotionConfig[m.emotion].color }}>
                  {emotionConfig[m.emotion].emoji} 致 {m.to}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{m.time}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{m.text}</div>
            </div>
          ))}
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ✨ 星语瓶还空着 ✨
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoveLetterModule({ letters, setLetters }: {
  letters: LoveLetter[]
  setLetters: (fn: (prev: LoveLetter[]) => LoveLetter[]) => void
}) {
  const [to, setTo] = useState('')
  const [relationship, setRelationship] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('温暖')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const createLetter = () => {
    if (!content.trim()) return
    const letter: LoveLetter = {
      id: `${Date.now()}`,
      to: to.trim() || '亲爱的',
      relationship: relationship.trim(),
      title: title.trim() || '未命名',
      content: content.trim(),
      mood,
      sent: false,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setLetters((prev) => [letter, ...prev])
    setTo('')
    setRelationship('')
    setTitle('')
    setContent('')
    setSelectedTemplate('')
  }

  const toggleSent = (id: string) => {
    setLetters((prev) => prev.map((l) => l.id === id ? { ...l, sent: !l.sent } : l))
  }

  const stats = {
    total: letters.length,
    sent: letters.filter(l => l.sent).length,
    unsent: letters.filter(l => !l.sent).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '情书总数', value: stats.total, icon: '💌' },
          { label: '已送达', value: stats.sent, icon: '📬' },
          { label: '珍藏中', value: stats.unsent, icon: '🔒' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#ffd6ea' }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffb8d8', textAlign: 'center' }}>
          💌 写一封信
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {LETTER_TEMPLATES.map((t) => (
            <button
              key={t.title}
              onClick={() => { setTitle(t.title); setSelectedTemplate(t.title) }}
              style={{
                padding: '6px 12px', borderRadius: 999, fontSize: 11,
                background: selectedTemplate === t.title ? 'rgba(255, 180, 220, 0.2)' : 'rgba(0,0,0,0.2)',
                border: `1px solid ${selectedTemplate === t.title ? 'rgba(255, 180, 220, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: selectedTemplate === t.title ? '#ffd6ea' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {t.title}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="写给谁？" style={inputStyle} />
          <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="你们的关系" style={inputStyle} />
        </div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="信件标题" style={inputStyle} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={selectedTemplate ? LETTER_TEMPLATES.find(t => t.title === selectedTemplate)?.prompt : '写下你想说的话……'}
          style={{ ...textAreaStyle, minHeight: 120 }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {['温暖', '思念', '愧疚', '欢喜', '释然'].map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 11,
                background: mood === m ? 'rgba(255, 180, 220, 0.2)' : 'rgba(0,0,0,0.15)',
                border: `1px solid ${mood === m ? 'rgba(255, 180, 220, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: mood === m ? '#ffd6ea' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={createLetter}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(255, 159, 184, 0.3), rgba(255, 180, 220, 0.2))',
            border: '1px solid rgba(255, 180, 220, 0.5)',
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          💌 封存这封信
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的信件</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {letters.slice(0, 5).map((l) => (
            <div key={l.id} style={{
              padding: 14, borderRadius: 12,
              background: l.sent ? 'rgba(200, 240, 216, 0.06)' : 'rgba(255, 180, 220, 0.06)',
              border: `1px solid ${l.sent ? 'rgba(200, 240, 216, 0.2)' : 'rgba(255, 180, 220, 0.2)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#ffd6ea' }}>
                  {l.title} · 致 {l.to}
                </span>
                <button
                  onClick={() => toggleSent(l.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 10,
                    background: l.sent ? 'rgba(200, 240, 216, 0.2)' : 'rgba(255, 180, 220, 0.15)',
                    border: `1px solid ${l.sent ? 'rgba(200, 240, 216, 0.4)' : 'rgba(255, 180, 220, 0.3)'}`,
                    color: l.sent ? '#c8f0d8' : '#ffb8d8',
                    cursor: 'pointer',
                  }}
                >
                  {l.sent ? '📬 已送达' : '🔒 珍藏中'}
                </button>
              </div>
              {l.relationship && <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8 }}>{l.relationship}</div>}
              <div style={{ fontSize: 12, lineHeight: 1.7, opacity: 0.8 }}>
                {l.content.length > 80 ? l.content.slice(0, 80) + '…' : l.content}
              </div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{l.mood} · {l.createdAt}</div>
            </div>
          ))}
          {letters.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💌 还没有写过信
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmotionDictionaryModule({ words, setWords }: {
  words: EmotionWord[]
  setWords: (fn: (prev: EmotionWord[]) => EmotionWord[]) => void
}) {
  const [selectedWord, setSelectedWord] = useState('')
  const [description, setDescription] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [todayWord, setTodayWord] = useState('')

  const getTodayWord = () => {
    const word = EMOTION_WORDS[Math.floor(Math.random() * EMOTION_WORDS.length)]
    setTodayWord(word)
    setSelectedWord(word)
  }

  const recordWord = () => {
    if (!selectedWord) return
    const word: EmotionWord = {
      id: `${Date.now()}`,
      word: selectedWord,
      description: description.trim(),
      intensity,
      date: new Date().toLocaleDateString('zh-CN'),
    }
    setWords((prev) => [word, ...prev])
    setSelectedWord('')
    setDescription('')
    setIntensity(5)
    setTodayWord('')
  }

  const avgIntensity = words.length > 0
    ? Math.round(words.reduce((sum, w) => sum + w.intensity, 0) / words.length * 10) / 10
    : 0

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '情感记录', value: words.length, icon: '📖' },
          { label: '平均浓度', value: avgIntensity, icon: '💫' },
          { label: '词库丰富度', value: new Set(words.map(w => w.word)).size, icon: '🎨' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#ffd6ea' }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffb8d8', textAlign: 'center' }}>
          📖 今天的心情，用一个词形容
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <button
            onClick={getTodayWord}
            style={{
              padding: '10px 24px', borderRadius: 999,
              background: 'rgba(255, 180, 220, 0.15)',
              border: '1px solid rgba(255, 180, 220, 0.4)',
              color: '#ffd6ea', fontSize: 12, letterSpacing: 2,
              cursor: 'pointer',
            }}
          >
            🎲 随机抽取一个词
          </button>
        </div>

        {todayWord && (
          <div style={{
            textAlign: 'center', padding: 20, marginBottom: 16,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255, 180, 220, 0.15), rgba(255, 159, 184, 0.08))',
            border: '1px solid rgba(255, 180, 220, 0.3)',
          }}>
            <div style={{ fontSize: 36, fontWeight: 600, color: '#ffd6ea', letterSpacing: 8, marginBottom: 8 }}>
              {todayWord}
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>是你今天的心情吗？</div>
          </div>
        )}

        <input
          type="text"
          value={selectedWord}
          onChange={(e) => setSelectedWord(e.target.value)}
          placeholder="或者自己写一个词……"
          style={inputStyle}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述一下这个词背后的故事……"
          style={textAreaStyle}
        />

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>情感浓度：{intensity}/10</div>
          <input
            type="range" min="1" max="10" value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#ffb8d8' }}
          />
        </div>

        <button
          onClick={recordWord}
          disabled={!selectedWord}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(255, 159, 184, 0.3), rgba(255, 180, 220, 0.2))',
            border: '1px solid rgba(255, 180, 220, 0.5)',
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: selectedWord ? 'pointer' : 'not-allowed',
            opacity: selectedWord ? 1 : 0.5,
          }}
        >
          📖 记入情感词典
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的心情词</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {words.slice(0, 5).map((w) => (
            <div key={w.id} style={{
              padding: 14, borderRadius: 12,
              background: 'rgba(255, 180, 220, 0.06)',
              border: '1px solid rgba(255, 180, 220, 0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#ffd6ea', letterSpacing: 4 }}>{w.word}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: w.intensity }).map((_, i) => (
                    <span key={i} style={{ fontSize: 10, color: '#ffb8d8' }}>●</span>
                  ))}
                </div>
              </div>
              {w.description && <div style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.75 }}>{w.description}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{w.date}</div>
            </div>
          ))}
          {words.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              📖 词典还是空的
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UnspokenModule({ unspoken, setUnspoken }: {
  unspoken: Unspoken[]
  setUnspoken: (fn: (prev: Unspoken[]) => Unspoken[]) => void
}) {
  const [to, setTo] = useState('')
  const [content, setContent] = useState('')
  const [reason, setReason] = useState('')

  const addUnspoken = () => {
    if (!content.trim()) return
    const item: Unspoken = {
      id: `${Date.now()}`,
      to: to.trim() || '某个人',
      content: content.trim(),
      reason: reason.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
      released: false,
    }
    setUnspoken((prev) => [item, ...prev])
    setTo('')
    setContent('')
    setReason('')
  }

  const release = (id: string) => {
    setUnspoken((prev) => prev.map((u) => u.id === id ? { ...u, released: true } : u))
  }

  const stats = {
    total: unspoken.length,
    held: unspoken.filter(u => !u.released).length,
    released: unspoken.filter(u => u.released).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '未说出口', value: stats.held, icon: '🤐' },
          { label: '已释怀', value: stats.released, icon: '🕊️' },
          { label: '总计', value: stats.total, icon: '💭' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#ffd6ea' }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffb8d8', textAlign: 'center' }}>
          🤐 那些没说出口的话
        </div>
        <input
          type="text" value={to} onChange={(e) => setTo(e.target.value)}
          placeholder="想对谁说？" style={inputStyle}
        />
        <textarea
          value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="你想说但没说的话是……"
          style={{ ...textAreaStyle, minHeight: 100 }}
        />
        <input
          type="text" value={reason} onChange={(e) => setReason(e.target.value)}
          placeholder="为什么没说出口？（害怕/时机不对/说不出口……）"
          style={inputStyle}
        />
        <button
          onClick={addUnspoken}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(255, 159, 184, 0.3), rgba(255, 180, 220, 0.2))',
            border: '1px solid rgba(255, 180, 220, 0.5)',
            color: '#ffe8f0', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🤐 封存这句话
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>未说出口的话</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {unspoken.slice(0, 5).map((u) => (
            <div key={u.id} style={{
              padding: 14, borderRadius: 12,
              background: u.released ? 'rgba(200, 240, 216, 0.06)' : 'rgba(255, 180, 220, 0.06)',
              border: `1px solid ${u.released ? 'rgba(200, 240, 216, 0.2)' : 'rgba(255, 180, 220, 0.2)'}`,
              opacity: u.released ? 0.6 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#ffb8d8' }}>致 {u.to}</span>
                {!u.released ? (
                  <button
                    onClick={() => release(u.id)}
                    style={{
                      padding: '4px 10px', borderRadius: 999, fontSize: 10,
                      background: 'rgba(200, 240, 216, 0.15)',
                      border: '1px solid rgba(200, 240, 216, 0.3)',
                      color: '#c8f0d8', cursor: 'pointer',
                    }}
                  >
                    🕊️ 让它去吧
                  </button>
                ) : (
                  <span style={{ fontSize: 10, color: '#c8f0d8' }}>🕊️ 已释怀</span>
                )}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{u.content}</div>
              {u.reason && <div style={{ fontSize: 11, opacity: 0.5, marginTop: 8, fontStyle: 'italic' }}>— {u.reason}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 6 }}>{u.date}</div>
            </div>
          ))}
          {unspoken.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🤐 没有未说出口的话
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const statCardStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  background: 'rgba(255, 180, 220, 0.06)',
  border: '1px solid rgba(255, 180, 220, 0.15)',
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
}

const mainCardStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 20,
  background: 'rgba(255, 180, 220, 0.06)',
  border: '1px solid rgba(255, 180, 220, 0.2)',
  backdropFilter: 'blur(10px)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(255, 180, 220, 0.25)',
  color: '#ffe8f0',
  fontSize: 13,
  outline: 'none',
  marginBottom: 10,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 80,
  padding: '12px 14px',
  borderRadius: 10,
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(255, 180, 220, 0.25)',
  color: '#ffe8f0',
  fontSize: 13,
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  lineHeight: 1.6,
  boxSizing: 'border-box',
}

const TAB_LIST = [
  { id: 'bottle', name: '心语瓶', icon: '💫' },
  { id: 'letter', name: '情书工坊', icon: '💌' },
  { id: 'dictionary', name: '情感词典', icon: '📖' },
  { id: 'unspoken', name: '未说出口', icon: '🤐' },
]

export default function MercuryVenusPage() {
  const config = comboConfigs['mercury-venus']
  const [activeTab, setActiveTab] = useState<string>('bottle')
  const [messages, setMessages] = useLocalStorage<StarMessage[]>('mv-messages', [])
  const [letters, setLetters] = useLocalStorage<LoveLetter[]>('mv-letters', [])
  const [words, setWords] = useLocalStorage<EmotionWord[]>('mv-words', [])
  const [unspoken, setUnspoken] = useLocalStorage<Unspoken[]>('mv-unspoken', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: 999,
    background: active
      ? 'linear-gradient(135deg, rgba(255, 159, 184, 0.35), rgba(255, 180, 220, 0.2))'
      : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? 'rgba(255, 180, 220, 0.6)' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#ffe8f0' : 'rgba(255,255,255,0.5)',
    fontSize: 13,
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'all 0.2s',
    backdropFilter: 'blur(6px)',
  })

  const contentStyle: React.CSSProperties = {
    maxWidth: 640,
    margin: '0 auto',
  }

  return (
    <ComboShell config={config}>
      <div style={tabContainerStyle}>
        {TAB_LIST.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabButtonStyle(activeTab === tab.id)}>
            <span style={{ marginRight: 6 }}>{tab.icon}</span>{tab.name}
          </button>
        ))}
      </div>
      <div style={contentStyle}>
        {activeTab === 'bottle' && <StarBottleModule messages={messages} setMessages={setMessages} />}
        {activeTab === 'letter' && <LoveLetterModule letters={letters} setLetters={setLetters} />}
        {activeTab === 'dictionary' && <EmotionDictionaryModule words={words} setWords={setWords} />}
        {activeTab === 'unspoken' && <UnspokenModule unspoken={unspoken} setUnspoken={setUnspoken} />}
      </div>
    </ComboShell>
  )
}
