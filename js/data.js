/** 나이트레인 시드 파인더 — 데이터 */

var MAP_CONFIG = { image: 'images/map/default_map.webp', width: 1000, height: 1000 };

/* ══════════ 보스 (약점/내성 포함) ══════════ */
var BOSSES = [
  { id:"gladius",  name:"Gladius",  nameKo:"글라디우스",  portrait:"images/icon/boss_Gladius.jpg",  weakness:"holy",     resist:["fire"] },
  { id:"adel",     name:"Adel",     nameKo:"에델레",        portrait:"images/icon/boss_Adel.jpg",     weakness:"poison",   resist:["fire","lightning"] },
  { id:"gnoster",  name:"Gnoster",  nameKo:"그노스터",      portrait:"images/icon/boss_Gnoster.jpg",  weakness:"fire",     resist:["magic"] },
  { id:"maris",    name:"Maris",    nameKo:"마리스",      portrait:"images/icon/boss_Maris.jpg",    weakness:"lightning", resist:["fire"] },
  { id:"libra",    name:"Libra",    nameKo:"리브라",      portrait:"images/icon/boss_Libra.jpg",    weakness:"madness",  resist:["magic"] },
  { id:"fulghor",  name:"Fulghor",  nameKo:"풀고르",      portrait:"images/icon/boss_Fulghor.jpg",  weakness:"lightning", resist:["holy"] },
  { id:"caligo",   name:"Caligo",   nameKo:"칼리고",      portrait:"images/icon/boss_Caligo.jpg",   weakness:"fire",     resist:["magic"] },
  { id:"heolstor", name:"Heolstor", nameKo:"밤을본뜬자",  portrait:"images/icon/boss_Heolstor.jpg", weakness:"holy",     resist:[] }
];

var ELEMENT_KO = {
  fire:"화염", lightning:"벼락", holy:"신성", poison:"독",
  magic:"마력", madness:"발광", rot:"붉은부패", bleed:"출혈",
  frostbite:"동상", sleep:"수면", death:"죽음"
};

var ELEMENT_ICONS = {
  fire:"images/icon/element/fire.png", lightning:"images/icon/element/lightning.png",
  holy:"images/icon/element/holy.png", poison:"images/icon/element/poison.png",
  magic:"images/icon/element/magic.png", madness:"images/icon/element/madness.png",
  frostbite:"images/icon/element/frostbite.png", bleed:"images/icon/element/bleed.png",
  death:"images/icon/element/death.png", sleep:"images/icon/element/sleep.png",
  rot:"images/icon/element/rot.png"
};

/* ══════════ 적-속성 매핑 (Major Base 전용) ══════════ */
var ENEMY_ELEMENT = {
  "Albinauric Archers":"frostbite", "Albinaurics":"holy",
  "Ancient Heroes of Zamor":"frostbite", "Beastmen of Farum Azula":"lightning",
  "Crystalians":"magic", "Depraved Perfumer":"poison",
  "Fire Monk":"fire", "Flame Chariots":"fire",
  "Frenzied Flame Troll":"madness", "Oracle Envoys":"holy",
  "Perfumer":"poison", "Redmane Knights":"fire",
  "Royal Army Knights":"lightning", "Wormface":"death",
  "Sanguine Noble":"bleed", "Runebear":"sleep",
  "Battlemages":"magic", "Leonine Misbegotten":null,
  "Guardian Golem":null, "Mausoleum Knight":null,
  "Banished Knights":null, "Elder Lion":null,
  "Abductor Virgin":null, "Lordsworn Captain":null,
  "Erdtree Burial Watchdogs":null
};

/* ══════════ 밤의 왕 약점표 ══════════ */
/* dmg:[표준,참격,타격,관통,마력,화염,벼락,신성] (%), sts:[독,부패,출혈,동상,수면,발광] (내성치, null=면역) */
var BOSS_DAMAGE = {
  gladius:  [{ dmg:[0,0,0,10,0,-50,0,35], sts:[542,252,252,541,154,null] }],
  adel:     [{ dmg:[0,0,0,0,0,-20,-50,0], sts:[154,154,541,154,154,null] }],
  gnoster:  [
    { name:"나방",  dmg:[15,25,15,25,-50,40,-10,-10], sts:[541,154,154,154,541,null] },
    { name:"전갈",  dmg:[-10,-20,20,10,-10,35,-10,-10], sts:[252,154,154,154,154,null] }
  ],
  maris:    [{ dmg:[0,15,-20,-10,-20,-50,40,-15], sts:[null,252,null,252,null,null] }],
  libra:    [{ dmg:[0,10,0,0,-20,20,0,35], sts:[154,154,252,252,null,154] }],
  fulghor:  [{ dmg:[0,0,0,0,0,0,20,-30], sts:[154,154,154,154,154,null] }],
  caligo:   [{ dmg:[0,-15,15,-10,-20,35,-20,-20], sts:[252,252,252,541,541,null] }],
  heolstor: [
    { name:"1페이즈", dmg:[0,15,-10,10,0,20,0,35], sts:[null,252,null,null,541,null] },
    { name:"2페이즈", dmg:[0,-10,10,15,0,0,20,20], sts:[null,252,null,null,541,null] }
  ]
};

/* ══════════ 필드보스 등급 ══════════ */
var MINOR_FIELD_BOSSES = [
  "Grafted Scion","Leonine Misbegotten","Red Wolf","Elder Lion",
  "Night's Cavalry","Golden Hippopotamus","Miranda Blossom",
  "Demi-Human Queen","Flying Dragon","Ancient Hero of Zamor",
  "Wyvern","Commander O'Neill","Greataxe Soldier"
];

/* ══════════ 지형 ══════════ */
var EARTHS = [
  { name:"Default",      nameKo:"기본",       icon:"images/icon/map_Default.webp",      mapImage:"images/map/default_map.webp" },
  { name:"Mountaintop",  nameKo:"산령",       icon:"images/icon/map_Mountaintop.webp",  mapImage:"images/map/map_Mountaintop.webp" },
  { name:"Crater",       nameKo:"화구",       icon:"images/icon/map_Crater.webp",       mapImage:"images/map/map_Crater.webp" },
  { name:"Rotted Woods", nameKo:"부패의 숲",  icon:"images/icon/map_RottedWoods.webp",  mapImage:"images/map/map_RottedWoods.webp" },
  { name:"Noklateo",     nameKo:"노크라테오",   icon:"images/icon/map_Noklateo.webp",     mapImage:"images/map/map_Noklateo.webp" }
];

/* ══════════ 거점 타입 아이콘 ══════════ */
var BASE_TYPE_ICONS = {
  "Ruins":"images/icon/Ruins.png", "Camp":"images/icon/Camp.png",
  "Small Camp":"images/icon/Camp.png", "Fort":"images/icon/Fort.png",
  "Great Church":"images/icon/Great Church.png", "Church":"images/icon/Church.png",
  "Sorcerer's Rise":"images/icon/Sorcerers Rise.png", "Township":"images/icon/Township.png"
};
var BASE_TYPE_KO = {
  "Ruins":"유적","Camp":"대야영지","Small Camp":"작은야영지","Fort":"작은성채",
  "Great Church":"대교회","Church":"교회","Sorcerer's Rise":"마술사탑","Township":"마을",
  "Map Event":"습격 이벤트"
};

/* ══════════ 좌표 데이터 ══════════ */
var SPAWN_POINTS = [
  { name:"Northeast of Saintsbridge",       x:520, y:210 },
  { name:"West of Warmaster's Shack",       x:230, y:350 },
  { name:"Below Summonwater Hawk",          x:670, y:390 },
  { name:"Above Stormhill Tunnel Entrance", x:350, y:410 },
  { name:"Stormhill South of Gate",         x:210, y:560 },
  { name:"Minor Erdtree",                   x:810, y:590 },
  { name:"East of Cavalry Bridge",          x:550, y:670 },
  { name:"Far Southwest",                   x:200, y:750 },
  { name:"Southeast of Lake",              x:560, y:810 }
];

var MAJOR_BASE_LOCATIONS = [
  { name:"South Lake", x:400,y:780 }, { name:"Groveside", x:280,y:650 },
  { name:"Gatefront", x:310,y:540 }, { name:"Stormhill North of Gate", x:280,y:450 },
  { name:"Alexander Spot", x:420,y:310 }, { name:"Northwest Stormhill", x:230,y:280 },
  { name:"Northeast Stormhill", x:400,y:200 }, { name:"South Mistwood", x:750,y:750 },
  { name:"Waypoint Ruins", x:610,y:690 }, { name:"Minor Erdtree", x:760,y:640 },
  { name:"West Mistwood", x:630,y:590 }, { name:"Northwest Mistwood", x:660,y:470 },
  { name:"Artist's Shack", x:580,y:440 }, { name:"Northeast Mistwood", x:780,y:430 },
  { name:"Summonwater Approach", x:630,y:290 }, { name:"Summonwater", x:720,y:230 }
];

var MINOR_BASE_LOCATIONS = [
  { name:"Far Southwest", x:200,y:710 }, { name:"Lake", x:450,y:700 },
  { name:"Stormhill South of Gate", x:210,y:550 },
  { name:"Above Stormhill Tunnel Entrance", x:360,y:390 },
  { name:"West of Warmaster's Shack", x:210,y:360 },
  { name:"Southeast of Lake", x:570,y:800 }, { name:"East of Cavalry Bridge", x:550,y:630 },
  { name:"Minor Erdtree", x:810,y:580 }, { name:"Below Summonwater Hawk", x:690,y:370 },
  { name:"Third Church", x:770,y:350 }, { name:"Northeast of Saintsbridge", x:540,y:230 }
];

var FIELD_BOSS_LOCATIONS = [
  { name:"Castle Basement", x:480,y:540 }, { name:"Castle Rooftop", x:430,y:510 },
  { name:"Far Southwest of Lake", x:310,y:820 }, { name:"Lake", x:430,y:730 },
  { name:"North of Stormhill Tunnel Entrance", x:310,y:380 },
  { name:"North of Murkwater Terminus", x:470,y:345 },
  { name:"Stormhill Spectral Hawk", x:330,y:230 },
  { name:"Northwest Stormhill Cliffside", x:290,y:190 },
  { name:"Mistwood Spectral Hawk", x:690,y:780 }, { name:"North Mistwood", x:760,y:510 },
  { name:"East of Murkwater Terminus", x:550,y:380 },
  { name:"Northwest of Summonwater", x:640,y:220 }
];

var EVERGAOL_LOCATIONS = [
  { name:"Northwest of Lake", x:350,y:640 }, { name:"Murkwater Terminus", x:450,y:390 },
  { name:"Stormhill", x:170,y:320 }, { name:"Highroad", x:480,y:200 },
  { name:"East of Lake", x:620,y:770 }, { name:"Mistwood", x:790,y:490 },
  { name:"Northeast Tunnel Entrance", x:630,y:360 }
];

var NIGHT_CIRCLE_LOCATIONS = [
  { name:"East of Saintsbridge", x:570,y:270 }, { name:"Northeast Corner", x:800,y:240 },
  { name:"Northeast of Lake", x:550,y:540 }, { name:"Northwest Corner", x:200,y:200 },
  { name:"Northwest Lake", x:370,y:700 }, { name:"Northwest Mistwood Pond", x:710,y:530 },
  { name:"Northwest of Castle", x:360,y:460 }, { name:"South Lake", x:480,y:770 },
  { name:"South of Castle", x:430,y:630 }, { name:"Southwest Corner", x:270,y:770 },
  { name:"Southwest Mistwood", x:700,y:690 }, { name:"West Stormhill Graveyard", x:200,y:400 },
  { name:"Noklateo Entrance", x:440,y:560 }, { name:"North of Crater", x:480,y:200 },
  { name:"Northwest Rotted Woods", x:730,y:540 }, { name:"Southeast Mountaintop", x:400,y:400 },
  { name:"Southeast Rotted Woods", x:610,y:700 }
];

var ROTTED_WOODS_FB_LOCATIONS = [
  { name:"Southwest", x:640,y:740 }, { name:"Southeast", x:780,y:690 },
  { name:"Center West", x:600,y:610 }, { name:"Center East", x:720,y:630 },
  { name:"Far Northwest", x:570,y:560 }, { name:"Northwest", x:640,y:550 },
  { name:"Northeast", x:770,y:600 }, { name:"Far Northeast", x:780,y:550 }
];

var ROT_BLESSING_LOCATIONS = [
  { name:"West", x:550,y:660 }, { name:"Northeast", x:820,y:600 }, { name:"Southwest", x:640,y:790 }
];

var CASTLE_LOCATION = { x:430, y:530 };
var MERCHANT_LOCATIONS = [
  { name:"South of Castle", x:440,y:600 }, { name:"Ruins North of Castle", x:420,y:470 },
  { name:"Northeast Corner", x:800,y:200 }, { name:"Southeast Lakeshore", x:550,y:830 },
  { name:"Castle Front", x:400,y:550 }, { name:"East of Saintsbridge", x:570,y:250 },
  { name:"Southwest Corner", x:200,y:800 }, { name:"Northwest Corner", x:200,y:200 }
];

var MARKER_COLORS = {
  nightCircle:{ bg:"#ff9800", border:"#e65100" },
  rottedWoods:{ bg:"#795548", border:"#4e342e" },
  rotBlessing:{ bg:"#e91e63", border:"#880e4f" },
  merchant:{ bg:"#00bcd4", border:"#00838f" },
  unknown:{ bg:"#9e9e9e", border:"#616161" }
};

/* ══════════ 한글 명칭 (나무위키 기준) ══════════ */
var NAME_KO = {
  /* ─── 1일차 밤보스 (2.2) ─── */
  "Bell Bearing Hunter":"방울 사냥꾼",
  "The Duke's Dear Freja":"공작의 프레이자",
  "Night's Cavalry Duo":"밤의 기병",
  "Gaping Dragon":"탐식의 드래곤",
  "Wormface":"지렁이 얼굴",
  "Valiant Gargoyle":"영웅의 가고일",
  "Tibia Mariner":"티비아의 배",
  "Smelter Demon":"용철 데몬",
  "Battlefield Commander":"전장의 노장",
  "Ulcerated Tree Spirit":"문드러진 나무령",
  "Centipede Demon":"지네 데몬",
  "Royal Revenant":"왕족의 망령",
  "Grafted Monarch":"접목의 군주",
  "Demi-Human Queen and Swordmaster":"아인 여왕 & 아인 검성",
  /* ─── 2일차 밤보스 (2.2) ─── */
  "Morgott":"끔찍한 흉조",
  "Ancient Dragon":"고룡",
  "Crucible Knight and Golden Hippopotamus":"도가니의 기사 & 황금 하마",
  "Outland Commander":"벽지의 노장",
  "Dragonkin Soldier":"용인병",
  "Great Wyrm":"대토룡",
  "Draconic Tree Sentinel and Royal Cavalrymen":"용의 트리 가드 & 도읍 기병",
  "Tree Sentinel and Royal Cavalrymen":"트리 가드 & 도읍 기병",
  "Godskin Duo":"신의 살갗의 귀인 & 신의 살갗의 사도",
  "Fallingstar Beast":"내리는 별의 짐승 성체",
  "Death Rite Bird":"죽음 의례의 새",
  "Nameless King":"이름 없는 왕",
  "Dancer of the Boreal Valley":"차가운 골짜기의 무희",
  /* ─── 필드보스 (2.3 두려운 강적) ─── */
  "Black Blade Kindred":"흑검의 권속",
  "Ancestor Spirit":"선조령",
  "Magma Wyrm":"용암토룡",
  "Large Erdtree Avatar":"황금 나무의 화신",
  "Erdtree Avatar":"황금 나무의 화신",
  "Tree Sentinel":"트리 가드",
  "Draconic Tree Sentinel":"용의 트리 가드",
  "Royal Carian Knight":"카리아 친위기사",
  /* ─── 필드보스 (2.3 강적) ─── */
  "Grafted Scion":"접목의 귀공자",
  "Leonine Misbegotten":"사자 혼종",
  "Red Wolf":"국서의 붉은 늑대",
  "Elder Lion":"늙은 사자",
  "Night's Cavalry":"밤의 기병",
  "Golden Hippopotamus":"황금 하마",
  "Miranda Blossom":"미란다플라워",
  "Demi-Human Queen":"아인 여왕",
  "Flying Dragon":"비룡",
  "Ancient Hero of Zamor":"자미엘의 옛 영웅",
  "Wyvern":"비룡",
  "Commander O'Neill":"노장 오닐",
  "Greataxe Soldier":"대도끼 병사",
  /* ─── 봉인감옥 ─── */
  "Nox Warriors":"녹스의 전사들",
  "Bloodhound Knight":"사냥개기사",
  "Beastmen of Farum Azula":"파름 아즈라의 수인들",
  "Grave Warden Duelist":"묘지기 투사",
  "Banished Knights":"땅 잃은 기사들",
  "Godskin Apostle":"신의 살갗의 사도",
  "Crucible Knight with Sword":"도가니의 기사(검)",
  "Crucible Knight with Spear":"도가니의 기사(창)",
  "Beastly Brigade":"수인 부대",
  "Crystalians":"결정인",
  "Omen":"흉조의 아이",
  "Godskin Noble":"신의 살갗의 귀인",
  /* ─── 성채 ─── */
  "Trolls":"트롤",
  "Crucible Knights":"도가니의 기사",
  /* ─── 거점 적군 (Major / Minor Base) ─── */
  "Albinauric Archers":"백금의 사수들",
  "Albinaurics":"백금의 사람들",
  "Ancient Heroes of Zamor":"자미엘의 옛 영웅들",
  "Depraved Perfumer":"타락한 조향사",
  "Fire Monk":"불의 승병",
  "Flame Chariots":"불 전차부대",
  "Frenzied Flame Troll":"미친 불 트롤",
  "Oracle Envoys":"신탁의 사도들",
  "Perfumer":"조향사",
  "Redmane Knights":"적사자 기사들",
  "Royal Army Knights":"도읍군 기사들",
  "Sanguine Noble":"피의 귀족",
  "Runebear":"룬베어",
  "Battlemages":"전쟁마술사들",
  "Guardian Golem":"가디언 골렘",
  "Mausoleum Knight":"영묘 기사",
  "Abductor Virgin":"납치하는 소녀 인형",
  "Lordsworn Captain":"군주군 병사장",
  "Erdtree Burial Watchdogs":"환수의 파수견",
  /* ─── 누락 보스/적 ─── */
  "Black Knife Assassin":"검은 칼날의 자객",
  "Stoneskin Lords":"돌 피부의 왕들",
  /* ─── 습격 이벤트 ─── */
  "Day 1 Night Horde":"1일차 밤의 세력",
  "Day 2 Night Horde":"2일차 밤의 세력",
  "Day 1 Extra Night Boss":"1일차 새로운 밤의 위협",
  "Day 2 Extra Night Boss":"2일차 새로운 밤의 위협",
  "Day 1 Gnoster Plague":"1일차 황충해",
  "Day 2 Gnoster Plague":"2일차 황충해",
  "Day 1 Libra Curse":"1일차 악마의 저주",
  "Day 2 Libra Curse":"2일차 악마의 저주",
  "Day 1 Maris Bubbles":"1일차 거대한 물거품",
  "Day 2 Maris Bubbles":"2일차 거대한 물거품",
  "Day 1 Meteor Strike":"1일차 운석 충돌",
  "Day 2 Meteor Strike":"2일차 운석 충돌",
  "Day 1 Morgott Invasion":"1일차 끔찍한 흉조",
  "Day 2 Morgott Invasion":"2일차 끔찍한 흉조",
  "Walking Mausoleum":"영묘",
  "Frenzy Tower":"미친 불",
  "Difficult Sorcerer's Rise":"오래된 마술사탑",
  /* ─── 소규모 거점 상세 (Small Camp / Church / Sorcerer's Rise / Township) ─── */
  "Normal":"일반",
  "Fog Door":"안개문",
  "Unlit Candle":"꺼진 촛불",
  "Missing Statue":"없는 석상",
  "Above Door":"문 위",
  "Imp Statue":"꼬마 석상",
  "Fake Building":"가짜 건물",
  "Dogs":"개",
  "Dogs and Soldiers":"개와 병사",
  "Demi-Humans":"아인",
  "Caravans":"호송대",
  "Caravans and Nobles":"호송대와 귀족",
  "Wandering Nobles":"방랑 귀족",
  "Guilty":"죄인",
  "Misbegotten":"혼종",
  "Soldiers":"병사",
  "Rats":"쥐",
  "Rats and Demi-Humans":"쥐와 아인",
  "Nobles and Soldiers":"귀족과 병사",
  "Foot Soldiers":"보병",
  "Shack":"오두막",
  "Township":"마을",
  "Withered Trees":"시든 나무",
  "Windy Trees":"바람 나무",
  "Pool Reflection":"웅덩이 반사",
  "Fleeing Stump":"도망치는 그루터기",
  "Second Floor":"2층",
  "Right of Door":"문 오른쪽",
  "Rear Withered Trees":"뒤쪽 시든 나무",
  "Teleporting Trees":"순간이동 나무",
  /* ─── 오래된 마술사탑 복합 상세 ─── */
  "Above Door, Teleporting Trees, Missing Statue":"문 위, 순간이동 나무, 없는 석상",
  "Fake Building, Pool Reflection, Second Floor":"가짜 건물, 웅덩이 반사, 2층",
  "Fake Building, Right of Door, Unlit Candle":"가짜 건물, 문 오른쪽, 꺼진 촛불",
  "Imp Statue, Teleporting Trees, Fleeing Stump":"꼬마 석상, 순간이동 나무, 도망치는 그루터기",
  "Imp Statue, Windy Trees, Second Floor":"꼬마 석상, 바람 나무, 2층",
  "Rear Withered Trees, Right of Door, Missing Statue":"뒤쪽 시든 나무, 문 오른쪽, 없는 석상",
  /* ─── 위치명: 주요 거점 ─── */
  "South Lake":"호수 남쪽",
  "Groveside":"수풀 옆",
  "Gatefront":"관문 앞",
  "Stormhill North of Gate":"폭풍 언덕 관문 북쪽",
  "Alexander Spot":"알렉산더 지점",
  "Northwest Stormhill":"폭풍 언덕 북서쪽",
  "Northeast Stormhill":"폭풍 언덕 북동쪽",
  "South Mistwood":"안개숲 남쪽",
  "Waypoint Ruins":"길잡이 유적",
  "Minor Erdtree":"소황금나무",
  "West Mistwood":"안개숲 서쪽",
  "Northwest Mistwood":"안개숲 북서쪽",
  "Artist's Shack":"화가의 오두막",
  "Northeast Mistwood":"안개숲 북동쪽",
  "Summonwater Approach":"소환수 진입로",
  "Summonwater":"소환수 마을",
  /* ─── 위치명: 소규모 거점 ─── */
  "Far Southwest":"남서쪽 끝",
  "Lake":"호수",
  "Stormhill South of Gate":"폭풍 언덕 관문 남쪽",
  "Above Stormhill Tunnel Entrance":"폭풍 언덕 갱도 입구 위",
  "West of Warmaster's Shack":"전기 사부의 오두막 서쪽",
  "Southeast of Lake":"호수 남동쪽",
  "East of Cavalry Bridge":"기병 다리 동쪽",
  "Below Summonwater Hawk":"소환수 매 아래",
  "Third Church":"제3교회",
  "Northeast of Saintsbridge":"성인교 북동쪽",
  /* ─── 위치명: 봉인감옥 ─── */
  "Northwest of Lake":"호수 북서쪽",
  "Murkwater Terminus":"탁류동 종점",
  "Stormhill":"폭풍 언덕",
  "Highroad":"큰 길",
  "East of Lake":"호수 동쪽",
  "Mistwood":"안개숲",
  "Northeast Tunnel Entrance":"북동 갱도 입구",
  /* ─── 위치명: 필드 보스 ─── */
  "Castle Basement":"성 지하",
  "Castle Rooftop":"성 옥상",
  "Far Southwest of Lake":"호수 남서쪽 끝",
  "North of Stormhill Tunnel Entrance":"폭풍 언덕 갱도 입구 북쪽",
  "North of Murkwater Terminus":"탁류동 종점 북쪽",
  "Stormhill Spectral Hawk":"폭풍 언덕 유령매",
  "Northwest Stormhill Cliffside":"폭풍 언덕 북서 절벽",
  "Mistwood Spectral Hawk":"안개숲 유령매",
  "North Mistwood":"안개숲 북쪽",
  "East of Murkwater Terminus":"탁류동 종점 동쪽",
  "Northwest of Summonwater":"소환수 마을 북서쪽",
  /* ─── 위치명: 부패의 숲 ─── */
  "Center West":"중앙 서쪽",
  "Center East":"중앙 동쪽",
  "Far Northwest":"최북서",
  "Far Northeast":"최북동",
  /* ─── 위치명: 밤 서클 ─── */
  "East of Saintsbridge":"성인교 동쪽",
  "Northeast Corner":"북동쪽 끝",
  "Northeast of Lake":"호수 북동쪽",
  "Northwest Corner":"북서쪽 끝",
  "Northwest Lake":"호수 북서쪽",
  "Northwest Mistwood Pond":"안개숲 북서 연못",
  "Northwest of Castle":"성 북서쪽",
  "South of Castle":"성 남쪽",
  "Southwest Corner":"남서쪽 끝",
  "Southwest Mistwood":"안개숲 남서쪽",
  "West Stormhill Graveyard":"폭풍 언덕 서쪽 묘지",
  "Noklateo Entrance":"노크라테오 입구",
  "North of Crater":"화구 북쪽",
  "Southeast Mountaintop":"산령 남동쪽",
  "Northwest Rotted Woods":"부패의 숲 북서쪽",
  "Southeast Rotted Woods":"부패의 숲 남동쪽",
  /* ─── 위치명: 상인 ─── */
  "Castle Front":"성 정문",
  "Ruins North of Castle":"성 북쪽 유적",
  "Southeast Lakeshore":"호수 남동 호숫가",
  /* ─── 방향 (부패 축복 / 발광의 탑 / 공용) ─── */
  "North":"북쪽",
  "South":"남쪽",
  "Northeast":"북동쪽",
  "Northwest":"북서쪽",
  "Southeast":"남동쪽",
  "Southwest":"남서쪽",
  "West":"서쪽"
};
