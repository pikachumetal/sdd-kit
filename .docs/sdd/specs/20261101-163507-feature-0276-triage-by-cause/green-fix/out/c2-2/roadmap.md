# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Comprobar la longitud de la ruta antes de escribir o copiar (lanzador y copia del molde): fallar con un error claro en vez de descartar en silencio o dar `ENOENT` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Rutas largas bajo el scratchpad de una sesión fallan: `DRY_RUN=1` deja `out/` vacía sin error por una ruta de 152 ([ticket](../../docs/tickets/2026-10-05-salidas.md)) y `cp` del molde da `ENOENT` por una ruta de más de 260 ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)) | Medio | **Actuar** → 0008 · causa: entorno de la máquina · arreglo: comprobación automática · remedio: `RUNS_DIR` o copia en una ruta corta (`D:\r`) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
