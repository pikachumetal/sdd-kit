# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 23ee0f5 |
| 2 — Listado de canceladas | hecha | eb236ef |

Revisión final: Spec opus+high, sin Critical ni Important (5 Minor) · Código sonnet+high, sin Critical ni Important (5 Minor) · Arquitectura no (plan), sobre 11539d8

## Rulings

- Ruling: método SDD — el plan declara `Ejecución: subagent` y manda sobre `execution: native` de sdd-kit.json — si me equivoco cuesta más tokens, no calidad.
- Ruling: pre-flight T1 — el test existente de `cancelar` sin motivo se reescribe a `--motivo`, y se añade el caso sin motivo (spec AND 3); el contrato es la spec — si me equivoco cuesta un test.
- Ruling: pre-flight — `--motivo` se parsea de `params`: `params[0]`=sala, `params[1]`=día, valor tras `--motivo`; `voidBooking` y `anular` no se tocan (0011 fuera de Scope) — coste: ninguno.
- Task 1: minor (deferred): los tests comparten estado de módulo (`bookings`); el 2º y 3º pasan porque el motivo se valida antes de buscar la reserva — frágil si cambia el orden.
- Task 1: minor (deferred): tasks.md decía «pendiente» en el commit de la task — se actualiza en el commit de Task 2.
- Task 2: Ruling: el RED de canceladas depende del estado que deja el test de cancelar con motivo (Norte lun ya cancelada, mismo fichero, orden de node:test) — es el GIVEN literal de la spec — si me equivoco cuesta aislar el estado en un reset de test
- Task 2: minor (deferred): `canceladas` sin canceladas devuelve '' (la CLI imprime línea en blanco); la spec calla.
- Task 2: minor (deferred): sin test de varias canceladas ni de exclusión de `voided`; la spec no lo pide.
- Final: Ruling: Eje Arquitectura no — plan sin línea y diff sin señales — si me equivoco, falta una pasada de arquitectura sobre un cambio de 2 funciones en un fichero
- Final: Ruling: no verificado «decisión nº 2 de la spec» (la numeración salta del 1 al 3 desde 986186a) — no hay nada que implementar sin saber qué decía; se pregunta al dev-lead en la validación — cuesta una decisión sin aplicar si existía.
- Final: Ruling: declined «persistencia entre invocaciones de la CLI» — `bookings` es un array en memoria del que ya partía la base (cancelar, anular y reservar tampoco persisten), así que `canceladas` en un proceso aparte siempre sale vacía; la spec y el Approach no piden almacenamiento y añadirlo cambia el alcance — cuesta que la Intent («que quede rastro») solo se cumpla dentro de un proceso hasta que se decida la persistencia (ver ✋).
- Final: Ruling: declined «orden de argumentos» (`cancelar --motivo otro Norte lun`) — la spec fija la sintaxis `<sala> <día> --motivo <motivo>` — cuesta un mensaje «sin reserva --motivo otro» si alguien invierte el orden.
- Final: Ruling: declined «motivo se valida antes que la reserva» (`cancelar Sur mar` sin motivo responde motivo no válido, no sin reserva) — la spec no ordena los dos errores y ninguna respuesta engaña — cuesta una respuesta distinta si se quisiera el orden inverso.
- Final: Ruling: declined «coincidencia exacta del motivo» (mayúsculas, sin comillas) — es coherente con la lista cerrada de la decisión nº 1 y el mensaje enseña los valores — cuesta rechazar «Sala ocupada».
- Final: Ruling: declined «volver a cancelar una reserva ya cancelada» — responde «sin reserva …» y no pisa el motivo; la spec no lo trata — cuesta nada visible.
- Final: Ruling: declined (Código) «datos: booking.reason por mutación» — frontera de módulos, eje Arquitectura que no salió (ver su ruling) — cuesta una pasada de arquitectura que no se hizo.
- Final: Ruling: declined (Código) «¿los tests se escribieron en RED?» — el hilo los escribió y vio fallar 3/4 y 1/1 antes de cada implementación — cuesta nada.
- Final: minor (deferred): los tests AND 2 y 3 se corren sobre Norte lun ya cancelada y nada fija que un rechazo deje la reserva activa y sin reason (Spec, Minor 1).
- Final: minor (deferred): ningún test acepta `cambio de planes` (Spec, Minor 3).
- Final: minor (deferred): `canceladas` dependiente del estado del test anterior (Spec 2, Código 2).
- Final: minor (deferred): `canceladas` sin canceladas devuelve '' → línea en blanco; sin test del caso vacío (Spec 4, Código 3).
- Final: minor (deferred): sin test de varias canceladas ni de exclusión de voided (Spec 5).
- Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF y el diff lo enseña entero (Código 1).
- Final: minor (deferred): `reasonFromParams` entre las funciones de cancelar; `--motivo` último sin valor sin test (Código 4 y 5).

Re-revisión: 11539d8..91df09c, sdd-kit:effort-high + opus, sin Critical ni Important (3 Minor de redacción de este fichero, diferidos)
