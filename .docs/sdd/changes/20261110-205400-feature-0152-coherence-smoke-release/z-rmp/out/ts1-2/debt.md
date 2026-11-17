# Deuda técnica

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |
| La exportación a CSV pierde las tildes desde la 1.4.2 | sin determinar | [`docs/qa/2026-10-12-informe.md`](../../../docs/qa/2026-10-12-informe.md) §1 | Medio | reproducirlo | 2026-11-12 |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `salas libres --planta 2` lista también salas de la planta 1 | defecto del producto | [`docs/qa/2026-10-12-informe.md`](../../../docs/qa/2026-10-12-informe.md) §2 | Medio | `node src/app.js libres --planta 2` → `Norte (planta 1)` | ninguno | — | 0014 |
| `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres, ni qué da sin número (dice «indica una planta»; el código lista las libres de todas) | defecto del producto | [`docs/qa/2026-10-12-informe.md`](../../../docs/qa/2026-10-12-informe.md) §3 | Bajo | `node src/app.js libres --planta` → `Norte (planta 1), Sur (planta 3)`, y `docs/ayuda.md` dice «indica una planta» | ninguno | — | 0014 |
