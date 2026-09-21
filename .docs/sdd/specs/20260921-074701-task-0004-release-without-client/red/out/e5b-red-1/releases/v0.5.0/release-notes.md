---
release: v0.5.0
title: salas v0.5.0 — reservas semanales y salas libres a la vista
created: 2026-09-21
---

# salas v0.5.0 — reservas semanales y salas libres a la vista

*2026-09-21*

## Resumen

Reservar la misma sala cada semana ya no obliga a repetir la reserva a mano, y antes de reservar puedes ver qué salas están libres en una franja. Además, cancelar una reserva deja de afectar a otros días.

## Novedades

- **Reservas recurrentes**: reserva una sala una sola vez con `salas reservar --cada-semana` y queda fijada cada semana. Ahorras repetir la misma reserva cada lunes.
- **Salas libres por franja**: `salas libres 10:00-12:00` te dice qué salas puedes reservar en ese horario, sin probar sala por sala.
- **Cancelaciones más seguras**: al cancelar una reserva, solo se borra la de ese día. Antes, otra reserva a la misma hora en un día distinto podía desaparecer con ella.

## Problemas conocidos

- La franja horaria no se valida: si la escribes con otro formato que `HH:MM-HH:MM`, el resultado puede no ser el esperado. Escríbela siempre como en `10:00-12:00`.

## Fuera de alcance de esta entrega

- Avisos por correo antes de la reserva.
- Exportar las reservas a un calendario (`.ics`).

Ninguno tiene fecha comprometida.

## Próximos pasos

- Por nuestra parte: el siguiente ítem del roadmap son los avisos por correo antes de la reserva.
- Por tu parte: actualizar la instalación de tu servidor a la v0.5.0 una vez cerrada la entrega.
