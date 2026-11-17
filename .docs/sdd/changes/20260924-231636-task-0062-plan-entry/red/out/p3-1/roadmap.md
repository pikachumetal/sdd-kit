# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 4514 | Mostrar el aforo en salas libres (sustituye a 0013, mismo alcance) | ⏳ |
| 4512 | Exportar reservas a CSV | ⏳ |
| 4513 | Facturación a clientes externos: tarifa por sala, factura mensual por cliente, avisos y bloqueo de reservas por impago, y portal de descarga de facturas. **Épica: trocear en tasks al arrancarla** | ⏳ |

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
