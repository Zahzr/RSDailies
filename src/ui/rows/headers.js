export function makeCollapseButton(blockId, { isCollapsedBlock, setCollapsedBlock, renderApp }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-secondary btn-sm mini-collapse-btn';

  const collapsed = isCollapsedBlock(blockId);
  btn.textContent = collapsed ? '\u25B6' : '\u25BC';
  btn.setAttribute('aria-label', collapsed ? 'Expand section' : 'Collapse section');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCollapsedBlock(blockId, !isCollapsedBlock(blockId));
    renderApp();
  });

  return btn;
}

function makeResetButton(onResetClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-secondary btn-sm mini-reset-btn';
  btn.textContent = '\u21B4 Reset';
  btn.setAttribute('aria-label', 'Reset section');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onResetClick?.();
  });

  return btn;
}

function makeRestoreSelect(restoreOptions = []) {
  const select = document.createElement('select');
  select.className = 'form-select form-select-sm';
  select.style.width = 'auto';
  select.style.maxWidth = '220px';
  select.style.display = 'inline-block';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Restore removed...';
  select.appendChild(placeholder);

  restoreOptions.forEach((entry) => {
    const option = document.createElement('option');
    option.value = entry.value;
    option.textContent = entry.label;
    select.appendChild(option);
  });

  return select;
}

function makeRestoreButton(select, onRestoreSelect) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-secondary btn-sm mini-reset-btn';
  btn.textContent = '\u21BA Restore';
  btn.setAttribute('aria-label', 'Restore removed item');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const value = select?.value;
    if (!value) return;
    onRestoreSelect?.(value);
  });

  return btn;
}

export function createHeaderRow(label, blockId, options = {}) {
  const {
    className = '',
    rightText = '',
    onRightClick = null,
    onResetClick = null,
    restoreOptions = [],
    onRestoreSelect = null,
    collapsible = true,
    context = {}
  } = options;

  const { isCollapsedBlock, setCollapsedBlock, renderApp } = context;

  const row = document.createElement('tr');
  row.className = className;

  const cell = document.createElement('td');
  cell.colSpan = 3;
  cell.className = 'header_like_color';

  const bar = document.createElement('div');
  bar.className = 'header_like_inner';
  bar.style.position = 'relative';
  bar.style.display = 'flex';
  bar.style.alignItems = 'center';
  bar.style.justifyContent = 'center';
  bar.style.width = '100%';
  bar.style.minHeight = '38px';

  const center = document.createElement('div');
  center.className = 'activity_name header_like_name';
  center.style.textAlign = 'center';
  center.style.width = '100%';
  center.style.pointerEvents = 'none';
  center.innerHTML = `<span class="header_like_text">${label}</span>`;

  const right = document.createElement('div');
  right.className = 'header_like_controls';
  right.style.position = 'absolute';
  right.style.right = '0';
  right.style.top = '50%';
  right.style.transform = 'translateY(-50%)';
  right.style.display = 'inline-flex';
  right.style.alignItems = 'center';
  right.style.gap = '8px';

  if (rightText) {
    const status = document.createElement('span');
    status.className = 'header_like_status';
    status.textContent = rightText;
    right.appendChild(status);
  }

  if (Array.isArray(restoreOptions) && restoreOptions.length > 0 && onRestoreSelect) {
    const restoreSelect = makeRestoreSelect(restoreOptions);
    const restoreButton = makeRestoreButton(restoreSelect, onRestoreSelect);
    right.appendChild(restoreSelect);
    right.appendChild(restoreButton);
  }

  if (onResetClick) {
    right.appendChild(makeResetButton(onResetClick));
  }

  const collapse = (collapsible && blockId)
    ? makeCollapseButton(blockId, { isCollapsedBlock, setCollapsedBlock, renderApp })
    : null;

  if (collapse) {
    right.appendChild(collapse);
  }

  bar.appendChild(center);
  bar.appendChild(right);
  cell.appendChild(bar);

  if (onRightClick) {
    right.classList.add('header_like_click');
    right.addEventListener('click', (e) => {
      if (collapse && e.target.closest('.mini-collapse-btn')) return;
      if (e.target.closest('.mini-reset-btn')) return;
      if (e.target.closest('select')) return;
      onRightClick();
    });
  }

  row.appendChild(cell);
  return row;
}