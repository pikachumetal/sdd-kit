# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: comprobar la longitud de la ruta de la raíz de trabajo antes de lanzar y fallar con un mensaje claro | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Rutas largas bajo el scratchpad de la sesión rompen sin avisar: `cp` da `ENOENT` con destino > 260 ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)) y `out_path` descarta rutas ≥ 140 ([ticket](../../docs/tickets/2026-10-05-salidas.md)) | Medio | **Actuar** → 0008 · causa: prueba o molde · arreglo: comprobación automática · remedio: lanzar desde una raíz corta (`D:\r`) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
