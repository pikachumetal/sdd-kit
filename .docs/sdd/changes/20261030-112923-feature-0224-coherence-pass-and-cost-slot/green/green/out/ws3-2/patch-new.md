---
id: 20261030-123245-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-30
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas (`Norte, Sur`) en vez de avisar de que la franja no existe.

## 2. Solución fijada (petición cerrada)

- Frase literal, fila 0012 del roadmap (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»».
- Lo que da por existente, comprobado: el comando `libres` (`run` en `src/app.js`) y su único argumento, la franja; hoy no la valida (deuda «Sin validación del formato de franja horaria»).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida su franja con `validSlot` antes de listar; si no es válida responde el texto fijado.
- **Decisiones**:
  - Texto de la respuesta: «franja no válida: usa HH:MM-HH:MM» — dev-lead
  - Una franja es válida si es `HH:MM-HH:MM` con hora 00-23 y minutos 00-59: es lo que hace inválido el ejemplo del dev-lead, que sí cumple el formato — derivada del ejemplo del dev-lead
  - Sin franja (`libres` a secas) o con un formato distinto (`abc`) responde lo mismo: el texto dice «usa HH:MM-HH:MM» — sin el dev-lead (solo la rama de formato; no cambia lo que el ejemplo fija)
  - No se decide nada sobre fin anterior al inicio ni sobre `24:00`: no se tocan — fuera del patch

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 5/5 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: el test nuevo fallaba con `Norte, Sur` | ✅ |
| 2 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ |
| 3 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo

- Estimación: 0,5 h (post hoc)
- Inicio: 2026-10-30T12:32Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-30T12:32Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
