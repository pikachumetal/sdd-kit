---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva y lo devuelve en la respuesta — `d112274`.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas — `501fb0f`.
- `test/cancel.test.js`: los escenarios de cancelar con motivo, motivo fuera de la lista y el listado — `d112274`, `501fb0f`.

## 2. Tiempo y coste: estimado vs real

> Pendiente: lo completa `sdd-archive`.

## 3. Desviaciones del plan

- _Ninguna_ en las tasks.

### Decisiones tomadas sin el dev-lead

- Eje Arquitectura de la revisión final de no → sí — el diff añade el campo `reason` a la reserva (señal de datos) y la propia spec lo cuenta como señal — si sobra, una revisión opus de más sobre 19 líneas.

## 4. Verificación

> Pendiente: lo completa `sdd-archive` con el gate, el smoke y la revisión final.

## 5. Aprendizajes

> Pendiente.

## 6. Adendas
