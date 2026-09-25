# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0014 | Exportar reservas a CSV (`salas exportar <mes>`); proposal: 0017 | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 0015 | Email a los asistentes al cancelar una reserva; proposal: 0017 | ⏳ |
| 0016 | Franja mínima de 30 minutos; proposal: 0017 | ⏳ |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏸️ aparcada: descartada por Acme, 2026-09-25 (proposal: 0017) |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| — | Recordatorio el día antes de una reserva | equipo de oficina |
| — | Reservas recurrentes (cada lunes) | equipo de oficina |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `src/slots.js` no tiene tests de franjas límite (`00-24`) | bajo | task |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-12 | 0011 | `informe` contaba dos veces las reservas canceladas |

## Releases cerradas

### v1.2.0 — 2026-09-10
Informe de uso por sala.
