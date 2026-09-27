# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 0015 | Clientes externos y reservas a su nombre (`--cliente`) — `proposal: 0014` | ⏳ |
| 0016 | Tarifa por hora de cada sala, congelada en la reserva — `proposal: 0014` | ⏳ |
| 0017 | Factura mensual por cliente (`salas facturar <mes>`) — tras 0015, 0016 — `proposal: 0014` | ⏳ |
| 0018 | Pago de facturas (`salas pagar`) y vencimiento a 30 días — tras 0017 — `proposal: 0014` | ⏳ |
| 0019 | Bloqueo de reservas por impago — tras 0018 — `proposal: 0014` | ⏳ |

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
