#!/usr/bin/env bash
# Sujeto de la batería de sdd-implement: un paso de la implementación, con los artefactos de ese punto ya escritos,
# o el encargo de un implementador como petición. Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
FIX="$HERE/fixtures"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
GUARD="$(cell Esperado | sed 's/^sdd-kit://')"
subject_init "$1" "$2" "$4" "$([ -d "$1/skills/$GUARD" ] && echo "$GUARD" || echo using-sdd)"
ASK="$(cell Petición)"
SDD_CLI="$KIT/cli/bin/sdd.js"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"'
F10=".docs/sdd/specs/20261008-100000-feature-0010-cancel-reason"
F12=".docs/sdd/specs/20261009-100000-feature-0012-cancelled-report"
F13=".docs/sdd/specs/20261009-110000-feature-0013-price-module"
F14=".docs/sdd/specs/20261009-120000-feature-0014-saved-reason"
F15=".docs/sdd/specs/20261009-130000-feature-0015-report-groupings"
F16=".docs/sdd/specs/20261009-140000-feature-0016-room-hours"
F17=".docs/sdd/specs/20261009-150000-feature-0017-reactivate"
F18=".docs/sdd/specs/20261010-100000-feature-0018-help"
F19=".docs/sdd/specs/20261010-110000-feature-0019-duplicate-note"
F20=".docs/sdd/specs/20261013-100000-feature-0020-path-reply"

# El molde recibe las reglas de forma del kit que se prueba: así el mismo escenario es RED y GREEN.
form_rules() {
  sed -n '/^## Art\. II — La forma sigue al fallo/,/^\*Por qué\*/p' "$KIT/.docs/sdd/constitution.md" \
    | sed 's/^## Art\. II /## Art. III /' > "$RUN/form-article.md"
  [ -s "$RUN/form-article.md" ] || die "sin el Art. II en la copia del kit: $KIT/.docs/sdd/constitution.md"
  { echo; cat "$RUN/form-article.md"; } >> "$R/.docs/sdd/constitution.md"
  { echo '# Tech stack — notas'; echo; echo '## Pruebas de skills'; echo
    grep -F -- '- **Una ronda de REFACTOR que da 0/N' "$KIT/.docs/sdd/tech-stack.md"; } > "$R/.docs/sdd/tech-stack.md"
  printf '# notas\n\nReglas del repo: `.docs/sdd/constitution.md` y `.docs/sdd/tech-stack.md`.\n' > "$R/CLAUDE.md"
}

MOLD=mold-reservas
case "$SC" in k2|o1|o2) MOLD=mold-kit ;; esac
cp -r "$HERE/$MOLD/." "$R/"
put_kit_marker "$MARKER"
case "$SC" in
  r1|r2) cp "$FIX/app-0012.js" "$R/src/app.js"; cp "$FIX/cancel-task1.test.js" "$R/test/cancel.test.js" ;;
  r1b|t1a|t1b|t1c) cp "$FIX/app-0015.js" "$R/src/app.js"; cp "$FIX/cancel-task1.test.js" "$R/test/cancel.test.js" ;;
  r3) cp "$FIX/app-0013.js" "$R/src/app.js"; cp "$FIX/price.test.js" "$R/test/price.test.js" ;;
  r5) cp "$FIX/app-0014.js" "$R/src/app.js"; cp "$FIX/store.js" "$R/src/store.js"; cp "$FIX/cancel-task1.test.js" "$R/test/cancel.test.js" ;;
  t2|t5a|p1|p2) cp "$FIX/app-0016.js" "$R/src/app.js" ;;
  t3|t5b) cp "$FIX/app-0017.js" "$R/src/app.js" ;;
  w1)
    cp "$FIX/package-w1.json" "$R/package.json"; mkdir -p "$R/scripts"; cp "$FIX/env-setup.mjs" "$R/scripts/env-setup.mjs"
    cp "$FIX/environments-w1.md" "$R/.docs/sdd/environments.md"; cp "$FIX/tech-stack-w1.md" "$R/.docs/sdd/tech-stack.md" ;;
  k1) cp "$FIX/app-0018.js" "$R/src/app.js"; cp "$FIX/readme-0018.md" "$R/README.md"; cp "$FIX/readme.test.js" "$R/test/readme.test.js" ;;
  # La base no responde con la ruta: el paso 3 es lo que añade la Task 1 de la 0020.
  o1|o2) sed -i '/^3\. Tell the user the path you wrote\./d' "$R/skills/guardar-nota/SKILL.md"; form_rules ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

# Sin «quién canceló»: el molde no tiene usuarios, y ese THEN es el desvío que mide la acción update, no estos escenarios.
approved_0010() { sed -e 's/ y quién canceló//' -e 's/ cancelada por Ana con/ cancelada con/' -e 's/ — sala ocupada — Ana»/ — sala ocupada»/' -e '/^2\. El listado de canceladas enseña sala/d' -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$FIX/spec-0010.md"; }
full_0010() { sed -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$FIX/spec-0010.md"; }
as_subagent() { sed -e 's/^\*\*Ejecución\*\*: native.*/**Ejecución**: subagent, porque se quiere revisión por task./' -e 's/^1\. Dos tasks, Native\./1. Dos tasks, SDD./' -e 's/^- Native: implementa la sesión\./- SDD: un implementador por task y su revisión./' "$1"; }
open_feature() {
  g checkout -q -b "feature/$1"
  put "$2/spec.md"; put "$2/plan.md" < "$3"
  commit "docs(sdd): abrir la feature ${1%%-*} con su spec y su plan"
}
task_commit() {
  cp "$FIX/app-$1.js" "$R/src/app.js"
  cp "$FIX/cancel-$1.test.js" "$R/test/cancel.test.js"
  commit "$2"
}
short() { g rev-parse --short=7 "$1"; }

# El encargo del implementador, compuesto con el texto del kit que se prueba; el brief, con su CLI.
encargo() {
  local folder="$1" task="$2" test="$3" values brief
  brief=$(cd "$R" && "$NODE" "$SDD_CLI" task brief "$folder/plan.md" 1 | tail -n 1 | sed -e "s/^wrote //" -e "s/: [0-9]* lines$//")
  values="$RUN/encargo-values.json"
  "$NODE" -e '
    const [task, test, brief, dir] = process.argv.slice(1);
    const report = brief.replace(/brief\.md$/, "report.md");
    console.log(JSON.stringify([
      ["<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>",
       "- Texto de la interfaz en castellano.\n- Sin comentarios que repitan el código ni que citen documentos."],
      ["Los tests de `<ruta>`", "Los tests de `" + test + "`"], ["<comandos>", `node --test ${test}`], ["<comando de los RED>", `node --test ${test}`],
      [" <Si la task tiene «Verificación lenta»:> `<comando>` es la verificación lenta de tu task: no la ejecutes; la lanza el hilo principal.", ""],
      ["Task N: [task name]", `Task 1: ${task}`], ["[BRIEF_FILE]", brief], ["[REPORT_FILE]", report], ["[directory]", dir],
      ["[Scene-setting: where this fits, dependencies, architectural context]", "La app de salas es una CLI en Node sin dependencias; esta es la única task de su feature."],
    ]));' "$task" "$test" "$brief" "$(cygpath -m "$R" 2>/dev/null || echo "$R")" > "$values"
  "$NODE" "$HERE/compose.mjs" "$KIT" "${SUPERPOWERS_DIR:-}" "$values"
}

# El encargo del escritor de RED: solo los THEN, «Dónde se prueba» y las Interfaces de la task.
red_writer() {
  local folder="$1" test="$2"
  "$NODE" -e '
    const fs = require("fs");
    const [brief, spec, plan, test, dir] = process.argv.slice(1);
    const specText = fs.readFileSync(spec, "utf8"), planText = fs.readFileSync(plan, "utf8");
    const between = (text, from, to) => text.split(from)[1].split(to)[0].trim();
    const scenarios = specText.split("### Capacidad: `bookings`")[1].split("## Aprobaciones")[0].trim();
    const values = {
      "<DIRECTORY>": dir, "<THEN>": scenarios, "<DONDE>": between(specText, "## Dónde se prueba", "## Delta"),
      "<INTERFACES>": between(planText, "**Interfaces**:", "**Ficheros**"), "<TEST>": test, "<PATRON>": "test/cancel.test.js",
    };
    let text = fs.readFileSync(brief, "utf8");
    for (const [key, value] of Object.entries(values)) text = text.split(key).join(value);
    process.stdout.write(text);' "$FIX/red-writer-brief.md" "$R/$folder/spec.md" "$R/$folder/plan.md" "$test" "$(cygpath -m "$R" 2>/dev/null || echo "$R")"
}

case "$SC" in
  t2) open_feature 0016-room-hours "$F16" "$FIX/plan-0016.md" < "$FIX/spec-0016.md" ;;
  t3) open_feature 0017-reactivate "$F17" "$FIX/plan-0017.md" < "$FIX/spec-0017.md" ;;
  p1) open_feature 0016-room-hours "$F16" "$FIX/plan-0016.md" < "$FIX/spec-0016.md" ;;
  p2)
    open_feature 0016-room-hours "$F16" "$FIX/plan-0016.md" < "$FIX/spec-0016.md"
    cp "$FIX/app-0016-done.js" "$R/src/app.js" ;;
  t5a)
    open_feature 0016-room-hours "$F16" "$FIX/plan-0016.md" < "$FIX/spec-0016.md"
    ASK="$(red_writer "$F16" test/horas.test.js)" ;;
  t5b)
    open_feature 0017-reactivate "$F17" "$FIX/plan-0017.md" < "$FIX/spec-0017.md"
    ASK="$(red_writer "$F17" test/reactivar.test.js)" ;;
  r1)
    open_feature 0012-cancelled-report "$F12" "$FIX/plan-0012.md" < "$FIX/spec-0012.md"
    cp "$FIX/informe.test.js" "$R/test/informe.test.js"
    ASK="$(encargo "$F12" "Comando informe" test/informe.test.js)" ;;
  r1b|t1a|t1b|t1c)
    open_feature 0015-report-groupings "$F15" "$FIX/plan-0015.md" < "$FIX/spec-0015.md"
    if [ "$SC" = t1c ]; then cp "$FIX/cancel-task1.test.js" "$R/test/informe.test.js"; else cp "$FIX/informe-0015.test.js" "$R/test/informe.test.js"; fi
    ASK="$(encargo "$F15" "Comando informe" test/informe.test.js)"
    [ "$SC" = t1b ] && ASK="${ASK/1. Before touching/1. Load \`sdd-tdd\` with \`Skill\`. Then, before touching}" ;;
  k1) open_feature 0018-help "$F18" "$FIX/plan-0018.md" < "$FIX/spec-0018.md" ;;
  k2)
    open_feature 0019-duplicate-note "$F19" "$FIX/plan-0019.md" < "$FIX/spec-0019.md"
    cp "$FIX/guardar-nota-task1.md" "$R/skills/guardar-nota/SKILL.md"
    put "$F19/green/h1.txt" < "$FIX/h1-0019.txt" ;;
  o1|o2)
    open_feature 0020-path-reply "$F20" "$FIX/plan-0020.md" < "$FIX/spec-0020.md"
    cp "$HERE/mold-kit/skills/guardar-nota/SKILL.md" "$R/skills/guardar-nota/SKILL.md"
    put "$F20/green/h1.txt" < "$FIX/h1-0020.txt"
    if [ "$SC" = o2 ]; then
      cp "$FIX/guardar-nota-r1.md" "$R/skills/guardar-nota/SKILL.md"
      put "$F20/green/h1-r1.txt" < "$FIX/h1-r1-0020.txt"
    fi ;;
  r2) open_feature 0012-cancelled-report "$F12" "$FIX/plan-0012.md" < "$FIX/spec-0012.md" ;;
  r3) open_feature 0013-price-module "$F13" "$FIX/plan-0013.md" < "$FIX/spec-0013.md" ;;
  r5)
    open_feature 0014-saved-reason "$F14" "$FIX/plan-0014.md" < "$FIX/spec-0014.md"
    cp "$FIX/store.e2e.test.js" "$R/test/store.e2e.test.js"
    ASK="$(encargo "$F14" "Guardar el motivo" test/store.e2e.test.js)" ;;
  u1|u2)
    full_0010 | open_feature 0010-cancel-reason "$F10" "$FIX/plan-0010.md"
    task_commit task1 "feat(bookings): cancelar con un motivo de la lista"
    put "$F10/tasks.md" < "$FIX/tasks-0010-u1.md"
    TURN2='Apruebo la enmienda.'
    [ "$SC" = u2 ] && TURN2='Apruebo guardar quién cancela con --por <nombre> en cancelar.'
    export TURN2 ;;
  h1) approved_0010 | open_feature 0010-cancel-reason "$F10" "$FIX/plan-0010.md" ;;
  w1)
    approved_0010 | open_feature 0010-cancel-reason "$F10" "$FIX/plan-0010.md"
    g checkout -q develop
    g worktree add -q "$RUN/wt" feature/0010-cancel-reason
    R="$RUN/wt"; MOLD_IS_REPO= ;;
  h2) as_subagent "$FIX/plan-0010.md" > "$RUN/plan-sdd.md"; approved_0010 | open_feature 0010-cancel-reason "$F10" "$RUN/plan-sdd.md" ;;
  r4)
    as_subagent "$FIX/plan-0010.md" > "$RUN/plan-sdd.md"; approved_0010 | open_feature 0010-cancel-reason "$F10" "$RUN/plan-sdd.md"
    BASE1=$(short HEAD); task_commit task1 "feat(bookings): cancelar con un motivo de la lista"
    BASE2=$(short HEAD); task_commit done "feat(bookings): listado de canceladas con su motivo"
    HEAD2=$(short HEAD)
    WS=$(cd "$R" && "$NODE" "$SDD_CLI" workspace "$F10/plan.md" | tail -n 1)
    (cd "$R" && "$NODE" "$SDD_CLI" task brief "$F10/plan.md" 2 > /dev/null)
    printf '# SDD ledger — plan: %s\nTask 1: complete (commits %s..%s, review clean)\n' "$F10/plan.md" "$BASE1" "$BASE2" > "$WS/progress.md"
    printf '# Task 2 — informe del implementador\n\n**Status:** DONE\n\n- Commits: %s feat(bookings): listado de canceladas con su motivo\n- Tests: `node --test test/cancel.test.js` → 4/4\n- Ficheros: src/app.js, test/cancel.test.js\n' "$HEAD2" > "$WS/task-2-report.md" ;;
esac

case "$SC" in
  r2|r3|h1|t2|t3|t5a|t5b|p1|p2|k1|k2|o1|o2|w1) export EXTRA_DISALLOWED="Agent" ;;
esac
case "$SC" in
  r1|r1b|r5|t1a|t1b|t1c) MAX_TURNS="${MAX_TURNS:-40}" ;;
  r2|r3|r4) MAX_TURNS="${MAX_TURNS:-35}" ;;
  t2|t3|p1|p2|k1|k2|o1|o2) MAX_TURNS="${MAX_TURNS:-40}" ;;
  t5a|t5b) MAX_TURNS="${MAX_TURNS:-20}" ;;
  w1) MAX_TURNS="${MAX_TURNS:-30}" ;;
  h2) MAX_TURNS="${MAX_TURNS:-80}" ;;
  *) MAX_TURNS="${MAX_TURNS:-60}" ;;
esac

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
for folder in "$F10" "$F12" "$F13" "$F14" "$F15" "$F16" "$F17" "$F18" "$F19" "$F20"; do
  for kept in spec plan tasks; do [ -f "$R/$folder/$kept.md" ] && subject_keep "$R/$folder/$kept.md" "$kept.md"; done
done
for test in informe price store.e2e cancel horas reactivar ayuda; do [ -f "$R/test/$test.test.js" ] && subject_keep "$R/test/$test.test.js" "$test.test.js"; done
[ -f "$R/src/app.js" ] && subject_keep "$R/src/app.js" app.js
[ -f "$R/.sdd-env.json" ] && subject_keep "$R/.sdd-env.json" sdd-env.json
[ -f "$R/README.md" ] && subject_keep "$R/README.md" README.md
[ -f "$R/skills/guardar-nota/SKILL.md" ] && subject_keep "$R/skills/guardar-nota/SKILL.md" guardar-nota.md
for ledger in "$R"/.superpowers/sdd/*/progress.md; do [ -f "$ledger" ] && subject_keep "$ledger" progress.md; done
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## commits con sus ficheros"; g log --stat --format='--- %h %s' develop..HEAD; } | subject_save
