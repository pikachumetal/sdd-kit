# Deuda técnica

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |
| La exportación a CSV pierde las tildes desde la 1.4.2 | sin determinar | `docs/qa/2026-10-12-informe.md#1` | Medio | reproducirlo | 2026-11-08 |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `salas libres --planta 2` lista también salas de la planta 1 | defecto del producto | `docs/qa/2026-10-12-informe.md#2` | Medio | `node src/app.js libres --planta 2` → `Norte (planta 1)` | ninguno | — | 0014 |
| `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres | defecto del producto | `docs/qa/2026-10-12-informe.md#3` | Bajo | `docs/ayuda.md` dice «lista las salas de la planta <n>»; `roomsOnFloor` en `src/app.js` excluye `occupiedNow` | ninguno | — | 0015 |

## Descartadas

| Ítem | Causa | Origen | Motivo | Fecha |
| --- | --- | --- | --- | --- |
| Las reservas de más de 8 h no avisan al responsable | sin determinar | un responsable de planta | caducada: dos releases (1.3.0, 1.4.0) sin 2.º caso | 2026-11-08 |
