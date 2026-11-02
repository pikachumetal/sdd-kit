# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 2 | 0008 Patch: comprobar la longitud de ruta (destino de la copia, `RUNS_DIR`) y fallar con mensaje claro | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Rutas largas bajo el scratchpad de la sesión fallan sin avisar: `cp` del molde da `ENOENT` (>260, [ticket](../../docs/tickets/2026-10-20-copia-molde.md)) y `out_path` descarta salidas de `DRY_RUN=1` (≥140, [ticket](../../docs/tickets/2026-10-05-salidas.md)) | Medio | **Actuar** → 0008 · causa: entorno de la máquina · arreglo: comprobación automática · remedio: trabajar desde una ruta corta (`D:\r`) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
