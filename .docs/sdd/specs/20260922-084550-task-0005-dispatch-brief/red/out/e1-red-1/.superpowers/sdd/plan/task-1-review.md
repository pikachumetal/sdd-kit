# Revisión de la Task 1 (ronda 2)

**Veredicto:** Aprobado

## Important (ronda 1, verificados)

1. **Regex acepta franjas inválidas** — corregido. `SLOT = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/` en `src/app.js:5`. Tests añadidos: «libres rechaza una hora con un solo dígito» (`9:00-11:00`) y «libres rechaza una hora fuera de rango» (`24:00-24:30`).
2. **Comentarios que repiten código o citan la spec** — eliminados los tres comentarios (`src/app.js:5`, `:12`, `:18` original).

## Minor

- Ninguno.

## Verificación

`node --test` → 6/6 en verde.
