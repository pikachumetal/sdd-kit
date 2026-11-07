# Tasks — feature 0320

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — `N=` sustituye n y umbral en `run` y `verdict` | hecha; humo real `c1 · 1/1 · umbral 1/1` (0,71 $) | `ecda9061` |
| 2 — un rango en la Suma | hecha | `af8b0445` |
| 3 — `plan` suma n y prevé el coste | hecha; backtest 59,96 $ (−16,1 %) | `a0d29a9a` |
| 4 — `run --resume` lanza solo lo que falta | hecha | `7ab62de3` |
| 5 — la skill de una petición slash es la primera | hecha; `c1` de la 0306 da 2/2 | `9202488d` |

Revisión final: Spec opus+high, lista para fusionar (2 Minor) · Código sonnet+high, lista para fusionar (7 Minor) · Arquitectura no (plan), juntada en el cierre (revisó la salida del humo sobre la Task 5)
Pasada de fix: juntada en el cierre, 0 hallazgos RED→GREEN (6 Minor arreglados sin test que los reproduzca: cobertura, comentario, `export` y lectura de `--resume`; 5 con ruling)
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, todos los hallazgos arreglados o con ruling que se sostiene, sin roturas nuevas

## Rulings

- Task 1: Ruling: el humo real de S1 corre en segundo plano tras el commit de la task; su línea se anota al acabar y su salida (smoke-n1/out) entra en un commit posterior — así no bloqueo la Task 2, que no comparte ficheros — si sale mal, se arregla en un commit propio que entra en la revisión final.
- Task 3: Ruling: la interfaz de la previsión queda en scenarioPrices(rows, specsRoot, fs) + forecastCost(rows, prices) en vez de forecastCost(rows, specsRoot, fs) — el precio de respaldo es la media de toda la batería (decisión 1 de la spec), no de los filtrados, y así planLines pasa la tabla entera a scenarioPrices — si es errónea, solo cambia el respaldo con SCENARIOS. Medidas reales: plan sdd-propose → 65 líneas, «suma: 119 sujetos · coste previsto: 78.02 $»; con los 58 del control → «suma: 107 sujetos · coste previsto: 70.04 $»; backtest sin carpetas desde 20261105-161645 → 107 sujetos · 59.96 $ · -16.1 % · 11 sin precio medido (a 0.56 $).
- Final: Ruling: Code M2 let isPending y 4 parámetros en runBattery y launchIndex — el cuarto de runBattery es un objeto de opciones y el if/else se lee de corrido; un ternario con efecto lateral se lee peor — si está mal, un refactor local
- Final: Ruling: Code M3 export de scenarioPrices y forecastCost — los usa el backtest que cita el walkthrough (decisión 13) — si está mal, dos export de más
- Final: Ruling: Code M4 validación de entero positivo duplicada con positiveInt — errores distintos (BatteryError código 2 frente a CampaignError) y dos líneas — si está mal, una regla en dos sitios
- Final: Ruling: Code M6 «guardadas» cuenta también los sujetos vivos — es el literal aprobado de la spec — si está mal, una palabra imprecisa en un log
- Final: Ruling: Code M7 scenarioPrices recorre todo specs/ — plan real de sdd-propose sale al momento con el volumen de hoy — si crece, ordenar carpetas y parar en la primera que mida cada id
- Final: Ruling: declinado (Spec) N vacío = sin N — como SUBJECT_CAP vacío en campaign.mjs — si está mal, N= vacío no avisa
- Final: Ruling: declinado (Spec) marca muerta relanzada cuenta como cortada hasta que la nueva la pisa — conducta previa de campaign.mjs; el techo no cambia (spec) — si está mal, un sujeto de margen menos un instante
- Final: Ruling: declinado (Spec) plan toma STEPS de los argumentos — conducta previa; la decisión 2 solo pide SCENARIOS y N — si está mal, STEPS del entorno no filtra plan
- Final: Ruling: declinado (Spec) replaceAll('\\|','|') en la Petición — así casa una celda con | escapado con el state.txt, que la lleva sin escapar — si está mal, ese escenario cae al respaldo
- Final: Ruling: declinado (Code) N en field y precio por carpeta reciente — decisiones 1 y 3 de la spec aprobada — si está mal, se enmienda la spec
- Final: Ruling: declinado (Code) battery.mjs junta lanzador, veredicto y previsión — sin eje Arquitectura (sin señales); la previsión son cinco funciones puras — si crece, forecast.mjs
- Final: Ruling: declinado (Code) askOf sin bandera m exige ## petición primera — los 13 subject.mjs la escriben primera (s.save) — si cambia el volcado, cae a la primera >>> Skill: y al respaldo
- Final: Ruling: no verificado (Spec) cifras de S3 y S5 y backtest — las ejecuté en el hilo (ledger, Task 3 y 5) — si están mal, el walkthrough cita una medida vieja
- Final: Ruling: no verificado (Code y Spec) suite, typecheck, gate y CI — los corre el hilo en el gate de cierre y la CI de la rama antes del merge — si fallan, no se fusiona
- Final: Ruling: re-revisión, fuera de alcance: run ignora un argumento mal escrito (--resum) — con etiquetas guardadas lo para refuseSavedLabels, cuyo mensaje nombra --resume; sin ellas no hay nada que retomar — si está mal, una tanda entera lanzada cuando se quería reanudar sin nada guardado, que es lo mismo
