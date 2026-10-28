---
id: 20261028-112220-feature-0237-lint-clean-kit-markdown
feature: 0237
title: Walkthrough — El markdown del kit pasa markdownlint
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — El markdown del kit pasa markdownlint

## 1. Cambios realizados

- **CLI** (`ad3d274`, Task 1): `cli/src/capabilities/sections.ts` reconoce las marcas de delta en encabezado (`#### ADDED|MODIFIED|REMOVED — <título>`, `#### Reglas de la capacidad — <nombre>`) además de la negrita, con una sola regex de marca y un patrón de título por forma; un `(antes: …)` partido se une igual. `check.ts` rechaza las dos formas dentro de una capacidad, y `merge.ts` propone `#### <MARCA> — <título>` ante un título ilegible.
- **Plantillas** (`fb6b580`, Task 2): `spec-template.md` y `patch-template.md` escriben las marcas como encabezados `####`, con una línea en blanco debajo.
- **Fusión** (`7959784`, Task 3): `withBlankLines` de `document.ts` pone una línea en blanco al entrar y al salir de cada tabla, también en una tabla del vivo que ya estuviera pegada. El rojo se reprodujo: la fusión quitaba las líneas en blanco del delta.
- **Pasada de fix** (juntada en el cierre): un `#` pegado al final del título ya no se pierde (solo son cierre los `#` precedidos de espacio); `markPrefix` en `check.ts`; `isHeading` de `sections.ts` pasa a `isHeadingMark`.
- **Capacidad** `capabilities`: dos requisitos sustituidos y dos añadidos, fusionados con `sdd capability merge` desde esta misma spec, ya escrita con `####`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 1,20 h — reloj de la sesión 2,11 h desde 2026-10-28T11:20Z, sin 54 min de espera al dev-lead (3 esperas)
- Desviación: -0,3h (-20 %)
- Causa de la desviación: no aplica (dentro de ±30 %); las esperas de las suites largas bajo el lock no cuentan como trabajo del hilo
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 31.166.000 — claude-opus-5-5 31.166.000
- Tokens de subagentes: 5.072.183 en 5 despachos — Review spec 0237 dominio claude-opus-5-5 367.156 / 2 min; Review spec 0237 técnica claude-sonnet-5-5 132.530 / 1 min; Final review — Spec axis claude-opus-5-5 3.320.770 / 8 min; Re-revisión final 0237 claude-opus-5-5 817.459 / 2 min; Final review — Code axis claude-sonnet-5-5 434.268 / 2 min
- Coste de la sesión: 15,06 $ (hilo 11,33 $ + subagentes 3,74 $)
- Coste de sujetos: no aplica
- Review de spec: 2 revisores · hallazgos 20, aceptados 17

## 3. Desviaciones del plan

- La verificación de las Tasks 2 y 3 se ciñó a los tests de capability y a los de `test/kit` que leen las plantillas, en vez de `cli:test-min` y `kit:test` enteros: bajo el lock tardaban ~40 min, y `test/kit` entero dejó un bash colgado en una batería (aviso de la sesión de la 0228). La suite completa corre en el gate de cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: el test existente «the spec-template half filled fails with the gap» sigue probando el hueco con la forma nueva, y la fusión con 0 la prueba el test nuevo «a delta traced from each template merges» — cubre lo mismo sin quitar el caso del hueco — si es erróneo: un test de más
- Task 3: «keeps a table already surrounded by blank lines» pasa antes del fix porque la fusión quitaba las líneas en blanco del delta, y se queda como invariante del AND «queda igual» — si es erróneo: un test que no prueba el cambio
- Task 3: los commits de las Tasks 2 y 3 se separan copiando a `merge.test.ts` la copia RED de cada task, porque comparten fichero de tests — si es erróneo: un commit con tests de otra task
- Task 1: su verificación corrió con las ediciones sin commitear de las Tasks 2 y 3 en el árbol, porque esperó 24 min al lock de la línea base — si es erróneo: un rojo de la Task 1 tapado por T2/T3; lo cubre la suite de capability en verde en cada commit
- Task 2: la verificación se ciñe a `test/capability test/kit/word-budget.test.ts test/kit/skills.test.ts`, tras colgarse `test/kit` entero en un bash de una batería, parado por PID — si es erróneo: un rojo de `kit:test` que sale en el gate de cierre
- Task 3: la verificación es `vitest run test/capability` + `moon run cli:typecheck`; `cli:test-min` entero corre en el gate de cierre — si es erróneo: un rojo fuera de capability que sale en el gate
- Final: el test existente «the spec-template half filled fails with the gap» cambia su dato de `**ADDED — <título estable>**` a `#### ADDED — <título estable>` — la plantilla ya no tiene la negrita y sin el cambio seguiría verde por otro hueco; el plan se contradecía entre la restricción global y el paso 1 de la Task 2 — si es erróneo: un test existente tocado sin necesidad
- Final: ADR 0002 sin humo de `sdd-templates` en esta edición — la decisión 8 de la spec aprobada fija 0 sujetos; el humo de `sdd-templates` queda para la batería de la release 3.0.0 — si es erróneo: un agente que calca mal el `####` y no lo ve nadie hasta campo
- Final: `isTableRow` no distingue un `|` dentro de un bloque de código cercado — no se arregla: un bloque cercado sin sangría ya lo rechaza `check` como línea suelta, y ninguna capacidad del kit lo tiene — si es erróneo: dos líneas en blanco de más dentro de un bloque de código

## 4. Verificación

### 4.1 Builds

- Línea base, sin filtro: `moon run kit:test cli:typecheck cli:test-min` → kit:test, cli:typecheck y cli:test-min completadas, cli:test-min 1850 passed | 12 skipped (1862), 37 min; kit:test-headless saltada (fuera del Scope de la spec).
- Por task: `vitest run test/capability` → 120/120 tras la pasada de fix; `tsc --noEmit` → 0.
- markdownlint: `markdownlint-cli2` 0.18.1 (markdownlint 0.38.0), reglas por defecto salvo MD013 y MD033, sobre un delta calcado de `spec-template.md` y de `patch-template.md` con los huecos rellenos y sobre una capacidad fusionada con una tabla pegada del vivo → `Summary: 0 error(s)`. Antes de la Task 3, esa capacidad daba MD058 en las líneas 21 y 23. El `capabilities.md` fusionado de este repo da 8 MD038, los mismos 8 que en `develop`: vienen del texto de la capacidad, no de la fusión.
- Gate de cierre: corre una vez en el paso de la base integrada de `sdd-archive`, porque hay otras ramas abiertas; su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · suite de capability 120/120 · smoke 12/12 THEN, 8 con ejecución real de la CLI · revisión final Spec y Código sobre 7959784, re-revisión limpia sobre la pasada de fix · markdownlint 0 errores en deltas calcados y capacidad fusionada

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| «El delta declara…»: la marca es un encabezado `####` con línea en blanco debajo, y la negrita se sigue leyendo | suite (`template deltas use heading marks`, `merges heading marks like bold marks`) | ✅ |
| «El validador…»: `#### ADDED|MODIFIED|REMOVED —` en una capacidad da `resto de delta «#### MODIFIED —» en la línea <n>` | ejecución real (`sdd capability check` con `#### MODIFIED — Consultar salas libres` → mensaje y código 1) | ✅ |
| «El validador…»: `#### Reglas de la capacidad` en una capacidad da su mensaje | suite (`rejects heading marks in a capability`) | ✅ |
| «El validador…»: con `--artifact`, `#### ADDED` sin fusionar da «no está» y `#### MODIFIED` con otro escenario, «no coincide» | suite (`reads a heading delta with --artifact`) | ✅ |
| «La fusión lee las dos formas…»: `#### MODIFIED` y `**MODIFIED**` sustituyen igual y dejan el mismo fichero | ejecución real (`sdd capability merge` de esta spec, con `####`, sobre `.docs/sdd`: 2 sustituidos, 2 añadidos) y suite | ✅ |
| `#### ADDED`, `#### REMOVED` y `#### Reglas de la capacidad — bookings` dan añadido, quitado y regla sustituida | suite (`merges heading ADDED, REMOVED and rules`) | ✅ |
| Encabezado sin línea en blanco, cerrado con `##` y con `(antes: …)` partido | suite (`reads a heading without a blank line…`, `reads a closed heading with its before clause`) | ✅ |
| Un delta calcado de cada plantilla no tiene negrita, lleva línea en blanco tras cada `####` y se fusiona con 0 | ejecución real (deltas calcados fusionados y pasados por markdownlint) y suite (`a delta traced from each template merges`) | ✅ |
| `#### ADDED - …` y `**ADDED - …**` fallan con el mensaje que propone `#### ADDED — <título>` | ejecución real (`sdd capability merge` con `#### ADDED - Cancelar una reserva` → mensaje literal, código 1) y suite | ✅ |
| «La fusión deja una línea en blanco…»: tabla pegada → línea en blanco antes y después, ninguna dentro ni doble | ejecución real (`sdd capability merge` con la tabla de tarifas pegada) y suite (`adds blank lines around a glued table`) | ✅ |
| La misma tabla ya rodeada de líneas en blanco deja el fichero igual | suite (`keeps a table already surrounded by blank lines`) | ✅ |
| `sdd capability check --artifact` tras fusionar la tabla escribe `Capacidades válidas: 1` y sale con 0 | ejecución real (`Capacidades válidas: 1`, código 0) | ✅ |

### 4.3 Residuales / deuda generada

- El `capabilities.md` de este repo tiene 8 MD038 (espacios dentro de comillas invertidas) que ya estaban en `develop`; no los produce el kit, son del texto de la capacidad.
- La verificación de una task con `test/kit` entero puede dejar un bash de batería colgado bajo carga: es el mismo cuelgue que persigue la 0228 («pwd: write error: Bad file descriptor»); no abre fila aparte.

## 5. Aprendizajes

- Un `#` de cierre de un encabezado ATX solo cuenta precedido de espacio: un título que acaba en `F#` o `C#` es legítimo → en el código (`HEADING_TITLE` de `sections.ts`) y su test; no es una regla de documento.
- Varias tasks que comparten fichero de tests se commitean por separado reponiendo la copia RED de cada task → nada que volcar: ya lo cubre la copia RED fuera del repo de `sdd-implement`.

## 6. Adendas
