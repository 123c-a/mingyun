import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your_deepseek_api_key_here'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

// VIDU API配置（使用用户提供的API）
const VIDU_API_KEY = process.env.VIDU_API_KEY || 'your_vidu_api_key_here'
const VIDU_API_URL = 'https://api.fal.run/vidu/q1/text-to-video'

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: '平行宇宙观测站后端运行中' })
})

async function callDeepSeek(prompt: string, temperature = 1.0, maxTokens = 4096): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
      top_p: 0.95,
      frequency_penalty: 0.2,
      response_format: { type: 'text' },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `API请求失败: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

app.post('/api/universes', async (req, res) => {
  const { userInput, fate_profile, life_node } = req.body

  if ((!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) && !life_node) {
    return res.status(400).json({ error: '请输入有效的决定内容' })
  }

  let prompt = ''
  const isNodeMode = life_node && typeof life_node === 'object'

  if (isNodeMode) {
    prompt = `为"${life_node.node_name || '人生节点'}"生成2个平行宇宙JSON数组。

${life_node.node_description || ''}
A选择: ${life_node.choice_a?.label || 'A'} - ${life_node.choice_a?.universe_hint || ''}
B选择: ${life_node.choice_b?.label || 'B'} - ${life_node.choice_b?.universe_hint || ''}

JSON格式（2个）:
[{"universe_name":"A宇宙名（15字内）","probability":50,"description":"选择A后发展（80字内）","emotion_tags":["情绪1","情绪2"],"atmosphere":"氛围（6字内）","fate_symbol":"象征物（6字内）","future_prediction":"百年预言（15字内）"}]

只返回JSON数组。`
  } else {
    prompt = `基于"${userInput}"生成2-4个平行宇宙JSON数组。

JSON格式:
[{"universe_name":"宇宙名（15字内）","probability":数字,"description":"描述（80字内）","emotion_tags":["情绪1"],"atmosphere":"氛围（6字内）"}]

只返回JSON数组。`
  }

  if (fate_profile && fate_profile.personality_tags?.length > 0) {
    prompt = `性格：${fate_profile.personality_tags.join('、')}，` + prompt
  }

  try {
    const content = await callDeepSeek(prompt, 0.85, 1500)
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }

    try {
      const universes = JSON.parse(jsonStr)
      const valid = Array.isArray(universes) ? universes.filter((u: any) => u.universe_name) : []

      if (isNodeMode && valid.length >= 2) {
        res.json({ branch_a: valid[0], branch_b: valid[1] })
      } else {
        res.json({ universes: valid })
      }
    } catch {
      res.status(500).json({ error: 'AI返回的格式无法解析，请重试' })
    }
  } catch (err: any) {
    console.error('请求失败:', err)
    res.status(500).json({ error: err.message || '网络请求失败' })
  }
})

app.post('/api/fate-profile', async (req, res) => {
  const { birthYear, birthMonth, birthDay, birthHour, gender, name } = req.body

  if (!birthYear || !birthMonth || !birthDay) {
    return res.status(400).json({ error: '请提供基本的出生信息' })
  }

  const hourDesc = birthHour ? `${birthHour}时` : '时辰未知'
  const genderDesc = gender === 'male' ? '男' : gender === 'female' ? '女' : '未知'

  const prompt = `生成"命运底色"JSON深度分析。

基本信息：姓名${name || '匿名'}，性别${genderDesc}，生日${birthYear}年${birthMonth}月${birthDay}日。

请深入分析这个人的命运底色，包括以下维度：

JSON格式：
{
  "fate_title": "命运称号（10字内，如'星辰吟游诗人'、'暗流探险家'、'镜像猎手'）",
  "element_profile": "气质底色详细描述（50字内），描述与生俱来的气质特点",
  "soul_essence": "灵魂本质（40字内），指出灵魂最核心的特质",
  "personality_tags": ["词1","词2","词3","词4","词5","词6","词7","词8"]，从温柔/坚定/好奇/理性/浪漫/务实/勇敢/内敛/热情/冷静/敏感/豁达/细腻/果决/神秘/自由/执着/睿智/感性/独立中选8个",
  "decision_bias": "决定倾向（30字内），描述面对选择时的思维模式",
  "inner_drive": "内在驱动力（40字内），描述内心最深处的渴望",
  "hidden_fear": "潜在恐惧（35字内），描述内心最害怕的事情",
  "emotional_pattern": "情感模式（45字内），描述处理情感的方式",
  "keywords": ["主题1","主题2","主题3","主题4"]，从成长/蜕变/关系/事业/自由/稳定/爱/勇气/智慧/创造/探索/回归/突破/守护/平衡/真相/自由/超越/连接选4个",
  "life_theme": "人生主线（60字内），描述整个人生经历的核心脉络",
  "core_challenge": "核心挑战（50字内），描述需要面对的最大课题",
  "core_gift": "核心天赋（50字内），描述与生俱来的优势",
  "growth_roadmap": "成长路线（70字内），描述从迷茫到觉醒的可能路径",
  "lucky_info": {"lucky_color":"幸运色","lucky_number":"幸运数字1-9","lucky_direction":"幸运方位","lucky_time":"幸运时间段"}
}

只返回JSON，确保内容丰富有深度。`

  try {
    const content = await callDeepSeek(prompt, 0.7, 800)
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    try {
      const profile = JSON.parse(jsonStr)
      res.json({ profile })
    } catch {
      res.status(500).json({ error: 'AI返回的格式无法解析，请重试' })
    }
  } catch (err: any) {
    console.error('命运底色分析失败:', err)
    res.status(500).json({ error: err.message || '网络请求失败' })
  }
})

app.post('/api/life-nodes', async (req, res) => {
  const { fate_profile, userInput } = req.body

  let prompt = `为"${fate_profile?.fate_title || '某人'}"生成6个人生关键节点JSON数组（按年龄排序）。

性格：${(fate_profile?.personality_tags || []).join('、') || '未知'}
主题：${fate_profile?.life_theme || '未知'}

JSON数组格式：
[
  {"node_id":1,"node_name":"节点名（10字内）","age_range":"年龄","node_description":"情境（30字内）","choice_a":{"label":"A选择（10字内）","universe_hint":"A结局（20字内）"},"choice_b":{"label":"B选择（10字内）","universe_hint":"B结局（20字内）"},"theme_weight":"重要度1-10"}
]

只返回JSON。`

  try {
    const content = await callDeepSeek(prompt, 0.7, 1200)
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    try {
      const nodes = JSON.parse(jsonStr)
      res.json({ nodes })
    } catch {
      res.status(500).json({ error: 'AI返回的格式无法解析，请重试' })
    }
  } catch (err: any) {
    console.error('人生节点生成失败:', err)
    res.status(500).json({ error: err.message || '网络请求失败' })
  }
})

app.post('/api/fate-overview', async (req, res) => {
  const { universes, fate_profile } = req.body

  if (!universes || !Array.isArray(universes) || universes.length === 0) {
    return res.status(400).json({ error: '请提供宇宙观测记录' })
  }

  const universeDescriptions = universes.map((u: any, i: number) =>
    `${i + 1}. ${u.universe_name || '未知'}: ${(u.description || '').substring(0, 80)}`
  ).join('\n')

  const prompt = `基于以下宇宙轨迹生成命运总览JSON。

宇宙：
${universeDescriptions}

称号：${fate_profile?.fate_title || '未知'}
关键词：${(fate_profile?.personality_tags || []).join('/') || '未知'}

JSON格式：
{
  "most_likely_universe": "主宇宙名+原因（40字内）",
  "radar_scores": {"career_score":0-100,"love_score":0-100,"wealth_score":0-100,"health_score":0-100,"freedom_score":0-100},
  "fate_symbol": {"name":"象征物（8字内）","meaning":"含义（30字内）"},
  "key_years": ["年1","年2","年3"],
  "key_person": "关键人物（25字内）",
  "conclusion": "寄语（60字内）",
  "action_advice": "建议1（20字内）",
  "action_advice_2": "建议2（20字内）",
  "action_advice_3": "建议3（20字内）"
}

只返回JSON。`

  try {
    const content = await callDeepSeek(prompt, 0.7, 1000)
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    try {
      const overview = JSON.parse(jsonStr)
      const advice = [overview.action_advice, overview.action_advice_2, overview.action_advice_3].filter(Boolean)
      overview.action_advice_list = advice.length > 0 ? advice : [overview.action_advice].filter(Boolean)
      res.json({ overview })
    } catch {
      res.status(500).json({ error: 'AI返回的格式无法解析，请重试' })
    }
  } catch (err: any) {
    console.error('命运总览生成失败:', err)
    res.status(500).json({ error: err.message || '网络请求失败' })
  }
})

app.post('/api/daily-card', async (req, res) => {
  const { date, fate_profile } = req.body

  const today = date || new Date().toISOString().slice(0, 10)
  const title = fate_profile?.fate_title || '今日观测者'

  const prompt = `为"${title}"生成今日宇宙签文JSON。

JSON格式：
{
  "daily_fortune": "运势（如'大吉'、'平稳'）",
  "fortune_score": 0-100整数,
  "lucky_color": "幸运色",
  "lucky_number": "1-9数字",
  "lucky_direction": "方位",
  "today_message": "核心启示（40字内）",
  "today_theme": "主题词（6字内）",
  "recommended_action": "宜（20字内）",
  "avoid_action": "忌（20字内）",
  "universe_insight": "平行宇宙启示（30字内）",
  "fortune_poem": "四句诗（每句6-8字）"
}

只返回JSON。`

  try {
    const content = await callDeepSeek(prompt, 0.75, 600)
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    try {
      const card = JSON.parse(jsonStr)
      res.json({ card, date: today })
    } catch {
      res.status(500).json({ error: 'AI返回的格式无法解析，请重试' })
    }
  } catch (err: any) {
    console.error('今日签文生成失败:', err)
    res.status(500).json({ error: err.message || '网络请求失败' })
  }
})

// ==================== VIDU视频生成 API ====================
// VIDU earth-online 专属视频生成（根据场景上下文生成电影感视频）
app.post('/api/vidu/video', async (req, res) => {
  const { prompt, style, aspect_ratio, seed, movement_amplitude, type } = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: '请提供视频生成提示词' })
  }

  let finalPrompt = prompt

  if (type === 'universe') {
    finalPrompt = `A cinematic, ultra-realistic scene depicting ${prompt}. The scene features breathtaking cosmic landscapes with swirling nebulae, distant galaxies, and ethereal light rays. Highly detailed, photorealistic, cinematic lighting, 8K resolution, dramatic composition, sci-fi fantasy style with vibrant colors and deep space atmosphere.`
  } else if (type === 'fate') {
    finalPrompt = `A dramatic cinematic scene showing a pivotal moment in someone's life: ${prompt}. The person is making a critical decision, leading to a destiny-altering outcome. The scene is emotionally charged with symbolic visual elements representing fate and choice. Ultra-realistic, cinematic lighting, emotional atmosphere, symbolic imagery, professional film composition.`
  } else if (type === 'astrology') {
    finalPrompt = `A mystical astrological star chart visualization with ${prompt}. Cosmic energy flows through the celestial map, with glowing stars forming intricate patterns. Ancient Chinese astrology style meets modern visualization, deep space background with ethereal light effects, sacred geometry patterns, mystical and mysterious atmosphere, ultra detailed.`
  }

  try {
    const response = await fetch(VIDU_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VIDU_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        style: style || 'general',
        aspect_ratio: aspect_ratio || '16:9',
        seed: seed || Math.floor(Math.random() * 10000),
        movement_amplitude: movement_amplitude || 'auto',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `VIDU API请求失败: ${response.status}`)
    }

    const data = await response.json()
    res.json({
      status: data.status,
      request_id: data.request_id,
      response_url: data.response_url,
      status_url: data.status_url,
      cancel_url: data.cancel_url,
      queue_position: data.queue_position,
    })
  } catch (err: any) {
    console.error('VIDU视频生成失败:', err)
    res.status(500).json({ error: err.message || '视频生成失败' })
  }
})

app.get('/api/vidu/status', async (req, res) => {
  const { status_url } = req.query

  if (!status_url || typeof status_url !== 'string') {
    return res.status(400).json({ error: '请提供视频状态查询URL' })
  }

  try {
    const response = await fetch(status_url, {
      headers: {
        'Authorization': `Bearer ${VIDU_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`状态查询失败: ${response.status}`)
    }

    const data = await response.json()
    res.json({
      status: data.status,
      video_url: data.video_url,
      error: data.error,
      request_id: data.request_id,
    })
  } catch (err: any) {
    console.error('VIDU状态查询失败:', err)
    res.status(500).json({ error: err.message || '状态查询失败' })
  }
})

// ==================== 地球 Online Vidu 视频生成 ====================
app.post('/api/earth-online/video', async (req, res) => {
  const { userCommand, sceneContext } = req.body

  if (!userCommand || typeof userCommand !== 'string') {
    return res.status(400).json({ error: '请提供有效指令' })
  }

  // 用 DeepSeek 将自然语言指令转换为 Vidu 电影风格提示词
  const sceneDesc = sceneContext
    ? `当前场景已有：${sceneContext.existingObjects?.map((o: any) => o.type).join('、') || '空'}`
    : ''

  const promptForVidu = await callDeepSeek(
    `用户在世界创造应用中说："${userCommand}"

${sceneDesc ? `场景状态：${sceneDesc}` : ''}

请为这段指令生成一个电影级视频描述（英文，50-80词），画面感要强：
- 场景：具体描绘你创造的东西（如"一片古老的森林在金色阳光下苏醒"）
- 光线：具体的光照氛围（cinematic golden hour, ethereal moonlight, dramatic storm）
- 风格：photorealistic, cinematic, dramatic, ultra detailed, 4K film quality
- 运镜：缓慢推进或环绕运镜（slow dolly in, cinematic pan, aerial orbit）
- 情绪：与场景匹配的情绪词（magical, serene, mysterious, epic, ethereal）

只返回英文视频提示词，不要其他内容。`,
    0.85,
    200,
  )

  const viduPrompt = promptForVidu.trim()

  try {
    const response = await fetch(VIDU_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VIDU_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: viduPrompt,
        style: 'general',
        aspect_ratio: '16:9',
        seed: Math.floor(Math.random() * 100000),
        movement_amplitude: 'large',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `VIDU API请求失败: ${response.status}`)
    }

    const data = await response.json()
    res.json({
      status: 'processing',
      request_id: data.request_id,
      status_url: data.status_url,
      vidu_prompt: viduPrompt,
    })
  } catch (err: any) {
    console.error('地球Online视频生成失败:', err)
    res.status(500).json({ error: err.message || '视频生成失败' })
  }
})

app.post('/api/chat', async (req, res) => {
  const { message, fate_profile, history } = req.body

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: '请输入问题' })
  }

  let systemPrompt = `你是"命运导师"，一位洞察命运奥秘的智者。你具备深厚的命理知识，能够帮助用户解读命运、解答人生困惑。

你的风格：
- 神秘而温暖，像一位智者导师
- 回答富有哲理，但不失亲和
- 善于用隐喻和象征来阐释道理
- 偶尔引用命理典籍或宇宙智慧

请用简洁而富有智慧的语言回答用户的问题。`

  if (fate_profile && fate_profile.fate_title) {
    systemPrompt += `\n\n已知用户的命运底色信息：
- 命运称号：${fate_profile.fate_title}
- 气质特点：${fate_profile.element_profile || '未知'}
- 性格关键词：${(fate_profile.personality_tags || []).join('、')}
- 人生主题：${fate_profile.life_theme || '未知'}
- 核心挑战：${fate_profile.core_challenge || '未知'}
- 核心天赋：${fate_profile.core_gift || '未知'}

请根据用户的命运底色，给出个性化的回答。`
  }

  try {
    const messages: any[] = [{ role: 'system', content: systemPrompt }]

    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-6)
      for (const item of recent) {
        if (item.role === 'user' || item.role === 'assistant') {
          messages.push({ role: item.role, content: item.content })
        }
      }
    }
    messages.push({ role: 'user', content: message })

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.85,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '命运导师暂时无法回答，请稍后再试。'

    res.json({ response: reply })
  } catch (err: any) {
    console.error('命运导师对话失败:', err)
    res.status(500).json({ error: err.message || '对话失败' })
  }
})

// ==================== 地球 Online AI 命令解析 ====================
app.post('/api/earth-online/command', async (req, res) => {
  const { userInput, sceneContext } = req.body

  if (!userInput || typeof userInput !== 'string') {
    return res.status(400).json({ error: '请输入有效指令' })
  }

  const existingObjects = sceneContext?.existingObjects || []
  const timeOfDay = sceneContext?.timeOfDay || 'day'
  const skyColor = sceneContext?.skyColor || '#87ceeb'

  const existingSummary = existingObjects.length > 0
    ? `当前场景已有：${existingObjects.map((o: any) => `${o.type}(${o.color})`).join('、')}`
    : '当前场景为空'

  const prompt = `你是"造物主"——地球 Online 的世界创造者。用户说：${userInput}

当前场景状态：
- 时间：${timeOfDay === 'night' ? '夜晚' : timeOfDay === 'dusk' ? '黄昏' : '白天'}
- 天空色：${skyColor}
- ${existingSummary}

你必须精确理解用户意图，返回 JSON 数组（可同时执行多个操作）：
{
  "actions": [
    {
      "type": "spawn | time | sky | describe",
      "objectType": "tree | building | rock | mushroom | flower | crystal | sphere | box（仅spawn时填）",
      "color": "#RRGGBB格式的颜色（如#2d7a2d绿色树，#c8b898米色房子，#70e0ff青色水晶）（仅spawn时填）",
      "scale": 1~2的数字（仅spawn时填）",
      "time": "day | night | dusk（仅time时填）",
      "skyColor": "#RRGGBB（仅sky时填，#87ceeb天蓝 #ff8844黄昏橙 #0a0a28深夜蓝 #ff6a4a红色 #4a8aff蓝色 #6affaa绿色 #a070ff紫色）",
      "message": "你对用户说的话，1-2句，有创意有趣味，融合中文诗词或自然意境（如：'一株青松拔地起，傲立山巅望苍穹'）（所有类型都要填）"
    }
  ]
}

规则：
1. spawn时，objectType从 tree/building/rock/mushroom/flower/crystal/sphere/box 中选最合适的
2. color 要符合该物体的自然颜色：树用绿色系、房子用米/灰/棕色系、水晶用紫/蓝/青/粉色系、花用粉/红/黄色系、石头用灰色系
3. time只改变明暗/星空，不改变skyColor
4. sky只改变天空颜色，不改变时间
5. 多个action可同时执行（如同时spawn多个物体）
6. 如果用户只是闲聊或问问题，type用"describe"，只返回message
7. message要有诗意、有画面感，不要生硬描述

示例：
输入："造一片森林吧" → {"actions":[{"type":"spawn","objectType":"tree","color":"#2d7a2d","scale":1.5,"message":"万千树木从地底苏醒，阳光洒落，林间光影婆娑。"},{"type":"spawn","objectType":"tree","color":"#1a5a1a","scale":2,"message":"又添一株古木，枝叶参天，岁月悠悠。"},{"type":"spawn","objectType":"tree","color":"#3d8a3d","scale":1.2,"message":"再植一排翠柳，碧影摇曳，生机盎然。"}]}
输入："天黑了" → {"actions":[{"type":"time","time":"night","message":"夜色如墨，繁星点点，世界沉入宁静的梦乡。"}]}
输入："我想看紫色的天空" → {"actions":[{"type":"sky","skyColor":"#a070ff","message":"天际染上神秘的紫色，如梦似幻，仿佛置身于童话世界。"}]}
输入："这里好无聊" → {"actions":[{"type":"describe","message":"这方天地，等待你的点化。想创造什么，只需开口。"}]}

只返回JSON，不要其他文字。`

  try {
    const content = await callDeepSeek(prompt, 0.85, 600)
    let jsonStr = content.trim()
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }
    try {
      const result = JSON.parse(jsonStr)
      res.json(result)
    } catch {
      // fallback: 尝试从错误格式中提取
      res.status(500).json({ error: 'AI返回格式无法解析，请重试', raw: content.substring(0, 200) })
    }
  } catch (err: any) {
    console.error('地球Online命令解析失败:', err)
    res.status(500).json({ error: err.message || '命令解析失败' })
  }
})

app.listen(PORT, () => {
  console.log(`✦ 平行宇宙观测站后端已启动 ✦`)
  console.log(`   地址: http://localhost:${PORT}`)
  console.log(`   === 核心宇宙 API ===`)
  console.log(`   POST /api/universes`)
  console.log(`   === 命运节目 API ===`)
  console.log(`   POST /api/fate-profile`)
  console.log(`   POST /api/life-nodes`)
  console.log(`   POST /api/fate-overview`)
  console.log(`   POST /api/daily-card`)
  console.log(`   === VIDU视频生成 API ===`)
  console.log(`   POST /api/vidu/video`)
  console.log(`   GET /api/vidu/status`)
  console.log(`   === 地球 Online AI API ===`)
  console.log(`   POST /api/earth-online/command`)
  console.log(`   POST /api/earth-online/video`)
})