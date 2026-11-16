# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| Test frágil: `test/store.test.js` falla con `EBUSY: resource busy or locked, open 'data/bookings.json'` la primera vez que corre en un clon y pasa después (usa un fichero `store-lock` en el directorio común de git); visto en el cierre de la 0010, el fichero solo sale verde en la rama y en `develop` | feature 0010 | 2026-11-15 |
| El test de `canceladas` en `test/cancel.test.js` reutiliza la cancelación del primer test: falla si corre solo o en otro orden | feature 0010 (ruling de la Task 2) | 2026-11-15 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
