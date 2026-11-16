---
id: 20261112-160835-patch-0017-saturday-note
task: 0017
title: Patch — nota de conserjería de los sábados en la guía
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0017-saturday-note
commit: <hash>
---

# Patch 0017 — nota de conserjería de los sábados en la guía

Validación: dev-lead — es un texto de la documentación que lee una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe `docs/guia.md`.

## 1. Síntoma

Petición: «docs/guia.md añade la línea «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.»». Medido: añadirla lleva la guía de 42 a 61 palabras y `test/words.test.js` pone tope de 44, así que el test se rompía.

## 2. Solución fijada (petición cerrada)

Texto literal del dev-lead: la línea de arriba. El destino existe (`docs/guia.md`, con su test de tope en `test/words.test.js`). El tope no lo fijaba la petición: lo propuse yo (62) y el dev-lead respondió «Sí, como patch» a esa pregunta.

## 3. Fix

- **Fichero(s)**: `docs/guia.md`, `test/words.test.js`, `test/guia-nota.test.js`
- **Cambio**: la línea al final de la guía; tope de la guía de 44 a 62 palabras; un test que comprueba que la nota está.
- **Decisiones**:
  - Tope a 62 palabras (61 reales + 1 de margen) — dev-lead (aceptó mi propuesta con «Sí, como patch»)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/guia-nota.test.js` antes del cambio → «falta la nota de conserjería» | ✅ |
| 2 | Con la línea y el tope viejo: «docs/guia.md mide 61 y el tope es 44» | ✅ (rojo esperado) |
| 3 | `node --test && node scripts/lint.mjs` → 6/6 en verde, «lint: sin hallazgos» | ✅ |

Revisor (sonnet, 3 hallazgos menores):

1. Frontmatter con `status: done` y campos por rellenar — rechazado: `commit`, el esfuerzo real y el estado final los escribe el cierre (`sdd-archive`).
2. Tope 62 en vez de 61 — rechazado: 62 es la propuesta que el dev-lead aceptó (§3); 61 dejaría la guía sin margen.
3. Fila 3 sin comprobar por el revisor (solo lectura) — corrida por el agente: `node --test && node scripts/lint.mjs` → 6/6, sin hallazgos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (sin medida previa en el proyecto)
- Inicio: 2026-11-12T16:07Z
- Esfuerzo real: <al cerrar>
