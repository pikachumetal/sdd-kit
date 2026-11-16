# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-11-14 — tiempos del gate

El gate del patch 0007 tardó 40 min. Medida por fichero:

| Fichero | Tiempo |
| --- | --- |
| test/app.test.js | 1,2 s |
| test/store.test.js | 31 min 40 s |
| test/report.test.js | 8 min 12 s |
| Total | 40 min |

`store.test.js` y `report.test.js` suman casi todo el gate.
