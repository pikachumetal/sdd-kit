# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Adenda 2026-11-08 — tiempos del gate

Al cerrar el patch, el gate (`node --test`) tardó 40 min. Medida por fichero:

| Fichero | Tiempo |
| --- | --- |
| test/app.test.js | 1,2 s |
| test/store.test.js | 31 min 40 s |
| test/report.test.js | 8 min 12 s |
| total | 40 min |

`store.test.js` es el 79 % del total; `report.test.js`, el 20 %. Origen: fila 0008 del roadmap.
