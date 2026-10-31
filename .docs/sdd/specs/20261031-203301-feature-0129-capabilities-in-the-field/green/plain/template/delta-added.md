### ADDED — Cancelar una reserva

- GIVEN una reserva de una sala en una franja que aún no ha empezado
- WHEN se ejecuta `salas cancelar <sala> <franja>`
- THEN la franja queda libre y responde `Cancelada`
- AND si no existe esa reserva responde `No existe`
- AND si la franja ya ha empezado no se cancela y responde `Ya empezada`

### ADDED — Exportar las cancelaciones del mes

- GIVEN un administrador y un mes con cancelaciones
- WHEN ejecuta `salas cancelaciones <mes>`
- THEN exporta las cancelaciones de ese mes
- AND si el mes no tiene cancelaciones responde `Sin cancelaciones`
