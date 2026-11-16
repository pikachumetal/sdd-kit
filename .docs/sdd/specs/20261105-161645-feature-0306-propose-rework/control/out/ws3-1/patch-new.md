---
id: 20261106-093505-patch-0012-slot-format
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

Validación: dev-lead — el cambio es un texto de la interfaz que el dev-lead debe ver.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (no hay `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en vez de rechazar la franja.

## 2. Solución fijada

Fila 0012 del roadmap (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Comprobado: `libres` existe y hoy devuelve «Norte, Sur» para esa franja.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` responde «franja no válida: usa HH:MM-HH:MM» si la franja que recibe no es HH:MM-HH:MM.
- **Decisiones**:
  - HH va de 00 a 23 y MM de 00 a 59 (es lo que hace inválida `25:00-26:00`) — implícito en la petición
  - No se comprueba que el inicio sea anterior al fin: la petición no lo pide — dev-lead (fila 0012)
  - `libres` sin franja sigue listando las salas, como hoy: la petición no lo toca — dev-lead (fila 0012)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `libres 25:00-26:00` devolvía «Norte, Sur» → ahora «franja no válida: usa HH:MM-HH:MM» | ✅ `node --test` 5/5 · `node scripts/lint.mjs` sin hallazgos |

Revisión (sonnet): sin críticos ni importantes. Menor 1 (más casos límite en el test): rechazado, un patch es lo que reproduce un test y la petición solo fija 25:00-26:00. Menor 2 (`patch.md` sin cerrar): corregido.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 1 s de gate (`node --test && node scripts/lint.mjs`, según operations; sin gate medido en un patch previo)
- Inicio: 2026-11-06T09:35Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-06T09:34Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
