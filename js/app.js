/**
 * 나이트레인 시드 파인더
 *
 * 시드 확정 후 "미니맵 모드":
 *   모든 마커에 적/보스 이름을 영구 라벨로 표시,
 *   클릭 상호작용 없이 한눈에 정보를 확인할 수 있도록 함.
 *
 * 식별: full-value 레벨 (건물 타입 + 적 속성)으로 정밀 구분
 * 약점 매칭: 보스 약점과 거점 속성이 같으면 초록 테두리
 */
(function () {
  'use strict';

  /* ══════════ 상태 ══════════ */
  var state = {
    earth: null,
    bossId: null,
    spawnName: null,
    candidates: [],
    identified: {},       // { locName: fullValue }
    selectedSeedId: null,
    showingUnder: false
  };

  var map;
  var mapOverlay;
  var mapBounds;
  var allMarkers = [];

  /* ── DOM 캐시 ── */
  var $ = function (s) { return document.querySelector(s); };
  var dom = {};

  function cacheDom() {
    dom = {
      bossGrid:        $('#boss-grid'),
      bossInfo:        $('#boss-info'),
      earthGrid:       $('#earth-grid'),
      statusBar:       $('#status-bar'),
      statusText:      $('#status-text'),
      identifiedChips: $('#identified-chips'),
      resetBtn:        $('#reset-btn'),
      specialEvent:    $('#special-event'),
      legend:          $('#legend'),
      legendItems:     $('#legend-items'),
      modal:           $('#modal'),
      modalTitle:      $('#modal-title'),
      modalInfo:       $('#modal-info'),
      modalImage:      $('#modal-image'),
      modalImageWrap:  $('#modal-image-wrap'),
      modalClose:      $('#modal-close'),
      modalBg:         $('#modal .modal-bg'),
      modalToggle:     $('#modal-toggle-under')
    };
  }

  /* ══════════ 유틸 ══════════ */
  function findBoss(id) {
    return BOSSES.find(function (b) { return b.id === id; });
  }

  /** "Ruins - Depraved Perfumer" → "Ruins" */
  function parseBaseType(val) {
    if (!val) return '';
    var i = val.indexOf(' - ');
    return i > 0 ? val.substring(0, i) : val;
  }

  /** "Ruins - Depraved Perfumer" → "Depraved Perfumer" */
  function parseEnemyName(val) {
    if (!val) return '';
    var i = val.indexOf(' - ');
    return i > 0 ? val.substring(i + 3) : val;
  }

  function getTypeIcon(type) {
    return BASE_TYPE_ICONS[type] || BASE_TYPE_ICONS['Ruins'] || '';
  }

  function getTypeKo(type) {
    return BASE_TYPE_KO[type] || type;
  }

  function getEarthKo(name) {
    var e = EARTHS.find(function (earth) { return earth.name === name; });
    return e ? e.nameKo : name;
  }

  /** 적 이름 → 속성 (null = 무속성) */
  function getEnemyElement(enemyName) {
    if (!enemyName || !ENEMY_ELEMENT) return null;
    var el = ENEMY_ELEMENT[enemyName];
    return el !== undefined ? el : null;
  }

  /** 영문 → 한글 변환 */
  function toKo(name) {
    return (typeof NAME_KO !== 'undefined' && NAME_KO[name]) || name;
  }
  function bossNameKo(name) {
    var b = BOSSES.find(function (boss) { return boss.name === name; });
    return b ? b.nameKo : name;
  }

  /** 현재 보스의 약점과 속성 매칭 여부 */
  function isWeaknessMatch(element) {
    if (!element || !state.bossId) return false;
    var boss = findBoss(state.bossId);
    return boss && boss.weakness === element;
  }

  /* ══════════ 맵 초기화 ══════════ */
  function initMap() {
    var w = MAP_CONFIG.width, h = MAP_CONFIG.height;
    var bounds = [[0, 0], [-h, w]];

    map = L.map('map', {
      crs: L.CRS.Simple,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: false,
      attributionControl: false,
      maxBounds: [[-h - 100, -100], [100, w + 100]],
      maxBoundsViscosity: 0.8
    });

    mapBounds = bounds;
    mapOverlay = L.imageOverlay(MAP_CONFIG.image, bounds).addTo(map);
    map.fitBounds(bounds);
  }

  function toLatLng(x, y) { return [-y, x]; }

  /* ══════════ 마커 유틸 ══════════ */
  function clearMarkers() {
    allMarkers.forEach(function (m) { map.removeLayer(m); });
    allMarkers = [];
  }

  function addMarker(m) { allMarkers.push(m); return m; }

  /** 스폰 아이콘 */
  function makeSpawnIcon(selected) {
    var sz = selected ? 90 : 72;
    return L.icon({
      iconUrl: 'images/icon/spawn.png',
      iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2], popupAnchor: [0, -sz / 2],
      className: 'spawn-marker' + (selected ? ' spawn-marker-selected' : '')
    });
  }

  /** "?" 미식별 마커 */
  function makeUnknownIcon(sz) {
    return L.divIcon({
      className: '',
      html: '<div class="map-marker-unknown" style="width:' + sz + 'px;height:' + sz +
            'px;font-size:' + Math.round(sz * 0.48) + 'px;">?</div>',
      iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2], popupAnchor: [0, -sz / 2]
    });
  }

  /** 거점 아이콘 (속성 뱃지 + 약점 매칭 지원) */
  function makeBaseIcon(type, element, sz, weakMatch) {
    var src = getTypeIcon(type);
    var cls = 'base-icon-marker' + (weakMatch ? ' weakness-match' : '');
    var badgeHtml = '';
    if (element && ELEMENT_ICONS[element]) {
      badgeHtml = '<img class="el-badge" src="' + ELEMENT_ICONS[element] + '"/>';
    }
    return L.divIcon({
      className: '',
      html: '<div class="' + cls + '" style="width:' + sz + 'px;height:' + sz +
            'px;"><img class="type-img" src="' + src + '" alt="' + type + '"/>' + badgeHtml + '</div>',
      iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2], popupAnchor: [0, -sz / 2]
    });
  }

  /** 이미지 아이콘 (필드보스=redBoss, 에버골=evergaol) */
  function makeImgIcon(src, sz) {
    return L.divIcon({
      className: '',
      html: '<div class="img-icon-marker" style="width:' + sz + 'px;height:' + sz +
            'px;"><img src="' + src + '"/></div>',
      iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2], popupAnchor: [0, -sz / 2]
    });
  }

  /** 원형 마커 */
  function makeCircleIcon(cat, sz, label) {
    var c = MARKER_COLORS[cat] || MARKER_COLORS.unknown;
    return L.divIcon({
      className: '',
      html: '<div class="circle-marker" style="width:' + sz + 'px;height:' + sz +
            'px;font-size:' + Math.round(sz * 0.42) + 'px;background:' + c.bg +
            ';border-color:' + c.border + ';">' + (label || '') + '</div>',
      iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2], popupAnchor: [0, -sz / 2]
    });
  }

  /** 성채 텍스트 라벨 */
  function makeCastleLabel(text) {
    return L.divIcon({
      className: '',
      html: '<div class="castle-label">' + text + '</div>',
      iconSize: [120, 28], iconAnchor: [60, 14], popupAnchor: [0, -14]
    });
  }

  /* ══════════ 보스 패널 (좌측 상단) ══════════ */
  function renderBossGrid() {
    dom.bossGrid.innerHTML = '';
    // "?" 미확인 보스 카드
    var unkCard = document.createElement('div');
    unkCard.className = 'boss-card' + (state.bossId === null ? ' active' : '');
    unkCard.innerHTML =
      '<img src="images/icon/boss_unknown.jpg" alt="?"/>' +
      '<div class="boss-name">???</div>';
    unkCard.addEventListener('click', function () { selectBoss(null); });
    dom.bossGrid.appendChild(unkCard);

    BOSSES.forEach(function (boss) {
      var card = document.createElement('div');
      var isActive = state.bossId === boss.id;
      var isDimmed = state.earth && !isBossAvailable(boss.name);
      card.className = 'boss-card' + (isActive ? ' active' : '') + (isDimmed ? ' dimmed' : '');
      card.innerHTML =
        '<img src="' + boss.portrait + '" alt="' + boss.nameKo + '"/>' +
        '<div class="boss-name">' + boss.nameKo + '</div>';
      card.addEventListener('click', function () { selectBoss(boss.id); });
      dom.bossGrid.appendChild(card);
    });

    if (state.bossId) {
      showBossInfo(findBoss(state.bossId));
    } else {
      dom.bossInfo.style.display = 'none';
    }
  }

  function isBossAvailable(bossName) {
    if (!state.earth) return true;
    return BASE_SEEDS.some(function (s) {
      return s.shiftingEarth === state.earth && s.nightlord === bossName;
    });
  }

  function showBossInfo(boss) {
    if (!boss) { dom.bossInfo.style.display = 'none'; return; }
    dom.bossInfo.style.display = '';
    var html = '';
    if (boss.weakness && ELEMENT_ICONS[boss.weakness]) {
      html += '<span class="el-tag weak"><img src="' + ELEMENT_ICONS[boss.weakness] +
              '"/>' + ELEMENT_KO[boss.weakness] + '</span>';
    }
    if (boss.resist) {
      boss.resist.forEach(function (r) {
        if (ELEMENT_ICONS[r]) {
          html += '<span class="el-tag resist"><img src="' + ELEMENT_ICONS[r] +
                  '"/>' + ELEMENT_KO[r] + '</span>';
        }
      });
    }
    dom.bossInfo.innerHTML = html;
  }

  /* ══════════ 지형 패널 (우측 상단) ══════════ */
  function renderEarthGrid() {
    dom.earthGrid.innerHTML = '';
    EARTHS.forEach(function (earth) {
      var card = document.createElement('div');
      card.className = 'earth-card' + (state.earth === earth.name ? ' active' : '');
      card.innerHTML =
        '<img src="' + earth.icon + '" alt="' + earth.nameKo + '"/>';
      card.addEventListener('click', function () { selectEarth(earth.name); });
      dom.earthGrid.appendChild(card);
    });
    // DLC 확장 슬롯
    var dlc = document.createElement('div');
    dlc.className = 'earth-card dlc-slot';
    dlc.innerHTML = '<span class="dlc-label">DLC</span>';
    dom.earthGrid.appendChild(dlc);
  }

  /* ══════════ 선택 처리 ══════════ */
  function selectBoss(bossId) {
    state.bossId = (state.bossId === bossId) ? null : bossId;
    state.spawnName = null;
    state.identified = {};
    state.candidates = [];
    state.selectedSeedId = null;

    renderBossGrid();
    clearMarkers();
    showClickableSpawns();
    updateStatusBar();
    hideSpecialEvent();
    dom.legend.style.display = 'none';
  }

  function selectEarth(earthName) {
    state.earth = (state.earth === earthName) ? null : earthName;
    state.spawnName = null;
    state.identified = {};
    state.candidates = [];
    state.selectedSeedId = null;

    // 지형별 지도 이미지 교체
    var earth = EARTHS.find(function (e) { return e.name === state.earth; });
    var img = earth ? earth.mapImage : MAP_CONFIG.image;
    mapOverlay.setUrl(img);

    renderEarthGrid();
    renderBossGrid();
    clearMarkers();
    showClickableSpawns();
    updateStatusBar();
    hideSpecialEvent();
    dom.legend.style.display = 'none';
  }

  /* ══════════ 스폰 마커 ══════════ */
  function showClickableSpawns() {
    var available = getAvailSpawns();
    var hasFilter = available.length > 0;

    SPAWN_POINTS.forEach(function (sp) {
      if (hasFilter && available.indexOf(sp.name) === -1) return;
      var sel = state.spawnName === sp.name;
      var m = L.marker(toLatLng(sp.x, sp.y), {
        icon: makeSpawnIcon(sel), zIndexOffset: sel ? 1000 : 0
      }).addTo(map);

      if (!state.spawnName) {
        (function (name) { m.on('click', function () { selectSpawn(name); }); })(sp.name);
      }
      addMarker(m);
    });
  }

  function getAvailSpawns() {
    if (!state.earth && !state.bossId) return [];
    var boss = state.bossId ? findBoss(state.bossId) : null;
    var spawns = {};
    BASE_SEEDS.forEach(function (s) {
      if (state.earth && s.shiftingEarth !== state.earth) return;
      if (boss && s.nightlord !== boss.name) return;
      spawns[s.spawnPoint] = true;
    });
    return Object.keys(spawns);
  }

  /* ══════════ 낙하 지점 선택 ══════════ */
  function selectSpawn(spawnName) {
    state.spawnName = spawnName;
    state.identified = {};
    state.selectedSeedId = null;

    var boss = state.bossId ? findBoss(state.bossId) : null;
    state.candidates = BASE_SEEDS.filter(function (s) {
      if (state.earth && s.shiftingEarth !== state.earth) return false;
      if (s.spawnPoint !== spawnName) return false;
      if (boss && s.nightlord !== boss.name) return false;
      return true;
    });

    updateStatusBar();

    if (state.candidates.length === 1) {
      confirmSeed(state.candidates[0]);
    } else {
      showIdentifyMarkers();
    }

    dom.legend.style.display = '';
    showIdentifyLegend();
  }

  /* ══════════ 거점 식별 (full-value 레벨) ══════════ */
  function showIdentifyMarkers() {
    clearMarkers();
    hideSpecialEvent();

    var sp = SPAWN_POINTS.find(function (p) { return p.name === state.spawnName; });
    if (sp) addMarker(L.marker(toLatLng(sp.x, sp.y), {
      icon: makeSpawnIcon(true), zIndexOffset: 1000
    }).addTo(map));

    if (state.candidates.length <= 1) {
      if (state.candidates.length === 1) confirmSeed(state.candidates[0]);
      return;
    }

    var diffs = findDiffs();

    diffs.forEach(function (d) {
      var isIdent = state.identified[d.name] !== undefined;

      if (isIdent) {
        var fullVal = getIdentVal(d.name);
        var type = parseBaseType(fullVal);
        var enemy = parseEnemyName(fullVal);
        var element = getEnemyElement(enemy);
        var m = L.marker(toLatLng(d.loc.x, d.loc.y), {
          icon: makeBaseIcon(type, element, 66, isWeaknessMatch(element))
        }).addTo(map);
        m.bindTooltip(toKo(enemy), {
          permanent: true, direction: 'bottom', offset: [0, 20], className: 'marker-label'
        });
        addMarker(m);
      } else {
        var um = L.marker(toLatLng(d.loc.x, d.loc.y), {
          icon: makeUnknownIcon(66), zIndexOffset: 500
        }).addTo(map);
        (function (diff) {
          um.on('click', function () { showIdentifyPopup(diff); });
        })(d);
        addMarker(um);
      }
    });

    showSameBases();
  }

  /** 후보 간 값이 다른 Major Base 위치 (full-value 기준) */
  function findDiffs() {
    var cands = state.candidates;
    var results = [];
    var names = {};
    cands.forEach(function (s) {
      if (!s.majorBases) return;
      Object.keys(s.majorBases).forEach(function (k) { names[k] = true; });
    });

    Object.keys(names).forEach(function (locName) {
      var vals = {};
      cands.forEach(function (s) {
        var v = (s.majorBases && s.majorBases[locName]) || '(없음)';
        if (!vals[v]) vals[v] = 0;
        vals[v]++;
      });

      if (Object.keys(vals).length > 1) {
        var loc = MAJOR_BASE_LOCATIONS.find(function (l) { return l.name === locName; });
        if (!loc) return;
        results.push({
          name: locName,
          loc: loc,
          options: Object.keys(vals).map(function (v) {
            return { fullVal: v, count: vals[v] };
          }).sort(function (a, b) { return b.count - a.count; })
        });
      }
    });

    return results;
  }

  /** 후보 간 동일 값 Major Base → 아이콘 표시 */
  function showSameBases() {
    var cands = state.candidates;
    var names = {};
    cands.forEach(function (s) {
      if (!s.majorBases) return;
      Object.keys(s.majorBases).forEach(function (k) { names[k] = true; });
    });

    Object.keys(names).forEach(function (locName) {
      if (state.identified[locName] !== undefined) return;
      var vals = {};
      cands.forEach(function (s) {
        var v = (s.majorBases && s.majorBases[locName]) || '(없음)';
        if (!vals[v]) vals[v] = 0;
        vals[v]++;
      });

      if (Object.keys(vals).length === 1) {
        var fullVal = Object.keys(vals)[0];
        if (fullVal === '(없음)') return;
        var type = parseBaseType(fullVal);
        var enemy = parseEnemyName(fullVal);
        var element = getEnemyElement(enemy);
        var loc = MAJOR_BASE_LOCATIONS.find(function (l) { return l.name === locName; });
        if (!loc) return;
        var m = L.marker(toLatLng(loc.x, loc.y), {
          icon: makeBaseIcon(type, element, 54, isWeaknessMatch(element))
        }).addTo(map);
        m.bindTooltip(toKo(enemy), {
          permanent: true, direction: 'bottom', offset: [0, 16], className: 'marker-label'
        });
        addMarker(m);
      }
    });
  }

  /** "?" 클릭 → 화면 중앙 고정 오버레이 (지도 이동 없음) */
  var _identifyCtx = {};
  var _identOverlay = null;

  function getIdentOverlay() {
    if (_identOverlay) return _identOverlay;
    var el = document.createElement('div');
    el.id = 'identify-overlay';
    el.innerHTML =
      '<div class="ident-bg"></div>' +
      '<div class="ident-box">' +
        '<div class="ident-title">이 위치의 건물은?</div>' +
        '<div class="ident-grid identify-grid"></div>' +
      '</div>';
    el.querySelector('.ident-bg').addEventListener('click', function () {
      el.style.display = 'none';
    });
    document.body.appendChild(el);
    _identOverlay = el;
    return el;
  }

  function showIdentifyPopup(diff) {
    var groups = {};
    diff.options.forEach(function (opt) {
      if (opt.fullVal === '(없음)') return;
      var type = parseBaseType(opt.fullVal);
      var enemy = parseEnemyName(opt.fullVal);
      var element = getEnemyElement(enemy) || '';
      var key = type + '|' + element;
      if (!groups[key]) groups[key] = { type: type, element: element, vals: [] };
      groups[key].vals.push(opt.fullVal);
    });

    var list = [];
    Object.keys(groups).forEach(function (k) { list.push(groups[k]); });
    _identifyCtx = { locName: diff.name, groups: list };

    var overlay = getIdentOverlay();
    var grid = overlay.querySelector('.ident-grid');
    grid.innerHTML = '';

    list.forEach(function (g, i) {
      var btn = document.createElement('button');
      btn.className = 'identify-btn';
      var badgeHtml = '';
      if (g.element && ELEMENT_ICONS[g.element]) {
        badgeHtml = '<img class="badge-el" src="' + ELEMENT_ICONS[g.element] + '"/>';
      }
      btn.innerHTML =
        '<div class="badge-wrap"><img class="type-icon" src="' + getTypeIcon(g.type) + '"/>' +
        badgeHtml + '</div>';
      (function (idx) {
        btn.addEventListener('click', function () { window._pickGroup(idx); });
      })(i);
      grid.appendChild(btn);
    });

    overlay.style.display = 'flex';
  }

  window._pickGroup = function (idx) {
    var ctx = _identifyCtx;
    if (!ctx.groups || !ctx.groups[idx]) return;
    var g = ctx.groups[idx];
    state.identified[ctx.locName] = g.vals.length === 1 ? g.vals[0] : g.vals;
    if (_identOverlay) _identOverlay.style.display = 'none';
    filterByValue();
    updateStatusBar();
    showIdentifyMarkers();
  };

  /** state.identified 값 꺼내기 (배열이면 첫 번째) */
  function getIdentVal(locName) {
    var v = state.identified[locName];
    return Array.isArray(v) ? v[0] : v;
  }

  function undoIdent(locName) {
    delete state.identified[locName];
    recalcCandidates();
    updateStatusBar();
    showIdentifyMarkers();
  }

  /** full-value 기반 필터 (배열 지원) */
  function filterByValue() {
    state.candidates = state.candidates.filter(function (seed) {
      var keys = Object.keys(state.identified);
      for (var i = 0; i < keys.length; i++) {
        var locName = keys[i];
        var expected = state.identified[locName];
        var actual = (seed.majorBases && seed.majorBases[locName]) || '(없음)';
        if (Array.isArray(expected)) {
          if (expected.indexOf(actual) === -1) return false;
        } else {
          if (actual !== expected) return false;
        }
      }
      return true;
    });

    if (state.candidates.length === 1) {
      confirmSeed(state.candidates[0]);
    } else {
      state.selectedSeedId = null;
    }
  }

  function recalcCandidates() {
    var boss = state.bossId ? findBoss(state.bossId) : null;
    state.candidates = BASE_SEEDS.filter(function (s) {
      if (state.earth && s.shiftingEarth !== state.earth) return false;
      if (s.spawnPoint !== state.spawnName) return false;
      if (boss && s.nightlord !== boss.name) return false;
      return true;
    });
    filterByValue();
  }

  /* ══════════ 시드 확정 ══════════ */
  function confirmSeed(seed) {
    state.selectedSeedId = seed.id;
    showSeedMarkers(seed);
    updateStatusBar();
  }

  /* ══════════ 미니맵 모드: 시드 확정 → 전체 마커 + 영구 라벨 ══════════ */
  function showSeedMarkers(seed) {
    clearMarkers();

    // 스페셜 이벤트 배너
    if (seed.specialEvent) {
      showSpecialEvent(seed.specialEvent);
    } else {
      hideSpecialEvent();
    }

    // 스폰 (라벨 불필요 — 위치 자체가 명확)
    var sp = SPAWN_POINTS.find(function (p) { return p.name === seed.spawnPoint; });
    if (sp) addMarker(L.marker(toLatLng(sp.x, sp.y), {
      icon: makeSpawnIcon(true), zIndexOffset: 1000
    }).addTo(map));

    // Major Base — 건물 아이콘 + 속성 뱃지 + 적 이름 라벨
    if (seed.majorBases) {
      Object.keys(seed.majorBases).forEach(function (locName) {
        var loc = MAJOR_BASE_LOCATIONS.find(function (l) { return l.name === locName; });
        if (!loc) return;
        var val = seed.majorBases[locName];
        var type = parseBaseType(val);
        var enemy = parseEnemyName(val);
        var element = getEnemyElement(enemy);
        var m = L.marker(toLatLng(loc.x, loc.y), {
          icon: makeBaseIcon(type, element, 66, isWeaknessMatch(element))
        }).addTo(map);
        m.bindTooltip(toKo(enemy), {
          permanent: true, direction: 'bottom', offset: [0, 20], className: 'marker-label'
        });
        addMarker(m);
      });
    }

    // Minor Base — 건물 아이콘 + 적 이름 라벨 (작게, 속성 뱃지 없음)
    if (seed.minorBases) {
      Object.keys(seed.minorBases).forEach(function (locName) {
        var loc = MINOR_BASE_LOCATIONS.find(function (l) { return l.name === locName; });
        if (!loc) return;
        var val = seed.minorBases[locName];
        var type = parseBaseType(val);
        var enemy = parseEnemyName(val);
        var m = L.marker(toLatLng(loc.x, loc.y), {
          icon: makeBaseIcon(type, null, 48, false)
        }).addTo(map);
        m.bindTooltip(toKo(enemy), {
          permanent: true, direction: 'bottom', offset: [0, 14], className: 'marker-label'
        });
        addMarker(m);
      });
    }

    // 필드 보스 — redBoss.png + 보스명 라벨
    if (seed.fieldBosses) {
      Object.keys(seed.fieldBosses).forEach(function (locName) {
        var loc = FIELD_BOSS_LOCATIONS.find(function (l) { return l.name === locName; });
        if (!loc) return;
        var m = L.marker(toLatLng(loc.x, loc.y), {
          icon: makeImgIcon('images/icon/redBoss.png', 48)
        }).addTo(map);
        m.bindTooltip(toKo(seed.fieldBosses[locName]), {
          permanent: true, direction: 'bottom', offset: [0, 16], className: 'marker-label'
        });
        addMarker(m);
      });
    }

    // 에버골 — evergaol.png + 내용 라벨
    if (seed.evergaols) {
      Object.keys(seed.evergaols).forEach(function (locName) {
        var loc = EVERGAOL_LOCATIONS.find(function (l) { return l.name === locName; });
        if (!loc) return;
        var m = L.marker(toLatLng(loc.x, loc.y), {
          icon: makeImgIcon('images/icon/evergaol.png', 48)
        }).addTo(map);
        m.bindTooltip(toKo(seed.evergaols[locName]), {
          permanent: true, direction: 'bottom', offset: [0, 16], className: 'marker-label'
        });
        addMarker(m);
      });
    }

    // 부패의 숲 필드 보스
    if (seed.rottedWoods) {
      Object.keys(seed.rottedWoods).forEach(function (locName) {
        var loc = ROTTED_WOODS_FB_LOCATIONS.find(function (l) { return l.name === locName; });
        if (!loc) return;
        var m = L.marker(toLatLng(loc.x, loc.y), {
          icon: makeCircleIcon('rottedWoods', 36, 'R')
        }).addTo(map);
        m.bindTooltip(toKo(seed.rottedWoods[locName]), {
          permanent: true, direction: 'bottom', offset: [0, 12], className: 'marker-label'
        });
        addMarker(m);
      });
    }

    // 부패 축복
    if (seed.rotBlessing) {
      var rb = ROT_BLESSING_LOCATIONS.find(function (l) { return l.name === seed.rotBlessing; });
      if (rb) {
        var rm = L.marker(toLatLng(rb.x, rb.y), {
          icon: makeCircleIcon('rotBlessing', 30, 'B')
        }).addTo(map);
        addMarker(rm);
      }
    }

    // 밤 서클 — day1/day2 + 밤보스 이름 라벨
    addNightCircleLabeled(seed.night1Circle, '1', seed.night1Boss);
    addNightCircleLabeled(seed.night2Circle, '2', seed.night2Boss);

    // 성채 — 하얀색 텍스트 (겹침 방지 오프셋)
    if (seed.castle) {
      var cx = CASTLE_LOCATION.x + 60;
      var cy = CASTLE_LOCATION.y - 30;
      addMarker(L.marker(toLatLng(cx, cy), {
        icon: makeCastleLabel(toKo(seed.castle)), zIndexOffset: 500
      }).addTo(map));
    }

    // 상인
    if (seed.merchant) {
      var ml = MERCHANT_LOCATIONS.find(function (l) { return l.name === seed.merchant; });
      if (ml) {
        addMarker(L.marker(toLatLng(ml.x, ml.y), {
          icon: makeCircleIcon('merchant', 30, '$')
        }).addTo(map));
      }
    }

    showFullLegend(seed);
  }

  function addNightCircleLabeled(circleName, dayNum, bossName) {
    if (!circleName) return;
    var loc = NIGHT_CIRCLE_LOCATIONS.find(function (l) { return l.name === circleName; });
    if (!loc) return;
    var m = L.marker(toLatLng(loc.x, loc.y), {
      icon: makeCircleIcon('nightCircle', 42, dayNum)
    }).addTo(map);
    var label = 'day' + dayNum;
    if (bossName) label += '\n' + toKo(bossName);
    m.bindTooltip(label, {
      permanent: true, direction: 'bottom', offset: [0, 16],
      className: 'night-label day' + dayNum
    });
    addMarker(m);
  }

  /* ══════════ 스페셜 이벤트 배너 ══════════ */
  function showSpecialEvent(text) {
    if (dom.specialEvent) {
      dom.specialEvent.textContent = '스페셜 이벤트 : ' + toKo(text);
      dom.specialEvent.style.display = '';
    }
  }

  function hideSpecialEvent() {
    if (dom.specialEvent) dom.specialEvent.style.display = 'none';
  }

  /* ══════════ 상태 바 ══════════ */
  function updateStatusBar() {
    if (!state.spawnName) {
      dom.statusBar.style.display = 'none';
      return;
    }

    dom.statusBar.style.display = '';
    var count = state.candidates.length;

    if (count === 1 && state.selectedSeedId !== null) {
      var seed = BASE_SEEDS.find(function (s) { return s.id === state.selectedSeedId; });
      var info = seed ? bossNameKo(seed.nightlord) + ' / ' + getEarthKo(seed.shiftingEarth) : '';
      dom.statusText.innerHTML =
        '<span class="num confirmed">시드 #' + state.selectedSeedId + '</span> 확정 — ' +
        info + ' <button class="seed-view-btn" onclick="window._openModal(' +
        state.selectedSeedId + ')">상세</button>';
    } else {
      dom.statusText.innerHTML =
        '<span class="num">' + count + '</span> 후보 시드';
    }

    // 식별 칩
    dom.identifiedChips.innerHTML = '';
    Object.keys(state.identified).forEach(function (locName) {
      var fullVal = getIdentVal(locName);
      var type = parseBaseType(fullVal);
      var enemy = parseEnemyName(fullVal);
      var element = getEnemyElement(enemy);
      var chip = document.createElement('div');
      chip.className = 'id-chip';
      var badgeHtml = '';
      if (element && ELEMENT_ICONS[element]) {
        badgeHtml = '<img src="' + ELEMENT_ICONS[element] + '" style="width:14px;height:14px;"/>';
      }
      chip.innerHTML =
        '<img src="' + getTypeIcon(type) + '"/>' + badgeHtml +
        '<span>' + toKo(enemy) + '</span>' +
        '<button class="chip-undo" title="취소">&times;</button>';
      chip.querySelector('.chip-undo').addEventListener('click', function () {
        undoIdent(locName);
      });
      dom.identifiedChips.appendChild(chip);
    });
  }

  /* ══════════ 범례 ══════════ */
  function showIdentifyLegend() {
    dom.legendItems.innerHTML = '';
    addLegendIcon('images/icon/spawn.png', '낙하 지점');
    addLegendDot('unknown', '?', '미식별 거점');
    ['Ruins', 'Camp', 'Fort', 'Great Church', 'Church', "Sorcerer's Rise", 'Township'].forEach(function (t) {
      addLegendIcon(getTypeIcon(t), getTypeKo(t));
    });
  }

  function showFullLegend(seed) {
    dom.legendItems.innerHTML = '';
    dom.legend.style.display = '';
    addLegendIcon('images/icon/spawn.png', '낙하 지점');
    ['Ruins', 'Camp', 'Fort', 'Great Church'].forEach(function (t) {
      addLegendIcon(getTypeIcon(t), getTypeKo(t));
    });
    addLegendIcon('images/icon/redBoss.png', '필드 보스');
    addLegendIcon('images/icon/evergaol.png', '봉인감옥');
    addLegendDot('nightCircle', 'N', '밤 서클');
    if (seed.rottedWoods) addLegendDot('rottedWoods', 'R', '부패의 숲');
    addLegendDot('merchant', '$', '상인');
  }

  function addLegendIcon(src, label) {
    var row = document.createElement('div');
    row.className = 'legend-row';
    row.innerHTML = '<img class="legend-icon" src="' + src + '" /><span>' + label + '</span>';
    dom.legendItems.appendChild(row);
  }

  function addLegendDot(cat, letter, label) {
    var c = MARKER_COLORS[cat] || MARKER_COLORS.unknown;
    var row = document.createElement('div');
    row.className = 'legend-row';
    row.innerHTML = '<span class="legend-dot" style="background:' + c.bg +
      ';border-color:' + c.border + ';">' + letter + '</span><span>' + label + '</span>';
    dom.legendItems.appendChild(row);
  }

  /* ══════════ 모달 (상세 보기) ══════════ */
  window._openModal = function (id) {
    var seed = BASE_SEEDS.find(function (s) { return s.id === id; });
    if (seed) openModal(seed);
  };

  function openModal(seed) {
    state.showingUnder = false;
    dom.modalTitle.textContent = '#' + seed.id + ' — ' + bossNameKo(seed.nightlord);

    var imgNum = seed.id + 1000;
    var imgSrc = 'images/map/' + imgNum + '.png';
    var underSrc = 'images/map/' + imgNum + '_under.png';

    dom.modalImage.src = imgSrc;
    dom.modalImage.onerror = function () { dom.modalImageWrap.classList.add('hidden'); };
    dom.modalImage.onload = function () { dom.modalImageWrap.classList.remove('hidden'); };
    dom.modalImageWrap.classList.remove('hidden');

    dom.modalToggle.style.display = '';
    dom.modalToggle.className = 'modal-toggle';
    dom.modalToggle.textContent = '지하 보기';
    dom.modalToggle.onclick = function () {
      state.showingUnder = !state.showingUnder;
      dom.modalImage.src = state.showingUnder ? underSrc : imgSrc;
      dom.modalToggle.textContent = state.showingUnder ? '지상 보기' : '지하 보기';
      dom.modalToggle.className = 'modal-toggle' + (state.showingUnder ? ' active' : '');
    };

    dom.modalInfo.innerHTML = '';
    addModalSection('기본 정보', [
      ['밤의 군주', bossNameKo(seed.nightlord)],
      ['지형', getEarthKo(seed.shiftingEarth)],
      ['성채', toKo(seed.castle)],
      ['1일차 밤보스', toKo(seed.night1Boss)],
      ['2일차 밤보스', toKo(seed.night2Boss)],
      ['1일차 밤서클', seed.night1Circle],
      ['2일차 밤서클', seed.night2Circle],
      ['특수 이벤트', toKo(seed.specialEvent)],
      ['상인', seed.merchant],
      ['부패 축복', seed.rotBlessing],
      ['광란의 탑', seed.frenzyTower]
    ]);

    if (seed.majorBases) addModalBaseSection('주요 거점', seed.majorBases);
    if (seed.minorBases) addModalBaseSection('소규모 거점', seed.minorBases);
    if (seed.fieldBosses) addModalSection('필드 보스', objRowsKo(seed.fieldBosses));
    if (seed.evergaols) addModalSection('봉인감옥', objRowsKo(seed.evergaols));
    if (seed.rottedWoods) addModalSection('부패의 숲', objRowsKo(seed.rottedWoods));

    dom.modal.style.display = 'flex';
  }

  function addModalSection(title, rows) {
    var sec = document.createElement('div');
    sec.className = 'modal-section';
    sec.innerHTML = '<div class="modal-section-title">' + title + '</div>';
    rows.forEach(function (r) {
      if (!r[1]) return;
      var row = document.createElement('div');
      row.className = 'modal-row';
      row.innerHTML = '<span class="modal-key">' + r[0] + '</span><span class="modal-val">' + r[1] + '</span>';
      sec.appendChild(row);
    });
    dom.modalInfo.appendChild(sec);
  }

  function addModalBaseSection(title, bases) {
    var sec = document.createElement('div');
    sec.className = 'modal-section';
    sec.innerHTML = '<div class="modal-section-title">' + title + '</div>';
    Object.keys(bases).forEach(function (locName) {
      var val = bases[locName];
      var type = parseBaseType(val);
      var enemy = parseEnemyName(val);
      var element = getEnemyElement(enemy);
      var row = document.createElement('div');
      row.className = 'modal-base-row';
      var elHtml = element && ELEMENT_ICONS[element]
        ? '<img src="' + ELEMENT_ICONS[element] + '" style="width:16px;height:16px;"/>'
        : '';
      row.innerHTML = '<img src="' + getTypeIcon(type) + '" />' + elHtml +
        '<span class="base-val">' + getTypeKo(type) + ' - ' + toKo(enemy) + '</span>';
      sec.appendChild(row);
    });
    dom.modalInfo.appendChild(sec);
  }

  function objRows(obj) {
    return Object.keys(obj).map(function (k) { return [k, obj[k]]; });
  }

  function objRowsKo(obj) {
    return Object.keys(obj).map(function (k) { return [k, toKo(obj[k])]; });
  }

  function closeModal() { dom.modal.style.display = 'none'; }

  /* ══════════ 초기화 ══════════ */
  function resetAll() {
    state.earth = null;
    state.bossId = null;
    state.spawnName = null;
    state.candidates = [];
    state.identified = {};
    state.selectedSeedId = null;

    mapOverlay.setUrl(MAP_CONFIG.image);
    renderBossGrid();
    renderEarthGrid();
    clearMarkers();
    showClickableSpawns();
    updateStatusBar();
    hideSpecialEvent();
    dom.legend.style.display = 'none';
  }

  /* ══════════ 이벤트 바인딩 ══════════ */
  function bindEvents() {
    dom.resetBtn.addEventListener('click', resetAll);
    dom.modalClose.addEventListener('click', closeModal);
    dom.modalBg.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dom.modal.style.display !== 'none') closeModal();
    });
  }

  /* ══════════ 시작 ══════════ */
  document.addEventListener('DOMContentLoaded', function () {
    cacheDom();
    initMap();
    state.earth = 'Default';
    renderBossGrid();
    renderEarthGrid();
    showClickableSpawns();
    bindEvents();
  });
})();
