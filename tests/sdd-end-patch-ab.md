# Evidencia A/B — `sdd-end-patch` (2026-09-08) · **sin corte que probar**

Ola 3 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). sdd-end-patch tiene **392 palabras**. Se examinó bloque a bloque contra el criterio de `architecture.md` §"Anatomía de una skill del kit" punto 6 — **(a)** aplica a un subconjunto de invocaciones y **(b)** se necesita después de decidir, no para decidir — y **ningún bloque cumple las dos**. No se corre A/B: el Art. I exige test para un cambio, y aquí no hay cambio que probar.

## Bloques examinados

| Bloque | (a) | (b) | Veredicto |
| --- | --- | --- | --- |
| Checklist de 6 pasos | Los pasos 3 y 5 son condicionales (`changelog.md`, `estimation.md`) | No: cada paso ocupa una línea; no hay detalle que separar del enunciado | No baja |
| Red flags y racionalizaciones (3 filas) | — | — | Se quedan |

## Conclusión

Es la segunda skill más corta del kit. Sus pasos condicionales cumplirían (a), pero no (b): no hay detalle debajo del enunciado que se pueda mover — el enunciado *es* el detalle. Partirla produciría un `references/` de dos líneas y un `SKILL.md` igual de largo, que es la forma de gastar un salto de lectura sin ganar nada.
