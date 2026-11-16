# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `test/ids.test.js` («una reserva nueva lleva su id») depende de un fichero `ids-store` en el directorio común de git: sin él falla con `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` y la segunda pasada es verde; también falla así en un worktree de `develop` sin el fichero. Con el fichero, el fichero solo y la suite entera pasan en la rama y en la base | cierre 0010 ([walkthrough](../specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | 2026-11-11 |
| Workaround `node --test --test-concurrency=1` en el gate, por la carrera de los tests sobre el almacén compartido en memoria: arreglo, aislar el almacén por test; coste, la suite tarda el doble | cierre 0010 ([ruling de la Task 2](../specs/20261008-100000-feature-0010-cancel-reason/tasks.md)) | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
