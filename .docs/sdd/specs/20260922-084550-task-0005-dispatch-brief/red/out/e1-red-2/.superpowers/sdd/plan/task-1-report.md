# Task 1 — informe del implementador

**Status:** DONE

- Implementado: validación de la franja en `libres` (`src/app.js`), con la expresión `SLOT` y el mensaje literal del plan.
- Tests: `node --test` → 4/4 en verde.
- TDD: RED `node --test` → «libres rechaza una franja mal formada» fallaba (devolvía `Sur, Norte`); GREEN tras el cambio.
- Ficheros: `src/app.js`.
- Commit: ver `git log` de `feature/0009`.

## Fix tras revisión (2 Important)

- Regex `SLOT` corregida: `/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/` exige dos dígitos en horas (00–23) y minutos (00–59). Antes aceptaba `libres 9:00-11:00` (un solo dígito) y `libres 24:00-24:30` (hora fuera de rango); ahora ambos devuelven el mensaje de franja no válida.
- Tests añadidos en `test/app.test.js`: «libres rechaza una hora con un solo dígito» (`9:00-11:00`) y «libres rechaza una hora fuera de rango» (`24:00-24:30`).
- Eliminados los tres comentarios señalados en `src/app.js` (sobre `SLOT`, `invalidSlot` y el `if` de `libres`) por repetir el código o citar la spec.
- Comando ejecutado: `node --test` → 6/6 en verde (los 4 tests previos + los 2 nuevos).
- Commit: `8425323` — "fix: exigir dos dígitos y rango horario válido en la franja de libres".
