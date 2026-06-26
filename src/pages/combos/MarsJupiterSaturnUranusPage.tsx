import React, { useState } from 'react'
import { ComboShell } from '../../components/ComboShell'
import { comboConfigs } from '../../data/comboConfigs'
import { useLocalStorage } from '../../utils/planetExport'

const config = comboConfigs['mars-jupiter-saturn-uranus']
const PRIMARY_COLOR = config.primaryColor
const SECONDARY_COLOR = config.secondaryColor

const TAB_LIST = [
  { id: 'm1', name: '能量积累', icon: '🌌' },
  { id: 'm2', name: '突破时刻', icon: '🌟' },
  { id: 'm3', name: '力量升级', icon: '💫' },
  { id: 'm4', name: '创新行动', icon: '✨' },
]

interface Item1 { id: string; field1: string; field2: string; field3: string; createdAt: string }
interface Item2 { id: string; field1: string; field2: string; field3: string; createdAt: string }
interface Item3 { id: string; field1: string; field2: string; field3: string; createdAt: string }
interface Item4 { id: string; field1: string; field2: string; field3: string; createdAt: string }

const tabContainerStyle: React.CSSProperties = {
  display: 'flex', gap: '8px', flexWrap: 'wrap',
  marginBottom: '24px',
}

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  flex: '1 1 100px', padding: '12px 8px',
  background: active
    ? `linear-gradient(135deg, ${PRIMARY_COLOR}30, ${SECONDARY_COLOR}20)`
    : 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${active ? PRIMARY_COLOR + '60' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: '12px', color: active ? PRIMARY_COLOR : '#aaa',
  cursor: 'pointer', fontSize: '14px', fontWeight: active ? 600 : 400,
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(8px)',
})

const contentStyle: React.CSSProperties = {
  animation: 'fadeIn 0.4s ease',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px', padding: '24px',
  backdropFilter: 'blur(10px)',
}

const statsContainerStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px', marginBottom: '20px',
}

const statCardStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, ${PRIMARY_COLOR}15, ${SECONDARY_COLOR}10)`,
  border: `1px solid ${PRIMARY_COLOR}20`,
  borderRadius: '12px', padding: '16px', textAlign: 'center',
}

const statValueStyle: React.CSSProperties = {
  fontSize: '28px', fontWeight: 700, color: PRIMARY_COLOR,
  marginBottom: '4px',
}

const statLabelStyle: React.CSSProperties = {
  fontSize: '12px', color: '#999',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', color: '#eee',
  fontSize: '14px', marginBottom: '12px',
  outline: 'none',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle, minHeight: '100px', resize: 'vertical',
  fontFamily: 'inherit',
}

const buttonStyle: React.CSSProperties = {
  width: '100%', padding: '14px',
  background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
  border: 'none', borderRadius: '12px',
  color: '#fff', fontSize: '16px', fontWeight: 600,
  cursor: 'pointer', marginTop: '8px',
  transition: 'transform 0.2s ease',
}

const historyStyle: React.CSSProperties = {
  marginTop: '20px',
}

const historyItemStyle: React.CSSProperties = {
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px', marginBottom: '8px',
  fontSize: '13px', color: '#bbb',
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px', fontWeight: 600, color: PRIMARY_COLOR,
  marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
}

export default function MarsJupiterSaturnUranusPage() {
  const [activeTab, setActiveTab] = useState<string>('m1')
  const [items1, setItems1] = useLocalStorage<Item1[]>('mjsu-items1', [])
  const [items2, setItems2] = useLocalStorage<Item2[]>('mjsu-items2', [])
  const [items3, setItems3] = useLocalStorage<Item3[]>('mjsu-items3', [])
  const [items4, setItems4] = useLocalStorage<Item4[]>('mjsu-items4', [])
  
  const [f1, setF1] = useState('')
  const [f2, setF2] = useState('')
  const [f3, setF3] = useState('')
  const [f21, setF21] = useState('')
  const [f22, setF22] = useState('')
  const [f23, setF23] = useState('')
  const [f31, setF31] = useState('')
  const [f32, setF32] = useState('')
  const [f33, setF33] = useState('')
  const [f41, setF41] = useState('')
  const [f42, setF42] = useState('')
  const [f43, setF43] = useState('')
  
  const addItem = (n: number) => {
    const now = new Date().toISOString()
    if (n === 1 && f1.trim()) {
      setItems1([{ id: now, field1: f1, field2: f2, field3: f3, createdAt: now }, ...items1])
      setF1(''); setF2(''); setF3('')
    } else if (n === 2 && f21.trim()) {
      setItems2([{ id: now, field1: f21, field2: f22, field3: f23, createdAt: now }, ...items2])
      setF21(''); setF22(''); setF23('')
    } else if (n === 3 && f31.trim()) {
      setItems3([{ id: now, field1: f31, field2: f32, field3: f33, createdAt: now }, ...items3])
      setF31(''); setF32(''); setF33('')
    } else if (n === 4 && f41.trim()) {
      setItems4([{ id: now, field1: f41, field2: f42, field3: f43, createdAt: now }, ...items4])
      setF41(''); setF42(''); setF43('')
    }
  }
  
  const renderModule = (items: any[], n: number, f1v: string, s1: any, f2v: string, s2: any, f3v: string, s3: any) => {
    const labels = [
      ['积累', '来源', '总量'],
      ['突破', '触发', '效果'],
      ['升级', '维度', '程度'],
      ['行动', '方式', '结果'],
    ][n-1]
    
    return (
      <div style={contentStyle}>
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{items.length}</div>
            <div style={statLabelStyle}>条记录</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>
              {items.filter(i => {
                const d = new Date(i.createdAt)
                const now = new Date()
                return (now.getTime() - d.getTime()) < 7 * 24 * 3600 * 1000
              }).length}
            </div>
            <div style={statLabelStyle}>本周新增</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>
              {items.length > 0 ? Math.floor((new Date().getTime() - new Date(items[items.length-1].createdAt).getTime()) / 86400000) + 1 : 0}
            </div>
            <div style={statLabelStyle}>已坚持天数</div>
          </div>
        </div>
        
        <div style={sectionTitleStyle}>📝 记录</div>
        <div style={cardStyle}>
          <input type="text" value={f1v} onChange={e => s1(e.target.value)} placeholder={labels[0]} style={inputStyle} />
          <input type="text" value={f2v} onChange={e => s2(e.target.value)} placeholder={labels[1]} style={inputStyle} />
          <input type="text" value={f3v} onChange={e => s3(e.target.value)} placeholder={labels[2]} style={inputStyle} />
          <button style={buttonStyle} onClick={() => addItem(n)}>添加记录</button>
        </div>
        
        <div style={historyStyle}>
          <div style={sectionTitleStyle}>📋 最近记录</div>
          {items.length === 0 ? (
            <div style={{ ...historyItemStyle, textAlign: 'center', color: '#666' }}>
              还没有记录，开始记录吧
            </div>
          ) : items.slice(0, 5).map(item => (
            <div key={item.id} style={historyItemStyle}>
              <div style={{ color: PRIMARY_COLOR, marginBottom: '4px', fontWeight: 500 }}>
                {item.field1}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {item.field2} · {item.field3}
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ComboShell config={config}>
      <div style={tabContainerStyle}>
        {TAB_LIST.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabButtonStyle(activeTab === tab.id)}>
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>
      
      {activeTab === 'm1' && renderModule(items1, 1, f1, setF1, f2, setF2, f3, setF3)}
      {activeTab === 'm2' && renderModule(items2, 2, f21, setF21, f22, setF22, f23, setF23)}
      {activeTab === 'm3' && renderModule(items3, 3, f31, setF31, f32, setF32, f33, setF33)}
      {activeTab === 'm4' && renderModule(items4, 4, f41, setF41, f42, setF42, f43, setF43)}
    </ComboShell>
  )
}
