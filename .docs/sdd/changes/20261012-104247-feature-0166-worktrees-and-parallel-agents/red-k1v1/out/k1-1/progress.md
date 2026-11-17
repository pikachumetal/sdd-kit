# SDD ledger — plan: .docs/sdd/specs/20261010-100000-feature-0018-help/plan.md

Método: Native (plan: una task, un fichero). Base: b5a3504, sin cambios en develop respecto al merge-base.

## Pre-flight scan

| Fila | Hallazgo | Ruling |
| --- | --- | --- |
| Pares de tasks | Una sola task: sin pares con fichero o interfaz compartidos | — |
| Task 1: tests vs código | `run` acepta 4 comandos (`libres`, `reservar`, `cancelar`, `anular`); el README, en «Comandos», lista 3 (falta `anular`) | **Deviation**: la spec exige a la vez «una línea por cada comando que acepta `run`» y «la misma lista que el README». No pueden cumplirse las dos; el README no entra en el scope. Sin elegir: parada. |
| Task 1: ficheros | El plan crea `test/ayuda.test.js` y toca `src/app.js`; la spec no cubre `package.json` ni README: coherente | — |
| Mandatos del plan vs rúbrica | Ninguno: el plan no manda tests vacíos ni duplicación literal | — |

Task 1: parada por deviation de la spec (THEN vs AND) — pendiente de aprobación; sin código ni RED escritos.
