#!/usr/bin/env bash
# Sujeto de la batería de sdd-archive: una feature o un patch hechos, listos para cerrar.
# Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
IMPL="$HERE/../sdd-implement"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
# Un kit anterior a sdd-archive (el RED, con el kit de develop de entonces) cierra con sdd-end-feature o sdd-end-patch: la guarda y la petición usan la de ese kit.
GUARD="$(cell Esperado | sed 's/^`*sdd-kit://; s/`*$//')"
case "$(cell Molde)" in salas-*) OLD=sdd-end-patch ;; *) OLD=sdd-end-feature ;; esac
subject_init "$1" "$2" "$4" "$([ -d "$1/skills/$GUARD" ] && echo "$GUARD" || echo "$OLD")"
ASK="$(cell Petición)"
[ -d "$1/skills/$GUARD" ] || ASK="${ASK//sdd-kit:$GUARD/sdd-kit:$OLD}"
F10=".docs/sdd/specs/20261008-100000-feature-0010-cancel-reason"
P8=".docs/sdd/specs/20261010-090000-patch-0008-cancel-missing"
MERGE='"merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}'
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, '"$MERGE"', "execution": "native", "validation": {"mode": "field"}'
short() { g rev-parse --short=7 "$1"; }
# La validación la hace la persona: el cierre para con el guion.
manual_validation() { MARKER="${MARKER/\"mode\": \"field\"/\"mode\": \"manual\"}"; }

# La 0010 implementada en Native y revisada: spec y plan aprobados, dos tasks, tasks.md con la revisión final limpia.
approved_0010() { sed -e 's/ y quién canceló//' -e 's/ cancelada por Ana con/ cancelada con/' -e 's/ — sala ocupada — Ana»/ — sala ocupada»/' -e '/^2\. El listado de canceladas enseña sala/d' -e 's/^- Modificadas: `bookings`/- Nuevas: `bookings`/' -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$IMPL/fixtures/spec-0010.md"; }
mold_reservas() {
  cp -r "$IMPL/mold-reservas/." "$R/"; put_kit_marker "$MARKER"
  g init -q -b main; g config core.longpaths true; commit "feat: base del molde"; g checkout -q -b develop
}
done_0010() {
  g checkout -q -b feature/0010-cancel-reason
  approved_0010 | put "$F10/spec.md"; put "$F10/plan.md" < "$IMPL/fixtures/plan-0010.md"
  commit "docs(sdd): abrir la feature 0010 con su spec y su plan"
  cp "$IMPL/fixtures/app-task1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-task1.test.js" "$R/test/cancel.test.js"
  commit "feat(bookings): cancelar con un motivo de la lista"
  cp "$IMPL/fixtures/app-done.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-done.test.js" "$R/test/cancel.test.js"
  [ -f "$R/e2e/run.mjs" ] && cp "$E2E/e2e/cancel-0010.e2e.mjs" "$R/e2e/cancel.e2e.mjs"
  commit "feat(bookings): listado de canceladas con su motivo"
  A=$(short HEAD)
  printf '%s\n' '---' 'id: 20261008-100000-feature-0010-cancel-reason' 'title: Tasks — Motivo al cancelar' '---' '' '# Tasks — Motivo al cancelar (registro vivo)' '' \
    '| # | Task | Status | Commit | Notas |' '| --- | --- | --- | --- | --- |' "| 1 | Cancelar con motivo | done | $A | |" "| 2 | Listado de canceladas | done | $A | |" '' \
    "Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre $A" '' '## Rulings' '' \
    '- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble' \
    | put "$F10/tasks.md"
  commit "docs(sdd): tasks.md con la revisión final"
}
# La suite E2E del proyecto en develop: servidor HTTP, runner con la salida de Playwright y operations.md con sus campos E2E.
E2E="$HERE/fixtures/e2e"
# Un puerto por sujeto: dos sujetos a la vez no comparten servidor.
E2E_PORT=$((4300 + RANDOM % 600))
e2e_suite() {
  mkdir -p "$R/e2e" "$R/scripts" "$R/.docs/sdd/steering"
  cp "$E2E/server.mjs" "$R/"; cp "$E2E/e2e/run.mjs" "$E2E/e2e/free.e2e.mjs" "$R/e2e/"; cp "$E2E/e2e/cancel-base.e2e.mjs" "$R/e2e/cancel.e2e.mjs"
  cp "$E2E/scripts/"*.mjs "$R/scripts/"
  printf '{"port": %s, "timeout": 30000, "expectTimeout": 5000, "retries": 0}
' "$E2E_PORT" > "$R/e2e/config.json"
  printf '{"type": "module", "scripts": {"test": "node --test test/", "test:e2e": "node e2e/run.mjs", "env:up": "node scripts/env-up.mjs", "env:down": "node scripts/env-down.mjs"}}
' > "$R/package.json"
  sed "s/PORT/$E2E_PORT/" "$E2E/operations.md" > "$R/.docs/sdd/steering/operations.md"
  cat "$E2E/README-tail.md" >> "$R/README.md"
  commit "test: suite e2e"
}
# Un servidor que arrancó otra pasada, desde el código de develop, escucha ya en el puerto de la suite.
stale_server() {
  local stale="$RUN/stale-env"
  mkdir -p "$stale"; g archive develop | tar -x -C "$stale"
  "$NODE" "$stale/scripts/env-up.mjs" >/dev/null || die "no arrancó el servidor ajeno"
}

# El patch 0008 con su fix commiteado, sobre el molde de salas de using-sdd; con «hotfix», la rama sale de main.
done_0008() {
  local row='| 0008 | Patch: si cancelo una reserva que no existe me dice «cancelada» igual | ⏳ |' branch=feature/0008-cancel-missing
  local debt='| Cancelar una reserva que no existe responde «cancelada» igual | Medio | Actuar → 0008 |'
  cp -r "$HERE/../using-sdd/mold-salas/." "$R/"; put_kit_marker "${MARKER/, \"execution\": \"native\"/}"
  grep -q '^| 1 | Avisos por correo antes de la reserva | ⏳ |$' "$R/.docs/sdd/roadmap.md" || die "el roadmap del molde salas cambió: no hay dónde poner la fila 0008"
  sed -i "s/^| 1 | Avisos por correo antes de la reserva | ⏳ |\$/&\n$row/" "$R/.docs/sdd/roadmap.md"
  sed -i "s/^| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |\$/&\n$debt/" "$R/.docs/sdd/roadmap.md"
  grep -q 'Actuar → 0008' "$R/.docs/sdd/roadmap.md" || die "no se plantó la fila de deuda de la 0008"
  if [ "${1:-}" = hotfix ]; then
    branch=hotfix/0008-cancel-missing
    printf '# Migraciones\n\nUna por versión, `vX.Y.Z.md`: los pasos que el proyecto aplica al subir.\n' | put skills/sdd-upgrade/references/migrations/README.md
  fi
  g init -q -b main; commit "feat: base del molde"; g checkout -q -b develop
  [ "${1:-}" = hotfix ] && g checkout -q main
  g checkout -q -b "$branch"
  sed -i "s|  if (cmd === 'cancelar') return \`cancelada \${params\[0\]} \${params\[1\]}\`;|  if (cmd === 'cancelar') return bookings.some((b) => b.day === params[0] \&\& b.slot.startsWith(params[1])) ? \`cancelada \${params[0]} \${params[1]}\` : \`no hay reserva \${params[0]} \${params[1]}\`;|" "$R/src/app.js"
  grep -q 'no hay reserva' "$R/src/app.js" || die "no se plantó el fix en src/app.js"
  sed -i "s/run('cancelar', \['mar', '10:00'\]), 'cancelada mar 10:00'/run('cancelar', ['lun', '10:00']), 'cancelada lun 10:00'/" "$R/test/app.test.js"
  printf "\ntest('cancelar sin reserva avisa', () => {\n  assert.equal(run('cancelar', ['mie', '10:00']), 'no hay reserva mie 10:00');\n});\n" >> "$R/test/app.test.js"
  put "$P8/patch.md" < "$HERE/patch-0008.md"
  commit "fix: cancelar una reserva que no existe avisa (0008)"
}

# El síntoma del patch 0008 con el reporte literal de quien lo encontró: sus pasos empiezan antes del comando que falla.
report_0008() {
  sed -i 's/^`cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00»\.$/Reporte de Laura, literal: «Abro la terminal y miro qué hay libre: `node src\/app.js libres 10:00-12:00` me da «Sur». Como el miércoles no tengo nada reservado, pruebo `node src\/app.js cancelar mie 10:00` y me dice «cancelada mie 10:00». Debería decirme que no hay reserva.»/' "$R/$P8/patch.md"
  grep -q 'Reporte de Laura' "$R/$P8/patch.md" || die "no se plantó el reporte en patch.md"
  g add -A; g commit -q --amend --no-edit
}
# La persona quiere el entorno arrancado al validar, y el gate de cierre no lo levanta.
start_environment() {
  sed -i 's/^- \*\*Gate de cierre\*\*: .*$/- **Gate de cierre**: `node --test test\/`/' "$R/.docs/sdd/steering/operations.md"
  printf '.docs/sdd/sdd-kit.local.json\n' >> "$R/.gitignore"
  commit "chore: gate de cierre sin e2e y config local ignorada"
}
broken_environment() {
  printf "console.error('Error: no arranca: falta data/seed.json');\nprocess.exit(1);\n" | put scripts/env-up.mjs
  commit "chore: env-up sin la semilla de datos"
}

# Un E2E que falla igual con la rama y sin ella, y su fila en la deuda del proyecto.
e2e_red_base() {
  printf "import test from 'node:test';\n\ntest('exportar reservas a csv', () => {\n  throw new Error('TimeoutError: export no respondió en 5000 ms');\n});\n" | put test/export.e2e.test.js
  sed -i 's/^| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |$/&\n| `test\/export.e2e.test.js` falla con «TimeoutError: export no respondió» también en `develop` | Medio | Patch cuando moleste |/' "$R/.docs/sdd/roadmap.md"
  grep -q 'export.e2e' "$R/.docs/sdd/roadmap.md" || die "no se plantó la fila de deuda del E2E"
  commit "test: e2e de exportación"
}
# Un test de develop que falla solo en la primera pasada del clon: el almacén vive en el .git común a sus worktrees.
flaky_test() {
  cat <<'EOF' | put test/ids.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const store = join(execSync('git rev-parse --git-common-dir').toString().trim(), 'ids-store');

test('una reserva nueva lleva su id', () => {
  const id = existsSync(store) ? ' r1 ' : undefined;
  writeFileSync(store, 'r1');
  assert.equal(id.trim(), 'r1');
});
EOF
  commit "test: id de una reserva nueva"
}
# Un test de bookings:test, en develop, que falla con EBUSY la primera vez que corre en el clon e importa una dependencia local: un worktree sin `npm install` no la tiene.
store_red_test() {
  local gate="$HERE/fixtures/gate"
  mkdir -p "$R/vendor"; cp -r "$gate/slot-format" "$R/vendor/slot-format"; cp "$gate/store.test.js" "$R/test/store.test.js"
  printf '{"type": "module", "dependencies": {"slot-format": "file:vendor/slot-format"}}\n' > "$R/package.json"
  sed -i 's#test/cancel.test.js"#test/cancel.test.js test/store.test.js"#; s#"test/cancel.test.js"\]#"test/cancel.test.js", "test/store.test.js"]#' "$R/gate.json"
  grep -q 'store.test.js"\]' "$R/gate.json" || die "bookings:test sin test/store.test.js"
  (cd "$R" && npm install --no-audit --no-fund --silent >/dev/null 2>&1) || die "npm install no instaló slot-format"
  [ -e "$R/node_modules/slot-format" ] || die "sin node_modules/slot-format"
  commit "test(bookings): el almacén guarda una reserva, con slot-format"
}
# develop avanza mientras la 0010 está abierta: código nuevo y una fila de roadmap en el mismo sitio que la que toca el cierre.
develop_advances() {
  g checkout -q develop
  printf "export const rooms = ['Norte', 'Sur'];\n" | put src/rooms.js
  sed -i 's/^| 0010 | \*\*Motivo al cancelar\*\*.*$/&\n| 0015 | **Salas en su módulo**: la lista de salas sale de `app.js` | ✅ |/' "$R/.docs/sdd/roadmap.md"
  commit "feat(rooms): las salas en su módulo (0015)"
  g checkout -q feature/0010-cancel-reason
}
# bookings.md en develop antes de abrir la 0010, cuyo cierre le añade sus dos requisitos; develop le añade otro al final mientras tanto.
CAP=.docs/sdd/capabilities/bookings.md
capability_base() {
  printf -- '# Capacidad — bookings\n\n## Propósito\n\nReservar y cancelar salas.\n\n## Requisitos\n\n### Reservar una sala\n\n- GIVEN la sala Sur libre el lunes a las 10:00\n- WHEN se ejecuta `reservar Sur lun 10:00`\n- THEN responde «reservada Sur lun 10:00»\n\n## Reglas de la capacidad\n\n- **Dónde viven los datos**: en memoria, en `src/app.js`\n- **Idioma de los nombres**: castellano\n- **Límites**: no aplica\n- **Avisos**: no aplica\n- **Regla ante conflicto**: no aplica\n' | put "$CAP"
  commit "docs(sdd): capacidad bookings"
}
capability_advances() {
  g checkout -q develop
  sed -i 's/^## Reglas de la capacidad$/### Las salas salen de su módulo\n\n- GIVEN `src\/rooms.js` con Norte y Sur\n- WHEN se ejecuta `salas`\n- THEN responde «Norte, Sur»\n\n&/' "$R/$CAP"
  grep -q 'Las salas salen de su módulo' "$R/$CAP" || die "no se plantó el requisito de la 0015"
  commit "docs(sdd): requisito de salas en bookings (0015)"
  g checkout -q feature/0010-cancel-reason
}

# Otra feature abierta en su worktree, junto al del molde.
other_worktree() { g worktree add -q -b feature/0011-others "$RUN/0011-others" develop; }

# Un gate de cierre filtrado, con los flags de moon: bookings:test lee app.js y sus tests; rooms:test, rooms.js y el suyo.
FILTERED_GATE='node scripts/gate.mjs run bookings:test rooms:test --affected --base develop'
affected_gate() {
  local gate="$HERE/fixtures/gate"
  mkdir -p "$R/scripts"; cp "$gate/gate.mjs" "$R/scripts/gate.mjs"; cp "$gate/gate.json" "$R/gate.json"
  cp "$gate/rooms.js" "$R/src/rooms.js"; cp "$gate/rooms.test.js" "$R/test/rooms.test.js"
  sed -i "s#Gate de cierre: \`node --test\` entero en verde.#Gate de cierre: \`$FILTERED_GATE\` en verde.#" "$R/.docs/sdd/constitution.md"
  grep -q 'scripts/gate.mjs' "$R/.docs/sdd/constitution.md" || die "no se plantó el gate filtrado"
  commit "chore: gate de cierre filtrado por tareas"
}
# La validación en campo de la 0010 ya se hizo sobre el último commit: el borrador del walkthrough, sin commitear.
validated_0010() {
  printf '%s\n' '# Walkthrough — Motivo al cancelar' '' '## 4. Verificación' '' '### 4.1 Builds' '' \
    "- Suite completa: \`$FILTERED_GATE\` → verde, 1 s, sobre $(short HEAD)" '' \
    "Validación en campo: 2026-10-26 · smoke por THEN (\`node src/app.js cancelar Norte lun --motivo sala-ocupada\`) y suite en verde sobre $(short HEAD)" \
    | put "$F10/walkthrough.md"
}
# Tras la validación, develop gana la 0015, que solo cambia el test de las salas.
develop_rooms_test() {
  g checkout -q develop
  printf "\ntest('las salas no se repiten', () => {\n  assert.equal(new Set(rooms).size, rooms.length);\n});\n" >> "$R/test/rooms.test.js"
  commit "test(rooms): las salas no se repiten (0015)"
  g checkout -q feature/0010-cancel-reason
}

# La 0010 es la pieza de una familia: su madre 0009 y su hermana 0016, tras ella.
family_0010() {
  sed -i 's/^feature: 0010$/feature: 0010\nparent: 0009/' "$R/$F10/spec.md"
  sed -i 's/^| 0010 | \*\*Motivo al cancelar\*\*\(.*\)| ⏳ |$/| 0009 | **Cancelaciones con motivo** — partida en 0010 y 0016 (dev-lead) | ⏳ |\n| 0010 | **Motivo al cancelar**\1— `parent: 0009` | ⏳ |\n| 0016 | **Fotos de las salas**: cada sala enseña su foto en `salas` — `parent: 0009`, tras 0010 | ⏳ |/' "$R/.docs/sdd/roadmap.md"
  grep -q '^| 0016 |' "$R/.docs/sdd/roadmap.md" || die "no se plantó la familia de la 0010"
  commit "docs(sdd): la 0010 es pieza de la 0009"
}
# Una ADR candidata en la spec, una ADR válida y otra ajena sin «Confirmación» en decisions/.
adrs_0010() {
  sed -i 's/^## Enmiendas$/## Términos y ADR\n\n- Términos resueltos: ninguno\n- ADR candidatas: El motivo de una cancelación se guarda en la propia reserva — alternativa descartada: una tabla de motivos aparte\n\n## Enmiendas/' "$R/$F10/spec.md"
  printf -- '---\nstatus: accepted\ndate: 2026-09-15\nrutas:\n  - src/**\n---\n\n# Las reservas viven en memoria\n\n## Contexto y problema\n\nUna demo sin base de datos.\n\n## Opciones consideradas\n\n- Memoria\n- SQLite\n\n## Decisión\n\nMemoria, por simplicidad.\n\n### Consecuencias\n\n- Se pierden al reiniciar.\n\n### Confirmación\n\nLa revisión.\n' | put .docs/sdd/decisions/0001-bookings-in-memory.md
  printf -- '---\nstatus: accepted\ndate: 2026-09-20\nrutas:\n  - test/**\n---\n\n# Los tests usan node:test\n\n## Contexto y problema\n\nSin dependencias.\n\n## Opciones consideradas\n\n- node:test\n- vitest\n\n## Decisión\n\nnode:test.\n\n### Consecuencias\n\n- Sin dependencias.\n' | put .docs/sdd/decisions/0002-node-test.md
  commit "docs(sdd): ADR candidata y decisiones del proyecto"
}
# Un capítulo de capacidades donde el literal que cambia el patch se repite fuera de su requisito.
capability_0008() {
  printf -- '# Capacidad — bookings\n\n## Propósito\n\nReservar y cancelar salas.\n\n## Requisitos\n\n### Cancelar una reserva\n\n- GIVEN una reserva de Sur el lunes a las 10:00\n- WHEN se ejecuta `cancelar lun 10:00`\n- THEN responde siempre «cancelada lun 10:00»\n\n## Reglas de la capacidad\n\n- **Dónde viven los datos**: en memoria, en `src/app.js`\n- **Idioma de los nombres**: castellano\n- **Límites**: no aplica\n- **Avisos**: «cancelada <día> <franja>», siempre, exista o no la reserva\n- **Regla ante conflicto**: no aplica\n' | put .docs/sdd/capabilities/bookings.md
}
patch_delta_0008() {
  sed -i 's/^Ninguna, porque el proyecto no tiene `capabilities\/`\.$/- Modificadas: `bookings` — cambia «Cancelar una reserva»/' "$R/$P8/patch.md"
  printf -- '\n## Delta de capacidad\n\n### Capacidad: `bookings`\n\n**MODIFIED — Cancelar una reserva** (antes: «responde siempre «cancelada lun 10:00»»)\n\n- GIVEN una reserva de Sur el lunes a las 10:00\n- WHEN se ejecuta `cancelar lun 10:00`\n- THEN responde «cancelada lun 10:00»\n- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»\n' >> "$R/$P8/patch.md"
  g add -A; g commit -q --amend --no-edit
}
# Un walkthrough en borrador que cita el sha de un commit del tramo que el cierre junta.
cited_sha_0010() {
  sed -i 's/return index === -1 ? undefined : params\[index + 1\];/return index === -1 ? undefined : params[index + 1]?.trim();/' "$R/src/app.js"
  commit "fix(bookings): el motivo sin espacios alrededor"
  local fix; fix=$(short HEAD)
  printf -- '# Walkthrough — Motivo al cancelar (borrador)\n\n## 1. Qué se hizo\n\n- Las dos tasks del plan.\n- Arreglo de la validación: `%s` quita los espacios del motivo.\n' "$fix" | put "$F10/walkthrough.md"
  commit "docs(sdd): borrador del walkthrough de la 0010"
}
# ROADMAP.md y debt.md de la 3.0.0 en lugar de roadmap.md.
roadmap_300() {
  g rm -q .docs/sdd/roadmap.md
  printf -- '# Roadmap — salas\n\n## Now\n\nPerfil de control: delegate\n\n| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n| 0010 | — | **Motivo al cancelar**<br>*Al cancelar se elige un motivo*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** spec de la 0010<br>**Decisiones ya tomadas:** —<br>**Salda:** «El motivo de cancelar no se valida» entera; «Los motivos no se traducen», solo el castellano<br>**Toca:** `src/app.js`</details> | 🔄 | — | M |\n\n## Next\n\n| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n\n## Later\n\n| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n| B1 | — | **Exportar a calendario**<br>*Las reservas en .ics* | ⏳ | — | — |\n' | put ROADMAP.md
  printf -- '# Deuda técnica — salas\n\n## Por triar\n\n| Ítem | Origen | Fecha |\n| --- | --- | --- |\n\n## En espera\n\n| Ítem | Origen | Impacto | Falta | Fecha |\n| --- | --- | --- | --- | --- |\n\n## Lista\n\n| Ítem | Origen | Impacto | Evidencia | Destino |\n| --- | --- | --- | --- | --- |\n| El motivo de cancelar no se valida | revisión de la 0007 | medio | `cancelar Sur mar --motivo xyz` | 0010 |\n| Los motivos no se traducen (castellano e inglés) | cliente | bajo | `canceladas` | 0010 |\n\n## Descartadas\n\n| Ítem | Origen | Motivo | Fecha |\n| --- | --- | --- | --- |\n' | put .docs/sdd/steering/debt.md
  commit "docs(sdd): roadmap y deuda en la forma 3.0.0"
}

case "$(cell Molde)" in
  reservas) mold_reservas; done_0010 ;;
  reservas-family) mold_reservas; done_0010; family_0010 ;;
  reservas-family-done) mold_reservas; done_0010; family_0010
    sed -i 's/^| 0009 | \*\*Cancelaciones con motivo\*\*\(.*\)| ⏳ |$/| 0009 | **Cancelaciones con motivo**\1| ✅ |/' "$R/.docs/sdd/roadmap.md"
    grep -q '^| 0009 .*| ✅ |$' "$R/.docs/sdd/roadmap.md" || die "no se cerró la madre 0009"
    commit "docs(roadmap): la 0009 cerrada" ;;
  reservas-adr) mold_reservas; done_0010; adrs_0010 ;;
  reservas-sha) mold_reservas; done_0010; cited_sha_0010 ;;
  reservas-300) mold_reservas; roadmap_300; done_0010 ;;
  salas-capability) capability_0008; done_0008; patch_delta_0008 ;;
  reservas-base) mold_reservas; done_0010; develop_advances; other_worktree; printf 'apuntes de la 0010\n' > "$R/notes.md"
    export TURN2='notes.md era un apunte mío: bórralo y sigue con el cierre.' ;;
  reservas-capbase) mold_reservas; capability_base; done_0010
    sed -i 's/^- Nuevas: `bookings`/- Modificadas: `bookings`/' "$R/$F10/spec.md"; commit "docs(sdd): bookings ya existe"
    develop_advances; capability_advances ;;
  reservas-gate-base) mold_reservas; affected_gate; done_0010; develop_rooms_test; validated_0010
    export TURN2='El walkthrough sin commitear es el borrador del paso 7: sigue con el cierre.' ;;
  reservas-gate-open) mold_reservas; affected_gate; done_0010; develop_rooms_test; other_worktree ;;
  reservas-gate-plan) mold_reservas; affected_gate; g checkout -q -b feature/0010-cancel-reason
    approved_0010 | put "$F10/spec.md"; put "$F10/plan.md" < "$IMPL/fixtures/plan-0010.md"
    commit "docs(sdd): abrir la feature 0010 con su spec y su plan" ;;
  reservas-red) mold_reservas; e2e_red_base; done_0010 ;;
  reservas-flaky) mold_reservas; flaky_test; done_0010 ;;
  reservas-gate-red) mold_reservas; affected_gate; store_red_test; done_0010 ;;
  reservas-e2e) mold_reservas; e2e_suite; done_0010 ;;
  reservas-e2e-stale) mold_reservas; e2e_suite; done_0010; stale_server ;;
  reservas-plan) mold_reservas; e2e_red_base; g checkout -q -b feature/0010-cancel-reason
    approved_0010 | put "$F10/spec.md"; put "$F10/plan.md" < "$IMPL/fixtures/plan-0010.md"
    commit "docs(sdd): abrir la feature 0010 con su spec y su plan" ;;
  salas-patch) done_0008 ;;
  salas-report) manual_validation; done_0008; report_0008 ;;
  reservas-e2e-manual) manual_validation; mold_reservas; e2e_suite; done_0010 ;;
  reservas-start) manual_validation; mold_reservas; e2e_suite; start_environment; done_0010
    printf '{"validation": {"startEnvironment": true}}\n' > "$R/.docs/sdd/sdd-kit.local.json" ;;
  reservas-start-down) manual_validation; mold_reservas; e2e_suite; start_environment; broken_environment; done_0010
    printf '{"validation": {"startEnvironment": true}}\n' > "$R/.docs/sdd/sdd-kit.local.json" ;;
  salas-hotfix) done_0008 hotfix; export TURN2='Sobre la migración: sí, este hotfix pide al proyecto la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`.' ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac

case "$SC" in
  r1|r2) MAX_TURNS="${MAX_TURNS:-4}" ;;
  *) MAX_TURNS="${MAX_TURNS:-60}" ;;
esac

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
ENV_AT_END=abajo
[ -f "$R/e2e/config.json" ] && curl -sf "http://localhost:$E2E_PORT/health" >/dev/null 2>&1 && ENV_AT_END="arriba en el puerto $E2E_PORT"
# Lo que quede escuchando en el puerto de la suite, del sujeto o del servidor ajeno, se para.
[ -f "$R/scripts/env-down.mjs" ] && "$NODE" "$R/scripts/env-down.mjs" >/dev/null 2>&1
for kept in tasks walkthrough patch; do
  for dir in "$F10" "$P8"; do [ -f "$R/$dir/$kept.md" ] && subject_keep "$R/$dir/$kept.md" "$kept.md"; done
done
for mig in "$R"/skills/sdd-upgrade/references/migrations/v*.md; do [ -f "$mig" ] && subject_keep "$mig" "$(basename "$mig")"; done
for kept in ROADMAP.md .docs/sdd/steering/debt.md .docs/sdd/capabilities/bookings.md; do [ -f "$R/$kept" ] && subject_keep "$R/$kept" "$(basename "$kept")"; done
for adr in "$R"/.docs/sdd/decisions/*.md; do [ -f "$adr" ] && subject_keep "$adr" "$(basename "$adr")"; done
[ -f "$R/.docs/sdd/steering/operations.md" ] && subject_keep "$R/.docs/sdd/steering/operations.md" operations.md
for doc in roadmap tech-stack changelog; do [ -f "$R/.docs/sdd/$doc.md" ] && subject_keep "$R/.docs/sdd/$doc.md" "$doc.md"; done
{ echo "## petición"; echo "$ASK"; echo "## entorno al acabar el sujeto"; echo "$ENV_AT_END"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all --graph; echo "## etiquetas"; g tag -n1
  echo "## roadmap en develop"; g show develop:.docs/sdd/roadmap.md 2>/dev/null; echo "## bookings en develop"; g show "develop:$CAP" 2>/dev/null; echo "## tech-stack en develop"; g show develop:.docs/sdd/tech-stack.md 2>/dev/null | tail -n 20; } | subject_save
