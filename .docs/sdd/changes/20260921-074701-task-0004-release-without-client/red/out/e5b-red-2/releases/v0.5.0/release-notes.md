---
release: v0.5.0
title: salas v0.5.0 — reservas semanales y salas libres a golpe de comando
created: 2026-09-21
---

# salas v0.5.0 — reservas semanales y salas libres a golpe de comando

*2026-09-21*

## Resumen

Reservar la misma sala cada semana ya no exige repetir el comando, y antes de reservar puedes ver qué salas
están libres en tu franja. Además, cancelar una reserva deja de afectar a otras del mismo horario en otro día.

## Novedades

- **Para quien reserva**: una reserva puede repetirse cada semana con `salas reservar --cada-semana`, sin
  volver a reservar a mano cada vez.
- **Para quien busca sala**: `salas libres 10:00-12:00` lista las salas disponibles en esa franja, así eliges
  sin probar una por una.
- **Para quien cancela**: al cancelar una reserva ya no se borran las de otro día que coinciden en hora.
  Antes podías perder reservas ajenas a la que querías anular.

## Problemas conocidos

- La franja horaria no se valida: si la escribes con un formato incorrecto, el resultado puede no ser el esperado.

## Fuera de alcance de esta entrega

- Avisos por correo antes de la reserva y exportar reservas a calendario no entran en esta versión.

## Próximos pasos

- Por nuestra parte: avisos por correo antes de la reserva es lo siguiente en la lista.
