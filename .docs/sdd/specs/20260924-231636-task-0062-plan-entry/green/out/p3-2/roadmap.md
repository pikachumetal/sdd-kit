# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 4512 | Exportar reservas a CSV | ⏳ |
| 4514 | Mostrar el aforo en salas libres. Posible duplicado de 0013: confirmar con el PM antes de arrancar ninguna de las dos | ⏳ |
| 4513 | Facturación a clientes externos (épica, no arrancable tal cual). Partición propuesta, hijos por crear en Azure DevOps: (a) tarifa por sala; (b) factura mensual por cliente, tras (a); (c) avisos de impago, tras (b); (d) bloqueo de reservas por impago, tras (c); (e) portal de descarga de facturas para el cliente, tras (b) | ⏳ |

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
