# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin test de `cancelar` sin `--motivo` (solo lo cubre el smoke de la 0010) | feature 0010 | 2026-10-31 |
| Los tests comparten el almacén en memoria y corren con `--test-concurrency=1` como workaround; aislar el almacén por test | feature 0010 (ruling de la Task 2) | 2026-10-31 |

## En espera

| Ítem | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- |

## Lista

| Ítem | Origen | Impacto | Evidencia | Destino |
| --- | --- | --- | --- | --- |
| **[Feature 0010, 2026-10-31: saldada — walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)]** El motivo de cancelar no se valida | revisión de la 0007 | medio | `cancelar Sur mar --motivo xyz` | 0010 |
| **[Feature 0010, 2026-10-31: parcial — walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md); queda: la traducción al inglés]** Los motivos no se traducen (castellano e inglés) | cliente | bajo | `canceladas` | 0010 |

## Descartadas

| Ítem | Origen | Motivo | Fecha |
| --- | --- | --- | --- |
