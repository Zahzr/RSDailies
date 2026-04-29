import { osrsOverviewPage } from '../../../content/games/osrs/pages/overview.page.js';
import { rs3AllTasksPage } from '../../../content/games/rs3/pages/all.page.js';
import { rs3CustomPage } from '../../../content/games/rs3/pages/custom.page.js';
import { rs3DailyPage } from '../../../content/games/rs3/pages/daily.page.js';
import { rs3FarmingPage } from '../../../content/games/rs3/pages/farming.page.js';
import { rs3GatheringPage } from '../../../content/games/rs3/pages/gathering.page.js';
import { rs3MonthlyPage } from '../../../content/games/rs3/pages/monthly.page.js';
import { rs3OverviewPage } from '../../../content/games/rs3/pages/overview.page.js';
import { rs3WeeklyPage } from '../../../content/games/rs3/pages/weekly.page.js';
import { validateContentPages } from './validate-content.js';

const CONTENT_PAGES = Object.freeze([
  rs3OverviewPage,
  rs3AllTasksPage,
  rs3CustomPage,
  rs3FarmingPage,
  rs3DailyPage,
  rs3GatheringPage,
  rs3WeeklyPage,
  rs3MonthlyPage,
  osrsOverviewPage,
]);

export function loadContentPages() {
  const pages = [...CONTENT_PAGES]
    .sort((left, right) => {
      const leftOrder = Number.isFinite(left?.displayOrder) ? left.displayOrder : Number.MAX_SAFE_INTEGER;
      const rightOrder = Number.isFinite(right?.displayOrder) ? right.displayOrder : Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return String(left.id).localeCompare(String(right.id));
    });

  return validateContentPages(pages);
}

export function loadContentPagesByGame(game) {
  return loadContentPages().filter((page) => page.game === game);
}
