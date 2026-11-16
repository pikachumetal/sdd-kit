# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única) | RED h0/h1 contra el Scope y la constitución; Verificación `node --test` | `node --test` no tiene tests: sale 0 con 0 tests, no comprueba la guía; la prueba real son los humos (Art. I) |

Task 1: Ruling: base check limpio — develop sin cambios desde el merge-base.
Task 1: Ruling: aviso del paso 1 escrito — h1 exhibe el fallo (0 de 2: nota.md, sin-titulo.md) — si fuera otra la causa, el humo verde lo diría.
Task 1: bloqueo: h0 limpio a n = 1; para sacar la frase del paso 2 con Ruling hace falta limpio a n = 3; con n = 1 es desviación. No puedo lanzar sujetos headless (claude anidado bloqueado) — tampoco el humo verde de h1.
