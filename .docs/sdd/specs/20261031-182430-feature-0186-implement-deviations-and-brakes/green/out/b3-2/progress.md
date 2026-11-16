# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md

## Pre-flight scan

| Filas | Comprobado | Hallazgo |
| --- | --- | --- |
| Pares de tasks | Solo hay una task: ningún par comparte fichero o interfaz | — |
| Task 1 | Tests RED `test/free.test.js` frente a Ficheros (lo crea) y Scope; README solo la línea de `libres` | Coherente, salvo que el GIVEN no se puede montar solo con `run` (ver ruling) |

Setup: Ruling: trabajo en el checkout, en `feature/0027-free-rooms-empty`, sin worktree nuevo — la rama de la feature ya existe aquí con spec y plan, y no es `main` — si fallara: mover los commits de rama.
Task 1: Ruling: base movida, solape en `README.md` — rama línea 11 (`libres`, la que toca la task), `develop` línea 11 (1e30606, 0030); solape declarado en «Decisiones tomadas con el dev-lead» y la base queda dentro de «Comandos»; fila 0027 sin cambios en el roadmap; sigo — si fallara: conflicto de una línea al fusionar, ya previsto por el dev-lead.
Task 1: Ruling: exporto `bookings` de `src/app.js` para montar el GIVEN — `run` no puede ocupar salas (`reservar` no guarda) y sembrar otra reserva cambiaría lo que responde `libres` — si fallara: un export de más, retirarlo es una línea.
Task 1: complete (commits d6b0767..ab9bf1e, tests: node --test → ℹ duration_ms 162.6177)
