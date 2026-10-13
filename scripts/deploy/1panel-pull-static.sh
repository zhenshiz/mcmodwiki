#!/usr/bin/env bash
# Paste this reviewed script into a HOST-side 1Panel Shell task using Bash.
# Change SITE_DIR only after confirming the site's real host-side directory.
set -Eeuo pipefail
umask 077

REPOSITORY='https://github.com/zhenshiz/mcmodwiki.git'
BRANCH='deploy-static'
SITE_DIR='/opt/1panel/www/sites/mcmod-wiki/index'
STATE_DIR='/opt/1panel/tmp/mcmod-wiki-pull'
DOMAIN='doc.mafuyu.moe'
CHECK_IP='127.0.0.1'

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
for tool in bash curl git tar rsync flock timeout awk find cmp mktemp install; do
    command -v "$tool" >/dev/null || fail "Required command not found: $tool"
done
[[ "$SITE_DIR" =~ ^/[a-zA-Z0-9_./-]+/www/sites/[a-zA-Z0-9_-]+/index$ ]] || fail 'Unexpected SITE_DIR'
[[ "$SITE_DIR" != *'/../'* && "$SITE_DIR" != *'/./'* ]] || fail 'Unsafe SITE_DIR'
[[ -d "$SITE_DIR" && -w "$SITE_DIR" ]] || fail "Site directory missing or not writable: $SITE_DIR"
install -d -m 700 "$STATE_DIR"
exec 9>"$STATE_DIR/pull.lock"
if ! flock -n 9; then
    echo 'Another publication is running; skipping this check.'
    exit 0
fi

work_dir=''
staged_index=''
cleanup() {
    result=$?
    trap - EXIT
    [[ -z "$staged_index" ]] || rm -f -- "$staged_index"
    [[ -z "$work_dir" ]] || rm -rf -- "$work_dir"
    if (( result != 0 )); then
        echo 'ERROR: Publication failed; the successful version marker was not advanced.' >&2
    fi
    exit "$result"
}
trap cleanup EXIT

# Use the public branch head, with no GitHub token and no SSH credentials.
remote_ref="$(GIT_TERMINAL_PROMPT=0 timeout 60s git ls-remote --heads "$REPOSITORY" "refs/heads/$BRANCH")"
[[ -n "$remote_ref" && "$remote_ref" != *$'\n'* ]] || fail "Missing or ambiguous public branch: $BRANCH"
sha="${remote_ref%%$'\t'*}"
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || fail 'Invalid publication commit SHA'
if [[ -f "$STATE_DIR/published.sha" && "$(cat "$STATE_DIR/published.sha")" == "$sha" ]]; then
    echo "No update: $sha"
    exit 0
fi

work_dir="$(mktemp -d "$STATE_DIR/work.XXXXXX")"
curl --fail --silent --show-error --location \
    --proto '=https' --proto-redir '=https' \
    --connect-timeout 15 --max-time 180 --retry 2 \
    "https://github.com/zhenshiz/mcmodwiki/archive/$sha.tar.gz" \
    --output "$work_dir/publication.tar.gz"

# Validate before extraction: one repository root, safe relative paths,
# and only the explicitly supported static output entries below that root.
tar --quoting-style=literal -tzf "$work_dir/publication.tar.gz" > "$work_dir/archive-paths.txt"
awk '
  {
    if ($0 == "" || $0 ~ /^\// || $0 ~ /\\/ || $0 ~ /[[:cntrl:]]/) exit 1
    n = split($0, part, "/")
    if (NR == 1) root = part[1]
    if (root !~ /^mcmodwiki-/ || part[1] != root) exit 1
    for (i = 1; i <= n; i++) if (part[i] == "." || part[i] == "..") exit 1
    if (n == 1 || (n == 2 && part[2] == "")) next
    if (part[2] != "assets" && part[2] != "md" && part[2] != "index.html" && part[2] != "favicon.ico") exit 1
    if ((part[2] == "index.html" || part[2] == "favicon.ico") && n != 2) exit 1
  }
  END { if (NR == 0) exit 1 }
' "$work_dir/archive-paths.txt" || fail 'Archive contains an unsafe path or unexpected output root'
# GNU tar lists regular files with "-" and directories with "d".
# Reject symbolic links, hard links, devices and other special entries.
LC_ALL=C tar -tvzf "$work_dir/publication.tar.gz" > "$work_dir/archive-types.txt"
awk 'substr($0, 1, 1) != "-" && substr($0, 1, 1) != "d" { exit 1 }' \
    "$work_dir/archive-types.txt" || fail 'Archive contains a link or special file'

install -d -m 700 "$work_dir/site"
tar -xzf "$work_dir/publication.tar.gz" --strip-components=1 \
    --no-same-owner --no-same-permissions -C "$work_dir/site"
[[ -s "$work_dir/site/index.html" && -d "$work_dir/site/assets" && -d "$work_dir/site/md" ]] \
    || fail 'Publication is missing index.html, assets/ or md/'
[[ -z "$(find "$work_dir/site" -type l -print -quit)" ]] || fail 'Extracted publication contains a symbolic link'
asset_path="$(awk 'match($0, /src="\/assets\/[A-Za-z0-9_.\/-]+\.js"/) { print substr($0, RSTART + 5, RLENGTH - 6); exit }' "$work_dir/site/index.html")"
[[ "$asset_path" =~ ^/assets/[a-zA-Z0-9_.-]+\.js$ && -s "$work_dir/site$asset_path" ]] \
    || fail 'Cannot locate a built entry JavaScript bundle'

# Preserve old hashed bundles for already-open pages. Do not add --delete.
rsync -rpz --delay-updates --chmod=D755,F644 --exclude='/index.html' \
    "$work_dir/site/" "$SITE_DIR/"
staged_index="$(mktemp "$SITE_DIR/.index-pull.XXXXXX")"
install -m 644 "$work_dir/site/index.html" "$staged_index"
mv -f -- "$staged_index" "$SITE_DIR/index.html"
staged_index=''

# Check the local OpenResty site directly, avoiding DNS/proxy/CDN caching.
# Start with HTTP, follow a later HTTPS redirect, and keep TLS checks enabled.
check_curl=(curl --fail --silent --show-error --location --max-redirs 3 \
    --proto '=http,https' --proto-redir '=http,https' \
    --connect-timeout 10 --max-time 30 --noproxy "$DOMAIN" \
    --resolve "$DOMAIN:80:$CHECK_IP" --resolve "$DOMAIN:443:$CHECK_IP")
check_route() {
    local path="$1" output="$2" final_url
    final_url="$("${check_curl[@]}" "http://$DOMAIN$path" --output "$output" --write-out '%{url_effective}')"
    [[ "$final_url" == "http://$DOMAIN$path" || "$final_url" == "https://$DOMAIN$path" ]] \
        || fail "Unexpected redirect when checking $path: $final_url"
}
check_route '/' "$work_dir/live-index.html"
cmp "$work_dir/site/index.html" "$work_dir/live-index.html" || fail 'Served homepage differs from the publication'
check_route '/editor' "$work_dir/live-editor.html"
cmp "$work_dir/site/index.html" "$work_dir/live-editor.html" || fail 'History route does not serve the publication'
check_route "$asset_path" "$work_dir/live-asset.js"
cmp "$work_dir/site$asset_path" "$work_dir/live-asset.js" || fail 'Served JavaScript bundle differs from the publication'
printf '%s\n' "$sha" > "$work_dir/published.sha"
chmod 600 "$work_dir/published.sha"
mv -f -- "$work_dir/published.sha" "$STATE_DIR/published.sha"
echo "Published and verified: $sha"
