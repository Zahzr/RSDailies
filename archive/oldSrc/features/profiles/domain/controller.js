import { buildExportToken, importProfileToken } from './model.js';
import {
  getCurrentProfile,
  initProfileContext,
  loadProfiles,
  saveProfiles,
  setProfile,
  removeProfileStorage
} from './store.js';
import { renderProfileHeader, renderProfileRows } from '../../../ui/components/profiles/profile-view.js';

function replaceNode(element) {
  if (!element) return null;
  const replacement = element.cloneNode(true);
  element.replaceWith(replacement);
  return replacement;
}

export function updateProfileHeader(profileNameElement = document.getElementById('profile-name')) {
  renderProfileHeader(profileNameElement, getCurrentProfile());
}

export function setupProfileControl({
  renderApp = () => { },
  closeFloatingControls = () => { },
  documentRef = document,
  windowRef = window
} = {}) {
  const button = replaceNode(documentRef.getElementById('profile-button'));
  const panel = documentRef.getElementById('profile-control');
  const list = documentRef.getElementById('profile-list');
  const form = replaceNode(documentRef.getElementById('profile-form'));

  if (!button || !panel || !list || !form) return;

  function renderProfiles() {
    renderProfileRows({
      listElement: list,
      profiles: loadProfiles(),
      currentProfile: getCurrentProfile(),
      onSelectProfile: (name) => {
        setProfile(name);
        updateProfileHeader();
        renderProfiles();
        renderApp();
      },
      onDeleteProfile: (name) => {
        if (name === 'default') return;
        if (!windowRef.confirm(`Delete profile "${name}"? This removes that profile's browser data.`)) return;

        removeProfileStorage(name, windowRef.localStorage);

        const next = loadProfiles().filter((profile) => profile !== name);
        saveProfiles(next);

        if (getCurrentProfile() === name) {
          setProfile('default');
        }

        updateProfileHeader();
        renderProfiles();
        renderApp();
      }
    });
  }

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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const input = documentRef.getElementById('profileName');
    const name = String(input?.value || '').trim();
    if (!name) return;

    const profiles = loadProfiles();
    if (!profiles.includes(name)) {
      profiles.push(name);
      saveProfiles(profiles);
    }

    setProfile(name);
    if (input) input.value = '';

    updateProfileHeader();
    renderProfiles();
    renderApp();

    panel.style.display = 'none';
    panel.style.visibility = 'hidden';
    panel.dataset.display = 'none';
  });

  updateProfileHeader();
  renderProfiles();
}

export function setupProfileImportExport({
  documentRef = document,
  onImport = () => window.location.reload(),
  windowRef = window
} = {}) {
  const tokenButton = replaceNode(documentRef.getElementById('token-button'));
  const tokenOutput = documentRef.getElementById('token-output');
  const tokenInput = documentRef.getElementById('token-input');
  const tokenCopy = replaceNode(documentRef.getElementById('token-copy'));
  const tokenImport = replaceNode(documentRef.getElementById('token-import'));

  if (!tokenButton || !tokenOutput || !tokenInput || !tokenCopy || !tokenImport) return;

  tokenButton.addEventListener('click', () => {
    tokenOutput.value = buildExportToken(windowRef.localStorage);
    tokenInput.classList.remove('is-invalid');
  });

  tokenCopy.addEventListener('click', async () => {
    const text = tokenOutput.value || '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      tokenOutput.focus();
      tokenOutput.select();
      documentRef.execCommand('copy');
    }
  });

  tokenImport.addEventListener('click', () => {
    tokenInput.classList.remove('is-invalid');

    try {
      importProfileToken(String(tokenInput.value || '').trim(), windowRef.localStorage);
      onImport();
    } catch {
      tokenInput.classList.add('is-invalid');
    }
  });
}

export { initProfileContext };