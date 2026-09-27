# GREEN — formato de las capacidades (task 0070)

Kit de la rama tras la Task 3 (`git archive` del commit provisional `16ba9dc`), mismos sujetos headless Sonnet y molde `salas` que el [RED](capability-format-red.md), migrado a 2.0.0: las capacidades del molde no tienen `## Historial`. Lanzador y salidas: [green/](../.docs/sdd/specs/20260925-081130-task-0070-openspec-capabilities/green/). 7 sujetos, 2,60 $; la campaña entera, 15 sujetos y 5,92 $, dentro del techo común (`SUBJECT_CAP=17`, `COST_CAP=16`).

## Escenarios

| Id | Qué mide | Molde |
| --- | --- | --- |
| c | Spec nueva de la 0021 (cancelar una reserva): bloque «Capacidades» y nombre de la capacidad | `task_cancel_start` |
| m | Cierre de la 0020, cuyo `MODIFIED` es anterior al patch 0014, sin `(antes:)` y con validación neutra; la spec ya trae su bloque | `task_sorted_behind_patch` con `NO_BEFORE=1` |
| p1 | Cierre del patch 0014, que cambia lo que lista `libres`; el `patch.md` trae el bloque y la §6 vacíos de la plantilla | `patch_maintenance` con `SECTION6=1` |
| p2 | Cierre del patch 0013, que devuelve `reservar` a lo que ya decía `bookings`; mismo `patch.md` calcado | `patch_limit` con `SECTION6=1` |

## Veredictos

| Conducta | Resultado | Evidencia |
| --- | --- | --- |
| La spec abre con el bloque «Capacidades», con `Modificadas: \`bookings\`` y su subsección en el delta | 2/2 | `c-1`, `c-2`: el bloque abre la spec, tras el título (línea 20) |
| El patch con delta declara `Modificadas: \`bookings\` — cambia «Consultar salas libres»` y fusiona el `MODIFIED` | 2/2 | `p1-1`, `p1-2` |
| El patch sin delta escribe «Ninguna, porque el fix devuelve…», borra la §6 vacía y no toca `bookings.md` | 1/1 | `p2-1`: «Ninguna, porque el fix devuelve `salas reservar` a lo que ya dice `bookings`…»; diff de `capabilities/` vacío |
| Los cierres ejecutan `Test-Capabilities.ps1` con `-Artifact` tras fusionar | 5/5 | invocaciones en `tools.txt`: `m-1` 2 (la primera se colgó a los 120 s y la repitió), `m-2` 1, `p1-1` 2, `p1-2` 1, `p2-1` 1 |
| El validador pasa sobre el estado final | 7/7 | sección «validador sobre el estado final» de cada `state.txt`: `Capacidades válidas: 1` |
| Sin línea de historial al fusionar | 5/5 | ningún `+- 2026-…` en el diff de `capabilities/` |

## Controles (lo que el RED ya cumplía en los pasos tocados)

| Conducta | RED | GREEN |
| --- | --- | --- |
| Reutiliza el nombre exacto `bookings`, sin fichero nuevo | 2/2 | 2/2 (`c-1`, `c-2`) |
| La regla que cambia va con su valor completo (el aviso vigente más el nuevo) | 2/2 | 2/2: `**Avisos**` con `Máximo 2 h por reserva` y el aviso de cancelar |
| Conserva `Oeste (en mantenimiento)` al fusionar el `MODIFIED` anterior al patch | 6/6 | 2/2 (`m-1`, `m-2`) |
| `MODIFIED` del patch en bloque entero, con datos | 2/2 (0067) | 2/2 (`p1-1`, `p1-2`) |
| La salida corta del patch deja la capacidad sin tocar | 2/2 (0067) | 1/1 (`p2-1`) |

`m-2` y `p1-2` reescribieron `bookings.md` entero con otro fin de línea; el contenido es el correcto y el validador pasa. Es ruido del molde (sin `.gitattributes`), no conducta.

## Sin sujeto

- El volcado de `sdd-init-greenfield` pierde la línea de historial: ninguna fuente lo pide ya (ni la skill ni la plantilla); lo vigila `CapabilitiesAtBirth.Tests.ps1`.

## Control tras la revisión final

La revisión final cambió `sdd-end-task` paso 4 y `sdd-end-patch` paso 1: un fallo del validador en una capacidad que el delta no toca no bloquea el cierre. Un sujeto por escenario afectado (Art. I), con `BROKEN_OTHER=1`: la base trae `capabilities/rooms.md` con «Poner una sala en mantenimiento» sin `- THEN`. Salidas en [refactor/](../.docs/sdd/specs/20260925-081130-task-0070-openspec-capabilities/refactor/). 2 sujetos, 0,66 $; campaña total, 17 sujetos y 6,58 $.

| Conducta | Resultado | Evidencia |
| --- | --- | --- |
| No edita `rooms.md` y lo da como pendiente del dev-lead | 2/2 | `m-3`, `p1-3`: `rooms.md` fuera de «ficheros tocados»; «El delta no toca esa capacidad, así que no la edité; queda pendiente del dev-lead» |
| Control: la fusión de `bookings` sigue bien (cláusula del 0014 conservada, `MODIFIED` en bloque entero) | 2/2 | diff de `capabilities/` de `m-3` y `p1-3` |
