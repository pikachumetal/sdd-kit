# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0019 | Reserva recurrente semanal — [walkthrough](specs/20260915-090000-feature-0019-weekly-recurrence/walkthrough.md) | ✅ |
| 0025 | Piloto en la oficina de Lugo | ⏳ |

## Release 1.3

en preparación

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0021 | **Aviso por correo al liberar una sala** — quien espera recibe un enlace válido 15 minutos | oficina de Vigo | `src/mail.js`, `src/waiting-list.js` | ✅ [walkthrough](specs/20260918-090000-feature-0021-release-mail/walkthrough.md) |
| 0022 | **Festivos locales por oficina** — no se reserva en un festivo de la oficina | piloto de Lugo | `src/holidays.js`, `src/bookings.js` | 🧪 validación diferida a el smoke de la 1.3, a cargo del dev-lead — [walkthrough](specs/20260924-090000-feature-0022-local-holidays/walkthrough.md) |
| 0024 | **Reserva recurrente mensual** — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo | dev-lead 2026-09-21 | `src/recurrence.js` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |

## Ideas del cliente

Cosas que el cliente ha dicho que querrá más adelante. No están priorizadas ni tienen id: si una se decide hacer, pasa a «Próximo» o a una release con su id.

| # | Ítem | Origen |
| --- | --- | --- |
| I1 | Exportar las reservas a PDF | cliente, 2026-09-30 |

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
