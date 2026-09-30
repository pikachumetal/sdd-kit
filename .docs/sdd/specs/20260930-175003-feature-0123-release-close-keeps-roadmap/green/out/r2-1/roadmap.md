# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0024 | Reserva recurrente mensual — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo | ⏳ |
| 0025 | Piloto en la oficina de Lugo | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `src/bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio: cada feature la toca | feature cuando se toque |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v1.3.0 — 2026-09-30

Reserva recurrente semanal (0019), aviso por correo al liberar una sala (0021), festivos locales por oficina (0022) y el arreglo de la franja de las 23:30 (patch 0020). Sale de esta release, sin su id, la reserva recurrente mensual. [Changelog](changelog.md#130---2026-09-30).

smoke: 2026-09-30 · 0 hallazgos (suite en verde y 0021 a mano: liberada la sala Sur, llegó el aviso; 0 corregidos en la release)

validaciones pendientes: 0017, 0022

### v1.2.0 — 2026-09-10

Lista de espera por sala (0017). [Changelog](changelog.md#120---2026-09-10).

smoke: 2026-09-10 · 0 hallazgos (reserva y espera a mano; 0 corregidos en la release)
