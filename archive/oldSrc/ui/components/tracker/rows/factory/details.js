function createTextEntry(kind, text) {
  const normalized = typeof text === 'string' ? text.trim() : '';
  if (!normalized) return null;
  return { kind, text: normalized };
}

function createProfitEntry(item, qty) {
  const normalizedItem = typeof item === 'string' ? item.trim() : '';
  const normalizedQty = Number.isFinite(qty) ? qty : parseInt(qty, 10);
  if (!normalizedItem || !Number.isFinite(normalizedQty)) return null;
  return { kind: 'profit', item: normalizedItem, qty: normalizedQty };
}

function synthesizeTaskDetailEntries(task) {
  return [
    createTextEntry('note', task?.note),
    createProfitEntry(task?.profit?.item, task?.profit?.qty),
    createTextEntry('duration', task?.durationNote),
    createTextEntry('location', task?.locationNote)
  ].filter(Boolean);
}

function normalizeDetailEntry(entry) {
  if (!entry) return null;
  if (typeof entry === 'string') return createTextEntry('note', entry);
  if (typeof entry !== 'object') return null;

  if (entry.kind === 'profit') {
    return createProfitEntry(entry.item, entry.qty);
  }

  return createTextEntry(entry.kind || 'note', entry.text);
}

export function getTaskDetailEntries(task) {
  const sourceEntries = Array.isArray(task?.detailLines) && task.detailLines.length > 0
    ? task.detailLines.map(normalizeDetailEntry).filter(Boolean)
    : synthesizeTaskDetailEntries(task);

  const seen = new Set();
  return sourceEntries.filter((entry) => {
    const key = entry.kind === 'profit'
      ? `profit:${entry.item}:${entry.qty}`
      : `${entry.kind}:${entry.text.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function appendDetailText(container, className, text) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  container.appendChild(span);
}

function appendProfit(container, item, qty) {
  const span = document.createElement('span');
  span.className = 'item_profit';
  span.dataset.item = item;
  span.dataset.qty = String(qty);
  span.textContent = '\u2026';
  container.appendChild(span);
}

export function appendTaskDetails(container, task) {
  getTaskDetailEntries(task).forEach((entry) => {
    if (entry.kind === 'profit') {
      appendProfit(container, entry.item, entry.qty);
      return;
    }

    const className = entry.kind === 'duration'
      ? 'activity_duration_note'
      : entry.kind === 'location'
        ? 'activity_location_note'
        : 'activity_note_line';

    appendDetailText(container, className, entry.text);
  });
}
