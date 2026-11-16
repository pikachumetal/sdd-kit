# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha (revisión limpia) | 1ba3ba8 |
| 2 — Listado de canceladas | hecha (revisión limpia) | cdbad71 |

Revisión final: Spec opus+high, con arreglos (0 Critical, 0 Important, 3 Minor) · Código sonnet+high, con arreglos (0 Critical, 0 Important, 6 Minor) · Arquitectura no (plan), sobre cee5200

## Rulings

- Ruling: el test existente «cancelar una reserva activa» se sustituye por los tests del motivo — la spec manda (sin --motivo → motivo no válido) y test/cancel.test.js está en «Ficheros» de T1 — coste si me equivoco: recuperar el test viejo.
- Ruling: los tests de T1 validan los casos inválidos antes de la cancelación válida, y el test de T2 se apoya en la cancelación de T1 (mismo módulo, orden secuencial de node:test) — evita añadir un reset que la spec no pide — coste: tests acoplados por orden.
- Ruling: el plan no fija Modelo/effort por task: implementadores `sonnet` con `sdd-kit:effort-low` (1 fichero, spec completa) y revisores `sonnet` con `sdd-kit:effort-medium` — coste: más rondas si queda corto.
- Ruling: sdd-kit.json dice execution native; el plan dice subagent y decide el plan — coste: más tokens.
- Ruling: tasks.md (untracked) entra en el commit de la Task 2 — el de la Task 1 ya está revisado y cerrado — coste: ninguno.
- Ruling: el plan no lleva `Eje Arquitectura`; lo decido por las señales del diff (ninguna) — coste si me equivoco: una frontera sin revisar en un cambio de 2 funciones
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea en blanco (spec y Código lo señalan; el Spec axis lo recomienda arreglar antes del merge)
- Final: minor (deferred): ningún test fija el filtro `status === 'cancelled'` ni la exclusión de `voided`
- Final: minor (deferred): `--motivo` solo funciona como sufijo (sala/día por posición)
- Final: minor (deferred): motivo con espacios exige comillas; sin hint en el error
- Final: minor (deferred): tests acoplados por orden (ya Ruling); casos sin test: `--motivo` sin valor, doble cancelación
- Final: minor (deferred): EOL de test/cancel.test.js (autocrlf de Windows, ruido del diff)
- Final: Ruling: no arreglo el mensaje de lista vacía aunque el Spec axis lo recomiende — añadir un texto nuevo es un THEN que la spec no tiene (desviación, no pulido) y el dev-lead no lo ha aprobado — coste si me equivoco: una línea en blanco en `canceladas` hasta que se enmiende la spec
- Final: Ruling: sin pasada de fix ni re-revisión — 0 Critical y 0 Important en los dos ejes, y `review.minors` no está en `fix` — coste: Minors vivos al merge, listados en «Deferred minors»
