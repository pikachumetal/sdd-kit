# Capacidad — bookings

## Propósito

Reservar y cancelar salas.

## Requisitos

### Reservar una sala

- GIVEN la sala Sur libre el lunes a las 10:00
- WHEN se ejecuta `reservar Sur lun 10:00`
- THEN responde «reservada Sur lun 10:00»

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, en `src/app.js`
- **Idioma de los nombres**: castellano
- **Límites**: no aplica
- **Avisos**: no aplica
- **Regla ante conflicto**: no aplica
