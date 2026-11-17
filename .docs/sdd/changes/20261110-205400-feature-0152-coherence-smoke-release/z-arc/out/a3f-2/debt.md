# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `test/ids.test.js` rojo la primera vez en un clon: depende de `ids-store` en el directorio común de git (sin él, `id` es `undefined`). Error: `TypeError [Error]: Cannot read properties of undefined (reading 'trim')`. No se repite: el fichero solo y la suite entera, verdes en la rama y en `develop` | cierre 0010 | 2026-11-12 |
| Las reservas viven en memoria: `canceladas` desde la CLI en una invocación nueva sale vacío | cierre 0010 | 2026-11-12 |
| El test de `canceladas` depende de la cancelación del primer test y falla si corre solo o en otro orden (workaround, ruling de la Task 2) | cierre 0010 | 2026-11-12 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
