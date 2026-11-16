# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| Los tests de `canceladas` dependen de la cancelación del test anterior (workaround de la 0010: cada test debería preparar sus datos) | feature 0010 | 2026-11-12 |
| `canceladas` en un proceso aparte responde vacío: las reservas viven en memoria y el motivo no se guarda entre ejecuciones (lo cubre la 0014) | feature 0010 | 2026-11-12 |
| `cancelar` sin `--motivo` no tiene test propio (lo cubre el código y el smoke) | feature 0010 | 2026-11-12 |
| CI de `develop` en rojo (workflow `ci`, `ci.yml`) en 3b6aae39f6219c9344a33cda938e92f31d88a7d1: sin causa leída, `gh run view --log-failed` no la devolvió; lo arregla un patch | cierre de la 0010 | 2026-11-12 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
