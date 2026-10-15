# Capacidad — bookings

## Propósito

reservar, cancelar y anular salas, y lo que se avisa al hacerlo

## Requisitos

### Las anulaciones se avisan por correo

- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun`
- THEN responde «anulada Norte lun» y manda el correo «anulada Norte lun» al responsable de sala