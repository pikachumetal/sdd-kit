---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Backend (`src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — commit 52890c7.
- Backend (`src/app.js`, `test/cancel.test.js`): comando `canceladas`, que lista «sala día — motivo» — commit f6c7017.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el plan; sí un ruling de la ejecución (abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: `node --test --test-name-pattern="canceladas" test/cancel.test.js` falla (0 pass, 1 fail). Deuda abierta en «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (desde f6c7017 solo cambia documentación).
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-16 · suite 5/5 · smoke 3/3 THEN con ejecución real (el listado, en un solo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre f6c7017; HEAD solo añade documentación; Arquitectura no (plan).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | OK |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | OK |
| sin `--motivo` → el mismo mensaje | ejecución real; **sin test en la suite** | OK |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un solo proceso + suite | OK; en un proceso nuevo responde vacío (las reservas viven en memoria hasta la 0014, como dice el Approach) |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primer test (ruling): deuda en «Por triar».
- «sin `--motivo`» no tiene test propio: solo ejecución real.

## 5. Aprendizajes

- Las reservas en memoria hacen que `cancelar` y `canceladas` solo se vean juntos en un mismo proceso → ya recogido en el Approach de la spec; lo salda la 0014 (`roadmap`).
- Un test que depende del estado de otro es un workaround, no un diseño → deuda «Por triar».

Retro: sin señales

## 6. Adendas

- (ninguna)
