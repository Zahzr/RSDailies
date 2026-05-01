import { appendRows, markLastVisibleRow, finalizeSubgroupBlock } from './common.js';

export function renderUnifiedSection(tbody, blocks, context) {
  if (!tbody || !Array.isArray(blocks)) return;

  const { markLastVisibleRow: markLast = markLastVisibleRow } = context;
  const allVisibleRows = [];

  blocks.forEach((block, index) => {
    const {
      id,
      kind,
      title,
      tasks = [],
      headerMode = 'default',
      rightText = '',
      onResetClick = null,
      restoreOptions = null,
      onRestoreSelect = null
    } = block;

    const blockRows = [];
    tasks.forEach((task) => {
      const row = context.createRow(context.sectionKey, task, { context: context.context });
      if (row) blockRows.push(row);
    });

    if (kind === 'subgroup') {
      const collapsed = context.isCollapsedBlock(id);
      const headerRow = context.createHeaderRow(title, id, {
        rightText,
        onResetClick,
        restoreOptions,
        onRestoreSelect,
        context: context.context
      });

      if (headerMode === 'attached') {
        headerRow.classList.add('subgroup-attached-header');
      }

      finalizeSubgroupBlock(headerRow, blockRows, {
        collapsed,
        skipEdgeClasses: index < blocks.length - 1
      });

      tbody.appendChild(headerRow);
      if (!collapsed) {
        appendRows(tbody, blockRows);
        allVisibleRows.push(...blockRows);
      }
      return;
    }

    if (kind === 'rows') {
      appendRows(tbody, blockRows);
      allVisibleRows.push(...blockRows);
    }
  });

  markLast(allVisibleRows);
}
