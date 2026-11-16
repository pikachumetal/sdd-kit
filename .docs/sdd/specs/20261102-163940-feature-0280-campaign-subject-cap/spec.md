---
id: 20261102-163940-feature-0280-campaign-subject-cap
feature: 0280
title: El techo de sujetos sale de la spec y battery.mjs lanza un solo escenario
mode: lite
profile: delegate
status: approved
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — El techo de sujetos sale de la spec y battery.mjs lanza un solo escenario

🦆 Hoy quien lanza las pruebas de una skill escribe a mano cuántos sujetos admite, y puede subir esa cifra sin que nadie se entere: la 0151 previó 45 y llegó a 63. Con esto, si la spec dice 45, el sujeto 46 no arranca, el lanzador nombra la previsión y decide el dev-lead. Además, con `s1` ya medido, `SCENARIOS=s3` lanza solo `s3` y no se aborta por la salida guardada de `s1`. Una spec sin un número en la fila `Suma` sigue con la cifra a mano y lo avisa antes del primer sujeto.

Validación: agente — es código de pruebas, sin nada que un humano observe más allá de los tests; además, `validation.mode: field`.

## Capacidades

- Ninguna, porque herramientas: `tests/headless/` es el lanzador de pruebas de este repo y no viaja a los proyectos como comportamiento del kit.

## ✋ Decisiones que he tomado yo — valida estas

**Review de la spec: ninguna.** Modo lite, un solo módulo, sin capacidades ni skills editadas; hice el repaso de coherencia. Lo que deja sin cubrir: una segunda lectura ajena de la spec; la revisión final de rama sigue. `sdd capability merge` sobre una copia: «Sin delta que fusionar».

1. **La tabla no se cambia, y no siempre se puede leer: 10 de las 16 specs de primer nivel con previsión llevan un número en `Suma`; 5 dejan vacía la columna de sujetos y 1 la llena de prosa.** Sus filas son prosa («`c1` × 2, `m6` × 2»), así que no se suman. La plantilla no pide el número en esa celda y aclararlo sería editar lo que sigue un agente, que por el Art. I lleva sujetos: fuera de esta feature, que va sin ellos. Consecuencia: hasta que `Suma` lleve el número, esas specs siguen con `SUBJECT_CAP`; el aviso dice qué escribir, antes del primer sujeto.
2. **Lo legible**: en `SPEC_DIR/spec.md`, bajo el encabezado `Previsión de coste`, la fila `Suma` con la celda de sujetos `N` o `N sujetos`. «hasta 4 sujetos, 4 $ de techo; real: 6 sujetos» no se lee: adivinar de una prosa daría un techo falso.
3. **Solo `spec.md`**: un `patch.md` se trata como sin spec. La plantilla de patch no lleva la tabla (1 patch la escribió por su cuenta) y el RED de un patch corre con `SPEC_DIR` en `.temp/`.
4. **`SUBJECT_CAP` con previsión legible**: es opcional. Uno mayor no sube el techo y lo avisa; uno menor manda, porque aprieta y no concede nada.
5. **`SUBJECT_COST` por omisión**: `COST_CAP` entre el techo efectivo, el de la previsión si se aplica. Cambia el reparto cuando `SUBJECT_CAP` difería; `COST_CAP` sigue a mano, porque el alcance es el de sujetos.
6. **Previsión de 0 sujetos**: es legible y para en el primero. El reparto de coste divide entre 1 para no dar `NaN` en el resumen.
7. **El filtro se llama `SCENARIOS`**, la variable que ya usa `run.mjs`, y se cruza con `STEPS`. Un id que no está en la tabla sale con `escenario desconocido: <id>` y código 2, como un paso desconocido; un cruce vacío, `sin escenarios en <tabla>` y código 3, como hoy.
8. **Con filtro, el veredicto y la salida son solo de lo filtrado**: `s1` no aparece. Si no, un rojo viejo de `s1` tiñe el código del relanzamiento de `s3`.
9. **`ya existe` sigue abortando dentro de lo filtrado**: un `s3` ya medido no se relanza en silencio. El techo sigue siendo acumulado: el 0116 y el 0279 lo sufrían por lanzar de más, y el filtro quita esa causa.
10. **Literales**:
    - parada: `techo de <N> sujetos de la previsión de <SPEC_DIR>/spec.md alcanzado: decide el dev-lead; subirlo exige enmendar la spec`
    - sin previsión: `aviso: sin previsión legible en <SPEC_DIR>/spec.md (escribe el total en la fila Suma, columna de sujetos): uso SUBJECT_CAP=<n>`
    - `SUBJECT_CAP` mayor: `aviso: SUBJECT_CAP=<m> no sube el techo: manda la previsión de <N> sujetos de <SPEC_DIR>/spec.md`
    - La parada con un `SUBJECT_CAP` que manda, sin previsión o menor, se queda como hoy: `techo de <n> sujetos alcanzado: decide el dev-lead`.
    - Sin previsión ni `SUBJECT_CAP`: `define SUBJECT_CAP (previsión de la spec)`, como hoy.
11. **El aviso sale en cada lanzamiento interno**: `battery.mjs run` llama una vez a la campaña por modelo e índice, y lo repite. Quitarlo costaría un estado para un mensaje; no se hace.

- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, sin eje de Arquitectura porque no cambia la estructura · sin otros despachos en paralelo ni sujetos · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Superar la previsión es una parada del dev-lead; el lanzador no la concede y subir el techo exige la enmienda de la spec — «Superar la previsión sigue siendo una parada del dev-lead, por el Art. I: el lanzador no la concede. Subir el techo exige que la spec lo diga con su enmienda.»
- Sin previsión, `SUBJECT_CAP` y aviso — «Sin spec o sin previsión legible, se usa `SUBJECT_CAP` como hoy y se avisa.»
- Sin sujetos — «Es código de pruebas: Vitest, sin sujetos.»

## Intent

`SUBJECT_CAP` se fija a mano y se sube, así que la previsión de la spec no para nada: la 0151 previó 45 y llegó a 63, y el dev-lead se enteró tarde. Además, `battery.mjs run` solo lanza por paso y una salida guardada aborta el reintento: la 0279 y la 0116 repitieron sujetos ya medidos (~0,4 $). El éxito: con una previsión legible, nadie pasa de ella sin enmendar la spec; y relanzar un escenario cuesta un sujeto. Sería un fracaso que un número mal leído diera un techo falso: por eso lo dudoso cae a `SUBJECT_CAP` con aviso.

## Scope

- Entra: leer el techo de la previsión en `tests/headless/campaign.mjs`; `SCENARIOS` en `battery.mjs run`; sus tests en `cli/test/kit/headless/`; las cabeceras de `run.mjs` y `battery.mjs`; `tech-stack.md` donde describe el techo y `STEPS`; saldar la fila de deuda.
- No entra: la forma de la tabla y la plantilla (decisión 1); `COST_CAP` desde la spec; el veredicto y `node --check`, de la 0273 y la 0287; `battery.mjs verdict` por línea de órdenes, que no gana filtro.

## Lo que se retira o cambia de forma

Retira la vía de subir el techo a mano con una previsión legible; es la pieza que sale, y `SUBJECT_CAP` deja de ser obligatorio en ese caso.

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `SUBJECT_CAP` obligatorio y «los de la previsión» a mano | `tests/headless/run.mjs:4-5`, `tests/headless/campaign.mjs:13`, `.docs/sdd/tech-stack.md:148` y `:202` | Scope: se reescriben |
| «`SUBJECT_CAP` acumula entre fases» | `tests/headless/battery.mjs:13`, `.docs/sdd/tech-stack.md:124`, y el test de la cabecera en `cli/test/kit/headless/battery.test.ts:284` | Sigue cierto; decisión 9. Se conserva el literal |
| `STEPS` como único tramo | `tests/headless/battery.mjs:5-6`, `.docs/sdd/tech-stack.md:108` | Scope: añaden `SCENARIOS` |

- Filas que implementa: 0280 → solo `roadmap.md` (su fila, la de deuda y el orden de 0198 y 0152), que la cierra `sdd-archive`; `tests/`, `skills/`, `capabilities/` y demás documentos: nada, comprobado con `grep -rln 0280`. Los `tests/*-red.md` que nombran `SUBJECT_CAP` son evidencia y no se tocan.

## Approach

El dev-lead fijó: techo de la previsión, parada que nombra la previsión, `SUBJECT_CAP` y aviso como caída, filtro de escenario en `battery.mjs run`.

## Dónde se prueba

- Techo y avisos: `readConfig` y `runCampaign` en `cli/test/kit/headless/campaign.test.ts`, con la spec en `memoryFs`, como «no pasa de SUBJECT_CAP sujetos».
- Filtro: `runBattery` en `cli/test/kit/headless/battery.test.ts`, como «lanza solo el tramo pedido».

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Comportamientos que comprueban los tests

Sin delta, porque no hay capacidad; estos son los escenarios de cierre.

- GIVEN `spec.md` con `| Suma | 2 | 3 |` y `SUBJECT_CAP=10` · WHEN se lanzan `a b c` · THEN corren 2 sujetos AND el log lleva `techo de 2 sujetos de la previsión de <SPEC_DIR>/spec.md alcanzado: decide el dev-lead; subirlo exige enmendar la spec` AND `aviso: SUBJECT_CAP=10 no sube el techo…`.
- GIVEN la misma spec sin `SUBJECT_CAP` · WHEN se lanza · THEN no da `define SUBJECT_CAP`.
- GIVEN `| Suma | 33 sujetos | 3 |` · THEN el techo es 33. GIVEN `SUBJECT_CAP=1` y `Suma` 2 · THEN el techo es 1.
- GIVEN `| Suma | 0 | 0 |` · WHEN se lanza `a` · THEN no corre ninguno AND el resumen no da `NaN`.
- GIVEN sin `spec.md`, `| Suma | | 7,82 |` o `| Suma | hasta 4 sujetos, 4 $ de techo; real: 6 sujetos | 4 |`, y `SUBJECT_CAP=2` · WHEN se lanza · THEN el techo es 2 AND el log lleva `aviso: sin previsión legible…uso SUBJECT_CAP=2`.
- GIVEN una `Suma` de otra tabla fuera de `Previsión de coste` · THEN no se lee.
- GIVEN una batería con `s1-1.tools.txt` guardado · WHEN `SCENARIOS=s3` · THEN lanza un sujeto, `s3-1`, AND no aborta AND el veredicto solo trae `s3`.
- GIVEN `SCENARIOS=nope` · THEN `escenario desconocido: nope`, código 2. GIVEN `STEPS` y `SCENARIOS` sin cruce · THEN código 3, sin sujetos. GIVEN `s3-1` guardado y `SCENARIOS=s3` · THEN `ya existe s3-1`.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,3 h
- Estimación de implementación: 1 h + 0,2 h del gate de cierre
- Base de la estimación: dos funciones y un filtro sobre tests con dobles ya montados; tamaño S en el roadmap
- Confianza: alta

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
