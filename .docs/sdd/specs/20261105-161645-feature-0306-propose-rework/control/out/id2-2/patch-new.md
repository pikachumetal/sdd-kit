---
id: 20261106-100404-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de la franja en `libres`
type: patch
solution: dev-lead
status: done
created: 2026-11-06
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de la franja en `libres`

Validación: dev-lead — el cambio es lo que el usuario ve en `libres`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«`libres 25:00-26:00` lista las salas»: hoy devuelve `Norte, Sur`. Medido en la base: `node src/app.js libres 25:00-26:00` → `Norte, Sur`.

## 2. Solución fijada

Petición cerrada del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Salda la deuda «Sin validación del formato de franja horaria». Lo que da por existente existe: el comando `libres` y su rama en `run` (`src/app.js`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `SLOT_FORMAT` (HH:MM-HH:MM, hora 00-23, minutos 00-59) antes de buscar salas; si no encaja, responde el texto fijado.
- **Decisiones**:
  - Texto de la respuesta, literal — dev-lead
  - «Formato válido» = HH:MM-HH:MM con hora 00-23 y minutos 00-59 (lectura de «formato» y del ejemplo 25:00) — sin el dev-lead; no cambia el texto, el sitio ni ninguna franja que hoy se use (10:00-12:00)
  - No se exige inicio < fin ni se valida `libres` sin franja más allá de lo mismo (responde «franja no válida…») — sin el dev-lead; fuera de lo pedido

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → node --test: corrió 5/5 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `libres 25:00-26:00` → `Norte, Sur` (esperaba el mensaje) → después OK | ✅ |
| 2 | `libres 10:00-12:00` sigue → `Sur` (test existente) | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (sin medida previa en el proyecto: el gate corre en ~1 s)
- Inicio: 2026-11-06T10:04Z
- Esfuerzo real: pendiente de cierre

### Revisión (un revisor, sonnet)

Sin Críticos ni Importantes. Menores: regex descrito en abreviatura en §3 — corregido; `status`/`commit` se rellenan al cierre — aceptado; sin test propio de minutos inválidos ni de franja ausente — rechazado: fuera de lo pedido (una prueba, un comportamiento); la decisión queda declarada en §3.
