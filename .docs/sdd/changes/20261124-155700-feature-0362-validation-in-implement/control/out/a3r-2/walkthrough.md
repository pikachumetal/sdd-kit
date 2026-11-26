---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de estar en la lista cerrada (cambio de planes, sala ocupada, otro) y se guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (5ce3d60).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista sala, día y motivo de las reservas canceladas del proceso (2907429).
- Capacidad nueva `bookings` (delta de la spec, fusionada en el cierre).
- Sin ADR candidatas en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: `node --test --test-name-pattern="canceladas" test/cancel.test.js` falla solo (salida vacía). Va a la deuda.

## 4. Verificación

### 4.1 Builds

- `node --test` sobre ff4460a → 5/6: los 5 tests de `app.test.js` y `cancel.test.js` en verde; `test/export.e2e.test.js` en rojo con «TimeoutError: export no respondió en 5000 ms». Contrastado en un worktree desnudo de `develop` (d234761): el mismo fichero falla igual, dos veces. Es la fila de deuda «`test/export.e2e.test.js` falla … también en `develop`» (revisión de la 0007); la rama no lo causa ni lo arregla.
- Gate: `node --test` → 5/6: corrió 6/6, un rojo que también falla sin la rama · sobre ff4460a (el cierre solo añade `.docs/`).
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 2907429; HEAD solo añade documentación desde entonces.

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde — **corregido en el cierre**: la suite no estaba en verde, `export.e2e` falla también en `develop` (ver 4.1); los THEN de la 0010 están verificados abajo, y el cierre los repitió.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite (`cancel.test.js`) · ejecución real (`node src/app.js …`) | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real con `--motivo "me aburro"` | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`); sin test | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real en un solo proceso (`run('cancelar')` y `run('canceladas')`); por CLI en procesos separados sale vacío, porque las reservas viven en memoria hasta la 0014 (límite que la spec ya declara) | verificado por el agente |

Lo reportado por el usuario: la validación en campo del 2026-10-26, sin detalle de qué probó.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (workaround de la Task 2) → fila en «Por triar» de `debt.md`.
- Sin test de feature para «sin `--motivo`»: solo ejecución real → misma fila.
- `export.e2e` en rojo también en `develop`: ya está en la deuda («Por triar», 2026-10-06); no se abre otra.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya lo dice la spec (§Approach) y la capacidad `bookings`; la 0014 lo cambia.
- Un test que depende de otro pasa en la suite y falla solo: comprobar cada test suelto antes de cerrar → fila de deuda (sin destino en `constitution.md` que lo pida).

Retro: documento o skill desmentido → la validación en campo del borrador decía «suite en verde» y `export.e2e` falla también en `develop`; corregida en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md`, 4.2)

## 6. Adendas

- (ninguna)
