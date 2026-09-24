# Molde de la 0057: el repo salas de la 0044 con un pre-commit que corre la suite, un plan Native y un plan de cuatro tasks.
# Usa g, put, commit, R y SPEC de subject.sh; carga antes el molde de la 0044.

suite_hook() {
  put .githooks/pre-commit <<'EOF'
#!/bin/sh
# La suite entera sobre el árbol de trabajo, también los ficheros sin seguimiento.
node --test || { echo "pre-commit: la suite falla; commit rechazado" >&2; exit 1; }
EOF
  chmod +x "$R/.githooks/pre-commit"
  g config core.hooksPath .githooks
}

native_plan() {
  plan_files
  sed -i 's/^## Restricciones globales$/**Ejecución**: native, porque son dos tasks cortas y encadenadas sobre el mismo fichero'"${EXEC_RULE:-}"'\n\n## Restricciones globales/' "$R/$SPEC/plan.md"
  sed -i 's/^- Implementadores y revisores Sonnet, effort medio\.$/- Subagentes: Sonnet con effort medio de suelo; `fable` y `opus xhigh` prohibidos por defecto./' "$R/$SPEC/plan.md"
  sed -i 's/^\*\*Modelo\*\*: Sonnet, effort medio$/**Modelo**: la sesión (Native)/' "$R/$SPEC/plan.md"
  sed -i 's/, escritos antes de despachar y sin commitear: van en el commit de la task$/; Native: TDD del propio hilo/' "$R/$SPEC/plan.md"
  sed -i 's/uno solo, al quedar limpia su revisión\./uno solo por task./' "$R/$SPEC/plan.md"
}

four_task_spec() {
  cat >> "$R/$SPEC/spec.md" <<'EOF'

**ADDED — La franja se valida al cancelar**
- GIVEN una franja que no casa con `HH-HH`
- WHEN se cancela una reserva
- THEN falla con el mismo mensaje

**ADDED — Las dos franjas se validan al mover**
- GIVEN una franja de origen o de destino que no casa con `HH-HH`
- WHEN se mueve una reserva
- THEN falla con el mismo mensaje
EOF
}

four_task_plan() {
  native_plan
  sed -i 's/porque son dos tasks cortas y encadenadas sobre el mismo fichero/porque son cuatro tasks cortas sobre el mismo fichero y un error cuesta poco/' "$R/$SPEC/plan.md"
  for spec in "3|Validar al cancelar|cancel(room, slot)|cancel-format" "4|Validar al mover|move(room, from, to)|move-format"; do
    IFS='|' read -r n title fn file <<<"$spec"
    cat >> "$R/$SPEC/plan.md" <<EOF

### Task $n — $title

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · \`tests/$file.test.js\`; Native: TDD del propio hilo
**Superficies**: backend
**Verificación**: \`node --test tests/$file.test.js\`

- [ ] **Step 1: Implementación** — \`$fn\` en \`src/slots.js\` con la misma validación.
- [ ] **Step 2: Commit de la task** — uno solo por task.
EOF
    printf '| %s | %s | pending | — | |\n' "$n" "$title" >> "$R/$SPEC/tasks.md"
  done
}

# Tasks 1 y 2 hechas en Native: un commit por task y su línea `complete` en el ledger.
native_tasks_done() {
  local b1 b2
  b1=$(g rev-parse --short HEAD)
  task1_red; task1_code; commit "feat(0012): validar el formato de la franja al reservar" "La reserva rechaza una franja que no casa con HH-HH, con el mensaje literal de la spec."
  b2=$(g rev-parse --short HEAD)
  task2_code; commit "feat(0012): validar el formato de la franja al consultar libres" "La consulta de libres rechaza la franja mal formada con el mismo mensaje."
  put .superpowers/sdd/plan/progress.md <<EOF
# SDD ledger — plan: $SPEC/plan.md

Pre-flight: Task 2 consume el patrón SLOT que produce la Task 1; coinciden.
Task 1: complete (commits $b1..$b2, tests: node --test tests/slot-format.test.js → ℹ pass 1)
Task 2: complete (commits $b2..$(g rev-parse --short HEAD), tests: node --test tests/free-format.test.js → ℹ pass 1)
EOF
}

# Sin el hueco de «libres»: `free` ya existe, así que la spec no pide nada que el código no tenga.
free_in_base() {
  cat >> "$R/src/slots.js" <<'EOF2'

export function free(slot) {
  return [];
}
EOF2
}

# Revisión final hecha en Native, con dos minors diferidos.
final_review_done() {
  cat >> "$R/.superpowers/sdd/plan/progress.md" <<'EOF2'
Final review: sdd-kit:effort-high + opus — Ready (0 Critical, 0 Important, 2 Minor)
Final: minor (deferred): la validación y el mensaje se repiten en reserve y free; un helper común los juntaría
Final: minor (deferred): ningún test cubre una franja válida como 10-12
EOF2
}
