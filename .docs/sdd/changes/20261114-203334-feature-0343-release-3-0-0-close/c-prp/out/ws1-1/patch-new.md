---
id: 20261115-195651-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-15
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — cambia lo que ve quien teclea `libres`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: sin capacidades).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en vez de rechazar la franja.

## 2. Solución fijada

Petición cerrada. Fila 0012 del roadmap y petición del dev-lead: «`libres 25:00-26:00` … debe responder «franja no válida: usa HH:MM-HH:MM»». Autor: dev-lead.
Lo que da por existente, comprobado: el comando `libres` y la función `freeRooms` en `src/app.js`; hoy compara la franja con las reservas sin validarla.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja antes de listar; si no cumple `HH:MM-HH:MM`, responde el texto fijado.
- **Decisiones**:
  - Texto de la respuesta: «franja no válida: usa HH:MM-HH:MM» — dev-lead
  - Qué franjas son no válidas: horas 00–23, minutos 00–59, dos cifras; todo lo demás, también vacía — sin el dev-lead (`9:00-10:00`, que antes listaba salas, ahora se rechaza; lo infiero del formato `HH:MM-HH:MM`, y `25:00-26:00` cae dentro)
  - `libres` sin argumento (antes listaba las salas) ahora responde el error — sin el dev-lead
  - Sin regla «fin posterior al inicio»: no la pidió — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` (y `10:60-11:00`, `9:00-10:00`, `abc`, vacía) | ✅ RED: devolvía «Norte, Sur»; GREEN: `node --test` → 5/5, `node scripts/lint.mjs` → sin hallazgos; `node src/app.js libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM», `libres 10:00-12:00` → «Sur» |

## 5. Tiempo (ligero)

- Estimación: 0,3 h + gate de cierre (no medido en el proyecto)
- Inicio: 2026-11-15T19:56Z
- Esfuerzo real: pendiente
