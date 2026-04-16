import { applySettingsToDom, collectSettingsFromDom, getSettings, saveSettings } from './state.js';

export function setupSettingsControl({
  renderApp = () => {},
  closeFloatingControls = () => {},
  documentRef = document
} = {}) {
  const button = documentRef.getElementById('settings-button');
  const panel = documentRef.getElementById('settings-control');
  const saveBtn = documentRef.getElementById('save-settings-btn');

  button?.addEventListener('click', (event) => {
    event.preventDefault();
    const visible = panel?.dataset.display === 'block';
    closeFloatingControls();
    if (panel) {
      if (!visible) {
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        panel.dataset.display = 'block';
      }
    }
  });

  saveBtn?.addEventListener('click', async () => {
    const settings = collectSettingsFromDom(documentRef);
    saveSettings(settings);

    if (settings.browserNotif && 'Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // noop
      }
    }

    renderApp();
  });
}

export { applySettingsToDom, collectSettingsFromDom, getSettings, saveSettings };
