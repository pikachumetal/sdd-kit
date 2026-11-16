# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: fallar en voz alta cuando una ruta de salida o de copia pasa del límite de la plataforma (`out_path` del lanzador descarta en silencio las de 140 o más; `cp` del molde da `ENOENT` por encima de 260) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Rutas largas bajo el scratchpad de la sesión fallan en silencio: salidas de `DRY_RUN=1` ausentes en `out/` ([ticket](../../docs/tickets/2026-10-05-salidas.md)) y `cp` del molde con `ENOENT` ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)) | Medio | **Actuar** → 0008 · causa: entorno de la máquina · arreglo: comprobación automática · remedio: lanzar desde una raíz corta, `D:\r` |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
