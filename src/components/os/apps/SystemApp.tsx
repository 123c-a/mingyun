/**
 * SystemApp — 系统设置
 * OS 主题/偏好/关于
 */

import { useOSStore } from '../../../store/osStore'

export default function SystemApp() {
  const theme = useOSStore((s) => s.theme)
  const bgMusicEnabled = useOSStore((s) => s.bgMusicEnabled)
  const setTheme = useOSStore((s) => s.setTheme)
  const toggleBgMusic = useOSStore((s) => s.toggleBgMusic)
  const windows = useOSStore((s) => s.windows)
  const closeAllWindows = useOSStore((s) => s.closeAllWindows)

  return (
    <div className="h-full overflow-y-auto p-5" style={{ background: 'rgba(6,10,24,0.97)' }}>
      <div className="max-w-sm mx-auto space-y-5">

        {/* 主题 */}
        <Section title="外观">
          <OptionRow label="深色模式" desc="宇宙主题，暗色调">
            <Toggle value={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
          </OptionRow>
        </Section>

        {/* 声音 */}
        <Section title="声音">
          <OptionRow label="背景音乐" desc="启用沉浸式宇宙背景音">
            <Toggle value={bgMusicEnabled} onChange={toggleBgMusic} />
          </OptionRow>
          <OptionRow label="语音自动朗读" desc="AI 回复时自动朗读">
            <Toggle value={true} onChange={() => {}} />
          </OptionRow>
        </Section>

        {/* 系统 */}
        <Section title="系统">
          <OptionRow label={`运行中的窗口 (${windows.length})`} desc="关闭所有窗口">
            <button
              onClick={closeAllWindows}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.35)',
                color: '#fca5a5',
              }}
            >
              全部关闭
            </button>
          </OptionRow>
        </Section>

        {/* 关于 */}
        <Section title="关于">
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
          >
            <div className="text-4xl mb-2">🌌</div>
            <div className="text-white font-bold text-lg">Multiverse OS</div>
            <div className="text-slate-400 text-xs mt-1">版本 2.5.0 · 平行宇宙观测站</div>
            <div className="text-slate-600 text-[10px] mt-2">
              探索你的无限可能 · Build with React + TypeScript
            </div>
          </div>

          <div className="mt-3 text-center text-xs text-slate-600">
            <div>Made with 💜 by Multiverse Labs</div>
            <div className="mt-1">© 2025 · 仅供娱乐，请勿当真</div>
          </div>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1"
        style={{ color: '#a855f7' }}
      >
        {title}
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(8,14,28,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}
      >
        {children}
      </div>
    </div>
  )
}

function OptionRow({
  label,
  desc,
  children,
}: {
  label: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 last:border-b-0">
      <div>
        <div className="text-sm text-slate-200">{label}</div>
        <div className="text-[11px] text-slate-500 mt-0.5">{desc}</div>
      </div>
      {children}
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-all"
      style={{
        background: value ? 'rgba(168,85,247,0.6)' : 'rgba(100,116,139,0.4)',
      }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{
          left: value ? '22px' : '2px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}
