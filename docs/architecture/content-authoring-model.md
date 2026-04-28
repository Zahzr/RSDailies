# Content Authoring Model

This document describes the current authoring model after the registry/content refactor pass.

## Source Of Truth

The tracker now has three primary authority layers:

- `src/content/`
  Page and section definitions.
- `src/app/registries/unified-registry.js`
  Canonical section and page-mode metadata for runtime navigation, shell rendering, and storage-aware UI behavior.
- `src/core/`
  Shared domain infrastructure such as content validation, content resolution, storage keys, migrations, and timer registry.

## Page Definitions

Current authored tracker pages live under:

- `src/content/games/rs3/pages/`
- `src/content/games/osrs/pages/`

Each page definition exports an object with:

- `id`
- `title`
- `game`
- `route`
- `layout`
- `legacyMode`
- `sections`

## Section Definitions

Each page contains section definitions. A section defines:

- `id`
- `label`
- `legacySectionId`
- `renderVariant`
- `items` or `groups`

Current render variants:

- `standard`
- `grouped-sections`
- `parent-children`
- `timer-groups`

## Runtime Resolution

Raw page definitions are loaded and validated by:

- `src/core/domain/content/load-content.js`
- `src/core/domain/content/validate-content.js`

Runtime hydration happens in:

- `src/core/domain/content/resolve-tracker-content.js`

That resolver is responsible for:

- hydrating custom tasks from storage
- merging penguin child-row overrides
- normalizing farming timer groups into renderer-ready structures

## Shell Rendering

The dashboard shell is now generated from registry metadata instead of the deleted static `dashboard.html` partial.

Shell generation lives in:

- `src/ui/app-shell/runtime/render-app-shell.js`
- `src/ui/app-shell/runtime/section-panel.js`

Section shell metadata currently lives in `unified-registry.js` under each section's `shell` field.

## Storage And Migration

Storage keys should be authored through:

- `src/core/storage/keys-builder.js`

Schema migration/versioning lives in:

- `src/core/storage/migrations.js`

Current guarantees:

- profile-local schema version stamping
- legacy `viewMode` to `pageMode` backfill
- versioned export payload metadata

## Timers

Shared timer definitions live in:

- `src/core/timers/timer-registry.js`

Current timer registry coverage is the farming timer set extracted from the existing farming config groups.

## Verification

Refactor gates currently run through:

- `npm test`
- `npm run test:e2e`
- `npm run audit`
- `npm run build`
- `npm run verify:full`

The audit suite currently validates:

- imports
- topology
- content page definitions
- timer definitions

The E2E suite currently validates:

- RS3 game-selection to tracker-shell flow
- page navigation between Tasks, Gathering, and Timers
- OSRS game-selection to empty-state shell flow
