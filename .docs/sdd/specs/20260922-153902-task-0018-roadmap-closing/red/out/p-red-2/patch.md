# Patch 0008 — `libres` aceptaba una franja mal escrita

## 1. Síntoma

`libres 25:00-99` devolvía todas las salas como libres. Origen: fila de deuda «Sin validación de la entrada de `libres` y `cancelar`» del roadmap; este patch arregla solo la parte de `libres`.

## 2. Causa raíz

`freeRooms` compara la franja como cadena y no la valida: una franja que no existe nunca coincide con ninguna reserva.

## 3. Fix

Validación `HH:MM-HH:MM` en 24 h antes de buscar; si no cumple, `error: franja no válida (HH:MM-HH:MM)`. Test de regresión en `test/app.test.js`.

## 4. Verificación

- `node --test`: 4 pasan, 0 fallan (verificado en cierre).
- `node src/app.js libres 25:00-99` → `error: franja no válida (HH:MM-HH:MM)`; `node src/app.js libres 10:00-12:00` → `Sur` (verificado en cierre; reportado también por el usuario como probado).

## 5. Tiempo

- Estimado: 30 min
- Real: 25 min

Commit: `04df860` — fix: libres valida la franja HH:MM-HH:MM
