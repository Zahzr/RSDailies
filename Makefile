PORT ?= 8000
HOST ?= 127.0.0.1
RSDATA_DIR ?= rsdata

.PHONY: setup-local serve

setup-local:
	./scripts/setup-local.sh "$(RSDATA_DIR)"

serve:
	PORT="$(PORT)" HOST="$(HOST)" ./scripts/dev-local.sh
