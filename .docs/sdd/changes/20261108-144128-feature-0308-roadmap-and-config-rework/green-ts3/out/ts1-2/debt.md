# Deuda técnica

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |
| La exportación a CSV pierde las tildes desde la 1.4.2 | sin determinar | `docs/qa/2026-10-12-informe.md` hallazgo 1 | Medio | reproducirlo | 2026-11-08 |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `salas libres --planta 2` lista también salas de la planta 1 | defecto del producto | `docs/qa/2026-10-12-informe.md` hallazgo 2 | Medio | `node src/app.js libres --planta 2` → `Norte (planta 1)`; `src/app.js:12` usa `<=` | ninguno | — | 0014 |
| `docs/ayuda.md` no dice que `libres --planta` lista solo las libres, ni qué da sin número | defecto del producto | `docs/qa/2026-10-12-informe.md` hallazgo 3 | Bajo | `node src/app.js libres --planta` → `Norte (planta 1), Sur (planta 3)`; `docs/ayuda.md:3` dice «indica una planta» | ninguno | — | 0014 |

## Descartadas

| Ítem | Causa | Origen | Motivo | Fecha |
| --- | --- | --- | --- | --- |
| Las reservas de más de 8 h no avisan al responsable | sin determinar | un responsable de planta | caducada: dos releases X.Y.0 sin 2.º caso | 2026-11-08 |
