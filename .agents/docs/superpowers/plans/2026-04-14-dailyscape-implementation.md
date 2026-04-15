# 📜 Dailyscape React Modernization – Implementation Plan

**Version:** 1.0  
**Based on:** 2026-04-14-dailyscape-react-modernization.md (APPROVED SPEC)  
**Created:** 2026-04-14

---

## 1. Overview & Execution Model

This plan decomposes the Dailyscape rebuild into **32 self-contained tasks**, grouped by layer:
- **Setup & Config** (4 tasks)
- **Engine Logic** (8 tasks)
- **React Components** (10 tasks)
- **Vanilla Fallback** (3 tasks)
- **Testing** (5 tasks)
- **Deployment** (2 tasks)

Each task:
- Takes 15-45 minutes
- Produces testable output
- Has clear acceptance criteria
- Can be verified independently

**Execution Order:** Sequential within layers, allows parallel work within layer if needed.

---

## 2. File Surface Map

### CREATE (New Files)

```
.agents/docs/superpowers/specs/2026-04-14-dailyscape-react-modernization.md ✅
.agents/docs/superpowers/plans/2026-04-14-dailyscape-implementation.md (this file)

src/
├─ engine/
│  ├─ storage/
│  │  ├─ interface.ts
│  │  ├─ adapters/
│  │  │  ├─ localStorage.ts
│  │  │  └─ supabase.ts
│  │  └─ index.ts
│  ├─ timer/
│  │  ├─ reset.ts
│  │  ├─ countdown.ts
│  │  └─ index.ts
│  ├─ notifications/
│  │  ├─ web.ts
│  │  ├─ discord.ts
│  │  └─ index.ts
│  ├─ calculations/
│  │  ├─ profit.ts
│  │  └─ index.ts
│  ├─ schema/
│  │  └─ index.ts
│  └─ index.ts
├─ react/
│  ├─ App.tsx
│  ├─ index.tsx
│  ├─ components/
│  │  ├─ Timeline/
│  │  │  ├─ Timeline.tsx
│  │  │  ├─ TimelineItem.tsx
│  │  │  ├─ TimelineList.tsx
│  │  │  └─ Timeline.module.css
│  │  ├─ TaskManager/
│  │  │  ├─ TaskManager.tsx
│  │  │  ├─ TaskForm.tsx
│  │  │  ├─ TaskList.tsx
│  │  │  └─ TaskManager.module.css
│  │  ├─ HerbTimer/
│  │  │  ├─ HerbTimer.tsx
│  │  │  ├─ HerbTimerDisplay.tsx
│  │  │  └─ HerbTimer.module.css
│  │  ├─ Settings/
│  │  │  ├─ Settings.tsx
│  │  │  ├─ ProfileManager.tsx
│  │  │  ├─ PreferencePanel.tsx
│  │  │  └─ Settings.module.css
│  │  └─ Common/
│  │     ├─ Nav.tsx
│  │     ├─ Footer.tsx
│  │     └─ Common.module.css
│  ├─ context/
│  │  ├─ TaskContext.tsx
│  │  ├─ ProfileContext.tsx
│  │  └─ NotificationContext.tsx
│  ├─ hooks/
│  │  ├─ useStorage.ts
│  │  ├─ useTasks.ts
│  │  ├─ useTimer.ts
│  │  └─ useProfitCalculation.ts
│  └─ styles/
│     ├─ App.css
│     ├─ variables.css
│     └─ globals.css
├─ vanilla/
│  ├─ utils/
│  │  ├─ storage.js
│  │  ├─ timer.js
│  │  ├─ dom.js
│  │  └─ profit.js
│  ├─ dailyscape-fallback.js
│  └─ dailyscape-fallback.css
├─ data/
│  ├─ templates.json
│  ├─ tasks.json
│  └─ schema.ts
└─ (other config files)

public/
├─ index.html (React entry)
├─ fallback.html (Vanilla JS entry)
├─ rsdata/ (from dependency)
└─ assets/
   ├─ icon.png
   ├─ alert.wav
   └─ favicon.ico

tests/
├─ engine/
│  ├─ storage.test.ts
│  ├─ timer.test.ts
│  ├─ notifications.test.ts
│  └─ calculations.test.ts
├─ react/
│  ├─ Timeline.test.tsx
│  ├─ TaskManager.test.tsx
│  ├─ HerbTimer.test.tsx
│  └─ Settings.test.tsx
├─ vanilla/
│  └─ fallback.test.js
└─ integration/
   ├─ sync.test.ts
   ├─ notifications.test.ts
   └─ e2e.test.ts
```

### MODIFY (Existing Files)

```
package.json
  - Add React, TypeScript, Tailwind, Jest, React Testing Library
  - Update build scripts
  - Update entry points

README.md
  - Add architecture overview
  - Explain React vs. Vanilla deployment
  - Add dev setup instructions
```

### REMOVE / ARCHIVE (Old Files)

```
dailyscape.js (→ archive or convert to vanilla fallback)
dailyscape.css (→ vanilla fallback CSS)
index.html (→ public/index.html)
```

---

## 3. Task Breakdown (32 Tasks)

### PHASE 0: Setup & Configuration (4 tasks)

#### Task 1: Initialize Project Structure & Git
**Files:** Directory creation only  
**What:** Create full src/, tests/, public/ directory structure  
**Why:** Establish clean separation of concerns before code  
**Test first:** `find src -type d | wc -l` should show 20+ directories  
**Acceptance criteria:**
- [ ] All directories created (no files yet)
- [ ] .git status shows only directory structure
- [ ] Directory tree matches spec
**Estimated time:** ~5 min  
**Commit message:** `chore: initialize project structure for react rebuild`

---

#### Task 2: Setup package.json & Dependencies
**Files:** `package.json`  
**What:** Add React 18, TypeScript, Tailwind, Jest, testing libraries; update build scripts  
**Why:** Establish build pipeline and dependency versions  
**Test first:** `npm install --dry-run` should succeed without errors  
**Acceptance criteria:**
- [ ] package.json has all dependencies (React, TS, Tailwind, Jest, etc.)
- [ ] Install succeeds: `npm install`
- [ ] Build script defined: `npm run build`
- [ ] Dev script defined: `npm run dev`
- [ ] Test script defined: `npm test`
**Estimated time:** ~10 min  
**Commit message:** `build: add react, typescript, tailwind, and testing libraries`

---

#### Task 3: Configure TypeScript & Tailwind
**Files:** `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`  
**What:** Set up TypeScript strict mode, Tailwind CSS, and PostCSS  
**Why:** Enable type safety and modern CSS tooling  
**Test first:** `npx tsc --noEmit` should pass with no errors  
**Acceptance criteria:**
- [ ] tsconfig.json set to strict mode
- [ ] tailwind.config.js extends default config
- [ ] PostCSS pipeline works: `npm run build:css` succeeds
- [ ] No TypeScript errors in shell
**Estimated time:** ~10 min  
**Commit message:** `build: configure typescript and tailwind css`

---

#### Task 4: Create Environment & Build Configuration
**Files:** `.env.example`, `vite.config.ts` (or webpack config), `.gitignore` updates  
**What:** Set up environment variables and build tool configuration  
**Why:** Support Phase 2 Supabase API keys and optimized builds  
**Test first:** Build succeeds: `npm run build` outputs to `dist/`  
**Acceptance criteria:**
- [ ] .env.example has VITE_SUPABASE_URL, VITE_SUPABASE_KEY, etc.
- [ ] Build config defined (Vite or Webpack)
- [ ] Dev server runs: `npm run dev` → localhost:5173
- [ ] .gitignore includes .env, dist/, node_modules
- [ ] Build output in dist/ is optimized (minified, tree-shaken)
**Estimated time:** ~15 min  
**Commit message:** `build: configure vite build tool and environment variables`

---

### PHASE 1: Engine Logic (8 tasks)

#### Task 5: Create Storage Abstraction Interface
**Files:** `src/engine/storage/interface.ts`  
**What:** Define StorageAdapter interface (get, set, remove, clear, keys, watch)  
**Why:** Enable swappable storage implementations (localStorage, Supabase, memory)  
**Test first:** Interface compiles without errors  
**Acceptance criteria:**
- [ ] Interface defines: get(key), set(key, value), remove(key), clear(), keys(), watch(callback)
- [ ] All methods return Promise<> for future async adapters
- [ ] TypeScript compiles with no errors
- [ ] Exported from `src/engine/storage/index.ts`
**Estimated time:** ~10 min  
**Commit message:** `feat: create storage adapter interface`

---

#### Task 6: Implement LocalStorage Adapter
**Files:** `src/engine/storage/adapters/localStorage.ts`  
**What:** Implement StorageAdapter for browser localStorage  
**Why:** Phase 1 base implementation; all existing functionality builds on this  
**Test first:** Unit tests for get/set/remove/clear  
**Acceptance criteria:**
- [ ] get(key) returns stored value or null
- [ ] set(key, value) persists to localStorage
- [ ] remove(key) deletes with removeItem()
- [ ] clear() wipes all keys
- [ ] keys() returns all stored keys
- [ ] watch() callback fires on changes (via storage event)
**Estimated time:** ~20 min  
**Commit message:** `feat: implement localstorage adapter`

---

#### Task 7: Create Supabase Adapter Skeleton
**Files:** `src/engine/storage/adapters/supabase.ts`  
**What:** Placeholder Supabase adapter (throws "not implemented" for Phase 2)  
**Why:** Architecture ready for Phase 2, no-op now  
**Test first:** Imports work, throws on method call  
**Acceptance criteria:**
- [ ] Creates SupabaseAdapter class
- [ ] Implements StorageAdapter interface
- [ ] All methods throw NotImplementedError with message "Phase 2: Supabase"
- [ ] Exported from `src/engine/storage/index.ts`
**Estimated time:** ~5 min  
**Commit message:** `feat: add supabase adapter placeholder (phase 2)`

---

#### Task 8: Implement Timer Logic (Reset Calculations)
**Files:** `src/engine/timer/reset.ts`  
**What:** Calculate next reset time for daily/weekly/monthly tasks  
**Why:** Core business logic; used by React components and vanilla fallback  
**Test first:** Unit tests for each reset type  
**Acceptance criteria:**
- [ ] getNextReset(type: 'daily' | 'weekly' | 'monthly'): Date
  - daily → tomorrow 00:00 UTC
  - weekly → next Wednesday 00:00 UTC
  - monthly → 1st of next month 00:00 UTC
- [ ] Tests pass for edge cases (day before reset, month boundary, etc.)
- [ ] No React dependency, pure functions
**Estimated time:** ~20 min  
**Commit message:** `feat: implement timer reset calculations`

---

#### Task 9: Implement Countdown Logic
**Files:** `src/engine/timer/countdown.ts`  
**What:** Calculate time remaining and "ready" status for a task  
**Why:** Enables countdown displays and auto-reset detection  
**Test first:** Unit tests for countdown calculations  
**Acceptance criteria:**
- [ ] calculateCountdown(lastDone: Date, resetType: string): { secondsLeft: number, isReady: boolean }
- [ ] Returns 0 seconds and isReady=true if past reset time
- [ ] Tests verify accuracy to within 1 second
- [ ] Pure functions, no side effects
**Estimated time:** ~15 min  
**Commit message:** `feat: implement countdown timer logic`

---

#### Task 10: Define TypeScript Schema & Types
**Files:** `src/engine/schema/index.ts`  
**What:** Export all TS interfaces (Task, Profile, GEItem, TaskState, etc.)  
**Why:** Centralize type definitions for React components and engine  
**Test first:** All exports compile without errors  
**Acceptance criteria:**
- [ ] TaskDefinition interface (from existing task schema)
- [ ] GEItem interface (RuneScape item with price)
- [ ] Profile interface (multi-user support)
- [ ] TaskState type ('true' | 'false' | 'hide')
- [ ] All 5 Timeframe types
- [ ] Exported from `src/engine/schema/index.ts`
- [ ] No circular imports
**Estimated time:** ~15 min  
**Commit message:** `feat: define typescript schema and types`

---

#### Task 11: Implement Profit Calculation Logic
**Files:** `src/engine/calculations/profit.ts`  
**What:** Calculate profit/hour for gathering tasks using rsdata items  
**Why:** Supports profit display and sorting  
**Test first:** Unit tests for profit calculations  
**Acceptance criteria:**
- [ ] calculateProfit(task, itemData): { inputs: Item[], outputs: Item[], netProfit: number }
- [ ] Handles simple (one output), complex (multiple outputs), and max-choice scenarios
- [ ] Uses GE prices from rsdata
- [ ] Tests verify accuracy against known values
**Estimated time:** ~20 min  
**Commit message:** `feat: implement profit calculation engine`

---

#### Task 12: Implement Notifications Interface & Web Adapter
**Files:** `src/engine/notifications/web.ts`, `src/engine/notifications/index.ts`  
**What:** Wrap Web Notifications API; add Discord skeleton  
**Why:** Enables task-ready notifications (Phase 1 web, future Discord)  
**Test first:** Unit tests for notification dispatch  
**Acceptance criteria:**
- [ ] requestPermission() asks browser for notification access
- [ ] notify(title, options) sends Web Notification
- [ ] Discord placeholder exports interface for Phase 1.5
- [ ] Tests mock Notifications API
**Estimated time:** ~15 min  
**Commit message:** `feat: implement notifications api with web adapter`

---

### PHASE 2: React Components & State (10 tasks)

#### Task 13: Create Global Context (TaskContext, ProfileContext, NotificationContext)
**Files:** `src/react/context/TaskContext.tsx`, `src/react/context/ProfileContext.tsx`, `src/react/context/NotificationContext.tsx`  
**What:** Define React Context for shared state across components  
**Why:** Centralize state so components don't prop-drill  
**Test first:** Context providers render without errors  
**Acceptance criteria:**
- [ ] TaskContext provides: { tasks, updateTask, completeTask, profilePrefix }
- [ ] ProfileContext provides: { profiles, currentProfile, switchProfile, createProfile }
- [ ] NotificationContext provides: { notify, permission, requestPermission }
- [ ] All contexts export useContext hooks (useTaskContext, etc.)
- [ ] No prop drilling needed in consumers
**Estimated time:** ~20 min  
**Commit message:** `feat: create react contexts for global state`

---

#### Task 14: Create useStorage Hook
**Files:** `src/react/hooks/useStorage.ts`  
**What:** Hook that abstracts storage operations (get/set with ProfileContext)  
**Why:** Components use this hook instead of calling localStorage directly  
**Test first:** Unit tests for hook behavior  
**Acceptance criteria:**
- [ ] useStorage(key): [value, setValue]
- [ ] Automatically prefixes key with profilePrefix
- [ ] setValue() updates React state AND underlying storage
- [ ] Watches storage events for multi-tab sync
- [ ] Tests pass with localStorage mock
**Estimated time:** ~15 min  
**Commit message:** `feat: create usestorage hook for storage abstraction`

---

#### Task 15: Create useTasks Hook
**Files:** `src/react/hooks/useTasks.ts`  
**What:** Hook that manages task completion state and transitions  
**Why:** Encapsulate task-related logic (complete, hide, reset)  
**Test first:** Unit tests for task state transitions  
**Acceptance criteria:**
- [ ] useTasks(): { tasks[], completeTask(slug), hideTask(slug), resetTasks(timeframe) }
- [ ] Calls engine.checkReset() to auto-reset if needed
- [ ] Manages UI state (completed/not completed/hidden)
- [ ] Updates storage via useStorage
- [ ] Tests verify state consistency
**Estimated time:** ~20 min  
**Commit message:** `feat: create usetasks hook for task management`

---

#### Task 16: Create useTimer Hook
**Files:** `src/react/hooks/useTimer.ts`  
**What:** Hook that runs countdown timer and refreshes every second  
**Why:** Drives countdown displays and auto-reset detection  
**Test first:** Unit tests for timer interval management  
**Acceptance criteria:**
- [ ] useTimer(resetType): { secondsLeft, isReady }
- [ ] Updates every 1 second via setInterval
- [ ] Cleans up interval on unmount
- [ ] Calls engine.getNextReset() on mount
- [ ] Tests verify interval cleanup, no memory leaks
**Estimated time:** ~15 min  
**Commit message:** `feat: create usetimer hook for countdown display`

---

#### Task 17: Create useProfitCalculation Hook
**Files:** `src/react/hooks/useProfitCalculation.ts`  
**What:** Hook that calculates and caches profit data for tasks  
**Why:** Display profit-per-hour on gathering tasks  
**Test first:** Unit tests for profit caching  
**Acceptance criteria:**
- [ ] useProfitCalculation(task): { profit, inputs[], outputs[], estimatedTime }
- [ ] Uses engine.calculateProfit()
- [ ] Caches result to avoid recalculation
- [ ] Re-calculates if rsdata prices update (detects change)
- [ ] Tests verify caching behavior
**Estimated time:** ~15 min  
**Commit message:** `feat: create useprofitcalculation hook`

---

#### Task 18: Build App.tsx & Layout Structure
**Files:** `src/react/App.tsx`, `src/react/index.tsx`  
**What:** Root component that sets up providers and renders main sections  
**Why:** Entry point for React app  
**Test first:** App renders without errors  
**Acceptance criteria:**
- [ ] Wraps child components with all Context providers
- [ ] Routes between /daily, /weekly, /monthly, /settings sections (or nav-based)
- [ ] Imports shared Styles
- [ ] No hardcoded props; uses contexts
- [ ] Renders successfully in browser
**Estimated time:** ~20 min  
**Commit message:** `feat: build app.tsx root component and layout`

---

#### Task 19: Build Timeline Component (Display Task Lists)
**Files:** `src/react/components/Timeline/Timeline.tsx`, `TimelineItem.tsx`, `TimelineList.tsx`  
**What:** Main component displaying task rows in tables (daily/weekly/monthly)  
**Why:** Core UI for viewing and toggling task completion  
**Test first:** Component renders tasks with correct states  
**Acceptance criteria:**
- [ ] Timeline accepts timeframe prop (daily/weekly/monthly)
- [ ] Renders rows with task name, description, URL
- [ ] Color-coded: green=completed, red=pending, hidden=collapsed
- [ ] Click row to toggle completion state
- [ ] Draggable rows (drag-drop library integration)
- [ ] Tests verify rendering and click handlers
**Estimated time:** ~30 min  
**Commit message:** `feat: build timeline component for task display`

---

#### Task 20: Build TaskManager Component (Add/Edit/Delete Tasks)
**Files:** `src/react/components/TaskManager/*.tsx`  
**What:** Modal/panel for managing task list (add new task, edit, delete)  
**Why:** Enable user customization of task list  
**Test first:** Component renders form and accepts input  
**Acceptance criteria:**
- [ ] TaskForm renders with fields: name, url, category, template type
- [ ] Submit creates/updates task in storage
- [ ] Delete button removes task
- [ ] TaskList shows all current tasks
- [ ] Tests verify form submission and validation
**Estimated time:** ~25 min  
**Commit message:** `feat: build taskmanager component for task creation`

---

#### Task 21: Build Settings Component (Profiles, Preferences)
**Files:** `src/react/components/Settings/*.tsx`  
**What:** Settings panel for profiles, split tables, compact mode, notifications  
**Why:** Provide user control over app behavior  
**Test first:** Component renders form controls  
**Acceptance criteria:**
- [ ] ProfileManager shows list of profiles, switch/delete buttons
- [ ] PreferencePanel has toggles: split daily/weekly, compact mode, notifications
- [ ] Form submission updates Context and Storage
- [ ] Tests verify state updates
**Estimated time:** ~25 min  
**Commit message:** `feat: build settings component for user preferences`

---

### PHASE 3: Vanilla Fallback (3 tasks)

#### Task 22: Create Vanilla JS Utils (Shared with Engine)
**Files:** `src/vanilla/utils/storage.js`, `timer.js`, `profit.js`, `dom.js`  
**What:** Vanilla JS versions of engine functions (no React)  
**Why:** Enable fallback version to work without React  
**Test first:** Modules load and export functions  
**Acceptance criteria:**
- [ ] storage.js: get/set/clear/keys using localStorage
- [ ] timer.js: getNextReset, calculateCountdown (JS versions)
- [ ] profit.js: calculateProfit (JS version)
- [ ] dom.js: DOM manipulation helpers (create row, add listener, etc.)
- [ ] All functions match engine signatures
**Estimated time:** ~30 min  
**Commit message:** `feat: create vanilla js utility functions for fallback`

---

#### Task 23: Build Vanilla JS Main App
**Files:** `src/vanilla/dailyscape-fallback.js`  
**What:** Modernized vanilla JS app (from existing code, using new utils)  
**Why:** Fallback for users whose browsers fail React  
**Test first:** App loads and displays tasks  
**Acceptance criteria:**
- [ ] Loads rsdata.js and utils
- [ ] Renders 5 task tables (daily/weekly/monthly/shops)
- [ ] Task rows clickable to toggle completion
- [ ] Drag-drop works for reordering
- [ ] localStorage persistence works
- [ ] Feature parity with existing vanilla app
**Estimated time:** ~45 min  
**Commit message:** `feat: build vanilla js fallback app`

---

#### Task 24: Build Service Worker (React Fallback Detection)
**Files:** `public/service-worker.js`  
**What:** Service worker that detects React failure and serves fallback.html  
**Why:** Graceful degradation if React fails to load  
**Test first:** Service worker registers and intercepts requests  
**Acceptance criteria:**
- [ ] Service worker registers on page load
- [ ] Catches errors from main.js (React bundle)
- [ ] Redirects to fallback.html if React fails
- [ ] Fallback page loads and functions correctly
- [ ] Tests verify error detection logic
**Estimated time:** ~20 min  
**Commit message:** `feat: add service worker for graceful react fallback`

---

### PHASE 4: Testing (5 tasks)

#### Task 25: Write Engine Logic Tests (Storage, Timer, Calculations)
**Files:** `tests/engine/*.test.ts`  
**What:** Comprehensive unit tests for engine layer  
**Why:** Ensure core logic is correct before React builds on it  
**Test first:** All tests pass with 100% coverage  
**Acceptance criteria:**
- [ ] storage.test.ts: get/set/remove/clear/keys with localStorage mock
- [ ] timer.test.ts: reset times, countdown accuracy, edge cases
- [ ] calculations.test.ts: profit with known GE prices, multiple scenarios
- [ ] notifications.test.ts: permission requests, dispatch
- [ ] All tests pass: `npm test -- tests/engine/`
- [ ] Coverage >95%
**Estimated time:** ~45 min  
**Commit message:** `test: add comprehensive engine logic tests`

---

#### Task 26: Write React Component Tests
**Files:** `tests/react/*.test.tsx`  
**What:** Unit tests for React components  
**Why:** Ensure components render and respond to user input  
**Test first:** All tests pass  
**Acceptance criteria:**
- [ ] Timeline.test.tsx: renders tasks, handles click to complete
- [ ] TaskManager.test.tsx: form submission, task creation
- [ ] Settings.test.tsx: preference updates, profile switching
- [ ] HerbTimer.test.tsx: countdown display updates
- [ ] All tests use React Testing Library best practices
- [ ] Coverage >75%
**Estimated time:** ~40 min  
**Commit message:** `test: add react component tests`

---

#### Task 27: Write Integration Tests (Multi-Component Flows)
**Files:** `tests/integration/*.test.ts`  
**What:** Tests that verify end-to-end workflows  
**Why:** Ensure components work together correctly  
**Test first:** All tests pass  
**Acceptance criteria:**
- [ ] sync.test.ts: complete task → storage persists → page reload → task still complete
- [ ] notifications.test.ts: permission request → notify on task ready
- [ ] e2e.test.ts: full workflow (switch profile → complete task → switch layout → hide section)
- [ ] Tests use mocked storage/notifications
- [ ] Coverage for all major user paths
**Estimated time:** ~35 min  
**Commit message:** `test: add integration tests for user workflows`

---

#### Task 28: Write Vanilla Fallback Tests
**Files:** `tests/vanilla/fallback.test.js`  
**What:** Tests for vanilla JS fallback app  
**Why:** Ensure fallback has feature parity  
**Test first:** All tests pass  
**Acceptance criteria:**
- [ ] Fallback app loads without React
- [ ] Task completion toggling works
- [ ] localStorage persistence works
- [ ] Drag-drop reordering works
- [ ] Profile switching works
- [ ] Basic coverage for major functions
**Estimated time:** ~25 min  
**Commit message:** `test: add vanilla fallback tests`

---

#### Task 29: Run Full Test Suite & Generate Coverage Report
**Files:** Coverage report outputs  
**What:** Execute all tests, measure coverage, identify gaps  
**Why:** Verify build quality before deployment  
**Test first:** `npm test -- --coverage` produces report  
**Acceptance criteria:**
- [ ] All tests pass: `npm test`
- [ ] Overall coverage >80%
- [ ] Engine coverage >95%
- [ ] React coverage >75%
- [ ] Coverage report generated: `coverage/index.html`
- [ ] No coverage gaps in critical paths (timer, storage, notifications)
**Estimated time:** ~10 min  
**Commit message:** `test: generate full coverage report`

---

### PHASE 5: Deployment & Documentation (2 tasks)

#### Task 30: Build & Deploy to GitHub Pages (React)
**Files:** `dist/` output  
**What:** Run build process, deploy React version to GitHub Pages  
**Why:** Make app live for users  
**Test first:** `npm run build` succeeds, artifact ready  
**Acceptance criteria:**
- [ ] `npm run build` produces optimized dist/ directory
- [ ] dist/index.html contains React app
- [ ] All assets (CSS, JS, images) included
- [ ] Deployed to GitHub Pages: zahzr.github.io/RSDailies
- [ ] App loads and functions at https://zahzr.github.io/RSDailies/
- [ ] localStorage persists across page reload
**Estimated time:** ~20 min  
**Commit message:** `build: deploy react version to github pages`

---

#### Task 31: Deploy Vanilla Fallback & Service Worker
**Files:** `dist/fallback.html`, `dist/service-worker.js`  
**What:** Deploy fallback and service worker alongside React  
**Why:** Enable graceful degradation  
**Test first:** `npm run build` includes both files  
**Acceptance criteria:**
- [ ] dist/fallback.html deployable and functional
- [ ] dist/service-worker.js registered on app load
- [ ] Test React failure: service worker serves fallback
- [ ] Fallback app works without errors
- [ ] Backwards compatibility verified (old browsers can use fallback)
**Estimated time:** ~15 min  
**Commit message:** `build: deploy vanilla fallback with service worker`

---

#### Task 32: Documentation & README Update
**Files:** `README.md`, architecture docs  
**What:** Update README with new structure, setup instructions, deployment guide  
**Why:** Help future contributors understand the project  
**Test first:** README renders correctly on GitHub  
**Acceptance criteria:**
- [ ] README explains dual-track architecture (React + vanilla)
- [ ] Dev setup instructions (npm install, npm run dev, npm test)
- [ ] Build & deployment steps documented
- [ ] Architecture diagram (Mermaid) included
- [ ] New contributor guide (where to make changes)
- [ ] Known limitations (Phase 2 Supabase, Discord bot)
**Estimated time:** ~20 min  
**Commit message:** `docs: update readme with architecture and setup guide`

---

## 4. Success Checklist

Upon completion, verify:

- ✅ All 32 tasks completed and committed
- ✅ All tests passing (`npm test`)
- ✅ React version deployed to https://zahzr.github.io/RSDailies/
- ✅ Vanilla fallback functional at /fallback.html
- ✅ Service worker detects React failure and serves fallback
- ✅ All existing features preserved:
  - ✅ Multi-profile support
  - ✅ Drag-drop reordering
  - ✅ Profit calculations
  - ✅ Countdown timers
  - ✅ Task hiding/showing
  - ✅ Import/export tokens
  - ✅ Split/combined table modes
  - ✅ Compact/default layouts
- ✅ Web Notifications working
- ✅ Discord skeleton hooks in place
- ✅ Storage abstraction ready for Phase 2 (Supabase)
- ✅ TypeScript strict mode enabled, no errors
- ✅ Git history clean with descriptive commits

---

## 5. Timeline Estimates

- **Phase 0 (Setup):** 40 min → 4 tasks
- **Phase 1 (Engine):** 2.5 hours → 8 tasks
- **Phase 2 (React):** 4 hours → 10 tasks
- **Phase 3 (Fallback):** 1.5 hours → 3 tasks
- **Phase 4 (Testing):** 2.5 hours → 5 tasks
- **Phase 5 (Deploy):** 1 hour → 2 tasks

**Total: ~12 hours of focused coding**

---

## 6. Risk Mitigation & Notes

| Risk | Mitigation |
|------|-----------|
| localStorage keys break existing users | Maintain exact key format from spec; tests verify compatibility |
| React bundle too large | Tree-shake, code-split components, ship fallback for slow networks |
| Performance regression | Profile build, lazy-load components, benchmark against vanilla |
| Browser compatibility | Vanilla fallback provides IE11 support |

---

**END OF IMPLEMENTATION PLAN**

Ready to execute: Start with Task 1.
