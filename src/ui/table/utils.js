export function getContainerId(sectionKey) {
  return `table-${sectionKey}`;
}

export function getTableId(sectionKey) {
  return `${sectionKey}-table`;
}

export function slugify(input) {
  if (!input) return '';
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function applyOrderingAndSort(sectionKey, tasks, { load }) {
  const order = load(`order:${sectionKey}`, []);
  const sort = load(`sort:${sectionKey}`, 'default');

  let results = [...tasks];

  if (order.length > 0) {
    const orderMap = new Map();
    order.forEach((id, idx) => orderMap.set(id, idx));

    results.sort((a, b) => {
      const idxA = orderMap.has(a.id) ? orderMap.get(a.id) : 9999;
      const idxB = orderMap.has(b.id) ? orderMap.get(b.id) : 9999;
      return idxA - idxB;
    });
  }

  if (sort === 'wiki') {
    results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  return results;
}
