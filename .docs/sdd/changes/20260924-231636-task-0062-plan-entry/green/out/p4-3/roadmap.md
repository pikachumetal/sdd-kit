# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0015 | Exportar reservas a CSV — lo primero que quiere ver Acme · proposal: 0014 | ⏳ |
| 0016 | Franja mínima de 30 minutos · proposal: 0014 | ⏳ |
| 0017 | Email a los asistentes al cancelar una reserva · proposal: 0014 | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |

## Aparcadas

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏸️ aparcada: descartada por Acme, 2026-09-25 (lo valida su calendario) |

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


