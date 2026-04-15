// =============================================================================
// dailyscape.js — Core logic. Edit tasks-config.js for task content.
// =============================================================================

'use strict';

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
const STORAGE_KEY_PREFIX = 'rsdailies';
const PROFILES_KEY = `${STORAGE_KEY_PREFIX}:profiles`;

const FARMING_TICK_MINUTES = 20; // RS3 farming growth ticks
const DEFAULT_HERB_LOCATIONS = [
  'Garden of Kharid',
  'Falador',
  'Port Phasmatys',
  'Catherby',
  'Ardougne',
  'Wilderness',
  'Troll Stronghold',
  'Prifddinas',
];

function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    const arr = raw ? JSON.parse(raw) : null;
    if (Array.isArray(arr) && arr.length) return arr;
  } catch {
    // ignore
  }
  return ['default'];
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function getActiveProfile() {
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}:active-profile`) || 'default';
}

function storageKey(key) {
  return `${STORAGE_KEY_PREFIX}:${getActiveProfile()}:${key}`;
}

function load(key, fallback = null) {
  try {
    const val = localStorage.getItem(storageKey(key));
    return val !== null ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(storageKey(key), JSON.stringify(value));
}

// ---------------------------------------------------------------------------
// Reset time helpers (UTC)
// Daily = 00:00 UTC, Weekly = Wednesday 00:00 UTC, Monthly = 1st 00:00 UTC
// ---------------------------------------------------------------------------
function getNextDaily() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return next;
}

function getNextWeekly() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 3=Wed
  const daysUntilWed = (3 - day + 7) % 7 || 7;
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilWed));
  return next;
}

function getNextMonthly() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

function formatCountdown(target) {
  const diff = target - Date.now();
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Timer bar
// ---------------------------------------------------------------------------
function updateTimers() {
  document.getElementById('daily-timer').textContent = `Daily reset: ${formatCountdown(getNextDaily())}`;
  document.getElementById('weekly-timer').textContent = `Weekly reset: ${formatCountdown(getNextWeekly())}`;
  document.getElementById('monthly-timer').textContent = `Monthly reset: ${formatCountdown(getNextMonthly())}`;
}

// ---------------------------------------------------------------------------
// Auto-reset: check if tasks need resetting after a reset boundary
// ---------------------------------------------------------------------------
function checkAutoReset() {
  const now = Date.now();
  const lastVisit = load('last-visit', 0);

  const prevDaily = new Date(getNextDaily() - 86400000).getTime();
  const prevWeekly = (() => {
    const d = getNextWeekly();
    d.setUTCDate(d.getUTCDate() - 7);
    return d.getTime();
  })();
  const prevMonthly = (() => {
    const d = getNextMonthly();
    d.setUTCMonth(d.getUTCMonth() - 1);
    return d.getTime();
  })();

  const crossedDaily = lastVisit < prevDaily;
  const crossedWeekly = lastVisit < prevWeekly;
  const crossedMonthly = lastVisit < prevMonthly;

  if (crossedDaily) {
    clearCompleted(['dailies', 'gathering']);
    resetCustomCompletions('daily');
    maybeNotifyReset('daily');
  }

  if (crossedWeekly) {
    clearCompleted(['weeklies', 'weeklyGathering']);
    resetCustomCompletions('weekly');
    maybeNotifyReset('weekly');
  }

  if (crossedMonthly) {
    clearCompleted(['monthlies']);
    resetCustomCompletions('monthly');
    maybeNotifyReset('monthly');
  }

  save('last-visit', now);
}

function clearCompleted(types) {
  types.forEach(type => {
    save(`completed-${type}`, {});
  });
}

function resetCustomCompletions(resetKind) {
  const tasks = load('custom-tasks', []);
  const completed = load('completed-custom', {});
  let changed = false;

  tasks.forEach(t => {
    const kind = (t.reset || 'daily').toLowerCase();
    if (kind === resetKind && completed[t.id]) {
      delete completed[t.id];
      changed = true;
    }
  });

  if (changed) save('completed-custom', completed);
}

async function maybeNotifyReset(kind) {
  const settings = load('settings', {});
  const shouldBrowser = !!settings.browserNotif;
  const webhookUrl = (settings.webhookUrl || '').trim();

  if (shouldBrowser && Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch {
      // ignore
    }
  }

  if (shouldBrowser && Notification.permission === 'granted') {
    try {
      new Notification('RSDailies', { body: `${kind[0].toUpperCase()}${kind.slice(1)} reset: tasks cleared.` });
    } catch {
      // ignore
    }
  }

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `RSDailies: ${kind} reset just happened (UTC).` }),
      });
    } catch {
      // ignore
    }
  }
}

// ---------------------------------------------------------------------------
// Build task rows
// ---------------------------------------------------------------------------
function buildRows(tasks, type) {
  const completedCache = new Map();
  const hiddenCache = new Map();
  const tbody = document.getElementById(`${type === 'weeklyGathering' ? 'weekly-gathering' : type}-body`);
  if (!tbody) return;

  tbody.innerHTML = '';

  applySavedOrder(tasks, type).forEach(task => {
    const storeType = task.storeType || type;

    const hiddenKey = `hidden-${storeType}`;
    const hidden = hiddenCache.has(hiddenKey) ? hiddenCache.get(hiddenKey) : load(hiddenKey, {});
    hiddenCache.set(hiddenKey, hidden);
    if (hidden[task.id]) return;

    const completedKey = `completed-${storeType}`;
    const completed = completedCache.has(completedKey) ? completedCache.get(completedKey) : load(completedKey, {});
    completedCache.set(completedKey, completed);

    const tr = document.createElement('tr');
    tr.dataset.id = task.id;
    tr.draggable = true;
    if (completed[task.id]) tr.classList.add('completed');

    const tdName = document.createElement('td');
    tdName.className = 'task-name';

    const nameLink = task.wiki
      ? `<a href="${task.wiki}" target="_blank" rel="noopener">${task.name}</a>`
      : task.name;
    tdName.innerHTML = nameLink;

    if (task.note) {
      const noteSpan = document.createElement('span');
      noteSpan.className = 'task-note';
      noteSpan.textContent = task.note;
      tdName.appendChild(noteSpan);
    }

    if (task.profit) {
      const profitSpan = document.createElement('span');
      profitSpan.className = 'task-profit';
      profitSpan.dataset.item = task.profit.item;
      profitSpan.dataset.qty = task.profit.qty;
      profitSpan.textContent = 'Loading price...';
      tdName.appendChild(profitSpan);
    }

    if (task.timer === 'herb') {
      const timerBtn = document.createElement('button');
      timerBtn.className = 'herb-timer-btn';
      timerBtn.type = 'button';
      timerBtn.textContent = '🌿 Start Herb Run';
      timerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onHerbTimerButton();
      });
      tdName.appendChild(timerBtn);
    }

    if (typeof task.cooldownMinutes === 'number' && task.cooldownMinutes > 0) {
      const cdBtn = document.createElement('button');
      cdBtn.className = 'cooldown-btn';
      cdBtn.type = 'button';
      cdBtn.textContent = 'Start cooldown';
      cdBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startCooldown(task.id, task.cooldownMinutes);
      });
      tdName.appendChild(cdBtn);
    }

    const tdCheck = document.createElement('td');
    tdCheck.className = 'task-check';
    tdCheck.innerHTML = completed[task.id] ? '✔' : '✘';
    tdCheck.addEventListener('click', () => toggleTask(task.id, storeType, tr, tdCheck));

    tr.appendChild(tdName);
    tr.appendChild(tdCheck);
    tbody.appendChild(tr);
  });

  enableDragDrop(tbody, type);
}

function applySavedOrder(tasks, type) {
  const order = load(`order-${type}`, null);
  if (!Array.isArray(order) || order.length === 0) return tasks;

  const index = new Map(order.map((id, i) => [id, i]));
  return [...tasks].sort((a, b) => {
    const ai = index.has(a.id) ? index.get(a.id) : Number.POSITIVE_INFINITY;
    const bi = index.has(b.id) ? index.get(b.id) : Number.POSITIVE_INFINITY;
    if (ai !== bi) return ai - bi;
    return a.name.localeCompare(b.name);
  });
}

// ---------------------------------------------------------------------------
// Toggle task completion
// ---------------------------------------------------------------------------
function toggleTask(id, type, tr, tdCheck) {
  const completed = load(`completed-${type}`, {});
  completed[id] = !completed[id];
  save(`completed-${type}`, completed);
  tr.classList.toggle('completed', !!completed[id]);
  tdCheck.textContent = completed[id] ? '✔' : '✘';
}

// ---------------------------------------------------------------------------
// Herb Run Timer
// ---------------------------------------------------------------------------
function startHerbTimer(task, btn) {
  const settings = load('settings', {});
  const ticks = settings.herbTicks || task.growthTicks || 4;
  const growthMs = ticks * 5 * 60 * 1000; // each tick = 5 min
  const readyAt = Date.now() + growthMs;
  save(`herb-timer`, readyAt);

  btn.disabled = true;

  const interval = setInterval(() => {
    const remaining = readyAt - Date.now();
    if (remaining <= 0) {
      clearInterval(interval);
      btn.textContent = '🌿 Herbs Ready! Click to reset';
      btn.disabled = false;
      btn.classList.add('ready');
      if (Notification.permission === 'granted') {
        new Notification('RSDailies', { body: 'Your herb run is ready!' });
      }
      btn.onclick = () => {
        btn.textContent = '🌿 Start Herb Run';
        btn.classList.remove('ready');
        btn.disabled = false;
        btn.onclick = null;
        btn.addEventListener('click', (e) => { e.stopPropagation(); startHerbTimer(task, btn); });
      };
    } else {
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      btn.textContent = `🌿 ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} until ready`;
    }
  }, 1000);
}

// ---------------------------------------------------------------------------
// Herb Run Timer (RS3 farming growth ticks - 20 minute cycles)
// ---------------------------------------------------------------------------
let herbRunIntervalId = null;

function loadHerbRun() {
  return load('herb-run', null);
}

function saveHerbRun(state) {
  save('herb-run', state);
}

function clearHerbRun() {
  save('herb-run', null);
}

function nextUtcTickBoundaryMs(nowMs, tickMinutes) {
  const d = new Date(nowMs);
  const y = d.getUTCFullYear();
  const mo = d.getUTCMonth();
  const da = d.getUTCDate();
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  // Strictly "next" boundary: if already on a boundary, jump forward one tick.
  const addMinutes = tickMinutes - (m % tickMinutes || tickMinutes);
  return Date.UTC(y, mo, da, h, m + addMinutes, 0, 0);
}

function computeHerbReadyAtMs(startMs, herbTicks) {
  const nextBoundary = nextUtcTickBoundaryMs(startMs, FARMING_TICK_MINUTES);
  // Matches the Tk app logic: wait until next tick boundary, then add (ticks - 1) full tick cycles.
  const cycles = Math.max(0, (herbTicks || 4) - 1);
  return nextBoundary + cycles * FARMING_TICK_MINUTES * 60 * 1000;
}

function startHerbRun() {
  const settings = load('settings', {});
  const herbTicks = settings.herbTicks === 3 ? 3 : 4;
  const startedAt = Date.now();
  const readyAt = computeHerbReadyAtMs(startedAt, herbTicks);

  saveHerbRun({
    startedAt,
    readyAt,
    herbTicks,
    tickMinutes: FARMING_TICK_MINUTES,
    locations: DEFAULT_HERB_LOCATIONS,
    checked: {},
    alerted: false,
  });

  ensureHerbRunInterval();
  renderHerbUI();
}

function onHerbTimerButton() {
  const state = loadHerbRun();
  if (!state || !state.readyAt) startHerbRun();

  ensureHerbRunInterval();
  renderHerbUI();

  const panel = document.getElementById('herb-panel');
  if (panel) panel.classList.remove('hidden');
}

function ensureHerbRunInterval() {
  if (herbRunIntervalId) return;
  herbRunIntervalId = setInterval(renderHerbUI, 1000);
}

function stopHerbRunIntervalIfIdle() {
  const state = loadHerbRun();
  if (state && state.readyAt) return;
  if (herbRunIntervalId) clearInterval(herbRunIntervalId);
  herbRunIntervalId = null;
}

function formatMMSS(ms) {
  const remaining = Math.max(0, ms);
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderHerbUI() {
  const state = loadHerbRun();
  const now = Date.now();

  // Update row buttons (there should typically be only one herb run task).
  document.querySelectorAll('.herb-timer-btn').forEach(btn => {
    if (!state || !state.readyAt) {
      btn.disabled = false;
      btn.classList.remove('ready');
      btn.textContent = 'Start Herb Run';
      return;
    }

    const remaining = state.readyAt - now;
    if (remaining <= 0) {
      btn.disabled = false;
      btn.classList.add('ready');
      btn.textContent = 'Herbs Ready (open checklist)';
    } else {
      btn.disabled = false;
      btn.classList.remove('ready');
      btn.textContent = `Herbs: ${formatMMSS(remaining)} remaining`;
    }
  });

  // Optional panel UI (only if index.html includes it).
  const panel = document.getElementById('herb-panel');
  if (!panel) return;

  const status = document.getElementById('herb-status');
  const locations = document.getElementById('herb-locations');
  const startBtn = document.getElementById('herb-start-btn');
  const resetBtn = document.getElementById('herb-reset-btn');
  const closeBtn = document.getElementById('herb-close-btn');

  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = '1';
    closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
  }

  if (startBtn && !startBtn.dataset.bound) {
    startBtn.dataset.bound = '1';
    startBtn.addEventListener('click', () => startHerbRun());
  }

  if (resetBtn && !resetBtn.dataset.bound) {
    resetBtn.dataset.bound = '1';
    resetBtn.addEventListener('click', () => {
      clearHerbRun();
      renderHerbUI();
      stopHerbRunIntervalIfIdle();
    });
  }

  if (!state || !state.readyAt) {
    if (status) status.textContent = 'No active herb run.';
    if (locations) locations.innerHTML = '';
    if (startBtn) startBtn.classList.remove('hidden');
    if (resetBtn) resetBtn.classList.add('hidden');
    stopHerbRunIntervalIfIdle();
    return;
  }

  if (startBtn) startBtn.classList.add('hidden');
  if (resetBtn) resetBtn.classList.remove('hidden');

  const remaining = state.readyAt - now;
  if (remaining > 0) {
    if (status) status.textContent = `Growing - ready in ${formatMMSS(remaining)} (RS3 ${state.tickMinutes}-minute ticks)`;
    if (locations) locations.innerHTML = '';
    return;
  }

  if (status) status.textContent = 'Ready to harvest. Check off locations as you collect.';

  if (!state.alerted) {
    const settings = load('settings', {});
    if (settings.browserNotif && Notification.permission === 'granted') {
      try {
        new Notification('RSDailies', { body: 'Your herb run is ready!' });
      } catch {
        // ignore
      }
    }
    state.alerted = true;
    saveHerbRun(state);
  }

  if (!locations) return;
  locations.innerHTML = '';

  const all = state.locations || DEFAULT_HERB_LOCATIONS;
  const checked = state.checked || {};

  all.forEach(loc => {
    const row = document.createElement('label');
    row.className = 'herb-location';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!checked[loc];
    cb.addEventListener('change', () => {
      const st = loadHerbRun();
      if (!st) return;
      st.checked = st.checked || {};
      st.checked[loc] = cb.checked;
      saveHerbRun(st);

      const done = (st.locations || []).every(l => !!st.checked?.[l]);
      if (done) clearHerbRun();

      renderHerbUI();
      stopHerbRunIntervalIfIdle();
    });

    const span = document.createElement('span');
    span.textContent = loc;

    row.appendChild(cb);
    row.appendChild(span);
    locations.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Generic cooldown timers (simple per-task countdowns)
// ---------------------------------------------------------------------------
let cooldownIntervalId = null;

function loadCooldowns() {
  return load('cooldowns', {});
}

function saveCooldowns(cooldowns) {
  save('cooldowns', cooldowns);
}

function startCooldown(taskId, cooldownMinutes) {
  const minutes = Math.max(1, Math.floor(cooldownMinutes));
  const readyAt = Date.now() + minutes * 60 * 1000;
  const cooldowns = loadCooldowns();
  cooldowns[taskId] = { readyAt, minutes };
  saveCooldowns(cooldowns);
  ensureCooldownInterval();
  renderCooldownButtons();
}

function ensureCooldownInterval() {
  if (cooldownIntervalId) return;
  cooldownIntervalId = setInterval(renderCooldownButtons, 1000);
}

function renderCooldownButtons() {
  const cooldowns = loadCooldowns();
  const now = Date.now();
  let anyActive = false;

  document.querySelectorAll('.cooldown-btn').forEach(btn => {
    const row = btn.closest('tr');
    const id = row?.dataset?.id;
    if (!id || !cooldowns[id]?.readyAt) {
      btn.classList.remove('ready');
      btn.textContent = 'Start cooldown';
      btn.onclick = null;
      return;
    }

    const remaining = cooldowns[id].readyAt - now;
    if (remaining <= 0) {
      btn.classList.add('ready');
      btn.textContent = 'Cooldown ready (reset)';
      btn.onclick = (e) => {
        e?.stopPropagation?.();
        const next = loadCooldowns();
        delete next[id];
        saveCooldowns(next);
        renderCooldownButtons();
      };
    } else {
      anyActive = true;
      btn.classList.remove('ready');
      btn.textContent = `Cooldown: ${formatMMSS(remaining)}`;
      btn.onclick = null;
    }
  });

  if (!anyActive && cooldownIntervalId) {
    clearInterval(cooldownIntervalId);
    cooldownIntervalId = null;
  }
}

// ---------------------------------------------------------------------------
// Drag and drop reordering
// ---------------------------------------------------------------------------
function enableDragDrop(tbody, type) {
  let dragRow = null;

  tbody.addEventListener('dragstart', e => {
    dragRow = e.target.closest('tr');
    dragRow.classList.add('dragging');
  });
  tbody.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('tr');
    if (target && target !== dragRow) {
      const rect = target.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      tbody.insertBefore(dragRow, e.clientY < mid ? target : target.nextSibling);
    }
  });
  tbody.addEventListener('dragend', () => {
    dragRow.classList.remove('dragging');
    const order = [...tbody.querySelectorAll('tr')].map(r => r.dataset.id);
    save(`order-${type}`, order);
    dragRow = null;
  });
}

// ---------------------------------------------------------------------------
// GE Profit fetching
// ---------------------------------------------------------------------------
async function fetchProfits() {
  const spans = document.querySelectorAll('.task-profit');
  if (!spans.length) return;

  const items = [...new Set([...spans].map(s => s.dataset.item))];
  const url = `https://runescape.wiki/api.php?action=ask&query=[[Exchange:${items.join('||Exchange:')}]]|?Exchange:Price&format=json&origin=*`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = data?.query?.results || {};

    spans.forEach(span => {
      const item = span.dataset.item;
      const qty = parseInt(span.dataset.qty, 10);
      const priceData = results[`Exchange:${item}`];
      const price = priceData?.printouts?.['Exchange:Price']?.[0]?.num;
      if (price) {
        const total = Math.round(price * qty);
        span.textContent = `~${total.toLocaleString()} gp`;
      } else {
        span.textContent = '';
      }
    });
  } catch {
    spans.forEach(s => s.textContent = '');
  }
}

// ---------------------------------------------------------------------------
// Custom tasks
// ---------------------------------------------------------------------------
function loadCustomTasks() {
  const tasks = load('custom-tasks', []);
  const tbody = document.getElementById('custom-tasks-body');
  tbody.innerHTML = '';

  tasks.forEach((task, i) => {
    const completed = load('completed-custom', {});
    const tr = document.createElement('tr');
    if (completed[task.id]) tr.classList.add('completed');

    const tdName = document.createElement('td');
    tdName.className = 'task-name';
    tdName.innerHTML = `<strong>${task.name}</strong>`;
    if (task.note) {
      const n = document.createElement('span');
      n.className = 'task-note';
      n.textContent = task.note;
      tdName.appendChild(n);
    }

    // Reset type badge
    const badge = document.createElement('span');
    badge.className = `reset-badge reset-${task.reset || 'daily'}`;
    badge.textContent = task.reset || 'daily';
    tdName.appendChild(badge);

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-task-btn';
    delBtn.textContent = '✕';
    delBtn.title = 'Delete task';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCustomTask(task.id);
    });
    tdName.appendChild(delBtn);

    const tdCheck = document.createElement('td');
    tdCheck.className = 'task-check';
    tdCheck.textContent = completed[task.id] ? '✔' : '✘';
    tdCheck.addEventListener('click', () => toggleTask(task.id, 'custom', tr, tdCheck));

    tr.appendChild(tdName);
    tr.appendChild(tdCheck);
    tbody.appendChild(tr);
  });
}

function deleteCustomTask(id) {
  const tasks = load('custom-tasks', []).filter(t => t.id !== id);
  save('custom-tasks', tasks);
  loadCustomTasks();
}

function showAddCustomTaskModal() {
  const name = prompt('Task name:');
  if (!name?.trim()) return;
  const note = prompt('Note (optional):') || '';
  const reset = prompt('Reset type (daily / weekly / monthly):') || 'daily';

  const task = {
    id: `custom-${Date.now()}`,
    name: name.trim(),
    note: note.trim(),
    reset: ['daily', 'weekly', 'monthly'].includes(reset.toLowerCase()) ? reset.toLowerCase() : 'daily'
  };

  const tasks = load('custom-tasks', []);
  tasks.push(task);
  save('custom-tasks', tasks);
  loadCustomTasks();
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
function loadSettings() {
  const settings = load('settings', {});
  const el = (id) => document.getElementById(id);
  el('setting-split-dailies').checked = settings.splitDailies !== false;
  el('setting-split-weeklies').checked = settings.splitWeeklies !== false;
  if (settings.herbTicks === 3) el('setting-3tick-herbs').checked = true;
  if (settings.browserNotif) el('setting-browser-notif').checked = true;
  if (settings.webhookUrl) el('setting-webhook-url').value = settings.webhookUrl;
  if (typeof settings.growthOffsetMinutes === 'number') el('setting-growth-offset').value = String(settings.growthOffsetMinutes);
}

function saveSettings() {
  const growthOffsetRaw = document.getElementById('setting-growth-offset')?.value;
  const parsedGrowthOffset = Number.isFinite(parseInt(growthOffsetRaw, 10)) ? parseInt(growthOffsetRaw, 10) : 0;
  const growthOffsetMinutes = Math.max(-60, Math.min(60, parsedGrowthOffset));

  const settings = {
    splitDailies: document.getElementById('setting-split-dailies').checked,
    splitWeeklies: document.getElementById('setting-split-weeklies').checked,
    herbTicks: document.getElementById('setting-3tick-herbs').checked ? 3 : 4,
    growthOffsetMinutes,
    browserNotif: document.getElementById('setting-browser-notif').checked,
    webhookUrl: document.getElementById('setting-webhook-url').value.trim()
  };
  save('settings', settings);

  if (settings.browserNotif && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  renderApp();
}

// ---------------------------------------------------------------------------
// Import / Export
// ---------------------------------------------------------------------------
function buildExportToken() {
  const profile = getActiveProfile();
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`${STORAGE_KEY_PREFIX}:${profile}:`)) {
      data[key] = localStorage.getItem(key);
    }
  }
  return btoa(JSON.stringify(data));
}

function importToken(token) {
  try {
    const data = JSON.parse(atob(token));
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
    location.reload();
  } catch {
    document.getElementById('import-error').classList.remove('hidden');
  }
}

// ---------------------------------------------------------------------------
// Dropdowns and panels
// ---------------------------------------------------------------------------
function setupDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.preventDefault();
      const parent = toggle.closest('.dropdown');
      parent.classList.toggle('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });
}

// ---------------------------------------------------------------------------
// Compact mode
// ---------------------------------------------------------------------------
function setupCompactToggle() {
  const isCompact = load('compact', false);
  if (isCompact) document.body.classList.add('compact');

  document.getElementById('compact-toggle').addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.toggle('compact');
    save('compact', document.body.classList.contains('compact'));
  });
}

// ---------------------------------------------------------------------------
// Import/Export panel toggle
// ---------------------------------------------------------------------------
function setupImportExport() {
  const panel = document.getElementById('import-export-panel');
  document.getElementById('import-export-toggle').addEventListener('click', e => {
    e.preventDefault();
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      document.getElementById('export-token').value = buildExportToken();
    }
  });

  document.getElementById('copy-token-btn').addEventListener('click', () => {
    const token = document.getElementById('export-token').value;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(token).catch(() => {});
      return;
    }
    const ta = document.getElementById('export-token');
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
    } catch {
      // ignore
    }
  });

  document.getElementById('import-btn').addEventListener('click', () => {
    importToken(document.getElementById('import-token').value.trim());
  });
}

// ---------------------------------------------------------------------------
// Farming Timers (config-driven, multiple concurrent)
// ---------------------------------------------------------------------------
let farmingIntervalId = null;

function loadFarmingTimers() {
  return load('farming-timers', {});
}

function saveFarmingTimers(timers) {
  save('farming-timers', timers);
}

function ensureFarmingInterval() {
  if (farmingIntervalId) return;
  farmingIntervalId = setInterval(renderFarmingPanel, 1000);
}

function stopFarmingIntervalIfIdle() {
  const timers = loadFarmingTimers();
  const anyActive = Object.values(timers).some(t => t && t.readyAt);
  if (anyActive) return;
  if (farmingIntervalId) clearInterval(farmingIntervalId);
  farmingIntervalId = null;
}

function nextWindowStartMs(nowMs, cycleMinutes, offsetMinutes) {
  const cycleMs = Math.max(1, cycleMinutes) * 60 * 1000;
  const offsetMs = (offsetMinutes || 0) * 60 * 1000;
  const anchorMs = Date.UTC(1970, 0, 1, 0, 0, 0, 0) + offsetMs;

  const elapsed = nowMs - anchorMs;
  const steps = Math.floor(elapsed / cycleMs);
  const currentStart = anchorMs + steps * cycleMs;
  const nextStart = currentStart <= nowMs ? currentStart + cycleMs : currentStart;
  return nextStart;
}

function computeReadyAtMs(nowMs, cycleMinutes, stages, offsetMinutes) {
  const cycleMs = Math.max(1, cycleMinutes) * 60 * 1000;
  const nextStart = nextWindowStartMs(nowMs, cycleMinutes, offsetMinutes);
  const remainingStages = Math.max(0, (stages || 1) - 1);
  return nextStart + remainingStages * cycleMs;
}

function setupFarmingPanel() {
  const toggle = document.getElementById('farming-toggle');
  const panel = document.getElementById('farming-panel');
  const closeBtn = document.getElementById('farming-close-btn');
  if (!toggle || !panel || !closeBtn) return;

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      ensureFarmingInterval();
      renderFarmingPanel();
    } else {
      stopFarmingIntervalIfIdle();
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
    stopFarmingIntervalIfIdle();
  });
}

function startFarmingTimer(timerId, variantId) {
  const cfg = window.FARMING_CONFIG?.timers?.find(t => t.id === timerId);
  if (!cfg) return;

  const settings = load('settings', {});
  const offsetMinutes = settings.growthOffsetMinutes || 0;

  const variant = (cfg.variants || []).find(v => v.id === variantId) || null;
  const stages = variant?.stages || cfg.stages || 1;
  const cycleMinutes = cfg.cycleMinutes || FARMING_TICK_MINUTES;

  const startedAt = Date.now();
  const readyAt = computeReadyAtMs(startedAt, cycleMinutes, stages, offsetMinutes);

  const timers = loadFarmingTimers();
  timers[timerId] = {
    id: timerId,
    name: cfg.name,
    variantId: variant?.id || null,
    variantName: variant?.name || null,
    cycleMinutes,
    stages,
    startedAt,
    readyAt,
    alerted: false,
  };
  saveFarmingTimers(timers);
  ensureFarmingInterval();
  renderFarmingPanel();
}

function clearFarmingTimer(timerId) {
  const timers = loadFarmingTimers();
  delete timers[timerId];
  saveFarmingTimers(timers);
  renderFarmingPanel();
  stopFarmingIntervalIfIdle();
}

function renderFarmingPanel() {
  const panel = document.getElementById('farming-panel');
  const container = document.getElementById('farming-timers');
  if (!panel || !container) return;

  const cfgTimers = window.FARMING_CONFIG?.timers || [];
  const timers = loadFarmingTimers();
  const now = Date.now();
  const settings = load('settings', {});
  const offsetMinutes = settings.growthOffsetMinutes || 0;

  container.innerHTML = '';

  cfgTimers.forEach(cfg => {
    const state = timers[cfg.id] || null;

    const row = document.createElement('div');
    row.className = 'farming-row';

    const left = document.createElement('div');
    left.className = 'farming-left';

    const title = document.createElement('div');
    title.className = 'farming-title';
    title.textContent = cfg.name;
    left.appendChild(title);

    if (cfg.sourceUrl) {
      const src = document.createElement('a');
      src.className = 'farming-source';
      src.href = cfg.sourceUrl;
      src.target = '_blank';
      src.rel = 'noopener';
      src.textContent = 'wiki';
      left.appendChild(src);
    }

    const meta = document.createElement('div');
    meta.className = 'farming-meta';
    const cycle = cfg.cycleMinutes || FARMING_TICK_MINUTES;
    meta.textContent = `Cycle: ${cycle}m | Offset: ${offsetMinutes}m`;
    left.appendChild(meta);

    const right = document.createElement('div');
    right.className = 'farming-right';

    let variantId = state?.variantId || (cfg.variants?.[0]?.id ?? null);
    if (Array.isArray(cfg.variants) && cfg.variants.length > 1) {
      const select = document.createElement('select');
      select.className = 'farming-select';
      cfg.variants.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = v.name;
        select.appendChild(opt);
      });
      select.value = variantId || cfg.variants[0].id;
      select.addEventListener('change', () => {
        // only updates selection for the next start; does not mutate running timer
        const nextTimers = loadFarmingTimers();
        if (nextTimers[cfg.id]) {
          nextTimers[cfg.id].variantId = select.value;
          const v = cfg.variants.find(x => x.id === select.value);
          nextTimers[cfg.id].variantName = v?.name || null;
          nextTimers[cfg.id].stages = v?.stages || nextTimers[cfg.id].stages;
          saveFarmingTimers(nextTimers);
        }
        renderFarmingPanel();
      });
      right.appendChild(select);
      variantId = select.value;
    }

    const status = document.createElement('div');
    status.className = 'farming-status';
    if (!state || !state.readyAt) {
      status.textContent = 'Not running';
    } else {
      const remaining = state.readyAt - now;
      status.textContent = remaining <= 0 ? 'Ready' : `Ready in ${formatMMSS(remaining)}`;
    }
    right.appendChild(status);

    const actions = document.createElement('div');
    actions.className = 'farming-actions';

    const startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.textContent = state?.readyAt ? 'Restart' : 'Start';
    startBtn.addEventListener('click', () => startFarmingTimer(cfg.id, variantId));
    actions.appendChild(startBtn);

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'danger';
    clearBtn.textContent = 'Clear';
    clearBtn.disabled = !state;
    clearBtn.addEventListener('click', () => clearFarmingTimer(cfg.id));
    actions.appendChild(clearBtn);

    right.appendChild(actions);

    row.appendChild(left);
    row.appendChild(right);
    container.appendChild(row);

    // Ready notifications (best-effort) - reuse browserNotif setting.
    if (state && state.readyAt && state.readyAt <= now && !state.alerted) {
      if (settings.browserNotif && Notification.permission === 'granted') {
        try {
          new Notification('RSDailies', { body: `${cfg.name} is ready.` });
        } catch {
          // ignore
        }
      }
      const nextTimers = loadFarmingTimers();
      if (nextTimers[cfg.id]) {
        nextTimers[cfg.id].alerted = true;
        saveFarmingTimers(nextTimers);
      }
    }
  });

  stopFarmingIntervalIfIdle();
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------
function setupProfiles() {
  const list = document.getElementById('profile-list');
  const addBtn = document.getElementById('add-profile-btn');
  if (!list || !addBtn) return;

  function renderProfilesUI() {
    const profiles = loadProfiles();
    const active = getActiveProfile();
    list.innerHTML = '';

    profiles.forEach(p => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'profile-btn';
      btn.textContent = p === active ? `${p} (active)` : p;
      btn.addEventListener('click', () => {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}:active-profile`, p);
        location.reload();
      });
      list.appendChild(btn);
    });
  }

  addBtn.addEventListener('click', () => {
    const name = prompt('New profile name:');
    const trimmed = (name || '').trim();
    if (!trimmed) return;

    const profiles = loadProfiles();
    if (profiles.includes(trimmed)) return;
    profiles.push(trimmed);
    saveProfiles(profiles);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}:active-profile`, trimmed);
    location.reload();
  });

  renderProfilesUI();
}

// ---------------------------------------------------------------------------
// Render app based on settings
// ---------------------------------------------------------------------------
function renderApp() {
  const cfg = window.TASKS_CONFIG;
  if (!cfg) return;

  const settings = load('settings', {});
  const splitDailies = settings.splitDailies !== false;
  const splitWeeklies = settings.splitWeeklies !== false;

  const dailies = splitDailies ? cfg.dailies : [...cfg.dailies, ...cfg.gathering.map(t => ({ ...t, storeType: 'gathering' }))];
  const gathering = splitDailies ? cfg.gathering : [];
  const weeklies = splitWeeklies ? cfg.weeklies : [...cfg.weeklies, ...cfg.weeklyGathering.map(t => ({ ...t, storeType: 'weeklyGathering' }))];
  const weeklyGathering = splitWeeklies ? cfg.weeklyGathering : [];

  const gatheringSection = document.getElementById('gathering-section');
  if (gatheringSection) gatheringSection.classList.toggle('hidden', !splitDailies);

  const weeklyGatheringSection = document.getElementById('weekly-gathering-section');
  if (weeklyGatheringSection) weeklyGatheringSection.classList.toggle('hidden', !splitWeeklies);

  buildRows(dailies, 'dailies');
  buildRows(gathering, 'gathering');
  buildRows(weeklies, 'weeklies');
  buildRows(weeklyGathering, 'weeklyGathering');
  buildRows(cfg.monthlies, 'monthlies');

  loadCustomTasks();
  fetchProfits();
  renderHerbUI();
  renderCooldownButtons();
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  checkAutoReset();
  updateTimers();
  setInterval(updateTimers, 1000);

  setupDropdowns();
  setupCompactToggle();
  setupImportExport();
  setupFarmingPanel();
  setupProfiles();
  loadSettings();
  renderApp();

  document.getElementById('add-custom-task-btn').addEventListener('click', showAddCustomTaskModal);
  document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
});
