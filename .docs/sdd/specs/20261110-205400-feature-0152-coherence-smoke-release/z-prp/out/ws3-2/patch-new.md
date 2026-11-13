---
solution: ticket
---

# Patch — slot-format

Clase: petición cerrada (la fila 0012 fija el texto y el comando). Carril pedido en la petición y confirmado por la investigación.

## 1. Síntoma

`libres 25:00-26:00` lista todas las salas (`Norte, Sur`); debe responder `franja no válida: usa HH:MM-HH:MM`.

## 2. Solución fijada

«`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»» (ticket, fila 0012 del roadmap). Comprobado que lo que da por existente existe: el comando `libres` en `src/app.js`.

## 3. Decisiones

- Franja válida = `HH:MM-HH:MM`, horas 00-23, minutos 00-59 — sin el dev-lead (deducido del ejemplo `25:00`; no cambia lo visible más allá del caso pedido).
- `libres` sin argumento: no se toca (sigue listando todas las salas); decidirlo sería interpretar requisitos.
- Fin anterior al inicio (`12:00-10:00`): no se valida, fuera de alcance.

## 4. Verificación

- RED: `node --test test/slot.test.js` → fail, actual `Norte, Sur`.
- Tras el fix: `node --test` → 7 pass, 0 fail; `node scripts/lint.mjs` → `lint: sin hallazgos`.
- `node src/app.js libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM`; `libres 10:00-12:00` → `Sur`.
- Revisor (sonnet): 1) `libres` sin argumento cambiaba en silencio → corregido, ahora no se toca; 2) causa raíz correcta, validación en `run` (freeRooms no se exporta) → aceptado; 4) faltaban casos positivo y límites → añadidos (10:00-12:00, 23:59-23:59, minuto 60, hora 24); 5) aviso CRLF ajeno al fix → rechazado.

## 5. Tiempo

- Estimación: 0,5 h + gate de cierre ~1 s (sin medida previa en el proyecto)
- Inicio: 2026-11-12 16:30 UTC
- Esfuerzo real: ~0,2 h (aproximado)
