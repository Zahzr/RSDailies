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
        if (pins[pinId]) items.push({ task, sectionKey: section.key, pinId, pinTimestamp: getPinTimestamp(pins, pinId) });

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
            if (pins[pinId]) items.push({ task: sub.timerTask, sectionKey: 'rs3farming', pinId, pinTimestamp: getPinTimestamp(pins, pinId) });
          } else if (Array.isArray(sub.tasks)) {
            sub.tasks.forEach((task) => {
              const pinId = `rs3farming::${task.id}`;
              if (pins[pinId]) items.push({ task, sectionKey: 'rs3farming', pinId, pinTimestamp: getPinTimestamp(pins, pinId) });
            });
          }
        });
      });
    }
  });

  return items;
}
