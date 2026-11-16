# GREEN del núcleo aligerado — totales

Kit: `dist/` con el núcleo de antes aligerado (enmienda del 2026-11-14), en `.temp/i/kit-r4`. La tanda cortó en el techo de `COST_CAP=58`: 56 de 59 sujetos (faltan `sk-2`, `fl-2` y `ag-2`), 15,30 $; la campaña, según `battery.mjs`, 236 sujetos y 56,68 $. Cuatro «no cargó» sin relanzar por el techo (`g8-2`, `g8-4`, `g3-1`, `fp-3`) y `g7-2`, que entró por `sdd-upgrade`. Lectores Sonnet; `m2`, `e1` y `n4`, el hilo.

## Filas de fondo frente al núcleo de antes

Base: el RED en `g9 fp g8 pe` y `control-a`/`control-b` del spike 0341 en el resto (decisión 5).

| Fila | Escenario | Núcleo de antes (RED · control-a · control-b) | Aligerado |
| --- | --- | --- | --- |
| E0 | g9, g8, fp | 15/15 · — | 12/12 |
| E0 | pe | 5/5 · 3/5 · 4/5 | 3/5 (dentro de lo que da el núcleo de antes) |
| E0 | g3 | — · 2/2 · 2/2 | 0/1 (da por hecho el porqué en el turno 1) |
| E0 | p3 | — · 2/2 · 2/2 | 1/2 |
| E1 | fp | 2/5 · — | 3/4 |
| E3 | pe | 3/5 · 3/5 · 5/5 | 4/5 |
| E5 | pe | 3/5 · 4/5 · 5/5 | 2/5 |
| E6 | g8 | 4/5 · 1/1 · 1/1 | 3/3 |
| E6 | p1 | — · 2/2 · 2/2 | 1/2 («¿…a una hoja de cálculo, a otro script o a otra cosa?») |
| K | todos | — | 51/56 sin relanzar |

En verde: `g1`, `rq`, `g9`, `g2`, `p2` en todas sus filas; `m2` 3/3, `e1` 2/2. `n4` S2 falla (una pregunta doble).

## Batería de forma

C1 de `g7` pasa (`g7-1`), y R7 y R9. Fallan R4 y R10 de `g7-1` y B1 de `sk-1` (el control con el núcleo de antes también falla B1 en `sk-1`).

## Causa en el texto

E6 de `p1` y E0 de `g3` (y quizá `p3`) vienen del mismo sitio: al bajar a `spec-writing.md` la frase del porqué, se reescribió y perdió su contraejemplo literal, «open, «what will you do with it?», not «a spreadsheet, a colleague, a backup?»». `p1-1` pregunta justo ese menú. E5 y E0 de `pe` caen dentro de lo que da el mismo núcleo de antes en sus tres tandas (3/5 a 5/5): con n = 5 la batería no separa ahí el núcleo de antes del aligerado.
