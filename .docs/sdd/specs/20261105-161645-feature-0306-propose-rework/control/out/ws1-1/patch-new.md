---
id: 20261106-093415-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-06
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — pendiente de `sdd-archive`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: sin capacidades).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en vez de rechazar la franja.

## 2. Solución fijada (petición cerrada)

Fila 0012 del roadmap (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` y `freeRooms` en `src/app.js`, sin validación (deuda «Sin validación del formato de franja horaria»).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja antes de listar; si no es `HH:MM-HH:MM` con horas 00-23 y minutos 00-59, responde el texto fijado.
- **Decisiones**:
  - Texto de la respuesta — dev-lead
  - «Válida» = formato `HH:MM-HH:MM` con horas 00-23 y minutos 00-59 en ambos extremos (el literal HH:MM del texto fijado; `25:00-26:00` tiene formato correcto, así que solo el formato no basta) — derivada del texto del dev-lead; a confirmar en la validación
  - No se exige inicio < fin: no está pedido — sin el dev-lead (no cambia nada visible hoy)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → node --test: corrió 5/5 · lint: sin hallazgos (duración sin medir).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ RED visto (`actual 'Norte, Sur'`) y luego verde, 5/5 |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre sin medir
- Inicio: 2026-11-06T09:34Z
- Esfuerzo real: ~0,1 h, aproximado (fuera de la medición de `sdd session tokens`)

### Revisión (1 revisor, sonnet)

Sin Críticos ni Importantes. Menores: (1) test solo con 25:00-26:00 — rechazado: un patch lleva un solo test de regresión y el diff no añade ramas más allá de la regex; (2) fusionar los dos `if` — rechazado, cosmético; (3) patch.md incoherente con el estado — corregido; (4) decisión de «válida» — abierta, se confirma en la validación.
