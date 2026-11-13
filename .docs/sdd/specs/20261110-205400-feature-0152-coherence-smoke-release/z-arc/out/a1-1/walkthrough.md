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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (817cfbb).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista `<sala> <día> — <motivo>` de las reservas con estado cancelada (03e4a53).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, mezclada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado: con `--test-name-pattern="canceladas"` falla, 0/1). Fila en «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el cierre solo toca `.docs/` y el código no se movió desde 03e4a53). Salida completa guardada en el scratchpad de la sesión.
- Sin `operations.md` §Testing: no hay gate declarado, `Gate:` no aplica.
- Revisión final: Spec (opus, high) y Código (sonnet, high), limpias, sobre 03e4a53; después de ella `HEAD` solo añadió `tasks.md` (documentación, sin re-revisión).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke con ejecución real de 4 de los 5 THEN (3 por la CLI, 1 solo dentro de un proceso) · el THEN del listado por la CLI en procesos separados no cumple (ver abajo) · revisión final Spec y Código limpias sobre 03e4a53

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) + suite | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista → «motivo no válido: …» | ejecución real (CLI, con `--motivo "me aburro"`) + suite | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` → lo mismo | ejecución real (CLI) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real solo en un mismo proceso (importando `run`) + suite; por la CLI en dos procesos: `no probado`, la salida es vacía | en proceso: `Norte lun — sala ocupada` · CLI, proceso aparte: _(vacía)_ |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: cada `node src/app.js …` arranca de cero, así que `canceladas` por la CLI no ve nunca lo cancelado en otra llamada, aunque el delta de la spec lo describe así. Lo cubre la fila 0014 «Motivo guardado» del roadmap (su brief dice «Salda: nada»); queda dicho aquí y en el mensaje final.
- Test de `canceladas` acoplado al orden de los tests (el ruling de arriba): fila en «Por triar».

## 5. Aprendizajes

- Cancelar con motivo cambia comportamiento observable → capacidad `bookings` (creada con el merge del delta; no existía `capabilities/`).
- Sin aprendizaje de convención, estructura ni herramientas: `constitution.md`, `architecture.md` y `operations.md` no cambian.

Retro: sin señales

## 6. Adendas

- (ninguna)
