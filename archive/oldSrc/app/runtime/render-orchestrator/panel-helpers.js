import { SECTION_TABLE_IDS } from '../../../core/ids/section-ids.js';

export function getGroupCountdown(groupName, { formatDurationMsCore, nextDailyBoundary, nextWeeklyBoundary, nextMonthlyBoundary }) {
  const lower = String(groupName || '').toLowerCase().trim();
  if (lower === 'general' || lower.includes('daily')) return formatDurationMsCore(nextDailyBoundary(new Date()) - Date.now());
  if (lower.includes('weekly')) return formatDurationMsCore(nextWeeklyBoundary(new Date()) - Date.now());
  if (lower.includes('monthly')) return formatDurationMsCore(nextMonthlyBoundary(new Date()) - Date.now());
  return '';
}

function getLeadingText(row) {
  if (!row) return '';
  const first = row.querySelector('th, td, .activity_name, .activity_desc');
  return String(first?.textContent || '').replace(/\s+/g, ' ').trim();
}

export function movePenguinsBlockToBottom() {
  const tbody = document.querySelector(`#${SECTION_TABLE_IDS.rs3weekly} tbody`);
  if (!tbody) return;
  const rows = [...tbody.querySelectorAll('tr')];
  const startIndex = rows.findIndex((row) => getLeadingText(row) === 'Penguins');
  if (startIndex === -1) return;

  const block = [rows[startIndex]];
  let cursor = startIndex + 1;
  while (cursor < rows.length) {
    const row = rows[cursor];
    const text = getLeadingText(row);
    const isPenguinChild =
      row.classList.contains('weekly-child-row') ||
      /^Penguin\s+\d+$/i.test(text) ||
      text === 'Polar Bear';
    if (!isPenguinChild) break;
    block.push(row);
    cursor += 1;
  }

  block.forEach((row) => tbody.appendChild(row));
}

export function hideAllSortButtons() {
  document.querySelectorAll('[id$="_sort_button"]').forEach((button) => {
    button.style.display = 'none';
    button.style.visibility = 'hidden';
  });
}

export function appendCustomEmptyPlaceholder(tbody) {
  if (!tbody || tbody.children.length > 0) return;

  const row = document.createElement('tr');
  row.className = 'custom-empty-row subsection-end-row';

  const cell = document.createElement('td');
  cell.colSpan = 4;

  Object.assign(cell.style, {
    background: '#2f353d',
    borderTop: '1px solid #505963',
    borderBottom: '1px solid #505963',
    borderLeft: '14px solid #000',
    borderRight: '14px solid #000',
    backgroundClip: 'padding-box',
    padding: '1rem',
    textAlign: 'center',
    color: '#d8dde3',
    fontSize: '0.98rem',
    borderBottomLeftRadius: '14px',
    borderBottomRightRadius: '14px',
    overflow: 'hidden'
  });

  cell.textContent = 'Click the add button to add a custom task!';
  row.appendChild(cell);
  tbody.appendChild(row);
}