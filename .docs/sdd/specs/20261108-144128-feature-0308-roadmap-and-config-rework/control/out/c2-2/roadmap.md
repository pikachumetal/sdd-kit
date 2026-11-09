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
| Las rutas de más de 140–260 caracteres bajo el scratchpad de una sesión fallan o descartan en silencio: `out_path` descarta las salidas de `DRY_RUN=1` ([ticket](../../docs/tickets/2026-10-05-salidas.md)) y `cp` del molde da `ENOENT` ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)) | Medio | **Actuar** → sin fila · causa: entorno de la máquina · arreglo: comprobación automática · remedio: colgar `RUNS_DIR` y la copia del molde de la raíz corta D:/r |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
