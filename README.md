# RSDailies

Static RS3 task checklist for tracking dailies, weeklies, monthlies, and your own custom tasks. Designed to run on GitHub Pages with no backend.

Live: `https://rsdailies.github.io/RSDailies/`

## What Works

- RS3 reset timers (UTC): daily, weekly (Wednesday), monthly (1st)
- Task lists: dailies, daily gathering, weeklies, weekly gathering, monthlies
- Custom tasks (daily/weekly/monthly reset)
- Profiles (separate localStorage namespaces per profile)
- Import/Export token (backup/migrate local data)
- Herb Run timer:
  - Aligns to RS3 farming growth ticks (20-minute cycles, UTC)
  - Supports Speedy Growth upgrade timing via Settings
  - Optional checklist panel for common herb patch locations
- Farming Timers panel:
  - Multiple concurrent timers (per patch type)
  - Driven by `src/config/farming/` modules (edit data without touching runtime logic)
  - Optional growth tick offset setting (minutes)

## Repo Layout

- `index.html`: app shell and Vite entry
- `src/app`: module entrypoint, bootstrap, and legacy bridge during migration
- `src/config`: novice-safe task, farming, settings, and theme modules
- `src/core`: shared storage, time, DOM, ID, and utility helpers
- `src/features`: feature boundaries for profiles, settings, sections, farming, overview, and more
- `src/ui`: table, panel, control, and render modules
- `src/styles`: split CSS system imported through `src/styles/index.css`
- `public/img`: static images copied into the built site

## Local Development

Run the Vite dev server.

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:8080/`.

## Editing Tasks

Edit `src/config/tasks/` to modify built-in task lists and `src/config/farming/` for farming timers. Each task supports:

- `id`: unique string key
- `name`: display name
- `wiki`: optional URL
- `note`: optional text
- `timer: 'herb'`: shows the herb run timer button and panel
- `cooldownMinutes`: optional per-task cooldown button (simple countdown)

## Deployment

GitHub Pages builds the site with Vite and deploys the generated `dist/` output via `.github/workflows/deploy.yml` on pushes to `main`.

## Notes / Best Practices

- This is a static app. All data is stored locally in your browser via `localStorage`.
- Discord webhooks can post messages, but they do not reliably ping users. If you want @mentions, you need a bot.

RuneScape is a registered trademark of Jagex. This project is fan-made and unofficial.
