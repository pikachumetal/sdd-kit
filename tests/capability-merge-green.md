# GREEN — la fusión del delta de capacidades (feature 0124)

Mismos escenarios y molde que el [RED](capability-merge-red.md), con el kit de la rama (`Merge-CapabilityDelta.ps1`, el validador de la Task 1 y la guía nueva en el paso 4 de `sdd-end-feature`, `aprendizajes-skills.md`, el paso 1 de `sdd-end-patch` y el paso 7 de `sdd-start-feature`), 2026-10-01. Salidas en [`green/out/`](../.docs/sdd/specs/20261001-130008-feature-0124-capability-delta-merge/green/out/). Gastado en el GREEN: 5 sujetos, 0,82 $, ~6 min. Campaña entera: 10 sujetos de 13, 1,68 $ de 7 $ de techo, sin tanda de REFACTOR.

## Fallos del RED

| Fallo | RED | GREEN |
| --- | --- | --- |
| `- Se valida en:` en la capacidad viva (`f1`, `p1`) | 3 de 3 | 0 de 3 |
| Cita «por la decisión 1» en la capacidad viva (`f1`) | 2 de 2 | 0 de 2 |
| Fusión a mano (`Write` o `Edit` de la capacidad) | 3 de 3 | 0 de 3: los tres con `Merge-CapabilityDelta.ps1` |
| Validador de la rama sobre el resultado | 3 fallos | 3 de 3 `Capacidades válidas: 1` |

En `f1`, el script rechazó la primera ejecución con `spec.md: «Cancelar una reserva» cita la spec («decisión 1»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`. Los dos sujetos editaron la spec, no la capacidad («al momento, sin esperas»; «al momento, sin esperar a ningún proceso posterior»), y volvieron a ejecutarlo. El caso de campo de la 0035, que limpió la capacidad y chocó con el validador, no se repite.

## Filas de control (lo que el RED ya cumplía)

| Conducta | RED | GREEN |
| --- | --- | --- |
| `MODIFIED` aplicado sin la segunda línea del `(antes: …)` suelta | 3 de 3 | 3 de 3 |
| `REMOVED` sin su `- motivo:` | 2 de 2 | 2 de 2 |
| Línea en blanco tras cada título, ninguna doble | 3 de 3 | 3 de 3 |
| `Test-Capabilities.ps1 -Artifact` antes de dar el paso por hecho | 3 de 3 | 3 de 3 |
| Solo el paso pedido, sin commit | 3 de 3 | 3 de 3 |
| `t1`: ningún THEN o AND cita «decisión N» | 0 de 2 lo citan | 0 de 2 lo citan |

`t1` se repite como control de no regresión: su guía no se escribió, porque el baseline salió limpio (Art. I; decisión 13 de la spec). Los dos sujetos del GREEN volvieron a escribir los valores (`No es tu reserva`, una hora de antelación) en vez de la referencia.
