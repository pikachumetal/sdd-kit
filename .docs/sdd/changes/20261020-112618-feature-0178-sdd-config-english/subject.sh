#!/usr/bin/env bash
# Sujeto de los humos de sdd-config de la 0178: cf1 sin pricing ni review en sdd-kit.json; cf2 con pricing y sin review.
# Lo lanza tests/headless/run.sh, con SUPERPOWERS_DIR.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-config
SC="$3"
BASE='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}, "execution": "auto", "validation": {"mode": "manual"}'
PRICING='"pricing": {"source": "https://platform.claude.com/docs/en/about-claude/pricing", "updated": "2026-10-11", "usdPerMillionTokens": {"claude-opus-5-5": {"input": 4, "cacheWrite5m": 5, "cacheWrite1h": 8, "cacheRead": 0.2, "output": 20}, "claude-sonnet-5-5": {"input": 2, "cacheWrite5m": 2.5, "cacheWrite1h": 4, "cacheRead": 0.2, "output": 10}}}'
case "$SC" in
  cf1) MARKER="$BASE"; ASK='Revisa la configuración del kit y ponla al día. Para los Minor de la revisión final, defer.' ;;
  cf2) MARKER="$BASE, $PRICING"; ASK='Revisa la configuración del kit y ponla al día.' ;;
  *) die "escenario desconocido: $SC" ;;
esac

cp -r "$REPO/tests/batteries/using-sdd/mold-salas/." "$R/"
put_kit_marker "$MARKER"
g init -q -b main
commit "feat: base del molde salas"
g checkout -q -b develop

MAX_TURNS="${MAX_TURNS:-15}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json"; } | subject_save
