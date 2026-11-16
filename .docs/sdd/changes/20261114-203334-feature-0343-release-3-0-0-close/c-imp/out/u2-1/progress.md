# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commit 8a11353, hecha antes de esta sesión)
Task 2: Ruling: el orden pasa a 2 → 3 — el nombre de `--por` solo se ve por `canceladas`; un test de la Task 3 sin listado pasaría en verde sin RED — coste si me equivoco: ninguno, es solo el orden
Task 2: Ruling: los tests usan `await import('../src/app.js?<tag>')` para tener un módulo con reservas nuevas; el seed es una sola reserva y `cancel.test.js` ya cancela Norte lun — coste: ninguno en producción
Task 2: complete (commits de7cc6f..703f11a, tests: node --test test/cancel.test.js → ℹ duration_ms 140.7653)
Task 3: complete (commits 703f11a..9bd14a3, tests: node --test test/cancel.test.js → ℹ duration_ms 160.3334)
Final: Eje Arquitectura: sin línea en el plan (se decide al despachar) · señales en el diff: ninguna (solo src/app.js y test/cancel.test.js; sin módulo nuevo, sin manifest, sin contrato entre módulos, sin datos persistentes) → no sale
Final: Ruling: Eje Arquitectura no — el plan no lleva línea y el diff no cruza ninguna de las cuatro señales — si me equivoco, un límite entre módulos queda sin revisar (el cambio son dos funciones de un fichero)
Final: fixed cancelar sin --motivo sin test (Spec Important 1) — test 'cancelar sin --motivo' falla con la mutación y pasa con el código, suite 8/8
Final: fixed camino 'sin reserva' sin test (Código Important 1, Spec Minor 1) — test 'cancelar una reserva que no existe con un motivo válido' falla con la mutación y pasa con el código, suite 8/8
Final: Ruling: --por sin valor o seguido de otra bandera (Código Important 2, Spec Minor 2) no se arregla en esta pasada — arreglarlo inventa un mensaje de error que la spec no dice (decisión que cambia la salida observable, freno de alcance) — coste: un 'quién canceló' falso o vacío si alguien teclea mal el comando; queda para ✋
Final: Ruling: la app guarda todo en memoria y cada ejecución de la CLI empieza vacía, así que 'canceladas' no enseña nada entre ejecuciones (Spec, declined to judge) — es el diseño actual de toda la app y la spec no pide persistencia — coste: la feature solo se ve dentro de un proceso; queda para ✋
Final: Ruling: imports con '?etiqueta' cargan un módulo nuevo — lo comprobé en esta sesión (los 3 tests con import dinámico dan verde y falla bajo mutación) — coste: ninguno
Final: Ruling: el RED de las Tasks 2 y 3 sí existió — salida fallando vista en esta sesión antes del código ('salas' ≠ línea esperada; falta '— Ana') — coste: ninguno
Final: minor (deferred): canceladas sin canceladas imprime una línea vacía (cambiaría la salida, no está en la spec)
Final: minor (deferred): CRLF→LF de src/app.js desde 8a11353 y finales mixtos en test/cancel.test.js
Final: minor (deferred): cancelBooking con 4 parámetros (posible Long Parameter List) y --por "" tratado como sin autor
Final: minor (deferred): el import con ?query no tiene un comentario que explique por qué
