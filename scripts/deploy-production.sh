#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SERVER_HOST="${SERVER_HOST:-163.128.112.8}"
SERVER_USER="${SERVER_USER:-ubuntu}"
SSH_PORT="${SSH_PORT:-2244}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/tzilla_squarebrothers_20260812}"
REMOTE_ROOT="${REMOTE_ROOT:-/home/ubuntu/apps/trainzilla-cms}"
PM2_APP_NAME="${PM2_APP_NAME:-trainzilla-cms}"
APP_PORT="${APP_PORT:-3001}"
RELEASE_RETENTION="${RELEASE_RETENTION:-5}"
RELEASE_ID="${RELEASE_ID:-$(date -u +%Y%m%d%H%M%S)}"
LOCAL_ENV_FILE="${LOCAL_ENV_FILE:-$PROJECT_ROOT/.env.production.local}"
ALLOW_DIRTY=0
DRY_RUN=0

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy-production.sh [options]

Options:
  --allow-dirty            Deploy the current committed HEAD despite local changes.
  --dry-run                Validate and transfer with rsync dry-run only.
  --release-id <id>        Use a specific UTC release identifier.
  --host <host>            Override the production host.
  --help, -h               Print this help text.
EOF
}

while (($# > 0)); do
  case "$1" in
    --allow-dirty)
      ALLOW_DIRTY=1
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    --release-id)
      RELEASE_ID="${2:?missing release id}"
      shift
      ;;
    --host)
      SERVER_HOST="${2:?missing host}"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown option: %s\n' "$1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

for command in git npm ssh rsync; do
  command -v "$command" >/dev/null 2>&1 || {
    printf 'Missing required command: %s\n' "$command" >&2
    exit 1
  }
done

[[ -f "$SSH_KEY" ]] || {
  printf 'SSH key not found: %s\n' "$SSH_KEY" >&2
  exit 1
}
[[ -f "$LOCAL_ENV_FILE" ]] || {
  printf 'Missing local production environment: %s\n' "$LOCAL_ENV_FILE" >&2
  exit 1
}

if [[ "$ALLOW_DIRTY" != "1" && -n "$(git -C "$PROJECT_ROOT" status --short)" ]]; then
  printf 'Worktree is dirty. Commit the intended source or use --allow-dirty.\n' >&2
  exit 1
fi

GIT_COMMIT="$(git -C "$PROJECT_ROOT" rev-parse HEAD)"
STAGING_DIR="$(mktemp -d)"
trap 'rm -rf -- "$STAGING_DIR"' EXIT

cd "$PROJECT_ROOT"
npm ci
npm run build

[[ -f "$PROJECT_ROOT/.next/standalone/server.js" ]] || {
  printf 'Next standalone runtime was not produced.\n' >&2
  exit 1
}
[[ -d "$PROJECT_ROOT/.next/static" ]] || {
  printf 'Next static assets were not produced.\n' >&2
  exit 1
}

rsync -a --delete "$PROJECT_ROOT/.next/standalone/" "$STAGING_DIR/"
mkdir -p "$STAGING_DIR/.next/static"
rsync -a --delete "$PROJECT_ROOT/.next/static/" "$STAGING_DIR/.next/static/"
if [[ -d "$PROJECT_ROOT/public" ]]; then
  rsync -a --delete "$PROJECT_ROOT/public/" "$STAGING_DIR/public/"
fi
cp "$PROJECT_ROOT/ecosystem.production.config.cjs" "$STAGING_DIR/"

SSH_TARGET="${SERVER_USER}@${SERVER_HOST}"
SSH_CMD=(ssh -i "$SSH_KEY" -p "$SSH_PORT" -o BatchMode=yes -o StrictHostKeyChecking=accept-new "$SSH_TARGET")
printf -v RSYNC_RSH 'ssh -i %q -p %q -o BatchMode=yes -o StrictHostKeyChecking=accept-new' "$SSH_KEY" "$SSH_PORT"
REMOTE_RELEASE="${REMOTE_ROOT}/releases/${RELEASE_ID}"

if [[ "$DRY_RUN" == "1" ]]; then
  "${SSH_CMD[@]}" "[[ -f '$REMOTE_ROOT/shared/.env' && ! -e '$REMOTE_RELEASE' ]]" || {
    printf 'Remote preflight failed: missing shared environment or release already exists.\n' >&2
    exit 1
  }
else
  "${SSH_CMD[@]}" "ROOT='$REMOTE_ROOT' RELEASE='$REMOTE_RELEASE' bash -s" <<'REMOTE_PREP'
set -euo pipefail
mkdir -p "$ROOT/releases" "$ROOT/shared/media" "$ROOT/shared/logs"
[[ -f "$ROOT/shared/.env" ]] || {
  echo "Missing private CMS environment: $ROOT/shared/.env" >&2
  exit 1
}
[[ ! -e "$RELEASE" ]] || {
  echo "Release already exists: $RELEASE" >&2
  exit 1
}
mkdir -p "$RELEASE"
REMOTE_PREP
fi

RSYNC_ARGS=(-az --delete -e "$RSYNC_RSH")
if [[ "$DRY_RUN" == "1" ]]; then
  RSYNC_ARGS+=(--dry-run)
fi
rsync "${RSYNC_ARGS[@]}" "$STAGING_DIR/" "${SSH_TARGET}:${REMOTE_RELEASE}/"

if [[ "$DRY_RUN" == "1" ]]; then
  printf 'Dry run complete. No remote build or process reload was performed.\n'
  exit 0
fi

"${SSH_CMD[@]}" "ROOT='$REMOTE_ROOT' RELEASE='$REMOTE_RELEASE' PM2_APP='$PM2_APP_NAME' APP_PORT='$APP_PORT' RETENTION='$RELEASE_RETENTION' bash -s" <<'REMOTE_DEPLOY'
set -euo pipefail

CURRENT="$ROOT/current"
PREVIOUS=""
if [[ -L "$CURRENT" ]]; then
  PREVIOUS="$(readlink -f "$CURRENT")"
fi

rollback() {
  if [[ -n "$PREVIOUS" ]]; then
    ln -sfn "$PREVIOUS" "$CURRENT"
    pm2 startOrReload "$CURRENT/ecosystem.production.config.cjs" --update-env
    pm2 save
  fi
}

cd "$RELEASE"
ln -sfn "$ROOT/shared/.env" .env
ln -sfn "$ROOT/shared/media" media

ln -sfn "$RELEASE" "$CURRENT"
if ! pm2 startOrReload "$CURRENT/ecosystem.production.config.cjs" --update-env; then
  rollback
  exit 1
fi
pm2 save

if ! curl -fsS --max-time 20 "http://127.0.0.1:${APP_PORT}/admin" >/dev/null; then
  rollback
  echo "CMS admin health check failed after deployment" >&2
  exit 1
fi

mapfile -t OLD_RELEASES < <(
  find "$ROOT/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' |
    sort -rn |
    awk -v keep="$RETENTION" 'NR > keep { print $2 }'
)
for old_release in "${OLD_RELEASES[@]}"; do
  [[ -n "$old_release" ]] && rm -rf -- "$old_release"
done
REMOTE_DEPLOY

printf 'Deployed CMS release %s from %s\n' "$RELEASE_ID" "$GIT_COMMIT"
