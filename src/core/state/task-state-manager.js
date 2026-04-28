import { getSectionStorageKeys, StorageKeyBuilder } from '../storage/keys-builder.js';

function safeObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export class TaskStateManager {
  constructor(sectionKey, { load = () => null, save = () => {}, removeKey = () => {} } = {}) {
    this.sectionKey = sectionKey;
    this.load = load;
    this.save = save;
    this.removeKey = removeKey;
  }

  getSectionState() {
    const keys = getSectionStorageKeys(this.sectionKey);

    return {
      completed: safeObject(this.load(keys.completion, {})),
      hiddenRows: safeObject(this.load(keys.hiddenRows, {})),
      removedRows: safeObject(this.load(keys.removedRows, {})),
      hidden: !!this.load(keys.hidden, false),
      hideSection: !!this.load(keys.hidden, false),
      showHidden: !!this.load(keys.showHidden, false),
      sort: this.load(keys.sort, 'default'),
      order: safeArray(this.load(keys.order, [])),
    };
  }

  saveSectionValue(key, value) {
    this.save(StorageKeyBuilder.sectionValue(this.sectionKey, key), value);
  }

  resetSectionView() {
    const keys = getSectionStorageKeys(this.sectionKey);
    this.save(keys.completion, {});
    this.save(keys.hidden, false);
    this.save(keys.showHidden, false);
    this.save(keys.sort, 'default');
    this.save(keys.order, []);
    this.save(keys.hiddenRows, {});
    this.save(keys.removedRows, {});
  }

  getCompletedMap() {
    return this.getSectionState().completed;
  }

  isTaskCompleted(taskId) {
    return !!this.getCompletedMap()[taskId];
  }

  setTaskCompleted(taskId, completed) {
    const nextCompleted = { ...this.getCompletedMap() };

    if (completed) {
      nextCompleted[taskId] = true;
    } else {
      delete nextCompleted[taskId];
    }

    this.save(StorageKeyBuilder.sectionCompletion(this.sectionKey), nextCompleted);
    return nextCompleted;
  }
}

export function createTaskStateManager(sectionKey, storage) {
  return new TaskStateManager(sectionKey, storage);
}
