export const HEAVENLY_STEMS = [
  { key: '甲', name: '甲', element: '木', yinYang: '阳', description: '栋梁之木，阳刚之气' },
  { key: '乙', name: '乙', element: '木', yinYang: '阴', description: '花草之木，柔韧温婉' },
  { key: '丙', name: '丙', element: '火', yinYang: '阳', description: '太阳之火，热情奔放' },
  { key: '丁', name: '丁', element: '火', yinYang: '阴', description: '灯烛之火，温暖细腻' },
  { key: '戊', name: '戊', element: '土', yinYang: '阳', description: '高山之土，厚重稳固' },
  { key: '己', name: '己', element: '土', yinYang: '阴', description: '田园之土，包容滋养' },
  { key: '庚', name: '庚', element: '金', yinYang: '阳', description: '刀剑之金，刚毅果决' },
  { key: '辛', name: '辛', element: '金', yinYang: '阴', description: '珠玉之金，精致细腻' },
  { key: '壬', name: '壬', element: '水', yinYang: '阳', description: '江河之水，奔流不息' },
  { key: '癸', name: '癸', element: '水', yinYang: '阴', description: '雨露之水，润泽万物' },
] as const

export const EARTHLY_BRANCHES = [
  { key: '子', name: '子', element: '水', zodiac: '鼠', description: '智敏灵透' },
  { key: '丑', name: '丑', element: '土', zodiac: '牛', description: '勤恳务实' },
  { key: '寅', name: '寅', element: '木', zodiac: '虎', description: '威猛果敢' },
  { key: '卯', name: '卯', element: '木', zodiac: '兔', description: '温和灵动' },
  { key: '辰', name: '辰', element: '土', zodiac: '龙', description: '胸怀宽广' },
  { key: '巳', name: '巳', element: '火', zodiac: '蛇', description: '聪慧机警' },
  { key: '午', name: '午', element: '火', zodiac: '马', description: '昂扬进取' },
  { key: '未', name: '未', element: '土', zodiac: '羊', description: '善良温厚' },
  { key: '申', name: '申', element: '金', zodiac: '猴', description: '机智多变' },
  { key: '酉', name: '酉', element: '金', zodiac: '鸡', description: '勤勉守时' },
  { key: '戌', name: '戌', element: '土', zodiac: '狗', description: '忠诚可靠' },
  { key: '亥', name: '亥', element: '水', zodiac: '猪', description: '福泽深厚' },
] as const

export const FIVE_ELEMENTS = {
  木: { name: '木', color: 'emerald', direction: '东', season: '春', description: '生发、成长、仁慈', trait: '仁' },
  火: { name: '火', color: 'rose', direction: '南', season: '夏', description: '热情、光明、礼仪', trait: '礼' },
  土: { name: '土', color: 'amber', direction: '中', season: '四季末', description: '承载、稳重、诚信', trait: '信' },
  金: { name: '金', color: 'yellow', direction: '西', season: '秋', description: '刚毅、决断、义气', trait: '义' },
  水: { name: '水', color: 'sky', direction: '北', season: '冬', description: '智慧、流动、柔顺', trait: '智' },
} as const

export const TWELVE_HOUR_PERIODS = [
  { start: 23, end: 1, name: '子时', description: '夜半' },
  { start: 1, end: 3, name: '丑时', description: '鸡鸣' },
  { start: 3, end: 5, name: '寅时', description: '平旦' },
  { start: 5, end: 7, name: '卯时', description: '日出' },
  { start: 7, end: 9, name: '辰时', description: '食时' },
  { start: 9, end: 11, name: '巳时', description: '隅中' },
  { start: 11, end: 13, name: '午时', description: '日中' },
  { start: 13, end: 15, name: '未时', description: '日昳' },
  { start: 15, end: 17, name: '申时', description: '晡时' },
  { start: 17, end: 19, name: '酉时', description: '日入' },
  { start: 19, end: 21, name: '戌时', description: '黄昏' },
  { start: 21, end: 23, name: '亥时', description: '人定' },
] as const

export const ZIWEI_MAIN_STARS = [
  { key: '紫微', name: '紫微', nature: '帝星', description: '领导才能，尊贵之命', element: '土' },
  { key: '天机', name: '天机', nature: '智慧星', description: '聪明机敏，善谋多思', element: '木' },
  { key: '太阳', name: '太阳', nature: '光明星', description: '热情开朗，博爱无私', element: '火' },
  { key: '武曲', name: '武曲', nature: '财星', description: '刚毅果决，财运亨通', element: '金' },
  { key: '天同', name: '天同', nature: '福星', description: '福气深厚，心地善良', element: '水' },
  { key: '廉贞', name: '廉贞', nature: '桃花星', description: '才华横溢，感情丰富', element: '火' },
  { key: '天府', name: '天府', nature: '库星', description: '稳健可靠，财运丰厚', element: '土' },
  { key: '太阴', name: '太阴', nature: '母星', description: '温柔细腻，感情丰富', element: '水' },
  { key: '贪狼', name: '贪狼', nature: '桃花星', description: '多才多艺，人缘极佳', element: '木' },
  { key: '巨门', name: '巨门', nature: '口舌星', description: '口才出众，研究深入', element: '水' },
  { key: '天相', name: '天相', nature: '印星', description: '稳重谦和，辅助之才', element: '水' },
  { key: '天梁', name: '天梁', nature: '荫星', description: '长辈贵人，乐于助人', element: '土' },
  { key: '七杀', name: '七杀', nature: '将星', description: '独立果敢，冲劲十足', element: '金' },
  { key: '破军', name: '破军', nature: '耗星', description: '开创变革，敢于突破', element: '水' },
  { key: '文昌', name: '文昌', nature: '文星', description: '文才出众，学业有成', element: '金' },
  { key: '文曲', name: '文曲', nature: '艺星', description: '艺术天赋，才情横溢', element: '水' },
] as const

export const ZIWEI_12_PALACES = [
  '命宫',
  '兄弟',
  '夫妻',
  '子女',
  '财帛',
  '疾厄',
  '迁移',
  '交友',
  '事业',
  '田宅',
  '福德',
  '父母',
] as const

export const EIGHT_TRIGRAMS = [
  { key: '乾', name: '乾', symbol: '☰', element: '天', nature: '刚健', description: '乾为天，元亨利贞。天行健，君子以自强不息。代表领导、开创、成功。', family: '父' },
  { key: '坤', name: '坤', symbol: '☷', element: '地', nature: '柔顺', description: '地势坤，君子以厚德载物。代表包容、承载、孕育。', family: '母' },
  { key: '震', name: '震', symbol: '☳', element: '雷', nature: '动', description: '震为雷，震惊百里。代表变动、行动、奋发。', family: '长男' },
  { key: '巽', name: '巽', symbol: '☴', element: '风', nature: '入', description: '巽为风，无孔不入。代表随和、渗透、进退。', family: '长女' },
  { key: '坎', name: '坎', symbol: '☵', element: '水', nature: '险', description: '坎为水，重重险陷。代表风险、考验、智慧。', family: '中男' },
  { key: '离', name: '离', symbol: '☲', element: '火', nature: '丽', description: '离为火，光明附丽。代表光明、智慧、文明。', family: '中女' },
  { key: '艮', name: '艮', symbol: '☶', element: '山', nature: '止', description: '艮为山，静止稳固。代表坚守、停止、稳重。', family: '少男' },
  { key: '兑', name: '兑', symbol: '☱', element: '泽', nature: '悦', description: '兑为泽，喜悦愉悦。代表沟通、愉悦、收获。', family: '少女' },
] as const

export const SIXTY_FOUR_HEXAGRAMS = [
  { no: 1, name: '乾为天', trigram: '乾上乾下', meaning: '天行健，君子以自强不息。大吉大利，事业有成。', lines: '☰☰' },
  { no: 2, name: '坤为地', trigram: '坤上坤下', meaning: '地势坤，君子以厚德载物。包容万物，沉稳收获。', lines: '☷☷' },
  { no: 3, name: '水雷屯', trigram: '坎上震下', meaning: '云雷屯，君子以经纶。万事开头难，需耐心积累。', lines: '☵☳' },
  { no: 4, name: '山水蒙', trigram: '艮上坎下', meaning: '山下出泉，蒙。君子以果行育德。启蒙开智，虚心学习。', lines: '☶☵' },
  { no: 5, name: '水天需', trigram: '坎上乾下', meaning: '云上于天，需。君子以饮食宴乐。等待时机，勿急勿躁。', lines: '☵☰' },
  { no: 6, name: '天水讼', trigram: '乾上坎下', meaning: '天与水违行，讼。君子以作事谋始。避免争端，慎始慎终。', lines: '☰☵' },
  { no: 7, name: '地水师', trigram: '坤上坎下', meaning: '地中有水，师。君子以容民畜众。统领有方，用兵谨慎。', lines: '☷☵' },
  { no: 8, name: '水地比', trigram: '坎上坤下', meaning: '地上有水，比。先王以建万国亲诸侯。亲比相助，和衷共济。', lines: '☵☷' },
  { no: 9, name: '风天小畜', trigram: '巽上乾下', meaning: '风行天上，小畜。君子以懿文德。小有所成，积蓄力量。', lines: '☴☰' },
  { no: 10, name: '天泽履', trigram: '乾上兑下', meaning: '上天下泽，履。君子以辨上下定民志。如履薄冰，谨慎前行。', lines: '☰☱' },
  { no: 11, name: '地天泰', trigram: '坤上乾下', meaning: '天地交泰，后以财成天地之道。亨通顺利，万事皆宜。', lines: '☷☰' },
  { no: 12, name: '天地否', trigram: '乾上坤下', meaning: '天地不交，否。君子以俭德辟难。闭塞不通，需隐忍待变。', lines: '☰☷' },
  { no: 13, name: '天火同人', trigram: '乾上离下', meaning: '天与火，同人。君子以类族辨物。志同道合，同心协力。', lines: '☰☲' },
  { no: 14, name: '火天大有', trigram: '离上乾下', meaning: '火在天上，大有。君子以遏恶扬善顺天休命。硕果累累，大有收获。', lines: '☲☰' },
  { no: 15, name: '地山谦', trigram: '坤上艮下', meaning: '地中有山，谦。君子以裒多益寡。谦虚受益，德才兼备。', lines: '☷☶' },
  { no: 16, name: '雷地豫', trigram: '震上坤下', meaning: '雷出地奋，豫。先王以作乐崇德。愉悦顺动，顺势而为。', lines: '☳☷' },
  { no: 17, name: '泽雷随', trigram: '兑上震下', meaning: '泽中有雷，随。君子以向晦入宴息。随顺时势，灵活应变。', lines: '☱☳' },
  { no: 18, name: '山风蛊', trigram: '艮上巽下', meaning: '山下有风，蛊。君子以振民育德。整肃积弊，革故鼎新。', lines: '☶☴' },
  { no: 19, name: '地泽临', trigram: '坤上兑下', meaning: '泽上有地，临。君子以教思无穷容保民无疆。君临天下，积极进取。', lines: '☷☱' },
  { no: 20, name: '风地观', trigram: '巽上坤下', meaning: '风行地上，观。先王以省方观民设教。观察审视，审时度势。', lines: '☴☷' },
  { no: 21, name: '火雷噬嗑', trigram: '离上震下', meaning: '雷电交加，噬嗑。先王以明罚敕法。打破阻碍，排除万难。', lines: '☲☳' },
  { no: 22, name: '山火贲', trigram: '艮上离下', meaning: '山下有火，贲。君子以明庶政无敢折狱。文饰华美，内外兼修。', lines: '☶☲' },
  { no: 23, name: '山地剥', trigram: '艮上坤下', meaning: '山附于地，剥。上以厚下安宅。运势消退，小心谨慎。', lines: '☶☷' },
  { no: 24, name: '地雷复', trigram: '坤上震下', meaning: '雷在地中，复。先王以至日闭关。一阳来复，希望重现。', lines: '☷☳' },
  { no: 25, name: '天雷无妄', trigram: '乾上震下', meaning: '天下雷行，物与无妄。守正道，勿轻举妄动。', lines: '☰☳' },
  { no: 26, name: '山天大畜', trigram: '艮上乾下', meaning: '天在山中，大畜。君子以多识前言往行以畜其德。大有所蓄，厚积薄发。', lines: '☶☰' },
  { no: 27, name: '山雷颐', trigram: '艮上震下', meaning: '山下有雷，颐。君子以慎言语节饮食。颐养身心，修养德性。', lines: '☶☳' },
  { no: 28, name: '泽风大过', trigram: '兑上巽下', meaning: '泽灭木，大过。君子以独立不惧遁世无闷。承受重压，需非常之举。', lines: '☱☴' },
  { no: 29, name: '坎为水', trigram: '坎上坎下', meaning: '水洊至，习坎。君子以常德行习教事。重重险境，需智慧突破。', lines: '☵☵' },
  { no: 30, name: '离为火', trigram: '离上离下', meaning: '明两作，离。大人以继明照于四方。光明普照，文明昌盛。', lines: '☲☲' },
  { no: 31, name: '泽山咸', trigram: '兑上艮下', meaning: '山上有泽，咸。君子以虚受人。感应相通，以诚感人。', lines: '☱☶' },
  { no: 32, name: '雷风恒', trigram: '震上巽下', meaning: '雷风，恒。君子以立不易方。持之以恒，坚守正道。', lines: '☳☴' },
  { no: 33, name: '天山遁', trigram: '乾上艮下', meaning: '天下有山，遁。君子以远小人不恶而严。退避保全，明哲保身。', lines: '☰☶' },
  { no: 34, name: '雷天大壮', trigram: '震上乾下', meaning: '雷在天上，大壮。君子以非礼弗履。气势强盛，勿恃强傲物。', lines: '☳☰' },
  { no: 35, name: '火地晋', trigram: '离上坤下', meaning: '明出地上，晋。君子以自昭明德。旭日东升，光明前进。', lines: '☲☷' },
  { no: 36, name: '地火明夷', trigram: '坤上离下', meaning: '明入地中，明夷。君子以莅众用晦而明。韬光养晦，忍辱负重。', lines: '☷☲' },
  { no: 37, name: '风火家人', trigram: '巽上离下', meaning: '风自火出，家人。君子以言有物而行有恒。家庭和睦，修身齐家。', lines: '☴☲' },
  { no: 38, name: '火泽睽', trigram: '离上兑下', meaning: '上火下泽，睽。君子以同而异。意见分歧，求同存异。', lines: '☲☱' },
  { no: 39, name: '水山蹇', trigram: '坎上艮下', meaning: '山上有水，蹇。君子以反身修德。步履维艰，修身待时。', lines: '☵☶' },
  { no: 40, name: '雷水解', trigram: '震上坎下', meaning: '雷雨作，解。君子以赦过宥罪。冰消瓦解，化险为夷。', lines: '☳☵' },
  { no: 41, name: '山泽损', trigram: '艮上兑下', meaning: '山下有泽，损。君子以惩忿窒欲。有所损失，舍小取大。', lines: '☶☱' },
  { no: 42, name: '风雷益', trigram: '巽上震下', meaning: '风雷，益。君子以见善则迁有过则改。损上益下，受益良多。', lines: '☴☳' },
  { no: 43, name: '泽天夬', trigram: '兑上乾下', meaning: '泽上于天，夬。君子以施禄及下居德则忌。决断果敢，当机立断。', lines: '☱☰' },
  { no: 44, name: '天风姤', trigram: '乾上巽下', meaning: '天下有风，姤。后以施命诰四方。不期而遇，需谨慎应对。', lines: '☰☴' },
  { no: 45, name: '泽地萃', trigram: '兑上坤下', meaning: '泽上于地，萃。君子以除戎器戒不虞。聚集会合，人才汇聚。', lines: '☱☷' },
  { no: 46, name: '地风升', trigram: '坤上巽下', meaning: '地中生木，升。君子以顺德积小以高大。步步高升，稳步前进。', lines: '☷☴' },
  { no: 47, name: '泽水困', trigram: '兑上坎下', meaning: '泽无水，困。君子以致命遂志。困顿窘迫，坚守信念。', lines: '☱☵' },
  { no: 48, name: '水风井', trigram: '坎上巽下', meaning: '木上有水，井。君子以劳民劝相。滋养不竭，修德养民。', lines: '☵☴' },
  { no: 49, name: '泽火革', trigram: '兑上离下', meaning: '泽中有火，革。君子以治历明时。变革更新，除旧布新。', lines: '☱☲' },
  { no: 50, name: '火风鼎', trigram: '离上巽下', meaning: '木上有火，鼎。君子以正位凝命。鼎新革故，事业有成。', lines: '☲☴' },
  { no: 51, name: '震为雷', trigram: '震上震下', meaning: '洊雷，震。君子以恐惧修省。震动警醒，戒惧修德。', lines: '☳☳' },
  { no: 52, name: '艮为山', trigram: '艮上艮下', meaning: '兼山，艮。君子以思不出其位。静止稳固，坚守本分。', lines: '☶☶' },
  { no: 53, name: '风山渐', trigram: '巽上艮下', meaning: '山上有木，渐。君子以居贤德善俗。循序渐进，积少成多。', lines: '☴☶' },
  { no: 54, name: '雷泽归妹', trigram: '震上兑下', meaning: '泽上有雷，归妹。君子以永终知敝。归宿归依，注重长远。', lines: '☳☱' },
  { no: 55, name: '雷火丰', trigram: '震上离下', meaning: '雷电皆至，丰。君子以折狱致刑。丰盛辉煌，盛极防衰。', lines: '☳☲' },
  { no: 56, name: '火山旅', trigram: '离上艮下', meaning: '山上有火，旅。君子以明慎用刑而不留狱。漂泊在外，谨慎行事。', lines: '☲☶' },
  { no: 57, name: '巽为风', trigram: '巽上巽下', meaning: '随风，巽。君子以申命行事。随和顺从，顺势而为。', lines: '☴☴' },
  { no: 58, name: '兑为泽', trigram: '兑上兑下', meaning: '丽泽，兑。君子以朋友讲习。愉悦沟通，广结善缘。', lines: '☱☱' },
  { no: 59, name: '风水涣', trigram: '巽上坎下', meaning: '风行水上，涣。先王以享于帝立庙。涣散离析，凝聚人心。', lines: '☴☵' },
  { no: 60, name: '水泽节', trigram: '坎上兑下', meaning: '泽上有水，节。君子以制数度议德行。节制有度，量入为出。', lines: '☵☱' },
  { no: 61, name: '风泽中孚', trigram: '巽上兑下', meaning: '泽上有风，中孚。君子以议狱缓死。诚信中道，以诚感人。', lines: '☴☱' },
  { no: 62, name: '雷山小过', trigram: '震上艮下', meaning: '山上有雷，小过。君子以行过乎恭丧过乎哀用过乎俭。小有过错，谨小慎微。', lines: '☳☶' },
  { no: 63, name: '水火既济', trigram: '坎上离下', meaning: '水在火上，既济。君子以思患而预防之。功成名就，守成防衰。', lines: '☵☲' },
  { no: 64, name: '火水未济', trigram: '离上坎下', meaning: '火在水上，未济。君子以慎辨物居方。事业未竟，继续努力。', lines: '☲☵' },
] as const

export const FENGSHUI_DIRECTIONS = [
  { key: '坎', direction: '北', element: '水', description: '正北方位，主事业、官运', color: '黑色/蓝色' },
  { key: '艮', direction: '东北', element: '土', description: '东北方位，主子孙、学业', color: '黄色/米色' },
  { key: '震', direction: '东', element: '木', description: '正东方位，主健康、活力', color: '绿色' },
  { key: '巽', direction: '东南', element: '木', description: '东南方位，主财富、名望', color: '绿色/青色' },
  { key: '离', direction: '南', element: '火', description: '正南方位，主名望、感情', color: '红色/紫色' },
  { key: '坤', direction: '西南', element: '土', description: '西南方位，主感情、家庭', color: '黄色/棕色' },
  { key: '兑', direction: '西', element: '金', description: '正西方位，主财运、贵人', color: '金色/白色' },
  { key: '乾', direction: '西北', element: '金', description: '西北方位，主人脉、贵人', color: '白色/金色' },
] as const

export const FACE_READING_FEATURES = [
  { area: '额头', name: '天庭', description: '主早年运势、智力、前程', position: '上停' },
  { area: '眉毛', name: '保寿官', description: '主性格、兄弟缘、健康', position: '上停' },
  { area: '眼睛', name: '监察官', description: '主精神、决断力、感情', position: '中停' },
  { area: '鼻子', name: '审辨官', description: '主财运、中年运、权力', position: '中停' },
  { area: '嘴巴', name: '出纳官', description: '主口才、食禄、晚年运', position: '下停' },
  { area: '耳朵', name: '采听官', description: '主寿元、福气、早年运', position: '上停' },
] as const

export const HAND_READING_LINES = [
  { name: '生命线', description: '主生命力、健康状况、寿命长短', area: '环绕大拇指' },
  { name: '智慧线', description: '主思维能力、决策方式、学业事业', area: '手掌中央' },
  { name: '感情线', description: '主感情观念、恋爱婚姻、人际关系', area: '手指下方' },
  { name: '命运线', description: '主事业运势、人生轨迹、成就大小', area: '手掌中央纵向' },
  { name: '太阳线', description: '主财富、名誉、成功机遇', area: '无名指下方' },
  { name: '婚姻线', description: '主婚姻状况、感情发展', area: '小指下方' },
] as const

export const QIMEN_NINE_PALACES = [
  { no: 1, name: '坎一宫', direction: '北', element: '水', star: '天蓬星', door: '休门', god: '值符' },
  { no: 2, name: '坤二宫', direction: '西南', element: '土', star: '天任星', door: '死门', god: '腾蛇' },
  { no: 3, name: '震三宫', direction: '东', element: '木', star: '天冲星', door: '伤门', god: '太阴' },
  { no: 4, name: '巽四宫', direction: '东南', element: '木', star: '天辅星', door: '杜门', god: '六合' },
  { no: 5, name: '中五宫', direction: '中', element: '土', star: '天禽星', door: '', god: '勾陈' },
  { no: 6, name: '乾六宫', direction: '西北', element: '金', star: '天心星', door: '开门', god: '朱雀' },
  { no: 7, name: '兑七宫', direction: '西', element: '金', star: '天柱星', door: '惊门', god: '九地' },
  { no: 8, name: '艮八宫', direction: '东北', element: '土', star: '天任星', door: '生门', god: '九天' },
  { no: 9, name: '离九宫', direction: '南', element: '火', star: '天英星', door: '景门', god: '太常' },
] as const

export const FIVE_ELEMENT_CYCLE = {
  generates: { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' },
  controls: { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' },
} as const

export const STEM_BRANCH_COMBINATIONS_60 = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥',
] as const

export type FiveElementKey = '木' | '火' | '土' | '金' | '水'
