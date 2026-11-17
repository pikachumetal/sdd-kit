# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 12f3e92 |
| 2 — Listado de canceladas | hecha | bf7004c |

Revisión final: pendiente — no hay forma de despachar un revisor en esta sesión.

## Rulings

1. «Quién canceló» = el cliente titular de la reserva (glosario: la cancelación la hace el propio cliente). La reserva de Norte lun lleva `owner: 'Ana'`; `cancelar` no recibe quién cancela.
2. `cancelar` sin `--motivo` responde «motivo no válido: …»: la spec dice que cancelar «pide» un motivo y no fija el caso. El motivo se valida antes que la existencia de la reserva.
3. `canceladas` sin ninguna cancelada devuelve cadena vacía: la spec no lo fija.
4. Los tests de `test/cancel.test.js` van en orden (el estado vive en el módulo); los dos tests previos de `cancelar` se reescribieron porque ya exigen motivo.
