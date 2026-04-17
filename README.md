# RSDailies: Modular RS3 Task Tracking

A high-rigor, modular task tracker for RuneScape 3, designed for tracking dailies, weeklies, monthlies, and farming cycles. Built with a **Nested Capability** architecture to ensure ultra-modular logic and granular maintainability.

Live: `https://rsdailies.github.io/RSDailies/`

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Core Features](#-core-features)
- [Configuration Guide](#-configuration-guide)
- [📊 Reference Hub](#-reference-hub)
- [Local Development](#-local-development)
- [Governance & Agent Rules](#-governance--agent-rules)
- [Credits & Legal](#-credits--legal)

---

## 🏛 Architecture Overview

The project has transitioned from a monolithic legacy script to a **Nested Capability** model. This architecture enforces:
- **Separation of Concerns**: HTML structure, CSS styling, and JS logic are strictly decoupled.
- **Service Orchestration**: `legacy-app.js` acts as a service provider, injecting dependencies into modular features.
- **Component Injection**: The `LayoutLoader` dynamically populates the app shell from modular HTML partials.
- **Single Source of Truth**: Data configurations (tasks, timers) are isolated from runtime execution.

---

## 📂 Project Structure

```text
Dailyscape/
├── .agents/                # Mirrored agent governance (Antigravity)
├── antigravity/            # Master agent framework (Git ignored)
├── src/
│   ├── app/                # Application initialization & Service Orchestration
│   │   ├── legacy-app.js   # Main Service Orchestrator (<300 lines)
│   │   ├── core/           # Low-level storage bridges
│   │   └── ui/             # High-level render orchestrators
│   ├── config/             # Domain Data &Novice-Safe Configs
│   │   ├── farming/        # Farming patch & timer definitions
│   │   └── tasks/          # Built-in task lists
│   ├── core/               # Pure logic & cross-cutting concerns (Time, Storage)
│   ├── features/           # Domain-specific feature modules (Profiles, Settings, Timers)
│   ├── index/              # NEW: Application root & Modular HTML Partial
│   │   ├── index.html      # Lightweight app shell
│   │   ├── components/     # Modular HTML components (Navbar, Modals, Footer)
│   │   └── templates/      # Reusable HTML snippets (Row templates)
│   ├── public/             # Static assets (Images, Favicon)
│   ├── styles/             # Modular CSS architecture
│   ├── test/               # Diagnostic logs & Test outputs
│   └── ui/                 # Reusable UI primitives (Controls, Rows, Tables)
└── vite.config.js          # Project configuration (Scoped to src/index)
```

---

## ✨ Core Features

### 🕒 Smart Reset Timers
- **UTC Alignment**: Automatic calculation for Daily, Weekly (Wednesday), and Monthly (1st) resets.
- **Context-Aware Countdowns**: Real-time updates for each reset boundary.

### 🚜 Farming & Cooldowns
- **Growth Ticks**: Aligned to RS3 20-minute farming cycles.
- **Concurrent Timers**: Track multiple independent patch types.
- **Alert System**: Browser notifications and Discord Webhook integration for reset alerts.

### 👤 Profiles & Persistence
- **Namespace Isolation**: Switch between different accounts/characters with local storage separation.
- **Import/Export**: Cryptographic-style tokens for backup and cross-device migration.

---

## ⚙️ Configuration Guide

### Adding Built-in Tasks
Modify the files in `src/config/tasks/` (e.g., `rs3daily.js`). Tasks support specialized keys:
- `id`: Unique identifier.
- `profit`: Object with `item` and `qty` for live GE profit estimates.
- `cooldownMinutes`: Adds a one-click repeating timer button.

### Custom Task System
Users can create their own tasks directly in the UI. These are persisted within the specific profile and support repeating intervals (Daily/Weekly/Monthly) or custom cooldown timers.

---

---

## 📊 Reference Hub

The project maintains a **[Centralized Reference Registry](file:///c:/Users/antho/Documents/Coding/Dailyscape/src/references/registry.md)** that acts as the authoritative truth source for all:
- **UI Frameworks**: Bootstrap CDN usage and justifications.
- **Community Hubs**: Discords and community guide citations.
- **Domain API**: Documentation for the RuneScape Wiki API integration.
- **Hard-Coded Truth**: Logical reset boundaries and UTC alignment sources.

Maintaining this registry is a core requirement of the **Reference Integrity Governance Rule**.

---

## 🛠 Local Development

The project uses **Vite** for a fast development experience.

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🤖 Governance & Agent Rules

This repository is governed by the **Antigravity** agent protocol.
- **Standard**: All core runtime files must remain under 300 lines.
- **Pathing**: The application root is `src/index/`. Static assets are served from `src/public/`.
- **Ignored State**: Local agent runtime state (`/antigravity/`) is strictly ignored via `.gitignore` to prevent repository bloat.

---

## 📜 Credits & Legal
RuneScape is a registered trademark of Jagex Ltd. This project is a community-driven initiative and is not affiliated with Jagex.
Design inspired by the original DailyScape project.
