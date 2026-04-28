import { buildCustomTask, isValidOptionalUrl } from './controller/builders.js';
import { cloneAndReplace, readTaskForm, resetCustomTaskForm, syncTimerVisibility } from './controller/form.js';
import { promptAddCustomTask } from './controller/prompt.js';

export function setupCustomAdd(deps) {
  const { getCustomTasks, saveCustomTasks, renderApp, bootstrapRef = window.bootstrap, documentRef = document } = deps;
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

  const hasModal = !!(modalEl && saveBtn && nameInput && noteInput && wikiInput && resetSelect && alertInput && timerBlock && timerMinsInput && form);
  const bootstrapModal = hasModal && bootstrapRef?.Modal ? bootstrapRef.Modal.getOrCreateInstance(modalEl) : null;

  if (!bootstrapModal) {
    addBtn.addEventListener('click', (event) => {
      event.preventDefault();
      promptAddCustomTask(deps);
    });
    return;
  }

  saveBtn = cloneAndReplace(saveBtn);
  resetSelect.addEventListener('change', () => syncTimerVisibility(resetSelect, timerBlock, alertInput));

  addBtn.addEventListener('click', (event) => {
    event.preventDefault();
    resetCustomTaskForm({ nameInput, noteInput, wikiInput, resetSelect, alertInput, timerMinsInput, timerBlock });
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

    const formValues = readTaskForm({ nameInput, noteInput, wikiInput, resetSelect, alertInput, timerMinsInput });
    if (!formValues.rawName) {
      nameInput.classList.add('is-invalid');
      nameInput.focus();
      return;
    }
    if (!isValidOptionalUrl(formValues.rawWiki)) {
      wikiInput.classList.add('is-invalid');
      wikiInput.focus();
      return;
    }

    const task = buildCustomTask(formValues);
    const existing = Array.isArray(getCustomTasks()) ? getCustomTasks() : [];
    saveCustomTasks([...existing, task]);
    bootstrapModal.hide();
    renderApp();
  });
}
