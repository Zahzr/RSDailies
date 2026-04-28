export function renderViewsList(listElement, views, onSelectView) {
  if (!listElement) return;

  listElement.innerHTML = '';

  views.forEach((view) => {
    const item = document.createElement('li');
    item.className = 'profile-row';

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'profile-link';
    link.textContent = view.label;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      onSelectView?.(view.mode);
    });

    item.appendChild(link);
    listElement.appendChild(item);
  });
}

export function positionPanel(panelElement, anchorElement, windowRef = window) {
  if (!panelElement || !anchorElement) return;

  const rect = anchorElement.getBoundingClientRect();
  const margin = 6;
  const minWidth = 320;
  const viewportPadding = 10;
  const width = Math.max(minWidth, panelElement.getBoundingClientRect().width || 0);

  const desiredTop = rect.bottom + margin;
  const desiredLeft = rect.left;

  const top = Math.max(viewportPadding, Math.min(desiredTop, windowRef.innerHeight - viewportPadding - 40));
  const left = Math.max(
    viewportPadding,
    Math.min(desiredLeft, windowRef.innerWidth - viewportPadding - width)
  );

  panelElement.style.position = 'fixed';
  panelElement.style.top = `${top}px`;
  panelElement.style.left = `${left}px`;
  panelElement.style.right = 'auto';
}
