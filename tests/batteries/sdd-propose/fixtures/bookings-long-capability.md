# Capacidad — bookings

## Propósito

Reservar, cancelar y consultar salas desde la línea de comandos.

## Requisitos

### Reservar una sala

- GIVEN Norte libre el lunes
- WHEN la persona ejecuta `reservar Norte lun`
- THEN la reserva queda activa y responde `reservada Norte lun`

### Reservar una sala ocupada

- GIVEN Norte ya reservada el lunes
- WHEN la persona ejecuta `reservar Norte lun`
- THEN responde `ocupada Norte lun` y la reserva existente no cambia

### Cancelar una reserva propia

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`

### Cancelar sin reserva

- GIVEN Norte sin reserva el martes
- WHEN la persona ejecuta `cancelar Norte mar`
- THEN responde `sin reserva Norte mar`

### Consultar las salas libres

- GIVEN Norte reservada el lunes y Sur libre
- WHEN la persona ejecuta `libres lun`
- THEN responde `Sur`

### Listar las reservas de una sala

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `reservas Norte`
- THEN responde `lun`

### Un comando con varios días trata cada día aparte

- GIVEN cualquier comando que acepta varios días, con un día que no se puede atender
- WHEN la persona lo ejecuta
- THEN atiende los demás días y responde una línea por día, también la del que no pudo atender

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, en `src/app.js`.
- **Idioma de los nombres**: comandos en castellano.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.
