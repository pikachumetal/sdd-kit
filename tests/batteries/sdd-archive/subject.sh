#!/usr/bin/env bash
# Sujeto de la batería de sdd-archive: una feature o un patch hechos, listos para cerrar.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
IMPL="$HERE/../sdd-implement"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
# En el RED el kit aún no tiene sdd-archive: la guarda mira la skill de cierre de ese kit.
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
    printf '# Migraciones\n\nUna por versión, `vX.Y.Z.md`: los pasos que el proyecto aplica al subir.\n' | put skills/sdd-init-brownfield/references/migrations/README.md
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

case "$(cell Molde)" in
  reservas) mold_reservas; done_0010 ;;
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
for mig in "$R"/skills/sdd-init-brownfield/references/migrations/v*.md; do [ -f "$mig" ] && subject_keep "$mig" "$(basename "$mig")"; done
for doc in roadmap tech-stack changelog; do [ -f "$R/.docs/sdd/$doc.md" ] && subject_keep "$R/.docs/sdd/$doc.md" "$doc.md"; done
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all --graph; echo "## etiquetas"; g tag -n1
  echo "## roadmap en develop"; g show develop:.docs/sdd/roadmap.md 2>/dev/null; echo "## tech-stack en develop"; g show develop:.docs/sdd/tech-stack.md 2>/dev/null | tail -n 20; } | subject_save
