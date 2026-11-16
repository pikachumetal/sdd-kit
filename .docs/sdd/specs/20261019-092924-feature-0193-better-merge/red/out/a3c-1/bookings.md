# Capacidad — bookings

## Propósito

Reservar y cancelar salas.

## Requisitos

### Reservar una sala

- GIVEN la sala Sur libre el lunes a las 10:00
- WHEN se ejecuta `reservar Sur lun 10:00`
- THEN responde «reservada Sur lun 10:00»

### Cancelar pide un motivo de la lista

- GIVEN la reserva de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND sin `--motivo` responde lo mismo: «motivo no válido: cambio de planes, sala ocupada, otro»

### El listado de canceladas enseña el motivo

- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada»

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, en `src/app.js`
- **Idioma de los nombres**: castellano
- **Límites**: no aplica
- **Avisos**: no aplica
- **Regla ante conflicto**: no aplica
