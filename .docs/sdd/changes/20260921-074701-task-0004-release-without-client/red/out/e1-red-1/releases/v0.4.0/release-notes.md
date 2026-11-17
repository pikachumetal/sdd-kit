---
release: v0.4.0
title: salas v0.4.0 — reserva cada semana y encuentra sala libre
created: 2026-09-21
---

# salas v0.4.0 — reserva cada semana y encuentra sala libre

*2026-09-21*

## Resumen

Reservar una reunión fija ya no obliga a repetir la reserva cada semana, y puedes ver qué salas están libres en una franja antes de reservar. Además, cancelar una reserva deja de afectar a las de otros días.

## Novedades

- **Para quien tiene reuniones fijas**: reservas la sala una sola vez y se repite cada semana (`salas reservar --cada-semana`), en lugar de reservarla de nuevo cada semana.
- **Para quien busca sala**: consulta qué salas están libres en una franja (`salas libres 10:00-12:00`) antes de decidir.
- **Para quien cancela reservas**: al cancelar una reserva ya no se borran las de otro día que coincidían en la misma hora.

## Problemas conocidos

- El formato de la franja horaria no se valida: si escribes una franja distinta de `HH:MM-HH:MM`, la herramienta no te lo advierte. Usa siempre ese formato, por ejemplo `10:00-12:00`.

## Fuera de alcance de esta entrega

- Avisos por correo antes de la reserva y exportar las reservas a calendario (.ics): no entran en esta entrega y no hay fecha comprometida.

## Próximos pasos

- Por nuestra parte: valorar los avisos por correo como candidato para la siguiente entrega.
- Por tu parte: desplegar esta versión en tu servidor una vez confirmado el cierre.
