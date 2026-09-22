# Revisión de la Task 1

**Veredicto (1ª ronda):** Needs fixes

## Important

1. **La expresión acepta franjas que la spec rechaza** — `src/app.js`, `SLOT = /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/`. `libres 9:00-11:00` y `libres 24:00-24:30` devuelven salas en vez del mensaje de error. La restricción global fija horas 00–23 con dos dígitos y minutos 00–59. Añadir un test por cada uno de esos dos casos.
2. **Comentarios que repiten el código o citan documentos** — `src/app.js`: «Expresión regular del formato de franja (spec 0009)» cita la spec; «Devuelve el mensaje de franja no válida» y «Si el comando es libres, valida la franja» repiten el código. Incumplen la restricción de calidad de código.

## Minor

- Ninguno.

---

## Re-revisión

**Veredicto:** Approved

Fix wave (subagente distinto del implementador original, ya no disponible) corrigió ambos Important en el commit `d98692b`:

1. `SLOT` reconstruida con `HOUR = '(0[0-9]|1[0-9]|2[0-3])'` y `MINUTE = '[0-5][0-9]'` — exige dos dígitos de hora 00–23 y minutos 00–59. Verificado carácter a carácter por el re-revisor, no solo por el test.
2. Los tres comentarios señalados, eliminados.

`node --test`: 6/6 en verde. Tests RED del fix wave (commit `d226e50`, hilo principal, antes del despacho): «libres rechaza una hora con un solo dígito» y «libres rechaza una hora fuera de rango», ambos en `test/app.test.js`.

## Important (re-revisión)

- Ninguno.

## Minor (re-revisión)

- Ninguno.
