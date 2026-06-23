/**
 * 网络状态检测与API降级工具
 */

// 检测网络是否可用
export function isOnline(): boolean {
  return navigator.onLine
}

// 检测后端API是否可用
export async function checkApiStatus(baseUrl: string = 'http://localhost:3001'): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    })
    return response.ok
  } catch {
    return false
  }
}

// 带自动降级的API调用封装
export async function apiCallWithFallback<T>(
  endpoint: string,
  data: any,
  fallbackGenerator: () => T,
  baseUrl: string = 'http://localhost:3001'
): Promise<{ data: T; isOffline: boolean }> {
  // 如果明确离线，直接使用mock
  if (!isOnline()) {
    console.log('[离线模式] 使用本地mock数据:', endpoint)
    return { data: fallbackGenerator(), isOffline: true }
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      console.log('[API错误] 状态码:', response.status, '使用mock降级')
      return { data: fallbackGenerator(), isOffline: true }
    }

    const result = await response.json()
    return { data: result, isOffline: false }
  } catch (error) {
    console.log('[网络错误]', error, '使用mock降级')
    return { data: fallbackGenerator(), isOffline: true }
  }
}

// 带重试的API调用
export async function apiCallWithRetry<T>(
  endpoint: string,
  data: any,
  fallbackGenerator: () => T,
  maxRetries: number = 2,
  baseUrl: string = 'http://localhost:3001'
): Promise<{ data: T; isOffline: boolean; retryCount: number }> {
  let retryCount = 0
  
  while (retryCount <= maxRetries) {
    const result = await apiCallWithFallback<T>(endpoint, data, fallbackGenerator, baseUrl)
    
    if (!result.isOffline) {
      return { ...result, retryCount }
    }
    
    retryCount++
    if (retryCount <= maxRetries) {
      console.log(`[重试] 第${retryCount}次尝试...`)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  return { data: fallbackGenerator(), isOffline: true, retryCount }
}