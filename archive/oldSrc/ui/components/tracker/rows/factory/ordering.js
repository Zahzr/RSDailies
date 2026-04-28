export function persistOrderFromTable(sectionKey, { getTableId, save }) {
  const tableId = getTableId?.(sectionKey);
  if (!tableId) return;

  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tbody tr[data-id]'));
  const order = rows.map((row) => row.dataset.id).filter(Boolean);
  save(`order:${sectionKey}`, order);
}

export function bindRowOrdering(row, sectionKey, { getTableId, save }) {
  if (!row || !row.dataset?.id) return;

  const tableId = getTableId?.(sectionKey);
  if (!tableId) return;

  row.setAttribute('draggable', 'true');

  row.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', row.dataset.id);
    row.classList.add('dragging');
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
  });

  row.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (!dragging || dragging === row) return;

    const rect = row.getBoundingClientRect();
    const offset = e.clientY - rect.top;

    if (offset > rect.height / 2) {
      row.after(dragging);
    } else {
      row.before(dragging);
    }
  });

  row.addEventListener('drop', () => {
    persistOrderFromTable(sectionKey, { getTableId, save });
  });
}