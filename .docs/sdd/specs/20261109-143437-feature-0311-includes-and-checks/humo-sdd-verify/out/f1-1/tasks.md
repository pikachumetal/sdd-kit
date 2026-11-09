# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 18b2685 |
| 2 — Listado de canceladas | hecha | 057c66b |

Revisión final: Spec opus+high, con arreglos (0 Critical, 2 Important) · Código sonnet+high, con arreglos (0 Critical, 2 Important) · Arquitectura no (plan), sobre 057c66b
Pasada de fix: 4e2a3f9, 3 hallazgos con test (sin RED: el comportamiento ya existía)
Re-revisión: 057c66b..4e2a3f9, sdd-kit:effort-high + opus, todos los hallazgos resueltos, 2 Minor juzgados

## Rulings

Final: Ruling: motivo borrado de «cancelar sin reserva lo dice» en 18b2685 sin ruling — se sustituyó porque la sintaxis cambió; ahora se repone con la sintaxis nueva — coste si me equivoco: ninguno, el test existe
Final: Ruling: Declined (Spec) voidBooking/anular sin motivo — es la 0011, la spec lo deja fuera — coste: la anulación no deja rastro hasta la 0011
Final: Ruling: Declined (Spec) el motivo distingue mayúsculas — encaja con una lista cerrada y el mensaje enseña los valores — coste: «Sala ocupada» se rechaza
Final: Ruling: Declined (Spec) argumentos de posición con --motivo antes de sala y día — la spec fija la sintaxis — coste: error poco claro si se invierte el orden
Final: Ruling: Declined (Spec) «Decisiones» salta del 1 al 3 en spec.md — la spec está aprobada, tocarla es una enmienda — coste: confusión de numeración
Final: Ruling: Declined (Spec) cancelBooking exportado exige el motivo — nadie lo llama fuera de run — coste: ninguno hoy
Final: Ruling: Declined (Código) lista cerrada y vacío — asunto de la capa Spec, ya cubierto arriba — coste: ninguno
Final: Ruling: Declined (Código) tests escritos primero, voidBooking sin motivo, estructura en memoria — ADR 0003 y 0011 lo cubren — coste: ninguno
Final: Ruling: no verificado (Spec) gate de cierre node --test — lo corrí yo en esta sesión: 5/5 antes del fix y 7/7 después — coste: ninguno
Final: Ruling: no verificado (Spec) cómo se comporta el CLI con o sin comillas — lo tomo como minor diferido, no ejecuté la app — coste: --motivo sala ocupada sin comillas se lee como «sala» y se rechaza
Final: minor (deferred): canceladas vacío imprime una línea en blanco; sugerir «sin canceladas»
Final: minor (deferred): --motivo sin comillas toma solo la primera palabra («sala ocupada» → «sala»)
Final: minor (deferred): falta --motivo y motivo inválido comparten un solo mensaje
Final: minor (deferred): con motivo inválido y sin reserva se informa del motivo antes que de la reserva
Final: minor (deferred): 'active'/'cancelled'/'voided' repetidos, posible constante
Final: minor (deferred): voidBooking y cancelBooking comparten búsqueda, sin abstraer aún
Final: Ruling: re-revisión Minor — tres tests de cancel.test.js dependen del orden del fichero por el estado en memoria compartido — node:test ejecuta en orden de declaración y arreglarlo exige un reset exportado en src/app.js, fuera del alcance — coste si me equivoco: reordenar tests puede romperlos
Final: Ruling: re-revisión Minor — `canceladas === ''` no prueba por sí solo que la reserva siga activa — la cancelación válida posterior del mismo fichero lo cubre en orden — coste si me equivoco: un estado intermedio erróneo pasaría
