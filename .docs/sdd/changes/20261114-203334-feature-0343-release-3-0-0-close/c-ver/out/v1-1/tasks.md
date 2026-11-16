# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 14a9dd3 |
| 2 — Listado de canceladas | hecha | fcd5489 |

## Rulings

- Task 2: Ruling: el código de `canceladas` llegó escrito antes que el test visto en RED, con `-` en vez de la `—` de la spec — se descartó y se reescribió desde el test (RED: responde `salas`; GREEN con `—`) — coste si me equivoco: ninguno, eran 4 líneas.
- Task 2: Ruling: el test de `canceladas` no cancela antes, depende de que el test anterior haya cancelado Norte lun con «sala ocupada» (estado de módulo compartido) — se deja tal cual, es el assert del THEN de la spec y no se cambia — coste si me equivoco: el test falla si se ejecuta aislado o se reordena.
- Task 1: Ruling: sin ledger previo — la Task 1 se da por hecha por su commit 14a9dd3 — coste: no se re-verificó su RED.
