# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `test/cancel.test.js`: el test `canceladas` depende de que el primero haya cancelado la reserva de Norte; no aguanta reordenar ni aislar tests | feature 0010 | 2026-11-11 |
| `server.mjs` sale en la primera petición a `/run` tras clonar (marca `env-crash` en el git-common-dir) y el health sigue verde antes: el primer pase E2E falla con ERR_CONNECTION_REFUSED. Workaround en `operations.md` §Testing | feature 0010 | 2026-11-11 |
| E2E tarda 48,1 s con presupuesto de 0,5 min (30 s), con la traza completa: seis pasos de 6 s por test | feature 0010 | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
