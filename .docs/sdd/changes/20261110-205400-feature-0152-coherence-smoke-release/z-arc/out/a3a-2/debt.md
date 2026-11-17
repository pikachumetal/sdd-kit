# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| Test flaky: `test/store.test.js` («el almacén guarda una reserva») falló una vez con `Error: EBUSY: resource busy or locked, open 'data/bookings.json'` y no se repite: verde solo en la rama (`aab7e3c`..`6f18d63`) y en un worktree detached de `develop` (`dc69709`) | cierre de la 0010 (`specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md` 4.1) | 2026-11-12 |
| El test de `canceladas` depende del orden: reutiliza la cancelación del primer test de `test/cancel.test.js` y falla si corre solo | ruling de la Task 2 de la 0010 | 2026-11-12 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
