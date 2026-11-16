# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Un test de `test/cancel.test.js` depende del orden de otro | feature 0010 | re-revisión | `canceladas` solo pasa si antes corrió «cancelar con un motivo de la lista»; el almacén es compartido | `test/cancel.test.js:13-15` | ninguno: `node --test` pasa en orden | aislar el almacén por test | — |
