// Web Audio API 声音引擎
// 为治愈系页面生成：雨声 / 风声 / 钟声 / 海浪声 / 火焰声 / 低频嗡鸣 / 钢琴声
// 全部用纯代码合成，零音频文件依赖

let audioCtx: AudioContext | null = null
let currentMaster: GainNode | null = null
let currentNodes: AudioNode[] = []
let currentSoundKey: string | null = null
let _volume = 0.35

function ctx(): AudioContext {
  if (!audioCtx) {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext
    audioCtx = new AC()
  }
  if (audioCtx!.state === 'suspended') audioCtx!.resume()
  return audioCtx!
}

function stopAll() {
  for (const n of currentNodes) {
    try { n.disconnect() } catch {}
  }
  if (currentMaster) {
    try {
      const ac = ctx()
      const now = ac.currentTime
      currentMaster.gain.setValueAtTime(currentMaster.gain.value, now)
      currentMaster.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
      setTimeout(() => { try { currentMaster!.disconnect() } catch {} }, 500)
    } catch {
      try { currentMaster.disconnect() } catch {}
    }
  }
  currentNodes = []
  currentMaster = null
  currentSoundKey = null
}

function createMaster(ac: AudioContext): GainNode {
  const g = ac.createGain()
  g.gain.value = 0
  g.connect(ac.destination)
  currentMaster = g
  // 渐入
  const now = ac.currentTime
  g.gain.setValueAtTime(0, now)
  g.gain.exponentialRampToValueAtTime(_volume, now + 1.2)
  return g
}

// ---------- 白噪声 / 粉红噪声 / 棕噪声（1-2 秒 buffer 循环）----------
function makeNoise(ac: AudioContext, type: 'white' | 'pink' | 'brown'): AudioBufferSourceNode {
  const sr = ac.sampleRate
  const len = sr * 2
  const buffer = ac.createBuffer(1, len, sr)
  const data = buffer.getChannelData(0)

  if (type === 'white') {
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  } else if (type === 'pink') {
    // Paul Kellet pink noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }
  } else {
    // brown
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }
  }

  const src = ac.createBufferSource()
  src.buffer = buffer
  src.loop = true
  return src
}

// ---------- 雨声：高通过滤的粉噪声 ----------
function startRain(ac: AudioContext): AudioNode[] {
  const nodes: AudioNode[] = []
  const noise = makeNoise(ac, 'pink')
  const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 800
  const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4000; bp.Q.value = 0.7
  const gain = ac.createGain(); gain.gain.value = 0.35
  noise.connect(hp); hp.connect(bp); bp.connect(gain)
  nodes.push(noise, hp, bp, gain)

  // 偶尔的"大雨点"
  const hitTimer = setInterval(() => {
    if (currentSoundKey !== 'rain') return
    const p = ac.createBiquadFilter(); p.type = 'bandpass'
    p.frequency.value = 1000 + Math.random() * 3000
    p.Q.value = 1 + Math.random() * 3
    const pg = ac.createGain()
    pg.gain.setValueAtTime(0, ac.currentTime)
    pg.gain.linearRampToValueAtTime(0.25 + Math.random() * 0.25, ac.currentTime + 0.02)
    pg.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15)
    const src = makeNoise(ac, 'white')
    src.connect(p); p.connect(pg); pg.connect(gain)
    src.start()
    src.stop(ac.currentTime + 0.2)
  }, 400)
  ;(window as any).__nepTimer = hitTimer

  return nodes
}

// ---------- 风声：低通的棕噪声 + 慢速 LFO 波动 ----------
function startWind(ac: AudioContext): AudioNode[] {
  const noise = makeNoise(ac, 'brown')
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600
  const gain = ac.createGain(); gain.gain.value = 0.5

  // LFO 波动音量
  const lfo = ac.createOscillator(); lfo.frequency.value = 0.15
  const lfoGain = ac.createGain(); lfoGain.gain.value = 0.3
  lfo.connect(lfoGain); lfoGain.connect(gain.gain)

  // LFO 波动频率
  const lfo2 = ac.createOscillator(); lfo2.frequency.value = 0.07
  const lfo2Gain = ac.createGain(); lfo2Gain.gain.value = 200
  lfo2.connect(lfo2Gain); lfo2Gain.connect(lp.frequency)

  noise.connect(lp); lp.connect(gain)
  lfo.start(); lfo2.start()
  return [noise, lp, gain, lfo, lfoGain, lfo2, lfo2Gain]
}

// ---------- 钟声：多个谐音叠加 ----------
function startBell(ac: AudioContext): AudioNode[] {
  // 每隔几秒敲一次钟
  const masterGain = ac.createGain(); masterGain.gain.value = 0.3
  const oscillators: OscillatorNode[] = []

  function strike() {
    if (currentSoundKey !== 'bell') return
    const now = ac.currentTime
    const baseFreq = 220 + Math.random() * 200  // A3-C4 之间
    // 多个谐音（非整数倍，营造金属感）
    const partials = [1, 2, 2.76, 4.5, 5.4, 6.8]
    for (let i = 0; i < partials.length; i++) {
      const o = ac.createOscillator()
      o.type = 'sine'
      o.frequency.value = baseFreq * partials[i]
      const g = ac.createGain()
      const amp = 1 / (i + 1) * 0.15
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(amp, now + 0.01)
      g.gain.exponentialRampToValueAtTime(0.001, now + 2.5 + Math.random() * 2)
      o.connect(g); g.connect(masterGain)
      o.start(now); o.stop(now + 5)
      oscillators.push(o)
    }
  }

  // 首次敲击 + 定时
  strike()
  const timer = setInterval(strike, 4500 + Math.random() * 2500)
  ;(window as any).__nepTimer = timer

  return [masterGain]
}

// ---------- 海浪声：棕噪声 + 音量缓慢起伏 ----------
function startWaves(ac: AudioContext): AudioNode[] {
  const noise = makeNoise(ac, 'brown')
  const bp = ac.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = 900
  const gain = ac.createGain(); gain.gain.value = 0.3

  // 多次叠加正弦 LFO，形成不规则海浪
  const lfo1 = ac.createOscillator(); lfo1.frequency.value = 0.12
  const g1 = ac.createGain(); g1.gain.value = 0.2; lfo1.connect(g1); g1.connect(gain.gain)
  const lfo2 = ac.createOscillator(); lfo2.frequency.value = 0.07
  const g2 = ac.createGain(); g2.gain.value = 0.15; lfo2.connect(g2); g2.connect(gain.gain)
  const lfo3 = ac.createOscillator(); lfo3.frequency.value = 0.21
  const g3 = ac.createGain(); g3.gain.value = 0.1; lfo3.connect(g3); g3.connect(gain.gain)

  noise.connect(bp); bp.connect(gain)
  lfo1.start(); lfo2.start(); lfo3.start()
  return [noise, bp, gain, lfo1, g1, lfo2, g2, lfo3, g3]
}

// ---------- 火焰声：粉噪声 + 中频抖动 ----------
function startFire(ac: AudioContext): AudioNode[] {
  const noise = makeNoise(ac, 'pink')
  const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 1
  const gain = ac.createGain(); gain.gain.value = 0.4

  // 火焰抖动
  const lfo = ac.createOscillator(); lfo.frequency.value = 18
  const lfoGain = ac.createGain(); lfoGain.gain.value = 600
  lfo.connect(lfoGain); lfoGain.connect(bp.frequency)

  const lfo2 = ac.createOscillator(); lfo2.frequency.value = 0.7
  const g2 = ac.createGain(); g2.gain.value = 0.15
  lfo2.connect(g2); g2.connect(gain.gain)

  noise.connect(bp); bp.connect(gain)
  lfo.start(); lfo2.start()

  // 偶尔的"噼啪"爆裂声
  const crackleTimer = setInterval(() => {
    if (currentSoundKey !== 'fire') return
    if (Math.random() > 0.4) return
    const now = ac.currentTime
    const crackle = makeNoise(ac, 'white')
    const cg = ac.createGain()
    cg.gain.setValueAtTime(0, now)
    cg.gain.linearRampToValueAtTime(0.15, now + 0.005)
    cg.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    const cf = ac.createBiquadFilter(); cf.type = 'highpass'; cf.frequency.value = 2000
    crackle.connect(cf); cf.connect(cg); cg.connect(gain)
    crackle.start()
    crackle.stop(now + 0.1)
  }, 300)
  ;(window as any).__nepTimer = crackleTimer

  return [noise, bp, gain, lfo, lfoGain, lfo2, g2]
}

// ---------- 低频嗡鸣：低频 + 缓慢失谐 ----------
function startDrone(ac: AudioContext): AudioNode[] {
  // 三个低频振荡器，微妙失谐，营造深沉感
  const baseFreq = 55
  const gains: GainNode[] = []
  const oscs: OscillatorNode[] = []
  const master = ac.createGain(); master.gain.value = 0.25

  for (let i = 0; i < 3; i++) {
    const o = ac.createOscillator(); o.type = 'sine'
    o.frequency.value = baseFreq * (1 + i * 0.003) * [1, 2, 3.01][i]
    const g = ac.createGain(); g.gain.value = [0.35, 0.2, 0.12][i]
    o.connect(g); g.connect(master)
    oscs.push(o); gains.push(g)
    o.start()

    // 缓慢调制音量
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.05 + i * 0.03
    const lg = ac.createGain(); lg.gain.value = 0.1
    lfo.connect(lg); lg.connect(g.gain)
    lfo.start()
    oscs.push(lfo)
  }

  // 高八度微弱泛音
  const o2 = ac.createOscillator(); o2.type = 'sine'; o2.frequency.value = baseFreq * 8
  const g2 = ac.createGain(); g2.gain.value = 0.03
  o2.connect(g2); g2.connect(master); o2.start()

  return [master, ...oscs, ...gains, o2, g2]
}

// ---------- 钢琴声：随机弹奏的柔和琶音 ----------
function startPiano(ac: AudioContext): AudioNode[] {
  // C 大调 / A 小调五声音阶
  const scale = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25]
  const master = ac.createGain(); master.gain.value = 0.25

  function playNote() {
    if (currentSoundKey !== 'piano') return
    const freq = scale[Math.floor(Math.random() * scale.length)] * [0.5, 1, 2][Math.floor(Math.random() * 3)]
    const now = ac.currentTime
    const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = freq
    const h = ac.createOscillator(); h.type = 'sine'; h.frequency.value = freq * 2
    const q = ac.createOscillator(); q.type = 'sine'; q.frequency.value = freq * 3.01

    const g = ac.createGain(); g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.25, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.8 + Math.random())

    const gh = ac.createGain(); gh.gain.setValueAtTime(0, now)
    gh.gain.linearRampToValueAtTime(0.08, now + 0.01)
    gh.gain.exponentialRampToValueAtTime(0.001, now + 0.8)

    const gq = ac.createGain(); gq.gain.setValueAtTime(0, now)
    gq.gain.linearRampToValueAtTime(0.04, now + 0.01)
    gq.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    o.connect(g); g.connect(master); o.start(now); o.stop(now + 2)
    h.connect(gh); gh.connect(master); h.start(now); h.stop(now + 1)
    q.connect(gq); gq.connect(master); q.start(now); q.stop(now + 0.7)
  }

  playNote()
  const timer = setInterval(playNote, 1500 + Math.random() * 2500)
  ;(window as any).__nepTimer = timer

  return [master]
}

// ---------- 对外 API ----------
const factories: Record<string, (ac: AudioContext) => AudioNode[]> = {
  '雨声': startRain,
  '风声': startWind,
  '钟声': startBell,
  '海浪声': startWaves,
  '火焰声': startFire,
  '低频嗡鸣': startDrone,
  '钢琴声': startPiano,
}

export function playSound(name: string) {
  // 清旧定时器
  if ((window as any).__nepTimer) { clearInterval((window as any).__nepTimer); (window as any).__nepTimer = null }
  stopAll()
  const ac = ctx()
  const master = createMaster(ac)
  const factory = factories[name] || factories['海浪声']
  const generated = factory(ac)
  for (const n of generated) {
    try { n.connect(master) } catch {}
  }
  currentNodes = [master, ...generated]
  currentSoundKey = name
}

export function stopSound() {
  if ((window as any).__nepTimer) { clearInterval((window as any).__nepTimer); (window as any).__nepTimer = null }
  stopAll()
}

export function setVolume(v: number) {
  _volume = Math.max(0, Math.min(1, v))
  if (currentMaster && audioCtx) {
    const now = audioCtx.currentTime
    currentMaster.gain.cancelScheduledValues(now)
    currentMaster.gain.setValueAtTime(currentMaster.gain.value, now)
    currentMaster.gain.linearRampToValueAtTime(_volume, now + 0.3)
  }
}

export function isPlaying(name: string): boolean {
  return currentSoundKey === name
}

export function currentSound(): string | null {
  return currentSoundKey
}
