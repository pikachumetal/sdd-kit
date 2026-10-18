#!/usr/bin/env bash
# Sujeto de la batería de sdd-archive: una feature o un patch hechos, listos para cerrar.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
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
  commit "feat(bookings): listado de canceladas con su motivo"
  A=$(short HEAD)
  printf '%s\n' '---' 'id: 20261008-100000-feature-0010-cancel-reason' 'title: Tasks — Motivo al cancelar' '---' '' '# Tasks — Motivo al cancelar (registro vivo)' '' \
    '| # | Task | Status | Commit | Notas |' '| --- | --- | --- | --- | --- |' "| 1 | Cancelar con motivo | done | $A | |" "| 2 | Listado de canceladas | done | $A | |" '' \
    "Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre $A" '' '## Rulings' '' \
    '- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble' \
    | put "$F10/tasks.md"
  commit "docs(sdd): tasks.md con la revisión final"
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

# Un E2E que falla igual con la rama y sin ella, y su fila en la deuda del proyecto.
e2e_red_base() {
  printf "import test from 'node:test';\n\ntest('exportar reservas a csv', () => {\n  throw new Error('TimeoutError: export no respondió en 5000 ms');\n});\n" | put test/export.e2e.test.js
  sed -i 's/^| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |$/&\n| `test\/export.e2e.test.js` falla con «TimeoutError: export no respondió» también en `develop` | Medio | Patch cuando moleste |/' "$R/.docs/sdd/roadmap.md"
  grep -q 'export.e2e' "$R/.docs/sdd/roadmap.md" || die "no se plantó la fila de deuda del E2E"
  commit "test: e2e de exportación"
}
# develop avanza mientras la 0010 está abierta: código nuevo y una fila de roadmap en el mismo sitio que la que toca el cierre.
develop_advances() {
  g checkout -q develop
  printf "export const rooms = ['Norte', 'Sur'];\n" | put src/rooms.js
  sed -i 's/^| 0010 | \*\*Motivo al cancelar\*\*.*$/&\n| 0015 | **Salas en su módulo**: la lista de salas sale de `app.js` | ✅ |/' "$R/.docs/sdd/roadmap.md"
  commit "feat(rooms): las salas en su módulo (0015)"
  g checkout -q feature/0010-cancel-reason
}
# Otra feature abierta en su worktree, junto al del molde.
other_worktree() { g worktree add -q -b feature/0011-others "$RUN/0011-others" develop; }

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
  reservas-red) mold_reservas; e2e_red_base; done_0010 ;;
  reservas-plan) mold_reservas; e2e_red_base; g checkout -q -b feature/0010-cancel-reason
    approved_0010 | put "$F10/spec.md"; put "$F10/plan.md" < "$IMPL/fixtures/plan-0010.md"
    commit "docs(sdd): abrir la feature 0010 con su spec y su plan" ;;
  salas-patch) done_0008 ;;
  salas-hotfix) done_0008 hotfix; export TURN2='Sobre la migración: sí, este hotfix pide al proyecto la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`.' ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac

case "$SC" in
  r1|r2) MAX_TURNS="${MAX_TURNS:-4}" ;;
  *) MAX_TURNS="${MAX_TURNS:-60}" ;;
esac

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
for kept in tasks walkthrough patch; do
  for dir in "$F10" "$P8"; do [ -f "$R/$dir/$kept.md" ] && subject_keep "$R/$dir/$kept.md" "$kept.md"; done
done
for mig in "$R"/skills/sdd-upgrade/references/migrations/v*.md; do [ -f "$mig" ] && subject_keep "$mig" "$(basename "$mig")"; done
for kept in ROADMAP.md .docs/sdd/steering/debt.md .docs/sdd/capabilities/bookings.md; do [ -f "$R/$kept" ] && subject_keep "$R/$kept" "$(basename "$kept")"; done
for adr in "$R"/.docs/sdd/decisions/*.md; do [ -f "$adr" ] && subject_keep "$adr" "$(basename "$adr")"; done
for doc in roadmap tech-stack changelog; do [ -f "$R/.docs/sdd/$doc.md" ] && subject_keep "$R/.docs/sdd/$doc.md" "$doc.md"; done
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all --graph; echo "## etiquetas"; g tag -n1
  echo "## roadmap en develop"; g show develop:.docs/sdd/roadmap.md 2>/dev/null; echo "## tech-stack en develop"; g show develop:.docs/sdd/tech-stack.md 2>/dev/null | tail -n 20; } | subject_save
