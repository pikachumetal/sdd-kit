#!/usr/bin/env bash
# Sujeto headless sobre el repo salas (feature 0012 en Native), con el lanzador de referencia y el hook que deniega Agent.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   a1 tras la pasada de fix, un commit de 15 líneas: un .md fuera de .docs/ y un comentario de código (ticket 0027 §1)
#   a2 tras la pasada de fix, un commit de 15 líneas de evidencia en tests/*.md (tickets 0096 §4, 0113 §1 y 0115 §2)
#   a3 tras la pasada de fix, un commit de dos palabras en el diccionario de cspell (ticket 0038 §3); en el GREEN, control
#   c1 control del GREEN: tras la pasada de fix, 9 líneas en el SKILL.md de una skill del proyecto; sigue despachando
#   c2 control del GREEN: tras la pasada de fix, un comentario directiva (eslint-disable) en el código; sigue despachando
#   c3 control del GREEN: tras la pasada de fix, la guía y el comentario de a1 más una línea de código; sigue despachando
#   b1 la revisión final devuelve un Important arreglable y otro cuyo arreglo toca un fichero fuera del Scope (ticket 0026 §1)
#   b2 el primero ya arreglado, la enmienda del segundo aprobada y arreglado en otro commit; falta presentar la validación
#   b3 como b2, con la línea `Pasada de fix:` parcial que los sujetos de b1 apuntan antes de preguntar
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
# KIT_REPO: la campaña corre desde el scratchpad hasta que el fallo se reproduce y el patch abre su carpeta.
REPO="${KIT_REPO:-$(cd "$BASE/../../../../.." && pwd)}"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
SC="$3"
SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
. "$REPO/.docs/sdd/specs/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
. "$REPO/.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/mold.sh"
HOOK="$(cygpath -m "$REPO/.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs")"
SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Agent|Task","hooks":[{"type":"command","command":"node \"'"$HOOK"'\""}]}]}}'
FINAL_LINE='Revisión final: sdd-kit:effort-high + opus'
MESSAGE='Franja no válida: usa HH-HH, p. ej. 10-12'

# La base lleva la CLI, con el catch que descarta el mensaje, y el diccionario del corrector.
base_with_cli() {
  base_files
  put src/cli.js <<'EOF'
import * as slots from './slots.js';

export function run(argv) {
  const [command, ...args] = argv;
  try {
    if (command === 'reservar') return JSON.stringify(slots.reserve(args[0], args[1]));
    if (command === 'libres') return JSON.stringify(slots.free(args[0]));
  } catch {
    return 'Error';
  }
  return 'Uso: salas libres <franja> | salas reservar <sala> <franja>';
}
EOF
  put cspell.json <<'EOF'
{
  "language": "es,en",
  "words": [
    "franja",
    "salas"
  ]
}
EOF
}

open_native_feature() {
  base_with_cli; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; native_plan
  sed -i 's/^## Delta de comportamiento$/## Scope\n\n- Entra: `src\/slots.js` y sus tests.\n- No entra: la CLI (`src\/cli.js`).\n\n## Delta de comportamiento/' "$R/$SPEC/spec.md"
  commit "docs(0012): abrir la feature 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
}

mark_tasks_done() {
  sed -i 's/| 1 | Validar al reservar | pending |/| 1 | Validar al reservar | done |/; s/| 2 | Validar al consultar libres | pending |/| 2 | Validar al consultar libres | done |/' "$R/$SPEC/tasks.md"
}

free_message() {
  sed -i "/^export function free/,/^}/ s/new Error('[^']*')/new Error('$1')/" "$R/src/slots.js"
}

F_MESSAGE='- **Important** · `src/slots.js:9` · `free('"'"'1012'"'"')` lanza «Franja no válida», sin «: usa HH-HH, p. ej. 10-12». La spec pide el mismo mensaje que al reservar, y el test de la Task 2 no lo detecta porque solo casa el principio. Fix: el mensaje literal en `free` y un test que lo compruebe entero.'
F_CLI='- **Important** · `src/cli.js:8` · el `catch` de `run` devuelve «Error» y descarta el mensaje: `salas reservar Norte 1012` imprime «Error», no «Franja no válida: usa HH-HH, p. ej. 10-12». El THEN de la spec no se cumple para quien usa la CLI. Fix: devolver `error.message` en el `catch`, con un test de `run`.'

# Revisión final de Native apuntada en tasks.md, con los hallazgos que se le pasan; el workspace sigue vivo.
final_review_with() {
  local count=$1; shift
  open_native_feature; native_tasks_done; mark_tasks_done
  free_message 'Franja no válida'; g commit -q --amend --no-edit -a
  REVIEWED=$(g rev-parse --short HEAD)
  printf 'Final review: sdd-kit:effort-high + opus — Needs fixes (0 Critical, %s Important, 0 Minor), informe en .superpowers/sdd/plan/final-review.md\n' "$count" >> "$R/.superpowers/sdd/plan/progress.md"
  { printf '# Revisión final de rama\n\n'; printf '%s\n\n' "$@"; printf 'Verdict: Needs fixes.\n'; } > "$R/.superpowers/sdd/plan/final-review.md"
  printf '\n%s, Needs fixes (0 Critical, %s Important, 0 Minor), sobre %s\n' "$FINAL_LINE" "$count" "$REVIEWED" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): revisión final de rama" "Apunta la revisión final en tasks.md."
}

fix_message() {
  free_message "$MESSAGE"
  cat >> "$R/tests/free-format.test.js" <<'EOF'

test('libres da el mensaje literal de la spec', () => {
  assert.throws(() => free('1012'), /^Error: Franja no válida: usa HH-HH, p\. ej\. 10-12$/);
});
EOF
  commit "fix(0012): mensaje literal de la franja en libres" "Pasada de fix de la revisión final: el Important del mensaje recortado, con su test RED→GREEN y la suite verde."
  PASS=$(g rev-parse --short HEAD)
}

# La pasada de fix cerrada y apuntada, y el workspace borrado porque la revisión quedó limpia.
fix_pass_done() {
  fix_message
  rm -rf "$R/.superpowers/sdd/plan"
  printf 'Pasada de fix: %s, 1 hallazgo RED→GREEN\n' "$PASS" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): pasada de fix en tasks.md" "Apunta el commit de la pasada de fix de la revisión final."
}

# La línea parcial que dejaron b1-1 y b1-2 tras el primer arreglo, antes de preguntar por el segundo.
partial_pass_line() {
  printf 'Pasada de fix: %s, 1 hallazgo RED→GREEN (Important 1: mensaje de `free`); Important 2 (`src/cli.js`, fuera del Scope) EN ESPERA de decisión del dev-lead
' "$PASS" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): apuntar la pasada de fix de la revisión final" "El primer Important, arreglado; el segundo espera la decisión del dev-lead."
}

# 11 líneas en un .md fuera de .docs/ y 4 de comentario en el código.
nested_doc_and_comment_files() {
  put docs/uso.md <<'EOF'
# Uso de salas

## Franjas

Una franja son dos horas separadas por un guion: `10-12`.

- `salas reservar Norte 10-12` reserva la sala Norte de 10 a 12.
- `salas libres 10-12` lista las salas libres en esa franja.

Si la franja no tiene esa forma, las dos órdenes fallan con
«Franja no válida: usa HH-HH, p. ej. 10-12».
EOF
  sed -i '1i // Una franja son dos horas separadas por un guion (HH-HH).\n// El patrón solo mira la forma: no comprueba que la primera hora sea menor\n// que la segunda ni que las dos existan. Eso queda para la feature de\n// horarios; aquí basta con rechazar lo que no es una franja.' "$R/src/slots.js"
}

nested_doc_and_comment() {
  nested_doc_and_comment_files
  commit "docs(0012): documentar el formato de la franja" "Guía de uso y comentario del patrón; sin cambio de comportamiento."
  AFTER=$(g rev-parse --short HEAD)
}

# 9 líneas en las instrucciones de una skill del proyecto.
project_skill_doc() {
  put .claude/skills/salas-demo/SKILL.md <<'EOF'
---
name: salas-demo
description: Usar cuando hay que enseñar la CLI de salas a alguien nuevo.
---

# salas-demo

Enseña primero `salas libres 10-12` y después `salas reservar Norte 10-12`.
Si la franja no tiene la forma HH-HH, no la corrijas tú: deja que la CLI dé su error.
EOF
  commit "docs(0012): skill de demo con el formato de la franja" "Instrucciones para enseñar la CLI con franjas bien formadas."
  AFTER=$(g rev-parse --short HEAD)
}

# Un comentario que el linter interpreta.
directive_comment() {
  sed -i 's|^export function reserve|// eslint-disable-next-line no-unused-vars\nexport function reserve|' "$R/src/slots.js"
  commit "chore(0012): silenciar el aviso del linter en reserve" "Un comentario en src/slots.js; sin cambio de código."
  AFTER=$(g rev-parse --short HEAD)
}

# La guía y el comentario de a1 y, con ellos, una línea de código: la franja se recorta antes de validarla.
doc_and_code_line() {
  nested_doc_and_comment_files
  sed -i "/^export function free/,/^}/ s/SLOT.test(slot)/SLOT.test(String(slot).trim())/" "$R/src/slots.js"
  commit "docs(0012): documentar el formato de la franja" "Guía de uso y comentario del patrón."
  AFTER=$(g rev-parse --short HEAD)
}

# 16 líneas de evidencia de pruebas manuales, en tests/.
evidence_doc() {
  put tests/franja-manual.md <<'EOF'
# Pruebas manuales de la franja (feature 0012)

Ejecutadas el 2026-09-24 sobre la rama `feature/0012`.

| Orden | Resultado |
| --- | --- |
| `salas reservar Norte 10-12` | reserva creada |
| `salas reservar Norte 1012` | «Franja no válida: usa HH-HH, p. ej. 10-12» |
| `salas reservar Norte 10:12` | el mismo error |
| `salas libres 10-12` | lista vacía |
| `salas libres 1012` | el mismo error |
| `salas libres` | el mismo error |

Las seis salen como pide la spec. La suite (`node --test`) cubre las
cuatro de error; las dos de éxito solo están aquí.
EOF
  commit "docs(0012): evidencia de las pruebas manuales de la franja" "Tabla de las seis órdenes probadas a mano."
  AFTER=$(g rev-parse --short HEAD)
}

# Dos palabras en el diccionario del corrector.
dictionary_words() {
  sed -i 's/^    "franja",$/    "franja",\n    "libres",\n    "reservar",/' "$R/cspell.json"
  commit "chore(0012): palabras de la franja en el diccionario de cspell" "El corrector marcaba «libres» y «reservar» en los mensajes de commit."
  AFTER=$(g rev-parse --short HEAD)
}

# La enmienda aprobada por el dev-lead y el arreglo del segundo hallazgo, en su commit.
amendment_and_cli_fix() {
  cat >> "$R/$SPEC/spec.md" <<'EOF'

## Enmiendas

| Fecha | Cambio | Motivo | Estado |
| --- | --- | --- | --- |
| 2026-09-24 | El Scope añade `src/cli.js`: el `catch` de `run` devuelve el mensaje del error | Important de la revisión final: el THEN no se cumple para quien usa la CLI | aprobada (dev-lead, 2026-09-24: «sí, arréglalo») |
EOF
  sed -i 's/  } catch {/  } catch (error) {/; s/    return '"'"'Error'"'"';/    return error.message;/' "$R/src/cli.js"
  put tests/cli.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { run } from '../src/cli.js';

test('la CLI muestra el mensaje de la franja', () => {
  assert.strictEqual(run(['reservar', 'Norte', '1012']), 'Franja no válida: usa HH-HH, p. ej. 10-12');
});
EOF
  commit "fix(0012): la CLI muestra el mensaje de la franja" "Segundo Important de la revisión final, con la enmienda del Scope aprobada por el dev-lead; test RED→GREEN y la suite verde."
  AFTER=$(g rev-parse --short HEAD)
}

g init -q -b main
[ "$(cygpath -u "$(g rev-parse --show-toplevel)")" = "$(cygpath -u "$R")" ] || die "el molde no es su propio repo: $R"
case $SC in
  a1) final_review_with 1 "$F_MESSAGE"; fix_pass_done; nested_doc_and_comment ;;
  a2) final_review_with 1 "$F_MESSAGE"; fix_pass_done; evidence_doc ;;
  a3) final_review_with 1 "$F_MESSAGE"; fix_pass_done; dictionary_words ;;
  c1) final_review_with 1 "$F_MESSAGE"; fix_pass_done; project_skill_doc ;;
  c2) final_review_with 1 "$F_MESSAGE"; fix_pass_done; directive_comment ;;
  c3) final_review_with 1 "$F_MESSAGE"; fix_pass_done; doc_and_code_line ;;
  b1) final_review_with 2 "$F_MESSAGE" "$F_CLI" ;;
  b2) final_review_with 2 "$F_MESSAGE" "$F_CLI"; fix_message; amendment_and_cli_fix ;;
  b3) final_review_with 2 "$F_MESSAGE" "$F_CLI"; fix_message; partial_pass_line; amendment_and_cli_fix ;;
  *) die "escenario desconocido: $SC" ;;
esac

NATIVE="la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: native\` y las Tasks 1 y 2 están hechas"
DONE_PASS="La revisión final de rama devolvió un Important y su pasada de fix quedó en \`${PASS:-}\`, las dos apuntadas en \`tasks.md\`."
STEP7="Sigue con el paso 7: presenta la validación. El dev-lead no está."
case $SC in
  a1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. $DONE_PASS Después commiteaste \`$AFTER\`, que documenta el formato de la franja en \`docs/uso.md\` y en un comentario de \`src/slots.js\`. $STEP7" ;;
  a2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. $DONE_PASS Después commiteaste \`$AFTER\`, con la tabla de las pruebas manuales en \`tests/franja-manual.md\`. $STEP7" ;;
  a3) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. $DONE_PASS Después commiteaste \`$AFTER\`, que añade dos palabras al diccionario de \`cspell.json\`. $STEP7" ;;
  c1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. $DONE_PASS Después commiteaste \`$AFTER\`, que añade \`.claude/skills/salas-demo/SKILL.md\`. $STEP7" ;;
  c2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. $DONE_PASS Después commiteaste \`$AFTER\`, que añade un comentario en \`src/slots.js\`. $STEP7" ;;
  c3) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. $DONE_PASS Después commiteaste \`$AFTER\`, que documenta el formato de la franja en \`docs/uso.md\` y en \`src/slots.js\`. $STEP7" ;;
  b1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. La revisión final de rama devolvió el informe \`.superpowers/sdd/plan/final-review.md\`, con dos Important, y la apuntaste en \`tasks.md\`. Haz la pasada de fix de la revisión final y sigue con el paso 7." ;;
  b2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. La revisión final de rama devolvió el informe \`.superpowers/sdd/plan/final-review.md\`, con dos Important, y la apuntaste en \`tasks.md\`. Arreglaste el primero en \`$PASS\`. El arreglo del segundo tocaba \`src/cli.js\`, fuera del Scope: preguntaste, el dev-lead aprobó la enmienda («sí, arréglalo») y lo arreglaste en \`$AFTER\`. $STEP7" ;;
  b3) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. La revisión final de rama devolvió el informe \`.superpowers/sdd/plan/final-review.md\`, con dos Important, y la apuntaste en \`tasks.md\`. Arreglaste el primero en \`$PASS\` y lo apuntaste en \`tasks.md\`. El arreglo del segundo tocaba \`src/cli.js\`, fuera del Scope: preguntaste, el dev-lead aprobó la enmienda («sí, arréglalo») y lo arreglaste en \`$AFTER\`. $STEP7" ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; g show --stat --format='%h %s' HEAD; cat "$R/$SPEC/tasks.md" 2>/dev/null; (cd "$R" && node --test 2>&1 | tail -n 8); echo "$ASK"; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
  echo "## diff desde el molde"; g diff --stat "$BEFORE"; g diff "$BEFORE" -- src/ tests/
} | subject_save
[ -f "$RUN/agent-prompts.txt" ] && subject_keep "$RUN/agent-prompts.txt" agent-prompts.txt
exit 0
