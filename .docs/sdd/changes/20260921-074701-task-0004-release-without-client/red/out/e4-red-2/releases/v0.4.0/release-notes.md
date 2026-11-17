---
release: v0.4.0
title: salas v0.4.0 — Reservas semanales y salas libres a la vista
created: 2026-09-21
---

# salas v0.4.0 — Reservas semanales y salas libres a la vista

*2026-09-21*

## Resumen

Reservar la misma sala cada semana ya no obliga a repetir la reserva a mano, y puedes ver qué salas están libres en una franja antes de decidir. Además, cancelar una reserva deja de afectar a las de otros días.

## Novedades

- **Para quien reserva salas**: puedes repetir una reserva cada semana con una sola orden (`salas reservar --cada-semana`) y te ahorras volver a reservar cada vez.
- **Para quien busca sala**: puedes consultar qué salas están libres en una franja horaria (`salas libres 10:00-12:00`) y elegir sin ir probando una a una.
- **Para quien cancela**: al cancelar una reserva se cancela solo la de ese día. Antes podía desaparecer otra reserva a la misma hora de un día distinto.

## Problemas conocidos

- La franja horaria no se comprueba: si la escribes con un formato distinto de `10:00-12:00`, la herramienta no te avisa del error. Escríbela siempre con ese formato.

## Fuera de alcance de esta entrega

- Los avisos por correo antes de la reserva no entran en esta entrega; son lo siguiente en la lista, sin fecha comprometida.

## Próximos pasos

- Por parte del desarrollo: avisos por correo antes de la reserva.
- Por tu parte: desplegar esta versión en tu servidor y probar las tres novedades.
