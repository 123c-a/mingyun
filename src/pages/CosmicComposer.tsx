import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCosmicStore, type PlanetId, serializeForAI, syncFromPlanetPages } from '../store/cosmicStore'

// ============================================================
//  宇宙组合炼金师 · Cosmic Composer
//  从多个行星提取碎片，让它们合在一起，
//  告诉你一件你一直知道的事。
// ============================================================

// ---------- 12 个预设配方 ----------
export interface Recipe {
  id: string
  title: string
  subtitle: string
  description: string
  planets: PlanetId[]
}

const RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: '今日情绪定位',
    subtitle: '水星 × 火星',
    description: '把脑子里盘旋的句子，和身体里正在燃烧的情绪放在一起——看看它们在说同一件事吗？',
    planets: ['mercury', 'mars'],
  },
  {
    id: 'r2',
    title: '被照亮的自己',
    subtitle: '木星 × 太阳',
    description: '那些被别人照亮过的时刻，和你愿意相信的愿望——它们之间有一条看不见的线。',
    planets: ['jupiter', 'sun'],
  },
  {
    id: 'r3',
    title: '关系的完整形状',
    subtitle: '金星 × 火星 × 木星',
    description: '温柔的话、燃烧的情绪、被照亮的人——三种关系碎片放在一起，看你如何在关系里活着。',
    planets: ['venus', 'mars', 'jupiter'],
  },
  {
    id: 'r4',
    title: '时间与潜意识',
    subtitle: '土星 × 海王星',
    description: '过去改变过你的节点，和夜里反复出现的梦——它们可能在讲同一个故事。',
    planets: ['saturn', 'neptune'],
  },
  {
    id: 'r5',
    title: '困住我的模式，和我的愿望',
    subtitle: '天王星 × 太阳',
    description: '那个你反复走进的房间，和你真正想走到的地方——看看它们之间隔着什么。',
    planets: ['uranus', 'sun'],
  },
  {
    id: 'r6',
    title: '身体·思绪·情绪',
    subtitle: '地球 × 水星 × 火星',
    description: '从几何拼搭的身体感受、脑子里回旋的句子、到燃烧的情绪——完整地看见自己此刻在哪里。',
    planets: ['earth', 'mercury', 'mars'],
  },
  {
    id: 'r7',
    title: '完整人生地图',
    subtitle: '水星 × 金星 × 木星 × 土星 × 太阳',
    description: '五个维度的碎片合在一起——从每日思绪到人生愿望，画一张你现在的完整地图。',
    planets: ['mercury', 'venus', 'jupiter', 'saturn', 'sun'],
  },
  {
    id: 'r8',
    title: '被压抑的那一半',
    subtitle: '火星 × 天王星 × 海王星',
    description: '愤怒、困住的模式、夜里的梦——三者组合往往能浮现出你白天不愿看见的那部分自己。',
    planets: ['mars', 'uranus', 'neptune'],
  },
  {
    id: 'r9',
    title: '温柔的自我关怀',
    subtitle: '金星 × 太阳',
    description: '写一句温柔的话给自己，和一个愿意相信的愿望——两件事放在一起，就是今天的小仪式。',
    planets: ['venus', 'sun'],
  },
  {
    id: 'r10',
    title: '成长的年轮',
    subtitle: '土星 × 木星 × 天王星',
    description: '从过去的改变节点、被照亮的时刻、到困住的模式——看看你的成长是一条怎样的路。',
    planets: ['saturn', 'jupiter', 'uranus'],
  },
  {
    id: 'r11',
    title: '梦与愿望',
    subtitle: '海王星 × 太阳',
    description: '夜里反复出现的梦，和你愿意相信的愿望——梦是潜意识的愿望，愿望是清醒的梦。',
    planets: ['neptune', 'sun'],
  },
  {
    id: 'r12',
    title: '当下的完整位置',
    subtitle: '地球 × 水星 × 金星 × 火星',
    description: '身体感受、思绪、温柔的话、燃烧的情绪——四个当下维度一起，回答"我现在在哪里"。',
    planets: ['earth', 'mercury', 'venus', 'mars'],
  },
]

// ---------- AI Compose 实现 ----------
// 由于 aiService 没有统一的 compose 入口，这里直接调用 DeepSeek（有 Key 时），
// 或走本地模板回退。保证页面始终可用。

const COMPOSE_SYSTEM = `你是"宇宙组合炼金师"。你的工作是：

1. 阅读从多个"行星"收集到的个人碎片（思绪、情绪、梦、关系节点、愿望等）。
2. 从碎片中找出它们共同指向的一句话——那件这个人一直知道、但还没有对自己说出来的事。
3. 输出结构化结果。

规则：
- 语气温暖、沉稳、不鸡汤、不评判
- 用"你"称呼读者，像一个看见他很久的老朋友
- 用中文、简体
- 不要"你应该"，用"也许"、"我听到"、"你一直知道"

输出 JSON：
{
  "title": "一行 6-12 字的标题——像一句被点亮的话",
  "body": "2-4 句总览式的话——把所有碎片放在一起看，这个人此刻在哪里（60-120 字）",
  "sections": [
    { "heading": "小标题 3-8 字", "text": "该段正文 30-70 字，一个具体的看见" },
    { "heading": "小标题 3-8 字", "text": "该段正文 30-70 字" },
    { "heading": "小标题 3-8 字", "text": "该段正文 30-70 字" }
  ],
  "mantra": "一句 8-15 字的真言——可以被默念的那句话（金色显示）"
}

sections 最少 2 段，最多 4 段。mantra 不要感叹号，不要"加油"类字眼——要像一声呼吸。`

async function callDeepSeekJSON<T>(system: string, user: string, fallback: () => Promise<T>): Promise<T> {
  const key = (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || ''
  if (!key) return await fallback()
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.8,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) throw new Error(`DeepSeek ${res.status}`)
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content || ''
    if (!text) throw new Error('empty')
    let parsed: any = null
    try { parsed = JSON.parse(text) } catch {
      const m = text.match(/\{[\s\S]*\}/)
      if (m) parsed = JSON.parse(m[0])
    }
    if (!parsed) throw new Error('parse failed')
    return parsed as T
  } catch (e) {
    console.warn('[CosmicComposer] API unavailable, using fallback:', e)
    return await fallback()
  }
}

interface ComposeResult {
  title: string
  body: string
  sections: { heading: string; text: string }[]
  mantra: string
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function localFallbackCompose(planetIds: PlanetId[]): ComposeResult {
  const names: Record<PlanetId, string> = {
    mercury: '思绪', venus: '温柔', earth: '身体', mars: '情绪',
    jupiter: '贵人', saturn: '年轮', uranus: '脱壳', neptune: '梦境', sun: '愿望',
  }
  const joined = planetIds.map((p) => names[p]).join('、')
  const seed = planetIds.join('|')

  const titlePool = [
    '你一直都知道这件事',
    '你走得比你以为的更远',
    '你不是一个人在撑着',
    '你值得被温柔对待',
    '你已经做得很好了',
    '你有一个愿望在发芽',
    '你不是你的情绪',
    '你正在慢慢变成自己',
  ]
  const mantraPool = [
    '你一直知道的那件事。',
    '今天允许自己只做一件事。',
    '你值得被温柔对待。',
    '不完美也是可以的。',
    '你已经做得很好了。',
    '慢慢来，不是停下来。',
  ]
  const pickN = <T,>(arr: T[], n: number): T[] => {
    const out: T[] = []
    for (let i = 0; i < n; i++) out.push(arr[(hashString(seed + ':' + i)) % arr.length])
    return out
  }

  const headings = ['在说什么', '在怕什么', '在渴望什么', '可以做什么']
  const bodyTexts = [
    `从${joined}这几个维度一起看，你此刻不是一个混乱的人——你是一个正在认真对待自己生活的人。每个碎片都在说同一句话：你比昨天更靠近自己一点点了。`,
    `把${joined}放在一起看，能看到一个反复出现的主题——你在为某件事犹豫，也在为某件事坚持。这不是内耗，这是你正在重新选择自己。`,
    `你收集的${joined}——它们不是彼此无关的情绪碎片，而是同一个你在不同房间里的样子。把它们合起来看，你会看见自己一直知道的那句话。`,
  ]
  const sectionTextByHeading: Record<string, string[]> = {
    '在说什么': [`你写下的每一句都在告诉我：你正在认真生活——哪怕只有一句，也是值得认真对待的。`],
    '在怕什么': [`你回避的那个方向，不是敌人——它是你还没准备好听见的自己，可以慢一点。`],
    '在渴望什么': [`你那些反复出现的愿望，不是贪心——它们是你身体里知道自己值得被好好对待的部分。`],
    '可以做什么': [`今天不需要解决一切。挑一件最小的事去做——哪怕只是给自己倒一杯温水，也是完整的一天。`],
  }

  const title = titlePool[hashString(seed) % titlePool.length]
  const mantra = mantraPool[hashString(seed + ':m') % mantraPool.length]
  const body = bodyTexts[hashString(seed + ':b') % bodyTexts.length]

  const sectionCount = Math.min(4, Math.max(2, planetIds.length))
  const chosenHeadings = headings.slice(0, sectionCount)
  const sections = chosenHeadings.map((h) => ({
    heading: h,
    text: sectionTextByHeading[h][0],
  }))

  // 让 pickN 被使用，避免 TS unused 警告
  pickN([], 0)

  return { title, body, sections, mantra }
}

async function compose(planetIds: PlanetId[]): Promise<ComposeResult> {
  if (planetIds.length === 0) {
    return {
      title: '请先选择行星',
      body: '从上面选 2-5 颗行星，让它们的碎片合在一起。',
      sections: [{ heading: '提示', text: '可以先去每颗行星留下自己的碎片——哪怕一句话也可以。' }],
      mantra: '从一句话开始。',
    }
  }

  const serialized = serializeForAI(planetIds)
  const hasContent = serialized.trim().length > 20

  const userPrompt = hasContent
    ? `以下是这个人从不同行星收集到的碎片。请把它们合在一起，帮他/她说出那件一直知道的事：\n\n${serialized}\n\n——请给出结构化结果。`
    : `这个人选择了以下几个维度的行星来组合：${planetIds.join('、')}。但这些行星目前还没有具体的个人数据条目。请仍然给出一次温柔的"空白页组合"——帮助他/她看到这些维度合在一起可以带来什么意义，并鼓励他/她去每颗行星写下自己的第一句话。`

  return callDeepSeekJSON<ComposeResult>(COMPOSE_SYSTEM, userPrompt, async () => {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600))
    return localFallbackCompose(planetIds)
  })
}

// ---------- 内联实现：导出长图（900 × 1300） ----------
function exportComposeAsImage(result: ComposeResult) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = 900
  const H = 1300
  const dpr = window.devicePixelRatio || 2
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  ctx.scale(dpr, dpr)

  // 深蓝黑渐变背景
  const bg = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, Math.max(W, H) / 1.1)
  bg.addColorStop(0, '#0f1022')
  bg.addColorStop(1, '#050508')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // 金色粒子装饰
  for (let i = 0; i < 80; i++) {
    const x = (i * 137 + 41) % W
    const y = (i * 79 + 23) % H
    const r = 0.4 + (i % 4) * 0.4
    const a = 0.08 + (i % 5) * 0.06
    ctx.fillStyle = `rgba(255,210,120,${a})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // 顶部细金线
  ctx.strokeStyle = 'rgba(255,210,120,0.35)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(80, 90)
  ctx.lineTo(W - 80, 90)
  ctx.stroke()

  // 小标题
  ctx.fillStyle = 'rgba(255,210,120,0.75)'
  ctx.font = '500 14px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('— 宇宙组合炼金师 —', W / 2, 60)

  // 标题
  ctx.fillStyle = '#ffe8a0'
  ctx.font = '700 34px Georgia, serif'
  ctx.fillText(result.title, W / 2, 140)

  // 标题下的分隔装饰
  ctx.fillStyle = 'rgba(255,210,120,0.4)'
  ctx.font = '12px Georgia, serif'
  ctx.fillText('·   ·   ·', W / 2, 170)

  // body 段落
  ctx.fillStyle = '#c8d0e8'
  ctx.font = '400 18px Georgia, serif'
  ctx.textAlign = 'left'
  const bodyLines = wrapText(ctx, result.body, W - 160, 28)
  let y = 220
  for (const line of bodyLines) {
    ctx.fillText(line, 80, y)
    y += 32
  }
  y += 20

  // sections
  for (const section of result.sections) {
    // heading 金色小标签
    ctx.fillStyle = '#ffe8a0'
    ctx.font = '700 16px Georgia, serif'
    ctx.fillText(`「 ${section.heading} 」`, 80, y + 20)
    y += 36

    // text 段落，左缩进
    ctx.fillStyle = '#b8c0d8'
    ctx.font = '400 16px Georgia, serif'
    const textLines = wrapText(ctx, section.text, W - 200, 26)
    for (const line of textLines) {
      ctx.fillText(line, 110, y + 14)
      y += 28
    }
    y += 18
  }

  // mantra 金色居中放大
  const mantraY = H - 180
  ctx.textAlign = 'center'

  // 装饰横线
  ctx.strokeStyle = 'rgba(255,210,120,0.35)'
  ctx.beginPath()
  ctx.moveTo(W / 2 - 120, mantraY - 30)
  ctx.lineTo(W / 2 - 20, mantraY - 30)
  ctx.moveTo(W / 2 + 20, mantraY - 30)
  ctx.lineTo(W / 2 + 120, mantraY - 30)
  ctx.stroke()

  // mantra 文字带光晕
  ctx.save()
  ctx.shadowColor = 'rgba(255,210,120,0.6)'
  ctx.shadowBlur = 18
  ctx.fillStyle = '#ffe8a0'
  ctx.font = '700 22px Georgia, serif'
  ctx.fillText(result.mantra, W / 2, mantraY)
  ctx.restore()

  // 底部日期
  ctx.fillStyle = 'rgba(200,208,232,0.45)'
  ctx.font = '400 12px Georgia, serif'
  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
  ctx.fillText(dateStr, W / 2, H - 60)

  // 导出
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `cosmic-composer-${Date.now()}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// 辅助：根据给定宽度把一段中文文本折成多行
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const ch of text) {
    const test = current + ch
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current)
      current = ch
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  // 避免未使用变量警告
  void lineHeight
  return lines
}

// ---------- 顶部固定 Canvas 粒子背景 ----------
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // 80 个缓慢漂浮的金色粒子
    type Particle = { x: number; y: number; r: number; phase: number; speed: number; alpha: number; color: string }
    const palette = ['#ffd880', '#fff0c0', '#ffb060', '#ffe8a0']
    const particles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.01,
        alpha: 0.2 + Math.random() * 0.5,
        color: palette[i % palette.length],
      })
    }

    let t = 0
    const render = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)

      // 深蓝黑径向渐变底色
      const bg = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h) / 1.1)
      bg.addColorStop(0, 'rgba(18,20,42,0.95)')
      bg.addColorStop(1, 'rgba(5,5,8,0.95)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // 金色漂浮粒子（sin/cos 漂浮）
      for (const p of particles) {
        p.phase += p.speed
        const dx = Math.sin(p.phase) * 12
        const dy = Math.cos(p.phase * 0.8) * 10
        const x = p.x + dx
        const y = p.y + dy
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.03 + p.phase)

        ctx.save()
        ctx.globalAlpha = p.alpha * twinkle
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

// ---------- 主组件 ----------
export default function CosmicComposer() {
  const navigate = useNavigate()
  const getAllMetas = useCosmicStore((s) => s.getAllMetas)
  const metas = getAllMetas()

  const [selected, setSelected] = useState<Set<PlanetId>>(new Set())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ComposeResult | null>(null)
  const [, forceRender] = useState(0)

  // 进入页面时自动把各行星页面已有内容同步过来
  useEffect(() => {
    syncFromPlanetPages()
  }, [])

  const togglePlanet = (id: PlanetId) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else if (next.size < 5) next.add(id)
    setSelected(next)
  }

  const applyRecipe = (r: Recipe) => {
    setSelected(new Set(r.planets))
  }

  const doCompose = async () => {
    if (selected.size < 2 || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await compose(Array.from(selected))
      setResult(res)
    } catch (e) {
      console.warn(e)
      setResult(localFallbackCompose(Array.from(selected)))
    } finally {
      setLoading(false)
    }
  }

  const regen = () => doCompose()
  const closeResult = () => setResult(null)
  const clearSelected = () => setSelected(new Set())

  return (
    <div style={styles.page}>
      <ParticleBackground />

      <div style={styles.content}>
        {/* ---------- 返回按钮 ---------- */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button onClick={() => navigate('/')} style={styles.ghostBtn}>← 返回</button>
          <div style={{ color: 'rgba(200,208,232,0.5)', fontSize: 13, letterSpacing: 3 }}>
            COSMIC · COMPOSER
          </div>
        </div>

        {/* ---------- 标题区 ---------- */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={styles.title}>宇宙组合炼金师</h1>
          <p style={styles.subtitle}>
            选择 2 到 5 颗行星，让它们的碎片合在一起，
            <br />
            告诉你一件你一直知道的事。
          </p>
        </div>

        {/* ---------- 第一块：行星选择 ---------- */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>第一步 · 选择行星</h2>
            <div style={styles.counter}>
              已选 <span style={{ color: '#ffe8a0', fontWeight: 700 }}>{selected.size}</span> 颗
              <button onClick={clearSelected} style={{ ...styles.ghostBtn, padding: '4px 10px', fontSize: 12, marginLeft: 12 }}>清空</button>
            </div>
          </div>

          <div style={styles.planetGrid}>
            {metas.map((m) => {
              const isSelected = selected.has(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => togglePlanet(m.id)}
                  style={{
                    ...styles.planetCard,
                    ...(isSelected ? styles.planetCardSelected : {}),
                    borderColor: isSelected ? m.color : 'rgba(200,208,232,0.12)',
                    boxShadow: isSelected ? `0 0 24px ${m.color}66, inset 0 0 12px ${m.color}22` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ color: m.color, fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>{m.name}</div>
                      <div style={{ color: 'rgba(200,208,232,0.5)', fontSize: 11, letterSpacing: 3, marginTop: 2 }}>{m.subtitle}</div>
                    </div>
                    {isSelected && <div style={styles.checkMark}>✓</div>}
                  </div>
                  <div style={{ color: 'rgba(200,208,232,0.7)', fontSize: 13, lineHeight: 1.7, minHeight: 44 }}>
                    {m.description}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,210,120,0.65)', letterSpacing: 1 }}>
                    · {m.itemsCount} 条碎片 ·
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ---------- 第二块：预设配方 ---------- */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>或 · 使用配方</h2>
            <span style={{ color: 'rgba(200,208,232,0.45)', fontSize: 12, letterSpacing: 2 }}>12 个预设</span>
          </div>

          <div style={styles.recipesList}>
            {RECIPES.map((r) => {
              const match = r.planets.every((p) => selected.has(p)) && selected.size === r.planets.length
              return (
                <button
                  key={r.id}
                  onClick={() => applyRecipe(r)}
                  style={{
                    ...styles.recipeCard,
                    ...(match ? styles.recipeCardSelected : {}),
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ color: match ? '#ffe8a0' : '#e8ecf8', fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>
                        {r.title}
                      </div>
                      <div style={{ color: 'rgba(255,210,120,0.6)', fontSize: 11, letterSpacing: 3, marginTop: 4 }}>
                        {r.subtitle}
                      </div>
                    </div>
                    {match && <div style={styles.checkMark}>✓</div>}
                  </div>
                  <div style={{ color: 'rgba(200,208,232,0.65)', fontSize: 13, lineHeight: 1.75, marginTop: 10 }}>
                    {r.description}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(200,208,232,0.45)', letterSpacing: 1 }}>
                    涉及：{r.planets.map((p) => {
                      const m = metas.find((x) => x.id === p)
                      return m ? m.name : p
                    }).join(' · ')}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ---------- 第三块：生成按钮 ---------- */}
        <section style={{ ...styles.section, textAlign: 'center' }}>
          <button
            onClick={doCompose}
            disabled={selected.size < 2 || loading}
            style={{
              ...styles.composeBtn,
              ...((selected.size < 2 || loading) ? styles.composeBtnDisabled : {}),
            }}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={styles.spinner} />
                倾听中…
              </span>
            ) : (
              <span>✦ 让它们合在一起 ✦</span>
            )}
          </button>
          <div style={{ color: 'rgba(200,208,232,0.4)', fontSize: 12, letterSpacing: 2, marginTop: 12 }}>
            {selected.size < 2 ? '请选择至少 2 颗行星' : selected.size === 5 ? '最多 5 颗——这个组合已经很好了' : `当前 ${selected.size} 颗，可以继续添加或开始合成`}
          </div>
        </section>

        {/* ---------- 第四块：AI 结果展示 ---------- */}
        {result && (
          <section style={styles.resultSection}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ color: 'rgba(255,210,120,0.7)', fontSize: 12, letterSpacing: 5 }}>
                · 合 · · · 金 · · · 成 ·
              </div>
              <h1 style={{ ...styles.resultTitle, marginTop: 14 }}>{result.title}</h1>
              <div style={{ color: 'rgba(255,210,120,0.5)', fontSize: 11, letterSpacing: 4, marginTop: 14 }}>
                · · ·
              </div>
            </div>

            <div style={styles.resultBody}>
              {result.body.split('\n').filter(Boolean).map((line, i) => (
                <p key={i} style={styles.resultBodyText}>{line}</p>
              ))}
            </div>

            <div style={styles.sectionsList}>
              {result.sections.map((s, i) => (
                <div key={i} style={styles.sectionCard}>
                  <div style={styles.sectionCardHeading}>「 {s.heading} 」</div>
                  <div style={styles.sectionCardText}>{s.text}</div>
                </div>
              ))}
            </div>

            <div style={styles.mantraBox}>
              <div style={{ color: 'rgba(255,210,120,0.35)', fontSize: 11, letterSpacing: 4, marginBottom: 14 }}>— mantra —</div>
              <div style={styles.mantraText}>{result.mantra}</div>
            </div>

            <div style={styles.resultActions}>
              <button onClick={regen} style={styles.actionBtn}>↻ 重新生成</button>
              <button onClick={() => exportComposeAsImage(result)} style={styles.actionBtnPrimary}>✦ 导出长图</button>
              <button onClick={closeResult} style={{ ...styles.actionBtn, color: 'rgba(200,208,232,0.5)' }}>× 关闭</button>
            </div>
          </section>
        )}

        {/* 底部留白 */}
        <div style={{ height: 80 }} />
      </div>
    </div>
  )
}

// ---------- 样式 ----------
const styles: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    color: '#e8ecf8',
    fontFamily: 'Georgia, serif',
    overflowX: 'hidden',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 1080,
    margin: '0 auto',
    padding: '32px 24px 48px',
  },
  title: {
    color: '#ffe8a0',
    fontSize: 46,
    fontWeight: 700,
    letterSpacing: 8,
    margin: '8px 0 18px',
    fontFamily: 'Georgia, serif',
    textShadow: '0 0 24px rgba(255,210,120,0.25)',
  },
  subtitle: {
    color: 'rgba(200,208,232,0.7)',
    fontSize: 15,
    lineHeight: 1.9,
    letterSpacing: 2,
    margin: 0,
  },
  section: {
    marginTop: 48,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,210,120,0.12)',
  },
  sectionTitle: {
    color: '#e8ecf8',
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: 4,
    margin: 0,
  },
  counter: {
    color: 'rgba(200,208,232,0.6)',
    fontSize: 13,
    letterSpacing: 2,
  },
  planetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  planetCard: {
    textAlign: 'left',
    padding: 18,
    background: 'rgba(18,22,38,0.6)',
    border: '1px solid',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(4px)',
    fontFamily: 'Georgia, serif',
    color: '#e8ecf8',
  },
  planetCardSelected: {
    background: 'rgba(255,210,120,0.08)',
  },
  checkMark: {
    color: '#ffe8a0',
    fontSize: 14,
    fontWeight: 700,
    width: 22,
    height: 22,
    borderRadius: 11,
    border: '1px solid rgba(255,210,120,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,210,120,0.1)',
  },
  recipesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  recipeCard: {
    textAlign: 'left',
    padding: 18,
    background: 'rgba(18,22,38,0.55)',
    border: '1px solid rgba(200,208,232,0.08)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: 'Georgia, serif',
    color: '#e8ecf8',
  },
  recipeCardSelected: {
    borderColor: 'rgba(255,210,120,0.55)',
    background: 'rgba(255,210,120,0.08)',
    boxShadow: '0 0 18px rgba(255,210,120,0.15)',
  },
  composeBtn: {
    fontFamily: 'Georgia, serif',
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: 4,
    padding: '16px 48px',
    borderRadius: 999,
    border: '1px solid rgba(255,210,120,0.55)',
    background: 'linear-gradient(135deg, rgba(255,210,120,0.15), rgba(255,180,80,0.05))',
    color: '#ffe8a0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 24px rgba(255,210,120,0.15), inset 0 0 12px rgba(255,210,120,0.08)',
    textShadow: '0 0 8px rgba(255,210,120,0.4)',
  },
  composeBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  spinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    borderRadius: 7,
    border: '2px solid rgba(255,210,120,0.25)',
    borderTopColor: '#ffe8a0',
    animation: 'spin 0.9s linear infinite',
  },
  ghostBtn: {
    fontFamily: 'Georgia, serif',
    background: 'transparent',
    border: '1px solid rgba(200,208,232,0.2)',
    color: 'rgba(200,208,232,0.75)',
    padding: '6px 14px',
    borderRadius: 999,
    fontSize: 13,
    letterSpacing: 2,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  resultSection: {
    marginTop: 56,
    padding: 48,
    background: 'rgba(15,18,36,0.75)',
    border: '1px solid rgba(255,210,120,0.18)',
    borderRadius: 18,
    boxShadow: '0 0 48px rgba(255,210,120,0.06), inset 0 0 32px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(6px)',
  },
  resultTitle: {
    color: '#ffe8a0',
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: 6,
    margin: 0,
    textShadow: '0 0 24px rgba(255,210,120,0.35)',
  },
  resultBody: {
    marginTop: 8,
    padding: '24px 0',
    borderBottom: '1px solid rgba(255,210,120,0.1)',
  },
  resultBodyText: {
    color: '#c8d0e8',
    fontSize: 16,
    lineHeight: 2,
    letterSpacing: 1.5,
    margin: '8px 0',
  },
  sectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginTop: 24,
  },
  sectionCard: {
    padding: '20px 24px',
    background: 'rgba(20,24,44,0.7)',
    border: '1px solid rgba(255,210,120,0.08)',
    borderRadius: 12,
  },
  sectionCardHeading: {
    color: '#ffe8a0',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 3,
    marginBottom: 10,
  },
  sectionCardText: {
    color: 'rgba(200,208,232,0.75)',
    fontSize: 14,
    lineHeight: 1.95,
    letterSpacing: 1,
  },
  mantraBox: {
    textAlign: 'center',
    marginTop: 40,
    padding: '28px 20px',
    borderTop: '1px solid rgba(255,210,120,0.15)',
    borderBottom: '1px solid rgba(255,210,120,0.15)',
  },
  mantraText: {
    color: '#ffe8a0',
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 5,
    textShadow: '0 0 18px rgba(255,210,120,0.45)',
    lineHeight: 1.8,
  },
  resultActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    marginTop: 32,
    flexWrap: 'wrap',
  },
  actionBtn: {
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    letterSpacing: 3,
    padding: '10px 22px',
    borderRadius: 999,
    border: '1px solid rgba(200,208,232,0.25)',
    background: 'transparent',
    color: 'rgba(200,208,232,0.75)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionBtnPrimary: {
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    letterSpacing: 3,
    padding: '10px 22px',
    borderRadius: 999,
    border: '1px solid rgba(255,210,120,0.55)',
    background: 'linear-gradient(135deg, rgba(255,210,120,0.15), rgba(255,180,80,0.05))',
    color: '#ffe8a0',
    cursor: 'pointer',
    boxShadow: '0 0 18px rgba(255,210,120,0.15)',
    transition: 'all 0.2s',
  },
}

// 注入 spinner keyframes（通过 style tag）
if (typeof document !== 'undefined') {
  const id = 'cosmic-composer-spin-keyframes'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }'
    document.head.appendChild(s)
  }
}
