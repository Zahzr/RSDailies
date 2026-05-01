# Dailyscape Agent Rules

## Table Of Contents
1. Project Intent
2. Source Of Truth
3. Ownership Boundaries
4. Tracker Geometry Rules
5. Header And Section Rules
6. Completed-Task State Rules
7. Responsive Rules
8. Asset And Icon Rules
9. Figma-to-Code Workflow
10. Verification Requirements
11. Change Guardrails

## Project Intent
- Preserve the configuration-first RS3 tracker architecture.
- Prefer extending canonical registries, content definitions, and shared primitives over adding one-off UI paths.
- Optimize for predictable behavior under AI-assisted iteration: explicit boundaries, token reuse, stable contracts, and testable rendering rules.

## Source Of Truth
- App shell HTML entrypoint: `src/ui/app-shell/html/index.html`
- Global UI tokens: `src/ui/styles/tokens/tokens.css`
- Global foundations: `src/ui/styles/foundations/base.css`, `src/ui/styles/foundations/states.css`
- Shell layout chrome: `src/ui/app-shell/styles/layout.css`, `controls.css`, `responsive.css`
- Tracker table geometry and subgroup visuals: `src/ui/components/tracker/tables/styles/table.css`
- Shared header primitives: `src/ui/components/headers/*`
- Tracker section renderers: `src/ui/components/tracker/sections/renderers/*`
- Settings defaults and normalization: `src/features/settings/config/settings-defaults.js`, `src/features/settings/domain/state.js`

## Ownership Boundaries
- `layout.css` owns page/container spacing and outer shell chrome only.
- `table.css` owns tracker row geometry, subgroup gaps, checkbox border, and terminal-row rounding.
- `header.styles.css` owns generic header primitives only.
- Tracker-specific subgroup visuals must live with tracker styles, not shell/header primitives.
- Do not move tracker geometry into shell CSS to solve a local visual problem.
- Do not add tracker behavior to shell renderers when a tracker renderer or helper can own it directly.

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

## Header And Section Rules
- Use `buildSectionPanelHtml` and `renderSectionPanelHeader` for shell section headers.
- Use `createTableSectionHeader` for tracker subgroup headers.
- Keep the section engine block contract explicit:
  - row block: `{ id, kind: 'rows', tasks }`
  - subgroup block: `{ id, kind: 'subgroup', title, tasks, headerMode: 'default' | 'attached', rightText?, onResetClick?, restoreOptions?, onRestoreSelect? }`
- `subgroup-attached-header` is the only supported attached-header hook.
- Attached subgroup headers:
  - must not create a top gap,
  - must preserve the internal gap below the header before child rows,
  - must not force curvature onto the row above.
- Do not reintroduce half-configured flags like `attached-header`, `hasGapBelow`, or renderer-specific gap hacks.

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
- Reuse existing tracker, header, row, and shell primitives before creating new UI structures.
- Treat Figma output as design intent, not final code style.
- Map Figma spacing, rounding, and colors onto the tokens in `src/ui/styles/tokens/tokens.css`.
- Do not hardcode new tracker geometry values from a design file.
- If attached subgroup behavior or tracker section hierarchy appears in a design, implement it through the section engine contract rather than bespoke renderer conditionals.

## Verification Requirements
- Minimum required checks for tracker UI changes:
  - `npm test`
  - `npm run audit`
  - `npm run build`
- For changes affecting tracker rendering or settings behavior, add or update Node tests for:
  - header markup expectations,
  - settings normalization/defaults,
  - terminal-row selection under hidden rows,
  - attached subgroup header behavior where applicable.
- For visual tracker changes, verify Dailies, Weeklies, and Gathering manually or through browser inspection.

## Change Guardrails
- Prefer extending current primitives over introducing parallel implementations.
- Do not revert unrelated user changes in a dirty worktree.
- Do not add new hardcoded tracker geometry values.
- Do not couple shell layout code to tracker row internals.
- If a visual fix requires cross-layer ownership changes, fix the ownership boundary first and the styling second.
