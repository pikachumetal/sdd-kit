# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| E2E rojo la primera vez que arranca el servidor en un clon: `server.mjs` sale con código 1 en el primer `/run` si falta la marca `env-crash` de `git-common-dir`. Test: los 7 de `e2e/` (primero: `cancela una reserva con su motivo`). Error: `Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:55377/`. No se repite: verde en la rama (`e2e/cancel.e2e.mjs` 5/5 y la suite entera 7/7) y en `develop` (5/5 y 5/5), ambas con la marca ya creada | feature 0010 (cierre) | 2026-11-11 |
| Workaround `node --test --test-concurrency=1` por una carrera sobre el almacén compartido en memoria (Ruling de la Task 2 de 0010, `tasks.md`): el cierre no lo necesitó y no está en el gate; falta confirmar si la carrera existe o aislar el almacén por test | feature 0010 (cierre) | 2026-11-11 |
| Suite E2E por encima de su presupuesto: 48,1 s de 0,5 min (7 tests, 6 s de espera por paso con `E2E_TRACE=on`) | feature 0010 (cierre) | 2026-11-11 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
