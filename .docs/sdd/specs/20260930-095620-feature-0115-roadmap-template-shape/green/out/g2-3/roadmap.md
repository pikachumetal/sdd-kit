# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 3 | Piloto en la oficina de Lugo, con el calendario de festivos locales | ⏳ |
| 0022 | **Festivos locales por oficina** — una sala no se puede reservar en un festivo de su oficina; el calendario se carga de un fichero `.ics` por oficina. Origen: piloto de Lugo. Ficheros: `src/holidays.js`, `src/bookings.js` | ⏳ |
| 0024 | **Reserva recurrente mensual** — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo. Origen: dev-lead 2026-09-21. Ficheros: `src/recurrence.js` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |
| B3 | Decidir si las reservas de más de 4 horas necesitan aprobación de recepción | — |
| B4 | Decidir si el CSV lleva la cabecera en castellano o en inglés: contabilidad lo pidió en castellano y el ERP lo espera en inglés | contabilidad; rescatado al colapsar la 1.1.0, 2026-09-05 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| Los tests de recurrencia dependen de la fecha del sistema: fallan el día 29 de febrero | medio | versión siguiente |
| `src/bookings.js` tiene 640 líneas y mezcla validación con persistencia | medio: cada feature la toca | versión siguiente |
| El fichero `bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio | cuando se toque |
| **[Feature 0019, 2026-09-04: parcial — [walkthrough](specs/20260903-090000-feature-0019-weekly-recurrence/walkthrough.md); queda: el borrado de una serie entera]** La recurrencia no se puede cancelar en bloque | bajo | versión siguiente |
| El correo de aviso no tiene reintento si el SMTP devuelve 451 | medio: se pierde el aviso | tras 0021 |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

### v1.2.0 — 2026-09-20

Aviso por correo al liberar una sala (0021) y el patch 0020. Corte de alcance: sale sin el aviso por SMS (2026-09-18), porque el proveedor pide contrato anual; se queda el correo. [Changelog](changelog.md#120---2026-09-20).

validaciones pendientes: 0020, 0021

smoke: pendiente

### v1.1.0 — 2026-09-05

Recurrencia semanal (0019), lista de espera (0017) y exportación a CSV (0016). [Changelog](changelog.md#110---2026-09-05).

validaciones pendientes: 0016, 0017

smoke: 2026-09-05 · 0 hallazgos (reserva, espera y exportación a mano; 0 corregidos en la release)
