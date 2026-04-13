[![DailyScape](./img/dailyscape.png)](https://dailyscape.github.io)
# DailyScape - RS3 Dailies, Weeklies, Monthlies Task Checklist for RuneScape

## Features
* List of daily, weekly and monthly repeatable tasks for Runescape 3
* Click the red area in right column (incomplete) to switch to green (completed)
* Brief comments on the benefits of completing the task
* Links to runescape.wiki or other relevant pages with further info
* Automatic countdown timer til the next reset time
* Once the reset time has past, completed tasks are automatically reset for you
* Saves what you checked off in the right column across visits in your browser's localStorage
* Drag and drop reordering (on desktop) that's saved so you can move the stuff you find more important to the top
* Links in nav to "more resources" that might be useful for gameplay information
* Makes profit calculations in "realtime" with data from [runescape.wiki GE API](https://runescape.wiki/w/User:Gaz_Lloyd/using_gemw#Exchange_API)
* Tooltips on items showing more info
* Allows hiding of tasks and sections and saves preference in localStorage
* Compact view mode
* Multiple profile capability
* Ad free / tracking free

## Dev setup / How to contribute

This project is a static site. There is no build step, but local development does depend on the generated data files from the [`rsdata`](https://github.com/dailyscape/rsdata) repository.

### Requirements

* `git`
* `python3`
* `make` (optional convenience wrapper)

### Local setup

```bash
# fork this repo and replace with your repo URL
git clone https://github.com/dailyscape/dailyscape.github.io.git
cd dailyscape.github.io

# clone the data repository inside this checkout
git clone https://github.com/dailyscape/rsdata.git rsdata

# generate the data files the site expects
cd rsdata
python3 -m pip install requests
python3 ./.github/scripts/rsapidata.py
python3 ./.github/scripts/rselydata.py

# verify everything is present
cd ..
./scripts/setup-local.sh
```

### Run locally

```bash
./scripts/dev-local.sh
```

Then open `http://127.0.0.1:8000/`.

If your `rsdata` checkout lives somewhere else, point the setup script at it explicitly:

```bash
./scripts/setup-local.sh /absolute/path/to/rsdata
```

If you prefer `make`, the repo also includes:

```bash
make setup-local
make serve
```

After that, commit to your fork and open a PR.

## Requests

Please submit any missing tasks, bugs or new feature requests to the [issue tracker](https://github.com/dailyscape/dailyscape.github.io/issues).


RuneScape ® is a registered trademark of Jagex © 1999 Jagex Ltd.
