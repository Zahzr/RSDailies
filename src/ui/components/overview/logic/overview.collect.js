import { getTrackerSections } from '../../../../app/registries/unified-registry.js';

function getPinTimestamp(pins, pinId) {
  const value = pins?.[pinId];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value) return 0;
  return -1;
}

function collectTaskPins(items, sectionKey, pins, into) {
  items.forEach((task) => {
    const pinId = `${sectionKey}::${task.id}`;
    if (pins[pinId]) {
      into.push({ task, sectionKey, pinId, pinTimestamp: getPinTimestamp(pins, pinId) });
    }

    if (!Array.isArray(task.children)) {
      return;
    }

    task.children.forEach((child) => {
      const childPinId = `${sectionKey}::${task.id}::${child.id}`;
      if (!pins[childPinId]) {
        return;
      }

      into.push({
        task: child,
        sectionKey,
        pinId: childPinId,
        parentId: task.id,
        pinTimestamp: getPinTimestamp(pins, childPinId),
      });
    });
  });
}

function collectFarmingPins(groups, pins, into) {
  groups.forEach((group) => {
    if (!Array.isArray(group.subgroups)) {
      return;
    }

    group.subgroups.forEach((subgroup) => {
      if (subgroup.isTimer && subgroup.timerTask) {
        const pinId = `timers::${subgroup.timerTask.id}`;
        if (pins[pinId]) {
          into.push({
            task: subgroup.timerTask,
            sectionKey: 'timers',
            pinId,
            pinTimestamp: getPinTimestamp(pins, pinId),
          });
        }
        return;
      }

      if (Array.isArray(subgroup.tasks)) {
        collectTaskPins(subgroup.tasks, 'timers', pins, into);
      }
    });
  });
}

export function collectOverviewItems(sections, { getOverviewPins, load }) {
  const pins = getOverviewPins(load);
  const items = [];

  getTrackerSections().forEach((sectionDefinition) => {
    const sectionKey = sectionDefinition.id;
    const sectionValue = sections?.[sectionKey];

    if (sectionDefinition.renderVariant === 'timer-groups') {
      if (Array.isArray(sectionValue)) {
        collectFarmingPins(sectionValue, pins, items);
      }
      return;
    }

    if (Array.isArray(sectionValue)) {
      collectTaskPins(sectionValue, sectionKey, pins, items);
    }
  });

  return items;
}
