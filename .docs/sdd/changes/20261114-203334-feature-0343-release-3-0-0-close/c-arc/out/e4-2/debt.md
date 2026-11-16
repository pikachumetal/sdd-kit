# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| El test `canceladas enseña sala, día y motivo` de `test/cancel.test.js` depende de la cancelación del primer test y falla solo (`node --test --test-name-pattern="canceladas" test/cancel.test.js`); arreglo: que prepare su propia cancelación, y un chequeo que corra cada test aislado | ruling de la Task 2, feature 0010 (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md`) | 2026-11-15 |
| La suite e2e tarda 48,3 s y su «Presupuesto E2E» es 0,5 min (7 tests de ~6 s cada uno) | cierre de la feature 0010 | 2026-11-15 |
| El entorno de la suite cayó entre `node scripts/env-up.mjs` (con su `/health` en `ok`) y la primera pasada del e2e: 7 tests con `page.goto: net::ERR_CONNECTION_REFUSED`; levantado de nuevo, verde | cierre de la feature 0010 (el commit `ef6a995` ya tocó este arranque) | 2026-11-15 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
