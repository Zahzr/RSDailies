export function resolveHeaderContext(context = {}) {
  return {
    isCollapsedBlock: context.isCollapsedBlock || (() => false),
    setCollapsedBlock: context.setCollapsedBlock || (() => {}),
    renderApp: context.renderApp || (() => {})
  };
}

export function canRenderRestoreMenu(restoreOptions = [], onRestoreSelect = null) {
  return Array.isArray(restoreOptions) && restoreOptions.length > 0 && typeof onRestoreSelect === 'function';
}

export function getCollapseState(blockId, context = {}) {
  const { isCollapsedBlock } = resolveHeaderContext(context);
  return Boolean(blockId && isCollapsedBlock(blockId));
}
