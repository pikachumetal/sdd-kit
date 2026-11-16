# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| El ruling de la 0010 (`--test-concurrency=1` por una «carrera sobre el almacén») no tiene causa diagnosticada: la suite pasa sin él y `node --test` ya aísla por fichero; el test de `canceladas` depende del orden del test anterior (`test/cancel.test.js`) | feature 0010 | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2E: el servidor de la suite cae en la primera petición a `/run` y el siguiente intento da `ERR_CONNECTION_REFUSED` | prueba o molde | feature 0010 | un gate de cierre en rojo sin que falle ningún test | `e2e/cancel.e2e.mjs`: 7 fallos `page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:62814/` (`gate-e2e` del 2026-11-11); el fichero solo, en la rama y en `develop`, en verde (5/5 y 3/3) | tras `env-up`, repetir el gate: la marca `env-crash` ya existe y no vuelve a caer (ver `operations.md`, «Entorno de la suite»); `server.mjs` sale en el primer `/run` aunque `/health` responda ok | comprobación automática | sin fila |
