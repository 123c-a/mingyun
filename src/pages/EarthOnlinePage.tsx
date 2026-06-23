import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface RegretMarker {
  id: string
  lat: number
  lng: number
  message: string
  emotion: 'sad' | 'regret' | 'miss' | 'lonely' | 'angry' | 'hopeless'
  date: string
  country?: string
}

declare global {
  interface Window {
    TMap?: any
  }
}

const STORAGE_KEY = 'earth-regret-markers-v3'

const emotionConfig = {
  sad: { bg: 'rgba(100, 120, 200, 0.85)', text: '#a0b8e0', icon: '😢', color: '#6478C8', glow: '0 0 30px rgba(100, 120, 200, 0.7)', shadow: '0 8px 32px rgba(100, 120, 200, 0.35)', name: '伤心', description: '内心的伤痛' },
  regret: { bg: 'rgba(180, 100, 120, 0.85)', text: '#e0a0b0', icon: '💔', color: '#B46478', glow: '0 0 30px rgba(180, 100, 120, 0.7)', shadow: '0 8px 32px rgba(180, 100, 120, 0.35)', name: '遗憾', description: '无法挽回的过去' },
  miss: { bg: 'rgba(200, 160, 100, 0.85)', text: '#e0c0a0', icon: '💭', color: '#C8A064', glow: '0 0 30px rgba(200, 160, 100, 0.7)', shadow: '0 8px 32px rgba(200, 160, 100, 0.35)', name: '思念', description: '对远方的牵挂' },
  lonely: { bg: 'rgba(120, 140, 160, 0.85)', text: '#b0c0d0', icon: '🌙', color: '#7890A8', glow: '0 0 30px rgba(120, 140, 160, 0.7)', shadow: '0 8px 32px rgba(120, 140, 160, 0.35)', name: '孤独', description: '独自一人的夜晚' },
  angry: { bg: 'rgba(220, 100, 80, 0.85)', text: '#e0a0a0', icon: '😤', color: '#DC6450', glow: '0 0 30px rgba(220, 100, 80, 0.7)', shadow: '0 8px 32px rgba(220, 100, 80, 0.35)', name: '愤怒', description: '难以平息的怒火' },
  hopeless: { bg: 'rgba(100, 80, 120, 0.85)', text: '#a090b0', icon: '😔', color: '#645078', glow: '0 0 30px rgba(100, 80, 120, 0.7)', shadow: '0 8px 32px rgba(100, 80, 120, 0.35)', name: '绝望', description: '看不到希望的深渊' },
}

const countries = [
  // 亚洲
  { name: '中国', lat: 35.8617, lng: 104.1954, zoom: 4, region: 'asia' },
  { name: '日本', lat: 36.2048, lng: 138.2529, zoom: 6, region: 'asia' },
  { name: '韩国', lat: 35.9078, lng: 127.7669, zoom: 7, region: 'asia' },
  { name: '印度', lat: 20.5937, lng: 78.9629, zoom: 5, region: 'asia' },
  { name: '泰国', lat: 15.8700, lng: 100.9925, zoom: 6, region: 'asia' },
  { name: '越南', lat: 14.0583, lng: 108.2772, zoom: 6, region: 'asia' },
  { name: '新加坡', lat: 1.3521, lng: 103.8198, zoom: 10, region: 'asia' },
  { name: '马来西亚', lat: 4.2105, lng: 101.9758, zoom: 6, region: 'asia' },
  { name: '印度尼西亚', lat: -0.7893, lng: 113.9213, zoom: 5, region: 'asia' },
  { name: '菲律宾', lat: 12.8797, lng: 121.7740, zoom: 6, region: 'asia' },
  { name: '阿联酋', lat: 23.4241, lng: 53.8478, zoom: 7, region: 'asia' },
  { name: '土耳其', lat: 38.9637, lng: 35.2433, zoom: 6, region: 'asia' },
  // 欧洲
  { name: '英国', lat: 55.3781, lng: -3.4360, zoom: 6, region: 'europe' },
  { name: '法国', lat: 46.2276, lng: 2.2137, zoom: 6, region: 'europe' },
  { name: '德国', lat: 51.1657, lng: 10.4515, zoom: 6, region: 'europe' },
  { name: '意大利', lat: 41.8719, lng: 12.5674, zoom: 6, region: 'europe' },
  { name: '西班牙', lat: 40.4637, lng: -3.7492, zoom: 6, region: 'europe' },
  { name: '葡萄牙', lat: 39.3999, lng: -8.2245, zoom: 7, region: 'europe' },
  { name: '荷兰', lat: 52.1326, lng: 5.2913, zoom: 7, region: 'europe' },
  { name: '比利时', lat: 50.5039, lng: 4.4699, zoom: 7, region: 'europe' },
  { name: '瑞士', lat: 46.8182, lng: 8.2275, zoom: 7, region: 'europe' },
  { name: '奥地利', lat: 47.5162, lng: 14.5501, zoom: 7, region: 'europe' },
  { name: '希腊', lat: 39.0742, lng: 21.8243, zoom: 6, region: 'europe' },
  { name: '俄罗斯', lat: 61.5240, lng: 105.3188, zoom: 3, region: 'europe' },
  // 北美洲
  { name: '美国', lat: 37.0902, lng: -95.7129, zoom: 4, region: 'north_america' },
  { name: '加拿大', lat: 56.1304, lng: -106.3468, zoom: 4, region: 'north_america' },
  { name: '墨西哥', lat: 23.6345, lng: -102.5528, zoom: 5, region: 'north_america' },
  { name: '古巴', lat: 21.5218, lng: -77.7812, zoom: 7, region: 'north_america' },
  // 南美洲
  { name: '巴西', lat: -14.2350, lng: -51.9253, zoom: 4, region: 'south_america' },
  { name: '阿根廷', lat: -38.4161, lng: -63.6167, zoom: 5, region: 'south_america' },
  { name: '智利', lat: -35.6751, lng: -71.5430, zoom: 5, region: 'south_america' },
  { name: '秘鲁', lat: -9.1899, lng: -75.0152, zoom: 6, region: 'south_america' },
  // 非洲
  { name: '埃及', lat: 26.8206, lng: 30.8025, zoom: 6, region: 'africa' },
  { name: '南非', lat: -30.5595, lng: 22.9375, zoom: 6, region: 'africa' },
  { name: '摩洛哥', lat: 31.7917, lng: -7.0926, zoom: 6, region: 'africa' },
  { name: '尼日利亚', lat: 9.0820, lng: 8.6753, zoom: 6, region: 'africa' },
  // 大洋洲
  { name: '澳大利亚', lat: -25.2744, lng: 133.7751, zoom: 4, region: 'oceania' },
  { name: '新西兰', lat: -40.9006, lng: 174.8860, zoom: 6, region: 'oceania' },
]

const milestones = [5, 10, 20, 50, 100, 200]

const achievements = [
  { id: 'first', name: '初次标记', icon: '🌱', description: '添加第一个遗憾标记', threshold: 1 },
  { id: 'explorer', name: '探索者', icon: '🗺️', description: '在3个不同国家标记遗憾', threshold: 3 },
  { id: 'emotion_master', name: '情感大师', icon: '🎭', description: '使用所有6种心情类型', threshold: 6 },
  { id: 'heartbreaker', name: '心碎者', icon: '💔', description: '标记10个遗憾', threshold: 10 },
  { id: 'world_traveler', name: '环球旅行者', icon: '🌍', description: '在5个不同国家标记遗憾', threshold: 5 },
  { id: 'storyteller', name: '故事讲述者', icon: '📖', description: '标记20个遗憾', threshold: 20 },
  { id: 'asia_master', name: '亚洲行者', icon: '🏯', description: '在亚洲5个不同国家标记遗憾', threshold: 5 },
  { id: 'europe_master', name: '欧洲漫游者', icon: '🏰', description: '在欧洲5个不同国家标记遗憾', threshold: 5 },
  { id: 'america_master', name: '美洲探险家', icon: '🗽', description: '在美洲3个不同国家标记遗憾', threshold: 3 },
  { id: 'global_citizen', name: '全球公民', icon: '🌏', description: '在所有大洲都标记过遗憾', threshold: 5 },
]

export default function EarthOnlinePage() {
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  const markerLayerRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const [markers, setMarkers] = useState<RegretMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<RegretMarker | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMarker, setNewMarker] = useState<{ lat: number; lng: number; message: string; emotion: keyof typeof emotionConfig }>({ lat: 39.9042, lng: 116.4074, message: '', emotion: 'regret' })
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [mapStyle, setMapStyle] = useState<'normal' | 'satellite'>('normal')
  const [is3D, setIs3D] = useState(false)
  const [filterEmotion, setFilterEmotion] = useState<string | null>(null)
  const [showConnections, setShowConnections] = useState(true)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showCountrySelector, setShowCountrySelector] = useState(false)
  const [celebrateMilestone, setCelebrateMilestone] = useState<number | null>(null)
  const [showHint, setShowHint] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setMarkers(JSON.parse(saved))
      } catch {
        setMarkers([
          { id: '1', lat: 39.9163, lng: 116.3972, message: '错过了那个重要的人', emotion: 'regret', date: '2024-03-15', country: '中国' },
          { id: '2', lat: 31.2400, lng: 121.4900, message: '没能说出口的道歉', emotion: 'sad', date: '2024-05-20', country: '中国' },
          { id: '3', lat: 30.2465, lng: 120.1484, message: '那些年错过的时光', emotion: 'miss', date: '2024-01-01', country: '中国' },
          { id: '4', lat: 37.7749, lng: -122.4194, message: '独自在异乡的夜晚', emotion: 'lonely', date: '2024-07-15', country: '美国' },
          { id: '5', lat: 35.6762, lng: 139.6503, message: '未能实现的梦想', emotion: 'hopeless', date: '2024-09-10', country: '日本' },
        ])
      }
    } else {
      setMarkers([
        { id: '1', lat: 39.9163, lng: 116.3972, message: '错过了那个重要的人', emotion: 'regret', date: '2024-03-15', country: '中国' },
        { id: '2', lat: 31.2400, lng: 120.4900, message: '没能说出口的道歉', emotion: 'sad', date: '2024-05-20', country: '中国' },
        { id: '3', lat: 30.2465, lng: 120.1484, message: '那些年错过的时光', emotion: 'miss', date: '2024-01-01', country: '中国' },
        { id: '4', lat: 37.7749, lng: -122.4194, message: '独自在异乡的夜晚', emotion: 'lonely', date: '2024-07-15', country: '美国' },
        { id: '5', lat: 35.6762, lng: 139.6503, message: '未能实现的梦想', emotion: 'hopeless', date: '2024-09-10', country: '日本' },
      ])
    }
  }, [])

  useEffect(() => {
    if (markers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(markers))
      const milestone = milestones.find(m => m === markers.length)
      if (milestone) {
        setCelebrateMilestone(milestone)
        setTimeout(() => setCelebrateMilestone(null), 3000)
      }
    }
  }, [markers])

  useEffect(() => {
    if (window.TMap) {
      initMap()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
    script.onload = () => { setMapLoaded(true); initMap() }
    script.onerror = () => console.error('Failed to load TMap')
    document.head.appendChild(script)
    const cleanup = () => { document.head.removeChild(script) }
    return cleanup
  }, [])

  useEffect(() => {
    if (markerLayerRef.current && window.TMap) updateMarkers()
  }, [markers, mapStyle, is3D, filterEmotion])

  const createEmotionIcon = (emotion: keyof typeof emotionConfig, size: number = 55): string => {
    const config = emotionConfig[emotion]
    const actualSize = Math.round(size)
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${actualSize}" height="${actualSize}" viewBox="0 0 ${actualSize} ${actualSize}">
        <defs>
          <radialGradient id="${emotion}-grad-${actualSize}" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="${config.color}" stop-opacity="1"/>
            <stop offset="60%" stop-color="${config.color}" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="${config.color}" stop-opacity="0.4"/>
          </radialGradient>
          <filter id="${emotion}-glow-${actualSize}"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="${emotion}-shadow-${actualSize}"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${config.color}" flood-opacity="0.6"/></filter>
        </defs>
        <circle cx="${actualSize/2}" cy="${actualSize/2}" r="${actualSize/2-2}" fill="url(#${emotion}-grad-${actualSize})" filter="url(#${emotion}-shadow-${actualSize})"/>
        <circle cx="${actualSize/2}" cy="${actualSize/2}" r="${actualSize/2-2}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
        <ellipse cx="${actualSize*0.4}" cy="${actualSize*0.35}" rx="${actualSize/6}" ry="${actualSize/8}" fill="rgba(255,255,255,0.9)"/>
        <text x="${actualSize/2}" y="${actualSize/2 + actualSize/5.5}" text-anchor="middle" font-size="${actualSize/2.2}" font-family="sans-serif" filter="url(#${emotion}-glow-${actualSize})">${config.icon}</text>
      </svg>
    `)}`
  }

  const initMap = useCallback(() => {
    if (!window.TMap || !mapRef.current) return
    const styleId = mapStyle === 'satellite' ? 'style2' : 'style1'
    const map = new window.TMap.Map(mapRef.current, {
      center: new window.TMap.LatLng(35.8617, 104.1954),
      zoom: 4,
      pitch: is3D ? 45 : 0,
      rotation: 0,
      mapStyleId: styleId,
    })
    mapInstanceRef.current = map
    createMarkerLayer(map)
    map.on('click', (evt: any) => {
      const latLng = evt.latLng
      setNewMarker({ ...newMarker, lat: latLng.lat, lng: latLng.lng })
      setShowAddModal(true)
    })
    map.on('zoomchange', () => updateMarkers())
  }, [mapStyle, is3D])

  const createMarkerLayer = (map: any) => {
    const markerSize = 55
    const emotionKeys = Object.keys(emotionConfig) as (keyof typeof emotionConfig)[]
    
    const markerLayer = new window.TMap.MultiMarker({
      map,
      geometries: markers.map(marker => ({
        id: marker.id,
        position: new window.TMap.LatLng(marker.lat, marker.lng),
        properties: { marker },
      })),
    })

    emotionKeys.forEach(emotion => {
      markerLayer.setStyles({
        [emotion]: new window.TMap.MarkerStyle({
          width: markerSize,
          height: markerSize,
          anchor: { x: markerSize/2, y: markerSize/2 },
          src: createEmotionIcon(emotion, markerSize),
        }),
      })
    })

    markerLayer.on('click', (evt: any) => {
      const marker = evt.geometry?.properties?.marker
      if (marker) {
        setSelectedMarker(marker)
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(new window.TMap.LatLng(marker.lat, marker.lng))
        }
      }
    })

    markerLayerRef.current = markerLayer
  }

  const updateMarkers = useCallback(() => {
    if (!markerLayerRef.current || !mapInstanceRef.current) return
    const zoom = mapInstanceRef.current.getZoom()
    const markerSize = Math.max(35, Math.min(80, 25 + zoom * 6))
    const filteredMarkers = filterEmotion ? markers.filter(m => m.emotion === filterEmotion) : markers
    const emotionKeys = Object.keys(emotionConfig) as (keyof typeof emotionConfig)[]

    emotionKeys.forEach(emotion => {
      markerLayerRef.current.setStyles({
        [emotion]: new window.TMap.MarkerStyle({
          width: markerSize,
          height: markerSize,
          anchor: { x: markerSize/2, y: markerSize/2 },
          src: createEmotionIcon(emotion, markerSize),
        }),
      })
    })

    markerLayerRef.current.setGeometries(
      filteredMarkers.map(marker => ({
        id: marker.id,
        position: new window.TMap.LatLng(marker.lat, marker.lng),
        properties: { marker },
      }))
    )
  }, [markers, filterEmotion])

  const toggleMapStyle = () => {
    const newStyle = mapStyle === 'normal' ? 'satellite' : 'normal'
    setMapStyle(newStyle)
    if (mapInstanceRef.current) {
      const styleId = newStyle === 'satellite' ? 'style2' : 'style1'
      mapInstanceRef.current.setMapStyleId(styleId)
    }
  }

  const toggle3D = () => {
    const new3D = !is3D
    setIs3D(new3D)
    if (mapInstanceRef.current) mapInstanceRef.current.setPitch(new3D ? 45 : 0)
  }

  const handleAddMarker = () => {
    if (!newMarker.message.trim()) return
    const country = countries.find(c => {
      const latDiff = Math.abs(newMarker.lat - c.lat)
      const lngDiff = Math.abs(newMarker.lng - c.lng)
      return latDiff < 20 && lngDiff < 30
    })
    const marker: RegretMarker = {
      id: Date.now().toString(),
      lat: newMarker.lat, lng: newMarker.lng,
      message: newMarker.message, emotion: newMarker.emotion,
      date: new Date().toISOString().split('T')[0],
      country: country?.name,
    }
    setMarkers([...markers, marker])
    setShowAddModal(false)
    setNewMarker({ lat: 39.9042, lng: 116.4074, message: '', emotion: 'regret' })
  }

  const handleDeleteMarker = (id: string) => {
    setMarkers(markers.filter(m => m.id !== id))
    if (selectedMarker?.id === id) setSelectedMarker(null)
  }

  const flyToCountry = (country: typeof countries[0]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: new window.TMap.LatLng(country.lat, country.lng),
        zoom: country.zoom,
      })
    }
    setShowCountrySelector(false)
    setShowHint(`已切换到 ${country.name}`)
    setTimeout(() => setShowHint(null), 2000)
  }

  const getEmotionStats = () => {
    const stats: Record<string, number> = {}
    markers.forEach(m => { stats[m.emotion] = (stats[m.emotion] || 0) + 1 })
    return stats
  }

  const getCountryStats = () => {
    const stats: Record<string, number> = {}
    markers.forEach(m => {
      const country = m.country || '未知'
      stats[country] = (stats[country] || 0) + 1
    })
    return stats
  }

  const getUnlockedAchievements = () => {
    const unlocked: typeof achievements = []
    const emotionTypes = new Set(markers.map(m => m.emotion)).size
    const countryCount = new Set(markers.map(m => m.country).filter(Boolean)).size
    
    const countriesWithRegion = markers
      .filter(m => m.country)
      .map(m => ({ ...m, region: countries.find(c => c.name === m.country)?.region }))
    
    const regionsUsed = new Set(countriesWithRegion.map(c => c.region).filter(Boolean))
    const asiaCountries = new Set(countriesWithRegion.filter(c => c.region === 'asia').map(c => c.country)).size
    const europeCountries = new Set(countriesWithRegion.filter(c => c.region === 'europe').map(c => c.country)).size
    const americaCountries = new Set(countriesWithRegion.filter(c => c.region === 'north_america' || c.region === 'south_america').map(c => c.country)).size

    achievements.forEach(achievement => {
      if (achievement.id === 'first' && markers.length >= 1) unlocked.push(achievement)
      else if (achievement.id === 'explorer' && countryCount >= 3) unlocked.push(achievement)
      else if (achievement.id === 'emotion_master' && emotionTypes >= 6) unlocked.push(achievement)
      else if (achievement.id === 'heartbreaker' && markers.length >= 10) unlocked.push(achievement)
      else if (achievement.id === 'world_traveler' && countryCount >= 5) unlocked.push(achievement)
      else if (achievement.id === 'storyteller' && markers.length >= 20) unlocked.push(achievement)
      else if (achievement.id === 'asia_master' && asiaCountries >= 5) unlocked.push(achievement)
      else if (achievement.id === 'europe_master' && europeCountries >= 5) unlocked.push(achievement)
      else if (achievement.id === 'america_master' && americaCountries >= 3) unlocked.push(achievement)
      else if (achievement.id === 'global_citizen' && regionsUsed.size >= 5) unlocked.push(achievement)
    })
    return unlocked
  }

  const stats = getEmotionStats()
  const countryStats = getCountryStats()
  const unlockedAchievements = getUnlockedAchievements()
  const filteredMarkers = filterEmotion ? markers.filter(m => m.emotion === filterEmotion) : markers
  const sortedMarkers = [...markers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const countryFlag = (name: string) => {
    const flags: Record<string, string> = {
      // 亚洲
      '中国': '🇨🇳', '日本': '🇯🇵', '韩国': '🇰🇷', '印度': '🇮🇳',
      '泰国': '🇹🇭', '越南': '🇻🇳', '新加坡': '🇸🇬', '马来西亚': '🇲🇾',
      '印度尼西亚': '🇮🇩', '菲律宾': '🇵🇭', '阿联酋': '🇦🇪', '土耳其': '🇹🇷',
      // 欧洲
      '英国': '🇬🇧', '法国': '🇫🇷', '德国': '🇩🇪', '意大利': '🇮🇹',
      '西班牙': '🇪🇸', '葡萄牙': '🇵🇹', '荷兰': '🇳🇱', '比利时': '🇧🇪',
      '瑞士': '🇨🇭', '奥地利': '🇦🇹', '希腊': '🇬🇷', '俄罗斯': '🇷🇺',
      // 北美洲
      '美国': '🇺🇸', '加拿大': '🇨🇦', '墨西哥': '🇲🇽', '古巴': '🇨🇺',
      // 南美洲
      '巴西': '🇧🇷', '阿根廷': '🇦🇷', '智利': '🇨🇱', '秘鲁': '🇵🇪',
      // 非洲
      '埃及': '🇪🇬', '南非': '🇿🇦', '摩洛哥': '🇲🇦', '尼日利亚': '🇳🇬',
      // 大洋洲
      '澳大利亚': '🇦🇺', '新西兰': '🇳🇿',
    }
    return flags[name] || '🌍'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, #1a1a2e 0%, #16213e 30%, #0f0f1a 60%, #0a0a15 100%)', color: '#c0c8d8', fontFamily: 'ui-serif, Georgia, "Songti SC", serif', overflow: 'hidden', position: 'relative' }}>
      {/* Stars Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {Array.from({ length: 180 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
            background: '#fff', borderRadius: '50%', opacity: Math.random() * 0.7 + 0.1,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
            animationDelay: Math.random() * 3 + 's',
          }} />
        ))}
      </div>

      {/* Celebration Effect */}
      {celebrateMilestone && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 200, textAlign: 'center', animation: 'celebratePulse 0.5s ease-out' }}>
          <div style={{ fontSize: 80, marginBottom: 20, animation: 'bounce 1s infinite' }}>🎉</div>
          <div style={{ fontSize: 32, color: '#e0a0b0', letterSpacing: 5, textShadow: '0 0 30px rgba(224, 160, 176, 0.5)' }}>里程碑达成</div>
          <div style={{ fontSize: 48, fontWeight: 300, color: '#d0d8e8', marginTop: 8 }}>{celebrateMilestone} 个遗憾</div>
        </div>
      )}

      {/* Hint */}
      {showHint && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '16px 32px', background: 'rgba(20, 30, 50, 0.95)', borderRadius: 12, border: '1px solid rgba(160, 180, 220, 0.3)', backdropFilter: 'blur(15px)', fontSize: 14, letterSpacing: 2, zIndex: 150, animation: 'fadeInUp 0.4s ease-out' }}>
          {showHint}
        </div>
      )}

      {/* Navigation */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
        <button onClick={() => navigate('/')} style={{ padding: '12px 24px', borderRadius: 999, background: 'rgba(20, 30, 50, 0.85)', border: '1px solid rgba(160, 180, 220, 0.3)', color: '#c0c8d8', cursor: 'pointer', fontSize: 13, letterSpacing: 3, backdropFilter: 'blur(15px)', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' }}>
          ← 返回星图
        </button>
      </div>

      {/* Header */}
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10 }}>
        <div style={{ fontSize: 28, letterSpacing: 10, marginBottom: 8, opacity: 0.95, color: '#d0d8e8', textShadow: '0 0 30px rgba(160, 200, 240, 0.3)', animation: 'fadeInDown 0.8s ease-out' }}>地 球 上 的 遗 憾</div>
        <div style={{ fontSize: 13, letterSpacing: 5, opacity: 0.55, color: '#a0a8b8', animation: 'fadeInDown 0.8s ease-out 0.2s both' }}>在世界的每个角落留下你的故事</div>
      </div>

      {/* Country Selector Button */}
      <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button onClick={() => setShowCountrySelector(!showCountrySelector)} style={{
          padding: '10px 20px', borderRadius: 999, background: 'rgba(20, 30, 50, 0.85)',
          border: '1px solid rgba(160, 180, 220, 0.25)', color: '#c0c8d8', cursor: 'pointer',
          fontSize: 13, letterSpacing: 2, backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          🌍 选择国家
          <span style={{ fontSize: 11, opacity: 0.6 }}>({new Set(markers.map(m => m.country).filter(Boolean)).size}/{countries.length})</span>
        </button>
      </div>

      {/* Country Selector Panel */}
      {showCountrySelector && (
        <div style={{ position: 'absolute', top: 125, left: '50%', transform: 'translateX(-50%)', padding: 20, background: 'rgba(20, 30, 50, 0.95)', borderRadius: 20, border: '1px solid rgba(160, 180, 220, 0.25)', backdropFilter: 'blur(15px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', zIndex: 15, animation: 'fadeInDown 0.3s ease-out', maxHeight: '70vh', overflowY: 'auto', minWidth: 600 }}>
          <div style={{ marginBottom: 16, fontSize: 14, letterSpacing: 2, color: '#d0d8e8', textAlign: 'center' }}>选择目的地国家</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(['asia', 'europe', 'north_america', 'south_america', 'africa', 'oceania'] as const).map(region => {
              const regionCountries = countries.filter(c => c.region === region)
              const regionNames: Record<string, string> = {
                asia: '🌏 亚洲', europe: '🇪🇺 欧洲', north_america: '🗽 北美洲',
                south_america: '🌎 南美洲', africa: '🌍 非洲', oceania: '🌴 大洋洲'
              }
              return (
                <div key={region}>
                  <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 8, letterSpacing: 2 }}>{regionNames[region]}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                    {regionCountries.map(country => (
                      <button key={country.name} onClick={() => flyToCountry(country)} style={{
                        padding: '10px 8px', borderRadius: 8,
                        background: countryStats[country.name] ? 'rgba(180, 100, 120, 0.3)' : 'rgba(100, 120, 140, 0.25)',
                        border: countryStats[country.name] ? '1px solid rgba(180, 100, 120, 0.4)' : '1px solid transparent',
                        color: '#c0c8d8', cursor: 'pointer', fontSize: 11, transition: 'all 0.2s ease',
                      }}>
                        <div style={{ fontSize: 18, marginBottom: 3 }}>{countryFlag(country.name)}</div>
                        <div style={{ fontSize: 9, opacity: 0.7 }}>{country.name}</div>
                        {countryStats[country.name] && (
                          <div style={{ fontSize: 9, color: '#e0a0b0', marginTop: 1 }}>{countryStats[country.name]}个</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats Panel */}
      <div style={{ position: 'absolute', top: 100, right: 20, zIndex: 10, padding: '16px 20px', background: 'rgba(20, 30, 50, 0.8)', borderRadius: 16, border: '1px solid rgba(160, 180, 220, 0.25)', backdropFilter: 'blur(15px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', animation: 'fadeInRight 0.6s ease-out', minWidth: 150 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: 2 }}>已标记遗憾</div>
          <button onClick={() => setShowStats(!showStats)} style={{ background: 'none', border: 'none', color: '#a0a8b8', cursor: 'pointer', fontSize: 14 }}>{showStats ? '▼' : '▲'}</button>
        </div>
        <div style={{ fontSize: 36, fontWeight: 300, color: '#e0a0b0', marginBottom: 12 }}>{markers.length}</div>
        {showStats && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {(Object.keys(emotionConfig) as (keyof typeof emotionConfig)[]).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(100, 100, 120, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{emotionConfig[key].icon}</span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{emotionConfig[key].name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: emotionConfig[key].text }}>{stats[key] || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div style={{ position: 'absolute', top: 100, left: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6, animation: 'fadeInLeft 0.6s ease-out' }}>
        <button onClick={toggleMapStyle} style={{ padding: '8px 12px', borderRadius: 8, background: mapStyle === 'satellite' ? 'rgba(180, 100, 120, 0.85)' : 'rgba(20, 30, 50, 0.85)', border: `1px solid ${mapStyle === 'satellite' ? 'rgba(180, 100, 120, 0.5)' : 'rgba(160, 180, 220, 0.3)'}`, color: '#fff', cursor: 'pointer', fontSize: 11, letterSpacing: 1, backdropFilter: 'blur(15px)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease' }}>
          {mapStyle === 'normal' ? '🛰️ 卫星' : '🗺️ 地图'}
        </button>
        <button onClick={toggle3D} style={{ padding: '8px 12px', borderRadius: 8, background: is3D ? 'rgba(100, 120, 200, 0.85)' : 'rgba(20, 30, 50, 0.85)', border: `1px solid ${is3D ? 'rgba(100, 120, 200, 0.5)' : 'rgba(160, 180, 220, 0.3)'}`, color: '#fff', cursor: 'pointer', fontSize: 11, letterSpacing: 1, backdropFilter: 'blur(15px)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease' }}>
          {is3D ? '📐 3D' : '📐 2D'}
        </button>
        <button onClick={() => setShowConnections(!showConnections)} style={{ padding: '8px 12px', borderRadius: 8, background: showConnections ? 'rgba(100, 180, 140, 0.85)' : 'rgba(20, 30, 50, 0.85)', border: `1px solid ${showConnections ? 'rgba(100, 180, 140, 0.5)' : 'rgba(160, 180, 220, 0.3)'}`, color: '#fff', cursor: 'pointer', fontSize: 11, letterSpacing: 1, backdropFilter: 'blur(15px)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease' }}>
          🔗 连接线
        </button>
        <button onClick={() => setShowTimeline(!showTimeline)} style={{ padding: '8px 12px', borderRadius: 8, background: showTimeline ? 'rgba(200, 160, 100, 0.85)' : 'rgba(20, 30, 50, 0.85)', border: `1px solid ${showTimeline ? 'rgba(200, 160, 100, 0.5)' : 'rgba(160, 180, 220, 0.3)'}`, color: '#fff', cursor: 'pointer', fontSize: 11, letterSpacing: 1, backdropFilter: 'blur(15px)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease' }}>
          📅 时间轴
        </button>
        <button onClick={() => setShowAchievements(!showAchievements)} style={{ padding: '8px 12px', borderRadius: 8, background: showAchievements ? 'rgba(180, 160, 220, 0.85)' : 'rgba(20, 30, 50, 0.85)', border: `1px solid ${showAchievements ? 'rgba(180, 160, 220, 0.5)' : 'rgba(160, 180, 220, 0.3)'}`, color: '#fff', cursor: 'pointer', fontSize: 11, letterSpacing: 1, backdropFilter: 'blur(15px)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease' }}>
          🏆 成就 ({unlockedAchievements.length}/{achievements.length})
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ position: 'absolute', top: 320, right: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6, animation: 'fadeInRight 0.6s ease-out 0.1s both', maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
        <button onClick={() => setFilterEmotion(null)} style={{ padding: '6px 10px', borderRadius: 999, background: filterEmotion === null ? 'rgba(160, 180, 220, 0.85)' : 'rgba(20, 30, 50, 0.7)', border: `1px solid ${filterEmotion === null ? 'rgba(160, 180, 220, 0.5)' : 'rgba(160, 180, 220, 0.2)'}`, color: '#fff', cursor: 'pointer', fontSize: 10, letterSpacing: 1, backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
          全部 ({markers.length})
        </button>
        {(Object.keys(emotionConfig) as (keyof typeof emotionConfig)[]).map(key => (
          <button key={key} onClick={() => setFilterEmotion(filterEmotion === key ? null : key)} style={{ padding: '6px 10px', borderRadius: 999, background: filterEmotion === key ? emotionConfig[key].bg : 'rgba(20, 30, 50, 0.7)', border: `1px solid ${filterEmotion === key ? emotionConfig[key].color : 'rgba(160, 180, 220, 0.2)'}`, color: '#fff', cursor: 'pointer', fontSize: 10, letterSpacing: 1, backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', boxShadow: filterEmotion === key ? emotionConfig[key].shadow : 'none' }}>
            {emotionConfig[key].icon} {stats[key] || 0}
          </button>
        ))}
      </div>

      {/* Achievements Panel */}
      {showAchievements && (
        <div style={{ position: 'absolute', top: 300, left: 20, width: 220, padding: 16, background: 'rgba(20, 30, 50, 0.9)', borderRadius: 16, border: '1px solid rgba(160, 180, 220, 0.25)', backdropFilter: 'blur(15px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', zIndex: 15, animation: 'fadeInLeft 0.3s ease-out' }}>
          <div style={{ fontSize: 14, letterSpacing: 3, marginBottom: 14, color: '#d0d8e8' }}>🏆 成就系统</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {achievements.map(achievement => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id)
              return (
                <div key={achievement.id} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 12, background: isUnlocked ? 'rgba(180, 160, 220, 0.2)' : 'rgba(100, 100, 120, 0.15)', opacity: isUnlocked ? 1 : 0.6 }}>
                  <div style={{ fontSize: 24, filter: isUnlocked ? 'drop-shadow(0 0 8px rgba(180, 160, 220, 0.8))' : 'grayscale(1)' }}>{achievement.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: isUnlocked ? '#d0d8e8' : '#808898', marginBottom: 2 }}>{achievement.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.6 }}>{achievement.description}</div>
                  </div>
                  <div style={{ fontSize: 16, color: isUnlocked ? '#a0c8e8' : '#606878' }}>{isUnlocked ? '✓' : '?'}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Timeline Panel */}
      {showTimeline && !showAchievements && (
        <div style={{ position: 'absolute', top: 300, left: 20, width: 280, maxHeight: '40vh', overflowY: 'auto', padding: 16, background: 'rgba(20, 30, 50, 0.9)', borderRadius: 16, border: '1px solid rgba(160, 180, 220, 0.25)', backdropFilter: 'blur(15px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', zIndex: 15, animation: 'fadeInLeft 0.3s ease-out' }}>
          <div style={{ fontSize: 14, letterSpacing: 3, marginBottom: 14, color: '#d0d8e8' }}>📅 时间轴</div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 10, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, rgba(160, 180, 220, 0.5), rgba(160, 180, 220, 0.1))', borderRadius: 1 }} />
            {sortedMarkers.map((marker, index) => (
              <div key={marker.id} style={{ display: 'flex', gap: 12, marginBottom: 12, padding: 10, background: 'rgba(100, 100, 120, 0.15)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s ease' }} onClick={() => { setSelectedMarker(marker); setShowTimeline(false); if (mapInstanceRef.current) mapInstanceRef.current.panTo(new window.TMap.LatLng(marker.lat, marker.lng)) }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: emotionConfig[marker.emotion].bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{emotionConfig[marker.emotion].icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: emotionConfig[marker.emotion].text, marginBottom: 3 }}>{marker.date} {marker.country && `· ${marker.country}`}</div>
                  <div style={{ fontSize: 12, color: '#d0d8e8', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{marker.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '92%', maxWidth: 950, height: '72vh', zIndex: 5, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(160, 180, 220, 0.2)', boxShadow: '0 16px 64px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(0, 0, 0, 0.3)', animation: 'fadeInUp 0.8s ease-out' }}>
        {!mapLoaded ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20, 30, 50, 0.6)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🌍</div>
              <div style={{ fontSize: 14, opacity: 0.6, letterSpacing: 2 }}>地图加载中...</div>
            </div>
          </div>
        ) : null}
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', background: 'rgba(20, 30, 50, 0.85)', borderRadius: 999, fontSize: 12, opacity: 0.65, letterSpacing: 2, backdropFilter: 'blur(10px)', border: '1px solid rgba(160, 180, 220, 0.2)' }}>
          {mapStyle === 'satellite' ? '🛰️' : '🗺️'} {is3D ? '📐3D' : '📐2D'} · {showConnections ? '🔗' : '○'} · 点击标记查看详情 · 共 {filteredMarkers.length} 个遗憾
        </div>
      </div>

      {/* Selected Marker Detail */}
      {selectedMarker && (
        <div style={{ position: 'absolute', bottom: 35, left: '50%', transform: 'translateX(-50%)', maxWidth: 420, padding: '24px 28px', background: 'rgba(20, 30, 50, 0.95)', borderRadius: 20, border: `1px solid ${emotionConfig[selectedMarker.emotion].bg}`, backdropFilter: 'blur(20px)', zIndex: 20, boxShadow: `${emotionConfig[selectedMarker.emotion].shadow}, 0 0 0 1px ${emotionConfig[selectedMarker.emotion].bg}`, animation: 'slideUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ fontSize: 40, filter: `drop-shadow(${emotionConfig[selectedMarker.emotion].glow})`, animation: 'bounce 2s infinite' }}>{emotionConfig[selectedMarker.emotion].icon}</div>
              <div>
                <div style={{ fontSize: 15, color: emotionConfig[selectedMarker.emotion].text, letterSpacing: 2, marginBottom: 2 }}>
                  {selectedMarker.date} · {emotionConfig[selectedMarker.emotion].name}
                </div>
                <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>
                  {selectedMarker.lat.toFixed(4)}°N, {selectedMarker.lng.toFixed(4)}°E {selectedMarker.country && ` · ${selectedMarker.country}`}
                </div>
              </div>
            </div>
            <button onClick={() => handleDeleteMarker(selectedMarker.id)} style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255, 100, 100, 0.15)', border: '1px solid rgba(255, 100, 100, 0.3)', color: '#ff8080', cursor: 'pointer', fontSize: 12, transition: 'all 0.2s ease' }}>删除</button>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: '#d0d8e8', fontStyle: 'italic', padding: 16, background: 'rgba(100, 100, 120, 0.1)', borderRadius: 12, marginBottom: 14 }}>"{selectedMarker.message}"</div>
          <button onClick={() => setSelectedMarker(null)} style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(160, 180, 220, 0.3)', color: '#c0c8d8', cursor: 'pointer', fontSize: 13, letterSpacing: 2, transition: 'all 0.2s ease' }}>收起</button>
        </div>
      )}

      {/* Add Marker Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ background: 'rgba(20, 30, 50, 0.98)', borderRadius: 24, padding: 28, width: '90%', maxWidth: 420, border: '1px solid rgba(160, 180, 220, 0.25)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)', animation: 'scaleIn 0.4s ease-out' }}>
            <div style={{ fontSize: 18, letterSpacing: 5, marginBottom: 22, textAlign: 'center', color: '#d0d8e8', textShadow: '0 0 20px rgba(160, 200, 240, 0.2)' }}>添加遗憾标记</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 12, textAlign: 'center' }}>📍 {newMarker.lat.toFixed(4)}°N, {newMarker.lng.toFixed(4)}°E</div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, opacity: 0.65, letterSpacing: 2 }}>选择心情</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {(Object.keys(emotionConfig) as (keyof typeof emotionConfig)[]).map((key) => (
                  <button key={key} onClick={() => setNewMarker({ ...newMarker, emotion: key })} style={{ flex: 1, padding: '10px 6px', borderRadius: 10, background: newMarker.emotion === key ? emotionConfig[key].bg : 'rgba(100, 120, 140, 0.25)', border: newMarker.emotion === key ? `1px solid ${emotionConfig[key].bg}` : '1px solid transparent', color: '#fff', cursor: 'pointer', fontSize: 16, transition: 'all 0.3s ease' }} title={emotionConfig[key].description}>
                    {emotionConfig[key].icon}
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, opacity: 0.7, color: emotionConfig[newMarker.emotion].text }}>
                {emotionConfig[newMarker.emotion].name} · {emotionConfig[newMarker.emotion].description}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, opacity: 0.65, letterSpacing: 2 }}>遗憾的内容</label>
              <textarea value={newMarker.message} onChange={(e) => setNewMarker({ ...newMarker, message: e.target.value })} placeholder="写下你无法释怀的事..." style={{ width: '100%', height: 90, padding: '14px', borderRadius: 14, background: 'rgba(10, 20, 30, 0.9)', border: '1px solid rgba(160, 180, 220, 0.2)', color: '#d0d8e8', fontSize: 14, resize: 'none', outline: 'none', transition: 'all 0.2s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'transparent', border: '1px solid rgba(160, 180, 220, 0.3)', color: '#c0c8d8', cursor: 'pointer', fontSize: 14, letterSpacing: 2, transition: 'all 0.2s ease' }}>取消</button>
              <button onClick={handleAddMarker} disabled={!newMarker.message.trim()} style={{ flex: 2, padding: '14px', borderRadius: 14, background: emotionConfig[newMarker.emotion].bg, border: 'none', color: '#fff', cursor: newMarker.message.trim() ? 'pointer' : 'not-allowed', fontSize: 14, letterSpacing: 2, opacity: newMarker.message.trim() ? 1 : 0.5, transition: 'all 0.2s ease', boxShadow: newMarker.message.trim() ? emotionConfig[newMarker.emotion].glow : 'none' }}>标记遗憾</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 12, right: 20, fontSize: 11, opacity: 0.4, letterSpacing: 2, zIndex: 5 }}>
        数据自动保存 · {markers.length} 个故事 · {new Set(markers.map(m => m.country).filter(Boolean)).size} 个国家
      </div>

      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.2); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 0.95; transform: translateX(-50%) translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(30px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes celebratePulse { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
      `}</style>
    </div>
  )
}