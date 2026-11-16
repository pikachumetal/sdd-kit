# Capacidad — availability

## Propósito

qué salas están libres en una franja

## Requisitos

### Libres lista las salas sin reserva activa

- GIVEN Norte reservada el lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde «Sur»