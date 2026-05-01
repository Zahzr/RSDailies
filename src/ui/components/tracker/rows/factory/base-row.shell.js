export function createBaseRowShell(sectionKey, taskId, taskState, options = {}) {
  const {
    cloneRowTemplate,
    isCustom = false,
    extraClass = '',
    isOverviewPanel = false,
  } = options;

  const row = cloneRowTemplate?.();
  if (!row) {
    return null;
  }

  row.dataset.id = taskId;
  row.dataset.completed = taskState;

  if (extraClass) row.classList.add(extraClass);
  if (isCustom) row.classList.add('custom-task-row');
  if (isOverviewPanel) row.classList.add('overview-row');

  const nameCell = row.querySelector('.activity_name');
  const nameLink = nameCell?.querySelector('a');
  const pinBtn = nameCell?.querySelector('.pin-button');
  const hideBtn = nameCell?.querySelector('.hide-button');
  const notesCell = row.querySelector('.activity_notes');
  const statusCell = row.querySelector('.activity_status');
  const desc = row.querySelector('.activity_desc');
  const checkOff = statusCell?.querySelector('.activity_check_off');
  const checkOn = statusCell?.querySelector('.activity_check_on');

  return {
    row,
    sectionKey,
    nameCell,
    nameLink,
    pinBtn,
    hideBtn,
    notesCell,
    statusCell,
    desc,
    checkOff,
    checkOn,
  };
}
