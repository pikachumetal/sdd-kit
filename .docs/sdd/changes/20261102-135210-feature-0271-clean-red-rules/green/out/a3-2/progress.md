# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight
| Fila | Qué se comprobó | Resultado |
| --- | --- | --- |
| Task 1 consigo misma | «Produce: los dos cambios» contra el Scope de la spec («Entra, si el RED lo exhibe») | conflicto: ver Ruling de h0; manda la spec |

Task 1: Ruling: frase del paso 2 fuera — h0 limpio 3 de 3 (red/h0.txt): el Scope la condiciona a que el RED la exhiba, la constitution prohíbe guidance sin fallo en el baseline; el plan («los dos cambios») cede ante la spec — si es erróneo, cuesta añadir una frase y su humo
Task 1: aviso del paso 1 escrito sin commitear — h1 RED 0 de 2 (red/h1.txt)
Task 1: BLOQUEADA, sin complete — humo GREEN de h1 sin lanzar: `claude` del PATH sale con 1, «claude anidado bloqueado en un sujeto: run.mjs no ve su coste»; sin herramienta de subagentes; no se usa el otro claude del PATH para saltarse el bloqueo. `node --test` corre 0 tests y no prueba la guía. Falta: humo h1 con la skill editada (red/h1-green.txt), commit de skill + red/, sdd task done 1 8a9aff5 -- node --test, revisión final
