# Deuda técnica

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |
| Las reservas de más de 8 h no avisan al responsable | sin determinar | un responsable de planta | Bajo | 2.º caso | 2026-07-01 |
| La exportación a CSV pierde las tildes desde la 1.4.2 | sin determinar | `docs/qa/2026-10-12-informe.md` (hallazgo 1) | Medio | reproducirlo | 2026-11-01 |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `salas libres --planta 2` lista también salas de la planta 1 | defecto del producto | `docs/qa/2026-10-12-informe.md` (hallazgo 2) | Medio | `node src/app.js libres --planta 2` imprime `Norte (planta 1)`; `roomsOnFloor` filtra con `<=` en `src/app.js` | ninguno | — | 0014 |

## Descartadas

| Ítem | Causa | Origen | Motivo | Fecha |
| --- | --- | --- | --- | --- |
