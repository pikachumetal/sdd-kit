# Deuda técnica

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |
| La exportación a CSV pierde las tildes desde la 1.4.2 | sin determinar | `docs/qa/2026-10-12-informe.md` | medio | reproducirlo | 2026-10-12 |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `salas libres --planta 2` lista también salas de la planta 1 | defecto del producto | `docs/qa/2026-10-12-informe.md` | medio | `node src/app.js libres --planta 2` → `Norte (planta 1)` | — | — | 0014 |
| `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres, ni qué da sin número | defecto del producto | `docs/qa/2026-10-12-informe.md` | bajo | `node src/app.js libres --planta` → `Norte (planta 1), Sur (planta 3)` (las libres de todas las plantas; Oeste, ocupada, no sale), frente a «indica una planta» en `docs/ayuda.md` | — | — | 0015 |
