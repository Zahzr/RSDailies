# RSDailies Reference Registry

This document tracks external references and project integration points used by RSDailies.

Keep this file updated when adding or removing outside services, CDN links, community URLs, or API references.

---

## UI and Framework Assets

| Purpose | Location | Reference |
|---|---|---|
| Bootstrap CSS | `src/ui/app-shell/html/index.html` | `https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css` |
| Bootstrap JS bundle | `src/ui/app-shell/html/index.html` | `https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js` |

Bootstrap is used for base layout behavior, modal support, dropdown behavior, and general responsive UI utilities.

---

## Project and Community Links

| Purpose | Location | Reference |
|---|---|---|
| Project repository | Navbar/footer links where used | `https://github.com/rsdailies/RSDailies` |
| Discord/community link | Navbar/footer links where used | Discord invite configured in the app shell |

---

## RuneScape References

| Purpose | Location | Reference |
|---|---|---|
| RuneScape Wiki | Navbar/reference links where used | `https://runescape.wiki/` |
| Money making guide | Navbar/reference links where used | `https://runescape.wiki/w/Money_making_guide` |
| Distractions and Diversions | Navbar/reference links where used | `https://runescape.wiki/w/Distractions_and_Diversions` |
| PVM Encyclopedia | Navbar/reference links where used | `https://pvme.github.io` |
| Runepixels | Navbar/reference links where used | `https://runepixels.com/` |

These references support player navigation, planning, and task research.

---

## API and Live Data Notes

| Purpose | Location | Notes |
|---|---|---|
| Grand Exchange / wiki-backed item data | `src/core/api/`, `src/app/runtime/app-core/` | UI should call app/domain services instead of fetching directly from UI renderers. |
| Penguin data proxy | `vite.config.js`, `src/features/penguins/` | Development/preview proxy supports the configured penguin endpoint path. |

---

## Static Assets

Current public assets are stored under:

```text
assets/img/
├── dailyscape.png
├── dailyscape.svg
├── dailyscapebig.png
├── discord.png
└── github.png
```

---

## Registry Rule

When adding a new external dependency or URL:

1. Add the reference here.
2. Include where it is used.
3. Explain what part of the app it supports.
4. Avoid adding external services directly inside UI files unless they are static links or already part of the app shell.

---

## 🧭 What This Document Is For

This registry serves as the **Single Source of Truth** for external dependencies, ensuring long-term maintainability and preventing "drift" in future development cycles.

- **Stops random folder sprawl** - keeps files in predictable places
- **Guides AI edits** - ensures AI knows where each piece of code belongs
- **Sets boundaries** - clear rules about what belongs in UI vs. features vs. core
- **Supports staged improvements** - allows targeted cleanup passes without breaking everything
- **Keeps maintenance clear** - easy to know where to look when bugs or missing features pop up

---

## 🛠 How To Use This Today

When you add or modify code:

1. Ask yourself:
   - Is this UI or logic?
   - Is it reusable or feature-specific?
   - Does it belong in `ui`, `features`, or `core`?
2. Update the appropriate file
3. Verify the change works
4. If the change is significant, **update this document with the new structure**

---

## ⚠️ What This Document Is Not For

- **Not a style guide** - use `src/ui/styles/` for that
- **Not a full API reference** - use code comments and JSDoc
- **Not a design spec** - use `docs/design` if you want visual mockups
- **Not a strict template** - you can add folders inside these paths (e.g. `src/ui/components/tracker/rows/columns/types/`)
