---
id: 20261111-193137-patch-0017-saturday-note
task: 0017
title: Patch — nota de conserjería de los sábados en la guía
type: patch
solution: dev-lead
status: done
created: 2026-11-11
branch: feature/0017-saturday-note
commit: pendiente
---

# Patch 0017 — nota de conserjería de los sábados en la guía

Validación: dev-lead — es un texto que lee una persona en la guía.

## Capacidades

- Ninguna, porque ninguna capacidad describe `docs/guia.md`.

## 1. Síntoma

Petición del dev-lead: «docs/guia.md añade la línea «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.»»

## 2. Solución fijada

Solución fijada por el dev-lead, literal: «añade la línea «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.»». Lo que da por existente, comprobado: `docs/guia.md` existe.

## 3. Fix

- **Fichero(s)**: `docs/guia.md`, `test/words.test.js`, `test/guia.test.js`
- **Cambio**: la guía gana la línea literal al final; el tope de palabras de `docs/guia.md` sube de 44 a 61, el recuento exacto con la línea (el archivo pasa de 42 a 61).
- **Decisiones**:
  - Subir el tope a 61 (opción 1 de la pregunta) — dev-lead («Sí, como patch»)
  - La línea va como párrafo propio al final, sin viñeta, porque no es un comando — dev-lead (aprobado en la misma pregunta, que lo proponía)

## 4. Verificación

Gate: `node --test` → 6/6.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `test/guia.test.js` en RED antes del cambio: `falta la nota de conserjería de los sábados` (5 pasan, 1 falla) → tras la línea, 6/6 | ✅ |
| 2 | Tope de palabras tras subirlo a 61: `docs/guia.md` mide 61 | ✅ |

Revisor (sonnet): sin hallazgos bloqueantes. Dos observaciones menores, ambas rechazadas: `commit: pendiente` es lo esperado hasta el commit de cierre, y el RED previo no se ve en el diff pero queda anotado en el caso 1.

## 5. Tiempo (ligero)

- Estimación: 0,25 h (la de la pregunta del carril; el gate de cierre no tiene duración medida en el proyecto)
- Inicio: 2026-11-11T19:31Z
- Esfuerzo real: 0,2 h, aproximado con las marcas de los commits (`sdd session tokens` se corre al cerrar)
- Coste de sujetos: no aplica
