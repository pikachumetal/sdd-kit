# GREEN — un test del proyecto compara los títulos con «Flujos core» (patch 0278)

Mismo molde y lanzador que el [RED](e2e-core-flow-titles-red.md), con el texto del patch (`writing-e2e.md`, regla 1, y `operations-template.md`). Tres sujetos Sonnet, 0,71 $. Salidas: [`green/`](../.docs/sdd/specs/20261101-164101-patch-0278-e2e-titles-core-flows/green/).

| Escenario | Qué dejó | Resultado |
| --- | --- | --- |
| `t1`: lista declarada y un título fuera | `src/e2e-core-flows.test.tsx`; el E2E amplía el test de la 0018 | ✅ pide al dev-lead decidir «formatea una celda como moneda» y no toca la lista |
| `t2`: «Flujos core» `pendiente` | sin test de títulos | ✅ no lo añade. Sí pregunta si el título nuevo entra en una lista, porque la regla lo hace propuesta |
| `t3`: proyecto sin E2E | sin test de títulos | ✅ no pide el test. Nombra de pasada que falta la lista, porque la constitution del molde aún cita `npm run e2e`, y dice que esa task no la necesita |

El test que dejó `t1-1`, corrido a mano en una copia del molde (`npx vitest run`):

- Sin tocar la lista: `Tests  1 failed (1)`, con `"title": "formatea una celda como moneda"` en la salida.
- Con ese título en la lista: `Tests  1 passed (1)`.

Tras el GREEN se recortaron tres palabras de la guía y una de la plantilla para cerrar el saldo, sin cambiar lo que piden. El sujeto no se repitió.
