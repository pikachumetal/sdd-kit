# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: comprobar la longitud de la ruta raíz de las ejecuciones antes de lanzar o copiar (falla con un aviso claro si el destino se acerca al límite) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Rutas largas bajo el scratchpad rompen en silencio: `DRY_RUN=1` deja `out/` vacía (`out_path` descarta rutas de 140 o más) y la copia del molde falla con `ENOENT` (destino de más de 260) ([ticket](../../docs/tickets/2026-10-05-salidas.md), [ticket](../../docs/tickets/2026-10-20-copia-molde.md)) | Medio | **Actuar** → 0008 · causa: entorno de la máquina · arreglo: comprobación automática · remedio: lanzar y copiar desde un directorio corto (`D:\r`) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
