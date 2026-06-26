import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface Gratitude {
  id: string
  content: string
  source: string
  type: string
  createdAt: string
}

interface SelfLove {
  id: string
  point: string
  example: string
  feeling: string
  createdAt: string
}

interface Collection {
  id: string
  moment: string
  place: string
  companion: string
  createdAt: string
}

interface Manifest {
  id: string
  wish: string
  evidence: string
  action: string
  createdAt: string
}

const TYPE_OPTIONS = [
  '人', '事', '物', '体验', '成长', '其他'
]

const SOURCE_OPTIONS = [
  '家人', '朋友', '工作', '自然', '自己', '陌生人', '其他'
]

function GratitudeModule({ gratitudes, setGratitudes }: {
  gratitudes: Gratitude[]
  setGratitudes: (fn: (prev: Gratitude[]) => Gratitude[]) => void
}) {
  const [content, setContent] = useState('')
  const [source, setSource] = useState('自己')
  const [type, setType] = useState('人')

  const addGratitude = () => {
    if (!content.trim()) return
    const item: Gratitude = {
      id: `${Date.now()}`,
      content: content.trim(),
      source,
      type,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setGratitudes((prev) => [item, ...prev])
    setContent('')
  }

  const stats = {
    total: gratitudes.length,
    types: new Set(gratitudes.map(g => g.type)).size,
    sources: new Set(gratitudes.map(g => g.source)).size,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '感恩总数', value: stats.total, icon: '🌸' },
          { label: '感恩类型', value: stats.types, icon: '🎀' },
          { label: '感恩来源', value: stats.sources, icon: '💖' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          🌸 感恩绽放
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)} style={selectStyle}>
            {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天你感恩什么？"
          style={textAreaStyle}
        />

        <button
          onClick={addGratitude}
          disabled={!content.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0f8', fontSize: 12, letterSpacing: 3,
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            opacity: content.trim() ? 1 : 0.5,
          }}
        >
          🌸 绽放感恩
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的感恩</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {gratitudes.slice(0, 5).map((g) => (
            <div key={g.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: PRIMARY_COLOR }}>
                  {g.type} · {g.source}
                </span>
                <span style={{ fontSize: 10, opacity: 0.4 }}>{g.createdAt}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{g.content}</div>
            </div>
          ))}
          {gratitudes.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🌸 还没有感恩记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SelfLoveModule({ selfLoves, setSelfLoves }: {
  selfLoves: SelfLove[]
  setSelfLoves: (fn: (prev: SelfLove[]) => SelfLove[]) => void
}) {
  const [point, setPoint] = useState('')
  const [example, setExample] = useState('')
  const [feeling, setFeeling] = useState('')

  const addSelfLove = () => {
    if (!point.trim()) return
    const item: SelfLove = {
      id: `${Date.now()}`,
      point: point.trim(),
      example: example.trim(),
      feeling: feeling.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setSelfLoves((prev) => [item, ...prev])
    setPoint('')
    setExample('')
    setFeeling('')
  }

  const stats = {
    total: selfLoves.length,
    withExample: selfLoves.filter(s => s.example).length,
    withFeeling: selfLoves.filter(s => s.feeling).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '自我欣赏', value: stats.total, icon: '💖' },
          { label: '有具体事例', value: stats.withExample, icon: '🌟' },
          { label: '有感受记录', value: stats.withFeeling, icon: '💫' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          💖 自我欣赏
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          发现自己的闪光点，好好爱自己
        </div>

        <input
          type="text"
          value={point}
          onChange={(e) => setPoint(e.target.value)}
          placeholder="欣赏自己的哪一点？"
          style={inputStyle}
        />
        <textarea
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="具体的事例（可选）"
          style={textAreaStyle}
        />
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="这种感觉是怎样的？（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addSelfLove}
          disabled={!point.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0f8', fontSize: 12, letterSpacing: 3,
            cursor: point.trim() ? 'pointer' : 'not-allowed',
            opacity: point.trim() ? 1 : 0.5,
          }}
        >
          💖 记录欣赏
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>自我欣赏记录</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {selfLoves.slice(0, 5).map((s) => (
            <div key={s.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 12, color: PRIMARY_COLOR, marginBottom: 8 }}>
                💖 {s.point}
              </div>
              {s.example && (
                <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, marginBottom: 8 }}>
                  🌟 {s.example}
                </div>
              )}
              {s.feeling && (
                <div style={{ fontSize: 11, opacity: 0.6, fontStyle: 'italic' }}>
                  {s.feeling}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{s.createdAt}</div>
            </div>
          ))}
          {selfLoves.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              💖 还没有自我欣赏记录
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CollectionModule({ collections, setCollections }: {
  collections: Collection[]
  setCollections: (fn: (prev: Collection[]) => Collection[]) => void
}) {
  const [moment, setMoment] = useState('')
  const [place, setPlace] = useState('')
  const [companion, setCompanion] = useState('')

  const addCollection = () => {
    if (!moment.trim()) return
    const item: Collection = {
      id: `${Date.now()}`,
      moment: moment.trim(),
      place: place.trim(),
      companion: companion.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setCollections((prev) => [item, ...prev])
    setMoment('')
    setPlace('')
    setCompanion('')
  }

  const stats = {
    total: collections.length,
    places: new Set(collections.map(c => c.place).filter(Boolean)).size,
    companions: new Set(collections.map(c => c.companion).filter(Boolean)).size,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '美好收藏', value: stats.total, icon: '🎀' },
          { label: '收藏地点', value: stats.places, icon: '📍' },
          { label: '同行的人', value: stats.companions, icon: '👥' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          🎀 美好收藏
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          收藏生命中的美好瞬间
        </div>

        <textarea
          value={moment}
          onChange={(e) => setMoment(e.target.value)}
          placeholder="那个美好的瞬间是……"
          style={textAreaStyle}
        />
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="在哪里？（可选）"
          style={inputStyle}
        />
        <input
          type="text"
          value={companion}
          onChange={(e) => setCompanion(e.target.value)}
          placeholder="和谁在一起？（可选）"
          style={inputStyle}
        />

        <button
          onClick={addCollection}
          disabled={!moment.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0f8', fontSize: 12, letterSpacing: 3,
            cursor: moment.trim() ? 'pointer' : 'not-allowed',
            opacity: moment.trim() ? 1 : 0.5,
          }}
        >
          🎀 收藏美好
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>美好收藏</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {collections.slice(0, 5).map((c) => (
            <div key={c.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 8 }}>
                🎀 {c.moment}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {c.place && (
                  <span style={{ fontSize: 11, opacity: 0.6 }}>📍 {c.place}</span>
                )}
                {c.companion && (
                  <span style={{ fontSize: 11, opacity: 0.6 }}>👥 {c.companion}</span>
                )}
              </div>
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{c.createdAt}</div>
            </div>
          ))}
          {collections.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🎀 还没有美好收藏
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ManifestModule({ manifests, setManifests }: {
  manifests: Manifest[]
  setManifests: (fn: (prev: Manifest[]) => Manifest[]) => void
}) {
  const [wish, setWish] = useState('')
  const [evidence, setEvidence] = useState('')
  const [action, setAction] = useState('')

  const addManifest = () => {
    if (!wish.trim()) return
    const item: Manifest = {
      id: `${Date.now()}`,
      wish: wish.trim(),
      evidence: evidence.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setManifests((prev) => [item, ...prev])
    setWish('')
    setEvidence('')
    setAction('')
  }

  const stats = {
    total: manifests.length,
    withEvidence: manifests.filter(m => m.evidence).length,
    withAction: manifests.filter(m => m.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '显化愿望', value: stats.total, icon: '✨' },
          { label: '已有证据', value: stats.withEvidence, icon: '🌟' },
          { label: '已采取行动', value: stats.withAction, icon: '🎯' },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: PRIMARY_COLOR }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={mainCardStyle}>
        <div style={{ fontSize: 14, marginBottom: 16, letterSpacing: 2, color: PRIMARY_COLOR, textAlign: 'center' }}>
          ✨ 丰盛显化
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>
          相信你想要的一切正在向你走来
        </div>

        <textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          placeholder="你想要显化什么？"
          style={textAreaStyle}
        />
        <textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="已经出现的显化证据（可选）"
          style={textAreaStyle}
        />
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="你将采取的行动（可选）"
          style={textAreaStyle}
        />

        <button
          onClick={addManifest}
          disabled={!wish.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#fff0f8', fontSize: 12, letterSpacing: 3,
            cursor: wish.trim() ? 'pointer' : 'not-allowed',
            opacity: wish.trim() ? 1 : 0.5,
          }}
        >
          ✨ 发送愿望
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>显化清单</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {manifests.slice(0, 5).map((m) => (
            <div key={m.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, marginBottom: 8 }}>
                ✨ {m.wish}
              </div>
              {m.evidence && (
                <div style={{ fontSize: 12, color: '#ffd080', lineHeight: 1.6, marginBottom: 8 }}>
                  🌟 证据：{m.evidence}
                </div>
              )}
              {m.action && (
                <div style={{ fontSize: 12, color: '#a0e0b0', lineHeight: 1.6 }}>
                  🎯 行动：{m.action}
                </div>
              )}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{m.createdAt}</div>
            </div>
          ))}
          {manifests.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              ✨ 还没有显化愿望
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIMARY_COLOR = '#ffb0e0'
const SECONDARY_COLOR = '#e0a0ff'

const statCardStyle: React.CSSProperties = {
  padding: 16, borderRadius: 14, textAlign: 'center',
  background: `${PRIMARY_COLOR}08`,
  border: `1px solid ${PRIMARY_COLOR}20`,
  backdropFilter: 'blur(10px)',
}

const mainCardStyle: React.CSSProperties = {
  padding: 24, borderRadius: 20, marginBottom: 24,
  background: `${PRIMARY_COLOR}08`,
  border: `1px solid ${PRIMARY_COLOR}25`,
  backdropFilter: 'blur(10px)',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#fff0f8', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#fff0f8', fontSize: 13, outline: 'none', resize: 'vertical',
  fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
  background: 'rgba(0,0,0,0.2)', border: `1px solid ${PRIMARY_COLOR}30`,
  color: '#fff0f8', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', cursor: 'pointer',
}

const TAB_LIST = [
  { id: 'gratitude', name: '感恩绽放', icon: '🌸' },
  { id: 'selflove', name: '自我欣赏', icon: '💖' },
  { id: 'collection', name: '美好收藏', icon: '🎀' },
  { id: 'manifest', name: '丰盛显化', icon: '✨' },
]

export default function VenusJupiterPage() {
  const config = comboConfigs['venus-jupiter']
  const [activeTab, setActiveTab] = useState<string>('gratitude')
  const [gratitudes, setGratitudes] = useLocalStorage<Gratitude[]>('vj-gratitudes', [])
  const [selfLoves, setSelfLoves] = useLocalStorage<SelfLove[]>('vj-selfloves', [])
  const [collections, setCollections] = useLocalStorage<Collection[]>('vj-collections', [])
  const [manifests, setManifests] = useLocalStorage<Manifest[]>('vj-manifests', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#fff0f8' : 'rgba(255,255,255,0.5)',
    fontSize: 13, letterSpacing: 2, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(6px)',
  })

  const contentStyle: React.CSSProperties = { maxWidth: 640, margin: '0 auto' }

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
        {activeTab === 'gratitude' && <GratitudeModule gratitudes={gratitudes} setGratitudes={setGratitudes} />}
        {activeTab === 'selflove' && <SelfLoveModule selfLoves={selfLoves} setSelfLoves={setSelfLoves} />}
        {activeTab === 'collection' && <CollectionModule collections={collections} setCollections={setCollections} />}
        {activeTab === 'manifest' && <ManifestModule manifests={manifests} setManifests={setManifests} />}
      </div>
    </ComboShell>
  )
}
