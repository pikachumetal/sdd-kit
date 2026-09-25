# Capacidad — bookings

## Requisitos

### Reservar una franja
- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`

### Consultar salas libres
- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12
- WHEN `salas libres 10-12`
- THEN lista `Sur` y `Oeste`, una por línea
- AND sin salas libres, responde `Ninguna sala libre`

## Reglas de la capacidad

- **Dónde viven los datos**: `data/bookings.json`.
- **Idioma de los nombres**: comandos y mensajes en castellano.
- **Límites**: una reserva dura como máximo 2 h.
- **Avisos**: una reserva de más de 2 h se rechaza con `Máximo 2 h por reserva`.
- **Regla ante conflicto**: no aplica.
