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

export function createHeaderRow(label, blockId, options = {}) {
  const {
    className = '',
    rightText = '',
    onRightClick = null,
    collapsible = true,
    context = {}
  } = options;

  const { isCollapsedBlock, setCollapsedBlock, renderApp } = context;

  const row = document.createElement('tr');
  row.className = className;

  const left = document.createElement('td');
  left.className = 'activity_name header_like_name';
  left.innerHTML = `<span class="header_like_text">${label}</span>`;

  const right = document.createElement('td');
  right.className = 'activity_notes header_like_color';
  right.colSpan = 2;

  const rightInner = document.createElement('div');
  rightInner.className = 'header_like_inner';

  const status = document.createElement('span');
  status.className = 'header_like_status';
  status.textContent = rightText || '';

  rightInner.appendChild(status);

  const collapse = (collapsible && blockId) ? makeCollapseButton(blockId, { isCollapsedBlock, setCollapsedBlock, renderApp }) : null;
  if (collapse) rightInner.appendChild(collapse);
  right.appendChild(rightInner);

  if (onRightClick) {
    right.classList.add('header_like_click');
    right.addEventListener('click', (e) => {
      if (collapse && e.target.closest('.mini-collapse-btn')) return;
      onRightClick();
    });
  }

  row.appendChild(left);
  row.appendChild(right);
  return row;
}
