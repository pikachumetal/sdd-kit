# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar pide un motivo de la lista | hecha | 83dc133 |
| Task 2 — El listado de canceladas enseña el motivo | hecha | dcb2660 |

Revisión final: Spec opus+high, With fixes (sin Critical ni Important; 2 minor, 1 sin verificar resuelto en el hilo) · Código sonnet+high, Yes · Arquitectura no (plan), sobre dcb2660

## Rulings

Final: Ruling: no verificado «el RED se vio fallar» — lo vi en el hilo (Task 1: 3 fallan, 1 pasa; Task 2: 2 fallan) y las copias RED quedaron idénticas al test commiteado; el ledger no lo registró — coste si me equivoco: ninguno, el código lo exigen los tests
Final: Ruling: decisión 2 ausente en la numeración de «Decisiones» de la spec — spec aprobada por el dev-lead; tocarla sería una desviación sin cambio de comportamiento observable; sube al mensaje final para que se aclare — coste si me equivoco: una decisión del dev-lead sin regla que la cubra
Final: Ruling: motivo inválido sobre una reserva inexistente responde «motivo no válido» — decisión 4 del plan, coherente con lista cerrada — coste si me equivoco: mensaje distinto en un caso raro
Final: Ruling: `--motivo` antes de los posicionales, repetido, en mayúsculas o sin comillas se rechaza o se lee mal — la spec fija la sintaxis `cancelar <sala> <día> --motivo <motivo>` y el mensaje lista los válidos — coste si me equivoco: un error de uso que se corrige releyendo el mensaje
Final: Ruling: la reserva «sigue activa» tras un motivo inválido depende del orden de los tests del fichero — decisión 7 del plan — coste si me equivoco: un test frágil si alguien reordena
Final: Ruling: `canceladas` solo lista `cancelled`, no `voided` ni otras columnas — alcance de la spec — coste si me equivoco: el responsable no ve las anulaciones hasta la 0011
Final: Ruling: CRLF→LF en test/cancel.test.js (formato) — sin efecto en comportamiento; no hay .gitattributes ni linter que lo fije — coste si me equivoco: diff ruidoso
Final: Ruling: partición de arquitectura (módulo, estado en memoria previo) — preexistente en la base — coste si me equivoco: ninguno para esta feature
Final: minor (deferred): test `canceladas enseña el motivo` depende del orden del fichero (estado compartido)
Final: minor (deferred): sin test de `--motivo` sin valor ni de `--motivo` antes de los posicionales
Final: minor (deferred): `run` es una cadena de `if` que crecerá con más comandos (valorar tabla de comandos)
