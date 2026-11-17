# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0022 | Festivos locales por oficina — 🧪 validación diferida a la siguiente release (no se probó en el smoke de la 1.3) — [walkthrough](specs/20260924-090000-feature-0022-local-holidays/walkthrough.md) | 🧪 |
| 0024 | **Reserva recurrente mensual** — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo (`src/recurrence.js`, dev-lead 2026-09-21) | ⏳ |
| 0025 | Piloto en la oficina de Lugo | ⏳ |

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

### v1.3.0 — 2026-09-30

Reserva recurrente semanal (0019), aviso por correo al liberar una sala (0021), festivos locales por oficina (0022, validación pendiente) y patch 0020 (franja de las 23:30). [Changelog](changelog.md#130---2026-09-30).

smoke: 2026-09-30 · 0 hallazgos (suite verde y aviso de la 0021 a mano, liberando la sala Sur; 0 corregidos en la release)

validaciones pendientes: 0022

### v1.2.0 — 2026-09-10

Lista de espera por sala (0017). [Changelog](changelog.md#120---2026-09-10).

smoke: 2026-09-10 · 0 hallazgos (reserva y espera a mano; 0 corregidos en la release)

validaciones pendientes: 0017
