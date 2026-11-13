# REFACTOR 1 — totales

Kit: `dist/` con la ronda 1 sin commitear (copia en `.temp/i/kit-r1`; el texto medido es el del commit de la Task 4 antes de la ronda 2). Escenarios en rojo del GREEN 1: `g1 g9 g8 g3 p1 p2 p3 fp pe` (entrevistador) y `g4 g6 g7 sk` (forma), 38 sujetos y 2 relanzamientos (`g8-3`, `fp-4`), 8,77 $. Control: `g7` y `sk` con el núcleo de antes (`../control-forma/`), 4 sujetos, 1,02 $.

## Lo que mueve la ronda 1

| Fila | Escenario | GREEN 1 | REFACTOR 1 |
| --- | --- | --- | --- |
| E4w | g9 | 0/5 | 1/5 (`g9-2` con `WebFetch` a nodejs.org) |
| E1 | fp | 0/4 | 4/4 (el núcleo se carga en el turno 2 y acepta lo que mantiene el usuario) |
| K | fp | 4/5 | 4/5 (`fp-4` no carga en ningún intento) |
| E6 | g8, p1 | 3/5, 1/2 | 5/5, 2/2 |
| E5 | g1, g8, p2, p3, pe | 1/2, 4/5, 1/2, 1/2, 2/5 | 2/2, 4/5, 2/2, 2/2, 4/5 |
| E0 | g1, g3, g9 | 1/2, 1/2, 4/5 | 2/2, 2/2, 5/5 |
| E3 | pe, p3 | 4/5, 2/2 | 0/5, 1/2 (copian el ejemplo del núcleo, «¿qué harás con el CSV el próximo lunes?», que la petición ya contesta) |
| R7, R9 | g4, g6 | 1/2, 1/2 | 2/2, 2/2 |
| C1 | g7 | 0/2 | 0/2 (control con el núcleo de antes: 2/2, regresión) |
| B1 | sk | 0/2 | 0/2 (control con el núcleo de antes: 1/2, `sk-1` también describe en texto) |

## Lectura

- `fp`: el lector dio «no cargó» a todo porque el núcleo llega en el turno 2; el hilo puntuó el turno 2 (`readings/fp.md`). El turno 1, el rebate, va sin núcleo en todos: lo clasifica `sdd-propose` antes de leer `spec-writing.md`.
- `g8-3` y `fp-4` no cargaron y se relanzaron; `g8-3` cargó, `fp-4` no: rojo de K.
