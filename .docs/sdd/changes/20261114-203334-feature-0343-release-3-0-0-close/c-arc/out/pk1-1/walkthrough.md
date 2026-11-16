---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, a1c067a): el motivo debe ser de la lista cerrada (cambio de planes, sala ocupada, otro); se guarda con la reserva cancelada. Sin `--motivo` o fuera de la lista responde «motivo no válido: …».
- `canceladas` (`src/app.js`, 2b7910f): lista las reservas canceladas como «sala día — motivo».
- Tests en `test/cancel.test.js` (a1c067a, 2b7910f).
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado al cierre: corriendo solo, `canceladas` devuelve `''`). Fila en «Por triar» de `debt.md`.
- Spec sin review de spec (dos señales: MODIFIED, datos), anotada en «Decisiones que he tomado yo» de la spec.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el código no cambia desde 2b7910f).
- Gate: `node --test` → suite completa: corrió 5/5 · sobre el commit de cierre. El proyecto no declara `operations.md` ni «Suites».
- Revisión final: Spec (opus+high) limpia · Código (sonnet+high) limpia · Arquitectura no (plan), sobre 2b7910f; `HEAD` solo añadió `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 2b7910f. Lo no ejecutado por la suite sola: `canceladas` aislado falla (ver 3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (la suite no lo cubre) | ok |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real en un solo proceso (las reservas viven en memoria; cada `node src/app.js` es un proceso nuevo) + suite | ok |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden (ruling de la Task 2) → `debt.md`, «Por triar».
- Las reservas viven en memoria: `canceladas` solo enseña lo cancelado en el mismo proceso hasta la 0014 (ya en la spec y el roadmap).

## 5. Aprendizajes

- Cancelar y listar canceladas son comportamiento observable → capacidad `bookings` (`.docs/sdd/capabilities/bookings.md`).
- Sin aprendizajes de convención, estructura ni versiones.

Retro: sin señales

## 6. Adendas

- _Ninguna_.
