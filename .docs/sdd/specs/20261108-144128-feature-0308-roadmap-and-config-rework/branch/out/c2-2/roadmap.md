# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: comprobar antes de lanzar que la ruta de trabajo (scratchpad) no supera los límites de ruta (140 del lanzador, 260 de Windows) y fallar en voz alta; solución por confirmar | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Rutas largas bajo el scratchpad fallan sin avisar: `out_path` descarta salidas de 140 o más caracteres ([ticket](../../docs/tickets/2026-10-05-salidas.md)) y `cp` da `ENOENT` con destino de más de 260 ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)) | Medio | **Actuar** → 0008 · causa: entorno de la máquina · arreglo: comprobación automática |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
