export function getHiddenRowsForSection(sectionKey, context) {
  return { ...((context.load?.(`hiddenRows:${sectionKey}`, {})) || {}) };
}

export function getRemovedRowsForSection(sectionKey, context) {
  return { ...((context.load?.(`removedRows:${sectionKey}`, {})) || {}) };
}

export function setHiddenRowsForSection(sectionKey, nextHiddenRows, context) {
  context.save?.(`hiddenRows:${sectionKey}`, nextHiddenRows);
}

export function setRemovedRowsForSection(sectionKey, nextRemovedRows, context) {
  context.save?.(`removedRows:${sectionKey}`, nextRemovedRows);
}

export function clearCompletedEntries(sectionKey, taskIds, context) {
  const ids = new Set((Array.isArray(taskIds) ? taskIds : []).filter(Boolean));
  const completed = { ...((context.load?.(`completed:${sectionKey}`, {})) || {}) };
  let changed = false;

  ids.forEach((taskId) => {
    if (completed[taskId]) {
      delete completed[taskId];
      changed = true;
    }
  });

  if (changed) {
    context.save?.(`completed:${sectionKey}`, completed);
  }
}

export function resetTaskList(sectionKey, tasks, context) {
  const taskIds = (Array.isArray(tasks) ? tasks : []).map((task) => task.id).filter(Boolean);

  clearCompletedEntries(sectionKey, taskIds, context);

  const hiddenRows = getHiddenRowsForSection(sectionKey, context);
  const removedRows = getRemovedRowsForSection(sectionKey, context);

  let changedHidden = false;
  let changedRemoved = false;

  taskIds.forEach((taskId) => {
    if (hiddenRows[taskId]) {
      delete hiddenRows[taskId];
      changedHidden = true;
    }
    if (removedRows[taskId]) {
      delete removedRows[taskId];
      changedRemoved = true;
    }
  });

  if (changedHidden) setHiddenRowsForSection(sectionKey, hiddenRows, context);
  if (changedRemoved) setRemovedRowsForSection(sectionKey, removedRows, context);

  context.renderApp?.();
}

export function buildRestoreEntries(sectionKey, taskIds, context) {
  const hiddenRows = getHiddenRowsForSection(sectionKey, context);
  const removedRows = getRemovedRowsForSection(sectionKey, context);
  const seen = new Set();

  return taskIds
    .filter((taskId) => hiddenRows[taskId] || removedRows[taskId])
    .filter((taskId) => {
      if (seen.has(taskId)) return false;
      seen.add(taskId);
      return true;
    })
    .map((taskId) => ({
      value: taskId,
      label:
        typeof removedRows[taskId] === 'string'
          ? removedRows[taskId]
          : typeof hiddenRows[taskId] === 'string'
            ? hiddenRows[taskId]
            : taskId
    }));
}

export function restoreHiddenRow(sectionKey, taskId, context) {
  const nextHiddenRows = getHiddenRowsForSection(sectionKey, context);
  const nextRemovedRows = getRemovedRowsForSection(sectionKey, context);
  const completed = { ...((context.load?.(`completed:${sectionKey}`, {})) || {}) };

  delete nextHiddenRows[taskId];
  delete nextRemovedRows[taskId];
  delete completed[taskId];

  setHiddenRowsForSection(sectionKey, nextHiddenRows, context);
  setRemovedRowsForSection(sectionKey, nextRemovedRows, context);
  context.save?.(`completed:${sectionKey}`, completed);
  context.renderApp?.();
}
