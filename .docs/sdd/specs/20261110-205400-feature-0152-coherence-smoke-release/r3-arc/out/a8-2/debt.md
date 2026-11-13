# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `canceladas` sale vacío en una ejecución nueva de la CLI: el almacén vive en memoria y no persiste entre llamadas; la intención de la 0010 («cancelar deja rastro») no se cumple de punta a punta por la CLI (relacionada con la fila 0014 del roadmap) | feature 0010, cierre | 2026-11-11 |
| Sin convención de fin de línea (ni `.gitattributes` ni `.editorconfig`): el repo mezcla CRLF y LF, y un commit convirtió `src/app.js` entero a LF sin querer. Propuesta: un `.gitattributes` que la fije, decidido por el dev-lead | feature 0010, cierre | 2026-11-11 |
| Ruling de la Task 2 (`--test-concurrency=1`) sin carrera demostrada: `node --test` a secas da 9/9; hay que aislar el almacén por test o quitar el workaround | feature 0010, cierre | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
