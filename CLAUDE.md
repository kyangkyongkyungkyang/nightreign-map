# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nightreign Seed Finder — a fullscreen interactive map for Elden Ring: Nightreign, designed as a second-monitor companion tool. Players select boss + terrain + spawn point to narrow down which "seed" (predetermined game layout) they're in, then identify buildings to confirm the exact seed. All UI text is in Korean.

## Dev Commands

```bash
# Serve locally (used by Playwright config)
node serve.js                    # http://localhost:8765

# Quick dev server (alternative)
npx http-server -p 8080 -c-1

# Run Playwright tests
npx playwright test

# Visual screenshot test (ad-hoc, no test framework)
npx playwright screenshot --viewport-size="1920,1080" http://localhost:8080 screenshot.png
```

**Note:** On this Windows machine, Node.js may need explicit PATH: `export PATH="/c/Program Files/nodejs:$PATH"`

## Architecture

### No Build Step
Pure vanilla HTML/CSS/JS — no bundler, no framework. All scripts load via `<script>` tags in `index.html`. Data files (`seeddata_base.js`, `data.js`) declare globals; `app.js` is a single IIFE that reads those globals. Only `window._pickGroup` and `window._openModal` are exposed for inline event handlers.

### Data Flow
1. `seeddata_base.js` — `BASE_SEEDS[]` array (320 seeds, ~19K lines). Each seed contains: nightlord, shiftingEarth, spawnPoint, majorBases, minorBases, fieldBosses, evergaols, night circles, castle, merchant, etc. **Never modify this file directly for display changes.**
2. `data.js` — All configuration: `BOSSES[]`, `EARTHS[]`, coordinate arrays (`SPAWN_POINTS`, `MAJOR_BASE_LOCATIONS`, etc.), `NAME_KO` translation map, `ENEMY_ELEMENT` mapping, `BOSS_DAMAGE`, `MINOR_FIELD_BOSSES`, `MARKER_COLORS`, icon paths.
3. `app.js` — Single IIFE (~1000 lines) containing all application logic: state management, Leaflet map, panel rendering, seed filtering, marker placement, identification overlay, modal.

### Key Patterns

**Korean Translation Layer:** English names in `BASE_SEEDS` are translated at display-time via `toKo(name)` which looks up `NAME_KO` in data.js. Boss names use `bossNameKo()` which reads from `BOSSES[].nameKo`. Never change seed data for localization — always add to `NAME_KO`.

**Seed Narrowing Flow:** `selectEarth()` / `selectBoss()` → `selectSpawn()` → `showIdentifyMarkers()` (shows "?" markers at differing Major Base locations) → user clicks "?" → `showIdentifyPopup()` (custom DOM overlay, NOT Leaflet popup) → `_pickGroup()` → `filterByValue()` → repeat or `confirmSeed()`. When a seed is confirmed with no boss selected, `confirmSeed()` auto-selects the boss from the seed's nightlord.

**Base Value Format:** Major/minor base values use the format `"Type - EnemyName"` (e.g., `"Ruins - Depraved Perfumer"`). Parsed by `parseBaseType()` and `parseEnemyName()`. The type determines the building icon; the enemy name determines element badge and Korean label.

**Identification Grouping:** Buildings with same type+element are grouped into one button (deduplication). `state.identified[locName]` can be a string or array of fullVals. `getIdentVal()` handles both.

**Map:** Leaflet with `CRS.Simple`, 1000×1000 coordinate space. All interactions disabled (no drag, no zoom). Terrain map images swap via `mapOverlay.setUrl(img)` — no map recreation needed. Coordinates use `toLatLng(x, y)` which returns `[-y, x]`.

**Custom Overlay vs Leaflet Popup:** The identification popup is a fixed-position DOM overlay (`#identify-overlay`), not a Leaflet popup. This prevents map panning/shifting. Do not revert this to Leaflet popups.

**Marker Factory Functions:** All map markers go through dedicated factory functions — `makeSpawnIcon`, `makeUnknownIcon`, `makeBaseIcon` (type icon + element badge + weakness match glow), `makeImgIcon` (field bosses, evergaols), `makeCircleIcon` (night circles, merchant, rot blessing), `makeCastleLabel`. Colors are defined in `MARKER_COLORS` in data.js.

**Field Boss Differentiation:** `MINOR_FIELD_BOSSES[]` in data.js lists minor field bosses (강적). These use `fieldBoss.png`; major field bosses (두려운 강적) use `redBoss.png`.

### Boss Weakness Table

`BOSS_DAMAGE` in data.js stores per-boss damage/status data. Format:
- `dmg:[표준,참격,타격,관통,마력,화염,벼락,신성]` — percentage modifiers
- `sts:[독,부패,출혈,동상,수면,발광]` — threshold values, `null` = immune

Multi-phase bosses (Gnoster, Heolstor) have named phases. Rendered by `renderBossWeakness()` in the boss panel.

### CSS Architecture

Single `style.css` with CSS variables (`--gold`, `--bg-panel`, `--violet`, etc.) for the dark fantasy theme. Panel layout uses `position:fixed` overlays on top of the fullscreen Leaflet map.

**z-index stack:** map (1) → atmospheric overlay `body::after` (450) → panels/status bar (500) → identify overlay (800) → modal (9999).

**Atmospheric overlay:** `body::after` creates a Night's Tide violet gradient effect between panels and map — 6-layer gradient with dark edges + subtle purple radial glows + vignette. This is `pointer-events:none` so clicks pass through.

**Windows fix:** Boss panel uses `scrollbar-gutter:stable` to prevent layout shift when scrollbar appears/disappears on content height changes.

### Image Assets
- `images/map/default_map.webp` — base map overlay
- `images/map/map_*.webp` — terrain-specific map overlays (Mountaintop, Crater, RottedWoods, Noklateo)
- `images/map/1XXX.png` — per-seed detail maps (modal view), where XXX = seed.id + 1000
- `images/icon/boss_*.jpg` — Night Lord portraits
- `images/icon/element/*.png` — element icons (fire, lightning, holy, etc.)
- `images/icon/*.png` — base type icons (Ruins, Camp, Fort, etc.), spawn, redBoss, fieldBoss, evergaol

## Conventions

- Target viewport: 1920×1080 (second monitor)
- All user-facing text is Korean
- Boss/enemy English names preserved in data, translated at render-time only
- `var` declarations (ES5 style) throughout app.js — do not convert to `let`/`const`
- Both boss panel (2 slots) and earth panel (1 slot) reserve DLC placeholders
- Do not commit unless explicitly asked
