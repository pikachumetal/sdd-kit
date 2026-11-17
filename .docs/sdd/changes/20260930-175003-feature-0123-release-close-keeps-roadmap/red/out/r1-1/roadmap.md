# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0023 | Piloto en la oficina de Lugo | ⏳ |

## Versión siguiente

Salieron de la 1.3.0 en el corte del 2026-09-30. Lo que traigan los pilotos entra aquí.

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0022 | **Festivos locales por oficina** — no se reserva en un festivo de la oficina | piloto de Lugo | `src/holidays.js`, `src/bookings.js` | 🧪 validación diferida a el smoke de la 1.4, a cargo del dev-lead — [walkthrough](specs/20260924-090000-feature-0022-local-holidays/walkthrough.md) |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **[Patch 0020, 2026-09-22: saldada — [patch](specs/20260922-090000-patch-0020-late-slot/patch.md)]** La franja de las 23:30 se guardaba con la fecha del día siguiente | medio: reservas nocturnas en el día equivocado | patch |
| `src/bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio: cada feature la toca | feature cuando se toque |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-22 | 0020 | La franja de las 23:30 ya no salta al día siguiente — [patch](specs/20260922-090000-patch-0020-late-slot/patch.md) |

## Releases cerradas

### v1.2.0 — 2026-09-10

Lista de espera por sala (0017). [Changelog](changelog.md#120---2026-09-10).

smoke: 2026-09-10 · 0 hallazgos (reserva y espera a mano; 0 corregidos en la release)

validaciones pendientes: 0017

### v1.3.0 — 2026-09-30

Reserva recurrente semanal (0019), aviso por correo al liberar una sala (0021), festivos locales por oficina (0022, validación pendiente) y arreglo de la franja de las 23:30 (patch 0020). [Changelog](changelog.md#130---2026-09-30).

smoke: 2026-09-30 · 0 hallazgos (suite y aviso al liberar la sala Sur a mano; 0 corregidos en la release)

validaciones pendientes: 0022
