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
| Las salidas de `DRY_RUN=1` no aparecen en `out/` ([ticket](../../docs/tickets/2026-10-05-salidas.md)) y la copia del molde falla con `ENOENT` ([ticket](../../docs/tickets/2026-10-20-copia-molde.md)): con la raíz de ejecución bajo el scratchpad de una sesión la ruta pasa del límite (140 en `out_path`, 260 en Windows) y falla en silencio o sin pista | Medio | **Actuar** → sin fila · causa: entorno de la máquina · arreglo: comprobación automática · remedio: lanzar desde una raíz corta (`D:\r`) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
