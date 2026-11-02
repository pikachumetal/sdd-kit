# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

## Pre-flight
| Fila | Qué se comprobó | Hallazgo |
| --- | --- | --- |
| Task 1, coherencia interna | Goal y «Produce: los dos cambios» contra Scope de la spec y Art. I | Conflicto: la spec condiciona la frase del paso 2 a que el RED la exhiba; h0 sale 3/3 limpio. Ver Ruling |
| Task 1, verificación | `node --test` contra «Dónde se prueba» | `node --test` corre 0 tests y sale 0: no prueba la skill; la prueba es el humo |

Task 1: base check — sin roadmap ni cambios en develop desde la merge base; sin solape.
Task 1: Ruling: la frase del paso 2 no se escribe — h0 da 3/3 limpios, y el Scope («si el RED lo exhibe») y la constitución («si el baseline no exhibe el fallo, no se escribe») mandan sobre el Goal del plan; no cambia la spec — si es erróneo: añadir una frase a la skill.
Task 1: Ruling: el THEN de h0 queda cubierto por el baseline, sin guía nueva — h0 es la evidencia — si es erróneo: un humo con más sujetos.
Task 1: BLOQUEADA — humo h1 GREEN sin lanzar: en esta sesión `claude` anidado está bloqueado (tests/headless/no-claude/claude: «claude anidado bloqueado en un sujeto») y no hay herramienta de subagentes autorizada. Sin él no se cumple el contrato: no hay commit ni `task done`. Edición del paso 1 sin commitear.
Revisión final: sin lanzar; requiere la task cerrada y un agente fresco.
