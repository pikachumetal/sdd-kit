# Capacidad — bookings

## Propósito

Reservar, cancelar y anular salas desde la línea de comandos.

## Requisitos

### Cancelar una reserva propia

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

### Anular una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN el responsable ejecuta `anular Norte lun`
- THEN la reserva queda anulada y responde `anulada Norte lun`

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, en `src/app.js`.
- **Idioma de los nombres**: comandos en castellano.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.
