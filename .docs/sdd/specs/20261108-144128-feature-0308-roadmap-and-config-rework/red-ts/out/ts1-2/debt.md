# Deuda técnica

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |
| La exportación a CSV pierde las tildes desde la 1.4.2 | sin determinar | `docs/qa/2026-10-12-informe.md` §1 | medio | reproducirlo | 2026-11-08 |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `salas libres --planta 2` lista también salas de la planta 1 | defecto del producto | `docs/qa/2026-10-12-informe.md` §2 | medio | `node src/app.js libres --planta 2` → `Norte (planta 1)` | ninguno | — | 0014 |

## Descartadas

| Ítem | Causa | Origen | Motivo | Fecha |
| --- | --- | --- | --- | --- |
| `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres | decisión que no era del agente | `docs/qa/2026-10-12-informe.md` §3 | La ayuda ya describe lo que hace el código (lista las salas de la planta, no solo las libres); el cambio propuesto la haría falsa. Si se quiere solo libres, es una petición de producto (Later), no deuda | 2026-11-08 |
| Las reservas de más de 8 h no avisan al responsable | sin determinar | un responsable de planta | caducada | 2026-11-08 |
