---
id: 20261028-112220-feature-0237-lint-clean-kit-markdown
title: Tasks — El markdown del kit pasa markdownlint
spec: ./spec.md
plan: ./plan.md
created: 2026-10-28
---

# Tasks — El markdown del kit pasa markdownlint (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0237-lint-clean-kit-markdown`

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La CLI lee y rechaza las marcas en encabezado | done | ad3d274 | |
| 2 | Las plantillas escriben las marcas en encabezado | done | fb6b580 | markdownlint 0 errores en los deltas calcados |
| 3 | La fusión deja una línea en blanco alrededor de cada tabla | done | 7959784 | el rojo se reprodujo (2 de 3) |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, lista · Arquitectura no (plan), sobre 7959784
Pasada de fix: juntada en el cierre, 2 hallazgos RED→GREEN (título con `#` final, código de salida en el test de la tabla), 2 Minor de nombre y forma, 1 verificación (markdownlint tras la Task 3) y 3 rulings
Re-revisión: 7959784..juntada en el cierre, sdd-kit:effort-high + opus, todos ADDRESSED, sin fallos nuevos

## Rulings

- Task 2: Ruling: el test existente «the spec-template half filled fails with the gap» no pasa a «se fusiona con 0» como decía el plan; sigue probando el hueco con la forma nueva, y la fusión con 0 la prueba el test nuevo «a delta traced from each template merges» — cubre lo mismo sin quitar el caso del hueco — si es erróneo: un test de más
- Task 3: Ruling: el rojo se reproduce (2 de 3 tests en rojo: tabla pegada en el delta y en el vivo); «keeps a table already surrounded by blank lines» pasa antes del fix porque la fusión quita las líneas en blanco del delta, y se queda como invariante del AND «queda igual» — si es erróneo: un test que no prueba el cambio
- Task 3: Ruling: los commits de las Tasks 2 y 3 se separan copiando a merge.test.ts la copia RED de cada task, porque comparten fichero de tests — si es erróneo: un commit con tests de otra task
- Task 1: Ruling: su verificación (moon run cli:typecheck cli:test-min) corrió con las ediciones sin commitear de las Tasks 2 y 3 en el árbol, porque esperó 24 min al lock de la línea base mientras seguía trabajando — si es erróneo: un rojo de la Task 1 tapado por T2/T3; lo cubre la suite de capability en verde en cada commit
- Task 2: Ruling: la verificación se ciñe a `vitest run test/capability test/kit` en vez de `moon run cli:test-min kit:test` — cli:test-min y kit:test tardan ~40 min bajo el lock y corren una vez en el gate de cierre; las plantillas solo las leen los tests de capability y los de kit — si es erróneo: un rojo de kit:test que sale en el gate de cierre
- Task 2: Ruling: la verificación con `test/kit` entera se colgó en un bash de una batería (PID 82484, aviso de la sesión 0228) y se paró por PID; se repite con los tests que leen las plantillas: `test/capability test/kit/word-budget.test.ts test/kit/skills.test.ts` — si es erróneo: un rojo de las baterías de test/kit que sale en el gate de cierre
- Task 3: Ruling: la verificación es `vitest run test/capability` + `moon run cli:typecheck`; `cli:test-min` entero (~24 min) corre una vez en el gate de cierre — si es erróneo: un rojo fuera de capability que sale en el gate
- Final: Ruling: (Spec I2, Código m3) el test existente «the spec-template half filled fails with the gap» cambia su dato de `**ADDED — <título estable>**` a `#### ADDED — <título estable>` — la plantilla ya no tiene la negrita y sin el cambio el test seguiría verde por otro hueco; el plan se contradecía entre la restricción global y el paso 1 de la Task 2 — si es erróneo: un test existente tocado sin necesidad
- Final: Ruling: (Spec I3) ADR 0002 sin humo de sdd-templates en esta edición — la decisión 8 de la spec aprobada fija 0 sujetos: el cambio es un literal que lee la CLI y lo prueba Vitest leyendo la plantilla real; el humo de sdd-templates queda para la batería de la release 3.0.0 — si es erróneo: un agente que calca mal el `####` y no lo ve nadie hasta campo
- Final: Ruling: (Código m5) isTableRow no distingue un `|` dentro de un bloque de código cercado — no se arregla: un bloque cercado sin sangría en un requisito ya lo rechaza check como línea suelta, y una línea que empiece por `|` dentro de un bloque de código de una capacidad no aparece en ninguna capacidad del kit; los encabezados ya se trataban así — si es erróneo: dos líneas en blanco de más dentro de un bloque de código
