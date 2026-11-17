---
id: 20261107-211900-feature-0320-battery-launcher-n-forecast-resume
feature: 0320
title: Walkthrough — El lanzador de baterías baja n, lee un rango en la Suma, prevé el coste, reanuda y lee el slash
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-07
---

# Walkthrough — El lanzador de baterías baja n, lee un rango en la Suma, prevé el coste, reanuda y lee el slash

## 1. Cambios realizados

- **`N=`** (`ecda9061`): `withN` en `tests/headless/battery.mjs` sustituye n y umbral (`<n>/<n>`) tras cruzar `SCENARIOS` y `STEPS`, en `run` (`batteryPlan`), `verdict` y `plan`; un valor que no es entero positivo para con `N tiene que ser un entero positivo: <valor>`, código 2. `tech-stack.md`: la receta de la copia con junctions pasa a `N=1`.
- **Rango en la Suma** (`af8b0445`): `forecastSubjects` de `tests/headless/campaign.mjs` lee `<a> a <b>` con techo `max(a, b)`.
- **`plan` suma n y prevé el coste** (`a0d29a9a`): `scenarioPrices`, `forecastCost` y `planLines` en `battery.mjs`; el regex de `=== RESULTADO` pasa a `lastCost` de `campaign.mjs`. `tech-stack.md`, «Entrega de la skill al sujeto»: la previsión sale de `plan`.
- **`run --resume`** (`7ab62de3`): `pendingLabels` con `labelTaken` de `campaign.mjs`, ahora exportada; `reanudo: guardadas <k>, lanzo <m>`; el error de etiquetas guardadas nombra `--resume`.
- **Skill del slash** (`9202488d`): `slashSkill` lee `<etiqueta>.state.txt` y gana a la primera `>>> Skill:` con un slash `/<plugin>:<skill>`.
- **Evidencia del humo, pasada de la revisión final y cierre** (commit de cierre): `smoke-n1/out/`; `--resume` se lee en cualquier posición de los argumentos de `run`, `withN` deja de exportarse, los tests de `N` cubren `dos` y ` 1` en `run`, `plan` y `verdict`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 0,67 h — reloj de la sesión 1,05 h desde 2026-11-07T21:08Z, sin 23 min de espera al dev-lead (2 esperas)
- Desviación: −1,33 h (−66 %)
- Causa de la desviación: la estimación de 2 h era solo de implementación y el real cubre la sesión entera; esperas y huecos: 21:22Z 6 min; 21:32Z 17 min
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 41.890.218 — claude-opus-5-5 41.890.218
- Tokens de subagentes: 2.645.400 en 5 despachos — Revisor de spec dominio claude-sonnet-5-5 126.709 / 0 min; Final review — Code axis claude-sonnet-5-5 735.956 / 1 min; Revisor de spec técnica claude-sonnet-5-5 132.929 / 1 min; Final review — Spec axis claude-opus-5-5 1.156.679 / 3 min; Re-review final 0320 claude-opus-5-5 493.127 / 1 min
- Coste de la sesión: 17,16 $ (hilo 14,53 $ + subagentes 2,62 $)
- Coste de sujetos: 0,71 $ en 1 sujeto sonnet — smoke-n1 0,71 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 18

## 3. Desviaciones del plan

- La previsión se parte en `scenarioPrices(rows, specsRoot, fs)` + `forecastCost(rows, prices)` en vez de `forecastCost(rows, specsRoot, fs)`: el respaldo de un escenario sin medir es la media de toda la batería, no de los filtrados.

### Decisiones tomadas sin el dev-lead

- El humo real de S1 corrió en segundo plano tras el commit de la Task 1 y su salida entró después — para no bloquear la Task 2, que no compartía ficheros — si sale mal, un commit propio en la revisión final.
- La previsión se parte en `scenarioPrices` + `forecastCost` — el respaldo es la media de toda la batería, no de los filtrados — si está mal, solo cambia el respaldo con `SCENARIOS`.
- `let isPending` y 4 parámetros en `runBattery` y `launchIndex` se quedan — el cuarto de `runBattery` es un objeto de opciones y el if/else se lee de corrido — si está mal, un refactor local.
- `scenarioPrices` y `forecastCost` siguen exportadas — las usa el backtest de 4.2 (decisión 13) — si está mal, dos `export` de más.
- La validación de entero positivo de `N` no reutiliza `positiveInt` — errores distintos (`BatteryError` código 2 frente a `CampaignError`) — si está mal, una regla en dos sitios.
- «guardadas» en `reanudo:` cuenta también los sujetos vivos — es el literal aprobado — si está mal, una palabra imprecisa en un log.
- `scenarioPrices` recorre todo `specs/` — `plan` de `sdd-propose` sale al momento con el volumen de hoy — si crece, ordenar carpetas y parar en la primera que mida cada id.
- `N=` vacío equivale a sin `N` — como `SUBJECT_CAP` vacío — si está mal, `N=` vacío no avisa.
- Una marca muerta relanzada cuenta como cortada hasta que la nueva la pisa — conducta previa de `campaign.mjs` — si está mal, un sujeto de margen menos un instante.
- `plan` sigue tomando los pasos de los argumentos, no de `STEPS` — conducta previa — si está mal, `STEPS` del entorno no filtra `plan`.
- `replaceAll('\\|', '|')` en la celda «Petición» — así casa una celda con `|` escapado con el `state.txt`, que la lleva sin escapar — si está mal, ese escenario cae al respaldo.
- `N` no se aplica a `field` y el precio sale de la carpeta más reciente — decisiones 1 y 3 de la spec — si está mal, se enmienda la spec.
- `battery.mjs` junta lanzador, veredicto y previsión — sin señales para el eje Arquitectura; la previsión son cinco funciones puras — si crece, `forecast.mjs`.
- `askOf` exige `## petición` como primera sección — los 13 `subject.mjs` la escriben primera — si cambia el volcado, cae a la primera `>>> Skill:` y al respaldo.
- Las cifras de S3, S5 y el backtest que los revisores no verificaron las ejecuté en el hilo (4.2) — si están mal, el walkthrough cita una medida vieja.
- La suite, el typecheck, el gate y la CI que los revisores no corrieron los corre el hilo (4.1 y CI de la rama) — si fallan, no se fusiona.
- `run` ignora un argumento mal escrito (`--resum`) — con etiquetas guardadas lo para `refuseSavedLabels`, que nombra `--resume`; sin ellas no hay nada que retomar — si está mal, una tanda entera cuando se quería reanudar sin nada guardado, que es lo mismo.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 448/448 · cli:typecheck: corrió, sin errores · cli:test: corrió 2305/2318 (13 skipped) · 73 s la tarea más lenta · configuración: la del gate · sobre el commit de cierre
- Línea base (antes de la Task 1): `moon run kit:test-headless cli:typecheck cli:test` en un worktree detached → cli:test 2263 passed, kit:test-headless 406 passed, typecheck sin errores.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-07 · gate 448/448 headless y 2305/2318 CLI sobre el commit de cierre · los THEN de S1, S3 y S5 con ejecución real (humo de 1 sujeto, `plan` real, backtest y `verdict` real de la 0306), S2 y S4 por suite · revisión final Spec y Código, pasada de fix y re-revisión Opus limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| S1 `N=1 SCENARIOS=c1 BATTERY=sdd-verify … run` lanza `c1-1` y da `/1 · umbral 1/1` | ejecución real (`smoke-n1/out/`) | `c1 · 1/1 · umbral 1/1 · puerta verde · sin leer: C1, L`, 0,71 $ |
| S1 AND `N=1 verdict` da la misma línea | ejecución real | `c1 · 1/1 · umbral 1/1 · puerta verde · sin leer: C1, L` |
| S1 AND `N=3`, `N=1` sin filtro, `N=01`, `N=0`/`N=dos` en `run`, `plan` y `verdict` | suite (`describe('N sustituye n y umbral')`, `describe('plan')`) | verde |
| S2 rangos y bordes | suite (`campaign.test.ts`) | verde |
| S3 sintéticos | suite (`describe('plan')`) | verde |
| S3 repo real: 65 líneas y `suma: 119 sujetos · coste previsto: 78.02 $`; con los 58 del control, `suma: 107 sujetos · coste previsto: 70.04 $` | ejecución real | como dice la spec |
| S3 backtest sin las campañas desde la 0306 | ejecución real (script del scratchpad sobre `scenarioPrices` y `forecastCost`) | 107 sujetos · 59.96 $ · −16,1 % frente a 71.43 $ (dentro del ±20 %) · 11 escenarios sin precio medido, a 0.56 $ |
| S4 `--resume` y sus AND | suite (`describe('run --resume')`) | verde |
| S5 `c1` de la 0306 | ejecución real | `c1 · 2/2 · umbral 2/2 · puerta verde · sin leer: C1, L` (antes, `0/2 · rojo`) |
| S5 formas del slash | suite (`describe('la skill de una petición slash')`) | verde |

### 4.3 Residuales / deuda generada

- La «Previsión de coste» de `spec-template.md` sigue citando «el precio por sujeto de `tech-stack.md`»: pasa a la fila 0309.

## 5. Aprendizajes

- La previsión con un precio por escenario de la campaña más reciente acierta mucho más que una media de batería: −16,1 % frente a −46,3 % en el backtest de la 0306; la llave tiene que ser id + petición, porque los ids se repiten entre baterías → `tech-stack.md`, «Entrega de la skill al sujeto».

Retro: documento o skill desmentido → ticket del kit: «Previsión de coste» de `spec-template.md` manda citar «el precio por sujeto de `tech-stack.md`», y desde la 0320 la previsión sale de `battery.mjs plan` (la cambia la 0309)

## 6. Adendas
