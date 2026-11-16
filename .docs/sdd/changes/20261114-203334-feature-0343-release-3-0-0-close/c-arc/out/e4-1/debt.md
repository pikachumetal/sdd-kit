# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| Suite E2E fuera de presupuesto: 48,2 s de 0,5 min (`node e2e/run.mjs`, 7 tests) | 0010, `walkthrough.md` 4.3 | 2026-11-15 |
| El servidor de la suite cae en la primera petición `/run` si falta el marcador `env-crash` del directorio común de git: la primera pasada E2E tras levantar el entorno falla entera (`ERR_CONNECTION_REFUSED`) aunque `/health` dé `ok`. Aviso en `operations.md` §Testing «Aviso del entorno» | 0010, `walkthrough.md` 4.1 | 2026-11-15 |
| El test «canceladas enseña sala, día y motivo» de `test/cancel.test.js` depende de la cancelación del primer test: falla si corre solo o en otro orden (workaround del ruling de la Task 2) | 0010, `walkthrough.md` 3 | 2026-11-15 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
