# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md
Baseline: `node --test` en worktree separado (fc0c81e) → 4/4 pass
Ruling: trabajo en el checkout, sin worktree propio — la rama feature/0027-free-rooms-empty ya existe y está limpia, no es main — si fuera mal, mover un commit a otra rama
Pre-flight:
| Fila | Qué comprobé | Resultado |
| --- | --- | --- |
| Pares de tasks | Solo hay Task 1: no hay ficheros ni interfaces compartidos | sin filas |
| Task 1 consigo misma | Ficheros, Produce y Scope de la spec coinciden; pero `Consume: run` no basta para el GIVEN: `run` no crea reservas | Hallazgo: se resuelve en la Task 1 con un Ruling |
Task 1: Ruling: base movida en README.md sin solaparse — develop cambia la línea 17 («Soporte»), la task toca la línea 11 (`libres`, «Comandos»); la fila de la feature no cambia — si fuera mal, un conflicto de merge de una línea
Task 1: Ruling: `export const bookings` en src/app.js, además de `run` — el GIVEN pide Norte y Sur ocupadas y `run` no crea reservas ni hay otra vía; exportar no cambia ninguna respuesta, y sembrar datos sí la cambiaría — si fuera mal, otra vía de preparar el test y una línea
Task 1: Ruling: enmiendo mi propio commit de la task (sin publicar) — mi sed + core.autocrlf=true pasaron src/app.js de CRLF a LF y reescribían el fichero entero; se restaura el CRLF para que el diff sean sus 2 líneas — si fuera mal, un commit local rehecho
Task 1: complete (commits fc0c81e..8c026e7, tests: node --test → ℹ duration_ms 182.0058)
Task 1: nota: la línea complete recoge «duration_ms» como resultado porque es lo último que imprime node --test; el resultado real sobre 8c026e7 es 5/5 pass, exit 0
Final review: self-review (no subagent tool)
Final: Ruling: Eje Arquitectura sin línea en el plan → no sale — el plan no trae la línea; el diff no añade módulos, dependencias ni datos — si fuera mal, una revisión de arquitectura pendiente
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: Ruling: `sin salas` aún no se alcanza desde la terminal — el único dato sembrado es Norte y `reservar` no guarda reservas, así que el GIVEN solo se da preparando `bookings` en el test; la spec no pide más y arreglarlo queda fuera de su Scope — si fuera mal, la respuesta no se verá en uso hasta que `reservar` guarde
Final: Ruling: `libres` sigue sin distinguir el día — una reserva de lunes ocupa esa franja todos los días; es anterior a esta rama y queda fuera del Scope — si fuera mal, `sin salas` podría salir con salas libres otro día
Final: minor (deferred): `bookings` se exporta mutable solo para el test (src/app.js:3)
Final: minor (deferred): test/free.test.js quedó en LF y sus vecinos de test/ están en CRLF
