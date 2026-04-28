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

export { initProfileContext };
