import {
  planets,
  signs,
  aspects,
  elements,
  modalities,
  getComboSignature,
  getSignDifference,
  getAspectForSignDifference,
  arePlanetsInSameElement,
  arePlanetsInSameCategory,
  arePlanetsInSamePolarity,
  getDomicileSigns,
  type CombinationSignature,
  type Element,
  type PlanetCategory,
  type AspectNature,
} from './astrologyKnowledge'
import { comboConfigs, planetNames, getComboId, type ComboConfig } from '../data/comboConfigs'
import { createSeededRandom, stringToSeed } from './comboGenerator'

export type RelationType =
  | 'shared_planet'
  | 'same_element'
  | 'same_category'
  | 'same_polarity'
  | 'element_cycle'
  | 'aspect_harmonious'
  | 'aspect_challenging'
  | 'aspect_neutral'
  | 'domicile_connection'
  | 'exaltation_connection'
  | 'level_neighbor'
  | 'dominant_element_same'
  | 'dominant_category_same'
  | 'numerology_resonance'
  | 'rulership_chain'

export interface ComboRelation {
  comboId: string
  comboName: string
  relationTypes: RelationType[]
  strength: number
  description: string
  level: number
}

export interface RelationTypeInfo {
  type: RelationType
  name: string
  description: string
  baseStrength: number
  icon: string
  category: 'planet' | 'element' | 'aspect' | 'level' | 'mystical'
}

export const RELATION_TYPES: Record<RelationType, RelationTypeInfo> = {
  shared_planet: {
    type: 'shared_planet',
    name: '共有行星',
    description: '两个组合共享同一颗行星，能量直接贯通',
    baseStrength: 30,
    icon: '🔗',
    category: 'planet',
  },
  same_element: {
    type: 'same_element',
    name: '元素共鸣',
    description: '主导元素相同，产生强烈的元素共振',
    baseStrength: 25,
    icon: '✨',
    category: 'element',
  },
  same_category: {
    type: 'same_category',
    name: '同类相聚',
    description: '行星属于同一类别（个人/社会/超个人）',
    baseStrength: 15,
    icon: '👥',
    category: 'planet',
  },
  same_polarity: {
    type: 'same_polarity',
    name: '阴阳相契',
    description: '阴阳极性相同，能量频率协调',
    baseStrength: 10,
    icon: '☯️',
    category: 'element',
  },
  element_cycle: {
    type: 'element_cycle',
    name: '元素循环',
    description: '主导元素在五行/四元素循环中相邻',
    baseStrength: 12,
    icon: '🔄',
    category: 'element',
  },
  aspect_harmonious: {
    type: 'aspect_harmonious',
    name: '和谐相位',
    description: '守护星座形成六分相或三分相等和谐相位',
    baseStrength: 20,
    icon: '🎵',
    category: 'aspect',
  },
  aspect_challenging: {
    type: 'aspect_challenging',
    name: '挑战相位',
    description: '守护星座形成四分相或对分相等挑战相位',
    baseStrength: 18,
    icon: '⚡',
    category: 'aspect',
  },
  aspect_neutral: {
    type: 'aspect_neutral',
    name: '中性相位',
    description: '守护星座形成合相或其他中性相位',
    baseStrength: 15,
    icon: '⚖️',
    category: 'aspect',
  },
  domicile_connection: {
    type: 'domicile_connection',
    name: '守护链',
    description: '一颗行星守护另一颗行星的星座',
    baseStrength: 22,
    icon: '⛓️',
    category: 'mystical',
  },
  exaltation_connection: {
    type: 'exaltation_connection',
    name: '擢升之缘',
    description: '一颗行星在另一颗行星的守护星座擢升',
    baseStrength: 18,
    icon: '👑',
    category: 'mystical',
  },
  level_neighbor: {
    type: 'level_neighbor',
    name: '阶位相邻',
    description: '组合阶位（星数）相差1，能量层级接近',
    baseStrength: 8,
    icon: '📊',
    category: 'level',
  },
  dominant_element_same: {
    type: 'dominant_element_same',
    name: '主元素共振',
    description: '组合中占主导的元素相同',
    baseStrength: 20,
    icon: '🌟',
    category: 'element',
  },
  dominant_category_same: {
    type: 'dominant_category_same',
    name: '主范畴共振',
    description: '组合中占主导的行星类别相同',
    baseStrength: 12,
    icon: '🎯',
    category: 'planet',
  },
  numerology_resonance: {
    type: 'numerology_resonance',
    name: '数字共鸣',
    description: '行星数的数字命理学振动频率和谐',
    baseStrength: 10,
    icon: '🔢',
    category: 'mystical',
  },
  rulership_chain: {
    type: 'rulership_chain',
    name: '统治链',
    description: '行星之间形成守护关系链（A守护B的星座，B守护C的星座）',
    baseStrength: 25,
    icon: '🔱',
    category: 'mystical',
  },
}

const ALL_COMBO_IDS = Object.keys(comboConfigs)

function computeSharedPlanets(planetsA: string[], planetsB: string[]): string[] {
  return planetsA.filter(p => planetsB.includes(p))
}

function computeElementOverlap(sigA: CombinationSignature, sigB: CombinationSignature): number {
  const shared = sigA.elements.filter(e => sigB.elements.includes(e))
  return shared.length
}

function computeCategoryOverlap(sigA: CombinationSignature, sigB: CombinationSignature): number {
  const shared = sigA.categories.filter(c => sigB.categories.includes(c))
  return shared.length
}

function computePolarityOverlap(sigA: CombinationSignature, sigB: CombinationSignature): number {
  const shared = sigA.polarities.filter(p => sigB.polarities.includes(p))
  return shared.length
}

function checkElementCycle(elemA: Element, elemB: Element): boolean {
  const order: Element[] = ['fire', 'earth', 'air', 'water']
  const iA = order.indexOf(elemA)
  const iB = order.indexOf(elemB)
  const diff = Math.abs(iA - iB)
  return diff === 1 || diff === 3
}

function computeAspectRelations(planetsA: string[], planetsB: string[]): {
  harmonious: number
  challenging: number
  neutral: number
} {
  let harmonious = 0, challenging = 0, neutral = 0

  for (const pA of planetsA) {
    const domicilesA = getDomicileSigns(pA)
    if (domicilesA.length === 0) continue
    for (const pB of planetsB) {
      if (pA === pB) continue
      const domicilesB = getDomicileSigns(pB)
      if (domicilesB.length === 0) continue
      let bestNature: AspectNature | null = null
      let bestStrength = 0
      for (const sA of domicilesA) {
        for (const sB of domicilesB) {
          const diff = getSignDifference(sA, sB)
          const aspect = getAspectForSignDifference(diff)
          if (aspect) {
            const strength = 1 / (diff + 1)
            if (strength > bestStrength) {
              bestStrength = strength
              bestNature = aspect.nature
            }
          }
        }
      }
      if (bestNature === 'harmonious') harmonious++
      else if (bestNature === 'challenging') challenging++
      else if (bestNature === 'neutral') neutral++
    }
  }
  return { harmonious, challenging, neutral }
}

function checkDomicileConnection(planetsA: string[], planetsB: string[]): boolean {
  for (const pA of planetsA) {
    const planetInfoA = planets[pA]
    if (!planetInfoA) continue
    for (const sA of planetInfoA.domiciles) {
      const signInfo = signs[sA]
      if (signInfo && planetsB.includes(signInfo.ruler)) {
        return true
      }
    }
  }
  for (const pB of planetsB) {
    const planetInfoB = planets[pB]
    if (!planetInfoB) continue
    for (const sB of planetInfoB.domiciles) {
      const signInfo = signs[sB]
      if (signInfo && planetsA.includes(signInfo.ruler)) {
        return true
      }
    }
  }
  return false
}

function checkExaltationConnection(planetsA: string[], planetsB: string[]): boolean {
  for (const pA of planetsA) {
    const planetInfoA = planets[pA]
    if (!planetInfoA || !planetInfoA.exaltation) continue
    const exaltSign = signs[planetInfoA.exaltation]
    if (exaltSign && planetsB.includes(exaltSign.ruler)) {
      return true
    }
  }
  for (const pB of planetsB) {
    const planetInfoB = planets[pB]
    if (!planetInfoB || !planetInfoB.exaltation) continue
    const exaltSign = signs[planetInfoB.exaltation]
    if (exaltSign && planetsA.includes(exaltSign.ruler)) {
      return true
    }
  }
  return false
}

function checkRulershipChain(planetsA: string[], planetsB: string[]): boolean {
  const allPlanets = [...new Set([...planetsA, ...planetsB])]
  for (const start of allPlanets) {
    const visited = new Set<string>()
    let current = start
    let chainLength = 0
    while (current && !visited.has(current)) {
      visited.add(current)
      const pInfo = planets[current]
      if (!pInfo || pInfo.domiciles.length === 0) break
      const firstDomicile = pInfo.domiciles[0]
      const signInfo = signs[firstDomicile]
      if (!signInfo) break
      current = signInfo.ruler
      chainLength++
      if (chainLength >= 3) {
        const chainPlanets = Array.from(visited)
        const inA = chainPlanets.filter(p => planetsA.includes(p)).length
        const inB = chainPlanets.filter(p => planetsB.includes(p)).length
        if (inA >= 1 && inB >= 1) return true
      }
    }
  }
  return false
}

function checkNumerologyResonance(levelA: number, levelB: number): boolean {
  const reduce = (n: number): number => {
    while (n > 9) n = n.toString().split('').reduce((a, b) => a + parseInt(b), 0)
    return n
  }
  const numA = reduce(levelA)
  const numB = reduce(levelB)
  return numA === numB || Math.abs(numA - numB) === 3 || Math.abs(numA - numB) === 6
}

export function computeComboRelations(comboIdA: string, limit: number = 12): ComboRelation[] {
  const configA = comboConfigs[comboIdA]
  if (!configA) return []

  const sigA = getComboSignature(configA.planets)
  const relations: ComboRelation[] = []

  for (const comboIdB of ALL_COMBO_IDS) {
    if (comboIdA === comboIdB) continue
    const configB = comboConfigs[comboIdB]
    if (!configB) continue

    const sigB = getComboSignature(configB.planets)
    const relationTypes: RelationType[] = []
    let totalStrength = 0

    const shared = computeSharedPlanets(configA.planets, configB.planets)
    if (shared.length > 0) {
      relationTypes.push('shared_planet')
      totalStrength += RELATION_TYPES.shared_planet.baseStrength * Math.min(shared.length, 3)
    }

    if (sigA.dominantElement === sigB.dominantElement && shared.length < configA.planets.length) {
      relationTypes.push('dominant_element_same')
      totalStrength += RELATION_TYPES.dominant_element_same.baseStrength
    }

    const elemOverlap = computeElementOverlap(sigA, sigB)
    if (elemOverlap > 0 && shared.length === 0) {
      relationTypes.push('same_element')
      totalStrength += RELATION_TYPES.same_element.baseStrength * Math.min(elemOverlap, 2)
    }

    const catOverlap = computeCategoryOverlap(sigA, sigB)
    if (catOverlap > 0 && shared.length === 0) {
      relationTypes.push('same_category')
      totalStrength += RELATION_TYPES.same_category.baseStrength * Math.min(catOverlap, 2)
    }

    const polOverlap = computePolarityOverlap(sigA, sigB)
    if (polOverlap > 0 && shared.length === 0) {
      relationTypes.push('same_polarity')
      totalStrength += RELATION_TYPES.same_polarity.baseStrength
    }

    if (sigA.dominantCategory === sigB.dominantCategory && shared.length === 0) {
      relationTypes.push('dominant_category_same')
      totalStrength += RELATION_TYPES.dominant_category_same.baseStrength
    }

    if (checkElementCycle(sigA.dominantElement, sigB.dominantElement)) {
      relationTypes.push('element_cycle')
      totalStrength += RELATION_TYPES.element_cycle.baseStrength
    }

    const aspectRel = computeAspectRelations(configA.planets, configB.planets)
    if (aspectRel.harmonious > 0) {
      relationTypes.push('aspect_harmonious')
      totalStrength += RELATION_TYPES.aspect_harmonious.baseStrength * Math.min(aspectRel.harmonious, 3)
    }
    if (aspectRel.challenging > 0) {
      relationTypes.push('aspect_challenging')
      totalStrength += RELATION_TYPES.aspect_challenging.baseStrength * Math.min(aspectRel.challenging, 2)
    }
    if (aspectRel.neutral > 0 && aspectRel.harmonious === 0 && aspectRel.challenging === 0) {
      relationTypes.push('aspect_neutral')
      totalStrength += RELATION_TYPES.aspect_neutral.baseStrength
    }

    if (checkDomicileConnection(configA.planets, configB.planets)) {
      relationTypes.push('domicile_connection')
      totalStrength += RELATION_TYPES.domicile_connection.baseStrength
    }

    if (checkExaltationConnection(configA.planets, configB.planets)) {
      relationTypes.push('exaltation_connection')
      totalStrength += RELATION_TYPES.exaltation_connection.baseStrength
    }

    if (checkRulershipChain(configA.planets, configB.planets)) {
      relationTypes.push('rulership_chain')
      totalStrength += RELATION_TYPES.rulership_chain.baseStrength
    }

    if (Math.abs(sigA.level - sigB.level) === 1) {
      relationTypes.push('level_neighbor')
      totalStrength += RELATION_TYPES.level_neighbor.baseStrength
    }

    if (checkNumerologyResonance(sigA.level, sigB.level)) {
      relationTypes.push('numerology_resonance')
      totalStrength += RELATION_TYPES.numerology_resonance.baseStrength
    }

    if (relationTypes.length > 0) {
      const desc = generateRelationDescription(configA, configB, relationTypes)
      relations.push({
        comboId: comboIdB,
        comboName: configB.name,
        relationTypes,
        strength: Math.min(100, Math.round(totalStrength)),
        description: desc,
        level: configB.level,
      })
    }
  }

  relations.sort((a, b) => b.strength - a.strength)
  return relations.slice(0, limit)
}

function generateRelationDescription(
  configA: ComboConfig,
  configB: ComboConfig,
  types: RelationType[]
): string {
  const parts: string[] = []
  for (const t of types.slice(0, 3)) {
    const info = RELATION_TYPES[t]
    parts.push(info.name)
  }
  return `通过「${parts.join('·')}」连接`
}

export interface WanderStep {
  comboId: string
  comboName: string
  relationTypes: RelationType[]
  strength: number
  timestamp: number
}

export interface WanderState {
  path: WanderStep[]
  currentComboId: string
  totalSteps: number
  discoveredCombos: Set<string>
  startTime: number
}

const WANDER_MEMORY_KEY = 'stargraph_wander_state'

export function loadWanderState(): WanderState | null {
  try {
    const raw = localStorage.getItem(WANDER_MEMORY_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return {
      ...data,
      discoveredCombos: new Set(data.discoveredCombos || []),
    }
  } catch {
    return null
  }
}

export function saveWanderState(state: WanderState): void {
  try {
    const data = {
      ...state,
      discoveredCombos: Array.from(state.discoveredCombos),
    }
    localStorage.setItem(WANDER_MEMORY_KEY, JSON.stringify(data))
  } catch {}
}

export function startWander(startComboId: string): WanderState {
  const config = comboConfigs[startComboId]
  const state: WanderState = {
    path: [
      {
        comboId: startComboId,
        comboName: config?.name || startComboId,
        relationTypes: [],
        strength: 100,
        timestamp: Date.now(),
      },
    ],
    currentComboId: startComboId,
    totalSteps: 0,
    discoveredCombos: new Set([startComboId]),
    startTime: Date.now(),
  }
  saveWanderState(state)
  return state
}

export function wanderStep(
  currentState: WanderState,
  style: 'random' | 'strongest' | 'weakest' | 'most_relations' = 'random'
): { state: WanderState; step: WanderStep } | null {
  const relations = computeComboRelations(currentState.currentComboId, 20)
  if (relations.length === 0) return null

  let candidates = relations.filter(r => !currentState.discoveredCombos.has(r.comboId))

  if (candidates.length === 0) {
    candidates = relations.slice(0, 5)
  }

  let chosen: ComboRelation
  switch (style) {
    case 'strongest':
      chosen = candidates[0]
      break
    case 'weakest':
      chosen = candidates[candidates.length - 1]
      break
    case 'most_relations':
      candidates.sort((a, b) => b.relationTypes.length - a.relationTypes.length)
      chosen = candidates[0]
      break
    case 'random':
    default:
      const rand = createSeededRandom(Date.now() + currentState.totalSteps)
      const weights = candidates.map(c => Math.max(5, c.strength))
      const total = weights.reduce((a, b) => a + b, 0)
      let r = rand() * total
      chosen = candidates[0]
      for (let i = 0; i < candidates.length; i++) {
        r -= weights[i]
        if (r <= 0) {
          chosen = candidates[i]
          break
        }
      }
  }

  const step: WanderStep = {
    comboId: chosen.comboId,
    comboName: chosen.comboName,
    relationTypes: chosen.relationTypes,
    strength: chosen.strength,
    timestamp: Date.now(),
  }

  const newState: WanderState = {
    ...currentState,
    path: [...currentState.path, step],
    currentComboId: chosen.comboId,
    totalSteps: currentState.totalSteps + 1,
    discoveredCombos: new Set([...currentState.discoveredCombos, chosen.comboId]),
  }

  saveWanderState(newState)
  return { state: newState, step }
}

export function resetWander(): void {
  localStorage.removeItem(WANDER_MEMORY_KEY)
}

export const ALL_PLANET_IDS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']

export function generateAllCombos(): string[] {
  const result: string[] = []
  for (const id of ALL_COMBO_IDS) {
    result.push(id)
  }
  return result
}

export function getRandomCombo(seed?: number): string {
  const all = generateAllCombos()
  const rand = seed !== undefined ? createSeededRandom(seed) : Math.random
  const idx = Math.floor(rand() * all.length)
  return all[idx]
}

export function getCombosByLevel(level: number): string[] {
  return ALL_COMBO_IDS.filter(id => {
    const c = comboConfigs[id]
    return c && c.level === level
  })
}

export function getCombosByElement(element: Element): string[] {
  return ALL_COMBO_IDS.filter(id => {
    const c = comboConfigs[id]
    if (!c) return false
    const sig = getComboSignature(c.planets)
    return sig.dominantElement === element
  })
}

export function getCombosByCategory(category: PlanetCategory): string[] {
  return ALL_COMBO_IDS.filter(id => {
    const c = comboConfigs[id]
    if (!c) return false
    const sig = getComboSignature(c.planets)
    return sig.dominantCategory === category
  })
}

export interface ComboNetworkNode {
  id: string
  name: string
  level: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

export interface ComboNetworkEdge {
  source: string
  target: string
  strength: number
  types: RelationType[]
}

export function buildComboNetwork(maxNodes: number = 30): {
  nodes: ComboNetworkNode[]
  edges: ComboNetworkEdge[]
} {
  const allIds = generateAllCombos()
  const selectedIds = allIds.slice(0, Math.min(maxNodes, allIds.length))

  const nodes: ComboNetworkNode[] = selectedIds.map((id, i) => {
    const c = comboConfigs[id]
    const angle = (i / selectedIds.length) * Math.PI * 2
    const radius = 200 + (c?.level || 2) * 20
    const sig = getComboSignature(c?.planets || [])
    const elemColor = elements[sig.dominantElement]?.color || '#888'
    return {
      id,
      name: c?.name || id,
      level: c?.level || 2,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      size: 8 + (c?.level || 2) * 3,
      color: elemColor,
    }
  })

  const edges: ComboNetworkEdge[] = []
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  for (let i = 0; i < nodes.length; i++) {
    const relations = computeComboRelations(nodes[i].id, 5)
    for (const rel of relations) {
      if (nodeMap.has(rel.comboId) && rel.strength >= 20) {
        const exists = edges.some(e =>
          (e.source === nodes[i].id && e.target === rel.comboId) ||
          (e.source === rel.comboId && e.target === nodes[i].id)
        )
        if (!exists) {
          edges.push({
            source: nodes[i].id,
            target: rel.comboId,
            strength: rel.strength,
            types: rel.relationTypes,
          })
        }
      }
    }
  }

  return { nodes, edges }
}
