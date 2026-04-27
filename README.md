# Breath of Fire (1993) Tracker UI

A standalone, local web tracker for the strategy guide.

## How to use

1. Open `index.html` in your browser.
2. Check tasks as you progress.
3. Use the search bar to quickly filter by town, boss, item, or character.
4. Progress is saved automatically in browser local storage.

## Run options (Windows)

1. Quick open: double-click `index.html`.
2. PowerShell open from this folder: `start .\index.html`
3. Optional local server (if you already have Node): `npx serve .`

## Features

- Full chronological walkthrough tracker
- Separate UI flow for tracker content and read-only guide content
- Detail Guide Hub with focused sections:
  - Item build paths
  - Item progression milestones
  - Boss fight strategy guide
  - EXP leveling/grind routes
  - Advanced optimization prep
  - Reference-style handbook layout (non-checklist)
- Beginner setup and survival checklist
- Characters, dragons, gear, boss prep, secrets, endgame, and 100% checklist
- Expand/collapse walkthrough sections
- One-click reset
- Mobile-friendly layout

## Files

- `index.html` UI structure and content
- `styles.css` visual style and responsive layout
- `app.js` search/filter + save/load + progress logic
