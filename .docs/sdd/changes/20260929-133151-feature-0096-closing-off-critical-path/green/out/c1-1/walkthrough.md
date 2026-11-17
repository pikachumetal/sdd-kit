---
id: 20260928-100000-feature-0015-order-summary
feature: 0015
title: Walkthrough — Resumen del pedido
spec: ./spec.md
plan: ./plan.md
status: draft
created: 2026-09-29
---

# Walkthrough — Resumen del pedido

> BORRADOR previo a la validación: faltan §2 (tiempo y coste), la revisión final y la validación del dev-lead.

## 1. Cambios realizados

- Datos: `summaryOf(order)` en `views.mjs` (9f55815).
- Ficha: tarjeta «Resumen» bajo la cabecera, estilo `.card` en `app.css` (26e4faf).
- Listado: total junto al cliente en cada fila (0661375) y su test (4c3666f).

## 3. Desviaciones del plan

### Decisiones tomadas sin el dev-lead

- Task 3 se commiteó sin test ni `task-start`; escribí el test del listado a posteriori (4c3666f), en rojo contra la fila anterior y verde con la actual — el RED no fue previo al código.
- La revisión final no se pudo despachar (hook de la campaña); queda pendiente.

## 4. Verificación

- `node --test` → 5/5 pass.
