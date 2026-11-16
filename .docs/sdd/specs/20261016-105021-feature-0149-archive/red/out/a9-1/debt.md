# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

| Ítem | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- |

## Lista

| Ítem | Origen | Impacto | Evidencia | Destino |
| --- | --- | --- | --- | --- |
| Los motivos no se traducen (castellano e inglés) | cliente | bajo | `canceladas` | sin fila |
| `canceladas` no ve lo cancelado desde el CLI: el almacén es en memoria y cada comando es un proceso nuevo; `test/cancel.test.js` depende del orden de los tests y no cubre «sin `--motivo`» | cierre de la 0010 | medio | `node src/app.js cancelar Norte lun --motivo otro` y luego `node src/app.js canceladas` imprime vacío | sin fila |

## Descartadas

| Ítem | Origen | Motivo | Fecha |
| --- | --- | --- | --- |
