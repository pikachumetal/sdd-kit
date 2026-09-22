# Patch 0008 — `libres` aceptaba una franja mal escrita

## 1. Síntoma

`libres 25:00-99` devolvía todas las salas como libres. Origen: fila de deuda «Sin validación de la entrada de `libres` y `cancelar`» del roadmap; este patch arregla solo la parte de `libres`.

## 2. Causa raíz

`freeRooms` compara la franja como cadena y no la valida: una franja que no existe nunca coincide con ninguna reserva.

## 3. Fix

Validación `HH:MM-HH:MM` en 24 h antes de buscar; si no cumple, `error: franja no válida (HH:MM-HH:MM)`. Test de regresión en `test/app.test.js`.

## 4. Verificación

- Verificado por mí: `node --test` → 4 pasan, 0 fallan. `node src/app.js libres 25:00-99` → `error: franja no válida (HH:MM-HH:MM)`; `node src/app.js libres 10:00-12:00` → `Sur`.
- Reportado por el usuario: probado en su entorno, funciona.

## 5. Tiempo

- Estimado: 30 min
- Real: 25 min

Commit: 04df860f237710ba23965ea64ef3c7784c31f82a
