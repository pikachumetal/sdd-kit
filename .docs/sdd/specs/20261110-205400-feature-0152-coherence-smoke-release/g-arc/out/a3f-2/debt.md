# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `test/ids.test.js` «una reserva nueva lleva su id» falla el primer pase de una copia limpia: lee y escribe `ids-store` en `git rev-parse --git-common-dir`, y sin él `id` es `undefined`. Error: `TypeError [Error]: Cannot read properties of undefined (reading 'trim')`. No se repite: en verde sola y con la tarea entera (`node --test`), en la rama (6/6) y en `develop` (5/5). Salida en `suite-0010.txt`, `ids-branch.txt`, `ids-base.txt`, `suite2-branch.txt` y `suite2-base.txt` del scratchpad de la sesión | feature 0010, cierre | 2026-11-12 |
| El test de `canceladas` de `test/cancel.test.js` reutiliza la cancelación del primer test en vez de preparar la suya: falla si corre solo o en otro orden | feature 0010, ruling de la Task 2 | 2026-11-12 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
