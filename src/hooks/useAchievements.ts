import { useState, useCallback, useEffect } from 'react'
import { achievements, Achievement, AchievementProgress, checkAchievement } from '../data/achievements'

export function useAchievements() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [progress, setProgress] = useState<AchievementProgress>({
    planetsVisited: 0,
    connectionsMade: 0,
    combosCreated: 0,
    entriesRecorded: 0,
    uniqueCombosUsed: [],
  })
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  // 从 localStorage 加载
  useEffect(() => {
    const savedUnlocked = localStorage.getItem('achievements_unlocked')
    const savedProgress = localStorage.getItem('achievements_progress')
    if (savedUnlocked) setUnlockedIds(JSON.parse(savedUnlocked))
    if (savedProgress) setProgress(JSON.parse(savedProgress))
  }, [])

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('achievements_unlocked', JSON.stringify(unlockedIds))
    localStorage.setItem('achievements_progress', JSON.stringify(progress))
  }, [unlockedIds, progress])

  // 检查并解锁成就
  const checkAndUnlock = useCallback(() => {
    const newUnlocks: Achievement[] = []

    achievements.forEach(achievement => {
      if (checkAchievement(achievement, progress, unlockedIds)) {
        newUnlocks.push(achievement)
        setUnlockedIds(prev => [...prev, achievement.id])
      }
    })

    if (newUnlocks.length > 0) {
      setNewAchievement(newUnlocks[0])
    }

    return newUnlocks
  }, [progress, unlockedIds])

  // 记录行星访问
  const recordPlanetVisit = useCallback(() => {
    setProgress(prev => {
      const newProgress = { ...prev, planetsVisited: prev.planetsVisited + 1 }
      setTimeout(() => checkAndUnlock(), 100)
      return newProgress
    })
  }, [checkAndUnlock])

  // 记录连线
  const recordConnection = useCallback(() => {
    setProgress(prev => {
      const newProgress = { ...prev, connectionsMade: prev.connectionsMade + 1 }
      setTimeout(() => checkAndUnlock(), 100)
      return newProgress
    })
  }, [checkAndUnlock])

  // 记录组合使用
  const recordComboUse = useCallback((comboId: string, level: number) => {
    setProgress(prev => {
      const newCombosUsed = prev.uniqueCombosUsed.includes(comboId)
        ? prev.uniqueCombosUsed
        : [...prev.uniqueCombosUsed, comboId]
      const newProgress = {
        ...prev,
        combosCreated: prev.combosCreated + 1,
        uniqueCombosUsed: newCombosUsed,
      }
      setTimeout(() => checkAndUnlock(), 100)
      return newProgress
    })
  }, [checkAndUnlock])

  // 记录内容创建
  const recordEntry = useCallback(() => {
    setProgress(prev => {
      const newProgress = { ...prev, entriesRecorded: prev.entriesRecorded + 1 }
      setTimeout(() => checkAndUnlock(), 100)
      return newProgress
    })
  }, [checkAndUnlock])

  // 清除弹窗
  const clearPopup = useCallback(() => {
    setNewAchievement(null)
  }, [])

  // 检查特殊成就（时间相关）
  const checkSpecialAchievement = useCallback((achievementId: string) => {
    if (!unlockedIds.includes(achievementId)) {
      const achievement = achievements.find(a => a.id === achievementId)
      if (achievement) {
        setUnlockedIds(prev => [...prev, achievementId])
        setNewAchievement(achievement)
      }
    }
  }, [unlockedIds])

  // 检查时间成就
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5) {
      checkSpecialAchievement('night_visitor')
    } else if (hour >= 5 && hour < 7) {
      checkSpecialAchievement('early_bird')
    }
  }, [checkSpecialAchievement])

  return {
    unlockedIds,
    progress,
    newAchievement,
    recordPlanetVisit,
    recordConnection,
    recordComboUse,
    recordEntry,
    clearPopup,
    checkSpecialAchievement,
  }
}