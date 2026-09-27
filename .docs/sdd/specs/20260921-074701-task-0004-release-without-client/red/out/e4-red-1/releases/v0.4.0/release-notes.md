---
release: v0.4.0
title: salas v0.4.0 — Reservas semanales y salas libres a la vista
created: 2026-09-21
---

# salas v0.4.0 — Reservas semanales y salas libres a la vista

*2026-09-21*

## Resumen

Reservar una sala que necesitas todas las semanas ya no obliga a repetir la reserva a mano, y antes
de reservar puedes ver qué salas están libres en la franja que te interesa. Además, cancelar una
reserva deja de afectar a las de otros días.

## Novedades

- **Para quien reserva salas**: puedes reservar la misma sala a la misma hora cada semana en un solo
  paso (`salas reservar --cada-semana`), en lugar de crear cada reserva por separado.
- **Para quien reserva salas**: puedes consultar qué salas están libres en una franja
  (`salas libres 10:00-12:00`) y elegir con datos antes de reservar.
- **Para quien cancela reservas**: cancelar una reserva solo elimina la del día elegido. Antes podía
  borrar también reservas de otro día que coincidieran en la hora.

## Problemas conocidos

- La franja horaria no se valida. Escríbela siempre como `10:00-12:00`; con otro formato no hay
  garantía de que el resultado sea el esperado.

## Fuera de alcance de esta entrega

- Avisos por correo antes de la reserva: no entra, sin fecha comprometida.
- Exportar las reservas a un calendario (.ics): no entra, sin fecha comprometida.

## Próximos pasos

- Por nuestra parte: el siguiente candidato del roadmap son los avisos por correo antes de la reserva.
- Por vuestra parte: desplegar esta versión en tu servidor y avisar si algo no cuadra.
