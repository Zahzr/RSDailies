# GitHub(s) and Websites

## My GitHub

https://github.com/rsdailies/RSDailies

## My Website

https://rsdailies.github.io/RSDailies/#custom-tasks

## Original/Cloned GitHub

https://github.com/dailyscape/dailyscape.github.io

## Original/Cloned Website

https://dailyscape.github.io

---

Below is the strict handoff guide for your coder.
I re-stabilized this against the current path you chose in chat: keep the static DailyScape-style architecture, keep the theme, keep the right-side utility buttons, keep the newer compact “Overview / All” style direction, and improve it instead of rewriting it. The original DailyScape repo is still a static site with no build step, centered on red/green right-column interactions, countdowns, localStorage persistence, drag-and-drop ordering, compact mode, and hide/show behavior, so that remains the baseline you should mirror where appropriate. (GitHub) The RuneScape Wiki’s API docs confirm Weird Gloop-backed endpoints are available for GE prices/history, Voice of Seren, Travelling Merchant stock, and news, which makes them good optional helper integrations later, not core dependencies. (RuneScape Wiki) For Penguins, the wiki says the activity involves 12 penguins weekly plus a Polar Bear, and the spawn-location content includes hint-style guidance; the spawn-location page also notes collaboration with the World60Pengs community, so that source is appropriate as an optional helper feed, not a hard dependency. (RuneScape Wiki) If you want the site at rsdailies.github.io, GitHub’s docs say the repository must be owned by the target user or organization and must be named exactly <user>.github.io or <organization>.github.io. (GitHub Docs)

Non-negotiable rules
Do not rewrite this into React, Vite, Tailwind, Next, or a backend app.
Do not abandon the current theme.
Do not turn the UI into cards.
Do not break the original “left info / right interaction” visual language.
Do not keep timers or floating checkbox text inside the wrong area.
Do not reintroduce top tabs for section navigation once the new compact page-switcher is in.
Do not make external APIs required for the app to function.
Do not hardcode dynamic weekly penguin results into static config forever.
Do not ship more behavior changes without verifying index.html, dailyscape.css, dailyscape.js, and the current live page together.
Keep everything static-site compatible.
The four references the coder must compare every time
Your coder must open and compare these four references before touching layout behavior:

your current repo
your current live site
original DailyScape repo
original DailyScape live behavior
The purpose is not to clone blindly. It is to preserve the original interaction model while applying your intentional divergences.

Current intentional divergences that must be preserved
These are not regressions. They are intentional:

compact Overview/All-style shell direction
right-side utility buttons stay
top section tabs can be removed later
menu-button-based page switching is preferred
Farming is not flat; it is parent headers with child rows
Penguins need child rows and notes
child rows should render name/content on the right side
cooldown buttons should be removed from visible UI
timer rows should vanish while active and return when ready
Overview should be empty until the user explicitly selects items into it
row/header height should be denser than original
Master execution order
Do these in this order.
Step 0: Freeze and verify baseline before changing anything
Goal
Make sure the coder is changing the real current state, not an older mental model.

Files
index.html
dailyscape.css
dailyscape.js
tasks-config.js
farming-config.js
Required checks
open browser console
verify there are no syntax errors
verify current screenshot issues still match expectations
verify current menu button and Overview/All shell exist
verify the latest dailyscape.js already includes tooltip plumbing, farming header rows, and current penguin helper merge path
Deliverable
A short baseline note saved in the PR/commit description:

what currently works
what is still broken
what this pass will and will not touch
Step 1: Replace the top tabs with the new compact page-switch system
Goal
Move away from Custom Tasks / Farming / Dailies / Gathering / Weeklies / Monthlies top nav tabs.
Keep:

More Resources dropdown
right-side utility buttons
Use:

the existing menu/hamburger button style as the page switcher
New model
There should be a single “view selector” control using the menu button style.
Pages/views:

Overview
All
Custom Tasks
Farming
Dailies
Gathering
Weeklies
Monthlies
Behavior
Overview = only overview panel
All = current stacked page
section page = only that section + overview panel if desired
More Resources remains top nav
right-side utility buttons remain unchanged
Files
index.html
dailyscape.js
dailyscape.css
Short-form code instructions
Find the current top nav section links block in index.html.
Replace the separate section links with a single dropdown/menu control.
Find:

<ul class="navbar-nav mr-auto">
  ...
  <a href="#custom-tasks" ...
  <a href="#farming" ...
  ...
</ul>
Change to:

<ul class="navbar-nav mr-auto">
  <li class="nav-item dropdown">
    <a class="nav-link expanding_button" href="#" id="page-menu-button" title="Pages">
      ☰<span class="expanding_text">&nbsp;Pages</span>
    </a>
    <div id="page-menu-control" class="dropdown-menu-like" data-display="none">
      <!-- Overview / All / Custom / Farming / Dailies / Gathering / Weeklies / Monthlies -->
    </div>
  </li>

  <li class="nav-item dropdown">
    <!-- More Resources stays -->
  </li>
</ul>
In dailyscape.js, add page-mode state:
Find:

function getViewMode() {
  return load('viewMode', 'all');
}
Expand it to support:

overview
all
custom
farming
dailies
gathering
weeklies
monthlies
Add helper:

function getPageMode() {
  return load('pageMode', 'all');
}

function setPageMode(mode) {
  const allowed = ['overview', 'all', 'custom', 'farming', 'dailies', 'gathering', 'weeklies', 'monthlies'];
  save('pageMode', allowed.includes(mode) ? mode : 'all');
}
In renderApp(), gate section rendering by page mode.
Step 2: Make Overview actually good
Goal
Overview should not be an ugly placeholder. It should become a compact “Top 5 upcoming” board.

Rules
show nothing by default until user explicitly marks items for Overview
show top 5 only
show timer/due info
show one note line if present
show a clean compact row layout
do not dump all tasks into Overview
do not automatically fill Overview from every incomplete row
Data model additions
Add task flags:

showInOverview
pinnedToOverview
maybe overviewPriority
Files
tasks-config.js
dailyscape.js
dailyscape.css
Short-form code instructions
Find:

function collectOverviewItems() {
  return [];
}
Replace with logic that:

scans all sections
includes only tasks where showInOverview === true
sorts by next due time / active timer readiness
returns 5 items max
Structure:

function collectOverviewItems(sections) {
  const items = [];
  // only include tasks explicitly opted in
  // farming timers included only if opted in or active
  // sort ascending by due timestamp
  return items.slice(0, 5);
}
Update renderOverviewPanel() so rows render as:

title
due/timer line
optional note
optional source badge (Daily / Weekly / Farming / Custom)
CSS target
Make Overview rows look like compact section rows, not plain stacked text blocks.
Step 3: Fix the right-column layout parity issues still left
Goal
Mirror the original DailyScape row behavior more closely without losing your intended custom layout.

What is still wrong
some checkbox text alignment still feels detached
the white text and row wrapping still drift from the original
child rows and subgroup rows are better now, but still need polish
there are still places where the right-hand content feels like a box pasted on top instead of a native row
Files
dailyscape.css
dailyscape.js
Required rule
Do not redesign. Compare directly with the original DailyScape behavior and fix the spacing/flow.

Short-form code instructions
In CSS, compare and tune:

.activity_table td.activity_color
.activity_desc
.activity_note_line
.activity_table td.activity_name a
subgroup/header-like rows
Likely fix block:

.activity_table td.activity_color {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.activity_desc {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
In JS, if floating checkbox persists, wrap right-side content in a dedicated inner container:

const rightWrap = document.createElement('div');
rightWrap.className = 'activity_right_inner';
rightWrap.appendChild(checkOff);
rightWrap.appendChild(checkOn);
rightWrap.appendChild(desc);
colorCell.innerHTML = '';
colorCell.appendChild(rightWrap);
Step 4: Finalize farming as parent-header timers with child rows only
Goal
Keep the direction you wanted and remove all remaining redundancy.

Final farming rules
no redundant “Herb Timers” click row under a “HERB” header
the header itself owns the timer
child rows are the usable checklist rows
child rows render name on right side
left side is blacked out and inert for child rows
subgroup headers for Trees/Specialty must collapse independently
Files
farming-config.js
dailyscape.js
dailyscape.css
Short-form code instructions
Find in renderGroupedFarming() any place where a separate parent task row is still inserted beneath the parent header.
The target is:

HERB header row with right-side timer state
PLOTS / LOCATIONS subgroup row
child rows only
No additional “Herb Timers” row.
If any remaining code builds a “timer row” beneath HERB, remove that row and put its click behavior into the header row’s right cell.
Step 5: Make timer rows vanish and return correctly
Goal
This is one of your highest-priority behavior requests.

Required behavior
For timer-based rows:

red = ready to start / not running
clicking starts timer
row vanishes while timer active
row returns when timer expires
For farming parent headers:

parent header stays visible
header timer state updates
child rows may remain visible or collapse by preference
the actual “run item” should not remain as a redundant visible row
For generic cooldown-style tasks:

if kept, they should also vanish while timer active and return when done
do not show button clutter
Files
dailyscape.js
Short-form code instructions
Find:

if (task.cooldownMinutes && !task.isChildRow) {
  ...
}
Keep the hidden-on-active behavior, but remove any UI remnants that still imply button-based cooldown workflow.
Use:

if (task.cooldownMinutes) {
  startCooldown(taskId, task.cooldownMinutes);
  setTaskCompleted(sectionKey, taskId, true);
  renderApp();
  return;
}
And in getTaskState():

if (task?.cooldownMinutes) {
  const cooldown = getCooldowns()[taskId];
  if (cooldown && cooldown.readyAt > Date.now()) return 'hide';
}
This is the correct vanish/return mechanism for non-farming timer rows.
Step 6: Finish penguin structure properly
Goal
Penguins should become a real weekly module, not just placeholder child rows.

Facts to respect
The activity revolves around 12 penguins weekly plus a Polar Bear, and the spawn-location references include hint/area guidance. (RuneScape Wiki)

Desired structure
Penguins
Penguin 1 … Penguin 12
Polar Bear
optional Shadow Realm row later
each child row can show:
current location
disguise
hint/area note
manual checkbox
Files
tasks-config.js
dailyscape.js
new helper script later
Short-form code instructions
Keep tasks-config.js as the static fallback.
Add a new file later:

penguin-helper.js
Purpose:

fetch or ingest weekly penguin data
merge into localStorage
leave fallback rows intact if helper fails
Helper merge shape:

{
  "penguin-1": { "name": "Penguin 1 - Al Kharid", "note": "Cactus, north of Shantay Pass hint..." },
  ...
}
Use mergePenguinChildRows() as the merge point.

Important rule
Do not make the page depend on the helper site. The World60Pengs site is useful as a helper reference, not a guaranteed primary source. (jq.world60pengs.com)
Step 7: Replace hover title with polished tooltip-only behavior everywhere
Goal
You already moved toward this. Finish it cleanly.

Required behavior
custom tooltip for rows and row names
support multi-line notes
work for child rows and parent rows
no native browser title tooltip overlap
Files
dailyscape.js
dailyscape.css
Short-form code instructions
Find any remaining direct title= writes and remove them in favor of attachTooltip().
Add CSS for tooltip:

#tooltip {
  position: absolute;
  z-index: 9999;
  max-width: 320px;
  background: #121212;
  color: #fff;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 8px 10px;
  white-space: pre-line;
  font-size: 0.85rem;
  line-height: 1.2rem;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  pointer-events: none;
}
Step 8: Restructure the codebase into a template-first static architecture
Goal
Make this easier to expand without breaking existing behavior every time.

New file architecture target
Still static. Still no build step. But split responsibilities.
Suggested target:

index.html
dailyscape.css
scripts/app-state.js
scripts/render-core.js
scripts/render-farming.js
scripts/render-overview.js
scripts/render-weeklies.js
scripts/tooltip.js
scripts/profiles.js
scripts/settings.js
scripts/import-export.js
scripts/reset-logic.js
scripts/penguin-helper.js
config/tasks-config.js
config/farming-config.js
config/templates-config.js
Why
Your current single-file JS approach is already getting too large and fragile.

Restraint
Still load them with multiple <script> tags. No bundler required.
Step 9: Make the config schema actually template-friendly
Goal
Rows, headers, subheaders, child rows, notes, overview inclusion, and helper scripts should be data-driven.

New schema pattern
Instead of only:

{ id, name, wiki, note, reset }
Move toward:

{
  id,
  type: 'task' | 'group' | 'child' | 'helper',
  name,
  wiki,
  note,
  reset,
  alertDaysBeforeReset,
  showInOverview,
  cooldownMinutes,
  children: [],
  helper: null,
  tags: [],
  templateKey: null
}
Files
tasks-config.js
farming-config.js
new templates-config.js
Why
You asked for a more templated file form with syntax and variables that make expansion easy.
Step 10: Add templates properly
Goal
Support one-click setup for playstyles and routes.

Minimum initial templates
Ironman essentials
Shop run route
Farming only
D&D heavy
Bossing upkeep
Casual weeklys
Completionist light
Skillers
Fort / Um upkeep
Merchant / utility checker
Implementation
Create templates-config.js:

window.TEMPLATES_CONFIG = {
  ironman_essentials: {
    name: 'Ironman Essentials',
    enableTasks: [...],
    enableOverview: [...],
    notes: {...}
  }
};
Then add a template loader in Settings or Profiles.
Step 11: Add helper-script imports cleanly
Goal
Support future scripts like penguin sync without hacking them into the main renderer.

Pattern
Each helper script should:

fetch external data if available
normalize the data
save to localStorage
trigger re-render
fail silently without breaking app
Files
new scripts/penguin-helper.js
future scripts/merchant-helper.js
future scripts/vos-helper.js
Helper contract
window.RSDHelpers = {
  refreshPenguins: async function () { ... }
};
Step 12: Make Overview / All / Section pages use one unified shell
Goal
You liked the compact style. Lean into it.

Final shell concept
one compact page shell
page selector via menu button
top utility buttons stay
More Resources stays
same styled container for Overview, All, and single-section pages
Why
This is the best path forward that respects your requests without changing theme.
Step 13: Improve section density without hurting clarity
Goal
Shrink page length a bit more while keeping legibility.

Files
dailyscape.css
Short-form code instructions
Tune:

.activity_table td.activity_name
.activity_table td.activity_color
.header_like_name .header_like_text
.activity_note_line
.overview_row
Reduce padding by roughly another 6–10%, not more.
Step 14: Add real manual penguin updater UI before automation
Goal
Do not wait for automation to make Penguins useful.

UI idea
In Settings or a helper panel:

“Paste this week’s penguin data”
or edit current penguin child rows inline
Why
Manual override gives you utility immediately, while the helper script is still being built.
Step 15: Add “show in overview” to rows
Goal
Nothing should appear in Overview until selected.

Required UI
A small button on the left side of the remove-row button, as you requested.

Behavior
toggles showInOverview
no task appears in Overview unless enabled
task remains in its home section normally
Files
dailyscape.js
dailyscape.css
Short-form code instructions
In row creation:

const overviewBtn = document.createElement('button');
overviewBtn.className = 'overview-pin-btn btn btn-secondary btn-sm';
overviewBtn.textContent = '★';
Store per-task:

save(`overview:${sectionKey}`, {...});
Step 16: Add optional 2-column layout for child-row-heavy sections only
Goal
You asked if a 2-column/row style could look cleaner.

Recommendation
Do not make everything 2-column globally yet.
Do it selectively for:
penguin child rows
farming child rows
maybe overview rows later
Why
Global 2-column conversion risks breaking parity and readability.
Step 17: Get rsdailies.github.io properly
Goal
Move from project-page style to organization/user-page style if desired.

Official requirement
The repository must be owned by the target account/org and named exactly rsdailies.github.io. (GitHub Docs)

Correct paths
If using personal/project page:

https://zahzr.github.io/RSDailies/
If using org/user page:

owner must be rsdailies
repo must be rsdailies.github.io
site publishes at https://rsdailies.github.io/
Migration plan
create org rsdailies if not already created
create repo rsdailies.github.io
copy site files there
enable Pages on main / root
verify index.html exists at repo root
push site files
wait for deployment
optionally archive or redirect project-page repo
Exact “find this / change this” task blocks
Block A — replace top tabs with page menu
Find the left-side nav section links in index.html and replace them with a single Pages menu control.

Block B — add pageMode
In dailyscape.js, add:

function getPageMode() {
  return load('pageMode', 'all');
}

function setPageMode(mode) {
  const allowed = ['overview', 'all', 'custom', 'farming', 'dailies', 'gathering', 'weeklies', 'monthlies'];
  save('pageMode', allowed.includes(mode) ? mode : 'all');
}
Block C — gate rendering by page mode
In renderApp(), wrap section renders so only the selected page view renders.

Block D — replace empty overview collector
Find:

function collectOverviewItems() {
  return [];
}
Change to a collector that only returns opted-in tasks and slices to 5.

Block E — add showInOverview
In configs and custom task creation, add showInOverview: false.

Block F — add per-row overview toggle button
In row creation, insert a button before hide/delete controls.

Block G — finish tooltip-only behavior
Remove remaining native title usage and standardize on attachTooltip() + #tooltip.

Block H — move child-row name fully to right-side renderer
Keep left side black/inert for child rows and right-side title+note stack.

Block I — split JS files
Create /scripts/*.js modules and move code out of monolithic dailyscape.js by responsibility.

Block J — add templates-config.js
Create a template registry file and wire a loader in Settings/Profile.

Block K — add penguin-helper.js
Create helper contract:

window.RSDHelpers = {
  refreshPenguins: async function () { ... }
};
Block L — add manual penguin updater fallback
Add a settings/import textarea or JSON editor for weekly penguin data.
QA checklist for the coder
Structure
Overview/All/Section page switching works
top section tabs are gone
More Resources still works
right-side utility buttons still work
Overview
shows nothing until rows are opted in
shows max 5 rows
rows look clean
note and due data render cleanly
no placeholder ugliness
Farming
no redundant timer row under HERB / ALLOTMENT / HOPS
header owns timer
child rows are right-side checklist rows
child rows left side is blacked out
collapse buttons work for group and subgroup levels
running timer rows vanish and return correctly where intended
Penguins
parent row exists
child rows render
notes display
collapse works
helper merge path works even if no live sync exists
Layout
right-column wrapping is clean
checkbox no longer floats awkwardly
section headers are denser
subgroup rows are consistent
compact mode still works
Behavior
hide/show hidden still works
reset buttons still work
profiles still work
import/export still works
custom tasks still work
Hosting
project page still works
org/user page migration instructions are correct
no build step introduced
120 additional ideas
per-row overview pin
per-row overview priority
per-profile overview presets
overview badges by source
overview sort by due time
overview sort by reset type
overview hide completed toggle
overview farming-only filter
overview D&D-only filter
overview show notes inline toggle
overview compact cards disabled by default
overview mini timer chips
profile-specific task packs
profile-specific farming routes
profile-specific penguin notes
shared profile export
JSON backup download
JSON backup upload
import validation preview
config schema versioning
migration helper for old storage keys
“reset layout” button
“reset all hidden rows” button
“clear all timers” button
per-section default collapsed state
per-section remember collapse state
child-row remember collapse state
hover tooltip delay
pinned notes on click
note expand/collapse on rows
wiki quick-open icon only on hover
external-link button style parity
task tags
filter by tag
search rows
search child rows
search notes
route templates
Ironman template
main-account template
skiller template
D&D-heavy template
farming-only template
shop-run template
boss upkeep template
fort-forinthry template
city-of-um template
quest-lock awareness tags
level-requirement note fields
optional profit-only view
optional utility-only view
optional XP-only view
optional account-goal packs
task prerequisites field
task unlock notes
task location field
task route group field
route sequence numbering
manual sort within child rows
duplicate task detection
broken link checker
wiki link health checker
task schema linter script
farming schema linter script
template schema linter script
per-task icon support
disguise icon support for penguins
per-task difficulty flag
per-task category color accents
per-task “worth doing late” flag
delay-aware alert copy
“1 day early” presets
“2 days early” presets
monthly-value reminder presets
merchant helper module
VOS helper module
GE price helper module
Rune Goldberg helper later
flash event helper later
penguin helper importer
penguin helper manual paste importer
penguin hint autofill fields
polar bear separate helper
shadow realm toggle row
world60pengs manual sync button
last sync timestamp display
stale helper data warning
helper failure silent fallback
helper caching
helper refresh cooldown
data provenance labels
“official/wiki/community” source badges
optional browser sound alert
optional discord bot bridge later
webhook info help text
IndexedDB migration later
external sync later
public shared preset gallery later
in-app template picker
in-app template diff preview
child-row bulk check
child-row bulk uncheck
“complete route” button
farming run complete button
herb route checklist ordering UI
import/export farming route presets
multi-account template packs
compact mobile-first child row mode
desktop split-panel mode later
onboarding wizard
first-run setup wizard
“recommended tasks” suggestions
release notes panel
changelog modal
README auto-generated from config
issue-report link in footer
debug mode toggle
localStorage inspector panel
performance telemetry debug only
script registry for helper modules
Recommended refactor target
Do this after the page-switch and overview work:

Phase 1 split
scripts/state.js
scripts/render-main.js
scripts/render-farming.js
scripts/render-weeklies.js
scripts/render-overview.js
scripts/tooltip.js
Phase 2 split
scripts/helpers/penguins.js
scripts/helpers/wiki.js
scripts/helpers/weirdgloop.js
Phase 3 config split
config/tasks-config.js
config/farming-config.js
config/templates-config.js
config/routes-config.js
This keeps the current static model intact while making the app much safer to expand.
If you want, I can turn this next into a coder-facing checklist formatted exactly as “Task / Files / Find / Replace / Test” so it can be followed linearly.

- I updated the latest prompt (dailyscape.js) and git pushed. From this point on with our planning, please provide me a strict handoff guide, step by step, covering everything we're needing to still cover with detail, metadata, code, context, all detail, what to do, how, where, why, everything. I want to hand this off to my coder now. Give the fixes/blocks to change in short form where find this and change it to this block fix. Make sure to re-review the latest commit and changes to re-stabilize yourself. Audit our chat for anything missed in requests still, adhere to the things we did change or strayed from on purpose. Adhere to rules and restraints. Make these rules as well to review the specific 4 pages for copy/mirror as well as understanding where I'm at/have altered too. 
- Please include additional ideas (at least 100)
- We should optimize and improve, find ways to restructure it. Include ideas and suggestions to rewrite file(s) to achieve this.
- We want more of a templated file form and theme with syntax and variables able to easily expand, add rows, headers, everything start to finish to be able to configure things, as well as utilize and import scripts like the penguin helper script we will need to make and implement to scrape/update/automatically fix the page to match among many other scripts and things we may need to make. 
- Looking at my web page again, I really like the Overview/All style template you did. Are we able to actually just merge each sectioned Custom Tasks/Farming/Dailies/Gathering inside their own button/page the same way as Overview/All 
- we can ultimately remove the header tabs off the top row Custom Tasks Farming Dailies Gathering Weeklies Monthlies since we have a more compacted view style and we can leave More Resources as the only thing left/how it is. 
- We can leave the buttons on the right side as well as they're amazing. 
- Change it from the Two buttons being visible like Overview/All and instead of adding all the others in this form, take the menu button we have in the header row, copy it, and use that to make an expandable row to select and switch. 

We do NOT want to deter from our current theme and style. We want to just IMPROVE it. Only thing we are changing is what is stated in this prompt to adhere to the new compacted template style we got from Overview / All. 

- We need to fix the Overview page to adhere to the restraitns and ideas we suggested. 
- It looks terrible in format first of all, needs massively improved.
- It should only display Top 5 coming up showing their timer, as well as notes etc in a clean row format
- None should appear prior to not selecting any off the new button we add to the left side of remove row button. 