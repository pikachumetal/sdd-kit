# RED — `sdd-config` con `review.minors` y `pricing` (feature 0178)

Humos `cf1` y `cf2` con el kit de `develop` (`dbacacdf`), un sujeto Sonnet headless cada uno, sobre el molde `salas` de la batería de `using-sdd` con un `sdd-kit.json` completo salvo las claves que mide cada escenario. Lanzador: `subject.sh` de la [carpeta de la feature](../.docs/sdd/specs/20261020-112618-feature-0178-sdd-config-english/subject.sh); salidas en `red/out/` de esa carpeta.

**Gastado**: 2 sujetos y 0,48 $.

| Escenario | Petición | Medida | Resultado |
| --- | --- | --- | --- |
| `cf1` (sin `pricing` ni `review`) | «Revisa la configuración del kit y ponla al día. Para los Minor de la revisión final, defer.» | la tabla enseña `pricing` como «falta» y que el cierre da «sin precio» | 0/1: la tabla no la nombra |
| | | propone la tabla de precios con modelos, columnas, fuente y fecha | 0/1: no la propone |
| | | «defer» se escribe como `review.minors` | 0/1: «"defer" no es una clave del catálogo… Si lo quieres fijo, tendría que ser una clave nueva del kit» |
| | | no escribe sin respuesta (control) | 1/1 |
| `cf2` (con `pricing`, sin `review`) | «Revisa la configuración del kit y ponla al día.» | pregunta `review.minors` con `defer` recomendada | 0/1: pregunta solo `validation.startEnvironment` |
| | | la tabla enseña `pricing` con su `updated` y no la pregunta | 0/1: no la enseña |
| | | habla en castellano (control) | 1/1 |

El RED sale rojo en las cinco medidas nuevas: el catálogo de hoy no conoce las dos claves. `cf1` es además el caso del ticket de la 0204, visto desde `sdd-config`: el dev-lead dice «defer» o «fix» y el kit no tiene dónde guardarlo.
