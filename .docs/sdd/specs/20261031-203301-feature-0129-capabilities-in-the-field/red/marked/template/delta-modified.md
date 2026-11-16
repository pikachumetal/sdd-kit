## MODIFIED — Mover una reserva

- GIVEN una reserva de la sala Norte de 10 a 12 hecha por Ana, con la sala Sur libre y con un festivo el día siguiente
- WHEN Ana ejecuta `salas mover Norte Sur 10-12` y la sala Sur admite el aforo de la reserva original
- THEN la reserva pasa a Sur, Norte queda libre y responde `Reserva movida a Sur 10-12`, sin avisar del festivo porque no pisa la franja
- AND si Sur está ocupada responde `Sur ocupada` y no cambia nada de la reserva original ni de la franja
- AND si el aforo de Sur es menor responde `Aforo insuficiente en Sur` y la reserva sigue en Norte
- AND el historial de la reserva guarda la sala anterior y la hora del cambio
