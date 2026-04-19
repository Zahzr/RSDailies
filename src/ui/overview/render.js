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

function getPinTimestamp(pins, pinId) {
  const value = pins?.[pinId];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value) return 0;
  return -1;
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
          items.push({
            task,
            sectionKey: section.key,
            pinId,
            pinTimestamp: getPinTimestamp(pins, pinId)
          });
        }

        if (Array.isArray(task.children)) {
          task.children.forEach((child) => {
            const childPinId = `${section.key}::${task.id}::${child.id}`;
            if (pins[childPinId]) {
              items.push({
                task: child,
                sectionKey: section.key,
                pinId: childPinId,
                parentId: task.id,
                pinTimestamp: getPinTimestamp(pins, childPinId)
              });
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
              items.push({
                task: sub.timerTask,
                sectionKey: 'rs3farming',
                pinId,
                pinTimestamp: getPinTimestamp(pins, pinId)
              });
            }
          } else if (Array.isArray(sub.tasks)) {
            sub.tasks.forEach((task) => {
              const pinId = `rs3farming::${task.id}`;
              if (pins[pinId]) {
                items.push({
                  task,
                  sectionKey: 'rs3farming',
                  pinId,
                  pinTimestamp: getPinTimestamp(pins, pinId)
                });
              }
            });
          }
        });
      });
    }
  });

  return items;
}

function getSectionLabel(sectionKey) {
  switch (sectionKey) {
    case 'custom':
      return 'Custom';
    case 'rs3daily':
      return 'Dailies';
    case 'gathering':
      return 'Gathering';
    case 'rs3weekly':
      return 'Weeklies';
    case 'rs3monthly':
      return 'Monthlies';
    case 'rs3farming':
      return 'Farming';
    default:
      return sectionKey;
  }
}

function sortTopFive(items) {
  return [...items].sort((a, b) => {
    const ts = (b.pinTimestamp || 0) - (a.pinTimestamp || 0);
    if (ts !== 0) return ts;
    return String(a.task?.name || '').localeCompare(String(b.task?.name || ''));
  });
}

function sortAlphabetical(items) {
  return [...items].sort((a, b) =>
    String(a.task?.name || '').localeCompare(String(b.task?.name || ''))
  );
}

function buildOverviewCard(items, { createRow, context, compact = false }) {
  const wrapper = document.createElement('div');
  wrapper.className = compact
    ? 'overview-card overview-card-compact'
    : 'overview-card overview-card-full';

  const table = document.createElement('table');
  table.className = 'table table-dark table-hover rs3-table mb-0';

  const tbody = document.createElement('tbody');

  items.forEach(({ task, sectionKey, pinId }) => {
    const row = createRow(sectionKey, task, {
      context: {
        ...context,
        isOverviewPanel: true,
        overviewPinId: pinId
      }
    });

    if (!row) return;

    row.classList.add('overview-row');

    if (compact) {
      row.classList.add('overview-row-compact');

      const notesCell = row.querySelector('.activity_notes');
      const desc = row.querySelector('.activity_desc');
      const nameCell = row.querySelector('.activity_name');

      if (nameCell) {
        const badge = document.createElement('span');
        badge.className = 'overview-section-badge';
        badge.textContent = getSectionLabel(sectionKey);
        nameCell.appendChild(badge);
      }

      if (notesCell) {
        notesCell.classList.add('overview-notes-compact');
      }

      if (desc) {
        const original = desc.textContent.trim();
        desc.textContent = original;
      }
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);

  return wrapper;
}

function buildPanelChrome() {
  const wrapper = document.createElement('div');
  wrapper.className = 'overview-shell';
  wrapper.style.background = '#2f353d';
  wrapper.style.border = '1px solid #505963';
  wrapper.style.borderTop = '0';
  wrapper.style.padding = '0.7rem 0.9rem 0.9rem';
  wrapper.style.borderRadius = '0 0 6px 6px';

  const note = document.createElement('div');
  note.style.textAlign = 'right';
  note.style.fontSize = '0.8rem';
  note.style.color = '#bcc4ce';
  note.style.whiteSpace = 'nowrap';
  note.style.overflow = 'hidden';
  note.style.textOverflow = 'ellipsis';
  note.textContent = 'Will pin all in main page for visual. Only top 5 will preview on other pages.';

  const divider = document.createElement('div');
  divider.style.margin = '0.5rem 0 0.7rem';
  divider.style.borderTop = '1px solid rgba(255,255,255,0.16)';

  const content = document.createElement('div');

  wrapper.appendChild(note);
  wrapper.appendChild(divider);
  wrapper.appendChild(content);

  return { wrapper, content };
}

function buildEmptyMessage(text) {
  const empty = document.createElement('div');
  empty.style.textAlign = 'center';
  empty.style.color = '#d8dde3';
  empty.style.padding = '1rem 0 0.4rem';
  empty.style.fontSize = '0.98rem';
  empty.textContent = text;
  return empty;
}

function buildSplitDivider(label = 'All pinned items') {
  const wrap = document.createElement('div');
  wrap.style.margin = '0.85rem 0 0.55rem';
  wrap.style.borderTop = '1px solid rgba(255,255,255,0.16)';
  wrap.style.position = 'relative';

  const text = document.createElement('span');
  text.textContent = label;
  text.style.position = 'relative';
  text.style.top = '-0.72rem';
  text.style.background = '#2f353d';
  text.style.padding = '0 0.5rem';
  text.style.color = '#c8d0d9';
  text.style.fontSize = '0.82rem';
  text.style.display = 'inline-block';

  wrap.appendChild(text);
  return wrap;
}

export function applyPageModeVisibility() {
  const dashboard = document.getElementById('dashboard-container');
  const overviewMount = document.getElementById('overview-mount');

  if (!dashboard || !overviewMount) return;

  overviewMount.style.display = '';
  dashboard.style.display = '';
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
  collectOverviewItems,
  createRow,
  context
}) {
  const mode = getPageMode();
  applyPageModeVisibility(mode);

  const overview = ensureOverviewLayout();
  if (!overview) return;

  overview.innerHTML = '';

  const items = collectOverviewItems(sections, { getOverviewPins, load });
  const recentItems = sortTopFive(items).slice(0, 5);

  const { wrapper, content } = buildPanelChrome();
  overview.appendChild(wrapper);

  if (items.length === 0) {
    content.appendChild(
      buildEmptyMessage('Click the favorite button to pin them to the overview.')
    );
    return;
  }

  if (mode === 'overview') {
    const recentCard = buildOverviewCard(recentItems, {
      createRow,
      context,
      compact: false
    });
    content.appendChild(recentCard);

    const remainingItems = sortAlphabetical(
      items.filter((item) => !recentItems.some((recent) => recent.pinId === item.pinId))
    );

    if (remainingItems.length > 0) {
      content.appendChild(buildSplitDivider('All pinned items'));
      const remainingCard = buildOverviewCard(remainingItems, {
        createRow,
        context,
        compact: false
      });
      content.appendChild(remainingCard);
    }

    return;
  }

  const compactCard = buildOverviewCard(recentItems, {
    createRow,
    context,
    compact: true
  });

  content.appendChild(compactCard);
}