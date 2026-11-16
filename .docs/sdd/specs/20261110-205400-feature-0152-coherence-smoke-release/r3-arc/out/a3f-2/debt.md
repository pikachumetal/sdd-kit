# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `test/ids.test.js` depende de un fichero de estado (`ids-store` en el directorio común de git): la primera ejecución falla con `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` y las siguientes pasan; verde en la rama y en `develop` en dos pasadas posteriores ("No se repite"), commit `d193ab0` | feature 0010 | 2026-11-11 |
| Workaround `node --test --test-concurrency=1` por la carrera de los tests sobre el almacén en memoria (Ruling de la Task 2 de la 0010): aislar el almacén por test y quitarlo | feature 0010 | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
