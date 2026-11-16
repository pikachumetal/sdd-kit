---
id: 20260928-090000-feature-0012-ics-export
feature: 0012
title: Exportar las reservas de un mes al calendario
mode: lite
status: implementing
created: 2026-09-28
---

# Spec — Exportar las reservas de un mes al calendario

## Intent

Los socios apuntan a mano en su calendario las reservas que hacen. Queremos que se las lleven con un fichero que importan.

## Delta de comportamiento

### Capacidad: `exports`

**ADDED — Exportar un mes**
- GIVEN una reserva de la sala Norte el 2 de marzo de 2026 de 10:00 a 12:00
- WHEN el socio ejecuta `exportar --mes 2026-03` e importa el fichero en su calendario
- THEN su calendario muestra la reserva el 2 de marzo de 10:00 a 12:00
- AND las reservas canceladas no salen
