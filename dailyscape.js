'use strict';

const STORAGE_ROOT = 'rsdailies';
const GLOBAL_PROFILES_KEY = `${STORAGE_ROOT}:profiles`;
const ACTIVE_PROFILE_KEY = `${STORAGE_ROOT}:active-profile`;

let currentProfile = 'default';
let profilePrefix = `${STORAGE_ROOT}:default:`;
let dragRow = null;

function setProfile(name) {
  currentProfile = name || 'default';
  profilePrefix = `${STORAGE_ROOT}:${currentProfile}:`;
  localStorage.setItem(ACTIVE_PROFILE_KEY, currentProfile);
}

function initProfileContext() {
  setProfile(localStorage.getItem(ACTIVE_PROFILE_KEY) || 'default');
}

function loadProfiles() {
  try {
    const raw = localStorage.getItem(GLOBAL_PROFILES_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : ['default'];
  } catch {
    return ['default'];
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(GLOBAL_PROFILES_KEY, JSON.stringify(profiles));
}

function profileKey(key) {
  return `${profilePrefix}${key}`;
}

function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(profileKey(key));
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(profileKey(key), JSON.stringify(value));
}

function removeKey(key) {
  localStorage.removeItem(profileKey(key));
}

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `custom-${Date.now()}`;
}

function nextDailyBoundary(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
}

function nextWeeklyBoundary(now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const day = d.getUTCDay();
  let daysUntilWed = (3 - day + 7) % 7;
  if (daysUntilWed === 0) daysUntilWed = 7;
  d.setUTCDate(d.getUTCDate() + daysUntilWed);
  return d;
}

function nextMonthlyBoundary(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
}

function formatCountdown(targetDate) {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return '00:00:00';
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatDurationMs(ms) {
  const clamped = Math.max(0, ms);
  const hours = Math.floor(clamped / 3600000);
  const minutes = Math.floor((clamped % 3600000) / 60000);
  const seconds = Math.floor((clamped % 60000) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateCountdowns() {
  const daily = formatCountdown(nextDailyBoundary());
  const weekly = formatCountdown(nextWeeklyBoundary());
  const monthly = formatCountdown(nextMonthlyBoundary());

  const map = {
    'countdown-rs3daily': daily,
    'countdown-rs3dailyshops': daily,
    'countdown-rs3weekly': weekly,
    'countdown-rs3weeklyshops': weekly,
    'countdown-rs3monthly': monthly
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function getSettings() {
  return load('settings', {
    splitDailyTables: true,
    splitWeeklyTables: true,
    herbTicks: 4,
    growthOffsetMinutes: 0,
    browserNotif: false,
    webhookUrl: ''
  });
}

function saveSettings(settings) {
  save('settings', settings);
}

function applySettingsToDom() {
  const settings = getSettings();

  const splitDaily = document.getElementById('setting-split-daily-tables');
  const splitWeekly = document.getElementById('setting-split-weekly-tables');
  const herbs3 = document.getElementById('setting-3tick-herbs');
  const growthOffset = document.getElementById('setting-growth-offset');
  const browserNotif = document.getElementById('setting-browser-notif');
  const webhook = document.getElementById('setting-webhook-url');

  if (splitDaily) splitDaily.checked = settings.splitDailyTables !== false;
  if (splitWeekly) splitWeekly.checked = settings.splitWeeklyTables !== false;
  if (herbs3) herbs3.checked = settings.herbTicks === 3;
  if (growthOffset) growthOffset.value = String(settings.growthOffsetMinutes || 0);
  if (browserNotif) browserNotif.checked = !!settings.browserNotif;
  if (webhook) webhook.value = settings.webhookUrl || '';
}

function collectSettingsFromDom() {
  const growthOffsetRaw = document.getElementById('setting-growth-offset')?.value || '0';
  let growthOffsetMinutes = parseInt(growthOffsetRaw, 10);
  if (!Number.isFinite(growthOffsetMinutes)) growthOffsetMinutes = 0;
  growthOffsetMinutes = Math.max(-60, Math.min(60, growthOffsetMinutes));

  return {
    splitDailyTables: !!document.getElementById('setting-split-daily-tables')?.checked,
    splitWeeklyTables: !!document.getElementById('setting-split-weekly-tables')?.checked,
    herbTicks: document.getElementById('setting-3tick-herbs')?.checked ? 3 : 4,
    growthOffsetMinutes,
    browserNotif: !!document.getElementById('setting-browser-notif')?.checked,
    webhookUrl: (document.getElementById('setting-webhook-url')?.value || '').trim()
  };
}

function getSectionState(sectionKey) {
  return {
    completed: load(`completed:${sectionKey}`, {}),
    hiddenRows: load(`hiddenRows:${sectionKey}`, {}),
    order: load(`order:${sectionKey}`, []),
    sort: load(`sort:${sectionKey}`, 'default'),
    hideSection: load(`hideSection:${sectionKey}`, false),
    showHidden: load(`showHidden:${sectionKey}`, false)
  };
}

function getCustomTasks() {
  return load('customTasks', []);
}

function saveCustomTasks(tasks) {
  save('customTasks', tasks);
}

function getFarmingTimers() {
  return load('farmingTimers', {});
}

function saveFarmingTimers(timers) {
  save('farmingTimers', timers);
}

function getResolvedSections() {
  const cfg = window.TASKS_CONFIG || {};
  const settings = getSettings();

  const dailies = Array.isArray(cfg.dailies) ? cfg.dailies : [];
  const gathering = Array.isArray(cfg.gathering) ? cfg.gathering : [];
  const weeklies = Array.isArray(cfg.weeklies) ? cfg.weeklies : [];
  const weeklyGathering = Array.isArray(cfg.weeklyGathering) ? cfg.weeklyGathering : [];
  const monthlies = Array.isArray(cfg.monthlies) ? cfg.monthlies : [];
  const custom = getCustomTasks();
  const farming = Array.isArray(window.FARMING_CONFIG?.tasks) ? window.FARMING_CONFIG.tasks : [];

  return {
    rs3daily: settings.splitDailyTables ? dailies : dailies.concat(gathering.map(x => ({ ...x, _sourceSection: 'rs3dailyshops' }))),
    rs3dailyshops: settings.splitDailyTables ? gathering : [],
    rs3farming: farming,
    rs3weekly: settings.splitWeeklyTables ? weeklies : weeklies.concat(weeklyGathering.map(x => ({ ...x, _sourceSection: 'rs3weeklyshops' }))),
    rs3weeklyshops: settings.splitWeeklyTables ? weeklyGathering : [],
    rs3monthly: monthlies,
    custom
  };
}

function getContainerId(sectionKey) {
  return {
    rs3daily: 'dailies',
    rs3dailyshops: 'gathering',
    rs3farming: 'farming',
    rs3weekly: 'weeklies',
    rs3weeklyshops: 'weekly-gathering',
    rs3monthly: 'monthlies',
    custom: 'custom-tasks'
  }[sectionKey];
}

function getTableId(sectionKey) {
  return {
    rs3daily: 'rs3daily_table',
    rs3dailyshops: 'rs3dailyshops_table',
    rs3farming: 'rs3farming_table',
    rs3weekly: 'rs3weekly_table',
    rs3weeklyshops: 'rs3weeklyshops_table',
    rs3monthly: 'rs3monthly_table',
    custom: 'custom_table'
  }[sectionKey];
}

function getTaskState(sectionKey, taskId) {
  const state = getSectionState(sectionKey);
  if (state.hiddenRows[taskId]) return 'hide';

  if (sectionKey === 'rs3farming') {
    const timers = getFarmingTimers();
    return timers[taskId] ? 'true' : 'false';
  }

  return state.completed[taskId] ? 'true' : 'false';
}

function setTaskCompleted(sectionKey, taskId, completed) {
  const state = getSectionState(sectionKey);
  if (state.hiddenRows[taskId]) return;

  if (completed) state.completed[taskId] = true;
  else delete state.completed[taskId];

  save(`completed:${sectionKey}`, state.completed);
}

function hideTask(sectionKey, taskId) {
  const state = getSectionState(sectionKey);
  state.hiddenRows[taskId] = true;

  if (sectionKey !== 'rs3farming') {
    delete state.completed[taskId];
    save(`completed:${sectionKey}`, state.completed);
  }

  save(`hiddenRows:${sectionKey}`, state.hiddenRows);
}

function resetSectionView(sectionKey) {
  removeKey(`hiddenRows:${sectionKey}`);
  removeKey(`order:${sectionKey}`);
  removeKey(`sort:${sectionKey}`);
  removeKey(`showHidden:${sectionKey}`);
  removeKey(`hideSection:${sectionKey}`);

  if (sectionKey === 'rs3farming') {
    saveFarmingTimers({});
  }
}

function applyOrderingAndSort(sectionKey, tasks) {
  const state = getSectionState(sectionKey);
  let result = [...tasks];

  if (state.sort === 'alpha') {
    result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return result;
  }

  const order = Array.isArray(state.order) ? state.order : [];
  if (!order.length) return result;

  const index = new Map(order.map((id, i) => [id, i]));
  result.sort((a, b) => {
    const ai = index.has(a.id) ? index.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bi = index.has(b.id) ? index.get(b.id) : Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return String(a.name).localeCompare(String(b.name));
  });

  return result;
}

function cloneRowTemplate() {
  return document.getElementById('sample_row').content.firstElementChild.cloneNode(true);
}

function startFarmingTimer(task) {
  const timers = getFarmingTimers();
  const settings = getSettings();

  const herbTicks = settings.herbTicks === 3 ? 3 : 4;
  const stages = task.useHerbSetting ? herbTicks : (task.stages || 1);
  const cycleMinutes = task.cycleMinutes || 20;
  const offset = settings.growthOffsetMinutes || 0;

  const startedAt = Date.now();
  const readyAt = computeReadyAtMs(startedAt, cycleMinutes, stages, offset);

  timers[task.id] = {
    id: task.id,
    startedAt,
    readyAt,
    cycleMinutes,
    stages,
    alerted: false
  };

  saveFarmingTimers(timers);
}

function clearFarmingTimer(taskId) {
  const timers = getFarmingTimers();
  delete timers[taskId];
  saveFarmingTimers(timers);
}

function computeReadyAtMs(nowMs, cycleMinutes, stages, offsetMinutes = 0) {
  const cycleMs = Math.max(1, cycleMinutes) * 60000;
  const offsetMs = (offsetMinutes || 0) * 60000;
  const anchorMs = Date.UTC(1970, 0, 1, 0, 0, 0, 0) + offsetMs;
  const elapsed = nowMs - anchorMs;
  const steps = Math.floor(elapsed / cycleMs);
  const currentStart = anchorMs + steps * cycleMs;
  const nextStart = currentStart <= nowMs ? currentStart + cycleMs : currentStart;
  return nextStart + Math.max(0, (stages || 1) - 1) * cycleMs;
}

function maybeBrowserNotify(title, body) {
  const settings = getSettings();
  if (!settings.browserNotif) return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, { body });
  } catch {
    // ignore
  }
}

async function maybeWebhookNotify(body) {
  const settings = getSettings();
  if (!settings.webhookUrl) return;

  try {
    await fetch(settings.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: body })
    });
  } catch {
    // ignore
  }
}

function cleanupReadyFarmingTimers() {
  const timers = getFarmingTimers();
  const tasks = window.FARMING_CONFIG?.tasks || [];
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  let changed = false;

  Object.values(timers).forEach(timer => {
    if (!timer) return;
    if (timer.readyAt > Date.now()) return;

    const task = taskMap.get(timer.id);
    if (task?.alertOnReady && !timer.alerted) {
      maybeBrowserNotify('RSDailies', `${task.name} is ready.`);
      maybeWebhookNotify(`RSDailies: ${task.name} is ready.`);
    }

    delete timers[timer.id];
    changed = true;
  });

  if (changed) saveFarmingTimers(timers);
}

function createRow(sectionKey, task, isCustom = false) {
  const row = cloneRowTemplate();
  row.dataset.id = task.id;
  row.dataset.completed = getTaskState(sectionKey, task.id);

  const nameCell = row.querySelector('.activity_name');
  const nameLink = nameCell.querySelector('a');
  const hideBtn = nameCell.querySelector('.hide-button');
  const colorCell = row.querySelector('.activity_color');
  const desc = row.querySelector('.activity_desc');

  if (task.wiki) {
    nameLink.href = task.wiki;
  } else {
    nameLink.href = '#';
    nameLink.addEventListener('click', (e) => e.preventDefault());
  }
  nameLink.textContent = task.name;

  desc.textContent = '';

  if (task.note) {
    const noteLine = document.createElement('span');
    noteLine.className = 'activity_note_line';
    noteLine.textContent = task.note;
    desc.appendChild(noteLine);
  }

  if (task.profit && task.profit.item && task.profit.qty) {
    const profit = document.createElement('span');
    profit.className = 'item_profit';
    profit.dataset.item = task.profit.item;
    profit.dataset.qty = String(task.profit.qty);
    profit.textContent = '…';
    desc.appendChild(profit);
  }

  if (sectionKey === 'rs3farming') {
    const timers = getFarmingTimers();
    const state = timers[task.id];
    const statusLine = document.createElement('span');
    statusLine.className = 'activity_note_line';

    if (state) {
      statusLine.textContent = `Timer running — ready in ${formatDurationMs(state.readyAt - Date.now())}`;
    } else {
      statusLine.textContent = `Click the right column to start this timer.`;
    }

    desc.appendChild(statusLine);
  }

  if (typeof task.cooldownMinutes === 'number' && task.cooldownMinutes > 0) {
    const cdBtn = document.createElement('button');
    cdBtn.className = 'btn btn-warning btn-sm ms-2 cooldown-inline-btn';
    cdBtn.type = 'button';
    cdBtn.dataset.taskId = task.id;
    cdBtn.dataset.cooldownMinutes = String(task.cooldownMinutes);
    cdBtn.textContent = 'Start Cooldown';
    cdBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      startCooldown(task.id, task.cooldownMinutes);
    });
    desc.appendChild(cdBtn);
  }

  hideBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCustom) {
      const remove = confirm(`Delete custom task "${task.name}"?`);
      if (!remove) return;
      const next = getCustomTasks().filter(t => t.id !== task.id);
      saveCustomTasks(next);

      const completed = load('completed:custom', {});
      const hiddenRows = load('hiddenRows:custom', {});
      delete completed[task.id];
      delete hiddenRows[task.id];
      save('completed:custom', completed);
      save('hiddenRows:custom', hiddenRows);
    } else {
      hideTask(sectionKey, task.id);
    }

    renderApp();
  });

  colorCell.addEventListener('click', (e) => {
    e.preventDefault();

    const state = getTaskState(sectionKey, task.id);
    if (state === 'hide') return;

    if (sectionKey === 'rs3farming') {
      if (state === 'true') clearFarmingTimer(task.id);
      else startFarmingTimer(task);
    } else {
      setTaskCompleted(sectionKey, task.id, state !== 'true');
    }

    renderApp();
  });

  row.addEventListener('dragstart', () => {
    dragRow = row;
    row.classList.add('dragging');
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    dragRow = null;
    persistOrderFromTable(sectionKey);
  });

  row.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = row;
    if (!dragRow || dragRow === target) return;

    const tbody = target.parentElement;
    const rect = target.getBoundingClientRect();
    const next = (e.clientY - rect.top) > rect.height / 2;
    tbody.insertBefore(dragRow, next ? target.nextSibling : target);
  });

  return row;
}

function persistOrderFromTable(sectionKey) {
  const table = document.getElementById(getTableId(sectionKey));
  const tbody = table?.querySelector('tbody');
  if (!tbody) return;
  const order = [...tbody.querySelectorAll('tr')].map(tr => tr.dataset.id).filter(Boolean);
  save(`order:${sectionKey}`, order);
}

function renderSection(sectionKey, tasks) {
  const container = document.getElementById(getContainerId(sectionKey));
  const table = document.getElementById(getTableId(sectionKey));
  const tbody = table?.querySelector('tbody');
  if (!container || !table || !tbody) return;

  const state = getSectionState(sectionKey);
  container.dataset.hide = state.hideSection ? 'hide' : 'show';
  container.dataset.showHidden = state.showHidden ? 'true' : 'false';

  tbody.innerHTML = '';

  const finalTasks = applyOrderingAndSort(sectionKey, tasks);
  finalTasks.forEach(task => {
    const row = createRow(sectionKey, task, sectionKey === 'custom');
    tbody.appendChild(row);
  });
}

function renderApp() {
  cleanupReadyFarmingTimers();

  const settings = getSettings();
  const sections = getResolvedSections();

  document.body.classList.toggle('combine-daily-sections', !settings.splitDailyTables);
  document.body.classList.toggle('combine-weekly-sections', !settings.splitWeeklyTables);

  renderSection('rs3daily', sections.rs3daily);
  renderSection('rs3dailyshops', sections.rs3dailyshops);
  renderSection('rs3farming', sections.rs3farming);
  renderSection('rs3weekly', sections.rs3weekly);
  renderSection('rs3weeklyshops', sections.rs3weeklyshops);
  renderSection('rs3monthly', sections.rs3monthly);
  renderSection('custom', sections.custom);

  document.getElementById('rs3dailyshops_nav').style.display = settings.splitDailyTables ? '' : 'none';
  document.getElementById('rs3weeklyshops_nav').style.display = settings.splitWeeklyTables ? '' : 'none';

  fetchProfits();
  renderCooldownButtons();
  updateProfileHeader();
}

function bindSectionControls(sectionKey, opts = { sortable: false }) {
  const resetBtn = document.getElementById(`${sectionKey}_reset_button`);
  const showHiddenBtn = document.getElementById(`${sectionKey}_show_hidden_button`);
  const hideBtn = document.getElementById(`${sectionKey}_hide_button`);
  const unhideBtn = document.getElementById(`${sectionKey}_unhide_button`);
  const sortBtn = document.getElementById(`${sectionKey}_sort_button`);

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetSectionView(sectionKey);
      renderApp();
    });
  }

  if (showHiddenBtn) {
    showHiddenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const next = !getSectionState(sectionKey).showHidden;
      save(`showHidden:${sectionKey}`, next);
      renderApp();
    });
  }

  if (hideBtn) {
    hideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      save(`hideSection:${sectionKey}`, true);
      renderApp();
    });
  }

  if (unhideBtn) {
    unhideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      save(`hideSection:${sectionKey}`, false);
      renderApp();
    });
  }

  if (sortBtn && opts.sortable) {
    sortBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = getSectionState(sectionKey).sort;
      const next = current === 'default' ? 'alpha' : 'default';
      save(`sort:${sectionKey}`, next);
      renderApp();
    });
  }
}

function updateProfileHeader() {
  const profileName = document.getElementById('profile-name');
  if (!profileName) return;
  profileName.style.display = '';
  profileName.style.visibility = 'visible';
  profileName.textContent = currentProfile;
}

function setupProfileControl() {
  const button = document.getElementById('profile-button');
  const panel = document.getElementById('profile-control');
  const list = document.getElementById('profile-list');
  const form = document.getElementById('profile-form');

  function renderProfiles() {
    const profiles = loadProfiles();
    list.innerHTML = '';

    profiles.forEach(name => {
      const li = document.createElement('li');
      li.className = 'profile-row';

      const link = document.createElement('a');
      link.href = '#';
      link.className = 'profile-link';
      link.textContent = name === currentProfile ? `${name} (active)` : name;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        setProfile(name);
        renderApp();
        renderProfiles();
      });

      li.appendChild(link);

      if (name !== 'default') {
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn btn-danger btn-sm profile-delete';
        del.textContent = '×';
        del.addEventListener('click', () => {
          if (!confirm(`Delete profile "${name}"? This removes stored data for that profile from this browser.`)) return;

          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${STORAGE_ROOT}:${name}:`)) {
              localStorage.removeItem(key);
            }
          }

          const next = loadProfiles().filter(p => p !== name);
          saveProfiles(next);

          if (currentProfile === name) {
            setProfile('default');
          }

          renderProfiles();
          renderApp();
        });
        li.appendChild(del);
      }

      list.appendChild(li);
    });
  }

  button.addEventListener('click', (e) => {
    e.preventDefault();
    const visible = panel.dataset.display === 'block';
    closeFloatingControls();
    if (!visible) {
      panel.style.display = 'block';
      panel.style.visibility = 'visible';
      panel.dataset.display = 'block';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('profileName');
    const name = (input.value || '').trim();
    if (!name) return;

    const profiles = loadProfiles();
    if (!profiles.includes(name)) {
      profiles.push(name);
      saveProfiles(profiles);
    }

    setProfile(name);
    input.value = '';
    renderProfiles();
    renderApp();
  });

  renderProfiles();
}

function setupSettingsControl() {
  const button = document.getElementById('settings-button');
  const panel = document.getElementById('settings-control');
  const saveBtn = document.getElementById('save-settings-btn');

  button.addEventListener('click', (e) => {
    e.preventDefault();
    const visible = panel.dataset.display === 'block';
    closeFloatingControls();
    if (!visible) {
      panel.style.display = 'block';
      panel.style.visibility = 'visible';
      panel.dataset.display = 'block';
    }
  });

  saveBtn.addEventListener('click', async () => {
    const settings = collectSettingsFromDom();
    saveSettings(settings);

    if (settings.browserNotif && 'Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // ignore
      }
    }

    renderApp();
  });
}

function closeFloatingControls() {
  ['profile-control', 'settings-control'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.dataset.display = 'none';
  });
}

function setupGlobalClickCloser() {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (
      target.closest('#profile-button') ||
      target.closest('#profile-control') ||
      target.closest('#settings-button') ||
      target.closest('#settings-control')
    ) {
      return;
    }
    closeFloatingControls();
  });
}

function setupCompactMode() {
  const button = document.getElementById('layout-button');
  const compact = load('compactMode', false);
  document.body.classList.toggle('compact', compact);

  button.addEventListener('click', (e) => {
    e.preventDefault();
    const next = !document.body.classList.contains('compact');
    document.body.classList.toggle('compact', next);
    save('compactMode', next);
  });
}

function buildExportToken() {
  const payload = {
    profile: currentProfile,
    globals: {
      profiles: loadProfiles(),
      activeProfile: currentProfile
    },
    profileData: {}
  };

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(profilePrefix)) {
      payload.profileData[key] = localStorage.getItem(key);
    }
  }

  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function importToken(rawToken) {
  try {
    const decoded = decodeURIComponent(escape(atob(rawToken)));
    const data = JSON.parse(decoded);

    if (data?.globals?.profiles && Array.isArray(data.globals.profiles)) {
      saveProfiles(data.globals.profiles);
    }

    if (data?.profileData && typeof data.profileData === 'object') {
      Object.entries(data.profileData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }

    if (data?.profile) {
      setProfile(data.profile);
    }

    location.reload();
  } catch {
    const input = document.getElementById('token-input');
    if (input) input.classList.add('is-invalid');
  }
}

function setupImportExport() {
  const tokenButton = document.getElementById('token-button');
  const tokenOutput = document.getElementById('token-output');
  const tokenInput = document.getElementById('token-input');
  const tokenCopy = document.getElementById('token-copy');
  const tokenImport = document.getElementById('token-import');

  tokenButton.addEventListener('click', () => {
    tokenOutput.value = buildExportToken();
    tokenInput.classList.remove('is-invalid');
  });

  tokenCopy.addEventListener('click', async () => {
    const text = tokenOutput.value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      tokenOutput.focus();
      tokenOutput.select();
      document.execCommand('copy');
    }
  });

  tokenImport.addEventListener('click', () => {
    tokenInput.classList.remove('is-invalid');
    importToken(tokenInput.value.trim());
  });
}

function getCooldowns() {
  return load('cooldowns', {});
}

function saveCooldowns(data) {
  save('cooldowns', data);
}

function startCooldown(taskId, minutes) {
  const cooldowns = getCooldowns();
  cooldowns[taskId] = {
    readyAt: Date.now() + Math.max(1, Math.floor(minutes)) * 60000,
    minutes: Math.max(1, Math.floor(minutes))
  };
  saveCooldowns(cooldowns);
  renderCooldownButtons();
}

function renderCooldownButtons() {
  const cooldowns = getCooldowns();
  const now = Date.now();

  document.querySelectorAll('.cooldown-inline-btn').forEach(btn => {
    const taskId = btn.dataset.taskId;
    const state = cooldowns[taskId];

    if (!state) {
      btn.textContent = 'Start Cooldown';
      btn.classList.remove('btn-success');
      btn.classList.add('btn-warning');
      return;
    }

    const ms = state.readyAt - now;
    if (ms <= 0) {
      btn.textContent = 'Ready';
      btn.classList.remove('btn-warning');
      btn.classList.add('btn-success');
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = getCooldowns();
        delete next[taskId];
        saveCooldowns(next);
        renderApp();
      };
    } else {
      btn.textContent = `Cooldown ${formatDurationMs(ms)}`;
    }
  });
}

function clearCompletionFor(sectionKey) {
  save(`completed:${sectionKey}`, {});
}

function resetCustomCompletions(kind) {
  const tasks = getCustomTasks();
  const completed = load('completed:custom', {});
  let changed = false;

  tasks.forEach(task => {
    const resetKind = String(task.reset || 'daily').toLowerCase();
    if (resetKind === kind && completed[task.id]) {
      delete completed[task.id];
      changed = true;
    }
  });

  if (changed) save('completed:custom', completed);
}

function checkAutoReset() {
  const now = Date.now();
  const lastVisit = load('lastVisit', 0);

  const prevDaily = nextDailyBoundary(new Date(now - 86400000)).getTime();
  const prevWeekly = nextWeeklyBoundary(new Date(now - 7 * 86400000)).getTime();
  const prevMonthly = nextMonthlyBoundary(new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1))).getTime();

  if (lastVisit < prevDaily) {
    clearCompletionFor('rs3daily');
    clearCompletionFor('rs3dailyshops');
    resetCustomCompletions('daily');
    maybeBrowserNotify('RSDailies', 'Daily reset happened.');
    maybeWebhookNotify('RSDailies: daily reset happened (UTC).');
  }

  if (lastVisit < prevWeekly) {
    clearCompletionFor('rs3weekly');
    clearCompletionFor('rs3weeklyshops');
    resetCustomCompletions('weekly');
    maybeBrowserNotify('RSDailies', 'Weekly reset happened.');
    maybeWebhookNotify('RSDailies: weekly reset happened (UTC).');
  }

  if (lastVisit < prevMonthly) {
    clearCompletionFor('rs3monthly');
    resetCustomCompletions('monthly');
    maybeBrowserNotify('RSDailies', 'Monthly reset happened.');
    maybeWebhookNotify('RSDailies: monthly reset happened (UTC).');
  }

  save('lastVisit', now);
}

async function fetchProfits() {
  const nodes = [...document.querySelectorAll('.item_profit[data-item][data-qty]')];
  if (!nodes.length) return;

  const items = [...new Set(nodes.map(n => n.dataset.item).filter(Boolean))];
  if (!items.length) return;

  const query = `https://runescape.wiki/api.php?action=ask&query=[[Exchange:${items.join('||Exchange:')}]]|?Exchange:Price&format=json&origin=*`;

  try {
    const res = await fetch(query);
    const data = await res.json();
    const results = data?.query?.results || {};

    nodes.forEach(node => {
      const item = node.dataset.item;
      const qty = parseInt(node.dataset.qty || '0', 10);
      const row = results[`Exchange:${item}`];
      const price = row?.printouts?.['Exchange:Price']?.[0]?.num;
      if (!price || !qty) {
        node.textContent = '';
        return;
      }
      node.textContent = ` ~${Math.round(price * qty).toLocaleString()} gp`;
    });
  } catch {
    nodes.forEach(node => {
      node.textContent = '';
    });
  }
}

function promptAddCustomTask() {
  const name = prompt('Task name:');
  if (!name || !name.trim()) return;

  const note = prompt('Task note (optional):') || '';
  const wiki = prompt('Wiki / URL (optional):') || '';
  const reset = (prompt('Reset type? daily / weekly / monthly', 'daily') || 'daily').trim().toLowerCase();

  const allowed = ['daily', 'weekly', 'monthly'];
  const task = {
    id: `custom-${slugify(name)}-${Date.now()}`,
    name: name.trim(),
    note: note.trim(),
    wiki: wiki.trim(),
    reset: allowed.includes(reset) ? reset : 'daily'
  };

  const tasks = getCustomTasks();
  tasks.push(task);
  saveCustomTasks(tasks);
  renderApp();
}

function setupCustomAdd() {
  document.getElementById('custom_add_button')?.addEventListener('click', (e) => {
    e.preventDefault();
    promptAddCustomTask();
  });
}

function setupSectionBindings() {
  bindSectionControls('rs3daily');
  bindSectionControls('rs3dailyshops', { sortable: true });
  bindSectionControls('rs3farming');
  bindSectionControls('rs3weekly');
  bindSectionControls('rs3weeklyshops', { sortable: true });
  bindSectionControls('rs3monthly');
  bindSectionControls('custom');
}

document.addEventListener('DOMContentLoaded', () => {
  initProfileContext();
  applySettingsToDom();
  checkAutoReset();
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
  setInterval(() => {
    checkAutoReset();
    cleanupReadyFarmingTimers();
    renderCooldownButtons();
    renderApp();
  }, 1000);

  setupSectionBindings();
  setupProfileControl();
  setupSettingsControl();
  setupGlobalClickCloser();
  setupCompactMode();
  setupImportExport();
  setupCustomAdd();

  renderApp();
});