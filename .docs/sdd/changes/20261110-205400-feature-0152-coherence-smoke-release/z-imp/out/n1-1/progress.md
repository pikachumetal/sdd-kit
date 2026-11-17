# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: Ruling: trabajo en el checkout actual, rama `feature/0010-cancel-reason` (no `main`), sin worktree nuevo — el dev-lead está fuera y no puede dar el consentimiento que pide `sdd-worktrees`; la rama ya aísla de `main`/`develop` — si se equivoca: los commits están en la rama de la feature y se mueven con un `git worktree add` sin pérdida.
Setup: baseline `node --test` en worktree desprendido → 4/4 verde.
Setup: base `develop` = merge base 46101e8; sin cambios en ROADMAP.md ni en ficheros.
Setup: effort — Native, sin dispatch hasta la revisión final; se comprueba allí.

## Escaneo previo

| Par / Task | Produce vs consume | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 ↔ Task 2 (`src/app.js`, `test/cancel.test.js`) | T1 guarda el motivo en la reserva cancelada; T2 lo lee para `canceladas` | El nombre del campo lo fija T1 (`reason`); T2 lo consume. Estado del módulo compartido entre tests del mismo fichero: el orden importa | T2 depende del cancel con «sala ocupada» de T1; los tests de motivo inválido van antes del cancel válido |
| Task 1 (consigo misma) | Tests existentes de `test/cancel.test.js` llaman `cancelar Norte lun` sin `--motivo` y esperan `cancelada Norte lun` | Contradicen el AND de la spec «sin `--motivo` responde motivo no válido» | Ver Ruling T1-a |
| Task 2 (consigo misma) | Ficheros y verificación coherentes | Sin hallazgo | — |
| Global (texto en castellano) | — | Sin hallazgo | — |

Task 1: Ruling: T1-a — los dos tests previos de `test/cancel.test.js` pasan `--motivo "sala ocupada"`/`"otro"` y el de «sin reserva» sigue probando lo mismo con un motivo válido — la spec (AND sin `--motivo`) manda sobre el comportamiento anterior; sin tocarlos el gate quedaría rojo — si se equivoca: el dev-lead quería conservar cancelar sin motivo, y eso contradice la spec aprobada.
Task 1: Ruling: T1-b — el motivo se valida antes de buscar la reserva (`cancelar Sur mar` sin motivo → «motivo no válido…») — la spec dice «sin `--motivo` responde lo mismo» sin condición; el caso sin reserva y sin motivo no lo fija — si se equivoca: cambia qué mensaje sale cuando faltan las dos cosas; un test lo fija.
Task 1: Ruling: T1-c — la spec marca «MODIFIED» en sus señales pero el delta solo trae ADDED; el cambio de `cancelar` sin motivo queda dentro del AND aprobado, no amplío el delta — si se equivoca: la fusión en capabilities tendría que marcar MODIFIED el requisito de cancelar.
Task 1: complete (commits 098686b..2313ba5, tests: node --test test/cancel.test.js → ℹ duration_ms 97.1084)
Task 2: Ruling: T2-a — con varias canceladas, `canceladas` saca una línea por reserva (`\n`), y sin ninguna, salida vacía — la spec solo fija el caso de una — si se equivoca: cambia el separador o falta un mensaje «ninguna cancelada»; un cambio de una línea.
Task 2: Ruling: T2-b — `canceladas` lista solo el estado `cancelled`, no las `voided` de `anular` — la spec dice «reservas con estado cancelada» y las anulaciones son de la 0011 — si se equivoca: las anuladas no aparecen en el listado.
Task 2: Ruling: T2-c — el test de `canceladas` depende del cancel del test anterior (estado del módulo compartido en el fichero) y lo dice en un comentario — `src/app.js` no ofrece reiniciar el estado y añadirlo sería generalidad especulativa — si se equivoca: reordenar los tests rompe ese test.
Task 2: complete (commits 2313ba5..d13b4ac, tests: node --test test/cancel.test.js → ℹ duration_ms 88.0152)
Final review: self-review (no subagent tool) — sin herramienta de subagentes en la sesión; `Workflow` exige opt-in explícito del usuario. Ejes Spec y Código como pasadas separadas sobre 098686b..d13b4ac.
Final: Eje Arquitectura: sin línea en el plan · señales en el diff: ninguna (sin módulo nuevo, sin manifiesto tocado, sin contrato entre módulos, `reason` es un campo en memoria) → no sale
Final: Ruling: Eje Arquitectura decidido al despachar (el plan no trae la línea) → no — ninguna de las cuatro señales — si se equivoca: falta mirar la frontera del campo `reason` con el almacén de la 0014.
Final: Spec — THEN y AND de los dos ADDED implementados y con test en `test/cancel.test.js`; decisión 1 (lista cerrada) cubierta por `cancelReasons`; Review Focus «ninguna»; sin ADRs; sin hallazgos Critical/Important.
Final: Código — sin hallazgos Critical/Important.
Final: Ruling: (declinado) `canceladas` desde la CLI en un proceso nuevo sale vacío: el estado vive en memoria y `cancelar` tampoco persiste desde antes — guardar el motivo es la 0014 («Motivo guardado») y la spec fija la prueba en `test/cancel.test.js`; añadir almacén aquí ampliaría el Scope — si se equivoca: el dev-lead prueba `canceladas` en la shell y no ve nada hasta la 0014.
Final: Ruling: (declinado) `canceladas` sin canceladas devuelve una línea vacía — la spec no lo fija; ver T2-a — si se equivoca: falta un mensaje «ninguna cancelada».
Final: Ruling: borrador de cierre — el bloque «Capacidades» de la spec decía «Modificadas: bookings» sin `capabilities/bookings.md`; `capability merge` fallaba. Lo cambio a «Nuevas» sin commit, para `sdd-archive` — el delta solo trae ADDED y no hay capacidad previa; no toca requisitos ni THEN — si se equivoca: `bookings` existía fuera de `capabilities/` y habría que fusionar como MODIFIED.
Final: minor (deferred): `test/cancel.test.js` pasa de CRLF a LF en el blob (autocrlf=true), y el diff del fichero sale entero.
Final: minor (deferred): el test de `canceladas` depende del orden respecto al cancel válido (estado del módulo compartido); ver T2-c.
