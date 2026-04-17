import { slugify } from '../../../ui/table/utils.js';

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

  const addBtn = documentRef.getElementById('custom_add_button');
  if (!addBtn) return;

  const modalEl = documentRef.getElementById('custom-task-modal');
  const saveBtn = documentRef.getElementById('custom-task-save');
  const nameInput = documentRef.getElementById('custom-task-name');
  const noteInput = documentRef.getElementById('custom-task-note');
  const wikiInput = documentRef.getElementById('custom-task-wiki');
  const resetSelect = documentRef.getElementById('custom-task-reset');
  const alertInput = documentRef.getElementById('custom-task-alert');
  const timerBlock = documentRef.getElementById('custom-task-timer-block');
  const timerMinsInput = documentRef.getElementById('custom-task-timer-mins');

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
  
  const bootstrapModal = hasModal && bootstrapRef?.Modal 
    ? bootstrapRef.Modal.getOrCreateInstance(modalEl) 
    : null;

  if (!bootstrapModal) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      promptAddCustomTask(deps);
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
