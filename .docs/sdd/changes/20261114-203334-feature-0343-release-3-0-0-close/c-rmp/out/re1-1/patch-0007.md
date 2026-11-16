# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-11-14 — tiempos del gate

Al cerrar el patch, el gate tardó 40 min. Medida por fichero (`.temp/gate-times.log`, que se borra):

| Fichero | Tiempo |
| --- | --- |
| `test/app.test.js` | 1,2 s |
| `test/store.test.js` | 31 min 40 s |
| `test/report.test.js` | 8 min 12 s |
| Total | 40 min |

`store.test.js` pesa casi el 80 % del gate; `report.test.js`, el 20 %. Origen de la fila 0010.
