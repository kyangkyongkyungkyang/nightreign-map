/**
 * 나이트레인 시드 파인더 — 데이터
 */

var MAP_CONFIG = { image: 'images/map/default_map.webp', width: 1000, height: 1000 };

/* ══════════ 보스 (약점/내성 포함) ══════════ */
var BOSSES = [
  { id:"gladius",  name:"Gladius",  nameKo:"글라디우스",  portrait:"images/icon/boss_Gladius.jpg",  weakness:"holy",     resist:["fire"] },
  { id:"adel",     name:"Adel",     nameKo:"아델",        portrait:"images/icon/boss_Adel.jpg",     weakness:"poison",   resist:["fire","lightning"] },
  { id:"gnoster",  name:"Gnoster",  nameKo:"노스터",      portrait:"images/icon/boss_Gnoster.jpg",  weakness:"fire",     resist:["magic"] },
  { id:"maris",    name:"Maris",    nameKo:"마리스",      portrait:"images/icon/boss_Maris.jpg",    weakness:"lightning", resist:["fire"] },
  { id:"libra",    name:"Libra",    nameKo:"리브라",      portrait:"images/icon/boss_Libra.jpg",    weakness:"madness",  resist:["magic"] },
  { id:"fulghor",  name:"Fulghor",  nameKo:"풀고르",      portrait:"images/icon/boss_Fulghor.jpg",  weakness:"lightning", resist:["holy"] },
  { id:"caligo",   name:"Caligo",   nameKo:"칼리고",      portrait:"images/icon/boss_Caligo.jpg",   weakness:"fire",     resist:["magic"] },
  { id:"heolstor", name:"Heolstor", nameKo:"헤올스토르",  portrait:"images/icon/boss_Heolstor.jpg", weakness:"holy",     resist:[] }
];

var ELEMENT_KO = {
  fire:"화염", lightning:"번개", holy:"신성", poison:"독",
  magic:"마력", madness:"광기", rot:"부패", bleed:"출혈",
  frostbite:"동상", sleep:"수면", death:"사신"
};

var ELEMENT_ICONS = {
  fire:"images/icon/element/fire.png", lightning:"images/icon/element/lightning.png",
  holy:"images/icon/element/holy.png", poison:"images/icon/element/poison.png",
  magic:"images/icon/element/magic.png", madness:"images/icon/element/madness.png",
  frostbite:"images/icon/element/frostbite.png", bleed:"images/icon/element/bleed.png",
  death:"images/icon/element/death.png", sleep:"images/icon/element/sleep.png"
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

/* ══════════ 지형 ══════════ */
var EARTHS = [
  { name:"Default",      nameKo:"기본",       icon:"images/icon/map_Default.webp",      mapImage:"images/map/default_map.webp" },
  { name:"Mountaintop",  nameKo:"산령",       icon:"images/icon/map_Mountaintop.webp",  mapImage:"images/map/map_Mountaintop.webp" },
  { name:"Crater",       nameKo:"화구",       icon:"images/icon/map_Crater.webp",       mapImage:"images/map/map_Crater.webp" },
  { name:"Rotted Woods", nameKo:"부패의 숲",  icon:"images/icon/map_RottedWoods.webp",  mapImage:"images/map/map_RottedWoods.webp" },
  { name:"Noklateo",     nameKo:"녹라테오",   icon:"images/icon/map_Noklateo.webp",     mapImage:"images/map/map_Noklateo.webp" }
];

/* ══════════ 거점 타입 아이콘 ══════════ */
var BASE_TYPE_ICONS = {
  "Ruins":"images/icon/Ruins.png", "Camp":"images/icon/Camp.png",
  "Small Camp":"images/icon/Camp.png", "Fort":"images/icon/Fort.png",
  "Great Church":"images/icon/Great Church.png", "Church":"images/icon/Church.png",
  "Sorcerer's Rise":"images/icon/Sorcerers Rise.png", "Township":"images/icon/Township.png"
};
var BASE_TYPE_KO = {
  "Ruins":"폐허","Camp":"진영","Small Camp":"소규모 진영","Fort":"요새",
  "Great Church":"대교회","Church":"교회","Sorcerer's Rise":"마술사의 탑","Township":"마을",
  "Map Event":"맵 이벤트"
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
  { name:"Northeast Lake", x:550,y:540 }, { name:"Northwest Corner", x:200,y:200 },
  { name:"Northwest Lake", x:370,y:700 }, { name:"Northwest Mistwood Pond", x:710,y:530 },
  { name:"Northwest of Castle", x:360,y:460 }, { name:"South Lake", x:480,y:770 },
  { name:"South of Castle", x:430,y:630 }, { name:"Southwest Corner", x:270,y:770 },
  { name:"Southwest Mistwood", x:700,y:690 }, { name:"West Stormhill Graveyard", x:200,y:400 },
  { name:"Noklateo", x:440,y:560 }, { name:"North Crater", x:480,y:200 },
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
  "The Duke's Dear Freja":"공작의 프레이야",
  "Night's Cavalry Duo":"밤의 기병",
  "Gaping Dragon":"탐식의 드래곤",
  "Wormface":"지렁이 얼굴",
  "Valiant Gargoyle":"영웅의 가고일",
  "Tibia Mariner":"티비아의 뱃사공",
  "Smelter Demon":"용철 데몬",
  "Battlefield Commander":"전장의 노장",
  "Ulcerated Tree Spirit":"문드러진 나무령",
  "Centipede Demon":"지네 데몬",
  "Royal Revenant":"왕족의 망령",
  "Grafted Monarch":"접목의 군주",
  "Demi-Human Queen and Swordmaster":"아인 여왕과 검술사",
  /* ─── 2일차 밤보스 (2.2) ─── */
  "Morgott":"끔찍한 흉조",
  "Ancient Dragon":"고룡",
  "Crucible Knight and Golden Hippopotamus":"도가니의 기사와 황금 하마",
  "Outland Commander":"벽지의 노장",
  "Dragonkin Soldier":"용인병",
  "Great Wyrm":"대토룡",
  "Draconic Tree Sentinel and Royal Cavalrymen":"용의 트리 가드와 도읍 기병",
  "Tree Sentinel and Royal Cavalrymen":"트리 가드와 도읍 기병",
  "Godskin Duo":"신의 살갗의 귀인과 사도",
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
  /* ─── 봉인감옥 (에버골) ─── */
  "Nox Warriors":"녹스의 전사",
  "Bloodhound Knight":"사냥개의 기사",
  "Beastmen of Farum Azula":"파름 아즐라의 수인",
  "Grave Warden Duelist":"묘지기 투사",
  "Banished Knights":"추방된 기사",
  "Godskin Apostle":"신의 살갗의 사도",
  "Crucible Knight with Sword":"도가니의 기사(검)",
  "Crucible Knight with Spear":"도가니의 기사(창)",
  "Beastly Brigade":"수인 부대",
  "Crystalians":"결정인",
  "Omen":"흉조",
  "Godskin Noble":"신의 살갗의 귀인",
  /* ─── 부패의 숲 ─── */
  "Putrid Ancestral Followers":"부패한 선조 추종자",
  /* ─── 성채 ─── */
  "Trolls":"트롤",
  "Crucible Knights":"도가니의 기사",
  /* ─── 거점 적군 (Major / Minor Base) ─── */
  "Albinauric Archers":"알비노릭 궁수",
  "Albinaurics":"알비노릭",
  "Ancient Heroes of Zamor":"자미엘의 옛 영웅",
  "Depraved Perfumer":"타락 조향사",
  "Fire Monk":"화염 수도사",
  "Flame Chariots":"화염 전차",
  "Frenzied Flame Troll":"광란의 불꽃 트롤",
  "Oracle Envoys":"신탁 사자",
  "Perfumer":"조향사",
  "Redmane Knights":"적갈기 기사",
  "Royal Army Knights":"왕군 기사",
  "Sanguine Noble":"피의 귀인",
  "Runebear":"룬 곰",
  "Battlemages":"전투 마술사",
  "Guardian Golem":"수호 골렘",
  "Mausoleum Knight":"영묘 기사",
  "Abductor Virgin":"철처녀",
  "Lordsworn Captain":"충의의 대장",
  "Erdtree Burial Watchdogs":"황금 나무 매장 감시견"
};
