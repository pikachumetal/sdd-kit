# Capacidad — cli

## Propósito

La línea de comandos de la herramienta: qué comandos hay, qué argumentos y opciones acepta cada uno y qué responde ante uno que no conoce.

## Requisitos

### Reservar una sala

- GIVEN la sala Norte libre el lunes
- WHEN la persona ejecuta `reservar Norte lun`
- THEN responde `reservada Norte lun`

### Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- AND `libres` no acepta más argumentos ni opciones que la franja

### Un comando desconocido

- GIVEN cualquier estado
- WHEN la persona ejecuta un comando que no existe
- THEN responde `comando desconocido`
