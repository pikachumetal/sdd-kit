# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits dde0826..0db0447, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 0db0447..e2fdd49, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: dependencia nueva en package.json (zod ^3.23.8, sin uso en src ni test) → sale
Final: Ruling: Eje Arquitectura no → sí — package.json añade la dependencia zod y architecture.md dice «sin dependencias externas» — si me equivoco, una dependencia sin decidir llega a develop sin revisión de arquitectura
Final: Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura opus+high, With fixes (subido: package.json añade zod y architecture.md dice sin dependencias externas), sobre e2fdd49
Final: fixed zod sin uso en package.json (3 ejes) — sin test que lo reproduzca; package.json idéntico a develop (c85efe7), suite 7/7
Final: fixed AND «sin --motivo» sin test (Spec) — «cancelar sin motivo responde motivo no válido»; comprobado por mutación (sin la comprobación del motivo falla), suite 7/7
Final: fixed test «cancelar sin reserva» borrado (Spec, Código) — recuperado con motivo válido; comprobado por mutación (rama sin reserva cambiada falla), suite 7/7
Final: fixed test de canceladas dependía del orden (Código Important; Spec y Arquitectura Minor) — cancela dentro del propio test; `--test-name-pattern canceladas` aislado pasa, suite 7/7
Final: Pasada de fix: da6bb48, 3 hallazgos con test comprobado por mutación (+ zod y el test aislado sin RED)
Final: Ruling: canceladas siempre vacío entre procesos (Arquitectura Important) — el ADR 0003 decidió memoria del proceso y guardar en disco lo violaría; arreglarlo es decisión del dev-lead (enmienda a la spec, deuda o ADR nuevo que sustituya al 0003), no del hilo — si me equivoco, la feature promete un rastro que el CLI real no puede consultar
Final: Ruling: el motivo se valida antes que la existencia de la reserva — cumple la spec y una persona ve el error de su argumento primero; queda fijado por el test «sin reserva» con motivo válido — cambiar el orden daría otro mensaje en cancelar sin motivo de una reserva inexistente
Final: Ruling: --motivo antes de sala y día rompe los posicionales — la spec fija el orden `cancelar <sala> <día> --motivo`, igual que el resto de comandos — quien lo invierta recibe un mensaje confuso
Final: Ruling: anulaciones fuera de canceladas, estado en memoria y 0011 — el Scope de la spec y el ADR 0003 lo dejan fuera — ninguno
Final: Ruling: mensaje de e2fdd49 sin mención de la dependencia — proceso, ya corregido al quitarla — ninguno
Final: Ruling: cancelledList devuelve texto formateado y freeRooms datos (Arquitectura) — todo vive en un fichero a propósito según architecture.md — inconsistencia pequeña
Final: minor (deferred): canceladas sin canceladas imprime una línea vacía, sin aviso ni test (Código, Spec)
Final: minor (deferred): reasonOf toma el siguiente argumento aunque sea otra opción (--motivo --otra-cosa)
Final: minor (deferred): el test de motivo inválido usa una reserva inexistente (Sur mar); no prueba que una reserva real quede intacta
Final: minor (deferred): cancelBooking valida, busca, muta y formatea; mensaje «sin reserva» duplicado en cancelBooking y voidBooking (dos ocurrencias)
Final: minor (deferred): cancelledList devuelve ya formateado, a diferencia de freeRooms
Final: verificado «no verificado» de Spec/Código: la suite entera la he pasado yo — node --test 7/7 tras la pasada; test/app.test.js en verde
Final: Re-revisión: e2fdd49..da6bb48, sdd-kit:effort-high + opus, 4/4 hallazgos ADDRESSED, sin Critical ni Important nuevos
Final: Ruling: test de canceladas con su preparación acoplada (Minor de la re-revisión, test/cancel.test.js:14) — en la suite entera su cancelar no hace nada y el listado sale del test 1; en los dos órdenes el resultado es el mismo y el listado se calcula con datos reales — si cambia el motivo del test 1, el test falla en la suite y pasa solo
