# Patch — cancel

Causa raíz: comparación solo por hora. Fix y test de regresión. Verificado.

## Tiempo

- Esfuerzo real: 0,5h

## Addendum 2026-11-02 — medidas del gate (§2)

El gate de este patch tardó 40 min en total. Medidas por fichero (de `.temp/gate-times.log`, que es un scratchpad y se borra):

| Fichero | Tiempo |
| --- | --- |
| test/app.test.js | 1,2 s |
| test/store.test.js | 31 min 40 s |
| test/report.test.js | 8 min 12 s |
| **Total** | **40 min** |

`store.test.js` es el ~79 % del gate y `report.test.js` el ~20 %; `app.test.js` es despreciable. Origen de la fila 0008 del roadmap.
