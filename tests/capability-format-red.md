# RED — formato de las capacidades (task 0070)

Baseline con el kit de `develop` a 2026-09-25 (`bb11f59`), antes de la spec. Sujetos headless Sonnet sobre el repo de juguete `salas`, molde de la task 0067 más `mold-0070.sh`. Molde, lanzador y salidas: [red/](../.docs/sdd/specs/20260925-081130-task-0070-openspec-capabilities/red/). 8 sujetos, 3,32 $.

Previsión común con el GREEN, declarada antes del primer sujeto: RED 4 sujetos, GREEN 7, REFACTOR 4, `SUBJECT_CAP=15` y `COST_CAP=16`. Ampliada a 17 sujetos con la tanda sin `(antes:)`, que aprobó el dev-lead.

## Escenarios

| Id | Qué mide | Petición |
| --- | --- | --- |
| c | Nombre de capacidad al escribir una spec: la fila 0021 habla de «Cancelar una reserva» y existe `capabilities/bookings.md` | `sdd-start-task` de la 0021, lite, spec aprobada por delegación, parar antes de implementar |
| m | Fusión de un `MODIFIED` cuyo requisito cambió en la base después de escribir la spec: la 0020 añade el orden alfabético a «Consultar salas libres» y el patch 0014, fusionado después, le añadió `AND lista aparte, al final, \`Oeste (en mantenimiento)\`` | `sdd-end-task` de la 0020, con `develop` ya integrado. La frase de validación nombraba `Oeste (en mantenimiento)` |
| n | Lo mismo que `m`, con una validación que no nombra el mantenimiento | `subject-n.sh`; `n-3` y `n-4` además sin el `(antes: …)` opcional del `MODIFIED` (`NO_BEFORE=1`) |

## Veredictos

| Conducta | Resultado | Evidencia |
| --- | --- | --- |
| Reutiliza el nombre exacto de la capacidad (`bookings`) | 2/2 | `c-1`, `c-2`: `### Capacidad: \`bookings\``, sin fichero nuevo en `capabilities/` |
| Conserva la cláusula que otra fusión añadió al requisito | 6/6 | `m-1`, `m-2`, `n-1`…`n-4`: el diff de `bookings.md` mantiene `Oeste (en mantenimiento)` y el texto final lo explica |
| Escribe línea en `## Historial` al fusionar | 6/6 | los seis cierres añaden `- 2026-09-25 — 20260925-070000-task-0020-libres-orden — MODIFIED Consultar salas libres` |
| Declara las capacidades en un bloque al principio | 0/2 | estructural: la plantilla no tiene el bloque |
| Valida la capacidad fusionada | 0/6 | estructural: no hay validador |

## De dónde sacaron la conducta

- `m-1` citó la frase de validación: «que es lo que el dev-lead probó». Por eso la tanda `n`, con una validación neutra.
- `n-1` y `n-2` la sacaron del `(antes: …)`, que ya no coincidía con la capacidad: «su «antes» ya no coincide con la capacidad». Por eso `n-3` y `n-4`, sin él.
- `n-3` y `n-4` la sacaron de leer `bookings.md` y el `patch.md` de la 0014: «el patch 0014 ya deja `Oeste` (en mantenimiento) aparte». En un repo de juguete los dos se leen a la primera; en campo (ticket 0068 §2) el agente lo vio al integrar.

## Consecuencias para la spec

- La pieza (4), fusionar un `MODIFIED` contra la base de la spec, no se escribe: pasa a deuda como **posible falso negativo**, con el disparador observable (un `MODIFIED` cuyo requisito cambió en la base después de escribirse la spec). Decisión del dev-lead: «Una tanda más sin «(antes:)»», cuya opción decía «si sale limpia, pasa a deuda».
- El ensayo del molde mostró que la propuesta del ticket no detectaría el caso: tras integrar `develop`, `git merge-base HEAD develop` es la punta de `develop` (`5f90f21` en el ensayo). La comparación que funciona es con la capacidad del commit que añadió la spec.
- El bloque «Capacidades» entra como forma, no como corrección: el nombre exacto sale 2/2 sin guía y el GREEN lo mide como control.
