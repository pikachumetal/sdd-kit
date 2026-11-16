---
id: 20261116-113317-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-16
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (no existe `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en vez de rechazar la franja. Reproducido en la base actual.

## 2. Solución fijada (petición cerrada)

Frase literal del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` en `src/app.js` (`run`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja antes de consultar las salas; si no es `HH:MM-HH:MM` responde «franja no válida: usa HH:MM-HH:MM».
- **Decisiones**:
  - Franja válida = `HH:MM-HH:MM` con horas 00-23 y minutos 00-59 — sin el dev-lead (lectura mía de «no válida»; el texto del mensaje sí es del dev-lead)
  - Fin anterior o igual al inicio (p. ej. `12:00-10:00`) queda fuera: sigue sin validarse — dev-lead (no lo pide)
  - `libres` sin franja pasa a responder también «franja no válida…»; antes listaba las salas con `undefined` — consecuencia de la validación, a confirmar en la validación

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `libres 25:00-26:00` devolvía «Norte, Sur» (test nuevo en rojo) → ahora «franja no válida: usa HH:MM-HH:MM» | ✅ |
| 2 | `libres 10:00-12:00` sigue dando «Sur» | ✅ |

Revisión (sonnet): sin hallazgos bloqueantes. Cobertura de `libres` sin franja y de formatos (`9:00`, `24:00`): rechazado, porque un solo test cubre la petición y la validación se comprobó a mano (`libres` sin franja → «franja no válida…»). Unir los `if`: rechazado, estilo sin efecto. `commit` y esfuerzo real se cierran en el archive.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre de `operations.md` (~1 s, no medido)
- Inicio: 2026-11-16T11:25Z
- Esfuerzo real: pendiente
