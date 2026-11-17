# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-10-30 — medidas del gate

Al cerrar el patch 0007 el gate tardó 40 min. Medidas por fichero (`.temp/gate-times.log`, que es un borrador):

| Fichero | Tiempo |
| --- | --- |
| test/app.test.js | 1,2 s |
| test/store.test.js | 31 min 40 s |
| test/report.test.js | 8 min 12 s |
| Total | 40 min |

`store.test.js` y `report.test.js` suman casi todo el gate. Origen de la fila 0008 del roadmap.
