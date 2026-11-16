# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-11-08 — tiempos del gate

Medidas por fichero del gate al cerrar este patch (total 40 min):

| Fichero | Tiempo |
| --- | --- |
| test/app.test.js | 1,2 s |
| test/store.test.js | 31 min 40 s |
| test/report.test.js | 8 min 12 s |

`store.test.js` es el 79 % del gate y `report.test.js` otro 20 %; el resto es despreciable. Causa de la lentitud sin investigar.
