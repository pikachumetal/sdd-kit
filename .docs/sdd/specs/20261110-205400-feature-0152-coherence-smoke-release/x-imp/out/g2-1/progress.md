# SDD ledger — plan: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/plan.md

Spec: .docs/sdd/specs/20261014-100000-feature-0023-attempt-failure/spec.md (approved). Método: Native. Perfil: delegate.
Baseline: `node --test` en worktree detached de 8d1a1f1 → 4/4 verde.

## Pre-flight scan

| Fila | Qué comprobé | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 (única; sin pares que compartan fichero) | Tests RED (`report.test.js`, `attempt.test.js`) frente a Produce (`attempt`, `failureReport`) y Ficheros | Coherente; `test/attempt.test.js` aún no existe | Se escribe en esta task |
| Task 1 frente a Restricciones globales | Texto en castellano; no tocar `scripts/slow-gate.mjs` | Sin conflicto | — |
| Task 1 frente a Review Focus | «ninguna» | — | — |

Base check Task 1: `git diff $(merge-base) develop -- ROADMAP.md` vacío; `--name-only` vacío → sin cruce con los ficheros de la task.

Task 1: Ruling: workspace en sitio, sin worktree nuevo — la rama feature/0023 ya está fuera de main y los ficheros de la task estaban sin commitear en este checkout — si fuera errado, coste nulo: la rama aísla igual.
Task 1: Ruling: `src/attempt.js` llegó escrito antes de ver fallar ningún test; lo aparto a `.temp/sdd/plan/aparcado/` (no se borra, por ser trabajo sin commitear del usuario) y se reescribe desde los RED — si fuera errado, se pierde solo el tiempo de reescribir 7 líneas.
Task 1: Ruling: la ruta de scripts/slow-gate.mjs se resuelve desde el módulo (import.meta.url) y no desde el cwd, a diferencia de la versión aparcada — attempt() no debe depender de dónde se lance node — si fuera errado, coste nulo: mismo comportamiento lanzado desde la raíz.
Task 1: complete (commits 8d1a1f1..6f8938f, tests: node --test → ℹ duration_ms 30251.377)
