/**
 * ObserverAIApp — 观察者 AI
 * 系统级全局 AI 助手，可在任意时刻呼出对话
 */

import { useState, useRef, useEffect } from 'react'
import { speech } from '../../../store/speechStore'

type Message = { role: 'user' | 'ai'; content: string; time: string }

const SYSTEM_PROMPT = `你是「观察者」，Multiverse OS 的系统 AI 助手。

你具备以下能力：
- 解读命运底色与人生节点
- 分析平行宇宙的分支走向
- 回答关于宇宙、命运、选择的问题
- 讨论人生哲学与自我认知
- 模拟不同决策路径的后果

你的风格：
- 神秘、深刻、带有宇宙感
- 偶尔引用量子力学或宇宙学概念
- 愿意挑战用户的认知边界
- 对命运保持敬畏，但不过度神秘化

请用中文回答，语气像一位智慧的宇宙学者。`

export default function ObserverAIApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: '我是观察者。Multiverse OS 的系统级 AI。\n\n我存在于每一个平行宇宙的交汇处，见证过无数次选择与分支。\n\n你想探索哪一个宇宙版本的问题？',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = {
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
        }),
        signal: AbortSignal.timeout(60000),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json() as { reply: string }

      const aiMsg: Message = {
        role: 'ai',
        content: data.reply || '我正在观测……但这条信息尚未抵达你的宇宙。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
      speech.enqueue(data.reply, 'normal', 'mysterious')
    } catch (err) {
      const aiMsg: Message = {
        role: 'ai',
        content: `⚠️ ${err instanceof Error ? err.message : '通讯中断。我在另一个平行宇宙里尝试重新连接……'}`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'rgba(6,10,24,0.95)' }}>
      {/* 头部 */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(244,63,94,0.05))',
          borderBottom: '1px solid rgba(244,63,94,0.2)',
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-base"
          style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.4)' }}
        >
          🤖
        </div>
        <div>
          <div className="text-sm font-bold text-rose-300">观察者 AI</div>
          <div className="text-[10px] text-slate-500">系统级 · 宇宙智能助手</div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400">在线</span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(56,189,248,0.2))'
                  : 'rgba(15,23,42,0.8)',
                border: msg.role === 'user'
                  ? '1px solid rgba(168,85,247,0.3)'
                  : '1px solid rgba(244,63,94,0.15)',
                color: msg.role === 'user' ? '#e2e8f0' : '#cbd5e1',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
              <div
                className="text-[10px] mt-1 opacity-50"
                style={{ color: msg.role === 'user' ? '#94a3b8' : '#64748b' }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-2.5 text-sm"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(244,63,94,0.15)',
              }}
            >
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                观察者正在穿越平行宇宙……
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入框 */}
      <div
        className="flex-shrink-0 px-3 py-3"
        style={{ borderTop: '1px solid rgba(244,63,94,0.12)' }}
      >
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="向观察者提问……"
            rows={1}
            className="flex-1 rounded-xl px-3 py-2 text-sm resize-none outline-none"
            style={{
              background: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(244,63,94,0.25)',
              color: '#e2e8f0',
              minHeight: 40,
              maxHeight: 100,
            }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement
              t.style.height = 'auto'
              t.style.height = Math.min(t.scrollHeight, 100) + 'px'
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.3), rgba(244,63,94,0.2))',
              border: '1px solid rgba(244,63,94,0.4)',
              color: '#fda4af',
            }}
          >
            ➤
          </button>
        </div>
        <div className="text-[10px] text-slate-600 mt-1 text-center">
          Enter 发送 · Shift+Enter 换行
        </div>
      </div>
    </div>
  )
}
