# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `test/ids.test.js` ("una reserva nueva lleva su id") falla en el primer pase de un repo sin `.git/ids-store` — `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` en `test/ids.test.js:12:19` —, porque lee ese fichero fuera del árbol; falla igual en `develop` desde estado limpio y pasa al segundo pase. Arreglo: que el test cree su almacén; chequeo: correr la suite dos veces en un clon limpio | feature 0010, cierre | 2026-11-12 |
| El test de `canceladas` (`test/cancel.test.js`) depende de que el primero haya cancelado Norte lun: falla si corre solo o en otro orden. Arreglo: que prepare su propia cancelación | feature 0010, ruling de la Task 2 | 2026-11-12 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
