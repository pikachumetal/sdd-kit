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
#   subject_show feature/0013:.docs/sdd/roadmap.md roadmap.md # un fichero de otra rama, con las reglas de subject_keep
#   seed_transcript feature/0042 <<'EOF' ... EOF          # transcripts del trabajo, «<fecha ISO> <user|assistant> <texto>» por línea;
#                                                         # la carpeta del molde se borra al acabar
#   subject_ports                                         # puertos del sujeto (PORT y los del stream); subject_cleanup para lo que arrancó con el sujeto
# Variables: RUNS_DIR (obligatoria, en el scratchpad o en .temp/ del repo; cada sujeto va a RUNS_DIR/<PHASE>/<etiqueta>), PHASE (red), MODEL (sonnet), MAX_TURNS (60), MOLD_NAME (repo),
# EXTRA_DISALLOWED («PowerShell» en escenarios con worktrees, task 0040), NODE (node),
# SETTINGS (el JSON de --settings: sin él, deshabilita el kit instalado y carga el hook deny-kill.mjs; uno propio lo lleva,
# con la ruta de DENY_KILL_HOOK), EXTRA_ALLOWED (herramientas que se suman a --allowedTools, como un servidor MCP),
# PORT (puerto del molde, si arranca un servidor), CLAUDE_CONFIG_DIR (raíz de los transcripts de seed_transcript; sin ella, ~/.claude),
# SUPERPOWERS_DIR (sujeto sin la configuración del usuario, ni su CLAUDE.md ni sus plugins, y con superpowers cargado desde esa ruta),
# SUBJECT_TIMEOUT (segundos de reloj por sujeto; 0, el valor por omisión, sin tope),
# TURN2 (mensaje del segundo turno: subject_launch reanuda la sesión con subject_resume),
# DRY_RESULT (texto del result en seco; con «?», subject_converse sigue preguntando), DRY_PERSONA_COST (coste de la persona en seco),
# DRY_RUN=1 (un stream falso en lugar de claude -p, con coste DRY_COST: 0.5),
# KEEP_MOLD=1 (al salir no se borra el molde del sujeto; su carpeta de Claude Code en CLAUDE_CODE_TMPDIR o TEMP, siempre).
HEADLESS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$(dirname "$HEADLESS")")"
NODE="${NODE:-node}"
# Ruta Windows: node la recibe del hook de Claude Code, no de Git Bash.
DENY_KILL_HOOK="$(cygpath -m "$HEADLESS/deny-kill.mjs" 2>/dev/null || echo "$HEADLESS/deny-kill.mjs")"
# La salida versionada de una campaña no pasa de 140 caracteres de ruta relativa (PathLength.Tests.ps1).
MAX_PATH=140

die() { echo "[${LABEL:-sujeto}] $*" >&2; exit 1; }

subject_init() {
  # --plugin-dir en ruta Windows: con la de Git Bash, 4 de 10 sujetos recibieron «Unknown skill» (task 0009).
  KIT="$(cygpath -m "$1" 2>/dev/null || echo "$1")"; LABEL="$2"; OUT="$3"
  RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
  case "$(cygpath -u "$RUNS" 2>/dev/null || echo "$RUNS")" in *scratchpad*|"$REPO_ROOT"/.temp/*) ;; *) die "RUNS_DIR fuera del scratchpad o de .temp/: $RUNS" ;; esac
  [ -f "$KIT/skills/$4/SKILL.md" ] || die "sin la skill $4 en la copia del kit $KIT (task 0040)"
  # Con .docs/, el sujeto leyó la spec de lo que se medía (feature 0150).
  { [ -e "$KIT/.docs" ] || [ -e "$KIT/tests" ]; } && die "la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin"
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
  rm -rf "$RUN"; mkdir -p "$R"; MOLD_IS_REPO=; trap subject_cleanup EXIT
  JSONL="$RUNS/$LABEL.jsonl"; LEAK="$RUNS/$LABEL.leak"; rm -f "$LEAK"
  # La parada por puerto solo alcanza a lo que arrancó después: no a los servidores ni a los MCP que ya escuchaban.
  SUBJECT_STARTED=$(date +%s)
}

g() {
  [ "$1" = init ] || [ -n "${MOLD_IS_REPO:-}" ] || mold_is_repo
  # core.longpaths: un molde calcado de sdd-project-template falló en git add con «unable to index file» (feature 0089).
  git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture -c core.autocrlf=false -c core.longpaths=true "$@"
}
# Sin g init, git sube hasta el repo que contiene el molde: un %TEMP% dentro de un repo perdió su HEAD (ticket 0086 §1).
# --show-cdup vacío es --show-toplevel igual a $R, sin comparar C:/… con /c/… ni nombres cortos de Windows.
mold_is_repo() {
  local cdup
  cdup=$(git -C "$R" rev-parse --show-cdup 2>/dev/null) && [ -z "$cdup" ] \
    || die "el molde $R no es su propio repo git: falta g init en el subject.sh antes del primer g"
  MOLD_IS_REPO=1
}
# El molde y la carpeta que Claude Code crea para su cwd pesan; el stream y las salidas ya están guardados.
subject_cleanup() {
  [ -n "${LABEL:-}" ] && [ "${RUN#"$RUNS"/}" != "$RUN" ] || { echo "[${LABEL:-sujeto}] no se borra $RUN: fuera de $RUNS o sin etiqueta" >&2; return 0; }
  stop_subject_ports
  local seed
  seed=$(seed_dir) && compgen -G "$seed/seed-*.jsonl" > /dev/null && rm -rf "${seed:?}"
  remove_claude_folder
  [ "${KEEP_MOLD:-}" = 1 ] || rm -rf "$RUN"
  # Una salida con la identidad de la máquina no se guardó: el sujeto sale con error aunque save_extract corriera en una tubería.
  [ ! -f "$LEAK" ] || exit 1
}

# Un sujeto web arranca en el puerto que elige, no en el del molde: 5 de 6 en la 0036 (ticket de la feature 0036 §3).
subject_ports() {
  { [[ "${PORT:-}" =~ ^[0-9]+$ ]] && echo "$PORT"; [ -f "${JSONL:-}" ] && grep -oE '(PORT=|localhost:)[0-9]{4,5}' "$JSONL" | grep -oE '[0-9]+$'; } | sort -un | paste -sd, -
}

# Por el PID que escucha en el puerto y arrancó con el sujeto, nunca por nombre: en la máquina corren los servidores
# y los MCP de otras sesiones, y el stream nombra puertos que el sujeto solo leyó (revisión final de la feature 0214).
stop_subject_ports() {
  local ports script result listening
  ports=$(subject_ports)
  [ -n "$ports" ] && [ -n "${SUBJECT_STARTED:-}" ] || return 0
  # Como argumento: con -Command - y el script por la entrada estándar, pwsh no ejecuta las líneas partidas.
  script=$(cat <<EOF
\$since = [DateTimeOffset]::FromUnixTimeSeconds($SUBJECT_STARTED).LocalDateTime
\$mine = @(Get-NetTCPConnection -LocalPort $ports -State Listen -ErrorAction SilentlyContinue |
  Where-Object { (Get-Process -Id \$_.OwningProcess -ErrorAction SilentlyContinue).StartTime -ge \$since })
\$mine | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }
'comprobado:' + ((\$mine.LocalPort | Sort-Object -Unique) -join ',')
EOF
)
  result=$(pwsh -NoProfile -Command "$script" 2>/dev/null | tr -d '\r')
  case "$result" in
    *comprobado:*) listening="${result##*comprobado:}" ;;
    *) listening="no comprobado (pwsh no respondió)" ;;
  esac
  echo "puertos del sujeto: $ports · escuchando al acabar: ${listening:-ninguno}" >> "$RUNS/$LABEL.err"
}

# Claude Code nombra la carpeta con la ruta Windows del cwd y cada carácter no alfanumérico como «-».
mold_slug() { (cygpath -w "$R" 2>/dev/null || echo "$R") | sed 's/[^A-Za-z0-9]/-/g'; }

remove_claude_folder() {
  local base slug
  base=$(cygpath -u "${CLAUDE_CODE_TMPDIR:-${TEMP:-/tmp}}" 2>/dev/null || echo "${CLAUDE_CODE_TMPDIR:-${TEMP:-/tmp}}")
  slug=$(mold_slug)
  [ -n "$slug" ] && rm -rf "${base:?}/claude/$slug"
}

# La carpeta de transcripts del molde; sin molde no hay ninguna: con el slug vacío sería projects/ entero.
seed_dir() {
  local slug
  slug=$(mold_slug)
  [ -n "${R:-}" ] && [ -n "$slug" ] || return 1
  echo "$(cygpath -u "${CLAUDE_CONFIG_DIR:-$HOME/.claude}" 2>/dev/null || echo "${CLAUDE_CONFIG_DIR:-$HOME/.claude}")/projects/$slug"
}

# Transcripts del trabajo para un THEN que lee sdd session tokens: sin ellos da 0,00 h (feature 0188).
# Una línea por entrada: <fecha ISO> <user|assistant> <texto>. subject_cleanup borra la carpeta.
seed_transcript() {
  SEED_DIR=$(seed_dir) || die "seed_transcript antes de subject_init: sin molde no hay carpeta de transcripts"
  mkdir -p "$SEED_DIR"
  local n=1
  while [ -e "$SEED_DIR/seed-$n.jsonl" ]; do n=$((n + 1)); done
  "$NODE" -e '
    const [branch, out] = process.argv.slice(1);
    const usage = { input_tokens: 1, cache_read_input_tokens: 0, output_tokens: 1 };
    const entries = require("fs").readFileSync(0, "utf8").split("\n").filter((line) => line.trim()).map((line, i) => {
      const [timestamp, type, ...words] = line.split(" ");
      const text = words.join(" ");
      const message = type === "assistant"
        ? { model: "claude-sonnet-5", id: `seed-${i + 1}`, role: "assistant", content: [{ type: "text", text }], usage }
        : { role: "user", content: text };
      return JSON.stringify({ type, timestamp, gitBranch: branch, message });
    });
    require("fs").writeFileSync(out, entries.join("\n") + "\n");
  ' "$1" "$(cygpath -m "$SEED_DIR/seed-$n.jsonl" 2>/dev/null || echo "$SEED_DIR/seed-$n.jsonl")"
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
  # Entre comillas simples: dentro de ${SETTINGS:-…}, bash expande las llaves con comas y parte el JSON.
  local default='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node \"'"$DENY_KILL_HOOK"'\""}]}]}}'
  local settings="${SETTINGS:-$default}"
  # Sin esa clave, el sujeto carga también el kit instalado, y mide la caché en vez de la copia.
  case "$settings" in *'"sdd-kit@sdd-kit":false'*) ;; *) die "SETTINGS sin deshabilitar el kit instalado: $settings" ;; esac
  # Un sujeto que para node.exe por nombre tumba los MCP de las sesiones de la máquina (feature 0168).
  case "$settings" in *deny-kill.mjs*) ;; *) die "SETTINGS sin el hook deny-kill.mjs: añade \$DENY_KILL_HOOK a sus PreToolUse" ;; esac
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
  reply=$(timeout "${SUBJECT_TIMEOUT:-0}" "$(type -P claude)" -p --model haiku --setting-sources "" --output-format json --max-turns 1 "$prompt" < /dev/null 2>> "$RUNS/$LABEL.err") || return $?
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
  migrations=$(ls "$KIT/skills/sdd-upgrade/references/migrations" "$KIT/skills/sdd-init-brownfield/references/migrations" 2>/dev/null | sed -n 's/^v\([0-9.]*\)\.md$/\1/p')
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
  # Una instrucción del usuario que el escenario necesita: con --setting-sources "" no llega el CLAUDE.md del molde.
  [ -n "${APPEND_SYSTEM:-}" ] && CLAUDE_ARGS+=(--append-system-prompt "$APPEND_SYSTEM")
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
  # Los tres aunque falle uno: sin tools.txt, run.sh no cuenta el coste del sujeto.
  local saved=0
  save_extract "$state" clean || saved=1
  save_extract "$tools" "$NODE" "$HEADLESS/extract.mjs" tools "$JSONL" "$RUN" || saved=1
  save_extract "$texts" "$NODE" "$HEADLESS/extract.mjs" texts "$JSONL" "$RUN" || saved=1
  [ "$saved" = 1 ] || echo "[$LABEL] listo"
}

# A un temporal que se renombra solo si extract.mjs sale bien: con la identidad de git de la máquina sale con 3 (ticket de la feature 0160).
# La marca LEAK hace salir al sujeto con error en subject_cleanup, también si esto corre en una tubería.
save_extract() {
  local dest="$1"; shift
  if "$@" > "$dest.tmp"; then mv "$dest.tmp" "$dest"; return 0; fi
  rm -f "$dest.tmp"; : > "$LEAK"
  echo "[$LABEL] no se guarda $(basename "$dest"): el stream sigue en $JSONL" >&2
  return 1
}

flat_copy() {
  case "$1" in */*) echo "[$LABEL] $1: solo copia plana, sin carpetas (<etiqueta>/walkthrough-task-<id>.md)" >&2; return 1 ;; esac
}

# Un fichero del molde, plano: la ruta completa de .docs/ pasó de 140 caracteres (tasks 0062 y 0063).
subject_keep() {
  flat_copy "$2" || return 1
  [ -f "$1" ] || { echo "[$LABEL] sin $1" >&2; return 1; }
  local dest
  dest=$(out_path "$OUT/$LABEL/$2") || return 1
  mkdir -p "$OUT/$LABEL"
  save_extract "$dest" clean < "$1"
}

# Un fichero de otra rama, con las reglas de subject_keep: <rev>:<ruta> <copia plana>.
# Sin MSYS2_ARG_CONV_EXCL, Git Bash convierte rama:ruta en «rama\ruta;…» y el volcado sale vacío (ticket del patch 0075 §3);
# con él, -C necesita la ruta Windows del molde.
subject_show() {
  flat_copy "$2" || return 1
  local dump="$RUN/$2.show"
  MSYS2_ARG_CONV_EXCL='*' git -C "$(cygpath -m "$R" 2>/dev/null || echo "$R")" show "$1" > "$dump" \
    || { echo "[$LABEL] sin $1" >&2; return 1; }
  subject_keep "$dump" "$2"
}
