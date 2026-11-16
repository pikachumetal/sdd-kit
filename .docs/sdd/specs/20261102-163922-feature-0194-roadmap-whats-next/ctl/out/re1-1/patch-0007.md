# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-11-02 — tiempos del gate

El gate de este patch tardó 40 min en total. Medida por fichero (de `.temp/gate-times.log`, que es temporal):

| Fichero | Tiempo |
| --- | --- |
| test/store.test.js | 31 min 40 s |
| test/report.test.js | 8 min 12 s |
| test/app.test.js | 1,2 s |

`store.test.js` es el 79 % del total. Origen de la fila 0008 del roadmap.
