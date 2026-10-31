# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md

Baseline: `node --test` en worktree separado sobre 63bf707 -> 4/4 en verde.
Ruling: sin worktree nuevo; se trabaja en el checkout, en feature/0027-free-rooms-empty (no es main) — la rama ya aísla la feature — si es incorrecto: mover la rama a un worktree, sin commits perdidos.

## Pre-flight
| Fila | Comprobado | Resultado |
| --- | --- | --- |
| Task 1 (coherencia interna) | RED test/free.test.js cubre el THEN; Ficheros y Produces coinciden | limpio |
| Pares de tasks | solo hay una task | no aplica |

Task 1: freno de alcance: fichero de la task cambiado en la base — README.md: f21215c cambia la línea 11 en develop (`libres <franja> [--planta <n>]`, «por planta»), la misma que toca la task; solape que la spec no declara. Perfil delegate: parada antes de los tests RED. Esperando decisión del dev-lead.
