# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight
| Fila | Comprobado | Resultado |
| --- | --- | --- |
| Task 1 consigo misma | RED (h0, h1) "fallan sin la guía" frente a red/h0.txt | h0 NO falla: 2 de 2 limpios. Conflicto con constitución Art. I (segundo) |
| Task 1 consigo misma | Verificación node --test frente a Superficies docs | el repo no tiene tests: 0 tests, exit 0, no prueba nada |
| Pares de tasks | una sola task | no aplica |

Task 1: Ruling: repo normal en feature/0026-note-title-date, sin worktree enlazado; trabajo en sitio porque la sesión se abrió aquí — ninguna rama de integración tocada — coste si es erróneo: mover la rama a un worktree.
Task 1: Ruling: baseline node --test en detached → 0 tests, exit 0; no es evidencia de nada — coste si es erróneo: ninguno.
Task 1: Ruling: paso 1 escrito sin commitear (h1 RED 0 de 2) — dentro del Scope en cualquier resultado de la enmienda — coste si es erróneo: revertir una línea.
Task 1: Ruling: humo GREEN de h1 NO corrido: el binario claude del PATH es un stub que bloquea sujetos anidados y no hay herramienta de subagente; no lo esquivo — la task no se cierra sin él (Art. I) — coste: la task sigue abierta.
Task 1: DESVÍO pendiente: h0 limpio n=2, punto del Scope sin marca «si el RED lo exhibe» → corrección de spec sin commitear, a la espera del dev-lead. Sin sdd task done ni commit.
