---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (3c003fe).
- `canceladas`: lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js` (c84bd8c).
- Capacidad `bookings` creada con los dos requisitos ADDED (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 (sin filtro: cambia el build) · sobre 0d212da.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55346/health` → ok, levantado en esta sesión. La primera pasada del e2e dio 7/7 rojos por conexión rechazada porque el gate no levanta el entorno; con el entorno arriba pasó 7/7.
- E2E: 48 s de 0,5 min de Presupuesto E2E (lo pasa).

### 4.2 Smoke / tests

- Validado: _pendiente de la validación del dev-lead_

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» con `--motivo vacaciones` |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- Las reservas viven en la memoria del proceso hasta la 0014: por CLI, `cancelar` y `canceladas` en procesos distintos no comparten estado; el guion usa el servidor con `x-session`.

## 5. Aprendizajes

- El gate de cierre no levanta el entorno que el e2e necesita → `operations.md` («Entorno de la suite»): llevarlo al gate.

## 6. Adendas

- _Ninguna_
