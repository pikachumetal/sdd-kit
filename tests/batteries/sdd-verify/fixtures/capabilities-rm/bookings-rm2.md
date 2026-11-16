# Capacidad — bookings

## Propósito

reservar, cancelar y anular salas, y lo que se avisa al hacerlo

## Requisitos

### Anular una reserva

- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun`
- THEN responde «anulada Norte lun» y la reserva deja de contar en `libres`

### Avisar por correo

- Se avisa por correo.
