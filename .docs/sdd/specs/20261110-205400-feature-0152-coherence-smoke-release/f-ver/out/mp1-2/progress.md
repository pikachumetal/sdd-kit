# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits c4e137c..d112274, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits d112274..501fb0f, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: datos — src/app.js (campo `reason` nuevo en el registro de reserva) → sale
Final: Ruling: Eje Arquitectura no → sí — el diff añade el campo `reason` a la reserva (señal de datos) y la propia spec lo cuenta como señal — si sobra, una revisión opus de más sobre 19 líneas
Final: axes returned — Spec opus+high: With fixes (2 Important, 4 Minor, 1 no verificado) · Código sonnet+high: With fixes (2 Important, 4 Minor) · Arquitectura: pendiente de confirmación del usuario
Final: regrade — Spec I1 (sin --motivo sin test) Important · Spec I2 / Código I2 (test de «sin reserva» perdido) Important · Código I1 / Spec M4 (test de canceladas depende del orden) Important en Código, entra en la pasada · Código M4 = Spec I1
Final: minor (deferred): el test del motivo no válido usa Sur mar y no comprueba que la reserva siga activa (Spec M3)
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía — un mensaje nuevo cambia la salida observable y la spec no lo fija (Spec M5 / Código M1)
Final: minor (deferred): la spec etiqueta ADDED lo que es MODIFIED de `cancelar` y la lista de decisiones salta del 1 al 3 — corregirlo es enmienda de la spec (Spec M6)
Final: minor (deferred): sin `--motivo` y motivo inválido dan el mismo mensaje — es lo que fija la spec (Código M2)
Final: minor (deferred): `reasonOf` depende de la posición de `--motivo` y su nombre es genérico (Código M3)
Final: Ruling: persistencia entre ejecuciones (Spec, declined) — las reservas viven en memoria desde la base; `canceladas` en otro proceso sale vacío, como ya pasaba con `cancelar` y `anular`; persistir es otra feature y cambiaría la arquitectura — si el dev-lead esperaba ver el listado entre ejecuciones, la feature no le sirve en la CLI real: propongo apuntarlo en debt.md
Final: Ruling: orden de argumentos de `cancelar` (Spec, declined) — la spec fija `cancelar <sala> <día> --motivo <motivo>`; otro orden da «sin reserva …», coherente — poco coste
Final: Ruling: motivo sin comillas en la shell (Spec, declined) — llega partido y se rechaza con la lista válida, que orienta al usuario — poco coste
Final: Ruling: subida del eje Arquitectura (Spec, declined) — es del hilo, ya en el ledger — ninguno
Final: Ruling: valores de `reasons` (Código, declined) — el eje Spec los comprobó contra la decisión 1 — ninguno
Final: Ruling: `canceladas` y las anuladas (Código, declined) — la 0011 queda fuera del Scope y su estado `voided` no sale — ninguno
Final: Ruling: tests de la base reescritos (Código, declined) — eran tests de la base cuya conducta cambió la spec; no eran RED de esta feature; la cobertura perdida de «sin reserva» entra en la pasada de fix — poco coste
Final: Ruling: estado de módulo y `process.argv` al importar (Código, declined) — están en la base y no los toca el diff — deuda previa
Final: Ruling: forma repetida de `cancelBooking` y `voidBooking` (Código, declined) — dos apariciones, ya en la base — ninguno
Final: Ruling: no verificado «el test borrado era la regresión del patch 0007» (Spec) — da igual: la pasada de fix restaura el caso «sin reserva» con un motivo válido — ninguno
