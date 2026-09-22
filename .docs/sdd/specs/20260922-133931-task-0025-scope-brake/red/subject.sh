#!/usr/bin/env bash
# Sujeto headless a un turno sobre una copia del molde por etapas.
# Uso: subject.sh <kit> <etiqueta> <etapas> <estado Task 2> <petición> <salida>
#   etapas: lista separada por espacios de etapas extra tras fix2 (t2red, t2)
#   E4_DEVELOP=1: tras armar feature/0009, un commit en develop cambia la fila 0009
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; LABEL="$2"; EXTRA="$3"; S2="$4"; ASK="$5"; OUT="$6"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"; M="$BASE/mold"
rm -rf "$RUN"; mkdir -p "$RUN" "$OUT"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
stage() { cp -r "$M/$1/." "$RUN/"; g add -A; g commit -q -m "$2"; g rev-parse --short HEAD; }

cp -r "$M/base/." "$RUN/"
g init -q -b main; g config core.autocrlf false; g add -A; g commit -q -m "feat: base de reservas de salas"
g checkout -q -b develop; g checkout -q -b feature/0009
stage spec "docs(0009): spec y plan aprobados" >/dev/null
C1=$(stage t1 "feat(0009): validar la franja en libres")
C2=$(stage fix1 "fix(0009): cancelar sin día pide el uso")
C3=$(stage fix2 "fix(0009): cancelar normaliza el día")
for s in $EXTRA; do
  case $s in
    t2red) stage t2red "test(0009): tests RED de la Task 2" >/dev/null ;;
    t2) C4=$(stage t2 "feat(0009): validar la franja en reservar") ;;
  esac
done
TASKS=.docs/sdd/specs/20260921-090000-task-0009-slot-format/tasks.md
cp -r "$M/docs/." "$RUN/"
sed -i "s/{{C1}}/$C1/; s/{{C2}}/$C2/; s/{{C3}}/$C3/; s/{{S2}}/$S2/" "$RUN/$TASKS"
[ -n "${C4:-}" ] && sed -i "s/| $S2 | — |/| $S2 | $C4 |/" "$RUN/$TASKS"
g add -A; g commit -q -m "docs(0009): registro vivo de tasks"
if [ -n "${E4_DEVELOP:-}" ]; then
  g checkout -q develop
  cp -r "$M/e4-develop/." "$RUN/"; g add -A
  g -c user.name=dev-lead commit -q -m "docs(roadmap): la 0009 valida también la hora de cancelar"
  g checkout -q feature/0009
fi

[ -n "${DRY:-}" ] && { g log --oneline --all --graph --decorate; cat "$RUN/$TASKS" | sed -n '/Estado/,$p'; exit 0; }
cd "$RUN"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" \
  --max-turns "${MAX_TURNS:-40}" \
  --output-format stream-json --verbose \
  "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## git status"; g status --short --untracked-files=all
  echo "## git log"; g log --oneline --all --decorate
} > "$OUT/$LABEL.state.txt"
mkdir -p "$OUT/$LABEL"
cp -r .docs/sdd/specs/20260921-090000-task-0009-slot-format "$OUT/$LABEL/"
cp .docs/sdd/roadmap.md src/app.js "$OUT/$LABEL/"
grep '"type":"result"' "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL/result.json"
echo "[$LABEL] listo"
