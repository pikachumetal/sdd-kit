# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 85f2c0a |
| 2 — Listado de canceladas | hecha | 9eea260 |

Revisión final: Spec opus+high, con arreglos (3 Minor) · Código sonnet+high, con arreglos (1 Important regradado a Minor, 5 Minor) · Arquitectura no (plan), sobre 9eea260

## Rulings

- Ruling: los dos tests viejos de `cancelar` (sin --motivo) se reescriben en T1 — la spec manda: sin --motivo responde «motivo no válido» — coste si falla: un test de más que tocar.
- Ruling: motivo se valida antes de buscar la reserva; «sin reserva» solo con motivo válido — la spec no fija el orden — coste: cambiar el orden de dos ifs.
- Ruling: un motivo inválido no cancela la reserva — la spec dice solo el mensaje, y cancelar sin motivo válido contradice «pide un motivo» — coste: una línea.
- Ruling: los tests comparten el estado del módulo, así que el orden de los tests en el fichero importa (inválidos antes del válido) — coste: reordenar.
- Final: Ruling: Eje Arquitectura no — ninguna de las cuatro señales — coste: un límite de módulos sin mirar
- Final: Ruling: Code Important «tests dependen del orden por el estado de módulo» regradado a Minor — efecto solo en la fragilidad del fichero de tests, ninguno en quien usa el programa; el arreglo de fondo (reiniciar `bookings`) es un cambio de diseño fuera del plan, y los RED son contrato — coste si me equivoco: un test falla al reordenar o aislarlo
- Final: Ruling (Declined to judge): validación antes de búsqueda — la spec no lo fija y quien cancela con motivo malo espera el aviso del motivo — coste: cambiar dos ifs
- Final: Ruling (Declined to judge): `canceladas` vacío imprime línea en blanco — la spec no define el caso; una persona vería una línea vacía sin saber si funcionó — coste: un mensaje; queda como pregunta al dev-lead
- Final: Ruling (Declined to judge): el estado vive en memoria, así que `canceladas` en otra invocación de la CLI sale vacía — anterior a la rama y fuera del delta — coste: el Intent «dejar rastro» solo se cumple dentro de un proceso; el dev-lead debe saberlo
- Final: Ruling (Declined to judge): resto (anular sin motivo, mayúsculas, «otro» libre, parseo posicional) — fuera del Scope o anterior a la rama — coste: ninguno en esta feature
- Task 1: Ruling: los Minor del revisor de la Task 1 no abren ronda — no son Critical ni Important — coste: regresión sin test

## Deferred minors

- Final: minor (deferred): test «motivo inválido no cancela» solo indirecto
- Final: minor (deferred): sin test de que `canceladas` excluye las anuladas ni del caso vacío
- Final: minor (deferred): readReason con indexOf+includes, orden de declaraciones en app.js
- Final: minor (deferred): test/cancel.test.js cambió CRLF→LF y el diff lo reescribe entero
