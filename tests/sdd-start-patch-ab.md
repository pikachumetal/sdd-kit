# Evidencia A/B — `sdd-start-patch` (2026-09-08) · **sin corte que probar**

Ola 3 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). sdd-start-patch tiene **585 palabras**. Se examinó bloque a bloque contra el criterio de `architecture.md` §"Anatomía de una skill del kit" punto 6 — **(a)** aplica a un subconjunto de invocaciones y **(b)** se necesita después de decidir, no para decidir — y **ningún bloque cumple las dos**. No se corre A/B: el Art. I exige test para un cambio, y aquí no hay cambio que probar.

## Bloques examinados

| Bloque | (a) | (b) | Veredicto |
| --- | --- | --- | --- |
| "¿Es de verdad un patch?" (predicado de enrutado) | No: se evalúa en toda invocación | **No**: es justo lo que decide si la skill aplica o hay que irse a `sdd-start-task` | No baja |
| Flujo de 6 pasos | No | No: cada paso es una línea con su instrucción; no hay detalle separable | No baja |
| Red flags y tabla de racionalizaciones | — | — | Se quedan por hipótesis previa (caso "Why Order Matters" de superpowers) |

## Conclusión

585 palabras es su tamaño justificado. El predicado de entrada es el corazón de la skill —enrutar un bug a patch o a task— y bajarlo repetiría el error que el A/B de [`sdd-consult`](sdd-consult-ab.md) hizo visible: mover la definición del carril fuera del punto donde se decide.
