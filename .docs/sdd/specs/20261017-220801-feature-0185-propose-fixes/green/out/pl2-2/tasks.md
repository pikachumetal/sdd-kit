# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | ✅ | 7abf175 |
| 2 — Listado de canceladas | ✅ | 9db9440 |

Revisión final: Spec opus+high, con arreglos (solo Minor) · Código sonnet+high, Yes (solo Minor) · Arquitectura no (plan), sobre 9db9440

## Rulings

- (ninguno)

## Deferred minors

- `listCancelled` lista en orden de creación; la decisión 5 del plan dice «orden en que se cancelaron». Latente: solo hay una reserva.
- Ningún test fija que las anuladas (`voided`) no salen en `canceladas`; queda para 0011.
- El anexo de la spec dice «Se conserva» para «la reserva de otra persona no se toca», pero el código no tiene propietario; corregir en el walkthrough.
- Los tests de `cancel.test.js` dependen del orden por el estado compartido en memoria.
