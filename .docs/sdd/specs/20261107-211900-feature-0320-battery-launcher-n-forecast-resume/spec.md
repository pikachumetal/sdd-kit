---
id: 20261107-211900-feature-0320-battery-launcher-n-forecast-resume
feature: 0320
title: El lanzador de baterías baja n, lee un rango en la Suma, prevé el coste, reanuda y lee el slash
mode: full
profile: delegate
status: approved
created: 2026-11-07
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-07
---

# Spec — El lanzador de baterías baja n, lee un rango en la Suma, prevé el coste, reanuda y lee el slash

🦆 Hoy, para probar un escenario una sola vez cuando la batería pide dos, hay que copiar la carpeta entera de baterías; una previsión escrita «2 a 4 sujetos» no se entiende; la previsión de coste se hace a mano y en la 0306 previó 57,50 $ para una campaña que costó 107,44 $; una tanda cortada no se puede retomar; y un sujeto que arranca la skill con `/sdd-kit:sdd-propose` sale en rojo aunque lo haga bien. Con esta feature, `N=1` lanza un sujeto por escenario y lo juzga sobre 1; «2 a 4» da un techo de 4; `plan` dice «suma: 107 sujetos · coste previsto: 70.04 $» con los precios que ya midieron las campañas guardadas; `--resume` lanza solo lo que falta; y el veredicto cuenta la skill del slash como la primera. Todo vive en el lanzador de pruebas del repo: no cambia nada de lo que instala un proyecto.

Validación: agente — `validation.mode: field` en `.docs/sdd/sdd-kit.json` (regla 3 de `CLAUDE.md`): cierro con la verificación propia (Vitest, el gate de cierre y el humo real de `N=1`) registrada como «Validación en campo», y el uso real llega por los tickets de `sdd-feedback`.

## Capacidades

- Ninguna, porque herramientas: el lanzador de baterías (`tests/headless/`) es herramienta del repo; su contrato vive en `tech-stack.md`, «Baterías por skill» y «Entrega de la skill al sujeto», no en `capabilities/` (`sdd capability index` no tiene ninguna que lo cubra).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: área no explorada (`run.mjs`, `real-deps.mjs` y los tests de `cli/test/kit/headless/` sin leer enteros) · tamaño: ~200 líneas en 5 ficheros
- Dominio (sonnet): si los cinco escenarios cubren las cinco conductas de la fila 0320 y los criterios del ticket de la 0306 §1 y §6 y de la 0307 §3, y si la decisión 4 (`--resume` no relanza un sujeto guardado sin RESULTADO) contradice lo que el ticket pedía (señal: área no explorada)
- Técnica (sonnet): si la llave id + petición (decisión 1) y la lectura de `state.txt` en `verdict` (decisión 6) aguantan con los `subject.mjs` que componen la petición, y si `--resume` con `labelTaken` deja bien el techo de sujetos de `campaign.mjs` (señal: área no explorada)
- Mínimo razonable: un revisor de siete puntos (sonnet) — deja sin la segunda lectura cómo se cruzan `--resume`, `N=` y el techo de la previsión, que es donde una tanda puede lanzar de más
```

1. **De dónde sale el precio de `plan` (decisión central).** Por escenario: la media del coste (último `=== RESULTADO`) de sus sujetos guardados en la carpeta de spec más reciente que lo midió, por el nombre de la carpeta (`yyyyMMdd-HHmmss`, UTC). Un sujeto guardado es de ese escenario si su fichero es exactamente `<id>-<k>.tools.txt` (`c1` no casa `c10-1`) y su `<id>-<k>.state.txt` lleva como primera sección `## petición` con la celda «Petición» de la batería, literal y sin espacios a los lados; sin `state.txt`, o sin `=== RESULTADO`, no entra en la media. El modelo no forma parte de la llave: la carpeta más reciente ya lleva el modelo con que se lanza hoy. Un escenario sin medir toma la media de los precios de los escenarios medidos de esa batería. Busca en `.docs/sdd/specs/*/*/out/` (las fases de `campaign.mjs`: `SPEC_DIR/<fase>/out`); un repo sin esa carpeta da «sin campañas guardadas». Límite conocido: solo `specs/`, que es donde este repo guarda las campañas. Medido antes del gate con un script del scratchpad sobre los datos del repo en `29ff90b3`, contra el control de la 0306 (58 escenarios, 107 sujetos, 71,43 $): sin las campañas de la 0306, lo que habría previsto al arrancarla (11 escenarios sin medir), **59,96 $ (−16,1 %)**: esa es la medida que cuenta, porque con todas las campañas guardadas (**70,04 $, −2,0 %**) el precio incluye el propio control. Descartadas, con su medida en ese mismo backtest sin la 0306: la media de la batería por id (38,35 $, −46,3 %: los ids chocan entre baterías, 1.003 sujetos de 89 carpetas casaban con los de `sdd-propose`); la media por petición sola (55,18 $, −22,7 %: varios escenarios comparten petición con moldes distintos); y la misma llave con la media de la última carpeta como respaldo (56,65 $, −20,7 %: la 0281 midió escenarios baratos). El precio de la tabla de `sdd-kit.json` (`pricing`) no sirve: da el precio por token, no cuántos tokens gasta un escenario. Nadie escribe un precio a mano.
2. **La salida de `plan`.** Nadie la lee con un script hoy (`git grep "battery.mjs plan"` fuera de `specs/` y `field-reports/`: solo la cabecera de `battery.mjs`). Las líneas `<id> <modelo> <n>` se quedan como están, y al final, por stdout y con el prefijo fijo `suma:`, una más: `suma: <n> sujetos · coste previsto: <x.xx> $`, con ` · sin precio medido: <ids> (a <p> $, la media de los escenarios medidos)` si alguno no tiene medida, y `suma: <n> sujetos · coste previsto: sin campañas guardadas de esta batería` si ninguno la tiene. Decimales con punto, como el resto del lanzador (`71.43 $`). `plan` lee `SCENARIOS` y `N` como `run`, para prever la tanda que se va a lanzar.
3. **`N=<n>`.** En `run`, `plan` y `verdict`: sustituye la columna n y el umbral (`<n>/<n>`) de los escenarios que se lanzan o se juzgan, después de filtrar por `SCENARIOS` y `STEPS`; sin ellos, de todos. En `verdict` también, porque sin él el veredicto de una tanda con `N=1` sobre una tabla de n = 2 sale «sin evidencia». Un valor que no es un entero positivo para antes de lanzar o juzgar nada, en los tres: `N tiene que ser un entero positivo: <valor>`, código 2. Puede subir n además de bajarlo, porque la petición dice «sustituye»; el techo de la Suma sigue mandando igual, así que una `N` mayor no lanza más de lo previsto.
4. **`run --resume` salta lo que `runCampaign` ya salta** (`labelTaken` de `campaign.mjs`, que pasa a exportarse): la etiqueta con `tools.txt` guardado, o con su marca en `RUNS_DIR/live` y el PID vivo; una marca con el PID muerto no la salta, y se relanza. El lanzador las filtra antes de lanzar y dice `reanudo: guardadas <k>, lanzo <m>`; con `m` = 0 no lanza nada y da igualmente el veredicto de lo guardado. Con `N=`, solo mira las etiquetas hasta esa n. El techo de sujetos no cambia: hoy ya cuenta todos los `tools.txt` de `SPEC_DIR`, también los guardados que `--resume` salta. Un sujeto guardado sin RESULTADO (cortado por tiempo) no se relanza, aunque el ticket de la 0306 §6 proponía saltar solo las que tienen RESULTADO: ese sujeto ya se pagó y midió algo, un rojo no se relanza para sacar verde (`tech-stack.md`, «Una edición lanza…»), y el veredicto ya lo da «sin RESULTADO»; para relanzarlo se borra su salida. Los sujetos que mata un corte de sesión no dejan `tools.txt`, porque `lib.mjs` lo guarda al acabar el sujeto (`save`); así pasó en la 0306: 35 guardados y 5 en curso pagados sin resultado (ticket §6).
5. **Sin `--resume`**, la tanda con etiquetas guardadas sigue parando, y el mensaje nombra la salida nueva: `ya existe <etiqueta> en <out>: borra esa carpeta, cambia PHASE o reanuda con --resume`.
6. **La skill del slash.** `verdict` lee `<etiqueta>.state.txt`, que escribe cada `subject.mjs` con `s.save`, todos con `## petición` como primera sección y la petición literal debajo. Si la primera línea de la petición casa `^/([\w-]+:[\w-]+)(\s|$)`, ese nombre cualificado (`sdd-kit:sdd-propose`, también con argumentos detrás) es la primera skill del sujeto, salvo `sdd-kit:using-sdd`, que sigue sin contar. Sin `state.txt`, sin `## petición`, o con una petición sin ese slash (`/sdd-propose` sin prefijo, `/clear`, una ruta), manda la primera `>>> Skill:`, como hoy. Un slash a una skill que no existe da su nombre, que no es el «Esperado»: rojo. Límite conocido: el lanzador no ve si el harness cargó la skill del slash (`kitMissing` solo mira la primera `>>> Skill:`); la conducta la siguen leyendo las filas de la rúbrica.
7. **El rango en la Suma.** La celda entera `<a> a <b>`, con o sin « sujetos» detrás, da techo `max(a, b)` y ningún aviso (`4 a 2` da 4); el número solo sigue igual. Otra prosa, también un rango con más texto (`2 a 4 sujetos por tanda`), sigue cayendo a `SUBJECT_CAP` con el aviso de hoy.
8. **Lo que dice `tech-stack.md`.** Se sustituyen la receta de la copia con junctions (por `N=`) y la línea del slash rojo (por la decisión 6); «Baterías por skill» nombra `N`, `--resume` y la suma de `plan`; y «Entrega de la skill al sujeto» dice que la previsión sale de `battery.mjs plan`, con las cifras medidas de hoy como evidencia.
9. **Las filas del roadmap.** El cierre salda las dos filas de deuda nombradas en la petición y añade a la fila 0309 que la «Previsión de coste» de `spec-template.md` cite la salida de `battery.mjs plan`, porque la plantilla queda fuera de esta feature.
10. **Repaso de coherencia**: `sdd capability merge` sobre una copia de `.docs/sdd` da «Sin delta que fusionar»; `plan` de `sdd-propose` imprime hoy 64 líneas (S3); los 58 escenarios del control suman 107 con la batería de hoy; `c1` sobre el control de la 0306 da hoy `c1 · 0/2 · umbral 2/2 · rojo` (S5).
11. **El humo real** va contra esta spec (`SPEC_DIR` = esta carpeta, `PHASE=smoke-n1`), con la copia del kit de `git archive HEAD:dist` en `.temp/k320/` y `RUNS_DIR=.temp/k320/runs`; su techo es la Suma de abajo. Su sujeto entra después en el precio de `c1` de `sdd-verify`: es una medida real, con n = 1.
12. **Los Vitest no usan cifras del repo**: baterías y campañas sintéticas en el `memory-fs`, con suma = Σ n y coste = Σ n × precio; las cifras del repo (64 líneas, 119, 107, el ±20 %) se comprueban con los comandos reales y se registran en el walkthrough, porque una campaña nueva o una edición de `battery.md` las cambia.
13. **El backtest del ±20 %** corre la función de previsión exportada con un `fs` que oculta las carpetas desde la de la 0306 (`20261105-161645-…`), en un script del scratchpad que el walkthrough cita con su salida; no se añade una opción al lanzador para eso.
- Política de modelos: revisores de la spec dominio sonnet + técnica sonnet, effort medium (ninguna regla de negocio ni de roles: herramienta del repo) · segunda ronda, si la hay, sonnet · ejes de la revisión final Spec opus+high, Código sonnet+high, Arquitectura según el plan · el sujeto del humo, sonnet (el modelo de `c1` en la batería), uno · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Dos revisores en Sonnet, 2026-11-07: 20 hallazgos, ningún Crítico; sin segunda ronda (no hay Crítico aceptado y la decisión central, de dónde sale el precio, no se reescribe: solo se precisa).

- **Aceptado** — D1 · el Scope no decía que `plan` pasa a leer `.docs/sdd/specs/*/*/out/` ni los fixtures de campañas → Scope.
- **Aceptado** — D2 y T7 · `N` puede subir n sin escenario, y faltaban `N` sin filtro y el error en `plan` y `verdict` → decisión 3 (orden y techo) y S1.
- **Aceptado** — D3 y T6 · `--resume` no fijaba el techo, la marca viva o muerta, `lanzo 0`, `N` con `--resume` ni la evidencia de que un corte no deja `tools.txt` → decisión 4 y S4.
- **Rechazado** — D4 · llevar a «con el dev-lead» que `--resume` no relanza los guardados sin RESULTADO → es una decisión propia y por eso está en este ✋, que el gate valida; borrar la salida de un sujeto concreto no es la copia de la batería que la feature quita.
- **Aceptado** — D5 y T5 · el slash cogía cualquier palabra tras `/` (`/clear`, una ruta, sin prefijo) → decisión 6 con la regex `^/([\w-]+:[\w-]+)(\s|$)` y S5 con cada forma.
- **Aceptado** — D6, T3 y T4 · la llave no fijaba el orden de carpetas, el id exacto (`c1` frente a `c10-1`), los sujetos sin `state.txt` o sin RESULTADO, el modelo ni quién escribe `state.txt` → decisión 1, decisión 6 y S3.
- **Aceptado** — D7 y T1 · el −2,0 % incluye el propio control → la medida que cuenta es el backtest sin la 0306 (decisiones 1 y 13, S3). **Rechazado** el segundo control (0305): el dev-lead fijó la medida contra el de la 0306.
- **Aceptado** — D8 · coma y punto mezclados → S3 en punto, como imprime el lanzador.
- **Aceptado** — D9 y T10 · rangos `4 a 2` y `2 a 4 sujetos por tanda` → decisión 7 y S2; S1 comprueba n y umbral, no el numerador; `reanudo:` sin plural (`guardadas <k>, lanzo <m>`).
- **Aceptado** — D10 · cifras de la 0306 mezcladas en el 🦆 → 57,50 $ previstos y 107,44 $ de la campaña; 71,43 $ es solo el control.
- **Aceptado** — T2 · cifras del repo en un Vitest se rompen con cada campaña → decisión 12: Vitest sintéticos y las cifras reales al walkthrough.
- **Aceptado** — T8 · consumidores de la salida de `plan` → ninguno (`git grep`), decisión 2 y la tabla de lo que cambia de forma; prefijo fijo `suma:`.
- **Aceptado** — T9 · ruta fija y carpeta ausente, y el humo en el precio → decisiones 1 y 11.

### Decisiones tomadas con el dev-lead

- Carril feature, no patch ni lite: cinco conductas nuevas con su test — «si» (triaje, 2026-11-07)
- El precio de `plan` no lo escribe nadie a mano y se mide contra el control de la 0306 (107 sujetos, 71,43 $, ±20 %) — petición de arranque, 2026-11-07
- La plantilla de spec y su hueco «Previsión de coste» quedan fuera: «si hace falta cambiar una frase para que cite la salida de plan, la cambia la 0309 (sdd-templates)» — petición de arranque, 2026-11-07
- Las baterías de cada skill (`tests/batteries/`) no se tocan — petición de arranque, 2026-11-07
- Perfil delegate; al fusionar, `sdd merge --push` — petición de arranque, 2026-11-07
- Dos revisores de la spec en paralelo, dominio y técnica en Sonnet — «si» (2026-11-07)

## Intent

Un humo con n = 1 obligó en la 0312 y en la 0307 a copiar `tests/batteries/` con junctions; una Suma «2 a 4» cayó a `SUBJECT_CAP` con aviso; la previsión de la 0305 y la 0306 salió de un precio escrito a mano y de contar escenarios en vez de sumar n (57,50 $ previstos frente a 107,44 $, tres paradas por dinero); una tanda cortada con 35 sujetos guardados pidió un lanzador a mano para seguir; y `c1` de `sdd-propose` salió 0/2 con la conducta bien. El éxito: ninguna de esas cinco cosas pide copiar, escribir a mano ni leer un rojo falso, cada una con su test, y la previsión de `plan`, calculada sin las campañas de la 0306, cae dentro del ±20 % de su control. Fracasaría si `plan` diera un coste que nadie puede contrastar (sin decir qué escenarios no tenían medida) o si `--resume` relanzara algo ya pagado.

## Scope

- Entra: `tests/headless/battery.mjs` (`N=` en `run`, `plan` y `verdict`; la suma y el coste de `plan`, que pasa a leer las campañas guardadas de `.docs/sdd/specs/*/*/out/` con el `fs` inyectado; `run --resume`; la skill del slash en `verdict`; su cabecera de uso); `tests/headless/campaign.mjs` (el rango en `forecastSubjects`; exportar `labelTaken`); `cli/test/kit/headless/battery.test.ts` y `campaign.test.ts` (los tests de las cinco conductas, con campañas guardadas sintéticas en el `memory-fs`, y los dos que citan el mensaje viejo); `.docs/sdd/tech-stack.md` (decisión 8); en el cierre, `.docs/sdd/roadmap.md` (decisión 9).
- No entra: `skills/sdd-templates/templates/spec-template.md` (la 0309); `tests/batteries/` (ninguna batería ni `subject.mjs`); `tests/headless/run.mjs`, que lanza una campaña suelta sin batería; relanzar sujetos guardados sin RESULTADO (decisión 4).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Mensaje `ya existe <etiqueta> en <out>: borra esa carpeta o cambia PHASE` | `tests/headless/battery.mjs:240`; `cli/test/kit/headless/battery.test.ts:459` y `:503` | Scope, decisión 5: gana «o reanuda con --resume» |
| Salida de `plan`: una línea por escenario, sin total | `tests/headless/battery.mjs:2` (cabecera) y `:299`; ningún script la lee (`git grep "battery.mjs plan"`) | Scope, decisión 2: las líneas se quedan y se añade la de la suma, con prefijo `suma:` |
| `forecastSubjects` solo acepta un número | `tests/headless/campaign.mjs:33` (comentario) y `:41` | Scope, decisión 7 |
| Receta del humo n = 1 con copia de `tests/batteries/` y junctions | `.docs/sdd/tech-stack.md:137` | Scope, decisión 8: sustituida por `N=` |
| «`/sdd-kit:<skill>` … la puerta de `battery.mjs run` sale roja; se puntúa la conducta» | `.docs/sdd/tech-stack.md:138` | Scope, decisión 8: sustituida por la decisión 6 |
| Variables de `battery.mjs run` | `.docs/sdd/tech-stack.md:109` | Scope, decisión 8: nombra `N` y `--resume` |
| Precio por sujeto escrito a mano | `.docs/sdd/tech-stack.md:141` | Scope, decisión 8: la previsión sale de `plan`; las cifras quedan como evidencia |
| «el precio por sujeto de `tech-stack.md`, o lo medido» | `skills/sdd-templates/templates/spec-template.md:149` | No entra: la 0309 (decisión 9 y frase del dev-lead) |
| «El techo de sujetos es la fila Suma» | `tests/headless/run.mjs:5` | Sin cambio: el rango sigue en la fila Suma |
| Aviso `sin previsión legible … escribe el total en la fila Suma` | `tests/headless/campaign.mjs:52`; `cli/test/kit/headless/campaign.test.ts:174` | Sin cambio: sigue saliendo con la prosa que no es número ni rango |

- Filas que implementa: 0320 → `roadmap.md:155` y `:156` (la 0311 va tras ella), cierre; deuda «El lanzador de baterías no deja bajar n ni lee un rango en la Suma de la previsión» (`roadmap.md:729`) y «La previsión de sujetos de la spec sale de un precio por sujeto escrito a mano y de contar escenarios» (`roadmap.md:730`) → saldadas en el cierre; la segunda deja la cita de la plantilla a la 0309 (decisión 9). Buscado con `git grep -n "0320\|no deja bajar n\|precio por sujeto escrito a mano"` fuera de `specs/` y `field-reports/`: solo esas líneas.

## Approach

Todo en el lanzador, reutilizando lo que ya existe: la selección de filas de `batteryPlan` (aplica `N` tras `SCENARIOS` y `STEPS`, y `judge` lee la n y el umbral de la fila ya sustituida), `labelTaken` de `campaign.mjs` para `--resume` (petición: «mira primero cómo salta runCampaign las etiquetas ya guardadas y reutilízalo»), `costsIn`/el patrón de `=== RESULTADO` para el precio y `readRuns` para leer `state.txt` junto a `tools.txt`. El precio de `plan` recorre `.docs/sdd/specs/*/*/out/` con el `fs` inyectado, para probarlo con `memory-fs.ts`.

## Dónde se prueba

- S1 `N=`: `runBattery` con las dependencias falsas de `battery.test.ts` (cuántos sujetos lanza y el veredicto), y `verdict` y `plan` con `N`; el humo real, una vez, con `c1` de `sdd-verify`.
- S2 rango: `forecastSubjects` y `readConfig` en `campaign.test.ts`, como los casos de la Suma de hoy.
- S3 `plan`: la función de previsión con un `memory-fs` con dos campañas guardadas; y `node tests/headless/battery.mjs plan` real sobre `sdd-propose`, entera y con los 58 escenarios del control.
- S4 `--resume`: `runBattery` con salidas guardadas en el `memory-fs`, como «no relanza una batería cuyas etiquetas ya tienen salida».
- S5 slash: `verdict` con un `state.txt` en el `memory-fs`; y `battery.mjs verdict` real sobre `control/out` de la 0306.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno en `capabilities/` (ver «Capacidades»). Los escenarios que fijan las tasks:

### S1 — `N=` sustituye n y umbral

- GIVEN la batería de `sdd-verify`, con `c1` a n = 2 y umbral 2/2
- WHEN `N=1 SCENARIOS=c1 BATTERY=sdd-verify node tests/headless/battery.mjs run`
- THEN lanza un sujeto, `c1-1`, y la línea del veredicto dice `/1 · umbral 1/1` tras `c1 · <pasan>` (el criterio de hecho espera `c1 · 1/1`; el numerador lo pone la conducta del sujeto, no el lanzador)
- AND `N=1 battery.mjs verdict` sobre esa salida da la misma línea
- AND en Vitest: `N=3` sobre un escenario de n = 2 lanza `-1`, `-2` y `-3` con umbral 3/3; `N=1` sin `SCENARIOS` ni `STEPS` deja n = 1 en todos; `N=0` o `N=dos` en `run`, `plan` y `verdict` paran con `N tiene que ser un entero positivo: <valor>` y código 2, sin lanzar ni juzgar nada

### S2 — un rango en la Suma

- GIVEN una spec con `| Suma | 2 a 4 | 3 |` en «Previsión de coste»
- WHEN el lanzador lee la previsión
- THEN el techo es 4 sujetos y no sale ningún aviso
- AND `| Suma | 4 a 8 sujetos | 6 |` da 8; `| Suma | 4 a 2 | 3 |` da 4; `| Suma | 5 |` sigue dando 5; `| Suma | unos cuantos |` y `| Suma | 2 a 4 sujetos por tanda | 3 |` siguen cayendo a `SUBJECT_CAP` con el aviso de hoy

### S3 — `plan` suma n y prevé el coste

- GIVEN en Vitest una batería sintética con `a1` (n = 2) y `b1` (n = 1), y dos carpetas de spec guardadas: la vieja con `a1-1` a 1.00 $ y la nueva con `a1-1` a 0.40 $ y `a1-2` a 0.60 $, las dos con la petición de `a1` en su `state.txt`
- WHEN `plan` sobre esa batería
- THEN la última línea es `suma: 3 sujetos · coste previsto: 1.50 $ · sin precio medido: b1 (a 0.50 $, la media de los escenarios medidos)` (a1: 2 × 0.50; b1: 1 × 0.50)
- AND no cuentan para `a1`: `a10-1.tools.txt`, un `a1-3` con otra petición, uno sin `state.txt` y uno sin `=== RESULTADO`; sin ninguna campaña que case, la línea es `suma: 3 sujetos · coste previsto: sin campañas guardadas de esta batería`; con `N=1`, `suma: 2 sujetos`
- AND con el repo real, `node tests/headless/battery.mjs plan tests/batteries/sdd-propose/battery.md` imprime las 64 líneas `<id> <modelo> <n>` y `suma: 119 sujetos · coste previsto: <x.xx> $`; con `SCENARIOS` = los 58 escenarios del control de la 0306, `suma: 107 sujetos`; y el backtest de la decisión 13 sobre esos 58 da un coste entre 57.14 $ y 85.72 $ (71.43 $ ± 20 %). Estas cifras van al walkthrough, no a un Vitest (decisión 12)

### S4 — `run --resume` lanza solo lo que falta

- GIVEN una tanda cortada: `a1-1`, `a1-2` y `b1-1` con `tools.txt` guardado en `<out>`, y `b1-2` sin nada
- WHEN `battery.mjs run --resume` con esa batería
- THEN lanza solo `b1-2`, dice `reanudo: guardadas 3, lanzo 1` y da el veredicto de `a1` y `b1` con todo lo guardado
- AND con las cuatro guardadas dice `reanudo: guardadas 4, lanzo 0`, no lanza nada y da el veredicto
- AND con `N=1` mira solo `a1-1` y `b1-1`: `reanudo: guardadas 2, lanzo 0`
- AND una marca de `b1-2` en `RUNS_DIR/live` con el PID vivo la salta; con el PID muerto la lanza
- AND el techo de la Suma cuenta los tres `tools.txt` guardados: con Suma 3, `b1-2` no se lanza y sale el aviso de techo de hoy
- AND sin `--resume` para con `ya existe a1-1 en <out>: borra esa carpeta, cambia PHASE o reanuda con --resume`

### S5 — la skill de una petición slash es la primera

- GIVEN `control/out/` de la 0306, con `c1-1` y `c1-2`: petición `/sdd-kit:sdd-propose` en `state.txt` y su primera `>>> Skill:` `sdd-kit:sdd-grilling`
- WHEN `node tests/headless/battery.mjs verdict tests/batteries/sdd-propose/battery.md <esa carpeta>`
- THEN la línea de `c1` empieza por `c1 · 2/2 · umbral 2/2` (hoy, `c1 · 0/2 · umbral 2/2 · rojo`)
- AND en Vitest, con «Esperado» `sdd-kit:sdd-propose` y primera `>>> Skill:` `sdd-kit:sdd-grilling`: la petición `/sdd-kit:sdd-propose añade el motivo` pasa; `/sdd-propose`, `/clear`, una petición sin slash, un `state.txt` sin `## petición` o ningún `state.txt` se juzgan por `sdd-kit:sdd-grilling` y no pasan; `/sdd-kit:sdd-nope` no pasa; y `/sdd-kit:using-sdd` se juzga por su primera `>>> Skill:` que no es `using-sdd`

## Previsión de coste

Esta spec no edita ninguna skill; la previsión existe porque el humo de S1 lanza un sujeto real y el lanzador toma su techo de la Suma. Precio de `c1` de `sdd-verify`: 0,86 $, la media de su carpeta más reciente con la llave de la decisión 1 (12 sujetos guardados casan).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 0 — tests Vitest, sin sujetos | 0 |
| GREEN | 1 — humo de S1, `c1` de `sdd-verify` | 0,86 |
| Una tanda de REFACTOR | 0 — el REFACTOR se prueba con los Vitest | 0 |
| Controles | 1 — reserva, solo si el humo se corta sin evidencia | 0,86 |
| Medición tras la revisión final | 0 — la revisión final no cambia la conducta del sujeto | 0 |
| Suma | 2 | 1,72 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-07 | aprobada (opción «Apruebo») |
