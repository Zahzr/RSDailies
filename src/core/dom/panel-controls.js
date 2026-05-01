import { isPanelOpen, setPanelOpenState } from './controls.js';

export function bindFloatingPanelTrigger({
  button,
  panel,
  closePanels = () => {},
  onOpen = () => {},
  onClose = () => {},
}) {
  if (!button || !panel) {
    return;
  }

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPanelOpen(panel)) {
      setPanelOpenState(panel, false);
      onClose();
      return;
    }

    closePanels();
    onOpen();
  });
}
