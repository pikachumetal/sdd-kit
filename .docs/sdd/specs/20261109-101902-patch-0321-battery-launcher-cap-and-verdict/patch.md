---
id: 20261109-101902-patch-0321-battery-launcher-cap-and-verdict
task: 0321
title: Patch — el lanzador de baterías, el techo antes de la tanda, el veredicto con SCENARIOS, el precio del sujeto y el uso de plan
type: patch
solution: causa raíz
status: done
created: 2026-11-09
branch: feature/0321-battery-launcher-cap-and-verdict
commit: <hash>
---

# Patch 0321 — el lanzador de baterías, el techo antes de la tanda, el veredicto con SCENARIOS, el precio del sujeto y el uso de plan

Validación: dev-lead — `validation.mode: field` en `sdd-kit.json`: la valida el uso en las campañas de las próximas features.

## Capacidades

- Ninguna, porque ninguna capacidad describe el lanzador de sujetos (`tests/headless/`): es una herramienta del repo, no del kit que se instala.

## 1. Síntoma

Fila 0321 del roadmap y fila de deuda «`battery.mjs run` no para ni avisa antes de una tanda que no cabe en `COST_CAP`», con los tickets de la [0314](../../field-reports/20261109-092122-feature-0314-grilling-brainstorming-7.md) §1 y la [0310](../../field-reports/20261108-180924-feature-0310-init-explore-release-feedback-rework.md) §2 y §4:

1. «La tanda siguiente […] se lanzó con `COST_CAP=2` y no lanzó ninguno: «techo de 2 $ alcanzado (7.22 $ gastados, 0 en curso…)». En los dos casos, `sdd watch command -- node tests/headless/battery.mjs run` terminó con «salió con 0»» (0314 §1).
2. «`verdict` admite `[paso]` pero no lee `SCENARIOS` ni `N`, que `run` sí lee»; «Sobre `fix/out`, con dos sujetos de `fb1` (`N=2`), `verdict` da `fb1 · 1/1`» (0310 §4).
3. «La tanda se lanzó con `COST_CAP=1.58` (1,38 $ gastados más 0,20 $ del sujeto anterior). El último sujeto costó 0,28 $, y la campaña cerró en 1,65 $» (0310 §2, sin verificar).
4. `node tests/headless/battery.mjs plan` sin ruta cae con `TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received undefined` (fila 0321).

**Medido sobre la base de hoy** (`9d8f5143`), con una sonda en proceso (`runBattery` y `verdict` sobre un sistema de ficheros en memoria, sin sujetos) y el CLI real en seco con doble techo:

1. **No sale con 0**: `BATTERY=sdd-retro … SUBJECT_CAP=1 COST_CAP=2 DRY_RUN=1 node tests/headless/battery.mjs run` con 7,22 $ guardados en otra fase no lanza nada y sale con `exit 3` (desde `94a0c4e9`, 2026-11-02, «salir con 3 si una campaña no midió nada»). Los logs de la 0314 ya no existen y no se puede saber de dónde salió su 0. Lo que sí reproduce: el aviso es `techo de 2 $ alcanzado (7.22 $ gastados, 0 en curso a 0.05 $)`, no dice que el techo es de toda la campaña, se repite una vez por índice y queda enterrado bajo una línea `sin evidencia` por escenario.
2. **`SCENARIOS`, reproducido; `N`, no**: `SCENARIOS=r4 node tests/headless/battery.mjs verdict tests/batteries/sdd-retro/battery.md <salida con r4-1> release` da también `r6 · 0/1 · umbral 1/1 · sin evidencia · sin tools.txt: r6-1`. Con `N=2` y dos sujetos de `fb1`, da `fb1 · 2/2 · umbral 2/2 · …`: `verdict` lee `N` desde `ecda9061` (feature 0320, 2026-11-07); la rama de la 0310 no la llevaba cuando midió (fusionó `develop` a las 19:04 del 2026-11-08, tras el ticket).
3. **Reproducido**: 1,38 $ gastados, `COST_CAP=1.58` y techo de 8 sujetos dan `SUBJECT_COST` 0,1975 $; `runBattery` lanza `r1-1`, que cuesta 0,28 $, y cierra en `sujetos de la campaña: 2 · coste acumulado: 1.66 $`.
4. **Reproducido**: el `TypeError` de arriba, con `exit 1`.

## 2. Causa raíz

Fila de deuda que lo cubre: la de §1; su remedio temporal, «pasar `COST_CAP` como total de la campaña». La fila sigue abierta hasta el cierre.

1. **El techo gastado**: `runBattery` (`tests/headless/battery.mjs`) no mira lo gastado antes de la tanda. El único control es `capReached` de `tests/headless/campaign.mjs`, que corre dentro de cada `runCampaign`, por sujeto, y solo deja una línea de log; `runBattery` llama a `runCampaign` una vez por índice y modelo (`launchIndex`), así que la línea se repite, y después `judgeRows` imprime una línea `sin evidencia` por escenario. El mensaje dice el techo y lo gastado, pero no que lo gastado es de todas las fases de `SPEC_DIR` (`spent` suma todas las carpetas `<fase>/out` de `config.root`), que es lo que el agente no aplicó en la 0297 y la 0314.
2. **`verdict` sin `SCENARIOS`**: la rama `verdict` de `main` llama a `verdict(batteryPath, outDir, steps, fileFs, process.env.N)`, que filtra con `selectSteps` y `withN`; `run` y `plan` filtran con `pickRows(all, steps, env)`, que cruza además `SCENARIOS`. `verdict` es el único de los tres que no pasa por `pickRows`.
3. **La media que deja pasar el techo**: `campaignConfig` toma `SUBJECT_COST` del entorno o, sin él, `COST_CAP / techo de sujetos` (`formatAwk(Number(env.COST_CAP) / Math.max(cap.subjectCap, 1))`), y `capReached` lanza si `gastado + (en curso + 1) × SUBJECT_COST ≤ COST_CAP`. `runBattery` no pasa `SUBJECT_COST` a sus `runCampaign`, aunque `scenarioPrices` ya da el precio medido de cada escenario para `plan`: con poco margen, la media (0,1975 $) queda por debajo del sujeto real (0,28 $).
4. **`plan` sin ruta**: `main` desestructura `[command, batteryPath, ...rest]` y pasa `batteryPath` sin comprobarlo a `planLines` → `readScenarios` → `readFileSync(undefined)`. Lo mismo pasa con `field` y `verdict`, que leen la misma ruta.

## 3. Fix

- **Fichero(s)**: `tests/headless/battery.mjs`, `tests/headless/campaign.mjs`, `tests/headless/run.mjs` (cabecera), `cli/test/kit/headless/battery.test.ts`
- **Cambio**:
  1. `runBattery` llama a `refuseSpentCap` antes de lanzar (con `--resume`, solo si queda alguna etiqueta pendiente: sin nada que lanzar da el veredicto, como antes): si `campaignSpent` —lo gastado en todas las fases de la campaña con los cortados, exportado de `campaign.mjs` sobre su `totalSpent`— alcanza `COST_CAP`, sale con 3 y un solo mensaje: `COST_CAP=<x> es el techo de toda la campaña de <raíz>: van <y> $ gastados; pásalo como total, no por tanda`.
  2. `verdict` filtra con `pickRows`, como `run` y `plan`, y recibe el entorno en vez de `N`.
  3. `runBattery` pasa a cada `runCampaign` `SUBJECT_COST` con el precio de `scenarioPrices` del escenario más caro de esa tanda (la media de los medidos para los que no tienen precio). Sin campañas guardadas, o con `SUBJECT_COST` en el entorno, sigue como antes. La raíz de las campañas guardadas es la opción `specsRoot`, para el test.
  4. `main`, ahora exportada, comprueba con `checkUsage` los argumentos obligatorios antes de leerlos y da el uso del comando, con el texto de la cabecera. La causa (§2.4) es la misma en los tres comandos que leen argumentos sin comprobarlos, así que el arreglo cubre `plan`, `field` (ruta, id y columna) y `verdict` (ruta y salida). La rama de `verdict` pasa a `printVerdict` para que `main` no crezca.
- **Decisiones**:
  - El texto del aviso del techo — ticket (0314 §1, su propuesta, con el valor de `COST_CAP` y la raíz de la campaña en lugar de «SPEC_DIR», que en seco es `RUNS_DIR/dry`).
  - El código de salida del techo gastado es 3, el que ya daba y el de «esta ejecución no midió nada» de la cabecera de `run.mjs` — dev-lead («un código distinto de 0»: se conserva el que ya cumplía).
  - Con una tanda de varios escenarios, el precio del más caro: `runCampaign` lleva un solo `SUBJECT_COST` por tanda, y por un techo se yerra por arriba — sin el dev-lead; solo afecta a cuándo para el lanzador, nunca a lo que mide.
  - `run.mjs` lanzado a mano no lee precios (no conoce la batería): sigue con `COST_CAP / techo de sujetos`, y su cabecera lo dice — fila 0321, que nombra `battery.mjs run`.

## 4. Verificación

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | 7,22 $ guardados en otra fase, `COST_CAP=2`, `battery.mjs run` real en seco | ✅ `COST_CAP=2 es el techo de toda la campaña de …\.temp\p0321\dry: van 7.22 $ gastados; pásalo como total, no por tanda` · `exit 3` · ninguna línea de veredicto ni de molde |
| 2 | `SCENARIOS=r4 … verdict <sdd-retro> <salida con r4-1> release` | ✅ solo `r4 · 0/2 · umbral 2/2 · rojo · sin tools.txt: r4-2` (antes, también `r6`) |
| 2 | `N=2 … verdict <sdd-feedback> <fb1-1 y fb1-2> source` | ✅ `fb1 · 2/2 · umbral 2/2 · puerta verde · sin leer: F1, P, L` (ya lo daba: control) |
| 3 | 1,38 $ gastados, `COST_CAP=1.58`, techo 8 y `r1` a 0,28 $ en una campaña guardada | ✅ no lanza: `techo de 1.58 $ alcanzado (1.38 $ gastados, 0 en curso a 0.28 $)` (test) |
| 4 | `node tests/headless/battery.mjs plan` | ✅ `uso: node battery.mjs plan <battery.md> [paso…]` · `exit 1`; con ruta, `suma: 10 sujetos · coste previsto: 1.86 $` |

- RED (`pnpm exec vitest run test/kit/headless/battery.test.ts`, desde `cli/`, Git Bash, antes del arreglo): `Tests  12 failed | 122 passed (134)` — los 3 de `verdict` con `SCENARIOS` y `N` y los 4 de `N` que pasan a la firma con entorno (`N tiene que ser un entero positivo: [object Object]`), `promise resolved "3" instead of rejecting` en el techo gastado, `expected [ { …(3) } ] to deeply equal []` en el precio y `main is not a function` en los 3 de uso. El de `fb1 · 2/2` solo fallaba por la firma: es control del THEN de la fila.
- GREEN: `pnpm exec vitest run test/kit/headless/battery.test.ts test/kit/headless/campaign.test.ts test/kit/headless/lib.test.ts` → `Test Files  3 passed (3)` · `Tests  272 passed (272)`; `moon run cli:typecheck` sin errores.
- La copia RED y el test fusionado difieren solo en dos tipos para `tsc`: `(line: string)` y `main([command, undefined])`, que es lo que llega de `process.argv` sin la ruta.
- Tras la revisión, el mismo comando → `Tests  279 passed (279)`; `moon run cli:typecheck` sin errores; `node tests/headless/battery.mjs verdict tests/batteries/sdd-retro/battery.md` → `uso: node battery.mjs verdict <battery.md> <out> [paso…]`, `exit 1`. Mutantes medidos sobre `battery.mjs`, cada uno con `Tests  1 failed | 140 passed (141)` en `battery.test.ts`: `Math.min` en vez de `Math.max`, sin `?? fallback`, sin mirar `SUBJECT_COST` y `refuseSpentCap` sin condición en `--resume`; el fichero, restaurado idéntico (`git diff --no-index` vacío). El test de `--resume` con algo pendiente es control: también pasaba antes de la revisión.

Revisión (un revisor, Sonnet, effort medium; «Con arreglos»):

- Important 1, `--resume` con el techo gastado y nada pendiente salía con 3 sin veredicto: arreglado, `launchFilter` rechaza solo si queda algo pendiente; dos tests (nada pendiente → veredicto y 0; algo pendiente → 3 sin lanzar).
- Important 2, `priceOf` con 4 parámetros: arreglado, `priceOf(table, env, { specsRoot, fs })`.
- Important 3, ramas del precio sin test: arreglado, tres tests (el más caro de la tanda, la media para un escenario sin precio, `SUBJECT_COST` explícito).
- Minor 4, `verdict` sin salida y `field` sin id seguían cayendo: arreglado, `checkUsage` cuenta los argumentos obligatorios; dos tests.
- Minor 5, `USAGE[command]` aceptaba nombres del prototipo: arreglado, `Object.hasOwn`.
- Minor 6, `main` en 23 líneas: arreglado, la rama de `verdict` pasa a `printVerdict` (20 líneas).
- Minor 7, `refuseSpentCap` valora los cortados con `COST_CAP / techo` y `runCampaign` con el precio de `plan`: rechazado. Un cortado no deja `tools.txt` ni dice qué costó; las dos cifras son estimaciones, y la diferencia solo mueve el borde exacto del rechazo previo, que después vuelve a mirar `capReached` sujeto a sujeto.
- Minor 8, la línea de `launch`: arreglado, la constante `priced`.

## 5. Tiempo (ligero)

- Estimación: 1 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-09T10:19Z
