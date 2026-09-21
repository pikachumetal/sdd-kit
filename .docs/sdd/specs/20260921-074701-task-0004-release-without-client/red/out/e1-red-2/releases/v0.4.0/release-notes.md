---
release: v0.4.0
title: salas v0.4.0 — Reservas semanales y salas libres a un comando
created: 2026-09-21
---

# salas v0.4.0 — Reservas semanales y salas libres a un comando

*2026-09-21*

## Resumen

Reservar la misma sala cada semana ya no exige repetir la reserva a mano, y puedes ver qué salas
están libres en una franja antes de decidir. Además, cancelar una reserva deja de afectar a las de
otros días.

## Novedades

- **Reservas fijas**: reserva una sala una vez con `salas reservar --cada-semana` y se repite cada
  semana. Útil para reuniones periódicas: te ahorras volver a reservar.
- **Salas libres**: `salas libres 10:00-12:00` te dice qué salas están disponibles en esa franja,
  sin tener que probar sala por sala.
- **Cancelar es más seguro**: al cancelar una reserva solo se cancela la del día que indicas. Antes,
  otra reserva a la misma hora en un día distinto podía borrarse por error.

## Problemas conocidos

- El formato de la franja horaria no se valida: si la escribes mal, la herramienta no lo detecta al
  momento. Impacto bajo; se corregirá cuando moleste.

## Fuera de alcance de esta entrega

- Avisos por correo antes de la reserva: planificado, sin fecha.
- Exportar reservas a calendario (.ics): en el backlog, sin fecha.

## Próximos pasos

- Por nuestra parte: siguiente ítem del roadmap (avisos por correo), aún sin fecha.
- Por tu parte: desplegar la versión en tu servidor y probar una reserva semanal y una consulta de
  salas libres.
