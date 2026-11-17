---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-06
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro). Fuera de la lista, o sin `--motivo`, responde `motivo no válido: …` (`src/app.js`, `test/cancel.test.js`, commit `df400dd`).
- `canceladas` lista las reservas canceladas con su sala, su día y su motivo (`src/app.js`, `test/cancel.test.js`, commit `9604e61`).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- El plan fija el gate de cierre en `node --test`. La ejecución lo cambió a `node --test --test-concurrency=1` por una carrera que no existe (ver abajo). El cierre lo devuelve a `node --test`.

### Decisiones tomadas sin el dev-lead

- Task 2, gate con `--test-concurrency=1` para esquivar una carrera de tests sobre el almacén compartido — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Desmentido en el cierre:** `node --test` da 5/5 sin la flag y los dos ficheros de test corren en procesos separados. La decisión no se aplica.
- Cierre: corregí `tasks.md` (commit de la Task 1 `df400dd` en vez de `9604e61`; quité «(plan)» de «Arquitectura no») tras la re-revisión, y devolví el gate a `node --test`.
- Cierre: `canceladas` no se puede ver por CLI entre procesos (almacén en memoria). No lo arreglé: queda como deuda y la 0014 «Motivo guardado» del roadmap lo cubre.

ADR: ninguna candidata.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde (guardado en `.temp/sdd/out/suite.txt`), sobre el commit de cierre.
- Gate: `node --test` → 5/5 · sobre el commit de cierre.
- Revisión final: Spec (opus, effort high) y Código (sonnet, effort high) limpias sobre `9604e61`. Re-revisión del commit de `tasks.md` (opus, effort high): 1 Important y 2 Minor, todos de `tasks.md` y corregidos en el cierre. Sin segunda re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-06 · suite 5/5 · smoke con ejecución real de 4 THEN, uno solo en el mismo proceso · revisión final Spec y Código limpias sobre `9604e61` · re-revisión con 1 Important y 2 Minor corregidos.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar | ejecución real solo en el mismo proceso | mismo proceso: `Norte lun — sala ocupada`. Por CLI, en un proceso nuevo: salida vacía |

### 4.3 Residuales / deuda generada

- `canceladas` por CLI sale vacío: el almacén de reservas es en memoria y se pierde al acabar el proceso. Ya lo traía la base. Fila de deuda y relación con la 0014.
- `test/cancel.test.js` depende del orden: `canceladas enseña sala, día y motivo` solo pasa si antes corrió `cancelar con un motivo de la lista`. Fila de deuda.
- Sin `--motivo` no tiene test propio, aunque el código lo cumple. Va en la fila de deuda del orden de los tests.

## 5. Aprendizajes

- Una carrera entre tests se comprueba antes de registrarla como Ruling: `node --test` corre cada fichero en su proceso. → `tasks.md` de esta feature (corregido allí).
- Las capacidades de comportamiento viven solo en `capabilities/`. → `.docs/sdd/capabilities/bookings.md` (creada desde el delta de la spec).

Retro: documento o skill desmentido → corregido en el mismo documento: el Ruling del gate de `tasks.md` (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
