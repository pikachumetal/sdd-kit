#!/usr/bin/env bash
# Sujeto headless de la 0032 (encargo del revisor final) sobre el repo de juguete salas.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   f1  feature lite que integró develop a mitad, con evidencia red/ en la spec y develop avanzado tras el merge:
#       ¿el paquete del revisor final deja fuera la otra feature y la evidencia? ¿qué PLAN_FILE usa? ¿con qué despacha?
#   f2  f1 con remoto: la otra feature entra por origin/develop y el develop local se queda atrasado.
#   r1  SDD, implementador Sonnet con el trailer Co-Authored-By de Opus: ¿el revisor de task lo reporta?
#   p1  paso 5 en delegate, spec aprobada de una sola task: ¿con qué modelo escribe el plan al revisor final?
# La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(cd "$BASE/../.." && pwd)"
REPO="$(cd "$SPECS/../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
SC="$3"
case $SC in f1|f2|r1|p1) ;; *) die "escenario desconocido: $SC" ;; esac
MOLD_NAME=salas
subject_init "$1" "$2" "$4" sdd-start-feature
SPEC=.docs/sdd/specs/20260927-100000-feature-0012-franja
. "$SPECS/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
. "$SPECS/20260924-105352-task-0057-native-adapt/red/mold.sh"
TRAILER="Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"

as_feature() { sed -i -e "s/^id: .*/id: ${SPEC##*/}/" -e 's/^task: 0012$/feature: 0012/' "$R/$SPEC/spec.md"; }
lite_spec() { as_feature; sed -i 's/^mode: full$/mode: lite/' "$R/$SPEC/spec.md"; }
one_scenario_spec() {
  as_feature
  sed -i '/^\*\*ADDED — La franja se valida al consultar libres\*\*$/,/^- THEN falla con el mismo mensaje$/d' "$R/$SPEC/spec.md"
}

red_evidence() {
  put $SPEC/red/subject.sh <<'EOF'
#!/usr/bin/env bash
# Lanzador de la prueba manual de la franja.
node bin/salas.js reservar Norte 1012
EOF
  mkdir -p "$R/$SPEC/red/out"
  for i in $(seq 1 400); do echo "{\"type\":\"assistant\",\"turn\":$i,\"text\":\"salas reservar Norte 1012 → Franja no válida: usa HH-HH, p. ej. 10-12\"}"; done > "$R/$SPEC/red/out/r-1.jsonl"
}

other_feature_on_develop() {
  g checkout -q develop
  put skills/otra/SKILL.md <<'EOF'
# otra

Guía del listado de salas.
EOF
  put src/rooms.js <<'EOF'
export const ROOMS = ['Norte', 'Sur'];
EOF
  commit "feat(0013): listado de salas" "Añade el listado de salas y su guía."
  g checkout -q feature/0012
}

build_f1() {
  spec_files; lite_spec; commit "docs(0012): spec lite de la feature 0012"
  task1_red; task1_code; commit "feat(0012): validar el formato de la franja al reservar" "La reserva rechaza una franja que no casa con HH-HH."
  red_evidence; commit "test(0012): evidencia de la prueba manual" "Salida de la prueba manual de la franja."
  other_feature_on_develop
  g -c core.editor=true merge -q --no-ff develop -m "merge: integrar develop en la feature 0012"
  task2_code; commit "feat(0012): validar el formato de la franja al consultar libres" "La consulta de libres rechaza la franja mal formada."
  g checkout -q develop
  printf "export const FLOORS = { Norte: 1, Sur: 2 };\n" >> "$R/src/rooms.js"; commit "feat(0014): salas por planta"
  g checkout -q feature/0012
}

build_f2() {
  git clone -q --bare "$R" "$RUN/origin.git"; g remote add origin "$RUN/origin.git"; g fetch -q origin
  spec_files; lite_spec; commit "docs(0012): spec lite de la feature 0012"
  task1_red; task1_code; commit "feat(0012): validar el formato de la franja al reservar" "La reserva rechaza una franja que no casa con HH-HH."
  red_evidence; commit "test(0012): evidencia de la prueba manual" "Salida de la prueba manual de la franja."
  local other="$RUN/other"; git clone -q -b develop "$RUN/origin.git" "$other"
  mkdir -p "$other/skills/otra"; printf '# otra

Guía del listado de salas.
' > "$other/skills/otra/SKILL.md"
  printf "export const ROOMS = ['Norte', 'Sur'];
" > "$other/src/rooms.js"
  git -C "$other" -c user.email=fixture@example.com -c user.name=Fixture add -A
  git -C "$other" -c user.email=fixture@example.com -c user.name=Fixture commit -q -m "feat(0013): listado de salas" -m "Añade el listado de salas y su guía."
  git -C "$other" push -q origin develop; rm -rf "$other"
  g fetch -q origin
  g -c core.editor=true merge -q --no-ff origin/develop -m "merge: integrar origin/develop en la feature 0012"
  task2_code; commit "feat(0012): validar el formato de la franja al consultar libres" "La consulta de libres rechaza la franja mal formada."
}

build_r1() {
  spec_files; as_feature; plan_files
  sed -i 's/^- Implementadores y revisores Sonnet, effort medio\.$/- Implementadores y revisores: `sdd-kit:effort-medium` + `model: sonnet`./' "$R/$SPEC/plan.md"
  sed -i 's/^\*\*Modelo\*\*: Sonnet, effort medio$/**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`/' "$R/$SPEC/plan.md"
  sed -i 's/^## Restricciones globales$/**Ejecución**: subagent, porque se quiere revisión por task\n\n## Restricciones globales/' "$R/$SPEC/plan.md"
  commit "docs(0012): abrir la feature 0012" "Spec aprobada, plan y registro de tasks."
  local b; b=$(g rev-parse --short HEAD)
  task1_red; task1_code
  g add -A; g commit -q -m "feat(0012): validar el formato de la franja al reservar" -m "La reserva rechaza una franja que no casa con HH-HH, con el mensaje literal de la spec." -m "$TRAILER"
  put .superpowers/sdd/plan/progress.md <<EOF
# SDD ledger — plan: $SPEC/plan.md

Task 1: BASE $b
Task 1: implementer DONE (sdd-kit:effort-medium + sonnet), commit $(g rev-parse --short HEAD)
EOF
}

build_p1() { spec_files; one_scenario_spec; commit "docs(0012): spec aprobada de la feature 0012"; }

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0012
build_$SC
[ -n "${DRY:-}" ] && { g log --oneline --graph --all; g status --short; exit 0; }

MAX_TURNS=${MAX_TURNS:-50}
case $SC in
  f1|f2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 de \`feature/0012\`: modo lite, spec aprobada en \`$SPEC/spec.md\`, ejecución Native. La implementación está terminada y commiteada. Toca la revisión final de rama: prepara el paquete de review y escribe en \`despacho-final.md\`, en la raíz del repo, los parámetros exactos con los que despacharías al revisor final (subagent_type, model y el prompt completo), sin despacharlo. Para ahí." ;;
  r1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 de \`feature/0012\`, que se ejecuta con subagent-driven-development según su plan. El implementador de la Task 1, despachado con \`sdd-kit:effort-medium\` + \`model: sonnet\`, ha vuelto DONE con el commit $(g rev-parse --short HEAD); el ledger está en \`.superpowers/sdd/plan/progress.md\`. Despacha el revisor de la Task 1 y, cuando vuelva, copia su informe literal en \`review-task-1.md\`, en la raíz del repo, y para, sin arreglar nada ni seguir con la Task 2." ;;
  p1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 de \`feature/0012\`: la spec está aprobada por el dev-lead en \`$SPEC/spec.md\`. Toca el paso 5: escribe el plan.md y para ahí, sin implementar nada." ;;
esac
subject_launch "$ASK"
{ echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"; echo "## git log"; g log --oneline --graph --all; echo "## git status"; g status --short --untracked-files=all; echo "## ficheros .diff"; find "$R" -name '*.diff' -not -path '*/.git/*' | sed "s#$R/##"; } | subject_save
for f in $(find "$R" -name '*.diff' -not -path '*/.git/*'); do subject_keep "$f" "$(basename "$f")"; done
[ -f "$R/despacho-final.md" ] && subject_keep "$R/despacho-final.md" despacho-final.md
[ -f "$R/review-task-1.md" ] && subject_keep "$R/review-task-1.md" review-task-1.md
[ -f "$R/$SPEC/plan.md" ] && subject_keep "$R/$SPEC/plan.md" plan.md
exit 0
