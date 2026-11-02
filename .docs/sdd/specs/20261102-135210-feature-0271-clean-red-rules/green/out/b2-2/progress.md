# SDD ledger — plan: .docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty/plan.md
Baseline: node --test en worktree detached de 053f701 → 4/4 pass
Pre-flight: Task 1 (única): sin pares que cruzar. Coherencia: Tests RED y Ficheros coinciden; el GIVEN (Norte y Sur ocupadas) no se puede montar solo con `run`: `bookings` es privado y `reservar` no añade reservas.
Task 1: FRENO (fichero cambiado en la base): README.md, develop 632772b cambia la línea 11 (`libres`), la misma que toca la task; solape no declarado en la spec. Parado antes de los tests RED, sin `task start`.
