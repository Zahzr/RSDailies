export function formatOverviewCountdown(kind, targetMs, { formatDurationMs }) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return 'READY';
  return `${kind} in ${formatDurationMs(diff)}`;
}

export function collectOverviewItems(sections, { getOverviewPins, load }) {
  const pins = getOverviewPins(load);
  const items = [];

  sections.forEach((section) => {
    section.tasks.forEach((task) => {
      const pinId = `${section.key}::${task.id}`;
      if (pins[pinId]) {
        items.push({ task, sectionKey: section.key });
      }

      if (task.children) {
        task.children.forEach((child) => {
          const childPinId = `${section.key}::${task.id}::${child.id}`;
          if (pins[childPinId]) {
            items.push({ task: child, sectionKey: section.key });
          }
        });
      }
    });

    if (section.key === 'rs3farming' && section.groups) {
      section.groups.forEach((group) => {
        group.subgroups.forEach((sub) => {
          if (sub.isTimer) {
            const pinId = `rs3farming::${sub.timerTask.id}`;
            if (pins[pinId]) {
              items.push({ task: sub.timerTask, sectionKey: 'rs3farming' });
            }
          } else if (sub.tasks) {
            sub.tasks.forEach((t) => {
              const pinId = `rs3farming::${t.id}`;
              if (pins[pinId]) {
                items.push({ task: t, sectionKey: 'rs3farming' });
              }
            });
          }
        });
      });
    }
  });

  return items;
}

export function applyPageModeVisibility(mode) {
  const dashboard = document.getElementById('dashboard-container');
  const overview = document.getElementById('overview-container');
  if (!dashboard || !overview) return;

  if (mode === 'overview') {
    dashboard.style.display = 'none';
    overview.style.display = 'block';
  } else {
    dashboard.style.display = 'block';
    overview.style.display = 'none';
  }
}

export function ensureOverviewLayout() {
  let overview = document.getElementById('overview-container');
  if (overview) return overview;

  overview = document.createElement('div');
  overview.id = 'overview-container';
  overview.className = 'container mt-4';
  overview.style.display = 'none';

  const row = document.createElement('div');
  row.className = 'row';
  overview.appendChild(row);

  const main = document.getElementById('dashboard-container')?.parentElement;
  if (main) main.appendChild(overview);

  return overview;
}

export function renderOverviewPanel(sections, {
  getPageMode,
  getOverviewPins,
  load,
  applyPageModeVisibility,
  ensureOverviewLayout,
  collectOverviewItems,
  createRow,
  context
}) {
  const mode = getPageMode();
  applyPageModeVisibility(mode);
  if (mode !== 'overview') return;

  const overview = ensureOverviewLayout();
  const row = overview.querySelector('.row');
  row.innerHTML = '';

  const items = collectOverviewItems(sections, { getOverviewPins, load });

  if (items.length === 0) {
    row.innerHTML = '<div class="col-12 text-center p-5"><h3>No items pinned to overview.</h3><p>Pin tasks from the dashboard to see them here.</p></div>';
    return;
  }

  const tableCol = document.createElement('div');
  tableCol.className = 'col-12';
  const table = document.createElement('table');
  table.className = 'table table-dark table-hover rs3-table';
  const tbody = document.createElement('tbody');

  items.forEach(({ task, sectionKey }) => {
    tbody.appendChild(createRow(sectionKey, task, { context }));
  });

  table.appendChild(tbody);
  tableCol.appendChild(table);
  row.appendChild(tableCol);
}
