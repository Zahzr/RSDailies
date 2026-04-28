# RSDailies Handoff Notes

This document records the current clean handoff state for the deployed RSDailies project.

---

## Current Status

The project is ready to run locally from the repository root.

Recommended validation commands:

```bash
npm install
npm run audit
npm run build
npm run preview
```

---

## Current Project Shape

```text
assets/       Static public assets
docs/         Current architecture, reference, and handoff documentation
src/app/      Boot, composition, runtime wiring, and orchestration
src/core/     Shared non-visual utilities
src/data/     Game data and configuration shells
src/features/ Feature/domain behavior and configuration
src/ui/       Pages, components, primitives, app shell HTML, and styles
tools/        Audit and verification scripts
```

---

## Verification Scripts

```bash
npm run audit:imports
npm run audit:topology
npm run audit
```

The audits are intended to catch broken imports, removed path usage, and topology issues before changes are committed.

---

## Git Commit Checklist

Before committing:

```bash
npm run audit
npm run build
```

Then:

```bash
git status
git add .
git commit -m "Update RSDailies documentation"
git push
```

---

## Files That Should Not Be Committed

Do not commit:

```text
node_modules/
dist/
```

The file below is only needed if Google Search Console HTML verification is actively being used:

```text
googlec7c393bb3b6c202e.html
```

If that verification method is not needed, it can be deleted. The current `.gitignore` already includes rules for it.

---

## Maintenance Rules

- Keep UI in `src/ui/`.
- Keep reusable non-visual helpers in `src/core/`.
- Keep feature/domain behavior in `src/features/`.
- Keep game/task data in `src/data/`.
- Keep public images/icons in `assets/`.
- Keep documentation current and concise.
- Run audits after structural changes.

# RSDailies Handoff Notes

This document records the current clean handoff state for the deployed RSDailies project.

---

## Current Status

The project is ready to run locally from the repository root.

Recommended validation commands:

```bash
npm install
npm run audit
npm run build
npm run preview
```

---

## Current Project Shape

```text
assets/       Static public assets
docs/         Current architecture, reference, and handoff documentation
src/app/      Boot, composition, runtime wiring, and orchestration
src/core/     Shared non-visual utilities
src/data/     Game data and configuration shells
src/features/ Feature/domain behavior and configuration
src/ui/       Pages, components, primitives, app shell HTML, and styles
tools/        Audit and verification scripts
```

---

## Verification Scripts

```bash
npm run audit:imports
npm run audit:topology
npm run audit
```

The audits are intended to catch broken imports, removed path usage, and topology issues before changes are committed.

---

## Git Commit Checklist

Before committing:

```bash
npm run audit
npm run build
```

Then:

```bash
git status
git add .
git commit -m "Update RSDailies documentation"
git push
```

---

## Files That Should Not Be Committed

Do not commit:

```text
node_modules/
dist/
```

The file below is only needed if Google Search Console HTML verification is actively being used:

```text
googlec7c393bb3b6c202e.html
```

If that verification method is not needed, it can be deleted. The current `.gitignore` already includes rules for it.

---

## Maintenance Rules

- Keep UI in `src/ui/`.
- Keep reusable non-visual helpers in `src/core/`.
- Keep feature/domain behavior in `src/features/`.
- Keep game/task data in `src/data/`.
- Keep public images/icons in `assets/`.
- Keep documentation current and concise.
- Run audits after structural changes.
