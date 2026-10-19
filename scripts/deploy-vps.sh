#!/usr/bin/env bash
set -euo pipefail

project_dir="${RAGEBAIT_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
cd "$project_dir"

if [[ "${RAGEBAIT_SKIP_PULL:-0}" != "1" ]]; then
  git pull --ff-only
fi

if [[ ! -f .env.production ]]; then
  cp .env.production.example .env.production
  chmod 600 .env.production
  echo 'Created .env.production from .env.production.example.'
fi

read_env_value() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" .env.production || true)"
  printf '%s' "${line#*=}"
}

write_env_value() {
  local key="$1"
  local value="$2"
  local temp_file
  temp_file="$(mktemp .env.production.XXXXXX)"

  awk -v key="$key" -v value="$value" '
    BEGIN { updated = 0 }
    $0 ~ "^" key "=" { print key "=" value; updated = 1; next }
    { print }
    END { if (!updated) print key "=" value }
  ' .env.production > "$temp_file"
  chmod 600 "$temp_file"
  mv "$temp_file" .env.production
}

if [[ -z "$(read_env_value GROQ_API_KEY)" ]]; then
  read -r -s -p 'Enter Groq API key: ' groq_api_key
  echo
  if [[ -z "$groq_api_key" ]]; then
    echo 'A Groq API key is required for Rage Shield AI.' >&2
    exit 1
  fi
  write_env_value GROQ_API_KEY "$groq_api_key"
fi

docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build --remove-orphans
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl --fail --silent --show-error http://127.0.0.1:9001/api/health >/dev/null
echo 'Deployment complete. Rage Shield AI is configured. Verify https://ragebait.bcic.site after Nginx and DNS are configured.'
