import { applySettingsToDom, collectSettingsFromDom, getSettings, saveSettings } from './state.js';
import { replaceInteractiveElement, setPanelOpenState } from '../../../core/dom/controls.js';
import { bindFloatingPanelTrigger } from '../../../core/dom/panel-controls.js';

export function setupSettingsControl({
  renderApp = () => { },
  closeFloatingControls = () => { },
  documentRef = document
} = {}) {
  const button = replaceInteractiveElement(documentRef.getElementById('settings-button'));
  const panel = documentRef.getElementById('settings-control');
  const saveBtn = replaceInteractiveElement(documentRef.getElementById('save-settings-btn'));

  if (!button || !panel || !saveBtn) return;

  applySettingsToDom(documentRef, getSettings());

  bindFloatingPanelTrigger({
    button,
    panel,
    closePanels: closeFloatingControls,
    onOpen: () => {
      setPanelOpenState(panel, true);
    },
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

    setPanelOpenState(panel, false);

    renderApp();
  });
}

export {
  applySettingsToDom,
  collectSettingsFromDom,
  getSettings,
  saveSettings
};
