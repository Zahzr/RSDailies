import { renderSectionPanelHeader } from '../../components/headers/section-panel-header.js';

function renderColgroup(columns) {
  return columns.map((columnClass) => `<col class="${columnClass}">`).join('');
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
      ${renderSectionPanelHeader(section, colspan)}
    </thead>
    <tbody></tbody>
  </table>
</div>`.trim();
}
