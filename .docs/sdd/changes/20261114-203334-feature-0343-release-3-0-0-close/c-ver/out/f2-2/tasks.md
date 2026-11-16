# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | c9b0f2c |
| 2 — Listado de canceladas | hecha | 85ce010 |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura opus+high, With fixes (subido: dependencia nueva zod en package.json), sobre 85ce010
Pasada de fix: eca92ed, 4 hallazgos RED→GREEN
Re-revisión: 85ce010..eca92ed, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin roturas nuevas Critical/Important

## Rulings

Final: Ruling: Eje Arquitectura no → sí — el diff añade una dependencia que architecture.md («sin dependencias externas») y la ADR 0003 no preveían — si me equivoco, un eje opus+high de más
Final: Ruling: la revisión sale con el paquete de la receta excluyendo .docs/sdd/specs/<feature>/ (esta repo guarda las specs en specs/, no en changes/) — si me equivoco, el revisor lee la spec dos veces
Final: Ruling: Importantes de los tres ejes entran en UNA pasada de fix: (1) zod sin uso en package.json [Spec, Code, Arquitectura], (2) test «cancelar sin reserva» borrado [Code, Spec], (3) THEN «sin --motivo» sin test [Spec], (4) test canceladas dependiente del orden [Code Important; Spec Minor re-graded a Important: rompe con --test-name-pattern] — si me equivoco, un test de más
Final: minor (deferred): canceladas vacío imprime línea en blanco (src/app.js:36) [Code, Spec]
Final: minor (deferred): el test de motivo inválido usa Sur mar (sin reserva) y no prueba que una reserva activa sigue activa [Spec]
Final: minor (deferred): literales 'active'/'cancelled'/'voided' repetidos en src/app.js [Code]
Final: minor (deferred): cancelBooking/cancelledList devuelven texto de interfaz mezclado con la regla [Arquitectura]
Final: minor (deferred): la «Confirmación» de la ADR 0003 no detecta dependencias en package.json [Arquitectura, recomendación]
Final: minor (deferred): spec.md numera «Decisiones que he tomado yo» 1 y 3, sin 2 [Spec]
Final: Ruling: declinado — cancelar valida el motivo antes de buscar la reserva — una reserva inexistente con motivo malo dice «motivo no válido»; la persona corrige el motivo y luego ve «sin reserva»; ambos órdenes son razonables — coste: un mensaje menos útil en ese cruce
Final: Ruling: declinado — CHANGELOG sin entrada de la 0010 — lo añade sdd-archive al cerrar — coste: ninguno si el cierre corre
Final: Ruling: declinado — README no documenta cancelar --motivo / canceladas — el README no documenta comandos hoy y la spec no lo pide — coste: descubribilidad
Final: Ruling: declinado — el motivo se pierde al cerrar el proceso — ADR 0003 (memoria); la persistencia es otra fila del roadmap — coste: ninguno para esta feature
Final: Ruling: declinado — canceladas sin agrupar ni total, y anuladas fuera del listado — filas 0012 y 0011 del roadmap, el «No entra» de la spec — coste: ninguno
Final: Ruling: declinado — motivo de varias palabras sin comillas (--motivo sala ocupada) — el shell lo parte y la persona ve la lista de motivos válidos; aceptable — coste: un intento fallido
Final: Ruling: declinado — --motivo como último argumento o seguido de otra opción — cae en «motivo no válido: …» con la lista; aceptable — coste: mensaje genérico
Final: Ruling: declinado — la regla 24 h de PRODUCT.md — anterior a esta feature, ni spec ni plan la tocan — coste: ninguno
Final: Ruling: declinado — anular no pide motivo — fuera de alcance, es la 0011 — coste: ninguno
Final: Ruling: declinado — si los tests borrados eran RED del hilo — eran de la patch 0007/base, no de los RED de esta feature; se restaura el de «sin reserva» con motivo válido — coste: ninguno
Final: minor (deferred): el GIVEN de «canceladas» no comprueba su respuesta y depende del orden en cuánto devuelve (test/cancel.test.js:22) [re-revisión]
Final: minor (deferred): «sin --motivo» no comprueba que una reserva activa sigue activa (test/cancel.test.js:14) [re-revisión]
Final: Ruling: estado de bookings a nivel de módulo, sin reset — acoplamiento entre tests; se rodea en el test de canceladas sin tocar src — la ADR 0003 dice «los tests no limpian nada» y un reset es API nueva fuera del plan — coste: tests acoplados si crece el fichero
