---
id: 20261022-140232-feature-0208-dev-validation-script
feature: 0208
title: Walkthrough — Validación del dev con guion desde el reporte
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-23
---

# Walkthrough — Validación del dev con guion desde el reporte

## 1. Cambios realizados

- **Apertura**: spec aprobada («Apruebo (Recomendada)»), plan de tres tasks en Native y el RED de 8 sujetos ([tests/dev-validation-red.md](../../../../tests/dev-validation-red.md)).
- **Task 1 — `sdd validation serve` y el panel**:
  - `cli/src/validation/server.ts`: `node:http` en `127.0.0.1`, puerto 0; `GET /`, `/panel.js`, `/results` y `POST /mark`; 403 con un `Host` u `Origin` ajeno, 400 con un id o un estado desconocidos, 500 si no puede guardar; cada marca se escribe en `--out` al momento.
  - `cli/src/validation/verbs.ts`: el verbo, con su uso literal (`usage` nuevo en `Verb`, que `main.ts` prefiere).
  - `skills/sdd-archive/references/validation-panel.js`: el panel del spike de la 0162 con la API por id (`mount`, `read`, `clear`), claves `sdd-validation-<id>` y `sdd-validation-panel-src`, y `aria-pressed`.
  - La página del plan B parte de las marcas del servidor y manda solo las que cambian, en orden.
- **Task 2 — la receta**: `skills/sdd-archive/references/dev-validation.md` (el guion desde el reporte y ensayado, el entorno con `validation.startEnvironment`, nada contra el entorno mientras la persona prueba, la línea `Panel:`, las cuatro reglas de Chrome, el plan B y el registro). El paso 1 de `sdd-archive`, el paso 7 de `sdd-start-feature` y `sdd-implement` apuntan a ella. Plantillas: «Puertos en Windows» en `operations-template.md`, «fijado en <sdd-kit.json | sdd-kit.local.json>» y un ejemplo repetido menos en `plan-template.md`, «en la entrada» en `spec-template.md`. Batería de `sdd-archive`: moldes, escenarios `g1`-`g4` y rúbrica G1-G6.
- **Task 3 — el panel a mano**: [verification/panel.md](verification/panel.md), con Playwright (sin la extensión de Claude in Chrome).
- **Pasada de fix de la revisión final**, juntada en el cierre: los 7 Important y 13 Minor de los tres ejes, con 5 tests RED→GREEN y rulings. La re-revisión encontró un Important nuevo de la propia pasada (la página del plan B mandaba los pasos `pending` y les ponía `markedAt`), arreglado con un test que corre el script real de la página: va a ✋ como sin revisar.
- Evidencia: [tests/dev-validation-red.md](../../../../tests/dev-validation-red.md) y [tests/dev-validation-green.md](../../../../tests/dev-validation-green.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 5h
- Esfuerzo real: 4,7 h — aproximado. `sdd session tokens` da 2,99 h (reloj de la sesión 20,51 h desde 2026-10-22T13:58Z, sin 1051 min de espera al dev-lead en 13 esperas), porque cuenta como espera trabajo hecho tras mensajes del dev-lead que no pedían respuesta. Aproximado con la marca de la carpeta de la spec y los commits: ~1,6 h el 2026-10-22 (13:58Z-15:35Z) y ~3,1 h el 2026-10-23, de la vuelta al cierre.
- Desviación: −0,3 h (−6 %)
- Causa de la desviación: dentro de ±30 %. La campaña de sujetos corrió en segundo plano; la tercera vuelta (REFACTOR 2) y la pasada de fix sumaron lo que ahorraron las tasks.
- Compactación: sí, en la Task 2 → Native
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 70.180.955 — claude-opus-5-5 70.180.955
- Tokens de subagentes: 4.994.920 en 6 despachos — Final review — Spec axis claude-opus-5-5 1.602.833 / 4 min; Re-review final 0208 claude-opus-5-5 499.290 / 2 min; Final review — Architecture axis claude-opus-5-5 1.144.855 / 2 min; Final review — Code axis claude-sonnet-5-5 1.114.982 / 2 min; Revisor de spec, lente técnica claude-sonnet-5-5 161.021 / 1 min; Revisor de spec, lente dominio claude-opus-5-5 471.939 / 2 min
- Coste de la sesión: 35,56 $ (hilo 30,17 $ + subagentes 5,40 $)
- Coste de sujetos: 6,14 $ en 26 sujetos Sonnet — RED 1,62 $; GREEN 1,86 $; REFACTOR 1,47 $; REFACTOR 2 1,19 $
- Review de spec: 2 revisores (dominio Opus, técnica Sonnet, pedidos por el dev-lead) · hallazgos 20, aceptados 19

## 3. Desviaciones del plan

- **El panel se verificó con Playwright, no con Claude in Chrome** (decisión 10): la extensión no estaba conectada (`list_connected_browsers` → `[]`) y el dev-lead estaba ausente. Las cuatro reglas que dependen de sus herramientas y la caída a plan B por CSP quedan `no probado`.
- **Tres vueltas tras el GREEN**: REFACTOR (línea `Panel:` y entorno de una app con CLI) y REFACTOR 2 (sin la salida «sin panel»), con la enmienda del techo a 26 sujetos aprobada: «Una vuelta más (Recomendada)».
- **Enmiendas en la revisión final**: la línea `Panel:` entra en el delta de `archive`, y un KO borra las claves del panel para que la vuelta tras el arreglo empiece de cero.
- **`tests/Templates.Tests.ps1` no existe**: la verificación de la Task 2 corrió `WordBudget` y `AnchorTemplates`.

### Decisiones tomadas sin el dev-lead

Los rulings del ledger y de `tasks.md` (`## Rulings`), con su coste si están mal:

- La página del plan B lleva un icono vacío (`data:,`) para no dejar un 404 de `favicon.ico` en la consola — coste: ninguno visible.
- `install` de `validation-panel.js` mide ~80 líneas: es el envoltorio que permite reinyectar con `(${install})()` — coste: una función larga de leer.
- Un `--steps` que no se puede leer sale como «no es una lista de pasos», el AND literal de la spec — coste: el motivo exacto (ENOENT) no se ve.
- El éxito del verbo (`panel:` y parar con SIGINT) no tiene test automático: emitir SIGINT dentro de Vitest arriesga el runner; lo cubren la verificación a mano y tres sujetos — coste: una regresión de la parada se ve en campo.
- `architecture.md` no gana la línea del JS inyectado: está en su tope (1900/1900) y la regla vive en «Dónde viven los datos» de `archive` — coste: quien lea solo `architecture.md` no la ve.
- `clear()` borra las claves `sdd-validation-` de todo el origen, como dice la spec — coste: las marcas de otra validación diferida en el mismo origen.
- Un POST fallido del plan B no se reintenta — coste: una marca perdida en `--out`, que el agente ve como paso pendiente al leerlo.
- `readBody` sin límite de tamaño: solo llega tras el filtro de `Host` y `Origin` — coste: ninguno práctico.
- **Enmienda sin parada para confirmar**: un KO borra las claves del panel para que la vuelta tras el arreglo empiece de cero (§7 de `dev-validation.md` y un AND de `archive`) — coste: si no la quieres, se quitan esa frase y el AND.
- `g4` (sin Chrome y con prisa) no se volvió a medir con la línea `Panel:` final: el techo de 26 sujetos estaba gastado y el dev-lead fijó cerrar con lo medido — coste: G6 con prisa sin medir; fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → kit 1362/1362, cli 1164/1164, slow 295/295, min 1459/1459 · 9 min 45 s · configuración: la del gate · sobre el código del commit de cierre (desde entonces solo cambian docs).
- Un primer gate sobre la pasada a medias (tests RED escritos) no cuenta; otro, ya con el código, dio 1 rojo en `WordBudget` (kit 91310/91300), arreglado recortando la receta.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-23 · gate de cierre en verde sobre el código del commit de cierre · revisión final Spec, Código y Arquitectura, pasada de fix (20 hallazgos: 5 RED→GREEN, el resto texto, tests o rulings) y re-revisión, juntadas en el cierre; 1 sin revisar (el arreglo del Important que abrió la pasada, RED→GREEN) · 26 sujetos Sonnet · plan B a mano en Chromium · 20 de 26 THEN con `ejecución real` o `suite`, 6 `no probado`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| feature-flow · el guion son pasos numerados con acción y resultado, compuestos y ensayados según `archive` | ejecución real (GREEN `g1`-`g4`: G2 8/8, G3 6/6) | pasa |
| feature-flow · sin `startEnvironment`, para lo que arrancó y el guion empieza por cómo arrancarla | ejecución real (`g1` y `g2` del GREEN: entorno abajo y arranque en el guion) | pasa |
| feature-flow · con `startEnvironment: true`, la deja arrancada con puerto y cómo pararla | ejecución real (REFACTOR `g3` ×2: arriba en 4422 y 4317) | pasa |
| feature-flow · con `true` y el entorno sin levantar, lo levanta con «Arrancar» y lo comprueba | ejecución real (REFACTOR `g3` ×2); en REFACTOR 2, `EACCES` del rango reservado de Windows, diagnosticado con `netsh` | pasa |
| feature-flow · sin comando de arranque declarado, lo dice | ningún molde lo trae | no probado |
| archive · los dos primeros pasos son los del reporte, literales | ejecución real (GREEN `g1` ×2) | pasa |
| archive · cada resultado con su literal | ejecución real (G3 6/6) | pasa |
| archive · el agente corre cada paso antes de presentarlo | ejecución real (G2 8/8, `tools.txt`) | pasa |
| archive · un paso añadido que falla no entra | ejecución real (GREEN `g1` ×2: sin «reserva y cancela») | pasa |
| archive · un THEN no observable va con `no ensayado:` | ningún molde lo trae | no probado |
| archive · nada contra el entorno mientras la persona prueba | ejecución real (GREEN `g2` y `g4`, G4 4/4) | pasa |
| archive · la tanda antes o después, y lo dice | ejecución real (GREEN `g4` ×2) | pasa |
| archive · Chrome: inyecta, monta, `read_network_requests`, `read_console_messages` con `clear: true` y avisos | inyección y montaje con Playwright; las herramientas de Claude in Chrome sin extensión | no probado |
| archive · «listo» o recarga → reinyecta desde `localStorage` con las marcas | ejecución real (Playwright, 3 recargas) | pasa |
| archive · 3/3 OK y «listo» → `Validado: … panel: 3/3 OK · «listo»` y `clear()` | `clear()` con Playwright; la línea, por texto | pasa (parcial) |
| archive · un KO → «No funciona» con comentario, consola, red y captura | consola y captura con Playwright; las de Claude in Chrome sin extensión | no probado |
| archive · paso sin marcar → pregunta | texto de §7; ningún sujeto llega a «listo» en headless | no probado |
| archive · otro id en el mismo origen empieza sin marcas | ejecución real (Playwright, `0209` tras `0208`) | pasa |
| archive · inyección fallida por CSP → plan B | la app del spike no envía CSP | no probado |
| archive · con `field` no abre navegador, servidor ni entorno | ejecución real (controles `a1` y `a2`) | pasa |
| archive · sin Chrome, ofrece `sdd validation serve` con URL y lo que pierde | ejecución real (REFACTOR 2: G6 3 de 4) | pasa (3 de 4) |
| archive · `.temp/` fuera del `.gitignore` → lo dice antes de lanzarlo | ejecución real (`g1-2` y `g3-2` lo dicen; `g1-2`, tras lanzarlo: el texto ya dice «before launching it») | pasa (parcial) |
| archive · «listo» → lee `--out`, para por PID | ejecución real (plan B a mano: `1:ok`, `2:ko:sale cancelada`, parado por PID) | pasa |
| cli · `--help` lista `validation serve` | ejecución real y suite (`help lists validation serve`) | pasa |
| cli · `validation serve` crea la carpeta, escucha en `127.0.0.1` e imprime `panel:` | ejecución real (`panel: http://127.0.0.1:1077/`) y suite | pasa |
| cli · 403, 400, `--steps` no válido, sin opciones y `--help` con el uso literal | suite (`serve.test.ts`, 26 tests) y ejecución real (`--help` y `--steps nope.json` → 2) | pasa |

### 4.3 Residuales / deuda generada

- Las reglas de Claude in Chrome (`read_network_requests`, `read_console_messages` con `clear: true`, la captura de `computer`, la caída a plan B por CSP) sin probar → fila de deuda.
- G6 en 3 de 4: `g3-1` no ofrece el panel cuando el entorno no arranca, `g1-2` lanza el servidor en primer plano, y `g4` sin medir con la línea final → fila de deuda.
- `sdd session tokens` cuenta como espera trabajo hecho tras un mensaje del dev-lead que no pedía respuesta (2,99 h frente a ~4,7 h) → se suma a la fila ya abierta en la 0209.

## 5. Aprendizajes

- Una opción de salida fácil en una línea fija («sin panel») es la que eligen los sujetos: 3 de 4 la escribieron en REFACTOR; sin ella, 3 de 4 ofrecieron el plan B → texto de `dev-validation.md` §4 (la regla vive donde se aplica).
- Los rangos de puertos reservados de Windows se mueven entre arranques: un molde que pasó un día da `EACCES` al siguiente → ya está en «Puertos en Windows» de `operations-template.md`; sin más destino.
- Un recurso que se inyecta en el navegador vive como JS plano en las `references/` de su skill y la CLI lo lee por ruta → «Dónde viven los datos» de la capacidad `archive` (`architecture.md` está en su tope).

## 6. Adendas
