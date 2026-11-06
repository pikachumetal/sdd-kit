# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar pide un motivo de la lista | hecha | 1c1a034 |
| 2 — El listado de canceladas enseña el motivo | hecha | d556e97 |

Revisión final: Spec opus+high, con arreglos (0 Critical/Important, 4 Minor) · Código sonnet+high, con arreglos (0 Critical/Important, 6 Minor) · Arquitectura no (plan), sobre d556e97

## Rulings
Final: minor (deferred): espacio faltante tras `:` en listCancelled (src/app.js)
Final: minor (deferred): `params[params.indexOf('--motivo') + 1]` lee params[0] si no hay --motivo; hoy se rechaza porque ninguna sala está en REASONS
Final: minor (deferred): `canceladas enseña el motivo` depende del orden de los tests de cancel.test.js
Final: minor (deferred): el test `cancelar sin motivo lo rechaza y no cancela` solo comprueba el mensaje
Final: minor (deferred): cancel.test.js cambió de finales de línea (CRLF→LF) según el revisor
Final: minor (deferred): Review Focus nombra `un motivo inválido no cancela la reserva`, que no existe; lo cubre el orden de los tests
Final: minor (deferred): `canceladas ignora las anuladas` no comprueba el resultado de `anular`
Final: minor (deferred): falta test de `--motivo ""`
Final: Ruling: `canceladas` por el CLI siempre responde `sin canceladas` en otra invocación (reservas solo en memoria; el plan §1.2 declara «Sin persistencia») — la spec prueba por `run`, añadir persistencia sería ampliar el alcance — coste si me equivoco: el dev-lead no puede ver el listado desde la terminal hasta que haya una feature de persistencia
Final: Ruling: sin pasada de fix — 0 Critical/Important y `review.minors` no es `fix` — coste si me equivoco: los 7 Minor diferidos quedan en la rama
