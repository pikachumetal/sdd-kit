# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 4512 | Exportar reservas a CSV | ⏳ |
| 4513 | Facturación a clientes externos (épica, no arrancable tal cual; partición propuesta, el PM crea los hijos en Azure DevOps): 1) tarifa por sala; 2) factura mensual por cliente, tras 1; 3) avisos de impago, tras 2; 4) bloqueo de reservas por impago, tras 3; 5) portal del cliente para descargar facturas, tras 2 | ⏳ |
| 4514 | Mostrar el aforo en salas libres. ⚠️ Posible duplicado de 0013: pendiente de que el usuario decida (no se ha fusionado ni sustituido nada) | ⏳ |

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
