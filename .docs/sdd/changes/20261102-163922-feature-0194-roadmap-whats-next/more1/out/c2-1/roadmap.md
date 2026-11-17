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
| Rutas de más de 260 (o 140) caracteres bajo el scratchpad fallan o descartan en silencio: `cp` da `ENOENT` al copiar el molde ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)); el lanzador descarta las salidas de `DRY_RUN=1` ([ticket](../../docs/tickets/2026-10-05-salidas.md)) | Medio | **Actuar** → sin fila · causa: entorno de la máquina · remedio: lanzar desde `D:` · arreglo: comprobación automática (avisar de la ruta larga antes de copiar o escribir) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
