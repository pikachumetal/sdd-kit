# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 2 | ~~Piloto en la oficina de Vigo~~ | ✅ hecho el 2026-09-05 |
| 3 | Piloto en la oficina de Lugo, con el calendario de festivos locales | ⏳ |

## Release 1.3.0

Criterio de orden (dev-lead, 2026-09-21): primero lo que ven los usuarios de la oficina; la limpieza interna va detrás. La 0022 va antes que la 0024 porque Lugo no arranca sin festivos. En preparación. Las filas 🧪 son validaciones diferidas rescatadas de las releases 1.1.0 y 1.2.0.

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0022 | **Festivos locales por oficina** — una sala no se puede reservar en un festivo de su oficina; el calendario se carga de un fichero `.ics` por oficina. | piloto de Lugo | `src/holidays.js`, `src/bookings.js` | ⏳ |
| 0024 | **Reserva recurrente mensual** — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo. | dev-lead 2026-09-21 | `src/recurrence.js` | ⏳ |
| 0021 | **Aviso por correo al liberar una sala** — quien estaba en la lista de espera recibe un correo con enlace de reserva válido 15 minutos. | petición de la oficina de Vigo, 2026-09-10 | `src/mail.js`, `src/waiting-list.js` | 🧪 validación diferida al primer correo real tras configurar el SMTP de la oficina, a cargo del dev-lead — [walkthrough](specs/20260918-090000-feature-0021-release-mail/walkthrough.md) |
| 0016 | **Exportar las reservas a CSV** | contabilidad, 2026-08-20 | `src/bookings.js` | 🧪 validación diferida a la primera exportación real de la oficina de Vigo, a cargo de Marta — [walkthrough](specs/20260901-090000-feature-0016-csv-export/walkthrough.md) |
| 0017 | **Lista de espera por sala** | oficina de Vigo | `src/bookings.js`, `src/waiting-list.js` | 🧪 validación diferida a la primera sala llena en producción, a cargo del dev-lead — [walkthrough](specs/20260902-090000-feature-0017-waiting-list/walkthrough.md) |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |
| B2 | **[Feature 0016, 2026-09-03: saldada — [walkthrough](specs/20260901-090000-feature-0016-csv-export/walkthrough.md)]** Exportar las reservas del mes para contabilidad | contabilidad, 2026-08-20 |
| B3 | Decidir si el CSV lleva la cabecera en castellano o en inglés: contabilidad lo pidió en castellano y el ERP lo espera en inglés | contabilidad y ERP, rescatado al colapsar la 1.1.0 (2026-09-05) |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **[Patch 0018, 2026-09-10: saldada — [patch](specs/20260910-090000-patch-0018-sqlite-lock/patch.md)]** Dos reservas simultáneas de la misma sala bloquean SQLite durante 5 s (medido con `node --test` y 20 clientes) | alto: la pantalla se queda colgada | patch |
| Los tests de recurrencia dependen de la fecha del sistema: fallan el día 29 de febrero | medio | próxima release |
| `src/bookings.js` tiene 640 líneas y mezcla validación con persistencia | medio: cada feature la toca | próxima release |
| El fichero `bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio | cuando se toque |
| **[Feature 0019, 2026-09-04: parcial — [walkthrough](specs/20260903-090000-feature-0019-weekly-recurrence/walkthrough.md); queda: el borrado de una serie entera]** La recurrencia no se puede cancelar en bloque | bajo | próxima release |
| El correo de aviso no tiene reintento si el SMTP devuelve 451 | medio: se pierde el aviso | tras 0021 |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-19 | 0020 | 🧪 validación diferida a la primera reserva nocturna del turno de limpieza — La franja de las 23:30 saltaba al día siguiente — [patch](specs/20260919-090000-patch-0020-late-slot/patch.md) |
| 2026-09-10 | 0018 | Bloqueo de SQLite con dos reservas a la vez — [patch](specs/20260910-090000-patch-0018-sqlite-lock/patch.md) |

## Releases cerradas

### v1.2.0 — 2026-09-20

Aviso por correo al liberar una sala (0021) y el patch 0020. [Changelog](changelog.md#120---2026-09-20).

smoke: pendiente

### v1.1.0 — 2026-09-05

Recurrencia semanal (0019), lista de espera (0017) y exportación a CSV (0016). [Changelog](changelog.md#110---2026-09-05).

smoke: 2026-09-05 · 0 hallazgos (reserva, espera y exportación a mano; 0 corregidos en la release)
