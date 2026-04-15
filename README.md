# RSDailies

Static RS3 task checklist for tracking dailies, weeklies, monthlies, and your own custom tasks. Designed to run on GitHub Pages with no backend.

Live: `https://zahzr.github.io/RSDailies/`

## What Works

- RS3 reset timers (UTC): daily, weekly (Wednesday), monthly (1st)
- Task lists: dailies, daily gathering, weeklies, weekly gathering, monthlies
- Custom tasks (daily/weekly/monthly reset)
- Profiles (separate localStorage namespaces per profile)
- Import/Export token (backup/migrate local data)
- Herb Run timer:
  - Aligns to RS3 farming growth ticks (20-minute cycles, UTC)
  - Supports 3-tick vs 4-tick herbs via Settings
  - Optional checklist panel for common herb patch locations

## Repo Layout

- `index.html`: page layout and panels
- `dailyscape.css`: styling
- `dailyscape.js`: app logic (storage, timers, profiles, rendering)
- `tasks-config.js`: curated task content (edit this to add/remove built-in tasks)

## Local Development

Serve the repo root with any static file server.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Editing Tasks

Edit `tasks-config.js` to modify the built-in task lists. Each task supports:

- `id`: unique string key
- `name`: display name
- `wiki`: optional URL
- `note`: optional text
- `timer: 'herb'`: shows the herb run timer button and panel
- `cooldownMinutes`: optional per-task cooldown button (simple countdown)

## Deployment

GitHub Pages deploys via `.github/workflows/deploy.yml` on pushes to `main`.

## Notes / Best Practices

- This is a static app. All data is stored locally in your browser via `localStorage`.
- Discord webhooks can post messages, but they do not reliably ping users. If you want @mentions, you need a bot.

RuneScape is a registered trademark of Jagex. This project is fan-made and unofficial.

