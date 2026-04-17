# RSDailies: Centralized Reference Registry

This document serves as the **Single Source of Truth** for all external references, citations, and dependencies utilized within the RSDailies project.

---

## 🏛 UI & Framework Assets
**Justification**: External libraries used to provide core responsiveness, aesthetics, and interactive components.

- **Feature**: Core Styling & Layout
  - **Service Type**: Content Delivery Network (JSDelivr)
  - **File**: `src/index/index.html`
  - **Citation**: [Bootstrap CSS v5.1.3](https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css)
  - **Usage**: Provides the CSS framework, grid system, and standard dark-mode utility classes.

- **Feature**: Interactive Controls
  - **Service Type**: Content Delivery Network (JSDelivr)
  - **File**: `src/index/index.html`
  - **Citation**: [Bootstrap JS Bundle v5.1.3](https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js)
  - **Usage**: Handles modal behavior, dropdown logic, and collapse events for the navbar.

---

## 🔗 Community & Support Hubs
**Justification**: Direct links to community resources and official support channels for the RS3 player base.

- **Feature**: Project Support
  - **Service Type**: Discord
  - **File**: `src/index/components/footer.html`
  - **Citation**: [Dailyscape Support Discord](https://discord.gg/bH85NeVv2p)
  - **Usage**: Primary channel for user feedback, bug reporting, and community interaction.

- **Feature**: Community Navigation
  - **Service Type**: Discord
  - **File**: `src/index/components/navbar.html`
  - **Citations**:
    - [Official RuneScape](https://discord.gg/rs)
    - [Achievement Help](https://discord.gg/ahelp)
    - [Deep Sea Fishing](https://discord.gg/whirlpooldnd)
    - [Player Owned Farms](https://discord.gg/nnrmtTU)
  - **Usage**: Quick-access links to specialized RS3 community servers for player assistance.

---

## 📚 Domain Knowledge & Data Sources
**Justification**: authoritative sources for game data, task logic, and live economy information.

- **Feature**: Player Optimization
  - **Service Type**: Wiki / Documentation
  - **File**: `src/index/components/navbar.html`
  - **Citations**:
    - [Money Making Guide](https://runescape.wiki/w/Money_making_guide)
    - [Distractions & Diversions](https://runescape.wiki/w/Distractions_and_Diversions)
    - [PVM Encyclopedia](https://pvme.github.io)
    - [Runepixels](https://runepixels.com/)
  - **Usage**: Encyclopedic references for optimizing daily activities and tracking player progress.

- **Feature**: Live Profit Calculations
  - **Service Type**: MediaWiki API
  - **File**: `src/app/legacy-app.js`
  - **Citation**: [RuneScape Wiki API (Ask)](https://runescape.wiki/api.php?action=ask)
  - **Usage**: Programmatic fetching of Grand Exchange prices via the `[[Exchange:Item]]` query.
  - **Justification**: Ensures profit estimates in the task tables reflect the current game economy.

---

## 🛠 Project Infrastructure
**Justification**: Canonical links for project maintenance and external site integration.

- **Feature**: Source Control
  - **Service Type**: GitHub
  - **File**: `src/index/components/footer.html`
  - **Citation**: [RSDailies GitHub Repository](https://github.com/rsdailies/RSDailies)
  - **Usage**: Official source code hosting and release management.

- **Feature**: Task Reset Logic
  - **Service Type**: Reset Countdown (Logic)
  - **File**: `src/core/time/boundaries.js`
  - **Justification**: Reset boundaries align strictly with the Jagex UTC server reset (00:00 UTC).

---

## 🛡 Reference Integrity Rule

> [!IMPORTANT]
> **Governance Standard**: Any future AI-assisted or manual edits that introduce a new external script, CDN link, or authoritative URL **MUST** be recorded in this registry immediately. 
> 1. Identify the **Feature** it supports.
> 2. Document the **Service Type** (CDN, API, Discord, etc).
> 3. Provide a **Justification** for "why" the external dependency was added.
