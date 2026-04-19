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

function closeMenu(menu, trigger) {
  if (!menu || !trigger) return;
  menu.style.display = 'none';
  trigger.setAttribute('aria-expanded', 'false');
}

function openMenu(menu, trigger) {
  if (!menu || !trigger) return;
  menu.style.display = 'flex';
  trigger.setAttribute('aria-expanded', 'true');
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

function makeRestoreMenu(restoreOptions = [], onRestoreSelect = null) {
  if (!Array.isArray(restoreOptions) || restoreOptions.length === 0 || !onRestoreSelect) {
    return null;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'header_restore_wrapper';
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-flex';
  wrapper.style.alignItems = 'center';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'btn btn-secondary btn-sm mini-reset-btn';
  trigger.textContent = '\u21BA Restore';
  trigger.setAttribute('aria-label', 'Open restore menu');
  trigger.setAttribute('aria-expanded', 'false');

  const menu = document.createElement('div');
  menu.className = 'header_restore_menu';
  menu.style.position = 'absolute';
  menu.style.right = '0';
  menu.style.top = 'calc(100% + 6px)';
  menu.style.minWidth = '230px';
  menu.style.padding = '8px';
  menu.style.display = 'none';
  menu.style.flexDirection = 'column';
  menu.style.gap = '8px';
  menu.style.background = 'linear-gradient(180deg, #28303a, #222932)';
  menu.style.border = '1px solid #5f6975';
  menu.style.borderRadius = '8px';
  menu.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.35)';
  menu.style.zIndex = '450';

  const select = document.createElement('select');
  select.className = 'form-select form-select-sm';
  select.style.width = '100%';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select removed item...';
  select.appendChild(placeholder);

  restoreOptions.forEach((entry) => {
    const option = document.createElement('option');
    option.value = entry.value;
    option.textContent = entry.label;
    select.appendChild(option);
  });

  const applyBtn = document.createElement('button');
  applyBtn.type = 'button';
  applyBtn.className = 'btn btn-secondary btn-sm mini-reset-btn';
  applyBtn.textContent = '\u21BA Restore item';

  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!select.value) return;
    onRestoreSelect(select.value);
    closeMenu(menu, trigger);
  });

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (menu.style.display === 'flex') {
      closeMenu(menu, trigger);
    } else {
      openMenu(menu, trigger);
    }
  });

  menu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      closeMenu(menu, trigger);
    }
  });

  menu.appendChild(select);
  menu.appendChild(applyBtn);
  wrapper.appendChild(trigger);
  wrapper.appendChild(menu);

  return wrapper;
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
  right.style.right = '10px';
  right.style.top = '50%';
  right.style.transform = 'translateY(-50%)';
  right.style.display = 'inline-flex';
  right.style.alignItems = 'center';
  right.style.gap = '8px';

  if (rightText) {
    const status = document.createElement('span');
    status.className = 'header_like_status countdown badge bg-secondary';
    status.textContent = rightText;
    status.style.minWidth = '74px';
    status.style.minHeight = '24px';
    status.style.display = 'inline-flex';
    status.style.alignItems = 'center';
    status.style.justifyContent = 'center';
    status.style.padding = '0.2rem 0.5rem';
    status.style.fontSize = '0.92rem';
    status.style.fontWeight = '700';
    status.style.lineHeight = '1';
    right.appendChild(status);
  }

  if (onResetClick) {
    right.appendChild(makeResetButton(onResetClick));
  }

  const restoreMenu = makeRestoreMenu(restoreOptions, onRestoreSelect);
  if (restoreMenu) {
    right.appendChild(restoreMenu);
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