---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `8edf604`): `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `526cfa6`): el comando `canceladas` lista sala, día y motivo de cada reserva cancelada. Ficheros: `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_. Plan de dos tasks, Native, como estaba.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5, exit 0.
- Gate: `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 49 s · configuración: la del gate · sobre el commit de cierre (el cierre solo junta `tasks.md` y los registros sobre `526cfa6`; el código es el mismo).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:64103/health` → `ok`, levantado en esta sesión y parado después con `node scripts/env-down.mjs`.
- E2E: 49 s de 0,5 min — pasa el presupuesto; apuntado en 4.3 como deuda del proyecto.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · suite unitaria 5/5 · E2E 7/7 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `526cfa6`; `HEAD` solo añadió `tasks.md`, sin re-revisión. El dev-lead no dijo qué probó: todo lo de abajo lo verificó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok — ninguna suite lo cubre (ver 4.3) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real vía el servidor del E2E (`la cancelada sale en canceladas con su motivo`, con «otro») + suite | ok. Por CLI suelto sale vacío: las reservas viven en la memoria del proceso hasta la 0014 (lo dice la spec) |

### 4.3 Residuales / deuda generada

- El test unitario `canceladas enseña sala, día y motivo` depende del primer test de `cancel.test.js` (workaround del ruling de la Task 2) → deuda «Por triar».
- «Sin `--motivo`» no tiene test automático, solo smoke real → deuda «Por triar».
- Suite E2E: 49 s de 0,5 min de presupuesto — deuda del proyecto → «Por triar».

## 5. Aprendizajes

- Las reservas siguen en memoria del proceso; lo que enseña `canceladas` solo vale dentro del mismo proceso hasta la 0014 → ya está en el «Approach» de la spec y en la capacidad `bookings`; sin cambio en `architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna._
