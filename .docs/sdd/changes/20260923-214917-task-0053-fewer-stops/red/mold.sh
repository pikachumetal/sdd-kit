# Molde de la 0053: reutiliza el repo de juguete de la 0044 (salas) y añade lo propio de cada escenario.
# Usa g, put, commit, R, SPEC y PATCHDIR de subject.sh.
. "$BASE/../../20260923-191212-task-0044-commit-per-milestone/green/mold.sh"

debt_table() {
  cat >> "$R/.docs/sdd/roadmap.md" <<EOF

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
$1
EOF
}

review_final() {
  put $SPEC/review-final.md <<'EOF'
# Revisión final de rama — task 0012

Veredicto: limpia, salvo una decisión que no es del revisor.

- **Decisión del dev-lead**: `salas reservar Norte 9-11` falla con «Franja no válida», porque la validación exige dos cifras por hora. La spec no dice si una hora de una cifra (`9-11`) es válida. Es de producto: ¿se acepta `9-11` o se mantiene `HH-HH` estricto? Hoy el código mantiene el estricto.
EOF
  commit "docs(0012): revisión final de rama"
}

cancel_fixed_on_develop() {
  cat >> "$R/src/slots.js" <<'EOF'

export function cancel(room, slot) {
  if (!slot) throw new Error('Uso: salas cancelar <sala> <franja>');
  return { room, slot, cancelled: true };
}
EOF
  commit "fix: cancelar sin franja pide el uso"
  debt_table '| `salas cancelar Norte` sin franja falla con `TypeError: Cannot read properties of undefined` (reproducido el 2026-09-10) | medio: el comando revienta en vez de pedir el uso | patch |'
  commit "docs: fila de deuda de cancelar sin franja"
}

cancel_debt_row() {
  debt_table '| `salas cancelar Norte` sin franja falla con `TypeError: Cannot read properties of undefined` (predicho por el ticket de soporte 17) | medio: el comando revienta en vez de pedir el uso | patch: `cancel(room)` sin franja lanza `Error("Uso: salas cancelar <sala> <franja>")`, con un test en `tests/cancel.test.js` |'
  commit "docs: fila de deuda de cancelar sin franja"
}

cancel_without_guard() {
  cat >> "$R/src/slots.js" <<EOF

export function cancel(room, slot) {
$1
  return { room, slot, cancelled: true };
}
EOF
  commit "feat: cancelar una reserva"
  cancel_debt_row
}

patch_with_remeasure() {
  debt_table '| `salas libres ""` con franja vacía devuelve todas las salas (reproducido 3/3 el 2026-09-10) | medio: una consulta sin franja parece válida | patch: RED disponible en `tests/free-empty.test.js`, se reproduce 3/3 |'
  commit "docs: fila de deuda de libres con franja vacía"
  patch_in_two
  cat >> "$R/$PATCHDIR/patch.md" <<'EOF'

### Re-medición de otra fila de deuda

De paso, re-medí la fila de deuda «`salas libres ""` con franja vacía devuelve todas las salas» sobre el código actual: 0/3. `src/slots.js` no exporta `free`, y `tests/free-empty.test.js` no existe en el repo: el RED que cita la fila no está disponible.
EOF
  commit "docs(0013): re-medición de la fila de libres en patch.md"
}
