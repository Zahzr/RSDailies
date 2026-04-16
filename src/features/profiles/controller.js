import { buildExportToken, importProfileToken } from './model.js';
import {
  getCurrentProfile,
  initProfileContext,
  loadProfiles,
  saveProfiles,
  setProfile,
  removeProfileStorage
} from './store.js';
import { renderProfileHeader, renderProfileRows } from './view.js';

export function updateProfileHeader(profileNameElement = document.getElementById('profile-name')) {
  renderProfileHeader(profileNameElement, getCurrentProfile());
}

export function setupProfileControl({
  renderApp = () => {},
  closeFloatingControls = () => {},
  documentRef = document
} = {}) {
  const button = documentRef.getElementById('profile-button');
  const panel = documentRef.getElementById('profile-control');
  const list = documentRef.getElementById('profile-list');
  const form = documentRef.getElementById('profile-form');

  function renderProfiles() {
    renderProfileRows({
      listElement: list,
      profiles: loadProfiles(),
      currentProfile: getCurrentProfile(),
      onSelectProfile: (name) => {
        setProfile(name);
        renderProfiles();
        renderApp();
      },
      onDeleteProfile: (name) => {
        if (!confirm(`Delete profile "${name}"? This removes that profile's browser data.`)) return;

        removeProfileStorage(name, window.localStorage);

        const next = loadProfiles().filter((profile) => profile !== name);
        saveProfiles(next);

        if (getCurrentProfile() === name) setProfile('default');

        renderProfiles();
        renderApp();
      }
    });
  }

  button?.addEventListener('click', (event) => {
    event.preventDefault();
    const visible = panel?.dataset.display === 'block';
    closeFloatingControls();
    if (!visible && panel) {
      panel.style.display = 'block';
      panel.style.visibility = 'visible';
      panel.dataset.display = 'block';
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const input = documentRef.getElementById('profileName');
    const name = (input?.value || '').trim();
    if (!name) return;

    const profiles = loadProfiles();
    if (!profiles.includes(name)) {
      profiles.push(name);
      saveProfiles(profiles);
    }

    setProfile(name);
    if (input) input.value = '';

    renderProfiles();
    renderApp();
  });

  renderProfiles();
}

export function setupProfileImportExport({
  documentRef = document,
  onImport = () => window.location.reload()
} = {}) {
  const tokenButton = documentRef.getElementById('token-button');
  const tokenOutput = documentRef.getElementById('token-output');
  const tokenInput = documentRef.getElementById('token-input');
  const tokenCopy = documentRef.getElementById('token-copy');
  const tokenImport = documentRef.getElementById('token-import');

  tokenButton?.addEventListener('click', () => {
    if (tokenOutput) tokenOutput.value = buildExportToken(window.localStorage);
    tokenInput?.classList.remove('is-invalid');
  });

  tokenCopy?.addEventListener('click', async () => {
    const text = tokenOutput?.value || '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      tokenOutput?.focus();
      tokenOutput?.select();
      documentRef.execCommand('copy');
    }
  });

  tokenImport?.addEventListener('click', () => {
    tokenInput?.classList.remove('is-invalid');

    try {
      importProfileToken((tokenInput?.value || '').trim(), window.localStorage);
      onImport();
    } catch {
      if (tokenInput) tokenInput.classList.add('is-invalid');
    }
  });
}

export { initProfileContext };
