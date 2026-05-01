# Dailyscape Agent Rules

## Table Of Contents
1. Project Intent
2. Repo-Native SSoT Protocol
3. Canonical Owners
4. Shell And Tracker Boundaries
5. Registry And Content Rules
6. Header And Section Rules
7. Row Composition Rules
8. Panel-Control Rules
9. Tracker Geometry Rules
10. Completed-Task State Rules
11. Responsive Rules
12. Asset And Icon Rules
13. Figma-to-Code Workflow
14. Verification Requirements
15. Change Guardrails

## Project Intent
- Preserve the content-authored tracker architecture.
- Keep RS3 as the content-rich implementation while the shell, registry, and runtime stay game-aware.
- Prefer thinning existing facades over adding parallel implementations.
- Optimize for predictable AI-assisted iteration: one owner per concept, stable contracts, token reuse, and testable rendering behavior.

## Repo-Native SSoT Protocol
- Every concept must have one authoritative owner.
- Ownership depends on concept type:
  - visual values: tokens
  - DOM skeletons: shared primitives/templates
  - feature behavior: feature-domain logic/controllers
  - authored game/page/section/task content: `src/content/`
  - page/section routing and visibility: registries/runtime orchestration
- Stable facade files are allowed when they protect topology, discoverability, or audit expectations.
- Duplicate active behavior implementations are forbidden.
- If a concept already has an owner, extend that owner instead of adding a side path.

## Canonical Owners
- App shell HTML entrypoint: `src/ui/app-shell/html/index.html`
- Global UI tokens: `src/ui/styles/tokens/tokens.css`
- Global foundations: `src/ui/styles/foundations/base.css`, `src/ui/styles/foundations/states.css`
- Shell layout chrome: `src/ui/app-shell/styles/layout.css`, `controls.css`, `responsive.css`
- Shared panel/control helpers: `src/core/dom/controls.js`, `src/core/dom/panel-controls.js`
- Shared header primitives: `src/ui/components/headers/*`
- Shared row template flow: `src/ui/components/tracker/rows/*`
- Tracker table geometry and subgroup visuals: `src/ui/components/tracker/tables/styles/table.css`
- Authored game/page/section/task content: `src/content/`
- Content validation and selection: `src/core/domain/content/*`
- Game-aware registry resolution: `src/app/registries/unified-registry.js`
- Runtime orchestration: `src/app/runtime/*`
- Feature behavior and storage rules: `src/features/*`

## Shell And Tracker Boundaries
- `layout.css` owns page/container spacing and outer shell chrome only.
- `table.css` owns tracker row geometry, subgroup gaps, checkbox border, and terminal-row rounding.
- `header.styles.css` owns generic header primitives only.
- Tracker-specific subgroup visuals must live with tracker styles, not shell/header primitives.
- Do not move tracker geometry into shell CSS to solve a local visual problem.
- Do not add tracker behavior to shell renderers when a tracker renderer or helper can own it directly.

## Registry And Content Rules
- Keep pages and sections authored in `src/content/`.
- Do not hardcode RS3-only registry filtering in runtime registry or content resolution files.
- Game-aware lookup belongs in `src/app/registries/unified-registry.js` and `src/app/runtime/`.
- Page-mode storage must be scoped by game when behavior differs by game.
- Default page-mode recovery must resolve through registry definitions, not string literals scattered through the shell.
- OSRS must use the same shell/workspace system as RS3, even when its content is intentionally blank.

## Header And Section Rules
- Use `buildSectionPanelHtml` and `renderSectionPanelHeader` for shell section headers.
- Use `createTableSectionHeader` for tracker subgroup headers.
- `src/ui/components/headers/header.frame.js` is the shared header-frame owner for shell and tracker header markup.
- Keep the section engine block contract explicit:
  - row block: `{ id, kind: 'rows', tasks }`
  - subgroup block: `{ id, kind: 'subgroup', title, tasks, headerMode: 'default' | 'attached', rightText?, onResetClick?, restoreOptions?, onRestoreSelect? }`
- `subgroup-attached-header` is the only supported attached-header hook.
- Attached subgroup headers:
  - must not create a top gap
  - must preserve the internal gap below the header before child rows
  - must not force curvature onto the row above
- Tracker render-variant dispatch belongs in `src/ui/renderers/tracker-section-renderer.js` through the renderer map, not a growing switch tree.

## Row Composition Rules
- Keep the audit-facing row facade files stable.
- The shared row flow is:
  - row shell/template hydration
  - content population
  - action/control attachment
  - status/toggle behavior
  - custom-task/timer augmentation
  - overview-mode adjustments
- If row behavior changes, modify the shared row flow before adding a special-case renderer branch.
- Parent/subparent surfaces must stay thin and route through shared subgroup/row behavior.

## Panel-Control Rules
- Views, Profiles, and Settings must share the same floating-panel toggle lifecycle through `src/core/dom/panel-controls.js`.
- Button replacement and panel open-state behavior should not be re-implemented per feature.
- Surface-specific work is allowed for:
  - pre-open hydration
  - list/form rendering
  - action commit behavior
- Import/export may keep modal-specific logic, but button handling and shell wiring should still reuse shared control helpers where practical.

## Tracker Geometry Rules
- Always use tokens for tracker geometry.
- Required tracker tokens:
  - `--ds-section-gap`
  - `--ds-row-height`
  - `--ds-rounding-radius`
  - `--ds-checkbox-border`
- Never hardcode tracker gap, row-height, or rounding values in component CSS or JS.
- The canonical tracker row height is `var(--ds-row-height)`.
- The canonical subgroup gap is `var(--ds-section-gap)`.
- Terminal row rounding must use semantic classes such as `block-end-row`, not positional selectors.
- When a row or subgroup is hidden via task state, rounding must move to the next visible terminal surface automatically.

## Completed-Task State Rules
- The current tracker state model is string-based.
- Valid row states include:
  - `'true'`
  - `'false'`
  - `'hide'`
  - `'idle'`
  - `'running'`
  - `'ready'`
- Row rendering and terminal-row calculation must key off `dataset.completed`.
- New/default behavior is hide-on-complete:
  - `showCompletedTasks: false` for new settings
  - if enabled, completed rows remain visible and green
- Preserve explicit stored user preferences; do not silently overwrite saved settings.

## Responsive Rules
- Responsive styles may adjust widths, typography, and shell control layout.
- Responsive styles must not hardcode alternate tracker geometry that conflicts with tracker tokens.
- If mobile needs a geometry change, introduce or reuse a token instead of patching row height directly in `responsive.css`.

## Asset And Icon Rules
- Reuse existing assets from `assets/`.
- Do not introduce new icon packages for tracker/header controls.
- Prefer existing glyph/text button conventions unless a broader design-system change is being made intentionally.

## Figma-to-Code Workflow
- Analyze the codebase before implementing any Figma-derived change.
- Reuse existing tracker, header, row, panel, and shell primitives before creating new UI structures.
- Treat Figma output as design intent, not final code style.
- Map Figma spacing, rounding, and colors onto the tokens in `src/ui/styles/tokens/tokens.css`.
- Do not hardcode new tracker geometry values from a design file.
- If attached subgroup behavior or tracker section hierarchy appears in a design, implement it through the section engine contract rather than bespoke renderer conditionals.

## Verification Requirements
- Minimum required checks for shell/tracker UI changes:
  - `npm test`
  - `npm run audit`
  - `npm run build`
- For changes affecting tracker rendering, settings behavior, registries, or page modes, add or update Node tests for:
  - header markup expectations
  - settings normalization/defaults
  - terminal-row selection under hidden rows
  - attached subgroup header behavior where applicable
  - game-aware registry resolution
  - page-mode normalization/storage across games
  - render-variant map coverage
  - panel-control lifecycle behavior
- For visual shell or tracker changes, verify RS3 and OSRS workspaces manually or through browser inspection.

## Change Guardrails
- Prefer extending current primitives over introducing parallel implementations.
- Do not revert unrelated user changes in a dirty worktree.
- Do not add new hardcoded tracker geometry values.
- Do not couple shell layout code to tracker row internals.
- If a visual fix requires cross-layer ownership changes, fix the ownership boundary first and the styling second.
- Purge or archive only files that create duplicate active owners or obsolete runtime paths. Do not delete reference material solely for aesthetics.
