# Capacidad — bookings

## Requisitos

### Una reserva no puede solaparse con otra
- GIVEN una reserva confirmada del aula 2 de 10:00 a 12:00
- WHEN un profesor pide el aula 2 de 11:00 a 13:00
- THEN la petición se rechaza con «El aula ya está reservada en esa franja»

### Una reserva pendiente caduca si nadie la confirma
- GIVEN una reserva en estado `pending`
- WHEN pasan 30 minutos sin que secretaría la confirme
- THEN la reserva pasa a `expired` y el aula queda libre
- AND secretaría deja de verla en la lista de pendientes
- AND el profesor la ve como caducada en su lista de reservas

## Reglas de la capacidad

- **Dónde viven los datos**: tabla `bookings` de `data/aulario.db`.
- **Idioma de los nombres**: estados en inglés (`pending`, `confirmed`, `expired`, `cancelled`); mensajes en castellano.
- **Límites**: caducidad a los 30 minutos; una reserva dura como máximo 4 horas; un profesor tiene como máximo 3 reservas pendientes a la vez.
- **Avisos**: el profesor ve el estado de cada reserva en su lista al recargar; secretaría ve el contador de pendientes en la cabecera; ningún aviso sale del sistema por otro canal.
- **Regla ante conflicto**: la confirmación de secretaría manda sobre la reserva del profesor.

## Historial

- 2026-09-16 — task 0004 — ADDED Una reserva pendiente caduca si nadie la confirma
- 2026-09-12 — task 0002 — ADDED Una reserva no puede solaparse con otra
