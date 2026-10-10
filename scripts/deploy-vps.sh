#!/usr/bin/env bash
set -euo pipefail

project_dir="${RAGEBAIT_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
cd "$project_dir"

if [[ ! -f .env.production ]]; then
  echo 'Missing .env.production. Copy .env.production.example and configure it first.' >&2
  exit 1
fi

docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build --remove-orphans
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl --fail --silent --show-error http://127.0.0.1:9001/api/health >/dev/null
echo 'Deployment complete. Verify https://ragebait.bcic.site after Nginx and DNS are configured.'
