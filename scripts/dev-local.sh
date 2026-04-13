#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8000}"
HOST="${HOST:-127.0.0.1}"

if ! command -v python3 >/dev/null 2>&1; then
    printf 'Missing required command: python3\n' >&2
    exit 1
fi

if [ ! -f "$ROOT_DIR/rsdata/rsdata.js" ]; then
    cat >&2 <<EOF
Missing $ROOT_DIR/rsdata/rsdata.js

Run local setup first:
  ./scripts/setup-local.sh
EOF
    exit 1
fi

printf 'Serving DailyScape at http://%s:%s/\n' "$HOST" "$PORT"

cd "$ROOT_DIR"
exec python3 -m http.server "$PORT" --bind "$HOST"
