import { getTimerMinutes } from '../../../../../features/farming/domain/timer-math.js';

export function centeredHeaderLabel(text) {
  return `<span style="display:block;width:100%;text-align:center;">${text}</span>`;
}

export function getRenderableHeaderStatus(status) {
  if (!status || typeof status !== 'object') return '';
  if (status.state === 'running' || status.state === 'ready') {
    return status.note || '';
  }
  return '';
}

export function formatFarmingDurationNote(task, { formatDurationMs }) {
  if (typeof task?.durationNote === 'string' && task.durationNote.trim()) {
    return task.durationNote.trim();
  }

  const minutes = getTimerMinutes(task);
  if (!minutes) return '';
  const ms = minutes * 60 * 1000;
  return `Growth time: ${formatDurationMs(ms)}`;
}

export function buildFarmingLocationTask(plot, timerTask, details = {}) {
  const {
    durationNote = '',
    statusNote = ''
  } = typeof details === 'string'
    ? { durationNote: details }
    : details;

  const plotNote = plot.note || plot.locationNote || '';
  const detailLines = [];

  if (statusNote) {
    detailLines.push({ kind: 'note', text: statusNote });
  } else if (durationNote) {
    detailLines.push({ kind: 'note', text: durationNote });
  }

  if (statusNote && durationNote && statusNote !== durationNote) {
    detailLines.push({ kind: 'duration', text: durationNote });
  }

  if (plotNote) {
    detailLines.push({ kind: 'location', text: plotNote });
  }

  return {
    ...plot,
    note: '',
    locationNote: '',
    durationNote: '',
    detailLines,
    wiki: plot.wiki || timerTask?.wiki || '',
    isChildRow: true
  };
}

export function appendRows(tbody, rows) {
  rows.forEach((row) => {
    if (row) tbody.appendChild(row);
  });
}

function clearEdgeClasses(row) {
  if (!row) return;
  row.classList.remove('block-end-row', 'subsection-end-row');
}

function isVisibleRow(row) {
  return !!row && row.dataset.completed !== 'hide';
}

export function markLastVisibleRow(rows, options = {}) {
  const { fallbackRow = null } = options;
  const list = Array.isArray(rows) ? rows.filter(Boolean) : [];

  list.forEach(clearEdgeClasses);
  clearEdgeClasses(fallbackRow);

  const visibleRows = list.filter(isVisibleRow);
  const target = visibleRows[visibleRows.length - 1] || fallbackRow || list[list.length - 1] || null;
  if (!target) return null;

  target.classList.add('block-end-row', 'subsection-end-row');
  return target;
}

export function finalizeSubgroupBlock(headerRow, rows, options = {}) {
  if (!headerRow) return null;

  const { collapsed = false } = options;
  headerRow.classList.add('subgroup-header-row');
  headerRow.classList.remove(
    'subgroup-open-row',
    'subgroup-terminal-row',
    'collapsed-subgroup-row',
    'subgroup-last-row',
    'block-end-row',
    'subsection-end-row'
  );

  const terminalRow = markLastVisibleRow(rows);
  if (collapsed || !terminalRow) {
    headerRow.classList.add(
      'subgroup-terminal-row',
      'collapsed-subgroup-row',
      'subgroup-last-row',
      'block-end-row',
      'subsection-end-row'
    );
    return headerRow;
  }

  headerRow.classList.add('subgroup-open-row');
  return terminalRow;
}

export function makeFarmingChildStorageId(timerTaskId, plotId) {
  return `rs3farming::${timerTaskId}::${plotId}`;
}

export function collectFarmingGroupTaskIds(group) {
  const ids = [];
  const subgroups = Array.isArray(group?.subgroups) ? group.subgroups : [];

  subgroups.forEach((subgroup) => {
    if (subgroup?.isTimer && subgroup?.timerTask) {
      const timerTaskId = subgroup.timerTask.id;
      const plots = Array.isArray(subgroup.plots) ? subgroup.plots : [];
      plots.forEach((plot) => {
        ids.push(makeFarmingChildStorageId(timerTaskId, plot.id));
      });
      return;
    }

    if (Array.isArray(subgroup?.tasks)) {
      subgroup.tasks.forEach((task) => ids.push(task.id));
    }
  });

  return ids;
}
