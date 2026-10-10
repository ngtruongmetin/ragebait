#!/usr/bin/env bash
set -euo pipefail

curl --fail --silent --show-error https://ragebait.bcic.site/api/health
echo
