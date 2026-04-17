export function formatOverviewCountdown(kind, targetMs, { formatDurationMs }) {
  const diff = targetMs - Date.now();
  if (diff <= 0) return 'READY';
  return `${kind} in ${formatDurationMs(diff)}`;
}

function normalizeSectionsObject(sections) {
  if (!sections || typeof sections !== 'object') return [];

  return [
    { key: 'custom', tasks: Array.isArray(sections.custom) ? sections.custom : [] },
    { key: 'rs3daily', tasks: Array.isArray(sections.rs3daily) ? sections.rs3daily : [] },
    { key: 'gathering', tasks: Array.isArray(sections.gathering) ? sections.gathering : [] },
    { key: 'rs3weekly', tasks: Array.isArray(sections.rs3weekly) ? sections.rs3weekly : [] },
    { key: 'rs3monthly', tasks: Array.isArray(sections.rs3monthly) ? sections.rs3monthly : [] },
    { key: 'rs3farming', groups: Array.isArray(sections.rs3farming) ? sections.rs3farming : [] }
  ];
}

export function collectOverviewItems(sections, { getOverviewPins, load }) {
  const pins = getOverviewPins(load);
  const items = [];
  const normalizedSections = Array.isArray(sections) ? sections : normalizeSectionsObject(sections);

  normalizedSections.forEach((section) => {
    if (Array.isArray(section.tasks)) {
      section.tasks.forEach((task) => {
        const pinId = `${section.key}::${task.id}`;
        if (pins[pinId]) {
          items.push({ task, sectionKey: section.key });
        }

        if (Array.isArray(task.children)) {
          task.children.forEach((child) => {
            const childPinId = `${section.key}::${task.id}::${child.id}`;
            if (pins[childPinId]) {
              items.push({ task: child, sectionKey: section.key });
            }
          });
        }
      });
    }

    if (section.key === 'rs3farming' && Array.isArray(section.groups)) {
      section.groups.forEach((group) => {
        if (!Array.isArray(group.subgroups)) return;

        group.subgroups.forEach((sub) => {
          if (sub.isTimer && sub.timerTask) {
            const pinId = `rs3farming::${sub.timerTask.id}`;
            if (pins[pinId]) {
              items.push({ task: sub.timerTask, sectionKey: 'rs3farming' });
            }
          } else if (Array.isArray(sub.tasks)) {
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
    row.innerHTML = '<div class="col-12"><div class="card rs3-card"><div class="card-body text-muted">No pinned items yet.</div></div></div>';
    return;
  }

  const col = document.createElement('div');
  col.className = 'col-12';

  const card = document.createElement('div');
  card.className = 'card rs3-card';

  const body = document.createElement('div');
  body.className = 'card-body p-0';

  const table = document.createElement('table');
  table.className = 'table table-dark table-hover rs3-table mb-0';

  const tbody = document.createElement('tbody');

  items.forEach(({ task, sectionKey }) => {
    tbody.appendChild(createRow(sectionKey, task, { context }));
  });

  table.appendChild(tbody);
  body.appendChild(table);
  card.appendChild(body);
  col.appendChild(card);
  row.appendChild(col);
}