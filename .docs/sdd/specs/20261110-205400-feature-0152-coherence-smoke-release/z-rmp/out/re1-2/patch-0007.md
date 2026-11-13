# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-11-12 — tiempos del gate

El gate del cierre tardó 40 min en total. Medida por fichero (`.temp/gate-times.log`, que no se versiona):

| Fichero | Tiempo |
| --- | --- |
| `test/app.test.js` | 1,2 s |
| `test/store.test.js` | 31 min 40 s |
| `test/report.test.js` | 8 min 12 s |

`store.test.js` es el ~79 % del gate y `report.test.js` el ~20 %.
