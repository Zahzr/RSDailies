#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_RSDATA_DIR="$ROOT_DIR/rsdata"
FALLBACK_RSDATA_DIR="$ROOT_DIR/../rsdata"
RSDATA_DIR="${1:-}"
LINK_PATH="$ROOT_DIR/rsdata"

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        printf 'Missing required command: %s\n' "$1" >&2
        exit 1
    fi
}

require_command git
require_command python3

if [ -z "$RSDATA_DIR" ]; then
    if [ -d "$DEFAULT_RSDATA_DIR" ]; then
        RSDATA_DIR="$DEFAULT_RSDATA_DIR"
    elif [ -d "$FALLBACK_RSDATA_DIR" ]; then
        RSDATA_DIR="$FALLBACK_RSDATA_DIR"
    else
        RSDATA_DIR="$DEFAULT_RSDATA_DIR"
    fi
fi

if [ ! -d "$RSDATA_DIR" ]; then
    cat >&2 <<EOF
Expected the rsdata repository at:
  $RSDATA_DIR

Clone it into this repository first:
  git clone https://github.com/dailyscape/rsdata.git "$DEFAULT_RSDATA_DIR"

Or rerun this script with a custom path:
  ./scripts/setup-local.sh /absolute/path/to/rsdata
EOF
    exit 1
fi

RSDATA_DIR="$(cd "$RSDATA_DIR" && pwd)"

if [ "$RSDATA_DIR" != "$LINK_PATH" ] && [ -e "$LINK_PATH" ] && [ ! -L "$LINK_PATH" ]; then
    cat >&2 <<EOF
Cannot create the local rsdata link because this path already exists and is not a symlink:
  $LINK_PATH

Move or remove it, then rerun this script.
EOF
    exit 1
fi

link_summary="$LINK_PATH (direct checkout)"

if [ "$RSDATA_DIR" != "$LINK_PATH" ]; then
    ln -sfn "$RSDATA_DIR" "$LINK_PATH"
    link_summary="$LINK_PATH -> $RSDATA_DIR"
fi

missing_files=()

for required_path in "rsdata.js" "rsapiupdated.json" "images"; do
    if [ ! -e "$RSDATA_DIR/$required_path" ]; then
        missing_files+=("$required_path")
    fi
done

if [ "${#missing_files[@]}" -gt 0 ]; then
    printf 'The rsdata repository is linked, but generated assets are still missing:\n' >&2
    for missing_file in "${missing_files[@]}"; do
        printf '  - %s\n' "$missing_file" >&2
    done

    cat >&2 <<EOF

From $RSDATA_DIR run:
  python3 -m pip install requests
  python3 ./.github/scripts/rsapidata.py
  python3 ./.github/scripts/rselydata.py

Then rerun:
  ./scripts/setup-local.sh
EOF
    exit 1
fi

cat <<EOF
Local setup is ready.

Verified:
  - rsdata repository: $RSDATA_DIR
  - project path: $link_summary
  - generated assets: rsdata.js, rsapiupdated.json, images/

Start the site with:
  ./scripts/dev-local.sh

Optional shortcut:
  make serve

Then open:
  http://127.0.0.1:8000/
EOF
