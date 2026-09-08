# Evidencia A/B — `sdd-templates` (2026-09-08) · **sin corte que probar**

Ola 3 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). sdd-templates tiene **355 palabras**. Se examinó bloque a bloque contra el criterio de `architecture.md` §"Anatomía de una skill del kit" punto 6 — **(a)** aplica a un subconjunto de invocaciones y **(b)** se necesita después de decidir, no para decidir — y **ningún bloque cumple las dos**. No se corre A/B: el Art. I exige test para un cambio, y aquí no hay cambio que probar.

## Bloques examinados

| Bloque | (a) | (b) | Veredicto |
| --- | --- | --- | --- |
| Tabla de plantillas (9 filas: plantilla → artefacto → cuándo) | No: es el índice que se consulta siempre | No: elegir plantilla es la decisión | No baja |
| Reglas de calco y nota de modo lite | No | No: gobiernan cómo se usa la plantilla elegida, en toda invocación | No baja |

## Conclusión

**`sdd-templates` ya ES progressive disclosure, y desde antes de esta campaña.** Su `SKILL.md` es un índice de 355 palabras que enlaza a nueve ficheros en `templates/`, que es donde vive el contenido voluminoso y que solo se lee cuando hace falta esa plantilla concreta. Es el patrón que esta task ha ido aplicando a las demás, aquí implementado desde el principio.

## Hueco preexistente, declarado

Esta skill no tiene `tests/sdd-templates-green.md` propio: su evidencia vive en [`templates-single-source-green.md`](templates-single-source-green.md), que valida el Art. VIII (fuente única) y no la skill en sí. Queda anotado como hueco del método, no como consecuencia de esta campaña. Al no haber corte que probar, no se redactaron escenarios nuevos.
