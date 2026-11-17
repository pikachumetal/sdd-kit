# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | ✅ hecha, revisión limpia | 7ee0bb6 |
| Task 2 — Listado de canceladas | ✅ hecha, revisión limpia | a48ab04 |

Revisión final: Spec opus+high, Yes · Código sonnet+high, With fixes (solo Minor, diferidos) · Arquitectura no (plan: sin señales en el diff), sobre a48ab04

## Rulings

Task 0: Ruling: se reescriben los dos tests existentes de `cancelar` para llevar `--motivo` — la spec manda: sin `--motivo` responde «motivo no válido…» — si me equivoco, un test viejo vuelve a exigir la salida antigua
Task 0: Ruling: el motivo se valida antes de buscar la reserva — el AND de la spec es incondicional («sin --motivo responde lo mismo») — si me equivoco, `cancelar Sur mar` sin motivo debería decir «sin reserva»
Task 0: Ruling: `canceladas` sin canceladas devuelve cadena vacía y varias se unen con salto de línea — la spec no lo fija — si me equivoco, la spec necesitaría un THEN para ese caso
Task 0: Ruling: el test del listado reutiliza el estado en memoria que deja el test de T1 en el mismo fichero (Norte lun cancelada con «sala ocupada») — es el GIVEN de la spec — si me equivoco, el test de T2 se vuelve dependiente del orden
Task 0: Ruling: implementadores con `sdd-kit:effort-low` y `sonnet` — tasks de un fichero con valores exactos en la spec — si me equivoco, rondas de fix
Task 1: Ruling: Minor «reason sin lector en T1» se acepta — T2 lo lee, es la spec («el motivo se guarda con la reserva») — si me equivoco, una línea sobra
Task 1: Ruling: Minor «sin test de --motivo sin valor ni de motivo inválido sin reserva» se acepta — son decisiones del hilo, no THEN de la spec — si me equivoco, quedan sin proteger
Task 1: Ruling: Minor de saltos de línea (cancel.test.js pasó de CRLF a LF al reescribirlo el hilo) se acepta — `core.autocrlf=true` lo normaliza — si me equivoco, ruido en el diff
Final: Ruling: Eje Arquitectura no — el plan no trae la línea y el diff no cruza ninguna señal — si me equivoco, el reparto de la reserva en memoria dentro de app.js queda sin mirada de arquitectura
Final: minor (deferred): test de `canceladas` depende del orden (Spec 2, Código 2) — sin `review.minors: fix`
Final: minor (deferred): ningún test fija el filtro por estado de `canceladas` (Spec 1)
Final: minor (deferred): `readReason` calcula el índice antes de comprobar `--motivo`; validación del motivo repartida entre `readReason` y `cancelBooking` (Código 3, 4)
Final: minor (deferred): sin test de `--motivo` sin valor ni de `canceladas` vacío (Código 6)
Final: minor (deferred): cancel.test.js pasó de CRLF a LF y su diff aparece reescrito entero (Código 1)
Final: minor (deferred): `canceladas` vacío imprime línea en blanco; la spec no pide mensaje (Código 5)
Final: Ruling: persistencia del motivo entre invocaciones de la CLI — fuera de alcance, lo recoge ROADMAP 0014 — si me equivoco, `cancelar` y `canceladas` en procesos distintos no se ven
Final: Ruling: validar el motivo antes de buscar la reserva y `canceladas` vacío sin mensaje — ya ruled en Task 0, coherente con el AND incondicional — si me equivoco, hace falta un THEN nuevo
Final: Ruling: mayúsculas en el motivo y `--motivo` antes de sala/día — la lista es cerrada por decisión del dev-lead y los posicionales son anteriores — si me equivoco, el usuario ve «motivo no válido» con la lista a la vista
Final: Ruling: delta etiquetado «Modificadas» pero solo con ADDED, y decisiones numeradas 1 y 3 — redacción de la spec, el AND cubre el cambio — se deja para el archive
