# RSDailies

Configuration-first RuneScape task tracker built as a client-side Vite application.

The current architecture is content-driven: tracker pages and sections are authored under `src/content/`, runtime metadata is centralized in `src/app/registries/unified-registry.js`, and storage, migration, timer, and validation infrastructure lives under `src/core/`.

## Current Scope

- RS3 tracker with daily, weekly, monthly, gathering, farming, and custom-task flows
- OSRS shell with content-ready page architecture
- Profile-aware local storage
- Schema-versioned import and export
- Registry-driven navigation and generated tracker shell
- Audit, unit, browser smoke, and production build verification

## Project Structure

```text
assets/       Static images
docs/         Active architecture and reference docs
src/app/      Boot, runtime orchestration, registries
src/content/  Authored pages, sections, and schemas
src/core/     Shared storage, state, content, timer, and utility infrastructure
src/features/ Feature/domain logic and adapters
src/ui/       Pages, shell, components, and styles
tests/        Node and Playwright coverage
tools/        Audit scripts
```

## Verification

```bash
npm install
npm run verify:full
```

`verify:full` runs:

- `npm test`
- `npm run audit`
- `npm run test:e2e`

`npm run test:e2e` performs a production `vite build` before running the Playwright smoke suite.

## Notes

- This is a frontend-only Vite app. No backend or Express server is required for the current architecture.
- Legacy pre-refactor artifacts should not remain in the active repo once their replacements are verified.

## Legal

RuneScape is a trademark of Jagex Ltd. This project is not affiliated with Jagex.
