# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Bajar el gate de 40 min (medido al cerrar el patch 0007): `test/store.test.js` 31 min 40 s (79 %), `test/report.test.js` 8 min 12 s (20 %), `test/app.test.js` 1,2 s. Empezar midiendo por qué tardan esos dos ficheros (`.temp/gate-times.log` no se versiona: estas son las medidas); objetivo y solución, al arrancarla | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
