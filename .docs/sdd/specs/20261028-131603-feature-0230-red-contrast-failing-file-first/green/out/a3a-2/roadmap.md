# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0010 | **Motivo al cancelar**: al cancelar una reserva se elige un motivo de una lista, y el listado de canceladas lo enseña | ✅ |
| 0011 | **Anular reservas de otros**: solo el responsable de cada sala anula reservas de otras personas | ⏳ |
| 0012 | **Informe de canceladas**: `informe` lista las reservas canceladas por sala, con su motivo y el total | ⏳ |
| 0013 | **Precio en su módulo**: el cálculo del precio sale de `app.js` sin cambiar lo que responde `precio` | ⏳ |
| 0014 | **Motivo guardado**: el motivo de una cancelación se guarda en el almacén de reservas | ⏳ |
| 1 | Avisos por correo antes de la reserva | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Tests inestables: `bookings:test` salió en rojo una vez (`5 passed, 1 failed`) al cerrar la 0010 y no se repite (0 fallos en 46 ejecuciones y 3 pasadas del gate; base en verde). No se capturó el test ni su línea de error | Bajo | Si vuelve, guardar la salida del test y abrir patch. Origen: Feature 0010, 2026-10-28, [walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) |
| Workaround `node --test --test-concurrency=1` declarado como ruling de la Task 2 de la 0010 y no aplicado en `gate.json`; la carrera sobre el almacén en memoria no consta | Bajo | Aislar el almacén por test, o quitar el ruling si no hay carrera. Origen: [tasks.md](specs/20261008-100000-feature-0010-cancel-reason/tasks.md) |
| `scripts/gate.mjs` imprime solo recuentos: un rojo pierde el test que falló y su error | Medio | Que el gate vuelque la salida de la tarea a un fichero o la imprima si falla. Origen: Feature 0010, 2026-10-28 |
| `canceladas` solo se prueba encadenado tras `cancelar` en `test/cancel.test.js`, y «sin `--motivo`» no tiene test propio | Bajo | Test independiente por THEN. Origen: Feature 0010, 2026-10-28 |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
