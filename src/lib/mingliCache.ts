import { useState, useEffect } from 'react'
import { analyzeDestiny, DestinyAnalysis } from '../lib/astrologyApi'

const STORAGE_KEY = 'mingli-profile'

export interface MingliProfile {
  year: number
  month: number
  day: number
  hour: number
  destiny: DestinyAnalysis
}

export function useMingliProfile() {
  const [profile, setProfile] = useState<MingliProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setProfile(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const saveProfile = async (year: number, month: number, day: number, hour: number) => {
    setIsLoading(true)
    try {
      const destiny = await analyzeDestiny(year, month, day, hour)
      const newProfile: MingliProfile = { year, month, day, hour, destiny }
      setProfile(newProfile)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile))
      return newProfile
    } finally {
      setIsLoading(false)
    }
  }

  const clearProfile = () => {
    setProfile(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return { profile, isLoading, saveProfile, clearProfile }
}

// 五行颜色映射
export const elementColors: Record<string, string> = {
  '金': '#c8c8d8',
  '木': '#4a883a',
  '水': '#4488cc',
  '火': '#ff4444',
  '土': '#a08060'
}

// 五行元素图标
export const elementEmojis: Record<string, string> = {
  '金': '⚔️',
  '木': '🌲',
  '水': '💧',
  '火': '🔥',
  '土': '🪨'
}

// 生肖对应
export const zodiacAnimals: Record<number, string> = {
  0: '鼠', 1: '牛', 2: '虎', 3: '兔', 4: '龙', 5: '蛇',
  6: '马', 7: '羊', 8: '猴', 9: '鸡', 10: '狗', 11: '猪'
}

export function getZodiac(year: number): string {
  return zodiacAnimals[(year - 4) % 12]
}