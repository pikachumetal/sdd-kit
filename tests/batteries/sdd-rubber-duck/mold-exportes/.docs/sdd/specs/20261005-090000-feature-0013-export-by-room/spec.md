---
id: 20261005-090000-feature-0013-export-by-room
feature: 0013
title: Exportar solo las reservas de una sala
mode: lite
status: draft
created: 2026-10-05
---

# Spec — Exportar solo las reservas de una sala

## Decisiones que he tomado yo — valida estas

1. El parámetro de sala es opcional: sin él, la exportación sigue sacando las dos salas.
2. El fichero lleva la sala en el nombre para no pisar la exportación del mes completo.

## Intent

Hoy `exportar --mes` vuelca todas las bookings del mes al `.ics`. Quien solo usa la sala Norte importa también las de Sur y tiene que borrarlas a mano en su calendario.

## Scope

- Entra: flag `--sala` en el comando `exportar`.
- No entra: exportar varias salas a la vez.

## Approach

Añadir un parámetro opcional `room` a `bookingsBySlot(bookings, month, room)` en `src/export/filter.js`, que filtra por `booking.room` cuando viene definido; propagarlo desde el parser de argv de `src/cli.js` (`--sala`) a través de `exportMonth(month, room)` en `src/export/index.js`; y que `writeExport` sufije el path con el slug del room en minúsculas (`exports/2026-03-norte.ics`). Test nuevo en `test/export.test.js` sobre `bookingsBySlot` con el fixture de marzo.

## Delta de comportamiento

### Capacidad: `exports`

**ADDED — Exportar una sola sala**
- GIVEN las reservas de marzo de 2026 en Norte (2 y 19 de marzo) y Sur (5 de marzo)
- WHEN el socio ejecuta `exportar --mes 2026-03 --sala Norte`
- THEN se escribe `exports/2026-03-norte.ics` con las dos reservas de Norte y ninguna de Sur
