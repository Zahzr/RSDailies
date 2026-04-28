import { applySettingsToDom, collectSettingsFromDom, getSettings, saveSettings } from './state.js';

function replaceNode(element) {
  if (!element) return null;
  const replacement = element.cloneNode(true);
  element.replaceWith(replacement);
  return replacement;
}

export function setupSettingsControl({
  renderApp = () => { },
  closeFloatingControls = () => { },
  documentRef = document
} = {}) {
  const button = replaceNode(documentRef.getElementById('settings-button'));
  const panel = documentRef.getElementById('settings-control');
  const saveBtn = replaceNode(documentRef.getElementById('save-settings-btn'));

  if (!button || !panel || !saveBtn) return;

  applySettingsToDom(documentRef, getSettings());

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const visible = panel.dataset.display === 'block';
    closeFloatingControls();

    if (!visible) {
      panel.style.display = 'block';
      panel.style.visibility = 'visible';
      panel.dataset.display = 'block';
    }
  });

  saveBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const settings = collectSettingsFromDom(documentRef);
    saveSettings(settings);

    if (settings.browserNotif && 'Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // noop
      }
    }

    panel.style.display = 'none';
    panel.style.visibility = 'hidden';
    panel.dataset.display = 'none';

    renderApp();
  });
}

export {
  applySettingsToDom,
  collectSettingsFromDom,
  getSettings,
  saveSettings
};