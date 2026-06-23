/**
 * JournalApp — 观测日志
 * 记录每次命运推演的轨迹，可保存、查看历史
 */

import { useState, useEffect } from 'react'

type Entry = {
  id: string
  date: string
  title: string
  summary: string
  fateProfile?: string
  nodesCount?: number
  bookmarked: boolean
}

const STORAGE_KEY = 'multiverse_journal'

// 演示数据
const DEMO_ENTRIES: Entry[] = [
  {
    id: '1',
    date: '2025-06-16',
    title: '命运的齿轮开始转动',
    summary: '探索了本源宇宙与两条分支路径。最可能的宇宙显示出对「未知」的强烈趋向性。',
    fateProfile: '星河漫游者',
    nodesCount: 6,
    bookmarked: true,
  },
  {
    id: '2',
    date: '2025-06-10',
    title: '第一次宇宙分裂',
    summary: '关键节点出现在第3个人生转折处。选择了「冒险」路径，看到了完全不同的宇宙走向。',
    fateProfile: '量子观察者',
    nodesCount: 4,
    bookmarked: false,
  },
  {
    id: '3',
    date: '2025-06-01',
    title: '今日签文：静水深流',
    summary: '签诗指引：不必急躁，真相会在对的时刻浮现。今日宜静思，不宜做重大决定。',
    bookmarked: true,
  },
]

export default function JournalApp() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSummary, setNewSummary] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setEntries(JSON.parse(stored)) } catch { setEntries([]) }
    } else {
      setEntries(DEMO_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ENTRIES))
    }
  }, [])

  const saveEntry = () => {
    if (!newTitle.trim()) return
    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-CN'),
      title: newTitle,
      summary: newSummary,
      bookmarked: false,
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setNewTitle('')
    setNewSummary('')
    setShowNew(false)
  }

  const toggleBookmark = (id: string) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, bookmarked: !e.bookmarked } : e
    )
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    if (selected?.id === id) {
      setSelected((prev) => prev ? { ...prev, bookmarked: !prev.bookmarked } : prev)
    }
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="h-full flex overflow-hidden" style={{ background: 'rgba(6,10,24,0.97)' }}>
      {/* 左侧列表 */}
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: 200,
          borderRight: '1px solid rgba(16,185,129,0.15)',
          background: 'rgba(8,14,28,0.8)',
        }}
      >
        <div
          className="px-3 py-3 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(16,185,129,0.12)' }}
        >
          <span className="text-xs font-bold text-emerald-300">📔 观测日志</span>
          <button
            onClick={() => setShowNew(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all hover:bg-emerald-500/20"
            style={{ color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            +
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {entries.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelected(e)}
              className="w-full text-left px-3 py-2.5 transition-all border-b"
              style={{
                background: selected?.id === e.id ? 'rgba(16,185,129,0.12)' : 'transparent',
                borderBottom: '1px solid rgba(16,185,129,0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{e.date}</span>
                {e.bookmarked && <span className="text-[10px]">⭐</span>}
              </div>
              <div className="text-sm font-semibold text-slate-200 truncate mt-0.5">{e.title}</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{e.summary}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧详情 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div
              className="px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(16,185,129,0.12)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">{selected.date}</div>
                  <div className="text-lg font-bold text-white">{selected.title}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBookmark(selected.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:bg-emerald-500/20"
                    style={{ color: selected.bookmarked ? '#fbbf24' : '#64748b' }}
                  >
                    {selected.bookmarked ? '⭐' : '☆'}
                  </button>
                  <button
                    onClick={() => deleteEntry(selected.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:bg-red-500/20"
                    style={{ color: '#64748b' }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {selected.fateProfile && (
                <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <span className="text-sm">🔮</span>
                  <span className="text-sm text-purple-200">命运底色：{selected.fateProfile}</span>
                </div>
              )}
              {selected.nodesCount && (
                <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                  <span className="text-sm">🪐</span>
                  <span className="text-sm text-sky-200">探索节点：{selected.nodesCount} 个</span>
                </div>
              )}
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{selected.summary}</p>
            </div>
          </>
        ) : showNew ? (
          <div className="flex-1 flex flex-col overflow-hidden p-5">
            <div className="text-sm font-bold text-white mb-3">新观测记录</div>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="记录标题……"
              className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
              style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.25)', color: '#e2e8f0' }}
            />
            <textarea
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="详细记录……"
              rows={6}
              className="flex-1 w-full px-3 py-2 rounded-lg text-sm mb-3 resize-none outline-none"
              style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.25)', color: '#e2e8f0', minHeight: 120 }}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200">取消</button>
              <button onClick={saveEntry} className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7' }}>保存记录</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-500 text-sm">
              <div className="text-4xl mb-3">📔</div>
              <div>选择一条记录查看</div>
              <div className="text-xs mt-1 text-slate-600">或点击 + 新建记录</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
