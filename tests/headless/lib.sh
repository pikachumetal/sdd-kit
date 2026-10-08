#!/usr/bin/env bash
# Funciones de referencia para el subject.sh de una campaña de sujetos headless (patch 0076). Se cargan, no se copian:
#   . "<repo>/tests/headless/lib.sh"
#   subject_init "$1" "$2" "$4" <skill medida>     # kit, etiqueta, salida (argumentos de run.sh)
#   ...molde en $R con g, put y commit; ASK="<petición>"...
#   subject_launch "$ASK"
#   { echo "## git log"; g log --oneline --all; } | subject_save
#   subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md   # copia plana y limpia en <salida>/<etiqueta>/
#   put_kit_marker '"ids": {"mode": "sequence"}'           # sdd-kit.json del molde con la versión del kit (kit_version)
#   subject_resume "<mensaje>"                            # segundo turno sobre la misma sesión
#   subject_converse <hoja de la persona> <turnos máximos> # la persona (haiku) contesta hasta que el sujeto deja de preguntar
# Variables: RUNS_DIR (obligatoria, en el scratchpad; cada sujeto va a RUNS_DIR/<PHASE>/<etiqueta>), PHASE (red), MODEL (sonnet), MAX_TURNS (60), MOLD_NAME (repo),
# EXTRA_DISALLOWED («PowerShell» en escenarios con worktrees, task 0040), NODE (node),
# SETTINGS (el JSON de --settings: sin él, solo deshabilita el kit instalado), EXTRA_ALLOWED (herramientas
# que se suman a --allowedTools, como un servidor MCP),
# SUPERPOWERS_DIR (sujeto sin la configuración del usuario, ni su CLAUDE.md ni sus plugins, y con superpowers cargado desde esa ruta),
# SUBJECT_TIMEOUT (segundos de reloj por sujeto; 0, el valor por omisión, sin tope),
# TURN2 (mensaje del segundo turno: subject_launch reanuda la sesión con subject_resume),
# DRY_RESULT (texto del result en seco; con «?», subject_converse sigue preguntando), DRY_PERSONA_COST (coste de la persona en seco),
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
  # Con dependencies y sin SUPERPOWERS_DIR, el kit no carga: «unmet dependency» (ticket de la feature 0095 §2).
  if [ -z "${SUPERPOWERS_DIR:-}" ] && grep -q '"dependencies"' "$KIT/.claude-plugin/plugin.json" 2>/dev/null; then
    die "el kit declara dependencies: define SUPERPOWERS_DIR (ruta de superpowers)"
  fi
  mkdir -p "$RUNS" "$OUT"
  # Una carpeta por fase: dos fases a la vez con el mismo RUNS_DIR se borraban el molde (ticket del patch 0082 §1).
  RUNS="$(cd "$RUNS" && pwd)/${PHASE:-red}"
  # subject_launch hace cd al molde: un OUT relativo perdía las salidas (tickets 0077 §2 y 0064 §1).
  OUT="$(cd "$OUT" && pwd)"
  RUN="$RUNS/$LABEL"; R="$RUN/${MOLD_NAME:-repo}"
  rm -rf "$RUN"; mkdir -p "$R"; MOLD_IS_REPO=
  JSONL="$RUNS/$LABEL.jsonl"
}

g() {
  [ "$1" = init ] || [ -n "${MOLD_IS_REPO:-}" ] || mold_is_repo
  git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture -c core.autocrlf=false "$@"
}
# Sin g init, git sube hasta el repo que contiene el molde: un %TEMP% dentro de un repo perdió su HEAD (ticket 0086 §1).
# --show-cdup vacío es --show-toplevel igual a $R, sin comparar C:/… con /c/… ni nombres cortos de Windows.
mold_is_repo() {
  local cdup
  cdup=$(git -C "$R" rev-parse --show-cdup 2>/dev/null) && [ -z "$cdup" ] \
    || die "el molde $R no es su propio repo git: falta g init en el subject.sh antes del primer g"
  MOLD_IS_REPO=1
}
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }

subject_launch() {
  cd "$R" || die "sin molde en $R"
  # Config de línea de comandos: gana a la global también en `git config user.name`, que GIT_AUTHOR_NAME no cambia.
  # Sin ella, 3 de 10 sujetos pusieron el nombre del dev-lead en las salidas (ticket del patch 0080 §2).
  export GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=user.name GIT_CONFIG_VALUE_0=Fixture \
    GIT_CONFIG_KEY_1=user.email GIT_CONFIG_VALUE_1=fixture@example.com
  # Una petición ejecutada fuera del molde corrió una vez sobre el worktree del kit (2026-09-23).
  case "$(pwd)/" in "$RUNS"/*) ;; *) die "cwd fuera del scratchpad: $(pwd)" ;; esac
  BEFORE=$(g rev-parse --short HEAD 2>/dev/null)
  local settings="${SETTINGS:-"{\"enabledPlugins\":{\"sdd-kit@sdd-kit\":false}}"}"
  # Sin esa clave, el sujeto carga también el kit instalado, y mide la caché en vez de la copia.
  case "$settings" in *'"sdd-kit@sdd-kit":false'*) ;; *) die "SETTINGS sin deshabilitar el kit instalado: $settings" ;; esac
  build_claude_args "$settings"
  printf '%s\n' "${CLAUDE_ARGS[@]}" "$1" > "$RUNS/$LABEL.args"
  if [ "${DRY_RUN:-}" = 1 ]; then
    printf '%s\n' \
      '{"type":"system","subtype":"init","session_id":"dry-'"$LABEL"'"}' \
      '{"type":"assistant","message":{"content":[{"type":"text","text":"En seco desde '"$HOME"' · permitidas extra: '"${EXTRA_ALLOWED:-}"' · git: '"$(git config user.name) <$(git config user.email)>"'"},{"type":"tool_use","name":"Bash","input":{"command":"ls '"$R"'"}}]}}' \
      '{"type":"result","num_turns":1,"total_cost_usd":'"${DRY_COST:-0.5}"',"result":"'"${DRY_RESULT:-hecho}"'"}' > "$JSONL"
  else
    : > "$RUNS/$LABEL.err"
    run_claude "$1" > "$JSONL" || return $?
  fi
  [ -n "${TURN2:-}" ] && subject_resume "$TURN2"
  return 0
}

# Sin < /dev/null, un aviso de stdin precede al JSON.
# timeout no ejecuta builtins: con `timeout 720 command claude` no arranca ningún sujeto.
run_claude() {
  timeout "${SUBJECT_TIMEOUT:-0}" "$(type -P claude)" "${CLAUDE_ARGS[@]}" "$@" < /dev/null 2>> "$RUNS/$LABEL.err"
  local rc=$?
  [ $rc -eq 124 ] && echo "[$LABEL] tope de $SUBJECT_TIMEOUT s: sujeto cortado" >&2
  return $rc
}

# Segundo turno sobre la sesión real del primero: su molde es lo que el primero dejó, no el relato de un ticket.
# --resume da un total_cost_usd acumulado; run.sh ya cuenta solo el último RESULTADO.
subject_resume() {
  local session
  session=$(grep -o '"session_id":"[^"]*"' "$JSONL" | head -n 1 | cut -d'"' -f4)
  [ -n "$session" ] || die "sin session_id: no se puede reanudar"
  printf '%s\n' "${CLAUDE_ARGS[@]}" --resume "$session" "$1" > "$RUNS/$LABEL.resume.args"
  if [ "${DRY_RUN:-}" = 1 ]; then
    local cost
    cost=$(awk -v c="${DRY_COST:-0.5}" 'BEGIN { print c * 2 }')
    echo '{"type":"result","num_turns":2,"total_cost_usd":'"$cost"',"result":"'"${DRY_RESULT:-hecho}"'"}' >> "$JSONL"
    return
  fi
  run_claude --resume "$session" "$1" >> "$JSONL"
}

# Conversación con una persona: un modelo barato contesta con su hoja hasta que el sujeto deja de preguntar o llega al tope.
# Su coste va al último RESULTADO, que es el único que cuenta run.sh.
subject_converse() {
  local sheet="$1" max="$2" turn=0 asked answer persona_cost=0
  while [ "$turn" -lt "$max" ]; do
    asked=$("$NODE" "$HEADLESS/extract.mjs" last "$JSONL")
    case "$asked" in *'?'*) ;; *) break ;; esac
    turn=$((turn + 1))
    answer=$(persona_reply "$sheet" "$asked" "$RUNS/$LABEL.persona-$turn.txt") || return $?
    persona_cost=$(awk -v a="$persona_cost" -v b="$(cat "$RUNS/$LABEL.persona-$turn.txt")" 'BEGIN { print a + b }')
    subject_resume "$answer"
  done
  [ "$turn" -gt 0 ] && append_persona_cost "$persona_cost" "$turn"
  return 0
}

# Imprime la respuesta y deja el coste de la llamada en el fichero del tercer argumento.
persona_reply() {
  local prompt="Eres el usuario de esta hoja: $(cat "$1"). Contesta en castellano solo lo que el agente pregunta, en una o dos frases; lo que la hoja no dice, «no sé». El agente dice: $2"
  if [ "${DRY_RUN:-}" = 1 ]; then echo "${DRY_PERSONA_COST:-0}" > "$3"; echo "Respuesta de la persona."; return; fi
  local reply
  reply=$(timeout "${SUBJECT_TIMEOUT:-0}" "$(type -P claude)" -p --model haiku --output-format json --max-turns 1 "$prompt" < /dev/null 2>> "$RUNS/$LABEL.err") || return $?
  echo "$reply" | "$NODE" -e 'const r = JSON.parse(require("fs").readFileSync(0, "utf8")); require("fs").writeFileSync(process.argv[1], String(r.total_cost_usd ?? 0)); process.stdout.write(r.result ?? "")' "$3"
}

append_persona_cost() {
  local subject_cost
  subject_cost=$(grep -o '"total_cost_usd":[0-9.]*' "$JSONL" | tail -n 1 | cut -d: -f2)
  echo '{"type":"result","num_turns":'"$2"',"total_cost_usd":'"$(awk -v a="$subject_cost" -v b="$1" 'BEGIN { print a + b }')"',"result":"conversación con persona: '"$2"' respuestas"}' >> "$JSONL"
}

# La versión que el hook exige al proyecto: la mayor entre plugin.json y la última migración del kit.
kit_version() {
  local plugin migrations
  plugin=$(grep -o '"version"[^,}]*' "$KIT/.claude-plugin/plugin.json" 2>/dev/null | grep -o '[0-9][0-9.]*')
  migrations=$(ls "$KIT/skills/sdd-init-brownfield/references/migrations" 2>/dev/null | sed -n 's/^v\([0-9.]*\)\.md$/\1/p')
  printf '%s\n' $plugin $migrations | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1
}

# Un marcador copiado de otra campaña envejece: con uno menor que la última migración, el hook manda a migrar.
put_kit_marker() {
  echo "{\"version\": \"$(kit_version)\", $1}" | put .docs/sdd/sdd-kit.json
}

# Los argumentos de claude -p en CLAUDE_ARGS; subject_launch los deja en <etiqueta>.args para poder comprobarlos.
build_claude_args() {
  CLAUDE_ARGS=(-p --model "${MODEL:-sonnet}" --settings "$1" --plugin-dir "$KIT" --add-dir "$KIT")
  # La carpeta de ejecución, junto al molde: sin ella, los sujetos no abrían sus capturas (ticket de la feature 0099 §4).
  CLAUDE_ARGS+=(--add-dir "$(cygpath -m "$RUN" 2>/dev/null || echo "$RUN")")
  # El CLAUDE.md del dev-lead ya enruta al kit: medir con él da por buena una puerta que un dev sin él no tiene.
  if [ -n "${SUPERPOWERS_DIR:-}" ]; then
    CLAUDE_ARGS+=(--setting-sources "" --plugin-dir "$SUPERPOWERS_DIR")
  fi
  # La mensajería entre sesiones va bloqueada (task 0008).
  # shellcheck disable=SC2206
  CLAUDE_ARGS+=(--permission-mode acceptEdits --allowedTools "Bash(*)" "PowerShell(*)" "Agent" ${EXTRA_ALLOWED:-})
  # shellcheck disable=SC2206
  CLAUDE_ARGS+=(--disallowedTools "SendMessage" "ListAgents" "AskUserQuestion" ${EXTRA_DISALLOWED:-})
  CLAUDE_ARGS+=(--max-turns "${MAX_TURNS:-60}" --output-format stream-json --verbose)
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
