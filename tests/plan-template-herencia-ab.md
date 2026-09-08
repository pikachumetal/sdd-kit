# Evidencia — herencia de las "Restricciones globales" del plan (2026-09-08)

Residual de T1 (`alineacion-superpowers`): el bloque "Restricciones globales" de `plan-template` se escribió calcando el `Global Constraints` de `writing-plans` 6.3.0, cuya premisa es que *toda task lo incluye implícitamente*. Quedó pendiente re-testarlo con un plan multi-task y ejecutores que solo ven su task. Cerrado en la task [workflow-ejecucion](../.docs/sdd/specs/20260908-095857-task-0000-workflow-ejecucion/spec.md) (T3).

## Montaje

Fixture "Cobra" con `plan.md` de 3 tasks. Las restricciones globales se enuncian **una vez**, ninguna task las repite. Dos versiones del bloque, porque la primera no discriminaba:

| Versión | Restricción probada | ¿Inferible del código existente? | Resultado |
| --- | --- | --- | --- |
| 1 (`r4`) | "importes en céntimos, como entero" | **Sí**: `withSurcharge` ya opera en milésimas sobre céntimos | Cumplida — *por imitación*: *"con el mismo estilo aritmético que la función hermana `withSurcharge`"*. **Escenario descartado**: no distingue herencia de imitación |
| 2 (`r4b`, `r4c`) | "toda función nueva lleva JSDoc en castellano con `@param` y `@returns`; el código antiguo no lo lleva" | **No**: 0 bloques JSDoc en el fichero | **Incumplida 2/2**: 0 bloques JSDoc |

En la versión 2 el ejecutor recibió **solo el texto de su Task 2** por prompt, con el `plan.md` borrado de su copia.

## Resultado

**La premisa de `writing-plans` no se cumple: el ejecutor que solo ve su task no hereda nada.** No por desobedecer — nunca leyó la sección.

Y **superpowers ya lo sabe a medias**: `subagent-driven-development/SKILL.md:270-271` dice que un subagente necesita *"su task, las interfaces que toca y las restricciones globales"*, pero su `scripts/task-brief` extrae solo el texto de la task (un `awk` sobre `^#+ Task N`) y su receta de composición del dispatch (líneas 255-262) enumera cinco elementos sin las restricciones. La regla existe en prosa; el punto de uso no la recoge.

## Decisión

Tres salidas se presentaron al dev-lead, que delegó la elección:

- **A** — repetir los campos en cada task. Arregla `Modelo` y `Ejecución` (caben en una línea) y deja fuera el resto (JSDoc, dependencias, naming), además de crear copias que divergen (lección del Art. VIII).
- **B** — quien despacha entrega las restricciones. Una sola fuente; cubre todas las restricciones; ataca la causa (no llegaban) y no el síntoma.
- **C** — ambas.

**Elegida B**, escrita en `sdd-start-task` paso 6 (*"incluye en el encargo del subagente el bloque «Restricciones globales» del plan íntegro: el ejecutor solo ve su task y NO hereda lo que no se le entrega"*) y avisada en el propio `plan-template` (*"⚠️ Una task NO hereda esta sección por su cuenta"*). Es la regla 3 del Art. IX: extender superpowers ante un hueco demostrado, documentando el hueco.

## Estado de la verificación

- **RED**: reproducido 2/2 con restricción no inferible.
- **GREEN parcial**: `g1a` y `g1b` (skill nueva) pusieron **3/3 JSDoc** — pero vieron el plan entero porque el harness no permite a un subagente de workflow despachar subagentes. Mide "el orquestador aplica las restricciones", no "el orquestador las entrega al aislado".
- **GREEN del traspaso: 2/2 por dogfooding** (`dog1`, `dog2`, 2026-09-08): con el bloque en el encargo, el ejecutor aislado puso el JSDoc que sin él no ponía (ver [`workflow-ejecucion-green.md`](workflow-ejecucion-green.md)). La opción **C** (campos repetidos *y* traspaso) queda descartada: B basta.
