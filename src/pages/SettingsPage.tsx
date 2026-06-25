import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanetVisual from '../components/PlanetVisual'
import Scene3DBackground from '../components/Scene3DBackground'
import { downloadSaveFile, importSaveData, resetAllData, parseSaveFile, getDataSize } from '../utils/saveService'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dataSize = getDataSize()

  const handleExport = () => {
    downloadSaveFile()
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const saveData = await parseSaveFile(file)
      const success = importSaveData(saveData)
      if (success) {
        setImportMessage({ type: 'success', text: '导入成功！正在刷新页面...' })
        setTimeout(() => location.reload(), 1500)
      } else {
        setImportMessage({ type: 'error', text: '导入失败：存档数据格式不正确' })
      }
    } catch (err) {
      setImportMessage({ type: 'error', text: `导入失败：${err instanceof Error ? err.message : '未知错误'}` })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReset = () => {
    resetAllData()
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-16">
      <Scene3DBackground type="stars" primaryColor="#60a5fa" secondaryColor="#a78bfa" />
      <div className="absolute inset-0 bg-black/30" />
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/80 text-amber-200 rounded-lg border border-amber-500/30 transition-all duration-300 backdrop-blur-sm text-lg z-20"
      >
        ← 返回星盘
      </button>

      <div className="relative z-10 mb-8">
        <PlanetVisual type="uranus" size={140} />
      </div>

      <h1 className="relative z-10 text-4xl font-bold text-amber-100 mb-2 drop-shadow-2xl tracking-wider">
        系统设置
      </h1>
      <p className="relative z-10 text-lg text-amber-200/70 text-center max-w-md mb-10">
        个性化你的宇宙导航系统
      </p>

      <div className="relative z-10 w-full max-w-lg space-y-6 px-4">
        {/* 数据管理 */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
          <h2 className="text-xl text-amber-200 font-semibold mb-2 flex items-center gap-2">
            💾 数据存档
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            当前数据占用：<span className="text-amber-200">{dataSize}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              📤 导出存档
            </button>

            <button
              onClick={handleImportClick}
              className="w-full py-3 px-4 bg-slate-700/60 hover:bg-slate-600/80 text-amber-100 rounded-lg font-medium transition-all duration-300 border border-amber-500/20 flex items-center justify-center gap-2"
            >
              📥 导入存档
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            {importMessage && (
              <div className={`p-3 rounded-lg text-sm text-center ${
                importMessage.type === 'success'
                  ? 'bg-green-900/40 text-green-300 border border-green-500/30'
                  : 'bg-red-900/40 text-red-300 border border-red-500/30'
              }`}>
                {importMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* 危险操作 */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
          <h2 className="text-xl text-red-300 font-semibold mb-2 flex items-center gap-2">
            ⚠️ 危险操作
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            重置将清除所有数据，此操作不可撤销
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 px-4 bg-red-900/40 hover:bg-red-800/60 text-red-200 rounded-lg font-medium transition-all duration-300 border border-red-500/30"
            >
              🗑️ 重置所有数据
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-300 text-sm text-center">
                确定要删除所有数据吗？此操作不可撤销！
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 px-4 bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 rounded-lg font-medium transition-all duration-300"
                >
                  取消
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-all duration-300"
                >
                  确认重置
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 关于 */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
          <h2 className="text-xl text-amber-200 font-semibold mb-3 flex items-center gap-2">
            🌌 关于
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            平行宇宙天文台 — 以宇宙星空为主题的情感记录与成长陪伴空间。
            <br />
            所有数据均保存在你的浏览器本地，保护你的隐私安全。
          </p>
        </div>
      </div>
    </div>
  )
}
