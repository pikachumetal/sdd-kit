# Capacidad — bookings

## Propósito

Reservar y cancelar salas.

## Requisitos

### Cancelar una reserva

- GIVEN una reserva de Sur el lunes a las 10:00
- WHEN se ejecuta `cancelar lun 10:00`
- THEN responde «cancelada lun 10:00»
- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, en `src/app.js`
- **Idioma de los nombres**: castellano
- **Límites**: no aplica
- **Avisos**: «cancelada <día> <franja>» si la reserva existe; «no hay reserva <día> <franja>» si no
- **Regla ante conflicto**: no aplica
