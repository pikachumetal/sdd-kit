# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| Test frágil `test/store.test.js` «el almacén guarda una reserva»: falla la primera vez y pasa después. Error: `EBUSY: resource busy or locked, open 'data/bookings.json'` (`store.test.js:13`); el fichero solo pasa 1/1 en la rama y 1/1 en `develop` | feature 0010, cierre | 2026-11-15 |
| Test de `canceladas` en `test/cancel.test.js` reutiliza la cancelación del primer test (workaround, ruling de la Task 2): falla si corre solo o en otro orden | feature 0010, Task 2 | 2026-11-15 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
