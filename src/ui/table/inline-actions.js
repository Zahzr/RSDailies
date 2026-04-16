import { resolveCallback } from '../runtime.js';

function createDangerButton(label, className = 'btn btn-danger btn-sm inline-danger') {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';
  button.textContent = label;
  return button;
}

export function createInlineActions(task, isCustom, runtime = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'activity_inline_actions';

  if (isCustom) {
    const delBtn = createDangerButton('Delete');
    delBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const confirmFn = resolveCallback(runtime, 'confirm', (message) => globalThis.confirm?.(message) ?? true);
      if (!confirmFn(`Delete custom task "${task.name}"?`)) return;

      const getCustomTasks = resolveCallback(runtime, 'getCustomTasks', () => []);
      const saveCustomTasks = resolveCallback(runtime, 'saveCustomTasks', () => {});
      const load = resolveCallback(runtime, 'load', () => null);
      const save = resolveCallback(runtime, 'save', () => {});
      const renderApp = resolveCallback(runtime, 'renderApp', () => {});

      const next = getCustomTasks().filter((entry) => entry.id !== task.id);
      saveCustomTasks(next);

      const completed = load('completed:custom', {}) || {};
      const hiddenRows = load('hiddenRows:custom', {}) || {};
      const notified = load('notified:custom', {}) || {};

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
