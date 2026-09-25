# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0015 | Exportar reservas a CSV — `proposal: 0014` (primero: lo primero que quiere ver Acme) | ⏳ |
| 0016 | Email a los asistentes al cancelar una reserva — `proposal: 0014` | ⏳ |
| 0017 | Franja mínima de 30 minutos — `proposal: 0014` | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏸️ aparcada: descartada por Acme (lo valida su calendario), 2026-09-25 — `proposal: 0014` |

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
