# Reconciled Implementation Brief

This document consolidates the current workspace codebase, the local planning docs, the Copilot memory plans, and the external research notes into one implementation brief that can be used as the canonical guide for the refactor.

It is intentionally opinionated. Where the source plans disagree, this file resolves the disagreement so implementation can proceed without reopening the same design questions every pass.

---

## Purpose

The goal is still the same across all planning artifacts:

- rebuild Dailyscape into a universal, data-driven, hierarchical tracker system
- preserve current user-visible visuals and behavior during migration
- remove duplicated section registries, duplicated storage patterns, and feature-specific rendering branches
- make new pages, sections, tasks, and timers authorable from configuration instead of imperative wiring

This brief does not replace the original research or handoff documents as historical references. It replaces them as the working implementation guide.

---

## Source Set

This brief reconciles these sources:

- `handoff.md` in the repo
- `deep-research-report (2).md` in the repo
- `HANDOFF_REPORT.md` from Copilot workspace memory
- `final-comprehensive-plan.md` from Copilot workspace memory
- `unified-master-plan.md` from Copilot workspace memory
- `user-clarifications.md` from Copilot workspace memory
- `plan.md` from Copilot workspace memory
- the current repository implementation itself

---

## Decision Precedence

When sources disagree, use this order:

1. User clarifications and explicit current-turn user direction
2. This reconciled brief
3. `HANDOFF_REPORT.md` and `final-comprehensive-plan.md` for target-state shape
4. `plan.md` for safer sequencing and extraction strategy
5. `unified-master-plan.md` and `deep-research-report (2).md` for background and rationale
6. Existing repository structure only as the truth of current implementation, not as the target architecture

---

## Current Repo Reality

The current codebase is healthy enough to refactor incrementally:

- `npm run audit` passes
- `npm run build` passes
- the app is still a Vite app rooted at `src/ui/app-shell/html/index.html`
- tracker sections are still hardcoded in several places
- rendering still branches by feature family
- storage migration is not implemented yet
- import/export responsibilities are split across more than one layer
- some placeholder modules already exist and should not be multiplied

Important current hotspots:

- hardcoded section and mode identities:
  - `src/app/runtime/render-orchestrator.js`
  - `src/core/ids/section-ids.js`
  - `src/features/views/domain/model.js`
  - `src/features/views/domain/controller/panel.js`
  - `src/ui/components/overview/render/overview.dom.js`
  - `src/ui/components/tracker/rows/factory/helpers.js`
- section-specific shell markup:
  - `src/ui/app-shell/html/dashboard.html`
- missing migration/versioning:
  - `src/core/storage/migrations.js`
  - `src/features/profiles/domain/model.js`
- overlapping import/export setup:
  - `src/app/runtime/app-core/setup-controls.js`
  - `src/features/profiles/domain/controller.js`
  - `src/ui/components/import-export/controller/import-export-controller.js`
- architecture drift and placeholders:
  - `src/ui/components/views/views-menu.js`
  - `src/ui/components/settings/settings-menu.js`
  - `src/ui/app-shell/runtime/section-panel.js`
  - `src/ui/components/custom-tasks/modal/custom-task-modal.js`
  - `src/ui/app-shell/runtime/render-app-shell.js`

---

## Resolved Conflicts

### 1. Is planning complete or still open?

Resolution:

- planning is sufficiently complete to begin implementation
- implementation should still proceed in gated phases
- no more broad architectural replanning is needed before Phase 0

Reason:

- the Copilot memory docs disagree on status wording, but they agree on the destination
- the remaining uncertainty is execution sequencing, not target architecture

### 2. `.json` content documents or `.js` config files?

Resolution:

- human-authored page, section, task, and timer definitions should be `.js`
- JSON Schema files remain `.json`
- optional reusable static templates can remain `.json` where they are pure data

Reason:

- the user explicitly favored novice-friendly commented config files
- the later plans already drift back toward `.js` for authoring
- comments and executable helpers are useful during migration

Canonical rule:

- authoring format: `.js`
- validation contracts: `.json`
- import/export payloads: serialized data with explicit version metadata

### 3. Full `src/content` reset now, or incremental migration first?

Resolution:

- the target architecture includes `src/content`
- the migration order should follow the safer extraction-first path from the earlier `plan.md`
- do not physically move everything at once before registry and state consolidation exist

Reason:

- the destination is correct in the later handoff
- the earlier plan has the better execution order

### 4. "File structure = data hierarchy = visual hierarchy" as a hard rule?

Resolution:

- yes for authored content and hierarchy-specific assets
- no for all runtime/domain code

Meaning:

- content folders should mirror hierarchy
- renderer, storage, and domain code should stay organized by responsibility, not by copied visual nesting

### 5. Unlimited nesting vs named style levels

Resolution:

- the data model should support arbitrary depth
- the styling system should define named presets for `parent`, `sub1`, `sub2`, `sub3`, `sub4`, then fall back gracefully for deeper levels

### 6. One page per tracker area vs current page modes

Resolution:

- target state is page-driven
- current `pageMode` and view toggles remain a compatibility layer during migration
- do not break existing mode behavior until the page-based tracker replacement is ready

### 7. New test stack vs current repo state

Resolution:

- add test harnesses later in the refactor
- until then, build plus audits remain the minimum gate

---

## Canonical Target Architecture

These are now locked for implementation.

### 1. Single canonical registry

Create one unified registry that drives:

- pages
- routes
- sections
- labels
- navigation
- storage namespaces
- timer references
- visibility and ordering metadata

No more duplicated section arrays or label maps in multiple runtime and UI files.

### 2. Content-driven hierarchy

Hierarchy lives in data, not in renderer branches.

A page/section/task definition should declare:

- its identity
- where it sits in hierarchy
- what children it has
- what cadence or timer it uses
- what renderer variant it needs

### 3. Generic hierarchical renderer

The renderer should dispatch by hierarchy level and block variant, not by feature family.

Allowed concepts:

- page
- section
- hierarchy level
- item
- action
- timer variant

Disallowed target-state concepts:

- `if section is farming`
- `if section is gathering`
- `if weekly children need special path`

### 4. First-class timer registry

Timers become shared entities referenced by authored content.

Timer definitions should be centralized and reusable across:

- farming groups
- cooldown-style tasks
- future repeatables

### 5. Versioned storage and import/export

All durable data should become version-aware.

Must include:

- storage schema version
- migration entry point
- import/export payload version
- compatibility path for existing local data

### 6. Preserve visuals during migration

The refactor is architectural, not a redesign.

Allowed:

- moving styles into better ownership
- consolidating repeated inline styles into tokens/components
- adding hierarchy style presets

Not allowed:

- changing the visual product as part of this pass unless explicitly documented

---

## Canonical Directory Direction

Target direction:

```text
src/
  app/
  content/
  core/
  features/
  ui/
```

Meaning:

- `src/content/` becomes the source of truth for authored tracker structure
- `src/app/` owns boot, routing, registry initialization, composition
- `src/core/` owns shared domain and infrastructure primitives
- `src/features/` owns feature-specific behavior that still exists after extraction
- `src/ui/` owns rendering primitives, blocks, layouts, and styles

Important constraint:

- do not force every current file into `src/content` just because it is nearby to rendering today
- only authored page/section/task/timer definitions should migrate there

---

## Canonical Implementation Strategy

This is the recommended execution order.

### Phase 0: Archive

- create a local archive of current `src/` and relevant docs
- add a migration log

### Phase 1: Registry and state foundations

- define the canonical section/page registry
- introduce a unified storage key builder
- introduce `TaskStateManager` or equivalent unified state access
- stop adding new duplicated arrays or storage conventions

This phase happens before large file relocation.

### Phase 2: Validation contracts

- add schemas for page, section, task, timer, cadence
- add validation and normalization pipeline
- decide final authored config shapes in code, not just on paper

### Phase 3: Timer system extraction

- centralize timers
- convert farming/cooldown timing logic to references

### Phase 4: Hierarchical renderer

- build the generic renderer path
- migrate one vertical slice first

Recommended first slice:

- `gathering`

Reason:

- simpler than farming
- still exercises grouping and registry-driven rendering

### Phase 5: Content root migration

- introduce `src/content`
- move the first successful slice into final target structure
- repeat for remaining slices

Recommended migration order after `gathering`:

1. `daily`
2. `weekly`
3. `monthly`
4. `farming`
5. `overview`
6. landing and ancillary pages

### Phase 6: Compatibility cleanup

- remove hardcoded section maps
- remove obsolete render branches
- collapse duplicate import/export responsibilities
- remove placeholder modules that never gained ownership

### Phase 7: Test harness and audits

- add unit tests for normalization, hierarchy, storage, cadence, timers
- add browser tests for critical flows
- expand audit scripts to enforce the new rules

### Phase 8: Documentation and final cleanup

- document authoring model
- document registry model
- document migration model
- update top-level handoff references

---

## Explicit Non-Goals

These are out of scope for this refactor unless separately requested:

- redesigning the site visually
- changing frameworks away from Vite + JavaScript
- adding a backend or database
- adding major new game content during the architecture migration
- deleting current gameplay/task knowledge just because the model is old

Content accuracy updates can happen, but they should be layered onto the new model instead of mixed into every migration step.

---

## Repo-Specific Guidance

### Use what already exists

Retain and refactor rather than rewrite where possible:

- current storage namespace work
- profile system
- time utilities
- DOM/query helpers
- existing token foundation under `src/ui/styles/tokens/`

### Do not preserve current duplication

The following should be treated as migration targets, not stable patterns:

- repeated section key arrays
- repeated label maps
- manual shell duplication for each tracker section
- feature-specific renderer dispatch in the orchestrator
- storage writes outside a unified state/storage API

### Treat placeholders as debt

Do not build new architecture around empty marker files. Either give them real ownership or remove them when their area is migrated.

---

## Acceptance Criteria

Implementation is successful when all of the following are true:

- one canonical registry defines pages, sections, routes, and labels
- authored tracker structure lives in `src/content`
- a new section can be added without editing multiple unrelated runtime files
- renderer branching is based on hierarchy/template contracts, not feature names
- timers are reusable shared definitions
- import/export and stored state are versioned
- old user data is preserved or migrated safely
- visuals remain functionally identical
- build and audits pass
- new tests cover core domain behavior and critical browser flows

---

## Recommended Immediate Next Step

Implementation should start with a concrete Phase 0/1 foundation pass:

1. add archive and migration-log structure
2. introduce a reconciled registry contract in the repo
3. introduce unified storage key/state APIs
4. document the first-slice migration target before moving content

Do not start by moving every existing file into `src/content` all at once.

---

## Working Rule

If a future planning note conflicts with this brief, prefer this brief unless the user explicitly changes direction.
