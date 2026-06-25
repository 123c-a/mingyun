const STORAGE_KEYS = [
  // Zustand persist stores
  'agent-storage',
  'task-storage',
  'memory-storage',
  'cosmic-storage',
  'destiny-storage',
  'os-storage',
  'universe-storage',
  'speech-storage',

  // Planet localStorage keys
  'mercury-thoughts',
  'venus-petals',
  'venus-letter-encrypted',
  'mars-emotions',
  'jupiter-people',
  'saturn-rings',
  'uranus-shells',
  'neptune-dreams',
  'sun-wishes',

  // Combo function data
  'habit-star-data',
  'gratitude-garden-data',
  'timeline-events',
  'daily-mirror-records',
  'inner-child-conversations',
]

export type SaveData = {
  version: string
  timestamp: number
  data: Record<string, string | null>
}

export function exportSaveData(): SaveData {
  const data: Record<string, string | null> = {}
  for (const key of STORAGE_KEYS) {
    data[key] = localStorage.getItem(key)
  }
  return {
    version: '1.0',
    timestamp: Date.now(),
    data,
  }
}

export function downloadSaveFile(): void {
  const saveData = exportSaveData()
  const jsonStr = JSON.stringify(saveData, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date()
  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
  a.href = url
  a.download = `parallel-universe-save-${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importSaveData(saveData: SaveData): boolean {
  if (!saveData || !saveData.data || typeof saveData.data !== 'object') {
    return false
  }
  for (const key of STORAGE_KEYS) {
    const value = saveData.data[key]
    if (value === undefined || value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  }
  return true
}

export function resetAllData(): void {
  for (const key of STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
  location.reload()
}

export function parseSaveFile(file: File): Promise<SaveData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text)
        if (data.version && data.data) {
          resolve(data)
        } else {
          reject(new Error('存档文件格式不正确'))
        }
      } catch (err) {
        reject(new Error('存档文件解析失败'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

export function getDataSize(): string {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key) || ''
      total += key.length + value.length
    }
  }
  const kb = total / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }
  return `${(kb / 1024).toFixed(1)} MB`
}
