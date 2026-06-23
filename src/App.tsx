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
import EarthOnlinePage from './pages/EarthOnlinePage'
import VoxelWorldPage from './pages/VoxelWorldPage'
import LegoBuilderPage from './pages/LegoBuilderPage'
import HealingBuilderPage from './pages/HealingBuilderPage'
import CosmicComposer from './pages/CosmicComposer'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GalaxyNav />} />
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
      <Route path="/earth-online" element={<EarthOnlinePage />} />
      <Route path="/voxel-world" element={<VoxelWorldPage />} />
      <Route path="/lego-builder" element={<LegoBuilderPage />} />
      <Route path="/healing-builder" element={<HealingBuilderPage />} />
      <Route path="/composer" element={<CosmicComposer />} />
    </Routes>
  )
}
