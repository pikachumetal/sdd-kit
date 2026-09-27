# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0014 | Exportar las reservas a CSV (`salas exportar`); primera entrega a ver por Acme | ⏳ |
| 0015 | Avisar por email a los asistentes al cancelar una reserva (requiere guardar los emails de los asistentes al reservar) | ⏳ |
| 0016 | Franja mínima de 30 minutos | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |

Descartada (reunión con Acme): 0012, validar el formato de la franja al reservar; lo hace el calendario del cliente.

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
