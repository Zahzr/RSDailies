function renderColgroup(columns) {
  return columns.map((columnClass) => `<col class="${columnClass}">`).join('');
}

function renderHeaderControls(section) {
  const controls = [];
  const shell = section.shell || {};

  if (shell.countdownId) {
    controls.push(`<span id="${shell.countdownId}" class="countdown badge bg-secondary">--:--:--</span>`);
  }

  if (shell.showAddButton) {
    controls.push(`<button id="${section.id}_add_button" type="button" class="btn btn-primary btn-sm active">+ Add</button>`);
  }

  if (shell.showResetButton) {
    controls.push(`<button id="${section.id}_reset_button" type="button" class="btn btn-secondary btn-sm active">↴ Reset</button>`);
  }

  controls.push(`<button id="${section.id}_hide_button" type="button" class="btn btn-secondary btn-sm active hide_button">▼ Hide</button>`);
  controls.push(`<button id="${section.id}_unhide_button" type="button" class="btn btn-secondary btn-sm active unhide_button">▶ Show</button>`);

  return controls.join('');
}

export function buildSectionPanelHtml(section) {
  const shell = section.shell || {};
  const columns = Array.isArray(shell.columns) ? shell.columns : ['activity_col_name', 'activity_col_notes', 'activity_col_status'];
  const extraTableClasses = Array.isArray(shell.extraTableClasses) ? shell.extraTableClasses.join(' ') : '';
  const colspan = columns.length;
  const tableClassName = ['table', 'table-dark', 'table-hover', 'activity_table', extraTableClasses].filter(Boolean).join(' ');

  return `
<div class="col-12 table_container" id="${section.containerId}" data-hide="show" data-show-hidden="false">
  <table id="${section.tableId}" class="${tableClassName}">
    <colgroup>
      ${renderColgroup(columns)}
    </colgroup>
    <thead>
      <tr>
        <td colspan="${colspan}" class="header_like_color">
          <div class="header_like_inner" style="position:relative; display:flex; align-items:center; justify-content:center; width:100%; min-height:42px;">
            <div class="activity_name header_like_name" style="width:100%; text-align:center;">
              <span class="header_like_text">${section.label}</span>
            </div>
            <div style="position:absolute; right:0; top:50%; transform:translateY(-50%); display:inline-flex; align-items:center; gap:8px;">
              ${renderHeaderControls(section)}
            </div>
          </div>
        </td>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>`.trim();
}
