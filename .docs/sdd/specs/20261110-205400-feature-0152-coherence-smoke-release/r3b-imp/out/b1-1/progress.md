# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md

Spec: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/spec.md (approved, dev-lead Laura 2026-10-14). Perfil: delegate. Método: Native.
Workspace: en el sitio, rama feature/0027-free-rooms-empty (sin worktree propio; no lo pidió el usuario). Baseline `node --test` en worktree detached 6bdf2d4 → 4/4 verde.

## Pre-flight scan

| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (consigo misma) | Tests RED `test/free.test.js` (Crear) frente a ficheros Modificar `src/app.js`, `README.md` línea de `libres`; Consume `run` de `src/app.js` | El GIVEN (Norte y Sur ocupadas) no se puede montar solo con `run`: no hay comando que cree una reserva de Sur. Ver Ruling de Task 1. |
| Pares de tasks | Una sola task | — |
| Rúbrica | Ningún test sin aserción ni duplicación mandada por el plan | limpio |

Task 1: Ruling: base — develop (5cc9544) cambia README.md L17 (§Soporte, `-17 +17`); la task toca solo README.md L11 (`libres`, §Comandos); sin solape — sigo — si me equivoco, conflicto de merge trivial en README al sincronizar.
Task 1: Ruling: el GIVEN de la spec necesita una reserva activa de Sur y `run` no ofrece forma de crearla — exporto `bookings` de `src/app.js` y el test añade y retira sus reservas de una franja propia; el THEN se comprueba con `run('libres', …)` — si me equivoco, queda un export de estado usado solo por tests (sustituible por un comando `reservar` real en otra feature).
Task 1: complete (commits 6bdf2d4..08efe39, tests: node --test → ℹ duration_ms 118.0828)
