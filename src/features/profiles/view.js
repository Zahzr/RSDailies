import { getProfileLabel } from './model.js';

export function renderProfileRows({
  listElement,
  profiles,
  currentProfile,
  onSelectProfile,
  onDeleteProfile
}) {
  if (!listElement) return;

  listElement.innerHTML = '';

  profiles.forEach((name) => {
    const item = document.createElement('li');
    item.className = 'profile-row';

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'profile-link';
    link.textContent = getProfileLabel(name, currentProfile);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      onSelectProfile?.(name);
    });

    item.appendChild(link);

    if (name !== 'default') {
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'btn btn-danger btn-sm profile-delete';
      deleteButton.textContent = '\u00D7';
      deleteButton.addEventListener('click', () => onDeleteProfile?.(name));
      item.appendChild(deleteButton);
    }

    listElement.appendChild(item);
  });
}

export function renderProfileHeader(profileNameElement, currentProfile) {
  if (!profileNameElement) return;

  profileNameElement.style.display = '';
  profileNameElement.style.visibility = 'visible';
  profileNameElement.textContent = currentProfile;
}

