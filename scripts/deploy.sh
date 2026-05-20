#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/deploy/apps/honest-discount}"
BRANCH="${BRANCH:-main}"
PR_NUMBER="${PR_NUMBER:-}"
HOST="${HOST:-80.78.253.68}"
API_PORT="${API_PORT:-3001}"
WEB_PORT="${WEB_PORT:-3000}"

required_env=(
  DATABASE_URL
  REDIS_URL
  YANDEX_CONTENT_API_KEY
  YANDEX_AFFILIATE_CLID
  YANDEX_AFFILIATE_CLIENT_ID
  YANDEX_AFFILIATE_BASE_URL
)

info(){ echo "[INFO] $*"; }
warn(){ echo "[WARN] $*"; }
fail(){ echo "[FAIL] $*"; exit 1; }

check_cmd(){
  command -v "$1" >/dev/null 2>&1 || fail "Command not found: $1"
}

check_cmd git
check_cmd docker
check_cmd curl

cd "$PROJECT_DIR" || fail "Cannot cd to $PROJECT_DIR"

info "Fetching git updates"
git fetch origin

if [[ -n "$PR_NUMBER" ]]; then
  pr_branch="pr-${PR_NUMBER}"
  info "Checking out PR #$PR_NUMBER into branch $pr_branch"
  git fetch origin "pull/${PR_NUMBER}/head:${pr_branch}"
  git checkout "$pr_branch"
else
  info "Checking out branch: $BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
fi

[[ -f .env ]] || fail ".env not found in $PROJECT_DIR"

missing=()
for key in "${required_env[@]}"; do
  if ! grep -q "^${key}=" .env; then
    missing+=("$key")
  fi
done

if (( ${#missing[@]} > 0 )); then
  fail "Missing required env vars in .env: ${missing[*]}"
fi

info "Required env vars are present"
grep -E '^(DATABASE_URL|REDIS_URL|YANDEX_CONTENT_API_KEY|YANDEX_AFFILIATE_CLID|YANDEX_AFFILIATE_CLIENT_ID|YANDEX_AFFILIATE_BASE_URL)=' .env | sed 's/=.*$/=***hidden***/'

info "Rebuilding and restarting containers"
docker compose down
docker compose up -d --build

info "Container status"
docker compose ps

info "API health check"
curl -fsS "http://${HOST}:${API_PORT}/api/health" >/dev/null && echo "[OK] /api/health"

info "Products endpoint check"
curl -fsS "http://${HOST}:${API_PORT}/api/products" >/dev/null && echo "[OK] /api/products"

info "Deals endpoint check"
curl -fsS "http://${HOST}:${API_PORT}/api/deals" >/dev/null && echo "[OK] /api/deals"

info "Web root check"
curl -fsS "http://${HOST}:${WEB_PORT}/" >/dev/null && echo "[OK] /"

info "Deploy completed successfully"
