import { SECTION_TABLE_IDS } from '../../../core/ids/section-ids.js';
import { appendTaskDetails } from '../../../ui/components/tracker/rows/factory/details.js';

export function createUiContext(deps, renderSelf) {
  const {
    load,
    save,
    getTaskState,
    getCustomTasks,
    saveCustomTasks,
    hideTask,
    setTaskCompleted,
    clearFarmingTimer,
    startFarmingTimer,
    startCooldown,
    isCollapsedBlock,
    setCollapsedBlock,
    getPageMode
  } = deps;

  return {
    load,
    save,
    getTaskState,
    cloneRowTemplate: () => document.getElementById('sample_row')?.content?.firstElementChild?.cloneNode(true) || null,
    createInlineActions: (task, isCustom) => {
      if (isCustom) return null;

      const wrapper = document.createElement('div');
      wrapper.className = 'activity_inline_actions';
      return wrapper.children.length ? wrapper : null;
    },
    appendRowText: (desc, task) => appendTaskDetails(desc, task),
    renderApp: renderSelf,
    hideTask,
    setTaskCompleted,
    clearFarmingTimer,
    startFarmingTimer,
    startCooldown,
    getTableId: (sectionKey) => SECTION_TABLE_IDS[sectionKey],
    isCollapsedBlock,
    setCollapsedBlock,
    getPageMode
  };
}
