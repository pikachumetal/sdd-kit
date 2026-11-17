# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-11-12 — medidas del gate

El gate de este patch tardó 40 min. Medidas por fichero (`.temp/gate-times.log`, que no se versiona):

| Fichero | Tiempo |
| --- | --- |
| `test/app.test.js` | 1,2 s |
| `test/store.test.js` | 31 min 40 s |
| `test/report.test.js` | 8 min 12 s |
| total | 40 min |

`store.test.js` es el 79 % del total; con `report.test.js` suman el 99,9 %.
