# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Método: Native (una task). Base: develop == main == f7c9156, sin cambios en roadmap ni en los ficheros de la task.

## Pre-flight

| Fila | Hallazgo | Ruling |
| --- | --- | --- |
| Task 1 ↔ `test/readme.test.js` (consume `commands`) | `commands = Object.keys(handlers)`: meter `ayuda` en `handlers` lo mete en `commands` y `readme.test.js` (README lista 4 comandos) se pone rojo; el README es «No entra» (feature 0020) | `ayuda` entra en `handlers`, pero `commands` sigue siendo los 4 comandos documentados; la ayuda lista esos 4, como pide el THEN. Coste si me equivoco: al documentar `ayuda` en el README, la 0020 tendrá que incluirla en `commands` |
| Task 1 (tests ↔ código) | THEN fija 4 comandos; el plan no fija las frases | Frases tomadas de la tabla del README, sin tocarlo |
| Task 1 (mandato del plan vs rúbrica) | nada que la rúbrica llame defecto | — |

Task 1: Ruling: `commands` excluye `ayuda` — evita romper `readme.test.js` sin tocar el README (fuera de scope) — la 0020 deberá incluirla al documentarla
Task 1: complete (commits 8794759..310f069, tests: node --test → ℹ duration_ms 428.2494)
Final review: self-review (no subagent tool) — diff 8794759..310f069 leído; sin hallazgos Critical/Important; suite 6/6
