/**
 * Mock数据生成器 - 用于离线降级
 */

import type { Universe, FateProfile, LifeNode, FateOverview, DailyCard } from '../store/universeStore'

// 平行宇宙mock
export function generateMockUniverses(userInput: string): Universe[] {
  const templates = [
    { name: '星辰觉醒宇宙', desc: '在这个宇宙中，你选择了勇敢追寻内心的光芒，人生轨迹因此闪耀夺目。', emotion: ['希望', '勇气'], atmosphere: '璀璨星空' },
    { name: '静谧深渊宇宙', desc: '这是一个充满神秘与沉思的平行世界，在深邃的思考中找到了内心的平静。', emotion: ['平静', '智慧'], atmosphere: '深海幽光' },
    { name: '烈焰重生宇宙', desc: '在这个宇宙中，你经历了激烈的挑战与蜕变，每一次失败都成为重生的燃料。', emotion: ['坚韧', '热情'], atmosphere: '熔岩之心' },
  ]
  
  return templates.map((t, i) => ({
    universe_name: t.name,
    probability: 30 + i * 20,
    description: `${t.desc} 基于「${userInput.slice(0, 20)}」的选择展开。`,
    emotion_tags: t.emotion,
    atmosphere: t.atmosphere,
    fate_symbol: '命运之钥',
    key_character: { name: '时间守护者', role: '掌控时间流动的神秘存在' },
    timeline: [{ year: '第7年', event: '遇到关键导师' }, { year: '第28年', event: '做出改变一生的决定' }, { year: '第50年', event: '成为传奇人物' }],
    future_prediction: '百年后将成为这个宇宙的传奇',
  }))
}

// 命运画像mock
export function generateMockFateProfile(): FateProfile {
  return {
    fate_title: '星辰吟游诗人',
    element_profile: '你的气质如同深邃的星空，神秘而富有吸引力。',
    soul_essence: '追求真理与意义的永恒探索者',
    personality_tags: ['温柔', '坚定', '好奇', '理性', '浪漫', '务实', '勇敢', '内敛'],
    decision_bias: '倾向于深思熟虑后再行动',
    inner_drive: '对未知世界的强烈好奇心',
    hidden_fear: '害怕失去方向',
    emotional_pattern: '情感深沉而内敛',
    keywords: ['成长', '蜕变', '智慧', '探索'],
    life_theme: '在不断的探索与反思中，逐渐找到属于自己的真理之路',
    core_challenge: '如何在追求理想的同时保持内心的平衡',
    core_gift: '拥有洞察本质的能力',
    growth_roadmap: '从迷茫到觉醒，从觉醒到超越',
    lucky_info: { lucky_color: '琥珀金', lucky_number: '7', lucky_direction: '东南', lucky_time: '清晨' },
  }
}

// 人生节点mock
export function generateMockLifeNodes(): LifeNode[] {
  return [
    { node_id: 1, node_name: '学业抉择', age_range: '18-22岁', node_description: '站在人生的第一个重要路口', choice_a: { label: '追求理想', universe_hint: '追梦之路' }, choice_b: { label: '选择稳定', universe_hint: '安稳人生' }, theme_weight: 9 },
    { node_id: 2, node_name: '职业起步', age_range: '23-26岁', node_description: '初入职场的关键决定', choice_a: { label: '创业冒险', universe_hint: '创新之路' }, choice_b: { label: '大企业发展', universe_hint: '稳定发展' }, theme_weight: 8 },
    { node_id: 3, node_name: '情感抉择', age_range: '27-30岁', node_description: '事业与爱情的平衡', choice_a: { label: '全心爱情', universe_hint: '温情人生' }, choice_b: { label: '优先事业', universe_hint: '事业有成' }, theme_weight: 10 },
    { node_id: 4, node_name: '人生转折', age_range: '35-40岁', node_description: '中年危机与重新审视', choice_a: { label: '勇敢转型', universe_hint: '新篇章' }, choice_b: { label: '坚守现状', universe_hint: '深耕细作' }, theme_weight: 7 },
    { node_id: 5, node_name: '传承时刻', age_range: '50-55岁', node_description: '传递经验与智慧', choice_a: { label: '投身教育', universe_hint: '成为导师' }, choice_b: { label: '专注家庭', universe_hint: '天伦之乐' }, theme_weight: 6 },
    { node_id: 6, node_name: '终极选择', age_range: '60岁+', node_description: '回顾一生的选择', choice_a: { label: '无悔回顾', universe_hint: '内心平静' }, choice_b: { label: '渴望重来', universe_hint: '灵魂渴望' }, theme_weight: 5 },
  ]
}

// 命运概览mock
export function generateMockFateOverview(): FateOverview {
  return {
    most_likely_universe: '星辰觉醒宇宙 - 因为你始终保持着对理想的追求',
    radar_scores: { career_score: 75, love_score: 68, wealth_score: 62, health_score: 85, freedom_score: 70 },
    fate_symbol: { name: '星辰之钥', meaning: '开启无限可能性的能力' },
    key_years: ['28岁', '35岁', '42岁'],
    key_person: '一位神秘的导师将在关键时刻出现',
    conclusion: '你的命运如同星辰，虽有起伏但终将闪耀。',
    action_advice: '在28岁时勇敢做出改变',
    action_advice_list: ['在28岁时勇敢做出改变', '珍惜35岁遇到的重要缘分', '42岁时回顾与总结'],
  }
}

// 每日签文mock
export function generateMockDailyCard(): DailyCard {
  return {
    daily_fortune: '大吉',
    fortune_score: 88,
    lucky_color: '琥珀金',
    lucky_number: '7',
    lucky_direction: '东南',
    today_message: '今日宇宙能量充沛，适合做出重要决定',
    today_theme: '觉醒之日',
    recommended_action: '与志同道合者交流',
    avoid_action: '避免冲动决策',
    universe_insight: '平行宇宙中的你今日也做出了关键选择',
    fortune_poem: '星辰指引前路明\n命运之钥在手心\n勇敢迈出第一步\n宇宙为你开天门',
  }
}

// 宇宙详情mock
export function generateMockUniverseDetail(universe: Universe): any {
  return {
    universe_name: universe.universe_name || '神秘宇宙',
    atmosphere_detail: '这个宇宙充满了梦幻般的色彩，空气中弥漫着淡淡的光粒子。',
    key_character: '时间守护者 - 一个神秘的存在，掌管着这个宇宙的时间流动。',
    timeline: '从起源到巅峰经历了三个纪元：混沌纪、觉醒纪、辉煌纪。',
    future_prediction: '百年后，这个宇宙将成为多元宇宙网络的核心节点。',
    key_events: ['第7年：遇到关键导师', '第15年：经历重大挑战', '第28年：做出改变一生的决定', '第35年：收获命运的馈赠', '第50年：成为传奇人物'],
    emotional_impact: '你将体验到从迷茫到觉醒的完整旅程。',
    practical_advice: '保持开放的心态，勇敢接受挑战。',
  }
}

// 命运分析mock
export function generateMockDestinyAnalysis(userInput: string): any {
  return {
    question_analysis: `关于「${userInput.slice(0, 30)}」的问题，折射出你对人生方向的深层思考。`,
    core_tension: '理想与现实之间的永恒拉扯',
    destiny_signal: '镜中镜 - 你的每个选择都会在平行宇宙中产生涟漪效应',
    recommended_path: '建议先从小处着手，逐步积累改变的力量',
    predicted_outcomes: ['选择A：三年内会有重大突破', '选择B：短期内安稳', '选择C：意外之喜', '选择D：需要更多时间思考', '选择E：最稳妥的路径'],
    warning_signs: ['不要被短期利益蒙蔽双眼', '警惕他人的建议是否适合你', '避免在情绪波动时做决定'],
    timing_advice: '最佳时机在接下来的7天内',
  }
}