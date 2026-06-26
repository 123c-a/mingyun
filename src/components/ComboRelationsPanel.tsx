import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { computeComboRelations, RELATION_TYPES, type ComboRelation, type RelationType } from '../lib/comboRelations'
import { comboConfigs, planetNames } from '../data/comboConfigs'
import { elements, getComboSignature } from '../lib/astrologyKnowledge'

interface Props {
  comboId: string
  primaryColor: string
  secondaryColor: string
  accentText: string
  glowColor: string
}

export default function ComboRelationsPanel({ comboId, primaryColor, secondaryColor, accentText, glowColor }: Props) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expanded, setExpanded] = useState(true)

  const relations = useMemo(() => computeComboRelations(comboId, 15), [comboId])

  const config = comboConfigs[comboId]
  const sig = useMemo(() => config ? getComboSignature(config.planets) : null, [config])

  const categories = [
    { id: 'all', name: '全部', icon: '🌌' },
    { id: 'planet', name: '行星', icon: '🪐' },
    { id: 'element', name: '元素', icon: '✨' },
    { id: 'aspect', name: '相位', icon: '⚡' },
    { id: 'mystical', name: '神秘', icon: '🔮' },
    { id: 'level', name: '阶位', icon: '📊' },
  ]

  const filteredRelations = useMemo(() => {
    if (activeCategory === 'all') return relations
    return relations.filter(r =>
      r.relationTypes.some(t => RELATION_TYPES[t]?.category === activeCategory)
    )
  }, [relations, activeCategory])

  const handleComboClick = (targetId: string) => {
    const targetConfig = comboConfigs[targetId]
    if (targetConfig) {
      navigate(targetConfig.route)
    }
  }

  const getRelationBadges = (types: RelationType[]) => {
    return types.slice(0, 3).map(t => {
      const info = RELATION_TYPES[t]
      return (
        <span
          key={t}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 8px',
            borderRadius: 999,
            fontSize: 10,
            background: `${primaryColor}15`,
            border: `1px solid ${primaryColor}30`,
            color: accentText,
            opacity: 0.8,
          }}
        >
          <span>{info?.icon}</span>
          <span>{info?.name}</span>
        </span>
      )
    })
  }

  if (!config || !sig) return null

  const elemInfo = elements[sig.dominantElement]

  return (
    <div
      style={{
        marginTop: 40,
        borderRadius: 20,
        padding: 24,
        background: `linear-gradient(135deg, ${primaryColor}08, ${secondaryColor}08)`,
        border: `1px solid ${primaryColor}25`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🌌</span>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 300,
                color: primaryColor,
                letterSpacing: 2,
              }}
            >
              星图关联
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>
              探索与「{config.name}」相关的其他组合
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            opacity: 0.5,
            transition: 'transform 0.3s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          ▼
        </span>
      </div>

      {expanded && (
        <>
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 16,
              flexWrap: 'wrap',
            }}
          >
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: `1px solid ${activeCategory === cat.id ? primaryColor + '60' : primaryColor + '20'}`,
                  background: activeCategory === cat.id ? `${primaryColor}20` : 'transparent',
                  color: accentText,
                  fontSize: 11,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: activeCategory === cat.id ? 1 : 0.6,
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 20, padding: '12px 0' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${elemInfo?.color}40, transparent)`,
                  margin: '0 auto 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                {elemInfo?.chineseName}
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>主元素</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${primaryColor}30, transparent)`,
                  margin: '0 auto 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                {config.level}
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>阶位</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${secondaryColor}30, transparent)`,
                  margin: '0 auto 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                {relations.length}
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>关联</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${glowColor}, transparent)`,
                  margin: '0 auto 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                {sig.categories.length}
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>行星范畴</div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
              maxHeight: filteredRelations.length > 0 ? 400 : 60,
              overflowY: filteredRelations.length > 6 ? 'auto' : 'visible',
              paddingRight: 4,
            }}
          >
            {filteredRelations.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '20px 0',
                  opacity: 0.4,
                  fontSize: 12,
                }}
              >
                此分类下暂无关联组合
              </div>
            ) : (
              filteredRelations.map(rel => (
                <div
                  key={rel.comboId}
                  onClick={() => handleComboClick(rel.comboId)}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}08)`,
                    border: `1px solid ${primaryColor}20`,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = primaryColor + '50'
                    e.currentTarget.style.boxShadow = `0 8px 24px ${glowColor}`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = primaryColor + '20'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: accentText,
                          marginBottom: 2,
                        }}
                      >
                        {rel.comboName}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.5 }}>
                        {'⭐'.repeat(rel.level)} {rel.level}星
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: primaryColor,
                        opacity: 0.7,
                      }}
                    >
                      {rel.strength}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {getRelationBadges(rel.relationTypes)}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
