# Tasks — Motivo al cancelar (0010)

| Task | Qué | Estado | Commit |
| --- | --- | --- | --- |
| 1 | Cancelar con motivo | hecha, revisión limpia | 7091e37 |
| 2 | Listado de canceladas | hecha, revisión limpia | (hash en el cierre) |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 745e793

## Rulings

- Task 0: Ruling: trabajo en el sitio sobre la rama de la feature, sin worktree nuevo — la sesión ya estaba en ella y el usuario pidió implementar aquí — si falla, se mueve la rama a un worktree.
- Task 0: Ruling: tipos sdd-kit:effort-* presentes en la sesión; se despacha con ellos.
- Task 1: Ruling: con motivo ausente o inválido y sin reserva, se mantiene «sin reserva <sala> <día>» (se busca la reserva primero) — la spec solo fija el THEN con reserva existente y así el test existente «cancelar sin reserva lo dice» sigue valiendo sin tocarlo — si falla, se invierte el orden de dos comprobaciones.
- Task 1: Ruling: el test «cancelar una reserva activa» se actualiza al contrato de la spec (sin --motivo → «motivo no válido…») — es el THEN literal — sin coste.
- Task 2: Ruling: `canceladas` sin ninguna cancelada devuelve cadena vacía (lo que sale de unir una lista vacía) y no se prueba — la spec no lo fija — si el dev-lead quiere un texto, es una enmienda.
- Final: minor (deferred): el test de `canceladas` depende del estado que deja el test anterior (falla aislado) — Spec y Code
- Final: minor (deferred): sin test de que un motivo inválido/ausente deja la reserva activa, ni de que las anuladas no se listan, ni de aceptación de «cambio de planes» y «otro»
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (el mismo comportamiento que `libres` sin salas libres)
- Final: minor (deferred): `cancelar Norte --motivo otro` toma `--motivo` como día (parseo posicional); `cancelReasons` y `readReason` entre helpers
- Final: minor (deferred): test/cancel.test.js figura reescrito entero por fin de línea (CRLF→LF); ruido de diff
- Final: Ruling: persistencia entre invocaciones (`bookings` en memoria; `cancelar` y `canceladas` en dos ejecuciones no se ven) — propiedad de la base que ya tenían reservar y anular, y la spec no la pide — si el dev-lead la quiere, es la 0014 «Motivo guardado» del roadmap
- Final: Ruling: mayúsculas/espacios del motivo, `--motivo` antes de sala y día, formato con varias canceladas — la lista es cerrada y el mensaje enseña los valores válidos; el orden lo fija la spec; el formato es razonable — coste: una enmienda de la spec
- Final: Ruling: delta marcado ADDED aunque cambia el `cancelar` previo, y numeración 1,3 de las decisiones — el AND «sin --motivo» cubre el cambio; el merge del delta es de sdd-archive — sin coste en el código
- Final: Ruling: shas 3be4359 y bf7de91 de las revisiones por task ya no existen tras el squash — el contenido de src/app.js y los tests coincide con 7091e37 y 745e793 — sin coste
