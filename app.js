const STORAGE_KEY = "bof1_tracker_progress_v2";
const MODE_KEY = "bof1_ui_mode_v1";
const THEME_KEY = "bof1_theme_v1";

const searchInput = document.getElementById("searchInput");
const overallBar = document.getElementById("overallBar");
const overallPct = document.getElementById("overallPct");
const totalTasksEl = document.getElementById("totalTasks");
const doneTasksEl = document.getElementById("doneTasks");
const resetBtn = document.getElementById("resetProgress");
const expandBtn = document.getElementById("expandAll");
const collapseBtn = document.getElementById("collapseAll");
const modeToggle = document.getElementById("modeToggle");
const currentModeLabel = document.getElementById("currentModeLabel");
const themeToggle = document.getElementById("themeToggle");
const currentThemeLabel = document.getElementById("currentThemeLabel");
const guideMode = document.getElementById("guideMode");
const trackerMode = document.getElementById("trackerMode");
const navLinks = Array.from(document.querySelectorAll(".nav-links a[data-nav-type]"));

const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"][data-id]'));
const detailsSegments = Array.from(document.querySelectorAll("details.segment"));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadMode() {
  const mode = localStorage.getItem(MODE_KEY);
  return mode === "tracker" ? "tracker" : "guide";
}

function saveMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

function loadTheme() {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === "dark" ? "dark" : "light";
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function syncFromStorage() {
  const state = loadState();
  checkboxes.forEach((box) => {
    box.checked = !!state[box.dataset.id];
  });
}

function syncToStorage() {
  const next = {};
  checkboxes.forEach((box) => {
    if (box.checked) {
      next[box.dataset.id] = true;
    }
  });
  saveState(next);
}

function updateProgress() {
  if (!totalTasksEl || !doneTasksEl || !overallPct || !overallBar) return;

  const total = checkboxes.length;
  const done = checkboxes.filter((b) => b.checked).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  totalTasksEl.textContent = String(total);
  doneTasksEl.textContent = String(done);
  overallPct.textContent = `${pct}%`;
  overallBar.style.width = `${pct}%`;
}

function getModeElements(mode) {
  if (mode === "tracker") {
    return {
      root: trackerMode,
      guideRoot: guideMode,
      trackerRoot: trackerMode,
    };
  }

  return {
    root: guideMode,
    guideRoot: guideMode,
    trackerRoot: trackerMode,
  };
}

function applyMode(mode) {
  const isTracker = mode === "tracker";

  document.body.dataset.mode = mode;

  guideMode.classList.toggle("active", !isTracker);
  trackerMode.classList.toggle("active", isTracker);

  guideMode.setAttribute("aria-hidden", isTracker ? "true" : "false");
  trackerMode.setAttribute("aria-hidden", isTracker ? "false" : "true");

  currentModeLabel.textContent = isTracker ? "Tracker Mode" : "Guide Mode";
  modeToggle.textContent = isTracker ? "Show Guide" : "Show Tracker";

  // Filter nav links by mode
  navLinks.forEach((link) => {
    const linkMode = link.dataset.navType;
    link.style.display = (isTracker && linkMode === "tracker") || (!isTracker && linkMode === "guide") ? "block" : "none";
  });

  saveMode(mode);
  applySearchFilter();
}

function applySearchFilter() {
  const query = searchInput.value.trim().toLowerCase();
  const currentMode = document.body.dataset.mode === "tracker" ? "tracker" : "guide";
  const { root } = getModeElements(currentMode);

  if (!root) return;

  const labels = Array.from(root.querySelectorAll(".checklist label"));
  const guideCards = Array.from(root.querySelectorAll(".guide-card"));
  const trackerPanels = Array.from(root.querySelectorAll(".tracker-panel"));

  if (!query) {
    labels.forEach((label) => label.classList.remove("hidden-by-search"));
    guideCards.forEach((card) => card.classList.remove("hidden-by-search"));
    trackerPanels.forEach((panel) => panel.classList.remove("hidden-by-search"));
    return;
  }

  labels.forEach((label) => {
    const text = label.textContent.toLowerCase();
    label.classList.toggle("hidden-by-search", !text.includes(query));
  });

  guideCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.classList.toggle("hidden-by-search", !text.includes(query));
  });

  trackerPanels.forEach((panel) => {
    const panelText = panel.textContent.toLowerCase();
    const hasVisibleLabel = Array.from(panel.querySelectorAll(".checklist label")).some(
      (label) => !label.classList.contains("hidden-by-search")
    );
    const showPanel = panelText.includes(query) || hasVisibleLabel || panel.id === "tracker-dashboard";
    panel.classList.toggle("hidden-by-search", !showPanel);
  });
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  currentThemeLabel.textContent = isDark ? "Dark Mode" : "Light Mode";
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";

  saveTheme(theme);
}

checkboxes.forEach((box) => {
  box.addEventListener("change", () => {
    syncToStorage();
    updateProgress();
  });
});

searchInput.addEventListener("input", applySearchFilter);

modeToggle.addEventListener("click", () => {
  const currentMode = document.body.dataset.mode === "tracker" ? "tracker" : "guide";
  applyMode(currentMode === "tracker" ? "guide" : "tracker");
});

resetBtn.addEventListener("click", () => {
  const ok = window.confirm("Reset all tracker progress? This cannot be undone.");
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEY);
  checkboxes.forEach((box) => {
    box.checked = false;
  });

  updateProgress();
  applySearchFilter();
});

expandBtn.addEventListener("click", () => {
  detailsSegments.forEach((seg) => {
    if (!seg.closest(".hidden-by-search")) {
      seg.open = true;
    }
  });
});

collapseBtn.addEventListener("click", () => {
  detailsSegments.forEach((seg) => {
    if (!seg.closest(".hidden-by-search")) {
      seg.open = false;
    }
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

syncFromStorage();
updateProgress();
applyMode(loadMode());
applyTheme(loadTheme());
