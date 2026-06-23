/**
 * 数字人直播剧本
 * 6 步流程 × 3 种人格（玄学家 / 机械客服 / 毒舌损友）
 * 每步包含：主播台词、自动触发动作、推荐特效、观众弹幕
 */

export type PersonalityKey = 'mystic' | 'robot' | 'savage'

export type ScriptStep = {
  id: string
  label: string
  /** 不同人格的台词 */
  lines: Record<PersonalityKey, string[]>
  /** 这一步结束后是否自动触发下一步 */
  autoTrigger?: boolean
  /** 最少停留毫秒（给观众看卡） */
  minDuration: number
  /** 推荐触发的特效 */
  effects: string[]
  /** 观众弹幕（随机抽几条） */
  audience: string[]
}

/** 演示用户数据（直播台默认用，避免用户输入） */
export const DEMO_USER = {
  name: '今日观众',
  birthYear: 1998,
  birthMonth: 3,
  birthDay: 14,
  gender: 'male',
}

/** 6 步剧本：身份 → 底色 → 节点 → 分支 → 总览 → 签文 */
export const LIVE_SCRIPT: ScriptStep[] = [
  // 第 1 步：开场
  {
    id: 'intro',
    label: '开场',
    lines: {
      mystic: [
        '欢迎来到平行宇宙观测站。我是今日的向导——星野。',
        '命运并非一条直线，而是无数分叉的星河。',
        '让我为你推演一次完整的命运旅程。',
      ],
      robot: [
        '您好，欢迎使用平行宇宙观测系统 V2.5。',
        '本次服务编号：2025-0616-LIVE。预计用时 3 分 20 秒。',
        '正在为您加载命运推演引擎，请稍候。',
      ],
      savage: [
        '行了别点了，我知道你是来算命的。',
        '先说清楚——我说什么你别太当真，但也别完全不当真。',
        '坐好，开始了。',
      ],
    },
    minDuration: 4500,
    autoTrigger: true,
    effects: ['welcome'],
    audience: [
      '主播声音好听！', '第一次看直播算命', '前排占座🍿', '什么神仙应用',
    ],
  },

  // 第 2 步：生成命运底色
  {
    id: 'profile',
    label: '命运底色',
    lines: {
      mystic: [
        '让我先窥探你的命运底色……',
        '星河正在汇聚你的能量印记。',
        '看见了——这是你最本真的命运底色。',
      ],
      robot: [
        '步骤 1/5：分析用户命运底色。',
        '正在调用 DeepSeek-V3 命运引擎。',
        '分析完成，以下为您的命运底色报告。',
      ],
      savage: [
        '行，先给你算个底色。',
        '别紧张，这玩意儿就像看星座运势——信则有不信则无。',
        '来，你是——"',
      ],
    },
    minDuration: 5000,
    autoTrigger: true,
    effects: ['meteor'],
    audience: [
      '星河好漂亮✨', '我的底色是什么？', '好期待！', '主播快说',
    ],
  },

  // 第 3 步：扫描人生节点
  {
    id: 'nodes',
    label: '人生节点',
    lines: {
      mystic: [
        '命运底色之上，分布着几个关键的人生节点。',
        '每一个节点，都是一次选择的分叉。',
        '让我为你展开这些节点……',
      ],
      robot: [
        '步骤 2/5：扫描人生关键转折点。',
        '已识别 6 个高权重决策点。',
        '接下来将为您模拟每个节点的分支宇宙。',
      ],
      savage: [
        '好了，底色看完了，接下来是你人生里几个岔路口。',
        '每个人生都有那么两三步，选对了起飞，选错了……也不一定怎样。',
        '来看看你有几个。',
      ],
    },
    minDuration: 5000,
    autoTrigger: true,
    effects: ['aurora'],
    audience: [
      '6 个节点？好详细', '节点 3 我想去看看', '主播带我去',
    ],
  },

  // 第 4 步：生成分支宇宙（选第一个节点）
  {
    id: 'branch',
    label: '分支宇宙',
    lines: {
      mystic: [
        '让我带你进入第一个关键节点。',
        '当两条道路同时展开时，你会看见——',
        '同一个选择，两种截然不同的宇宙。',
      ],
      robot: [
        '步骤 3/5：模拟分支宇宙。',
        '目标节点：节点 #1。',
        '正在推演两种选择所导致的平行宇宙。',
      ],
      savage: [
        '就看第一个吧，别纠结选哪个了。',
        'A 和 B，两条路，你只能走一条。',
        '但在这个应用里——你两条都能看。爽吧。',
      ],
    },
    minDuration: 6000,
    autoTrigger: true,
    effects: ['meteor', 'aurora'],
    audience: [
      'A 看起来稳一点', '我选 B！', 'B 宇宙好刺激', '其实 A 也不错',
    ],
  },

  // 第 5 步：命运总览
  {
    id: 'overview',
    label: '命运总览',
    lines: {
      mystic: [
        '当分支宇宙全部展开，命运的全貌开始显现。',
        '最有可能发生的，是这一条路径。',
        '但请记住——你永远可以改写它。',
      ],
      robot: [
        '步骤 4/5：生成命运总览报告。',
        '综合评估完成，已为您生成雷达图、关键年份与行动建议。',
        '建议您截图保存，系统将于 7 天后自动更新。',
      ],
      savage: [
        '好了，把你这一路的信息汇总一下。',
        '最可能的那条路给你了，行动建议也给你了。',
        '但记住——没人能替你走。',
      ],
    },
    minDuration: 5500,
    autoTrigger: true,
    effects: ['combo'],
    audience: [
      '最可能宇宙好准', '建议 2 我要抄作业', '主播再讲一讲嘛',
    ],
  },

  // 第 6 步：今日签文
  {
    id: 'daily',
    label: '今日签文',
    lines: {
      mystic: [
        '最后——为你抽出一支今日的签。',
        '签诗非预言，而是此时此刻你最需要听见的那句话。',
        '愿这支签陪你度过这一天。',
      ],
      robot: [
        '步骤 5/5：抽取今日签文。',
        '签文已生成，请阅读建议行动。',
        '本次服务到此结束，感谢您使用平行宇宙观测系统。',
      ],
      savage: [
        '行了，最后一步——抽支今天的签。',
        '别期待会中大奖，签文这东西，你心里早就有答案。',
        '但看一眼也无妨。',
      ],
    },
    minDuration: 5000,
    autoTrigger: false,
    effects: ['welcome'],
    audience: [
      '签文好戳中我！', '这就是我今天要听的话', '谢谢主播',
    ],
  },
]

/** 人格显示信息 */
export const PERSONALITY_META: Record<PersonalityKey, {
  name: string
  title: string
  auraColor: string          // 主色（CSS 颜色）
  secondaryColor: string     // 辅助色
  glow: string               // 发光颜色
  symbol: string             // 中心符号
}> = {
  mystic: {
    name: '星野',
    title: '玄学家',
    auraColor: '#a855f7',     // 紫色
    secondaryColor: '#fbbf24', // 琥珀
    glow: 'rgba(168, 85, 247, 0.55)',
    symbol: '✦',
  },
  robot: {
    name: 'Model-K',
    title: '机械客服',
    auraColor: '#38bdf8',      // 青蓝
    secondaryColor: '#94a3b8',  // 灰
    glow: 'rgba(56, 189, 248, 0.55)',
    symbol: '◎',
  },
  savage: {
    name: '阿刺',
    title: '毒舌损友',
    auraColor: '#f43f5e',       // 玫红
    secondaryColor: '#fde68a',  // 暖黄
    glow: 'rgba(244, 63, 94, 0.55)',
    symbol: '✧',
  },
}

/** 观众模拟弹幕池（随机挑） */
export const AUDIENCE_COMMON = [
  '666', '主播厉害', '好准', '呜呜呜被戳中', '第一次看这种直播',
  '我也想测', '这个应用在哪下', '主播声音好听', '等一下我截图',
  '好有感觉', '学到了', '我要分享给朋友', '✨', '🪐', '🌌',
]
