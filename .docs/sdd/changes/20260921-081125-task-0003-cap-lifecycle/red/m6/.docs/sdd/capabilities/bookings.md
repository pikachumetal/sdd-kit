# Capacidad — bookings

## Requisitos

### Una reserva no puede solaparse con otra
- GIVEN una reserva confirmada del aula 2 de 10:00 a 12:00
- WHEN un profesor pide el aula 2 de 11:00 a 13:00
- THEN la petición se rechaza con «El aula ya está reservada en esa franja»

### Solo se reserva en días lectivos
- GIVEN un profesor que pide un aula
- WHEN la fecha de la reserva cae en sábado o domingo
- THEN la petición se rechaza con «Solo se reserva de lunes a viernes»

## Reglas de la capacidad

- **Dónde viven los datos**: tabla `bookings` de `data/aulario.db`.
- **Idioma de los nombres**: estados en inglés; mensajes en castellano.
- **Límites**: reservas de lunes a viernes, de 8:00 a 21:00.
- **Avisos**: no aplica.
- **Regla ante conflicto**: la confirmación de secretaría manda sobre la reserva del profesor.

## Historial

- 2026-09-12 — task 0002 — ADDED Una reserva no puede solaparse con otra
- 2026-09-12 — task 0002 — ADDED Solo se reserva en días lectivos
