# Breath of Fire Tracker — Beginner & Developer Guide

Welcome to the **Breath of Fire (1993) Strategy Guide & 100% Tracker** documentation! Whether you are a player using the app to complete the game or a beginner developer exploring how the project works under the hood, this guide walks you through every part of the repository step by step.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Directory & File Structure](#2-directory--file-structure)
3. [Installation & Setup](#3-installation--setup)
4. [Configuration & Storage Keys](#4-configuration--storage-keys)
5. [User Guide (How to Use the App)](#5-user-guide-how-to-use-the-app)
6. [Important Code Components](#6-important-code-components)
7. [How to Customize or Extend the Tracker](#7-how-to-customize-or-extend-the-tracker)
8. [Troubleshooting & FAQ](#8-troubleshooting--faq)

---

## 1. Project Overview

The **Breath of Fire Tracker** is a standalone, local-first web application designed for players of the classic 1993 SNES RPG *Breath of Fire*. Instead of switching back and forth between text walkthroughs and a separate spreadsheet, this tool provides two integrated views inside a single interface:

1. **Guide Mode**: A structured handbook covering game mechanics, a 10-chapter walkthrough, character breakdowns, dragon shrines, equipment priorities, EXP leveling zones, boss strategies, secrets, and endgame preparation.
2. **Tracker Mode**: An interactive 79-item checklist across 6 categories (`Main Story`, `Bosses`, `Characters`, `Items`, `Secrets`, and `Dragon Forms`) with an automated completion progress bar.

### Why Zero Dependencies?
The project is written in standard **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**. It requires:
- **No build tools** (no Webpack, Vite, or Babel)
- **No package managers** (`npm install` is not required)
- **No backend database** (all data stays safely in your browser's `localStorage`)

---

## 2. Directory & File Structure

The repository is organized cleanly so that markup, styles, scripts, and visual assets live in dedicated folders:

```text
breath-of-fire-tracker/
├── index.html                           # Entry point containing sidebar, Guide view, and Tracker view
├── README.md                            # High-level overview, badges, diagrams, and previews
├── GUIDE.md                             # This comprehensive beginner & developer guide
└── assets/
    ├── css/
    │   └── styles.css                   # Theme variables, responsive grid layout, and UI styling
    ├── js/
    │   └── app.js                       # State management, search filter, and DOM event listeners
    └── images/
        ├── guide-mode-preview.svg       # Visual preview of Guide Mode (Light Theme)
        └── tracker-mode-preview.svg     # Visual preview of Tracker Mode (Dark Theme)
```

### Role of Each File
- **`index.html`**: Defines the semantic layout (`<aside class="sidebar">` and `<main class="content">`), navigation links (`data-nav-type`), collapsible `<details class="segment">` blocks, and all 79 `<input type="checkbox" data-id="...">` elements.
- **`assets/css/styles.css`**: Uses CSS Custom Properties (`--bg`, `--panel`, `--ink`, `--brand`, etc.) for instant theming, CSS Grid for the 2-column desktop shell, and `@media` queries (`1024px` and `900px`) for tablet and mobile responsiveness.
- **`assets/js/app.js`**: Handles reading/writing `localStorage`, calculating completion percentages, toggling between Guide and Tracker modes, switching Light/Dark themes, and filtering DOM elements during live search.

---

## 3. Installation & Setup

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari, Brave).
- **Git** (optional, if cloning from GitHub).

### Step-by-Step Installation

1. **Clone or Download the Repository**
   Open your terminal or PowerShell and run:
   ```bash
   git clone https://github.com/wiwiwinter/breath-of-fire-tracker.git
   cd breath-of-fire-tracker
   ```
   *(Alternatively, click **Code -> Download ZIP** on GitHub and extract the folder on your computer.)*

2. **Launch the Application**
   You can open `index.html` directly from your file explorer or terminal:
   - **Windows File Explorer / macOS Finder**: Double-click `index.html`.
   - **Windows PowerShell**:
     ```powershell
     start .\index.html
     ```
   - **macOS Terminal**:
     ```bash
     open index.html
     ```
   - **Linux Terminal**:
     ```bash
     xdg-open index.html
     ```

3. **Run with a Local Web Server (Optional for Developers)**
   If you are editing the code and want live reloading or a `http://localhost` URL:
   - **Using Node.js (`npx`)**:
     ```bash
     npx serve .
     ```
   - **Using Python 3**:
     ```bash
     python -m http.server 8000
     ```
     Then visit `http://localhost:8000` in your browser.

---

## 4. Configuration & Storage Keys

The application requires zero manual configuration files. All user settings and checklist progress are automatically saved in the browser's `localStorage` under three versioned keys defined at the top of `assets/js/app.js`:

| Constant Name | `localStorage` Key | Stored Value Format | Default Value | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `STORAGE_KEY` | `bof1_tracker_progress_v2` | JSON Object (`{"story-1": true, ...}`) | `{}` | Stores which checkboxes are checked by their `data-id`. |
| `MODE_KEY` | `bof1_ui_mode_v1` | String (`"guide"` or `"tracker"`) | `"guide"` | Remembers whether you last viewed Guide Mode or Tracker Mode. |
| `THEME_KEY` | `bof1_theme_v1` | String (`"light"` or `"dark"`) | `"light"` | Remembers your active color theme preference. |

> **Tip**: Because `localStorage` is scoped to the browser profile and origin, your progress stays saved even if you close the tab or restart your computer.

---

## 5. User Guide (How to Use the App)

1. **Switching Modes (`Show Tracker` / `Show Guide`)**
   - Click the top button in the sidebar (`#modeToggle`) to switch between reading the strategy guide and checking off tasks in the tracker.
   - The sidebar navigation menu automatically updates to show links only for the active mode.

2. **Toggling Light & Dark Themes (`Dark` / `Light`)**
   - Click the theme button (`#themeToggle`) to switch between the parchment-inspired Light Mode and the low-glare Dark Mode.

3. **Using the Live Search Bar**
   - Type any keyword into **Search Current Mode** (`#searchInput`)—for example, `Karn`, `Agua`, `Rod5`, `Frog`, or `DragonSD`.
   - In **Guide Mode**, only guide sections and boss strategy cards containing your keyword remain visible.
   - In **Tracker Mode**, individual checklist items and panels are filtered in real time while the **Tracker Dashboard** stays pinned at the top.
   - Clear the search input to restore all items.

4. **Tracking Your 100% Progress**
   - Switch to **Tracker Mode** and check off milestones as you play.
   - Watch the **Tracker Dashboard** automatically update your **Completed** count (`0` to `79`) and overall percentage (`0%` to `100%`).

5. **Expanding, Collapsing, and Resetting**
   - **Expand All Segments**: Opens all collapsible walkthrough chapters and item checklists currently visible.
   - **Collapse All Segments**: Folds all collapsible `<details>` blocks for a compact view.
   - **Reset Tracker Progress**: Prompts for confirmation (`window.confirm`) before clearing all checked tasks back to `0%`.

---

## 6. Important Code Components

Understanding how `index.html`, `assets/css/styles.css`, and `assets/js/app.js` interact makes modifying the project straightforward.

### A. HTML Data Attributes (`index.html`)
The HTML uses `data-*` attributes to hook into JavaScript cleanly without relying on fragile class chains:
- `data-mode="guide"` on `<body>`: Tracks the active mode at the document level.
- `data-nav-type="guide"` / `data-nav-type="tracker"` on sidebar `<a>` links: Tells `applyMode()` which navigation links belong to which mode.
- `data-id="story-1"` on `<input type="checkbox">`: Gives every checkbox a unique, stable key for saving and loading in `localStorage`.

### B. State Persistence (`assets/js/app.js`)
`loadState()` safely parses the JSON stored in `localStorage` using a `try / catch` block so corrupted browser data never crashes the app:
```javascript
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
```
When any checkbox changes, `syncToStorage()` collects all checked `data-id` attributes and writes a compact JSON object to `localStorage`.

### C. Progress Calculation (`updateProgress()`)
Whenever a checkbox is toggled or the page loads, `updateProgress()` counts the total checkboxes and completed checkboxes, rounds the percentage to the nearest integer, and updates both the text labels and the CSS width of `#overallBar`:
```javascript
const total = checkboxes.length;
const done = checkboxes.filter((b) => b.checked).length;
const pct = total === 0 ? 0 : Math.round((done / total) * 100);
overallBar.style.width = `${pct}%`;
```

### D. Scoped Search Filtering (`applySearchFilter()`)
The search algorithm inspects only the active mode container (`#guideMode` or `#trackerMode`):
- Toggles the `.hidden-by-search` CSS class (`display: none !important;`) on `.checklist label` and `.guide-card` elements that do not match the query.
- In Tracker Mode, hides an entire `.tracker-panel` only if neither its headings nor any of its child checkboxes match the query (always keeping `#tracker-dashboard` visible).

### E. Theme Switching via CSS Variables (`assets/css/styles.css`)
`applyTheme()` sets `data-theme="dark"` or `data-theme="light"` on the root `<html>` element (`document.documentElement`). In `assets/css/styles.css`, `:root` defines the Light palette and `[data-theme="dark"]` overrides those variables automatically.

---

## 7. How to Customize or Extend the Tracker

### Adding a New Checklist Item
1. Open `index.html` and scroll to the desired tracker section inside `<div id="trackerMode">` (for example, `#tracker-items`).
2. Add a new `<label>` with a unique `data-id`:
   ```html
   <label data-search-item>
     <input type="checkbox" data-id="item-17" /> G.Tiara obtained for Nina.
   </label>
   ```
3. Save and refresh the browser. `app.js` automatically detects the new checkbox, increases **Total Checklist Items** from `79` to `80`, and persists its state!

### Adding a New Boss Strategy Card
1. Open `index.html` and locate `<section id="guide-bosses">`.
2. Inside `<div class="guide-grid">`, add a new `<article class="guide-block" data-search-item>`:
   ```html
   <article class="guide-block" data-search-item>
     <h3>Optional Boss Name (Lv XX-YY)</h3>
     <p><strong>Weakness:</strong> ... <strong>Strategy:</strong> ...</p>
   </article>
   ```

### Customizing Colors
Open `assets/css/styles.css` and adjust the CSS variables at the top of the file:
```css
:root {
  --brand: #0d8a72;   /* Primary accent color (Light Mode) */
  --brand-2: #f0b247; /* Secondary gradient accent */
}
```

---

## 8. Troubleshooting & FAQ

- **Why isn't my progress showing up when I switch browsers?**
  `localStorage` is stored locally inside the specific browser you used (e.g., Edge vs. Chrome). Stick to the same browser to keep your saved state.
- **How do I back up my checklist progress manually?**
  Open your browser's Developer Tools (`F12`), go to the **Console** tab, and run:
  ```javascript
  copy(localStorage.getItem("bof1_tracker_progress_v2"))
  ```
  This copies your progress JSON to your clipboard. To restore it later, run:
  ```javascript
  localStorage.setItem("bof1_tracker_progress_v2", '<PASTE_JSON_HERE>');
  location.reload();
  ```
- **Nothing shows up in Tracker Mode—did I lose my items?**
  Check the **Search Current Mode** input box in the sidebar! If there is text in the search bar, non-matching panels are hidden. Clear the search bar to see all sections again.
