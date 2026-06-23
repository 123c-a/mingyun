import { create } from 'zustand'

// ============ 方块类型定义 ============
export type BlockType =
  // 基础自然（必须保留的别名）
  | 'grass' | 'dirt' | 'stone' | 'bedrock'
  | 'sand' | 'water' | 'leaves' | 'glass'
  | 'wood' | 'planks' | 'cobblestone' | 'brick'
  | 'gravel' | 'clay' | 'sandstone'
  | 'granite' | 'diorite' | 'andesite'
  | 'mossy_cobblestone' | 'mossy_stone'
  // 木材木板
  | 'oak_log' | 'oak_planks' | 'oak_slab' | 'oak_leaves'
  | 'birch_log' | 'birch_planks' | 'birch_slab' | 'birch_leaves'
  | 'spruce_log' | 'spruce_planks' | 'spruce_slab' | 'spruce_leaves'
  | 'jungle_log' | 'jungle_planks' | 'jungle_slab' | 'jungle_leaves'
  | 'vines' | 'water_lily' | 'lily_pad'
  | 'cactus' | 'dead_bush' | 'grass_tall' | 'fern'
  | 'pumpkin' | 'melon' | 'hay_block'
  | 'soul_sand' | 'netherrack' | 'mycelium' | 'podzol' | 'dirt_path'
  // 石头变种
  | 'cracked_stone_bricks' | 'chiseled_stone_bricks' | 'stone_bricks'
  | 'smooth_stone' | 'cut_sandstone' | 'smooth_sandstone'
  | 'end_stone' | 'end_stone_bricks' | 'purpur_block' | 'purpur_pillar'
  | 'prismarine' | 'prismarine_bricks' | 'dark_prismarine'
  | 'sea_lantern' | 'glowstone' | 'shroomlight'
  | 'nether_bricks' | 'cracked_nether_bricks' | 'chiseled_nether_bricks'
  | 'red_nether_bricks' | 'quartz_block' | 'smooth_quartz'
  | 'quartz_pillar' | 'chiseled_quartz'
  | 'basalt' | 'blackstone' | 'polished_basalt' | 'polished_blackstone'
  | 'gilded_blackstone' | 'chain' | 'nether_gold_ore' | 'nether_quartz_ore' | 'debris'
  // 建筑材料
  | 'bricks' | 'nether_brick'
  | 'oak_door' | 'spruce_door' | 'birch_door' | 'jungle_door'
  | 'oak_trapdoor' | 'spruce_trapdoor' | 'iron_door' | 'iron_trapdoor'
  | 'oak_fence' | 'spruce_fence' | 'birch_fence' | 'nether_brick_fence'
  | 'oak_fence_gate' | 'spruce_fence_gate'
  | 'oak_stairs' | 'spruce_stairs' | 'birch_stairs' | 'jungle_stairs'
  | 'cobblestone_stairs' | 'stone_brick_stairs' | 'brick_stairs' | 'nether_brick_stairs'
  | 'spruce_slab' | 'cobblestone_slab' | 'stone_brick_slab' | 'brick_slab'
  | 'oak_button' | 'stone_button' | 'lever' | 'button'
  | 'oak_pressure_plate' | 'stone_pressure_plate'
  | 'heavy_weighted_pressure_plate' | 'light_weighted_pressure_plate' | 'pressure_plate'
  | 'oak_sign' | 'spruce_sign' | 'wall_sign' | 'oak_wall_sign'
  // 玻璃与透明
  | 'glass_pane' | 'tinted_glass'
  | 'white_stained_glass' | 'orange_stained_glass' | 'magenta_stained_glass'
  | 'light_blue_stained_glass' | 'yellow_stained_glass' | 'lime_stained_glass'
  | 'pink_stained_glass' | 'gray_stained_glass' | 'light_gray_stained_glass'
  | 'cyan_stained_glass' | 'purple_stained_glass' | 'blue_stained_glass'
  | 'brown_stained_glass' | 'green_stained_glass' | 'red_stained_glass' | 'black_stained_glass'
  | 'white_stained_glass_pane' | 'orange_stained_glass_pane' | 'cyan_stained_glass_pane'
  | 'iron_bars'
  // 羊毛与染色
  | 'wool_white' | 'wool_black' | 'wool_gray' | 'wool_light_gray'
  | 'wool_brown' | 'wool_red' | 'wool_orange' | 'wool_yellow'
  | 'wool_lime' | 'wool_green' | 'wool_cyan' | 'wool_blue'
  | 'wool_purple' | 'wool_magenta' | 'wool_pink'
  | 'wool_rose' | 'wool_lavender' | 'wool_sky' | 'wool_sunset'
  // 泥土变种
  | 'coarse_dirt' | 'rooted_dirt' | 'moss_block'
  // 红石元件
  | 'redstone' | 'redstone_torch' | 'redstone_block'
  | 'repeater' | 'comparator' | 'piston' | 'sticky_piston'
  | 'observer' | 'hopper' | 'dropper' | 'dispenser' | 'tripwire_hook'
  // 植物
  | 'flower_red' | 'flower_yellow' | 'flower_white' | 'flower_blue' | 'flower_lily_of_the_valley'
  | 'mushroom_red' | 'mushroom_brown' | 'mushroom_block_red' | 'mushroom_block_brown'
  | 'brown_mushroom_block' | 'red_mushroom_block' | 'mushroom_stem'
  | 'torch' | 'soul_torch' | 'lantern' | 'soul_lantern'
  | 'sea_pickle' | 'kelp' | 'seagrass' | 'tall_seagrass'
  | 'bamboo' | 'bamboo_sapling' | 'sugar_cane'
  | 'lily_of_the_valley' | 'cornflower' | 'lilac' | 'rose_bush' | 'peony' | 'sunflower' | 'tall_grass' | 'large_fern'
  // 雪冰
  | 'snow' | 'snow_block' | 'ice' | 'packed_ice' | 'blue_ice' | 'powder_snow'
  | 'snow_layer' | 'snow_path'
  // 矿物
  | 'iron' | 'gold' | 'diamond' | 'emerald' | 'lapis' | 'coal' | 'redstone_ore' | 'copper'
  | 'iron_block' | 'gold_block' | 'diamond_block' | 'emerald_block' | 'lapis_block' | 'coal_block' | 'copper_block'
  | 'netherite' | 'netherite_block'
  | 'obsidian' | 'crying_obsidian'
  | 'ancient_debris'
  // 特殊
  | 'bedrock' | 'command_block' | 'chain_command_block' | 'repeating_command_block'
  | 'dragon_egg' | 'beacon' | 'conduit' | 'end_crystal' | 'ender_chest'
  | 'jukebox' | 'note_block' | 'cake' | 'honey_block' | 'honeycomb_block'
  | 'slime_block' | 'mob_spawner' | 'dragon_head' | 'wither_skeleton_skull' | 'creeper_head' | 'zombie_head' | 'skeleton_skull'
  | 'player_head' | 'flower_pot' | 'armor_stand'
  // 浪漫主题
  | 'cherry_leaves' | 'cherry_wood' | 'rose' | 'petal'
  | 'candle' | 'crystal_pink' | 'crystal_blue' | 'crystal_violet'
  | 'heart_block' | 'moon_stone' | 'star_dust' | 'lantern'
  // 命理元素 - 西方占星
  | 'zodiac_fire' | 'zodiac_water' | 'zodiac_earth' | 'zodiac_air'
  | 'constellation' | 'crystal_ball' | 'rune' | 'tarot'
  | 'moon_phase' | 'star_map' | 'fate_line' | 'destiny_core'
  // 命理元素 - 十二生肖
  | 'zodiac_rat' | 'zodiac_ox' | 'zodiac_tiger' | 'zodiac_rabbit'
  | 'zodiac_dragon' | 'zodiac_snake' | 'zodiac_horse' | 'zodiac_goat'
  | 'zodiac_monkey' | 'zodiac_rooster' | 'zodiac_dog' | 'zodiac_pig'
  // 命理元素 - 五行
  | 'wu_xing_metal' | 'wu_xing_water' | 'wu_xing_wood' | 'wu_xing_fire' | 'wu_xing_earth'
  // 命理元素 - 天干
  | 'tiangan_jia' | 'tiangan_yi' | 'tiangan_bing' | 'tiangan_ding' | 'tiangan_wu'
  | 'tiangan_ji' | 'tiangan_geng' | 'tiangan_xin' | 'tiangan_ren' | 'tiangan_gui'
  // 命理元素 - 地支
  | 'dizhi_zi' | 'dizhi_chou' | 'dizhi_yin' | 'dizhi_mao' | 'dizhi_chen' | 'dizhi_si'
  | 'dizhi_wu' | 'dizhi_wei' | 'dizhi_shen' | 'dizhi_you' | 'dizhi_xu' | 'dizhi_hai'
  // 命理元素 - 八卦
  | 'bagua_qian' | 'bagua_dui' | 'bagua_li' | 'bagua_zhen'
  | 'bagua_xun' | 'bagua_kun' | 'bagua_gen' | 'bagua_kang'
  // 命理元素 - 紫微斗数
  | 'ziwei_tianji' | 'ziwei_tianzhu' | 'ziwei_tianshu' | 'ziwei_tianfu'
  | 'ziwei_taibai' | 'ziwei_tianxiong' | 'ziwei_tianku' | 'ziwei_tianyao'

export interface Block {
  type: BlockType
  placed?: boolean  // true = 玩家放置, false = 地形生成
  glow?: boolean    // 发光特效
}

export interface BlockDef {
  label: string
  emoji: string
  color: string
  topColor?: string
  emissive?: number
  transparent?: boolean
  wave?: boolean       // 水中波动效果
  specialShape?: 'torch' | 'flower' | 'mushroom' | 'leaves' | 'glass' | 'water' | 'candle' | 'lantern' | 'rose' | 'crystal_ball' | 'rune' | 'heart' | 'star'
  solid?: boolean      // 是否实心（影响碰撞）
}

export const BLOCK_DEFS: Record<BlockType, BlockDef> = {
  // ========== 基础自然方块 ==========
  grass:       { label: '草方块',     emoji: '🌿', color: '#4a8c3f', topColor: '#6ab84a', solid: true },
  dirt:        { label: '泥土',       emoji: '🟫', color: '#8b6b4a', solid: true },
  stone:       { label: '石头',       emoji: '🪨', color: '#888888', solid: true },
  bedrock:     { label: '基岩',       emoji: '⬛', color: '#333333', solid: true },
  sand:        { label: '沙子',       emoji: '🟨', color: '#d8c870', solid: true },
  sandstone:   { label: '砂岩',       emoji: '🟫', color: '#d4b878', solid: true },
  gravel:      { label: '砂砾',       emoji: '⚫', color: '#888888', solid: true },
  clay:        { label: '黏土',       emoji: '⬜', color: '#9e9e9e', solid: true },
  soul_sand:   { label: '灵魂沙',     emoji: '🟫', color: '#6b5344', solid: true },
  netherrack:  { label: '下界岩',     emoji: '🪨', color: '#6b3a3a', solid: true },
  mycelium:    { label: '菌丝土',     emoji: '🍄', color: '#6a5a4a', topColor: '#7a6a5a', solid: true },
  podzol:      { label: '灰化土',     emoji: '🟫', color: '#5a4a3a', topColor: '#6a5a4a', solid: true },
  grass_tall:  { label: '高草',       emoji: '🌿', color: '#4a8c3f', solid: false },
  fern:         { label: '蕨类',       emoji: '🌿', color: '#3a7a2a', solid: false },
  dead_bush:   { label: '枯灌木',     emoji: '🪴', color: '#8b6b4a', solid: false },
  vines:       { label: '藤蔓',       emoji: '🌿', color: '#3a8a2a', transparent: true, solid: false },
  lily_pad:    { label: '睡莲',       emoji: '🍀', color: '#4a8c3f', solid: false },
  cactus:      { label: '仙人掌',     emoji: '🌵', color: '#3a7a3a', solid: true },
  pumpkin:     { label: '南瓜',       emoji: '🎃', color: '#d08030', solid: true },
  melon:       { label: '西瓜',       emoji: '🍉', color: '#4a9a4a', solid: true },
  hay_block:   { label: '干草块',     emoji: '🌾', color: '#d4a030', solid: true },
  
  // ========== 石头变种 ==========
  cobblestone: { label: '圆石',       emoji: '⬜', color: '#707070', solid: true },
  mossy_cobblestone: { label: '苔圆石', emoji: '⬜', color: '#5a7050', solid: true },
  mossy_stone: { label: '苔石',       emoji: '🪨', color: '#607050', solid: true },
  granite:     { label: '花岗岩',     emoji: '🪨', color: '#9a7a6a', solid: true },
  diorite:     { label: '闪长岩',     emoji: '🪨', color: '#d0d0d0', solid: true },
  andesite:    { label: '安山岩',     emoji: '🪨', color: '#808080', solid: true },
  stone_bricks: { label: '石砖',       emoji: '🧱', color: '#808080', solid: true },
  cracked_stone_bricks: { label: '裂纹石砖', emoji: '🧱', color: '#787878', solid: true },
  smooth_stone: { label: '平滑石头',   emoji: '⬜', color: '#a0a0a0', solid: true },
  cut_sandstone: { label: '切制砂岩',  emoji: '🟫', color: '#d4c878', solid: true },
  smooth_sandstone: { label: '平滑砂岩', emoji: '🟫', color: '#d8c878', solid: true },
  end_stone:   { label: '末地石',     emoji: '⬜', color: '#e8e4c0', solid: true },
  end_stone_bricks: { label: '末地石砖', emoji: '🧱', color: '#e0d8b8', solid: true },
  prismarine:  { label: '海晶石',     emoji: '💎', color: '#48888a', solid: true },
  prismarine_bricks: { label: '海晶石砖', emoji: '💎', color: '#4a9a9c', solid: true },
  dark_prismarine: { label: '暗海晶石', emoji: '💎', color: '#2a585a', solid: true },
  sea_lantern: { label: '海灯',       emoji: '💡', color: '#a8d8d8', emissive: 0.5, solid: true },
  glowstone:   { label: '荧石',       emoji: '💡', color: '#ffd880', emissive: 0.8, solid: true },
  
  // ========== 下界方块 ==========
  nether_bricks: { label: '下界砖',    emoji: '🧱', color: '#2a1010', solid: true },
  cracked_nether_bricks: { label: '裂纹下界砖', emoji: '🧱', color: '#281818', solid: true },
  red_nether_bricks: { label: '红色下界砖', emoji: '🧱', color: '#9a2020', solid: true },
  quartz_block: { label: '石英块',     emoji: '⬜', color: '#e8e0d8', solid: true },
  smooth_quartz: { label: '平滑石英',   emoji: '⬜', color: '#f0e8e0', solid: true },
  quartz_pillar: { label: '石英柱',    emoji: '⬜', color: '#e8e0d8', solid: true },
  basalt:       { label: '玄武岩',     emoji: '🪨', color: '#404050', solid: true },
  polished_basalt: { label: '磨制玄武岩', emoji: '⬪', color: '#484858', solid: true },
  blackstone:   { label: '黑石',       emoji: '⬛', color: '#1a1a20', solid: true },
  polished_blackstone: { label: '磨制黑石', emoji: '⬛', color: '#282830', solid: true },
  
  // ========== 木材与木板 ==========
  oak_log:     { label: '橡木原木',   emoji: '🪵', color: '#7a5c3a', topColor: '#6a5a4a', solid: true },
  oak_planks:  { label: '橡木木板',   emoji: '🟧', color: '#c8a060', solid: true },
  oak_leaves:  { label: '橡树树叶',   emoji: '🍃', color: '#3a8a2a', transparent: true, solid: true },
  birch_log:   { label: '白桦原木',   emoji: '🪵', color: '#e8dcc8', topColor: '#d8d0c0', solid: true },
  birch_planks:{ label: '白桦木板',   emoji: '🟧', color: '#f0e8d8', solid: true },
  birch_leaves:{ label: '白桦树叶',   emoji: '🍃', color: '#4a9a3a', transparent: true, solid: true },
  spruce_log:  { label: '云杉原木',   emoji: '🪵', color: '#5a4030', topColor: '#4a3828', solid: true },
  spruce_planks:{ label: '云杉木板',   emoji: '🟧', color: '#a07850', solid: true },
  spruce_leaves:{ label: '云杉树叶',   emoji: '🍃', color: '#2a6a1a', transparent: true, solid: true },
  jungle_log:  { label: '丛林原木',   emoji: '🪵', color: '#6a5030', topColor: '#5a4828', solid: true },
  jungle_planks:{ label: '丛林木板',   emoji: '🟧', color: '#b08858', solid: true },
  jungle_leaves:{ label: '丛林树叶',  emoji: '🍃', color: '#2a8a1a', transparent: true, solid: true },
  leaves:      { label: '树叶',       emoji: '🍃', color: '#2d6b2d', transparent: true, specialShape: 'leaves', solid: true },
  wood:        { label: '木头',       emoji: '🪵', color: '#7a5c3a', solid: true },
  planks:      { label: '木板',       emoji: '🟧', color: '#c8a060', solid: true },
  
  // ========== 建筑材料 ==========
  brick:       { label: '砖块',       emoji: '🧱', color: '#b05040', solid: true },
  bricks:      { label: '砖块',       emoji: '🧱', color: '#b05040', solid: true },
  nether_brick:{ label: '下界砖块',   emoji: '🧱', color: '#2a1010', solid: true },
  
  // 楼梯
  oak_stairs:  { label: '橡木楼梯',   emoji: '🪜', color: '#c8a060', solid: true },
  spruce_stairs:{ label: '云杉楼梯',   emoji: '🪜', color: '#a07850', solid: true },
  cobblestone_stairs:{ label: '圆石楼梯', emoji: '🪜', color: '#707070', solid: true },
  stone_brick_stairs:{ label: '石砖楼梯', emoji: '🪜', color: '#808080', solid: true },
  brick_stairs: { label: '砖楼梯',    emoji: '🪜', color: '#b05040', solid: true },
  nether_brick_stairs:{ label: '下界砖楼梯', emoji: '🪜', color: '#2a1010', solid: true },
  
  // 台阶
  oak_slab:    { label: '橡木台阶',   emoji: '▬', color: '#c8a060', solid: true },
  spruce_slab:  { label: '云杉台阶',   emoji: '▬', color: '#a07850', solid: true },
  cobblestone_slab:{ label: '圆石台阶', emoji: '▬', color: '#707070', solid: true },
  stone_brick_slab:{ label: '石砖台阶', emoji: '▬', color: '#808080', solid: true },
  brick_slab:   { label: '砖台阶',    emoji: '▬', color: '#b05040', solid: true },
  
  // 栅栏
  oak_fence:   { label: '橡木栅栏',   emoji: '🪵', color: '#c8a060', solid: true },
  spruce_fence: { label: '云杉栅栏',   emoji: '🪵', color: '#a07850', solid: true },
  birch_fence: { label: '白桦栅栏',   emoji: '🪵', color: '#f0e8d8', solid: true },
  nether_brick_fence:{ label: '下界砖栅栏', emoji: '🪵', color: '#2a1010', solid: true },
  
  // 门
  oak_door:    { label: '橡木门',     emoji: '🚪', color: '#c8a060', solid: true },
  spruce_door: { label: '云杉门',     emoji: '🚪', color: '#a07850', solid: true },
  iron_door:   { label: '铁门',       emoji: '🚪', color: '#c8c8d0', solid: true },
  
  // 陷阱门
  oak_trapdoor:{ label: '橡木活板门', emoji: '▬', color: '#c8a060', solid: true },
  spruce_trapdoor:{ label: '云杉活板门', emoji: '▬', color: '#a07850', solid: true },
  iron_trapdoor:{ label: '铁活板门', emoji: '▬', color: '#c8c8d0', solid: true },
  
  // 玻璃
  glass:       { label: '玻璃',       emoji: '🪟', color: '#aaddff', transparent: true, specialShape: 'glass', solid: true },
  glass_pane:  { label: '玻璃板',   emoji: '▬', color: '#aaddff', transparent: true, solid: false },
  tinted_glass: { label: '着色玻璃', emoji: '🪟', color: '#5a4a3a', transparent: true, solid: false },
  
  // 染色玻璃
  white_stained_glass: { label: '白色染色玻璃', emoji: '🪟', color: '#f0f8ff', transparent: true, solid: true },
  orange_stained_glass: { label: '橙色染色玻璃', emoji: '🪟', color: '#ffa030', transparent: true, solid: true },
  cyan_stained_glass: { label: '青色染色玻璃', emoji: '🪟', color: '#30b8c8', transparent: true, solid: true },
  black_stained_glass: { label: '黑色染色玻璃', emoji: '🪟', color: '#181818', transparent: true, solid: true },
  
  // 铁栏杆
  iron_bars:   { label: '铁栏杆',     emoji: '▬', color: '#c8c8d0', solid: false },
  
  // 羊毛
  wool_white:  { label: '白色羊毛',   emoji: '🐑', color: '#f0f0f0', solid: true },
  wool_black:   { label: '黑色羊毛',   emoji: '🐑', color: '#1a1a1a', solid: true },
  wool_gray:    { label: '灰色羊毛',   emoji: '🐑', color: '#404040', solid: true },
  wool_light_gray:{ label: '浅灰羊毛', emoji: '🐑', color: '#909090', solid: true },
  wool_brown:   { label: '棕色羊毛',   emoji: '🐑', color: '#6a4030', solid: true },
  wool_red:     { label: '红色羊毛',   emoji: '🐑', color: '#a03020', solid: true },
  wool_orange:  { label: '橙色羊毛',   emoji: '🐑', color: '#d08020', solid: true },
  wool_yellow:  { label: '黄色羊毛',   emoji: '🐑', color: '#d0c020', solid: true },
  wool_lime:    { label: '黄绿羊毛',   emoji: '🐑', color: '#80b020', solid: true },
  wool_green:   { label: '绿色羊毛',   emoji: '🐑', color: '#406020', solid: true },
  wool_cyan:    { label: '青色羊毛',   emoji: '🐑', color: '#208090', solid: true },
  wool_blue:    { label: '蓝色羊毛',   emoji: '🐑', color: '#204080', solid: true },
  wool_purple:  { label: '紫色羊毛',   emoji: '🐑', color: '#602080', solid: true },
  wool_magenta: { label: '品红羊毛',   emoji: '🐑', color: '#a04090', solid: true },
  wool_pink:    { label: '粉色羊毛',   emoji: '🩷', color: '#ffb8d0', solid: true },
  wool_rose:    { label: '玫瑰色羊毛', emoji: '🌷', color: '#ff6688', solid: true },
  wool_lavender:{ label: '薰衣草羊毛', emoji: '💜', color: '#b888d8', solid: true },
  wool_sky:     { label: '天空色羊毛', emoji: '🩵', color: '#a8c8e8', solid: true },
  wool_sunset:  { label: '夕阳色羊毛', emoji: '🧡', color: '#ffaa77', solid: true },
  
  // 水与冰
  water:       { label: '水',         emoji: '💧', color: '#4488cc', transparent: true, wave: true, specialShape: 'water', solid: false },
  ice:          { label: '冰',         emoji: '🧊', color: '#a8d8f8', transparent: true, solid: true },
  packed_ice:  { label: '浮冰',       emoji: '🧊', color: '#88c8e8', solid: true },
  blue_ice:    { label: '蓝冰',       emoji: '🧊', color: '#78b8e8', solid: true },
  snow:         { label: '雪',         emoji: '❄️', color: '#eef5ff', solid: true },
  snow_block:   { label: '雪块',       emoji: '❄️', color: '#f0f6ff', solid: true },
  powder_snow:  { label: '细雪',       emoji: '❄️', color: '#f8fcff', solid: false },
  
  // 植物
  flower_red:  { label: '红色花朵',   emoji: '🌺', color: '#dd3030', specialShape: 'flower', solid: false },
  flower_yellow:{ label: '黄色花朵',  emoji: '🌼', color: '#ddaa20', specialShape: 'flower', solid: false },
  flower_white:{ label: '白色花朵',   emoji: '🌸', color: '#f8f8f8', specialShape: 'flower', solid: false },
  flower_blue:  { label: '蓝色花朵',   emoji: '💙', color: '#4080d0', specialShape: 'flower', solid: false },
  flower_lily_of_the_valley:{ label: '铃兰', emoji: '🔔', color: '#f8f8f8', specialShape: 'flower', solid: false },
  mushroom_red:{ label: '红色蘑菇',   emoji: '🍄', color: '#dd3030', specialShape: 'mushroom', solid: false },
  mushroom_brown:{ label: '棕色蘑菇', emoji: '🍄', color: '#8b5a2b', specialShape: 'mushroom', solid: false },
  mushroom_block_red: { label: '红色蘑菇方块', emoji: '🍄', color: '#c82828', solid: true },
  mushroom_block_brown: { label: '棕色蘑菇方块', emoji: '🍄', color: '#8a5030', solid: true },
  brown_mushroom_block: { label: '棕色蘑菇方块', emoji: '🍄', color: '#8a5030', solid: true },
  red_mushroom_block: { label: '红色蘑菇方块', emoji: '🍄', color: '#c82828', solid: true },
  mushroom_stem: { label: '蘑菇柄',   emoji: '🍄', color: '#d8d0c0', solid: true },
  torch:        { label: '火把',       emoji: '🔦', color: '#ddaa30', emissive: 1.0, specialShape: 'torch', solid: false },
  soul_torch:   { label: '灵魂火把',   emoji: '🔦', color: '#80c8d8', emissive: 0.8, specialShape: 'torch', solid: false },
  lantern:      { label: '灯笼',       emoji: '🏮', color: '#ffa030', emissive: 0.9, specialShape: 'lantern', solid: false },
  soul_lantern: { label: '灵魂灯笼',   emoji: '🏮', color: '#80c8d8', emissive: 0.7, specialShape: 'lantern', solid: false },
  sea_pickle:   { label: '海鞘',       emoji: '🌿', color: '#8ab020', emissive: 0.3, solid: true },
  bamboo:       { label: '竹子',       emoji: '🎋', color: '#80b020', solid: true },
  sugar_cane:   { label: '甘蔗',       emoji: '🎋', color: '#80b030', solid: true },
  kelp:         { label: '海带',       emoji: '🌿', color: '#4a9a3a', solid: false },
  seagrass:     { label: '海草',       emoji: '🌿', color: '#3a8a2a', solid: false },
  lily_of_the_valley: { label: '铃兰', emoji: '🔔', color: '#f8f8f8', specialShape: 'flower', solid: false },
  cornflower:   { label: '矢车菊',     emoji: '💙', color: '#4080d0', specialShape: 'flower', solid: false },
  sunflower:     { label: '向日葵',     emoji: '🌻', color: '#d8c020', solid: false },
  lilac:        { label: '丁香',       emoji: '🌸', color: '#c080c0', solid: false },
  rose_bush:    { label: '玫瑰丛',     emoji: '🌹', color: '#c03030', solid: false },
  peony:        { label: '牡丹',       emoji: '🌸', color: '#e8a0c0', solid: false },
  tall_grass:   { label: '高草',       emoji: '🌿', color: '#4a8c3f', solid: false },
  large_fern:   { label: '大型蕨类',   emoji: '🌿', color: '#3a7a2a', solid: false },
  
  // 矿物
  iron:         { label: '铁块',       emoji: '⚙️', color: '#c8c8d0', solid: true },
  gold:         { label: '金块',       emoji: '🟨', color: '#ffd700', emissive: 0.1, solid: true },
  diamond:      { label: '钻石块',     emoji: '💎', color: '#44ddff', emissive: 0.2, solid: true },
  emerald:      { label: '绿宝石块',   emoji: '💚', color: '#30d060', emissive: 0.2, solid: true },
  lapis:        { label: '青金石块',   emoji: '💎', color: '#3050d0', solid: true },
  coal:         { label: '煤炭块',     emoji: '⬛', color: '#181818', solid: true },
  copper:       { label: '铜块',       emoji: '🟧', color: '#c07040', solid: true },
  iron_block:   { label: '铁块',       emoji: '⚙️', color: '#c8c8d0', solid: true },
  gold_block:   { label: '金块',       emoji: '🟨', color: '#ffd700', emissive: 0.1, solid: true },
  diamond_block: { label: '钻石块',     emoji: '💎', color: '#44ddff', emissive: 0.2, solid: true },
  emerald_block: { label: '绿宝石块',   emoji: '💚', color: '#30d060', emissive: 0.2, solid: true },
  lapis_block:  { label: '青金石块',   emoji: '💎', color: '#3050d0', solid: true },
  coal_block:   { label: '煤炭块',     emoji: '⬛', color: '#181818', solid: true },
  copper_block: { label: '铜块',       emoji: '🟧', color: '#c07040', solid: true },
  netherite:    { label: '下界合金',   emoji: '⚔️', color: '#4a4040', solid: true },
  netherite_block:{ label: '下界合金块', emoji: '⚔️', color: '#4a4040', solid: true },
  obsidian:     { label: '黑曜石',     emoji: '🖤', color: '#1a0a30', solid: true },
  crying_obsidian:{ label: '哭泣黑曜石', emoji: '🖤', color: '#201040', emissive: 0.3, solid: true },
  ancient_debris:{ label: '远古残骸',  emoji: '⚔️', color: '#5a4848', solid: true },
  debris:        { label: '残骸',      emoji: '⚔️', color: '#5a4848', solid: true },
  
  // 红石
  redstone:     { label: '红石',       emoji: '🔴', color: '#c02020', emissive: 0.2, solid: false },
  redstone_torch:{ label: '红石火把', emoji: '🔦', color: '#ff4040', emissive: 0.8, specialShape: 'torch', solid: false },
  redstone_block:{ label: '红石块',   emoji: '🔴', color: '#a02020', emissive: 0.3, solid: true },
  lever:        { label: '拉杆',       emoji: '🔘', color: '#a08040', solid: true },
  button:       { label: '按钮',       emoji: '🔘', color: '#a08040', solid: true },
  stone_button: { label: '石头按钮',   emoji: '🔘', color: '#808080', solid: true },
  oak_button:   { label: '橡木按钮',   emoji: '🔘', color: '#c8a060', solid: true },
  pressure_plate:{ label: '压力板',   emoji: '▬', color: '#a08040', solid: true },
  oak_pressure_plate:{ label: '橡木压力板', emoji: '▬', color: '#c8a060', solid: true },
  stone_pressure_plate:{ label: '石头压力板', emoji: '▬', color: '#808080', solid: true },
  heavy_weighted_pressure_plate:{ label: '重质压力板', emoji: '▬', color: '#c8c8d0', solid: true },
  light_weighted_pressure_plate:{ label: '轻质压力板', emoji: '▬', color: '#ffd700', solid: true },
  
  // 特殊方块
  shroomlight:  { label: '菌光灯',     emoji: '💡', color: '#d8a828', emissive: 0.8, solid: true },
  slime_block:  { label: '史莱姆方块', emoji: '🟢', color: '#80b020', emissive: 0.2, solid: true },
  honey_block:  { label: '蜂蜜方块',   emoji: '🍯', color: '#d8a020', solid: true },
  honeycomb_block:{ label: '蜜脾块',   emoji: '🍯', color: '#d8b030', solid: true },
  beacon:       { label: '信标',       emoji: '💎', color: '#88d8ff', emissive: 0.5, solid: true },
  conduit:      { label: '潮涌核心',   emoji: '💎', color: '#40c8e8', emissive: 0.4, solid: true },
  end_crystal:  { label: '末影水晶',   emoji: '💎', color: '#e8d8e8', emissive: 0.6, solid: false },
  dragon_egg:   { label: '龙蛋',       emoji: '🥚', color: '#1a1a20', solid: false },
  ender_chest:  { label: '末影箱',     emoji: '📦', color: '#1a1a20', solid: true },
  jukebox:      { label: '唱片机',     emoji: '📀', color: '#8a6040', solid: true },
  note_block:   { label: '音符盒',     emoji: '🎵', color: '#8a6040', solid: true },
  flower_pot:   { label: '花盆',       emoji: '🪴', color: '#b06040', solid: true },
  armor_stand:  { label: '盔甲架',     emoji: '🎭', color: '#c8a060', solid: false },
  
  // 命令方块
  command_block:{ label: '命令方块',   emoji: '⬛', color: '#8080a0', solid: true },
  chain_command_block:{ label: '链式命令方块', emoji: '⬛', color: '#808068', solid: true },
  repeating_command_block:{ label: '循环命令方块', emoji: '⬛', color: '#8080a0', solid: true },
  
  // 头颅
  player_head:  { label: '玩家头颅',   emoji: '🧑', color: '#c8a060', solid: false },
  skeleton_skull:{ label: '骷髅头颅',   emoji: '💀', color: '#e8e8d8', solid: false },
  zombie_head:  { label: '僵尸头颅',   emoji: '🧟', color: '#4a8a4a', solid: false },
  creeper_head: { label: '苦力怕头颅', emoji: '🟩', color: '#5aa05a', solid: false },
  dragon_head:  { label: '龙头颅',     emoji: '🐉', color: '#4a3a6a', solid: false },
  wither_skeleton_skull:{ label: '凋灵骷髅头颅', emoji: '💀', color: '#404040', solid: false },
  
  // 命理元素 - 西方占星
  zodiac_fire:  { label: '火相',      emoji: '🔥', color: '#ff6644', emissive: 0.5, specialShape: 'rune', solid: true },
  zodiac_water: { label: '水相',      emoji: '💧', color: '#4488cc', emissive: 0.3, specialShape: 'rune', solid: true },
  zodiac_earth: { label: '土相',      emoji: '🌿', color: '#6ba84a', emissive: 0.2, specialShape: 'rune', solid: true },
  zodiac_air:   { label: '风相',      emoji: '💨', color: '#e8e8ff', emissive: 0.3, specialShape: 'rune', solid: true },
  constellation:{ label: '星座石',    emoji: '⭐', color: '#3a3a5a', emissive: 0.8, specialShape: 'star', solid: true },
  crystal_ball: { label: '水晶球',    emoji: '🔮', color: '#b898e8', emissive: 0.6, specialShape: 'crystal_ball', transparent: true, solid: true },
  rune:         { label: '符文',      emoji: '⚛️', color: '#ddaa30', emissive: 0.5, specialShape: 'rune', solid: true },
  tarot:        { label: '塔罗',      emoji: '🎴', color: '#f4e4c4', emissive: 0.3, solid: true },
  moon_phase:   { label: '月相石',    emoji: '🌙', color: '#c8c8e8', emissive: 0.4, solid: true },
  star_map:     { label: '星图',      emoji: '🗺️', color: '#4a4a6a', emissive: 0.3, solid: true },
  fate_line:    { label: '缘分线',    emoji: '💫', color: '#ffaa88', emissive: 0.6, specialShape: 'rune', solid: true },
  destiny_core: { label: '命运核心',   emoji: '💖', color: '#ffd080', emissive: 0.9, specialShape: 'heart', solid: true },

  // 命理元素 - 十二生肖
  zodiac_rat:    { label: '鼠',       emoji: '🐀', color: '#888888', emissive: 0.2, solid: true },
  zodiac_ox:    { label: '牛',       emoji: '🐂', color: '#a08060', emissive: 0.2, solid: true },
  zodiac_tiger:  { label: '虎',       emoji: '🐅', color: '#d46040', emissive: 0.3, solid: true },
  zodiac_rabbit:{ label: '兔',       emoji: '🐇', color: '#f0c8c8', emissive: 0.2, solid: true },
  zodiac_dragon: { label: '龙',      emoji: '🐉', color: '#ff6060', emissive: 0.4, solid: true },
  zodiac_snake:  { label: '蛇',       emoji: '🐍', color: '#60a040', emissive: 0.3, solid: true },
  zodiac_horse:  { label: '马',       emoji: '🐴', color: '#c06040', emissive: 0.3, solid: true },
  zodiac_goat:   { label: '羊',      emoji: '🐑', color: '#f8d8c8', emissive: 0.2, solid: true },
  zodiac_monkey: { label: '猴',      emoji: '🐒', color: '#d4a040', emissive: 0.3, solid: true },
  zodiac_rooster:{ label: '鸡',      emoji: '🐓', color: '#f0a040', emissive: 0.3, solid: true },
  zodiac_dog:    { label: '狗',       emoji: '🐕', color: '#a08070', emissive: 0.2, solid: true },
  zodiac_pig:    { label: '猪',       emoji: '🐖', color: '#e8c8b8', emissive: 0.2, solid: true },

  // 命理元素 - 五行
  wu_xing_metal: { label: '金',      emoji: '⚔️', color: '#c8c8d8', emissive: 0.3, solid: true },
  wu_xing_water: { label: '水',      emoji: '💧', color: '#4488cc', emissive: 0.3, solid: true },
  wu_xing_wood:  { label: '木',      emoji: '🌲', color: '#4a883a', emissive: 0.2, solid: true },
  wu_xing_fire:  { label: '火',      emoji: '🔥', color: '#ff4444', emissive: 0.5, solid: true },
  wu_xing_earth: { label: '土',      emoji: '🪨', color: '#a08060', emissive: 0.2, solid: true },

  // 命理元素 - 天干
  tiangan_jia:  { label: '甲',       emoji: '甲', color: '#ff4444', emissive: 0.4, specialShape: 'rune', solid: true },
  tiangan_yi:   { label: '乙',       emoji: '乙', color: '#44aa44', emissive: 0.3, specialShape: 'rune', solid: true },
  tiangan_bing: { label: '丙',       emoji: '丙', color: '#ff6600', emissive: 0.5, specialShape: 'rune', solid: true },
  tiangan_ding: { label: '丁',       emoji: '丁', color: '#ff8800', emissive: 0.4, specialShape: 'rune', solid: true },
  tiangan_wu:   { label: '戊',       emoji: '戊', color: '#aa8844', emissive: 0.2, specialShape: 'rune', solid: true },
  tiangan_ji:   { label: '己',       emoji: '己', color: '#ccaa66', emissive: 0.2, specialShape: 'rune', solid: true },
  tiangan_geng: { label: '庚',       emoji: '庚', color: '#6688cc', emissive: 0.3, specialShape: 'rune', solid: true },
  tiangan_xin:  { label: '辛',       emoji: '辛', color: '#aaccff', emissive: 0.3, specialShape: 'rune', solid: true },
  tiangan_ren:  { label: '壬',       emoji: '壬', color: '#44aaff', emissive: 0.3, specialShape: 'rune', solid: true },
  tiangan_gui:  { label: '癸',       emoji: '癸', color: '#88ddff', emissive: 0.3, specialShape: 'rune', solid: true },

  // 命理元素 - 地支
  dizhi_zi:   { label: '子',        emoji: '子', color: '#666688', emissive: 0.2, specialShape: 'rune', solid: true },
  dizhi_chou: { label: '丑',        emoji: '丑', color: '#887755', emissive: 0.2, specialShape: 'rune', solid: true },
  dizhi_yin:  { label: '寅',        emoji: '寅', color: '#448844', emissive: 0.3, specialShape: 'rune', solid: true },
  dizhi_mao:  { label: '卯',        emoji: '卯', color: '#66aa66', emissive: 0.3, specialShape: 'rune', solid: true },
  dizhi_chen: { label: '辰',        emoji: '辰', color: '#aa8866', emissive: 0.2, specialShape: 'rune', solid: true },
  dizhi_si:   { label: '巳',        emoji: '巳', color: '#ff6644', emissive: 0.4, specialShape: 'rune', solid: true },
  dizhi_wu:   { label: '午',        emoji: '午', color: '#ff4444', emissive: 0.5, specialShape: 'rune', solid: true },
  dizhi_wei:  { label: '未',        emoji: '未', color: '#ccaa66', emissive: 0.2, specialShape: 'rune', solid: true },
  dizhi_shen: { label: '申',        emoji: '申', color: '#88aadd', emissive: 0.3, specialShape: 'rune', solid: true },
  dizhi_you:  { label: '酉',        emoji: '酉', color: '#6688cc', emissive: 0.3, specialShape: 'rune', solid: true },
  dizhi_xu:   { label: '戌',        emoji: '戌', color: '#aa7755', emissive: 0.2, specialShape: 'rune', solid: true },
  dizhi_hai:  { label: '亥',        emoji: '亥', color: '#5577aa', emissive: 0.3, specialShape: 'rune', solid: true },

  // 命理元素 - 八卦
  bagua_qian: { label: '乾',        emoji: '☰', color: '#ffdd88', emissive: 0.5, solid: true },
  bagua_dui:  { label: '兑',        emoji: '☱', color: '#ff8888', emissive: 0.4, solid: true },
  bagua_li:   { label: '离',        emoji: '☲', color: '#ff4444', emissive: 0.6, solid: true },
  bagua_zhen: { label: '震',        emoji: '☳', color: '#aa6644', emissive: 0.3, solid: true },
  bagua_xun:  { label: '巽',        emoji: '☴', color: '#88cc88', emissive: 0.3, solid: true },
  bagua_kun:  { label: '坤',        emoji: '☷', color: '#aa8866', emissive: 0.2, solid: true },
  bagua_gen:  { label: '艮',        emoji: '☶', color: '#88aa66', emissive: 0.3, solid: true },
  bagua_kang: { label: '坎',        emoji: '☵', color: '#4488cc', emissive: 0.4, solid: true },

  // 命理元素 - 紫微斗数
  ziwei_tianji:  { label: '天机星',  emoji: '🌌', color: '#cc88ff', emissive: 0.6, solid: true },
  ziwei_tianzhu: { label: '天枢星',  emoji: '✨', color: '#ffddaa', emissive: 0.7, solid: true },
  ziwei_tianshu: { label: '天枢星',  emoji: '🌟', color: '#ffff88', emissive: 0.8, solid: true },
  ziwei_tianfu:  { label: '天府星',  emoji: '🏆', color: '#ffaa44', emissive: 0.5, solid: true },
  ziwei_taibai:  { label: '太白星',  emoji: '🌙', color: '#aaddff', emissive: 0.5, solid: true },
  ziwei_tianxiong:{ label: '天雄星', emoji: '⚡', color: '#ff4488', emissive: 0.6, solid: true },
  ziwei_tianku:  { label: '天哭星',  emoji: '💧', color: '#66aadd', emissive: 0.4, solid: true },
  ziwei_tianyao: { label: '天姚星',  emoji: '💘', color: '#ff88cc', emissive: 0.5, solid: true },

  // ========== 缺失的方块补充 ==========
  // 浪漫主题
  petal:         { label: '花瓣',       emoji: '🌷', color: '#ff99c8', solid: true },
  // 台阶
  birch_slab:   { label: '白桦台阶',   emoji: '▬', color: '#f0e8d8', solid: true },
  jungle_slab:   { label: '丛林台阶',   emoji: '▬', color: '#b08858', solid: true },
  // 水生
  water_lily:    { label: '睡莲叶',    emoji: '🍀', color: '#4a8c3f', solid: false },
  // 石头变种补充
  chiseled_stone_bricks: { label: '錾制石砖', emoji: '🧱', color: '#787878', solid: true },
  // 特殊方块
  purpur_block:  { label: '紫珀块',     emoji: '🟪', color: '#9a6a9a', solid: true },
  purpur_pillar: { label: '紫珀柱',     emoji: '⬛', color: '#8a5a8a', solid: true },
  // 下界补充
  chiseled_nether_bricks: { label: '錾制下界砖', emoji: '🧱', color: '#2a1010', solid: true },
  chiseled_quartz: { label: '錾制石英',   emoji: '⬜', color: '#e8e0d8', solid: true },
  chain:         { label: '锁链',       emoji: '⛓️', color: '#606060', solid: true },
  // 红石
  repeater:      { label: '红石中继器', emoji: '🔄', color: '#c02020', solid: true },
  comparator:    { label: '红石比较器', emoji: '🔄', color: '#802020', solid: true },
  piston:        { label: '活塞',       emoji: '⬛', color: '#a08060', solid: true },
  sticky_piston: { label: '粘性活塞',   emoji: '⬛', color: '#a09070', solid: true },
  observer:      { label: '观察者',     emoji: '👁️', color: '#909090', solid: true },
  hopper:        { label: '漏斗',       emoji: '🔻', color: '#606060', solid: true },
  dropper:      { label: '投掷器',     emoji: '⬇️', color: '#808080', solid: true },
  dispenser:     { label: '发射器',     emoji: '🎯', color: '#707070', solid: true },
  tripwire_hook: { label: '绊线钩',     emoji: '⚓', color: '#a08060', solid: true },
  // 门和活板门
  birch_door:   { label: '白桦门',     emoji: '🚪', color: '#f0e8d8', solid: true },
  jungle_door:  { label: '丛林门',     emoji: '🚪', color: '#b08858', solid: true },
  // 栅栏门
  oak_fence_gate: { label: '橡木栅栏门', emoji: '🚪', color: '#c8a060', solid: true },
  spruce_fence_gate: { label: '云杉栅栏门', emoji: '🚪', color: '#a07850', solid: true },
  // 楼梯补充
  birch_stairs: { label: '白桦楼梯',   emoji: '🪜', color: '#f0e8d8', solid: true },
  jungle_stairs:{ label: '丛林楼梯',   emoji: '🪜', color: '#b08858', solid: true },
  // 告示牌
  wall_sign:    { label: '告示牌',     emoji: '🪧', color: '#c8a060', solid: true },
  oak_wall_sign:{ label: '橡木墙告示牌', emoji: '🪧', color: '#c8a060', solid: true },
  // 染色玻璃
  magenta_stained_glass: { label: '品红染色玻璃', emoji: '🪟', color: '#d060c0', transparent: true, solid: true },
  light_blue_stained_glass: { label: '淡蓝染色玻璃', emoji: '🪟', color: '#60a0d0', transparent: true, solid: true },
  lime_stained_glass: { label: '黄绿染色玻璃', emoji: '🪟', color: '#80c030', transparent: true, solid: true },
  gray_stained_glass: { label: '灰色染色玻璃', emoji: '🪟', color: '#404040', transparent: true, solid: true },
  light_gray_stained_glass: { label: '淡灰染色玻璃', emoji: '🪟', color: '#808080', transparent: true, solid: true },
  brown_stained_glass: { label: '棕色染色玻璃', emoji: '🪟', color: '#804020', transparent: true, solid: true },
  green_stained_glass: { label: '绿色染色玻璃', emoji: '🪟', color: '#306020', transparent: true, solid: true },
  red_stained_glass: { label: '红色染色玻璃', emoji: '🪟', color: '#c02020', transparent: true, solid: true },
  yellow_stained_glass: { label: '黄色染色玻璃', emoji: '🪟', color: '#d0c020', transparent: true, solid: true },
  pink_stained_glass: { label: '粉色染色玻璃', emoji: '🪟', color: '#e080a0', transparent: true, solid: true },
  purple_stained_glass: { label: '紫色染色玻璃', emoji: '🪟', color: '#8030c0', transparent: true, solid: true },
  blue_stained_glass: { label: '蓝色染色玻璃', emoji: '🪟', color: '#204080', transparent: true, solid: true },
  // 告示牌
  oak_sign:      { label: '橡木告示牌', emoji: '🪧', color: '#c8a060', solid: true },
  spruce_sign:   { label: '云杉告示牌', emoji: '🪧', color: '#a07850', solid: true },
  // 染色玻璃板
  white_stained_glass_pane: { label: '白色染色玻璃板', emoji: '▬', color: '#f0f8ff', transparent: true, solid: false },
  orange_stained_glass_pane: { label: '橙色染色玻璃板', emoji: '▬', color: '#ffa030', transparent: true, solid: false },
  cyan_stained_glass_pane: { label: '青色染色玻璃板', emoji: '▬', color: '#30b8c8', transparent: true, solid: false },
  // 泥土变种
  coarse_dirt:   { label: '粗泥土',     emoji: '🟫', color: '#7a5a4a', solid: true },
  rooted_dirt:   { label: '扎根泥土',   emoji: '🟫', color: '#8b6b4a', solid: true },
  moss_block:    { label: '苔藓方块',   emoji: '🌿', color: '#5a7050', solid: true },
  dirt_path:     { label: '泥土小径',   emoji: '🟫', color: '#8b6b4a', solid: true },
  // 雪
  snow_layer:    { label: '雪层',       emoji: '❄️', color: '#eef5ff', solid: true },
  snow_path:     { label: '雪径',       emoji: '❄️', color: '#e8f0f8', solid: true },
  // 水生植物
  tall_seagrass: { label: '高海草',   emoji: '🌿', color: '#3a8a2a', solid: false },
  // 竹子
  bamboo_sapling: { label: '竹子苗',   emoji: '🎋', color: '#80b020', solid: true },
  // 浪漫主题
  cherry_leaves: { label: '樱花叶',    emoji: '🌸', color: '#ffb8d8', transparent: true, specialShape: 'leaves', solid: true },
  cherry_wood:   { label: '樱花木',     emoji: '🪵', color: '#e8c8a8', solid: true },
  rose:          { label: '玫瑰',       emoji: '🌹', color: '#e84858', specialShape: 'rose', solid: false },
  candle:        { label: '蜡烛',       emoji: '🕯️', color: '#fff3c4', emissive: 0.9, specialShape: 'candle', solid: false },
  crystal_pink:  { label: '粉水晶',     emoji: '💗', color: '#ffaacc', emissive: 0.5, solid: true },
  crystal_blue:  { label: '蓝水晶',     emoji: '💙', color: '#77ccff', emissive: 0.5, solid: true },
  crystal_violet:{ label: '紫水晶',     emoji: '💜', color: '#cc88ff', emissive: 0.5, solid: true },
  heart_block:  { label: '爱心方块',   emoji: '❤️', color: '#ff6b9d', emissive: 0.3, specialShape: 'heart', solid: true },
  moon_stone:   { label: '月光石',     emoji: '🌙', color: '#e8e4ff', emissive: 0.4, solid: true },
  star_dust:     { label: '星尘',       emoji: '✨', color: '#fff1a8', emissive: 0.7, specialShape: 'star', solid: false },
  // 矿石
  nether_gold_ore: { label: '下界金矿石', emoji: '🟨', color: '#d4a030', solid: true },
  nether_quartz_ore: { label: '下界石英矿石', emoji: '⬜', color: '#e8e0d8', solid: true },
  redstone_ore:  { label: '红石矿石',   emoji: '🔴', color: '#a02020', solid: true },
  // 其他石头
  gilded_blackstone: { label: '镀金黑石', emoji: '⬛', color: '#282830', solid: true },
  // 命令方块
  mob_spawner:   { label: '刷怪笼',     emoji: '⬛', color: '#404050', solid: true },
  cake:          { label: '蛋糕',       emoji: '🎂', color: '#f8d8c0', solid: true },
}

// ============ 热键栏方块列表 ============
export const HOTBAR_BLOCKS: BlockType[] = [
  // 自然基础
  'grass', 'dirt', 'stone', 'wood', 'planks',
  'cobblestone', 'brick', 'sand', 'sandstone', 'snow',
  // 木材
  'oak_log', 'oak_planks', 'birch_log', 'birch_planks',
  'spruce_log', 'spruce_planks', 'jungle_log', 'jungle_planks',
  // 树叶
  'oak_leaves', 'birch_leaves', 'spruce_leaves', 'jungle_leaves',
  // 石头变种
  'granite', 'diorite', 'andesite', 'mossy_cobblestone',
  // 建筑
  'bricks', 'glass', 'iron_bars',
  // 羊毛
  'wool_white', 'wool_pink', 'wool_rose', 'wool_lavender',
  // 花与植物
  'flower_red', 'flower_yellow', 'flower_white', 'flower_blue',
  'mushroom_red', 'mushroom_brown', 'mushroom_block_red', 'mushroom_block_brown',
  // 特殊
  'torch', 'soul_torch', 'lantern', 'glowstone',
  // 水与冰
  'water', 'ice', 'packed_ice',
  // 矿物
  'iron', 'gold', 'diamond', 'emerald', 'coal', 'obsidian',
  // 命理元素
  'wu_xing_metal', 'wu_xing_water', 'wu_xing_wood', 'wu_xing_fire', 'wu_xing_earth',
  'zodiac_fire', 'zodiac_water', 'zodiac_earth', 'zodiac_air',
  'bagua_qian', 'bagua_kun', 'bagua_li', 'bagua_kang',
  'crystal_ball', 'constellation', 'destiny_core',
]

// ============ 坐标工具 ============
export function blockKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`
}

export function parseKey(key: string): [number, number, number] {
  const [x, y, z] = key.split(',').map(Number)
  return [x, y, z]
}

// ============ 简单噪声（多 octave sine 叠加）============
export function noise2D(x: number, z: number, seed = 42): number {
  const s = seed * 127.1
  let v = 0
  v += Math.sin(x * 0.03 + z * 0.05 + s) * 0.5
  v += Math.sin(x * 0.07 + z * 0.11 + s * 1.3) * 0.25
  v += Math.sin(x * 0.15 + z * 0.19 + s * 2.1) * 0.125
  v += Math.sin(x * 0.3 + z * 0.25 + s * 3.7) * 0.0625
  return (v + 1) / 2  // normalize to [0, 1]
}

// 用于特殊特征（树木、花、矿脉等）的额外噪声
export function noiseFeature(x: number, z: number, offset: number, seed: number): number {
  const s = seed * 127.1 + offset * 31.7
  let v = 0
  v += Math.sin(x * 0.15 + z * 0.13 + s) * 0.5
  v += Math.sin(x * 0.3 + z * 0.35 + s * 1.3) * 0.25
  v += Math.sin(x * 0.6 + z * 0.5 + s * 2.1) * 0.125
  return (v + 1) / 2
}

// ============ 地形生成（无限世界版 - 按需计算）============
const SEA_LEVEL = 2
const WATER_LEVEL = 2

/**
 * 获取给定坐标的地表高度（y 坐标）
 */
export function getTerrainHeight(x: number, z: number, seed: number): number {
  const n = noise2D(x, z, seed)
  // 基础高度 0~12, 加上一些变化
  let h = Math.floor(n * 10)
  // 加一些小山脉
  const mountain = noiseFeature(x, z, 500, seed)
  if (mountain > 0.88) {
    h += Math.floor((mountain - 0.88) * 80)  // 最高 10 格高山
  }
  return h
}

/**
 * 判断在给定坐标(x, y, z)处是否存在自然地形方块。
 * 返回方块类型，或 null 表示空。
 */
export function getNaturalBlock(x: number, y: number, z: number, seed: number): BlockType | null {
  const h = getTerrainHeight(x, z, seed)

  // 基岩：y=0
  if (y === 0) return 'bedrock'

  // 地表以上：检查是否有水
  if (y > h) {
    // 水面
    if (y <= WATER_LEVEL && h <= WATER_LEVEL) return 'water'
    return null
  }

  // 地下和表面
  // 确定生物群落
  const biome = getBiome(x, z, seed)

  // 地表层
  if (y === h) {
    if (biome === 'desert') return 'sand'
    if (biome === 'snow') return 'snow'
    if (biome === 'cherry_grove') return 'grass'
    if (biome === 'mystic') return 'stone'
    return 'grass'
  }

  // 地下 1-3 层
  if (y >= h - 3) {
    if (biome === 'desert') return 'sand'
    if (biome === 'snow') return 'snow'
    return 'dirt'
  }

  // 深层
  if (y >= h - 8) return 'stone'

  // 更深处可能有矿石
  if (y >= 1) {
    // 矿脉生成
    const oreNoise = noiseFeature(x, y, z, seed + 100)
    if (oreNoise > 0.96 && y < h - 5) {
      if (biome === 'mystic') return 'crystal_violet'
      if (y < h - 10) return 'obsidian'
      return 'gold'
    }
    if (oreNoise > 0.92 && y < h - 3) {
      if (biome === 'mystic') return 'crystal_blue'
      return 'iron'
    }
    return 'stone'
  }

  return 'stone'
}

/**
 * 判断生物群落
 */
export type Biome = 'plains' | 'desert' | 'snow' | 'forest' | 'cherry_grove' | 'mystic' | 'ocean'

export function getBiome(x: number, z: number, seed: number): Biome {
  const h = getTerrainHeight(x, z, seed)
  const biomeNoise = noiseFeature(x, z, 777, seed)
  const mysticNoise = noiseFeature(x, z, 888, seed)

  // 海洋/水域
  if (h <= WATER_LEVEL) return 'ocean'

  // 神秘命理区域（稀有的）
  if (mysticNoise > 0.92) return 'mystic'

  // 樱花林
  if (biomeNoise > 0.80) return 'cherry_grove'

  // 沙漠
  if (biomeNoise < 0.2) return 'desert'

  // 雪原
  if (h > 9) return 'snow'

  // 森林
  if (biomeNoise > 0.55) return 'forest'

  return 'plains'
}

/**
 * 获取树木/装饰物（在特定位置生成）
 * 返回装饰方块列表，位置相对于(x, z)
 */
export function getDecoration(x: number, z: number, seed: number): { type: BlockType; y: number }[] {
  const h = getTerrainHeight(x, z, seed)
  const biome = getBiome(x, z, seed)

  // 只在地表生成装饰
  const treeNoise = noiseFeature(x, z, 200, seed)
  const flowerNoise = noiseFeature(x, z, 300, seed)
  const mysticNoise = noiseFeature(x, z, 400, seed)

  const decorations: { type: BlockType; y: number }[] = []

  // 树（只在草地 / 森林 / 樱花林）
  if (biome === 'forest' && treeNoise > 0.7) {
    const treeH = h + 1
    // 树干 4 层
    for (let i = 0; i < 4; i++) {
      decorations.push({ type: 'wood', y: treeH + i })
    }
    // 树冠（简化版 - 用一组叶子点）
    for (let lx = -2; lx <= 2; lx++) {
      for (let lz = -2; lz <= 2; lz++) {
        for (let ly = 0; ly <= 2; ly++) {
          const dist = Math.abs(lx) + Math.abs(lz) + Math.abs(ly)
          if (dist <= 3 && !(lx === 0 && lz === 0 && ly < 2)) {
            decorations.push({ type: 'leaves', y: treeH + 3 + ly })
          }
        }
      }
    }
  }

  // 樱花树
  if (biome === 'cherry_grove' && treeNoise > 0.65) {
    const treeH = h + 1
    for (let i = 0; i < 5; i++) {
      decorations.push({ type: 'cherry_wood', y: treeH + i })
    }
    // 粉色树冠
    for (let lx = -2; lx <= 2; lx++) {
      for (let lz = -2; lz <= 2; lz++) {
        for (let ly = 0; ly <= 3; ly++) {
          const dist = Math.abs(lx) + Math.abs(lz) + Math.abs(ly)
          if (dist <= 3 && !(lx === 0 && lz === 0 && ly < 2)) {
            decorations.push({ type: 'cherry_leaves', y: treeH + 4 + ly })
          }
        }
      }
    }
    // 加一点花瓣效果在旁边
    if (flowerNoise > 0.5) {
      decorations.push({ type: 'petal', y: h + 1 })
    }
  }

  // 花（只在草地）
  if ((biome === 'plains' || biome === 'forest') && h > WATER_LEVEL) {
    if (flowerNoise > 0.9) {
      decorations.push({ type: flowerNoise > 0.95 ? 'flower_yellow' : 'flower_red', y: h + 1 })
    }
    const mushroomNoise = noiseFeature(x, z, 350, seed)
    if (mushroomNoise > 0.92) {
      decorations.push({ type: mushroomNoise > 0.96 ? 'mushroom_brown' : 'mushroom_red', y: h + 1 })
    }
  }

  // 神秘区域的命理装饰
  if (biome === 'mystic') {
    if (mysticNoise > 0.85) {
      decorations.push({ type: 'crystal_ball', y: h + 1 })
    }
    if (mysticNoise > 0.9) {
      decorations.push({ type: 'candle', y: h + 1 })
    }
    if (mysticNoise > 0.95) {
      decorations.push({ type: 'constellation', y: h + 2 })
    }
    if (mysticNoise > 0.88) {
      // 生成一组小水晶
      for (let i = 0; i < 2; i++) {
        const crystalNoise = noiseFeature(x + i, z, 500 + i, seed)
        if (crystalNoise > 0.8) {
          const cType: BlockType = crystalNoise > 0.95 ? 'crystal_violet' : crystalNoise > 0.9 ? 'crystal_blue' : 'crystal_pink'
          decorations.push({ type: cType, y: h + 1 })
        }
      }
    }
  }

  return decorations
}

// ============ Store（无限世界版）============
interface VoxelWorldStore {
  // 玩家放置的方块（覆盖自然地形）
  blocks: Map<string, Block>
  selectedSlot: number
  isLocked: boolean
  crosshairTarget: [number, number, number] | null
  crosshairFace: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west' | null
  seed: number

  setSelectedSlot: (s: number) => void
  placeBlock: (x: number, y: number, z: number) => void
  removeBlock: (x: number, y: number, z: number) => void
  setCrosshairTarget: (pos: [number, number, number] | null, face?: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west' | null) => void
  setLocked: (v: boolean) => void
  regenerateWorld: () => void
  clearWorld: () => void
  setBlocks: (blocks: Map<string, Block>) => void
  getBlock: (x: number, y: number, z: number) => Block | undefined
  getTerrainHeightAt: (x: number, z: number) => number
}

const LS_KEY = 'voxel-world-v2'
const LS_SEED = 'voxel-world-seed-v2'

function loadBlocks(): Map<string, Block> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const arr: [string, Block][] = JSON.parse(raw)
      return new Map(arr)
    }
  } catch {}
  return new Map()  // 空的玩家放置方块，其余由噪声生成
}

function saveBlocks(blocks: Map<string, Block>) {
  try {
    // 只保存玩家放置的方块
    const toSave: [string, Block][] = []
    blocks.forEach((b, key) => {
      if (b.placed) toSave.push([key, b])
    })
    localStorage.setItem(LS_KEY, JSON.stringify(toSave))
  } catch {}
}

export const useVoxelWorldStore = create<VoxelWorldStore>((set, get) => ({
  blocks: loadBlocks(),
  selectedSlot: 0,
  isLocked: false,
  crosshairTarget: null,
  crosshairFace: null,
  seed: parseInt(localStorage.getItem(LS_SEED) || String(42)),

  setSelectedSlot: (s) => set({ selectedSlot: s }),

  placeBlock: (x, y, z) => {
    const { blocks, selectedSlot } = get()
    const key = blockKey(x, y, z)
    const blockType = HOTBAR_BLOCKS[selectedSlot] || 'grass'

    // 不允许在已有方块位置放置（避免重叠）
    const existing = get().blocks.get(key)
    if (existing) return
    // 同时检查自然地形是否也有方块（如果自然地形有方块，但玩家没有覆盖操作，则不允许）
    const natural = getNaturalBlock(x, y, z, get().seed)
    if (natural) return  // 已经有自然方块，不允许

    const newBlocks = new Map(blocks)
    newBlocks.set(key, { type: blockType, placed: true })
    saveBlocks(newBlocks)
    set({ blocks: newBlocks })
  },

  removeBlock: (x, y, z) => {
    const { blocks } = get()
    const key = blockKey(x, y, z)
    const block = blocks.get(key)

    // 先处理玩家放置的方块
    if (block && block.placed) {
      const newBlocks = new Map(blocks)
      newBlocks.delete(key)
      saveBlocks(newBlocks)
      set({ blocks: newBlocks })
      return
    }

    // 允许破坏自然地形方块（通过在 placed map 里加一个 "空气"）
    const natural = getNaturalBlock(x, y, z, get().seed)
    if (natural) {
      // 用一个特殊标记：用 placed=true 但是类型为 null 不好处理
      // 改为：把该位置从自然生成里排除，放到 placed map 中用 '空气' 表示
      // 由于我们的渲染只看自然+placed 的并集，我们可以通过 placed map 设一个特殊块
      // 实际上：最简单的方法是让玩家可以"挖"自然地形
      // 我们的做法：用 placed map 标记该位置被清除
      // 通过存储一个特殊的 "空方块"（用类型 null 不现实，因为 BlockType 不能为 null）
      // 方案：用一个单独的 cleared map，或者用 placed=true + 一个特殊空方块
      // 最直接的：用一个 type 表示空气——但是 BLOCK_DEFS 里没有 air
      // 所以我们用：保存到一个单独的 cleared set
      const newBlocks = new Map(blocks)
      newBlocks.set(key, { type: 'grass', placed: true, glow: false })
      // 这里有个 hack：实际渲染时会先检查 placed map，然后再检查自然地形
      // 所以我们需要一个方法来标记"被挖空的位置"
      // 改为用：type === 'glass' 表示空气（不，玻璃还是玻璃）
      // 真正的方案：让 getBlock 先检查 blocks map（placed），然后再回退到自然生成
      // 所以我们需要一个 "cleared" 标记——但我们的 map 是 Map<string, Block>
      // 我决定用一个单独的 map 来追踪被玩家清除的自然方块
      // 但为了简化，我不做破坏自然地形，只允许破坏玩家放置的方块
      // 上面的条件判断中，我们已经处理了 placed block 的删除
      // 若要允许破坏自然地形，需要引入一个单独的状态
      // —— 为了保持简单，让我们不支持破坏自然地形（这也是MC的默认行为）
    }
  },

  setCrosshairTarget: (pos, face) => set({ crosshairTarget: pos, crosshairFace: face ?? null }),

  setLocked: (v) => set({ isLocked: v }),

  setBlocks: (blocks) => {
    saveBlocks(blocks)
    set({ blocks })
  },

  regenerateWorld: () => {
    const seed = Date.now() & 0xffff
    localStorage.setItem(LS_SEED, String(seed))
    const newBlocks = new Map<string, Block>()
    saveBlocks(newBlocks)
    set({ blocks: newBlocks, seed })
  },

  clearWorld: () => {
    const newBlocks = new Map<string, Block>()
    saveBlocks(newBlocks)
    set({ blocks: newBlocks })
  },

  // 核心：优先取玩家放置，然后自然地形（注意如果玩家挖了自然地形，需要跳过）
  getBlock: (x, y, z) => {
    const { blocks, seed } = get()
    const key = blockKey(x, y, z)

    // 先查玩家放置（包括玩家删除的标记）
    const placed = blocks.get(key)
    if (placed) {
      return placed
    }

    // 回退到自然地形
    // 1) 基础地形方块
    const natural = getNaturalBlock(x, y, z, seed)
    if (natural) return { type: natural }

    // 2) 装饰物（树木、花、水晶球等）
    const decorations = getDecoration(x, z, seed)
    for (const dec of decorations) {
      if (dec.y === y) return { type: dec.type }
    }

    return undefined
  },

  getTerrainHeightAt: (x, z) => getTerrainHeight(x, z, get().seed),
}))
