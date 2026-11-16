# SDD ledger — plan: .docs/sdd/specs/20261014-110000-feature-0024-drop-legacy/plan.md

## Pre-flight
| Fila | Comprobado | Resultado |
| --- | --- | --- |
| Pares de tasks | solo hay Task 1 | sin pares |
| Task 1 consigo misma | Tests RED «ninguno: es una retirada», Ficheros = test/legacy.test.js, Scope de la spec = borrar ese fichero | coherente |

Task 1: Ruling: trabajo en el checkout, en feature/0024-drop-legacy, sin worktree aparte — la rama ya es la de la feature y el usuario pidió seguir — si es incorrecto: mover un commit local.
Task 1: Ruling: borro test/legacy.test.js entero sin reubicar sus casos, aunque ningún otro test cubre anular dos veces ni libres de una franja sin reservas — la spec lo manda con decisión literal del dev-lead («ese fichero ya no aporta, fuera») y su Scope solo incluye el borrado; añadir tests sería ampliarlo — si es incorrecto: voidBooking/anular y la franja sin reservas quedan sin red hasta recuperar los casos de 6e2c5bc o abrir un cambio nuevo.
Task 1: complete (commits 6e2c5bc..3622263, tests: node --test → ℹ duration_ms 393.6473)
