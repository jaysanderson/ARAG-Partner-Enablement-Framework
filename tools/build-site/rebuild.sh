#!/usr/bin/env bash
# One-command rebuild of the static course site in /docs.
# Needs only Node (18+). Usage (from anywhere): bash tools/build-site/rebuild.sh
set -euo pipefail
cd "$(dirname "$0")"
node build.mjs
node check-links.mjs
