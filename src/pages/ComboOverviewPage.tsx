import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { planetNames, planetColors, getComboConfig } from '../data/comboConfigs'
import {
  stringToSeed,
  generateComboName,
  generateSingleModule,
  generateThemeColors,
  type PlayModule,
} from '../lib/comboGenerator'

// 功能页面组件
import ComboReadingPage from './ComboReadingPage'
import OracleCardsPage from './OracleCardsPage'
import BreathingPage from './BreathingPage'
import ChakraPage from './ChakraPage'
import JournalPage from './JournalPage'
import WishPage from './WishPage'
import EnergyTrackerPage from './EnergyTrackerPage'
import GratitudePage from './GratitudePage'
import HabitPage from './HabitPage'
import RunesPage from './RunesPage'
import MoodPage from './MoodPage'
import ReflectionPage from './ReflectionPage'
import ShadowWorkPage from './ShadowWorkPage'
import PatternPage from './PatternPage'
import DreamPage from './DreamPage'
import TransformationPage from './TransformationPage'
import NumerologyPage from './NumerologyPage'
import IChingPage from './IChingPage'
import SoundHealingPage from './SoundHealingPage'
import InnerChildPage from './InnerChildPage'
import InnerSmilePage from './InnerSmilePage'
import CordCuttingPage from './CordCuttingPage'
import EnergyCleansePage from './EnergyCleansePage'
import RainbowBridgePage from './RainbowBridgePage'
import CosmicLetterPage from './CosmicLetterPage'
import SelfLovePage from './SelfLovePage'

// module slug -> 组件映射
const moduleComponents: Record<string, any> = {
  'daily-mirror': ReflectionPage,
  'soul-journal': JournalPage,
  'shadow-work': ShadowWorkPage,
  'pattern-finder': PatternPage,
  'deep-question': ReflectionPage,
  'cosmic-letter': CosmicLetterPage,
  'mood-palette': MoodPage,
  'dream-weaver': DreamPage,
  'wish-upon-star': WishPage,
  'inner-child': InnerChildPage,
  'rainbow-bridge': RainbowBridgePage,
  'breath-of-life': BreathingPage,
  'energy-cleanse': EnergyCleansePage,
  'sound-healing': SoundHealingPage,
  'energy-tracker': EnergyTrackerPage,
  'habit-stars': HabitPage,
  'gratitude-garden': GratitudePage,
  'transformation-journal': TransformationPage,
  'oracle-cards': OracleCardsPage,
  'numerology': NumerologyPage,
  'rune-reading': RunesPage,
  'i-ching': IChingPage,
  'self-love-ritual': SelfLovePage,
  'inner-smile': InnerSmilePage,
  'cord-cutting': CordCuttingPage,
  'chakra-balance': ChakraPage,
}

const planetTraits: Record<string, { element: string; meaning: string; emoji: string }> = {
  mercury: { element: '风', meaning: '思维与沟通', emoji: '💧' },
  venus: { element: '金', meaning: '情感与美感', emoji: '✨' },
  earth: { element: '土', meaning: '根基与实际', emoji: '🌍' },
  mars: { element: '火', meaning: '行动与热情', emoji: '🔥' },
  jupiter: { element: '木', meaning: '扩展与幸运', emoji: '🌟' },
  saturn: { element: '土', meaning: '限制与沉淀', emoji: '⏳' },
  uranus: { element: '风', meaning: '突变与自由', emoji: '⚡' },
  neptune: { element: '水', meaning: '消融与灵性', emoji: '🌊' },
  pluto: { element: '冥', meaning: '重生与转化', emoji: '🦋' },
}

export default function ComboOverviewPage() {
  const { '*': fullPath = '' } = useParams()
  const navigate = useNavigate()

  const comboId = fullPath.split('/')[0] || ''

  const validPlanets = useMemo(() => {
    return comboId.split('-').filter(id => planetNames[id] || id === 'pluto')
  }, [comboId])

  const seed = useMemo(() => stringToSeed(validPlanets.sort().join('-')), [validPlanets])
  const existingConfig = getComboConfig(validPlanets)

  const comboInfo = useMemo(() => {
    if (existingConfig) {
      return { name: existingConfig.name, subtitle: existingConfig.subtitle }
    }
    const { name, subtitle } = generateComboName(validPlanets, seed)
    return { name, subtitle }
  }, [validPlanets, seed, existingConfig])

  const theme = useMemo(() => {
    if (existingConfig) {
      return {
        primary: existingConfig.primaryColor,
        secondary: existingConfig.secondaryColor,
        glowColor: `${existingConfig.primaryColor}40`,
        borderColor: `${existingConfig.primaryColor}30`,
      }
    }
    return generateThemeColors(validPlanets, planetColors, seed)
  }, [validPlanets, seed, existingConfig])

  // 每个组合对应一个专属功能
  const singleModule = useMemo<PlayModule>(() => generateSingleModule(validPlanets, seed), [validPlanets, seed])

  const ModuleComponent = moduleComponents[singleModule.id] || ReflectionPage

  return <ModuleComponent />
}
