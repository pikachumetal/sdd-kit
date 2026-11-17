# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0009 | Persistir las reservas en un fichero JSON (proposal: 0008) | ⏳ |
| 0010 | Informe de ocupación por sala, `salas informe` (proposal: 0008; tras 0009) | ⏳ |
| 0011 | Exportar el informe a Excel, `--excel` (proposal: 0008; tras 0010) | ⏳ |
| 0012 | Aviso semanal de ocupación a los responsables de sala (proposal: 0008; tras 0010, tras 1) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
