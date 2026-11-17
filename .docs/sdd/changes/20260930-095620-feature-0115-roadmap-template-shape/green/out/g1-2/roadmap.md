# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 2 | ~~Piloto en la oficina de Vigo~~ | ✅ hecho el 2026-09-05 |
| 3 | Piloto en la oficina de Lugo, con el calendario de festivos locales | ⏳ |

## Versión siguiente

Salieron de la 1.1.0 en el corte del 2026-09-05. **Tras el corte de la 1.2.0**, «1.1.1» en las filas de deuda quiere decir la versión siguiente.

**Criterio de orden** (dev-lead, 2026-09-21): primero lo que ven los usuarios de la oficina; la limpieza interna va detrás. La 0022 va antes que la 0024 porque Lugo no arranca sin festivos.

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0021 | **Aviso por correo al liberar una sala** — quien estaba en la lista de espera recibe un correo con enlace de reserva válido 15 minutos. | petición de la oficina de Vigo, 2026-09-10 | `src/mail.js`, `src/waiting-list.js` | 🧪 validación diferida al primer correo real tras configurar el SMTP de la oficina, a cargo del dev-lead — [walkthrough](specs/20260918-090000-feature-0021-release-mail/walkthrough.md) |
| 0022 | **Festivos locales por oficina** — una sala no se puede reservar en un festivo de su oficina; el calendario se carga de un fichero `.ics` por oficina. | piloto de Lugo | `src/holidays.js`, `src/bookings.js` | ⏳ |
| 0024 | **Reserva recurrente mensual** — tras 0022. «El primer lunes de cada mes», con aviso si cae en festivo. | dev-lead 2026-09-21 | `src/recurrence.js` | ⏳ |
| 0019 | **Reserva recurrente semanal** — la misma sala y franja cada semana, hasta 12 repeticiones. | petición de la oficina de Vigo | `src/recurrence.js` | ✅ [walkthrough](specs/20260903-090000-feature-0019-weekly-recurrence/walkthrough.md) |

**Pendientes rescatados al colapsar la 1.1.0** (2026-09-05):

1. **Decidir si el CSV lleva la cabecera en castellano o en inglés**: contabilidad lo pidió en castellano y el ERP lo espera en inglés.
2. ~~Renombrar `rooms.js`~~ Hecho en el patch 0018.

### Validación diferida de la 1.1.0

| Id | Qué | Disparador |
| --- | --- | --- |
| 0016 | Exportar las reservas a CSV | 🧪 a la primera exportación real de la oficina de Vigo, a cargo de Marta |
| 0017 | Lista de espera por sala | 🧪 a la primera sala llena en producción, a cargo del dev-lead |

### Reglas de ejecución en worktrees

De la 1.1.0. Ficheros que compartían varias tasks de aquella release:

| Fichero | Tasks |
| --- | --- |
| `src/bookings.js` | 0016, 0017, 0019 |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |
| B2 | **[Feature 0016, 2026-09-03: saldada — [walkthrough](specs/20260901-090000-feature-0016-csv-export/walkthrough.md)]** Exportar las reservas del mes para contabilidad | contabilidad, 2026-08-20 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| **[Patch 0018, 2026-09-10: saldada — [patch](specs/20260910-090000-patch-0018-sqlite-lock/patch.md)]** Dos reservas simultáneas de la misma sala bloquean SQLite durante 5 s (medido con `node --test` y 20 clientes) | alto: la pantalla se queda colgada | patch |
| Los tests de recurrencia dependen de la fecha del sistema: fallan el día 29 de febrero | medio | 1.1.1 |
| `src/bookings.js` tiene 640 líneas y mezcla validación con persistencia | medio: cada feature la toca | 1.1.1 |
| El fichero `bookings.js` pasa de 600 líneas y junta la validación y el acceso a datos | medio | cuando se toque |
| **[Feature 0019, 2026-09-04: parcial — [walkthrough](specs/20260903-090000-feature-0019-weekly-recurrence/walkthrough.md); queda: el borrado de una serie entera]** La recurrencia no se puede cancelar en bloque | bajo | 1.1.1 |
| El correo de aviso no tiene reintento si el SMTP devuelve 451 | medio: se pierde el aviso | tras 0021 |

## Decisiones tomadas

- **Franjas en hora local, nunca en UTC** (2026-08-15, dev-lead): la oficina piensa en su reloj. Escrito en el Art. II de la constitution.
- **La 1.2.0 sale sin el aviso por SMS** (2026-09-18, corte de alcance): el proveedor de SMS pide contrato anual; se queda el correo.
- **Se descarta PostgreSQL** (2026-08-28): una oficina tiene como mucho 40 salas y SQLite con un fichero por oficina basta; migrar exigiría un servidor que nadie mantiene.

## Decisiones pendientes

- Si las reservas de más de 4 horas necesitan aprobación de recepción.

## Releases cerradas

### v1.2.0 — 2026-09-20

Aviso por correo al liberar una sala (0021) y el patch 0020. [Changelog](changelog.md#120---2026-09-20).

smoke: pendiente

### v1.1.0 — 2026-09-05

Recurrencia semanal (0019), lista de espera (0017) y exportación a CSV (0016). [Changelog](changelog.md#110---2026-09-05).

smoke: 2026-09-05 · 0 hallazgos (reserva, espera y exportación a mano; 0 corregidos en la release)

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-19 | 0020 | 🧪 validación diferida a la primera reserva nocturna del turno de limpieza — La franja de las 23:30 saltaba al día siguiente — [patch](specs/20260919-090000-patch-0020-late-slot/patch.md) |
| 2026-09-10 | 0018 | Bloqueo de SQLite con dos reservas a la vez — [patch](specs/20260910-090000-patch-0018-sqlite-lock/patch.md) |
