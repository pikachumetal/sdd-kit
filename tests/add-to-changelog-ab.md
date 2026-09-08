# Evidencia A/B — `add-to-changelog` (2026-09-08) · **sin corte que probar**

Ola 3 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). add-to-changelog tiene **404 palabras**. Se examinó bloque a bloque contra el criterio de `architecture.md` §"Anatomía de una skill del kit" punto 6 — **(a)** aplica a un subconjunto de invocaciones y **(b)** se necesita después de decidir, no para decidir — y **ningún bloque cumple las dos**. No se corre A/B: el Art. I exige test para un cambio, y aquí no hay cambio que probar.

## Bloques examinados

| Bloque | (a) | (b) | Veredicto |
| --- | --- | --- | --- |
| Formato de entrada (contrato) | No: se usa en toda invocación | No: es el output que la skill produce | No baja |
| Tabla "Dónde va" (Added / Changed / Deprecated / Removed / Fixed / Security) | No | **No**: es la decisión misma — clasificar el cambio es para lo que se invoca la skill | No baja |
| Tabla "Errores comunes" (5 filas) | — | — | Se queda: es la tabla de racionalizaciones de esta skill |

## Conclusión

Toda la skill es la decisión (qué categoría) más el contrato (qué forma tiene la entrada). No hay detalle posterior a la decisión: cuando terminas de decidir, la skill ya ha hecho su trabajo.
