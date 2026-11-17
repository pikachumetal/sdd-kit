# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: avisar cuando una ruta de trabajo bajo el scratchpad pasa del límite (140 en `out_path`, 260 en la copia del molde) en vez de fallar en silencio | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Las rutas largas bajo el scratchpad de una sesión fallan sin avisar: `out_path` descarta en silencio las de 140 caracteres o más, y las salidas de `DRY_RUN=1` no aparecen en `out/` ([ticket](../../docs/tickets/2026-10-05-salidas.md)); `cp` del molde da `ENOENT` por encima de 260 ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)) | Medio: 25 y 40 minutos perdidos | **Actuar** → 0008 · causa: entorno de la máquina · arreglo: comprobación automática · remedio: lanzar desde una raíz corta (`D:\r`) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
