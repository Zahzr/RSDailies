# Migration Log

## 2026-04-28

### Phase 0

- Created `archive/oldSrc/` as a snapshot of the pre-refactor `src/` tree.
- Created `archive/oldDocs/` as a snapshot of the pre-refactor `docs/` tree.

### Phase 1 Foundation

- Added a canonical tracker registry scaffold under `src/app/registries/`.
- Added unified storage key and task state foundation under `src/core/`.
- Began redirecting low-risk identity/state helpers to the new foundation without changing runtime behavior.
