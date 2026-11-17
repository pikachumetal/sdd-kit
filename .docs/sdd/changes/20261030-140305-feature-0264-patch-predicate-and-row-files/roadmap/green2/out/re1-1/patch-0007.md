# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-10-30 — Tiempos del gate

Medidas por fichero de test del gate al cerrar este patch (el gate entero tardó 40 min; el borrador `.temp/gate-times.log` no se versiona):

| Fichero | Tiempo |
| --- | --- |
| test/app.test.js | 1,2 s |
| test/store.test.js | 31 min 40 s |
| test/report.test.js | 8 min 12 s |

Origen de la fila 0008 del roadmap.
