# Evidencia GREEN — restricciones globales en `plan-template` (2026-09-07)

Mismo escenario que [`plan-template-restricciones-red.md`](plan-template-restricciones-red.md), con `plan-template.md` **modificado** (commit `f8e07f7`: bloque "Restricciones globales" tras `**Spec**`, con la receta "copia literal de la spec, una línea por restricción, más los artículos de la constitution que aplican"). Prompt idéntico palabra por palabra, copia fresca del molde con la spec aprobada (`bookline-g3`, rama `feature/0000`), un subagente Sonnet, plantilla pegada por prompt desde el working tree.

## Qué hizo — verificado en disco

`plan.md` de 157 líneas, calcado de la plantilla. `src/` y `tests/` intactos; solo `plan.md` sin trackear.

| Restricción de §7.2 | RED (E3) | GREEN (G3) — bloque "Restricciones globales" |
| --- | --- | --- |
| `Node >= 20`, sin APIs posteriores | ⚠️ pasiva, solo en Tech Stack | ✅ «Node **>= 20** (`package.json` `engines`); no usar APIs posteriores.» |
| Estados exactos, `isValidStatus` reutilizado | ✅ | ✅ «Los estados válidos son exactamente `pending \| paid \| shipped`; la validación reutiliza `isValidStatus`, no se duplica la lista.» |
| Prefijo `order-` | ✅ | ✅ «Ficheros nuevos, si los hay, con prefijo `order-` en `src/` y `tests/`.» |
| Mensaje literal `invalid status: <valor>` | ✅ | ✅ «El mensaje de error es exactamente `invalid status: <valor>`.» |
| Artículos de la constitution | dispersos en Phase -1 | ✅ Arts. II, III, IV y V como líneas propias del bloque |

Las cuatro restricciones son copia literal de la spec (mismo valor, misma redacción) y el self-review las cita por sección. En el código del Step 3 aparece `throw new Error(\`invalid status: ${status}\`)` y el `require` de `isValidStatus`, como en el RED.

## Veredicto contra el fallo del RED

- **F1 (una restricción llega por arrastre, sin contraste con la spec)** → **corregido**: 4/4 en el bloque, literales, con la que faltaba en primera posición. La receta hace el trabajo que en el RED dependía de que el agente recorriera la sección por su cuenta.

## Diferencias de método respecto al RED (no afectan al veredicto)

- G3 **no invocó `superpowers:writing-plans`** («la petición ya traía spec aprobada + plantilla exacta a calcar»); en su lugar invocó `sdd-kit:sdd-templates` y leyó la plantilla canónica del kit para comprobar que coincidía con la pegada. El bloque se rellenó igual: es la plantilla la que lo exige, no la skill de superpowers.
- G3 pidió al usuario que revisara las cifras de estimación al no existir `estimation-log.md` en la fixture. Conducta correcta; sin relación con el bloque.

## Pendiente para T3

Un plan de una sola task no ejercita el caso en que el bloque importa de verdad: ejecutores que solo ven su task. T3 (ejecución por subagentes) debe re-testar con un plan multi-task y comprobar que las restricciones del bloque llegan a cada `task-brief`.
