# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| Test inestable `el almacén guarda una reserva` (`test/store.test.js`): en la 1.ª pasada de `node --test --test-concurrency=1` falló con `Error: EBUSY: resource busy or locked, open 'data/bookings.json'` y no se repite: sola en la rama y en `develop` (da98ef4) verde y verde, y la suite entera en verde a la segunda | feature 0010, cierre | 2026-11-11 |
| Workaround `--test-concurrency=1` en el gate de la 0010 (ruling de la Task 2): esquiva la carrera de los tests sobre el almacén compartido en memoria; hasta aislar el almacén por test, la suite tarda el doble | feature 0010, ruling Task 2 | 2026-11-11 |
| El CLI no conserva el estado entre procesos: `cancelar …` y luego `canceladas` en otra invocación sale vacío (el almacén vive en memoria); el THEN de `canceladas` solo se ve en el mismo proceso. Lo cubriría 0014 «Motivo guardado» | feature 0010, cierre | 2026-11-11 |
| La 0010 quitó el test `cancelar sin reserva lo dice` (`sin reserva Sur mar`); `cancelBooking` conserva la rama, sin test que la fije | feature 0010, cierre | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
