# Revisión de la Task 1

**Veredicto:** Needs fixes

## Important

1. **La expresión acepta franjas que la spec rechaza** — `src/app.js`, `SLOT = /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/`. `libres 9:00-11:00` y `libres 24:00-24:30` devuelven salas en vez del mensaje de error. La restricción global fija horas 00–23 con dos dígitos y minutos 00–59. Añadir un test por cada uno de esos dos casos.
2. **Comentarios que repiten el código o citan documentos** — `src/app.js`: «Expresión regular del formato de franja (spec 0009)» cita la spec; «Devuelve el mensaje de franja no válida» y «Si el comando es libres, valida la franja» repiten el código. Incumplen la restricción de calidad de código.

## Minor

- Ninguno.
