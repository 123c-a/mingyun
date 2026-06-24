import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage, exportAsImage } from '../../utils/planetExport'

interface WisdomEntry {
  id: string
  title: string
  content: string
  source: string
  category: string
  createdAt: string
}

const categoryOptions = ['人际关系', '自我成长', '工作事业', '情感感悟', '生活智慧', '其他']

export default function MercuryVenusJupiterSaturnPage() {
  const config = comboConfigs['mercury-venus-jupiter-saturn']
  const [entries, setEntries] = useLocalStorage<WisdomEntry[]>('combo-mercury-venus-jupiter-saturn', [])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [source, setSource] = useState('')
  const [category, setCategory] = useState('自我成长')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addEntry = () => {
    if (!content.trim()) return
    const newEntry: WisdomEntry = {
      id: `${Date.now()}`,
      title: title.trim() || content.slice(0, 20),
      content: content.trim(),
      source: source.trim(),
      category,
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
    setShowForm(false)
    setTitle('')
    setContent('')
    setSource('')
    setSelectedId(newEntry.id)
  }

  const handleExport = () => {
    const items = (entries || []).slice(0, 7).map((e) => ({
      text: e.title.slice(0, 30) + (e.title.length > 30 ? '…' : ''),
      meta: `${e.category} · ${e.source || '生活'}`,
    }))
    if (items.length === 0) items.push({ text: '还没有智慧记录', meta: '—' })
    exportAsImage(
      '人生智慧图鉴 · 收集生命中的光',
      '思维、情感、视野、时间，共同编织',
      items,
      '#1a1510',
      '#fff8e8',
      '#ffe8c8',
      `renshengzhihui-${Date.now()}.png`
    )
  }

  const selectedEntry = entries?.find((e) => e.id === selectedId)

  return (
    <ComboShell
      config={config}
      accent={
        <button onClick={handleExport} style={{
          padding: '8px 20px',
          borderRadius: 999,
          background: 'rgba(255, 232, 200, 0.15)',
          border: '1px solid rgba(255, 232, 200, 0.4)',
          color: '#fff8e8',
          fontSize: 12,
          letterSpacing: 3,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}>
          导出为图
        </button>
      }
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '14px 40px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(255, 232, 200, 0.25), rgba(255, 216, 160, 0.15))',
              border: '1px solid rgba(255, 232, 200, 0.5)',
              color: '#fff8e8',
              fontSize: 13,
              letterSpacing: 4,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            ✨ 收录一份智慧
          </button>
        </div>

        {showForm && (
          <div style={{
            padding: 24,
            borderRadius: 20,
            background: 'rgba(255, 232, 200, 0.06)',
            border: '1px solid rgba(255, 232, 200, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: '#ffe8c8' }}>
              ✨ 收录生命中的智慧之光
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                标题（可选）
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给这份智慧起个名字……"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 232, 200, 0.25)',
                  color: '#fff8e8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                分类
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {categoryOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: category === c ? 'rgba(255, 232, 200, 0.2)' : 'rgba(0,0,0,0.15)',
                      border: `1px solid ${category === c ? 'rgba(255, 232, 200, 0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: category === c ? '#ffe8c8' : 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                智慧内容
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="那份让你铭记的智慧是什么……"
                style={{
                  width: '100%',
                  minHeight: 120,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 232, 200, 0.25)',
                  color: '#fff8e8',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.7,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, letterSpacing: 2 }}>
                来源（可选）
              </div>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="来自谁、哪本书、哪件事？"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255, 232, 200, 0.25)',
                  color: '#fff8e8',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'inherit',
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
                onClick={addEntry}
                disabled={!content.trim()}
                style={{
                  flex: 1,
                  padding: '11px 20px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(255, 232, 200, 0.25), rgba(255, 216, 160, 0.15))',
                  border: '1px solid rgba(255, 232, 200, 0.5)',
                  color: '#fff8e8',
                  fontSize: 12,
                  letterSpacing: 3,
                  cursor: content.trim() ? 'pointer' : 'not-allowed',
                  opacity: content.trim() ? 1 : 0.5,
                }}
              >
                🌟 收录
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(entries || []).length === 0 && !showForm && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              opacity: 0.3,
              fontSize: 13,
              letterSpacing: 3,
            }}>
              ✨ 还没有收录的智慧
              <div style={{ fontSize: 11, marginTop: 10, opacity: 0.7, lineHeight: 1.8 }}>
                生命中有很多光<br />
                把它们收集起来，变成你的智慧图鉴
              </div>
            </div>
          )}

          {(entries || []).map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedId(entry.id === selectedId ? null : entry.id)}
              style={{
                padding: 18,
                borderRadius: 16,
                background: selectedId === entry.id
                  ? 'linear-gradient(135deg, rgba(255, 232, 200, 0.1), rgba(255, 216, 160, 0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedId === entry.id ? 'rgba(255, 232, 200, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#fff8e8',
                }}>
                  {entry.title}
                </div>
                <div style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'rgba(255, 232, 200, 0.15)',
                  color: '#ffe8c8',
                }}>
                  {entry.category}
                </div>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 10, opacity: 0.8 }}>
                {selectedId === entry.id
                  ? entry.content
                  : entry.content.length > 100 ? entry.content.slice(0, 100) + '…' : entry.content}
              </div>

              {entry.source && (
                <div style={{ fontSize: 11, opacity: 0.5 }}>
                  —— {entry.source}
                </div>
              )}

              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 10 }}>
                {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ComboShell>
  )
}
