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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (072198c).
- Comando `canceladas`: lista las reservas canceladas como `<sala> <día> — <motivo>`: `src/app.js`, `test/cancel.test.js` (693cea1).
- Capacidad nueva `bookings` creada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. En el cierre se corrigió `tasks.md`: la Task 1 apuntaba a 693cea1 y su commit es 072198c.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en lugar del `node --test` del plan, para esquivar una supuesta carrera sobre el almacén compartido en memoria — coste si está mal: la suite tarda el doble. **Desmentida en el cierre**: `node --test` pasa 5/5 sin ese flag. El motivo real es que el test `canceladas enseña sala, día y motivo` depende de la cancelación que hace el primer test. El cierre usó el gate del plan, `node --test`.

## 4. Verificación

### 4.1 Builds

- `node --test` sobre el código final (idéntico al del commit de cierre; el cierre solo toca `.docs/`): 5 tests, 5 pasan, 0 fallan. También 5/5 con `--test-concurrency=1`.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre, que solo añade documentación a ese código.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre 693cea1; Arquitectura no, por el plan. `HEAD` se movió con un commit de solo documentación (tasks.md, 17 líneas): re-revisión con sdd-kit:effort-high + opus, «needs fixes» con 2 Important y 1 Minor, todos sobre `tasks.md` y corregidos en el cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke con ejecución real de 4 de los 5 THEN, y el del listado solo dentro de un proceso (ver la fila) · revisión final Spec y Código sobre 693cea1, re-revisión del commit de documentación con hallazgos corregidos. Verificado por el agente; nadie lo ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) + suite | cumple |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, `--motivo "me aburro"`) + suite | cumple |
| Sin `--motivo` responde lo mismo | ejecución real (CLI) | cumple; **sin test en la suite** |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar | ejecución real solo en un proceso (`node -e` que importa `run`) + suite | cumple en un proceso; **por la CLI, en procesos separados, `canceladas` responde vacío** (el almacén vive en memoria por proceso) |

### 4.3 Residuales / deuda generada

- `canceladas` no ve lo cancelado en otra invocación de la CLI: lo cubre la fila 0014 «Motivo guardado» del roadmap, y 0012 «Informe de canceladas» depende de ello. Es un límite del producto, no de esta feature.
- Falta el test del escenario «sin `--motivo`» (fila en `debt.md`).
- El test del listado depende del orden de los tests (fila en `debt.md`).

## 5. Aprendizajes

- El almacén de reservas es un array en memoria dentro de `src/app.js` y se reinicia en cada ejecución de la CLI: cualquier comando que lea lo escrito por otro solo funciona dentro de un proceso → `debt.md` (fila «Por triar») y fila 0014 del roadmap; `architecture.md` no se toca porque ya lo cubre 0014.

Retro: documento o skill desmentido → corregido el ruling del gate en `tasks.md` y anotado aquí (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
