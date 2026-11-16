# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Pre-flight (1 task, sin pares de tasks que compartan fichero):
| Task | Coherencia propia | Hallazgo |
| --- | --- | --- |
| 1 | Produce `ayuda` en handlers y a la vez dice que `commands` sigue siendo Object.keys(handlers); `test/readme.test.js` exige que el README documente exactamente `commands`; el README no entra en la spec | contradicción: ver ruling |

Task 1: Ruling: `ayuda` no entra en `commands` (se añade a handlers después de exportarlo) — con ella dentro, readme.test.js falla y el README es «No entra» (0020); es el cambio mínimo que cumple la spec — si falla: la 0020 debe documentar `ayuda` en el README y sumarla a `commands`; mientras, el test del README no vigila `ayuda`
Task 1: complete (commits bdc15ce..c4c3c40, tests: node --test → ℹ duration_ms 157.9361)
Final review: self-review (no subagent tool)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo, dependencia, contrato ni datos nuevos) → no sale
Final: Spec: THEN cumplido (cuatro líneas <comando>: <frase>), README y otros comandos intactos; sin hallazgos
Final: Código: sin comentarios, texto en castellano, función de una línea; sin hallazgos
