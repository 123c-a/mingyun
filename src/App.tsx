import { Routes, Route } from 'react-router-dom'
import GalaxyNav from './components/GalaxyNav'
import ObservatoryPage from './pages/ObservatoryPage'
import UniversePage from './pages/UniversePage'
import TimelinePage from './pages/TimelinePage'
import ExplorerPage from './pages/ExplorerPage'
import MasterOSPage from './pages/MasterOSPage'
import SettingsPage from './pages/SettingsPage'
import MercuryPage from './pages/MercuryPage'
import VenusPage from './pages/VenusPage'
import MarsPage from './pages/MarsPage'
import JupiterPage from './pages/JupiterPage'
import SaturnPage from './pages/SaturnPage'
import UranusPage from './pages/UranusPage'
import NeptunePage from './pages/NeptunePage'
import SunPage from './pages/SunPage'
import GalaxyView from './pages/GalaxyView'
import EarthOnlinePage from './pages/EarthOnlinePage'
import VoxelWorldPage from './pages/VoxelWorldPage'
import LegoBuilderPage from './pages/LegoBuilderPage'
import HealingBuilderPage from './pages/HealingBuilderPage'
import MercuryVenusPage from './pages/combos/MercuryVenusPage'
import VenusEarthPage from './pages/combos/VenusEarthPage'
import EarthMarsPage from './pages/combos/EarthMarsPage'
import MercuryMarsPage from './pages/combos/MercuryMarsPage'
import VenusMarsPage from './pages/combos/VenusMarsPage'
import MercuryJupiterPage from './pages/combos/MercuryJupiterPage'
import MercurySaturnPage from './pages/combos/MercurySaturnPage'
import JupiterSaturnPage from './pages/combos/JupiterSaturnPage'
import UranusNeptunePage from './pages/combos/UranusNeptunePage'
import MercuryVenusMarsPage from './pages/combos/MercuryVenusMarsPage'
import MercuryJupiterSaturnPage from './pages/combos/MercuryJupiterSaturnPage'
import EarthMarsUranusPage from './pages/combos/EarthMarsUranusPage'
import VenusJupiterSaturnPage from './pages/combos/VenusJupiterSaturnPage'
import MercuryUranusNeptunePage from './pages/combos/MercuryUranusNeptunePage'
import MercuryVenusJupiterSaturnPage from './pages/combos/MercuryVenusJupiterSaturnPage'
import EarthMarsJupiterSaturnPage from './pages/combos/EarthMarsJupiterSaturnPage'
import MercuryUranusNeptunePlutoPage from './pages/combos/MercuryUranusNeptunePlutoPage'
import MercuryVenusEarthMarsJupiterPage from './pages/combos/MercuryVenusEarthMarsJupiterPage'
import JupiterSaturnUranusNeptunePlutoPage from './pages/combos/JupiterSaturnUranusNeptunePlutoPage'
import ComboNotFoundPage from './pages/ComboNotFoundPage'
import DynamicComboPage from './pages/DynamicComboPage'

// 新增：独立功能页面
import ComboOverviewPage from './pages/ComboOverviewPage'
import ComboReadingPage from './pages/ComboReadingPage'
import OracleCardsPage from './pages/OracleCardsPage'
import BreathingPage from './pages/BreathingPage'
import ChakraPage from './pages/ChakraPage'
import JournalPage from './pages/JournalPage'
import WishPage from './pages/WishPage'
import EnergyTrackerPage from './pages/EnergyTrackerPage'
import GratitudePage from './pages/GratitudePage'
import HabitPage from './pages/HabitPage'
import RunesPage from './pages/RunesPage'
import MoodPage from './pages/MoodPage'
import ReflectionPage from './pages/ReflectionPage'
import ShadowWorkPage from './pages/ShadowWorkPage'
import PatternPage from './pages/PatternPage'
import DreamPage from './pages/DreamPage'
import TransformationPage from './pages/TransformationPage'
import NumerologyPage from './pages/NumerologyPage'
import IChingPage from './pages/IChingPage'
import SoundHealingPage from './pages/SoundHealingPage'
import InnerChildPage from './pages/InnerChildPage'
import InnerSmilePage from './pages/InnerSmilePage'
import CordCuttingPage from './pages/CordCuttingPage'
import EnergyCleansePage from './pages/EnergyCleansePage'
import RainbowBridgePage from './pages/RainbowBridgePage'
import CosmicLetterPage from './pages/CosmicLetterPage'
import SelfLovePage from './pages/SelfLovePage'
import AgentPage from './pages/AgentPage'
import FloatingOrb from './components/agent/FloatingOrb'

export default function App() {
  return (
    <>
      <FloatingOrb />
      <Routes>
        <Route path="/" element={<GalaxyNav />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/observatory" element={<ObservatoryPage />} />
      <Route path="/universe" element={<UniversePage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/explorer" element={<ExplorerPage />} />
      <Route path="/master-os" element={<MasterOSPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/mercury" element={<MercuryPage />} />
      <Route path="/venus" element={<VenusPage />} />
      <Route path="/mars" element={<MarsPage />} />
      <Route path="/jupiter" element={<JupiterPage />} />
      <Route path="/saturn" element={<SaturnPage />} />
      <Route path="/uranus" element={<UranusPage />} />
      <Route path="/neptune" element={<NeptunePage />} />
      <Route path="/sun" element={<SunPage />} />
      <Route path="/galaxy" element={<GalaxyView />} />
      <Route path="/earth-online" element={<EarthOnlinePage />} />
      <Route path="/voxel-world" element={<VoxelWorldPage />} />
      <Route path="/lego-builder" element={<LegoBuilderPage />} />
      <Route path="/healing-builder" element={<HealingBuilderPage />} />

      {/* 专属组合页面（优先匹配） */}
      <Route path="/combo/mercury-venus" element={<MercuryVenusPage />} />
      <Route path="/combo/venus-earth" element={<VenusEarthPage />} />
      <Route path="/combo/earth-mars" element={<EarthMarsPage />} />
      <Route path="/combo/mercury-mars" element={<MercuryMarsPage />} />
      <Route path="/combo/venus-mars" element={<VenusMarsPage />} />
      <Route path="/combo/mercury-jupiter" element={<MercuryJupiterPage />} />
      <Route path="/combo/mercury-saturn" element={<MercurySaturnPage />} />
      <Route path="/combo/jupiter-saturn" element={<JupiterSaturnPage />} />
      <Route path="/combo/uranus-neptune" element={<UranusNeptunePage />} />
      <Route path="/combo/mercury-venus-mars" element={<MercuryVenusMarsPage />} />
      <Route path="/combo/mercury-jupiter-saturn" element={<MercuryJupiterSaturnPage />} />
      <Route path="/combo/earth-mars-uranus" element={<EarthMarsUranusPage />} />
      <Route path="/combo/venus-jupiter-saturn" element={<VenusJupiterSaturnPage />} />
      <Route path="/combo/mercury-uranus-neptune" element={<MercuryUranusNeptunePage />} />
      <Route path="/combo/mercury-venus-jupiter-saturn" element={<MercuryVenusJupiterSaturnPage />} />
      <Route path="/combo/earth-mars-jupiter-saturn" element={<EarthMarsJupiterSaturnPage />} />
      <Route path="/combo/mercury-uranus-neptune-pluto" element={<MercuryUranusNeptunePlutoPage />} />
      <Route path="/combo/mercury-venus-earth-mars-jupiter" element={<MercuryVenusEarthMarsJupiterPage />} />
      <Route path="/combo/jupiter-saturn-uranus-neptune-pluto" element={<JupiterSaturnUranusNeptunePlutoPage />} />

      {/* 动态组合页面（一个组合一个功能） - 未匹配到专属页面时使用 */}
      <Route path="/combo/*" element={<ComboOverviewPage />} />

      {/* 404 */}
      <Route path="*" element={<ComboNotFoundPage />} />
    </Routes>
    </>
  )
}
