# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Las reservas no persisten entre ejecuciones de la CLI: `cancelar` y `canceladas` solo se ven juntos en un mismo proceso | cierre de la 0010 | 2026-11-01 |
| Tests con almacén en memoria compartido: `canceladas` depende de que `cancelar` corra antes; workaround `--test-concurrency=1` hasta aislar el almacén por test | cierre de la 0010 (ruling de la task 2) | 2026-11-01 |
| Sin test de `cancelar` sin `--motivo` (solo cubierto por el smoke del cierre) | cierre de la 0010 | 2026-11-01 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Los motivos no se traducen al inglés (el castellano lo salda la 0010) | defecto del producto | cliente | bajo | `canceladas` | — | — | 0010 |

## Descartadas

| Ítem | Causa | Origen | Motivo | Fecha |
| --- | --- | --- | --- | --- |
