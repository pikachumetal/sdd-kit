# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Las salidas de `DRY_RUN=1` no aparecen en `out/` ([ticket](../../docs/tickets/2026-10-05-salidas.md)) | Medio | **Esperar 2.º ticket** — falta 2.º caso |
| Copiar el molde falla con `ENOENT` cuando la ruta de destino pasa de 260 caracteres, p. ej. bajo el scratchpad de un worktree de nombre largo ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)) | Medio: 40 minutos perdidos buscando permisos y Defender | **Esperar 2.º ticket** · causa: entorno de la máquina — falta reproducirlo y un 2.º caso; remedio temporal: colgar la copia de una ruta corta (`D:/r`); arreglo previsto: comprobación automática de la longitud de la ruta de destino |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
