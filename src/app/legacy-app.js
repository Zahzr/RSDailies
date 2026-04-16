import { tasksConfig as TASKS_CONFIG } from '../config/tasks/index.js';
import { farmingConfig as FARMING_CONFIG } from '../config/farming/index.js';
import {
  initProfileContext as initProfileContextFeature,
  setProfile as setProfileFeature,
  loadProfiles as loadProfilesFeature,
  saveProfiles as saveProfilesFeature,
  profileKey as profileKeyFeature,
  loadProfileValue,
  saveProfileValue,
  removeProfileValue,
  saveSectionValue as saveSectionValueFeature
} from '../features/profiles/index.js';
import {
  buildExportToken as buildExportTokenFeature,
  importProfileToken,
  updateProfileHeader as updateProfileHeaderFeature,
  setupProfileControl as setupProfileControlFeature
} from '../features/profiles/index.js';
import {
  getSettings as getSettingsFeature,
  saveSettings as saveSettingsFeature,
  applySettingsToDom as applySettingsToDomFeature,
  collectSettingsFromDom as collectSettingsFromDomFeature,
  setupSettingsControl as setupSettingsControlFeature
} from '../features/settings/index.js';
import {
  getResolvedSections as getResolvedSectionsFeature,
  getContainerId as getContainerIdFeature,
  getTableId as getTableIdFeature
} from '../features/tasks/index.js';
import {
  migrateLegacyViewModeToPageMode as migrateLegacyViewModeToPageModeFeature,
  getPageMode as getPageModeFeature,
  setPageMode as setPageModeFeature,
  closeFloatingControls as closeFloatingControlsFeature,
  setupViewsControl as setupViewsControlFeature
} from '../features/views/index.js';
import {
  nextDailyBoundary as nextDailyBoundaryCore,
  nextWeeklyBoundary as nextWeeklyBoundaryCore,
  nextMonthlyBoundary as nextMonthlyBoundaryCore
} from '../core/time/boundaries.js';
import { formatCountdown as formatCountdownCore } from '../core/time/countdowns.js';
import {
  formatMinutesCountdown as formatMinutesCountdownCore,
  formatDurationMs as formatDurationMsCore,
  formatDateTimeLocal as formatDateTimeLocalCore
} from '../core/time/formatters.js';
import { slugify as slugifyCore } from '../core/utils/strings.js';

let dragRow = null;

/* -----------------------------
   Storage / profiles
----------------------------- */

function setProfile(name) {
  setProfileFeature(name);
}

function initProfileContext() {
  initProfileContextFeature();
}

function loadProfiles() {
  return loadProfilesFeature();
}

function saveProfiles(profiles) {
  saveProfilesFeature(profiles);
}

function profileKey(key) {
  return profileKeyFeature(key);
}

function load(key, fallback = null) {
  return loadProfileValue(key, fallback);
}

function save(key, value) {
  saveProfileValue(key, value);
}

function removeKey(key) {
  removeProfileValue(key);
}

function saveSectionValue(sectionKey, field, value) {
  saveSectionValueFeature(sectionKey, field, value);
}

function slugify(input) {
  return slugifyCore(input);
}

/* -----------------------------
   Reset boundaries / formatting
----------------------------- */

function nextDailyBoundary(now = new Date()) {
  return nextDailyBoundaryCore(now);
}

function nextWeeklyBoundary(now = new Date()) {
  return nextWeeklyBoundaryCore(now);
}

function nextMonthlyBoundary(now = new Date()) {
  return nextMonthlyBoundaryCore(now);
}

function formatCountdown(targetDate) {
  return formatCountdownCore(targetDate);
}

function formatMinutesCountdown(totalMinutes) {
  return formatMinutesCountdownCore(totalMinutes);
}

function formatDurationMs(ms) {
  return formatDurationMsCore(ms);
}

function formatDateTimeLocal(ts) {
  return formatDateTimeLocalCore(ts);
}

function updateCountdowns() {
  const daily = formatCountdown(nextDailyBoundary());
  const weekly = formatCountdown(nextWeeklyBoundary());
  const monthly = formatCountdown(nextMonthlyBoundary());

  const ids = {
    'countdown-rs3daily': daily,
    'countdown-rs3dailyshops': daily,
    'countdown-rs3weekly': weekly,
    'countdown-rs3weeklyshops': weekly,
    'countdown-rs3monthly': monthly
  };

  Object.entries(ids).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

/* -----------------------------
   Settings
----------------------------- */

function getSettings() {
  return getSettingsFeature();
}

function saveSettings(settings) {
  saveSettingsFeature(settings);
}

function applySettingsToDom() {
  applySettingsToDomFeature(document, getSettings());
}

function collectSettingsFromDom() {
  return collectSettingsFromDomFeature(document);
}

/* -----------------------------
   Section state
----------------------------- */

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

function getCollapsedBlocks() {
  return load('collapsedBlocks', {});
}

function setCollapsedBlock(blockId, collapsed) {
  const blocks = getCollapsedBlocks();
  if (collapsed) {
    blocks[blockId] = true;
  } else {
    delete blocks[blockId];
  }
  save('collapsedBlocks', blocks);
}

function isCollapsedBlock(blockId) {
  const blocks = getCollapsedBlocks();
  return !!blocks[blockId];
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

function getCooldowns() {
  return load('cooldowns', {});
}

function saveCooldowns(data) {
  save('cooldowns', data);
}

function migrateLegacyViewModeToPageMode() {
  migrateLegacyViewModeToPageModeFeature();
}

function getPageMode() {
  return getPageModeFeature();
}

function setPageMode(mode) {
  setPageModeFeature(mode);
}

function getOverviewPins() {
  return load('overviewPins', {});
}

function saveOverviewPins(pins) {
  save('overviewPins', pins);
}

/* -----------------------------
   Penguin helper storage
----------------------------- */

function getPenguinWeeklyData() {
  return load('penguinWeeklyData', {});
}

function mergePenguinChildRows(task) {
  if (task.id !== 'penguins' || !Array.isArray(task.childRows)) {
    return task;
  }

  const weeklyData = getPenguinWeeklyData();
  const merged = task.childRows.map((child) => {
    const override = weeklyData[child.id] || {};
    return {
      ...child,
      name: override.name || child.name,
      note: override.note || child.note
    };
  });

  return {
    ...task,
    childRows: merged
  };
}

/* -----------------------------
   Task resolution
----------------------------- */

function getResolvedSections() {
  return getResolvedSectionsFeature({
    tasksConfig: TASKS_CONFIG,
    farmingConfig: FARMING_CONFIG,
    getCustomTasks,
    getPenguinWeeklyData
  });
}

function getContainerId(sectionKey) {
  return getContainerIdFeature(sectionKey);
}

function getTableId(sectionKey) {
  return getTableIdFeature(sectionKey);
}

function childStorageKey(sectionKey, parentId, childId) {
  return `${sectionKey}::${parentId}::${childId}`;
}

function getTaskState(sectionKey, taskId, task = null) {
  const section = getSectionState(sectionKey);

  if (section.hiddenRows[taskId]) return 'hide';

  if (task?.cooldownMinutes) {
    const cooldowns = getCooldowns();
    const cooldown = cooldowns[taskId];
    if (cooldown && cooldown.readyAt > Date.now()) return 'hide';
  }

  if (sectionKey === 'rs3farming' && task?.isTimerParent) {
    const timers = getFarmingTimers();
    const running = !!timers[task.id];

    if (running && task.vanishOnStart && !section.showHidden) {
      return 'hide';
    }

    return running ? 'running' : 'idle';
  }

  const completed = !!section.completed[taskId];
  if (completed && task?.reset && !section.showHidden) return 'hide';

  return completed ? 'true' : 'false';
}

function setTaskCompleted(sectionKey, taskId, completed) {
  const section = getSectionState(sectionKey);
  if (section.hiddenRows[taskId]) return;

  if (completed) {
    section.completed[taskId] = true;
  } else {
    delete section.completed[taskId];
  }

  saveSectionValue(sectionKey, 'completed', section.completed);
}

function hideTask(sectionKey, taskId) {
  const section = getSectionState(sectionKey);
  section.hiddenRows[taskId] = true;
  delete section.completed[taskId];

  saveSectionValue(sectionKey, 'completed', section.completed);
  saveSectionValue(sectionKey, 'hiddenRows', section.hiddenRows);

  if (sectionKey === 'rs3farming') {
    const timers = getFarmingTimers();
    delete timers[taskId];
    saveFarmingTimers(timers);
  }
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
  const result = [...tasks];

  if (state.sort === 'alpha') {
    result.sort((a, b) => String(a.name || a.label).localeCompare(String(b.name || b.label)));
    return result;
  }

  const order = Array.isArray(state.order) ? state.order : [];
  if (!order.length) return result;

  const index = new Map(order.map((id, i) => [id, i]));
  result.sort((a, b) => {
    const aId = a.id;
    const bId = b.id;
    const ai = index.has(aId) ? index.get(aId) : Number.MAX_SAFE_INTEGER;
    const bi = index.has(bId) ? index.get(bId) : Number.MAX_SAFE_INTEGER;

    if (ai !== bi) return ai - bi;
    return String(a.name || a.label).localeCompare(String(b.name || b.label));
  });

  return result;
}

/* -----------------------------
   Farming timers
----------------------------- */

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
    name: task.name,
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

function cleanupReadyFarmingTimers() {
  const timers = getFarmingTimers();
  let timersChanged = false;

  Object.values(timers).forEach((timer) => {
    if (!timer) return;
    if (timer.readyAt > Date.now()) return;

    delete timers[timer.id];
    timersChanged = true;
  });

  if (timersChanged) saveFarmingTimers(timers);
  return timersChanged;
}

/* -----------------------------
   Notifications / alerts
----------------------------- */

function maybeBrowserNotify(title, body) {
  const settings = getSettings();
  if (!settings.browserNotif) return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, { body });
  } catch {
    // noop
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
    // noop
  }
}

function getTaskAlertConfig(task) {
  const days = Number.isFinite(task?.alertDaysBeforeReset)
    ? Math.max(0, task.alertDaysBeforeReset)
    : 0;

  return { alertDaysBeforeReset: days };
}

function getTaskNextReset(task) {
  const reset = String(task?.reset || '').toLowerCase();
  if (reset === 'weekly') return nextWeeklyBoundary();
  if (reset === 'monthly') return nextMonthlyBoundary();
  return nextDailyBoundary();
}

function getTaskAlertTarget(task) {
  const nextReset = getTaskNextReset(task);
  const { alertDaysBeforeReset } = getTaskAlertConfig(task);
  return new Date(nextReset.getTime() - alertDaysBeforeReset * 86400000);
}

function maybeNotifyTaskAlert(task, sectionKey) {
  if (!task?.reset) return;

  const target = getTaskAlertTarget(task);
  if (Date.now() < target.getTime()) return;

  const notified = load(`notified:${sectionKey}`, {});
  const stamp = target.toISOString();

  if (notified[task.id] === stamp) return;

  maybeBrowserNotify('RSDailies', `${task.name} is due.`);
  maybeWebhookNotify(`RSDailies: ${task.name} is due.`);

  notified[task.id] = stamp;
  save(`notified:${sectionKey}`, notified);
}

function cleanupTaskNotificationsForReset(sectionKey) {
  removeKey(`notified:${sectionKey}`);
}

/* -----------------------------
   Reset handling
----------------------------- */

function clearCompletionFor(sectionKey) {
  save(`completed:${sectionKey}`, {});
  cleanupTaskNotificationsForReset(sectionKey);
}

function resetCustomCompletions(kind) {
  const tasks = getCustomTasks();
  const completed = load('completed:custom', {});
  let changed = false;

  tasks.forEach((task) => {
    const resetKind = String(task.reset || 'daily').toLowerCase();
    if (resetKind === kind && completed[task.id]) {
      delete completed[task.id];
      changed = true;
    }
  });

  if (changed) save('completed:custom', completed);
  cleanupTaskNotificationsForReset('custom');
}

function checkAutoReset() {
  const now = Date.now();
  const lastVisit = load('lastVisit', 0);
  let changed = false;

  const prevDaily = nextDailyBoundary(new Date(now - 86400000)).getTime();
  const prevWeekly = nextWeeklyBoundary(new Date(now - 7 * 86400000)).getTime();
  const prevMonthly = nextMonthlyBoundary(
    new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1))
  ).getTime();

  if (lastVisit < prevDaily) {
    clearCompletionFor('rs3daily');
    clearCompletionFor('gathering');
    clearCompletionFor('rs3farming');
    resetCustomCompletions('daily');
    maybeBrowserNotify('RSDailies', 'Daily reset happened.');
    maybeWebhookNotify('RSDailies: daily reset happened (UTC).');
    changed = true;
  }

  if (lastVisit < prevWeekly) {
    clearCompletionFor('rs3weekly');
    clearCompletionFor('gathering');
    resetCustomCompletions('weekly');
    maybeBrowserNotify('RSDailies', 'Weekly reset happened.');
    maybeWebhookNotify('RSDailies: weekly reset happened (UTC).');
    changed = true;
  }

  if (lastVisit < prevMonthly) {
    clearCompletionFor('rs3monthly');
    resetCustomCompletions('monthly');
    maybeBrowserNotify('RSDailies', 'Monthly reset happened.');
    maybeWebhookNotify('RSDailies: monthly reset happened (UTC).');
    changed = true;
  }

  save('lastVisit', now);
  return changed;
}

/* -----------------------------
   Profit helper
----------------------------- */

async function fetchProfits() {
  const nodes = [...document.querySelectorAll('.item_profit[data-item][data-qty]')];
  if (!nodes.length) return;

  const items = [...new Set(nodes.map((n) => n.dataset.item).filter(Boolean))];
  if (!items.length) return;

  const query = `https://runescape.wiki/api.php?action=ask&query=[[Exchange:${items.join('||Exchange:')}]]|?Exchange:Price&format=json&origin=*`;

  try {
    const res = await fetch(query);
    const data = await res.json();
    const results = data?.query?.results || {};

    nodes.forEach((node) => {
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
    nodes.forEach((node) => {
      node.textContent = '';
    });
  }
}

/* -----------------------------
   Cooldown-based hidden timers
----------------------------- */

function startCooldown(taskId, minutes) {
  const cooldowns = getCooldowns();
  cooldowns[taskId] = {
    readyAt: Date.now() + Math.max(1, Math.floor(minutes)) * 60000,
    minutes: Math.max(1, Math.floor(minutes))
  };
  saveCooldowns(cooldowns);
}

function cleanupReadyCooldowns() {
  const cooldowns = getCooldowns();
  const sections = ['custom', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'];
  let changed = false;

  Object.entries(cooldowns).forEach(([taskId, state]) => {
    if (!state || state.readyAt > Date.now()) return;

    delete cooldowns[taskId];
    changed = true;

    sections.forEach((sectionKey) => {
      const section = getSectionState(sectionKey);
      if (section.completed[taskId]) {
        delete section.completed[taskId];
        saveSectionValue(sectionKey, 'completed', section.completed);
      }
    });
  });

  if (changed) saveCooldowns(cooldowns);
  return changed;
}

function renderCooldownButtons() {
  /* intentionally no-op */
}

/* -----------------------------
   Tooltip
----------------------------- */

function getTooltipEl() {
  return document.getElementById('tooltip');
}

function showTooltip(text, anchorRect) {
  const tooltip = getTooltipEl();
  if (!tooltip || !text) return;

  tooltip.textContent = text;
  tooltip.style.display = 'block';
  tooltip.style.visibility = 'visible';

  const pad = 10;
  const width = tooltip.offsetWidth;
  const height = tooltip.offsetHeight;

  let left = anchorRect.left + window.scrollX;
  let top = anchorRect.bottom + window.scrollY + 8;

  const maxLeft = window.scrollX + document.documentElement.clientWidth - width - pad;
  if (left > maxLeft) left = maxLeft;
  if (left < pad) left = pad;

  const maxTop = window.scrollY + document.documentElement.clientHeight - height - pad;
  if (top > maxTop) {
    top = anchorRect.top + window.scrollY - height - 8;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip() {
  const tooltip = getTooltipEl();
  if (!tooltip) return;
  tooltip.style.display = 'none';
  tooltip.style.visibility = 'hidden';
  tooltip.textContent = '';
}

function buildTooltipText(task) {
  const parts = [];
  if (task.name) parts.push(task.name);
  if (task.note) parts.push(task.note);
  return parts.join('\n');
}

function attachTooltip(targetEl, task) {
  const text = buildTooltipText(task);
  if (!targetEl || !text) return;

  targetEl.dataset.tooltipText = text;

  const onEnter = () => showTooltip(text, targetEl.getBoundingClientRect());
  const onLeave = () => hideTooltip();
  const onMove = () => showTooltip(text, targetEl.getBoundingClientRect());

  targetEl.addEventListener('mouseenter', onEnter);
  targetEl.addEventListener('mouseleave', onLeave);
  targetEl.addEventListener('mousemove', onMove);
  targetEl.addEventListener('focus', onEnter);
  targetEl.addEventListener('blur', onLeave);
}

/* -----------------------------
   Row rendering helpers
----------------------------- */

function cloneRowTemplate() {
  return document.getElementById('sample_row').content.firstElementChild.cloneNode(true);
}

function createInlineActions(task, isCustom) {
  const wrapper = document.createElement('div');
  wrapper.className = 'activity_inline_actions';

  if (isCustom) {
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger btn-sm inline-danger';
    delBtn.type = 'button';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!confirm(`Delete custom task "${task.name}"?`)) return;

      const next = getCustomTasks().filter((t) => t.id !== task.id);
      saveCustomTasks(next);

      const completed = load('completed:custom', {});
      const hiddenRows = load('hiddenRows:custom', {});
      const notified = load('notified:custom', {});

      delete completed[task.id];
      delete hiddenRows[task.id];
      delete notified[task.id];

      save('completed:custom', completed);
      save('hiddenRows:custom', hiddenRows);
      save('notified:custom', notified);

      renderApp();
    });
    wrapper.appendChild(delBtn);
  }

  return wrapper.children.length ? wrapper : null;
}

function appendRowText(desc, task, sectionKey) {
  if (task.note) {
    const noteLine = document.createElement('span');
    noteLine.className = 'activity_note_line';
    noteLine.textContent = task.note;
    desc.appendChild(noteLine);
  }

  if (false && task.reset && sectionKey !== 'rs3farming' && !task.isChildRow) {
    const target = getTaskAlertTarget(task);
    const meta = document.createElement('span');
    meta.className = 'activity_note_line';
    meta.textContent = task.alertDaysBeforeReset > 0
      ? `\u26A0 Do before reset: ${formatDateTimeLocal(target)}`
      : `Reset: ${formatDateTimeLocal(target)}`;
    desc.appendChild(meta);
  }

  if (task.profit?.item && task.profit?.qty) {
    const profit = document.createElement('span');
    profit.className = 'item_profit';
    profit.dataset.item = task.profit.item;
    profit.dataset.qty = String(task.profit.qty);
    profit.textContent = '\u2026';
    desc.appendChild(profit);
  }

  if (task.durationNote) {
    const durationLine = document.createElement('span');
    durationLine.className = 'activity_duration_note';
    durationLine.textContent = task.durationNote;
    desc.appendChild(durationLine);
  }

  if (task.locationNote) {
    const locationLine = document.createElement('span');
    locationLine.className = 'activity_location_note';
    locationLine.textContent = task.locationNote;
    desc.appendChild(locationLine);
  }
}

function createBaseRow(sectionKey, task, options = {}) {
  const {
    isCustom = false,
    extraClass = '',
    customStorageId = null,
    renderNameOnRight = false
  } = options;

  const taskId = customStorageId || task.id;
  const row = cloneRowTemplate();
  row.dataset.id = taskId;
  row.dataset.completed = getTaskState(sectionKey, taskId, task);

  if (extraClass) row.classList.add(extraClass);

  const nameCell = row.querySelector('.activity_name');
  const nameLink = nameCell.querySelector('a');
  const pinBtn = nameCell.querySelector('.pin-button');
  const hideBtn = nameCell.querySelector('.hide-button');
  const notesCell = row.querySelector('.activity_notes');
  const statusCell = row.querySelector('.activity_status');
  const desc = row.querySelector('.activity_desc');
  const checkOff = statusCell.querySelector('.activity_check_off');
  const checkOn = statusCell.querySelector('.activity_check_on');

  attachTooltip(row, task);
  attachTooltip(notesCell, task);
  attachTooltip(statusCell, task);

  if (renderNameOnRight) {
    nameLink.textContent = '';
    nameLink.href = '#';
    nameLink.addEventListener('click', (e) => e.preventDefault());

    desc.textContent = '';
    const nameLine = document.createElement('span');
    nameLine.className = 'activity_note_line activity_child_name';
    nameLine.textContent = task.name;
    desc.appendChild(nameLine);

    appendRowText(desc, task, sectionKey);
  } else {
    if (task.wiki) {
      nameLink.href = task.wiki;
    } else {
      nameLink.href = '#';
      nameLink.addEventListener('click', (e) => e.preventDefault());
    }

    nameLink.textContent = task.name;
    desc.textContent = '';
    appendRowText(desc, task, sectionKey);
    attachTooltip(nameLink, task);
  }

  const actions = createInlineActions(task, isCustom);
  if (actions) desc.appendChild(actions);

  if (pinBtn) {
    const pinId = taskId.includes('::') ? taskId : `${sectionKey}::${taskId}`;
    const pins = getOverviewPins();
    const pinned = !!pins[pinId];

    pinBtn.textContent = pinned ? '\u2605' : '\u2606';
    pinBtn.title = pinned ? 'Unpin from Overview' : 'Pin to Overview';
    pinBtn.setAttribute('aria-label', pinBtn.title);

    pinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const nextPins = { ...getOverviewPins() };
      if (nextPins[pinId]) {
        delete nextPins[pinId];
      } else {
        nextPins[pinId] = true;
      }

      saveOverviewPins(nextPins);
      renderApp();
    });
  }

  hideBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCustom) {
      if (!confirm(`Delete custom task "${task.name}"?`)) return;

      const next = getCustomTasks().filter((t) => t.id !== task.id);
      saveCustomTasks(next);

      const completed = load('completed:custom', {});
      const hiddenRows = load('hiddenRows:custom', {});
      const notified = load('notified:custom', {});

      delete completed[task.id];
      delete hiddenRows[task.id];
      delete notified[task.id];

      save('completed:custom', completed);
      save('hiddenRows:custom', hiddenRows);
      save('notified:custom', notified);
    } else {
      hideTask(sectionKey, taskId);
    }

    renderApp();
  });

  const toggleTask = (e) => {
    e.preventDefault();

    const state = getTaskState(sectionKey, taskId, task);
    if (state === 'hide') return;

    if (sectionKey === 'rs3farming' && task?.isTimerParent) {
      if (state === 'running') {
        clearFarmingTimer(task.id);
      } else {
        startFarmingTimer(task);
      }
      renderApp();
      return;
    }

    if (task.cooldownMinutes && !task.isChildRow) {
      if (state === 'true' || state === 'hide') return;
      startCooldown(taskId, task.cooldownMinutes);
      setTaskCompleted(sectionKey, taskId, true);
      renderApp();
      return;
    }

    setTaskCompleted(sectionKey, taskId, state !== 'true');
    renderApp();
  };

  notesCell.addEventListener('click', toggleTask);
  statusCell.addEventListener('click', toggleTask);

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
    if (!dragRow || dragRow === row) return;

    const tbody = row.parentElement;
    const rect = row.getBoundingClientRect();
    const insertAfter = (e.clientY - rect.top) > rect.height / 2;
    tbody.insertBefore(dragRow, insertAfter ? row.nextSibling : row);
  });

  if (renderNameOnRight) {
    checkOff.style.display = '';
    checkOn.style.display = '';
  }

  return row;
}

function createRow(sectionKey, task, isCustom = false, extraClass = '') {
  return createBaseRow(sectionKey, task, {
    isCustom,
    extraClass,
    renderNameOnRight: false
  });
}

function createRightSideChildRow(sectionKey, task, parentId, extraClass = '') {
  return createBaseRow(sectionKey, task, {
    extraClass,
    customStorageId: childStorageKey(sectionKey, parentId, task.id),
    renderNameOnRight: true
  });
}

function persistOrderFromTable(sectionKey) {
  const table = document.getElementById(getTableId(sectionKey));
  const tbody = table?.querySelector('tbody');
  if (!tbody) return;

  const order = [...tbody.querySelectorAll('tr[data-id]')]
    .map((tr) => tr.dataset.id)
    .filter(Boolean);

  save(`order:${sectionKey}`, order);
}

function makeCollapseButton(blockId) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-secondary btn-sm mini-collapse-btn';
  const collapsed = isCollapsedBlock(blockId);
  btn.textContent = collapsed ? '\u25B6' : '\u25BC';
  btn.setAttribute('aria-label', collapsed ? 'Expand section' : 'Collapse section');
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCollapsedBlock(blockId, !isCollapsedBlock(blockId));
    renderApp();
  });
  return btn;
}

function createHeaderRow(label, blockId, options = {}) {
  const {
    className = '',
    rightText = '',
    onRightClick = null,
    collapsible = true
  } = options;

  const row = document.createElement('tr');
  row.className = className;

  const left = document.createElement('td');
  left.className = 'activity_name header_like_name';
  left.innerHTML = `<span class="header_like_text">${label}</span>`;

  const right = document.createElement('td');
  right.className = 'activity_notes header_like_color';
  right.colSpan = 2;

  const rightInner = document.createElement('div');
  rightInner.className = 'header_like_inner';

  const status = document.createElement('span');
  status.className = 'header_like_status';
  status.textContent = rightText || '';

  rightInner.appendChild(status);

  const collapse = (collapsible && blockId) ? makeCollapseButton(blockId) : null;
  if (collapse) rightInner.appendChild(collapse);
  right.appendChild(rightInner);

  if (onRightClick) {
    right.classList.add('header_like_click');
    right.addEventListener('click', (e) => {
      if (collapse && e.target.closest('.mini-collapse-btn')) return;
      onRightClick();
    });
  }

  row.appendChild(left);
  row.appendChild(right);
  return row;
}

/* -----------------------------
   Section renderers
----------------------------- */

function displayFarmingLabel(label) {
  const lower = String(label || '').toLowerCase();

  if (lower === 'herbs') return 'HERB';
  if (lower === 'allotments') return 'ALLOTMENT';
  if (lower === 'hops') return 'HOPS';
  if (lower === 'trees') return 'TREES';
  if (lower === 'specialty') return 'SPECIALTY';

  return String(label || '').toUpperCase();
}

function getFarmingHeaderStatus(task) {
  const timers = getFarmingTimers();
  const running = timers[task.id];
  return running ? `Ready in ${formatDurationMs(running.readyAt - Date.now())}` : 'Start timer';
}

function formatFarmingDurationNote(timerTask) {
  if (timerTask.durationNote) return timerTask.durationNote;

  const cycleMinutes = Number(timerTask.cycleMinutes || 0);
  const stages = Number(timerTask.stages || 1);

  if (timerTask.useHerbSetting) {
    const baseMinutes = cycleMinutes * stages;
    const upgradedMinutes = cycleMinutes * 3;
    return `Growth: ${baseMinutes} min base / ${upgradedMinutes} min with Speedy Growth`;
  }

  return cycleMinutes > 0 ? `Growth: ${cycleMinutes * stages} minutes` : '';
}

function buildFarmingLocationTask(timerTask, plotTask) {
  const timers = getFarmingTimers();
  const timer = timers[plotTask.id];
  const status = timer ? `Ready in ${formatDurationMs(timer.readyAt - Date.now())}` : 'Start timer';

  return {
    id: plotTask.id,
    name: plotTask.name,
    wiki: plotTask.wiki || timerTask.wiki || '',
    note: status,
    durationNote: plotTask.durationNote || timerTask.durationNote || formatFarmingDurationNote(timerTask),
    locationNote: plotTask.locationNote || '',
    isTimerParent: true,
    cycleMinutes: timerTask.cycleMinutes,
    stages: timerTask.stages,
    useHerbSetting: timerTask.useHerbSetting,
    vanishOnStart: timerTask.vanishOnStart !== false,
    timerKind: timerTask.timerKind || 'run',
    alertOnReady: timerTask.alertOnReady,
    autoClearOnReady: timerTask.autoClearOnReady
  };
}

function renderGroupedFarming(tbody, groups) {
  const groupsById = new Map((Array.isArray(groups) ? groups : []).map((g) => [g.id, g]));

  function renderLocations(timerTask, plots) {
    (Array.isArray(plots) ? plots : []).forEach((plotTask) => {
      const locTask = buildFarmingLocationTask(timerTask, plotTask);
      tbody.appendChild(createRow('rs3farming', locTask, false, 'farming-location-row'));
    });
  }

  function renderHeader(label, blockId, className, indent = false) {
    const row = createHeaderRow(label, blockId, {
      className,
      rightText: '',
      collapsible: true
    });
    if (indent) row.classList.add('farming-subheader-row');
    tbody.appendChild(row);
  }

  function renderTimerBlock(label, blockId, timerTask, plots, indent = false) {
    renderHeader(label, blockId, 'farming-group-row', indent);
    if (!isCollapsedBlock(blockId)) {
      renderLocations(timerTask, plots);
    }
  }

  // Parent: HERB (contains ALLOTMENT as a nested sub-header)
  const herbsGroup = groupsById.get('herbs');
  const allotmentsGroup = groupsById.get('allotments');

  if (herbsGroup?.timers?.length) {
    const herbTimer = herbsGroup.timers[0];
    const herbBlockId = 'farm:herb';

    renderHeader('HERB', herbBlockId, 'farming-group-row');

    if (!isCollapsedBlock(herbBlockId)) {
      renderLocations(herbTimer, herbsGroup.plots);

      if (allotmentsGroup?.timers?.length) {
        const allotTimer = allotmentsGroup.timers[0];
        renderTimerBlock('ALLOTMENT', 'farm:herb:allotment', allotTimer, allotmentsGroup.plots, true);
      }
    }
  }

  // Parent: HOPS
  const hopsGroup = groupsById.get('hops');
  if (hopsGroup?.timers?.length) {
    const hopTimer = hopsGroup.timers[0];
    const hopsBlockId = 'farm:hops';

    renderHeader('HOPS', hopsBlockId, 'farming-group-row');
    if (!isCollapsedBlock(hopsBlockId)) {
      renderLocations(hopTimer, hopsGroup.plots);
    }
  }

  // Parent: TREES (sub-parents per timer)
  const treesGroup = groupsById.get('trees');
  if (treesGroup?.timers?.length) {
    const treesBlockId = 'farm:trees';
    renderHeader('TREES', treesBlockId, 'farming-group-row');

    if (!isCollapsedBlock(treesBlockId)) {
      treesGroup.timers.forEach((timerTask) => {
        const label = String(timerTask.name || '').toUpperCase();
        const blockId = `farm:trees:${timerTask.id}`;
        const plots = Array.isArray(timerTask.plots) ? timerTask.plots : [];
        renderTimerBlock(label, blockId, timerTask, plots, true);
      });
    }
  }

  // Parent: SPECIALTY (sub-parents per timer)
  const specialtyGroup = groupsById.get('specialty');
  if (specialtyGroup?.timers?.length) {
    const specBlockId = 'farm:specialty';
    renderHeader('SPECIALTY', specBlockId, 'farming-group-row');

    if (!isCollapsedBlock(specBlockId)) {
      specialtyGroup.timers.forEach((timerTask) => {
        const label = String(timerTask.name || '').toUpperCase();
        const blockId = `farm:specialty:${timerTask.id}`;
        const plots = Array.isArray(timerTask.plots) ? timerTask.plots : [];
        renderTimerBlock(label, blockId, timerTask, plots, true);
      });
    }
  }
}

function renderGroupedGathering(tbody, tasks) {
  const daily = tasks.filter((task) => String(task.reset || '').toLowerCase() === 'daily');
  const weekly = tasks.filter((task) => String(task.reset || '').toLowerCase() === 'weekly');

  const dailyCountdown = formatCountdown(nextDailyBoundary());
  const weeklyCountdown = formatCountdown(nextWeeklyBoundary());

  if (daily.length) {
    tbody.appendChild(createHeaderRow('DAILY GATHERING', 'gathering:daily', {
      className: 'gathering-group-row',
      rightText: dailyCountdown
    }));

    if (!isCollapsedBlock('gathering:daily')) {
      applyOrderingAndSort('gathering', daily).forEach((task) => {
        tbody.appendChild(createRow('gathering', task, false));
      });
    }
  }

  if (weekly.length) {
    tbody.appendChild(createHeaderRow('WEEKLY GATHERING', 'gathering:weekly', {
      className: 'gathering-group-row',
      rightText: weeklyCountdown
    }));

    if (!isCollapsedBlock('gathering:weekly')) {
      applyOrderingAndSort('gathering', weekly).forEach((task) => {
        tbody.appendChild(createRow('gathering', task, false));
      });
    }
  }
}

function renderWeekliesWithChildren(tbody, tasks) {
  applyOrderingAndSort('rs3weekly', tasks).forEach((task) => {
    tbody.appendChild(createRow('rs3weekly', task, false));

    if (Array.isArray(task.childRows) && task.childRows.length) {
      const childBlockId = `weekly-children:${task.id}`;
      const childHeaderLabel = task.id === 'penguins' ? 'PENGUINS' : task.name.toUpperCase();

      tbody.appendChild(createHeaderRow(childHeaderLabel, childBlockId, {
        className: 'gathering-group-row',
        rightText: ''
      }));

      if (!isCollapsedBlock(childBlockId)) {
        task.childRows.forEach((child) => {
          tbody.appendChild(
            createRightSideChildRow(
              'rs3weekly',
              {
                ...child,
                wiki: task.wiki || '',
                reset: 'weekly',
                alertDaysBeforeReset: 0,
                isChildRow: true
              },
              task.id,
              'farming-child-row'
            )
          );
        });
      }
    }
  });
}

function renderStandardSection(sectionKey, tasks) {
  const container = document.getElementById(getContainerId(sectionKey));
  const table = document.getElementById(getTableId(sectionKey));
  const tbody = table?.querySelector('tbody');
  if (!container || !table || !tbody) return;

  const state = getSectionState(sectionKey);
  container.dataset.hide = state.hideSection ? 'hide' : 'show';
  container.dataset.showHidden = state.showHidden ? 'true' : 'false';

  tbody.innerHTML = '';

  if (sectionKey === 'rs3farming') {
    renderGroupedFarming(tbody, tasks);
    return;
  }

  if (sectionKey === 'gathering') {
    renderGroupedGathering(tbody, tasks);
    return;
  }

  if (sectionKey === 'rs3weekly') {
    renderWeekliesWithChildren(tbody, tasks);
    return;
  }

  applyOrderingAndSort(sectionKey, tasks).forEach((task) => {
    tbody.appendChild(createRow(sectionKey, task, sectionKey === 'custom'));
  });
}

/* -----------------------------
   Overview
----------------------------- */

function sectionLabel(sectionKey) {
  return {
    custom: 'Custom Tasks',
    rs3daily: 'Dailies',
    gathering: 'Gathering',
    rs3weekly: 'Weeklies',
    rs3monthly: 'Monthlies',
    rs3farming: 'Farming'
  }[sectionKey] || sectionKey;
}

function flattenFarmingOverviewTasks(groups) {
  const list = [];

  (Array.isArray(groups) ? groups : []).forEach((group) => {
    (Array.isArray(group.timers) ? group.timers : []).forEach((timerTask) => {
      const plots = Array.isArray(timerTask.plots) && timerTask.plots.length
        ? timerTask.plots
        : (Array.isArray(group.plots) ? group.plots : []);

      plots.forEach((plotTask) => {
        list.push(buildFarmingLocationTask(timerTask, plotTask));
      });
    });
  });

  return list;
}

function formatOverviewCountdown(kind, targetMs) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return kind === 'ready' ? 'Ready now' : 'Due now';

  const label = kind === 'reset' ? 'Resets in' : (kind === 'ready' ? 'Ready in' : 'Due in');
  return `${label} ${formatDurationMs(diff)}`;
}

function collectOverviewItems(sections) {
  const pins = getOverviewPins();
  const pinnedIds = Object.entries(pins)
    .filter(([, on]) => !!on)
    .map(([id]) => id);

  if (!pinnedIds.length) return [];

  const pinnedSet = new Set(pinnedIds);
  const cooldowns = getCooldowns();

  const now = Date.now();
  const results = [];

  [
    ['custom', sections.custom],
    ['rs3farming', flattenFarmingOverviewTasks(sections.rs3farming)],
    ['rs3daily', sections.rs3daily],
    ['gathering', sections.gathering],
    ['rs3weekly', sections.rs3weekly],
    ['rs3monthly', sections.rs3monthly]
  ].forEach(([sectionKey, tasks]) => {
    const list = Array.isArray(tasks) ? tasks : [];
    const state = getSectionState(sectionKey);

    list.forEach((task) => {
      const taskId = task?.id;
      if (!taskId) return;

      const pinId = `${sectionKey}::${taskId}`;
      if (!pinnedSet.has(pinId)) return;

      if (state.hiddenRows[taskId]) return; // Hide wins everywhere

      const cooldown = cooldowns[taskId];
      if (cooldown && cooldown.readyAt > now) {
        results.push({
          id: pinId,
          sectionKey,
          title: task.name,
          note: task.note || '',
          kind: 'ready',
          nextActionAtMs: cooldown.readyAt,
          actionable: false
        });
        return;
      }

      const completed = !!state.completed[taskId];
      if (completed && !task.reset) return;

      const nextActionAtMs = completed
        ? getTaskNextReset(task).getTime()
        : (task.reset ? getTaskAlertTarget(task).getTime() : now);

      results.push({
        id: pinId,
        sectionKey,
        title: task.name,
        note: task.note || '',
        kind: completed ? 'reset' : 'due',
        nextActionAtMs,
        actionable: !completed
      });
    });
  });

  results.sort((a, b) => {
    if (a.nextActionAtMs !== b.nextActionAtMs) return a.nextActionAtMs - b.nextActionAtMs;
    if (a.actionable !== b.actionable) return a.actionable ? -1 : 1;
    return String(a.title).localeCompare(String(b.title));
  });

  return results.slice(0, 5);
}

function applyPageModeVisibility(mode) {
  const panel = document.getElementById('overview-panel');
  if (!panel) return;

  panel.dataset.view = mode;

  const modeToSectionKey = {
    custom: 'custom',
    rs3farming: 'rs3farming',
    rs3daily: 'rs3daily',
    gathering: 'gathering',
    rs3weekly: 'rs3weekly',
    rs3monthly: 'rs3monthly'
  };

  const activeSectionKey = modeToSectionKey[mode] || null;

  ['custom', 'rs3farming', 'rs3daily', 'gathering', 'rs3weekly', 'rs3monthly'].forEach((sectionKey) => {
    const container = document.getElementById(getContainerId(sectionKey));
    if (!container) return;

    if (mode === 'overview') {
      container.style.display = 'none';
      return;
    }

    if (mode === 'all') {
      container.style.display = '';
      return;
    }

    container.style.display = activeSectionKey === sectionKey ? '' : 'none';
  });
}

function ensureOverviewLayout() {
  const content = document.getElementById('overview-content');
  return content || null;
}

function renderOverviewPanel(sections) {
  const panel = document.getElementById('overview-panel');
  const mode = getPageMode();

  const content = ensureOverviewLayout();
  if (!panel || !content) return;

  panel.dataset.view = mode;

  content.innerHTML = '';

  const items = collectOverviewItems(sections);

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'overview_empty';
    empty.textContent = 'Pin rows to show them here.';
    content.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'overview_row';

    const title = document.createElement('div');
    title.className = 'overview_row_title';
    title.textContent = item.title;

    const meta = document.createElement('div');
    meta.className = 'overview_row_meta';
    meta.textContent = `${sectionLabel(item.sectionKey)} \u2022 ${formatOverviewCountdown(item.kind, item.nextActionAtMs)}`;

    row.appendChild(title);
    row.appendChild(meta);

    if (item.note) {
      const note = document.createElement('div');
      note.className = 'overview_row_meta';
      note.textContent = item.note;
      row.appendChild(note);
    }

    content.appendChild(row);
  });
}

function setupViewsControl() {
  setupViewsControlFeature({
    renderApp,
    documentRef: document,
    windowRef: window,
    closeAllFloatingControls: closeFloatingControls
  });
}

/* -----------------------------
   Main render
----------------------------- */

function renderApp() {
  ensureOverviewLayout();
  cleanupReadyFarmingTimers();
  cleanupReadyCooldowns();
  hideTooltip();

  const mode = getPageMode();
  const sections = getResolvedSections();

  const modeToSectionKey = {
    custom: 'custom',
    rs3farming: 'rs3farming',
    rs3daily: 'rs3daily',
    gathering: 'gathering',
    rs3weekly: 'rs3weekly',
    rs3monthly: 'rs3monthly'
  };

  if (mode === 'all') {
    renderStandardSection('custom', sections.custom);
    renderStandardSection('rs3farming', sections.rs3farming);
    renderStandardSection('rs3daily', sections.rs3daily);
    renderStandardSection('gathering', sections.gathering);
    renderStandardSection('rs3weekly', sections.rs3weekly);
    renderStandardSection('rs3monthly', sections.rs3monthly);
  } else if (mode !== 'overview') {
    const active = modeToSectionKey[mode];
    if (active === 'custom') renderStandardSection('custom', sections.custom);
    if (active === 'rs3farming') renderStandardSection('rs3farming', sections.rs3farming);
    if (active === 'rs3daily') renderStandardSection('rs3daily', sections.rs3daily);
    if (active === 'gathering') renderStandardSection('gathering', sections.gathering);
    if (active === 'rs3weekly') renderStandardSection('rs3weekly', sections.rs3weekly);
    if (active === 'rs3monthly') renderStandardSection('rs3monthly', sections.rs3monthly);
  }

  applyPageModeVisibility(mode);
  renderOverviewPanel(sections);
  fetchProfits();
  renderCooldownButtons();
  updateProfileHeader();

  sections.custom.forEach((task) => maybeNotifyTaskAlert(task, 'custom'));
  sections.rs3daily.forEach((task) => maybeNotifyTaskAlert(task, 'rs3daily'));
  sections.gathering.forEach((task) => maybeNotifyTaskAlert(task, 'gathering'));
  sections.rs3weekly.forEach((task) => maybeNotifyTaskAlert(task, 'rs3weekly'));
  sections.rs3monthly.forEach((task) => maybeNotifyTaskAlert(task, 'rs3monthly'));
}

/* -----------------------------
   Controls
----------------------------- */

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
      saveSectionValue(sectionKey, 'showHidden', next);
      renderApp();
    });
  }

  if (hideBtn) {
    hideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveSectionValue(sectionKey, 'hideSection', true);
      renderApp();
    });
  }

  if (unhideBtn) {
    unhideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveSectionValue(sectionKey, 'hideSection', false);
      renderApp();
    });
  }

  if (sortBtn && opts.sortable) {
    sortBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = getSectionState(sectionKey).sort;
      const next = current === 'default' ? 'alpha' : 'default';
      saveSectionValue(sectionKey, 'sort', next);
      renderApp();
    });
  }
}

function updateProfileHeader() {
  updateProfileHeaderFeature(document.getElementById('profile-name'));
}

function setupProfileControl() {
  setupProfileControlFeature({
    renderApp,
    closeFloatingControls,
    documentRef: document
  });
}

function setupSettingsControl() {
  setupSettingsControlFeature({
    renderApp,
    closeFloatingControls,
    documentRef: document
  });
}

function closeFloatingControls() {
  closeFloatingControlsFeature(document);
}

function setupGlobalClickCloser() {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (
      target.closest('#views-button') ||
      target.closest('#views-button-panel') ||
      target.closest('#views-control') ||
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

/* -----------------------------
   Import / export
----------------------------- */

function buildExportToken() {
  return buildExportTokenFeature(localStorage);
}

function importToken(rawToken) {
  try {
    importProfileToken(rawToken, localStorage);
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

  tokenButton?.addEventListener('click', () => {
    tokenOutput.value = buildExportToken();
    tokenInput.classList.remove('is-invalid');
  });

  tokenCopy?.addEventListener('click', async () => {
    const text = tokenOutput.value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      tokenOutput.focus();
      tokenOutput.select();
      document.execCommand('copy');
    }
  });

  tokenImport?.addEventListener('click', () => {
    tokenInput.classList.remove('is-invalid');
    importToken(tokenInput.value.trim());
  });
}

/* -----------------------------
   Custom tasks
----------------------------- */

function promptAddCustomTask() {
  const name = prompt('Task name:');
  if (!name || !name.trim()) return;

  const note = prompt('Task note (optional):') || '';
  const wiki = prompt('Wiki / URL (optional):') || '';
  const reset = (prompt('Reset type? daily / weekly / monthly / timer', 'daily') || 'daily')
    .trim()
    .toLowerCase();
  const alertRaw = prompt('Alert how many days before reset? (0 for same day)', '0') || '0';

  let alertDaysBeforeReset = parseInt(alertRaw, 10);
  if (!Number.isFinite(alertDaysBeforeReset) || alertDaysBeforeReset < 0) {
    alertDaysBeforeReset = 0;
  }

  const allowed = ['daily', 'weekly', 'monthly', 'timer'];

  const task = {
    id: `custom-${slugify(name)}-${Date.now()}`,
    name: name.trim(),
    note: note.trim(),
    wiki: wiki.trim(),
    reset: allowed.includes(reset) ? reset : 'daily',
    alertDaysBeforeReset
  };

  if (task.reset === 'timer') {
    const minsRaw = prompt('Timer repeat interval in minutes?', '60') || '60';
    let minutes = parseInt(minsRaw, 10);
    if (!Number.isFinite(minutes) || minutes < 1) minutes = 60;
    task.cooldownMinutes = minutes;
    task.reset = 'daily';
    task.note = task.note
      ? `${task.note} | Repeating timer: ${minutes}m`
      : `Repeating timer: ${minutes}m`;
  }

  const tasks = getCustomTasks();
  tasks.push(task);
  saveCustomTasks(tasks);
  renderApp();
}

function setupCustomAdd() {
  const addBtn = document.getElementById('custom_add_button');
  if (!addBtn) return;

  const modalEl = document.getElementById('custom-task-modal');
  const saveBtn = document.getElementById('custom-task-save');
  const nameInput = document.getElementById('custom-task-name');
  const noteInput = document.getElementById('custom-task-note');
  const wikiInput = document.getElementById('custom-task-wiki');
  const resetSelect = document.getElementById('custom-task-reset');
  const alertInput = document.getElementById('custom-task-alert');
  const timerBlock = document.getElementById('custom-task-timer-block');
  const timerMinsInput = document.getElementById('custom-task-timer-mins');

  const hasModal = !!(
    modalEl &&
    saveBtn &&
    nameInput &&
    noteInput &&
    wikiInput &&
    resetSelect &&
    alertInput &&
    timerBlock &&
    timerMinsInput
  );
  const bootstrapModal = hasModal && window.bootstrap?.Modal ? window.bootstrap.Modal.getOrCreateInstance(modalEl) : null;

  if (!bootstrapModal) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      promptAddCustomTask();
    });
    return;
  }

  function syncTimerVisibility() {
    const isTimer = resetSelect.value === 'timer';
    timerBlock.style.display = isTimer ? '' : 'none';
    timerBlock.style.visibility = isTimer ? 'visible' : 'hidden';
  }

  function clearValidation() {
    nameInput.classList.remove('is-invalid');
  }

  resetSelect.addEventListener('change', () => {
    syncTimerVisibility();
  });

  addBtn.addEventListener('click', (e) => {
    e.preventDefault();

    clearValidation();
    nameInput.value = '';
    noteInput.value = '';
    wikiInput.value = '';
    resetSelect.value = 'daily';
    alertInput.value = '0';
    timerMinsInput.value = '60';
    syncTimerVisibility();

    bootstrapModal.show();
    setTimeout(() => nameInput.focus(), 50);
  });

  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearValidation();

    const rawName = String(nameInput.value || '').trim();
    if (!rawName) {
      nameInput.classList.add('is-invalid');
      nameInput.focus();
      return;
    }

    const rawNote = String(noteInput.value || '').trim();
    const rawWiki = String(wikiInput.value || '').trim();
    const rawReset = String(resetSelect.value || 'daily').trim().toLowerCase();

    let alertDaysBeforeReset = parseInt(String(alertInput.value || '0'), 10);
    if (!Number.isFinite(alertDaysBeforeReset) || alertDaysBeforeReset < 0) {
      alertDaysBeforeReset = 0;
    }

    const allowed = ['daily', 'weekly', 'monthly', 'timer'];

    const task = {
      id: `custom-${slugify(rawName)}-${Date.now()}`,
      name: rawName,
      note: rawNote,
      wiki: rawWiki,
      reset: allowed.includes(rawReset) ? rawReset : 'daily',
      alertDaysBeforeReset
    };

    if (task.reset === 'timer') {
      let minutes = parseInt(String(timerMinsInput.value || '60'), 10);
      if (!Number.isFinite(minutes) || minutes < 1) minutes = 60;
      task.cooldownMinutes = minutes;
      task.reset = 'daily';
      task.note = task.note
        ? `${task.note} | Repeating timer: ${minutes}m`
        : `Repeating timer: ${minutes}m`;
    }

    const tasks = getCustomTasks();
    tasks.push(task);
    saveCustomTasks(tasks);

    bootstrapModal.hide();
    renderApp();
  });
}

/* -----------------------------
   Init
----------------------------- */

function setupSectionBindings() {
  bindSectionControls('custom', { sortable: true });
  bindSectionControls('rs3farming');
  bindSectionControls('rs3daily');
  bindSectionControls('gathering', { sortable: true });
  bindSectionControls('rs3weekly');
  bindSectionControls('rs3monthly');
}

document.addEventListener('DOMContentLoaded', () => {
  initProfileContext();
  migrateLegacyViewModeToPageMode();
  applySettingsToDom();
  checkAutoReset();
  updateCountdowns();

  setInterval(updateCountdowns, 1000);
  setInterval(() => {
    const resetChanged = checkAutoReset();
    const farmingChanged = cleanupReadyFarmingTimers();
    const cooldownChanged = cleanupReadyCooldowns();
    if (resetChanged || farmingChanged || cooldownChanged) renderApp();
  }, 1000);

  setupSectionBindings();
  setupProfileControl();
  setupSettingsControl();
  setupViewsControl();
  setupGlobalClickCloser();
  setupImportExport();
  setupCustomAdd();

  renderApp();
});

