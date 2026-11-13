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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo se valida contra la lista cerrada (cambio de planes, sala ocupada, otro) y se guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js` — f480c2c.
- `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 90db8e1.
- Script `cancelar` en `package.json` (`npm run cancelar -- <sala> <día> --motivo <motivo>`) — 095f7c3.
- Las reservas siguen en la memoria del proceso hasta la 0014: `canceladas` enseña lo cancelado en el mismo proceso.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` completo: 6/6 en verde, sobre 095f7c3.
- Gate: `node --test test/app.test.js` · `gate.json` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · <1 s · configuración: la del gate · sobre el commit de cierre (el cierre solo añade documentación a 095f7c3)
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia, sobre 90db8e1; re-revisión 90db8e1..095f7c3 (`package.json` y `tasks.md`), opus+high, limpia.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 6/6 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código sobre 90db8e1, re-revisión limpia sobre 095f7c3 · el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real | verificado por el agente (sin test en la suite) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: cada invocación de la CLI parte de memoria vacía) + suite | verificado por el agente |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2) → fila en `debt.md`.
- El THEN «sin `--motivo`» no tiene test en la suite → fila en `debt.md`.

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `capabilities/bookings.md`, por `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
