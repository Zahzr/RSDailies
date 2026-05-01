import { HEADER_CLASSES } from './header.constants.js';

function joinClassNames(...tokens) {
  return tokens.filter(Boolean).join(' ');
}

export function renderHeaderFrameHtml({
  label,
  colspan,
  controlsHtml = '',
  rowClassName = '',
  cellClassName = HEADER_CLASSES.cell,
  barClassName = '',
  titleClassName = '',
  controlsClassName = ''
}) {
  return `
      <tr${rowClassName ? ` class="${rowClassName}"` : ''}>
        <td colspan="${colspan}" class="${cellClassName}">
          <div class="${joinClassNames(HEADER_CLASSES.bar, barClassName)}">
            <div class="${joinClassNames(HEADER_CLASSES.title, titleClassName)}">
              <span class="${HEADER_CLASSES.titleText}">${label}</span>
            </div>
            <div class="${joinClassNames(HEADER_CLASSES.controls, controlsClassName)}">
              ${controlsHtml}
            </div>
          </div>
        </td>
      </tr>`.trim();
}

export function createHeaderFrameRow({
  label,
  controls = [],
  rowClassName = '',
  cellColSpan = 3,
  cellClassName = HEADER_CLASSES.cell,
  barClassName = '',
  titleClassName = '',
  controlsClassName = '',
  titleIsHtml = false,
  documentRef = document
}) {
  const row = documentRef.createElement('tr');
  if (rowClassName) {
    row.className = rowClassName;
  }

  const cell = documentRef.createElement('td');
  cell.colSpan = cellColSpan;
  cell.className = cellClassName;

  const bar = documentRef.createElement('div');
  bar.className = joinClassNames(HEADER_CLASSES.bar, barClassName);

  const title = documentRef.createElement('div');
  title.className = joinClassNames(HEADER_CLASSES.title, titleClassName);

  const titleText = documentRef.createElement('span');
  titleText.className = HEADER_CLASSES.titleText;
  if (titleIsHtml) {
    titleText.innerHTML = label;
  } else {
    titleText.textContent = label;
  }
  title.appendChild(titleText);

  const controlsHost = documentRef.createElement('div');
  controlsHost.className = joinClassNames(HEADER_CLASSES.controls, controlsClassName);
  controls.forEach((control) => {
    if (control) {
      controlsHost.appendChild(control);
    }
  });

  bar.append(title, controlsHost);
  cell.appendChild(bar);
  row.appendChild(cell);

  return { row, cell, bar, title, controlsHost, titleText };
}
