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
SKIP_LOCAL_BUILD=0

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy-production.sh [options]

Options:
  --allow-dirty            Deploy the current committed HEAD despite local changes.
  --dry-run                Validate and transfer with rsync dry-run only.
  --skip-local-build       Reuse an existing local Next standalone build.
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
    --skip-local-build)
      SKIP_LOCAL_BUILD=1
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

for command in git node npm ssh rsync tar; do
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
if [[ "$SKIP_LOCAL_BUILD" != "1" ]]; then
  npm ci
  npm run build
fi

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

# The workstation builds on macOS. The CMS pins sharp to a CPU-compatible
# release, so package its prebuilt Linux x64 runtime; nothing is compiled or
# installed on the server.
SHARP_VERSION="$(node -p "require('$PROJECT_ROOT/node_modules/sharp/package.json').version")"
LIBVIPS_VERSION="$(node -p "require('$PROJECT_ROOT/node_modules/sharp/package.json').optionalDependencies['@img/sharp-libvips-linux-x64']")"
LINUX_SHARP_DIR="$(mktemp -d)"
trap 'rm -rf -- "$STAGING_DIR" "$LINUX_SHARP_DIR"' EXIT
npm pack --silent --pack-destination "$LINUX_SHARP_DIR" \
  "@img/sharp-linux-x64@$SHARP_VERSION" \
  "@img/sharp-libvips-linux-x64@$LIBVIPS_VERSION" >/dev/null
mkdir -p "$STAGING_DIR/node_modules/@img"
for package_name in sharp-linux-x64 sharp-libvips-linux-x64; do
  package_archive="$(find "$LINUX_SHARP_DIR" -maxdepth 1 -name "img-${package_name}-*.tgz" -print -quit)"
  [[ -n "$package_archive" ]] || {
    printf 'Missing Linux sharp package archive: %s\n' "$package_name" >&2
    exit 1
  }
  package_target="$STAGING_DIR/node_modules/@img/$package_name"
  rm -rf -- "$package_target"
  mkdir -p "$package_target"
  tar -xzf "$package_archive" --strip-components=1 -C "$package_target"
done

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

CMS_READY=0
for attempt in $(seq 1 30); do
  if curl -fsS --max-time 10 "http://127.0.0.1:${APP_PORT}/admin" >/dev/null; then
    CMS_READY=1
    break
  fi
  sleep 2
done

if [[ "$CMS_READY" != "1" ]]; then
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
