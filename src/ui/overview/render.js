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

function sectionLabel(sectionKey) {
  switch (sectionKey) {
    case 'custom':
      return 'Custom Tasks';
    case 'rs3daily':
      return 'Dailies';
    case 'gathering':
      return 'Gathering';
    case 'rs3weekly':
      return 'Weeklies';
    case 'rs3monthly':
      return 'Monthlies';
    case 'rs3farming':
      return 'Farming Timers';
    default:
      return sectionKey;
  }
}

function buildOverviewMeta(task, sectionKey) {
  const parts = [];

  parts.push(sectionLabel(sectionKey));

  if (task?.note) parts.push(task.note);
  if (task?.locationNote) parts.push(task.locationNote);
  if (task?.durationNote) parts.push(task.durationNote);

  return parts.filter(Boolean).join(' • ');
}

function buildOverviewItem(task, sectionKey) {
  const item = document.createElement('div');
  item.className = 'overview_row';

  const title = document.createElement(task?.wiki ? 'a' : 'div');
  title.className = 'overview_row_title';
  title.textContent = task?.name || 'Unnamed Task';

  if (task?.wiki) {
    title.href = task.wiki;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
  }

  const meta = document.createElement('div');
  meta.className = 'overview_row_meta';
  meta.textContent = buildOverviewMeta(task, sectionKey);

  item.appendChild(title);
  item.appendChild(meta);

  return item;
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
            sub.tasks.forEach((task) => {
              const pinId = `rs3farming::${task.id}`;
              if (pins[pinId]) {
                items.push({ task, sectionKey: 'rs3farming' });
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
  const overviewMount = document.getElementById('overview-mount');

  if (!dashboard || !overviewMount) return;

  overviewMount.style.display = '';

  if (mode === 'overview') {
    dashboard.style.display = 'none';
  } else {
    dashboard.style.display = '';
  }
}

export function ensureOverviewLayout() {
  return document.getElementById('overview-content');
}

export function renderOverviewPanel(sections, {
  getPageMode,
  getOverviewPins,
  load,
  applyPageModeVisibility,
  ensureOverviewLayout,
  collectOverviewItems
}) {
  const mode = getPageMode();
  applyPageModeVisibility(mode);

  const overview = ensureOverviewLayout();
  if (!overview) return;

  overview.innerHTML = '';

  const items = collectOverviewItems(sections, { getOverviewPins, load });

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'overview_empty';
    empty.textContent =
      mode === 'overview'
        ? 'No pinned items yet.'
        : 'Pin rows with the star button to show them here.';
    overview.appendChild(empty);
    return;
  }

  items.forEach(({ task, sectionKey }) => {
    overview.appendChild(buildOverviewItem(task, sectionKey));
  });
}