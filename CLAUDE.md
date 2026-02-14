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
Pure vanilla HTML/CSS/JS — no bundler, no framework. All scripts load via `<script>` tags in `index.html`. All variables are globals on `window`.

### Data Flow
1. `seeddata_base.js` — `BASE_SEEDS[]` array (320 seeds, ~19K lines). Each seed contains: nightlord, shiftingEarth, spawnPoint, majorBases, minorBases, fieldBosses, evergaols, night circles, castle, etc. **Never modify this file directly for display changes.**
2. `data.js` — All configuration: `BOSSES[]`, `EARTHS[]`, coordinate arrays (`SPAWN_POINTS`, `MAJOR_BASE_LOCATIONS`, etc.), `NAME_KO` translation map, `ENEMY_ELEMENT` mapping, marker colors, icon paths.
3. `app.js` — Single IIFE containing all application logic: state management, Leaflet map, panel rendering, seed filtering, marker placement, identification overlay, modal.

### Key Patterns

**Korean Translation Layer:** English names in `BASE_SEEDS` are translated at display-time via `toKo(name)` which looks up `NAME_KO` in data.js. Boss names use `bossNameKo()` which reads from `BOSSES[].nameKo`. Never change seed data for localization — always add to `NAME_KO`.

**Seed Narrowing Flow:** `selectEarth()` / `selectBoss()` → `selectSpawn()` → `showIdentifyMarkers()` (shows "?" markers at differing locations) → user clicks "?" → `showIdentifyPopup()` (custom overlay, NOT Leaflet popup) → `_pickGroup()` → `filterByValue()` → repeat or `confirmSeed()`.

**Identification Grouping:** Buildings with same type+element are grouped into one button (deduplication). `state.identified[locName]` can be a string or array of fullVals. `getIdentVal()` handles both.

**Map:** Leaflet with `CRS.Simple`, 1000x1000 coordinate space. All interactions disabled (no drag, no zoom). Terrain map images swap via `mapOverlay.setUrl(img)` — no map recreation needed.

**Custom Overlay vs Leaflet Popup:** The identification popup is a fixed-position DOM overlay (`#identify-overlay`), not a Leaflet popup. This prevents map panning/shifting. Important: do not revert this to Leaflet popups.

### CSS Architecture
Single `style.css` with CSS variables (`--gold`, `--bg-panel`, etc.) for the dark fantasy theme. Panel layout uses `position:fixed` overlays on top of the fullscreen Leaflet map. Earth panel uses `flex:1` cards that auto-fill available height.

### Image Assets
- `images/map/default_map.webp` — base map overlay
- `images/map/map_*.webp` — terrain-specific map overlays (Mountaintop, Crater, RottedWoods, Noklateo)
- `images/map/1XXX.png` / `1XXX_under.png` — per-seed detail maps (modal view), where XXX = seed.id + 1000
- `images/icon/boss_*.jpg` — Night Lord portraits
- `images/icon/element/*.png` — element icons (fire, lightning, holy, etc.)
- `images/icon/*.png` — base type icons (Ruins, Camp, Fort, etc.)

## Conventions

- Target viewport: 1920x1080 (second monitor)
- All user-facing text is Korean
- Boss/enemy English names preserved in data, translated at render-time only
- `var` declarations (ES5 style) throughout app.js for consistency — do not convert to `let`/`const`
- Earth panel reserves a DLC slot (6th card) for future terrain additions
