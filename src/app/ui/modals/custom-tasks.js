import { slugify } from '../../../ui/table/utils.js';

function parsePositiveInt(value, fallback) {
  const parsed = parseInt(String(value ?? '').trim(), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return parsed;
}

function buildCustomTask({
  rawName,
  rawNote,
  rawWiki,
  rawReset,
  rawAlertDaysBeforeReset,
  rawTimerMinutes
}) {
  const allowed = ['daily', 'weekly', 'monthly', 'timer'];

  let reset = allowed.includes(rawReset) ? rawReset : 'daily';
  let alertDaysBeforeReset = parsePositiveInt(rawAlertDaysBeforeReset, 0);

  const task = {
    id: `custom-${slugify(rawName)}-${Date.now()}`,
    name: rawName,
    note: rawNote,
    wiki: rawWiki,
    reset,
    alertDaysBeforeReset
  };

  if (task.reset === 'timer') {
    let minutes = parsePositiveInt(rawTimerMinutes, 60);
    if (minutes < 1) minutes = 60;

    task.cooldownMinutes = minutes;
    task.alertDaysBeforeReset = 0;
    task.note = task.note
      ? `${task.note} | Repeating timer: ${minutes}m`
      : `Repeating timer: ${minutes}m`;
  }

  return task;
}

function cloneAndReplace(element) {
  if (!element) return null;
  const replacement = element.cloneNode(true);
  element.replaceWith(replacement);
  return replacement;
}

function resetCustomTaskForm({
  nameInput,
  noteInput,
  wikiInput,
  resetSelect,
  alertInput,
  timerMinsInput,
  timerBlock
}) {
  nameInput.value = '';
  noteInput.value = '';
  wikiInput.value = '';
  resetSelect.value = 'daily';
  alertInput.value = '0';
  timerMinsInput.value = '60';
  timerBlock.style.display = 'none';
  timerBlock.style.visibility = 'hidden';
  nameInput.classList.remove('is-invalid');
  wikiInput.classList.remove('is-invalid');
}

function syncTimerVisibility(resetSelect, timerBlock, alertInput) {
  const isTimer = resetSelect.value === 'timer';
  timerBlock.style.display = isTimer ? '' : 'none';
  timerBlock.style.visibility = isTimer ? 'visible' : 'hidden';

  if (alertInput) {
    alertInput.disabled = isTimer;
    if (isTimer) {
      alertInput.value = '0';
    }
  }
}

function isValidOptionalUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Controller for the Custom Task creation modal and fallback prompt
 */
export function setupCustomAdd(deps) {
  const {
    getCustomTasks,
    saveCustomTasks,
    renderApp,
    bootstrapRef = window.bootstrap,
    documentRef = document
  } = deps;

  const existingAddBtn = documentRef.getElementById('custom_add_button');
  if (!existingAddBtn) return;

  const addBtn = cloneAndReplace(existingAddBtn);

  const modalEl = documentRef.getElementById('custom-task-modal');
  let saveBtn = documentRef.getElementById('custom-task-save');
  const nameInput = documentRef.getElementById('custom-task-name');
  const noteInput = documentRef.getElementById('custom-task-note');
  const wikiInput = documentRef.getElementById('custom-task-wiki');
  const resetSelect = documentRef.getElementById('custom-task-reset');
  const alertInput = documentRef.getElementById('custom-task-alert');
  const timerBlock = documentRef.getElementById('custom-task-timer-block');
  const timerMinsInput = documentRef.getElementById('custom-task-timer-mins');
  const form = documentRef.getElementById('custom-task-form');

  const hasModal = !!(
    modalEl &&
    saveBtn &&
    nameInput &&
    noteInput &&
    wikiInput &&
    resetSelect &&
    alertInput &&
    timerBlock &&
    timerMinsInput &&
    form
  );

  const bootstrapModal = hasModal && bootstrapRef?.Modal
    ? bootstrapRef.Modal.getOrCreateInstance(modalEl)
    : null;

  if (!bootstrapModal) {
    addBtn.addEventListener('click', (event) => {
      event.preventDefault();
      promptAddCustomTask(deps);
    });
    return;
  }

  saveBtn = cloneAndReplace(saveBtn);

  resetSelect.addEventListener('change', () => {
    syncTimerVisibility(resetSelect, timerBlock, alertInput);
  });

  addBtn.addEventListener('click', (event) => {
    event.preventDefault();

    resetCustomTaskForm({
      nameInput,
      noteInput,
      wikiInput,
      resetSelect,
      alertInput,
      timerMinsInput,
      timerBlock
    });

    syncTimerVisibility(resetSelect, timerBlock, alertInput);

    bootstrapModal.show();
    window.setTimeout(() => nameInput.focus(), 50);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveBtn.click();
  });

  saveBtn.addEventListener('click', (event) => {
    event.preventDefault();

    nameInput.classList.remove('is-invalid');
    wikiInput.classList.remove('is-invalid');

    const rawName = String(nameInput.value || '').trim();
    const rawNote = String(noteInput.value || '').trim();
    const rawWiki = String(wikiInput.value || '').trim();
    const rawReset = String(resetSelect.value || 'daily').trim().toLowerCase();
    const rawAlertDaysBeforeReset = String(alertInput.value || '0').trim();
    const rawTimerMinutes = String(timerMinsInput.value || '60').trim();

    if (!rawName) {
      nameInput.classList.add('is-invalid');
      nameInput.focus();
      return;
    }

    if (!isValidOptionalUrl(rawWiki)) {
      wikiInput.classList.add('is-invalid');
      wikiInput.focus();
      return;
    }

    const task = buildCustomTask({
      rawName,
      rawNote,
      rawWiki,
      rawReset,
      rawAlertDaysBeforeReset,
      rawTimerMinutes
    });

    const existing = Array.isArray(getCustomTasks()) ? getCustomTasks() : [];
    const next = [...existing, task];

    saveCustomTasks(next);
    bootstrapModal.hide();
    renderApp();
  });
}

/**
 * Fallback prompt-based custom task addition if Modal is not available
 */
function promptAddCustomTask(deps) {
  const { getCustomTasks, saveCustomTasks, renderApp } = deps;

  const name = prompt('Task name:');
  if (!name || !name.trim()) return;

  const note = prompt('Task note (optional):') || '';
  const wiki = prompt('Wiki / URL (optional):') || '';
  const reset = (prompt('Reset type? daily / weekly / monthly / timer', 'daily') || 'daily')
    .trim()
    .toLowerCase();
  const alertRaw = reset === 'timer'
    ? '0'
    : (prompt('Alert how many days before reset? (0 for same day)', '0') || '0');
  const timerRaw = reset === 'timer'
    ? (prompt('Timer repeat interval in minutes?', '60') || '60')
    : '60';

  if (!isValidOptionalUrl(wiki)) {
    alert('Please enter a valid URL starting with http:// or https://');
    return;
  }

  const task = buildCustomTask({
    rawName: name.trim(),
    rawNote: note.trim(),
    rawWiki: wiki.trim(),
    rawReset: reset,
    rawAlertDaysBeforeReset: alertRaw,
    rawTimerMinutes: timerRaw
  });

  const existing = Array.isArray(getCustomTasks()) ? getCustomTasks() : [];
  const next = [...existing, task];

  saveCustomTasks(next);
  renderApp();
}