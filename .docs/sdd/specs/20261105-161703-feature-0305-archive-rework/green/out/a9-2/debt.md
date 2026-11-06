# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| `canceladas` sale vacío como proceso aparte (el almacén es en memoria y no persiste entre ejecuciones) y su prueba depende del estado que deja la anterior | feature 0010, [walkthrough](../specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | 2026-11-05 |
| Workaround `--test-concurrency=1` en el gate por la carrera de los tests sobre el almacén compartido; la suite tarda el doble | feature 0010, [walkthrough](../specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | 2026-11-05 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Los motivos no se traducen al inglés (queda el inglés; el castellano lo salda la 0010) | defecto del producto | cliente | bajo | `canceladas` | — | — | 0010 |

## Descartadas

| Ítem | Causa | Origen | Motivo | Fecha |
| --- | --- | --- | --- | --- |
