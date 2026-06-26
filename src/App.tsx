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
import EarthVenusPage from './pages/combos/EarthVenusPage'
import EarthMarsPage from './pages/combos/EarthMarsPage'
import MercuryMarsPage from './pages/combos/MercuryMarsPage'
import VenusMarsPage from './pages/combos/VenusMarsPage'
import MercuryJupiterPage from './pages/combos/MercuryJupiterPage'
import MercurySaturnPage from './pages/combos/MercurySaturnPage'
import JupiterSaturnPage from './pages/combos/JupiterSaturnPage'
import UranusNeptunePage from './pages/combos/UranusNeptunePage'
import MercuryUranusPage from './pages/combos/MercuryUranusPage'
import MercuryNeptunePage from './pages/combos/MercuryNeptunePage'
import VenusJupiterPage from './pages/combos/VenusJupiterPage'
import VenusSaturnPage from './pages/combos/VenusSaturnPage'
import VenusUranusPage from './pages/combos/VenusUranusPage'
import VenusNeptunePage from './pages/combos/VenusNeptunePage'
import EarthJupiterPage from './pages/combos/EarthJupiterPage'
import EarthSaturnPage from './pages/combos/EarthSaturnPage'
import EarthUranusPage from './pages/combos/EarthUranusPage'
import EarthNeptunePage from './pages/combos/EarthNeptunePage'
import MarsJupiterPage from './pages/combos/MarsJupiterPage'
import MarsSaturnPage from './pages/combos/MarsSaturnPage'
import MarsUranusPage from './pages/combos/MarsUranusPage'
import MarsNeptunePage from './pages/combos/MarsNeptunePage'
import JupiterUranusPage from './pages/combos/JupiterUranusPage'
import JupiterNeptunePage from './pages/combos/JupiterNeptunePage'
import SaturnUranusPage from './pages/combos/SaturnUranusPage'
import SaturnNeptunePage from './pages/combos/SaturnNeptunePage'
import MercuryVenusEarthPage from './pages/combos/MercuryVenusEarthPage'
import MercuryVenusJupiterPage from './pages/combos/MercuryVenusJupiterPage'
import MercuryVenusSaturnPage from './pages/combos/MercuryVenusSaturnPage'
import MercuryVenusUranusPage from './pages/combos/MercuryVenusUranusPage'
import MercuryVenusNeptunePage from './pages/combos/MercuryVenusNeptunePage'
import MercuryEarthMarsPage from './pages/combos/MercuryEarthMarsPage'
import MercuryEarthJupiterPage from './pages/combos/MercuryEarthJupiterPage'
import MercuryEarthSaturnPage from './pages/combos/MercuryEarthSaturnPage'
import MercuryEarthUranusPage from './pages/combos/MercuryEarthUranusPage'
import MercuryEarthNeptunePage from './pages/combos/MercuryEarthNeptunePage'
import MercuryMarsJupiterPage from './pages/combos/MercuryMarsJupiterPage'
import MercuryMarsSaturnPage from './pages/combos/MercuryMarsSaturnPage'
import MercuryMarsUranusPage from './pages/combos/MercuryMarsUranusPage'
import MercuryMarsNeptunePage from './pages/combos/MercuryMarsNeptunePage'
import MercuryJupiterUranusPage from './pages/combos/MercuryJupiterUranusPage'
import MercuryJupiterNeptunePage from './pages/combos/MercuryJupiterNeptunePage'
import MercurySaturnNeptunePage from './pages/combos/MercurySaturnNeptunePage'
import VenusEarthMarsPage from './pages/combos/VenusEarthMarsPage'
import VenusEarthJupiterPage from './pages/combos/VenusEarthJupiterPage'
import VenusEarthSaturnPage from './pages/combos/VenusEarthSaturnPage'
import VenusEarthUranusPage from './pages/combos/VenusEarthUranusPage'
import VenusEarthNeptunePage from './pages/combos/VenusEarthNeptunePage'
import VenusMarsJupiterPage from './pages/combos/VenusMarsJupiterPage'
import VenusMarsSaturnPage from './pages/combos/VenusMarsSaturnPage'
import VenusMarsUranusPage from './pages/combos/VenusMarsUranusPage'
import VenusMarsNeptunePage from './pages/combos/VenusMarsNeptunePage'
import VenusJupiterUranusPage from './pages/combos/VenusJupiterUranusPage'
import VenusJupiterNeptunePage from './pages/combos/VenusJupiterNeptunePage'
import VenusSaturnUranusPage from './pages/combos/VenusSaturnUranusPage'
import VenusSaturnNeptunePage from './pages/combos/VenusSaturnNeptunePage'
import VenusUranusNeptunePage from './pages/combos/VenusUranusNeptunePage'
import EarthMarsJupiterPage from './pages/combos/EarthMarsJupiterPage'
import EarthMarsSaturnPage from './pages/combos/EarthMarsSaturnPage'
import EarthMarsNeptunePage from './pages/combos/EarthMarsNeptunePage'
import EarthJupiterSaturnPage from './pages/combos/EarthJupiterSaturnPage'
import EarthJupiterUranusPage from './pages/combos/EarthJupiterUranusPage'
import EarthJupiterNeptunePage from './pages/combos/EarthJupiterNeptunePage'
import EarthSaturnUranusPage from './pages/combos/EarthSaturnUranusPage'
import EarthSaturnNeptunePage from './pages/combos/EarthSaturnNeptunePage'
import EarthUranusNeptunePage from './pages/combos/EarthUranusNeptunePage'
import MarsJupiterSaturnPage from './pages/combos/MarsJupiterSaturnPage'
import MarsJupiterUranusPage from './pages/combos/MarsJupiterUranusPage'
import MarsJupiterNeptunePage from './pages/combos/MarsJupiterNeptunePage'
import MarsSaturnUranusPage from './pages/combos/MarsSaturnUranusPage'
import MarsSaturnNeptunePage from './pages/combos/MarsSaturnNeptunePage'
import MarsUranusNeptunePage from './pages/combos/MarsUranusNeptunePage'
import JupiterSaturnNeptunePage from './pages/combos/JupiterSaturnNeptunePage'
import JupiterUranusNeptunePage from './pages/combos/JupiterUranusNeptunePage'
import SaturnUranusNeptunePage from './pages/combos/SaturnUranusNeptunePage'
import MercuryVenusEarthMarsPage from './pages/combos/MercuryVenusEarthMarsPage'
import MercuryVenusEarthJupiterPage from './pages/combos/MercuryVenusEarthJupiterPage'
import MercuryVenusEarthSaturnPage from './pages/combos/MercuryVenusEarthSaturnPage'
import MercuryVenusEarthUranusPage from './pages/combos/MercuryVenusEarthUranusPage'
import MercuryVenusEarthNeptunePage from './pages/combos/MercuryVenusEarthNeptunePage'
import MercuryVenusMarsJupiterPage from './pages/combos/MercuryVenusMarsJupiterPage'
import MercuryVenusMarsSaturnPage from './pages/combos/MercuryVenusMarsSaturnPage'
import MercuryVenusMarsUranusPage from './pages/combos/MercuryVenusMarsUranusPage'
import MercuryVenusMarsNeptunePage from './pages/combos/MercuryVenusMarsNeptunePage'
import MercuryVenusJupiterUranusPage from './pages/combos/MercuryVenusJupiterUranusPage'
import MercuryVenusJupiterNeptunePage from './pages/combos/MercuryVenusJupiterNeptunePage'
import MercuryVenusSaturnUranusPage from './pages/combos/MercuryVenusSaturnUranusPage'
import MercuryVenusSaturnNeptunePage from './pages/combos/MercuryVenusSaturnNeptunePage'
import MercuryVenusUranusNeptunePage from './pages/combos/MercuryVenusUranusNeptunePage'
import MercuryEarthMarsJupiterPage from './pages/combos/MercuryEarthMarsJupiterPage'
import MercuryEarthMarsSaturnPage from './pages/combos/MercuryEarthMarsSaturnPage'
import MercuryEarthMarsUranusPage from './pages/combos/MercuryEarthMarsUranusPage'
import MercuryEarthMarsNeptunePage from './pages/combos/MercuryEarthMarsNeptunePage'
import MercuryEarthJupiterSaturnPage from './pages/combos/MercuryEarthJupiterSaturnPage'
import MercuryEarthJupiterUranusPage from './pages/combos/MercuryEarthJupiterUranusPage'
import MercuryEarthJupiterNeptunePage from './pages/combos/MercuryEarthJupiterNeptunePage'
import MercuryEarthSaturnUranusPage from './pages/combos/MercuryEarthSaturnUranusPage'
import MercuryEarthSaturnNeptunePage from './pages/combos/MercuryEarthSaturnNeptunePage'
import MercuryEarthUranusNeptunePage from './pages/combos/MercuryEarthUranusNeptunePage'
import MercuryMarsJupiterSaturnPage from './pages/combos/MercuryMarsJupiterSaturnPage'
import MercuryMarsJupiterUranusPage from './pages/combos/MercuryMarsJupiterUranusPage'
import MercuryMarsJupiterNeptunePage from './pages/combos/MercuryMarsJupiterNeptunePage'
import MercuryMarsSaturnUranusPage from './pages/combos/MercuryMarsSaturnUranusPage'
import MercuryMarsSaturnNeptunePage from './pages/combos/MercuryMarsSaturnNeptunePage'
import MercuryMarsUranusNeptunePage from './pages/combos/MercuryMarsUranusNeptunePage'
import MercuryJupiterSaturnUranusPage from './pages/combos/MercuryJupiterSaturnUranusPage'
import MercuryJupiterSaturnNeptunePage from './pages/combos/MercuryJupiterSaturnNeptunePage'
import MercuryJupiterUranusNeptunePage from './pages/combos/MercuryJupiterUranusNeptunePage'
import MercurySaturnUranusNeptunePage from './pages/combos/MercurySaturnUranusNeptunePage'
import VenusEarthMarsJupiterPage from './pages/combos/VenusEarthMarsJupiterPage'
import VenusEarthMarsSaturnPage from './pages/combos/VenusEarthMarsSaturnPage'
import VenusEarthMarsUranusPage from './pages/combos/VenusEarthMarsUranusPage'
import VenusEarthMarsNeptunePage from './pages/combos/VenusEarthMarsNeptunePage'
import VenusEarthJupiterSaturnPage from './pages/combos/VenusEarthJupiterSaturnPage'
import VenusEarthJupiterUranusPage from './pages/combos/VenusEarthJupiterUranusPage'
import VenusEarthJupiterNeptunePage from './pages/combos/VenusEarthJupiterNeptunePage'
import VenusEarthSaturnUranusPage from './pages/combos/VenusEarthSaturnUranusPage'
import VenusEarthSaturnNeptunePage from './pages/combos/VenusEarthSaturnNeptunePage'
import VenusEarthUranusNeptunePage from './pages/combos/VenusEarthUranusNeptunePage'
import VenusMarsJupiterSaturnPage from './pages/combos/VenusMarsJupiterSaturnPage'
import VenusMarsJupiterUranusPage from './pages/combos/VenusMarsJupiterUranusPage'
import VenusMarsJupiterNeptunePage from './pages/combos/VenusMarsJupiterNeptunePage'
import VenusMarsSaturnUranusPage from './pages/combos/VenusMarsSaturnUranusPage'
import VenusMarsSaturnNeptunePage from './pages/combos/VenusMarsSaturnNeptunePage'
import VenusMarsUranusNeptunePage from './pages/combos/VenusMarsUranusNeptunePage'
import VenusJupiterSaturnUranusPage from './pages/combos/VenusJupiterSaturnUranusPage'
import VenusJupiterSaturnNeptunePage from './pages/combos/VenusJupiterSaturnNeptunePage'
import VenusJupiterUranusNeptunePage from './pages/combos/VenusJupiterUranusNeptunePage'
import VenusSaturnUranusNeptunePage from './pages/combos/VenusSaturnUranusNeptunePage'
import EarthMarsJupiterUranusPage from './pages/combos/EarthMarsJupiterUranusPage'
import EarthMarsJupiterNeptunePage from './pages/combos/EarthMarsJupiterNeptunePage'
import EarthMarsSaturnUranusPage from './pages/combos/EarthMarsSaturnUranusPage'
import EarthMarsSaturnNeptunePage from './pages/combos/EarthMarsSaturnNeptunePage'
import EarthMarsUranusNeptunePage from './pages/combos/EarthMarsUranusNeptunePage'
import EarthJupiterSaturnUranusPage from './pages/combos/EarthJupiterSaturnUranusPage'
import EarthJupiterSaturnNeptunePage from './pages/combos/EarthJupiterSaturnNeptunePage'
import EarthJupiterUranusNeptunePage from './pages/combos/EarthJupiterUranusNeptunePage'
import EarthSaturnUranusNeptunePage from './pages/combos/EarthSaturnUranusNeptunePage'
import MarsJupiterSaturnUranusPage from './pages/combos/MarsJupiterSaturnUranusPage'
import MarsJupiterSaturnNeptunePage from './pages/combos/MarsJupiterSaturnNeptunePage'
import MarsJupiterUranusNeptunePage from './pages/combos/MarsJupiterUranusNeptunePage'
import MarsSaturnUranusNeptunePage from './pages/combos/MarsSaturnUranusNeptunePage'
import JupiterSaturnUranusNeptunePage from './pages/combos/JupiterSaturnUranusNeptunePage'
import MercuryVenusEarthMarsSaturnPage from './pages/combos/MercuryVenusEarthMarsSaturnPage'
import MercuryVenusEarthMarsUranusPage from './pages/combos/MercuryVenusEarthMarsUranusPage'
import MercuryVenusEarthMarsNeptunePage from './pages/combos/MercuryVenusEarthMarsNeptunePage'
import MercuryVenusEarthJupiterSaturnPage from './pages/combos/MercuryVenusEarthJupiterSaturnPage'
import MercuryVenusEarthJupiterUranusPage from './pages/combos/MercuryVenusEarthJupiterUranusPage'
import MercuryVenusEarthJupiterNeptunePage from './pages/combos/MercuryVenusEarthJupiterNeptunePage'
import MercuryVenusEarthSaturnUranusPage from './pages/combos/MercuryVenusEarthSaturnUranusPage'
import MercuryVenusEarthSaturnNeptunePage from './pages/combos/MercuryVenusEarthSaturnNeptunePage'
import MercuryVenusEarthUranusNeptunePage from './pages/combos/MercuryVenusEarthUranusNeptunePage'
import MercuryVenusMarsJupiterSaturnPage from './pages/combos/MercuryVenusMarsJupiterSaturnPage'
import MercuryVenusMarsJupiterUranusPage from './pages/combos/MercuryVenusMarsJupiterUranusPage'
import MercuryVenusMarsJupiterNeptunePage from './pages/combos/MercuryVenusMarsJupiterNeptunePage'
import MercuryVenusMarsSaturnUranusPage from './pages/combos/MercuryVenusMarsSaturnUranusPage'
import MercuryVenusMarsSaturnNeptunePage from './pages/combos/MercuryVenusMarsSaturnNeptunePage'
import MercuryVenusMarsUranusNeptunePage from './pages/combos/MercuryVenusMarsUranusNeptunePage'
import MercuryVenusJupiterSaturnUranusPage from './pages/combos/MercuryVenusJupiterSaturnUranusPage'
import MercuryVenusJupiterSaturnNeptunePage from './pages/combos/MercuryVenusJupiterSaturnNeptunePage'
import MercuryVenusJupiterUranusNeptunePage from './pages/combos/MercuryVenusJupiterUranusNeptunePage'
import MercuryVenusSaturnUranusNeptunePage from './pages/combos/MercuryVenusSaturnUranusNeptunePage'
import MercuryEarthMarsJupiterSaturnPage from './pages/combos/MercuryEarthMarsJupiterSaturnPage'
import MercuryEarthMarsJupiterUranusPage from './pages/combos/MercuryEarthMarsJupiterUranusPage'
import MercuryEarthMarsJupiterNeptunePage from './pages/combos/MercuryEarthMarsJupiterNeptunePage'
import MercuryEarthMarsSaturnUranusPage from './pages/combos/MercuryEarthMarsSaturnUranusPage'
import MercuryEarthMarsSaturnNeptunePage from './pages/combos/MercuryEarthMarsSaturnNeptunePage'
import MercuryEarthMarsUranusNeptunePage from './pages/combos/MercuryEarthMarsUranusNeptunePage'
import MercuryEarthJupiterSaturnUranusPage from './pages/combos/MercuryEarthJupiterSaturnUranusPage'
import MercuryEarthJupiterSaturnNeptunePage from './pages/combos/MercuryEarthJupiterSaturnNeptunePage'
import MercuryEarthJupiterUranusNeptunePage from './pages/combos/MercuryEarthJupiterUranusNeptunePage'
import MercuryEarthSaturnUranusNeptunePage from './pages/combos/MercuryEarthSaturnUranusNeptunePage'
import MercuryMarsJupiterSaturnUranusPage from './pages/combos/MercuryMarsJupiterSaturnUranusPage'
import MercuryMarsJupiterSaturnNeptunePage from './pages/combos/MercuryMarsJupiterSaturnNeptunePage'
import MercuryMarsJupiterUranusNeptunePage from './pages/combos/MercuryMarsJupiterUranusNeptunePage'
import MercuryMarsSaturnUranusNeptunePage from './pages/combos/MercuryMarsSaturnUranusNeptunePage'
import MercuryJupiterSaturnUranusNeptunePage from './pages/combos/MercuryJupiterSaturnUranusNeptunePage'
import VenusEarthMarsJupiterSaturnPage from './pages/combos/VenusEarthMarsJupiterSaturnPage'
import VenusEarthMarsJupiterUranusPage from './pages/combos/VenusEarthMarsJupiterUranusPage'
import VenusEarthMarsJupiterNeptunePage from './pages/combos/VenusEarthMarsJupiterNeptunePage'
import VenusEarthMarsSaturnUranusPage from './pages/combos/VenusEarthMarsSaturnUranusPage'
import VenusEarthMarsSaturnNeptunePage from './pages/combos/VenusEarthMarsSaturnNeptunePage'
import VenusEarthMarsUranusNeptunePage from './pages/combos/VenusEarthMarsUranusNeptunePage'
import VenusEarthJupiterSaturnUranusPage from './pages/combos/VenusEarthJupiterSaturnUranusPage'
import VenusEarthJupiterSaturnNeptunePage from './pages/combos/VenusEarthJupiterSaturnNeptunePage'
import VenusEarthJupiterUranusNeptunePage from './pages/combos/VenusEarthJupiterUranusNeptunePage'
import VenusEarthSaturnUranusNeptunePage from './pages/combos/VenusEarthSaturnUranusNeptunePage'
import VenusMarsJupiterSaturnUranusPage from './pages/combos/VenusMarsJupiterSaturnUranusPage'
import VenusMarsJupiterSaturnNeptunePage from './pages/combos/VenusMarsJupiterSaturnNeptunePage'
import VenusMarsJupiterUranusNeptunePage from './pages/combos/VenusMarsJupiterUranusNeptunePage'
import VenusMarsSaturnUranusNeptunePage from './pages/combos/VenusMarsSaturnUranusNeptunePage'
import VenusJupiterSaturnUranusNeptunePage from './pages/combos/VenusJupiterSaturnUranusNeptunePage'
import EarthMarsJupiterSaturnUranusPage from './pages/combos/EarthMarsJupiterSaturnUranusPage'
import EarthMarsJupiterSaturnNeptunePage from './pages/combos/EarthMarsJupiterSaturnNeptunePage'
import EarthMarsJupiterUranusNeptunePage from './pages/combos/EarthMarsJupiterUranusNeptunePage'
import EarthMarsSaturnUranusNeptunePage from './pages/combos/EarthMarsSaturnUranusNeptunePage'
import EarthJupiterSaturnUranusNeptunePage from './pages/combos/EarthJupiterSaturnUranusNeptunePage'
import MarsJupiterSaturnUranusNeptunePage from './pages/combos/MarsJupiterSaturnUranusNeptunePage'
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
import ARStarPage from './pages/ARStarPage'
import FloatingOrb from './components/agent/FloatingOrb'

export default function App() {
  return (
    <>
      <FloatingOrb />
      <Routes>
        <Route path="/" element={<GalaxyNav />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/ar-star" element={<ARStarPage />} />
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
      <Route path="/combo/earth-venus" element={<EarthVenusPage />} />
      <Route path="/combo/earth-mars" element={<EarthMarsPage />} />
      <Route path="/combo/mercury-mars" element={<MercuryMarsPage />} />
      <Route path="/combo/venus-mars" element={<VenusMarsPage />} />
      <Route path="/combo/mercury-jupiter" element={<MercuryJupiterPage />} />
      <Route path="/combo/mercury-saturn" element={<MercurySaturnPage />} />
      <Route path="/combo/jupiter-saturn" element={<JupiterSaturnPage />} />
      <Route path="/combo/uranus-neptune" element={<UranusNeptunePage />} />
      <Route path="/combo/mercury-uranus" element={<MercuryUranusPage />} />
      <Route path="/combo/mercury-neptune" element={<MercuryNeptunePage />} />
      <Route path="/combo/venus-jupiter" element={<VenusJupiterPage />} />
      <Route path="/combo/venus-saturn" element={<VenusSaturnPage />} />
      <Route path="/combo/venus-uranus" element={<VenusUranusPage />} />
      <Route path="/combo/venus-neptune" element={<VenusNeptunePage />} />
      <Route path="/combo/earth-jupiter" element={<EarthJupiterPage />} />
      <Route path="/combo/earth-saturn" element={<EarthSaturnPage />} />
      <Route path="/combo/earth-uranus" element={<EarthUranusPage />} />
      <Route path="/combo/earth-neptune" element={<EarthNeptunePage />} />
      <Route path="/combo/mars-jupiter" element={<MarsJupiterPage />} />
      <Route path="/combo/mars-saturn" element={<MarsSaturnPage />} />
      <Route path="/combo/mars-uranus" element={<MarsUranusPage />} />
      <Route path="/combo/mars-neptune" element={<MarsNeptunePage />} />
      <Route path="/combo/jupiter-uranus" element={<JupiterUranusPage />} />
      <Route path="/combo/jupiter-neptune" element={<JupiterNeptunePage />} />
      <Route path="/combo/saturn-uranus" element={<SaturnUranusPage />} />
      <Route path="/combo/saturn-neptune" element={<SaturnNeptunePage />} />
      <Route path="/combo/mercury-venus-earth" element={<MercuryVenusEarthPage />} />
      <Route path="/combo/mercury-venus-jupiter" element={<MercuryVenusJupiterPage />} />
      <Route path="/combo/mercury-venus-saturn" element={<MercuryVenusSaturnPage />} />
      <Route path="/combo/mercury-venus-uranus" element={<MercuryVenusUranusPage />} />
      <Route path="/combo/mercury-venus-neptune" element={<MercuryVenusNeptunePage />} />
      <Route path="/combo/mercury-earth-mars" element={<MercuryEarthMarsPage />} />
      <Route path="/combo/mercury-earth-jupiter" element={<MercuryEarthJupiterPage />} />
      <Route path="/combo/mercury-earth-saturn" element={<MercuryEarthSaturnPage />} />
      <Route path="/combo/mercury-earth-uranus" element={<MercuryEarthUranusPage />} />
      <Route path="/combo/mercury-earth-neptune" element={<MercuryEarthNeptunePage />} />
      <Route path="/combo/mercury-mars-jupiter" element={<MercuryMarsJupiterPage />} />
      <Route path="/combo/mercury-mars-saturn" element={<MercuryMarsSaturnPage />} />
      <Route path="/combo/mercury-mars-uranus" element={<MercuryMarsUranusPage />} />
      <Route path="/combo/mercury-mars-neptune" element={<MercuryMarsNeptunePage />} />
      <Route path="/combo/mercury-jupiter-uranus" element={<MercuryJupiterUranusPage />} />
      <Route path="/combo/mercury-jupiter-neptune" element={<MercuryJupiterNeptunePage />} />
      <Route path="/combo/mercury-saturn-neptune" element={<MercurySaturnNeptunePage />} />
      <Route path="/combo/venus-earth-mars" element={<VenusEarthMarsPage />} />
      <Route path="/combo/venus-earth-jupiter" element={<VenusEarthJupiterPage />} />
      <Route path="/combo/venus-earth-saturn" element={<VenusEarthSaturnPage />} />
      <Route path="/combo/venus-earth-uranus" element={<VenusEarthUranusPage />} />
      <Route path="/combo/venus-earth-neptune" element={<VenusEarthNeptunePage />} />
      <Route path="/combo/venus-mars-jupiter" element={<VenusMarsJupiterPage />} />
      <Route path="/combo/venus-mars-saturn" element={<VenusMarsSaturnPage />} />
      <Route path="/combo/venus-mars-uranus" element={<VenusMarsUranusPage />} />
      <Route path="/combo/venus-mars-neptune" element={<VenusMarsNeptunePage />} />
      <Route path="/combo/venus-jupiter-uranus" element={<VenusJupiterUranusPage />} />
      <Route path="/combo/venus-jupiter-neptune" element={<VenusJupiterNeptunePage />} />
      <Route path="/combo/venus-saturn-uranus" element={<VenusSaturnUranusPage />} />
      <Route path="/combo/venus-saturn-neptune" element={<VenusSaturnNeptunePage />} />
      <Route path="/combo/venus-uranus-neptune" element={<VenusUranusNeptunePage />} />
      <Route path="/combo/earth-mars-jupiter" element={<EarthMarsJupiterPage />} />
      <Route path="/combo/earth-mars-saturn" element={<EarthMarsSaturnPage />} />
      <Route path="/combo/earth-mars-neptune" element={<EarthMarsNeptunePage />} />
      <Route path="/combo/earth-jupiter-saturn" element={<EarthJupiterSaturnPage />} />
      <Route path="/combo/earth-jupiter-uranus" element={<EarthJupiterUranusPage />} />
      <Route path="/combo/earth-jupiter-neptune" element={<EarthJupiterNeptunePage />} />
      <Route path="/combo/earth-saturn-uranus" element={<EarthSaturnUranusPage />} />
      <Route path="/combo/earth-saturn-neptune" element={<EarthSaturnNeptunePage />} />
      <Route path="/combo/earth-uranus-neptune" element={<EarthUranusNeptunePage />} />
      <Route path="/combo/mars-jupiter-saturn" element={<MarsJupiterSaturnPage />} />
      <Route path="/combo/mars-jupiter-uranus" element={<MarsJupiterUranusPage />} />
      <Route path="/combo/mars-jupiter-neptune" element={<MarsJupiterNeptunePage />} />
      <Route path="/combo/mars-saturn-uranus" element={<MarsSaturnUranusPage />} />
      <Route path="/combo/mars-saturn-neptune" element={<MarsSaturnNeptunePage />} />
      <Route path="/combo/mars-uranus-neptune" element={<MarsUranusNeptunePage />} />
      <Route path="/combo/jupiter-saturn-neptune" element={<JupiterSaturnNeptunePage />} />
      <Route path="/combo/jupiter-uranus-neptune" element={<JupiterUranusNeptunePage />} />
      <Route path="/combo/saturn-uranus-neptune" element={<SaturnUranusNeptunePage />} />
      <Route path="/combo/mercury-venus-earth-mars" element={<MercuryVenusEarthMarsPage />} />
      <Route path="/combo/mercury-venus-earth-jupiter" element={<MercuryVenusEarthJupiterPage />} />
      <Route path="/combo/mercury-venus-earth-saturn" element={<MercuryVenusEarthSaturnPage />} />
      <Route path="/combo/mercury-venus-earth-uranus" element={<MercuryVenusEarthUranusPage />} />
      <Route path="/combo/mercury-venus-earth-neptune" element={<MercuryVenusEarthNeptunePage />} />
      <Route path="/combo/mercury-venus-mars-jupiter" element={<MercuryVenusMarsJupiterPage />} />
      <Route path="/combo/mercury-venus-mars-saturn" element={<MercuryVenusMarsSaturnPage />} />
      <Route path="/combo/mercury-venus-mars-uranus" element={<MercuryVenusMarsUranusPage />} />
      <Route path="/combo/mercury-venus-mars-neptune" element={<MercuryVenusMarsNeptunePage />} />
      <Route path="/combo/mercury-venus-jupiter-uranus" element={<MercuryVenusJupiterUranusPage />} />
      <Route path="/combo/mercury-venus-jupiter-neptune" element={<MercuryVenusJupiterNeptunePage />} />
      <Route path="/combo/mercury-venus-saturn-uranus" element={<MercuryVenusSaturnUranusPage />} />
      <Route path="/combo/mercury-venus-saturn-neptune" element={<MercuryVenusSaturnNeptunePage />} />
      <Route path="/combo/mercury-venus-uranus-neptune" element={<MercuryVenusUranusNeptunePage />} />
      <Route path="/combo/mercury-earth-mars-jupiter" element={<MercuryEarthMarsJupiterPage />} />
      <Route path="/combo/mercury-earth-mars-saturn" element={<MercuryEarthMarsSaturnPage />} />
      <Route path="/combo/mercury-earth-mars-uranus" element={<MercuryEarthMarsUranusPage />} />
      <Route path="/combo/mercury-earth-mars-neptune" element={<MercuryEarthMarsNeptunePage />} />
      <Route path="/combo/mercury-earth-jupiter-saturn" element={<MercuryEarthJupiterSaturnPage />} />
      <Route path="/combo/mercury-earth-jupiter-uranus" element={<MercuryEarthJupiterUranusPage />} />
      <Route path="/combo/mercury-earth-jupiter-neptune" element={<MercuryEarthJupiterNeptunePage />} />
      <Route path="/combo/mercury-earth-saturn-uranus" element={<MercuryEarthSaturnUranusPage />} />
      <Route path="/combo/mercury-earth-saturn-neptune" element={<MercuryEarthSaturnNeptunePage />} />
      <Route path="/combo/mercury-earth-uranus-neptune" element={<MercuryEarthUranusNeptunePage />} />
      <Route path="/combo/mercury-mars-jupiter-saturn" element={<MercuryMarsJupiterSaturnPage />} />
      <Route path="/combo/mercury-mars-jupiter-uranus" element={<MercuryMarsJupiterUranusPage />} />
      <Route path="/combo/mercury-mars-jupiter-neptune" element={<MercuryMarsJupiterNeptunePage />} />
      <Route path="/combo/mercury-mars-saturn-uranus" element={<MercuryMarsSaturnUranusPage />} />
      <Route path="/combo/mercury-mars-saturn-neptune" element={<MercuryMarsSaturnNeptunePage />} />
      <Route path="/combo/mercury-mars-uranus-neptune" element={<MercuryMarsUranusNeptunePage />} />
      <Route path="/combo/mercury-jupiter-saturn-uranus" element={<MercuryJupiterSaturnUranusPage />} />
      <Route path="/combo/mercury-jupiter-saturn-neptune" element={<MercuryJupiterSaturnNeptunePage />} />
      <Route path="/combo/mercury-jupiter-uranus-neptune" element={<MercuryJupiterUranusNeptunePage />} />
      <Route path="/combo/mercury-saturn-uranus-neptune" element={<MercurySaturnUranusNeptunePage />} />
      <Route path="/combo/venus-earth-mars-jupiter" element={<VenusEarthMarsJupiterPage />} />
      <Route path="/combo/venus-earth-mars-saturn" element={<VenusEarthMarsSaturnPage />} />
      <Route path="/combo/venus-earth-mars-uranus" element={<VenusEarthMarsUranusPage />} />
      <Route path="/combo/venus-earth-mars-neptune" element={<VenusEarthMarsNeptunePage />} />
      <Route path="/combo/venus-earth-jupiter-saturn" element={<VenusEarthJupiterSaturnPage />} />
      <Route path="/combo/venus-earth-jupiter-uranus" element={<VenusEarthJupiterUranusPage />} />
      <Route path="/combo/venus-earth-jupiter-neptune" element={<VenusEarthJupiterNeptunePage />} />
      <Route path="/combo/venus-earth-saturn-uranus" element={<VenusEarthSaturnUranusPage />} />
      <Route path="/combo/venus-earth-saturn-neptune" element={<VenusEarthSaturnNeptunePage />} />
      <Route path="/combo/venus-earth-uranus-neptune" element={<VenusEarthUranusNeptunePage />} />
      <Route path="/combo/venus-mars-jupiter-saturn" element={<VenusMarsJupiterSaturnPage />} />
      <Route path="/combo/venus-mars-jupiter-uranus" element={<VenusMarsJupiterUranusPage />} />
      <Route path="/combo/venus-mars-jupiter-neptune" element={<VenusMarsJupiterNeptunePage />} />
      <Route path="/combo/venus-mars-saturn-uranus" element={<VenusMarsSaturnUranusPage />} />
      <Route path="/combo/venus-mars-saturn-neptune" element={<VenusMarsSaturnNeptunePage />} />
      <Route path="/combo/venus-mars-uranus-neptune" element={<VenusMarsUranusNeptunePage />} />
      <Route path="/combo/venus-jupiter-saturn-uranus" element={<VenusJupiterSaturnUranusPage />} />
      <Route path="/combo/venus-jupiter-saturn-neptune" element={<VenusJupiterSaturnNeptunePage />} />
      <Route path="/combo/venus-jupiter-uranus-neptune" element={<VenusJupiterUranusNeptunePage />} />
      <Route path="/combo/venus-saturn-uranus-neptune" element={<VenusSaturnUranusNeptunePage />} />
      <Route path="/combo/earth-mars-jupiter-uranus" element={<EarthMarsJupiterUranusPage />} />
      <Route path="/combo/earth-mars-jupiter-neptune" element={<EarthMarsJupiterNeptunePage />} />
      <Route path="/combo/earth-mars-saturn-uranus" element={<EarthMarsSaturnUranusPage />} />
      <Route path="/combo/earth-mars-saturn-neptune" element={<EarthMarsSaturnNeptunePage />} />
      <Route path="/combo/earth-mars-uranus-neptune" element={<EarthMarsUranusNeptunePage />} />
      <Route path="/combo/earth-jupiter-saturn-uranus" element={<EarthJupiterSaturnUranusPage />} />
      <Route path="/combo/earth-jupiter-saturn-neptune" element={<EarthJupiterSaturnNeptunePage />} />
      <Route path="/combo/earth-jupiter-uranus-neptune" element={<EarthJupiterUranusNeptunePage />} />
      <Route path="/combo/earth-saturn-uranus-neptune" element={<EarthSaturnUranusNeptunePage />} />
      <Route path="/combo/mars-jupiter-saturn-uranus" element={<MarsJupiterSaturnUranusPage />} />
      <Route path="/combo/mars-jupiter-saturn-neptune" element={<MarsJupiterSaturnNeptunePage />} />
      <Route path="/combo/mars-jupiter-uranus-neptune" element={<MarsJupiterUranusNeptunePage />} />
      <Route path="/combo/mars-saturn-uranus-neptune" element={<MarsSaturnUranusNeptunePage />} />
      <Route path="/combo/jupiter-saturn-uranus-neptune" element={<JupiterSaturnUranusNeptunePage />} />
      <Route path="/combo/mercury-venus-earth-mars-saturn" element={<MercuryVenusEarthMarsSaturnPage />} />
      <Route path="/combo/mercury-venus-earth-mars-uranus" element={<MercuryVenusEarthMarsUranusPage />} />
      <Route path="/combo/mercury-venus-earth-mars-neptune" element={<MercuryVenusEarthMarsNeptunePage />} />
      <Route path="/combo/mercury-venus-earth-jupiter-saturn" element={<MercuryVenusEarthJupiterSaturnPage />} />
      <Route path="/combo/mercury-venus-earth-jupiter-uranus" element={<MercuryVenusEarthJupiterUranusPage />} />
      <Route path="/combo/mercury-venus-earth-jupiter-neptune" element={<MercuryVenusEarthJupiterNeptunePage />} />
      <Route path="/combo/mercury-venus-earth-saturn-uranus" element={<MercuryVenusEarthSaturnUranusPage />} />
      <Route path="/combo/mercury-venus-earth-saturn-neptune" element={<MercuryVenusEarthSaturnNeptunePage />} />
      <Route path="/combo/mercury-venus-earth-uranus-neptune" element={<MercuryVenusEarthUranusNeptunePage />} />
      <Route path="/combo/mercury-venus-mars-jupiter-saturn" element={<MercuryVenusMarsJupiterSaturnPage />} />
      <Route path="/combo/mercury-venus-mars-jupiter-uranus" element={<MercuryVenusMarsJupiterUranusPage />} />
      <Route path="/combo/mercury-venus-mars-jupiter-neptune" element={<MercuryVenusMarsJupiterNeptunePage />} />
      <Route path="/combo/mercury-venus-mars-saturn-uranus" element={<MercuryVenusMarsSaturnUranusPage />} />
      <Route path="/combo/mercury-venus-mars-saturn-neptune" element={<MercuryVenusMarsSaturnNeptunePage />} />
      <Route path="/combo/mercury-venus-mars-uranus-neptune" element={<MercuryVenusMarsUranusNeptunePage />} />
      <Route path="/combo/mercury-venus-jupiter-saturn-uranus" element={<MercuryVenusJupiterSaturnUranusPage />} />
      <Route path="/combo/mercury-venus-jupiter-saturn-neptune" element={<MercuryVenusJupiterSaturnNeptunePage />} />
      <Route path="/combo/mercury-venus-jupiter-uranus-neptune" element={<MercuryVenusJupiterUranusNeptunePage />} />
      <Route path="/combo/mercury-venus-saturn-uranus-neptune" element={<MercuryVenusSaturnUranusNeptunePage />} />
      <Route path="/combo/mercury-earth-mars-jupiter-saturn" element={<MercuryEarthMarsJupiterSaturnPage />} />
      <Route path="/combo/mercury-earth-mars-jupiter-uranus" element={<MercuryEarthMarsJupiterUranusPage />} />
      <Route path="/combo/mercury-earth-mars-jupiter-neptune" element={<MercuryEarthMarsJupiterNeptunePage />} />
      <Route path="/combo/mercury-earth-mars-saturn-uranus" element={<MercuryEarthMarsSaturnUranusPage />} />
      <Route path="/combo/mercury-earth-mars-saturn-neptune" element={<MercuryEarthMarsSaturnNeptunePage />} />
      <Route path="/combo/mercury-earth-mars-uranus-neptune" element={<MercuryEarthMarsUranusNeptunePage />} />
      <Route path="/combo/mercury-earth-jupiter-saturn-uranus" element={<MercuryEarthJupiterSaturnUranusPage />} />
      <Route path="/combo/mercury-earth-jupiter-saturn-neptune" element={<MercuryEarthJupiterSaturnNeptunePage />} />
      <Route path="/combo/mercury-earth-jupiter-uranus-neptune" element={<MercuryEarthJupiterUranusNeptunePage />} />
      <Route path="/combo/mercury-earth-saturn-uranus-neptune" element={<MercuryEarthSaturnUranusNeptunePage />} />
      <Route path="/combo/mercury-mars-jupiter-saturn-uranus" element={<MercuryMarsJupiterSaturnUranusPage />} />
      <Route path="/combo/mercury-mars-jupiter-saturn-neptune" element={<MercuryMarsJupiterSaturnNeptunePage />} />
      <Route path="/combo/mercury-mars-jupiter-uranus-neptune" element={<MercuryMarsJupiterUranusNeptunePage />} />
      <Route path="/combo/mercury-mars-saturn-uranus-neptune" element={<MercuryMarsSaturnUranusNeptunePage />} />
      <Route path="/combo/mercury-jupiter-saturn-uranus-neptune" element={<MercuryJupiterSaturnUranusNeptunePage />} />
      <Route path="/combo/venus-earth-mars-jupiter-saturn" element={<VenusEarthMarsJupiterSaturnPage />} />
      <Route path="/combo/venus-earth-mars-jupiter-uranus" element={<VenusEarthMarsJupiterUranusPage />} />
      <Route path="/combo/venus-earth-mars-jupiter-neptune" element={<VenusEarthMarsJupiterNeptunePage />} />
      <Route path="/combo/venus-earth-mars-saturn-uranus" element={<VenusEarthMarsSaturnUranusPage />} />
      <Route path="/combo/venus-earth-mars-saturn-neptune" element={<VenusEarthMarsSaturnNeptunePage />} />
      <Route path="/combo/venus-earth-mars-uranus-neptune" element={<VenusEarthMarsUranusNeptunePage />} />
      <Route path="/combo/venus-earth-jupiter-saturn-uranus" element={<VenusEarthJupiterSaturnUranusPage />} />
      <Route path="/combo/venus-earth-jupiter-saturn-neptune" element={<VenusEarthJupiterSaturnNeptunePage />} />
      <Route path="/combo/venus-earth-jupiter-uranus-neptune" element={<VenusEarthJupiterUranusNeptunePage />} />
      <Route path="/combo/venus-earth-saturn-uranus-neptune" element={<VenusEarthSaturnUranusNeptunePage />} />
      <Route path="/combo/venus-mars-jupiter-saturn-uranus" element={<VenusMarsJupiterSaturnUranusPage />} />
      <Route path="/combo/venus-mars-jupiter-saturn-neptune" element={<VenusMarsJupiterSaturnNeptunePage />} />
      <Route path="/combo/venus-mars-jupiter-uranus-neptune" element={<VenusMarsJupiterUranusNeptunePage />} />
      <Route path="/combo/venus-mars-saturn-uranus-neptune" element={<VenusMarsSaturnUranusNeptunePage />} />
      <Route path="/combo/venus-jupiter-saturn-uranus-neptune" element={<VenusJupiterSaturnUranusNeptunePage />} />
      <Route path="/combo/earth-mars-jupiter-saturn-uranus" element={<EarthMarsJupiterSaturnUranusPage />} />
      <Route path="/combo/earth-mars-jupiter-saturn-neptune" element={<EarthMarsJupiterSaturnNeptunePage />} />
      <Route path="/combo/earth-mars-jupiter-uranus-neptune" element={<EarthMarsJupiterUranusNeptunePage />} />
      <Route path="/combo/earth-mars-saturn-uranus-neptune" element={<EarthMarsSaturnUranusNeptunePage />} />
      <Route path="/combo/earth-jupiter-saturn-uranus-neptune" element={<EarthJupiterSaturnUranusNeptunePage />} />
      <Route path="/combo/mars-jupiter-saturn-uranus-neptune" element={<MarsJupiterSaturnUranusNeptunePage />} />
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
