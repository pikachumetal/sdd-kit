#!/usr/bin/env bash
# Funciones de referencia para el subject.sh de una campaña de sujetos headless (patch 0076). Se cargan, no se copian:
#   . "<repo>/tests/headless/lib.sh"
#   subject_init "$1" "$2" "$4" <skill medida>     # kit, etiqueta, salida (argumentos de run.sh)
#   ...molde en $R con g, put y commit; ASK="<petición>"...
#   subject_launch "$ASK"
#   { echo "## git log"; g log --oneline --all; } | subject_save
#   subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md   # copia plana y limpia en <salida>/<etiqueta>/
# Variables: RUNS_DIR (obligatoria, en el scratchpad), MODEL (sonnet), MAX_TURNS (60), MOLD_NAME (repo),
# EXTRA_DISALLOWED («PowerShell» en escenarios con worktrees, task 0040), NODE (node),
# SETTINGS (el JSON de --settings: sin él, solo deshabilita el kit instalado), EXTRA_ALLOWED (herramientas
# que se suman a --allowedTools, como un servidor MCP: task 0077),
# DRY_RUN=1 (un stream falso en lugar de claude -p, con coste DRY_COST: 0.5).
HEADLESS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$(dirname "$HEADLESS")")"
NODE="${NODE:-node}"
# La salida versionada de una campaña no pasa de 140 caracteres de ruta relativa (PathLength.Tests.ps1).
MAX_PATH=140

die() { echo "[${LABEL:-sujeto}] $*" >&2; exit 1; }

subject_init() {
  # --plugin-dir en ruta Windows: con la de Git Bash, 4 de 10 sujetos recibieron «Unknown skill» (task 0009).
  KIT="$(cygpath -m "$1" 2>/dev/null || echo "$1")"; LABEL="$2"; OUT="$3"
  RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
  case "$RUNS" in *scratchpad*) ;; *) die "RUNS_DIR fuera del scratchpad: $RUNS" ;; esac
  [ -f "$KIT/skills/$4/SKILL.md" ] || die "sin la skill $4 en la copia del kit $KIT (task 0040)"
  mkdir -p "$RUNS" "$OUT"
  RUNS="$(cd "$RUNS" && pwd)"
  RUN="$RUNS/$LABEL"; R="$RUN/${MOLD_NAME:-repo}"
  rm -rf "$RUN"; mkdir -p "$R"
  JSONL="$RUNS/$LABEL.jsonl"
}

g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture -c core.autocrlf=false "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }

subject_launch() {
  cd "$R" || die "sin molde en $R"
  # Una petición ejecutada fuera del molde corrió una vez sobre el worktree del kit (2026-09-23).
  case "$(pwd)/" in "$RUNS"/*) ;; *) die "cwd fuera del scratchpad: $(pwd)" ;; esac
  BEFORE=$(g rev-parse --short HEAD 2>/dev/null)
  local settings="${SETTINGS:-"{\"enabledPlugins\":{\"sdd-kit@sdd-kit\":false}}"}"
  if [ "${DRY_RUN:-}" = 1 ]; then
    printf '%s\n' \
      '{"type":"assistant","message":{"content":[{"type":"text","text":"En seco desde '"$HOME"' · permitidas extra: '"${EXTRA_ALLOWED:-}"'"},{"type":"tool_use","name":"Bash","input":{"command":"ls '"$R"'"}}]}}' \
      '{"type":"result","num_turns":1,"total_cost_usd":'"${DRY_COST:-0.5}"',"result":"hecho"}' > "$JSONL"
    return
  fi
  # Sin < /dev/null, un aviso de stdin precede al JSON. La mensajería entre sesiones va bloqueada (task 0008).
  # shellcheck disable=SC2086
  claude -p --model "${MODEL:-sonnet}" --settings "$settings" \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "PowerShell(*)" "Agent" ${EXTRA_ALLOWED:-} \
    --disallowedTools "SendMessage" "ListAgents" "AskUserQuestion" ${EXTRA_DISALLOWED:-} \
    --max-turns "${MAX_TURNS:-60}" \
    --output-format stream-json --verbose "$1" < /dev/null > "$JSONL" 2> "$RUNS/$LABEL.err"
}

# Ruta de salida comprobada: dentro del repo, relativa y por debajo de MAX_PATH.
out_path() {
  local rel="${1#"$REPO_ROOT"/}"
  [ "$rel" != "$1" ] && [ ${#rel} -ge $MAX_PATH ] && die "ruta de ${#rel} caracteres (máximo $((MAX_PATH - 1))): $rel"
  echo "$1"
}

clean() { "$NODE" "$HEADLESS/extract.mjs" clean "$RUN"; }

# El estado del molde por la entrada estándar; con él, el extracto de tool calls y el de textos.
subject_save() {
  local state tools texts
  state=$(out_path "$OUT/$LABEL.state.txt") && tools=$(out_path "$OUT/$LABEL.tools.txt") && texts=$(out_path "$OUT/$LABEL.texts.txt") || exit 1
  clean > "$state"
  "$NODE" "$HEADLESS/extract.mjs" tools "$JSONL" "$RUN" > "$tools"
  "$NODE" "$HEADLESS/extract.mjs" texts "$JSONL" "$RUN" > "$texts"
  echo "[$LABEL] listo"
}

# Un fichero del molde, plano: la ruta completa de .docs/ pasó de 140 caracteres (tasks 0062 y 0063).
subject_keep() {
  case "$2" in */*) echo "[$LABEL] $2: solo copia plana, sin carpetas (<etiqueta>/walkthrough-task-<id>.md)" >&2; return 1 ;; esac
  [ -f "$1" ] || { echo "[$LABEL] sin $1" >&2; return 1; }
  local dest
  dest=$(out_path "$OUT/$LABEL/$2") || return 1
  mkdir -p "$OUT/$LABEL"
  clean < "$1" > "$dest"
}
