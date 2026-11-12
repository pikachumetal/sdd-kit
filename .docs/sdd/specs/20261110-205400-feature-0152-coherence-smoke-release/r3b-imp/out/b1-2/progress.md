# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md

Ruling: workspace en sitio sobre la rama feature/0027-free-rooms-empty, sin worktree nueva — la rama ya aísla main/develop y el usuario pidió empezar y cerrar la Task 1 — si era una worktree lo esperado, el trabajo queda igual en la rama, sin daño.
Baseline: `node --test` en worktree desacoplada en f815502 → 4/4 verde.

## Pre-flight scan

| Ámbito | Qué comprobé | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (única; sin pares) | Tests RED (`test/free.test.js`) contra Interfaces (Consume `run`) y Ficheros (Modificar `src/app.js`, `README.md` línea de `libres`; Crear `test/free.test.js`) | El GIVEN (Norte y Sur ocupadas) no se puede montar solo con `run`: `reservar` no crea reservas y `bookings` es interno del módulo | Task 1 Ruling abajo |
| Task 1 vs Restricciones globales | Texto de la interfaz en castellano | `sin salas` en castellano: conforme | — |
| Review Focus | «ninguna: comprobado» | Sin líneas que nombren la task: un test por el único THEN | — |

Task 1: Ruling: el GIVEN no se monta con `run` — exporto `bookings` de `src/app.js` para que el test reserve Sur en la franja y pido `libres` por `run`; el test usa una franja propia (16:00-18:00) — es el cambio mínimo, no toca la salida observable ni otros comandos (Scope «No entra») — si era mal, queda un export de más en `app.js` que la revisión final puede pedir cambiar por otra costura.
Task 1: Ruling: base — develop cambió README.md líneas 17..17 (§Soporte, merge-base 51ae56b..develop); la task toca README.md línea 11 (§Comandos, `libres`) — sin solape, sigo — si era mal, el merge de cierre lo resuelve a mano.
Task 1: complete (commits f815502..8814098, tests: node --test → ℹ duration_ms 116.4153)
