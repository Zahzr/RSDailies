import { tasksConfig as TASKS_CONFIG } from '../config/tasks/index.js';
import { farmingConfig as FARMING_CONFIG } from '../config/farming/index.js';
import { settingsDefaults as DEFAULT_SETTINGS } from '../config/settings-defaults.js';
import { theme as THEME_TOKENS } from '../config/theme.js';

export function initializeCompositionRoot() {
  return {
    tasks: TASKS_CONFIG,
    farming: FARMING_CONFIG,
    settings: DEFAULT_SETTINGS,
    theme: THEME_TOKENS
  };
}

export { TASKS_CONFIG, FARMING_CONFIG, DEFAULT_SETTINGS, THEME_TOKENS };
