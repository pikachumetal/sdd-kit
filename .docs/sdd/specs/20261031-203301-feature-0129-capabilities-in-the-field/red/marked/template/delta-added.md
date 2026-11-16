## ADDED — Cancelar una reserva

- GIVEN una reserva de una sala en una franja que todavía no ha empezado
- WHEN un usuario ejecuta `salas cancelar <sala> <franja>`
- THEN la franja queda libre y responde `Cancelada`
- AND si no existe esa reserva responde `No existe`
- AND si la franja ya ha empezado no se cancela, la reserva sigue como estaba y responde `Ya empezada`

## ADDED — Exportar las cancelaciones del mes

- GIVEN un administrador y un mes con cancelaciones
- WHEN el administrador ejecuta `salas cancelaciones <mes>`
- THEN exporta las cancelaciones de ese mes
- AND si el mes no tiene cancelaciones responde `Sin cancelaciones`
