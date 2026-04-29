# RSDailies Reference Registry

This document tracks external URLs, CDN dependencies, and notable integration points used by the current app.

## UI Dependencies

| Purpose | Location | Reference |
|---|---|---|
| Bootstrap CSS | `src/ui/app-shell/html/index.html` | `https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css` |
| Bootstrap JS bundle | `src/ui/app-shell/html/index.html` | `https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js` |

## Project Links

| Purpose | Location | Reference |
|---|---|---|
| Repository link | App shell navbar and footer | `https://github.com/rsdailies/RSDailies` |
| Discord/community link | App shell navbar and footer | Configured in shell markup |

## RuneScape References

| Purpose | Reference |
|---|---|
| RuneScape Wiki | `https://runescape.wiki/` |
| Money making guide | `https://runescape.wiki/w/Money_making_guide` |
| Distractions and Diversions | `https://runescape.wiki/w/Distractions_and_Diversions` |
| PVM Encyclopedia | `https://pvme.github.io` |
| Runepixels | `https://runepixels.com/` |

## Integration Notes

| Area | Location | Notes |
|---|---|---|
| Grand Exchange and wiki-backed item utilities | `src/core/api/`, `src/app/runtime/app-core/` | UI should consume domain/app services instead of fetching directly in renderers. |
| Penguin data proxy | `vite.config.js`, `src/features/penguins/` | Development and preview flows support the configured penguin endpoint path. |

## Rule

When adding an external dependency or URL:

1. Add it here.
2. Record where it is used.
3. Explain what part of the app it supports.
4. Prefer routing access through app/core/feature layers instead of coupling renderers directly to remote services.
