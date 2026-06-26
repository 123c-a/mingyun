import { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

interface TerritoryRecord {
  id: string
  territory: string
  expansion: string
  action: string
  createdAt: string
}

interface FoundationRecord {
  id: string
  foundation: string
  stability: string
  growth: string
  createdAt: string
}

interface AdventureRecord {
  id: string
  adventure: string
  courage: string
  destination: string
  createdAt: string
}

function TerritoryModule({ records, setRecords }: {
  records: TerritoryRecord[]
  setRecords: (fn: (prev: TerritoryRecord[]) => TerritoryRecord[]) => void
}) {
  const [territory, setTerritory] = useState('')
  const [expansion, setExpansion] = useState('')
  const [action, setAction] = useState('')

  const addRecord = () => {
    if (!territory.trim()) return
    const item: TerritoryRecord = {
      id: `${Date.now()}`,
      territory: territory.trim(),
      expansion: expansion.trim(),
      action: action.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setTerritory('')
    setExpansion('')
    setAction('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withAction: records.filter(r => r.action).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '版图总数', value: stats.total, icon: '🗺️' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有行动', value: stats.withAction, icon: '⚡' },
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
          🗺️ 扩张版图
        </div>
        <input
          type="text"
          value={territory}
          onChange={(e) => setTerritory(e.target.value)}
          placeholder="版图是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={expansion}
          onChange={(e) => setExpansion(e.target.value)}
          placeholder="如何扩张？"
          style={inputStyle}
        />
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="采取什么行动？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!territory.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: territory.trim() ? 'pointer' : 'not-allowed',
            opacity: territory.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录版图
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的版图</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🗺️ {r.territory}</div>
              {r.expansion && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📈 {r.expansion}</div>}
              {r.action && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>⚡ {r.action}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🗺️ 还没有版图
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FoundationModule({ records, setRecords }: {
  records: FoundationRecord[]
  setRecords: (fn: (prev: FoundationRecord[]) => FoundationRecord[]) => void
}) {
  const [foundation, setFoundation] = useState('')
  const [stability, setStability] = useState('')
  const [growth, setGrowth] = useState('')

  const addRecord = () => {
    if (!foundation.trim()) return
    const item: FoundationRecord = {
      id: `${Date.now()}`,
      foundation: foundation.trim(),
      stability: stability.trim(),
      growth: growth.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setFoundation('')
    setStability('')
    setGrowth('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withGrowth: records.filter(r => r.growth).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '根基总数', value: stats.total, icon: '🏔️' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有成长', value: stats.withGrowth, icon: '🌱' },
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
          🏔️ 稳固根基
        </div>
        <input
          type="text"
          value={foundation}
          onChange={(e) => setFoundation(e.target.value)}
          placeholder="根基是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={stability}
          onChange={(e) => setStability(e.target.value)}
          placeholder="如何稳固？"
          style={inputStyle}
        />
        <input
          type="text"
          value={growth}
          onChange={(e) => setGrowth(e.target.value)}
          placeholder="成长是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!foundation.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: foundation.trim() ? 'pointer' : 'not-allowed',
            opacity: foundation.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录根基
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的根基</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🏔️ {r.foundation}</div>
              {r.stability && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>📊 {r.stability}</div>}
              {r.growth && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🌱 {r.growth}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🏔️ 还没有根基
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdventureModule({ records, setRecords }: {
  records: AdventureRecord[]
  setRecords: (fn: (prev: AdventureRecord[]) => AdventureRecord[]) => void
}) {
  const [adventure, setAdventure] = useState('')
  const [courage, setCourage] = useState('')
  const [destination, setDestination] = useState('')

  const addRecord = () => {
    if (!adventure.trim()) return
    const item: AdventureRecord = {
      id: `${Date.now()}`,
      adventure: adventure.trim(),
      courage: courage.trim(),
      destination: destination.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
    }
    setRecords((prev) => [item, ...prev])
    setAdventure('')
    setCourage('')
    setDestination('')
  }

  const stats = {
    total: records.length,
    thisMonth: records.filter(r => {
      const date = new Date(r.createdAt)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return date >= monthAgo
    }).length,
    withDestination: records.filter(r => r.destination).length,
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: '冒险总数', value: stats.total, icon: '🚀' },
          { label: '本月新增', value: stats.thisMonth, icon: '📅' },
          { label: '已有目的地', value: stats.withDestination, icon: '🎯' },
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
          🚀 走出去
        </div>
        <input
          type="text"
          value={adventure}
          onChange={(e) => setAdventure(e.target.value)}
          placeholder="冒险是什么？"
          style={inputStyle}
        />
        <input
          type="text"
          value={courage}
          onChange={(e) => setCourage(e.target.value)}
          placeholder="勇气从何而来？"
          style={inputStyle}
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="目的地是什么？"
          style={inputStyle}
        />
        <button
          onClick={addRecord}
          disabled={!adventure.trim()}
          style={{
            width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 999,
            background: `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`,
            border: `1px solid ${PRIMARY_COLOR}50`,
            color: '#d0f0ff', fontSize: 12, letterSpacing: 3,
            cursor: adventure.trim() ? 'pointer' : 'not-allowed',
            opacity: adventure.trim() ? 1 : 0.5,
          }}
        >
          ✨ 记录冒险
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, letterSpacing: 2 }}>最近的冒险</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.slice(0, 5).map((r) => (
            <div key={r.id} style={{
              padding: 14, borderRadius: 12,
              background: `${PRIMARY_COLOR}08`,
              border: `1px solid ${PRIMARY_COLOR}20`,
            }}>
              <div style={{ fontSize: 13, color: PRIMARY_COLOR, marginBottom: 8 }}>🚀 {r.adventure}</div>
              {r.courage && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>💪 {r.courage}</div>}
              {r.destination && <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>🎯 {r.destination}</div>}
              <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>{r.createdAt}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.3, fontSize: 12 }}>
              🚀 还没有冒险
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const configKey = 'earth-mars-jupiter'
const config = comboConfigs[configKey]
const PRIMARY_COLOR = config.primaryColor
const SECONDARY_COLOR = config.secondaryColor

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
  color: '#d0f0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

const TAB_LIST = [
  { id: 'territory', name: '扩张版图', icon: '🗺️' },
  { id: 'foundation', name: '稳固根基', icon: '🏔️' },
  { id: 'adventure', name: '走出去', icon: '🚀' },
]

export default function EarthMarsJupiterPage() {
  const [activeTab, setActiveTab] = useState<string>('territory')
  const [territories, setTerritories] = useLocalStorage<TerritoryRecord[]>('emj-territories', [])
  const [foundations, setFoundations] = useLocalStorage<FoundationRecord[]>('emj-foundations', [])
  const [adventures, setAdventures] = useLocalStorage<AdventureRecord[]>('emj-adventures', [])

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap',
  }

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 999,
    background: active ? `linear-gradient(135deg, ${PRIMARY_COLOR}40, ${SECONDARY_COLOR}25)` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? PRIMARY_COLOR + '70' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#d0f0ff' : 'rgba(255,255,255,0.5)',
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
        {activeTab === 'territory' && <TerritoryModule records={territories} setRecords={setTerritories} />}
        {activeTab === 'foundation' && <FoundationModule records={foundations} setRecords={setFoundations} />}
        {activeTab === 'adventure' && <AdventureModule records={adventures} setRecords={setAdventures} />}
      </div>
    </ComboShell>
  )
}
