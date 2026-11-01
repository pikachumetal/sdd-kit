# Batería de regresión — `sdd-retro`

La mejora del entorno del proyecto: las señales del cierre y el repaso por causa de cada corte. Nace en la feature 0277.

Se lanza con `node tests/headless/battery.mjs run` (`BATTERY=sdd-retro`, `STEPS=close`, `check` o `release`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Sobre el molde `tests/batteries/using-sdd/mold-salas`: `cierre` añade la carpeta de la feature 0081 con su walkthrough, `.docs/sdd/steering/operations.md` y unas `notas-sesion.md` por escenario; `corte` monta la forma 3.0.0 con `debt.md` y la retro de la 1.3.0; `corte-vacio`, la misma sin filas triadas ni retro, con `estimation-log.md`.

**Petición por fase.** En el RED la skill no existe: `subject.mjs` deja la petición tal cual, que pide el paso de `sdd-archive`. Fuera del RED, en `close` y `check`, antepone «Invoca la skill sdd-kit:sdd-retro con `cierre` y ». `r4` y `r6` piden el corte, y `sdd-end-release` la invoca.

**Dos veredictos.** `battery.mjs run` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y lo que deja cada sujeto, con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| r1 | close | La 0081 se está cerrando: su walkthrough está en `.docs/sdd/specs/20261020-100000-feature-0081-reminders/` y lo que pasó en la sesión, en `notas-sesion.md`. Haz solo el paso del cierre de `sdd-archive` que revisa si hay que mejorar el entorno del proyecto, y deja lo que haga falta sin commitear. | cierre | `sdd-kit:sdd-retro` | 2 | 2/2 | sonnet | propuesta 0131, §archive: salida más barata primero |
| r2 | close | La 0081 se está cerrando: su walkthrough está en `.docs/sdd/specs/20261020-100000-feature-0081-reminders/` y lo que pasó en la sesión, en `notas-sesion.md`. Haz solo el paso del cierre de `sdd-archive` que revisa si hay que mejorar el entorno del proyecto, y deja lo que haga falta sin commitear. | cierre | `sdd-kit:sdd-retro` | 2 | 2/2 | sonnet | propuesta 0131, §archive: «sin señal, una línea» |
| r3 | close | La 0081 se está cerrando: su walkthrough está en `.docs/sdd/specs/20261020-100000-feature-0081-reminders/` y lo que pasó en la sesión, en `notas-sesion.md`. Haz solo el paso del cierre de `sdd-archive` que revisa si hay que mejorar el entorno del proyecto, y deja lo que haga falta sin commitear. | cierre | `sdd-kit:sdd-retro` | 1 | 1/1 | sonnet | revisión de la spec de la 0277: la señal del kit no se pierde |
| r5 | check | La 0081 se está cerrando: su walkthrough está en `.docs/sdd/specs/20261020-100000-feature-0081-reminders/` y lo que pasó en la sesión, en `notas-sesion.md`. Haz solo el paso del cierre de `sdd-archive` que revisa si hay que mejorar el entorno del proyecto, y deja lo que haga falta sin commitear. | cierre | `sdd-kit:sdd-retro` | 2 | 2/2 | sonnet | propuesta 0131, §archive: el chequeo es el primer peldaño |
| r4 | release | Invoca la skill sdd-kit:sdd-end-release y sigue. Cierra la release 1.4.0 con lo que hay en Now; la versión es esa, confirmada. | corte | `sdd-kit:sdd-end-release` | 2 | 2/2 | sonnet | fila 0277: «lo que tenemos ahora es muy miope» |
| r6 | release | Invoca la skill sdd-kit:sdd-end-release y sigue. Cierra la release con lo que hay en Now. | corte-vacio | `sdd-kit:sdd-end-release` | 1 | 1/1 | sonnet | revisión final de la 0277: sin deuda triada no hay carpeta, y la estimación se ofrece |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| S1 Señal | r1 | no nombra la corrección repetida del comando de los tests |
| S2 Peldaño | r1 | crea una skill, o no corrige `operations.md` |
| S3 Línea | r1 | §5 del walkthrough no lleva `Retro: corrección repetida → …` |
| S4 Sin señales | r2 | cambia algún fichero además de §5 del walkthrough, crea `.claude/skills/`, o la línea no es `Retro: sin señales` |
| S5 Kit | r3 | edita una skill del kit o una copia, o §5 no lleva `Retro: … → ticket del kit: …` con el comando desmentido |
| S6 Oferta | r3 | su mensaje final no nombra esa señal para el ticket |
| S7 Chequeo | r5 | ante el `console.log` repetido no añade o propone un chequeo (test, lint o hook), y se queda en una línea de documento o en una skill |
| R1 Salida del verbo | r4 | `releases/v1.4.0/retro.md` no existe, o no lleva literal la salida de `sdd roadmap causes` |
| R2 Propuestas | r4 | «Propuestas» no agrupa las dos filas de `regla lejos de su paso` en un solo cambio, no marca `prioriza o descarta` en «El anuncio sale 4 de 6», o lleva `--planta 2` |
| R3 Sin escribir | r4 | el repaso añade filas a `debt.md` o a `ROADMAP.md` |
| R4 Resumen | r4 | el mensaje del corte no nombra las propuestas |
| R5 Sin parar | r4 | hace una pregunta por el repaso |
| R6 Orden | r4 | `retro.md` no entra en el commit del corte |
| R7 Sin carpeta | r6 | existe `.docs/sdd/releases/v1.4.0/` |
| R8 Oferta | r6 | la propuesta no ofrece la estimación y los action items en una línea |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

La tabla la completan el RED y el GREEN de la 0277 (`tests/sdd-retro-red.md`, `tests/sdd-retro-green.md`).

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Las cuatro señales y los peldaños | propuesta 0131, §archive; RED `r1` | r1 |
| `Retro: sin señales`, sin inventar | propuesta 0131, §archive; RED `r2` | r2 |
| La señal del kit va al ticket | decisión 11 de la spec; revisión de la spec | r3 |
| Repaso, propuestas y arrastre | fila 0277; RED `r4` | r4, r6 |
| El chequeo como primer peldaño | propuesta 0131, §archive; RED `r5`: sale sin guía, se queda como valor de la línea | r5 |
