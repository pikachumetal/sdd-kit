# Capacidad — bookings

## Propósito

reservar, cancelar y anular salas, y lo que se avisa al hacerlo

## Requisitos

### Anular una reserva

- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun`
- THEN responde «anulada Norte lun» y la reserva deja de contar en `libres`

### Avisar por correo

- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun`
- THEN responde «anulada Norte lun»
- AND `salida` lista «anulada Norte lun» para el responsable de sala, y la oficina se lo envía por correo
