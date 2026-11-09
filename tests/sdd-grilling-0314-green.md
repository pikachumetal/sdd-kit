# GREEN — feature 0314: el porqué primero en `sdd-grilling`

Del RED (`tests/sdd-grilling-0314-red.md`) entra solo la (2), con W1 en 2 de 2. Batería de `sdd-grilling`, Sonnet, 2026-11-08 y 2026-11-09. Salidas en `.docs/sdd/specs/20261108-184606-feature-0314-grilling-brainstorming-7/` (`green/`, `refactor/`, `refactor2/`, `control/`, `control-dev/`, `control-r/`, `control-r2/`).

## La frase, ronda a ronda

| Ronda | Texto de la (2) | W1 en `p1` | Lo que falla |
| --- | --- | --- | --- |
| GREEN | «…ask that first, open, even if you can guess.» | 1 de 2 | `p1-2`: «Cuéntame con tus palabras qué vas a hacer con el fichero, por ejemplo abrirlo en una hoja de cálculo, pasárselo a alguien o guardarlo como copia» |
| REFACTOR 1 | «…ask that first, even if you can guess: open, with no options or example answers.» | 1 de 2 | `p1-2`: «(¿abrirlo en una hoja de cálculo, pasárselo a alguien, guardarlo como copia?)» |
| REFACTOR 2 | «…ask that first, even if you can guess: open, «what will you do with it?», not «a spreadsheet, a colleague, a backup?».» | **2 de 2** | — |

Clase del fallo (Art. II): de forma. Pregunta el porqué primero en los 6 sujetos de las tres rondas (0 de 2 en el RED), pero lo acompaña de un menú de respuestas. Decir «sin ejemplos» no bastó; el contraejemplo literal, sí. En la ronda 2, `p1-2` pide «de qué trabajo sale, quién lo va a abrir y con qué herramienta»: orienta qué contar, sin ofrecer respuestas, y pasa W1.

## `p2` y `p3` (GREEN y REFACTOR 1, n = 2 cada uno)

| Fila | GREEN | REFACTOR 1 | Nota |
| --- | --- | --- | --- |
| W2 | 0 de 4 | 0 de 4 | con el porqué dicho no lo preguntan (AND de «El porqué va primero»); separador, destino y columnas cambian lo que se construye |
| W3 | 0 de 6 | 0 de 6 | |
| W4 | 0 de 2 | 0 de 2 | nadie reabre el «;» ni la salida estándar |
| W5 | 1 de 6 | 0 de 6 | GREEN `p3-2`: «Un fallo sería que Excel no abra las columnas separadas», el mismo antiobjetivo inventado que `p2-2` en el RED (1 de 6): misma tasa, no es regresión |

## No regresión: la batería entera con N = 1 (kit de GREEN)

Puerta verde en 14 de 16. `p1`-`p3` no se lanzaron en esta tanda: `COST_CAP` es acumulado de la campaña, y el de 6 $ ya estaba gastado. Los cubren GREEN y REFACTOR a n = 2.

| Escenario | Con la rama | Con el kit de `develop` | Veredicto |
| --- | --- | --- | --- |
| g7 | rojo de puerta: se para en el aviso «kit 2.3.4, el proyecto pide el 3.0.0» | el mismo rojo | no es nuevo |
| u1 | rojo de puerta: pregunta qué quiere hacer (la duda de `using-sdd`) | el mismo rojo | no es nuevo |
| g8 | R5 dudosa: «Mi propuesta… "Evitar conflictos al reservar…"» | pasa: «¿Qué problema resuelve `salas`, quién la usa y con qué roles?» | con el kit de REFACTOR 1 pasa: «¿Para qué quieres este proyecto y qué problema resuelve?… Respóndelo con tus palabras»: ruido de un sujeto |
| g1 | el primer turno pregunta el porqué, abierto: «¿Qué te pasa hoy que quieres resolver con las medias horas?» | — | conducta buscada; R3 y R4 ya no se ven en el turno 1 |
| g2, g5 | R5 pasa; R8 en g5 pasa (decide ramas y pruebas, deja pendiente el problema) | — | |
| g3 | el turno 1 acaba en el porqué y `TURN2` («sí, adelante…») no lo contesta: escribe la spec sin pregunta de diseño, y R6 queda sin medir | — | `TURN2` de g3 y g6 lleva desde ahora el porqué |

Con `TURN2` nuevo y el kit de REFACTOR 2 (N = 1): g3 llega a «¿Qué pasa cuando la sala se libera?» con la escena `reservar Norte lun 10:00-12:00` → `Norte ocupada; en espera (1.º)`, y con el porqué cambia su recomendación. En g6, el turno 1 pregunta el porqué abierto («Cuéntamelo con un caso real»), el 2 da una escena por alternativa y el 3 contesta en prosa (R9).

## Comprobaciones del repo

`kit:copies` «Copias al día: 31 ficheros.»; `kit:own` con las 26 líneas de la línea base, ninguna de `sdd-grilling`; `kit:skill-size` solo con el rojo previo de `sdd-roadmap`; `kit:upstream` sin línea de `sdd-grilling` (queda `cli/src/tasks/`, de la 0313); `notices`, `word-budget` y `dist`, 114 tests en verde. `sdd-grilling`: 872 palabras, con el tope de 900.

Coste de la campaña: 44 sujetos, 9,70 $ (previsión 47 sujetos, techo 13 $).
