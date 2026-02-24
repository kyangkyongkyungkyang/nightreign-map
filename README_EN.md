[한국어](README.md) | [English](README_EN.md)

# Nightreign Seed Finder

An interactive map tool for identifying seeds in **Elden Ring: Nightreign**.
Designed to run on a secondary monitor during gameplay — select your boss, terrain, spawn point, and landmarks to pinpoint the exact seed.

🔗 **Live Demo:** [https://kyangkyongkyungkyang.github.io/nightreign-map](https://kyangkyongkyungkyang.github.io/nightreign-map)

---

## Features

### Seed Identification (Progressive Filtering)
- **Boss & Terrain Selection** — Choose from 8 night bosses × 5 terrain variants to begin narrowing candidates
- **Spawn Point Selection** — Click your spawn location on the map (9 possible positions)
- **Landmark Identification** — Confirm seeds by identifying building types (ruins, camp, church, fort, township) and enemy attributes at major outposts
- **Real-time Candidate Count** — Status bar shows remaining seed candidates as you provide more information

### Seed Detail View
- Complete seed layout: field bosses, evergaols, night circles, merchants, castle location
- Field boss tier classification (Fearsome Foes vs Regular Foes)
- Special event display (e.g., Night Horde, Meteor Strike)

### Boss Weakness Chart
- Detailed damage multiplier table for all 8 bosses across multiple phases
- 11 damage/status types: Fire, Lightning, Magic, Holy, Bleed, Frostbite, Poison, Rot, Death, Madness, Sleep
- Phase toggle (Phase 1 / Phase 2) with color-coded vulnerability indicators
- **Weakness Matching** — Outpost markers glow green when their element matches the selected boss's weakness

### Interactive Map
- Custom tile-based map built on **Leaflet.js** with 280+ hand-processed map tiles
- 5 terrain variant overlays (Default, Crater, Mountaintop, Noklateo, Rotted Woods)
- Animated markers: pulsing spawn points, interactive "?" markers for unidentified locations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Map Engine | Leaflet.js v1.9.4 (CRS.Simple, 1000×1000 coordinate space) |
| Language | Vanilla JavaScript (no framework) |
| Styling | CSS3 with Custom Properties (dark fantasy theme) |
| Fonts | Google Fonts — Cinzel + Noto Serif KR |
| Deployment | GitHub Pages (fully static, zero build step) |

---

## Data

- **320 seed entries**, each containing the complete game layout (night lord, terrain, spawn, bosses, circles, buildings, enemies, merchants, events)
- Seed data based on [thefifthmatt's Nightreign Map](https://www.nightreignmap.com/) and community spreadsheets

---

## Project Structure

```
nightreign-map/
├── index.html              # Single-page application entry point
├── css/
│   └── style.css           # Full stylesheet (~600 lines, CSS variables, dark theme)
├── js/
│   ├── app.js              # Main application logic (~1000 lines, IIFE pattern)
│   ├── data.js             # Configuration, coordinates, translations, boss data
│   └── seeddata_base.js    # 320 predetermined seed layouts
└── images/
    ├── icon/               # Boss portraits, building icons, element icons
    └── map/                # 280+ map tiles (base + terrain overlays)
```

---

## Deployment

### GitHub Pages (Recommended)
The app is composed entirely of static files — no build required.

1. Fork or clone this repository
2. Go to **Settings → Pages → Deploy from branch → main / root**
3. Access at `https://<username>.github.io/nightreign-map`

### Local Development
```bash
git clone https://github.com/kyangkyongkyungkyang/nightreign-map.git
cd nightreign-map

# Option 1: Node.js
node serve.js    # http://localhost:8765

# Option 2: npx
npx http-server  # http://localhost:8080
```

---

## How to Use

1. **Select Night Boss** — Choose the boss you see in-game from the 8-boss grid
2. **Select Terrain** — Pick the terrain variant from the 5 terrain options
3. **Click Spawn Point** — Click your spawn location on the map
4. **Identify Landmarks** — Click "?" markers and select the building type you observe
5. **View Seed** — Once narrowed to a single seed, view the complete layout

---

## Attribution

Seed data based on [thefifthmatt's Nightreign Map](https://thefifthmatt.github.io/nightreign/) and community spreadsheets.

---

## License

This project is for educational and personal use. Game assets and data belong to FromSoftware / Bandai Namco.
