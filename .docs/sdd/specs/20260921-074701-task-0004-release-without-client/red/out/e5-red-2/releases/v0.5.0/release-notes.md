---
release: v0.5.0
title: salas v0.5.0 — reservas que se repiten y salas libres de un vistazo
created: 2026-09-21
---

# salas v0.5.0 — reservas que se repiten y salas libres de un vistazo

*2026-09-21*

## Resumen

Reservar una sala fija cada semana ya no exige repetir la reserva a mano, y puedes ver qué salas están libres en una franja antes de reservar. Además, cancelar una reserva deja de afectar a las de otros días.

## Novedades

- **Para quien reserva salas**: puedes dejar una reserva repetida todas las semanas con un solo comando (`salas reservar --cada-semana`), en lugar de reservar la misma sala una vez por semana.
- **Para quien reserva salas**: puedes consultar qué salas están libres en una franja horaria (`salas libres 10:00-12:00`) y elegir sin probar sala por sala.
- **Para quien reserva salas**: al cancelar una reserva ya no se borran las de otro día que coincidían en hora. Se corrigió un error por el que esto podía pasar.

## Problemas conocidos

- La franja horaria no se comprueba al escribirla: si no respeta el formato `HH:MM-HH:MM`, el resultado puede ser inesperado. Escríbela siempre con ese formato.

## Fuera de alcance de esta entrega

- Avisos por correo antes de la reserva.
- Exportar las reservas a un calendario (.ics).

## Próximos pasos

- Por nuestra parte: siguiente en la lista, avisos por correo antes de la reserva (sin fecha comprometida).
- Por vuestra parte: ninguna acción pendiente.
