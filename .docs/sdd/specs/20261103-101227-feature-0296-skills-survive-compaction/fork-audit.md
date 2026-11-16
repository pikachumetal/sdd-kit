# Auditoría de las copias del kit frente a sus fuentes (2026-11-03)

Pregunta: en las skills que copian texto de otro kit, ¿hay sitios donde el texto de la fuente y el del kit conviven sobre la misma regla y se contradicen, en vez de sustituirse?

## Método

- Fuente de cada copia, la versión que declara su `NOTICE`: superpowers 7.0.0 para `sdd-implement`, `sdd-tdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-verify`, `sdd-archive` y las `references/` de `sdd-propose`; mattpocock 1.2.3 para `sdd-rubber-duck` y 1.3.1 para `sdd-agent-writing`; `sdd-grilling` contra todas las versiones de mattpocock, porque su `NOTICE` no dice cuál.
- Por cada unidad de la copia (paso, viñeta, párrafo, fila de tabla, en `SKILL.md` y `references/`), la parte que sale literal de la fuente, por frases de 6 palabras. Las unidades entre el 20 % y el 95 % mezclan las dos, y se leyeron una a una junto al párrafo de la fuente.
- Las frases absolutas de la fuente que siguen literales («only», «never», «always», «every», «must»…) se cruzaron con las cláusulas de excepción del kit en la misma skill («not an exception», «except», «unless», «in the kit», «instead of»).
- Scripts: `audit.mjs`, `kept.mjs` y `provenance.mjs`, en el scratchpad de la sesión.

## Resultado por copia

| Copia | Texto de la fuente que sigue literal | Unidades mixtas | Hallazgos |
| --- | --- | --- | --- |
| `sdd-debugging` | 97 % | 7 | ninguno: rutas y renombres |
| `sdd-parallel-agents` | 96 % | 0 | ninguno |
| `sdd-tdd` | 93 % | 10 | 1 excepción pegada |
| `sdd-worktrees` | 93 % | 3 | ninguno |
| `sdd-verify` | 91 % y 45 % | 1 | 1 dudoso |
| `sdd-implement` | 73 % y 60 % | 40 | 1 contradicción, 1 excepción pegada, 1 texto quitado sin motivo |
| `sdd-archive` | 13 % | 7 | ninguno: las filas que cambian están sustituidas |
| `sdd-rubber-duck` | — | 1 | ninguno |
| `sdd-agent-writing` | — | 2 | ninguno |
| `sdd-propose` (`references/`) | 10 % | 16 | sin contradicciones; el texto es un resumen reescrito de `brainstorming` y `writing-plans`, no una copia |
| `sdd-grilling` | 0 % en todas las versiones | 0 | no es una copia: reescrita entera; su `NOTICE` no dice versión |

## Hallazgos

1. **Contradicción — `sdd-implement/SKILL.md:18`.** «Four things stop you, and only these: …» de superpowers, seguida de «The kit's own stops are a fifth class, not an exception to the four: a deviation…, a scope brake and, in `pair`, the stop after each task». En la 0147 (`4597d47e`) la frase era solo la del kit; `e7ddf254` (2026-10-13, ADR 0013) volvió a pegar la de superpowers delante. `SKILL.md:121` («Only the stops of the Overview stop you») hereda el choque.
2. **Excepción pegada — `sdd-implement/SKILL.md:200`.** «Scoped re-reviews of small fix diffs take a cheap-to-mid tier —except the single re-review of the final review, which `sdd-verify` sends with `sdd-kit:effort-high` + `opus`».
3. **Texto de la fuente quitado sin motivo visible — `sdd-implement/SKILL.md:303`.** «Rulings, not stalls» pierde «a cap you would have asked to exceed — decide them» de superpowers; ni la frase ni la tabla de la 0147 dicen por qué.
4. **Excepción pegada — `sdd-tdd/SKILL.md:125`.** «**Test passes?** You're testing existing behavior. Fix test.» de superpowers, seguida de «A test you received: report it (`DONE_WITH_CONCERNS` with the green output) and don't write code to «make it pass»». Un test recibido no se arregla (`SKILL.md:70`: es el contrato), y la regla de la fuente queda delante diciendo lo contrario.
5. **Dudoso — `sdd-verify/SKILL.md:243`.** La pasada de fix de la revisión final en Native dice «then run the whole suite» (de `executing-plans`), y `sdd-implement/SKILL.md:299` dice que la suite completa corre en la línea base y «once in the validation». La pasada de fix no es una task, así que puede ser compatible, pero el texto se lee de dos maneras.
6. **Copias que no son copias.** Las `references/` de `sdd-propose` resumen `brainstorming` y `writing-plans` (fila 0152, punto e, ya lo tiene como deuda), y `sdd-grilling` es una skill propia que solo toma la idea de `grilling`.

## Límites

- Una contradicción entre secciones distintas de una misma copia solo se buscó por las palabras de excepción del kit; no se leyó cada frase absoluta de la fuente contra todo el texto del kit.
- Las 11 skills sin fuente no entran: en ellas el riesgo es otro, parches del kit que se contradicen entre sí.
- «Limpia» quiere decir que no se encontró texto de la fuente y del kit conviviendo sobre la misma regla, no que la copia sea fiel en todo: una paráfrasis cuenta como texto del kit.
